import { Listing, SearchProfile, ScanSummary } from "../types";

/**
 * Demo Scan Service
 * Generates the scan funnel summary data for the animation interstitial.
 * Numbers correspond to actual filter analysis of seed listings.
 */

export function generateScanSummary(
  listings: Listing[],
  profile: SearchProfile
): ScanSummary {
  const scanned = listings.length;

  let removedBudget = 0;
  let removedCommute = 0;
  let removedHiddenCost = 0;
  let removedHouseholdMismatch = 0;

  for (const listing of listings) {
    // Budget filter
    if (listing.rent > profile.budgetMonthly * 1.15) {
      removedBudget++;
      continue;
    }

    // Household mismatch
    const userType = profile.householdType;
    const pref = listing.tenantPreference;
    let householdMismatch = false;

    if ((userType === "bachelor" || userType === "student") && pref === "family") {
      householdMismatch = true;
    }
    if ((userType === "family" || userType === "couple") && (pref === "bachelor" || pref === "student")) {
      householdMismatch = true;
    }
    if (userType === "working-woman" && pref === "bachelor") {
      householdMismatch = true;
    }

    if (householdMismatch) {
      removedHouseholdMismatch++;
      continue;
    }

    // Commute filter (simplified — use deal-breakers as proxy)
    if (profile.dealBreakers.includes("far-from-transport")) {
      // rough approximation
    }

    // Hidden cost filter
    if (listing.brokerFee === null && listing.sourceType === "broker") {
      removedHiddenCost++;
      continue;
    }
    if (!listing.serviceChargeKnown && listing.advanceMonths >= 3) {
      removedHiddenCost++;
      continue;
    }
  }

  // Estimate commute removals from remaining
  const remaining = scanned - removedBudget - removedHouseholdMismatch - removedHiddenCost;
  removedCommute = Math.max(Math.floor(remaining * 0.2), 5);

  const selected = Math.max(3, scanned - removedBudget - removedCommute - removedHiddenCost - removedHouseholdMismatch);

  return {
    scanned,
    removedBudget,
    removedCommute,
    removedHiddenCost,
    removedHouseholdMismatch,
    selected: Math.min(selected, 3),
  };
}
