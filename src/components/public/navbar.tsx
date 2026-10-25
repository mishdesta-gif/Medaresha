"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Calendar, Search, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PublicNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: "Rooms & Suites", href: "/rooms" },
    { label: "Availability", href: "/availability" },
    { label: "Facilities & Spa", href: "/facilities" },
    { label: "Gallery", href: "/gallery" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-meda-border bg-ivory/95 backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-12">
        {/* Brand Wordmark */}
        <Link href="/" className="group flex flex-col items-start focus:outline-none">
          <span className="font-serif text-2xl tracking-[0.25em] text-olive font-medium transition-colors group-hover:text-olive-900">
            MEDARESHA
          </span>
          <span className="text-[10px] uppercase tracking-[0.3em] text-meda-muted font-sans -mt-1">
            Bole • Addis Ababa
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center space-x-8 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm tracking-wide transition-colors ${
                  isActive
                    ? "font-medium text-olive border-b border-olive pb-0.5"
                    : "text-meda-text/80 hover:text-olive"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center space-x-3 md:flex">
          <Link href="/booking/lookup">
            <Button variant="ghost" size="sm" className="text-xs tracking-wider uppercase text-meda-muted hover:text-olive">
              <Search className="mr-1.5 h-3.5 w-3.5" />
              Find Booking
            </Button>
          </Link>
          <Link href="/rooms">
            <Button variant="primary" size="sm" className="rounded-full px-5 text-xs uppercase tracking-wider">
              <Calendar className="mr-1.5 h-3.5 w-3.5" />
              Reserve
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-lg p-2 text-olive hover:bg-sand/60 md:hidden"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="border-b border-meda-border bg-[#F8F4EC] px-6 py-6 md:hidden">
          <nav className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-serif tracking-wide text-meda-text hover:text-olive"
              >
                {link.label}
              </Link>
            ))}
            <hr className="my-2 border-meda-border" />
            <Link
              href="/booking/lookup"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center text-sm text-meda-muted hover:text-olive"
            >
              <Search className="mr-2 h-4 w-4" />
              Find Existing Reservation
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center text-sm text-meda-muted hover:text-olive"
            >
              <ShieldCheck className="mr-2 h-4 w-4" />
              Staff Portal
            </Link>
            <Link href="/rooms" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" className="w-full mt-2 rounded-full">
                Reserve a Stay
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
