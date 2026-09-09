import type { AdmissionCode, RequirementGroup } from "@/lib/types";

const mathsR1orS: RequirementGroup = {
  type: "any",
  items: [
    { type: "subject", id: "matte-r1" },
    {
      type: "all",
      items: [
        { type: "subject", id: "matte-s1" },
        { type: "subject", id: "matte-s2" },
      ],
    },
  ],
};

export const medicineRequirements: RequirementGroup = {
  type: "all",
  items: [
    { type: "gsu" },
    mathsR1orS,
    { type: "subject", id: "fysikk-1" },
    { type: "subject", id: "kjemi-1" },
    { type: "subject", id: "kjemi-2" },
  ],
};

export const engineeringRequirements: RequirementGroup = {
  type: "all",
  items: [
    { type: "gsu" },
    mathsR1orS,
    { type: "subject", id: "matte-r2" },
    { type: "subject", id: "fysikk-1" },
  ],
};

export const veterinaryRequirements: RequirementGroup = {
  type: "all",
  items: [
    { type: "gsu" },
    mathsR1orS,
    { type: "subject", id: "kjemi-1" },
    { type: "subject", id: "kjemi-2" },
  ],
};

export const realfaStyle: RequirementGroup = {
  type: "all",
  items: [
    { type: "gsu" },
    mathsR1orS,
    {
      type: "any",
      items: [
        { type: "subject", id: "matte-r2" },
        { type: "subject", id: "fysikk-1" },
        { type: "subject", id: "kjemi-1" },
        { type: "subject", id: "biologi-1" },
      ],
    },
  ],
};

export const nattekStyle: RequirementGroup = {
  type: "all",
  items: [
    { type: "gsu" },
    { type: "subject", id: "matte-r1" },
    { type: "subject", id: "matte-r2" },
    { type: "subject", id: "fysikk-1" },
  ],
};

export const mattekStyle: RequirementGroup = {
  type: "all",
  items: [
    { type: "gsu" },
    { type: "subject", id: "matte-r1" },
    { type: "subject", id: "matte-r2" },
  ],
};

const gsuOnly: RequirementGroup = {
  type: "all",
  items: [{ type: "gsu" }],
};

