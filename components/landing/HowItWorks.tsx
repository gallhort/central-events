const STEPS = [
  {
    number: "01",
    title: "Recherchez",
    description:
      "Utilisez notre moteur de recherche pour trouver des prestataires par catégorie, ville et type d'événement. Comparez les profils, les avis et les tarifs.",
    color: "bg-amber-100",
    textColor: "text-amber-600",
  },
  {
    number: "02",
    title: "Comparez",
    description:
      "Consultez les fiches détaillées, les galeries photos et les avis vérifiés. Ajoutez vos favoris pour ne rien oublier.",
    color: "bg-blue-100",
    textColor: "text-blue-600",
  },
  {
    number: "03",
    title: "Contactez",
    description:
      "Envoyez une demande de devis directement depuis la plateforme. Échangez avec les prestataires et finalisez votre événement.",
    color: "bg-green-100",
    textColor: "text-green-600",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-[#f8f7f4]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[#1a1a2e] mb-4">
            Comment ça marche ?
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Trouvez et contactez votre prestataire idéal en 3 étapes simples
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line on desktop */}
          <div className="hidden md:block absolute top-16 left-1/3 right-1/3 h-0.5 bg-amber-200" />

          {STEPS.map((step, index) => (
            <div key={step.number} className="flex flex-col items-center text-center">
              <div
                className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center mb-6 relative z-10`}
              >
                <span className={`font-display text-2xl font-bold ${step.textColor}`}>
                  {step.number}
                </span>
              </div>
              <h3 className="font-display text-xl font-bold text-[#1a1a2e] mb-3">{step.title}</h3>
              <p className="text-gray-500 leading-relaxed text-sm max-w-xs">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
