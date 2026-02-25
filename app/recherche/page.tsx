import type { Metadata } from "next";
import { Suspense } from "react";
import { Navbar } from "@/components/common/Navbar";
import { SearchClient } from "./SearchClient";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Rechercher des prestataires événementiels",
  description:
    "Trouvez et comparez les meilleurs prestataires pour votre événement : traiteurs, photographes, DJ, salles, fleuristes en France.",
};

export default function RecherchePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Suspense
        fallback={
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-card">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        }
      >
        <SearchClient />
      </Suspense>
    </div>
  );
}
