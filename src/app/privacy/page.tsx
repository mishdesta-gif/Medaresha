import * as React from "react";
import { PublicNavbar } from "@/components/public/navbar";
import { PublicFooter } from "@/components/public/footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-ivory">
      <PublicNavbar />
      <main className="flex-1 py-12 px-6 lg:px-12 max-w-4xl mx-auto w-full">
        <h1 className="font-serif text-4xl text-meda-text mb-6">Privacy & Data Protection</h1>
        <div className="rounded-2xl border border-meda-border bg-[#FAF7F2] p-8 space-y-4 text-sm text-meda-muted leading-relaxed">
          <p>
            Medaresha Hospitality PLC values your trust and is committed to protecting your personal information.
          </p>
          <h3 className="font-serif text-xl text-olive pt-2">Data Collection & Storage</h3>
          <p>
            We collect guest contact details (name, email, phone number) and booking preferences solely for reservation fulfillment, reception check-in verification, and legal hospitality registration.
          </p>
          <h3 className="font-serif text-xl text-olive pt-2">Payment Card Data</h3>
          <p>
            We adhere strictly to PCI data minimization standards. We never record, process, or store raw credit card numbers or card security codes on our servers.
          </p>
          <h3 className="font-serif text-xl text-olive pt-2">Confidentiality</h3>
          <p>
            Guest profiles, identification numbers, and stay records are protected under database Row Level Security and are accessible only to authorized property management staff.
          </p>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
