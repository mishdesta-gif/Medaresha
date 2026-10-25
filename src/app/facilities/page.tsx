import * as React from "react";
import { PublicNavbar } from "@/components/public/navbar";
import { PublicFooter } from "@/components/public/footer";
import { AMENITIES } from "@/data/mock-database";
import { Coffee, Sparkles, Utensils, Wind, ShieldCheck } from "lucide-react";

export default function FacilitiesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-ivory">
      <PublicNavbar />

      <main className="flex-1 py-12 px-6 lg:px-12 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-botanical font-medium">
            Experiences & Wellbeing
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-meda-text mt-2">
            Sanctuary & Facilities
          </h1>
          <p className="mt-3 text-sm text-meda-muted leading-relaxed">
            Curated spaces dedicated to nourishment, rejuvenation, and the timeless rituals of Ethiopian culture.
          </p>
        </div>

        {/* Feature 1: The Traditional Buna Ceremony Pavilion */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="aspect-[16/11] rounded-3xl overflow-hidden bg-sand border border-meda-border shadow-elevated">
            <img
              src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80"
              alt="Traditional Ethiopian Buna Ceremony"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-[0.2em] text-botanical font-medium flex items-center gap-1.5">
              <Coffee className="h-4 w-4" />
              Cultural Heritage
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-meda-text">
              The Buna Ceremony Pavilion
            </h2>
            <p className="text-sm text-meda-muted leading-relaxed">
              Every morning and late afternoon, our garden courtyard welcomes guests to the fragrant ritual of traditional Ethiopian coffee. Single-origin green beans from Yirgacheffe and Keffa are roasted over open embers, gently ground, and brewed in earthen <em>jebena</em> pots with fresh rue and frankincense.
            </p>
            <p className="text-xs text-meda-muted italic">Complimentary for all resident guests daily.</p>
          </div>
        </div>

        {/* Feature 2: Botanical Wellness Spa & Steam */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20 lg:flex-row-reverse">
          <div className="space-y-4 lg:order-2">
            <span className="text-xs uppercase tracking-[0.2em] text-botanical font-medium flex items-center gap-1.5">
              <Sparkles className="h-4 w-4" />
              Restoration
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-meda-text">
              Botanical Spa & Eucalyptus Steam
            </h2>
            <p className="text-sm text-meda-muted leading-relaxed">
              Draw warmth into your body after a day in the highlands. Our wellness suite includes a cedar-lined eucalyptus steam room, hydrotherapy stone tubs, and organic botanical massage rituals utilizing virgin olive oil and indigenous botanical infusions.
            </p>
            <ul className="text-xs text-meda-muted space-y-1 list-disc pl-4">
              <li>Highland Herbal Deep Tissue Massage</li>
              <li>Aromatherapy Steam Pavilion</li>
              <li>Private Couples Soaking Suites</li>
            </ul>
          </div>
          <div className="aspect-[16/11] rounded-3xl overflow-hidden bg-sand border border-meda-border shadow-elevated lg:order-1">
            <img
              src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80"
              alt="Medaresha Botanical Spa"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Feature 3: Dining at Sheba Lounge */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
          <div className="aspect-[16/11] rounded-3xl overflow-hidden bg-sand border border-meda-border shadow-elevated">
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80"
              alt="Sheba Courtyard Dining"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-[0.2em] text-botanical font-medium flex items-center gap-1.5">
              <Utensils className="h-4 w-4" />
              Artisanal Cuisine
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-meda-text">
              The Courtyard Dining Room
            </h2>
            <p className="text-sm text-meda-muted leading-relaxed">
              Celebrating both contemporary continental gastronomy and delicate Ethiopian culinary traditions. From breakfast sourdough and wild forest honey to wood-fired dinners paired with select international and Rift Valley wines.
            </p>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
