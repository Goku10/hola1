"use client";

import Link from "next/link";
import { ArrowRight, Map, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge, Card } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";
import { DemoNotice } from "@/components/layout/SiteHeader";

export default function LandingPage() {
  const { t } = useI18n();

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-navy-900 via-navy-800 to-teal-dark px-6 py-14 text-white shadow-glow md:px-12 md:py-20">
        <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-sky-accent/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 left-10 h-48 w-48 rounded-full bg-teal/40 blur-3xl" />

        <Badge tone="sky" className="mb-4 bg-white/15 text-white">
          {t.demo}
        </Badge>
        <h1 className="max-w-2xl font-display text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
          {t.tagline}
        </h1>
        <p className="mt-4 max-w-xl text-base text-sky-100/90 md:text-lg">
          Velg mål. Se fagene. Hold flere dører åpne — fra 10. trinn til videre.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg" variant="teal">
            <Link href="/onboarding">
              {t.start} <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20">
            <Link href="/dashboard">Se demoplan</Link>
          </Button>
        </div>
      </section>

      <DemoNotice />

      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            icon: Map,
            title: "Visuell plan",
            text: "Vg1 → Vg2 → Vg3 med fargekoder",
          },
          {
            icon: Sparkles,
            title: "Flere mål",
            text: "Hold lege + ingeniør åpne samtidig",
          },
          {
            icon: ShieldCheck,
            title: "Ærlige statuser",
            text: "Fagkrav ≠ garantert opptak",
          },
        ].map(({ icon: Icon, title, text }) => (
          <Card key={title} className="animate-fade-up">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-soft text-teal-dark">
              <Icon className="h-6 w-6" />
            </div>
            <h2 className="font-display text-xl font-bold text-navy-900">
              {title}
            </h2>
            <p className="mt-1 text-sm text-slate-500">{text}</p>
          </Card>
        ))}
      </div>

      <Card className="border-amber-200 bg-amber-50/80 text-sm text-amber-950">
        <strong>Merk:</strong> {t.disclaimer}
      </Card>
    </div>
  );
}
