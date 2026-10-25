"use client";

import * as React from "react";
import { INITIAL_SUPPLIERS } from "@/data/mock-database";
import { Button } from "@/components/ui/button";
import { Truck, Plus, Mail, Phone } from "lucide-react";

export default function AdminSuppliersPage() {
  const [suppliers] = React.useState(INITIAL_SUPPLIERS);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-meda-border pb-5">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-botanical font-medium">
            Procurement
          </span>
          <h1 className="font-serif text-3xl font-medium text-meda-text">
            Suppliers & Vendor Relations
          </h1>
          <p className="text-xs text-meda-muted mt-1">
            Certified hospitality suppliers for single-origin coffee, luxury linens, and organic amenities.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suppliers.map((s) => (
          <div
            key={s.id}
            className="rounded-2xl border border-meda-border bg-[#FAF7F2] p-6 shadow-subtle space-y-3"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-2xl text-olive">{s.company_name}</h3>
              <span className="text-[10px] uppercase tracking-wider bg-sand px-2 py-0.5 rounded-full text-meda-text">
                {s.payment_terms}
              </span>
            </div>
            <p className="text-xs text-meda-muted">Contact: <strong>{s.contact_person}</strong></p>

            <div className="space-y-1 text-xs text-meda-muted pt-2 border-t border-meda-border/60">
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-botanical" />
                <span>{s.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-botanical" />
                <span>{s.phone}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
