import type { Metadata } from "next";
import { Navbar } from "@/components/common/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { CategoriesGrid } from "@/components/landing/CategoriesGrid";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { StatsSection } from "@/components/landing/StatsSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Central Events — Trouvez les meilleurs prestataires événementiels en France",
  description:
    "Trouvez les prestataires parfaits pour votre événement : traiteurs, photographes, DJ, salles de réception, fleuristes. Gratuit pour commencer.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <CategoriesGrid />
        <HowItWorks />
        <StatsSection />
        <TestimonialsSection />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
