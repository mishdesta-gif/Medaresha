"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { PublicNavbar } from "@/components/public/navbar";
import { PublicFooter } from "@/components/public/footer";
import { hotelStore } from "@/lib/booking-engine";
import { formatCurrency, formatDateEditorial } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Calendar,
  Users,
  MapPin,
  Printer,
  Copy,
  ArrowRight,
  ShieldCheck,
  Building,
} from "lucide-react";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const reservationNumber = searchParams.get("reservationNumber") || "";

  const [copied, setCopied] = React.useState(false);

  // Retrieve reservation from store
  const reservation = React.useMemo(() => {
    if (!reservationNumber) return null;
    return hotelStore.reservations.find(
      (r) => r.reservation_number.toUpperCase() === reservationNumber.toUpperCase()
    );
  }, [reservationNumber]);

  const handleCopy = () => {
    if (reservationNumber) {
      navigator.clipboard.writeText(reservationNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  if (!reservation) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <h2 className="font-serif text-3xl text-olive">Reservation Not Found</h2>
        <p className="mt-2 text-sm text-meda-muted">
          We could not locate reference &ldquo;{reservationNumber}&rdquo;.
        </p>
        <Link href="/rooms" className="mt-4">
          <Button variant="primary">Browse Available Suites</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-meda-border bg-[#FAF7F2] p-8 shadow-elevated text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-botanical-pale text-botanical mb-4">
        <CheckCircle2 className="h-9 w-9" />
      </div>

      <span className="text-xs uppercase tracking-[0.25em] text-botanical font-medium">
        Reservation Confirmed
      </span>
      <h1 className="font-serif text-3xl sm:text-5xl text-meda-text mt-1">
        We look forward to welcoming you.
      </h1>
      <p className="mt-2 text-sm text-meda-muted">
        A confirmation receipt has been issued for your upcoming stay at Medaresha.
      </p>

      {/* Reference Box */}
      <div className="my-8 inline-flex flex-col items-center justify-center rounded-2xl border border-dashed border-olive/30 bg-sand/40 px-8 py-5">
        <span className="text-xs uppercase tracking-widest text-meda-muted">
          Reservation Reference
        </span>
        <div className="flex items-center gap-3 mt-1">
          <span className="font-serif text-3xl font-semibold tracking-wider text-olive">
            {reservation.reservation_number}
          </span>
          <button
            onClick={handleCopy}
            className="rounded-full bg-ivory p-1.5 text-meda-muted hover:text-olive shadow-sm transition-colors"
            title="Copy Reference"
          >
            <Copy className="h-4 w-4" />
          </button>
        </div>
        {copied && <span className="text-[11px] text-botanical mt-1">Copied to clipboard</span>}
      </div>

      {/* Reservation Breakdown Table */}
      <div className="rounded-2xl border border-meda-border bg-ivory text-left p-6 space-y-4">
        <div className="flex justify-between items-start border-b border-meda-border pb-4">
          <div>
            <h3 className="font-serif text-xl text-meda-text">{reservation.room_type_name}</h3>
            <p className="text-xs text-meda-muted mt-0.5">
              Guest: {reservation.guest?.first_name} {reservation.guest?.last_name}
            </p>
            <p className="text-xs text-meda-muted">Contact: {reservation.guest?.phone} • {reservation.guest?.email}</p>
          </div>
          <Badge variant="confirmed">Status: {reservation.status}</Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs text-meda-muted border-b border-meda-border pb-4">
          <div>
            <span className="block uppercase tracking-wider text-[10px]">Check-in</span>
            <span className="text-sm text-meda-text font-medium mt-0.5 block">
              {formatDateEditorial(reservation.check_in_date)}
            </span>
            <span className="text-[11px]">From 14:00</span>
          </div>
          <div>
            <span className="block uppercase tracking-wider text-[10px]">Check-out</span>
            <span className="text-sm text-meda-text font-medium mt-0.5 block">
              {formatDateEditorial(reservation.check_out_date)}
            </span>
            <span className="text-[11px]">By 11:00</span>
          </div>
        </div>

        {/* Financial Ledger Snapshot */}
        <div className="space-y-1.5 text-xs text-meda-muted">
          <div className="flex justify-between">
            <span>Room Charges</span>
            <span>{formatCurrency(reservation.subtotal_amount)}</span>
          </div>
          <div className="flex justify-between">
            <span>Service Charge (10%)</span>
            <span>{formatCurrency(reservation.service_charge_amount)}</span>
          </div>
          <div className="flex justify-between">
            <span>VAT (15%)</span>
            <span>{formatCurrency(reservation.vat_amount)}</span>
          </div>
          <div className="flex justify-between font-serif text-lg text-olive font-medium border-t border-meda-border pt-2 mt-2">
            <span>Total Amount</span>
            <span>{formatCurrency(reservation.total_amount)}</span>
          </div>
          <div className="flex justify-between text-xs pt-1">
            <span>Payment Status</span>
            <span className="capitalize font-medium text-meda-text">{reservation.payment_status}</span>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Button
          onClick={handlePrint}
          variant="outline"
          className="rounded-full text-xs uppercase tracking-wider flex items-center gap-2"
        >
          <Printer className="h-4 w-4" />
          Print Receipt
        </Button>
        <Link href="/">
          <Button
            variant="primary"
            className="rounded-full text-xs uppercase tracking-wider flex items-center gap-2"
          >
            Return to Home
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function BookingConfirmationPage() {
  return (
    <div className="min-h-screen flex flex-col bg-ivory">
      <PublicNavbar />
      <main className="flex-1 py-12 px-6 lg:px-12 max-w-3xl mx-auto w-full">
        <React.Suspense
          fallback={
            <div className="py-20 text-center text-sm text-meda-muted">
              Loading confirmation...
            </div>
          }
        >
          <ConfirmationContent />
        </React.Suspense>
      </main>
      <PublicFooter />
    </div>
  );
}
