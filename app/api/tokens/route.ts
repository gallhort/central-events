import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const prestataire = await prisma.prestataire.findUnique({
      where: { userId: session.user.id },
      select: {
        id: true,
        tokenBalance: true,
        transactions: {
          orderBy: { createdAt: "desc" },
          take: 20,
          select: {
            id: true,
            type: true,
            montant: true,
            soldeApres: true,
            description: true,
            createdAt: true,
            demandeId: true,
          },
        },
      },
    });

    if (!prestataire) {
      return NextResponse.json({ error: "Prestataire introuvable" }, { status: 404 });
    }

    return NextResponse.json({
      balance: prestataire.tokenBalance,
      transactions: prestataire.transactions,
    });
  } catch (error) {
    console.error("[API] GET /api/tokens:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
