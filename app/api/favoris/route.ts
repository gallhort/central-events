import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const favoris = await prisma.favori.findMany({
      where: { userId: session.user.id },
      select: { prestataireId: true },
    });

    return NextResponse.json({ favoris: favoris.map((f) => f.prestataireId) });
  } catch (error) {
    console.error("[API] GET /api/favoris:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

const favorisSchema = z.object({
  prestataireId: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = favorisSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }

    const { prestataireId } = parsed.data;
    const userId = session.user.id;

    // Toggle
    const existing = await prisma.favori.findUnique({
      where: { userId_prestataireId: { userId, prestataireId } },
    });

    if (existing) {
      await prisma.favori.delete({
        where: { userId_prestataireId: { userId, prestataireId } },
      });
      return NextResponse.json({ action: "removed" });
    } else {
      await prisma.favori.create({ data: { userId, prestataireId } });
      return NextResponse.json({ action: "added" }, { status: 201 });
    }
  } catch (error) {
    console.error("[API] POST /api/favoris:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
