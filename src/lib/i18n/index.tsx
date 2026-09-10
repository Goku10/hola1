"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type Lang = "nb" | "en";

const LANG_KEY = "utdanningssti-lang";

export type Messages = {
  brand: string;
  tagline: string;
  taglineSub: string;
  start: string;
  seeDemo: string;
  note: string;
  disclaimer: string;
  demo: string;
  verify: string;
  language: string;
  norwegian: string;
  english: string;
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
  landing: {
    visualPlan: string;
    visualPlanText: string;
    multiGoals: string;
    multiGoalsText: string;
    honestStatus: string;
    honestStatusText: string;
  };
  chips: {
    mandatory: string;
    required: string;
    recommended: string;
    completed: string;
    missing: string;
    unavailable: string;
  };
  statusShort: {
    complete: string;
    possible: string;
    at_risk: string;
    blocked: string;
  };
  dashboard: {
    title: string;
    demanding: string;
    confirmSchool: string;
    planReady: string;
    loadDoctorEngineer: string;
    editProfile: string;
    goalsSelected: string;
    requirementsMet: string;
    remaining: string;
    pathwaysOpen: string;
    status: string;
    threeYear: string;
    step: string;
    institutions: string;
    noCutoff: string;
    historicalPoints: string;
    warnings: string;
    noWarnings: string;
    altRoutes: string;
    sources: string;
    example: string;
    whySubject: string;
    close: string;
    privatist: string;
    forkurs: string;
    yvei: string;
    supplement: string;
  };
  onboarding: {
    title: string;
    step: string;
    back: string;
    next: string;
    seePlan: string;
    whereNow: string;
    countySchool: string;
    schoolOptional: string;
    foreignLang: string;
    yes: string;
    no: string;
    maths: string;
    interests: string;
    goals: string;
    confidence: string;
    learning: string;
    stages: Record<string, string>;
    interestLabels: Record<string, string>;
    confidenceLabels: Record<string, string>;
    learningLabels: Record<string, string>;
  };
  careers: {
    title: string;
    subtitle: string;
    search: string;
    all: string;
    add: string;
    selected: string;
    more: string;
    less: string;
    historicalPoints: string;
    noPoints: string;
    vocationalOther: string;
    fields: Record<string, string>;
    band: Record<string, string>;
  };
  compare: {
    title: string;
    subtitle: string;
    shared: string;
    scenario: string;
    doctorOnly: string;
    engineerOnly: string;
    both: string;
    confirmSchool: string;
    gsu: string;
    competition: string;
    required: string;
    recommended: string;
    points: string;
  };
  admin: {
    demoBadge: string;
    title: string;
    subtitle: string;
    locked: string;
    edit: string;
    tabs: Record<string, string>;
  };
};

