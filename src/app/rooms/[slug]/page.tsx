"use client";

import * as React from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { PublicNavbar } from "@/components/public/navbar";
import { PublicFooter } from "@/components/public/footer";
import { INITIAL_ROOM_TYPES, INITIAL_PROPERTY } from "@/data/mock-database";
import { formatCurrency, calculateNights } from "@/lib/utils";
import { calculateReservationPrice } from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import {
  Users,
  Bed,
  Maximize2,
  Clock,
  ShieldCheck,
  Calendar,
  Check,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

function RoomDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const slug = params?.slug as string;
  const room = INITIAL_ROOM_TYPES.find((r) => r.slug === slug);

  // Initial dates from query or defaults
  const today = new Date();
  const defaultIn = new Date(today);
  defaultIn.setDate(today.getDate() + 1);
  const defaultOut = new Date(today);
  defaultOut.setDate(today.getDate() + 4);

  const [checkIn, setCheckIn] = React.useState(
    searchParams.get("checkIn") || defaultIn.toISOString().split("T")[0]
  );
  const [checkOut, setCheckOut] = React.useState(
    searchParams.get("checkOut") || defaultOut.toISOString().split("T")[0]
  );
  const [adults, setAdults] = React.useState(
    Number(searchParams.get("adults")) || 2
  );

  if (!room) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <h2 className="font-serif text-3xl text-olive">Room Category Not Found</h2>
        <p className="mt-2 text-sm text-meda-muted">The requested suite does not exist.</p>
        <Link href="/rooms" className="mt-4">
          <Button variant="primary">Return to All Suites</Button>
        </Link>
      </div>
    );
  }

  // Calculate dynamic quote if dates valid
  let nights = 0;
  let priceQuote = null;
  let quoteError = null;

  try {
    nights = calculateNights(checkIn, checkOut);
    if (nights > 0) {
      priceQuote = calculateReservationPrice({
        checkInDate: checkIn,
        checkOutDate: checkOut,
        basePricePerNight: room.base_price_per_night,
        numAdults: adults,
        maxStandardAdults: room.max_adults,
        extraPersonFee: room.extra_person_fee,
        serviceChargeRate: 0.10,
        vatRate: 0.15,
        currency: INITIAL_PROPERTY.currency,
      });
    }
  } catch (err: any) {
    quoteError = err.message;
  }

  const handleProceedToBooking = () => {
    router.push(
      `/booking?roomTypeId=${room.id}&checkIn=${encodeURIComponent(
        checkIn
      )}&checkOut=${encodeURIComponent(checkOut)}&adults=${adults}`
    );
  };

  return (
    <>
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/rooms"
          className="inline-flex items-center gap-1.5 text-xs text-meda-muted hover:text-olive transition-colors uppercase tracking-wider"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Suites
        </Link>
      </div>

      {/* Gallery Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-12">
        <div className="lg:col-span-2 aspect-[16/10] overflow-hidden rounded-2xl bg-sand border border-meda-border">
          <img
            src={room.images?.[0]?.image_url || "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80"}
            alt={room.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="hidden lg:flex flex-col gap-4">
          <div className="aspect-[16/10] overflow-hidden rounded-2xl bg-sand border border-meda-border flex-1">
            <img
              src={room.images?.[1]?.image_url || "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80"}
              alt={`${room.name} detail`}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="aspect-[16/10] overflow-hidden rounded-2xl bg-sand border border-meda-border flex-1">
            <img
              src="https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80"
              alt="Medaresha Ambience"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Suite Details & Booking Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-botanical font-medium">
              Sanctuary Overview
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-meda-text mt-1">
              {room.name}
            </h1>
            <p className="mt-4 text-base text-meda-text/80 leading-relaxed">
              {room.full_description}
            </p>
          </div>

          {/* Key Specs */}
          <div className="grid grid-cols-3 gap-4 border-y border-meda-border py-6 text-center">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-meda-muted block">
                Capacity
              </span>
              <span className="font-serif text-xl text-olive mt-1 block">
                Up to {room.max_occupancy} Guests
              </span>
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-meda-muted block">
                Bedding
              </span>
              <span className="font-serif text-xl text-olive mt-1 block">
                {room.bed_configuration}
              </span>
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-meda-muted block">
                Dimension
              </span>
              <span className="font-serif text-xl text-olive mt-1 block">
                {room.size_sqm} m²
              </span>
            </div>
          </div>

          {/* Amenities Included */}
          <div>
            <h3 className="font-serif text-2xl text-meda-text mb-4">Suite Amenities</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {room.amenities?.map((amenity) => (
                <div
                  key={amenity.id}
                  className="flex items-center gap-3 rounded-xl border border-meda-border bg-[#FAF7F2] p-3 text-sm text-meda-text"
                >
                  <div className="rounded-full bg-sand p-1.5 text-botanical">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span>{amenity.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stay Policies */}
          <div className="rounded-2xl border border-meda-border bg-sand/40 p-6 space-y-3">
            <h4 className="font-serif text-xl text-olive flex items-center gap-2">
              <Clock className="h-4 w-4 text-botanical" />
              Hotel Policies & Timings
            </h4>
            <ul className="text-xs text-meda-muted space-y-1.5 list-disc pl-4">
              <li>Check-in: From 14:00 (Early arrival upon request and availability)</li>
              <li>Check-out: By 11:00</li>
              <li>Complimentary cancellation up to 48 hours prior to arrival</li>
              <li>100% smoke-free property</li>
            </ul>
          </div>
        </div>

        {/* Sticky Booking Engine Box */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 rounded-2xl border border-meda-border bg-[#F8F4EC] p-6 shadow-elevated">
            <div className="mb-4 pb-4 border-b border-meda-border">
              <span className="text-[11px] uppercase tracking-wider text-meda-muted">
                Nightly Rate
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="font-serif text-3xl font-medium text-olive">
                  {formatCurrency(room.base_price_per_night)}
                </span>
                <span className="text-xs text-meda-muted">/ night</span>
              </div>
            </div>

            {/* Date Selection */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-meda-muted mb-1">
                  Check-in Date
                </label>
                <input
                  type="date"
                  value={checkIn}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full rounded-xl border border-meda-border bg-ivory px-3 py-2 text-sm text-meda-text focus:outline-none focus:ring-1 focus:ring-olive"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-meda-muted mb-1">
                  Check-out Date
                </label>
                <input
                  type="date"
                  value={checkOut}
                  min={checkIn}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full rounded-xl border border-meda-border bg-ivory px-3 py-2 text-sm text-meda-text focus:outline-none focus:ring-1 focus:ring-olive"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-meda-muted mb-1">
                  Guests
                </label>
                <select
                  value={adults}
                  onChange={(e) => setAdults(Number(e.target.value))}
                  className="w-full rounded-xl border border-meda-border bg-ivory px-3 py-2 text-sm text-meda-text focus:outline-none focus:ring-1 focus:ring-olive"
                >
                  {Array.from({ length: room.max_occupancy }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? "Guest" : "Guests"}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Breakdown */}
              {priceQuote && (
                <div className="rounded-xl border border-meda-border bg-ivory/80 p-4 space-y-2 text-xs">
                  <div className="flex justify-between text-meda-muted">
                    <span>
                      {formatCurrency(room.base_price_per_night)} × {nights} {nights === 1 ? "night" : "nights"}
                    </span>
                    <span>{formatCurrency(priceQuote.roomSubtotal)}</span>
                  </div>

                  {priceQuote.extraGuestsCharge > 0 && (
                    <div className="flex justify-between text-meda-muted">
                      <span>Extra Guest Surcharge</span>
                      <span>{formatCurrency(priceQuote.extraGuestsCharge)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-meda-muted">
                    <span>Service Charge (10%)</span>
                    <span>{formatCurrency(priceQuote.serviceCharge)}</span>
                  </div>

                  <div className="flex justify-between text-meda-muted">
                    <span>VAT (15%)</span>
                    <span>{formatCurrency(priceQuote.vat)}</span>
                  </div>

                  <div className="border-t border-meda-border pt-2 flex justify-between font-serif text-base text-olive font-medium">
                    <span>Total Stay Price</span>
                    <span>{formatCurrency(priceQuote.total)}</span>
                  </div>
                </div>
              )}

              {quoteError && <p className="text-xs text-[#A3322B]">{quoteError}</p>}

              <Button
                onClick={handleProceedToBooking}
                variant="primary"
                className="w-full rounded-full py-3 text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2"
                disabled={nights <= 0}
              >
                Reserve This Suite
                <ArrowRight className="h-4 w-4" />
              </Button>

              <p className="text-[11px] text-center text-meda-muted flex items-center justify-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-botanical" />
                Instant confirmation • No booking fee
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function RoomDetailPage() {
  return (
    <div className="min-h-screen flex flex-col bg-ivory">
      <PublicNavbar />
      <main className="flex-1 py-10 px-6 lg:px-12 max-w-7xl mx-auto w-full">
        <React.Suspense
          fallback={
            <div className="py-20 text-center text-sm text-meda-muted">
              Loading suite details...
            </div>
          }
        >
          <RoomDetailContent />
        </React.Suspense>
      </main>
      <PublicFooter />
    </div>
  );
}
