"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Coins, Loader2, Gift } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Prestataire {
  id: string;
  nomEntreprise: string;
  tokenBalance: number;
  user: { email: string };
}

interface AdminTokensClientProps {
  prestataires: Prestataire[];
}

export function AdminTokensClient({ prestataires: initialPrestataires }: AdminTokensClientProps) {
  const [prestataires, setPrestataires] = useState(initialPrestataires);
  const [selectedId, setSelectedId] = useState("");
  const [montant, setMontant] = useState("5");
  const [raison, setRaison] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGrant = async () => {
    if (!selectedId || !raison.trim() || parseInt(montant) < 1) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/tokens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prestataireId: selectedId,
          montant: parseInt(montant),
          raison: raison.trim(),
        }),
      });

      if (!res.ok) throw new Error("Erreur");

      const { newBalance } = await res.json();
      const target = prestataires.find((p) => p.id === selectedId);

      toast({
        title: "Jetons attribués",
        description: `${montant} jetons ajoutés à ${target?.nomEntreprise}. Nouveau solde : ${newBalance}`,
      });

      setPrestataires((prev) =>
        prev.map((p) => (p.id === selectedId ? { ...p, tokenBalance: newBalance } : p))
      );
      setSelectedId("");
      setMontant("5");
      setRaison("");
    } catch {
      toast({ title: "Erreur", description: "Attribution impossible", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-[#1a1a2e]">
          Administration — Jetons
        </h1>
        <p className="text-gray-500 mt-1">Attribuez des jetons aux prestataires</p>
      </div>

      {/* Grant form */}
      <div className="bg-white rounded-2xl shadow-card p-6 mb-8">
        <h2 className="font-display font-bold text-[#1a1a2e] mb-5 flex items-center gap-2">
          <Gift className="w-5 h-5 text-amber-500" />
          Attribuer des jetons
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div>
            <Label htmlFor="prestataire-select">Prestataire</Label>
            <select
              id="prestataire-select"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <option value="">Choisir...</option>
              {prestataires.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nomEntreprise} ({p.tokenBalance} jetons)
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="montant-input">Nombre de jetons</Label>
            <Input
              id="montant-input"
              type="number"
              min="1"
              max="100"
              value={montant}
              onChange={(e) => setMontant(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="raison-input">Raison</Label>
            <Input
              id="raison-input"
              type="text"
              placeholder="Ex: Compensation, bienvenue..."
              value={raison}
              onChange={(e) => setRaison(e.target.value)}
              className="mt-1"
            />
          </div>
          <Button
            onClick={handleGrant}
            disabled={!selectedId || !raison.trim() || loading}
            className="bg-amber-500 hover:bg-amber-600 text-white"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Coins className="w-4 h-4 mr-2" />
            )}
            Attribuer
          </Button>
        </div>
      </div>

      {/* Prestataires table */}
      <div className="bg-white rounded-2xl shadow-card p-6">
        <h2 className="font-display font-bold text-[#1a1a2e] mb-5">
          Soldes des prestataires
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-100">
                <th className="pb-3 font-medium">Entreprise</th>
                <th className="pb-3 font-medium">Email</th>
                <th className="pb-3 font-medium text-right">Solde</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {prestataires.map((p) => (
                <tr key={p.id}>
                  <td className="py-3 font-medium text-[#1a1a2e]">{p.nomEntreprise}</td>
                  <td className="py-3 text-gray-500">{p.user.email}</td>
                  <td className="py-3 text-right">
                    <span
                      className={`font-bold px-3 py-1 rounded-full text-sm ${
                        p.tokenBalance === 0
                          ? "bg-red-100 text-red-600"
                          : p.tokenBalance <= 2
                          ? "bg-amber-100 text-amber-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {p.tokenBalance} jeton{p.tokenBalance !== 1 ? "s" : ""}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
