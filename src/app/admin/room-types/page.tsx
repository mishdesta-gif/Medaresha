"use client";

import * as React from "react";
import { hotelStore } from "@/lib/booking-engine";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BedDouble, Users, Maximize2 } from "lucide-react";

export default function AdminRoomTypesPage() {
  const roomTypes = hotelStore.roomTypes;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-meda-border pb-5">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-botanical font-medium">
            Catalog Management
          </span>
          <h1 className="font-serif text-3xl font-medium text-meda-text">
            Room Categories & Rate Plans
          </h1>
          <p className="text-xs text-meda-muted mt-1">
            Configure suite titles, photographic presentation, capacity thresholds, and base nightly rates.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roomTypes.map((rt) => (
          <div
            key={rt.id}
            className="rounded-2xl border border-meda-border bg-[#FAF7F2] overflow-hidden shadow-subtle flex flex-col justify-between"
          >
            <div>
              <div className="h-44 w-full overflow-hidden bg-sand">
                <img
                  src={rt.images?.[0]?.image_url}
                  alt={rt.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-botanical font-medium">
                      Category #{rt.sort_order}
                    </span>
                    <h3 className="font-serif text-2xl text-meda-text mt-0.5">{rt.name}</h3>
                  </div>
                  <span className="font-serif text-xl font-medium text-olive">
                    {formatCurrency(rt.base_price_per_night)}
                  </span>
                </div>

                <p className="text-xs text-meda-muted mt-2 leading-relaxed">
                  {rt.short_description}
                </p>

                <div className="mt-4 flex flex-wrap gap-4 text-xs text-meda-muted border-t border-meda-border/60 pt-3">
                  <div className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-botanical" />
                    <span>Max {rt.max_occupancy} Guests</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <BedDouble className="h-3.5 w-3.5 text-botanical" />
                    <span>{rt.bed_configuration}</span>
                  </div>
                  {rt.size_sqm && (
                    <div className="flex items-center gap-1.5">
                      <Maximize2 className="h-3.5 w-3.5 text-botanical" />
                      <span>{rt.size_sqm} m²</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
