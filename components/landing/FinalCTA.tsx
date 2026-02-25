import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function FinalCTA() {
  return (
    <section
      className="py-24 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)" }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #f59e0b, transparent)" }}
        />
      </div>

      <div className="relative container mx-auto px-4 text-center">
        <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
          Prêt à créer votre
          <span className="text-amber-400"> événement idéal ?</span>
        </h2>
        <p className="text-white/70 text-lg mb-10 max-w-2xl mx-auto">
          Rejoignez des centaines d'organisateurs et prestataires qui font confiance à Central Events.
          C'est gratuit pour commencer.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            size="lg"
            className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 text-base font-semibold rounded-xl"
          >
            <Link href="/auth/inscription">
              Rejoindre la plateforme
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 text-base font-semibold rounded-xl bg-transparent"
          >
            <Link href="/recherche">Parcourir les prestataires</Link>
          </Button>
        </div>

        <p className="text-white/40 text-sm mt-8">
          Aucune carte bancaire requise · 0% de commission sur vos premiers devis
        </p>
      </div>
    </section>
  );
}
