import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";

const demandeSchema = z.object({
  prestataireId: z.string().min(1),
  nom: z.string().min(2).max(100),
  email: z.string().email(),
  telephone: z.string().optional(),
  typeEvenement: z.string().min(1),
  dateEvenement: z.string().optional(),
  nbPersonnes: z.coerce.number().positive().optional(),
  budgetMin: z.coerce.number().min(0).optional(),
  budgetMax: z.coerce.number().min(0).optional(),
  message: z.string().min(10).max(2000),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const body = await req.json();
    const parsed = demandeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Get or create an anonymous user for the organisateur
    let organisateurId: string;

    if (session?.user?.id) {
      organisateurId = session.user.id;
    } else {
      // Create or find an anonymous user from email
      let anonUser = await prisma.user.findUnique({ where: { email: data.email } });
      if (!anonUser) {
        anonUser = await prisma.user.create({
          data: {
            email: data.email,
            name: data.nom,
            role: "ORGANISATEUR",
          },
        });
      }
      organisateurId = anonUser.id;
    }

    // Check prestataire exists
    const prestataire = await prisma.prestataire.findUnique({
      where: { id: data.prestataireId },
      include: { user: { select: { email: true, name: true } } },
    });

    if (!prestataire) {
      return NextResponse.json({ error: "Prestataire introuvable" }, { status: 404 });
    }

    const demande = await prisma.demande.create({
      data: {
        organisateurId,
        prestataireId: data.prestataireId,
        nom: data.nom,
        email: data.email,
        telephone: data.telephone,
        typeEvenement: data.typeEvenement,
        dateEvenement: data.dateEvenement ? new Date(data.dateEvenement) : null,
        nbPersonnes: data.nbPersonnes,
        budgetMin: data.budgetMin,
        budgetMax: data.budgetMax,
        message: data.message,
      },
    });

    // Send email notification (non-blocking)
    try {
      await sendDemandeEmail({
        to: prestataire.user.email,
        prestataireName: prestataire.nomEntreprise,
        demandeurNom: data.nom,
        demandeurEmail: data.email,
        typeEvenement: data.typeEvenement,
        message: data.message,
      });
    } catch (emailError) {
      console.warn("[API] Email notification failed:", emailError);
    }

    return NextResponse.json({ success: true, demandeId: demande.id }, { status: 201 });
  } catch (error) {
    console.error("[API] POST /api/demandes:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const role = session.user.role;

    let demandes;

    if (role === "PRESTATAIRE") {
      const prestataire = await prisma.prestataire.findUnique({
        where: { userId: session.user.id },
      });
      if (!prestataire) {
        return NextResponse.json({ demandes: [] });
      }
      demandes = await prisma.demande.findMany({
        where: { prestataireId: prestataire.id },
        include: {
          organisateur: { select: { name: true, email: true, avatar: true } },
          messages: { orderBy: { createdAt: "asc" } },
        },
        orderBy: { createdAt: "desc" },
      });
    } else {
      demandes = await prisma.demande.findMany({
        where: { organisateurId: session.user.id },
        include: {
          prestataire: {
            select: {
              nomEntreprise: true,
              slug: true,
              photos: true,
              categorie: true,
            },
          },
          messages: { orderBy: { createdAt: "asc" } },
        },
        orderBy: { createdAt: "desc" },
      });
    }

    return NextResponse.json({ demandes });
  } catch (error) {
    console.error("[API] GET /api/demandes:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

async function sendDemandeEmail({
  to,
  prestataireName,
  demandeurNom,
  demandeurEmail,
  typeEvenement,
  message,
}: {
  to: string;
  prestataireName: string;
  demandeurNom: string;
  demandeurEmail: string;
  typeEvenement: string;
  message: string;
}) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey || resendKey.startsWith("re_xxx")) return;

  const { Resend } = await import("resend");
  const resend = new Resend(resendKey);

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? "noreply@centralevents.fr",
    to,
    subject: `Nouvelle demande de devis — ${typeEvenement}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a1a2e;">Nouvelle demande de devis sur Central Events</h2>
        <p>Bonjour <strong>${prestataireName}</strong>,</p>
        <p>Vous avez reçu une nouvelle demande de devis de la part de <strong>${demandeurNom}</strong> (${demandeurEmail}).</p>
        <p><strong>Type d'événement :</strong> ${typeEvenement}</p>
        <p><strong>Message :</strong></p>
        <blockquote style="border-left: 3px solid #f59e0b; padding-left: 12px; color: #555;">${message}</blockquote>
        <p>Connectez-vous à votre espace prestataire pour répondre à cette demande.</p>
        <a href="${process.env.NEXTAUTH_URL}/dashboard/prestataire/demandes" style="display: inline-block; background: #1a1a2e; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 12px;">Voir la demande</a>
      </div>
    `,
  });
}
