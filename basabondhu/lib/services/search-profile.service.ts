import { SearchProfile, HouseholdType } from "../types";

/**
 * Search Profile Service
 * Validates and infers search profile from wizard input or persona selection.
 */

export function validateProfile(profile: Partial<SearchProfile>): {
  valid: boolean;
  errors: string[];
  inferred: SearchProfile;
} {
  const errors: string[] = [];

  if (!profile.householdType) {
    errors.push("Household type is required");
  }
  if (!profile.budgetMonthly || profile.budgetMonthly <= 0) {
    errors.push("Monthly budget must be positive");
  }
  if (!profile.maxFirstMonthCash || profile.maxFirstMonthCash <= 0) {
    errors.push("First month cash must be positive");
  }

  // Infer defaults for missing optional fields
  const inferred: SearchProfile = {
    id: profile.id || generateSessionId(),
    mode: profile.mode || "plan",
    rentingOrBuying: profile.rentingOrBuying || "renting",
    householdType: profile.householdType || "family",
    lookingFor: profile.lookingFor || "full-flat",
    budgetMonthly: profile.budgetMonthly || 25000,
    maxFirstMonthCash: profile.maxFirstMonthCash || (profile.budgetMonthly ? profile.budgetMonthly * 3 : 75000),
    commuteAnchors: profile.commuteAnchors || [],
    priorities: profile.priorities || inferPriorities(profile.householdType || "family"),
    dealBreakers: profile.dealBreakers || [],
  };

  return {
    valid: errors.length === 0,
    errors,
    inferred,
  };
}

export function generateProfileSummary(profile: SearchProfile): string {
  const typeLabels: Record<HouseholdType, string> = {
    family: "a family",
    couple: "a couple",
    bachelor: "a bachelor",
    student: "a student",
    "working-woman": "a working woman",
    group: "a group",
    "single-professional": "a single professional",
  };

  const typeLabel = typeLabels[profile.householdType] || profile.householdType;
  const budget = `৳${profile.budgetMonthly.toLocaleString()}`;
  const cash = `৳${profile.maxFirstMonthCash.toLocaleString()}`;
  const anchors = profile.commuteAnchors.map(a => a.label).join(", ") || "no specific area";

  let summary = `You're ${typeLabel} looking for a ${profile.lookingFor === "room-sublet" ? "room/sublet" : "full flat"} in Dhaka.`;
  summary += ` Monthly budget: ${budget}. First-month cash: ${cash}.`;
  summary += ` Commute anchor: ${anchors}.`;

  if (profile.priorities.length > 0) {
    summary += ` Top priorities: ${profile.priorities.slice(0, 3).join(", ")}.`;
  }
  if (profile.dealBreakers.length > 0) {
    summary += ` Deal-breakers: ${profile.dealBreakers.join(", ")}.`;
  }

  return summary;
}

function inferPriorities(householdType: HouseholdType): string[] {
  switch (householdType) {
    case "family":
      return ["family-friendly", "school", "gas", "no-waterlogging"];
    case "couple":
      return ["commute", "family-friendly", "lift", "rent"];
    case "bachelor":
      return ["rent", "commute", "bachelor-friendly"];
    case "student":
      return ["rent", "commute", "bachelor-friendly"];
    case "working-woman":
      return ["safety", "generator", "lift", "commute"];
    case "group":
      return ["rent", "safety", "lift"];
    case "single-professional":
      return ["commute", "rent", "quiet-area"];
    default:
      return ["rent", "commute"];
  }
}

function generateSessionId(): string {
  return `session-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
}
