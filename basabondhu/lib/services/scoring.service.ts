import { Listing, ScoredListing, SearchProfile } from "../types";
import { scoreListing } from "../scoring";

/**
 * Scoring Service
 * Wraps scoreListing() with profile validation and bulk scoring.
 */

export function scoreListingForProfile(
  listing: Listing,
  profile: SearchProfile,
  adjustments: string[] = []
): ScoredListing {
  return scoreListing(listing, profile, adjustments);
}

export function scoreAllListings(
  listings: Listing[],
  profile: SearchProfile,
  adjustments: string[] = []
): ScoredListing[] {
  const scored = listings.map(listing =>
    scoreListing(listing, profile, adjustments)
  );

  // Sort by total score descending, "avoid" listings go last
  return scored.sort((a, b) => {
    if (a.verdict === "avoid" && b.verdict !== "avoid") return 1;
    if (a.verdict !== "avoid" && b.verdict === "avoid") return -1;
    return b.scores.total - a.scores.total;
  });
}

export function getTopListings(
  listings: Listing[],
  profile: SearchProfile,
  adjustments: string[] = [],
  count: number = 3
): ScoredListing[] {
  const scored = scoreAllListings(listings, profile, adjustments);
  // Return top N non-"avoid" listings
  return scored.filter(l => l.verdict !== "avoid").slice(0, count);
}
