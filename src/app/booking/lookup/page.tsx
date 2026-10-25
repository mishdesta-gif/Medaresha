"use client";

import * as React from "react";
import Link from "next/link";
import { PublicNavbar } from "@/components/public/navbar";
import { PublicFooter } from "@/components/public/footer";
import { hotelStore } from "@/lib/booking-engine";
import { Reservation } from "@/lib/types";
import { formatCurrency, formatDateEditorial } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ShieldAlert, Calendar, Users, Building, ShieldCheck } from "lucide-react";

export default function BookingLookupPage() {
  const [reservationNumber, setReservationNumber] = React.useState("");
  const [emailOrPhone, setEmailOrPhone] = React.useState("");
  const [reservation, setReservation] = React.useState<Reservation | null>(null);
  const [searched, setSearched] = React.useState(false);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    const result = hotelStore.lookupReservation(reservationNumber, emailOrPhone);
    setReservation(result);
  };

  return (
    <div className="min-h-screen flex flex-col bg-ivory">
      <PublicNavbar />

      <main className="flex-1 py-12 px-6 lg:px-12 max-w-2xl mx-auto w-full">
        <div className="text-center mb-8">
          <span className="text-xs uppercase tracking-[0.25em] text-botanical font-medium">
            Guest Portal
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-meda-text mt-1">
            Find Your Reservation
          </h1>
          <p className="mt-2 text-sm text-meda-muted">
            Enter your booking reference code along with your associated email or phone number to view stay details.
          </p>
        </div>

        {/* Lookup Form */}
        <form
          onSubmit={handleLookup}
          className="rounded-2xl border border-meda-border bg-[#FBF8F2] p-6 shadow-subtle space-y-4"
        >
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-meda-muted mb-1">
              Reservation Reference
            </label>
            <Input
              required
              placeholder="e.g. MED-91204"
              value={reservationNumber}
              onChange={(e) => setReservationNumber(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-meda-muted mb-1">
              Guest Email or Phone Number
            </label>
            <Input
              required
              placeholder="e.g. abebe.kebede@example.com or +251 9..."
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full rounded-full text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2"
          >
            <Search className="h-4 w-4" />
            Lookup Reservation
          </Button>
        </form>

        {/* Results Area */}
        {searched && (
          <div className="mt-8">
            {reservation ? (
              <div className="rounded-2xl border border-meda-border bg-[#FBF8F2] p-6 shadow-elevated space-y-4">
                <div className="flex justify-between items-start border-b border-meda-border pb-4">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-meda-muted">
                      Reservation #{reservation.reservation_number}
                    </span>
                    <h3 className="font-serif text-2xl text-meda-text mt-0.5">
                      {reservation.room_type_name}
                    </h3>
                    <p className="text-xs text-meda-muted mt-1">
                      Guest: {reservation.guest?.first_name} {reservation.guest?.last_name}
                    </p>
                  </div>
                  <Badge variant={reservation.status as any}>
                    {reservation.status.replace("_", " ").toUpperCase()}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs text-meda-muted border-b border-meda-border pb-4">
                  <div>
                    <span className="block uppercase tracking-wider text-[10px]">Check-in Date</span>
                    <span className="text-sm text-meda-text font-medium mt-0.5 block">
                      {formatDateEditorial(reservation.check_in_date)}
                    </span>
                    <span className="text-[11px]">From 14:00</span>
                  </div>
                  <div>
                    <span className="block uppercase tracking-wider text-[10px]">Check-out Date</span>
                    <span className="text-sm text-meda-text font-medium mt-0.5 block">
                      {formatDateEditorial(reservation.check_out_date)}
                    </span>
                    <span className="text-[11px]">By 11:00</span>
                  </div>
                </div>

                {reservation.assigned_room_number && (
                  <div className="flex items-center gap-2 text-xs text-meda-text bg-sand/40 p-3 rounded-xl border border-meda-border">
                    <Building className="h-4 w-4 text-botanical" />
                    <span>Allocated Physical Room: <strong>Suite {reservation.assigned_room_number}</strong></span>
                  </div>
                )}

                <div className="space-y-1.5 text-xs text-meda-muted pt-1">
                  <div className="flex justify-between font-serif text-base text-olive font-medium">
                    <span>Total Booking Price</span>
                    <span>{formatCurrency(reservation.total_amount)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Payment Status</span>
                    <span className="capitalize font-medium text-meda-text">
                      {reservation.payment_status}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-meda-border bg-[#FBEAE9] p-6 text-center text-xs text-[#A3322B] flex flex-col items-center gap-2">
                <ShieldAlert className="h-6 w-6" />
                <p className="font-medium">No matching reservation found</p>
                <p className="text-[11px] text-meda-muted">
                  Please verify that your booking reference and contact information match the details provided during reservation.
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      <PublicFooter />
    </div>
  );
}
