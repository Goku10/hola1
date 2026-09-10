import type {
  AdmissionCutoff,
  County,
  HigherEducationInstitution,
  Pathway,
  RuleVersion,
  School,
  SchoolOffering,
  SourceReference,
} from "@/lib/types";

export const counties: County[] = [
  { id: "oslo", name: "Oslo" },
  { id: "viken", name: "Akershus / Viken (demo)" },
  { id: "vestland", name: "Vestland" },
  { id: "trondelag", name: "Trøndelag" },
  { id: "rogaland", name: "Rogaland" },
];

export const schools: School[] = [
  {
    id: "nydalen-vgs",
    name: "Nydalen videregående (demo)",
    countyId: "oslo",
    url: "https://www.oslo.kommune.no/",
  },
  {
    id: "berg-vgs",
    name: "Berg videregående (demo)",
    countyId: "oslo",
    url: "https://www.oslo.kommune.no/",
  },
  {
    id: "trondheim-katedralskole",
    name: "Trondheim katedralskole (demo)",
    countyId: "trondelag",
    url: "https://www.trondelagfylke.no/",
  },
];

/** Demo school: missing some subjects to exercise unavailable chips */
export const schoolOfferings: SchoolOffering[] = [
  {
    schoolId: "nydalen-vgs",
    availableSubjectIds: [
      "matte-1p",
      "matte-1t",
      "matte-2p",
      "matte-r1",
      "matte-r2",
      "matte-s1",
      "matte-s2",
      "fysikk-1",
      "fysikk-2",
      "kjemi-1",
      "kjemi-2",
      "biologi-1",
      "biologi-2",
      "info-1",
      "info-2",
      "norsk",
      "engelsk",
      "fremmedsprak",
      "naturfag",
      "psykologi-1",
      "samfunnsok-1",
      "gsu",
    ],
    timetableConflictTags: ["realfag-heavy"],
  },
  {
    schoolId: "berg-vgs",
    availableSubjectIds: [
      "matte-1p",
      "matte-1t",
      "matte-2p",
      "matte-s1",
      "matte-s2",
      "matte-r1",
      // R2 intentionally missing at this demo school
      "fysikk-1",
      "kjemi-1",
      // Kjemi 2 intentionally missing
      "biologi-1",
      "norsk",
      "engelsk",
      "fremmedsprak",
      "naturfag",
      "rettslaere-1",
      "psykologi-1",
      "historie-spes",
      "gsu",
    ],
    timetableConflictTags: ["limited-realfag"],
  },
  {
    schoolId: "trondheim-katedralskole",
    availableSubjectIds: [
      "matte-1t",
      "matte-r1",
      "matte-r2",
      "matte-s1",
      "matte-s2",
      "fysikk-1",
      "fysikk-2",
      "kjemi-1",
      "kjemi-2",
      "biologi-1",
      "biologi-2",
      "info-1",
      "info-2",
      "norsk",
      "engelsk",
      "fremmedsprak",
      "naturfag",
      "gsu",
    ],
  },
];

export const institutions: HigherEducationInstitution[] = [
  { id: "uio", name: "Universitetet i Oslo", shortName: "UiO", city: "Oslo", type: "university", url: "https://www.uio.no/" },
  { id: "uib", name: "Universitetet i Bergen", shortName: "UiB", city: "Bergen", type: "university", url: "https://www.uib.no/" },
  { id: "ntnu", name: "NTNU", shortName: "NTNU", city: "Trondheim", type: "university", url: "https://www.ntnu.no/" },
  { id: "uit", name: "UiT Norges arktiske universitet", shortName: "UiT", city: "Tromsø", type: "university", url: "https://uit.no/" },
  { id: "nmbu", name: "NMBU", shortName: "NMBU", city: "Ås", type: "university", url: "https://www.nmbu.no/" },
  { id: "uis", name: "Universitetet i Stavanger", shortName: "UiS", city: "Stavanger", type: "university", url: "https://www.uis.no/" },
  { id: "uia", name: "Universitetet i Agder", shortName: "UiA", city: "Kristiansand", type: "university", url: "https://www.uia.no/" },
  { id: "oslomet", name: "OsloMet", shortName: "OsloMet", city: "Oslo", type: "university", url: "https://www.oslomet.no/" },
  { id: "nhh", name: "NHH", shortName: "NHH", city: "Bergen", type: "university", url: "https://www.nhh.no/" },
  { id: "bi", name: "BI Handelshøyskolen", shortName: "BI", city: "Oslo", type: "university_college", url: "https://www.bi.no/" },
  { id: "aho", name: "Arkitektur- og designhøgskolen", shortName: "AHO", city: "Oslo", type: "university_college", url: "https://aho.no/" },
  { id: "bas", name: "Bergen Arkitekthøgskole", shortName: "BAS", city: "Bergen", type: "university_college", url: "https://www.bas.org/" },
  { id: "phs", name: "Politihøgskolen", shortName: "PHS", city: "Oslo", type: "university_college", url: "https://www.politihogskolen.no/" },
];

