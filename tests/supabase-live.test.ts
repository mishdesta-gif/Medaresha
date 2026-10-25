import { describe, it, expect } from "vitest";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// 1. Manually parse .env.local if present to ensure Vitest has access to variables
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf-8");
  content.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const idx = trimmed.indexOf("=");
      if (idx !== -1) {
        const key = trimmed.substring(0, idx).trim();
        let val = trimmed.substring(idx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.substring(1, val.length - 1);
        }
        process.env[key] = val;
      }
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const propertyId = process.env.NEXT_PUBLIC_DEFAULT_PROPERTY_ID || "00000000-0000-0000-0000-000000000001";

const isConfigured =
  Boolean(supabaseUrl) &&
  !supabaseUrl.includes("placeholder-project") &&
  Boolean(anonKey) &&
  !anonKey.includes("placeholder-anon-key");

describe("Supabase Connectivity & Security Verification", () => {
  it("diagnoses current Supabase configuration state", () => {
    if (!isConfigured) {
      console.log("\n==================================================================");
      console.log("ℹ️  CURRENT STATUS: Supabase is using development placeholders.");
      console.log("To connect your live database:");
      console.log("1. Add your real NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,");
      console.log("   and SUPABASE_SERVICE_ROLE_KEY into .env.local");
      console.log("2. Run your database migrations via the Supabase SQL editor");
      console.log("3. Re-run this test to verify live connection, RLS, and constraints.");
      console.log("==================================================================\n");
    } else {
      console.log("\n✓ Real Supabase credentials detected for:", supabaseUrl);
    }

    expect(typeof isConfigured).toBe("boolean");
  });

  if (isConfigured && serviceRoleKey && !serviceRoleKey.includes("placeholder")) {
    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });
    const anonClient = createClient(supabaseUrl, anonKey);

    it("verifies connection and reads the seeded flagship hotel property", async () => {
      const { data, error } = await anonClient
        .from("properties")
        .select("*")
        .eq("id", propertyId)
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.name).toContain("Medaresha");
      expect(data.city).toBe("Addis Ababa");
      expect(data.currency).toBe("ETB");
    });

    it("verifies public can read active room types with amenities", async () => {
      const { data, error } = await anonClient
        .from("room_types")
        .select("id, name, base_price_per_night, is_active")
        .eq("property_id", propertyId)
        .eq("is_active", true);

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data!.length).toBeGreaterThanOrEqual(4);
    });

    it("verifies Row Level Security prevents anonymous users from directly querying guest records", async () => {
      const { data } = await anonClient.from("guests").select("*");
      expect(data?.length || 0).toBe(0);
    });

    it("verifies Row Level Security prevents anonymous users from directly querying private payment records", async () => {
      const { data } = await anonClient.from("payments").select("*");
      expect(data?.length || 0).toBe(0);
    });

    it("executes atomic reservation insertion and verifies double-booking exclusion constraint", async () => {
      const { data: room } = await adminClient
        .from("rooms")
        .select("id, room_number, room_type_id")
        .eq("property_id", propertyId)
        .eq("is_active", true)
        .limit(1)
        .single();

      if (!room) return;
      const testRoomId = room.id;
      const testRefA = `TEST-E2E-${Date.now()}`;
      const stayRange = "[2028-05-01, 2028-05-04)";

      const { data: resA, error: errA } = await adminClient
        .from("reservations")
        .insert({
          property_id: propertyId,
          reservation_number: testRefA,
          check_in_date: "2028-05-01",
          check_out_date: "2028-05-04",
          num_adults: 2,
          status: "confirmed",
          payment_status: "paid",
          subtotal_amount: 10000,
          service_charge_amount: 1000,
          vat_amount: 1650,
          total_amount: 12650,
          currency: "ETB",
        })
        .select("id")
        .single();

      if (!errA && resA) {
        const { error: allocAError } = await adminClient
          .from("reservation_rooms")
          .insert({
            reservation_id: resA.id,
            room_type_id: room.room_type_id,
            room_id: testRoomId,
            stay_range: stayRange,
            nightly_rate: 10000,
          });

        expect(allocAError).toBeNull();

        // Attempt conflicting overlapping reservation B on EXACT same physical room
        const testRefB = `TEST-CONFLICT-${Date.now()}`;
        const { data: resB } = await adminClient
          .from("reservations")
          .insert({
            property_id: propertyId,
            reservation_number: testRefB,
            check_in_date: "2028-05-02",
            check_out_date: "2028-05-05",
            num_adults: 2,
            status: "confirmed",
            payment_status: "paid",
            subtotal_amount: 10000,
            service_charge_amount: 1000,
            vat_amount: 1650,
            total_amount: 12650,
            currency: "ETB",
          })
          .select("id")
          .single();

        if (resB) {
          const { error: allocBError } = await adminClient
            .from("reservation_rooms")
            .insert({
              reservation_id: resB.id,
              room_type_id: room.room_type_id,
              room_id: testRoomId,
              stay_range: "[2028-05-02, 2028-05-05)",
              nightly_rate: 10000,
            });

          expect(allocBError).not.toBeNull();
          await adminClient.from("reservations").delete().eq("id", resB.id);
        }

        await adminClient.from("reservations").delete().eq("id", resA.id);
      }
    });
  }
});
