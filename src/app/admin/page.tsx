"use client";

import * as React from "react";
import Link from "next/link";
import { hotelStore } from "@/lib/booking-engine";
import { formatCurrency, formatDateEditorial } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BedDouble,
  CalendarCheck,
  CreditCard,
  DollarSign,
  DoorOpen,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = React.useState(() => hotelStore.getDashboardMetrics());
  const today = new Date().toISOString().split("T")[0];

  const reservations = hotelStore.reservations;
  const rooms = hotelStore.rooms;
  const payments = hotelStore.payments;

  // Cleanliness breakdown
  const cleanCount = rooms.filter((r) => r.housekeeping_status === "clean").length;
  const dirtyCount = rooms.filter((r) => r.housekeeping_status === "dirty").length;
  const inProgressCount = rooms.filter((r) => r.housekeeping_status === "in_progress").length;
  const inspectedCount = rooms.filter((r) => r.housekeeping_status === "inspected").length;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-meda-border pb-5">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-botanical font-medium">
            Property Operations
          </span>
          <h1 className="font-serif text-3xl font-medium text-meda-text">
            Executive Operations Dashboard
          </h1>
          <p className="text-xs text-meda-muted mt-1">
            Real-time hotel statistics for Medaresha Boutique Hotel & Residences • Addis Ababa
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/check-in-out">
            <Button variant="primary" size="sm" className="rounded-full text-xs">
              <DoorOpen className="mr-1.5 h-3.5 w-3.5" />
              Front Desk Console
            </Button>
          </Link>
          <Link href="/admin/calendar">
            <Button variant="outline" size="sm" className="rounded-full text-xs">
              Availability Matrix
            </Button>
          </Link>
        </div>
      </div>

      {/* Primary KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Occupancy Rate */}
        <div className="rounded-2xl border border-meda-border bg-[#FAF7F2] p-5 shadow-subtle">
          <div className="flex items-center justify-between text-xs text-meda-muted">
            <span className="font-medium uppercase tracking-wider">Occupancy Rate</span>
            <div className="rounded-full bg-sand p-2 text-olive">
              <BedDouble className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-serif text-3xl font-medium text-olive">
              {metrics.occupancyRatePercentage}%
            </span>
            <span className="text-xs text-meda-muted">
              ({metrics.occupiedRooms} / {metrics.totalRooms} rooms occupied)
            </span>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-sand">
            <div
              className="h-full bg-olive rounded-full"
              style={{ width: `${metrics.occupancyRatePercentage}%` }}
            />
          </div>
        </div>

        {/* Collected Revenue */}
        <div className="rounded-2xl border border-meda-border bg-[#FAF7F2] p-5 shadow-subtle">
          <div className="flex items-center justify-between text-xs text-meda-muted">
            <span className="font-medium uppercase tracking-wider">Collected Revenue</span>
            <div className="rounded-full bg-sand p-2 text-botanical">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-serif text-3xl font-medium text-olive">
              {formatCurrency(metrics.collectedRevenue)}
            </span>
          </div>
          <span className="text-[11px] text-meda-muted block mt-2">
            Audited settled payments (ETB)
          </span>
        </div>

        {/* Outstanding Balance */}
        <div className="rounded-2xl border border-meda-border bg-[#FAF7F2] p-5 shadow-subtle">
          <div className="flex items-center justify-between text-xs text-meda-muted">
            <span className="font-medium uppercase tracking-wider">Outstanding Balance</span>
            <div className="rounded-full bg-[#FBEAE9] p-2 text-[#A3322B]">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-serif text-3xl font-medium text-[#A3322B]">
              {formatCurrency(metrics.outstandingBalance)}
            </span>
          </div>
          <span className="text-[11px] text-meda-muted block mt-2">
            Pending guest settlement upon checkout
          </span>
        </div>

        {/* Active Reservations */}
        <div className="rounded-2xl border border-meda-border bg-[#FAF7F2] p-5 shadow-subtle">
          <div className="flex items-center justify-between text-xs text-meda-muted">
            <span className="font-medium uppercase tracking-wider">Total Stays</span>
            <div className="rounded-full bg-sand p-2 text-olive">
              <CalendarCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-serif text-3xl font-medium text-olive">
              {metrics.totalReservations}
            </span>
            <span className="text-xs text-botanical font-medium">
              ({metrics.confirmedReservations} confirmed)
            </span>
          </div>
          <span className="text-[11px] text-meda-muted block mt-2">
            {metrics.pendingReservations} awaiting payment verification
          </span>
        </div>
      </div>

      {/* Housekeeping Status Bar */}
      <div className="rounded-2xl border border-meda-border bg-[#FAF7F2] p-5 shadow-subtle">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-serif text-lg text-olive flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-botanical" />
            Housekeeping & Cleanliness Readiness
          </h3>
          <Link href="/admin/housekeeping" className="text-xs text-olive hover:underline font-medium">
            Manage Room Cleaning Tasks →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="rounded-xl border border-[#BDE2CD] bg-[#EAF3ED] p-3 text-center">
            <span className="text-[#245C3C] font-semibold text-lg block">{cleanCount}</span>
            <span className="text-[#245C3C] uppercase tracking-wider text-[10px]">Clean & Ready</span>
          </div>

          <div className="rounded-xl border border-[#F6DFB6] bg-[#FBF4E8] p-3 text-center">
            <span className="text-[#9A6517] font-semibold text-lg block">{inProgressCount}</span>
            <span className="text-[#9A6517] uppercase tracking-wider text-[10px]">In Progress</span>
          </div>

          <div className="rounded-xl border border-[#F5C2BF] bg-[#FBEAE9] p-3 text-center">
            <span className="text-[#9B2C24] font-semibold text-lg block">{dirtyCount}</span>
            <span className="text-[#9B2C24] uppercase tracking-wider text-[10px]">Dirty / Turnover</span>
          </div>

          <div className="rounded-xl border border-[#BFD8E8] bg-[#EBF2F7] p-3 text-center">
            <span className="text-[#245070] font-semibold text-lg block">{inspectedCount}</span>
            <span className="text-[#245070] uppercase tracking-wider text-[10px]">Inspected</span>
          </div>
        </div>
      </div>

      {/* Front Desk Live Feed & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Reservations Feed */}
        <div className="rounded-2xl border border-meda-border bg-[#FAF7F2] p-6 shadow-subtle flex flex-col">
          <div className="flex items-center justify-between border-b border-meda-border pb-4 mb-4">
            <h3 className="font-serif text-xl text-olive">Recent Bookings & Folios</h3>
            <Link href="/admin/reservations" className="text-xs text-olive hover:underline font-medium">
              View All ({reservations.length})
            </Link>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[360px]">
            {reservations.map((res) => (
              <div
                key={res.id}
                className="flex items-center justify-between rounded-xl border border-meda-border bg-[#FDFBF7] p-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-meda-text">{res.reservation_number}</span>
                    <Badge variant={res.status as any}>{res.status.replace("_", " ")}</Badge>
                  </div>
                  <p className="text-meda-muted mt-0.5">
                    {res.guest?.first_name} {res.guest?.last_name} • Suite {res.assigned_room_number} ({res.room_type_name})
                  </p>
                  <p className="text-[11px] text-meda-muted">
                    {res.check_in_date} → {res.check_out_date}
                  </p>
                </div>

                <div className="text-right">
                  <span className="font-serif font-medium text-olive text-sm block">
                    {formatCurrency(res.total_amount)}
                  </span>
                  <span className="text-[10px] text-meda-muted uppercase">
                    {res.payment_status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Transactions Stream */}
        <div className="rounded-2xl border border-meda-border bg-[#FAF7F2] p-6 shadow-subtle flex flex-col">
          <div className="flex items-center justify-between border-b border-meda-border pb-4 mb-4">
            <h3 className="font-serif text-xl text-olive">Audited Payments Ledger</h3>
            <Link href="/admin/payments" className="text-xs text-olive hover:underline font-medium">
              Full Ledger ({payments.length})
            </Link>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[360px]">
            {payments.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-xl border border-meda-border bg-[#FDFBF7] p-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-3.5 w-3.5 text-botanical" />
                    <span className="font-semibold text-meda-text">{p.transaction_reference}</span>
                  </div>
                  <p className="text-meda-muted mt-0.5">
                    Channel: <span className="uppercase font-medium text-meda-text">{p.payment_method.replace("_", " ")}</span> • Ref #{p.recorded_by}
                  </p>
                  <p className="text-[10px] text-meda-muted">{p.notes}</p>
                </div>

                <div className="text-right">
                  <span className="font-serif font-medium text-[#245C3C] text-sm block">
                    +{formatCurrency(p.amount)}
                  </span>
                  <Badge variant="paid" className="text-[9px] py-0 px-1.5 mt-0.5">
                    Verified
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
