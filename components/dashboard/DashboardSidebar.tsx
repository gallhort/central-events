"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  MessageSquare,
  Heart,
  User,
  Building2,
  Star,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const organisateurNav = [
  { href: "/dashboard/organisateur", label: "Accueil", icon: LayoutDashboard },
  { href: "/dashboard/organisateur/demandes", label: "Mes demandes", icon: MessageSquare },
  { href: "/dashboard/organisateur/favoris", label: "Favoris", icon: Heart },
  { href: "/dashboard/organisateur/profil", label: "Mon profil", icon: User },
];

const prestataireNav = [
  { href: "/dashboard/prestataire", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/dashboard/prestataire/demandes", label: "Demandes reçues", icon: MessageSquare },
  { href: "/dashboard/prestataire/profil", label: "Mon profil public", icon: Building2 },
  { href: "/dashboard/prestataire/avis", label: "Avis", icon: Star },
  { href: "/dashboard/prestataire/parametres", label: "Paramètres", icon: Settings },
];

interface DashboardSidebarProps {
  role: string;
  userName: string;
}

export function DashboardSidebar({ role, userName }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navItems = role === "PRESTATAIRE" ? prestataireNav : organisateurNav;

  const NavContent = () => (
    <>
      {/* Logo */}
      <Link href="/" className="flex items-center gap-1 px-4 py-6 border-b border-white/10">
        <span className="font-display text-xl font-bold text-white">Central</span>
        <span className="font-display text-xl font-bold text-amber-400">Events</span>
      </Link>

      {/* User info */}
      <div className="px-4 py-4 border-b border-white/10">
        <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mb-2">
          <span className="text-amber-400 font-bold text-sm">
            {userName[0]?.toUpperCase() ?? "?"}
          </span>
        </div>
        <p className="text-white font-medium text-sm truncate">{userName || "Utilisateur"}</p>
        <p className="text-white/40 text-xs mt-0.5">
          {role === "PRESTATAIRE" ? "Prestataire" : "Organisateur"}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                active
                  ? "bg-amber-500 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom links */}
      <div className="px-3 py-4 border-t border-white/10 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/10 transition-all"
        >
          <Home className="w-4 h-4" />
          Retour au site
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-red-400/70 hover:text-red-400 hover:bg-red-400/10 transition-all w-full text-left"
        >
          <LogOut className="w-4 h-4" />
          Se déconnecter
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-[#1a1a2e] rounded-xl flex items-center justify-center shadow-lg"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Menu"
      >
        {mobileOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:sticky top-0 h-screen w-64 bg-[#1a1a2e] flex flex-col z-40 transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <NavContent />
      </aside>
    </>
  );
}