/** Historical EXAMPLE cutoffs — not live official data */
export const cutoffs: AdmissionCutoff[] = [
  { id: "c1", institutionId: "uio", careerId: "doctor", year: 2024, quota: "ordinær", points: 68.5, isHistoricalExample: true, sourceId: "src-samordna" },
  { id: "c2", institutionId: "uib", careerId: "doctor", year: 2024, quota: "ordinær", points: 67.8, isHistoricalExample: true, sourceId: "src-samordna" },
  { id: "c3", institutionId: "ntnu", careerId: "doctor", year: 2024, quota: "ordinær", points: 67.2, isHistoricalExample: true, sourceId: "src-samordna" },
  { id: "c4", institutionId: "uit", careerId: "doctor", year: 2024, quota: "ordinær", points: 65.9, isHistoricalExample: true, sourceId: "src-samordna" },
  { id: "c5", institutionId: "ntnu", careerId: "engineer", year: 2024, quota: "ordinær", points: 58.4, isHistoricalExample: true, sourceId: "src-samordna" },
  { id: "c6", institutionId: "uio", careerId: "engineer", year: 2024, quota: "ordinær", points: 55.1, isHistoricalExample: true, sourceId: "src-samordna" },
  { id: "c7", institutionId: "nmbu", careerId: "engineer", year: 2024, quota: "ordinær", points: 52.0, isHistoricalExample: true, sourceId: "src-samordna" },
  { id: "c8", institutionId: "uio", careerId: "software", year: 2024, quota: "ordinær", points: 54.2, isHistoricalExample: true, sourceId: "src-samordna" },
  { id: "c9", institutionId: "ntnu", careerId: "software", year: 2024, quota: "ordinær", points: 56.0, isHistoricalExample: true, sourceId: "src-samordna" },
  { id: "c10", institutionId: "uio", careerId: "dentist", year: 2024, quota: "ordinær", points: 66.9, isHistoricalExample: true, sourceId: "src-samordna" },
  { id: "c11", institutionId: "nmbu", careerId: "vet", year: 2024, quota: "ordinær", points: 62.4, isHistoricalExample: true, sourceId: "src-samordna" },
  { id: "c12", institutionId: "uio", careerId: "psychologist", year: 2024, quota: "ordinær", points: 64.5, isHistoricalExample: true, sourceId: "src-samordna" },
  { id: "c13", institutionId: "uio", careerId: "lawyer", year: 2024, quota: "ordinær", points: 58.0, isHistoricalExample: true, sourceId: "src-samordna" },
  { id: "c14", institutionId: "oslomet", careerId: "teacher", year: 2024, quota: "ordinær", points: 42.5, isHistoricalExample: true, sourceId: "src-samordna" },
  { id: "c15", institutionId: "oslomet", careerId: "nurse", year: 2024, quota: "ordinær", points: 48.0, isHistoricalExample: true, sourceId: "src-samordna" },
  { id: "c16", institutionId: "nhh", careerId: "economist", year: 2024, quota: "ordinær", points: 57.3, isHistoricalExample: true, sourceId: "src-samordna" },
  { id: "c17", institutionId: "ntnu", careerId: "architect", year: 2024, quota: "ordinær", points: 60.1, isHistoricalExample: true, sourceId: "src-samordna" },
  { id: "c18", institutionId: "phs", careerId: "police", year: 2024, quota: "ordinær", points: null, isHistoricalExample: true, sourceId: "src-samordna", note: { nb: "Egne opptaksprøver", en: "Own admission tests" } },
];

