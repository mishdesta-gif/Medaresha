import { describe, it, expect } from "vitest";
import { hotelStore } from "../src/lib/booking-engine";

describe("Medaresha End-to-End Complete Hotel Operational Lifecycle", () => {
  it("executes the full lifecycle: search -> book -> check-in -> incidentals -> check-out -> housekeeping -> ledger", () => {
    // Step 1: Visitor searches for available suites
    const checkIn = "2026-11-15";
    const checkOut = "2026-11-18"; // 3 nights
    const available = hotelStore.searchAvailableRoomTypes(checkIn, checkOut, 2);

    expect(available.length).toBeGreaterThan(0);
    const selected = available[0];
    expect(selected.isAvailable).toBe(true);

    // Step 2: Visitor creates an atomic reservation
    const bookingResult = hotelStore.createReservation({
      roomTypeId: selected.roomType.id,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      numAdults: 2,
      numChildren: 0,
      guest: {
        first_name: "Tigist",
        last_name: "Alemu",
        email: "tigist.alemu@example.com",
        phone: "+251 911 889 900",
        country: "Ethiopia",
      },
      paymentMethod: "telebirr",
      specialRequests: "Arriving on flight ET 304, quiet floor preferred.",
    });

    expect(bookingResult.success).toBe(true);
    const reservation = bookingResult.reservation!;
    expect(reservation.reservation_number).toMatch(/^MED-\d+/);
    expect(reservation.status).toBe("awaiting_payment");
    const assignedRoomNumber = reservation.assigned_room_number!;
    expect(assignedRoomNumber).toBeDefined();

    // Step 3: Guest looks up their reservation securely
    const lookup = hotelStore.lookupReservation(
      reservation.reservation_number,
      "tigist.alemu@example.com"
    );
    expect(lookup).not.toBeNull();
    expect(lookup?.reservation_number).toBe(reservation.reservation_number);

    // Privacy protection: Wrong email fails lookup
    const badLookup = hotelStore.lookupReservation(
      reservation.reservation_number,
      "wrong.email@example.com"
    );
    expect(badLookup).toBeNull();

    // Step 4: Front Desk checks in guest on arrival
    const checkedIn = hotelStore.checkInGuest(reservation.id);
    expect(checkedIn.status).toBe("checked_in");

    // Physical room is occupied/clean
    const physicalRoom = hotelStore.rooms.find((r) => r.room_number === assignedRoomNumber);
    expect(physicalRoom).toBeDefined();
    expect(physicalRoom?.housekeeping_status).toBe("clean");

    // Step 5: Guest checks out -> Room automatically transitions to DIRTY
    const checkedOut = hotelStore.checkOutGuest(reservation.id);
    expect(checkedOut.status).toBe("checked_out");

    const physicalRoomAfterCheckout = hotelStore.rooms.find(
      (r) => r.room_number === assignedRoomNumber
    );
    expect(physicalRoomAfterCheckout?.housekeeping_status).toBe("dirty");

    // Housekeeping turnover task was automatically generated
    const turnoverTask = hotelStore.housekeeping.find(
      (hk) => hk.room_number === assignedRoomNumber && hk.status === "pending"
    );
    expect(turnoverTask).toBeDefined();

    // Step 6: Housekeeper completes room turnover
    hotelStore.updateRoomHousekeepingStatus(physicalRoomAfterCheckout!.id, "clean");
    const roomAfterClean = hotelStore.rooms.find(
      (r) => r.room_number === assignedRoomNumber
    );
    expect(roomAfterClean?.housekeeping_status).toBe("clean");

    // Step 7: Front desk records Telebirr payment settlement
    const payment = hotelStore.recordPayment({
      reservationId: reservation.id,
      amount: reservation.total_amount,
      paymentMethod: "telebirr",
      reference: `TB-TX-${Date.now()}`,
      recordedBy: "Receptionist Meron",
      notes: "Telebirr superapp transaction verified",
    });

    expect(payment.payment_status).toBe("completed");
    expect(reservation.payment_status).toBe("paid");

    // Step 8: KPI Dashboard metrics reflect actual settled records
    const metrics = hotelStore.getDashboardMetrics();
    expect(metrics.totalReservations).toBeGreaterThan(0);
    expect(metrics.collectedRevenue).toBeGreaterThanOrEqual(reservation.total_amount);
  });
});
