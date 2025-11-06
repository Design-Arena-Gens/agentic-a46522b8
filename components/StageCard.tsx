import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface StageCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  accent?: "aurora" | "ember";
}

export function StageCard({
  title,
  subtitle,
  children,
  accent = "aurora"
}: StageCardProps) {
  return (
    <section
      className={twMerge(
        "rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-2xl backdrop-blur",
        accent === "aurora"
          ? "shadow-aurora/40"
          : "shadow-[0_0_35px_rgba(249,115,22,0.35)]"
      )}
    >
      <header className="mb-4 space-y-1">
        <h2 className="font-display text-2xl tracking-wide aurora-text">
          {title}
        </h2>
        {subtitle ? (
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
            {subtitle}
          </p>
        ) : null}
      </header>
      <div className="space-y-3 text-sm leading-relaxed text-slate-200">
        {children}
      </div>
    </section>
  );
}
