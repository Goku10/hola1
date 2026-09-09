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

const stages: { id: StudentStage; label: string }[] = [
  { id: "grade10", label: "10. trinn" },
  { id: "vg1", label: "Vg1" },
  { id: "vg2", label: "Vg2" },
  { id: "vg3", label: "Vg3" },
  { id: "fagbrev", label: "Fagbrev" },
  { id: "adult_private", label: "Voksen / privatist" },
];

const interests: { id: InterestId; label: string; icon: React.ElementType }[] = [
  { id: "health", label: "Helse", icon: Heart },
  { id: "science", label: "Realfag", icon: FlaskConical },
  { id: "engineering", label: "Ingeniør", icon: Cog },
  { id: "it", label: "IT", icon: Code2 },
  { id: "business", label: "Økonomi", icon: Briefcase },
  { id: "law", label: "Juss", icon: Scale },
  { id: "education", label: "Utdanning", icon: BookOpen },
  { id: "sports", label: "Idrett", icon: Trophy },
  { id: "arts", label: "Kunst", icon: Palette },
  { id: "trades", label: "Yrkesfag", icon: Hammer },
];

const maths: MathsLevel[] = ["unknown", "1P", "1T", "2P", "S1", "S2", "R1", "R2"];

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
  const { lang } = useI18n();
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
        <Badge tone="teal">Steg {step + 1}/{total}</Badge>
        <h1 className="mt-2 font-display text-3xl font-extrabold text-navy-900">
          Din profil
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
              <GraduationCap className="h-5 w-5 text-teal" /> Hvor er du nå?
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {stages.map((s) => (
                <SelectCard
                  key={s.id}
                  selected={profile.stage === s.id}
                  onClick={() => updateProfile({ stage: s.id })}
                >
                  <span className="font-display text-lg font-bold">{s.label}</span>
                </SelectCard>
              ))}
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <h2 className="mb-4 font-display text-xl font-bold">Fylke & skole</h2>
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
                  Skole (valgfritt)
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
              Fremmedspråk på ungdomsskolen?
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
                    {v ? "Ja" : "Nei"}
                  </span>
                </SelectCard>
              ))}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="mb-4 font-display text-xl font-bold">Mattenivå</h2>
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
            <h2 className="mb-4 font-display text-xl font-bold">Interesser</h2>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {interests.map(({ id, label, icon: Icon }) => {
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
                    <span className="font-semibold">{label}</span>
                  </SelectCard>
                );
              })}
            </div>
          </>
        )}

        {step === 5 && (
          <>
            <h2 className="mb-4 font-display text-xl font-bold">
              Mål (flere OK)
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
              Selvtillit (valgfritt)
            </h2>
            <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {(
                [
                  ["low", "Usikker"],
                  ["medium", "OK"],
                  ["high", "Trygg"],
                  ["unsure", "Vet ikke"],
                ] as [ConfidenceLevel, string][]
              ).map(([id, label]) => (
                <SelectCard
                  key={id}
                  selected={profile.confidence === id}
                  onClick={() => updateProfile({ confidence: id })}
                  className="text-center"
                >
                  {label}
                </SelectCard>
              ))}
            </div>
            <h2 className="mb-3 font-display text-xl font-bold">Læringsstil</h2>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  ["theory", "Teori"],
                  ["practical", "Praksis"],
                  ["mixed", "Begge"],
                ] as [LearningPreference, string][]
              ).map(([id, label]) => (
                <SelectCard
                  key={id}
                  selected={profile.learningPreference === id}
                  onClick={() => updateProfile({ learningPreference: id })}
                  className="text-center"
                >
                  {label}
                </SelectCard>
              ))}
            </div>
          </>
        )}
      </Card>

      <div className="flex justify-between">
        <Button variant="ghost" onClick={back} disabled={step === 0}>
          <ChevronLeft className="h-4 w-4" /> Tilbake
        </Button>
        <Button variant="teal" onClick={next}>
          {step === total - 1 ? "Se planen" : "Neste"}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
