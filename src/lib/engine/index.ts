import type {
  AdmissionCode,
  Career,
  EligibilityResult,
  EligibilityStatus,
  GoalEligibility,
  PathwayYearPlan,
  Recommendation,
  RequirementNode,
  SchoolOffering,
  StudentProfile,
  Subject,
  SubjectChipKind,
  SubjectPrerequisite,
} from "@/lib/types";
import { subjectById } from "@/lib/data/seeds/subjects";

export interface EngineContext {
  subjects: Subject[];
  admissionCodes: AdmissionCode[];
  careers: Career[];
  prerequisites: SubjectPrerequisite[];
  offering?: SchoolOffering | null;
}

function subjectLabel(id: string): string {
  return subjectById[id]?.name.nb ?? id;
}

export function evaluateRequirementGroup(
  node: RequirementNode,
  owned: Set<string>,
  hasGsu: boolean,
  flags: Set<string> = new Set()
): boolean {
  switch (node.type) {
    case "all":
      return node.items.every((item) =>
        evaluateRequirementGroup(item, owned, hasGsu, flags)
      );
    case "any":
      return node.items.some((item) =>
        evaluateRequirementGroup(item, owned, hasGsu, flags)
      );
    case "subject":
      return owned.has(node.id);
    case "gsu":
      return hasGsu || owned.has("gsu");
    case "flag":
      return flags.has(node.id);
    default:
      return false;
  }
}

/** Collect leaf subject ids referenced in a requirement tree */
export function collectRequiredSubjects(node: RequirementNode): string[] {
  switch (node.type) {
    case "all":
    case "any":
      return node.items.flatMap(collectRequiredSubjects);
    case "subject":
      return [node.id];
    default:
      return [];
  }
}

export function describeMissing(
  node: RequirementNode,
  owned: Set<string>,
  hasGsu: boolean,
  flags: Set<string> = new Set()
): string[] {
  if (evaluateRequirementGroup(node, owned, hasGsu, flags)) return [];

  switch (node.type) {
    case "all":
      return node.items.flatMap((item) =>
        describeMissing(item, owned, hasGsu, flags)
      );
    case "any": {
      const options = node.items.map((item) => {
        if (item.type === "subject") return subjectLabel(item.id);
        if (item.type === "all") {
          return item.items
            .map((i) => (i.type === "subject" ? subjectLabel(i.id) : "?"))
            .join(" + ");
        }
        return "alternativ";
      });
      return [`Trenger ett av: ${options.join(" ELLER ")}`];
    }
    case "subject":
      return owned.has(node.id) ? [] : [`Mangler ${subjectLabel(node.id)}`];
    case "gsu":
      return hasGsu || owned.has("gsu")
        ? []
        : ["Mangler generell studiekompetanse"];
    case "flag":
      return flags.has(node.id)
        ? []
        : [node.label?.nb ?? `Mangler krav: ${node.id}`];
    default:
      return [];
  }
}

export function describeCompleted(
  node: RequirementNode,
  owned: Set<string>,
  hasGsu: boolean,
  flags: Set<string> = new Set()
): string[] {
  switch (node.type) {
    case "all":
      return node.items.flatMap((item) =>
        describeCompleted(item, owned, hasGsu, flags)
      );
    case "any": {
      const satisfied = node.items.find((item) =>
        evaluateRequirementGroup(item, owned, hasGsu, flags)
      );
      if (!satisfied) return [];
      return describeCompleted(satisfied, owned, hasGsu, flags);
    }
    case "subject":
      return owned.has(node.id) ? [`Har ${subjectLabel(node.id)}`] : [];
    case "gsu":
      return hasGsu || owned.has("gsu")
        ? ["Har generell studiekompetanse"]
        : [];
    case "flag":
      return flags.has(node.id)
        ? [node.label?.nb ?? node.id]
        : [];
    default:
      return [];
  }
}

export function validatePrerequisites(
  subjectIds: string[],
  prerequisites: SubjectPrerequisite[]
): string[] {
  const owned = new Set(subjectIds);
  const issues: string[] = [];

  for (const prereq of prerequisites) {
    if (!owned.has(prereq.subjectId)) continue;
    for (const req of prereq.requires) {
      if (!owned.has(req)) {
        issues.push(
          `${subjectLabel(prereq.subjectId)} krever ${subjectLabel(req)}`
        );
      }
    }
  }

  const tracks = new Set(
    subjectIds
      .map((id) => subjectById[id]?.mathsTrack)
      .filter((t): t is "S" | "R" => t === "S" || t === "R")
  );
  if (tracks.has("S") && tracks.has("R")) {
    issues.push(
      "Ugyldig blanding av S- og R-matematikk i samme plan"
    );
  }

  return issues;
}

