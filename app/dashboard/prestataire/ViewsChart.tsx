"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ViewsChartProps {
  data: { date: string; count: number }[];
}

export function ViewsChart({ data }: ViewsChartProps) {
  const formattedData = data.map((item) => ({
    ...item,
    label: new Date(item.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }),
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={formattedData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: "#9ca3af" }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#9ca3af" }}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1a1a2e",
            border: "none",
            borderRadius: "8px",
            color: "white",
            fontSize: "12px",
          }}
          itemStyle={{ color: "#f59e0b" }}
          labelStyle={{ color: "rgba(255,255,255,0.7)" }}
        />
        <Line
          type="monotone"
          dataKey="count"
          name="Vues"
          stroke="#f59e0b"
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 5, fill: "#f59e0b" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
