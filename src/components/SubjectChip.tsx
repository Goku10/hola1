"use client";

import { cn } from "@/lib/utils";
import type { SubjectChipKind } from "@/lib/types";

const styles: Record<SubjectChipKind, string> = {
  mandatory: "bg-navy-900 text-white",
  required: "bg-teal text-white",
  recommended: "bg-sky-soft text-sky-800 border border-sky-300",
  completed: "bg-emerald-500 text-white",
  missing: "bg-rose-danger text-white",
  unavailable: "bg-slate-300 text-slate-600 line-through",
};

const labelsNb: Record<SubjectChipKind, string> = {
  mandatory: "Fellesfag",
  required: "Krav",
  recommended: "Anbefalt",
  completed: "Ferdig",
  missing: "Mangler",
  unavailable: "Ikke tilbudt",
};

export function SubjectChip({
  label,
  kind,
  onClick,
}: {
  label: string;
  kind: SubjectChipKind;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "chip animate-pop shadow-sm hover:scale-105",
        styles[kind],
        onClick ? "cursor-pointer" : "cursor-default"
      )}
      title={labelsNb[kind]}
    >
      <span className="opacity-80">{labelsNb[kind]}</span>
      <span>{label}</span>
    </button>
  );
}

export function StatusTile({
  status,
  label,
}: {
  status: "possible" | "at_risk" | "blocked" | "complete";
  label: string;
}) {
  const colors = {
    complete: "from-emerald-400 to-teal",
    possible: "from-teal to-sky-accent",
    at_risk: "from-amber-warn to-orange-400",
    blocked: "from-rose-danger to-rose-600",
  };
  const short = {
    complete: "OK",
    possible: "Åpen",
    at_risk: "Sjekk",
    blocked: "Stopp",
  };
  return (
    <div
      className={cn(
        "flex min-h-[88px] flex-col justify-between rounded-3xl bg-gradient-to-br p-4 text-white shadow-card",
        colors[status]
      )}
    >
      <span className="font-display text-2xl font-black">{short[status]}</span>
      <span className="text-sm font-semibold opacity-95">{label}</span>
    </div>
  );
}
