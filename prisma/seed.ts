import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const connectionString = (process.env.DIRECT_URL || process.env.DATABASE_URL)!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding Central Events database...");

  // Clean existing data
  await prisma.tokenTransaction.deleteMany();
  await prisma.demandeToken.deleteMany();
  await prisma.message.deleteMany();
  await prisma.avis.deleteMany();
  await prisma.demande.deleteMany();
  await prisma.favori.deleteMany();
  await prisma.vueStats.deleteMany();
  await prisma.prestataire.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash("password123", 12);

  // ──────────────── ORGANISATEURS ────────────────
  const [orga1, orga2, orga3] = await Promise.all([
    prisma.user.create({
      data: {
        email: "sophie.martin@example.fr",
        name: "Sophie Martin",
        password: hashedPassword,
        role: "ORGANISATEUR",
      },
    }),
    prisma.user.create({
      data: {
        email: "thomas.dubois@techcorp.fr",
        name: "Thomas Dubois",
        password: hashedPassword,
        role: "ORGANISATEUR",
      },
    }),
    prisma.user.create({
      data: {
        email: "amina.benali@example.fr",
        name: "Amina Benali",
        password: hashedPassword,
        role: "ORGANISATEUR",
      },
    }),
  ]);

  // ──────────────── PRESTATAIRES ────────────────

  // --- TRAITEURS ---
  const traiteurParis = await prisma.user.create({
    data: {
      email: "contact@saveurs-seine.fr",
      name: "Saveurs de la Seine",
      password: hashedPassword,
      role: "PRESTATAIRE",
      prestataire: {
        create: {
          slug: "saveurs-de-la-seine",
          nomEntreprise: "Saveurs de la Seine",
          description:
            "Traiteur gastronomique parisien depuis 15 ans. Nous proposons une cuisine française raffinée, des buffets élaborés et des menus sur mesure pour tous vos événements : mariages, séminaires, soirées d'entreprise.\n\nNotre équipe de chefs passionnés travaille avec des produits locaux et de saison pour vous offrir une expérience culinaire inoubliable. Nous nous déplaçons dans toute l'Île-de-France.",
          categorie: "traiteur",
          ville: "Paris",
          zoneIntervention: "Île-de-France",
          prixMin: 45,
          prixMax: 120,
          services: [
            "Mariage",
            "Séminaire",
            "Soirée d'entreprise",
            "Cocktail",
            "Buffet",
            "Menu gastronomique",
            "Livraison",
          ],
          photos: [
            "https://images.unsplash.com/photo-1555244162-803834f70033?w=800",
            "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
            "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800",
          ],
          whatsapp: "+33612345678",
          disponible: true,
          verifie: true,
          vues: 247,
          noteGlobale: 4.8,
          nbAvis: 3,
        },
      },
    },
    include: { prestataire: true },
  });

  const traiteurLyon = await prisma.user.create({
    data: {
      email: "contact@gusto-lyon.fr",
      name: "Gusto Lyon",
      password: hashedPassword,
      role: "PRESTATAIRE",
      prestataire: {
        create: {
          slug: "gusto-lyon",
          nomEntreprise: "Gusto Lyon",
          description:
            "Chef traiteur lyonnais spécialisé dans la cuisine bouchon et la gastronomie régionale. Nous magnifions les produits de la région Auvergne-Rhône-Alpes pour des événements authentiques et savoureux.",
          categorie: "traiteur",
          ville: "Lyon",
          zoneIntervention: "Auvergne-Rhône-Alpes",
          prixMin: 35,
          prixMax: 90,
          services: ["Mariage", "Anniversaire", "Buffet bouchon", "Cuisine régionale", "Cocktail dînatoire"],
          photos: [
            "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
            "https://images.unsplash.com/photo-1547592180-85f173990554?w=800",
          ],
          whatsapp: "+33698765432",
          disponible: true,
          verifie: true,
          vues: 132,
          noteGlobale: 4.6,
          nbAvis: 2,
        },
      },
    },
    include: { prestataire: true },
  });

  const traiteurMarseille = await prisma.user.create({
    data: {
      email: "contact@soleil-traiteur.fr",
      name: "Soleil Traiteur",
      password: hashedPassword,
      role: "PRESTATAIRE",
      prestataire: {
        create: {
          slug: "soleil-traiteur-marseille",
          nomEntreprise: "Soleil Traiteur",
          description:
            "Traiteur méditerranéen à Marseille, spécialiste des saveurs du sud. Cuisines orientale, provençale et méditerranéenne pour des événements colorés et chaleureux.",
          categorie: "traiteur",
          ville: "Marseille",
          zoneIntervention: "PACA",
          prixMin: 30,
          prixMax: 80,
          services: ["Cuisine méditerranéenne", "Cuisine orientale", "Mariage", "Buffet", "Traiteur à domicile"],
          photos: [
            "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800",
          ],
          disponible: true,
          verifie: false,
          vues: 89,
          noteGlobale: 4.5,
          nbAvis: 2,
        },
      },
    },
    include: { prestataire: true },
  });

  // --- PHOTOGRAPHES ---
  const photoParis = await prisma.user.create({
    data: {
      email: "contact@lumiere-photographe.fr",
      name: "Lumière & Moments",
      password: hashedPassword,
      role: "PRESTATAIRE",
      prestataire: {
        create: {
          slug: "lumiere-et-moments",
          nomEntreprise: "Lumière & Moments",
          description:
            "Photographe de mariage et d'événements basée à Paris. Mon style : des photos authentiques, des instants volés, une lumière naturelle magnifiée. Chaque image raconte une histoire.",
          categorie: "photographe",
          ville: "Paris",
          zoneIntervention: "France entière",
          prixMin: 800,
          prixMax: 2500,
          services: ["Mariage", "Fiançailles", "Portrait", "Corporate", "Reportage événementiel"],
          photos: [
            "https://images.unsplash.com/photo-1520854221256-17d706bbd51a?w=800",
            "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800",
            "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800",
          ],
          siteWeb: "https://lumiere-moments.fr",
          instagram: "@lumieremoments",
          disponible: true,
          verifie: true,
          vues: 412,
          noteGlobale: 4.9,
          nbAvis: 3,
        },
      },
    },
    include: { prestataire: true },
  });

  const photoLyon = await prisma.user.create({
    data: {
      email: "contact@capturlyon.fr",
      name: "Captur Lyon",
      password: hashedPassword,
      role: "PRESTATAIRE",
      prestataire: {
        create: {
          slug: "captur-lyon",
          nomEntreprise: "Captur Lyon",
          description:
            "Photographe spécialisé événementiel et corporate à Lyon. Réactivité, qualité et livrables rapides pour vos événements professionnels et vos célébrations.",
          categorie: "photographe",
          ville: "Lyon",
          zoneIntervention: "Rhône-Alpes",
          prixMin: 600,
          prixMax: 1800,
          services: ["Corporate", "Mariage", "Soirée", "Produit", "Portrait professionnel"],
          photos: [
            "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800",
          ],
          disponible: true,
          verifie: false,
          vues: 178,
          noteGlobale: 4.4,
          nbAvis: 2,
        },
      },
    },
    include: { prestataire: true },
  });

  const photoMarseille = await prisma.user.create({
    data: {
      email: "contact@marseille-photo.fr",
      name: "Azur Photo Studio",
      password: hashedPassword,
      role: "PRESTATAIRE",
      prestataire: {
        create: {
          slug: "azur-photo-studio",
          nomEntreprise: "Azur Photo Studio",
          description:
            "Studio photo à Marseille spécialisé dans les mariages et les événements en plein air. Le soleil de la Méditerranée comme toile de fond.",
          categorie: "photographe",
          ville: "Marseille",
          zoneIntervention: "PACA, Corse",
          prixMin: 700,
          prixMax: 2000,
          services: ["Mariage", "Séance engagement", "Reportage", "Portrait"],
          photos: [
            "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
          ],
          disponible: true,
          verifie: false,
          vues: 95,
          noteGlobale: 4.3,
          nbAvis: 1,
        },
      },
    },
    include: { prestataire: true },
  });

  // --- DJs ---
  const djParis = await prisma.user.create({
    data: {
      email: "contact@dj-pulse.fr",
      name: "DJ Pulse Events",
      password: hashedPassword,
      role: "PRESTATAIRE",
      prestataire: {
        create: {
          slug: "dj-pulse-events",
          nomEntreprise: "DJ Pulse Events",
          description:
            "DJ professionnel basé à Paris avec plus de 10 ans d'expérience. Spécialisé mariages, soirées d'entreprise et anniversaires. Sonorisation complète fournie, setup professionnel garanti.",
          categorie: "dj",
          ville: "Paris",
          zoneIntervention: "Île-de-France, France",
          prixMin: 500,
          prixMax: 1500,
          services: ["Mariage", "Anniversaire", "Soirée d'entreprise", "Sonorisation", "Éclairage"],
          photos: [
            "https://images.unsplash.com/photo-1574169208507-84376144848b?w=800",
            "https://images.unsplash.com/photo-1493676304819-0d7a8d026dcf?w=800",
          ],
          whatsapp: "+33677889900",
          disponible: true,
          verifie: true,
          vues: 298,
          noteGlobale: 4.7,
          nbAvis: 2,
        },
      },
    },
    include: { prestataire: true },
  });

  const djLyon = await prisma.user.create({
    data: {
      email: "contact@dj-groove-lyon.fr",
      name: "Groove Factory Lyon",
      password: hashedPassword,
      role: "PRESTATAIRE",
      prestataire: {
        create: {
          slug: "groove-factory-lyon",
          nomEntreprise: "Groove Factory Lyon",
          description:
            "Collectif de DJs lyonnais pour tous vos événements. House, électro, RnB, pop — nous adaptons le son à votre public.",
          categorie: "dj",
          ville: "Lyon",
          zoneIntervention: "Rhône-Alpes",
          prixMin: 400,
          prixMax: 1200,
          services: ["Mariage", "Soirée d'entreprise", "Festival", "Club"],
          photos: [
            "https://images.unsplash.com/photo-1571266028187-a9893dc49ead?w=800",
          ],
          disponible: true,
          verifie: false,
          vues: 167,
          noteGlobale: 4.5,
          nbAvis: 1,
        },
      },
    },
    include: { prestataire: true },
  });

  // --- SALLES ---
  const salleParis = await prisma.user.create({
    data: {
      email: "contact@chateaudefetes.fr",
      name: "Château de Fêtes Paris",
      password: hashedPassword,
      role: "PRESTATAIRE",
      prestataire: {
        create: {
          slug: "chateau-de-fetes-paris",
          nomEntreprise: "Château de Fêtes Paris",
          description:
            "Salle de réception haut de gamme dans le 16ème arrondissement de Paris. Capacité 50 à 300 personnes. Terrasse privée, cuisine équipée, parking. Location à la journée ou à la soirée.",
          categorie: "salle",
          ville: "Paris",
          zoneIntervention: "Paris & petite couronne",
          prixMin: 1500,
          prixMax: 8000,
          services: ["Mariage", "Séminaire", "Cocktail", "Gala", "Terrasse", "Parking", "Cuisine équipée"],
          photos: [
            "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800",
            "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800",
          ],
          disponible: true,
          verifie: true,
          vues: 521,
          noteGlobale: 4.6,
          nbAvis: 2,
        },
      },
    },
    include: { prestataire: true },
  });

  const salleMarseille = await prisma.user.create({
    data: {
      email: "contact@villa-mediterranee.fr",
      name: "Villa Méditerranée",
      password: hashedPassword,
      role: "PRESTATAIRE",
      prestataire: {
        create: {
          slug: "villa-mediterranee-marseille",
          nomEntreprise: "Villa Méditerranée",
          description:
            "Villa avec vue sur mer à Marseille pour vos événements exceptionnels. Capacité 80 à 200 personnes. Piscine, jardins, terrasses. Location journée complète.",
          categorie: "salle",
          ville: "Marseille",
          zoneIntervention: "Marseille, Bouches-du-Rhône",
          prixMin: 2000,
          prixMax: 10000,
          services: ["Mariage", "Vue mer", "Piscine", "Jardin", "Terrasse"],
          photos: [
            "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800",
          ],
          disponible: true,
          verifie: false,
          vues: 203,
          noteGlobale: 4.7,
          nbAvis: 1,
        },
      },
    },
    include: { prestataire: true },
  });

  // --- FLEURISTES ---
  const fleuristeParis = await prisma.user.create({
    data: {
      email: "contact@atelier-floral.fr",
      name: "Atelier Floral Paris",
      password: hashedPassword,
      role: "PRESTATAIRE",
      prestataire: {
        create: {
          slug: "atelier-floral-paris",
          nomEntreprise: "Atelier Floral Paris",
          description:
            "Fleuriste événementiel parisien spécialisé dans les mariages et soirées de prestige. Bouquets, centres de table, arches florales, décoration complète. Fleurs fraîches et séchées.",
          categorie: "fleuriste",
          ville: "Paris",
          zoneIntervention: "Île-de-France",
          prixMin: 300,
          prixMax: 3000,
          services: ["Bouquet mariée", "Centre de table", "Arche florale", "Boutonnière", "Décoration"],
          photos: [
            "https://images.unsplash.com/photo-1487530811015-780780f3e89b?w=800",
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
          ],
          instagram: "@atelierfloral_paris",
          disponible: true,
          verifie: true,
          vues: 334,
          noteGlobale: 4.9,
          nbAvis: 2,
        },
      },
    },
    include: { prestataire: true },
  });

  const fleuristeLyon = await prisma.user.create({
    data: {
      email: "contact@fleurs-deco-lyon.fr",
      name: "Fleurs & Déco Lyon",
      password: hashedPassword,
      role: "PRESTATAIRE",
      prestataire: {
        create: {
          slug: "fleurs-deco-lyon",
          nomEntreprise: "Fleurs & Déco Lyon",
          description:
            "Fleuriste créatif à Lyon proposant des compositions originales et colorées pour tous vos événements. Mariage champêtre, industriel ou classique — nous nous adaptons à votre thème.",
          categorie: "fleuriste",
          ville: "Lyon",
          zoneIntervention: "Rhône-Alpes",
          prixMin: 200,
          prixMax: 2000,
          services: ["Mariage", "Anniversaire", "Séminaire", "Fleurs séchées", "Livraison"],
          photos: [
            "https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=800",
          ],
          disponible: true,
          verifie: false,
          vues: 145,
          noteGlobale: 4.4,
          nbAvis: 1,
        },
      },
    },
    include: { prestataire: true },
  });

  // ──────────────── AVIS ────────────────

  // Helper function
  const avis = async (prestataireId: string, items: Array<{ nom: string; email: string; note: number; commentaire: string }>) => {
    await prisma.avis.createMany({
      data: items.map(({ nom, email, note, commentaire }) => ({ auteurNom: nom, auteurEmail: email, note, commentaire, prestataireId, verifie: true })),
    });
  };

  await avis(traiteurParis.prestataire!.id, [
    { nom: "Julie Mercier", email: "julie.m@example.fr", note: 5, commentaire: "Un traiteur d'exception ! Le cocktail de notre mariage a épaté tous nos invités. Présentation sublime, goût parfait, service irréprochable. Nous recommandons sans réserve !" },
    { nom: "Antoine Leblanc", email: "a.leblanc@corp.fr", note: 5, commentaire: "Saveurs de la Seine a organisé notre séminaire d'entreprise de 80 personnes. Buffet varié, frais et délicieux. L'équipe a été très professionnelle du début à la fin." },
    { nom: "Marie-Claire Dupont", email: "mc.dupont@example.fr", note: 4, commentaire: "Très bon rapport qualité/prix pour un repas de fête de famille. Quelques ajustements sur les quantités mais globalement excellent." },
  ]);

  await avis(traiteurLyon.prestataire!.id, [
    { nom: "Pierre Fontaine", email: "p.fontaine@example.fr", note: 5, commentaire: "Cuisine bouchon authentique et savoureuse pour notre mariage. Gusto Lyon a sublimé les produits locaux. Nos invités ont adoré !" },
    { nom: "Cécile Bernard", email: "cecile.b@example.fr", note: 4, commentaire: "Bon traiteur pour notre séminaire. Cuisine régionale intéressante, légèrement long au service mais qualité au rendez-vous." },
  ]);

  await avis(traiteurMarseille.prestataire!.id, [
    { nom: "Rachida Hamid", email: "r.hamid@example.fr", note: 5, commentaire: "Cuisine méditerranéenne merveilleuse pour notre mariage en bord de mer. Les mezzés étaient délicieux, le couscous royal un régal !" },
    { nom: "Franck Moretti", email: "f.moretti@example.fr", note: 4, commentaire: "Très bon traiteur provençal. Fraîcheur des produits et saveurs authentiques. Je recommande pour un événement avec ambiance sud." },
  ]);

  await avis(photoParis.prestataire!.id, [
    { nom: "Camille et Hugo Renaud", email: "c.renaud@example.fr", note: 5, commentaire: "Nous sommes sans mots. Les photos de notre mariage sont tout simplement magiques. Chaque moment capturé avec une sensibilité rare. Merci du fond du cœur !" },
    { nom: "Isabelle Lemaire", email: "i.lemaire@societe.fr", note: 5, commentaire: "Photos corporate d'une qualité professionnelle remarquable. Rapide, discrète et très efficace pendant notre séminaire. Les photos ont illustré tous nos supports de communication." },
    { nom: "Paul-Henri Durand", email: "ph.durand@example.fr", note: 5, commentaire: "Séance d'engagement en plein Paris absolument magnifique. Un vrai talent pour mettre les gens à l'aise et sublimer les instants naturels." },
  ]);

  await avis(photoLyon.prestataire!.id, [
    { nom: "Virginie et Sébastien Koch", email: "v.koch@example.fr", note: 4, commentaire: "Très bon photographe de mariage. Style moderne, bons instants volés. Livraison rapide. Quelques photos en légère surexposition mais ensemble très satisfaisant." },
    { nom: "David Chatelain", email: "d.chatelain@startupxyz.fr", note: 5, commentaire: "Photos corporates d'excellente qualité pour notre équipe. Efficace et professionnel, je recommande pour tous vos besoins business." },
  ]);

  await avis(photoMarseille.prestataire!.id, [
    { nom: "Nadia et Karim Bettache", email: "nk.bettache@example.fr", note: 4, commentaire: "Belles photos avec un cadre magnifique grâce à la lumière marseillaise. Studio bien équipé." },
  ]);

  await avis(djParis.prestataire!.id, [
    { nom: "Estelle et Maxime Gauthier", email: "e.gauthier@example.fr", note: 5, commentaire: "DJ exceptionnel pour notre mariage ! Parfaite lecture de la salle, mix impeccable. La piste de danse n'a jamais été vide de 22h à 4h du matin !" },
    { nom: "RH Consulting", email: "rh@consulting-paris.fr", note: 5, commentaire: "Animation parfaite pour notre soirée d'entreprise de 150 personnes. Professionnel, ponctuel, excellent matériel. À recommander absolument." },
  ]);

  await avis(djLyon.prestataire!.id, [
    { nom: "Théo Marchand", email: "t.marchand@example.fr", note: 4, commentaire: "Super DJ pour mon anniversaire ! Bonne ambiance, musique au top. Matériel correct mais un peu moins impressionnant que prévu." },
  ]);

  await avis(salleParis.prestataire!.id, [
    { nom: "Agence EventPlus", email: "contact@eventplus.fr", note: 5, commentaire: "Salle magnifique pour notre gala annuel. Emplacement idéal, prestations au top, équipe très disponible. La terrasse est un plus indéniable." },
    { nom: "Aline et Bastien Martin", email: "ab.martin@example.fr", note: 4, commentaire: "Très belle salle pour notre mariage, prestations de qualité. Parking pratique. Quelques petits détails à parfaire mais globalement excellent." },
  ]);

  await avis(salleMarseille.prestataire!.id, [
    { nom: "Inès et Marc Toussaint", email: "i.toussaint@example.fr", note: 5, commentaire: "Villa de rêve pour notre mariage ! Vue imprenable sur la mer, piscine splendide, jardins parfaits pour les photos. Un cadre exceptionnel !" },
  ]);

  await avis(fleuristeParis.prestataire!.id, [
    { nom: "Laura et Gabriel Perrin", email: "l.perrin@example.fr", note: 5, commentaire: "L'Atelier Floral a transformé notre salle de mariage en un jardin enchanté. Bouquet de mariée sublime, centres de table époustouflants. Un travail artistique d'une rare qualité." },
    { nom: "Hôtel Lumière Paris", email: "events@hotel-lumiere.fr", note: 5, commentaire: "Nous faisons régulièrement appel à eux pour nos événements hôteliers. Toujours ponctuel, créatif et à l'écoute. Partenaire de confiance." },
  ]);

  await avis(fleuristeLyon.prestataire!.id, [
    { nom: "Sandra et Romain Petit", email: "sr.petit@example.fr", note: 4, commentaire: "Jolies créations florales pour notre mariage champêtre. Fleurs fraîches et originales. Bon respect du brief et du budget." },
  ]);

  // ──────────────── DEMANDES ────────────────

  const demande1 = await prisma.demande.create({
    data: {
      organisateurId: orga1.id,
      prestataireId: traiteurParis.prestataire!.id,
      nom: orga1.name!,
      email: orga1.email,
      typeEvenement: "Mariage",
      dateEvenement: new Date("2026-06-15"),
      nbPersonnes: 120,
      budgetMin: 4000,
      budgetMax: 8000,
      message:
        "Bonjour, nous organisons notre mariage le 15 juin 2026 pour environ 120 personnes. Nous cherchons un traiteur gastronomique pour le cocktail et le dîner. Menu 4 plats + fromages + dessert. Disposez-vous de références pour des mariages de cette taille ?",
      statut: "REPONDU",
    },
  });

  // Add response message
  await prisma.message.create({
    data: {
      demandeId: demande1.id,
      auteurId: traiteurParis.id,
      contenu:
        "Bonjour Sophie, merci pour votre demande ! Nous serions ravis de prendre en charge votre mariage. Oui, nous avons organisé de nombreux mariages de 80 à 300 personnes. Je vous propose de vous envoyer notre plaquette et quelques menus exemples. Quand seriez-vous disponible pour une rencontre ?",
    },
  });

  const demande2 = await prisma.demande.create({
    data: {
      organisateurId: orga2.id,
      prestataireId: djParis.prestataire!.id,
      nom: orga2.name!,
      email: orga2.email,
      typeEvenement: "Soirée d'entreprise",
      dateEvenement: new Date("2026-03-20"),
      nbPersonnes: 200,
      budgetMin: 800,
      budgetMax: 1500,
      message:
        "Notre entreprise organise sa soirée annuelle le 20 mars 2026 pour 200 collaborateurs. Nous avons besoin d'un DJ pour animer la soirée de 20h à minuit. Salle fournie avec système sono. Répertoire souhaité : variété française, années 80-90 et dancefloor actuel.",
      statut: "ACCEPTE",
    },
  });

  await prisma.message.create({
    data: {
      demandeId: demande2.id,
      auteurId: djParis.id,
      contenu: "Bonjour Thomas, c'est exactement le type d'événement que j'adore animer ! 200 personnes, c'est parfait. Je peux adapter mon set à 100% à votre demande. Voici mon planning : 20h-21h30 ambiance dinner (variété, jazz), 21h30-minuit dancefloor (80-90 + hits actuels). Tarif pour 4h : 1200€ TTC tout compris. Pouvez-vous me confirmer les dimensions de la salle et si elle dispose d'un pupitre DJ ?",
    },
  });

  await prisma.message.create({
    data: {
      demandeId: demande2.id,
      auteurId: orga2.id,
      contenu:
        "Bonjour, votre programme correspond parfaitement à nos attentes ! La salle fait 300m², avec scène et pupitre DJ. Nous confirmons votre prestation. Pouvez-vous nous envoyer un contrat ?",
    },
  });

  const demande3 = await prisma.demande.create({
    data: {
      organisateurId: orga3.id,
      prestataireId: fleuristeParis.prestataire!.id,
      nom: orga3.name!,
      email: orga3.email,
      typeEvenement: "Anniversaire",
      dateEvenement: new Date("2026-04-05"),
      nbPersonnes: 50,
      budgetMin: 500,
      budgetMax: 1000,
      message:
        "Bonjour ! J'organise mon anniversaire surprise le 5 avril pour 50 personnes dans un appartement haussmannien. Thème : bohème-champêtre. J'ai besoin d'une décoration florale pour l'entrée, le salon et la table. Budget total 800€. Est-ce possible ?",
      statut: "EN_ATTENTE",
    },
  });

  const demande4 = await prisma.demande.create({
    data: {
      organisateurId: orga1.id,
      prestataireId: photoParis.prestataire!.id,
      nom: orga1.name!,
      email: orga1.email,
      typeEvenement: "Mariage",
      dateEvenement: new Date("2026-06-15"),
      nbPersonnes: 120,
      budgetMin: 1500,
      budgetMax: 2500,
      message:
        "Bonjour, suite à la découverte de votre travail sur Instagram, nous aimerions vous confier la photographie de notre mariage le 15 juin 2026. Cérémonie civile + religieuse + réception. Environ 10h de couverture. Votre style correspond exactement à ce que nous recherchons.",
      statut: "EN_ATTENTE",
    },
  });

  // ──────────────── TOKEN TRANSACTIONS ────────────────

  const allPrestataires = [
    traiteurParis, traiteurLyon, traiteurMarseille,
    photoParis, photoLyon, photoMarseille,
    djParis, djLyon,
    salleParis, salleMarseille,
    fleuristeParis, fleuristeLyon,
  ];

  // Welcome transactions for all prestataires (5 free tokens each — matches schema default)
  await Promise.all(
    allPrestataires.map((p) =>
      prisma.tokenTransaction.create({
        data: {
          prestataireId: p.prestataire!.id,
          type: "OFFERT",
          montant: 5,
          soldeApres: 5,
          description: "Jetons de bienvenue",
        },
      })
    )
  );

  // demande1 was responded to (traiteurParis sent a message) — create DemandeToken + DEPENSE
  await prisma.demandeToken.create({
    data: {
      prestataireId: traiteurParis.prestataire!.id,
      demandeId: demande1.id,
    },
  });
  await prisma.tokenTransaction.create({
    data: {
      prestataireId: traiteurParis.prestataire!.id,
      type: "DEPENSE",
      montant: -1,
      soldeApres: 4,
      description: `Réponse à la demande #${demande1.id.slice(-8)}`,
      demandeId: demande1.id,
    },
  });
  // Update traiteurParis balance to 4 (spent 1)
  await prisma.prestataire.update({
    where: { id: traiteurParis.prestataire!.id },
    data: { tokenBalance: 4 },
  });

  // demande2 was accepted (djParis) — create DemandeToken + DEPENSE
  await prisma.demandeToken.create({
    data: {
      prestataireId: djParis.prestataire!.id,
      demandeId: demande2.id,
    },
  });
  await prisma.tokenTransaction.create({
    data: {
      prestataireId: djParis.prestataire!.id,
      type: "DEPENSE",
      montant: -1,
      soldeApres: 4,
      description: `Réponse à la demande #${demande2.id.slice(-8)}`,
      demandeId: demande2.id,
    },
  });
  // Update djParis balance to 4
  await prisma.prestataire.update({
    where: { id: djParis.prestataire!.id },
    data: { tokenBalance: 4 },
  });

  console.log("✅ Seed completed successfully!");
  console.log("📧 Test accounts:");
  console.log("   Organisateur: sophie.martin@example.fr / password123");
  console.log("   Prestataire:  contact@saveurs-seine.fr / password123");
  console.log("   Prestataire:  contact@lumiere-photographe.fr / password123");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
