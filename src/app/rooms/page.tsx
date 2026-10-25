"use client";

import * as React from "react";
import { PublicNavbar } from "@/components/public/navbar";
import { PublicFooter } from "@/components/public/footer";
import { RoomCard } from "@/components/public/room-card";
import { INITIAL_ROOM_TYPES } from "@/data/mock-database";
import { SlidersHorizontal } from "lucide-react";

export default function RoomsPage() {
  const [capacityFilter, setCapacityFilter] = React.useState<number | "all">("all");
  const [sortBy, setSortBy] = React.useState<"price-asc" | "price-desc" | "recommended">("recommended");

  let filteredRooms = [...INITIAL_ROOM_TYPES];

  if (capacityFilter !== "all") {
    filteredRooms = filteredRooms.filter((r) => r.max_occupancy >= capacityFilter);
  }

  if (sortBy === "price-asc") {
    filteredRooms.sort((a, b) => a.base_price_per_night - b.base_price_per_night);
  } else if (sortBy === "price-desc") {
    filteredRooms.sort((a, b) => b.base_price_per_night - a.base_price_per_night);
  }

  return (
    <div className="min-h-screen flex flex-col bg-ivory">
      <PublicNavbar />

      <main className="flex-1 py-12 px-6 lg:px-12 max-w-7xl mx-auto w-full">
        {/* Page Header */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-[0.25em] text-botanical font-medium">
            Accommodations
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-meda-text mt-2">
            Suites & Residences
          </h1>
          <p className="mt-3 text-sm text-meda-muted leading-relaxed">
            Every room at Medaresha is designed as an intimate sanctuary featuring warm natural timber, acoustic serenity, and bespoke Ethiopian artisanal touches.
          </p>
        </div>

        {/* Filter & Sorting Controls */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-meda-border bg-[#F8F4EC] p-4 text-xs">
          <div className="flex items-center gap-3">
            <SlidersHorizontal className="h-4 w-4 text-botanical" />
            <span className="font-medium text-meda-text">Filter by Capacity:</span>
            <div className="flex gap-1.5">
              {[
                { label: "All", value: "all" },
                { label: "2+ Guests", value: 2 },
                { label: "3+ Guests", value: 3 },
                { label: "4 Guests", value: 4 },
              ].map((pill) => (
                <button
                  key={pill.label}
                  onClick={() => setCapacityFilter(pill.value as any)}
                  className={`rounded-full px-3 py-1 transition-colors ${
                    capacityFilter === pill.value
                      ? "bg-olive text-ivory font-medium"
                      : "bg-sand text-meda-text hover:bg-sand-dark"
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-meda-muted">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="rounded-xl border border-meda-border bg-ivory px-3 py-1.5 text-xs text-meda-text focus:outline-none focus:ring-1 focus:ring-olive"
            >
              <option value="recommended">Curated Collection</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Room Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {filteredRooms.map((room) => (
            <RoomCard key={room.id} roomType={room} />
          ))}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
