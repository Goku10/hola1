"use client";

import { useMemo, useState } from "react";
import { careers, admissionCodes, cutoffs, institutions } from "@/lib/data";
import { labelOf, useI18n } from "@/lib/i18n";
import { Card, Badge } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DemoNotice } from "@/components/layout/SiteHeader";
import { subjectById } from "@/lib/data/seeds/subjects";
import { collectRequiredSubjects } from "@/lib/engine";
import { cn } from "@/lib/utils";
import { pathways as pathwaySeeds } from "@/lib/data/seeds/meta";

const scenarioIds = ["doctor", "engineer", "both"] as const;

export default function ComparePage() {
  const { lang, t } = useI18n();
  const [selected, setSelected] = useState<string[]>(["doctor", "engineer"]);
  const [scenario, setScenario] =
    useState<(typeof scenarioIds)[number]>("both");

  const scenarios = [
    { id: "doctor" as const, label: t.compare.doctorOnly, careerIds: ["doctor"] },
    {
      id: "engineer" as const,
      label: t.compare.engineerOnly,
      careerIds: ["engineer"],
    },
    {
      id: "both" as const,
      label: t.compare.both,
      careerIds: ["doctor", "engineer"],
    },
  ];

  const toggle = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return [...prev.slice(1), id];
      return [...prev, id];
    });
  };

  const cols = careers.filter((c) => selected.includes(c.id)).slice(0, 3);

  const sharedSubjects = useMemo(() => {
    if (cols.length < 2) return [];
    const sets = cols.map((c) => {
      const code = admissionCodes.find((a) => a.id === c.admissionCodeIds[0]);
      return new Set(code ? collectRequiredSubjects(code.requirements) : []);
    });
    return [...sets[0]].filter((sid) => sets.every((s) => s.has(sid)));
  }, [cols]);

  const activeScenario = scenarios.find((s) => s.id === scenario)!;
  const path =
    pathwaySeeds.find(
      (p) =>
        p.careerIds.length === activeScenario.careerIds.length &&
        activeScenario.careerIds.every((id) => p.careerIds.includes(id))
    ) ?? pathwaySeeds.find((p) => p.id === "path-doctor-engineer");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-extrabold text-navy-900">
          {t.compare.title}
        </h1>
        <p className="text-sm text-slate-500">{t.compare.subtitle}</p>
      </div>
      <DemoNotice />

      <div className="flex flex-wrap gap-2">
        {careers.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => toggle(c.id)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-bold transition",
              selected.includes(c.id)
                ? "bg-navy-900 text-white"
                : "bg-white text-navy-700 shadow-sm"
            )}
          >
            {labelOf(c.name, lang)}
          </button>
        ))}
      </div>

      {sharedSubjects.length > 0 && (
        <Card className="bg-gradient-to-r from-teal-soft/80 to-sky-soft/80">
          <p className="text-xs font-bold uppercase tracking-wide text-teal-dark">
            {t.compare.shared}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {sharedSubjects.map((sid) => (
              <Badge key={sid} tone="teal">
                {subjectById[sid]?.name[lang] ?? sid}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      <div className="overflow-x-auto">
        <div
          className="grid min-w-[640px] gap-3"
          style={{
            gridTemplateColumns: `140px repeat(${cols.length}, minmax(160px, 1fr))`,
          }}
        >
          <div />
          {cols.map((c) => (
            <Card key={c.id} className="text-center">
              <div className="font-display text-lg font-extrabold">
                {labelOf(c.name, lang)}
              </div>
              <Badge tone="muted" className="mt-1">
                {admissionCodes.find((a) => a.id === c.admissionCodeIds[0])?.code}
              </Badge>
            </Card>
          ))}

          {[
            {
              row: t.compare.gsu,
              cell: (id: string) => {
                const code = admissionCodes.find(
                  (a) =>
                    a.id ===
                    careers.find((c) => c.id === id)?.admissionCodeIds[0]
                );
                const has =
                  code &&
                  JSON.stringify(code.requirements).includes('"gsu"');
                return has ? t.onboarding.yes : "—";
              },
            },
            {
              row: t.compare.competition,
              cell: (id: string) =>
                careers.find((c) => c.id === id)?.competitiveness ?? "—",
            },
            {
              row: t.compare.required,
              cell: (id: string) => {
                const career = careers.find((c) => c.id === id);
                const code = admissionCodes.find(
                  (a) => a.id === career?.admissionCodeIds[0]
                );
                if (!code) return "—";
                return collectRequiredSubjects(code.requirements)
                  .map((s) => subjectById[s]?.code ?? s)
                  .join(", ");
              },
            },
            {
              row: t.compare.recommended,
              cell: (id: string) => {
                const career = careers.find((c) => c.id === id);
                return (
                  career?.recommendedSubjects
                    ?.map((s) => subjectById[s]?.code ?? s)
                    .join(", ") || "—"
                );
              },
            },
            {
              row: t.compare.points,
              cell: (id: string) => {
                const pts = cutoffs
                  .filter((c) => c.careerId === id && c.points != null)
                  .map((c) => c.points as number);
                if (!pts.length) return "N/A";
                return `${Math.min(...pts)}–${Math.max(...pts)}`;
              },
            },
          ].map((row) => (
            <div key={row.row} className="contents">
              <div className="flex items-center rounded-2xl bg-white/80 px-3 py-3 text-xs font-bold text-slate-500">
                {row.row}
              </div>
              {cols.map((c) => (
                <div
                  key={c.id + row.row}
                  className="rounded-2xl bg-white px-3 py-3 text-sm font-semibold text-navy-900 shadow-sm"
                >
                  {row.cell(c.id)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <section>
        <h2 className="mb-3 font-display text-lg font-bold">
          {t.compare.scenario}
        </h2>
        <div className="mb-4 flex flex-wrap gap-2">
          {scenarios.map((s) => (
            <Button
              key={s.id}
              size="sm"
              variant={scenario === s.id ? "teal" : "outline"}
              onClick={() => setScenario(s.id)}
            >
              {s.label}
            </Button>
          ))}
        </div>
        <Card className="bg-gradient-to-br from-navy-900 to-navy-800 text-white">
          <Badge tone="sky" className="mb-2 bg-white/15 text-white">
            {path ? labelOf(path.name, lang) : activeScenario.label}
          </Badge>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {(["vg1", "vg2", "vg3"] as const).map((y) => (
              <div key={y} className="rounded-2xl bg-white/10 p-4">
                <div className="font-display text-xl font-black uppercase">
                  {y}
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {(path?.plan[y] ?? []).map((sid) => (
                    <span
                      key={sid}
                      className="rounded-full bg-teal px-2 py-0.5 text-[10px] font-bold"
                    >
                      {subjectById[sid]?.code ?? sid}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-sky-100/80">
            {t.compare.confirmSchool}
          </p>
        </Card>
      </section>

      <div className="flex flex-wrap gap-2">
        {cols.flatMap((c) =>
          cutoffs
            .filter((x) => x.careerId === c.id)
            .slice(0, 2)
            .map((cut) => {
              const inst = institutions.find((i) => i.id === cut.institutionId);
              return (
                <Badge key={cut.id} tone="muted">
                  {inst?.shortName}: {cut.points ?? "—"}
                </Badge>
              );
            })
        )}
      </div>
    </div>
  );
}
