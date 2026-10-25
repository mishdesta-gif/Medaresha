"use client";

import * as React from "react";
import { hotelStore } from "@/lib/booking-engine";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Settings, Building, CreditCard, Clock, ShieldCheck } from "lucide-react";

export default function AdminSettingsPage() {
  const [property, setProperty] = React.useState({ ...hotelStore.property });
  const [settings, setSettings] = React.useState({ ...hotelStore.settings });
  const [saved, setSaved] = React.useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    hotelStore.property = { ...property };
    hotelStore.settings = { ...settings };
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-meda-border pb-5">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-botanical font-medium">
            System Configuration
          </span>
          <h1 className="font-serif text-3xl font-medium text-meda-text">
            Property & Financial Settings
          </h1>
          <p className="text-xs text-meda-muted mt-1">
            Configure hotel branding, legal policies, Ethiopian payment rails, and tax formulas.
          </p>
        </div>
      </div>

      {saved && (
        <div className="rounded-xl border border-botanical/30 bg-botanical-pale p-4 text-xs text-olive flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-botanical shrink-0" />
          <span>Property and tax configuration updated successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Hotel Information */}
        <div className="rounded-2xl border border-meda-border bg-[#FAF7F2] p-6 shadow-subtle space-y-4">
          <h3 className="font-serif text-xl text-olive flex items-center gap-2">
            <Building className="h-4 w-4 text-botanical" />
            Hotel Identity & Location
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-meda-muted mb-1">
                Property Name
              </label>
              <Input
                value={property.name}
                onChange={(e) => setProperty({ ...property, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-meda-muted mb-1">
                Tagline
              </label>
              <Input
                value={property.tagline}
                onChange={(e) => setProperty({ ...property, tagline: e.target.value })}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium uppercase tracking-wider text-meda-muted mb-1">
                Address Line (Bole Enclave)
              </label>
              <Input
                value={property.address_line1}
                onChange={(e) => setProperty({ ...property, address_line1: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-meda-muted mb-1">
                Concierge Phone
              </label>
              <Input
                value={property.phone}
                onChange={(e) => setProperty({ ...property, phone: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-meda-muted mb-1">
                Inquiry Email
              </label>
              <Input
                value={property.email}
                onChange={(e) => setProperty({ ...property, email: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Operating Timings & Taxes */}
        <div className="rounded-2xl border border-meda-border bg-[#FAF7F2] p-6 shadow-subtle space-y-4">
          <h3 className="font-serif text-xl text-olive flex items-center gap-2">
            <Clock className="h-4 w-4 text-botanical" />
            Operational Policies & Taxes
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block font-medium text-meda-muted mb-1">Default Currency</label>
              <Input
                value={property.currency}
                disabled
                className="bg-sand/30 font-mono"
              />
            </div>

            <div>
              <label className="block font-medium text-meda-muted mb-1">Timezone</label>
              <Input
                value={property.timezone}
                disabled
                className="bg-sand/30 font-mono"
              />
            </div>

            <div>
              <label className="block font-medium text-meda-muted mb-1">Service Charge (%)</label>
              <Input
                type="number"
                value={settings.service_charge_percentage}
                onChange={(e) =>
                  setSettings({ ...settings, service_charge_percentage: Number(e.target.value) })
                }
              />
            </div>

            <div>
              <label className="block font-medium text-meda-muted mb-1">VAT (%)</label>
              <Input
                type="number"
                value={settings.vat_percentage}
                onChange={(e) =>
                  setSettings({ ...settings, vat_percentage: Number(e.target.value) })
                }
              />
            </div>
          </div>
        </div>

        {/* Ethiopian Payment Rails */}
        <div className="rounded-2xl border border-meda-border bg-[#FAF7F2] p-6 shadow-subtle space-y-4">
          <h3 className="font-serif text-xl text-olive flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-botanical" />
            Ethiopian Payment Channels
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-meda-muted mb-1">
                Telebirr Merchant Code
              </label>
              <Input
                value={settings.telebirr_merchant_id || ""}
                onChange={(e) => setSettings({ ...settings, telebirr_merchant_id: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-meda-muted mb-1">
                Commercial Bank of Ethiopia (CBE) A/C
              </label>
              <Input
                value={settings.cbe_account_number || ""}
                onChange={(e) => setSettings({ ...settings, cbe_account_number: e.target.value })}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium uppercase tracking-wider text-meda-muted mb-1">
                Bank Transfer Settlement Instructions
              </label>
              <textarea
                rows={3}
                value={settings.bank_transfer_instructions || ""}
                onChange={(e) =>
                  setSettings({ ...settings, bank_transfer_instructions: e.target.value })
                }
                className="w-full rounded-xl border border-meda-border bg-[#FDFBF7] p-3 text-xs text-meda-text focus:outline-none focus:ring-1 focus:ring-olive"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" variant="primary" className="rounded-full px-8 text-xs uppercase tracking-widest font-semibold">
            Save System Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
