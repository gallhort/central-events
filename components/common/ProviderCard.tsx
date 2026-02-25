import Link from "next/link";
import Image from "next/image";
import { MapPin, CheckCircle, Euro } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StarRating } from "./StarRating";
import { cn } from "@/lib/utils";

export interface ProviderCardData {
  id: string;
  slug: string;
  nomEntreprise: string;
  categorie: string;
  ville: string;
  photos: string[];
  prixMin: number | null;
  prixMax: number | null;
  noteGlobale: number | null;
  nbAvis: number;
  verifie: boolean;
  disponible: boolean;
}

const CATEGORY_LABELS: Record<string, string> = {
  traiteur: "Traiteur",
  photographe: "Photographe",
  dj: "DJ / Animation",
  salle: "Salle de réception",
  fleuriste: "Fleuriste",
  videaste: "Vidéaste",
  sono: "Sono / Lumière",
  autre: "Autre",
};

interface ProviderCardProps {
  provider: ProviderCardData;
  className?: string;
}

export function ProviderCard({ provider, className }: ProviderCardProps) {
  const mainPhoto = provider.photos[0];

  return (
    <div
      className={cn(
        "group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 hover:-translate-y-1",
        className
      )}
    >
      {/* Photo */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {mainPhoto ? (
          <Image
            src={mainPhoto}
            alt={provider.nomEntreprise}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <span className="text-5xl opacity-30">📸</span>
          </div>
        )}

        {/* Badges overlay */}
        <div className="absolute top-3 left-3 flex gap-2">
          {provider.verifie && (
            <span className="flex items-center gap-1 bg-white/95 backdrop-blur-sm rounded-full px-2.5 py-1 text-xs font-semibold text-emerald-600 shadow-sm">
              <CheckCircle className="w-3 h-3" />
              Vérifié
            </span>
          )}
          {!provider.disponible && (
            <span className="bg-red-500/90 text-white rounded-full px-2.5 py-1 text-xs font-semibold">
              Complet
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-[#1a1a2e] text-sm leading-tight line-clamp-2 group-hover:text-amber-600 transition-colors">
            {provider.nomEntreprise}
          </h3>
          <Badge variant="secondary" className="text-xs flex-shrink-0 bg-amber-50 text-amber-700 border-0">
            {CATEGORY_LABELS[provider.categorie] ?? provider.categorie}
          </Badge>
        </div>

        <div className="flex items-center gap-1 text-gray-400 text-xs mb-3">
          <MapPin className="w-3 h-3" />
          <span>{provider.ville}</span>
        </div>

        {/* Rating */}
        {provider.noteGlobale !== null && (
          <div className="flex items-center gap-2 mb-3">
            <StarRating rating={provider.noteGlobale} size="sm" />
            <span className="text-xs font-semibold text-gray-700">
              {provider.noteGlobale.toFixed(1)}
            </span>
            <span className="text-xs text-gray-400">({provider.nbAvis} avis)</span>
          </div>
        )}

        {/* Price & CTA */}
        <div className="flex items-center justify-between mt-4">
          {provider.prixMin !== null ? (
            <div className="flex items-center gap-1 text-sm">
              <Euro className="w-3.5 h-3.5 text-amber-500" />
              <span className="font-semibold text-[#1a1a2e]">
                À partir de {provider.prixMin}€
              </span>
            </div>
          ) : (
            <span className="text-xs text-gray-400">Prix sur devis</span>
          )}

          <Button
            asChild
            size="sm"
            className="bg-[#1a1a2e] hover:bg-amber-500 text-white text-xs px-3 py-2 rounded-lg transition-colors"
          >
            <Link href={`/prestataires/${provider.slug}`}>Voir le profil</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
