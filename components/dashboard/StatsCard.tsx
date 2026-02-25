import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: number;
  className?: string;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  className,
}: StatsCardProps) {
  return (
    <div className={cn("bg-white rounded-2xl p-6 shadow-card", className)}>
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
          <Icon className="w-5 h-5 text-amber-500" />
        </div>
        {trend !== undefined && (
          <span
            className={cn(
              "text-xs font-medium px-2 py-1 rounded-full",
              trend >= 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
            )}
          >
            {trend >= 0 ? "+" : ""}
            {trend}%
          </span>
        )}
      </div>
      <div className="font-display text-3xl font-bold text-[#1a1a2e] mb-1">{value}</div>
      <p className="text-sm font-medium text-gray-700">{title}</p>
      {description && <p className="text-xs text-gray-400 mt-1">{description}</p>}
    </div>
  );
}
