import * as React from "react";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock, ShieldCheck } from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="border-t border-meda-border bg-[#EFE9DC] text-meda-text">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* Brand & Introduction */}
          <div className="space-y-4 md:col-span-1">
            <span className="font-serif text-2xl tracking-[0.25em] text-olive font-medium block">
              MEDARESHA
            </span>
            <p className="text-xs uppercase tracking-widest text-botanical font-medium">
              Boutique Hotel & Residences
            </p>
            <p className="text-sm leading-relaxed text-meda-muted">
              A serene haven celebrating contemporary comfort, natural textures, and traditional Ethiopian hospitality in the heart of Addis Ababa.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-lg text-olive">Explore</h4>
            <ul className="space-y-2 text-sm text-meda-muted">
              <li>
                <Link href="/rooms" className="hover:text-olive transition-colors">
                  Rooms & Suites
                </Link>
              </li>
              <li>
                <Link href="/availability" className="hover:text-olive transition-colors">
                  Availability Calendar
                </Link>
              </li>
              <li>
                <Link href="/facilities" className="hover:text-olive transition-colors">
                  Wellness & Dining
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-olive transition-colors">
                  Photographic Gallery
                </Link>
              </li>
              <li>
                <Link href="/booking/lookup" className="hover:text-olive transition-colors">
                  Manage Booking
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies & Legal */}
          <div className="space-y-3">
            <h4 className="font-serif text-lg text-olive">Policies</h4>
            <ul className="space-y-2 text-sm text-meda-muted">
              <li>
                <Link href="/policies" className="hover:text-olive transition-colors">
                  Cancellation & Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-olive transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-olive transition-colors">
                  Privacy & Data Protection
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-olive hover:underline flex items-center gap-1 font-medium">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Staff Operations Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="font-serif text-lg text-olive">Contact & Location</h4>
            <div className="space-y-2.5 text-sm text-meda-muted">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-botanical shrink-0 mt-0.5" />
                <span>Cameroon Street, Bole Sub-City, Kebele 03, Addis Ababa, Ethiopia</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-botanical shrink-0" />
                <span>+251 11 667 9800</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-botanical shrink-0" />
                <span>concierge@medaresha.com</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 text-botanical shrink-0" />
                <span>Check-in 14:00 • Check-out 11:00</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-meda-border pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-meda-muted gap-4">
          <p>© {new Date().getFullYear()} Medaresha Hospitality PLC. All rights reserved.</p>
          <p>Local Time: Africa/Addis_Ababa • Currency: ETB</p>
        </div>
      </div>
    </footer>
  );
}
