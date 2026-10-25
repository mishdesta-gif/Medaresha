"use client";

import * as React from "react";
import { hotelStore } from "@/lib/booking-engine";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AdminCalendarPage() {
  const rooms = hotelStore.rooms;
  const roomTypes = hotelStore.roomTypes;
  const reservations = hotelStore.reservations;
  const maintenance = hotelStore.maintenance;

  // Timeline base date: today
  const [baseDate, setBaseDate] = React.useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  // Display a 14-day window
  const daysWindow = 14;
  const dates = React.useMemo(() => {
    const list: string[] = [];
    for (let i = 0; i < daysWindow; i++) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + i);
      list.push(d.toISOString().split("T")[0]);
    }
    return list;
  }, [baseDate]);

  const handlePrevDays = () => {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() - 7);
    setBaseDate(d);
  };

  const handleNextDays = () => {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + 7);
    setBaseDate(d);
  };

  const handleToday = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    setBaseDate(d);
  };

  return (
    <div className="space-y-6">
      {/* Header & Date Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-meda-border pb-5">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-botanical font-medium">
            Room Inventory
          </span>
          <h1 className="font-serif text-3xl font-medium text-meda-text">
            Availability & Stay Timeline
          </h1>
          <p className="text-xs text-meda-muted mt-1">
            Visual room allocation matrix across dates. Conflicting room assignments are strictly prevented.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={handleToday} variant="outline" size="sm" className="text-xs">
            Today
          </Button>
          <Button onClick={handlePrevDays} variant="outline" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button onClick={handleNextDays} variant="outline" size="icon" className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-meda-muted bg-[#FAF7F2] p-3 rounded-xl border border-meda-border">
        <span className="font-medium text-meda-text">Legend:</span>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded bg-olive" />
          <span>Checked In Stay</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded bg-[#72785E]" />
          <span>Confirmed Upcoming</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded bg-[#9A6517]" />
          <span>Awaiting Payment</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded bg-[#A3322B]" />
          <span>Maintenance Block</span>
        </div>
      </div>

      {/* Timeline Grid Table */}
      <div className="rounded-2xl border border-meda-border bg-[#FAF7F2] overflow-x-auto shadow-subtle">
        <table className="w-full text-xs text-meda-text border-collapse">
          <thead>
            <tr className="border-b border-meda-border bg-[#F5F0E6]">
              <th className="sticky left-0 z-20 bg-[#F5F0E6] px-4 py-3 text-left font-serif text-sm font-medium text-olive w-40 border-r border-meda-border">
                Room
              </th>
              {dates.map((dateStr) => {
                const d = new Date(dateStr);
                const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
                const dayNum = d.getDate();
                const isToday = dateStr === new Date().toISOString().split("T")[0];

                return (
                  <th
                    key={dateStr}
                    className={`px-3 py-2 text-center min-w-[72px] border-r border-meda-border/60 ${
                      isToday ? "bg-sand font-bold text-olive" : "text-meda-muted"
                    }`}
                  >
                    <span className="block text-[10px] uppercase">{dayName}</span>
                    <span className="text-sm font-serif">{dayNum}</span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-meda-border/60">
            {rooms.map((room) => {
              const rType = roomTypes.find((rt) => rt.id === room.room_type_id);

              return (
                <tr key={room.id} className="hover:bg-sand/20 transition-colors">
                  {/* Fixed Room Label */}
                  <td className="sticky left-0 z-10 bg-[#FAF7F2] px-4 py-3.5 border-r border-meda-border font-medium">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-meda-text">Suite {room.room_number}</span>
                      <Badge variant={room.housekeeping_status as any} className="text-[9px] py-0 px-1">
                        {room.housekeeping_status}
                      </Badge>
                    </div>
                    <span className="text-[10px] text-meda-muted block truncate max-w-[130px]">
                      {rType?.name}
                    </span>
                  </td>

                  {/* Day Columns */}
                  {dates.map((dateStr) => {
                    // Check if reservation covers this room on dateStr
                    const booking = reservations.find(
                      (r) =>
                        r.assigned_room_number === room.room_number &&
                        r.status !== "cancelled" &&
                        dateStr >= r.check_in_date &&
                        dateStr < r.check_out_date
                    );

                    let cellBg = "bg-transparent";
                    let content = null;

                    if (booking) {
                      if (booking.status === "checked_in") {
                        cellBg = "bg-olive text-ivory";
                      } else if (booking.status === "confirmed") {
                        cellBg = "bg-botanical text-ivory";
                      } else {
                        cellBg = "bg-[#FBF4E8] text-[#9A6517] border border-[#F6DFB6]";
                      }

                      content = (
                        <div
                          className={`w-full py-1 px-1.5 rounded text-[10px] truncate ${cellBg}`}
                          title={`Ref: ${booking.reservation_number} - ${booking.guest?.first_name} ${booking.guest?.last_name}`}
                        >
                          {booking.guest?.last_name} ({booking.reservation_number})
                        </div>
                      );
                    }

                    return (
                      <td
                        key={dateStr}
                        className="px-1 py-2 text-center border-r border-meda-border/60 align-middle h-12"
                      >
                        {content}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
