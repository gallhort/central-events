import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Button } from "@/components/ui/button";
import { MessageSquare, Heart, Clock, Search, ArrowRight } from "lucide-react";

export default async function OrganisateurDashboard() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/connexion");

  const [demandesEnvoyees, reponses, favorisCount] = await Promise.all([
    prisma.demande.count({ where: { organisateurId: session.user.id } }),
    prisma.demande.count({
      where: { organisateurId: session.user.id, statut: { in: ["REPONDU", "ACCEPTE"] } },
    }),
    prisma.favori.count({ where: { userId: session.user.id } }),
  ]);

  const recentDemandes = await prisma.demande.findMany({
    where: { organisateurId: session.user.id },
    include: {
      prestataire: { select: { nomEntreprise: true, slug: true, categorie: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const statutColors: Record<string, string> = {
    EN_ATTENTE: "bg-amber-100 text-amber-700",
    REPONDU: "bg-blue-100 text-blue-700",
    ACCEPTE: "bg-green-100 text-green-700",
    REFUSE: "bg-red-100 text-red-500",
    ARCHIVE: "bg-gray-100 text-gray-500",
  };

  const statutLabels: Record<string, string> = {
    EN_ATTENTE: "En attente",
    REPONDU: "Répondu",
    ACCEPTE: "Accepté",
    REFUSE: "Refusé",
    ARCHIVE: "Archivé",
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-[#1a1a2e]">
          Bonjour, {session.user.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-gray-500 mt-1">Voici un résumé de votre activité</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatsCard
          title="Demandes envoyées"
          value={demandesEnvoyees}
          icon={MessageSquare}
          description="Demandes de devis au total"
        />
        <StatsCard
          title="Réponses reçues"
          value={reponses}
          icon={Clock}
          description="Prestataires ayant répondu"
        />
        <StatsCard
          title="Favoris"
          value={favorisCount}
          icon={Heart}
          description="Prestataires sauvegardés"
        />
      </div>

      {/* Quick search */}
      <div
        className="rounded-2xl p-6 mb-8 text-white"
        style={{ background: "linear-gradient(135deg, #1a1a2e, #16213e)" }}
      >
        <h2 className="font-display text-xl font-bold mb-2">Nouvelle recherche</h2>
        <p className="text-white/60 text-sm mb-4">
          Trouvez le prestataire idéal pour votre prochain événement
        </p>
        <Button asChild className="bg-amber-500 hover:bg-amber-600 text-white">
          <Link href="/recherche">
            <Search className="w-4 h-4 mr-2" />
            Rechercher un prestataire
          </Link>
        </Button>
      </div>

      {/* Recent requests */}
      <div className="bg-white rounded-2xl shadow-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-bold text-[#1a1a2e]">
            Demandes récentes
          </h2>
          <Link
            href="/dashboard/organisateur/demandes"
            className="text-sm text-amber-600 hover:text-amber-700 flex items-center gap-1"
          >
            Voir tout <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {recentDemandes.length > 0 ? (
          <div className="space-y-3">
            {recentDemandes.map((demande) => (
              <Link
                key={demande.id}
                href={`/dashboard/organisateur/demandes/${demande.id}`}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-[#f8f7f4] transition-colors group"
              >
                <div>
                  <p className="font-medium text-sm text-[#1a1a2e] group-hover:text-amber-600 transition-colors">
                    {demande.prestataire.nomEntreprise}
                  </p>
                  <p className="text-xs text-gray-400">
                    {demande.typeEvenement} ·{" "}
                    {new Date(demande.createdAt).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    statutColors[demande.statut] ?? "bg-gray-100 text-gray-600"
                  }`}
                >
                  {statutLabels[demande.statut] ?? demande.statut}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Aucune demande envoyée pour le moment</p>
            <Button asChild variant="outline" size="sm" className="mt-4">
              <Link href="/recherche">Trouver un prestataire</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
