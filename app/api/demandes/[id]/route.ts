import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";

const updateSchema = z.object({
  statut: z.enum(["EN_ATTENTE", "REPONDU", "ACCEPTE", "REFUSE", "ARCHIVE"]),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }

    // Verify the prestataire owns this demande
    const prestataire = await prisma.prestataire.findUnique({
      where: { userId: session.user.id },
    });

    if (!prestataire) {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 });
    }

    const demande = await prisma.demande.findUnique({
      where: { id: params.id },
    });

    if (!demande || demande.prestataireId !== prestataire.id) {
      return NextResponse.json({ error: "Demande introuvable" }, { status: 404 });
    }

    const updated = await prisma.demande.update({
      where: { id: params.id },
      data: { statut: parsed.data.statut },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[API] PATCH /api/demandes/[id]:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
