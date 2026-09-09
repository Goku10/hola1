"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  CheckCircle2,
  ExternalLink,
  HelpCircle,
  Route,
  Sparkles,
} from "lucide-react";
import { useProfile } from "@/lib/hooks/useProfile";
import { useI18n, labelOf } from "@/lib/i18n";
import {
  careers,
  admissionCodes,
  subjects,
  prerequisites,
  schools,
  schoolOfferings,
  counties,
  institutions,
  cutoffs,
  sources,
  SAMPLE_SCENARIOS,
} from "@/lib/data";
import {
  evaluateEligibility,
  recommendMinimalPlan,
  explainSubjectWhy,
} from "@/lib/engine";
import { subjectById } from "@/lib/data/seeds/subjects";
import { Card, Badge } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SubjectChip, StatusTile } from "@/components/SubjectChip";
import { DemoNotice } from "@/components/layout/SiteHeader";
import type { SubjectChipKind } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function StatCard({
  value,
  label,
  color,
}: {
  value: number | string;
  label: string;
  color: string;
}) {
  return (
    <Card className="animate-fade-up flex flex-col items-center gap-1 py-4 text-center">
      <div
        className="stat-ring"
        style={
          {
            "--ring-color": color,
            "--pct": typeof value === "number" ? Math.min(100, value * 12) : 70,
          } as React.CSSProperties
        }
      >
        <span className="relative z-10 font-display text-2xl font-black text-navy-900">
          {value}
        </span>
      </div>
      <span className="text-xs font-semibold text-slate-500">{label}</span>
    </Card>
  );
}

