import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";

const profilSchema = z.object({
  nomEntreprise: z.string().min(2).optional(),
  description: z.string().max(2000).optional(),
  categorie: z.string().optional(),
  ville: z.string().optional(),
  zoneIntervention: z.string().optional(),
  prixMin: z.coerce.number().min(0).optional().nullable(),
  prixMax: z.coerce.number().min(0).optional().nullable(),
  services: z.array(z.string()).optional(),
  photos: z.array(z.string()).optional(),
  siteWeb: z.string().optional().nullable(),
  instagram: z.string().optional().nullable(),
  whatsapp: z.string().optional().nullable(),
  disponible: z.boolean().optional(),
  notifNouvellesDemandes: z.boolean().optional(),
  notifNouveauxAvis: z.boolean().optional(),
});

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const prestataire = await prisma.prestataire.findUnique({
      where: { userId: session.user.id },
    });

    if (!prestataire) {
      return NextResponse.json({ error: "Profil introuvable" }, { status: 404 });
    }

    return NextResponse.json(prestataire);
  } catch (error) {
    console.error("[API] GET /api/prestataires/profil:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = profilSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const prestataire = await prisma.prestataire.findUnique({
      where: { userId: session.user.id },
    });

    if (!prestataire) {
      return NextResponse.json({ error: "Profil introuvable" }, { status: 404 });
    }

    const updated = await prisma.prestataire.update({
      where: { id: prestataire.id },
      data: parsed.data,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[API] PATCH /api/prestataires/profil:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
