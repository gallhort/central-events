import Link from "next/link";

const CATEGORIES = [
  { slug: "traiteur", label: "Traiteur", emoji: "🍽️", desc: "Gastronomie & buffets" },
  { slug: "photographe", label: "Photographe", emoji: "📷", desc: "Capturer vos moments" },
  { slug: "dj", label: "DJ / Animation", emoji: "🎧", desc: "Musique & ambiance" },
  { slug: "salle", label: "Salle de réception", emoji: "🏛️", desc: "Lieux d'exception" },
  { slug: "fleuriste", label: "Fleuriste", emoji: "💐", desc: "Décoration florale" },
  { slug: "videaste", label: "Vidéaste", emoji: "🎬", desc: "Films & souvenirs" },
  { slug: "sono", label: "Sono / Lumière", emoji: "🔊", desc: "Scénographie sonore" },
  { slug: "autre", label: "Autre", emoji: "✨", desc: "Tous les prestataires" },
];

export function CategoriesGrid() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[#1a1a2e] mb-4">
            Tous les prestataires dont vous avez besoin
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Parcourez nos catégories et trouvez le prestataire idéal pour votre événement
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/recherche?categorie=${cat.slug}`}
              className="group relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-transparent bg-[#f8f7f4] hover:border-amber-400 hover:bg-amber-50 transition-all duration-300 hover:shadow-card text-center"
            >
              <span className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200">
                {cat.emoji}
              </span>
              <h3 className="font-semibold text-[#1a1a2e] text-sm md:text-base mb-1">
                {cat.label}
              </h3>
              <p className="text-gray-400 text-xs hidden md:block">{cat.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
