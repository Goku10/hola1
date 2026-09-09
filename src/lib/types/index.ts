/** Domain types for Utdanningssti Norge — designed for local seeds now, Supabase later. */

export type LocaleLabel = { nb: string; en: string };

export type StudentStage =
  | "grade10"
  | "vg1"
  | "vg2"
  | "vg3"
  | "fagbrev"
  | "adult_private";

export type InterestId =
  | "health"
  | "science"
  | "engineering"
  | "it"
  | "business"
  | "law"
  | "education"
  | "sports"
  | "arts"
  | "trades";

export type LearningPreference = "theory" | "practical" | "mixed";
export type ConfidenceLevel = "low" | "medium" | "high" | "unsure";
export type MathsLevel =
  | "unknown"
  | "1P"
  | "1T"
  | "2P"
  | "S1"
  | "S2"
  | "R1"
  | "R2";

export type SubjectCategory =
  | "fellesfag"
  | "programfag"
  | "realfag"
  | "language"
  | "social"
  | "vocational";

export type SubjectYear = "vg1" | "vg2" | "vg3";

export type CompetitivenessBand = "low" | "medium" | "high" | "very_high" | "na";

export type EligibilityStatus = "possible" | "at_risk" | "blocked" | "complete";

export type SubjectChipKind =
  | "mandatory"
  | "required"
  | "recommended"
  | "completed"
  | "missing"
  | "unavailable";

export interface Subject {
  id: string;
  code: string;
  name: LocaleLabel;
  category: SubjectCategory;
  years: SubjectYear[];
  mathsTrack?: "P" | "S" | "R" | "none";
  description?: LocaleLabel;
}

export interface SubjectPrerequisite {
  subjectId: string;
  requires: string[];
  note?: LocaleLabel;
}

/** AND / OR requirement tree */
export type RequirementNode =
  | { type: "all"; items: RequirementNode[] }
  | { type: "any"; items: RequirementNode[] }
  | { type: "subject"; id: string }
  | { type: "gsu" }
  | { type: "flag"; id: string; label?: LocaleLabel };

export type RequirementGroup = RequirementNode;

export interface AdmissionCode {
  id: string;
  code: string;
  name: LocaleLabel;
  requirements: RequirementGroup;
  recommendedSubjects?: string[];
  additionalRequirements?: LocaleLabel[];
  ruleVersionId: string;
  sourceIds: string[];
}

export interface Career {
  id: string;
  name: LocaleLabel;
  field: InterestId;
  educationLevel: "bachelor" | "master" | "integrated" | "vocational" | "other";
  admissionRoute: "samordna" | "vocational" | "yvei" | "forkurs" | "other";
  typicalPathway: LocaleLabel;
  admissionCodeIds: string[];
  institutionIds: string[];
  recommendedSubjects?: string[];
  competitiveness: CompetitivenessBand;
  icon: string;
}

export interface DegreeProgramme {
  id: string;
  careerId: string;
  name: LocaleLabel;
  admissionCodeId: string;
  institutionIds: string[];
}

export interface PathwayYearPlan {
  vg1: string[];
  vg2: string[];
  vg3: string[];
}

export interface Pathway {
  id: string;
  name: LocaleLabel;
  careerIds: string[];
  plan: PathwayYearPlan;
  demanding?: boolean;
  notes?: LocaleLabel[];
}

export interface School {
  id: string;
  name: string;
  countyId: string;
  url?: string;
}

export interface SchoolOffering {
  schoolId: string;
  availableSubjectIds: string[];
  timetableConflictTags?: string[];
}

export interface HigherEducationInstitution {
  id: string;
  name: string;
  shortName: string;
  city: string;
  type: "university" | "university_college" | "fagskole";
  url: string;
}

export interface AdmissionCutoff {
  id: string;
  institutionId: string;
  careerId: string;
  year: number;
  quota: "ordinær" | "førstegang";
  points: number | null;
  isHistoricalExample: true;
  sourceId: string;
  note?: LocaleLabel;
}

export interface SourceReference {
  id: string;
  name: string;
  category: "udir" | "samordna" | "vilbli" | "utdanning" | "school" | "institution" | "other";
  url: string;
  lastReviewed: string;
}

export interface RuleVersion {
  id: string;
  label: string;
  lastReviewed: string;
  sourceIds: string[];
  notes?: string;
}

export interface StudentProfile {
  id: string;
  name?: string;
  stage: StudentStage;
  countyId?: string;
  schoolId?: string;
  foreignLanguageLowerSecondary: boolean;
  mathsLevel: MathsLevel;
  interests: InterestId[];
  goalIds: string[];
  confidence?: ConfidenceLevel;
  learningPreference?: LearningPreference;
  completedSubjectIds: string[];
  plannedSubjectIds: string[];
  scenarioId?: string;
}

export interface GoalEligibility {
  careerId: string;
  status: EligibilityStatus;
  completedRequirementLabels: string[];
  missingRequirementLabels: string[];
  formalRequirementsMet: boolean;
}

export interface EligibilityResult {
  goals: GoalEligibility[];
  invalidSequences: string[];
  warnings: string[];
  completedCount: number;
  remainingCount: number;
  pathwaysOpen: number;
  explanations: string[];
  subjectStatuses: Record<string, SubjectChipKind>;
}

export interface Recommendation {
  plan: PathwayYearPlan;
  careerIds: string[];
  demanding: boolean;
  rationale: string[];
  confirmWithSchool: boolean;
}

export interface County {
  id: string;
  name: string;
}

export interface DataRepository {
  getCareers(): Promise<Career[]>;
  getDegreeProgrammes(): Promise<DegreeProgramme[]>;
  getSubjects(): Promise<Subject[]>;
  getAdmissionCodes(): Promise<AdmissionCode[]>;
  getSchoolOfferings(schoolId: string): Promise<SchoolOffering | null>;
  getSchools(): Promise<School[]>;
  getCounties(): Promise<County[]>;
  getInstitutions(): Promise<HigherEducationInstitution[]>;
  getCutoffs(filters?: { careerId?: string; year?: number }): Promise<AdmissionCutoff[]>;
  getSources(): Promise<SourceReference[]>;
  getRuleVersions(): Promise<RuleVersion[]>;
  getPathways(): Promise<Pathway[]>;
  getPrerequisites(): Promise<SubjectPrerequisite[]>;
}
