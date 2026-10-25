import * as React from "react";
import { PublicNavbar } from "@/components/public/navbar";
import { PublicFooter } from "@/components/public/footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-ivory">
      <PublicNavbar />

      <main className="flex-1 py-12 px-6 lg:px-12 max-w-4xl mx-auto w-full">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-[0.25em] text-botanical font-medium">
            Our Story
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-meda-text mt-2">
            The Spirit of Medaresha
          </h1>
        </div>

        <div className="prose prose-stone max-w-none space-y-6 text-meda-text/90 leading-relaxed text-base">
          <p className="font-serif text-2xl text-olive leading-snug">
            “Medaresha was conceived not as a conventional hotel, but as a sanctuary where the senses are soothed, time expands, and hospitality is shared with graceful authenticity.”
          </p>

          <p>
            Addis Ababa is a city of electric energy, towering eucalyptus hills, and profound history. Amidst this vibrant diplomatic capital, Medaresha offers a quiet threshold—an architectural retreat rooted in the natural geography and material culture of the Ethiopian highlands.
          </p>

          <h3 className="font-serif text-2xl text-olive mt-8">Warm Minimalism & Native Craft</h3>
          <p>
            Every texture within the property has been intentionally chosen. From our custom olivewood cabinetry handcrafted by local artisans to the hand-loomed Sheba cotton linens on each bed, we honor the ancient craftsmanship of Ethiopia while delivering modern acoustic engineering, climate control, and digital convenience.
          </p>

          <h3 className="font-serif text-2xl text-olive mt-8">Mindful Hospitality</h3>
          <p>
            In Ethiopian culture, a guest is welcomed as an honored blessing. Our service philosophy is warm, discreet, and deeply attentive. From arranging seamless airport transfers and private gallery visits to preparing early sunrise breakfast baskets, our concierge team is devoted to making your stay effortless.
          </p>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
