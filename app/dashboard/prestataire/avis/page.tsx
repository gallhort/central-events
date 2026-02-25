import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { StarRating } from "@/components/common/StarRating";
import { AvisReponse } from "./AvisReponse";
import { Star } from "lucide-react";

export default async function AvisPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/connexion");

  const prestataire = await prisma.prestataire.findUnique({
    where: { userId: session.user.id },
    include: {
      avis: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!prestataire) redirect("/dashboard/prestataire");

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-[#1a1a2e]">Avis clients</h1>
        <p className="text-gray-500 mt-1">
          {prestataire.avis.length} avis ·{" "}
          {prestataire.noteGlobale !== null
            ? `Note moyenne : ${prestataire.noteGlobale.toFixed(1)}/5`
            : "Aucune note"}
        </p>
      </div>

      {prestataire.avis.length > 0 ? (
        <div className="space-y-4">
          {prestataire.avis.map((avis) => (
            <div key={avis.id} className="bg-white rounded-2xl shadow-card p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#1a1a2e] rounded-full flex items-center justify-center">
                    <span className="text-amber-400 font-bold text-sm">
                      {avis.auteurNom[0]?.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-[#1a1a2e] text-sm">{avis.auteurNom}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(avis.createdAt).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <StarRating rating={avis.note} size="sm" />
              </div>

              <p className="text-gray-700 text-sm leading-relaxed mb-4">{avis.commentaire}</p>

              {avis.reponse ? (
                <div className="bg-amber-50 rounded-xl p-4 border-l-4 border-amber-400">
                  <p className="text-xs font-semibold text-amber-600 mb-1">Votre réponse</p>
                  <p className="text-sm text-gray-700">{avis.reponse}</p>
                </div>
              ) : (
                <AvisReponse avisId={avis.id} />
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-card p-12 text-center">
          <Star className="w-12 h-12 mx-auto mb-4 text-gray-200" />
          <h3 className="font-display text-lg font-bold text-[#1a1a2e] mb-2">Aucun avis</h3>
          <p className="text-gray-500 text-sm">
            Les avis de vos clients apparaîtront ici
          </p>
        </div>
      )}
    </div>
  );
}
