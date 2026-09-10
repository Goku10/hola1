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
import { Badge } from "@/components/ui/card";

const links = [
  { href: "/", key: "home" as const, icon: Home },
  { href: "/onboarding", key: "onboard" as const, icon: UserRound },
  { href: "/karrierer", key: "careers" as const, icon: Compass },
  { href: "/dashboard", key: "dashboard" as const, icon: LayoutDashboard },
  { href: "/sammenlign", key: "compare" as const, icon: GitCompareArrows },
  { href: "/admin", key: "admin" as const, icon: Settings2 },
];

export function LanguageToggle() {
  const { lang, setLang, t } = useI18n();
  return (
    <div
      className="inline-flex items-center rounded-full border border-navy-800/15 bg-white p-0.5 shadow-sm"
      role="group"
      aria-label={t.language}
    >
      <button
        type="button"
        onClick={() => setLang("nb")}
        className={cn(
          "rounded-full px-3 py-1.5 text-xs font-bold transition",
          lang === "nb"
            ? "bg-navy-900 text-white"
            : "text-navy-700 hover:bg-sky-soft"
        )}
        aria-pressed={lang === "nb"}
      >
        NO
      </button>
      <button
        type="button"
        onClick={() => setLang("en")}
        className={cn(
          "rounded-full px-3 py-1.5 text-xs font-bold transition",
          lang === "en"
            ? "bg-navy-900 text-white"
            : "text-navy-700 hover:bg-sky-soft"
        )}
        aria-pressed={lang === "en"}
      >
        EN
      </button>
    </div>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const { t } = useI18n();

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
          <Badge tone="sky" className="hidden sm:inline-flex">
            {t.demo}
          </Badge>
          <LanguageToggle />
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
