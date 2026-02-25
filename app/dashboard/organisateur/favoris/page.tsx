import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ProviderCard } from "@/components/common/ProviderCard";
import { Heart } from "lucide-react";

export default async function FavorisPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/connexion");

  const favoris = await prisma.favori.findMany({
    where: { userId: session.user.id },
    include: {
      user: false,
    },
    orderBy: { createdAt: "desc" },
  });

  const prestataireIds = favoris.map((f) => f.prestataireId);
  const prestataires = await prisma.prestataire.findMany({
    where: { id: { in: prestataireIds } },
    select: {
      id: true,
      slug: true,
      nomEntreprise: true,
      categorie: true,
      ville: true,
      photos: true,
      prixMin: true,
      prixMax: true,
      noteGlobale: true,
      nbAvis: true,
      verifie: true,
      disponible: true,
    },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-[#1a1a2e]">Mes favoris</h1>
        <p className="text-gray-500 mt-1">
          {prestataires.length} prestataire{prestataires.length !== 1 ? "s" : ""} sauvegardé
          {prestataires.length !== 1 ? "s" : ""}
        </p>
      </div>

      {prestataires.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {prestataires.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-card p-12 text-center">
          <Heart className="w-12 h-12 mx-auto mb-4 text-gray-200" />
          <h3 className="font-display text-lg font-bold text-[#1a1a2e] mb-2">
            Aucun favori encore
          </h3>
          <p className="text-gray-500 text-sm">
            Ajoutez des prestataires à vos favoris depuis les fiches prestataires
          </p>
          <Link
            href="/recherche"
            className="inline-block mt-4 bg-amber-500 hover:bg-amber-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors"
          >
            Parcourir les prestataires
          </Link>
        </div>
      )}
    </div>
  );
}
