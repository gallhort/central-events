import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";

const PACKAGES = {
  starter: { tokens: 5, price: 9.99 },
  popular: { tokens: 15, price: 24.99 },
  pro: { tokens: 30, price: 44.99 },
} as const;

const achatSchema = z.object({
  package: z.enum(["starter", "popular", "pro"]),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = achatSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Package invalide" }, { status: 400 });
    }

    const prestataire = await prisma.prestataire.findUnique({
      where: { userId: session.user.id },
      select: { id: true, tokenBalance: true },
    });

    if (!prestataire) {
      return NextResponse.json({ error: "Prestataire introuvable" }, { status: 404 });
    }

    const pkg = PACKAGES[parsed.data.package];
    const newBalance = prestataire.tokenBalance + pkg.tokens;

    await prisma.$transaction([
      prisma.prestataire.update({
        where: { id: prestataire.id },
        data: { tokenBalance: newBalance },
      }),
      prisma.tokenTransaction.create({
        data: {
          prestataireId: prestataire.id,
          type: "ACHAT",
          montant: pkg.tokens,
          soldeApres: newBalance,
          description: `Achat de ${pkg.tokens} jetons — ${pkg.price.toFixed(2).replace(".", ",")}€`,
        },
      }),
    ]);

    return NextResponse.json({ success: true, newBalance }, { status: 201 });
  } catch (error) {
    console.error("[API] POST /api/tokens/acheter:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
