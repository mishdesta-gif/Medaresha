import * as React from "react";
import { PublicNavbar } from "@/components/public/navbar";
import { PublicFooter } from "@/components/public/footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-ivory">
      <PublicNavbar />
      <main className="flex-1 py-12 px-6 lg:px-12 max-w-4xl mx-auto w-full">
        <h1 className="font-serif text-4xl text-meda-text mb-6">Terms & Conditions</h1>
        <div className="rounded-2xl border border-meda-border bg-[#FAF7F2] p-8 space-y-4 text-sm text-meda-muted leading-relaxed">
          <p>
            Welcome to Medaresha Hotel & Residences. By making a reservation through our website or direct reservation engine, you agree to these Terms & Conditions.
          </p>
          <h3 className="font-serif text-xl text-olive pt-2">Reservation Guarantee & Rates</h3>
          <p>
            Confirmed bookings guarantee the agreed nightly room rate, applicable taxes, and assigned category. Prices are quoted in Ethiopian Birr (ETB) and converted at official prevailing rates where foreign currency cards are settled.
          </p>
          <h3 className="font-serif text-xl text-olive pt-2">Liability & Property Care</h3>
          <p>
            Guests are kindly requested to treat the property, furnishings, and botanical grounds with care. Any intentional damage or loss of property will be charged to the registered guest folio.
          </p>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
