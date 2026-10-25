// ==============================================================================
// MEDARESHA HOTEL — SECURE INITIAL ADMINISTRATOR PROVISIONING SCRIPT
// Run via: npm run setup:admin
// Native Node.js 20+ execution: node --env-file=.env.local
// Requires SUPABASE_SERVICE_ROLE_KEY in .env.local
// ==============================================================================

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const propertyId = process.env.NEXT_PUBLIC_DEFAULT_PROPERTY_ID || "00000000-0000-0000-0000-000000000001";
const adminEmail = process.env.INITIAL_ADMIN_EMAIL || "admin@medaresha.com";
const adminPassword = process.env.INITIAL_ADMIN_PASSWORD;

async function setupInitialAdmin() {
  console.log("==================================================================");
  console.log("MEDARESHA — Initial Administrator Provisioning");
  console.log("==================================================================");

  if (!supabaseUrl || !serviceRoleKey || supabaseUrl.includes("placeholder-project")) {
    console.error("❌ Error: Valid NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be configured in .env.local");
    process.exit(1);
  }

  if (!adminPassword || adminPassword.includes("ReplaceWithAStrongPassword")) {
    console.error("❌ Error: Please set a secure INITIAL_ADMIN_PASSWORD in .env.local before running setup.");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  console.log(`Connecting to Supabase at: ${supabaseUrl}`);
  console.log(`Target Property ID: ${propertyId}`);
  console.log(`Admin Email: ${adminEmail}`);

  // 1. Check if user already exists
  const { data: userList, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    console.error("❌ Failed to query auth users:", listError.message);
    process.exit(1);
  }

  let adminUser = userList.users.find((u) => u.email?.toLowerCase() === adminEmail.toLowerCase());

  if (!adminUser) {
    console.log("Creating new administrator auth user...");
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: { full_name: "Medaresha General Manager" },
    });

    if (createError || !newUser.user) {
      console.error("❌ Failed to create auth user:", createError?.message);
      process.exit(1);
    }
    adminUser = newUser.user;
    console.log("✓ Auth user created successfully with ID:", adminUser.id);
  } else {
    console.log("✓ Existing auth user found with ID:", adminUser.id);
  }

  // 2. Ensure Profile exists
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .upsert({
      id: adminUser.id,
      full_name: "Medaresha General Manager",
      phone: "+251 11 667 9800",
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (profileError) {
    console.error("❌ Failed to upsert profile record:", profileError.message);
    process.exit(1);
  }
  console.log("✓ Staff profile record confirmed.");

  // 3. Ensure Property Membership exists with 'owner' role
  const { data: membership, error: memberError } = await supabase
    .from("property_memberships")
    .upsert(
      {
        property_id: propertyId,
        user_id: adminUser.id,
        role: "owner",
        is_active: true,
      },
      { onConflict: "property_id,user_id" }
    )
    .select()
    .single();

  if (memberError) {
    console.error("❌ Failed to assign owner property membership:", memberError.message);
    process.exit(1);
  }
  console.log("✓ Owner role assigned in property_memberships.");

  console.log("==================================================================");
  console.log("🎉 SUCCESS: Administrator setup complete!");
  console.log(`Email:    ${adminEmail}`);
  console.log(`Role:     owner (Super Admin)`);
  console.log(`Sign in:  http://localhost:3000/login`);
  console.log("==================================================================");
}

setupInitialAdmin().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
