import { AreaProfile, SearchProfile } from "../types";
import { areas } from "../data/areas";

/**
 * Area Recommendation Service
 * Scores and ranks areas based on user profile for area cards display.
 */

export type ScoredArea = AreaProfile & {
  matchScore: number;
  matchReason: string;
};

export function getRecommendedAreas(
  profile: SearchProfile,
  count: number = 4
): ScoredArea[] {
  const scoredAreas = areas.map(area => scoreAreaForProfile(area, profile));

  // Sort by match score descending
  scoredAreas.sort((a, b) => b.matchScore - a.matchScore);

  return scoredAreas.slice(0, count);
}

function scoreAreaForProfile(area: AreaProfile, profile: SearchProfile): ScoredArea {
  let score = 50; // base score
  const reasons: string[] = [];

  // Budget fit
  if (area.rentLow <= profile.budgetMonthly && area.rentHigh >= profile.budgetMonthly * 0.6) {
    score += 20;
    reasons.push("Budget fits area rent range");
  } else if (area.rentLow > profile.budgetMonthly) {
    score -= 30;
    reasons.push("Area tends to be above budget");
  }

  // Household suitability
  const userType = profile.householdType;
  if (userType === "family" || userType === "couple") {
    score += area.familySuitability * 3;
    if (area.familySuitability >= 7) reasons.push("Great for families");
  } else if (userType === "bachelor" || userType === "student") {
    score += area.bachelorSuitability * 3;
    if (area.bachelorSuitability >= 7) reasons.push("Bachelor-friendly area");
  } else if (userType === "working-woman") {
    score += area.femaleSuitability * 3;
    if (area.femaleSuitability >= 7) reasons.push("Good safety for women");
  } else if (userType === "group") {
    score += Math.max(area.bachelorSuitability, area.femaleSuitability) * 2;
  } else if (userType === "single-professional") {
    score += (area.bachelorSuitability + area.familySuitability) * 1.5;
  }

  // Commute priority
  if (profile.priorities.includes("commute") && profile.commuteAnchors.length > 0) {
    // Boost areas close to commute anchors (simplified)
    const anchorAreas = profile.commuteAnchors.map(a => a.area);
    if (anchorAreas.includes(area.name)) {
      score += 25;
      reasons.push("Your commute anchor is in this area");
    }
  }

  // Waterlogging deal-breaker
  if (profile.dealBreakers.includes("heavy-waterlogging") && area.waterloggingRisk === "high") {
    score -= 40;
    reasons.push("High waterlogging risk — conflicts with your deal-breaker");
  }

  // School priority
  if (profile.priorities.includes("school")) {
    score += area.schoolAccess * 2;
    if (area.schoolAccess >= 7) reasons.push("Good school access");
  }

  // Utility reliability
  if (area.utilityReliability === "high") {
    score += 5;
  } else if (area.utilityReliability === "low") {
    score -= 10;
  }

  const matchReason = reasons.length > 0 ? reasons[0] : "Reasonable option for your profile";

  return {
    ...area,
    matchScore: Math.max(0, Math.min(100, Math.round(score))),
    matchReason,
  };
}
