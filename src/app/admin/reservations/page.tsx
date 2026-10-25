"use client";

import * as React from "react";
import { hotelStore } from "@/lib/booking-engine";
import { Reservation } from "@/lib/types";
import { formatCurrency, formatDateEditorial } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  DoorOpen,
  DollarSign,
  Calendar,
  X,
  User,
  Phone,
  Mail,
  Building,
} from "lucide-react";

export default function AdminReservationsPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [reservations, setReservations] = React.useState(() => [...hotelStore.reservations]);
  const [selectedRes, setSelectedRes] = React.useState<Reservation | null>(null);
  const [paymentAmount, setPaymentAmount] = React.useState("");
  const [paymentMethod, setPaymentMethod] = React.useState("cash");

  const filtered = reservations.filter((r) => {
    const matchesSearch =
      r.reservation_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.guest?.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.guest?.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.guest?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.guest?.phone.includes(searchTerm);

    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCheckIn = (resId: string) => {
    hotelStore.checkInGuest(resId);
    setReservations([...hotelStore.reservations]);
    if (selectedRes && selectedRes.id === resId) {
      setSelectedRes(hotelStore.reservations.find((r) => r.id === resId) || null);
    }
  };

  const handleCheckOut = (resId: string) => {
    hotelStore.checkOutGuest(resId);
    setReservations([...hotelStore.reservations]);
    if (selectedRes && selectedRes.id === resId) {
      setSelectedRes(hotelStore.reservations.find((r) => r.id === resId) || null);
    }
  };

  const handleCancel = (resId: string) => {
    const res = hotelStore.reservations.find((r) => r.id === resId);
    if (res) {
      res.status = "cancelled";
      res.updated_at = new Date().toISOString();
      setReservations([...hotelStore.reservations]);
      if (selectedRes && selectedRes.id === resId) {
        setSelectedRes({ ...res });
      }
    }
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRes || !paymentAmount) return;

    hotelStore.recordPayment({
      reservationId: selectedRes.id,
      amount: Number(paymentAmount),
      paymentMethod,
      reference: `REC-POS-${Date.now()}`,
      recordedBy: "Reception Desk",
      notes: "Front desk manual settlement",
    });

    setReservations([...hotelStore.reservations]);
    setSelectedRes(hotelStore.reservations.find((r) => r.id === selectedRes.id) || null);
    setPaymentAmount("");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-meda-border pb-5">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-botanical font-medium">
            Front Office
          </span>
          <h1 className="font-serif text-3xl font-medium text-meda-text">
            Reservation Management
          </h1>
          <p className="text-xs text-meda-muted mt-1">
            Browse, filter, inspect, and manage guest stays and folios
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 rounded-2xl border border-meda-border bg-[#FAF7F2] p-4 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-meda-muted" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by reference, guest name, email, or phone..."
            className="pl-9 h-10 bg-ivory text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-botanical" />
          <span className="text-meda-muted font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-meda-border bg-ivory px-3 py-2 text-xs text-meda-text focus:outline-none focus:ring-1 focus:ring-olive"
          >
            <option value="all">All Stays</option>
            <option value="confirmed">Confirmed</option>
            <option value="checked_in">Checked In</option>
            <option value="checked_out">Checked Out</option>
            <option value="awaiting_payment">Awaiting Payment</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table of Reservations */}
      <div className="rounded-2xl border border-meda-border bg-[#FAF7F2] overflow-hidden shadow-subtle">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-meda-text">
            <thead className="border-b border-meda-border bg-[#F5F0E6] text-[10px] font-semibold uppercase tracking-wider text-meda-muted">
              <tr>
                <th className="px-5 py-3.5">Ref #</th>
                <th className="px-5 py-3.5">Guest</th>
                <th className="px-5 py-3.5">Suite / Room</th>
                <th className="px-5 py-3.5">Stay Dates</th>
                <th className="px-5 py-3.5">Total & Payment</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-meda-border/60">
              {filtered.map((res) => (
                <tr key={res.id} className="hover:bg-sand/30 transition-colors">
                  <td className="px-5 py-4 font-semibold text-olive font-mono">
                    {res.reservation_number}
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-medium text-meda-text block">
                      {res.guest?.first_name} {res.guest?.last_name}
                    </span>
                    <span className="text-[11px] text-meda-muted">{res.guest?.phone}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-medium block">{res.room_type_name}</span>
                    <span className="text-[11px] text-botanical font-medium">
                      Suite {res.assigned_room_number || "Unassigned"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-meda-muted">
                    <span>{res.check_in_date}</span> → <span>{res.check_out_date}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-serif font-medium text-olive block text-sm">
                      {formatCurrency(res.total_amount)}
                    </span>
                    <Badge variant={res.payment_status as any} className="text-[9px] py-0 px-1.5 mt-0.5">
                      {res.payment_status}
                    </Badge>
                  </td>
                  <td className="px-5 py-4">
                    <Badge variant={res.status as any}>{res.status.replace("_", " ")}</Badge>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Button
                      onClick={() => setSelectedRes(res)}
                      variant="outline"
                      size="sm"
                      className="text-xs h-8 px-3"
                    >
                      Manage Folio
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reservation Details / Management Modal */}
      {selectedRes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-3xl border border-meda-border bg-[#FDFBF7] p-6 shadow-modal space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-meda-border pb-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-meda-muted font-mono">
                  Folio #{selectedRes.reservation_number}
                </span>
                <h3 className="font-serif text-2xl text-olive mt-0.5">
                  {selectedRes.room_type_name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRes(null)}
                className="rounded-full p-1.5 text-meda-muted hover:bg-sand"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Guest Summary */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-sand/30 p-4 rounded-xl border border-meda-border">
              <div>
                <span className="text-meda-muted block uppercase text-[10px]">Guest Name</span>
                <span className="font-medium text-meda-text mt-0.5 block">
                  {selectedRes.guest?.first_name} {selectedRes.guest?.last_name}
                </span>
                <span className="text-meda-muted">{selectedRes.guest?.country}</span>
              </div>
              <div>
                <span className="text-meda-muted block uppercase text-[10px]">Contact</span>
                <span className="text-meda-text block">{selectedRes.guest?.phone}</span>
                <span className="text-meda-text block">{selectedRes.guest?.email}</span>
              </div>
            </div>

            {/* Stay Dates and Room */}
            <div className="grid grid-cols-3 gap-4 text-xs border-y border-meda-border py-4">
              <div>
                <span className="text-meda-muted block uppercase text-[10px]">Check-in</span>
                <span className="font-medium">{selectedRes.check_in_date} (14:00)</span>
              </div>
              <div>
                <span className="text-meda-muted block uppercase text-[10px]">Check-out</span>
                <span className="font-medium">{selectedRes.check_out_date} (11:00)</span>
              </div>
              <div>
                <span className="text-meda-muted block uppercase text-[10px]">Assigned Suite</span>
                <span className="font-semibold text-olive">Room {selectedRes.assigned_room_number}</span>
              </div>
            </div>

            {/* Financial Status & Record Payment */}
            <div className="space-y-3 bg-[#FAF7F2] p-4 rounded-xl border border-meda-border text-xs">
              <div className="flex justify-between items-center">
                <span className="font-medium text-meda-text">Total Stay Charges</span>
                <span className="font-serif text-lg font-medium text-olive">
                  {formatCurrency(selectedRes.total_amount)}
                </span>
              </div>
              <div className="flex justify-between items-center text-meda-muted">
                <span>Payment Status</span>
                <Badge variant={selectedRes.payment_status as any}>{selectedRes.payment_status}</Badge>
              </div>

              {selectedRes.payment_status !== "paid" && (
                <form onSubmit={handleRecordPayment} className="pt-2 border-t border-meda-border/60 flex gap-2">
                  <Input
                    type="number"
                    placeholder="Amount (ETB)"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="h-9 text-xs"
                    required
                  />
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="rounded-xl border border-meda-border bg-ivory px-3 text-xs text-meda-text"
                  >
                    <option value="cash">Cash</option>
                    <option value="telebirr">Telebirr</option>
                    <option value="cbe_birr">CBE Birr</option>
                    <option value="credit_card">POS Card</option>
                  </select>
                  <Button type="submit" variant="primary" size="sm" className="h-9 px-4 text-xs">
                    Record Payment
                  </Button>
                </form>
              )}
            </div>

            {/* Front Desk State Actions */}
            <div className="flex flex-wrap gap-3 pt-2">
              {selectedRes.status !== "checked_in" && selectedRes.status !== "checked_out" && selectedRes.status !== "cancelled" && (
                <Button
                  onClick={() => handleCheckIn(selectedRes.id)}
                  variant="primary"
                  className="rounded-full text-xs flex items-center gap-1.5"
                >
                  <DoorOpen className="h-4 w-4" />
                  Check In Guest
                </Button>
              )}

              {selectedRes.status === "checked_in" && (
                <Button
                  onClick={() => handleCheckOut(selectedRes.id)}
                  variant="botanical"
                  className="rounded-full text-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Check Out Guest (Mark Dirty)
                </Button>
              )}

              {selectedRes.status !== "cancelled" && selectedRes.status !== "checked_out" && (
                <Button
                  onClick={() => handleCancel(selectedRes.id)}
                  variant="danger"
                  className="rounded-full text-xs flex items-center gap-1.5"
                >
                  <XCircle className="h-4 w-4" />
                  Cancel Stay
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
