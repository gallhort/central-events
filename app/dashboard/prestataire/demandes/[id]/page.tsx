import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { MessageThread } from "@/components/dashboard/MessageThread";
import { UpdateDemandeStatus } from "./UpdateDemandeStatus";
import Link from "next/link";
import { ChevronLeft, Calendar, Users, Euro, Mail, Phone } from "lucide-react";

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

export default async function DemandeDetailPrestatairePage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/connexion");

  const prestataire = await prisma.prestataire.findUnique({
    where: { userId: session.user.id },
  });

  if (!prestataire) redirect("/dashboard/prestataire");

  const demande = await prisma.demande.findUnique({
    where: { id: params.id, prestataireId: prestataire.id },
    include: {
      organisateur: { select: { name: true, email: true } },
      messages: {
        include: { auteur: { select: { name: true, role: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!demande) notFound();

  return (
    <div>
      <Link
        href="/dashboard/prestataire/demandes"
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-amber-600 mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Retour aux demandes
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-card p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="font-display text-xl font-bold text-[#1a1a2e]">
                  {demande.organisateur.name ?? demande.nom}
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                  Reçue le{" "}
                  {new Date(demande.createdAt).toLocaleDateString("fr-FR", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <span
                className={`text-xs font-medium px-3 py-1.5 rounded-full ${
                  statutColors[demande.statut] ?? "bg-gray-100"
                }`}
              >
                {statutLabels[demande.statut] ?? demande.statut}
              </span>
            </div>

            <div className="bg-[#f8f7f4] rounded-xl p-4 text-sm text-gray-700 leading-relaxed mb-4">
              {demande.message}
            </div>

            {/* Action buttons */}
            {demande.statut === "EN_ATTENTE" && (
              <UpdateDemandeStatus demandeId={demande.id} />
            )}
          </div>

          {/* Message thread */}
          <MessageThread
            demandeId={demande.id}
            messages={demande.messages}
            currentUserId={session.user.id}
          />
        </div>

        {/* Sidebar details */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-card p-5">
            <h3 className="font-semibold text-[#1a1a2e] mb-4 text-sm">Informations</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-gray-400" />
                <a href={`mailto:${demande.email}`} className="text-amber-600 hover:underline">
                  {demande.email}
                </a>
              </div>
              {demande.telephone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <a href={`tel:${demande.telephone}`} className="text-amber-600 hover:underline">
                    {demande.telephone}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-400 font-medium">Type</span>
                <span className="text-[#1a1a2e]">{demande.typeEvenement}</span>
              </div>
              {demande.dateEvenement && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-[#1a1a2e]">
                    {new Date(demande.dateEvenement).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              )}
              {demande.nbPersonnes && (
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-[#1a1a2e]">{demande.nbPersonnes} personnes</span>
                </div>
              )}
              {(demande.budgetMin !== null || demande.budgetMax !== null) && (
                <div className="flex items-center gap-2 text-sm">
                  <Euro className="w-4 h-4 text-gray-400" />
                  <span className="text-[#1a1a2e]">
                    {demande.budgetMin}€ — {demande.budgetMax}€
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
