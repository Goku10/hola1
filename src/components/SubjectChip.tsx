"use client";

import { cn } from "@/lib/utils";
import type { SubjectChipKind } from "@/lib/types";
import { useI18n } from "@/lib/i18n";

const styles: Record<SubjectChipKind, string> = {
  mandatory: "bg-navy-900 text-white",
  required: "bg-teal text-white",
  recommended: "bg-sky-soft text-sky-800 border border-sky-300",
  completed: "bg-emerald-500 text-white",
  missing: "bg-rose-danger text-white",
  unavailable: "bg-slate-300 text-slate-600 line-through",
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
  const { t } = useI18n();
  const kindLabel = t.chips[kind];
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "chip animate-pop shadow-sm hover:scale-105",
        styles[kind],
        onClick ? "cursor-pointer" : "cursor-default"
      )}
      title={kindLabel}
    >
      <span className="opacity-80">{kindLabel}</span>
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
  const { t } = useI18n();
  const colors = {
    complete: "from-emerald-400 to-teal",
    possible: "from-teal to-sky-accent",
    at_risk: "from-amber-warn to-orange-400",
    blocked: "from-rose-danger to-rose-600",
  };
  return (
    <div
      className={cn(
        "flex min-h-[88px] flex-col justify-between rounded-3xl bg-gradient-to-br p-4 text-white shadow-card",
        colors[status]
      )}
    >
      <span className="font-display text-2xl font-black">
        {t.statusShort[status]}
      </span>
      <span className="text-sm font-semibold opacity-95">{label}</span>
    </div>
  );
}
