import * as React from "react";
import Link from "next/link";
import { PublicNavbar } from "@/components/public/navbar";
import { PublicFooter } from "@/components/public/footer";
import { QuickSearch } from "@/components/public/quick-search";
import { RoomCard } from "@/components/public/room-card";
import { INITIAL_ROOM_TYPES, INITIAL_PROPERTY } from "@/data/mock-database";
import { Sparkles, Coffee, ShieldCheck, HeartHandshake, Compass, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const featuredRooms = INITIAL_ROOM_TYPES.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-ivory">
      <PublicNavbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-sand px-6 pt-12 pb-24 lg:px-12">
          {/* Subtle Photographic Backdrop */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2000&q=85"
              alt="Medaresha Luxury Hotel Exterior & Gardens"
              className="h-full w-full object-cover object-center filter brightness-[0.88]"
            />
            {/* Warm Gradient Overlay matching MOYA ivory & olive atmosphere */}
            <div className="absolute inset-0 bg-gradient-to-t from-ivory via-ivory/50 to-olive/30" />
          </div>

          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <span className="inline-block rounded-full bg-ivory/90 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.25em] text-olive backdrop-blur-md shadow-subtle mb-6">
              Boutique Sanctuary • Bole, Addis Ababa
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal leading-tight text-meda-text">
              Unhurried Luxury. <br />
              <span className="italic font-light">Mindful Ethiopian Grace.</span>
            </h1>
            <p className="mt-6 text-base sm:text-lg text-meda-text/80 max-w-2xl mx-auto leading-relaxed">
              Step into an intimate sanctuary where raw timber, hand-woven Sheba cotton, and fragrant garden courtyards meet world-class hospitality.
            </p>

            {/* Embedded Quick Search Engine */}
            <div className="mt-10 max-w-3xl mx-auto">
              <QuickSearch />
            </div>
          </div>
        </section>

        {/* CORE HIGHLIGHTS / PILLARS */}
        <section className="border-y border-meda-border bg-[#F8F4EC] py-12 px-6 lg:px-12">
          <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-sand p-3 text-olive">
                <Coffee className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-serif text-lg text-olive">Traditional Buna Ceremony</h4>
                <p className="text-xs text-meda-muted mt-1 leading-relaxed">
                  Daily artisanal roasting of single-origin Yirgacheffe and Sidama beans in our courtyard garden.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="rounded-full bg-sand p-3 text-olive">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-serif text-lg text-olive">Botanical Wellness</h4>
                <p className="text-xs text-meda-muted mt-1 leading-relaxed">
                  Natural essential oil therapies, steam pavilion, and eucalyptus-infused relaxation lounges.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="rounded-full bg-sand p-3 text-olive">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-serif text-lg text-olive">Direct Booking Guarantee</h4>
                <p className="text-xs text-meda-muted mt-1 leading-relaxed">
                  Guaranteed lowest rates, flexible 48h cancellation, and complimentary airport chauffeur.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="rounded-full bg-sand p-3 text-olive">
                <Compass className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-serif text-lg text-olive">Diplomatic Bole Enclave</h4>
                <p className="text-xs text-meda-muted mt-1 leading-relaxed">
                  7 minutes from Bole International Airport, adjacent to premier embassies and dining avenues.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED SUITES & ROOMS */}
        <section className="py-20 px-6 lg:px-12 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-botanical font-medium">
                The Living Spaces
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl text-meda-text mt-2">
                Suites & Residences
              </h2>
            </div>
            <Link href="/rooms" className="mt-4 md:mt-0 flex items-center gap-2 text-sm text-olive hover:underline font-medium">
              View All 4 Categories
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredRooms.map((room) => (
              <RoomCard key={room.id} roomType={room} />
            ))}
          </div>
        </section>

        {/* PHILOSOPHY & STORY */}
        <section className="bg-sand/60 py-24 px-6 lg:px-12 border-t border-meda-border">
          <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <span className="text-xs uppercase tracking-[0.25em] text-botanical font-medium">
                The Medaresha Essence
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl text-meda-text leading-tight">
                Designed to slow your pulse and restore your calm.
              </h2>
              <p className="text-meda-text/80 text-base leading-relaxed">
                In Amharic, <em>Medaresha</em> signifies a destination of arrival and true rest. We created this boutique residence to be more than a hotel: an urban haven inspired by warm natural earth tones, bespoke timber joinery, and the timeless warmth of Ethiopian hospitality.
              </p>
              <p className="text-meda-muted text-sm leading-relaxed">
                Whether you are visiting Addis Ababa for diplomatic missions, cultural discoveries, or unhurried retreat, each suite is curated with acoustic double glazing, artisanal tea bars, and attentive 24-hour concierge care.
              </p>
              <div className="pt-2">
                <Link href="/about">
                  <Button variant="outline" className="rounded-full px-6 text-xs uppercase tracking-widest">
                    Discover Our Story
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden border border-meda-border shadow-elevated">
                <img
                  src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80"
                  alt="Medaresha Luxury Suite Interior"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 rounded-2xl bg-ivory p-6 border border-meda-border shadow-modal max-w-xs hidden sm:block">
                <p className="font-serif text-lg text-olive">“An extraordinary oasis of calm in the vibrant capital.”</p>
                <p className="text-xs text-meda-muted mt-2">— Discerning Hospitality Review 2026</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
