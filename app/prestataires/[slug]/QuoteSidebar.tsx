"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QuoteModal } from "./QuoteModal";
import { MessageCircle, Phone, Clock, CheckCircle, XCircle, AlertCircle, Euro } from "lucide-react";

interface QuoteSidebarProps {
  prestataire: {
    id: string;
    nomEntreprise: string;
    prixMin: number | null;
    prixMax: number | null;
    whatsapp: string | null;
    disponible: boolean;
    verifie: boolean;
  };
}

export function QuoteSidebar({ prestataire }: QuoteSidebarProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const disponibiliteConfig = prestataire.disponible
    ? { label: "Disponible", icon: CheckCircle, color: "text-emerald-600 bg-emerald-50" }
    : { label: "Complet / Sous réserve", icon: AlertCircle, color: "text-orange-600 bg-orange-50" };

  const DispIcon = disponibiliteConfig.icon;

  return (
    <>
      <div className="bg-white rounded-2xl shadow-card p-6 sticky top-24">
        {/* Price */}
        {(prestataire.prixMin !== null || prestataire.prixMax !== null) && (
          <div className="mb-5">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
              Tarifs indicatifs
            </p>
            <div className="flex items-center gap-1">
              <Euro className="w-5 h-5 text-amber-500" />
              <span className="font-display text-2xl font-bold text-[#1a1a2e]">
                {prestataire.prixMin !== null && prestataire.prixMax !== null
                  ? `${prestataire.prixMin}€ — ${prestataire.prixMax}€`
                  : prestataire.prixMin !== null
                  ? `À partir de ${prestataire.prixMin}€`
                  : `Jusqu'à ${prestataire.prixMax}€`}
              </span>
            </div>
          </div>
        )}

        {/* Disponibilité */}
        <div
          className={`flex items-center gap-2 rounded-xl px-3 py-2.5 mb-5 text-sm font-medium ${disponibiliteConfig.color}`}
        >
          <DispIcon className="w-4 h-4" />
          {disponibiliteConfig.label}
        </div>

        {/* Temps de réponse */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Clock className="w-4 h-4 text-gray-400" />
          <span>Répond généralement sous 24h</span>
        </div>

        {/* CTA principal */}
        <Button
          onClick={() => setModalOpen(true)}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl mb-3"
          size="lg"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Envoyer une demande de devis
        </Button>

        {/* WhatsApp CTA */}
        {prestataire.whatsapp && (
          <a
            href={`https://wa.me/${prestataire.whatsapp.replace(/[^0-9]/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full border-2 border-gray-200 hover:border-green-400 hover:bg-green-50 text-gray-700 hover:text-green-700 font-semibold py-3 rounded-xl transition-all text-sm"
          >
            <Phone className="w-4 h-4" />
            Contacter via WhatsApp
          </a>
        )}

        {prestataire.verifie && (
          <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-emerald-600">
            <CheckCircle className="w-3.5 h-3.5" />
            Profil vérifié par Central Events
          </div>
        )}
      </div>

      <QuoteModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        prestataireId={prestataire.id}
        prestataireName={prestataire.nomEntreprise}
      />
    </>
  );
}
