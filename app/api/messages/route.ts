import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";

const messageSchema = z.object({
  demandeId: z.string().min(1),
  contenu: z.string().min(1).max(2000),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = messageSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }

    const { demandeId, contenu } = parsed.data;

    // Verify user is part of this demande
    const demande = await prisma.demande.findUnique({ where: { id: demandeId } });
    if (!demande) {
      return NextResponse.json({ error: "Demande introuvable" }, { status: 404 });
    }

    const prestataire = await prisma.prestataire.findUnique({
      where: { userId: session.user.id },
    });

    const isOrganisateur = demande.organisateurId === session.user.id;
    const isPrestataire = prestataire?.id === demande.prestataireId;

    if (!isOrganisateur && !isPrestataire) {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 });
    }

    const message = await prisma.message.create({
      data: {
        demandeId,
        auteurId: session.user.id,
        contenu,
      },
      include: {
        auteur: { select: { name: true, role: true } },
      },
    });

    // Update demande status to REPONDU if prestataire is responding
    if (isPrestataire && demande.statut === "EN_ATTENTE") {
      await prisma.demande.update({
        where: { id: demandeId },
        data: { statut: "REPONDU" },
      });
    }

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error("[API] POST /api/messages:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
