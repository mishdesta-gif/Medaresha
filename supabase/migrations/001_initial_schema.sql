-- ==============================================================================
-- MEDARESHA HOTEL PLATFORM — 001 INITIAL SCHEMA MIGRATION
-- Multi-Tenant Prepared, PostgreSQL 15+ compatible with btree_gist exclusion
-- ==============================================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- 2. Properties & Configuration
CREATE TABLE IF NOT EXISTS properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    tagline TEXT,
    description TEXT,
    star_rating NUMERIC(2,1) DEFAULT 5.0,
    address_line1 TEXT NOT NULL,
    city TEXT NOT NULL DEFAULT 'Addis Ababa',
    country TEXT NOT NULL DEFAULT 'Ethiopia',
    timezone TEXT NOT NULL DEFAULT 'Africa/Addis_Ababa',
    currency TEXT NOT NULL DEFAULT 'ETB',
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    website_url TEXT,
    hero_image_url TEXT,
    logo_url TEXT,
    check_in_time TIME NOT NULL DEFAULT '14:00',
    check_out_time TIME NOT NULL DEFAULT '11:00',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS property_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    vat_percentage NUMERIC(5,2) NOT NULL DEFAULT 15.00,
    service_charge_percentage NUMERIC(5,2) NOT NULL DEFAULT 10.00,
    cancellation_grace_hours INT NOT NULL DEFAULT 48,
    auto_release_pending_minutes INT NOT NULL DEFAULT 30,
    telebirr_merchant_id TEXT,
    cbe_account_number TEXT,
    bank_transfer_instructions TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(property_id)
);

-- 3. Profiles & Staff Role Management
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY, -- Maps 1:1 with auth.users
    full_name TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS property_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('owner', 'manager', 'receptionist', 'housekeeping', 'accountant', 'inventory_officer')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(property_id, user_id)
);

-- 4. Room Types, Physical Rooms, and Amenities
CREATE TABLE IF NOT EXISTS room_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    short_description TEXT NOT NULL,
    full_description TEXT NOT NULL,
    max_adults INT NOT NULL DEFAULT 2,
    max_children INT NOT NULL DEFAULT 1,
    max_occupancy INT NOT NULL DEFAULT 2,
    base_price_per_night NUMERIC(12,2) NOT NULL,
    extra_person_fee NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    size_sqm NUMERIC(6,2),
    bed_configuration TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(property_id, slug)
);

CREATE TABLE IF NOT EXISTS amenities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'room', -- 'room', 'bathroom', 'wellness', 'dining'
    icon_name TEXT NOT NULL DEFAULT 'Sparkles',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS room_type_amenities (
    room_type_id UUID NOT NULL REFERENCES room_types(id) ON DELETE CASCADE,
    amenity_id UUID NOT NULL REFERENCES amenities(id) ON DELETE CASCADE,
    PRIMARY KEY (room_type_id, amenity_id)
);

CREATE TABLE IF NOT EXISTS room_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_type_id UUID NOT NULL REFERENCES room_types(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    caption TEXT,
    is_cover BOOLEAN NOT NULL DEFAULT false,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    room_type_id UUID NOT NULL REFERENCES room_types(id) ON DELETE RESTRICT,
    room_number TEXT NOT NULL,
    floor INT NOT NULL DEFAULT 1,
    housekeeping_status TEXT NOT NULL DEFAULT 'clean' 
        CHECK (housekeeping_status IN ('clean', 'dirty', 'in_progress', 'inspected', 'out_of_service')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(property_id, room_number)
);

CREATE TABLE IF NOT EXISTS room_blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT NOT NULL,
    block_type TEXT NOT NULL CHECK (block_type IN ('maintenance', 'renovation', 'management_hold')),
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT valid_block_range CHECK (end_date > start_date)
);