export const admissionCodes: AdmissionCode[] = [
  {
    id: "merod",
    code: "MEROD",
    name: { nb: "Medisin", en: "Medicine" },
    requirements: medicineRequirements,
    recommendedSubjects: ["biologi-1", "biologi-2", "matte-r2"],
    additionalRequirements: [
      {
        nb: "Opptak er svært konkurranseutsatt. Karakterer avgjør.",
        en: "Admission is highly competitive. Grades decide.",
      },
    ],
    ruleVersionId: "rv-2025-demo",
    sourceIds: ["src-samordna", "src-udir"],
  },
  {
    id: "hing",
    code: "HING",
    name: { nb: "Ingeniør / integrert master (typisk)", en: "Engineering / integrated master (typical)" },
    requirements: engineeringRequirements,
    recommendedSubjects: ["kjemi-1", "info-1"],
    ruleVersionId: "rv-2025-demo",
    sourceIds: ["src-samordna", "src-udir"],
  },
  {
    id: "vete",
    code: "VETE",
    name: { nb: "Veterinær", en: "Veterinary medicine" },
    requirements: veterinaryRequirements,
    recommendedSubjects: ["biologi-1", "biologi-2", "fysikk-1"],
    ruleVersionId: "rv-2025-demo",
    sourceIds: ["src-samordna"],
  },
  {
    id: "realfa",
    code: "REALFA",
    name: { nb: "Realfag (stil)", en: "Natural sciences (style)" },
    requirements: realfaStyle,
    ruleVersionId: "rv-2025-demo",
    sourceIds: ["src-samordna"],
  },
  {
    id: "nattek",
    code: "NATTEK",
    name: { nb: "Naturvitenskapelig / teknisk (stil)", en: "Science / tech (style)" },
    requirements: nattekStyle,
    ruleVersionId: "rv-2025-demo",
    sourceIds: ["src-samordna"],
  },
  {
    id: "mattek",
    code: "MATTEK",
    name: { nb: "Matematikk / teknologi (stil)", en: "Math / technology (style)" },
    requirements: mattekStyle,
    ruleVersionId: "rv-2025-demo",
    sourceIds: ["src-samordna"],
  },
  {
    id: "odont",
    code: "ODONT",
    name: { nb: "Odontologi", en: "Dentistry" },
    requirements: medicineRequirements,
    recommendedSubjects: ["biologi-1"],
    ruleVersionId: "rv-2025-demo",
    sourceIds: ["src-samordna"],
  },
  {
    id: "psyk",
    code: "PSYK",
    name: { nb: "Psykologi", en: "Psychology" },
    requirements: gsuOnly,
    recommendedSubjects: ["matte-s1", "matte-s2", "psykologi-1"],
    ruleVersionId: "rv-2025-demo",
    sourceIds: ["src-samordna"],
  },
  {
    id: "juss",
    code: "JUS",
    name: { nb: "Rettsvitenskap", en: "Law" },
    requirements: gsuOnly,
    recommendedSubjects: ["rettslaere-1", "historie-spes"],
    ruleVersionId: "rv-2025-demo",
    sourceIds: ["src-samordna"],
  },
  {
    id: "lærer",
    code: "GLU",
    name: { nb: "Grunnskolelærer", en: "Teacher education" },
    requirements: gsuOnly,
    recommendedSubjects: ["matte-1t"],
    additionalRequirements: [
      {
        nb: "Enkelte studier har egne karakterkrav i norsk/matte.",
        en: "Some programmes have grade requirements in Norwegian/maths.",
      },
    ],
    ruleVersionId: "rv-2025-demo",
    sourceIds: ["src-samordna"],
  },
  {
    id: "sykepleie",
    code: "SYK",
    name: { nb: "Sykepleie", en: "Nursing" },
    requirements: gsuOnly,
    recommendedSubjects: ["biologi-1", "kjemi-1"],
    ruleVersionId: "rv-2025-demo",
    sourceIds: ["src-samordna"],
  },
  {
    id: "okonomi",
    code: "SØK",
    name: { nb: "Økonomi / administrasjon", en: "Economics / business" },
    requirements: gsuOnly,
    recommendedSubjects: ["matte-s1", "matte-s2", "samfunnsok-1"],
    ruleVersionId: "rv-2025-demo",
    sourceIds: ["src-samordna"],
  },
  {
    id: "arkitekt",
    code: "ARK",
    name: { nb: "Arkitektur", en: "Architecture" },
    requirements: {
      type: "all",
      items: [{ type: "gsu" }, mathsR1orS],
    },
    recommendedSubjects: ["matte-r2", "fysikk-1"],
    additionalRequirements: [
      {
        nb: "Noen skoler krever opptaksprøve / portefølje.",
        en: "Some schools require an admissions test / portfolio.",
      },
    ],
    ruleVersionId: "rv-2025-demo",
    sourceIds: ["src-samordna"],
  },
  {
    id: "politihog",
    code: "PHS",
    name: { nb: "Politihøgskolen", en: "Police University College" },
    requirements: gsuOnly,
    additionalRequirements: [
      {
        nb: "Egne opptakskrav: helse, vandel, opptaksprøver.",
        en: "Own requirements: health, conduct, admission tests.",
      },
    ],
    ruleVersionId: "rv-2025-demo",
    sourceIds: ["src-samordna"],
  },
  {
    id: "data",
    code: "DATA",
    name: { nb: "Informatikk / data", en: "Computer science" },
    requirements: {
      type: "all",
      items: [{ type: "gsu" }, mathsR1orS],
    },
    recommendedSubjects: ["matte-r2", "info-1", "info-2", "fysikk-1"],
    ruleVersionId: "rv-2025-demo",
    sourceIds: ["src-samordna"],
  },
  {
    id: "elektro-yrke",
    code: "ELEKTRO",
    name: { nb: "Elektrofag (yrkesfag)", en: "Electrical trade" },
    requirements: {
      type: "all",
      items: [
        {
          type: "flag",
          id: "vocational-elektro",
          label: { nb: "Vg1 Elektro og datateknologi", en: "Vg1 Electrical and data technology" },
        },
      ],
    },
    ruleVersionId: "rv-2025-demo",
    sourceIds: ["src-udir", "src-vilbli"],
  },
  {
    id: "bygg-yrke",
    code: "BYGG",
    name: { nb: "Bygg- og anleggsteknikk", en: "Building and construction" },
    requirements: {
      type: "all",
      items: [
        {
          type: "flag",
          id: "vocational-bygg",
          label: { nb: "Vg1 Bygg- og anleggsteknikk", en: "Vg1 Building and construction" },
        },
      ],
    },
    ruleVersionId: "rv-2025-demo",
    sourceIds: ["src-udir", "src-vilbli"],
  },
];
