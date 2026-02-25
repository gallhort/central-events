"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, LogOut, LayoutDashboard, User } from "lucide-react";

export function Navbar() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const dashboardUrl =
    session?.user?.role === "PRESTATAIRE"
      ? "/dashboard/prestataire"
      : "/dashboard/organisateur";

  const initials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1">
          <span className="font-display text-xl font-bold text-[#1a1a2e]">Central</span>
          <span className="font-display text-xl font-bold text-amber-500">Events</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/recherche"
            className="text-sm font-medium text-gray-600 hover:text-[#1a1a2e] transition-colors"
          >
            Trouver un prestataire
          </Link>
          <Link
            href="/auth/inscription?role=prestataire"
            className="text-sm font-medium text-gray-600 hover:text-[#1a1a2e] transition-colors"
          >
            Je suis prestataire
          </Link>
        </div>

        {/* Auth */}
        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-gray-100 transition-colors">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session.user?.image ?? undefined} />
                    <AvatarFallback className="bg-[#1a1a2e] text-amber-400 text-xs font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-[#1a1a2e]">
                    {session.user?.name?.split(" ")[0] ?? "Mon compte"}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href={dashboardUrl} className="flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4" />
                    Tableau de bord
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`${dashboardUrl}/profil`} className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Mon profil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-red-500 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Se déconnecter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="font-medium">
                <Link href="/auth/connexion">Connexion</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg"
              >
                <Link href="/auth/inscription">Inscription</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
          <Link
            href="/recherche"
            className="block text-sm font-medium text-gray-700 py-2"
            onClick={() => setMobileOpen(false)}
          >
            Trouver un prestataire
          </Link>
          <Link
            href="/auth/inscription?role=prestataire"
            className="block text-sm font-medium text-gray-700 py-2"
            onClick={() => setMobileOpen(false)}
          >
            Je suis prestataire
          </Link>
          {session ? (
            <>
              <Link
                href={dashboardUrl}
                className="block text-sm font-medium text-gray-700 py-2"
                onClick={() => setMobileOpen(false)}
              >
                Tableau de bord
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="block text-sm font-medium text-red-500 py-2"
              >
                Se déconnecter
              </button>
            </>
          ) : (
            <div className="flex gap-3 pt-2">
              <Button asChild variant="outline" size="sm" className="flex-1">
                <Link href="/auth/connexion">Connexion</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white"
              >
                <Link href="/auth/inscription">Inscription</Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
