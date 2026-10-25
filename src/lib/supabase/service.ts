// ==============================================================================
// MEDARESHA HOTEL — SUPABASE LIVE DATABASE SERVICE LAYER
// Typed queries and server actions for Supabase PostgreSQL
// ==============================================================================

import { createBrowserSupabaseClient, isSupabaseConfigured } from "./client";
import { createServerSupabaseClient } from "./server";
import {
  Property,
  RoomType,
  Room,
  Reservation,
  Payment,
  DashboardMetrics,
  Guest,
} from "../types";
import { calculateReservationPrice } from "../pricing";
import { generateReservationNumber } from "../utils";

/**
 * Fetch the active primary hotel property configuration
 */
export async function getProperty(propertyId?: string): Promise<Property | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = createServerSupabaseClient();
  const targetId = propertyId || process.env.NEXT_PUBLIC_DEFAULT_PROPERTY_ID || "00000000-0000-0000-0000-000000000001";

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", targetId)
    .single();

  if (error) {
    console.error("Supabase getProperty error:", error.message);
    return null;
  }

  return data as Property;
}

/**
 * Fetch all active room categories with cover images and amenities
 */
export async function getRoomTypes(propertyId?: string): Promise<RoomType[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = createServerSupabaseClient();
  const targetId = propertyId || process.env.NEXT_PUBLIC_DEFAULT_PROPERTY_ID || "00000000-0000-0000-0000-000000000001";

  const { data, error } = await supabase
    .from("room_types")
    .select(`
      *,
      images:room_images(*),
      room_type_amenities(
        amenity:amenities(*)
      )
    `)
    .eq("property_id", targetId)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Supabase getRoomTypes error:", error.message);
    return [];
  }

  // Normalize amenities structure
  return (data || []).map((rt: any) => ({
    ...rt,
    amenities: rt.room_type_amenities?.map((rta: any) => rta.amenity).filter(Boolean) || [],
  })) as RoomType[];
}

/**
 * Fetch single room category by slug
 */
export async function getRoomTypeBySlug(slug: string, propertyId?: string): Promise<RoomType | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = createServerSupabaseClient();
  const targetId = propertyId || process.env.NEXT_PUBLIC_DEFAULT_PROPERTY_ID || "00000000-0000-0000-0000-000000000001";

  const { data, error } = await supabase
    .from("room_types")
    .select(`
      *,
      images:room_images(*),
      room_type_amenities(
        amenity:amenities(*)
      )
    `)
    .eq("property_id", targetId)
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Supabase getRoomTypeBySlug error:", error.message);
    return null;
  }

  return {
    ...data,
    amenities: data.room_type_amenities?.map((rta: any) => rta.amenity).filter(Boolean) || [],
  } as RoomType;
}

/**
 * Check real database room availability for date range
 */
export async function checkDatabaseAvailability(params: {
  checkIn: string;
  checkOut: string;
  numGuests?: number;
  propertyId?: string;
}) {
  if (!isSupabaseConfigured()) return [];

  const supabase = createServerSupabaseClient();
  const targetId = params.propertyId || process.env.NEXT_PUBLIC_DEFAULT_PROPERTY_ID || "00000000-0000-0000-0000-000000000001";
  const numGuests = params.numGuests || 1;

  // 1. Get all room types
  const roomTypes = await getRoomTypes(targetId);

  // 2. Query conflicting reservations
  const blockingStatuses = ["pending", "awaiting_payment", "confirmed", "checked_in"];
  const { data: conflictingRooms } = await supabase
    .from("reservation_rooms")
    .select(`
      room_id,
      reservation:reservations!inner(status)
    `)
    .in("reservation.status", blockingStatuses)
    .overlaps("stay_range", `[${params.checkIn}, ${params.checkOut})`);

  const bookedRoomIds = new Set((conflictingRooms || []).map((r: any) => r.room_id).filter(Boolean));

  // 3. Query maintenance blocks
  const { data: maintenanceBlocks } = await supabase
    .from("room_blocks")
    .select("room_id")
    .eq("property_id", targetId)
    .lte("start_date", params.checkOut)
    .gte("end_date", params.checkIn);

  const blockedRoomIds = new Set((maintenanceBlocks || []).map((b: any) => b.room_id).filter(Boolean));

  // 4. Query physical rooms
  const { data: allRooms } = await supabase
    .from("rooms")
    .select("*")
    .eq("property_id", targetId)
    .eq("is_active", true);

  return roomTypes
    .filter((rt) => rt.max_occupancy >= numGuests)
    .map((rt) => {
      const categoryRooms = (allRooms || []).filter((r) => r.room_type_id === rt.id);
      const availableRooms = categoryRooms.filter(
        (r) => !bookedRoomIds.has(r.id) && !blockedRoomIds.has(r.id)
      );

      return {
        roomType: rt,
        totalRooms: categoryRooms.length,
        availableCount: availableRooms.length,
        availableRooms,
        isAvailable: availableRooms.length > 0,
      };
    });
}

