"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { PublicNavbar } from "@/components/public/navbar";
import { PublicFooter } from "@/components/public/footer";
import { INITIAL_ROOM_TYPES, INITIAL_PROPERTY } from "@/data/mock-database";
import { calculateReservationPrice } from "@/lib/pricing";
import { formatCurrency, calculateNights, formatDateEditorial } from "@/lib/utils";
import { hotelStore } from "@/lib/booking-engine";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Lock,
  Calendar,
  Users,
  ShieldCheck,
  AlertCircle,
  CreditCard,
  Building,
  Smartphone,
  Banknote,
  ArrowLeft,
} from "lucide-react";

function BookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Search parameters
  const roomTypeId = searchParams.get("roomTypeId") || INITIAL_ROOM_TYPES[0].id;
  const checkIn = searchParams.get("checkIn") || "2026-10-25";
  const checkOut = searchParams.get("checkOut") || "2026-10-28";
  const adults = Number(searchParams.get("adults")) || 2;

  const roomType = INITIAL_ROOM_TYPES.find((r) => r.id === roomTypeId) || INITIAL_ROOM_TYPES[0];
  const nights = calculateNights(checkIn, checkOut);

  // Form State
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [country, setCountry] = React.useState("Ethiopia");
  const [specialRequests, setSpecialRequests] = React.useState("");
  const [paymentMethod, setPaymentMethod] = React.useState("cash");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // Client-generated idempotency key
  const [idempotencyKey] = React.useState(() =>
    typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `idemp-${Date.now()}`
  );

  // Authoritative Pricing calculation
  const priceQuote = React.useMemo(() => {
    try {
      if (nights <= 0) return null;
      return calculateReservationPrice({
        checkInDate: checkIn,
        checkOutDate: checkOut,
        basePricePerNight: roomType.base_price_per_night,
        numAdults: adults,
        maxStandardAdults: roomType.max_adults,
        extraPersonFee: roomType.extra_person_fee,
        serviceChargeRate: 0.10,
        vatRate: 0.15,
        currency: INITIAL_PROPERTY.currency,
      });
    } catch {
      return null;
    }
  }, [checkIn, checkOut, roomType, adults, nights]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!firstName || !lastName || !email || !phone) {
      setErrorMessage("Please complete all required guest contact fields.");
      return;
    }

    if (nights <= 0) {
      setErrorMessage("Invalid stay dates. Please choose valid dates.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Execute Atomic Booking via Booking Engine
      const result = hotelStore.createReservation({
        roomTypeId: roomType.id,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        numAdults: adults,
        numChildren: 0,
        guest: {
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
          country,
        },
        paymentMethod,
        idempotencyKey,
        specialRequests,
      });

      if (!result.success || !result.reservation) {
        setErrorMessage(result.error || "Failed to create reservation. Room may have just been booked.");
        setIsSubmitting(false);
        return;
      }

      // Success: redirect to confirmation
      router.push(`/booking/confirmation?reservationNumber=${result.reservation.reservation_number}`);
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-meda-border pb-4">
        <Link
          href={`/rooms/${roomType.slug}`}
          className="flex items-center gap-1.5 text-xs text-meda-muted hover:text-olive uppercase tracking-wider"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Suite
        </Link>
        <span className="font-serif text-2xl tracking-[0.2em] text-olive font-medium">
          RESERVATION CHECKOUT
        </span>
        <div className="flex items-center gap-1 text-xs text-botanical font-medium">
          <Lock className="h-3.5 w-3.5" />
          <span>Secure</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Selected Suite Row (MOYA Inspiration cart layout) */}
        <div className="rounded-2xl border border-meda-border bg-[#FBF8F2] p-5 shadow-subtle flex flex-col sm:flex-row items-center gap-5">
          <div className="h-24 w-32 shrink-0 overflow-hidden rounded-xl bg-sand">
            <img
              src={roomType.images?.[0]?.image_url || "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80"}
              alt={roomType.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <h3 className="font-serif text-xl text-meda-text">{roomType.name}</h3>
              <span className="font-serif text-lg font-medium text-olive">
                {formatCurrency(roomType.base_price_per_night)} / night
              </span>
            </div>
            <p className="text-xs text-meda-muted mt-1">{roomType.bed_configuration}</p>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-meda-muted border-t border-meda-border/60 pt-2">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-botanical" />
                {formatDateEditorial(checkIn)} → {formatDateEditorial(checkOut)} ({nights} nights)
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5 text-botanical" />
                {adults} {adults === 1 ? "Guest" : "Guests"}
              </span>
            </div>
          </div>
        </div>

        {/* Guest Information */}
        <div className="rounded-2xl border border-meda-border bg-[#FBF8F2] p-6 shadow-subtle space-y-4">
          <h4 className="font-serif text-xl text-olive">Guest Information</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-meda-muted mb-1">
                First Name *
              </label>
              <Input
                required
                placeholder="e.g. Abebe"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-meda-muted mb-1">
                Last Name *
              </label>
              <Input
                required
                placeholder="e.g. Kebede"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-meda-muted mb-1">
                Email Address *
              </label>
              <Input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-meda-muted mb-1">
                Phone Number (Ethiopian or International) *
              </label>
              <Input
                required
                placeholder="+251 911 234 567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium uppercase tracking-wider text-meda-muted mb-1">
                Country of Residence
              </label>
              <Input
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Ethiopia"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium uppercase tracking-wider text-meda-muted mb-1">
                Special Requests (Optional)
              </label>
              <textarea
                rows={2}
                className="w-full rounded-xl border border-meda-border bg-[#FDFBF7] p-3 text-sm text-meda-text focus:outline-none focus:ring-1 focus:ring-olive"
                placeholder="Flight arrival time, dietary preferences, high floor..."
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="rounded-2xl border border-meda-border bg-[#FBF8F2] p-6 shadow-subtle space-y-4">
          <h4 className="font-serif text-xl text-olive">Payment Preference</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <label
              className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-colors ${
                paymentMethod === "cash"
                  ? "border-olive bg-sand/60 font-medium"
                  : "border-meda-border bg-[#FDFBF7] hover:bg-sand/30"
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="cash"
                checked={paymentMethod === "cash"}
                onChange={() => setPaymentMethod("cash")}
                className="mt-0.5 text-olive focus:ring-olive"
              />
              <div>
                <span className="flex items-center gap-1.5 font-medium text-meda-text">
                  <Banknote className="h-4 w-4 text-botanical" />
                  Pay Upon Check-in at Hotel
                </span>
                <p className="text-meda-muted mt-1 leading-relaxed">
                  Settle by Cash, POS Card, or local Mobile Money directly at the reception desk.
                </p>
              </div>
            </label>

            <label
              className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-colors ${
                paymentMethod === "telebirr"
                  ? "border-olive bg-sand/60 font-medium"
                  : "border-meda-border bg-[#FDFBF7] hover:bg-sand/30"
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="telebirr"
                checked={paymentMethod === "telebirr"}
                onChange={() => setPaymentMethod("telebirr")}
                className="mt-0.5 text-olive focus:ring-olive"
              />
              <div>
                <span className="flex items-center gap-1.5 font-medium text-meda-text">
                  <Smartphone className="h-4 w-4 text-botanical" />
                  Telebirr SuperApp
                </span>
                <p className="text-meda-muted mt-1 leading-relaxed">
                  Pay instantly via Telebirr merchant code with SMS payment confirmation.
                </p>
              </div>
            </label>

            <label
              className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-colors ${
                paymentMethod === "cbe_birr"
                  ? "border-olive bg-sand/60 font-medium"
                  : "border-meda-border bg-[#FDFBF7] hover:bg-sand/30"
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="cbe_birr"
                checked={paymentMethod === "cbe_birr"}
                onChange={() => setPaymentMethod("cbe_birr")}
                className="mt-0.5 text-olive focus:ring-olive"
              />
              <div>
                <span className="flex items-center gap-1.5 font-medium text-meda-text">
                  <Building className="h-4 w-4 text-botanical" />
                  CBE Birr / Commercial Bank
                </span>
                <p className="text-meda-muted mt-1 leading-relaxed">
                  Direct transfer to Medaresha Hospitality CBE Account #1000234567891.
                </p>
              </div>
            </label>

            <label
              className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-colors ${
                paymentMethod === "bank_transfer"
                  ? "border-olive bg-sand/60 font-medium"
                  : "border-meda-border bg-[#FDFBF7] hover:bg-sand/30"
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="bank_transfer"
                checked={paymentMethod === "bank_transfer"}
                onChange={() => setPaymentMethod("bank_transfer")}
                className="mt-0.5 text-olive focus:ring-olive"
              />
              <div>
                <span className="flex items-center gap-1.5 font-medium text-meda-text">
                  <CreditCard className="h-4 w-4 text-botanical" />
                  International Bank Wire
                </span>
                <p className="text-meda-muted mt-1 leading-relaxed">
                  Swift wire transfer for corporate & diplomatic stays.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Authoritative Price Breakdown */}
        {priceQuote && (
          <div className="rounded-2xl border border-meda-border bg-[#FBF8F2] p-6 shadow-subtle space-y-3">
            <h4 className="font-serif text-xl text-olive">Price Summary</h4>

            <div className="flex justify-between text-sm text-meda-muted">
              <span>Room Subtotal ({nights} nights)</span>
              <span>{formatCurrency(priceQuote.roomSubtotal)}</span>
            </div>

            {priceQuote.extraGuestsCharge > 0 && (
              <div className="flex justify-between text-sm text-meda-muted">
                <span>Extra Guest Surcharge</span>
                <span>{formatCurrency(priceQuote.extraGuestsCharge)}</span>
              </div>
            )}

            <div className="flex justify-between text-sm text-meda-muted">
              <span>Service Charge (10%)</span>
              <span>{formatCurrency(priceQuote.serviceCharge)}</span>
            </div>

            <div className="flex justify-between text-sm text-meda-muted">
              <span>Value Added Tax (VAT 15%)</span>
              <span>{formatCurrency(priceQuote.vat)}</span>
            </div>

            <div className="border-t border-meda-border pt-3 flex justify-between font-serif text-2xl text-olive font-medium">
              <span>Grand Total</span>
              <span>{formatCurrency(priceQuote.total)}</span>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="rounded-xl border border-[#A3322B]/20 bg-[#FBEAE9] p-4 text-xs text-[#A3322B] flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Prominent MOYA-Style Action Button */}
        <div className="space-y-3 pt-2">
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting || !priceQuote}
            className="w-full h-14 rounded-full text-sm font-semibold uppercase tracking-[0.2em] shadow-elevated"
          >
            {isSubmitting ? "Securing Reservation..." : "Confirm Reservation"}
          </Button>

          <div className="flex items-center justify-center gap-2 text-xs text-meda-muted">
            <ShieldCheck className="h-4 w-4 text-botanical" />
            <span>Free cancellation up to 48 hours prior to arrival. No advance charge.</span>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function BookingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-ivory">
      <PublicNavbar />
      <main className="flex-1 py-10 px-6 lg:px-12 max-w-4xl mx-auto w-full">
        <React.Suspense
          fallback={
            <div className="py-20 text-center text-sm text-meda-muted">
              Loading reservation details...
            </div>
          }
        >
          <BookingContent />
        </React.Suspense>
      </main>
      <PublicFooter />
    </div>
  );
}
