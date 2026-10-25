# Medaresha — Security & Access Control Architecture

## 1. Threat Model & Principles

Medaresha operates on a zero-trust model between client web browsers and backend data persistence:
1. **Never Trust Client Calculation**: Rates, room allocations, guest IDs, total costs, discounts, and payment statuses are validated and executed on the server or in database constraints.
2. **Exclusion Constraints & Atomic Locking**: Concurrency races for the same room are prevented in the database layer via PostgreSQL GiST exclusion (`stay_range &&`) and `FOR UPDATE` transaction locks.
3. **Least Privilege Role-Based Access Control (RBAC)**: Enforced via Supabase Auth JWT claims, Postgres Row Level Security (RLS), and Next.js middleware / server action session checks.
4. **Data Minimization & PCI Non-Storage**: Credit card details, CVVs, and raw payment credentials are never accepted directly or stored in our database. Payments use hosted provider tokens, bank wire proofs, or point-of-sale receipt verification.

---

## 2. Staff Roles & Permission Matrix

| Role | Room Mgmt | Bookings | Check-in / Out | Housekeeping | Ledger & Payments | Inventory & POs | Staff Mgmt | System Settings |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Owner / Super Admin** | Full | Full | Full | Full | Full | Full | Full | Full |
| **Hotel Manager** | Full | Full | Full | Full | View + Record | View + Record | Manage Staff | Read-only |
| **Receptionist** | View | Create/Edit | Full | View | Record Payment | No | No | No |
| **Housekeeping** | View | View Stay Info | No | Full Task Access | No | Request Stock | No | No |
| **Accountant** | View | View | No | No | Full Financials | View Valuations | No | No |
| **Inventory Officer** | No | No | No | No | View Stock Invoices| Full Stock Mgmt | No | No |

---

## 3. Row Level Security (RLS) Policy Specifications

### 3.1 Public Tables
- `properties`, `property_settings`, `room_types`, `room_images`, `amenities`:
  - `SELECT`: `USING (is_active = true)` allowed for `anon` and `authenticated`.
  - `INSERT/UPDATE/DELETE`: Allowed only for authenticated staff with role `owner` or `manager` matching `property_id`.

### 3.2 Private Guest & Booking Data
- `reservations`:
  - `SELECT`: Allowed for property staff (`owner`, `manager`, `receptionist`, `accountant`).
  - `SELECT (lookup)`: Allowed for `anon` only via server action matching `reservation_number` AND (`guest.email` OR `guest.phone`).
  - `INSERT`: Controlled via Server Actions with transactional validation and idempotency keys.
  - Direct table querying by public clients for arbitrary reservation rows is strictly blocked (`false` policy for `anon`).
- `guests`:
  - `SELECT`: Accessible to authenticated staff. Public users can never enumerate guest profiles.

### 3.3 Payments & Financial Ledger
- `payments`, `expenses`:
  - Direct public access disabled. Accessible only to authenticated staff with roles `owner`, `manager`, `accountant`, or `receptionist` (for recording payment receipts).

---

## 4. Idempotency & Replay Attack Defense
- Every booking request from the client includes a cryptographically secure client-generated `idempotency_key` (UUID v4).
- The PostgreSQL `reservations` table enforces a `UNIQUE(idempotency_key)` constraint.
- Duplicate submissions (e.g. rapid double clicks on "Confirm & Pay") will yield the existing reservation safely without double booking or duplicate folio creation.
