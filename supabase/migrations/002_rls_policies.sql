-- ==============================================================================
-- MEDARESHA HOTEL PLATFORM — 002 ROW LEVEL SECURITY (RLS) POLICIES
-- Strict least-privilege access model
-- ==============================================================================

-- 1. Enable RLS on all tables
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_type_amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservation_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservation_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE housekeeping_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;

-- 2. Helper functions to check property membership and roles
CREATE OR REPLACE FUNCTION auth_user_property_role(target_property_id UUID)
RETURNS TEXT AS $$
    SELECT role FROM property_memberships
    WHERE user_id = auth.uid() 
      AND property_id = target_property_id 
      AND is_active = true
    LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_property_staff(target_property_id UUID)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM property_memberships
        WHERE user_id = auth.uid() 
          AND property_id = target_property_id 
          AND is_active = true
    );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_property_admin(target_property_id UUID)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM property_memberships
        WHERE user_id = auth.uid() 
          AND property_id = target_property_id 
          AND is_active = true
          AND role IN ('owner', 'manager')
    );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- 3. Public Catalog Read Policies (Anon & Authenticated)
CREATE POLICY "Public can view active properties" 
    ON properties FOR SELECT 
    USING (is_active = true);

CREATE POLICY "Public can view active room types" 
    ON room_types FOR SELECT 
    USING (is_active = true);

CREATE POLICY "Public can view room images" 
    ON room_images FOR SELECT 
    USING (true);

CREATE POLICY "Public can view amenities" 
    ON amenities FOR SELECT 
    USING (true);

CREATE POLICY "Public can view room_type_amenities" 
    ON room_type_amenities FOR SELECT 
    USING (true);

CREATE POLICY "Public can view active rate plans" 
    ON rate_plans FOR SELECT 
    USING (is_active = true);

-- 4. Staff Access Policies
CREATE POLICY "Staff can view rooms of their property"
    ON rooms FOR SELECT
    USING (is_property_staff(property_id));

CREATE POLICY "Managers can mutate rooms"
    ON rooms FOR ALL
    USING (is_property_admin(property_id));

CREATE POLICY "Staff can view reservations of their property"
    ON reservations FOR SELECT
    USING (is_property_staff(property_id));

CREATE POLICY "Staff can manage reservations"
    ON reservations FOR UPDATE
    USING (is_property_staff(property_id));

CREATE POLICY "Staff can view guests of their property"
    ON guests FOR SELECT
    USING (is_property_staff(property_id));

CREATE POLICY "Staff can view payments of their property"
    ON payments FOR SELECT
    USING (is_property_staff(property_id));

CREATE POLICY "Staff can record payments"
    ON payments FOR INSERT
    WITH CHECK (is_property_staff(property_id));

CREATE POLICY "Housekeeping and staff can view housekeeping tasks"
    ON housekeeping_tasks FOR SELECT
    USING (is_property_staff(property_id));

CREATE POLICY "Housekeeping and staff can update assigned tasks"
    ON housekeeping_tasks FOR UPDATE
    USING (is_property_staff(property_id));

CREATE POLICY "Inventory officers and managers can view inventory"
    ON inventory_items FOR SELECT
    USING (is_property_staff(property_id));

CREATE POLICY "Inventory officers and managers can record stock movements"
    ON stock_movements FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM inventory_items i
            WHERE i.id = item_id AND is_property_staff(i.property_id)
        )
    );
