"use client";

import * as React from "react";
import { hotelStore } from "@/lib/booking-engine";
import { HousekeepingStatus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, CheckCircle2, Clock, AlertTriangle, ShieldCheck, User } from "lucide-react";

export default function AdminHousekeepingPage() {
  const [rooms, setRooms] = React.useState(() => [...hotelStore.rooms]);
  const [tasks, setTasks] = React.useState(() => [...hotelStore.housekeeping]);
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  const filteredRooms = rooms.filter((r) => {
    if (statusFilter === "all") return true;
    return r.housekeeping_status === statusFilter;
  });

  const handleUpdateStatus = (roomId: string, newStatus: HousekeepingStatus) => {
    hotelStore.updateRoomHousekeepingStatus(roomId, newStatus);
    setRooms([...hotelStore.rooms]);
  };

  const handleCompleteTask = (taskId: string) => {
    const task = hotelStore.housekeeping.find((t) => t.id === taskId);
    if (task) {
      task.status = "completed";
      task.completed_at = new Date().toISOString();
      setTasks([...hotelStore.housekeeping]);

      // Automatically update room to inspected or clean
      hotelStore.updateRoomHousekeepingStatus(task.room_id, "clean");
      setRooms([...hotelStore.rooms]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-meda-border pb-5">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-botanical font-medium">
            Room Cleanliness & Operations
          </span>
          <h1 className="font-serif text-3xl font-medium text-meda-text">
            Housekeeping Management
          </h1>
          <p className="text-xs text-meda-muted mt-1">
            Maintain room hygiene, track turnover workflows, and separate cleanliness status from reservation availability.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 text-xs border-b border-meda-border pb-3">
        {[
          { label: "All Rooms", value: "all" },
          { label: "Clean & Ready", value: "clean" },
          { label: "Dirty / Turnover Required", value: "dirty" },
          { label: "Cleaning In Progress", value: "in_progress" },
          { label: "Inspected", value: "inspected" },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`rounded-full px-4 py-1.5 transition-colors ${
              statusFilter === tab.value
                ? "bg-olive text-ivory font-medium"
                : "bg-sand text-meda-text hover:bg-sand-dark"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Room Status Cards Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredRooms.map((room) => {
          const roomType = hotelStore.roomTypes.find((rt) => rt.id === room.room_type_id);

          return (
            <div
              key={room.id}
              className="rounded-2xl border border-meda-border bg-[#FAF7F2] p-5 shadow-subtle flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-serif text-2xl font-medium text-meda-text">
                    Suite {room.room_number}
                  </span>
                  <Badge variant={room.housekeeping_status as any}>
                    {room.housekeeping_status.replace("_", " ")}
                  </Badge>
                </div>
                <span className="text-xs text-meda-muted block mt-1">{roomType?.name}</span>
                <span className="text-[11px] text-meda-muted block">Floor {room.floor}</span>

                {room.notes && (
                  <p className="mt-3 text-[11px] text-meda-muted italic bg-sand/30 p-2 rounded-lg border border-meda-border/60">
                    &ldquo;{room.notes}&rdquo;
                  </p>
                )}
              </div>

              {/* Status Action Buttons */}
              <div className="mt-5 pt-3 border-t border-meda-border/60 space-y-1.5">
                <span className="block text-[10px] uppercase tracking-wider text-meda-muted mb-1">
                  Update Cleanliness Status:
                </span>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  <button
                    onClick={() => handleUpdateStatus(room.id, "clean")}
                    className="rounded-lg bg-[#EAF3ED] border border-[#BDE2CD] text-[#245C3C] py-1 px-2 font-medium hover:bg-[#d9ede0] transition-colors"
                  >
                    Clean
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(room.id, "in_progress")}
                    className="rounded-lg bg-[#FBF4E8] border border-[#F6DFB6] text-[#9A6517] py-1 px-2 font-medium hover:bg-[#faeacf] transition-colors"
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(room.id, "inspected")}
                    className="rounded-lg bg-[#EBF2F7] border border-[#BFD8E8] text-[#245070] py-1 px-2 font-medium hover:bg-[#d6e6f2] transition-colors"
                  >
                    Inspected
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(room.id, "dirty")}
                    className="rounded-lg bg-[#FBEAE9] border border-[#F5C2BF] text-[#9B2C24] py-1 px-2 font-medium hover:bg-[#f6d7d5] transition-colors"
                  >
                    Dirty
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Housekeeping Assigned Turnover Tasks */}
      <div className="rounded-2xl border border-meda-border bg-[#FAF7F2] p-6 shadow-subtle mt-8">
        <h3 className="font-serif text-2xl text-olive mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-botanical" />
          Cleaning Task Roster & Turnovers
        </h3>

        <div className="divide-y divide-meda-border/60">
          {tasks.map((task) => (
            <div key={task.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-meda-text text-sm">Suite {task.room_number}</span>
                  <Badge variant={task.status === "completed" ? "clean" : "progress"}>
                    {task.status}
                  </Badge>
                  <span className="text-[11px] text-meda-muted uppercase tracking-wider">
                    Priority: {task.priority}
                  </span>
                </div>
                <p className="text-meda-muted mt-0.5">{task.notes}</p>
                <div className="flex items-center gap-1.5 text-meda-muted text-[11px] mt-1">
                  <User className="h-3.5 w-3.5 text-botanical" />
                  <span>Assigned: {task.assigned_to_name || "Unassigned"}</span>
                  <span>• Scheduled: {task.scheduled_date}</span>
                </div>
              </div>

              {task.status !== "completed" && (
                <Button
                  onClick={() => handleCompleteTask(task.id)}
                  variant="primary"
                  size="sm"
                  className="rounded-full text-xs"
                >
                  Mark Completed & Clean
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