/**
 * Server-Side Atomic Reservation Creation in Supabase
 * Enforces idempotency and triggers PostgreSQL exclusion constraints
 */
export async function createDatabaseReservation(params: {
  roomTypeId: string;
  checkInDate: string;
  checkOutDate: string;
  numAdults: number;
  numChildren: number;
  guest: Omit<Guest, "id" | "property_id">;
  paymentMethod: string;
  idempotencyKey?: string;
  specialRequests?: string;
  propertyId?: string;
}): Promise<{ success: boolean; reservation?: Reservation; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase credentials are not configured in .env.local" };
  }

  const supabase = createServerSupabaseClient();
  const targetPropertyId = params.propertyId || process.env.NEXT_PUBLIC_DEFAULT_PROPERTY_ID || "00000000-0000-0000-0000-000000000001";

  // 1. Idempotency Check
  if (params.idempotencyKey) {
    const { data: existing } = await supabase
      .from("reservations")
      .select("*, guest:guests(*)")
      .eq("idempotency_key", params.idempotencyKey)
      .maybeSingle();

    if (existing) {
      return { success: true, reservation: existing as Reservation };
    }
  }

  // 2. Room Type & Pricing
  const { data: roomType, error: rtError } = await supabase
    .from("room_types")
    .select("*")
    .eq("id", params.roomTypeId)
    .single();

  if (rtError || !roomType) {
    return { success: false, error: "Room category not found." };
  }

  const { data: settings } = await supabase
    .from("property_settings")
    .select("*")
    .eq("property_id", targetPropertyId)
    .single();

  const pricing = calculateReservationPrice({
    checkInDate: params.checkInDate,
    checkOutDate: params.checkOutDate,
    basePricePerNight: roomType.base_price_per_night,
    numAdults: params.numAdults,
    maxStandardAdults: roomType.max_adults,
    extraPersonFee: roomType.extra_person_fee,
    serviceChargeRate: (settings?.service_charge_percentage || 10) / 100,
    vatRate: (settings?.vat_percentage || 15) / 100,
  });

  // 3. Find Available Physical Room
  const availability = await checkDatabaseAvailability({
    checkIn: params.checkInDate,
    checkOut: params.checkOutDate,
    propertyId: targetPropertyId,
  });

  const categoryResult = availability.find((a) => a.roomType.id === params.roomTypeId);
  if (!categoryResult || categoryResult.availableRooms.length === 0) {
    return { success: false, error: "All suites in this category are fully booked for the selected dates." };
  }

  const allocatedRoom = categoryResult.availableRooms[0];
  const reservationNumber = generateReservationNumber();

  // 4. Create or Find Guest Profile
  let guestId: string;
  const { data: existingGuest } = await supabase
    .from("guests")
    .select("id")
    .eq("property_id", targetPropertyId)
    .eq("email", params.guest.email)
    .maybeSingle();

  if (existingGuest) {
    guestId = existingGuest.id;
  } else {
    const { data: newGuest, error: guestError } = await supabase
      .from("guests")
      .insert({
        property_id: targetPropertyId,
        first_name: params.guest.first_name,
        last_name: params.guest.last_name,
        email: params.guest.email,
        phone: params.guest.phone,
        country: params.guest.country || "Ethiopia",
      })
      .select("id")
      .single();

    if (guestError || !newGuest) {
      return { success: false, error: `Failed to record guest profile: ${guestError?.message}` };
    }
    guestId = newGuest.id;
  }

  // 5. Insert Reservation
  const { data: reservationRecord, error: resError } = await supabase
    .from("reservations")
    .insert({
      property_id: targetPropertyId,
      reservation_number: reservationNumber,
      guest_id: guestId,
      check_in_date: params.checkInDate,
      check_out_date: params.checkOutDate,
      num_adults: params.numAdults,
      num_children: params.numChildren,
      status: params.paymentMethod === "cash" ? "confirmed" : "awaiting_payment",
      payment_status: "unpaid",
      subtotal_amount: pricing.roomSubtotal + pricing.extraGuestsCharge,
      service_charge_amount: pricing.serviceCharge,
      vat_amount: pricing.vat,
      total_amount: pricing.total,
      currency: "ETB",
      special_requests: params.specialRequests,
      idempotency_key: params.idempotencyKey,
    })
    .select("*")
    .single();

  if (resError || !reservationRecord) {
    return { success: false, error: `Reservation insert failed: ${resError?.message}` };
  }

  // 6. Allocate Physical Room with GiST Exclusion Check
  const { error: roomAllocError } = await supabase.from("reservation_rooms").insert({
    reservation_id: reservationRecord.id,
    room_type_id: roomType.id,
    room_id: allocatedRoom.id,
    stay_range: `[${params.checkInDate}, ${params.checkOutDate})`,
    nightly_rate: roomType.base_price_per_night,
  });

  if (roomAllocError) {
    // Rollback reservation if exclusion constraint violated (race condition caught by PostgreSQL)
    await supabase.from("reservations").delete().eq("id", reservationRecord.id);
    return {
      success: false,
      error: "Double-booking prevented: Another guest just allocated this room. Please select another date or category.",
    };
  }

  return {
    success: true,
    reservation: {
      ...reservationRecord,
      assigned_room_number: allocatedRoom.room_number,
      room_type_name: roomType.name,
      guest: {
        id: guestId,
        property_id: targetPropertyId,
        ...params.guest,
      },
    } as Reservation,
  };
}

/**
 * Secure Guest Reservation Lookup in Supabase
 */
export async function lookupDatabaseReservation(
  reservationNumber: string,
  emailOrPhone: string
): Promise<Reservation | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = createServerSupabaseClient();
  const cleanRef = reservationNumber.trim().toUpperCase();

  const { data: reservation, error } = await supabase
    .from("reservations")
    .select(`
      *,
      guest:guests(*),
      rooms:reservation_rooms(
        room:rooms(room_number),
        room_type:room_types(name)
      )
    `)
    .eq("reservation_number", cleanRef)
    .maybeSingle();

  if (error || !reservation || !reservation.guest) {
    return null;
  }

  // Dual-factor contact verification
  const contact = emailOrPhone.trim().toLowerCase();
  const emailMatches = reservation.guest.email.toLowerCase() === contact;
  const phoneMatches = reservation.guest.phone.replace(/\s+/g, "") === contact.replace(/\s+/g, "");

  if (!emailMatches && !phoneMatches) {
    return null;
  }

  const roomAllocation = reservation.rooms?.[0];

  return {
    ...reservation,
    assigned_room_number: roomAllocation?.room?.room_number,
    room_type_name: roomAllocation?.room_type?.name,
  } as Reservation;
}