export const sources: SourceReference[] = [
  { id: "src-udir", name: "Udir", category: "udir", url: "https://www.udir.no/", lastReviewed: "2025-08-01" },
  { id: "src-samordna", name: "Samordna opptak", category: "samordna", url: "https://www.samordnaopptak.no/", lastReviewed: "2025-08-01" },
  { id: "src-vilbli", name: "Vilbli.no", category: "vilbli", url: "https://www.vilbli.no/", lastReviewed: "2025-08-01" },
  { id: "src-utdanning", name: "Utdanning.no", category: "utdanning", url: "https://utdanning.no/", lastReviewed: "2025-08-01" },
];

export const ruleVersions: RuleVersion[] = [
  {
    id: "rv-2025-demo",
    label: "Demo-regelsett 2025",
    lastReviewed: "2025-08-01",
    sourceIds: ["src-samordna", "src-udir"],
    notes: "Eksempeldatasett — må verifiseres for aktuelt opptaksår.",
  },
];

export const pathways: Pathway[] = [
  {
    id: "path-doctor-engineer",
    name: {
      nb: "Lege + ingeniør (krevende)",
      en: "Doctor + engineer (demanding)",
    },
    careerIds: ["doctor", "engineer"],
    plan: {
      vg1: ["matte-1t", "norsk", "engelsk", "naturfag", "fremmedsprak"],
      vg2: ["matte-r1", "fysikk-1", "kjemi-1", "norsk"],
      vg3: ["matte-r2", "kjemi-2", "norsk", "gsu"],
    },
    demanding: true,
    notes: [
      {
        nb: "Krevende løp. Bekreft timeplan og fagtilbud med skolen.",
        en: "Demanding route. Confirm timetable and offerings with the school.",
      },
    ],
  },
  {
    id: "path-doctor",
    name: { nb: "Lege", en: "Doctor only" },
    careerIds: ["doctor"],
    plan: {
      vg1: ["matte-1t"],
      vg2: ["matte-r1", "fysikk-1", "kjemi-1"],
      vg3: ["kjemi-2", "matte-r2"],
    },
    demanding: true,
  },
  {
    id: "path-engineer",
    name: { nb: "Ingeniør", en: "Engineer only" },
    careerIds: ["engineer"],
    plan: {
      vg1: ["matte-1t"],
      vg2: ["matte-r1", "fysikk-1"],
      vg3: ["matte-r2"],
    },
  },
  {
    id: "path-psych-law",
    name: { nb: "Psykologi + juss", en: "Psychology + law" },
    careerIds: ["psychologist", "lawyer"],
    plan: {
      vg1: ["matte-1t", "norsk", "engelsk"],
      vg2: ["matte-s1", "psykologi-1", "rettslaere-1"],
      vg3: ["matte-s2", "historie-spes", "gsu"],
    },
  },
  {
    id: "path-software-data",
    name: { nb: "Programvare + data", en: "Software + data science path" },
    careerIds: ["software"],
    plan: {
      vg1: ["matte-1t", "info-1"],
      vg2: ["matte-r1", "info-1", "fysikk-1"],
      vg3: ["matte-r2", "info-2", "gsu"],
    },
  },
  {
    id: "path-elektro-he",
    name: {
      nb: "Elektriker med senere høyere utdanning",
      en: "Electrician with later HE options",
    },
    careerIds: ["electrician"],
    plan: {
      vg1: [],
      vg2: [],
      vg3: [],
    },
    notes: [
      {
        nb: "Fagbrev → påbygg / Y-vei / forkurs for høyere utdanning.",
        en: "Trade certificate → supplement / Y-path / preparatory course for HE.",
      },
    ],
  },
];