function inferFlags(profile: StudentProfile): Set<string> {
  const flags = new Set<string>();
  if (profile.stage === "fagbrev" || profile.goalIds.includes("electrician")) {
    flags.add("vocational-elektro");
  }
  if (profile.goalIds.includes("carpenter")) {
    flags.add("vocational-bygg");
  }
  return flags;
}

function hasGeneralStudyCompetence(profile: StudentProfile): boolean {
  if (profile.completedSubjectIds.includes("gsu")) return true;
  if (profile.plannedSubjectIds.includes("gsu")) return true;
  // Studiespesialisering through vg3 is assumed to lead to GSU in demo plans
  if (
    ["vg3", "adult_private"].includes(profile.stage) &&
    profile.plannedSubjectIds.length > 0
  ) {
    return true;
  }
  // Grade 10 / early VGS planning GSU
  return profile.plannedSubjectIds.includes("gsu");
}

function allOwned(profile: StudentProfile): Set<string> {
  return new Set([
    ...profile.completedSubjectIds,
    ...profile.plannedSubjectIds,
  ]);
}

function statusForGoal(
  formalMet: boolean,
  missing: string[],
  invalid: string[],
  unavailableBlocking: boolean
): EligibilityStatus {
  if (unavailableBlocking) return "at_risk";
  if (invalid.length > 0) return "blocked";
  if (formalMet && missing.length === 0) return "complete";
  if (formalMet) return "possible";
  if (missing.length <= 2) return "at_risk";
  return "blocked";
}

export function evaluateEligibility(
  profile: StudentProfile,
  ctx: EngineContext
): EligibilityResult {
  const owned = allOwned(profile);
  const hasGsu = hasGeneralStudyCompetence(profile);
  const flags = inferFlags(profile);
  const invalidSequences = validatePrerequisites(
    [...owned],
    ctx.prerequisites
  );
  const available = new Set(ctx.offering?.availableSubjectIds ?? []);
  const hasOffering = !!ctx.offering;

  const goals: GoalEligibility[] = [];
  const explanations: string[] = [];
  const warnings: string[] = [];
  const subjectStatuses: Record<string, SubjectChipKind> = {};

  let completedCount = 0;
  let remainingCount = 0;
  let pathwaysOpen = 0;

  for (const careerId of profile.goalIds) {
    const career = ctx.careers.find((c) => c.id === careerId);
    if (!career) continue;
    const code = ctx.admissionCodes.find(
      (a) => a.id === career.admissionCodeIds[0]
    );
    if (!code) continue;

    const formalMet = evaluateRequirementGroup(
      code.requirements,
      owned,
      hasGsu,
      flags
    );
    const missing = describeMissing(code.requirements, owned, hasGsu, flags);
    const completed = describeCompleted(
      code.requirements,
      owned,
      hasGsu,
      flags
    );

    const requiredSubjects = collectRequiredSubjects(code.requirements);
    let unavailableBlocking = false;
    for (const sid of requiredSubjects) {
      if (profile.completedSubjectIds.includes(sid)) {
        subjectStatuses[sid] = "completed";
      } else if (hasOffering && available.size > 0 && !available.has(sid)) {
        subjectStatuses[sid] = "unavailable";
        if (!owned.has(sid)) unavailableBlocking = true;
      } else if (!owned.has(sid)) {
        subjectStatuses[sid] = "missing";
      } else {
        subjectStatuses[sid] = "required";
      }
    }
    for (const sid of career.recommendedSubjects ?? []) {
      if (!subjectStatuses[sid]) {
        subjectStatuses[sid] =
          owned.has(sid) || profile.completedSubjectIds.includes(sid)
            ? "completed"
            : "recommended";
      }
    }

    if (unavailableBlocking) {
      warnings.push("Mulig fagkombinasjon må bekreftes med skolen.");
    }

    const status = statusForGoal(
      formalMet,
      missing,
      invalidSequences,
      unavailableBlocking
    );

    if (status === "possible" || status === "complete" || status === "at_risk") {
      pathwaysOpen += 1;
    }

    completedCount += completed.length;
    remainingCount += missing.length;

    goals.push({
      careerId,
      status,
      completedRequirementLabels: completed,
      missingRequirementLabels: missing,
      formalRequirementsMet: formalMet,
    });

    explanations.push(
      formalMet
        ? `${career.name.nb}: Formelle fagkrav oppfylt`
        : `${career.name.nb}: Mangler ${missing.length} krav`
    );
    explanations.push(
      "Opptak avhenger av karakterer, konkurranse og gjeldende regler."
    );
  }

  if (invalidSequences.length) {
    warnings.push(...invalidSequences);
  }

  if (
    profile.goalIds.includes("doctor") &&
    profile.goalIds.includes("engineer")
  ) {
    explanations.push(
      "Anbefalt fellesløp: Vg1 1T · Vg2 R1 + Fysikk 1 + Kjemi 1 · Vg3 R2 + Kjemi 2"
    );
  }

  return {
    goals,
    invalidSequences,
    warnings: [...new Set(warnings)],
    completedCount,
    remainingCount,
    pathwaysOpen,
    explanations,
    subjectStatuses,
  };
}

