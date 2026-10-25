import * as React from "react";
import { PublicNavbar } from "@/components/public/navbar";
import { PublicFooter } from "@/components/public/footer";

const GALLERY_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    title: "Medaresha Architectural Facade",
    category: "Architecture",
  },
  {
    url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
    title: "Presidential Living Pavilion",
    category: "Suites",
  },
  {
    url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
    title: "Stone Soaking Tub & Botanicals",
    category: "Baths",
  },
  {
    url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
    title: "Executive Bedroom with Work Lounge",
    category: "Suites",
  },
  {
    url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
    title: "Spa Relaxation Pavilions",
    category: "Wellness",
  },
  {
    url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80",
    title: "Afternoon Coffee Ceremony Ritual",
    category: "Traditions",
  },
  {
    url: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80",
    title: "Botanical Deluxe Bedroom",
    category: "Suites",
  },
  {
    url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    title: "Courtyard Dining Room at Dusk",
    category: "Dining",
  },
];

export default function GalleryPage() {
  return (
    <div className="min-h-screen flex flex-col bg-ivory">
      <PublicNavbar />

      <main className="flex-1 py-12 px-6 lg:px-12 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.25em] text-botanical font-medium">
            Visual Journey
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-meda-text mt-2">
            Photographic Collection
          </h1>
          <p className="mt-3 text-sm text-meda-muted leading-relaxed">
            A visual chronicle of natural highland textures, quiet courtyards, and warm luxury.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {GALLERY_IMAGES.map((img, i) => (
            <div
              key={i}
              className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-sand border border-meda-border shadow-subtle"
            >
              <img
                src={img.url}
                alt={img.title}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-olive/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-end p-5 text-ivory">
                <span className="text-[10px] uppercase tracking-widest text-botanical-pale">
                  {img.category}
                </span>
                <span className="font-serif text-lg">{img.title}</span>
              </div>
            </div>
          ))}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
