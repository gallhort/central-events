"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Coins, Check, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Transaction {
  id: string;
  type: string;
  montant: number;
  soldeApres: number;
  description: string;
  createdAt: string;
}

interface TokenPurchaseClientProps {
  initialBalance: number;
  transactions: Transaction[];
}

const PACKAGES = [
  {
    key: "starter",
    label: "Starter",
    tokens: 5,
    price: "9,99€",
    priceRaw: 9.99,
    perToken: "1,99€/jeton",
    highlight: false,
    icon: "🌱",
  },
  {
    key: "popular",
    label: "Populaire",
    tokens: 15,
    price: "24,99€",
    priceRaw: 24.99,
    perToken: "1,66€/jeton",
    highlight: true,
    icon: "⭐",
  },
  {
    key: "pro",
    label: "Pro",
    tokens: 30,
    price: "44,99€",
    priceRaw: 44.99,
    perToken: "1,50€/jeton",
    highlight: false,
    icon: "🚀",
  },
] as const;

const txTypeLabel: Record<string, string> = {
  ACHAT: "Achat",
  DEPENSE: "Dépense",
  OFFERT: "Offert",
  REMBOURSE: "Remboursé",
};

const txTypeStyle: Record<string, string> = {
  ACHAT: "bg-green-100 text-green-700",
  DEPENSE: "bg-red-100 text-red-600",
  OFFERT: "bg-blue-100 text-blue-700",
  REMBOURSE: "bg-purple-100 text-purple-700",
};

export function TokenPurchaseClient({ initialBalance, transactions }: TokenPurchaseClientProps) {
  const [balance, setBalance] = useState(initialBalance);
  const [loading, setLoading] = useState<string | null>(null);
  const [txList, setTxList] = useState(transactions);
  const router = useRouter();
  const { toast } = useToast();

  const handleBuy = async (pkg: (typeof PACKAGES)[number]) => {
    setLoading(pkg.key);
    try {
      const res = await fetch("/api/tokens/acheter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ package: pkg.key }),
      });

      if (!res.ok) throw new Error("Erreur lors de l'achat");

      const { newBalance } = await res.json();
      setBalance(newBalance);

      toast({
        title: "Achat réussi !",
        description: `${pkg.tokens} jetons ajoutés — nouveau solde : ${newBalance} jetons`,
      });

      router.refresh();

      // Refresh transaction list
      const tokensRes = await fetch("/api/tokens");
      if (tokensRes.ok) {
        const data = await tokensRes.json();
        setBalance(data.balance);
        setTxList(data.transactions);
      }
    } catch {
      toast({ title: "Erreur", description: "Achat impossible", variant: "destructive" });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-[#1a1a2e]">Mes jetons</h1>
        <p className="text-gray-500 mt-1">
          Achetez des jetons pour répondre aux demandes des organisateurs
        </p>
      </div>

      {/* Current balance */}
      <div className="bg-[#1a1a2e] rounded-2xl p-6 mb-8 flex items-center justify-between">
        <div>
          <p className="text-white/60 text-sm mb-1">Solde actuel</p>
          <div className="flex items-center gap-3">
            <Coins className="w-8 h-8 text-amber-400" />
            <span className="font-display text-4xl font-bold text-amber-400">{balance}</span>
            <span className="text-white/60 text-lg">
              jeton{balance !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
        <div className="text-right text-white/40 text-sm">
          <p>1 jeton = 1 demande débloquée</p>
          <p className="mt-1">Chaque demande n&apos;est débitée qu&apos;une seule fois</p>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-8">
        <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
          <Coins className="w-4 h-4" />
          Comment fonctionnent les jetons ?
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-amber-700">
          <div className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-amber-200 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
            <p>Vous recevez une demande d&apos;un organisateur</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-amber-200 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
            <p>Dépensez 1 jeton pour lire les détails et répondre</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-amber-200 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
            <p>Communiquez librement sans frais supplémentaires</p>
          </div>
        </div>
      </div>

      {/* Packages */}
      <h2 className="font-display text-lg font-bold text-[#1a1a2e] mb-4">
        Choisissez un pack
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {PACKAGES.map((pkg) => (
          <div
            key={pkg.key}
            className={cn(
              "relative rounded-2xl p-6 border-2 flex flex-col items-center text-center transition-all",
              pkg.highlight
                ? "border-amber-400 shadow-lg bg-white"
                : "border-gray-100 bg-white hover:border-amber-200"
            )}
          >
            {pkg.highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                Populaire
              </span>
            )}
            <div className="text-3xl mb-3">{pkg.icon}</div>
            <h3 className="font-display font-bold text-lg text-[#1a1a2e] mb-1">{pkg.label}</h3>
            <div className="font-display text-4xl font-bold text-[#1a1a2e] my-2">
              {pkg.tokens}
              <span className="text-lg font-normal text-gray-400 ml-1">jetons</span>
            </div>
            <p className="text-2xl font-bold text-amber-500 mb-1">{pkg.price}</p>
            <p className="text-xs text-gray-400 mb-6">{pkg.perToken}</p>
            <Button
              onClick={() => handleBuy(pkg)}
              disabled={loading !== null}
              className={cn(
                "w-full",
                pkg.highlight
                  ? "bg-amber-500 hover:bg-amber-600 text-white"
                  : "bg-[#1a1a2e] hover:bg-[#16162a] text-white"
              )}
            >
              {loading === pkg.key ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Check className="w-4 h-4 mr-2" />
              )}
              Acheter
            </Button>
          </div>
        ))}
      </div>

      {/* Transaction history */}
      <div className="bg-white rounded-2xl shadow-card p-6">
        <h2 className="font-display text-lg font-bold text-[#1a1a2e] mb-4">
          Historique des transactions
        </h2>

        {txList.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-8">Aucune transaction</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-100">
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Description</th>
                  <th className="pb-3 font-medium text-center">Type</th>
                  <th className="pb-3 font-medium text-right">Jetons</th>
                  <th className="pb-3 font-medium text-right">Solde</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {txList.map((tx) => (
                  <tr key={tx.id} className="py-3">
                    <td className="py-3 text-gray-500 whitespace-nowrap">
                      {new Date(tx.createdAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3 text-[#1a1a2e]">{tx.description}</td>
                    <td className="py-3 text-center">
                      <span
                        className={cn(
                          "text-xs font-medium px-2 py-1 rounded-full",
                          txTypeStyle[tx.type] ?? "bg-gray-100 text-gray-500"
                        )}
                      >
                        {txTypeLabel[tx.type] ?? tx.type}
                      </span>
                    </td>
                    <td
                      className={cn(
                        "py-3 text-right font-semibold",
                        tx.montant > 0 ? "text-green-600" : "text-red-500"
                      )}
                    >
                      {tx.montant > 0 ? `+${tx.montant}` : tx.montant}
                    </td>
                    <td className="py-3 text-right text-gray-500">{tx.soldeApres}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
