"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  GraduationCap,
  Heart,
  Hammer,
  Scale,
  Code2,
  FlaskConical,
  Cog,
  BookOpen,
  Trophy,
  Palette,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { useProfile } from "@/lib/hooks/useProfile";
import { careers, counties, schools } from "@/lib/data";
import type {
  ConfidenceLevel,
  InterestId,
  LearningPreference,
  MathsLevel,
  StudentStage,
} from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, Badge } from "@/components/ui/card";
import { DemoNotice } from "@/components/layout/SiteHeader";
import { cn } from "@/lib/utils";
import { labelOf, useI18n } from "@/lib/i18n";

const stageIds: StudentStage[] = [
  "grade10",
  "vg1",
  "vg2",
  "vg3",
  "fagbrev",
  "adult_private",
];

const interestMeta: { id: InterestId; icon: React.ElementType }[] = [
  { id: "health", icon: Heart },
  { id: "science", icon: FlaskConical },
  { id: "engineering", icon: Cog },
  { id: "it", icon: Code2 },
  { id: "business", icon: Briefcase },
  { id: "law", icon: Scale },
  { id: "education", icon: BookOpen },
  { id: "sports", icon: Trophy },
  { id: "arts", icon: Palette },
  { id: "trades", icon: Hammer },
];

const maths: MathsLevel[] = ["unknown", "1P", "1T", "2P", "S1", "S2", "R1", "R2"];
const confidenceIds: ConfidenceLevel[] = ["low", "medium", "high", "unsure"];
const learningIds: LearningPreference[] = ["theory", "practical", "mixed"];

function SelectCard({
  selected,
  onClick,
  children,
  className,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-2xl border-2 p-4 text-left transition-all active:scale-[0.98]",
        selected
          ? "border-teal bg-teal-soft/50 shadow-md ring-2 ring-teal/30"
          : "border-transparent bg-white hover:border-sky-accent/40",
        className
      )}
    >
      {children}
    </button>
  );
}

