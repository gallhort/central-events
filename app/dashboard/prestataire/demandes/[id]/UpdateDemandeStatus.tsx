"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Archive, Loader2, Coins } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { InsufficientTokensModal } from "@/components/dashboard/InsufficientTokensModal";

interface UpdateDemandeStatusProps {
  demandeId: string;
  tokenBalance: number;
  alreadyUnlocked: boolean;
}

export function UpdateDemandeStatus({
  demandeId,
  tokenBalance,
  alreadyUnlocked,
}: UpdateDemandeStatusProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const updateStatus = async (statut: string) => {
    setLoading(statut);
    try {
      const res = await fetch(`/api/demandes/${demandeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statut }),
      });

      if (res.status === 402) {
        setShowTokenModal(true);
        return;
      }

      if (!res.ok) throw new Error("Erreur");

      toast({
        title: "Statut mis à jour",
        description: `La demande a été ${statut === "ACCEPTE" ? "acceptée" : statut === "REFUSE" ? "refusée" : "archivée"}`,
      });

      router.refresh();
    } catch {
      toast({ title: "Erreur", description: "Impossible de mettre à jour", variant: "destructive" });
    } finally {
      setLoading(null);
    }
  };

  const willDeductToken = !alreadyUnlocked && tokenBalance > 0;
  const isBlocked = !alreadyUnlocked && tokenBalance === 0;

  return (
    <>
      <div className="space-y-3 pt-2">
        {willDeductToken && (
          <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
            <Coins className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Accepter cette demande coûtera <strong>1 jeton</strong> (solde : {tokenBalance})</span>
          </div>
        )}

        {isBlocked && (
          <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
            <Coins className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Solde insuffisant. Rechargez vos jetons pour répondre.</span>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => updateStatus("ACCEPTE")}
            disabled={loading !== null || isBlocked}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            {loading === "ACCEPTE" ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <CheckCircle className="w-4 h-4 mr-2" />
            )}
            Accepter
          </Button>
          <Button
            onClick={() => updateStatus("REFUSE")}
            disabled={loading !== null}
            variant="outline"
            className="border-red-200 text-red-500 hover:bg-red-50"
          >
            {loading === "REFUSE" ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <XCircle className="w-4 h-4 mr-2" />
            )}
            Refuser
          </Button>
          <Button
            onClick={() => updateStatus("ARCHIVE")}
            disabled={loading !== null}
            variant="ghost"
            className="text-gray-400"
          >
            {loading === "ARCHIVE" ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Archive className="w-4 h-4 mr-2" />
            )}
            Archiver
          </Button>
        </div>
      </div>

      <InsufficientTokensModal
        open={showTokenModal}
        onClose={() => setShowTokenModal(false)}
      />
    </>
  );
}