const nb: Messages = {
  brand: "Utdanningssti Norge",
  tagline: "Planlegg utdanningsveien din i Norge",
  taglineSub:
    "Velg mål. Se fagene. Hold flere dører åpne — fra 10. trinn til videre.",
  start: "Start planlegging",
  seeDemo: "Se demoplan",
  note: "Merk",
  disclaimer:
    "Dette er et veiledningsverktøy. Sjekk alltid gjeldende opptakskrav hos Samordna opptak, Udir og den aktuelle skolen.",
  demo: "Eksempeldatasett",
  verify: "Informasjon må verifiseres for aktuelt opptaksår",
  language: "Språk",
  norwegian: "Norsk",
  english: "English",
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
  landing: {
    visualPlan: "Visuell plan",
    visualPlanText: "Vg1 → Vg2 → Vg3 med fargekoder",
    multiGoals: "Flere mål",
    multiGoalsText: "Hold lege + ingeniør åpne samtidig",
    honestStatus: "Ærlige statuser",
    honestStatusText: "Fagkrav ≠ garantert opptak",
  },
  chips: {
    mandatory: "Fellesfag",
    required: "Krav",
    recommended: "Anbefalt",
    completed: "Ferdig",
    missing: "Mangler",
    unavailable: "Ikke tilbudt",
  },
  statusShort: {
    complete: "OK",
    possible: "Åpen",
    at_risk: "Sjekk",
    blocked: "Stopp",
  },
  dashboard: {
    title: "Din plan",
    demanding: "Krevende løp",
    confirmSchool: "Bekreft fag med skolen",
    planReady: "Plan klar for gjennomgang",
    loadDoctorEngineer: "Last: Lege+Ingeniør",
    editProfile: "Endre profil",
    goalsSelected: "Mål valgt",
    requirementsMet: "Krav dekket",
    remaining: "Gjenstår",
    pathwaysOpen: "Veier åpne",
    status: "Status",
    threeYear: "Treårsvei",
    step: "STEG",
    institutions: "Studiesteder & poeng",
    noCutoff: "Ingen poenggrense (f.eks. yrkesfag)",
    historicalPoints: "Historiske poeng (eksempel)",
    warnings: "Advarsler",
    noWarnings: "Ingen kritiske advarsler",
    altRoutes: "Alternative veier",
    sources: "Offisielle kilder",
    example: "Eksempel",
    whySubject: "Hvorfor dette faget?",
    close: "Lukk",
    privatist: "Privatist",
    forkurs: "Forkurs",
    yvei: "Y-veien",
    supplement: "Påbygg",
  },
  onboarding: {
    title: "Din profil",
    step: "Steg",
    back: "Tilbake",
    next: "Neste",
    seePlan: "Se planen",
    whereNow: "Hvor er du nå?",
    countySchool: "Fylke & skole",
    schoolOptional: "Skole (valgfritt)",
    foreignLang: "Fremmedspråk på ungdomsskolen?",
    yes: "Ja",
    no: "Nei",
    maths: "Mattenivå",
    interests: "Interesser",
    goals: "Mål (flere OK)",
    confidence: "Selvtillit (valgfritt)",
    learning: "Læringsstil",
    stages: {
      grade10: "10. trinn",
      vg1: "Vg1",
      vg2: "Vg2",
      vg3: "Vg3",
      fagbrev: "Fagbrev",
      adult_private: "Voksen / privatist",
    },
    interestLabels: {
      health: "Helse",
      science: "Realfag",
      engineering: "Ingeniør",
      it: "IT",
      business: "Økonomi",
      law: "Juss",
      education: "Utdanning",
      sports: "Idrett",
      arts: "Kunst",
      trades: "Yrkesfag",
    },
    confidenceLabels: {
      low: "Usikker",
      medium: "OK",
      high: "Trygg",
      unsure: "Vet ikke",
    },
    learningLabels: {
      theory: "Teori",
      practical: "Praksis",
      mixed: "Begge",
    },
  },
  careers: {
    title: "Utforsk karrierer",
    subtitle: "Krav varierer per sted og opptaksår.",
    search: "Søk…",
    all: "Alle",
    add: "Legg til",
    selected: "Valgt",
    more: "Mer",
    less: "Skjul",
    historicalPoints: "Historiske poeng",
    noPoints: "Ingen poengdata",
    vocationalOther: "Yrkesfag / annet",
    fields: {
      all: "Alle",
      health: "Helse",
      engineering: "Ingeniør",
      it: "IT",
      law: "Juss",
      education: "Utdanning",
      business: "Økonomi",
      trades: "Yrkesfag",
      arts: "Kunst",
      science: "Realfag",
      sports: "Idrett",
    },
    band: {
      low: "Lav",
      medium: "Middels",
      high: "Høy",
      very_high: "Svært høy",
      na: "N/A",
    },
  },
  compare: {
    title: "Sammenlign",
    subtitle: "Opp til 3 karrierer",
    shared: "Felles krav — bevarer flest muligheter",
    scenario: "Scenario",
    doctorOnly: "Kun lege",
    engineerOnly: "Kun ingeniør",
    both: "Lege + ingeniør",
    confirmSchool:
      "Timeplan og fagtilbud må bekreftes med valgt skole. Historisk eksempel — ikke garanti.",
    gsu: "GSU",
    competition: "Konkurranse",
    required: "Krav-fag",
    recommended: "Anbefalt",
    points: "Poeng (eks.)",
  },
  admin: {
    demoBadge: "Demo — ingen ekte innlogging",
    title: "Datastyring",
    subtitle: "Klar for senere Supabase-integrasjon",
    locked: "Låst (MVP)",
    edit: "Rediger",
    tabs: {
      careers: "Karrierer",
      codes: "Opptakskoder",
      subjects: "Fag",
      prereqs: "Forkrav",
      schools: "Skoler",
      institutions: "Studiesteder",
      cutoffs: "Poeng",
      sources: "Kilder",
      versions: "Versjoner",
    },
  },
};

