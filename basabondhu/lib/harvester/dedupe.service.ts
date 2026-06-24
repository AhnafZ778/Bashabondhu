/**
 * Deduplication Service
 *
 * Detects and manages duplicate listings.
 * Uses area + rent + bedrooms + title similarity scoring.
 */

import { HarvestedListing } from "@/lib/types/harvester";
import { getHarvestedListings } from "./structured-listing-builder.service";

export function findPossibleDuplicates(
  listing: HarvestedListing
): { listing: HarvestedListing; score: number }[] {
  const all = getHarvestedListings().filter((l) => l.id !== listing.id && l.status !== "duplicate");
  const dupes: { listing: HarvestedListing; score: number }[] = [];

  for (const existing of all) {
    const score = calculateDuplicateScore(listing, existing);
    if (score >= 0.7) {
      dupes.push({ listing: existing, score });
    }
  }

  return dupes.sort((a, b) => b.score - a.score);
}

export function calculateDuplicateScore(a: HarvestedListing, b: HarvestedListing): number {
  let score = 0;

  // Same source URL = exact duplicate
  if (a.sourceUrl && b.sourceUrl && a.sourceUrl === b.sourceUrl) return 1.0;

  // Area match (0.25)
  if (a.area && b.area && a.area.toLowerCase() === b.area.toLowerCase()) score += 0.25;

  // Rent match (0.25) — within 10% tolerance
  if (a.rent && b.rent) {
    const diff = Math.abs(a.rent - b.rent) / Math.max(a.rent, b.rent);
    if (diff <= 0.1) score += 0.25;
    else if (diff <= 0.2) score += 0.15;
  }

  // Bedrooms match (0.2)
  if (a.bedrooms && b.bedrooms && a.bedrooms === b.bedrooms) score += 0.2;

  // Title similarity (0.3) — simple word overlap
  if (a.title && b.title) {
    const similarity = calculateTextSimilarity(a.title, b.title);
    score += similarity * 0.3;
  }

  return parseFloat(score.toFixed(2));
}

function calculateTextSimilarity(a: string, b: string): number {
  const wordsA = new Set(a.toLowerCase().split(/\s+/).filter(w => w.length > 2));
  const wordsB = new Set(b.toLowerCase().split(/\s+/).filter(w => w.length > 2));
  if (wordsA.size === 0 || wordsB.size === 0) return 0;

  let overlap = 0;
  for (const word of wordsA) {
    if (wordsB.has(word)) overlap++;
  }
  return overlap / Math.max(wordsA.size, wordsB.size);
}

export function markDuplicate(listingId: string, duplicateOf: string): void {
  const { updateListing } = require("./structured-listing-builder.service");
  updateListing(listingId, { status: "duplicate" });
}