export default function DashboardPage() {
  const { profile, loadScenario, ready } = useProfile();
  const { lang, t } = useI18n();
  const [why, setWhy] = useState<string | null>(null);

  const offering = useMemo(
    () =>
      profile.schoolId
        ? schoolOfferings.find((o) => o.schoolId === profile.schoolId) ?? null
        : schoolOfferings[0],
    [profile.schoolId]
  );

  const ctx = useMemo(
    () => ({
      subjects,
      admissionCodes,
      careers,
      prerequisites,
      offering,
    }),
    [offering]
  );

  const eligibility = useMemo(
    () => evaluateEligibility(profile, ctx),
    [profile, ctx]
  );
  const recommendation = useMemo(
    () => recommendMinimalPlan(profile, ctx),
    [profile, ctx]
  );

  const school = schools.find((s) => s.id === profile.schoolId);
  const county = counties.find((c) => c.id === profile.countyId);
  const goalCareers = careers.filter((c) => profile.goalIds.includes(c.id));

  const yearPlans = [
    { key: "vg1" as const, title: "Vg1", subjects: recommendation.plan.vg1 },
    { key: "vg2" as const, title: "Vg2", subjects: recommendation.plan.vg2 },
    { key: "vg3" as const, title: "Vg3", subjects: recommendation.plan.vg3 },
  ];

  const relatedCutoffs = cutoffs
    .filter((c) => profile.goalIds.includes(c.careerId))
    .slice(0, 6);

  if (!ready) {
    return (
      <div className="grid gap-4 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 animate-pulse rounded-3xl bg-white/70" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="mb-2 flex flex-wrap gap-2">
            <Badge tone="teal">{profile.stage}</Badge>
            {goalCareers.map((c) => (
              <Badge key={c.id} tone="sky">
                {labelOf(c.name, lang)}
              </Badge>
            ))}
            {county && <Badge tone="muted">{county.name}</Badge>}
            {school && <Badge tone="muted">{school.name}</Badge>}
          </div>
          <h1 className="font-display text-3xl font-extrabold text-navy-900 md:text-4xl">
            {t.dashboard.title}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {recommendation.demanding ? `${t.dashboard.demanding} · ` : ""}
            {recommendation.confirmWithSchool
              ? t.dashboard.confirmSchool
              : t.dashboard.planReady}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => loadScenario("doctor-engineer-g10")}
          >
            {t.dashboard.loadDoctorEngineer}
          </Button>
          <Button asChild size="sm" variant="teal">
            <Link href="/onboarding">
              {t.dashboard.editProfile} <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <DemoNotice />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard
          value={profile.goalIds.length}
          label={t.dashboard.goalsSelected}
          color="#0f766e"
        />
        <StatCard
          value={eligibility.completedCount}
          label={t.dashboard.requirementsMet}
          color="#14b8a6"
        />
        <StatCard
          value={eligibility.remainingCount}
          label={t.dashboard.remaining}
          color="#f59e0b"
        />
        <StatCard
          value={eligibility.pathwaysOpen}
          label={t.dashboard.pathwaysOpen}
          color="#38bdf8"
        />
      </div>

      <section>
        <h2 className="mb-3 font-display text-lg font-bold text-navy-900">
          {t.dashboard.status}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {eligibility.goals.map((g) => {
            const career = careers.find((c) => c.id === g.careerId);
            return (
              <StatusTile
                key={g.careerId}
                status={g.status}
                label={career ? labelOf(career.name, lang) : g.careerId}
              />
            );
          })}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {eligibility.goals.some((g) => g.formalRequirementsMet) && (
            <Badge tone="teal">
              <CheckCircle2 className="mr-1 inline h-3 w-3" />
              {t.formalOk}
            </Badge>
          )}
          <Badge tone="amber">{t.admissionDepends}</Badge>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center gap-2">
          <Route className="h-5 w-5 text-teal" />
          <h2 className="font-display text-lg font-bold text-navy-900">
            {t.dashboard.threeYear}
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {yearPlans.map((year, idx) => (
            <Card
              key={year.key}
              className={cn(
                "animate-fade-up relative overflow-hidden",
                idx === 1 && "ring-2 ring-teal/40"
              )}
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="font-display text-2xl font-black text-navy-900">
                  {year.title}
                </span>
                <span className="rounded-full bg-sky-soft px-2 py-0.5 text-[10px] font-bold text-sky-800">
                  {t.dashboard.step} {idx + 1}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {year.subjects.length === 0 && (
                  <span className="text-sm text-slate-400">—</span>
                )}
                {year.subjects.map((sid) => {
                  const kind: SubjectChipKind =
                    eligibility.subjectStatuses[sid] ?? "required";
                  return (
                    <SubjectChip
                      key={sid}
                      label={subjectById[sid]?.name[lang] ?? sid}
                      kind={kind}
                      onClick={() => setWhy(sid)}
                    />
                  );
                })}
              </div>
            </Card>
          ))}
        </div>
        {recommendation.rationale[0] && (
          <p className="mt-3 text-sm font-medium text-navy-700">
            <Sparkles className="mr-1 inline h-4 w-4 text-teal" />
            {recommendation.rationale[0]}
          </p>
        )}
      </section>

      <section>
        <div className="mb-3 flex items-center gap-2">
          <Building2 className="h-5 w-5 text-sky-accent" />
          <h2 className="font-display text-lg font-bold text-navy-900">
            {t.dashboard.institutions}
          </h2>
          <Badge tone="amber">{t.historical}</Badge>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {relatedCutoffs.map((c) => {
            const inst = institutions.find((i) => i.id === c.institutionId);
            const career = careers.find((x) => x.id === c.careerId);
            if (!inst) return null;
            const hot = (c.points ?? 0) >= 60;
            return (
              <Card
                key={c.id}
                className={cn(
                  "min-w-[180px] shrink-0",
                  hot ? "bg-gradient-to-br from-rose-50 to-white" : ""
                )}
              >
                <div className="font-display text-lg font-extrabold text-navy-900">
                  {inst.shortName}
                </div>
                <div className="text-xs text-slate-500">
                  {inst.city} · {career ? labelOf(career.name, lang) : ""}
                </div>
                <div className="mt-3 font-display text-3xl font-black text-navy-900">
                  {c.points ?? "—"}
                </div>
                <div className="text-[11px] font-semibold text-slate-400">
                  {c.year} · {c.quota}
                </div>
              </Card>
            );
          })}
          {relatedCutoffs.length === 0 && (
            <Card className="text-sm text-slate-500">
              {t.dashboard.noCutoff}
            </Card>
          )}
        </div>
        {relatedCutoffs.some((c) => c.points != null) && (
          <Card className="mt-3 h-48">
            <p className="mb-2 text-xs font-bold text-slate-500">
              {t.dashboard.historicalPoints}
            </p>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart
                data={relatedCutoffs
                  .filter((c) => c.points != null)
                  .map((c) => ({
                    name: institutions.find((i) => i.id === c.institutionId)
                      ?.shortName,
                    poeng: c.points,
                  }))}
              >
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis domain={[40, 70]} tick={{ fontSize: 11 }} width={32} />
                <Tooltip />
                <Bar dataKey="poeng" fill="#14b8a6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <div className="mb-2 flex items-center gap-2 font-display font-bold text-navy-900">
            <AlertTriangle className="h-4 w-4 text-amber-warn" />
            {t.dashboard.warnings}
          </div>
          <div className="flex flex-wrap gap-2">
            {(eligibility.warnings.length
              ? eligibility.warnings
              : [t.dashboard.noWarnings]
            ).map((w) => (
              <Badge key={w} tone={eligibility.warnings.length ? "amber" : "muted"}>
                {w}
              </Badge>
            ))}
          </div>
        </Card>
        <Card>
          <div className="mb-2 font-display font-bold text-navy-900">
            {t.dashboard.altRoutes}
          </div>
          <div className="flex flex-wrap gap-2">
            {[t.dashboard.privatist, t.dashboard.forkurs, t.dashboard.yvei, t.dashboard.supplement].map((a) => (
              <Badge key={a} tone="sky">
                {a}
              </Badge>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <div className="mb-3 font-display font-bold text-navy-900">
          {t.dashboard.sources}
        </div>
        <div className="flex flex-wrap gap-2">
          {sources.map((s) => (
            <a
              key={s.id}
              href={s.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-full bg-navy-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-navy-800"
            >
              {s.name}
              <ExternalLink className="h-3 w-3" />
            </a>
          ))}
        </div>
      </Card>

      <div className="flex flex-wrap gap-2">
        {(
          Object.keys(SAMPLE_SCENARIOS) as (keyof typeof SAMPLE_SCENARIOS)[]
        ).map((id) => (
          <Button
            key={id}
            size="sm"
            variant="ghost"
            onClick={() => loadScenario(id)}
          >
            {t.dashboard.example}: {id}
          </Button>
        ))}
      </div>

      {why && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-navy-950/40 p-4 sm:items-center"
          onClick={() => setWhy(null)}
          role="presentation"
        >
          <Card
            className="w-full max-w-md animate-fade-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-2 flex items-center gap-2 font-display text-lg font-bold">
              <HelpCircle className="h-5 w-5 text-teal" />
              {t.dashboard.whySubject}
            </div>
            <p className="text-sm leading-relaxed text-navy-800">
              {explainSubjectWhy(why, profile, ctx)}
            </p>
            <Button
              className="mt-4 w-full"
              variant="teal"
              onClick={() => setWhy(null)}
            >
              {t.dashboard.close}
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
}
