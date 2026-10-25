"use client";

import * as React from "react";
import { PublicNavbar } from "@/components/public/navbar";
import { PublicFooter } from "@/components/public/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Phone, Mail, Clock, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-ivory">
      <PublicNavbar />

      <main className="flex-1 py-12 px-6 lg:px-12 max-w-6xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.25em] text-botanical font-medium">
            Reach Out
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-meda-text mt-2">
            Contact & Location
          </h1>
          <p className="mt-3 text-sm text-meda-muted leading-relaxed">
            Our concierge team is available 24 hours a day to assist with suite inquiries, private reservations, and bespoke travel arrangements.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Details Card */}
          <div className="rounded-2xl border border-meda-border bg-[#FAF7F2] p-8 shadow-subtle space-y-6">
            <h3 className="font-serif text-2xl text-olive">Bole Enclave Location</h3>

            <div className="space-y-4 text-sm text-meda-text">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-botanical shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-meda-text font-medium">Address</strong>
                  <span className="text-meda-muted">Cameroon Street, Bole Sub-City, Kebele 03, Addis Ababa, Ethiopia</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-botanical shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-meda-text font-medium">Direct Telephone</strong>
                  <span className="text-meda-muted">+251 11 667 9800 / +251 911 000 111</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-botanical shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-meda-text font-medium">Concierge Email</strong>
                  <span className="text-meda-muted">concierge@medaresha.com / reservations@medaresha.com</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-botanical shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-meda-text font-medium">Operating Hours</strong>
                  <span className="text-meda-muted">Front Desk & Reception: 24/7 • Check-in: 14:00 • Check-out: 11:00</span>
                </div>
              </div>
            </div>

            <div className="border-t border-meda-border pt-4 text-xs text-meda-muted">
              <p>Chauffeur airport transfer is available upon request for flights arriving at Addis Ababa Bole International Airport (ADD), located 7 minutes away.</p>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="rounded-2xl border border-meda-border bg-[#FAF7F2] p-8 shadow-subtle">
            <h3 className="font-serif text-2xl text-olive mb-4">Send an Inquiry</h3>

            {submitted ? (
              <div className="py-12 text-center space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-botanical-pale text-botanical">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h4 className="font-serif text-xl text-olive">Inquiry Received</h4>
                <p className="text-xs text-meda-muted">
                  Thank you. Our concierge will review your message and reply within 4 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-meda-muted mb-1">
                    Your Name *
                  </label>
                  <Input required placeholder="e.g. Martha Hailu" />
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-meda-muted mb-1">
                    Email Address *
                  </label>
                  <Input type="email" required placeholder="martha@example.com" />
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-meda-muted mb-1">
                    Phone Number
                  </label>
                  <Input placeholder="+251 9..." />
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-meda-muted mb-1">
                    Message or Special Inquiry *
                  </label>
                  <textarea
                    rows={4}
                    required
                    className="w-full rounded-xl border border-meda-border bg-[#FDFBF7] p-3 text-sm text-meda-text focus:outline-none focus:ring-1 focus:ring-olive"
                    placeholder="Tell us about your upcoming visit or event requirements..."
                  />
                </div>

                <Button type="submit" variant="primary" className="w-full rounded-full text-xs uppercase tracking-widest">
                  Submit Message
                </Button>
              </form>
            )}
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
