"use client";

import * as React from "react";
import { hotelStore } from "@/lib/booking-engine";
import { Input } from "@/components/ui/input";
import { Search, User, Phone, Mail, Globe, CalendarCheck } from "lucide-react";

export default function AdminGuestsPage() {
  const [searchTerm, setSearchTerm] = React.useState("");

  // Extract unique guests from reservations
  const guests = React.useMemo(() => {
    const map = new Map();
    hotelStore.reservations.forEach((r) => {
      if (r.guest) {
        if (!map.has(r.guest.email)) {
          map.set(r.guest.email, {
            ...r.guest,
            totalStays: 1,
            reservations: [r],
          });
        } else {
          const existing = map.get(r.guest.email);
          existing.totalStays += 1;
          existing.reservations.push(r);
        }
      }
    });
    return Array.from(map.values());
  }, []);

  const filteredGuests = guests.filter((g) => {
    return (
      g.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.phone.includes(searchTerm)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-meda-border pb-5">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-botanical font-medium">
            Guest Relationship Management
          </span>
          <h1 className="font-serif text-3xl font-medium text-meda-text">
            Guest Directory & Stays
          </h1>
          <p className="text-xs text-meda-muted mt-1">
            Auditable guest profiles, preferences, and verified stay histories. Personal information is strictly protected.
          </p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-meda-muted" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search guests by name, phone, or email..."
          className="pl-9 h-10 bg-ivory text-xs"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGuests.map((guest) => (
          <div
            key={guest.email}
            className="rounded-2xl border border-meda-border bg-[#FAF7F2] p-5 shadow-subtle flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sand text-olive font-serif text-lg">
                  {guest.first_name[0]}{guest.last_name[0]}
                </div>
                <div>
                  <h3 className="font-serif text-xl text-meda-text">
                    {guest.first_name} {guest.last_name}
                  </h3>
                  <span className="text-[11px] text-meda-muted flex items-center gap-1">
                    <Globe className="h-3 w-3 text-botanical" />
                    {guest.country}
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-1.5 text-xs text-meda-muted border-t border-meda-border/60 pt-3">
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-botanical" />
                  <span>{guest.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-botanical" />
                  <span>{guest.email}</span>
                </div>
                {guest.identification_number && (
                  <div className="text-[10px] text-meda-muted pt-1">
                    ID: {guest.identification_type?.toUpperCase()} #{guest.identification_number}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-meda-border flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 text-meda-muted">
                <CalendarCheck className="h-3.5 w-3.5 text-botanical" />
                Completed Stays
              </span>
              <span className="font-serif font-medium text-olive text-sm">
                {guest.totalStays} {guest.totalStays === 1 ? "stay" : "stays"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
