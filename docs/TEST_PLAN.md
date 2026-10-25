# Medaresha — Test Plan

## 1. Quality Assurance Strategy

The Medaresha platform implements a multi-tier testing strategy targeting business correctness, concurrency safety, access control, and visual fidelity.

```
       ▲
      / \
     / E2E \       Playwright: Full Guest Booking, Reception Check-in/out, Admin Ops
    /-------\
   / Database\     PostgreSQL Concurrency Tests (Exclusion constraint & locks)
  /-----------\
 /  Unit Tests \   Vitest: Date arithmetic, Pricing calculations, Tax breakdown, RBAC
/---------------\
```

---

## 2. Test Suites

### 2.1 Unit Tests (Vitest)
- **Date Arithmetic**:
  - Validates stay duration (`nights = checkOut - checkIn`).
  - Ensures check-in before check-out, prohibits negative or zero stay length.
  - Confirms boundary check-in on the exact day another guest checks out (exclusive checkout rule).
- **Pricing Engine**:
  - Multi-night rate summation.
  - 10% Service Charge and 15% VAT calculation with round-to-cents accuracy.
  - Extra guest charges when exceeding standard capacity.
- **Role-Based Permissions**:
  - Verification of access permissions across all 6 staff roles.
  - Public route vs private route guard validation.

### 2.2 Database & Concurrency Tests
- **Simultaneous Booking Race Conditions**:
  - Two parallel requests booking the last remaining room in a category for overlapping dates.
  - Expectation: Exactly 1 transaction succeeds; second transaction throws a conflict/exclusion violation and gracefully notifies the client.
- **Idempotency Protection**:
  - Re-submitting the exact same booking payload with duplicate `idempotency_key` returns the existing record rather than creating a duplicate booking.

### 2.3 End-to-End Scenarios (Playwright / Integration)
1. **Public Visitor to Confirmed Guest**:
   - Search dates -> Browse room -> Enter guest info -> Review breakdown -> Confirm -> Receive reference `MED-2026-XXXX`.
2. **Guest Booking Lookup**:
   - Access `/booking/lookup` -> Enter reference & email -> Verify stay details are displayed.
3. **Front Desk Reception Check-In**:
   - Find reservation -> Verify room assignment -> Click "Check In" -> Verify room status updates to occupied.
4. **Front Desk Check-Out & Housekeeping Hand-off**:
   - Guest checks out -> Settle balance -> Mark room as `dirty` -> Housekeeping updates status to `in_progress` -> `inspected` -> `clean`.
5. **Security Perimeter Check**:
   - Unauthenticated visitor attempting to access `/admin/*` is redirected to `/login`.
