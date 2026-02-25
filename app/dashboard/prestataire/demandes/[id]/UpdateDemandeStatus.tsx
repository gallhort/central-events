"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Archive, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UpdateDemandeStatusProps {
  demandeId: string;
}

export function UpdateDemandeStatus({ demandeId }: UpdateDemandeStatusProps) {
  const [loading, setLoading] = useState<string | null>(null);
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

  return (
    <div className="flex flex-wrap gap-3 pt-2">
      <Button
        onClick={() => updateStatus("ACCEPTE")}
        disabled={loading !== null}
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
  );
}
