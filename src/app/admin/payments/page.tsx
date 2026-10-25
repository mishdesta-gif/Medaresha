"use client";

import * as React from "react";
import { hotelStore } from "@/lib/booking-engine";
import { formatCurrency, formatDateEditorial } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CreditCard, DollarSign, Filter, Search, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = React.useState(() => [...hotelStore.payments]);
  const [methodFilter, setMethodFilter] = React.useState("all");

  const filtered = payments.filter((p) => {
    if (methodFilter === "all") return true;
    return p.payment_method === methodFilter;
  });

  const totalCollected = filtered.reduce((sum, p) => sum + p.amount, 0);

  const handleExportCSV = () => {
    const headers = "Transaction Ref,Reservation ID,Amount,Currency,Method,Status,Recorded By,Date\n";
    const rows = filtered
      .map(
        (p) =>
          `"${p.transaction_reference}","${p.reservation_id}","${p.amount}","${p.currency}","${p.payment_method}","${p.payment_status}","${p.recorded_by}","${p.created_at}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `medaresha_payments_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-meda-border pb-5">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-botanical font-medium">
            Financial Ledger
          </span>
          <h1 className="font-serif text-3xl font-medium text-meda-text">
            Payments & Audited Transactions
          </h1>
          <p className="text-xs text-meda-muted mt-1">
            Complete financial audit trail with Ethiopian payment provider records (Telebirr, CBE Birr, Cash, Wire).
          </p>
        </div>

        <Button
          onClick={handleExportCSV}
          variant="outline"
          size="sm"
          className="rounded-full text-xs flex items-center gap-1.5"
        >
          <Download className="h-4 w-4" />
          Export Payments CSV
        </Button>
      </div>

      {/* Summary Banner */}
      <div className="rounded-2xl border border-meda-border bg-[#FAF7F2] p-5 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-meda-muted">Total Filtered Settlement</span>
          <div className="font-serif text-3xl font-medium text-olive mt-1">
            {formatCurrency(totalCollected)}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Filter className="h-4 w-4 text-botanical" />
          <span className="text-meda-muted font-medium">Payment Method:</span>
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="rounded-xl border border-meda-border bg-ivory px-3 py-1.5 text-xs text-meda-text"
          >
            <option value="all">All Channels</option>
            <option value="telebirr">Telebirr</option>
            <option value="cbe_birr">CBE Birr</option>
            <option value="bank_transfer">Bank Wire</option>
            <option value="cash">Cash / POS</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="rounded-2xl border border-meda-border bg-[#FAF7F2] overflow-hidden shadow-subtle">
        <table className="w-full text-left text-xs text-meda-text">
          <thead className="border-b border-meda-border bg-[#F5F0E6] text-[10px] font-semibold uppercase tracking-wider text-meda-muted">
            <tr>
              <th className="px-5 py-3.5">Reference #</th>
              <th className="px-5 py-3.5">Reservation</th>
              <th className="px-5 py-3.5">Amount (ETB)</th>
              <th className="px-5 py-3.5">Channel</th>
              <th className="px-5 py-3.5">Recorded By</th>
              <th className="px-5 py-3.5">Timestamp</th>
              <th className="px-5 py-3.5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-meda-border/60">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-sand/30 transition-colors">
                <td className="px-5 py-4 font-mono font-semibold text-olive">
                  {p.transaction_reference}
                </td>
                <td className="px-5 py-4 font-mono text-meda-muted">{p.reservation_id}</td>
                <td className="px-5 py-4 font-serif text-sm font-medium text-[#245C3C]">
                  +{formatCurrency(p.amount)}
                </td>
                <td className="px-5 py-4 uppercase font-medium">{p.payment_method.replace("_", " ")}</td>
                <td className="px-5 py-4 text-meda-muted">{p.recorded_by || "System"}</td>
                <td className="px-5 py-4 text-meda-muted">{p.created_at}</td>
                <td className="px-5 py-4">
                  <Badge variant="paid">Settled</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
