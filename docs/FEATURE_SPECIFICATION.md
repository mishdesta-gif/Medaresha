# Medaresha — Feature Specification

## 1. Feature Matrix & Scope Tracking

| ID | Feature Area | Description | Target Phase | Status |
| :--- | :--- | :--- | :--- | :--- |
| **F-01** | Visual Design System | MOYA-inspired warm ivory palette, olive green CTA, Cormorant Garamond / Inter typography, responsive card components | Phase 1 | Complete |
| **F-02** | Database & Migrations | PostgreSQL relational schema with `property_id` scoping, indexes, constraints, seed data | Phase 2 | Complete |
| **F-03** | Double-Booking Prevention | Atomic transactions, `daterange` PostgreSQL exclusion constraints, room allocation locks | Phase 2, 4 | Complete |
| **F-04** | Security & RBAC | Supabase Auth, Row Level Security (RLS) policies for 6 distinct roles, audit logging | Phase 2 | Complete |
| **F-05** | Public Discovery & Room Catalog | Hero showcase, room cards with real amenities, photos, filters (guests, price, bed) | Phase 3 | Complete |
| **F-06** | Real Availability Engine | Stay date range checking, maintenance block exclusion, capacity validation | Phase 4 | Complete |
| **F-07** | Guest Booking Flow | Multi-step booking form, server-side price calculation, tax/service fees, booking reference generation | Phase 4 | Complete |
| **F-08** | Guest Booking Lookup | Secure reservation verification by booking reference + guest email/phone | Phase 4 | Complete |
| **F-09** | Admin Dashboard & Metrics | Real-time occupancy rate, RevPAR, ADR, revenue collected vs outstanding, arrival/departure feeds | Phase 5 | Complete |
| **F-10** | Reservation Management | Front-desk reservation list, status filters, room reassignment, edit guest details, cancellation | Phase 5 | Complete |
| **F-11** | Room & Rate Management | Room categories, physical room records, standard & seasonal rates, promotional rules | Phase 5 | Complete |
| **F-12** | Availability Calendar | Visual timeline of physical rooms across dates, bookings, and maintenance blocks | Phase 5 | Complete |
| **F-13** | Reception Operations | Check-in verification, extra folio charges, check-out settlement, automatic room dirty flag | Phase 6 | Complete |
| **F-14** | Housekeeping Suite | Room status (Clean, Dirty, In Progress, Inspected), task assignment, turnaround tracking | Phase 6 | Complete |
| **F-15** | Maintenance Management | Maintenance tickets, temporary room blocking with booking engine integration | Phase 6 | Complete |
| **F-16** | Payments & Financial Ledger | Auditable transaction entries, Ethiopia payment methods (Telebirr, CBE Birr, Bank transfer, Cash), refunds | Phase 7 | Complete |
| **F-17** | Consumable Inventory & POs | Stock items (SKUs, units, reorder levels), suppliers, purchase orders, receipts, adjustments | Phase 8 | Complete |
| **F-18** | Reports & CSV Exports | Financial ledger, room utilization, occupancy, expense reports, CSV download | Phase 9 | Complete |
| **F-19** | QA & Automated Testing | Vitest unit tests (dates, rates, taxes, permissions), Playwright/Vitest E2E tests, concurrency verification | Phase 10 | Complete |

---

## 2. Business Logic Specifications

### 2.1 Date & Night Arithmetic
- Check-in is inclusive: Guest arrives on `check_in_date`.
- Check-out is exclusive: Guest departs on `check_out_date`.
- Nights: `check_out_date - check_in_date` (Must be $\ge 1$). Same-day check-in and check-out is prohibited for overnight stays.
- Date format: ISO-8601 `YYYY-MM-DD` stored with time zone normalization to hotel local time (`Africa/Addis_Ababa`).

### 2.2 Room Allocation & Concurrency Control
- **Phase A (Cart / Request)**: Guest selects room category (e.g., *Executive Suite*). System confirms at least 1 physical room in that category has zero overlapping active reservations or maintenance blocks.
- **Phase B (Atomic Commit)**: During reservation finalization, an available physical room within the category is locked and assigned. A PostgreSQL exclusion constraint prevents any overlapping stay interval for that physical room.

### 2.3 Pricing Calculation Formula
$$\text{Total Room Charge} = \sum_{d \in \text{nights}} \text{DailyRate}(d, \text{category}, \text{guests})$$
$$\text{Service Charge} = \text{Total Room Charge} \times 10\%$$
$$\text{VAT} = (\text{Total Room Charge} + \text{Service Charge}) \times 15\%$$
$$\text{Grand Total} = \text{Total Room Charge} + \text{Service Charge} + \text{VAT}$$
All intermediate values and snapshots are stored in the reservation record to ensure past bookings are never recalculated when rate plans change.
