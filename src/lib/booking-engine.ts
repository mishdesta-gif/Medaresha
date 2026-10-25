import {
  INITIAL_PROPERTY,
  INITIAL_PROPERTY_SETTINGS,
  INITIAL_ROOM_TYPES,
  INITIAL_ROOMS,
  INITIAL_RESERVATIONS,
  INITIAL_PAYMENTS,
  INITIAL_HOUSEKEEPING,
  INITIAL_MAINTENANCE,
  INITIAL_INVENTORY,
} from "../data/mock-database";
import {
  Reservation,
  RoomType,
  Room,
  Payment,
  HousekeepingStatus,
  DashboardMetrics,
  Guest,
} from "./types";
import { calculateReservationPrice } from "./pricing";
import { calculateNights, generateReservationNumber } from "./utils";

// In-memory persistent state store for active runtime operations
class MedareshaStore {
  property = { ...INITIAL_PROPERTY };
  settings = { ...INITIAL_PROPERTY_SETTINGS };
  roomTypes: RoomType[] = [...INITIAL_ROOM_TYPES];
  rooms: Room[] = [...INITIAL_ROOMS];
  reservations: Reservation[] = [...INITIAL_RESERVATIONS];
  payments: Payment[] = [...INITIAL_PAYMENTS];
  housekeeping = [...INITIAL_HOUSEKEEPING];
  maintenance = [...INITIAL_MAINTENANCE];
  inventory = [...INITIAL_INVENTORY];

  /**
   * Helper: Check if two date intervals [startA, endA) and [startB, endB) overlap
   * Start is inclusive, End is exclusive
   */
  private datesOverlap(
    startA: string,
    endA: string,
    startB: string,
    endB: string
  ): boolean {
    const sA = new Date(startA).getTime();
    const eA = new Date(endA).getTime();
    const sB = new Date(startB).getTime();
    const eB = new Date(endB).getTime();

    return sA < eB && sB < eA;
  }

  /**
   * Check physical room availability between checkIn and checkOut
   */
  isRoomAvailable(roomId: string, checkIn: string, checkOut: string): boolean {
    // 1. Check active reservations allocating this physical room
    const blockingStatuses = ["pending", "awaiting_payment", "confirmed", "checked_in"];
    const hasConflictingBooking = this.reservations.some(
      (res) =>
        res.assigned_room_number !== undefined &&
        blockingStatuses.includes(res.status) &&
        this.rooms.find((r) => r.id === roomId)?.room_number === res.assigned_room_number &&
        this.datesOverlap(res.check_in_date, res.check_out_date, checkIn, checkOut)
    );

    if (hasConflictingBooking) return false;

    // 2. Check maintenance blocks
    const hasMaintenanceBlock = this.maintenance.some(
      (m) =>
        m.room_id === roomId &&
        m.blocks_room &&
        m.status !== "resolved" &&
        m.status !== "closed"
    );

    if (hasMaintenanceBlock) return false;

    return true;
  }

  /**
   * Check availability count for an entire room category
   */
  getRoomTypeAvailability(roomTypeId: string, checkIn: string, checkOut: string) {
    const matchingRooms = this.rooms.filter(
      (r) => r.room_type_id === roomTypeId && r.is_active
    );

    const availableRooms = matchingRooms.filter((r) =>
      this.isRoomAvailable(r.id, checkIn, checkOut)
    );

    return {
      totalRooms: matchingRooms.length,
      availableCount: availableRooms.length,
      availableRooms,
      isAvailable: availableRooms.length > 0,
    };
  }

  /**
   * Search available room categories for given dates and guest count
   */
  searchAvailableRoomTypes(checkIn: string, checkOut: string, numGuests: number = 1) {
    return this.roomTypes
      .filter((rt) => rt.is_active && rt.max_occupancy >= numGuests)
      .map((rt) => {
        const availability = this.getRoomTypeAvailability(rt.id, checkIn, checkOut);
        return {
          roomType: rt,
          ...availability,
        };
      });
  }

