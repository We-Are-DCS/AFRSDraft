export type ServiceType = 'army' | 'navy' | 'raf';
export type PatternType = 'A' | 'B' | 'C';
export type PhaseNum = 1 | 2 | 3 | 4 | 5;

export interface NBADecision {
  action: string;
  channel: string;
  propensity: number;
  treatment: string;
  auditRef?: string;
}

export interface PegaCapability {
  name: string;
  detail: string;
}

export interface Stage {
  id: number;
  name: string;
  shortName: string;
  phase: PhaseNum;
  phaseLabel: string;
  description: string;
  pegaCapabilities: PegaCapability[];
  candidateSees: string;
  nbaDecisions: NBADecision[];
  status: 'done' | 'active' | 'pending';
  dayRange: string;
  outcome: string;
  aepLayer?: string;   // Pattern B only
  aemContent?: string; // Pattern A only
}

export interface Persona {
  id: string;
  name: string;
  service: ServiceType;
  pattern: PatternType;
  role: string;
  age: number;
  location: string;
  background: string;
  tagline: string;
  propensityStart: number;
  propensityEnd: number;
  targetDay: number;
  targetMilestone: string;
  caseId: string;
  color: string;
  gradientClass: string;
  avatar: string;
  // Builder metadata — only set for custom personas
  isCustom?: boolean;
  builderEducation?: string;
  builderCohort?: string;
  builderInterests?: string[];
  builderAgeRange?: string;
}

export interface CohortMetric {
  label: string;
  value: string;
  trend?: string;
}
