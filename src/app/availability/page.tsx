"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { PublicNavbar } from "@/components/public/navbar";
import { PublicFooter } from "@/components/public/footer";
import { QuickSearch } from "@/components/public/quick-search";
import { RoomCard } from "@/components/public/room-card";
import { hotelStore } from "@/lib/booking-engine";
import { calculateNights } from "@/lib/utils";
import { Calendar, AlertCircle } from "lucide-react";

function AvailabilityContent() {
  const searchParams = useSearchParams();

  // Parse query dates or set tomorrow + 3 nights
  const today = new Date();
  const defaultIn = new Date(today);
  defaultIn.setDate(today.getDate() + 1);
  const defaultOut = new Date(today);
  defaultOut.setDate(today.getDate() + 4);

  const checkIn = searchParams.get("checkIn") || defaultIn.toISOString().split("T")[0];
  const checkOut = searchParams.get("checkOut") || defaultOut.toISOString().split("T")[0];
  const adults = Number(searchParams.get("adults")) || 2;

  const nights = calculateNights(checkIn, checkOut);

  // Authoritative availability search from real store records
  const searchResults = React.useMemo(() => {
    return hotelStore.searchAvailableRoomTypes(checkIn, checkOut, adults);
  }, [checkIn, checkOut, adults]);

  return (
    <>
      {/* Search Bar Container */}
      <div className="mb-10">
        <QuickSearch
          initialCheckIn={checkIn}
          initialCheckOut={checkOut}
          initialAdults={adults}
        />
      </div>

      {/* Results Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between border-b border-meda-border pb-4 gap-2">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-meda-text">
            Available Accommodations
          </h1>
          <p className="text-xs text-meda-muted mt-1 flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-botanical" />
            <span>
              {checkIn} to {checkOut} ({nights} {nights === 1 ? "night" : "nights"}), {adults} {adults === 1 ? "guest" : "guests"}
            </span>
          </p>
        </div>
        <div className="text-xs text-meda-muted">
          Showing {searchResults.length} suite categories
        </div>
      </div>

      {nights <= 0 ? (
        <div className="rounded-2xl border border-[#A3322B]/20 bg-[#FBEAE9] p-8 text-center text-sm text-[#A3322B]">
          <AlertCircle className="mx-auto h-8 w-8 mb-2" />
          <p className="font-medium">Invalid Stay Interval</p>
          <p className="text-xs mt-1">Please select a check-out date that is at least one night after your check-in date.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {searchResults.map(({ roomType, availableCount, isAvailable }) => (
            <RoomCard
              key={roomType.id}
              roomType={roomType}
              checkIn={checkIn}
              checkOut={checkOut}
              availableCount={availableCount}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default function AvailabilityPage() {
  return (
    <div className="min-h-screen flex flex-col bg-ivory">
      <PublicNavbar />
      <main className="flex-1 py-10 px-6 lg:px-12 max-w-7xl mx-auto w-full">
        <React.Suspense
          fallback={
            <div className="py-20 text-center text-sm text-meda-muted">
              Scanning real-time room availability...
            </div>
          }
        >
          <AvailabilityContent />
        </React.Suspense>
      </main>
      <PublicFooter />
    </div>
  );
}
