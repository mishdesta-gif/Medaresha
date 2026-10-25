// ==============================================================================
// MEDARESHA HOTEL PLATFORM — TYPESCRIPT DOMAIN DEFINITIONS
// ==============================================================================

export type StaffRole = 
  | 'owner' 
  | 'manager' 
  | 'receptionist' 
  | 'housekeeping' 
  | 'accountant' 
  | 'inventory_officer';

export type HousekeepingStatus = 
  | 'clean' 
  | 'dirty' 
  | 'in_progress' 
  | 'inspected' 
  | 'out_of_service';

export type ReservationStatus = 
  | 'pending' 
  | 'awaiting_payment' 
  | 'confirmed' 
  | 'checked_in' 
  | 'checked_out' 
  | 'cancelled' 
  | 'no_show';

export type PaymentStatus = 
  | 'unpaid' 
  | 'partially_paid' 
  | 'paid' 
  | 'refunded';

export type PaymentMethod = 
  | 'cash' 
  | 'credit_card' 
  | 'telebirr' 
  | 'cbe_birr' 
  | 'bank_transfer' 
  | 'online_gateway';

export interface Property {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  star_rating: number;
  address_line1: string;
  city: string;
  country: string;
  timezone: string;
  currency: string;
  phone: string;
  email: string;
  website_url?: string;
  hero_image_url: string;
  logo_url?: string;
  check_in_time: string;
  check_out_time: string;
  is_active: boolean;
}

export interface PropertySettings {
  property_id: string;
  vat_percentage: number;
  service_charge_percentage: number;
  cancellation_grace_hours: number;
  auto_release_pending_minutes: number;
  telebirr_merchant_id?: string;
  cbe_account_number?: string;
  bank_transfer_instructions?: string;
}

export interface Amenity {
  id: string;
  name: string;
  category: 'room' | 'bathroom' | 'wellness' | 'dining';
  icon_name: string;
}

export interface RoomImage {
  id: string;
  room_type_id: string;
  image_url: string;
  alt_text?: string;
  caption?: string;
  is_cover: boolean;
  sort_order: number;
}

export interface RoomType {
  id: string;
  property_id: string;
  name: string;
  slug: string;
  short_description: string;
  full_description: string;
  max_adults: number;
  max_children: number;
  max_occupancy: number;
  base_price_per_night: number;
  extra_person_fee: number;
  size_sqm?: number;
  bed_configuration: string;
  is_active: boolean;
  sort_order: number;
  images?: RoomImage[];
  amenities?: Amenity[];
}

export interface Room {
  id: string;
  property_id: string;
  room_type_id: string;
  room_number: string;
  floor: number;
  housekeeping_status: HousekeepingStatus;
  is_active: boolean;
  notes?: string;
  room_type?: RoomType;
}

export interface Guest {
  id: string;
  property_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  country: string;
  identification_type?: 'passport' | 'national_id' | 'driving_license';
  identification_number?: string;
  preferences?: string;
  internal_notes?: string;
}

export interface ReservationRoom {
  id: string;
  reservation_id: string;
  room_type_id: string;
  room_id?: string;
  room?: Room;
  stay_range: string;
  nightly_rate: number;
}

export interface Reservation {
  id: string;
  property_id: string;
  reservation_number: string;
  guest_id: string;
  guest?: Guest;
  check_in_date: string;
  check_out_date: string;
  num_adults: number;
  num_children: number;
  status: ReservationStatus;
  payment_status: PaymentStatus;
  subtotal_amount: number;
  service_charge_amount: number;
  vat_amount: number;
  total_amount: number;
  currency: string;
  special_requests?: string;
  estimated_arrival_time?: string;
  idempotency_key?: string;
  created_at: string;
  updated_at: string;
  rooms?: ReservationRoom[];
  assigned_room_number?: string;
  room_type_name?: string;
}

export interface Payment {
  id: string;
  property_id: string;
  reservation_id: string;
  transaction_reference: string;
  amount: number;
  currency: string;
  payment_method: PaymentMethod;
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  recorded_by?: string;
  notes?: string;
  created_at: string;
}

export interface Expense {
  id: string;
  property_id: string;
  category: 'utilities' | 'supplies' | 'maintenance' | 'payroll' | 'marketing' | 'other';
  title: string;
  amount: number;
  currency: string;
  expense_date: string;
  paid_to?: string;
  receipt_reference?: string;
  notes?: string;
}

export interface HousekeepingTask {
  id: string;
  property_id: string;
  room_id: string;
  room_number: string;
  assigned_to_name?: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'verified';
  scheduled_date: string;
  completed_at?: string;
  notes?: string;
}

export interface MaintenanceTicket {
  id: string;
  property_id: string;
  room_id?: string;
  room_number?: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  blocks_room: boolean;
  created_at: string;
}

export interface InventoryItem {
  id: string;
  property_id: string;
  sku: string;
  name: string;
  category: 'food_beverage' | 'linen' | 'toiletries' | 'cleaning' | 'minibar' | 'office';
  unit_of_measure: string;
  current_stock: number;
  reorder_threshold: number;
  unit_cost: number;
}

export interface StockMovement {
  id: string;
  item_id: string;
  item_name?: string;
  movement_type: 'receipt' | 'issue' | 'waste' | 'return' | 'adjustment';
  quantity: number;
  balance_after: number;
  unit_cost: number;
  reason: string;
  created_at: string;
}

export interface Supplier {
  id: string;
  property_id: string;
  company_name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  payment_terms?: string;
}

export interface PurchaseOrder {
  id: string;
  property_id: string;
  po_number: string;
  supplier_id: string;
  supplier_name?: string;
  status: 'draft' | 'ordered' | 'partially_received' | 'received' | 'cancelled';
  total_amount: number;
  expected_delivery_date?: string;
  created_at: string;
}

export interface PriceQuote {
  nights: number;
  baseRatePerNight: number;
  roomSubtotal: number;
  extraGuestsCharge: number;
  serviceCharge: number;
  vat: number;
  total: number;
  currency: string;
}

export interface DashboardMetrics {
  totalReservations: number;
  confirmedReservations: number;
  pendingReservations: number;
  cancelledReservations: number;
  occupiedRooms: number;
  totalRooms: number;
  occupancyRatePercentage: number;
  collectedRevenue: number;
  outstandingBalance: number;
  todayArrivalsCount: number;
  todayDeparturesCount: number;
  currency: string;
}
