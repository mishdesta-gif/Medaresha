"use client";

import * as React from "react";
import { hotelStore } from "@/lib/booking-engine";
import { Room } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BedDouble, Plus, Edit, CheckCircle2 } from "lucide-react";

export default function AdminRoomsPage() {
  const [rooms, setRooms] = React.useState(() => [...hotelStore.rooms]);
  const [showAddModal, setShowAddModal] = React.useState(false);

  const [newRoomNumber, setNewRoomNumber] = React.useState("");
  const [newFloor, setNewFloor] = React.useState(2);
  const [newRoomTypeId, setNewRoomTypeId] = React.useState(hotelStore.roomTypes[0].id);

  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomNumber) return;

    const newRoom: Room = {
      id: `room-${Date.now()}`,
      property_id: hotelStore.property.id,
      room_type_id: newRoomTypeId,
      room_number: newRoomNumber,
      floor: Number(newFloor),
      housekeeping_status: "clean",
      is_active: true,
      notes: "Newly commissioned suite",
    };

    hotelStore.rooms.push(newRoom);
    setRooms([...hotelStore.rooms]);
    setShowAddModal(false);
    setNewRoomNumber("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-meda-border pb-5">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-botanical font-medium">
            Property Inventory
          </span>
          <h1 className="font-serif text-3xl font-medium text-meda-text">
            Physical Room Management
          </h1>
          <p className="text-xs text-meda-muted mt-1">
            Configure unique room numbers, floor levels, active states, and assign rooms to categories.
          </p>
        </div>

        <Button
          onClick={() => setShowAddModal(true)}
          variant="primary"
          size="sm"
          className="rounded-full text-xs flex items-center gap-1.5"
        >
          <Plus className="h-4 w-4" />
          Add Physical Room
        </Button>
      </div>

      {/* Rooms Table */}
      <div className="rounded-2xl border border-meda-border bg-[#FAF7F2] overflow-hidden shadow-subtle">
        <table className="w-full text-left text-xs text-meda-text">
          <thead className="border-b border-meda-border bg-[#F5F0E6] text-[10px] font-semibold uppercase tracking-wider text-meda-muted">
            <tr>
              <th className="px-5 py-3.5">Room #</th>
              <th className="px-5 py-3.5">Category</th>
              <th className="px-5 py-3.5">Floor</th>
              <th className="px-5 py-3.5">Cleanliness</th>
              <th className="px-5 py-3.5">Active State</th>
              <th className="px-5 py-3.5">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-meda-border/60">
            {rooms.map((room) => {
              const rType = hotelStore.roomTypes.find((rt) => rt.id === room.room_type_id);

              return (
                <tr key={room.id} className="hover:bg-sand/30 transition-colors">
                  <td className="px-5 py-4 font-semibold text-olive text-sm font-mono">
                    Suite {room.room_number}
                  </td>
                  <td className="px-5 py-4 font-medium text-meda-text">{rType?.name}</td>
                  <td className="px-5 py-4 text-meda-muted">Floor {room.floor}</td>
                  <td className="px-5 py-4">
                    <Badge variant={room.housekeeping_status as any}>
                      {room.housekeeping_status}
                    </Badge>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1 text-[11px] text-[#245C3C] font-medium">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Active
                    </span>
                  </td>
                  <td className="px-5 py-4 text-meda-muted text-[11px]">
                    {room.notes || "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Room Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-meda-border bg-[#FDFBF7] p-6 shadow-modal space-y-4">
            <h3 className="font-serif text-2xl text-olive">Add Physical Room</h3>

            <form onSubmit={handleAddRoom} className="space-y-3">
              <div>
                <label className="block text-xs text-meda-muted mb-1">Room Number *</label>
                <Input
                  required
                  placeholder="e.g. 201, 202, 601"
                  value={newRoomNumber}
                  onChange={(e) => setNewRoomNumber(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs text-meda-muted mb-1">Floor Level</label>
                <Input
                  type="number"
                  required
                  value={newFloor}
                  onChange={(e) => setNewFloor(Number(e.target.value))}
                />
              </div>

              <div>
                <label className="block text-xs text-meda-muted mb-1">Room Category</label>
                <select
                  value={newRoomTypeId}
                  onChange={(e) => setNewRoomTypeId(e.target.value)}
                  className="w-full rounded-xl border border-meda-border bg-ivory p-2.5 text-xs text-meda-text"
                >
                  {hotelStore.roomTypes.map((rt) => (
                    <option key={rt.id} value={rt.id}>
                      {rt.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-3">
                <Button type="submit" variant="primary" size="sm" className="flex-1 rounded-full">
                  Save Room
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowAddModal(false)}
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