export default function OnboardingPage() {
  const { profile, updateProfile, setProfile } = useProfile();
  const { lang, t } = useI18n();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const total = 7;

  const countySchools = schools.filter((s) => s.countyId === profile.countyId);

  const next = () => {
    if (step < total - 1) setStep(step + 1);
    else {
      setProfile(profile);
      router.push("/dashboard");
    }
  };
  const back = () => setStep(Math.max(0, step - 1));

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Badge tone="teal">
          {t.onboarding.step} {step + 1}/{total}
        </Badge>
        <h1 className="mt-2 font-display text-3xl font-extrabold text-navy-900">
          {t.onboarding.title}
        </h1>
        <div className="mt-3 flex gap-1.5">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-2 flex-1 rounded-full transition-all",
                i <= step ? "bg-teal" : "bg-slate-200"
              )}
            />
          ))}
        </div>
      </div>
      <DemoNotice />

      <Card className="min-h-[320px] animate-fade-up">
        {step === 0 && (
          <>
            <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-bold">
              <GraduationCap className="h-5 w-5 text-teal" />{" "}
              {t.onboarding.whereNow}
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {stageIds.map((id) => (
                <SelectCard
                  key={id}
                  selected={profile.stage === id}
                  onClick={() => updateProfile({ stage: id })}
                >
                  <span className="font-display text-lg font-bold">
                    {t.onboarding.stages[id]}
                  </span>
                </SelectCard>
              ))}
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <h2 className="mb-4 font-display text-xl font-bold">
              {t.onboarding.countySchool}
            </h2>
            <div className="mb-4 grid grid-cols-2 gap-2">
              {counties.map((c) => (
                <SelectCard
                  key={c.id}
                  selected={profile.countyId === c.id}
                  onClick={() =>
                    updateProfile({ countyId: c.id, schoolId: undefined })
                  }
                >
                  <span className="font-semibold">{c.name}</span>
                </SelectCard>
              ))}
            </div>
            {countySchools.length > 0 && (
              <div className="grid gap-2">
                <p className="text-xs font-semibold text-slate-500">
                  {t.onboarding.schoolOptional}
                </p>
                {countySchools.map((s) => (
                  <SelectCard
                    key={s.id}
                    selected={profile.schoolId === s.id}
                    onClick={() => updateProfile({ schoolId: s.id })}
                  >
                    {s.name}
                  </SelectCard>
                ))}
              </div>
            )}
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="mb-4 font-display text-xl font-bold">
              {t.onboarding.foreignLang}
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {[true, false].map((v) => (
                <SelectCard
                  key={String(v)}
                  selected={profile.foreignLanguageLowerSecondary === v}
                  onClick={() =>
                    updateProfile({ foreignLanguageLowerSecondary: v })
                  }
                >
                  <span className="font-display text-xl font-bold">
                    {v ? t.onboarding.yes : t.onboarding.no}
                  </span>
                </SelectCard>
              ))}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="mb-4 font-display text-xl font-bold">
              {t.onboarding.maths}
            </h2>
            <div className="grid grid-cols-4 gap-2">
              {maths.map((m) => (
                <SelectCard
                  key={m}
                  selected={profile.mathsLevel === m}
                  onClick={() => updateProfile({ mathsLevel: m })}
                  className="text-center"
                >
                  <span className="font-display font-bold">
                    {m === "unknown" ? "?" : m}
                  </span>
                </SelectCard>
              ))}
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <h2 className="mb-4 font-display text-xl font-bold">
              {t.onboarding.interests}
            </h2>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {interestMeta.map(({ id, icon: Icon }) => {
                const selected = profile.interests.includes(id);
                return (
                  <SelectCard
                    key={id}
                    selected={selected}
                    onClick={() => {
                      const interests = selected
                        ? profile.interests.filter((i) => i !== id)
                        : [...profile.interests, id];
                      updateProfile({ interests });
                    }}
                  >
                    <Icon className="mb-1 h-5 w-5 text-teal" />
                    <span className="font-semibold">
                      {t.onboarding.interestLabels[id]}
                    </span>
                  </SelectCard>
                );
              })}
            </div>
          </>
        )}

        {step === 5 && (
          <>
            <h2 className="mb-4 font-display text-xl font-bold">
              {t.onboarding.goals}
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {careers.map((c) => {
                const selected = profile.goalIds.includes(c.id);
                return (
                  <SelectCard
                    key={c.id}
                    selected={selected}
                    onClick={() => {
                      const goalIds = selected
                        ? profile.goalIds.filter((g) => g !== c.id)
                        : [...profile.goalIds, c.id];
                      updateProfile({ goalIds });
                    }}
                  >
                    <span className="font-display font-bold">
                      {labelOf(c.name, lang)}
                    </span>
                  </SelectCard>
                );
              })}
            </div>
          </>
        )}

        {step === 6 && (
          <>
            <h2 className="mb-3 font-display text-xl font-bold">
              {t.onboarding.confidence}
            </h2>
            <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {confidenceIds.map((id) => (
                <SelectCard
                  key={id}
                  selected={profile.confidence === id}
                  onClick={() => updateProfile({ confidence: id })}
                  className="text-center"
                >
                  {t.onboarding.confidenceLabels[id]}
                </SelectCard>
              ))}
            </div>
            <h2 className="mb-3 font-display text-xl font-bold">
              {t.onboarding.learning}
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {learningIds.map((id) => (
                <SelectCard
                  key={id}
                  selected={profile.learningPreference === id}
                  onClick={() => updateProfile({ learningPreference: id })}
                  className="text-center"
                >
                  {t.onboarding.learningLabels[id]}
                </SelectCard>
              ))}
            </div>
          </>
        )}
      </Card>

      <div className="flex justify-between">
        <Button variant="ghost" onClick={back} disabled={step === 0}>
          <ChevronLeft className="h-4 w-4" /> {t.onboarding.back}
        </Button>
        <Button variant="teal" onClick={next}>
          {step === total - 1 ? t.onboarding.seePlan : t.onboarding.next}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
