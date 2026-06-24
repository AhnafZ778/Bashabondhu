/**
 * Quality Service
 *
 * Calculates completeness, extraction confidence,
 * source reliability, and publish status for every listing.
 */

import { DataSource, HarvesterParsedListing, HarvestedListing } from "@/lib/types/harvester";

// ── Completeness Score ──

export function calculateCompletenessScore(listing: Partial<HarvestedListing>): number {
  const fields = [
    { key: "area", weight: 0.15 },
    { key: "rent", weight: 0.15 },
    { key: "bedrooms", weight: 0.08 },
    { key: "bathrooms", weight: 0.05 },
    { key: "tenantPreference", weight: 0.08, exclude: "unknown" },
    { key: "advanceMonths", weight: 0.08 },
    { key: "gasType", weight: 0.06, exclude: "unknown" },
    { key: "serviceChargeKnown", weight: 0.08, isBoolean: true },
    { key: "brokerFeeKnown", weight: 0.08, isBoolean: true },
    { key: "lift", weight: 0.05 },
    { key: "generator", weight: 0.05 },
    { key: "sizeSqft", weight: 0.04 },
    { key: "floor", weight: 0.03 },
    { key: "addressHint", weight: 0.02 },
  ];

  let score = 0;
  for (const f of fields) {
    const val = listing[f.key as keyof typeof listing];
    if (val === undefined || val === null) continue;
    if (f.exclude && val === f.exclude) continue;
    if (f.isBoolean && val === false) continue;
    score += f.weight;
  }

  return parseFloat(Math.min(1, score / 0.95).toFixed(2));
}

// ── Extraction Confidence ──

export function calculateExtractionConfidence(
  parsed: HarvesterParsedListing
): number {
  let score = parsed.confidenceScore;

  // Bonus for hybrid parsing
  if (parsed.parserUsed === "hybrid") score += 0.05;

  // Penalty for too many red flags
  if (parsed.redFlags.length > 3) score -= 0.05;

  // Penalty for too many missing fields
  if (parsed.missingFields.length > 5) score -= 0.1;

  return parseFloat(Math.max(0, Math.min(1, score)).toFixed(2));
}

// ── Source Reliability ──

export function calculateSourceReliability(source: DataSource): number {
  const base: Record<string, number> = {
    user_paste: 0.7,
    partner_csv: 0.85,
    google_sheet: 0.85,
    manual_admin: 0.95,
    agency_website: 0.6,
    public_directory: 0.5,
    cached_snapshot: 0.8,
    osm_area_data: 0.9,
    seed: 1.0,
  };

  let score = base[source.type] || 0.5;

  // Risk level adjustments
  if (source.riskLevel === "high") score -= 0.15;
  if (source.riskLevel === "medium") score -= 0.05;

  // Permission status adjustments
  if (source.permissionStatus === "blocked") score = 0;
  if (source.permissionStatus === "unknown") score -= 0.1;

  return parseFloat(Math.max(0, Math.min(1, score)).toFixed(2));
}

// ── Publish Status Decision ──

export function decidePublishStatus(
  listing: Partial<HarvestedListing>,
  confidence: number
): HarvestedListing["status"] {
  // Must have area and rent to be published
  if (!listing.area || !listing.rent) {
    return "needs_review";
  }

  if (confidence >= 0.75) return "active";
  if (confidence >= 0.55) return "needs_review";
  return "needs_review";
}

// ── Quality Badges ──

export type QualityBadge =
  | "high_confidence"
  | "needs_review"
  | "fresh_listing"
  | "possibly_stale"
  | "missing_cost_info"
  | "duplicate_removed"
  | "verified_source"
  | "hidden_cost_warning";

export function getQualityBadges(listing: HarvestedListing): QualityBadge[] {
  const badges: QualityBadge[] = [];

  if (listing.listingTrust === "high") badges.push("high_confidence");
  if (listing.status === "needs_review") badges.push("needs_review");
  if (listing.freshnessStatus === "fresh") badges.push("fresh_listing");
  if (listing.freshnessStatus === "stale" || listing.freshnessStatus === "aging")
    badges.push("possibly_stale");
  if (!listing.serviceChargeKnown || !listing.brokerFeeKnown)
    badges.push("missing_cost_info");
  if (listing.status === "duplicate") badges.push("duplicate_removed");
  if (listing.redFlags.length > 0) badges.push("hidden_cost_warning");

  return badges;
}

// ── Quality Summary ──

export function getQualitySummary(listing: HarvestedListing): string {
  const badges = getQualityBadges(listing);
  const parts: string[] = [];

  if (badges.includes("high_confidence")) {
    parts.push("High confidence listing with verified details.");
  }
  if (badges.includes("missing_cost_info")) {
    parts.push("Some cost details are missing — confirm before visiting.");
  }
  if (badges.includes("hidden_cost_warning")) {
    parts.push(`${listing.redFlags.length} potential risk(s) detected.`);
  }
  if (badges.includes("fresh_listing")) {
    parts.push("Recently listed — likely still available.");
  }
  if (badges.includes("possibly_stale")) {
    parts.push("This listing may be outdated — confirm availability.");
  }

  return parts.join(" ") || "Standard listing — review details before deciding.";
}
