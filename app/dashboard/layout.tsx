import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/connexion");
  }

  let tokenBalance: number | undefined;
  if (session.user.role === "PRESTATAIRE") {
    const prestataire = await prisma.prestataire.findUnique({
      where: { userId: session.user.id },
      select: { tokenBalance: true },
    });
    tokenBalance = prestataire?.tokenBalance;
  }

  return (
    <div className="min-h-screen bg-[#f8f7f4] flex">
      <DashboardSidebar
        role={session.user.role}
        userName={session.user.name ?? ""}
        tokenBalance={tokenBalance}
      />
      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8 max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
