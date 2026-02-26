import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AdminTokensClient } from "./AdminTokensClient";

export default async function AdminTokensPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/connexion");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const prestataires = await prisma.prestataire.findMany({
    select: {
      id: true,
      nomEntreprise: true,
      tokenBalance: true,
      user: { select: { email: true } },
    },
    orderBy: { nomEntreprise: "asc" },
  });

  return <AdminTokensClient prestataires={prestataires} />;
}
