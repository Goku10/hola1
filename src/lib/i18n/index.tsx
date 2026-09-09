"use client";

import React, { createContext, useContext, useMemo, useState } from "react";

export type Lang = "nb" | "en";

const messages = {
  nb: {
    brand: "Utdanningssti Norge",
    tagline: "Planlegg utdanningsveien din i Norge",
    start: "Start planlegging",
    disclaimer:
      "Dette er et veiledningsverktøy. Sjekk alltid gjeldende opptakskrav hos Samordna opptak, Udir og den aktuelle skolen.",
    demo: "Eksempeldatasett",
    verify: "Informasjon må verifiseres for aktuelt opptaksår",
    nav: {
      home: "Hjem",
      onboard: "Profil",
      careers: "Karrierer",
      dashboard: "Plan",
      compare: "Sammenlign",
      admin: "Admin",
    },
    historical: "Historisk eksempel",
    formalOk: "Formelle fagkrav oppfylt",
    admissionDepends: "Opptak avhenger av karakterer",
  },
  en: {
    brand: "Utdanningssti Norge",
    tagline: "Plan your education path in Norway",
    start: "Start planning",
    disclaimer:
      "This is a guidance tool. Always check current admission requirements with Samordna opptak, Udir and your school.",
    demo: "Example dataset",
    verify: "Information must be verified for the applicable admission year",
    nav: {
      home: "Home",
      onboard: "Profile",
      careers: "Careers",
      dashboard: "Plan",
      compare: "Compare",
      admin: "Admin",
    },
    historical: "Historical example",
    formalOk: "Formal subject requirements met",
    admissionDepends: "Admission depends on grades",
  },
} as const;

type Messages = {
  brand: string;
  tagline: string;
  start: string;
  disclaimer: string;
  demo: string;
  verify: string;
  nav: {
    home: string;
    onboard: string;
    careers: string;
    dashboard: string;
    compare: string;
    admin: string;
  };
  historical: string;
  formalOk: string;
  admissionDepends: string;
};

const I18nContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Messages;
} | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("nb");
  const value = useMemo(
    () => ({ lang, setLang, t: messages[lang] as Messages }),
    [lang]
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n outside provider");
  return ctx;
}

export function labelOf(
  labels: { nb: string; en: string },
  lang: Lang
): string {
  return labels[lang];
}
