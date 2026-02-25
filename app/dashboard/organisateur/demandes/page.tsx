import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, ArrowRight } from "lucide-react";

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

export default async function DemandesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/connexion");

  const demandes = await prisma.demande.findMany({
    where: { organisateurId: session.user.id },
    include: {
      prestataire: { select: { nomEntreprise: true, slug: true, categorie: true } },
      messages: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-[#1a1a2e]">Mes demandes de devis</h1>
        <p className="text-gray-500 mt-1">{demandes.length} demande{demandes.length !== 1 ? "s" : ""} au total</p>
      </div>

      {demandes.length > 0 ? (
        <div className="space-y-3">
          {demandes.map((demande) => (
            <Link
              key={demande.id}
              href={`/dashboard/organisateur/demandes/${demande.id}`}
              className="block bg-white rounded-2xl shadow-card p-5 hover:shadow-hover transition-all group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-[#1a1a2e] group-hover:text-amber-600 transition-colors">
                      {demande.prestataire.nomEntreprise}
                    </h3>
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        statutColors[demande.statut] ?? "bg-gray-100"
                      }`}
                    >
                      {statutLabels[demande.statut] ?? demande.statut}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {demande.typeEvenement}
                    {demande.dateEvenement && (
                      <> · {new Date(demande.dateEvenement).toLocaleDateString("fr-FR")}</>
                    )}
                    {demande.nbPersonnes && <> · {demande.nbPersonnes} personnes</>}
                  </p>
                  <p className="text-xs text-gray-400 mt-2 line-clamp-1">{demande.message}</p>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className="text-xs text-gray-400">
                    {new Date(demande.createdAt).toLocaleDateString("fr-FR")}
                  </span>
                  {demande.messages.length > 0 && (
                    <span className="flex items-center gap-1 text-xs text-blue-600">
                      <MessageSquare className="w-3 h-3" />
                      {demande.messages.length} message{demande.messages.length !== 1 ? "s" : ""}
                    </span>
                  )}
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-amber-500 transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-card p-12 text-center">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-200" />
          <h3 className="font-display text-lg font-bold text-[#1a1a2e] mb-2">
            Aucune demande envoyée
          </h3>
          <p className="text-gray-500 text-sm">
            Trouvez un prestataire et envoyez votre première demande de devis
          </p>
          <Link
            href="/recherche"
            className="inline-block mt-4 bg-amber-500 hover:bg-amber-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors"
          >
            Trouver un prestataire
          </Link>
        </div>
      )}
    </div>
  );
}
