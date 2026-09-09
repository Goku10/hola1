"use client";

import { useMemo, useState } from "react";
import {
  Brain,
  Building2,
  ChartColumn,
  Code2,
  Cog,
  Hammer,
  Heart,
  BookOpen,
  PawPrint,
  Scale,
  Shield,
  Smile,
  Stethoscope,
  Zap,
  Plus,
  Check,
} from "lucide-react";
import { careers, admissionCodes, cutoffs, institutions } from "@/lib/data";
import { useProfile } from "@/lib/hooks/useProfile";
import { labelOf, useI18n } from "@/lib/i18n";
import { Card, Badge } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DemoNotice } from "@/components/layout/SiteHeader";
import type { CompetitivenessBand, InterestId } from "@/lib/types";
import { cn } from "@/lib/utils";
import { subjectById } from "@/lib/data/seeds/subjects";
import { collectRequiredSubjects } from "@/lib/engine";

const iconMap: Record<string, React.ElementType> = {
  stethoscope: Stethoscope,
  cog: Cog,
  code: Code2,
  smile: Smile,
  paw: PawPrint,
  brain: Brain,
  scale: Scale,
  book: BookOpen,
  heart: Heart,
  chart: ChartColumn,
  building: Building2,
  shield: Shield,
  zap: Zap,
  hammer: Hammer,
};

const fieldIds: (InterestId | "all")[] = [
  "all",
  "health",
  "engineering",
  "it",
  "law",
  "education",
  "business",
  "trades",
  "arts",
];

const bandTone: Record<CompetitivenessBand, "muted" | "teal" | "amber" | "rose" | "sky"> = {
  low: "teal",
  medium: "sky",
  high: "amber",
  very_high: "rose",
  na: "muted",
};

export default function CareersPage() {
  const { lang, t } = useI18n();
  const { profile, toggleGoal } = useProfile();
  const [field, setField] = useState<InterestId | "all">("all");
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return careers.filter((c) => {
      if (field !== "all" && c.field !== field) return false;
      if (
        q &&
        !labelOf(c.name, lang).toLowerCase().includes(q.toLowerCase())
      )
        return false;
      return true;
    });
  }, [field, q, lang]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-extrabold text-navy-900 md:text-4xl">
          {t.careers.title}
        </h1>
        <p className="mt-1 text-sm text-slate-500">{t.careers.subtitle}</p>
      </div>
      <DemoNotice />

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={t.careers.search}
        className="w-full rounded-2xl border-0 bg-white px-4 py-3 text-sm shadow-card outline-none ring-2 ring-transparent focus:ring-teal"
      />

      <div className="flex gap-2 overflow-x-auto pb-1">
        {fieldIds.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setField(id)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-xs font-bold transition",
              field === id
                ? "bg-navy-900 text-white"
                : "bg-white text-navy-700 shadow-sm"
            )}
          >
            {t.careers.fields[id]}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((career) => {
          const Icon = iconMap[career.icon] ?? BriefcaseFallback;
          const selected = profile.goalIds.includes(career.id);
          const code = admissionCodes.find(
            (a) => a.id === career.admissionCodeIds[0]
          );
          const reqs = code
            ? collectRequiredSubjects(code.requirements).slice(0, 4)
            : [];
          const careerCutoffs = cutoffs
            .filter((c) => c.careerId === career.id)
            .slice(0, 3);
          const expanded = openId === career.id;

          return (
            <Card
              key={career.id}
              className={cn(
                "animate-fade-up flex flex-col",
                selected && "ring-2 ring-teal"
              )}
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal to-sky-accent text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <Badge tone={bandTone[career.competitiveness]}>
                  {t.careers.band[career.competitiveness]}
                </Badge>
              </div>
              <h2 className="font-display text-xl font-bold text-navy-900">
                {labelOf(career.name, lang)}
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                {labelOf(career.typicalPathway, lang)}
              </p>
              {code && (
                <Badge tone="muted" className="mt-2 w-fit">
                  {code.code}
                </Badge>
              )}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {reqs.map((sid) => (
                  <span
                    key={sid}
                    className="rounded-full bg-teal-soft px-2 py-0.5 text-[10px] font-bold text-teal-dark"
                  >
                    {subjectById[sid]?.code ?? sid}
                  </span>
                ))}
                {reqs.length === 0 && (
                  <span className="text-[10px] font-bold text-slate-400">
                    {t.careers.vocationalOther}
                  </span>
                )}
              </div>

              {expanded && (
                <div className="mt-3 space-y-2 border-t border-slate-100 pt-3">
                  <p className="text-[11px] font-semibold text-slate-500">
                    {t.careers.historicalPoints}
                  </p>
                  {careerCutoffs.length === 0 && (
                    <p className="text-xs text-slate-400">
                      {t.careers.noPoints}
                    </p>
                  )}
                  {careerCutoffs.map((c) => {
                    const inst = institutions.find(
                      (i) => i.id === c.institutionId
                    );
                    return (
                      <div
                        key={c.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="font-semibold">{inst?.shortName}</span>
                        <span className="font-display font-black">
                          {c.points ?? "—"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="mt-auto flex gap-2 pt-4">
                <Button
                  size="sm"
                  variant={selected ? "teal" : "default"}
                  className="flex-1"
                  onClick={() => toggleGoal(career.id)}
                >
                  {selected ? (
                    <>
                      <Check className="h-4 w-4" /> {t.careers.selected}
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" /> {t.careers.add}
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setOpenId(expanded ? null : career.id)}
                >
                  {expanded ? t.careers.less : t.careers.more}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function BriefcaseFallback(props: React.SVGProps<SVGSVGElement>) {
  return <Building2 {...props} />;
}
