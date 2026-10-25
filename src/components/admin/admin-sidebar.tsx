"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  CalendarDays,
  DoorOpen,
  BedDouble,
  Users,
  Sparkles,
  Wrench,
  CreditCard,
  Receipt,
  Boxes,
  Truck,
  FileSpreadsheet,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";

const NAV_SECTIONS = [
  {
    title: "Operations",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { label: "Reservations", href: "/admin/reservations", icon: CalendarCheck },
      { label: "Availability Calendar", href: "/admin/calendar", icon: CalendarDays },
      { label: "Reception (Check-In/Out)", href: "/admin/check-in-out", icon: DoorOpen },
      { label: "Housekeeping", href: "/admin/housekeeping", icon: Sparkles },
      { label: "Maintenance", href: "/admin/maintenance", icon: Wrench },
    ],
  },
  {
    title: "Inventory & Rooms",
    items: [
      { label: "Physical Rooms", href: "/admin/rooms", icon: BedDouble },
      { label: "Guest Directory", href: "/admin/guests", icon: Users },
      { label: "Consumable Stock", href: "/admin/inventory", icon: Boxes },
      { label: "Suppliers & POs", href: "/admin/suppliers", icon: Truck },
    ],
  },
  {
    title: "Finance & Config",
    items: [
      { label: "Payments Ledger", href: "/admin/payments", icon: CreditCard },
      { label: "Operating Expenses", href: "/admin/expenses", icon: Receipt },
      { label: "Reports & Exports", href: "/admin/reports", icon: FileSpreadsheet },
      { label: "Property Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <>
      {/* Mobile Bar */}
      <div className="flex h-16 items-center justify-between border-b border-meda-border bg-[#F5F0E6] px-4 md:hidden">
        <Link href="/admin" className="font-serif text-lg tracking-[0.2em] text-olive font-medium">
          MEDARESHA PMS
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 text-olive hover:bg-sand"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar Panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-meda-border bg-[#F5F0E6] transition-transform duration-200 md:static md:translate-x-0 flex flex-col ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header Branding */}
        <div className="flex h-20 items-center justify-between border-b border-meda-border px-6">
          <Link href="/admin" className="flex flex-col">
            <span className="font-serif text-xl tracking-[0.25em] text-olive font-medium">
              MEDARESHA
            </span>
            <span className="text-[9px] uppercase tracking-[0.3em] text-botanical font-medium">
              Property Management
            </span>
          </Link>
          <Link
            href="/"
            target="_blank"
            className="text-meda-muted hover:text-olive p-1 rounded-md"
            title="Open Public Website"
          >
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title}>
              <span className="px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-meda-muted">
                {section.title}
              </span>
              <div className="mt-2 space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                        isActive
                          ? "bg-olive text-ivory shadow-subtle"
                          : "text-meda-text hover:bg-sand/60 hover:text-olive"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Staff Identity & Sign Out */}
        <div className="border-t border-meda-border p-4 bg-sand/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-olive text-ivory text-xs font-medium">
                RF
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-meda-text">Super Admin</span>
                <span className="text-[10px] text-meda-muted">Bole Property</span>
              </div>
            </div>
            <Link href="/login" className="text-meda-muted hover:text-[#A3322B] p-1.5" title="Sign Out">
              <LogOut className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
