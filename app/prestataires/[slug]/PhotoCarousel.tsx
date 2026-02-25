"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PhotoCarouselProps {
  photos: string[];
  name: string;
}

export function PhotoCarousel({ photos, name }: PhotoCarouselProps) {
  const [current, setCurrent] = useState(0);

  if (photos.length === 0) {
    return (
      <div className="w-full h-72 md:h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
        <span className="text-7xl opacity-20">📸</span>
      </div>
    );
  }

  const prev = () => setCurrent((c) => (c - 1 + photos.length) % photos.length);
  const next = () => setCurrent((c) => (c + 1) % photos.length);

  return (
    <div className="relative rounded-2xl overflow-hidden bg-gray-100">
      <div className="relative h-72 md:h-96">
        <Image
          src={photos[current]}
          alt={`${name} - photo ${current + 1}`}
          fill
          className="object-cover transition-opacity duration-300"
          sizes="(max-width: 768px) 100vw, 60vw"
          priority={current === 0}
        />
      </div>

      {photos.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Photo précédente"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-[#1a1a2e]" />
          </button>
          <button
            onClick={next}
            aria-label="Photo suivante"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-[#1a1a2e]" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Aller à la photo ${i + 1}`}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === current ? "bg-white w-6" : "bg-white/50"
                }`}
              />
            ))}
          </div>

          {/* Thumbnails */}
          <div className="flex gap-2 p-3 bg-white border-t border-gray-100">
            {photos.map((photo, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Photo ${i + 1}`}
                className={`relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 ring-2 transition-all ${
                  i === current ? "ring-amber-500" : "ring-transparent opacity-60 hover:opacity-80"
                }`}
              >
                <Image src={photo} alt="" fill className="object-cover" sizes="64px" />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
