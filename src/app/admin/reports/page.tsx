"use client";

import * as React from "react";
import { hotelStore } from "@/lib/booking-engine";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet, Calendar, DollarSign, TrendingUp } from "lucide-react";

export default function AdminReportsPage() {
  const metrics = hotelStore.getDashboardMetrics();
  const reservations = hotelStore.reservations;
  const payments = hotelStore.payments;

  const handleExportReservations = () => {
    const headers = "Ref Number,Guest,Suite,CheckIn,CheckOut,Adults,Status,Total ETB,Payment Status\n";
    const rows = reservations
      .map(
        (r) =>
          `"${r.reservation_number}","${r.guest?.first_name} ${r.guest?.last_name}","${r.assigned_room_number}","${r.check_in_date}","${r.check_out_date}","${r.num_adults}","${r.status}","${r.total_amount}","${r.payment_status}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `medaresha_reservations_report_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-meda-border pb-5">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-botanical font-medium">
            Executive Analytics
          </span>
          <h1 className="font-serif text-3xl font-medium text-meda-text">
            Operational & Financial Reports
          </h1>
          <p className="text-xs text-meda-muted mt-1">
            Generate and export hotel audit summaries, RevPAR indicators, and booking ledgers.
          </p>
        </div>

        <Button
          onClick={handleExportReservations}
          variant="primary"
          size="sm"
          className="rounded-full text-xs flex items-center gap-1.5"
        >
          <Download className="h-4 w-4" />
          Export All Stays (CSV)
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-meda-border bg-[#FAF7F2] p-6 shadow-subtle space-y-2">
          <span className="text-xs uppercase tracking-wider text-meda-muted">Total Gross Bookings</span>
          <div className="font-serif text-3xl font-medium text-olive">
            {formatCurrency(reservations.reduce((s, r) => s + r.total_amount, 0))}
          </div>
          <p className="text-xs text-meda-muted">Sum of all confirmed and pending reservations</p>
        </div>

        <div className="rounded-2xl border border-meda-border bg-[#FAF7F2] p-6 shadow-subtle space-y-2">
          <span className="text-xs uppercase tracking-wider text-meda-muted">Total Audited Revenue</span>
          <div className="font-serif text-3xl font-medium text-[#245C3C]">
            {formatCurrency(metrics.collectedRevenue)}
          </div>
          <p className="text-xs text-meda-muted">Verified settled payments across Telebirr, CBE, and Cash</p>
        </div>

        <div className="rounded-2xl border border-meda-border bg-[#FAF7F2] p-6 shadow-subtle space-y-2">
          <span className="text-xs uppercase tracking-wider text-meda-muted">Average Occupancy</span>
          <div className="font-serif text-3xl font-medium text-olive">
            {metrics.occupancyRatePercentage}%
          </div>
          <p className="text-xs text-meda-muted">Active in-house room utilization</p>
        </div>
      </div>
    </div>
  );
}
