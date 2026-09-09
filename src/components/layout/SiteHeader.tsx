"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  GitCompareArrows,
  Home,
  LayoutDashboard,
  Settings2,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/card";

const links = [
  { href: "/", key: "home", icon: Home },
  { href: "/onboarding", key: "onboard", icon: UserRound },
  { href: "/karrierer", key: "careers", icon: Compass },
  { href: "/dashboard", key: "dashboard", icon: LayoutDashboard },
  { href: "/sammenlign", key: "compare", icon: GitCompareArrows },
  { href: "/admin", key: "admin", icon: Settings2 },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const { t, lang, setLang } = useI18n();

  return (
    <header className="sticky top-0 z-40 border-b border-white/50 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-teal to-sky-accent text-white shadow-glow">
            <Sparkles className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-extrabold tracking-tight text-navy-900">
            {t.brand}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map(({ href, key, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold transition",
                pathname === href
                  ? "bg-navy-900 text-white"
                  : "text-navy-700/80 hover:bg-sky-soft"
              )}
            >
              <Icon className="h-4 w-4" />
              {t.nav[key]}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Badge tone="sky">{t.demo}</Badge>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setLang(lang === "nb" ? "en" : "nb")}
            aria-label="Toggle language"
          >
            {lang === "nb" ? "EN" : "NB"}
          </Button>
        </div>
      </div>

      <div className="border-t border-amber-200/60 bg-amber-50/90 px-4 py-1.5 text-center text-xs font-medium text-amber-900">
        {t.disclaimer}
      </div>

      <nav className="flex gap-1 overflow-x-auto px-2 py-2 md:hidden">
        {links.map(({ href, key, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "inline-flex shrink-0 items-center gap-1 rounded-xl px-3 py-2 text-xs font-semibold",
              pathname === href
                ? "bg-navy-900 text-white"
                : "bg-white text-navy-700"
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {t.nav[key]}
          </Link>
        ))}
      </nav>
    </header>
  );
}

export function DemoNotice() {
  const { t } = useI18n();
  return (
    <p className="text-center text-xs text-slate-500">
      <span className="font-semibold text-teal-dark">{t.demo}</span>
      {" · "}
      {t.verify}
    </p>
  );
}
