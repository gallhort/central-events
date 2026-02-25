import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "next-auth/react";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600"],
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Central Events — Trouvez les meilleurs prestataires événementiels",
    template: "%s | Central Events",
  },
  description:
    "La marketplace qui connecte organisateurs d'événements et prestataires en France. Traiteurs, photographes, DJ, salles de réception et plus.",
  keywords: [
    "prestataires événementiels",
    "organisateur événement",
    "traiteur mariage",
    "photographe mariage",
    "DJ événement",
    "salle réception",
    "France",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Central Events",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${dmSans.variable} ${playfairDisplay.variable} font-sans antialiased bg-[#f8f7f4] text-[#1a1a2e]`}
      >
        <SessionProvider>
          {children}
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
