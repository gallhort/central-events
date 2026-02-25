import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const searchSchema = z.object({
  categorie: z.string().optional(),
  ville: z.string().optional(),
  typeEvenement: z.string().optional(),
  minNote: z.coerce.number().min(0).max(5).optional(),
  minPrix: z.coerce.number().min(0).optional(),
  maxPrix: z.coerce.number().min(0).optional(),
  sort: z.enum(["pertinence", "note", "prix_asc"]).optional().default("pertinence"),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(50).optional().default(10),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const params = Object.fromEntries(searchParams.entries());
    const parsed = searchSchema.safeParse(params);

    if (!parsed.success) {
      return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 });
    }

    const { categorie, ville, minNote, minPrix, maxPrix, sort, page, limit } = parsed.data;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (categorie) where.categorie = categorie;
    if (ville) where.ville = { contains: ville, mode: "insensitive" };
    if (minNote !== undefined) where.noteGlobale = { gte: minNote };
    if (minPrix !== undefined || maxPrix !== undefined) {
      where.prixMin = {};
      if (minPrix !== undefined) (where.prixMin as Record<string, number>).gte = minPrix;
      if (maxPrix !== undefined) (where.prixMin as Record<string, number>).lte = maxPrix;
    }

    const orderBy: Record<string, string> =
      sort === "note"
        ? { noteGlobale: "desc" }
        : sort === "prix_asc"
        ? { prixMin: "asc" }
        : { vues: "desc" };

    const [prestataires, total] = await Promise.all([
      prisma.prestataire.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          slug: true,
          nomEntreprise: true,
          categorie: true,
          ville: true,
          photos: true,
          prixMin: true,
          prixMax: true,
          noteGlobale: true,
          nbAvis: true,
          verifie: true,
          disponible: true,
        },
      }),
      prisma.prestataire.count({ where }),
    ]);

    return NextResponse.json({
      prestataires,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("[API] GET /api/prestataires:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
