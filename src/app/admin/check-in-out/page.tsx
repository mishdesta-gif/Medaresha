"use client";

import * as React from "react";
import { hotelStore } from "@/lib/booking-engine";
import { Reservation } from "@/lib/types";
import { formatCurrency, formatDateEditorial } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DoorOpen,
  DoorClosed,
  CheckCircle2,
  Users,
  Calendar,
  DollarSign,
  PlusCircle,
  AlertCircle,
} from "lucide-react";

export default function ReceptionCheckInOutPage() {
  const [activeTab, setActiveTab] = React.useState<"arrivals" | "inhouse" | "departures">("arrivals");
  const [reservations, setReservations] = React.useState(() => [...hotelStore.reservations]);
  const [selectedRes, setSelectedRes] = React.useState<Reservation | null>(null);

  // Additional charge state
  const [extraChargeTitle, setExtraChargeTitle] = React.useState("");
  const [extraChargeAmount, setExtraChargeAmount] = React.useState("");
  const [message, setMessage] = React.useState<string | null>(null);

  const today = new Date().toISOString().split("T")[0];

  // Tab groupings
  const arrivals = reservations.filter(
    (r) => r.status === "confirmed" || r.status === "awaiting_payment"
  );
  const inHouse = reservations.filter((r) => r.status === "checked_in");
  const departures = reservations.filter((r) => r.status === "checked_out");

  const handleCheckIn = (resId: string) => {
    try {
      hotelStore.checkInGuest(resId);
      setReservations([...hotelStore.reservations]);
      setMessage("Guest successfully checked in. Room marked occupied.");
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    }
  };

  const handleCheckOut = (resId: string) => {
    try {
      hotelStore.checkOutGuest(resId);
      setReservations([...hotelStore.reservations]);
      setMessage("Guest checked out. Room automatically flagged DIRTY for Housekeeping turnover.");
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    }
  };

  const handleAddFolioCharge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRes || !extraChargeAmount) return;

    const chargeNum = Number(extraChargeAmount);
    selectedRes.total_amount += chargeNum;
    selectedRes.payment_status = "partially_paid";
    selectedRes.updated_at = new Date().toISOString();

    setReservations([...hotelStore.reservations]);
    setExtraChargeTitle("");
    setExtraChargeAmount("");
    setMessage(`Added ${formatCurrency(chargeNum)} to guest folio.`);
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-meda-border pb-5">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-botanical font-medium">
            Front Desk Operations
          </span>
          <h1 className="font-serif text-3xl font-medium text-meda-text">
            Reception Check-In & Check-Out Console
          </h1>
          <p className="text-xs text-meda-muted mt-1">
            Streamlined guest registration, key assignment, incidental folio charges, and automatic housekeeping handoff
          </p>
        </div>
      </div>

      {message && (
        <div className="rounded-xl border border-botanical/30 bg-botanical-pale p-4 text-xs text-olive flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-botanical shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-meda-border pb-2 text-xs">
        <button
          onClick={() => setActiveTab("arrivals")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 font-medium transition-colors ${
            activeTab === "arrivals"
              ? "bg-olive text-ivory"
              : "bg-sand text-meda-text hover:bg-sand-dark"
          }`}
        >
          <DoorOpen className="h-4 w-4" />
          <span>Arrivals / Pending Check-In ({arrivals.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("inhouse")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 font-medium transition-colors ${
            activeTab === "inhouse"
              ? "bg-olive text-ivory"
              : "bg-sand text-meda-text hover:bg-sand-dark"
          }`}
        >
          <Users className="h-4 w-4" />
          <span>In-House Guests ({inHouse.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("departures")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 font-medium transition-colors ${
            activeTab === "departures"
              ? "bg-olive text-ivory"
              : "bg-sand text-meda-text hover:bg-sand-dark"
          }`}
        >
          <DoorClosed className="h-4 w-4" />
          <span>Recent Departures ({departures.length})</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeTab === "arrivals" &&
          arrivals.map((res) => (
            <div
              key={res.id}
              className="rounded-2xl border border-meda-border bg-[#FAF7F2] p-5 shadow-subtle flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-olive">
                    #{res.reservation_number}
                  </span>
                  <Badge variant={res.payment_status as any}>{res.payment_status}</Badge>
                </div>
                <h3 className="font-serif text-xl text-meda-text mt-1">
                  {res.guest?.first_name} {res.guest?.last_name}
                </h3>
                <p className="text-xs text-meda-muted">{res.guest?.phone} • {res.guest?.email}</p>

                <div className="my-3 grid grid-cols-2 gap-2 text-xs border-y border-meda-border/60 py-2.5">
                  <div>
                    <span className="text-meda-muted block text-[10px] uppercase">Assigned Suite</span>
                    <span className="font-semibold text-olive">Suite {res.assigned_room_number}</span>
                  </div>
                  <div>
                    <span className="text-meda-muted block text-[10px] uppercase">Stay Duration</span>
                    <span>{res.check_in_date} → {res.check_out_date}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-meda-muted">Total Folio Charge:</span>
                  <span className="font-serif text-base font-medium text-olive">
                    {formatCurrency(res.total_amount)}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-meda-border flex gap-2">
                <Button
                  onClick={() => handleCheckIn(res.id)}
                  variant="primary"
                  size="sm"
                  className="flex-1 rounded-full text-xs flex items-center justify-center gap-1.5"
                >
                  <DoorOpen className="h-3.5 w-3.5" />
                  Perform Check-In
                </Button>
              </div>
            </div>
          ))}

        {activeTab === "inhouse" &&
          inHouse.map((res) => (
            <div
              key={res.id}
              className="rounded-2xl border border-meda-border bg-[#FAF7F2] p-5 shadow-subtle flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-olive">
                    #{res.reservation_number}
                  </span>
                  <Badge variant="checked_in">In-House</Badge>
                </div>
                <h3 className="font-serif text-xl text-meda-text mt-1">
                  {res.guest?.first_name} {res.guest?.last_name}
                </h3>
                <span className="text-xs font-medium text-botanical">
                  Occupying Suite {res.assigned_room_number} ({res.room_type_name})
                </span>

                <div className="my-3 text-xs border-y border-meda-border/60 py-2.5 space-y-1">
                  <div className="flex justify-between text-meda-muted">
                    <span>Departure Date:</span>
                    <span>{res.check_out_date} (11:00 AM)</span>
                  </div>
                  <div className="flex justify-between text-meda-muted">
                    <span>Folio Total:</span>
                    <span className="font-serif font-medium text-olive">{formatCurrency(res.total_amount)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-2 space-y-2">
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleCheckOut(res.id)}
                    variant="botanical"
                    size="sm"
                    className="flex-1 rounded-full text-xs flex items-center justify-center gap-1.5"
                  >
                    <DoorClosed className="h-3.5 w-3.5" />
                    Check Out & Mark Dirty
                  </Button>
                  <Button
                    onClick={() => setSelectedRes(res)}
                    variant="outline"
                    size="sm"
                    className="rounded-full text-xs"
                  >
                    + Charge
                  </Button>
                </div>
              </div>
            </div>
          ))}

        {activeTab === "departures" &&
          departures.map((res) => (
            <div
              key={res.id}
              className="rounded-2xl border border-meda-border bg-[#FAF7F2] p-5 shadow-subtle opacity-80"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-olive">
                  #{res.reservation_number}
                </span>
                <Badge variant="checked_out">Checked Out</Badge>
              </div>
              <h3 className="font-serif text-lg text-meda-text mt-1">
                {res.guest?.first_name} {res.guest?.last_name}
              </h3>
              <p className="text-xs text-meda-muted">Departed from Suite {res.assigned_room_number}</p>
            </div>
          ))}
      </div>

      {/* Add Incidentals Modal */}
      {selectedRes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-meda-border bg-[#FDFBF7] p-6 shadow-modal space-y-4">
            <h3 className="font-serif text-xl text-olive">
              Post Charge to Suite {selectedRes.assigned_room_number} Folio
            </h3>
            <p className="text-xs text-meda-muted">
              Guest: {selectedRes.guest?.first_name} {selectedRes.guest?.last_name}
            </p>

            <form onSubmit={handleAddFolioCharge} className="space-y-3">
              <div>
                <label className="block text-xs text-meda-muted mb-1">Item / Description</label>
                <Input
                  required
                  placeholder="e.g. Minibar, Room Service, Laundry, Spa"
                  value={extraChargeTitle}
                  onChange={(e) => setExtraChargeTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs text-meda-muted mb-1">Amount (ETB)</label>
                <Input
                  type="number"
                  required
                  placeholder="e.g. 1200"
                  value={extraChargeAmount}
                  onChange={(e) => setExtraChargeAmount(e.target.value)}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="submit" variant="primary" size="sm" className="flex-1 rounded-full">
                  Post Charge
                </Button>
                <Button
                  type="button"
                  onClick={() => setSelectedRes(null)}
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
