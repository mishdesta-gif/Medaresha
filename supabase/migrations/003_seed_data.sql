-- ==============================================================================
-- MEDARESHA HOTEL PLATFORM — 003 SEED DATA
-- Default Boutique Property in Addis Ababa, Ethiopia
-- ==============================================================================

-- 1. Insert Initial Property
INSERT INTO properties (
    id,
    name,
    slug,
    tagline,
    description,
    star_rating,
    address_line1,
    city,
    country,
    timezone,
    currency,
    phone,
    email,
    website_url,
    hero_image_url,
    check_in_time,
    check_out_time,
    is_active
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Medaresha Boutique Hotel & Residences',
    'medaresha-addis',
    'A sanctuary of calm, warm luxury, and Ethiopian hospitality.',
    'Nestled in the serene highland enclave of Bole, Medaresha blends contemporary minimalist architecture with warm natural materials, handwoven textures, and bespoke hospitality services.',
    5.0,
    'Cameroon Street, Bole Sub-City, Kebele 03',
    'Addis Ababa',
    'Ethiopia',
    'Africa/Addis_Ababa',
    'ETB',
    '+251 11 667 9800',
    'concierge@medaresha.com',
    'https://medaresha.com',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=80',
    '14:00',
    '11:00',
    true
) ON CONFLICT (id) DO NOTHING;

-- 2. Property Settings
INSERT INTO property_settings (
    property_id,
    vat_percentage,
    service_charge_percentage,
    cancellation_grace_hours,
    auto_release_pending_minutes,
    bank_transfer_instructions
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    15.00,
    10.00,
    48,
    30,
    'Commercial Bank of Ethiopia (CBE) A/C: 1000234567891 (Medaresha Hospitality PLC) or Awash Bank A/C: 013045678912. Reference your Reservation Number.'
) ON CONFLICT (property_id) DO NOTHING;

-- 3. Room Types
INSERT INTO room_types (
    id,
    property_id,
    name,
    slug,
    short_description,
    full_description,
    max_adults,
    max_children,
    max_occupancy,
    base_price_per_night,
    extra_person_fee,
    size_sqm,
    bed_configuration,
    is_active,
    sort_order
) VALUES
(
    '10000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'Presidential Bole Suite',
    'presidential-bole-suite',
    '120 sqm of refined sanctuary with panoramic mountain horizons, private dining salon, and master marble bath.',
    'The pinnacle of Medaresha hospitality. Features a sprawling private terrace overlooking the Entoto ranges, custom olivewood millwork, dedicated butler service, soaking stone tub, and organic botanical amenities.',
    2, 2, 4,
    18500.00,
    2500.00,
    120.00,
    '1 King Bed + Living Lounge',
    true,
    1
),
(
    '10000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'Diplomatic Executive Suite',
    'diplomatic-executive-suite',
    '65 sqm designed for discerning business & leisure travelers, featuring an executive workspace and private balcony.',
    'Curated for productive calm. Includes ergonomic working desk, high-speed fiber internet, artisanal espresso station, and luxury linens crafted from Sheba cotton.',
    2, 1, 3,
    11200.00,
    1800.00,
    65.00,
    '1 King Bed',
    true,
    2
),
(
    '10000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000001',
    'Botanical Deluxe King',
    'botanical-deluxe-king',
    '45 sqm peaceful oasis bathed in warm natural light with rainfall shower and garden vista.',
    'An intimate retreat showcasing calming earth tones, textured plaster walls, acoustic double-glazed windows, and a plush Simmons mattress with Egyptian cotton linens.',
    2, 0, 2,
    7800.00,
    0.00,
    45.00,
    '1 King Bed',
    true,
    3
),
(
    '10000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000001',
    'Junior Garden Suite',
    'junior-garden-suite',
    '55 sqm with direct access to private courtyards, teak daybed, and bespoke artisanal touches.',
    'Surrounded by indigenous acacia and rosemary landscaping, this serene haven features sliding timber screens, deep terrazzo bathroom, and indoor-outdoor seating.',
    2, 1, 3,
    9400.00,
    1500.00,
    55.00,
    '1 Queen Bed + Daybed',
    true,
    4
) ON CONFLICT (property_id, slug) DO NOTHING;

-- 4. Physical Rooms
INSERT INTO rooms (id, property_id, room_type_id, room_number, floor, housekeeping_status, is_active) VALUES
('20000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '501', 5, 'clean', true),
('20000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '502', 5, 'clean', true),
('20000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', '401', 4, 'clean', true),
('20000000-0000-0000-0000-000000000202', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', '402', 4, 'clean', true),
('20000000-0000-0000-0000-000000000203', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', '403', 4, 'dirty', true),
('20000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', '301', 3, 'clean', true),
('20000000-0000-0000-0000-000000000302', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', '302', 3, 'in_progress', true),
('20000000-0000-0000-0000-000000000303', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', '303', 3, 'clean', true),
('20000000-0000-0000-0000-000000000401', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000004', '101', 1, 'clean', true),
('20000000-0000-0000-0000-000000000402', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000004', '102', 1, 'inspected', true)
ON CONFLICT (property_id, room_number) DO NOTHING;

-- 5. Inventory Items Seed
INSERT INTO inventory_items (id, property_id, sku, name, category, unit_of_measure, current_stock, reorder_threshold, unit_cost) VALUES
('30000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'FNB-BUNA-01', 'Yirgacheffe Single-Origin Roast Coffee', 'food_beverage', 'kg', 45.0, 15.0, 850.00),
('30000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'BTH-SOAP-01', 'Artisanal Olive & Rosemary Bar Soap (100g)', 'toiletries', 'piece', 180.0, 50.0, 120.00),
('30000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'LIN-KNGS-01', 'King Bed Sheet Set - 400TC Egyptian Cotton', 'linen', 'piece', 32.0, 10.0, 3200.00),
('30000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'CLN-ECOD-01', 'Eco Botanical Surface Disinfectant (5L)', 'cleaning', 'bottle', 14.0, 5.0, 1450.00)
ON CONFLICT (property_id, sku) DO NOTHING;