const en: Messages = {
  brand: "Utdanningssti Norge",
  tagline: "Plan your education path in Norway",
  taglineSub:
    "Pick goals. See subjects. Keep more doors open — from grade 10 onward.",
  start: "Start planning",
  seeDemo: "See demo plan",
  note: "Note",
  disclaimer:
    "This is a guidance tool. Always check current admission requirements with Samordna opptak, Udir and your school.",
  demo: "Example dataset",
  verify: "Information must be verified for the applicable admission year",
  language: "Language",
  norwegian: "Norsk",
  english: "English",
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
  landing: {
    visualPlan: "Visual plan",
    visualPlanText: "Vg1 → Vg2 → Vg3 with colour codes",
    multiGoals: "Multiple goals",
    multiGoalsText: "Keep doctor + engineer open at once",
    honestStatus: "Honest statuses",
    honestStatusText: "Subject requirements ≠ guaranteed admission",
  },
  chips: {
    mandatory: "Common",
    required: "Required",
    recommended: "Recommended",
    completed: "Done",
    missing: "Missing",
    unavailable: "Not offered",
  },
  statusShort: {
    complete: "OK",
    possible: "Open",
    at_risk: "Check",
    blocked: "Blocked",
  },
  dashboard: {
    title: "Your plan",
    demanding: "Demanding route",
    confirmSchool: "Confirm subjects with the school",
    planReady: "Plan ready to review",
    loadDoctorEngineer: "Load: Doctor+Engineer",
    editProfile: "Edit profile",
    goalsSelected: "Goals selected",
    requirementsMet: "Requirements met",
    remaining: "Remaining",
    pathwaysOpen: "Pathways open",
    status: "Status",
    threeYear: "Three-year path",
    step: "STEP",
    institutions: "Institutions & points",
    noCutoff: "No point cutoff (e.g. vocational)",
    historicalPoints: "Historical points (example)",
    warnings: "Warnings",
    noWarnings: "No critical warnings",
    altRoutes: "Alternative routes",
    sources: "Official sources",
    example: "Example",
    whySubject: "Why this subject?",
    close: "Close",
    privatist: "Private candidate",
    forkurs: "Preparatory course",
    yvei: "Y-path",
    supplement: "Supplementary year",
  },
  onboarding: {
    title: "Your profile",
    step: "Step",
    back: "Back",
    next: "Next",
    seePlan: "See plan",
    whereNow: "Where are you now?",
    countySchool: "County & school",
    schoolOptional: "School (optional)",
    foreignLang: "Foreign language in lower secondary?",
    yes: "Yes",
    no: "No",
    maths: "Maths level",
    interests: "Interests",
    goals: "Goals (multi-select OK)",
    confidence: "Confidence (optional)",
    learning: "Learning style",
    stages: {
      grade10: "Grade 10",
      vg1: "Vg1",
      vg2: "Vg2",
      vg3: "Vg3",
      fagbrev: "Trade certificate",
      adult_private: "Adult / private candidate",
    },
    interestLabels: {
      health: "Health",
      science: "Science",
      engineering: "Engineering",
      it: "IT",
      business: "Business",
      law: "Law",
      education: "Education",
      sports: "Sports",
      arts: "Arts",
      trades: "Trades",
    },
    confidenceLabels: {
      low: "Unsure",
      medium: "OK",
      high: "Confident",
      unsure: "Don't know",
    },
    learningLabels: {
      theory: "Theory",
      practical: "Practical",
      mixed: "Both",
    },
  },
  careers: {
    title: "Explore careers",
    subtitle: "Requirements vary by institution and admission year.",
    search: "Search…",
    all: "All",
    add: "Add",
    selected: "Selected",
    more: "More",
    less: "Hide",
    historicalPoints: "Historical points",
    noPoints: "No points data",
    vocationalOther: "Vocational / other",
    fields: {
      all: "All",
      health: "Health",
      engineering: "Engineering",
      it: "IT",
      law: "Law",
      education: "Education",
      business: "Business",
      trades: "Trades",
      arts: "Arts",
      science: "Science",
      sports: "Sports",
    },
    band: {
      low: "Low",
      medium: "Medium",
      high: "High",
      very_high: "Very high",
      na: "N/A",
    },
  },
  compare: {
    title: "Compare",
    subtitle: "Up to 3 careers",
    shared: "Shared requirements — keeps the most options open",
    scenario: "Scenario",
    doctorOnly: "Doctor only",
    engineerOnly: "Engineer only",
    both: "Doctor + engineer",
    confirmSchool:
      "Timetable and subject offerings must be confirmed with the school. Historical example — not a guarantee.",
    gsu: "GSU",
    competition: "Competition",
    required: "Required subjects",
    recommended: "Recommended",
    points: "Points (ex.)",
  },
  admin: {
    demoBadge: "Demo — no real login",
    title: "Data management",
    subtitle: "Ready for later Supabase integration",
    locked: "Locked (MVP)",
    edit: "Edit",
    tabs: {
      careers: "Careers",
      codes: "Admission codes",
      subjects: "Subjects",
      prereqs: "Prerequisites",
      schools: "Schools",
      institutions: "Institutions",
      cutoffs: "Points",
      sources: "Sources",
      versions: "Versions",
    },
  },
};

const messages: Record<Lang, Messages> = { nb, en };

const I18nContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Messages;
} | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("nb");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LANG_KEY) as Lang | null;
      if (stored === "nb" || stored === "en") setLangState(stored);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.lang = lang === "nb" ? "nb" : "en";
  }, [lang, ready]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(LANG_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(
    () => ({ lang, setLang, t: messages[lang] }),
    [lang, setLang]
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
