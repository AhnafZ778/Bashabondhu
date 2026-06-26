import { Listing, ScoredListing, SearchProfile, Verdict } from "./types";
import { calculateFirstMonthCost } from "./cost-calculator";
import { parseListingSync } from "./services/listing-parser.service";
import { detectHiddenCostScopes } from "./services/hidden-cost-scope.service";

// Travel compatibility matrix between 10 Dhaka areas (100 = excellent/same, 20 = very poor)
const COMMUTE_MATRIX: Record<string, Record<string, number>> = {
  Banasree: { Banasree: 100, Badda: 80, "Merul Badda": 90, Mohakhali: 60, Tejgaon: 60, Mohammadpur: 40, Lalmatia: 40, Mirpur: 30, Uttara: 30, Bashundhara: 60, Dhanmondi: 45, Banani: 65, Gulshan: 70 },
  Badda: { Banasree: 80, Badda: 100, "Merul Badda": 95, Mohakhali: 75, Tejgaon: 70, Mohammadpur: 45, Lalmatia: 45, Mirpur: 40, Uttara: 50, Bashundhara: 80, Dhanmondi: 45, Banani: 75, Gulshan: 85 },
  "Merul Badda": { Banasree: 90, Badda: 95, "Merul Badda": 100, Mohakhali: 70, Tejgaon: 70, Mohammadpur: 40, Lalmatia: 40, Mirpur: 35, Uttara: 45, Bashundhara: 75, Dhanmondi: 45, Banani: 70, Gulshan: 80 },
  Mohakhali: { Banasree: 60, Badda: 75, "Merul Badda": 70, Mohakhali: 100, Tejgaon: 90, Mohammadpur: 65, Lalmatia: 70, Mirpur: 60, Uttara: 70, Bashundhara: 70, Dhanmondi: 70, Banani: 90, Gulshan: 85 },
  Tejgaon: { Banasree: 60, Badda: 70, "Merul Badda": 70, Mohakhali: 90, Tejgaon: 100, Mohammadpur: 70, Lalmatia: 75, Mirpur: 60, Uttara: 60, Bashundhara: 65, Dhanmondi: 75, Banani: 80, Gulshan: 75 },
  Mohammadpur: { Banasree: 40, Badda: 45, "Merul Badda": 40, Mohakhali: 65, Tejgaon: 70, Mohammadpur: 100, Lalmatia: 90, Mirpur: 70, Uttara: 45, Bashundhara: 40, Dhanmondi: 85, Banani: 55, Gulshan: 50 },
  Lalmatia: { Banasree: 40, Badda: 45, "Merul Badda": 40, Mohakhali: 70, Tejgaon: 75, Mohammadpur: 90, Lalmatia: 100, Mirpur: 65, Uttara: 45, Bashundhara: 40, Dhanmondi: 90, Banani: 55, Gulshan: 50 },
  Mirpur: { Banasree: 30, Badda: 40, "Merul Badda": 35, Mohakhali: 60, Tejgaon: 60, Mohammadpur: 70, Lalmatia: 65, Mirpur: 100, Uttara: 65, Bashundhara: 50, Dhanmondi: 60, Banani: 60, Gulshan: 55 },
  Uttara: { Banasree: 30, Badda: 50, "Merul Badda": 45, Mohakhali: 70, Tejgaon: 60, Mohammadpur: 45, Lalmatia: 45, Mirpur: 65, Uttara: 100, Bashundhara: 70, Dhanmondi: 45, Banani: 65, Gulshan: 60 },
  Bashundhara: { Banasree: 60, Badda: 80, "Merul Badda": 75, Mohakhali: 70, Tejgaon: 65, Mohammadpur: 40, Lalmatia: 40, Mirpur: 50, Uttara: 70, Bashundhara: 100, Dhanmondi: 45, Banani: 75, Gulshan: 80 },
  Dhanmondi: { Banasree: 45, Badda: 45, "Merul Badda": 45, Mohakhali: 70, Tejgaon: 75, Mohammadpur: 85, Lalmatia: 90, Mirpur: 60, Uttara: 45, Bashundhara: 45, Dhanmondi: 100, Banani: 55, Gulshan: 50 },
  Banani: { Banasree: 65, Badda: 75, "Merul Badda": 70, Mohakhali: 90, Tejgaon: 80, Mohammadpur: 55, Lalmatia: 55, Mirpur: 60, Uttara: 65, Bashundhara: 75, Dhanmondi: 55, Banani: 100, Gulshan: 95 },
  Gulshan: { Banasree: 70, Badda: 85, "Merul Badda": 80, Mohakhali: 85, Tejgaon: 75, Mohammadpur: 50, Lalmatia: 50, Mirpur: 55, Uttara: 60, Bashundhara: 80, Dhanmondi: 50, Banani: 95, Gulshan: 100 }
};

