import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { TokenPurchaseClient } from "./TokenPurchaseClient";

export default async function TokensPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/connexion");

  const prestataire = await prisma.prestataire.findUnique({
    where: { userId: session.user.id },
    select: {
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
        },
      },
    },
  });

  if (!prestataire) redirect("/dashboard/prestataire");

  return (
    <TokenPurchaseClient
      initialBalance={prestataire.tokenBalance}
      transactions={prestataire.transactions.map((tx) => ({
        ...tx,
        createdAt: tx.createdAt.toISOString(),
      }))}
    />
  );
}
