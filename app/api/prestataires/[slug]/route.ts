import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const prestataire = await prisma.prestataire.findUnique({
      where: { slug: params.slug },
      include: {
        avis: {
          orderBy: { createdAt: "desc" },
          take: 20,
        },
        user: {
          select: { name: true, email: true },
        },
      },
    });

    if (!prestataire) {
      return NextResponse.json({ error: "Prestataire introuvable" }, { status: 404 });
    }

    return NextResponse.json(prestataire);
  } catch (error) {
    console.error("[API] GET /api/prestataires/[slug]:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
