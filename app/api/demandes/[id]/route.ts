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
      select: { id: true, tokenBalance: true },
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

    // Token guard: ACCEPTE and REPONDU require 1 token (REFUSE and ARCHIVE are free)
    const tokenRequiredStatuts = ["ACCEPTE", "REPONDU"];
    if (tokenRequiredStatuts.includes(parsed.data.statut)) {
      const alreadyUnlocked = await prisma.demandeToken.findUnique({
        where: {
          prestataireId_demandeId: {
            prestataireId: prestataire.id,
            demandeId: params.id,
          },
        },
      });

      if (!alreadyUnlocked) {
        if (prestataire.tokenBalance < 1) {
          return NextResponse.json(
            { error: "INSUFFICIENT_TOKENS", balance: prestataire.tokenBalance },
            { status: 402 }
          );
        }

        const newBalance = prestataire.tokenBalance - 1;
        await prisma.$transaction([
          prisma.prestataire.update({
            where: { id: prestataire.id },
            data: { tokenBalance: newBalance },
          }),
          prisma.demandeToken.create({
            data: { prestataireId: prestataire.id, demandeId: params.id },
          }),
          prisma.tokenTransaction.create({
            data: {
              prestataireId: prestataire.id,
              type: "DEPENSE",
              montant: -1,
              soldeApres: newBalance,
              description: `Réponse à la demande #${params.id.slice(-8)}`,
              demandeId: params.id,
            },
          }),
        ]);
      }
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
