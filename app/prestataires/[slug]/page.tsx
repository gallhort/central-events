import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { incrementView } from "@/lib/actions/views";
import { Navbar } from "@/components/common/Navbar";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/common/StarRating";
import { PhotoCarousel } from "./PhotoCarousel";
import { QuoteSidebar } from "./QuoteSidebar";
import {
  CheckCircle,
  MapPin,
  Globe,
  Instagram,
  ChevronRight,
  Star,
} from "lucide-react";

interface Props {
  params: { slug: string };
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const prestataire = await prisma.prestataire.findUnique({
    where: { slug: params.slug },
    select: { nomEntreprise: true, description: true, categorie: true, ville: true },
  });

  if (!prestataire) return { title: "Prestataire introuvable" };

  return {
    title: `${prestataire.nomEntreprise} — ${CATEGORY_LABELS[prestataire.categorie] ?? prestataire.categorie} à ${prestataire.ville}`,
    description:
      prestataire.description?.slice(0, 160) ??
      `Découvrez le profil de ${prestataire.nomEntreprise}, ${CATEGORY_LABELS[prestataire.categorie]} à ${prestataire.ville}`,
  };
}

export async function generateStaticParams() {
  const prestataires = await prisma.prestataire.findMany({ select: { slug: true } });
  return prestataires.map((p) => ({ slug: p.slug }));
}

