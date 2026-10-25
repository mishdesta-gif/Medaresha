"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Calendar, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function QuickSearch({
  initialCheckIn,
  initialCheckOut,
  initialAdults = 2,
}: {
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialAdults?: number;
}) {
  const router = useRouter();

  // Set default dates: check-in tomorrow, check-out 3 days later
  const today = new Date();
  const defaultIn = new Date(today);
  defaultIn.setDate(today.getDate() + 1);
  const defaultOut = new Date(today);
  defaultOut.setDate(today.getDate() + 4);

  const [checkIn, setCheckIn] = React.useState(
    initialCheckIn || defaultIn.toISOString().split("T")[0]
  );
  const [checkOut, setCheckOut] = React.useState(
    initialCheckOut || defaultOut.toISOString().split("T")[0]
  );
  const [adults, setAdults] = React.useState(initialAdults);
  const [error, setError] = React.useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (new Date(checkOut) <= new Date(checkIn)) {
      setError("Check-out date must be after check-in date.");
      return;
    }
    setError(null);
    router.push(
      `/availability?checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(
        checkOut
      )}&adults=${adults}`
    );
  };

  return (
    <div className="w-full rounded-2xl border border-meda-border bg-ivory/95 p-4 shadow-elevated backdrop-blur-md md:p-6">
      <form onSubmit={handleSearch} className="grid grid-cols-1 gap-4 md:grid-cols-4 items-end">
        {/* Check-in */}
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-meda-muted mb-1.5 flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-botanical" />
            Check-in
          </label>
          <input
            type="date"
            value={checkIn}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full rounded-xl border border-meda-border bg-[#FDFBF7] px-3.5 py-2.5 text-sm text-meda-text focus:outline-none focus:ring-1 focus:ring-olive"
            required
          />
        </div>

        {/* Check-out */}
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-meda-muted mb-1.5 flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-botanical" />
            Check-out
          </label>
          <input
            type="date"
            value={checkOut}
            min={checkIn}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full rounded-xl border border-meda-border bg-[#FDFBF7] px-3.5 py-2.5 text-sm text-meda-text focus:outline-none focus:ring-1 focus:ring-olive"
            required
          />
        </div>

        {/* Guests */}
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-meda-muted mb-1.5 flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-botanical" />
            Guests
          </label>
          <select
            value={adults}
            onChange={(e) => setAdults(Number(e.target.value))}
            className="w-full rounded-xl border border-meda-border bg-[#FDFBF7] px-3.5 py-2.5 text-sm text-meda-text focus:outline-none focus:ring-1 focus:ring-olive"
          >
            <option value={1}>1 Adult</option>
            <option value={2}>2 Adults</option>
            <option value={3}>3 Adults</option>
            <option value={4}>4 Adults</option>
          </select>
        </div>

        {/* Submit */}
        <div>
          <Button
            type="submit"
            variant="primary"
            className="w-full h-[44px] rounded-xl text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2"
          >
            Check Availability
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </form>

      {error && <p className="mt-2 text-xs text-[#A3322B]">{error}</p>}
    </div>
  );
}
