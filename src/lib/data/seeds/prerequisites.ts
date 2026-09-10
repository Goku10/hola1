import type { SubjectPrerequisite } from "@/lib/types";

export const prerequisites: SubjectPrerequisite[] = [
  {
    subjectId: "matte-r2",
    requires: ["matte-r1"],
    note: {
      nb: "R2 krever R1. Bland ikke S- og R-løp.",
      en: "R2 requires R1. Do not mix S and R tracks.",
    },
  },
  {
    subjectId: "matte-s2",
    requires: ["matte-s1"],
    note: {
      nb: "S2 krever S1. Bland ikke S- og R-løp.",
      en: "S2 requires S1. Do not mix S and R tracks.",
    },
  },
  {
    subjectId: "matte-r1",
    requires: ["matte-1t"],
    note: {
      nb: "R1 bygger vanligvis på 1T.",
      en: "R1 typically builds on 1T.",
    },
  },
  {
    subjectId: "matte-s1",
    requires: ["matte-1t"],
    note: {
      nb: "S1 bygger vanligvis på 1T (eller tilsvarende).",
      en: "S1 typically builds on 1T (or equivalent).",
    },
  },
  {
    subjectId: "kjemi-2",
    requires: ["kjemi-1"],
  },
  {
    subjectId: "fysikk-2",
    requires: ["fysikk-1"],
  },
  {
    subjectId: "biologi-2",
    requires: ["biologi-1"],
  },
  {
    subjectId: "info-2",
    requires: ["info-1"],
  },
];
