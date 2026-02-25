"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ProviderCard, ProviderCardData } from "@/components/common/ProviderCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search, SlidersHorizontal, X } from "lucide-react";

const CATEGORIES = [
  { value: "all", label: "Toutes catégories" },
  { value: "traiteur", label: "Traiteur" },
  { value: "photographe", label: "Photographe" },
  { value: "dj", label: "DJ / Animation" },
  { value: "salle", label: "Salle de réception" },
  { value: "fleuriste", label: "Fleuriste" },
  { value: "videaste", label: "Vidéaste" },
  { value: "sono", label: "Sono / Lumière" },
  { value: "autre", label: "Autre" },
];

const EVENTS = [
  { value: "all", label: "Tous types" },
  { value: "mariage", label: "Mariage" },
  { value: "anniversaire", label: "Anniversaire" },
  { value: "seminaire", label: "Séminaire" },
  { value: "soiree-entreprise", label: "Soirée d'entreprise" },
  { value: "autre", label: "Autre" },
];

interface SearchResult {
  prestataires: ProviderCardData[];
  total: number;
  page: number;
  totalPages: number;
}

export function SearchClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [filters, setFilters] = useState({
    categorie: searchParams.get("categorie") ?? "all",
    ville: searchParams.get("ville") ?? "",
    typeEvenement: "all",
    minNote: 0,
    sort: "pertinence",
    page: 1,
  });

  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const fetchResults = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.categorie && filters.categorie !== "all") params.set("categorie", filters.categorie);
    if (filters.ville) params.set("ville", filters.ville);
    if (filters.typeEvenement && filters.typeEvenement !== "all") params.set("typeEvenement", filters.typeEvenement);
    if (filters.minNote > 0) params.set("minNote", filters.minNote.toString());
    if (priceRange[0] > 0) params.set("minPrix", priceRange[0].toString());
    if (priceRange[1] < 5000) params.set("maxPrix", priceRange[1].toString());
    params.set("sort", filters.sort);
    params.set("page", filters.page.toString());

    try {
      const res = await fetch(`/api/prestataires?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setResults(data);
    } catch {
      setResults(null);
    } finally {
      setLoading(false);
    }
  }, [filters, priceRange]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const handleFilterChange = (key: string, value: string | number) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: key === "page" ? (value as number) : 1 }));
  };

  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      {/* Top search bar */}
      <div className="bg-white border-b border-gray-100 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="text-xs font-medium text-gray-500 mb-1 block">Catégorie</label>
              <Select
                value={filters.categorie}
                onValueChange={(v) => handleFilterChange("categorie", v)}
              >
                <SelectTrigger className="bg-[#f8f7f4] border-0">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="text-xs font-medium text-gray-500 mb-1 block">Ville</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Paris, Lyon..."
                  value={filters.ville}
                  onChange={(e) => handleFilterChange("ville", e.target.value)}
                  className="pl-9 bg-[#f8f7f4] border-0"
                />
              </div>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="text-xs font-medium text-gray-500 mb-1 block">Type d'événement</label>
              <Select
                value={filters.typeEvenement}
                onValueChange={(v) => handleFilterChange("typeEvenement", v)}
              >
                <SelectTrigger className="bg-[#f8f7f4] border-0">
                  <SelectValue placeholder="Type d'événement" />
                </SelectTrigger>
                <SelectContent>
                  {EVENTS.map((e) => (
                    <SelectItem key={e.value} value={e.value}>
                      {e.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-w-[150px]">
              <label className="text-xs font-medium text-gray-500 mb-1 block">Trier par</label>
              <Select
                value={filters.sort}
                onValueChange={(v) => handleFilterChange("sort", v)}
              >
                <SelectTrigger className="bg-[#f8f7f4] border-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pertinence">Pertinence</SelectItem>
                  <SelectItem value="note">Meilleure note</SelectItem>
                  <SelectItem value="prix_asc">Prix croissant</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar filters */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl p-6 shadow-card sticky top-24">
              <h3 className="font-semibold text-[#1a1a2e] mb-6 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                Filtres
              </h3>

              {/* Note minimale */}
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 mb-3 block">
                  Note minimale : {filters.minNote > 0 ? `${filters.minNote}/5` : "Toutes"}
                </label>
                <div className="flex gap-2">
                  {[0, 3, 4, 4.5].map((note) => (
                    <button
                      key={note}
                      onClick={() => handleFilterChange("minNote", note)}
                      className={`text-xs px-2 py-1 rounded-full border transition-colors ${
                        filters.minNote === note
                          ? "bg-amber-500 border-amber-500 text-white"
                          : "border-gray-200 hover:border-amber-300"
                      }`}
                    >
                      {note === 0 ? "Toutes" : `${note}+`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fourchette de prix */}
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 mb-3 block">
                  Budget : {priceRange[0]}€ — {priceRange[1] >= 5000 ? "5000€+" : `${priceRange[1]}€`}
                </label>
                <Slider
                  min={0}
                  max={5000}
                  step={100}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="w-full"
                />
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setFilters({
                    categorie: "all",
                    ville: "",
                    typeEvenement: "all",
                    minNote: 0,
                    sort: "pertinence",
                    page: 1,
                  });
                  setPriceRange([0, 5000]);
                }}
                className="w-full text-xs"
              >
                <X className="w-3 h-3 mr-1" />
                Réinitialiser les filtres
              </Button>
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1">
            {/* Results count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-500">
                {loading ? (
                  <span className="inline-block w-32 h-4 bg-gray-200 rounded animate-pulse" />
                ) : (
                  <>
                    <span className="font-semibold text-[#1a1a2e]">{results?.total ?? 0}</span>{" "}
                    prestataire{(results?.total ?? 0) !== 1 ? "s" : ""} trouvé
                    {(results?.total ?? 0) !== 1 ? "s" : ""}
                  </>
                )}
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-card">
                    <Skeleton className="h-48 w-full" />
                    <div className="p-4 space-y-3">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                      <Skeleton className="h-3 w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : results && results.prestataires.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {results.prestataires.map((provider) => (
                    <ProviderCard key={provider.id} provider={provider} />
                  ))}
                </div>

                {/* Pagination */}
                {results.totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-10">
                    {Array.from({ length: results.totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => handleFilterChange("page", p)}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                          p === filters.page
                            ? "bg-[#1a1a2e] text-white"
                            : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <span className="text-6xl mb-4 block">🔍</span>
                <h3 className="font-display text-xl font-bold text-[#1a1a2e] mb-2">
                  Aucun prestataire trouvé
                </h3>
                <p className="text-gray-500 mb-6">
                  Essayez de modifier vos filtres ou de chercher dans une autre ville
                </p>
                <Button
                  onClick={() => {
                    setFilters({
                      categorie: "all",
                      ville: "",
                      typeEvenement: "all",
                      minNote: 0,
                      sort: "pertinence",
                      page: 1,
                    });
                    setPriceRange([0, 5000]);
                  }}
                  className="bg-amber-500 hover:bg-amber-600 text-white"
                >
                  Effacer les filtres
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
