import {
  HousingReport,
  SearchProfile,
  ScoredListing,
  AreaProfile,
  ScanSummary,
  FirstMonthCost,
  ChecklistSection,
} from "../types";
import { calculateFirstMonthCost } from "../cost-calculator";
import { generateVisitChecklist } from "./checklist.service";
import { generateCallQuestions } from "./question.service";
import { generateProfileSummary } from "./search-profile.service";

/**
 * Report Service
 * Builds the final housing report JSON consolidating the entire user journey.
 */

export function generateReport(
  profile: SearchProfile,
  topListings: ScoredListing[],
  recommendedAreas: AreaProfile[],
  scanSummary: ScanSummary
): HousingReport {
  // Profile summary
  const profileSummary = generateProfileSummary(profile);

  // Cost summaries for each top listing
  const costSummaries: FirstMonthCost[] = topListings.map(listing =>
    calculateFirstMonthCost(listing)
  );

  // Aggregate risks
  const mainRisks = extractMainRisks(topListings);

  // Aggregate questions
  const questionsToAsk = extractQuestions(topListings, profile);

  // Generate visit checklist
  const visitChecklist: ChecklistSection[] = generateVisitChecklist(profile);

  // Final recommendation
  const finalRecommendation = generateFinalRecommendation(
    topListings,
    costSummaries,
    profile
  );

  return {
    profileSummary,
    recommendedAreas,
    scanSummary,
    topListings,
    costSummaries,
    mainRisks,
    questionsToAsk,
    visitChecklist,
    finalRecommendation,
    generatedAt: new Date().toISOString(),
  };
}

function extractMainRisks(listings: ScoredListing[]): string[] {
  const risks = new Set<string>();

  for (const listing of listings) {
    if (listing.biggestRisk && listing.biggestRisk !== "None detected") {
      risks.add(listing.biggestRisk);
    }
    if (listing.waterloggingRisk === "high") {
      risks.add(`${listing.area} has high waterlogging risk during monsoon.`);
    }
    if (listing.gasType === "cylinder") {
      risks.add("Cylinder gas adds ৳1,500–2,500/month extra cost.");
    }
    if (listing.sourceType === "broker" && listing.brokerFee === null) {
      risks.add("Broker fee unknown — could add up to 1 month rent.");
    }
  }

  return Array.from(risks).slice(0, 5);
}

function extractQuestions(
  listings: ScoredListing[],
  profile: SearchProfile
): string[] {
  const allQuestions = new Set<string>();

  for (const listing of listings) {
    const questions = generateCallQuestions(listing, profile);
    questions.forEach(q => allQuestions.add(q));
  }

  return Array.from(allQuestions).slice(0, 8);
}

function generateFinalRecommendation(
  topListings: ScoredListing[],
  costSummaries: FirstMonthCost[],
  profile: SearchProfile
): string {
  if (topListings.length === 0) {
    return "No suitable listings found. Try expanding your budget or relaxing deal-breakers.";
  }

  const best = topListings[0];
  const cheapest = topListings.reduce((min, l) => (l.rent < min.rent ? l : min));
  const lowestUpfront = costSummaries.reduce((min, c) => (c.total < min.total ? c : min));

  let rec = `Based on your profile, we recommend visiting ${best.title} in ${best.area} first. `;
  rec += `It scores ${best.scores.total}/100 overall. `;

  if (cheapest.id !== best.id) {
    rec += `For lowest rent, ${cheapest.title} at ৳${cheapest.rent.toLocaleString()}/month is your best bet. `;
  }

  rec += `Lowest first-month cost is ৳${lowestUpfront.total.toLocaleString()}. `;
  rec += `Call before visiting to confirm availability and hidden costs.`;

  return rec;
}
