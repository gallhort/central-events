import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ViewsChart } from "./ViewsChart";
import { Eye, MessageSquare, Star, TrendingUp, AlertCircle, ArrowRight, Coins } from "lucide-react";

export default async function PrestataireDashboard() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/connexion");

  const prestataire = await prisma.prestataire.findUnique({
    where: { userId: session.user.id },
    include: {
      demandes: {
        where: { statut: "EN_ATTENTE" },
        select: { id: true },
      },
    },
  });

  if (!prestataire) {
    redirect("/auth/inscription?role=prestataire");
  }

  const [totalDemandes, demandesRepondues, totalAvis] = await Promise.all([
    prisma.demande.count({ where: { prestataireId: prestataire.id } }),
    prisma.demande.count({
      where: { prestataireId: prestataire.id, statut: { in: ["REPONDU", "ACCEPTE"] } },
    }),
    prisma.avis.count({ where: { prestataireId: prestataire.id } }),
  ]);

  // 30-day view stats
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const viewStats = await prisma.vueStats.findMany({
    where: { prestataireId: prestataire.id, date: { gte: thirtyDaysAgo } },
    orderBy: { date: "asc" },
  });

  const tauxReponse =
    totalDemandes > 0 ? Math.round((demandesRepondues / totalDemandes) * 100) : 0;

  // Profile completeness check
  const missingFields = [];
  if (!prestataire.description) missingFields.push("description");
  if (prestataire.photos.length === 0) missingFields.push("photos");
  if (!prestataire.prixMin) missingFields.push("tarifs");
  if (prestataire.services.length === 0) missingFields.push("services");

  const recentDemandes = await prisma.demande.findMany({
    where: { prestataireId: prestataire.id },
    include: {
      organisateur: { select: { name: true, email: true } },
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

  const tokenBalance = prestataire.tokenBalance;
  const isLowBalance = tokenBalance > 0 && tokenBalance <= 2;
  const isEmptyBalance = tokenBalance === 0;

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-[#1a1a2e]">
          Tableau de bord
        </h1>
        <p className="text-gray-500 mt-1">{prestataire.nomEntreprise}</p>
      </div>

      {/* Token balance banner */}
      <div
        className={`flex items-center justify-between rounded-2xl p-4 mb-6 ${
          isEmptyBalance
            ? "bg-red-600"
            : isLowBalance
            ? "bg-amber-500"
            : "bg-[#1a1a2e]"
        }`}
      >
        <div className="flex items-center gap-3">
          <Coins className="w-6 h-6 text-amber-400 flex-shrink-0" />
          <div>
            <p className="font-display font-bold text-xl text-amber-400">
              {tokenBalance} jeton{tokenBalance !== 1 ? "s" : ""}
            </p>
            <p className="text-white/60 text-xs">
              {isEmptyBalance
                ? "Solde épuisé — rechargez pour répondre aux demandes"
                : isLowBalance
                ? "Solde faible — rechargez bientôt"
                : "1 jeton par nouvelle demande débloquée"}
            </p>
          </div>
        </div>
        <Link
          href="/dashboard/prestataire/tokens"
          className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap"
        >
          Recharger
        </Link>
      </div>

      {/* Profile incomplete warning */}
      {missingFields.length > 0 && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-amber-800 text-sm">Votre profil est incomplet</p>
            <p className="text-amber-600 text-xs mt-1">
              Ajoutez : {missingFields.join(", ")} pour attirer plus d&apos;organisateurs
            </p>
            <Link
              href="/dashboard/prestataire/profil"
              className="text-xs font-semibold text-amber-700 hover:text-amber-800 underline mt-2 inline-block"
            >
              Compléter mon profil →
            </Link>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard title="Vues (30j)" value={prestataire.vues} icon={Eye} />
        <StatsCard title="Demandes reçues" value={totalDemandes} icon={MessageSquare} />
        <StatsCard
          title="Taux de réponse"
          value={`${tauxReponse}%`}
          icon={TrendingUp}
          description={`${demandesRepondues}/${totalDemandes} répondues`}
        />
        <StatsCard
          title="Note moyenne"
          value={prestataire.noteGlobale !== null ? `${prestataire.noteGlobale.toFixed(1)}/5` : "—"}
          icon={Star}
          description={`${totalAvis} avis`}
        />
      </div>

      {/* Views chart */}
      {viewStats.length > 0 && (
        <div className="bg-white rounded-2xl shadow-card p-6 mb-6">
          <h2 className="font-display font-bold text-[#1a1a2e] mb-4">Vues sur 30 jours</h2>
          <ViewsChart data={viewStats.map((s) => ({ date: s.date.toISOString(), count: s.count }))} />
        </div>
      )}

      {/* Recent requests */}
      <div className="bg-white rounded-2xl shadow-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-bold text-[#1a1a2e]">Demandes récentes</h2>
          <Link
            href="/dashboard/prestataire/demandes"
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
                href={`/dashboard/prestataire/demandes/${demande.id}`}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-[#f8f7f4] transition-colors group"
              >
                <div>
                  <p className="font-medium text-sm text-[#1a1a2e] group-hover:text-amber-600 transition-colors">
                    {demande.organisateur.name ?? demande.email}
                  </p>
                  <p className="text-xs text-gray-400">
                    {demande.typeEvenement} ·{" "}
                    {new Date(demande.createdAt).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    statutColors[demande.statut] ?? "bg-gray-100"
                  }`}
                >
                  {statutLabels[demande.statut] ?? demande.statut}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 text-sm py-6">Aucune demande reçue</p>
        )}
      </div>
    </div>
  );
}
