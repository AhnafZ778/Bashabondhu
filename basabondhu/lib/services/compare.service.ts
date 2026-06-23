import { ScoredListing, ComparisonResult } from "../types";
import { calculateFirstMonthCost } from "../cost-calculator";

/**
 * Compare Service
 * Compares 2-3 listings side by side with summary and visit order recommendation.
 */

export function compareListings(listings: ScoredListing[]): ComparisonResult {
  if (listings.length < 2) {
    throw new Error("Need at least 2 listings to compare");
  }

  // Find best in each category
  const bestRent = listings.reduce((best, l) =>
    l.rent < best.rent ? l : best
  );
  const bestCommute = listings.reduce((best, l) =>
    l.scores.commuteFit > best.scores.commuteFit ? l : best
  );

  const costs = listings.map(l => ({
    id: l.id,
    total: calculateFirstMonthCost(l).total,
  }));
  const lowestUpfront = costs.reduce((best, c) =>
    c.total < best.total ? c : best
  );

  // Determine recommended listing (highest total score)
  const recommended = listings.reduce((best, l) =>
    l.scores.total > best.scores.total ? l : best
  );

  // Determine visit order: visit highest-scored first, then by commute convenience
  const visitOrder = [...listings]
    .sort((a, b) => {
      // Prioritize "visit" verdict listings
      if (a.verdict === "visit" && b.verdict !== "visit") return -1;
      if (a.verdict !== "visit" && b.verdict === "visit") return 1;
      // Then by total score
      return b.scores.total - a.scores.total;
    })
    .map(l => l.id);

  // Generate summary
  const summary = generateComparisonSummary(listings, bestRent, bestCommute, recommended);

  return {
    listings,
    recommendedListingId: recommended.id,
    visitOrder,
    summary,
    bestRentId: bestRent.id,
    bestCommuteId: bestCommute.id,
    lowestUpfrontId: lowestUpfront.id,
  };
}

function generateComparisonSummary(
  listings: ScoredListing[],
  bestRent: ScoredListing,
  bestCommute: ScoredListing,
  recommended: ScoredListing,
): string {
  const parts: string[] = [];

  parts.push(`Comparing ${listings.length} listings for you.`);

  if (bestRent.id === bestCommute.id) {
    parts.push(`${bestRent.title} wins on both rent and commute — strong choice.`);
  } else {
    parts.push(`${bestRent.title} has the lowest rent at ৳${bestRent.rent.toLocaleString()}/month.`);
    parts.push(`${bestCommute.title} offers the best commute convenience.`);
  }

  if (recommended.id !== bestRent.id && recommended.id !== bestCommute.id) {
    parts.push(`Overall, ${recommended.title} balances all factors best.`);
  }

  const rentDiff = Math.max(...listings.map(l => l.rent)) - Math.min(...listings.map(l => l.rent));
  if (rentDiff > 5000) {
    parts.push(`Rent difference between options is ৳${rentDiff.toLocaleString()}/month.`);
  }

  return parts.join(" ");
}
