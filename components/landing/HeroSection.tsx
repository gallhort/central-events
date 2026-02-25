"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Search, Calendar, MapPin, ChevronDown } from "lucide-react";

const CATEGORIES = [
  { value: "", label: "Toutes catégories" },
  { value: "traiteur", label: "Traiteur" },
  { value: "photographe", label: "Photographe" },
  { value: "dj", label: "DJ / Animation" },
  { value: "salle", label: "Salle de réception" },
  { value: "fleuriste", label: "Fleuriste" },
  { value: "videaste", label: "Vidéaste" },
  { value: "sono", label: "Sono / Lumière" },
  { value: "autre", label: "Autre" },
];

export function HeroSection() {
  const router = useRouter();
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (category) params.set("categorie", category);
    if (city) params.set("ville", city);
    router.push(`/recherche?${params.toString()}`);
  };

  return (
    <section
      className="relative min-h-[85vh] flex items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)" }}
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #f59e0b, transparent)" }}
        />
        <div
          className="absolute bottom-0 -left-24 w-80 h-80 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #f59e0b, transparent)" }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
          <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
          <span className="text-amber-300 text-sm font-medium">
            100+ organisateurs font déjà confiance à Central Events
          </span>
        </div>

        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          Trouvez les prestataires
          <span className="block text-amber-400">parfaits pour votre</span>
          événement
        </h1>

        <p className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl mx-auto">
          Connectez-vous avec les meilleurs traiteurs, photographes, DJ et bien plus.
          Comparez, contactez et créez des événements inoubliables.
        </p>

        {/* Search bar */}
        <form
          onSubmit={handleSearch}
          className="bg-white rounded-2xl shadow-2xl p-2 flex flex-col md:flex-row gap-2 max-w-3xl mx-auto mb-10"
        >
          <div className="flex-1 flex items-center gap-3 px-4 py-2 bg-[#f8f7f4] rounded-xl">
            <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="flex-1 bg-transparent text-[#1a1a2e] text-sm font-medium outline-none cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 flex items-center gap-3 px-4 py-2 bg-[#f8f7f4] rounded-xl">
            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Paris, Lyon, Marseille..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="flex-1 bg-transparent text-[#1a1a2e] text-sm placeholder:text-gray-400 outline-none"
            />
          </div>

          <Button
            type="submit"
            className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl font-semibold whitespace-nowrap"
          >
            <Search className="w-4 h-4 mr-2" />
            Rechercher
          </Button>
        </form>

        {/* Dual CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => router.push("/recherche")}
            size="lg"
            className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 text-base font-semibold rounded-xl"
          >
            Je cherche un prestataire
          </Button>
          <Button
            onClick={() => router.push("/auth/inscription?role=prestataire")}
            size="lg"
            variant="outline"
            className="border-2 border-white text-white hover:bg-white hover:text-[#1a1a2e] px-8 py-4 text-base font-semibold rounded-xl bg-transparent"
          >
            Je suis prestataire
          </Button>
        </div>

        {/* Trust indicators */}
        <div className="flex flex-wrap justify-center gap-6 mt-10 text-white/50 text-sm">
          <span>✓ Gratuit pour commencer</span>
          <span>✓ Prestataires vérifiés</span>
          <span>✓ Réponse en 24h</span>
          <span>✓ 0% de commission</span>
        </div>
      </div>
    </section>
  );
}
