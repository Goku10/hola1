import { describe, expect, it } from "vitest";
import {
  evaluateRequirementGroup,
  validatePrerequisites,
  evaluateEligibility,
  recommendMinimalPlan,
  describeMissing,
} from "@/lib/engine";
import {
  medicineRequirements,
  engineeringRequirements,
} from "@/lib/data/seeds/admissionCodes";
import { prerequisites } from "@/lib/data/seeds/prerequisites";
import { careers } from "@/lib/data/seeds/careers";
import { admissionCodes } from "@/lib/data/seeds/admissionCodes";
import { subjects } from "@/lib/data/seeds/subjects";
import { schoolOfferings } from "@/lib/data/seeds/meta";
import { SAMPLE_SCENARIOS } from "@/lib/data";
import type { StudentProfile } from "@/lib/types";

const ctx = {
  subjects,
  admissionCodes,
  careers,
  prerequisites,
  offering: schoolOfferings[0],
};

describe("evaluateRequirementGroup AND/OR", () => {
  it("passes medicine with R1 path", () => {
    const owned = new Set([
      "matte-r1",
      "fysikk-1",
      "kjemi-1",
      "kjemi-2",
      "gsu",
    ]);
    expect(evaluateRequirementGroup(medicineRequirements, owned, true)).toBe(
      true
    );
  });

  it("passes medicine with S1+S2 path", () => {
    const owned = new Set([
      "matte-s1",
      "matte-s2",
      "fysikk-1",
      "kjemi-1",
      "kjemi-2",
    ]);
    expect(evaluateRequirementGroup(medicineRequirements, owned, true)).toBe(
      true
    );
  });

  it("fails medicine without chemistry 2", () => {
    const owned = new Set(["matte-r1", "fysikk-1", "kjemi-1"]);
    expect(evaluateRequirementGroup(medicineRequirements, owned, true)).toBe(
      false
    );
    const missing = describeMissing(medicineRequirements, owned, true);
    expect(missing.some((m) => m.includes("Kjemi 2"))).toBe(true);
  });

  it("passes engineering with R1+R2+Physics", () => {
    const owned = new Set(["matte-r1", "matte-r2", "fysikk-1"]);
    expect(
      evaluateRequirementGroup(engineeringRequirements, owned, true)
    ).toBe(true);
  });

  it("fails engineering without R2", () => {
    const owned = new Set(["matte-r1", "fysikk-1"]);
    expect(
      evaluateRequirementGroup(engineeringRequirements, owned, true)
    ).toBe(false);
  });
});

describe("prerequisites and S/R mixing", () => {
  it("flags R2 without R1", () => {
    const issues = validatePrerequisites(["matte-r2"], prerequisites);
    expect(issues.some((i) => i.includes("R1"))).toBe(true);
  });

  it("flags Kjemi 2 without Kjemi 1", () => {
    const issues = validatePrerequisites(["kjemi-2"], prerequisites);
    expect(issues.some((i) => i.includes("Kjemi 1"))).toBe(true);
  });

  it("rejects mixing S and R", () => {
    const issues = validatePrerequisites(
      ["matte-s1", "matte-r1"],
      prerequisites
    );
    expect(issues.some((i) => i.includes("S- og R"))).toBe(true);
  });

  it("allows pure R track", () => {
    const issues = validatePrerequisites(
      ["matte-1t", "matte-r1", "matte-r2"],
      prerequisites
    );
    expect(issues.filter((i) => i.includes("S- og R"))).toHaveLength(0);
  });
});

describe("eligibility & doctor+engineer recommendation", () => {
  it("evaluates doctor+engineer grade10 scenario", () => {
    const profile = SAMPLE_SCENARIOS["doctor-engineer-g10"];
    const result = evaluateEligibility(profile, ctx);
    expect(result.goals).toHaveLength(2);
    expect(result.pathwaysOpen).toBeGreaterThan(0);
    expect(
      result.explanations.some((e) => e.includes("Opptak avhenger"))
    ).toBe(true);
  });

  it("recommends combined doctor+engineer plan", () => {
    const profile = SAMPLE_SCENARIOS["doctor-engineer-g10"];
    const rec = recommendMinimalPlan(profile, ctx);
    expect(rec.plan.vg1).toContain("matte-1t");
    expect(rec.plan.vg2).toEqual(
      expect.arrayContaining(["matte-r1", "fysikk-1", "kjemi-1"])
    );
    expect(rec.plan.vg3).toEqual(
      expect.arrayContaining(["matte-r2", "kjemi-2"])
    );
    expect(rec.demanding).toBe(true);
    expect(rec.confirmWithSchool).toBe(true);
  });

  it("warns when school lacks required subjects", () => {
    const profile: StudentProfile = {
      ...SAMPLE_SCENARIOS["doctor-engineer-g10"],
      schoolId: "berg-vgs",
      plannedSubjectIds: ["matte-1t", "matte-r1", "fysikk-1", "kjemi-1"],
    };
    const result = evaluateEligibility(profile, {
      ...ctx,
      offering: schoolOfferings.find((o) => o.schoolId === "berg-vgs")!,
    });
    expect(
      result.warnings.some((w) => w.includes("bekreftes med skolen"))
    ).toBe(true);
  });
});
