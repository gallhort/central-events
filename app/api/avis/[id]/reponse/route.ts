import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";

const reponseSchema = z.object({
  reponse: z.string().min(1).max(1000),
});

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = reponseSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }

    const prestataire = await prisma.prestataire.findUnique({
      where: { userId: session.user.id },
    });

    if (!prestataire) {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 });
    }

    const avis = await prisma.avis.findUnique({ where: { id: params.id } });

    if (!avis || avis.prestataireId !== prestataire.id) {
      return NextResponse.json({ error: "Avis introuvable" }, { status: 404 });
    }

    const updated = await prisma.avis.update({
      where: { id: params.id },
      data: { reponse: parsed.data.reponse },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[API] POST /api/avis/[id]/reponse:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
