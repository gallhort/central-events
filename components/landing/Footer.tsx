import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#1a1a2e] text-white/70 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="font-display text-2xl font-bold text-white">Central</span>
              <span className="font-display text-2xl font-bold text-amber-400">Events</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              La marketplace qui connecte organisateurs d'événements et prestataires en France.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="#" className="hover:text-amber-400 transition-colors text-sm">
                Instagram
              </a>
              <a href="#" className="hover:text-amber-400 transition-colors text-sm">
                LinkedIn
              </a>
              <a href="#" className="hover:text-amber-400 transition-colors text-sm">
                Facebook
              </a>
            </div>
          </div>

          {/* Organisateurs */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Organisateurs
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/recherche" className="hover:text-amber-400 transition-colors">
                  Trouver un prestataire
                </Link>
              </li>
              <li>
                <Link href="/auth/inscription" className="hover:text-amber-400 transition-colors">
                  Créer un compte
                </Link>
              </li>
              <li>
                <Link href="/dashboard/organisateur" className="hover:text-amber-400 transition-colors">
                  Mon espace
                </Link>
              </li>
            </ul>
          </div>

          {/* Prestataires */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Prestataires
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/auth/inscription?role=prestataire"
                  className="hover:text-amber-400 transition-colors"
                >
                  Référencer mon entreprise
                </Link>
              </li>
              <li>
                <Link href="/dashboard/prestataire" className="hover:text-amber-400 transition-colors">
                  Mon espace prestataire
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p>© 2026 Central Events. Tous droits réservés.</p>
          <div className="flex gap-6">
            <Link href="/mentions-legales" className="hover:text-amber-400 transition-colors">
              Mentions légales
            </Link>
            <Link href="/confidentialite" className="hover:text-amber-400 transition-colors">
              Confidentialité
            </Link>
            <Link href="/cgu" className="hover:text-amber-400 transition-colors">
              CGU
            </Link>
            <Link href="/contact" className="hover:text-amber-400 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
