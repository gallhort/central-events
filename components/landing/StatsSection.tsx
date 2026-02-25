"use client";

import { useEffect, useRef, useState } from "react";

const STATS = [
  { value: 100, suffix: "+", label: "Organisateurs actifs" },
  { value: 25, suffix: "+", label: "Prestataires référencés" },
  { value: 0, suffix: "%", label: "Commission pour commencer" },
  { value: 4.8, suffix: "/5", label: "Note moyenne des prestataires" },
];

function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const isDecimal = target % 1 !== 0;
          const start = Date.now();
          const step = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = eased * target;
            setCount(isDecimal ? Math.round(current * 10) / 10 : Math.floor(current));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

function StatItem({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { count, ref } = useCountUp(value);
  const isDecimal = value % 1 !== 0;

  return (
    <div ref={ref} className="text-center">
      <div className="font-display text-4xl md:text-5xl font-bold text-[#1a1a2e] mb-2">
        {isDecimal ? count.toFixed(1) : count}
        <span className="text-amber-500">{suffix}</span>
      </div>
      <p className="text-gray-500 font-medium">{label}</p>
    </div>
  );
}

export function StatsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[#1a1a2e] mb-4">
            La plateforme qui fait la différence
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Des chiffres qui parlent d'eux-mêmes
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat) => (
            <StatItem key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
