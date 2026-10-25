import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Users, Bed, Maximize2, ArrowRight } from "lucide-react";
import { RoomType } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface RoomCardProps {
  roomType: RoomType;
  checkIn?: string;
  checkOut?: string;
  availableCount?: number;
}

export function RoomCard({
  roomType,
  checkIn,
  checkOut,
  availableCount,
}: RoomCardProps) {
  const coverImage =
    roomType.images?.find((img) => img.is_cover)?.image_url ||
    roomType.images?.[0]?.image_url ||
    "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80";

  const bookingQuery = checkIn && checkOut
    ? `?checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(checkOut)}`
    : "";

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-meda-border bg-[#FAF7F2] transition-all duration-300 hover:shadow-elevated">
      {/* Photographic Presentation */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-sand">
        <img
          src={coverImage}
          alt={roomType.name}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {availableCount !== undefined && (
          <div className="absolute top-4 right-4 rounded-full bg-ivory/95 px-3 py-1 text-xs font-medium text-olive shadow-subtle backdrop-blur-sm">
            {availableCount > 0 ? `${availableCount} Available` : "Sold Out"}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-2">
          <h3 className="font-serif text-2xl font-normal text-meda-text transition-colors group-hover:text-olive">
            {roomType.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-meda-muted leading-relaxed">
            {roomType.short_description}
          </p>
        </div>

        {/* Room Specifications */}
        <div className="my-4 flex flex-wrap items-center gap-4 border-y border-meda-border/60 py-3 text-xs text-meda-muted">
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4 text-botanical" />
            <span>Up to {roomType.max_occupancy} guests</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bed className="h-4 w-4 text-botanical" />
            <span>{roomType.bed_configuration}</span>
          </div>
          {roomType.size_sqm && (
            <div className="flex items-center gap-1.5">
              <Maximize2 className="h-4 w-4 text-botanical" />
              <span>{roomType.size_sqm} m²</span>
            </div>
          )}
        </div>

        {/* Price & Action */}
        <div className="mt-auto flex items-center justify-between pt-2">
          <div>
            <span className="block text-[11px] uppercase tracking-wider text-meda-muted">
              Starting from
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-serif text-2xl font-medium text-olive">
                {formatCurrency(roomType.base_price_per_night)}
              </span>
              <span className="text-xs text-meda-muted">/ night</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/rooms/${roomType.slug}${bookingQuery}`}>
              <Button variant="outlineMuted" size="sm" className="text-xs">
                Details
              </Button>
            </Link>
            <Link
              href={
                checkIn && checkOut
                  ? `/booking?roomTypeId=${roomType.id}&checkIn=${encodeURIComponent(
                      checkIn
                    )}&checkOut=${encodeURIComponent(checkOut)}`
                  : `/rooms/${roomType.slug}`
              }
            >
              <Button
                variant="primary"
                size="sm"
                className="text-xs flex items-center gap-1"
                disabled={availableCount === 0}
              >
                {availableCount === 0 ? "Unavailable" : "Reserve"}
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
