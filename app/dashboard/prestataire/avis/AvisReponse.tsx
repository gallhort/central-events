"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function AvisReponse({ avisId }: { avisId: string }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const submit = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/avis/${avisId}/reponse`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reponse: text.trim() }),
      });
      if (!res.ok) throw new Error();
      toast({ title: "Réponse publiée" });
      router.refresh();
    } catch {
      toast({ title: "Erreur", description: "Impossible de publier", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-xs text-amber-600 hover:text-amber-700 font-medium transition-colors"
      >
        <MessageCircle className="w-3.5 h-3.5" />
        Répondre à cet avis
      </button>
    );
  }

  return (
    <div className="space-y-3">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Votre réponse..."
        rows={3}
      />
      <div className="flex gap-2">
        <Button
          onClick={submit}
          disabled={!text.trim() || loading}
          size="sm"
          className="bg-amber-500 hover:bg-amber-600 text-white"
        >
          {loading && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
          Publier
        </Button>
        <Button onClick={() => setOpen(false)} variant="ghost" size="sm">
          Annuler
        </Button>
      </div>
    </div>
  );
}
