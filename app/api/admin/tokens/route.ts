import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";

const grantSchema = z.object({
  prestataireId: z.string().min(1),
  montant: z.number().int().min(1).max(100),
  raison: z.string().min(1).max(200),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = grantSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }

    const { prestataireId, montant, raison } = parsed.data;

    const prestataire = await prisma.prestataire.findUnique({
      where: { id: prestataireId },
      select: { id: true, tokenBalance: true },
    });

    if (!prestataire) {
      return NextResponse.json({ error: "Prestataire introuvable" }, { status: 404 });
    }

    const newBalance = prestataire.tokenBalance + montant;

    await prisma.$transaction([
      prisma.prestataire.update({
        where: { id: prestataireId },
        data: { tokenBalance: newBalance },
      }),
      prisma.tokenTransaction.create({
        data: {
          prestataireId,
          type: "OFFERT",
          montant,
          soldeApres: newBalance,
          description: `Admin: ${raison}`,
        },
      }),
    ]);

    return NextResponse.json({ success: true, newBalance });
  } catch (error) {
    console.error("[API] POST /api/admin/tokens:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    const prestataires = await prisma.prestataire.findMany({
      select: {
        id: true,
        nomEntreprise: true,
        tokenBalance: true,
        user: { select: { email: true } },
      },
      orderBy: { nomEntreprise: "asc" },
    });

    return NextResponse.json({ prestataires });
  } catch (error) {
    console.error("[API] GET /api/admin/tokens:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
