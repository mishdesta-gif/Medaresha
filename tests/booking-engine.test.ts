import { describe, it, expect, beforeEach } from "vitest";
import { calculateNights } from "../src/lib/utils";
import { calculateReservationPrice } from "../src/lib/pricing";
import { hotelStore } from "../src/lib/booking-engine";

describe("Medaresha Booking Engine & Business Logic", () => {
  describe("1. Date Arithmetic & Stay Length", () => {
    it("calculates stay duration correctly (check-in inclusive, check-out exclusive)", () => {
      const nights = calculateNights("2026-10-25", "2026-10-28");
      expect(nights).toBe(3);
    });

    it("prevents same-day overnight stays (0 nights)", () => {
      const nights = calculateNights("2026-10-25", "2026-10-25");
      expect(nights).toBe(0);
    });

    it("handles invalid inverted dates safely by returning 0", () => {
      const nights = calculateNights("2026-10-28", "2026-10-25");
      expect(nights).toBe(0);
    });
  });

  describe("2. Authoritative Pricing Engine & Tax Calculation", () => {
    it("calculates exact room charges, 10% Service Charge, and 15% VAT", () => {
      const quote = calculateReservationPrice({
        checkInDate: "2026-11-01",
        checkOutDate: "2026-11-04", // 3 nights
        basePricePerNight: 10000,
        numAdults: 2,
        serviceChargeRate: 0.10,
        vatRate: 0.15,
      });

      // 3 nights * 10,000 = 30,000 ETB
      expect(quote.nights).toBe(3);
      expect(quote.roomSubtotal).toBe(30000);

      // Service charge = 10% of 30,000 = 3,000 ETB
      expect(quote.serviceCharge).toBe(3000);

      // VAT = 15% of (30,000 + 3,000 = 33,000) = 4,950 ETB
      expect(quote.vat).toBe(4950);

      // Total = 30,000 + 3,000 + 4,950 = 37,950 ETB
      expect(quote.total).toBe(37950);
      expect(quote.currency).toBe("ETB");
    });

    it("throws error if check-out date is not after check-in date", () => {
      expect(() =>
        calculateReservationPrice({
          checkInDate: "2026-11-04",
          checkOutDate: "2026-11-01",
          basePricePerNight: 10000,
          numAdults: 2,
        })
      ).toThrow("Invalid stay duration");
    });
  });

  describe("3. Concurrency & Double-Booking Shield", () => {
    it("allocates available room and decrements category inventory atomically", () => {
      const presidential = hotelStore.roomTypes[0]; // 2 physical rooms (501, 502)
      
      const checkIn = "2026-12-01";
      const checkOut = "2026-12-05";

      const res1 = hotelStore.createReservation({
        roomTypeId: presidential.id,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        numAdults: 2,
        numChildren: 0,
        guest: {
          first_name: "Test",
          last_name: "Guest1",
          email: "test1@example.com",
          phone: "+251911000001",
          country: "Ethiopia",
        },
        paymentMethod: "cash",
      });

      expect(res1.success).toBe(true);
      expect(res1.reservation?.assigned_room_number).toBeDefined();

      const res2 = hotelStore.createReservation({
        roomTypeId: presidential.id,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        numAdults: 2,
        numChildren: 0,
        guest: {
          first_name: "Test",
          last_name: "Guest2",
          email: "test2@example.com",
          phone: "+251911000002",
          country: "Ethiopia",
        },
        paymentMethod: "cash",
      });

      expect(res2.success).toBe(true);
      expect(res2.reservation?.assigned_room_number).toBeDefined();
      expect(res1.reservation?.assigned_room_number).not.toBe(
        res2.reservation?.assigned_room_number
      );

      // Now both suites 501 and 502 are booked for [2026-12-01, 2026-12-05).
      // Third concurrent request MUST be rejected (sold out)!
      const res3 = hotelStore.createReservation({
        roomTypeId: presidential.id,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        numAdults: 2,
        numChildren: 0,
        guest: {
          first_name: "Test",
          last_name: "Guest3",
          email: "test3@example.com",
          phone: "+251911000003",
          country: "Ethiopia",
        },
        paymentMethod: "cash",
      });

      expect(res3.success).toBe(false);
      expect(res3.error).toContain("fully booked");
    });

    it("respects exclusive check-out boundary: another guest may check in on the day of departure", () => {
      const presidential = hotelStore.roomTypes[0];

      // Stay from 2026-12-05 to 2026-12-08 should be available immediately as previous stay departs on 2026-12-05
      const availability = hotelStore.getRoomTypeAvailability(
        presidential.id,
        "2026-12-05",
        "2026-12-08"
      );
      expect(availability.isAvailable).toBe(true);
    });
  });

  describe("4. Idempotency & Replay Protection", () => {
    it("returns existing reservation when submitted with identical idempotency key", () => {
      const key = "idemp-unique-token-9988";
      const roomType = hotelStore.roomTypes[1];

      const firstCall = hotelStore.createReservation({
        roomTypeId: roomType.id,
        checkInDate: "2026-12-10",
        checkOutDate: "2026-12-12",
        numAdults: 2,
        numChildren: 0,
        guest: {
          first_name: "Idemp",
          last_name: "Test",
          email: "idemp@example.com",
          phone: "+251911999999",
          country: "Ethiopia",
        },
        paymentMethod: "telebirr",
        idempotencyKey: key,
      });

      expect(firstCall.success).toBe(true);

      const duplicateCall = hotelStore.createReservation({
        roomTypeId: roomType.id,
        checkInDate: "2026-12-10",
        checkOutDate: "2026-12-12",
        numAdults: 2,
        numChildren: 0,
        guest: {
          first_name: "Idemp",
          last_name: "Test",
          email: "idemp@example.com",
          phone: "+251911999999",
          country: "Ethiopia",
        },
        paymentMethod: "telebirr",
        idempotencyKey: key,
      });

      expect(duplicateCall.success).toBe(true);
      expect(duplicateCall.reservation?.id).toBe(firstCall.reservation?.id);
      expect(duplicateCall.reservation?.reservation_number).toBe(
        firstCall.reservation?.reservation_number
      );
    });
  });

  describe("5. Reception & Housekeeping Handoff", () => {
    it("automatically marks physical room DIRTY upon guest check-out", () => {
      const res = hotelStore.reservations.find((r) => r.status === "checked_in");
      expect(res).toBeDefined();

      if (res && res.assigned_room_number) {
        const roomBefore = hotelStore.rooms.find((r) => r.room_number === res.assigned_room_number);
        expect(roomBefore).toBeDefined();

        hotelStore.checkOutGuest(res.id);

        const roomAfter = hotelStore.rooms.find((r) => r.room_number === res.assigned_room_number);
        expect(roomAfter?.housekeeping_status).toBe("dirty");
      }
    });
  });
});
