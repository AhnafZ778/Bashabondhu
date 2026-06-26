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
  
  // Filter out "avoid" listings
  const validListings = scored.filter(l => l.verdict !== "avoid");
  
  // Deduplicate by title to ensure different buildings
  const seenTitles = new Set<string>();
  const uniqueListings: ScoredListing[] = [];
  
  for (const listing of validListings) {
    const normalizedTitle = listing.title.toLowerCase().trim();
    if (!seenTitles.has(normalizedTitle)) {
      seenTitles.add(normalizedTitle);
      uniqueListings.push(listing);
    }
  }

  // DhakaImages files list
  const dhakaImagesList = [
    "8images.jpg",
    "highly-populated-dhaka-city-crammed-with-unplanned-buildings-KDCB15.jpg",
    "im88ages.jpg",
    "im99ages.jpg",
    "ima9ges.jpg",
    "imag22es.jpg",
    "imag999es.jpg",
    "imag9es.jpg",
    "image5s.jpg",
    "image88s.jpg",
    "image99s.jpg",
    "images.jpg",
    "istockphoto-2153844423-612x612.jpg"
  ];

  // Seed-based shuffle helper to ensure stability for current view/refinement
  const targetArea = profile.commuteAnchors[0]?.area;
  const seed = (profile?.id || "") + (targetArea || "");
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const getSeededRandom = (subSeed: number) => {
    const x = Math.sin(hash + subSeed) * 10000;
    return x - Math.floor(x);
  };

  const indices = Array.from({ length: dhakaImagesList.length }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const r = getSeededRandom(i);
    const j = Math.floor(r * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  let topCount = 0;
  return uniqueListings.map((listing) => {
    if (topCount < count) {
      const imgName = dhakaImagesList[indices[topCount] % dhakaImagesList.length];
      topCount++;
      return {
        ...listing,
        imageUrl: `/DhakaImages/${imgName}`
      };
    }
    return listing;
  }).slice(0, count);
}
