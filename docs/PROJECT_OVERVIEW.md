# Medaresha — Project Overview

## 1. Executive Summary

**Medaresha** is an enterprise-grade, luxury hospitality platform providing:
1. An immersive, photographic, mobile-first **public hotel booking experience** inspired by warm minimalist, organic aesthetics (warm ivory backgrounds, deep olive green actions, botanical accents, refined typography).
2. A high-integrity **real-time reservation engine** engineered with PostgreSQL transactions, row-level locking, and exclusion constraints to guarantee zero double bookings.
3. A comprehensive **Property Management System (PMS)** and **Administrative Operations Suite** encompassing Reception (Check-in / Check-out), Room Inventory & Maintenance, Housekeeping workflows, Guest profiles, Rate plans & Dynamic pricing, auditable Multi-currency Ledger & Financial tracking (with Ethiopia ETB and local payment rails), and Consumable Inventory management.

While initially tailored for a single prestigious boutique hotel in Addis Ababa, Ethiopia, Medaresha's architecture is explicitly multi-tenant ready (`property_id` scoping across all business tables, configurable policies, and role-based property memberships).

---

## 2. Brand Identity & Visual Aesthetic

Inspired by the provided MOYA minimalist design language:
- **Palette**:
  - Primary Olive Green: `#343B2A` (Primary buttons, key accents, active states)
  - Secondary Botanical Green: `#72785E` (Tags, subtle highlights, nature motifs)
  - Main Ivory Canvas: `#F5F0E6` (Core background creating warm hospitality warmth)
  - Secondary Sand Canvas: `#E8DFD0` (Card surfaces, subtle section differentiation)
  - Primary Text: `#292A24` (High contrast, elegant readability)
  - Secondary Text: `#77766C` (Muted metadata, supporting captions)
  - Fine Dividers: `#D8D0C3` (Crisp, subtle dividers without heavy drop shadows)
- **Typography**:
  - Headings & Editorial Display: *Cormorant Garamond* (or high-end Serif fallback)
  - UI, Forms, Data, Metrics: *Inter* / Sans-serif for optimal legibility at all viewports
- **Atmosphere**: Warm minimalism, unhurried luxury, natural light photography, uncluttered spacing, clear price breakdowns, and transparent booking rules.

---

## 3. Core Modules & Capabilities

| Module | Scope & Responsibility | Status |
| :--- | :--- | :--- |
| **Public Website** | Hero, Discovery, Room Catalog, Amenities, Location, Policies, SEO & Accessibility | In Progress |
| **Booking Engine** | Date picker (inclusive check-in, exclusive check-out), Guest selector, Pricing engine, Atomic reservation commit | Planned |
| **Double-Booking Shield** | PostgreSQL constraints, exclusive date-range locking (`tstzrange` / `daterange`), Idempotency | Planned |
| **Admin Dashboard** | KPIs (Occupancy, RevPAR, ADR, Collected vs Outstanding), Analytics, Arrival/Departure feed | Planned |
| **Front Desk / Reception** | Guest lookup, Check-in verification, Folio & extra charge recording, Check-out settlement | Planned |
| **Housekeeping & Maintenance**| Clean/Dirty/Inspected states, Cleaning task assignment, Maintenance room blocks with booking engine exclusion | Planned |
| **Rates & Yield Management** | Base rates, seasonal periods, weekend surcharges, promotional codes, tax & service fee rules | Planned |
| **Financial Ledger & Billing**| Auditable transaction log, ETB & foreign currencies, Ethiopian payment methods (Telebirr, CBE Birr, Bank transfer, Cash), Receipts | Planned |
| **Consumable Inventory** | Food & beverage, toiletries, linens, suppliers, stock movements, purchase orders, reorder warnings | Planned |
| **Security & RBAC** | Supabase Auth, Row Level Security (RLS) policies, Least-privilege roles (Owner, Manager, Reception, Housekeeper, Accountant, Inventory Officer) | Planned |

---

## 4. Ethiopian Hospitality Localization

- **Currency**: Ethiopian Birr (ETB) default, with configurable multi-currency display.
- **Timezone**: Africa/Addis_Ababa (UTC+3) hotel-local operational date handling to prevent check-in day shift errors.
- **Taxes**: Configurable 15% VAT and 10% Service Charge calculations.
- **Payment Options**: Support for on-property settlement ("Pay at Hotel"), verified Bank Wire / Mobile Money transfers (Telebirr, CBE Birr, Awash, etc.), and future online gateway webhooks.
- **Contact & Phone**: Ethiopian format (`+251 9...` / `09...`) and international dialing validation.
