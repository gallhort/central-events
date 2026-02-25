import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Sophie Martin",
    role: "Organisatrice de mariage",
    avatar: "SM",
    rating: 5,
    text: "Grâce à Central Events, j'ai trouvé un photographe et un traiteur exceptionnels pour mon mariage en seulement 2 jours. Les profils détaillés et les avis m'ont vraiment aidée à faire le bon choix. Je recommande vivement !",
    city: "Paris",
  },
  {
    name: "Thomas Dubois",
    role: "Responsable événements, TechCorp",
    avatar: "TD",
    rating: 5,
    text: "Pour nos séminaires d'entreprise, Central Events est devenu un outil indispensable. Nous avons organisé 3 événements cette année grâce à la plateforme. Les prestataires sont sérieux et professionnels.",
    city: "Lyon",
  },
  {
    name: "Amina Benali",
    role: "Organisatrice de fêtes",
    avatar: "AB",
    rating: 5,
    text: "J'organisais l'anniversaire surprise de mes 30 ans et je ne savais pas par où commencer. Central Events m'a permis de tout coordonner : DJ, fleuriste et salle en une seule plateforme. Parfait !",
    city: "Marseille",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-[#f8f7f4]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[#1a1a2e] mb-4">
            Ils nous font confiance
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Des organisateurs satisfaits qui ont créé des événements mémorables
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((testimonial) => (
            <div
              key={testimonial.name}
              className="bg-white rounded-2xl p-6 shadow-card hover:shadow-hover transition-shadow duration-300"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-600 text-sm leading-relaxed mb-6 italic">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1a1a2e] flex items-center justify-center flex-shrink-0">
                  <span className="text-amber-400 text-sm font-bold">{testimonial.avatar}</span>
                </div>
                <div>
                  <p className="font-semibold text-[#1a1a2e] text-sm">{testimonial.name}</p>
                  <p className="text-gray-400 text-xs">
                    {testimonial.role} · {testimonial.city}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