export function scoreListing(
  listing: Listing,
  profile: SearchProfile,
  adjustments: string[] = []
): ScoredListing {
  const cost = calculateFirstMonthCost(listing);

  // 1. Budget Fit Score
  let budgetFit = 100;
  if (listing.rent > profile.budgetMonthly) {
    budgetFit = Math.max(0, 100 - ((listing.rent - profile.budgetMonthly) / profile.budgetMonthly) * 200);
  }

  // 2. First Month Fit Score
  let firstMonthFit = 100;
  if (cost.total > profile.maxFirstMonthCash) {
    firstMonthFit = Math.max(0, 100 - ((cost.total - profile.maxFirstMonthCash) / profile.maxFirstMonthCash) * 150);
  }

  // 3. Commute Fit Score
  let commuteFit = 50; // default if no anchors
  if (profile.commuteAnchors.length > 0) {
    const scores = profile.commuteAnchors.map(anchor => {
      const distance = COMMUTE_MATRIX[listing.area]?.[anchor.area] ?? 30;
      return distance;
    });
    // average score
    commuteFit = scores.reduce((a, b) => a + b, 0) / scores.length;
  }

  // 4. Household Fit Score
  let householdFit = 100;
  const userType = profile.householdType;
  const pref = listing.tenantPreference;

  if (userType === "bachelor" || userType === "student") {
    if (pref === "family") householdFit = 10;
    else if (pref === "female" && userType === "bachelor") householdFit = 0; // strict fail if bachelor looking at female sublet
    else if (pref === "bachelor" || pref === "student") householdFit = 100;
    else if (pref === "any") householdFit = 75;
  } else if (userType === "family" || userType === "couple") {
    if (pref === "bachelor" || pref === "student" || pref === "female") householdFit = 20;
    else if (pref === "family") householdFit = 100;
    else if (pref === "any") householdFit = 80;
  } else if (userType === "working-woman") {
    if (pref === "female") householdFit = 100;
    else if (pref === "family" || pref === "any") householdFit = 80;
    else householdFit = 30;
  }

  // 5. Hidden Scope Penalty
  const parsed = parseListingSync(listing.rawText);
  const scopes = detectHiddenCostScopes({ parsedListing: parsed, listing, searchProfile: profile });
  
  let hiddenScopePenalty = 0;
  scopes.forEach(scope => {
    if (scope.seriousness === "critical") hiddenScopePenalty += 25;
    else if (scope.seriousness === "high") hiddenScopePenalty += 15;
    else if (scope.seriousness === "medium") hiddenScopePenalty += 5;
  });
  hiddenScopePenalty = Math.min(100, hiddenScopePenalty);
  
  const hiddenCostFit = Math.max(0, 100 - hiddenScopePenalty);

  // 6. Utility Clarity Score
  let utilityClarity = 20;
  if (listing.utilityClarity === "clear") utilityClarity = 100;
  else if (listing.utilityClarity === "partial") utilityClarity = 60;

  // 7. Waterlogging Risk Score
  let waterloggingFit = 100;
  if (listing.waterloggingRisk === "high") waterloggingFit = 10;
  else if (listing.waterloggingRisk === "medium") waterloggingFit = 50;
  else if (listing.waterloggingRisk === "unknown") waterloggingFit = 70;

  // 8. Listing Trust Score
  let listingTrust = 60;
  if (listing.rent > 0) listingTrust += 15;
  if (listing.area) listingTrust += 15;
  if (listing.goodPoints.length > 0) listingTrust += 10;
  if (listing.redFlags.length > 3) listingTrust -= 20;
  listingTrust = Math.min(100, Math.max(0, listingTrust));

  // Determine weight configurations based on adjustments
  let wBudget = 0.25;
  let wFirstMonth = 0.10;
  let wCommute = 0.20;
  let wHousehold = 0.15;
  let wHidden = 0.15;
  const wUtility = 0.05;
  const wWater = 0.05;
  const wTrust = 0.05;

  // Adjust weights and fits dynamically based on user controls/adjustments
  if (adjustments.includes("shorter-commute")) {
    wCommute = 0.40;
    wBudget = 0.15;
    wHousehold = 0.10;
    wHidden = 0.10;
  }
  if (adjustments.includes("lower-rent")) {
    wBudget = 0.40;
    wCommute = 0.15;
    wFirstMonth = 0.15;
    wHidden = 0.10;
  }
  
  // Specific adjustments that modify the score/penalties directly
  let brokerPenalty = 0;
  if (adjustments.includes("avoid-broker") && listing.sourceType === "broker") {
    brokerPenalty = 40;
  }

  let waterloggingPenalty = 0;
  if (adjustments.includes("avoid-waterlogging") && listing.waterloggingRisk === "high") {
    waterloggingPenalty = 50;
  } else if (adjustments.includes("avoid-waterlogging") && listing.waterloggingRisk === "medium") {
    waterloggingPenalty = 25;
  }

  // Calculate weighted total score
  let total = 
    budgetFit * wBudget +
    firstMonthFit * wFirstMonth +
    commuteFit * wCommute +
    householdFit * wHousehold +
    hiddenCostFit * wHidden +
    utilityClarity * wUtility +
    waterloggingFit * wWater +
    listingTrust * wTrust;

  // Apply specific penalties
  total = Math.max(0, total - brokerPenalty - waterloggingPenalty);

  // Check deal-breakers
  let dealBreakerTriggered = false;
  if (profile.dealBreakers.includes("broker") && listing.sourceType === "broker") {
    dealBreakerTriggered = true;
  }
  if (profile.dealBreakers.includes("high-advance") && listing.advanceMonths >= 3) {
    dealBreakerTriggered = true;
  }
  if (profile.dealBreakers.includes("family-only") && pref === "family" && (userType === "bachelor" || userType === "student")) {
    dealBreakerTriggered = true;
  }
  if (profile.dealBreakers.includes("no-lift") && !listing.lift) {
    dealBreakerTriggered = true;
  }
  if (profile.dealBreakers.includes("no-gas") && listing.gasType === "unknown") {
    dealBreakerTriggered = true;
  }
  if (profile.dealBreakers.includes("heavy-waterlogging") && listing.waterloggingRisk === "high") {
    dealBreakerTriggered = true;
  }

  // Determine Verdict
  let verdict: Verdict = "maybe";
  
  const highScopes = scopes.filter(s => s.seriousness === "high" || s.seriousness === "critical").length;

  if (dealBreakerTriggered || total < 40 || householdFit === 0) {
    verdict = "avoid";
  } else if (total >= 75 && highScopes === 0) {
    verdict = "visit";
  } else if (total >= 55 && highScopes <= 2) {
    verdict = "maybe";
  } else {
    verdict = "call-first";
  }

  // Generate dynamic contextual text
  let whyItFits = "";
  if (verdict === "visit") {
    whyItFits = `Excellent budget fit and highly compatible with your household. Commute to your anchors is very convenient.`;
  } else if (verdict === "maybe") {
    whyItFits = `Fits rent parameters well, but some service details are missing. Worth considering if you confirm utilities.`;
  } else if (verdict === "call-first") {
    whyItFits = `Listed rent fits, but upfront costs or service charges are hidden. Clarify costs before booking a physical visit.`;
  } else {
    whyItFits = dealBreakerTriggered 
      ? `Conflicts with your set deal-breakers (e.g., ${profile.dealBreakers.join(", ")}).`
      : `Outside budget limits or has high commute mismatch for your office/school anchors.`;
  }

  let biggestRisk = "None detected";
  if (listing.waterloggingRisk === "high") {
    biggestRisk = "Heavy monsoon waterlogging risk in this sector.";
  } else if (listing.sourceType === "broker" && listing.brokerFee === null) {
    biggestRisk = "Hidden broker fee risk — broker details are vague.";
  } else if (listing.advanceMonths >= 3) {
    biggestRisk = `High upfront deposit required (${listing.advanceMonths} months).`;
  } else if (!listing.generator && listing.lift) {
    biggestRisk = "Lift present but no generator backup for power cuts.";
  } else if (listing.gasType === "cylinder") {
    biggestRisk = "Cylinder gas only (separate monthly supply hassle).";
  }

  // Generate call questions
  const questionsToAsk = [
    `Confirm if the service charge is fixed or if utilities (water, gas, electricity) are separate.`,
  ];
  if (listing.advanceMonths > 0) {
    questionsToAsk.push(`Confirm if the ${listing.advanceMonths}-month advance is negotiable.`);
  }
  if (listing.sourceType === "broker") {
    questionsToAsk.push(`Ask about the exact broker fee percentage or upfront charge.`);
  }
  if (listing.gasType === "unknown") {
    questionsToAsk.push(`Ask if there is a Government Titas gas line connection or cylinder.`);
  }
  if (listing.waterloggingRisk === "high" || listing.waterloggingRisk === "medium") {
    questionsToAsk.push(`Ask if the ground floor or approach road floods during heavy rain.`);
  }
  if (!listing.generator) {
    questionsToAsk.push(`Confirm if there is IPS/generator backup for lights and lift during load shedding.`);
  }
  if (pref === "family" && (userType === "bachelor" || userType === "student")) {
    questionsToAsk.push(`Confirm if bachelors/students are allowed under any terms (e.g., local guardian sign-off).`);
  }

  return {
    ...listing,
    scores: {
      budgetFit: Math.round(budgetFit),
      firstMonthFit: Math.round(firstMonthFit),
      commuteFit: Math.round(commuteFit),
      householdFit: Math.round(householdFit),
      hiddenScopePenalty: Math.round(hiddenScopePenalty),
      utilityClarity: Math.round(utilityClarity),
      waterloggingRisk: Math.round(100 - waterloggingFit),
      listingTrust: Math.round(listingTrust),
      amenityFit: 100, // mock fallback
      total: Math.round(total)
    },
    hiddenCostScopes: scopes,
    verdict,
    whyItFits,
    biggestRisk,
    questionsToAsk
  };
}
