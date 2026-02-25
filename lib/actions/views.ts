"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function incrementView(prestataireId: string) {
  const cookieName = `viewed_${prestataireId}`;
  const cookieStore = cookies();

  // Only count one view per session per prestataire
  if (cookieStore.get(cookieName)) return;

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await prisma.$transaction([
      prisma.prestataire.update({
        where: { id: prestataireId },
        data: { vues: { increment: 1 } },
      }),
      prisma.vueStats.upsert({
        where: { prestataireId_date: { prestataireId, date: today } },
        create: { prestataireId, date: today, count: 1 },
        update: { count: { increment: 1 } },
      }),
    ]);

    // Set cookie (1 day)
    cookieStore.set(cookieName, "1", {
      maxAge: 60 * 60 * 24,
      httpOnly: true,
      sameSite: "lax",
    });
  } catch (error) {
    // Silently fail - views are non-critical
    console.warn("[views] Failed to increment:", error);
  }
}