-- 5. Rate Plans & Period Overrides
CREATE TABLE IF NOT EXISTS rate_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    room_type_id UUID NOT NULL REFERENCES room_types(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- e.g. "Standard Non-Refundable", "Flexible Breakfast Included"
    rate_multiplier NUMERIC(4,2) NOT NULL DEFAULT 1.00,
    meal_plan TEXT NOT NULL DEFAULT 'room_only' CHECK (meal_plan IN ('room_only', 'breakfast_included', 'half_board', 'full_board')),
    cancellation_policy TEXT NOT NULL DEFAULT 'flexible',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Guests & Reservations
CREATE TABLE IF NOT EXISTS guests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    identification_type TEXT CHECK (identification_type IN ('passport', 'national_id', 'driving_license')),
    identification_number TEXT,
    country TEXT NOT NULL DEFAULT 'Ethiopia',
    preferences TEXT,
    internal_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    reservation_number TEXT NOT NULL UNIQUE,
    guest_id UUID NOT NULL REFERENCES guests(id) ON DELETE RESTRICT,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    num_adults INT NOT NULL DEFAULT 1,
    num_children INT NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pending' 
        CHECK (status IN ('pending', 'awaiting_payment', 'confirmed', 'checked_in', 'checked_out', 'cancelled', 'no_show')),
    payment_status TEXT NOT NULL DEFAULT 'unpaid' 
        CHECK (payment_status IN ('unpaid', 'partially_paid', 'paid', 'refunded')),
    subtotal_amount NUMERIC(12,2) NOT NULL,
    service_charge_amount NUMERIC(12,2) NOT NULL,
    vat_amount NUMERIC(12,2) NOT NULL,
    total_amount NUMERIC(12,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'ETB',
    special_requests TEXT,
    estimated_arrival_time TIME,
    cancellation_reason TEXT,
    cancelled_at TIMESTAMPTZ,
    idempotency_key TEXT UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT check_reservation_dates CHECK (check_out_date > check_in_date)
);

-- 7. Reservation Rooms Allocation & CRITICAL Double-Booking Prevention
CREATE TABLE IF NOT EXISTS reservation_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reservation_id UUID NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
    room_type_id UUID NOT NULL REFERENCES room_types(id) ON DELETE RESTRICT,
    room_id UUID REFERENCES rooms(id) ON DELETE RESTRICT,
    stay_range DATERANGE NOT NULL,
    nightly_rate NUMERIC(12,2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    -- The GiST constraint enforces that NO TWO RESERVATIONS can allocate the same room_id over overlapping stay_ranges:
    EXCLUDE USING gist (room_id WITH =, stay_range WITH &&) WHERE (room_id IS NOT NULL)
);

CREATE TABLE IF NOT EXISTS reservation_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reservation_id UUID NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
    from_status TEXT,
    to_status TEXT NOT NULL,
    changed_by UUID REFERENCES profiles(id),
    reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. Payments & Accounting
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    reservation_id UUID NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
    transaction_reference TEXT UNIQUE NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'ETB',
    payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'credit_card', 'telebirr', 'cbe_birr', 'bank_transfer', 'online_gateway')),
    payment_status TEXT NOT NULL DEFAULT 'completed' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
    recorded_by UUID REFERENCES profiles(id),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    category TEXT NOT NULL, -- 'utilities', 'supplies', 'maintenance', 'payroll', 'marketing', 'other'
    title TEXT NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'ETB',
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
    paid_to TEXT,
    receipt_reference TEXT,
    recorded_by UUID REFERENCES profiles(id),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. Housekeeping & Maintenance Tickets
CREATE TABLE IF NOT EXISTS housekeeping_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES profiles(id),
    priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'verified')),
    scheduled_date DATE NOT NULL DEFAULT CURRENT_DATE,
    completed_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS maintenance_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    room_id UUID REFERENCES rooms(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    reported_by UUID REFERENCES profiles(id),
    resolved_at TIMESTAMPTZ,
    blocks_room BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. Consumable Inventory & Suppliers
CREATE TABLE IF NOT EXISTS inventory_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    sku TEXT NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL, -- 'food_beverage', 'linen', 'toiletries', 'cleaning', 'minibar', 'office'
    unit_of_measure TEXT NOT NULL, -- 'kg', 'liter', 'piece', 'pack', 'bottle'
    current_stock NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    reorder_threshold NUMERIC(10,2) NOT NULL DEFAULT 10.00,
    unit_cost NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(property_id, sku)
);

CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    contact_person TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    tax_id TEXT,
    payment_terms TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS purchase_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    po_number TEXT NOT NULL UNIQUE,
    supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE RESTRICT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'ordered', 'partially_received', 'received', 'cancelled')),
    total_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    ordered_at TIMESTAMPTZ,
    expected_delivery_date DATE,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS purchase_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    purchase_order_id UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE RESTRICT,
    quantity_ordered NUMERIC(10,2) NOT NULL,
    quantity_received NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    unit_cost NUMERIC(12,2) NOT NULL,
    total_cost NUMERIC(12,2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS stock_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
    movement_type TEXT NOT NULL CHECK (movement_type IN ('receipt', 'issue', 'waste', 'return', 'adjustment')),
    quantity NUMERIC(10,2) NOT NULL,
    balance_after NUMERIC(10,2) NOT NULL,
    unit_cost NUMERIC(12,2) NOT NULL,
    reason TEXT NOT NULL,
    recorded_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 11. Indexes for Maximum Read & Booking Engine Performance
CREATE INDEX IF NOT EXISTS idx_rooms_property_roomtype ON rooms(property_id, room_type_id);
CREATE INDEX IF NOT EXISTS idx_reservation_rooms_stay_range ON reservation_rooms USING gist (stay_range);
CREATE INDEX IF NOT EXISTS idx_reservations_lookup ON reservations(property_id, reservation_number);
CREATE INDEX IF NOT EXISTS idx_reservations_status_dates ON reservations(property_id, status, check_in_date, check_out_date);
CREATE INDEX IF NOT EXISTS idx_room_blocks_dates ON room_blocks(property_id, room_id, start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_payments_reservation ON payments(reservation_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_item ON stock_movements(item_id, created_at DESC);
