import type { StudentProfile, DataRepository } from "@/lib/types";
import { careers, degreeProgrammes } from "./seeds/careers";
import { admissionCodes } from "./seeds/admissionCodes";
import { subjects } from "./seeds/subjects";
import { prerequisites } from "./seeds/prerequisites";
import {
  counties,
  schools,
  schoolOfferings,
  institutions,
  cutoffs,
  sources,
  ruleVersions,
  pathways,
} from "./seeds/meta";

export const SAMPLE_SCENARIOS: Record<string, StudentProfile> = {
  "doctor-engineer-g10": {
    id: "sc-doctor-engineer",
    name: "Demo elev",
    stage: "grade10",
    countyId: "oslo",
    schoolId: "nydalen-vgs",
    foreignLanguageLowerSecondary: true,
    mathsLevel: "unknown",
    interests: ["health", "engineering", "science"],
    goalIds: ["doctor", "engineer"],
    confidence: "medium",
    learningPreference: "mixed",
    completedSubjectIds: [],
    plannedSubjectIds: [
      "matte-1t",
      "matte-r1",
      "matte-r2",
      "fysikk-1",
      "kjemi-1",
      "kjemi-2",
      "norsk",
      "engelsk",
      "naturfag",
      "fremmedsprak",
      "gsu",
    ],
    scenarioId: "doctor-engineer-g10",
  },
  "psych-law-vg2": {
    id: "sc-psych-law",
    name: "Demo elev Vg2",
    stage: "vg2",
    countyId: "oslo",
    schoolId: "berg-vgs",
    foreignLanguageLowerSecondary: true,
    mathsLevel: "S1",
    interests: ["health", "law"],
    goalIds: ["psychologist", "lawyer"],
    confidence: "high",
    learningPreference: "theory",
    completedSubjectIds: ["matte-1t", "norsk", "engelsk", "naturfag", "fremmedsprak", "matte-s1"],
    plannedSubjectIds: ["matte-s2", "psykologi-1", "rettslaere-1", "gsu"],
    scenarioId: "psych-law-vg2",
  },
  "software-vg1": {
    id: "sc-software",
    name: "Demo elev Vg1",
    stage: "vg1",
    countyId: "trondelag",
    schoolId: "trondheim-katedralskole",
    foreignLanguageLowerSecondary: true,
    mathsLevel: "1T",
    interests: ["it", "science"],
    goalIds: ["software"],
    confidence: "medium",
    learningPreference: "practical",
    completedSubjectIds: ["matte-1t", "norsk", "engelsk"],
    plannedSubjectIds: ["matte-r1", "matte-r2", "info-1", "info-2", "fysikk-1", "gsu"],
    scenarioId: "software-vg1",
  },
  "electrician-he": {
    id: "sc-elektro",
    name: "Demo yrkesfag",
    stage: "fagbrev",
    countyId: "oslo",
    foreignLanguageLowerSecondary: false,
    mathsLevel: "1P",
    interests: ["trades", "engineering"],
    goalIds: ["electrician"],
    confidence: "medium",
    learningPreference: "practical",
    completedSubjectIds: [],
    plannedSubjectIds: [],
    scenarioId: "electrician-he",
  },
};

export const DEFAULT_PROFILE = SAMPLE_SCENARIOS["doctor-engineer-g10"];

export class LocalJsonRepository implements DataRepository {
  async getCareers() {
    return careers;
  }
  async getDegreeProgrammes() {
    return degreeProgrammes;
  }
  async getSubjects() {
    return subjects;
  }
  async getAdmissionCodes() {
    return admissionCodes;
  }
  async getSchoolOfferings(schoolId: string) {
    return schoolOfferings.find((o) => o.schoolId === schoolId) ?? null;
  }
  async getSchools() {
    return schools;
  }
  async getCounties() {
    return counties;
  }
  async getInstitutions() {
    return institutions;
  }
  async getCutoffs(filters?: { careerId?: string; year?: number }) {
    return cutoffs.filter((c) => {
      if (filters?.careerId && c.careerId !== filters.careerId) return false;
      if (filters?.year && c.year !== filters.year) return false;
      return true;
    });
  }
  async getSources() {
    return sources;
  }
  async getRuleVersions() {
    return ruleVersions;
  }
  async getPathways() {
    return pathways;
  }
  async getPrerequisites() {
    return prerequisites;
  }
}

export const repository = new LocalJsonRepository();

export {
  careers,
  degreeProgrammes,
  subjects,
  admissionCodes,
  prerequisites,
  counties,
  schools,
  schoolOfferings,
  institutions,
  cutoffs,
  sources,
  ruleVersions,
  pathways,
};
