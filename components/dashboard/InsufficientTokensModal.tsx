"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Coins, Zap, Star, ArrowRight } from "lucide-react";

interface InsufficientTokensModalProps {
  open: boolean;
  onClose: () => void;
}

const packages = [
  { key: "starter", label: "Starter", tokens: 5, price: "9,99€", perToken: "1,99€/jeton" },
  {
    key: "popular",
    label: "Populaire",
    tokens: 15,
    price: "24,99€",
    perToken: "1,66€/jeton",
    highlight: true,
  },
  { key: "pro", label: "Pro", tokens: 30, price: "44,99€", perToken: "1,50€/jeton" },
];

export function InsufficientTokensModal({ open, onClose }: InsufficientTokensModalProps) {
  const router = useRouter();

  const handleBuy = () => {
    onClose();
    router.push("/dashboard/prestataire/tokens");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center mb-3">
            <Coins className="w-6 h-6 text-amber-600" />
          </div>
          <DialogTitle className="font-display text-xl text-[#1a1a2e]">
            Jetons insuffisants
          </DialogTitle>
          <DialogDescription className="text-gray-500 mt-1">
            Répondre à une demande coûte <strong>1 jeton</strong>. Vous avez épuisé votre
            solde. Rechargez pour continuer à engager les organisateurs.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Choisissez un pack
          </p>
          <div className="grid grid-cols-3 gap-3">
            {packages.map((pkg) => (
              <div
                key={pkg.key}
                className={`relative rounded-2xl p-4 text-center border-2 transition-all ${
                  pkg.highlight
                    ? "border-amber-400 bg-amber-50"
                    : "border-gray-100 bg-white"
                }`}
              >
                {pkg.highlight && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                    Populaire
                  </span>
                )}
                <div className="font-display font-bold text-2xl text-[#1a1a2e]">
                  {pkg.tokens}
                </div>
                <div className="text-xs text-gray-500 mb-2">jetons</div>
                <div className="font-bold text-amber-600">{pkg.price}</div>
                <div className="text-xs text-gray-400">{pkg.perToken}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Annuler
          </Button>
          <Button
            onClick={handleBuy}
            className="flex-1 bg-amber-500 hover:bg-amber-600 text-white"
          >
            <Coins className="w-4 h-4 mr-2" />
            Acheter des jetons
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
