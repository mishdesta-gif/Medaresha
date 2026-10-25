# Medaresha — Deployment & Operations Guide

## 1. Hosting Architecture

- **Web Application**: Next.js App Router deployed on **Vercel** or any standard Node.js Docker container runtime.
- **Database, Auth & Storage**: Managed **Supabase** project (PostgreSQL 15+).
- **Domain & SSL**: Custom domain with automatic Let's Encrypt SSL.

---

## 2. Environment Variables

Create `.env.local` for local development and configure production environment variables in your deployment dashboard:

```env
# Next.js Public Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="Medaresha Hotel"
NEXT_PUBLIC_DEFAULT_CURRENCY=ETB
NEXT_PUBLIC_DEFAULT_LOCALE=en-ET
NEXT_PUBLIC_HOTEL_TIMEZONE=Africa/Addis_Ababa

# Supabase Public Keys
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Supabase Server-Only Secret (NEVER EXPOSE IN CLIENT BUNDLE)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Seed & Admin Setup
INITIAL_ADMIN_EMAIL=admin@medaresha.com
INITIAL_ADMIN_PASSWORD=change-in-production-secure-password
```

---

## 3. Database Migration Steps

1. Connect to your Supabase project via the Supabase Dashboard SQL Editor or Supabase CLI.
2. Execute migration files in order:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_rls_policies.sql`
   - `supabase/migrations/003_seed_data.sql`
3. Verify that the `btree_gist` extension is enabled.
4. Confirm storage buckets `hotel-assets` and `room-photos` are created with public read access.

---

## 4. Production Build & Verification

```bash
# Install dependencies
npm install

# Run TypeScript typechecks
npm run typecheck

# Run test suites
npm run test

# Build production bundle
npm run build

# Start production server
npm run start
```
