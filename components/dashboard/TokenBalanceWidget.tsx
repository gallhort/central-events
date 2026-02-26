"use client";

import Link from "next/link";
import { Coins } from "lucide-react";
import { cn } from "@/lib/utils";

interface TokenBalanceWidgetProps {
  balance: number;
  className?: string;
}

export function TokenBalanceWidget({ balance, className }: TokenBalanceWidgetProps) {
  const isLow = balance > 0 && balance <= 2;
  const isEmpty = balance === 0;

  return (
    <Link
      href="/dashboard/prestataire/tokens"
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-xl border transition-all hover:opacity-80",
        isEmpty
          ? "bg-red-50 border-red-200 text-red-600"
          : isLow
          ? "bg-amber-50 border-amber-200 text-amber-700"
          : "bg-green-50 border-green-200 text-green-700",
        className
      )}
    >
      <Coins className="w-4 h-4 flex-shrink-0" />
      <span className="font-semibold text-sm">
        {balance} jeton{balance !== 1 ? "s" : ""}
      </span>
      {(isEmpty || isLow) && (
        <span className="text-xs opacity-70 ml-1">{isEmpty ? "Épuisé" : "Faible"}</span>
      )}
    </Link>
  );
}