const DOCTOR_ENGINEER_PLAN: PathwayYearPlan = {
  vg1: ["matte-1t"],
  vg2: ["matte-r1", "fysikk-1", "kjemi-1"],
  vg3: ["matte-r2", "kjemi-2"],
};

export function recommendMinimalPlan(
  profile: StudentProfile,
  ctx: EngineContext
): Recommendation {
  const ids = [...profile.goalIds].sort().join("+");

  if (
    profile.goalIds.includes("doctor") &&
    profile.goalIds.includes("engineer")
  ) {
    return {
      plan: DOCTOR_ENGINEER_PLAN,
      careerIds: ["doctor", "engineer"],
      demanding: true,
      rationale: [
        "Holder både medisin og ingeniør åpne.",
        "Vg1: 1T · Vg2: R1, Fysikk 1, Kjemi 1 · Vg3: R2, Kjemi 2",
        "Krevende løp — bekreft fagtilbud og timeplan med skolen.",
      ],
      confirmWithSchool: true,
    };
  }

  // Build union of required subjects for selected goals
  const needed = new Set<string>();
  for (const careerId of profile.goalIds) {
    const career = ctx.careers.find((c) => c.id === careerId);
    const code = ctx.admissionCodes.find(
      (a) => a.id === career?.admissionCodeIds[0]
    );
    if (!code) continue;
    for (const sid of collectRequiredSubjects(code.requirements)) {
      needed.add(sid);
    }
  }

  const plan: PathwayYearPlan = { vg1: [], vg2: [], vg3: [] };
  for (const sid of needed) {
    const subj = subjectById[sid];
    if (!subj) continue;
    if (subj.years.includes("vg1")) plan.vg1.push(sid);
    else if (subj.years.includes("vg2")) plan.vg2.push(sid);
    else plan.vg3.push(sid);
  }

  // Prefer R-track if engineering-like maths needed
  if (needed.has("matte-r2") || needed.has("matte-r1")) {
    if (!plan.vg1.includes("matte-1t")) plan.vg1.push("matte-1t");
  }

  const offering = ctx.offering;
  let confirmWithSchool = false;
  if (offering) {
    const all = [...plan.vg1, ...plan.vg2, ...plan.vg3];
    confirmWithSchool = all.some(
      (sid) => !offering.availableSubjectIds.includes(sid)
    );
  }

  return {
    plan,
    careerIds: profile.goalIds,
    demanding: needed.size >= 5,
    rationale: [
      `Minimal plan for: ${ids}`,
      confirmWithSchool
        ? "Noen fag mangler på valgt skole — bekreft med skolen."
        : "Sjekk timeplan hos skolen.",
    ],
    confirmWithSchool,
  };
}

export function explainSubjectWhy(
  subjectId: string,
  profile: StudentProfile,
  ctx: EngineContext
): string {
  const label = subjectLabel(subjectId);
  const reasons: string[] = [];

  for (const careerId of profile.goalIds) {
    const career = ctx.careers.find((c) => c.id === careerId);
    const code = ctx.admissionCodes.find(
      (a) => a.id === career?.admissionCodeIds[0]
    );
    if (!code || !career) continue;
    const required = collectRequiredSubjects(code.requirements);
    if (required.includes(subjectId)) {
      reasons.push(`Påkrevd for ${career.name.nb} (${code.code})`);
    } else if (career.recommendedSubjects?.includes(subjectId)) {
      reasons.push(`Anbefalt for ${career.name.nb}`);
    }
  }

  const prereq = ctx.prerequisites.find((p) => p.subjectId === subjectId);
  if (prereq) {
    reasons.push(
      `Krever: ${prereq.requires.map(subjectLabel).join(", ")}`
    );
  }
  const unlocks = ctx.prerequisites.filter((p) =>
    p.requires.includes(subjectId)
  );
  if (unlocks.length) {
    reasons.push(
      `Låser opp: ${unlocks.map((u) => subjectLabel(u.subjectId)).join(", ")}`
    );
  }

  if (!reasons.length) {
    return `${label} er del av planlagt løp.`;
  }
  return reasons.join(". ") + ".";
}