  /**
   * Atomic Reservation Creation
   * Prevents double booking and enforces idempotency
   */
  createReservation(params: {
    roomTypeId: string;
    checkInDate: string;
    checkOutDate: string;
    numAdults: number;
    numChildren: number;
    guest: Omit<Guest, "id" | "property_id">;
    paymentMethod: string;
    idempotencyKey?: string;
    specialRequests?: string;
  }): { success: boolean; reservation?: Reservation; error?: string } {
    const {
      roomTypeId,
      checkInDate,
      checkOutDate,
      numAdults,
      numChildren,
      guest,
      paymentMethod,
      idempotencyKey,
      specialRequests,
    } = params;

    // 1. Idempotency Guard: prevent duplicate booking if submitted twice
    if (idempotencyKey) {
      const existing = this.reservations.find((r) => r.idempotency_key === idempotencyKey);
      if (existing) {
        return { success: true, reservation: existing };
      }
    }

    // 2. Validate Dates
    const nights = calculateNights(checkInDate, checkOutDate);
    if (nights <= 0) {
      return { success: false, error: "Check-out date must be strictly after check-in date." };
    }

    // 3. Find Room Type
    const roomType = this.roomTypes.find((rt) => rt.id === roomTypeId);
    if (!roomType) {
      return { success: false, error: "Room category not found." };
    }

    if (numAdults + numChildren > roomType.max_occupancy) {
      return {
        success: false,
        error: `Selected room capacity exceeded. Max occupancy is ${roomType.max_occupancy} guests.`,
      };
    }

    // 4. Double Booking Lock: Find available physical room
    const { availableRooms, isAvailable } = this.getRoomTypeAvailability(
      roomTypeId,
      checkInDate,
      checkOutDate
    );

    if (!isAvailable || availableRooms.length === 0) {
      return {
        success: false,
        error: "All rooms in this category are fully booked for the selected dates.",
      };
    }

    // Allocate the first available physical room
    const allocatedRoom = availableRooms[0];

    // 5. Authoritative Price Calculation
    const pricing = calculateReservationPrice({
      checkInDate,
      checkOutDate,
      basePricePerNight: roomType.base_price_per_night,
      numAdults,
      maxStandardAdults: roomType.max_adults,
      extraPersonFee: roomType.extra_person_fee,
      serviceChargeRate: this.settings.service_charge_percentage / 100,
      vatRate: this.settings.vat_percentage / 100,
      currency: this.property.currency,
    });

    const reservationNumber = generateReservationNumber();
    const guestId = `g-${Date.now()}`;
    const reservationId = `res-${Date.now()}`;

    const newReservation: Reservation = {
      id: reservationId,
      property_id: this.property.id,
      reservation_number: reservationNumber,
      guest_id: guestId,
      guest: {
        id: guestId,
        property_id: this.property.id,
        ...guest,
      },
      check_in_date: checkInDate,
      check_out_date: checkOutDate,
      num_adults: numAdults,
      num_children: numChildren,
      status: paymentMethod === "cash" ? "confirmed" : "awaiting_payment",
      payment_status: paymentMethod === "cash" ? "unpaid" : "unpaid",
      subtotal_amount: pricing.roomSubtotal + pricing.extraGuestsCharge,
      service_charge_amount: pricing.serviceCharge,
      vat_amount: pricing.vat,
      total_amount: pricing.total,
      currency: this.property.currency,
      assigned_room_number: allocatedRoom.room_number,
      room_type_name: roomType.name,
      special_requests: specialRequests,
      idempotency_key: idempotencyKey,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.reservations.unshift(newReservation);

    return { success: true, reservation: newReservation };
  }

  /**
   * Secure Guest Lookup: requires reservation number AND (email OR phone)
   */
  lookupReservation(reservationNumber: string, emailOrPhone: string): Reservation | null {
    const cleanNumber = reservationNumber.trim().toUpperCase();
    const cleanContact = emailOrPhone.trim().toLowerCase();

    const reservation = this.reservations.find(
      (r) => r.reservation_number.toUpperCase() === cleanNumber
    );

    if (!reservation || !reservation.guest) return null;

    const emailMatch = reservation.guest.email.toLowerCase() === cleanContact;
    const phoneMatch = reservation.guest.phone.replace(/\s+/g, "") === cleanContact.replace(/\s+/g, "");

    if (emailMatch || phoneMatch) {
      return reservation;
    }

    return null;
  }

  /**
   * Reception: Check-in Guest
   */
  checkInGuest(reservationId: string) {
    const res = this.reservations.find((r) => r.id === reservationId);
    if (!res) throw new Error("Reservation not found.");

    if (res.status === "cancelled") {
      throw new Error("Cannot check in a cancelled reservation.");
    }

    res.status = "checked_in";
    res.updated_at = new Date().toISOString();

    // Mark room as occupied/clean
    if (res.assigned_room_number) {
      const room = this.rooms.find((r) => r.room_number === res.assigned_room_number);
      if (room) {
        room.housekeeping_status = "clean";
      }
    }

    return res;
  }

  /**
   * Reception: Check-out Guest
   * Automatically marks the physical room as DIRTY for Housekeeping
   */
  checkOutGuest(reservationId: string) {
    const res = this.reservations.find((r) => r.id === reservationId);
    if (!res) throw new Error("Reservation not found.");

    res.status = "checked_out";
    res.updated_at = new Date().toISOString();

    // Automatically trigger Housekeeping dirty status
    if (res.assigned_room_number) {
      const room = this.rooms.find((r) => r.room_number === res.assigned_room_number);
      if (room) {
        room.housekeeping_status = "dirty";

        // Create or update housekeeping cleaning task
        this.housekeeping.push({
          id: `hk-${Date.now()}`,
          property_id: this.property.id,
          room_id: room.id,
          room_number: room.room_number,
          priority: "high",
          status: "pending",
          scheduled_date: new Date().toISOString().split("T")[0],
          notes: `Post-checkout turnover for Guest ${res.guest?.first_name} ${res.guest?.last_name}`,
        });
      }
    }

    return res;
  }

  /**
   * Update Housekeeping Status
   */
  updateRoomHousekeepingStatus(roomId: string, newStatus: HousekeepingStatus) {
    const room = this.rooms.find((r) => r.id === roomId);
    if (!room) throw new Error("Room not found.");

    room.housekeeping_status = newStatus;
    return room;
  }

  /**
   * Record a financial transaction
   */
  recordPayment(params: {
    reservationId: string;
    amount: number;
    paymentMethod: any;
    reference: string;
    recordedBy: string;
    notes?: string;
  }): Payment {
    const res = this.reservations.find((r) => r.id === params.reservationId);
    if (!res) throw new Error("Reservation not found.");

    const payment: Payment = {
      id: `pay-${Date.now()}`,
      property_id: this.property.id,
      reservation_id: res.id,
      transaction_reference: params.reference,
      amount: params.amount,
      currency: this.property.currency,
      payment_method: params.paymentMethod,
      payment_status: "completed",
      recorded_by: params.recordedBy,
      notes: params.notes,
      created_at: new Date().toISOString(),
    };

    this.payments.push(payment);

    // Update reservation payment status
    const totalPaid = this.payments
      .filter((p) => p.reservation_id === res.id && p.payment_status === "completed")
      .reduce((sum, p) => sum + p.amount, 0);

    if (totalPaid >= res.total_amount) {
      res.payment_status = "paid";
      if (res.status === "awaiting_payment") {
        res.status = "confirmed";
      }
    } else if (totalPaid > 0) {
      res.payment_status = "partially_paid";
    }

    res.updated_at = new Date().toISOString();
    return payment;
  }

  /**
   * Calculate live KPI Dashboard metrics strictly from authoritative records
   */
  getDashboardMetrics(): DashboardMetrics {
    const today = new Date().toISOString().split("T")[0];

    const totalReservations = this.reservations.length;
    const confirmedReservations = this.reservations.filter((r) => r.status === "confirmed").length;
    const pendingReservations = this.reservations.filter(
      (r) => r.status === "pending" || r.status === "awaiting_payment"
    ).length;
    const cancelledReservations = this.reservations.filter((r) => r.status === "cancelled").length;

    const occupiedRooms = this.reservations.filter(
      (r) => r.status === "checked_in"
    ).length;

    const totalRooms = this.rooms.length;
    const occupancyRatePercentage = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

    const collectedRevenue = this.payments
      .filter((p) => p.payment_status === "completed")
      .reduce((sum, p) => sum + p.amount, 0);

    const totalBookingValue = this.reservations
      .filter((r) => r.status !== "cancelled")
      .reduce((sum, r) => sum + r.total_amount, 0);

    const outstandingBalance = Math.max(0, totalBookingValue - collectedRevenue);

    const todayArrivalsCount = this.reservations.filter(
      (r) => r.check_in_date === today && (r.status === "confirmed" || r.status === "awaiting_payment")
    ).length;

    const todayDeparturesCount = this.reservations.filter(
      (r) => r.check_out_date === today && r.status === "checked_in"
    ).length;

    return {
      totalReservations,
      confirmedReservations,
      pendingReservations,
      cancelledReservations,
      occupiedRooms,
      totalRooms,
      occupancyRatePercentage,
      collectedRevenue,
      outstandingBalance,
      todayArrivalsCount,
      todayDeparturesCount,
      currency: this.property.currency,
    };
  }
}

// Export singleton instance
export const hotelStore = new MedareshaStore();
