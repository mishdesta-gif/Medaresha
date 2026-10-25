import * as React from "react";
import { PublicNavbar } from "@/components/public/navbar";
import { PublicFooter } from "@/components/public/footer";

export default function PoliciesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-ivory">
      <PublicNavbar />

      <main className="flex-1 py-12 px-6 lg:px-12 max-w-4xl mx-auto w-full">
        <div className="mb-10 text-center">
          <span className="text-xs uppercase tracking-[0.25em] text-botanical font-medium">
            Property Guidelines
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-meda-text mt-2">
            Hotel Policies & Terms
          </h1>
        </div>

        <div className="rounded-2xl border border-meda-border bg-[#FAF7F2] p-8 shadow-subtle space-y-8 text-sm text-meda-text leading-relaxed">
          <div>
            <h3 className="font-serif text-2xl text-olive mb-2">Check-in & Check-out</h3>
            <ul className="list-disc pl-5 space-y-1 text-meda-muted">
              <li>Check-in begins at <strong>14:00</strong> local Addis Ababa time (Africa/Addis_Ababa, UTC+3).</li>
              <li>Check-out must be completed by <strong>11:00</strong>.</li>
              <li>Early arrivals and late departures are accommodated upon request, subject to physical room readiness.</li>
              <li>Valid government-issued identification (Passport, Ethiopian National ID, or Driving License) is required at registration.</li>
            </ul>
          </div>

          <div className="border-t border-meda-border pt-6">
            <h3 className="font-serif text-2xl text-olive mb-2">Cancellation & Refund Policy</h3>
            <ul className="list-disc pl-5 space-y-1 text-meda-muted">
              <li>Cancellations received up to <strong>48 hours</strong> prior to the 14:00 check-in time incur zero cancellation fee.</li>
              <li>Cancellations made within 48 hours of check-in, or in the event of a guest no-show, are billed for the first night of the reserved stay.</li>
              <li>Eligible refunds are processed to the original payment channel (Bank Transfer, Telebirr, or CBE) within 5 business days.</li>
            </ul>
          </div>

          <div className="border-t border-meda-border pt-6">
            <h3 className="font-serif text-2xl text-olive mb-2">Taxes & Service Charges</h3>
            <ul className="list-disc pl-5 space-y-1 text-meda-muted">
              <li>All published nightly rates are subject to <strong>10% Hotel Service Charge</strong> and <strong>15% Value Added Tax (VAT)</strong> in accordance with Ethiopian law.</li>
              <li>All taxes and fees are itemized transparently on guest folios and official VAT receipts.</li>
            </ul>
          </div>

          <div className="border-t border-meda-border pt-6">
            <h3 className="font-serif text-2xl text-olive mb-2">Property Atmosphere & Smoke-Free Standards</h3>
            <ul className="list-disc pl-5 space-y-1 text-meda-muted">
              <li>To safeguard the natural wood finishes and acoustic comfort of all guests, all indoor suites and corridors are strictly 100% smoke-free.</li>
              <li>Designated outdoor botanical courtyard areas are provided for smoking.</li>
              <li>Quiet residential hours are observed between 22:00 and 07:00.</li>
            </ul>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