export default async function PrestatairePage({ params }: Props) {
  const prestataire = await prisma.prestataire.findUnique({
    where: { slug: params.slug },
    include: {
      avis: {
        where: { verifie: true },
        orderBy: { createdAt: "desc" },
        take: 20,
      },
    },
  });

  if (!prestataire) notFound();

  // Increment view count (non-blocking)
  incrementView(prestataire.id).catch(() => {});

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: prestataire.avis.filter((a) => a.note === star).length,
  }));

  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-amber-500 transition-colors">
              Accueil
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/recherche" className="hover:text-amber-500 transition-colors">
              Prestataires
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link
              href={`/recherche?categorie=${prestataire.categorie}`}
              className="hover:text-amber-500 transition-colors"
            >
              {CATEGORY_LABELS[prestataire.categorie]}
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#1a1a2e] font-medium truncate">{prestataire.nomEntreprise}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Badge className="bg-amber-100 text-amber-700 border-0">
                      {CATEGORY_LABELS[prestataire.categorie] ?? prestataire.categorie}
                    </Badge>
                    {prestataire.verifie && (
                      <span className="flex items-center gap-1 text-sm text-emerald-600 font-medium">
                        <CheckCircle className="w-4 h-4" />
                        Vérifié
                      </span>
                    )}
                  </div>
                  <h1 className="font-display text-3xl font-bold text-[#1a1a2e]">
                    {prestataire.nomEntreprise}
                  </h1>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  {prestataire.ville}
                  {prestataire.zoneIntervention && ` · ${prestataire.zoneIntervention}`}
                </span>
                {prestataire.noteGlobale !== null && (
                  <span className="flex items-center gap-2">
                    <StarRating rating={prestataire.noteGlobale} size="sm" />
                    <span className="font-semibold text-[#1a1a2e]">
                      {prestataire.noteGlobale.toFixed(1)}/5
                    </span>
                    <span className="text-gray-400">({prestataire.nbAvis} avis)</span>
                  </span>
                )}
                {prestataire.siteWeb && (
                  <a
                    href={prestataire.siteWeb}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-amber-600 transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    Site web
                  </a>
                )}
                {prestataire.instagram && (
                  <a
                    href={`https://instagram.com/${prestataire.instagram.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-amber-600 transition-colors"
                  >
                    <Instagram className="w-4 h-4" />
                    Instagram
                  </a>
                )}
              </div>
            </div>

            {/* Photo carousel */}
            <PhotoCarousel photos={prestataire.photos} name={prestataire.nomEntreprise} />

            {/* Description */}
            {prestataire.description && (
              <div className="bg-white rounded-2xl p-6 shadow-card">
                <h2 className="font-display text-xl font-bold text-[#1a1a2e] mb-4">
                  À propos
                </h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {prestataire.description}
                </p>
              </div>
            )}

            {/* Services */}
            {prestataire.services.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-card">
                <h2 className="font-display text-xl font-bold text-[#1a1a2e] mb-4">
                  Services proposés
                </h2>
                <div className="flex flex-wrap gap-2">
                  {prestataire.services.map((service) => (
                    <span
                      key={service}
                      className="bg-[#f8f7f4] text-[#1a1a2e] text-sm px-3 py-1.5 rounded-full border border-gray-200 font-medium"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="bg-white rounded-2xl p-6 shadow-card">
              <h2 className="font-display text-xl font-bold text-[#1a1a2e] mb-6">
                Avis clients
              </h2>

              {prestataire.avis.length > 0 ? (
                <>
                  {/* Overall rating */}
                  <div className="flex items-start gap-8 p-4 bg-[#f8f7f4] rounded-xl mb-6">
                    <div className="text-center">
                      <div className="font-display text-5xl font-bold text-[#1a1a2e]">
                        {(
                          prestataire.avis.reduce((sum, a) => sum + a.note, 0) /
                          prestataire.avis.length
                        ).toFixed(1)}
                      </div>
                      <StarRating
                        rating={
                          prestataire.avis.reduce((sum, a) => sum + a.note, 0) /
                          prestataire.avis.length
                        }
                        size="md"
                        className="justify-center mt-1"
                      />
                      <p className="text-xs text-gray-400 mt-1">{prestataire.avis.length} avis</p>
                    </div>
                    <div className="flex-1 space-y-1.5">
                      {ratingDistribution.map(({ star, count }) => (
                        <div key={star} className="flex items-center gap-2 text-sm">
                          <span className="text-xs text-gray-500 w-6">{star}</span>
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                            <div
                              className="bg-amber-400 h-1.5 rounded-full transition-all"
                              style={{
                                width:
                                  prestataire.avis.length > 0
                                    ? `${(count / prestataire.avis.length) * 100}%`
                                    : "0%",
                              }}
                            />
                          </div>
                          <span className="text-xs text-gray-400 w-4">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Individual reviews */}
                  <div className="space-y-4">
                    {prestataire.avis.map((avis) => (
                      <div key={avis.id} className="border-b border-gray-100 pb-4 last:border-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-[#1a1a2e] rounded-full flex items-center justify-center">
                              <span className="text-amber-400 text-sm font-bold">
                                {avis.auteurNom[0]?.toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold text-sm text-[#1a1a2e]">
                                {avis.auteurNom}
                              </p>
                              <p className="text-xs text-gray-400">
                                {new Date(avis.createdAt).toLocaleDateString("fr-FR", {
                                  year: "numeric",
                                  month: "long",
                                })}
                              </p>
                            </div>
                          </div>
                          <StarRating rating={avis.note} size="sm" />
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">{avis.commentaire}</p>
                        {avis.reponse && (
                          <div className="mt-3 ml-4 border-l-2 border-amber-200 pl-3">
                            <p className="text-xs font-semibold text-amber-600 mb-1">
                              Réponse de {prestataire.nomEntreprise}
                            </p>
                            <p className="text-sm text-gray-500">{avis.reponse}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Star className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p>Pas encore d'avis pour ce prestataire</p>
                </div>
              )}
            </div>

            {/* Location */}
            <div className="bg-white rounded-2xl p-6 shadow-card">
              <h2 className="font-display text-xl font-bold text-[#1a1a2e] mb-4">Localisation</h2>
              <p className="text-gray-600 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-500" />
                {prestataire.ville}
                {prestataire.zoneIntervention && ` — Zone d'intervention : ${prestataire.zoneIntervention}`}
              </p>
            </div>
          </div>

          {/* Right sidebar */}
          <div>
            <QuoteSidebar
              prestataire={{
                id: prestataire.id,
                nomEntreprise: prestataire.nomEntreprise,
                prixMin: prestataire.prixMin,
                prixMax: prestataire.prixMax,
                whatsapp: prestataire.whatsapp,
                disponible: prestataire.disponible,
                verifie: prestataire.verifie,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
