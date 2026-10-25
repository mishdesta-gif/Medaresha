"use client";

import * as React from "react";
import { hotelStore } from "@/lib/booking-engine";
import { MaintenanceTicket } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Wrench, Plus, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function AdminMaintenancePage() {
  const [tickets, setTickets] = React.useState(() => [...hotelStore.maintenance]);
  const [showNewModal, setShowNewModal] = React.useState(false);

  // New ticket state
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [roomNumber, setRoomNumber] = React.useState("403");
  const [priority, setPriority] = React.useState<"low" | "medium" | "high" | "critical">("medium");
  const [blocksRoom, setBlocksRoom] = React.useState(false);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const targetRoom = hotelStore.rooms.find((r) => r.room_number === roomNumber);

    const newTicket: MaintenanceTicket = {
      id: `mnt-${Date.now()}`,
      property_id: hotelStore.property.id,
      room_id: targetRoom?.id,
      room_number: roomNumber,
      title,
      description,
      priority,
      status: "open",
      blocks_room: blocksRoom,
      created_at: new Date().toISOString(),
    };

    hotelStore.maintenance.unshift(newTicket);
    setTickets([...hotelStore.maintenance]);
    setShowNewModal(false);
    setTitle("");
    setDescription("");
  };

  const handleResolveTicket = (ticketId: string) => {
    const ticket = hotelStore.maintenance.find((t) => t.id === ticketId);
    if (ticket) {
      ticket.status = "resolved";
      setTickets([...hotelStore.maintenance]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-meda-border pb-5">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-botanical font-medium">
            Facility Maintenance
          </span>
          <h1 className="font-serif text-3xl font-medium text-meda-text">
            Maintenance Tickets & Room Holds
          </h1>
          <p className="text-xs text-meda-muted mt-1">
            Track repairs, equipment issues, and maintenance blocks that automatically remove affected rooms from the booking engine.
          </p>
        </div>

        <Button
          onClick={() => setShowNewModal(true)}
          variant="primary"
          size="sm"
          className="rounded-full text-xs flex items-center gap-1.5"
        >
          <Plus className="h-4 w-4" />
          Create Ticket
        </Button>
      </div>

      {/* Ticket List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tickets.map((t) => (
          <div
            key={t.id}
            className="rounded-2xl border border-meda-border bg-[#FAF7F2] p-5 shadow-subtle flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-olive text-sm">
                  {t.room_number ? `Suite ${t.room_number}` : "General Area"}
                </span>
                <Badge variant={t.status === "resolved" ? "clean" : "dirty"}>
                  {t.status.toUpperCase()}
                </Badge>
              </div>
              <h3 className="font-serif text-xl text-meda-text mt-1">{t.title}</h3>
              <p className="text-xs text-meda-muted mt-1 leading-relaxed">{t.description}</p>

              <div className="mt-3 flex items-center gap-3 text-xs text-meda-muted">
                <span className="capitalize">Priority: <strong>{t.priority}</strong></span>
                {t.blocks_room && (
                  <span className="text-[#A3322B] font-medium flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Excludes Room from Booking Engine
                  </span>
                )}
              </div>
            </div>

            {t.status !== "resolved" && (
              <div className="mt-4 pt-3 border-t border-meda-border flex justify-end">
                <Button
                  onClick={() => handleResolveTicket(t.id)}
                  variant="outline"
                  size="sm"
                  className="rounded-full text-xs"
                >
                  Mark Resolved
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* New Ticket Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-meda-border bg-[#FDFBF7] p-6 shadow-modal space-y-4">
            <h3 className="font-serif text-2xl text-olive">Create Maintenance Ticket</h3>

            <form onSubmit={handleCreateTicket} className="space-y-3">
              <div>
                <label className="block text-xs text-meda-muted mb-1">Affected Room</label>
                <select
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  className="w-full rounded-xl border border-meda-border bg-ivory p-2.5 text-xs text-meda-text"
                >
                  {hotelStore.rooms.map((r) => (
                    <option key={r.id} value={r.room_number}>
                      Suite {r.room_number} (Floor {r.floor})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-meda-muted mb-1">Issue Title</label>
                <Input
                  required
                  placeholder="e.g. AC Filter Replacement, Balcony Latch"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs text-meda-muted mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  className="w-full rounded-xl border border-meda-border bg-ivory p-2.5 text-xs text-meda-text focus:outline-none focus:ring-1 focus:ring-olive"
                  placeholder="Provide details for the maintenance engineering team..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs text-meda-muted mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full rounded-xl border border-meda-border bg-ivory p-2.5 text-xs text-meda-text"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-1 text-xs">
                <input
                  type="checkbox"
                  id="blockRoomCheck"
                  checked={blocksRoom}
                  onChange={(e) => setBlocksRoom(e.target.checked)}
                  className="rounded text-olive focus:ring-olive"
                />
                <label htmlFor="blockRoomCheck" className="text-meda-text font-medium cursor-pointer">
                  Block Room (Temporarily remove from booking engine availability)
                </label>
              </div>

              <div className="flex gap-2 pt-3">
                <Button type="submit" variant="primary" size="sm" className="flex-1 rounded-full">
                  Submit Ticket
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
