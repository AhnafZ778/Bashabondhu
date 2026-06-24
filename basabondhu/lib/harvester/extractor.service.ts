/**
 * Extractor Service (Hybrid)
 *
 * Wraps the existing regex parser with confidence scoring.
 * Produces HarvesterParsedListing with full metadata.
 * Falls back gracefully if OpenRouter is unavailable.
 */

import { parseMessyListing } from "@/lib/parser";
import { HarvesterParsedListing, HarvestedListing } from "@/lib/types/harvester";
import { normalizeListingText } from "@/lib/utils/text-normalizer";

// ── Regex Extraction (primary) ──

export function extractWithRegex(
  rawText: string,
  rawDocumentId: string
): HarvesterParsedListing {
  const normalized = normalizeListingText(rawText);
  const parsed = parseMessyListing(normalized);

  // Build partial HarvestedListing from parsed result
  const parsedJson: Partial<HarvestedListing> = {
    area: parsed.area || undefined,
    rent: parsed.rent || undefined,
    bedrooms: parsed.bedrooms || undefined,
    bathrooms: parsed.bathrooms || undefined,
    tenantPreference: mapTenantPreference(parsed.tenantPreference),
    advanceMonths: parsed.advanceMonths || undefined,
    gasType: mapGasType(parsed.gasType),
    lift: parsed.lift ?? undefined,
    generator: parsed.generator ?? undefined,
    serviceChargeKnown: parsed.serviceCharge !== null,
    brokerFeeKnown: parsed.brokerFee !== null,
  };

  // Parse service charge value if numeric
  if (parsed.serviceCharge && parsed.serviceCharge !== "extra" && parsed.serviceCharge !== "included") {
    const scNum = parseInt(parsed.serviceCharge.replace(/[^\d]/g, ""));
    if (!isNaN(scNum)) parsedJson.serviceCharge = scNum;
  } else if (parsed.serviceCharge === "included") {
    parsedJson.serviceCharge = 0;
    parsedJson.serviceChargeKnown = true;
  }

  // Parse broker fee
  if (parsed.brokerFee === "no-fee") {
    parsedJson.brokerFee = 0;
    parsedJson.brokerFeeKnown = true;
  } else if (parsed.brokerFee === "applicable") {
    parsedJson.brokerFeeKnown = false;
  }

  // Set tenant booleans
  const pref = parsedJson.tenantPreference;
  parsedJson.familyAllowed = pref === "family" || pref === "any";
  parsedJson.bachelorAllowed = pref === "bachelor" || pref === "student" || pref === "any";
  parsedJson.femaleFriendly = pref === "female" || pref === "any";
  parsedJson.studentFriendly = pref === "student" || pref === "any";

  // Calculate confidence score (0.0 - 1.0)
  const confidenceScore = calculateConfidence(parsedJson, parsed.missingFields);

  // Detect red flags
  const redFlags = detectRedFlags(parsedJson, rawText);

  // Detect good points
  const goodPoints = detectGoodPoints(parsedJson);

  return {
    id: `parsed-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    rawDocumentId,
    parserUsed: "regex",
    parsedJson: {
      ...parsedJson,
      goodPoints,
      redFlags,
      missingFields: parsed.missingFields,
    },
    confidenceScore,
    missingFields: parsed.missingFields,
    redFlags,
    needsReview: confidenceScore < 0.75,
  };
}

// ── Hybrid Extraction (regex + optional AI merge) ──

export function mergeExtractions(
  regex: HarvesterParsedListing,
  ai: Partial<HarvestedListing> | null
): HarvesterParsedListing {
  if (!ai) return regex;

  const merged: Partial<HarvestedListing> = { ...regex.parsedJson };

  // AI fills gaps only — regex values take priority
  const fields: (keyof HarvestedListing)[] = [
    "area", "rent", "bedrooms", "bathrooms", "sizeSqft", "floor",
    "tenantPreference", "advanceMonths", "gasType", "lift", "generator",
  ];

  for (const field of fields) {
    if (merged[field] === undefined && ai[field] !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (merged as any)[field] = ai[field];
    }
  }

  // Recalculate confidence with merged data
  const missingFields = detectMissingFields(merged);
  const confidenceScore = calculateConfidence(merged, missingFields);

  return {
    ...regex,
    parserUsed: "hybrid",
    parsedJson: {
      ...merged,
      missingFields,
    },
    confidenceScore,
    missingFields,
    needsReview: confidenceScore < 0.75,
  };
}

// ── Confidence Calculation ──

function calculateConfidence(
  parsed: Partial<HarvestedListing>,
  missingFields: string[]
): number {
  let score = 0.5; // base score

  // Critical fields boost
  if (parsed.area) score += 0.15;
  if (parsed.rent) score += 0.15;
  if (parsed.bedrooms) score += 0.05;
  if (parsed.tenantPreference && parsed.tenantPreference !== "unknown") score += 0.05;

  // Cost clarity boost
  if (parsed.serviceChargeKnown) score += 0.04;
  if (parsed.brokerFeeKnown) score += 0.04;
  if (parsed.advanceMonths !== undefined) score += 0.03;

  // Utility clarity boost
  if (parsed.gasType && parsed.gasType !== "unknown") score += 0.03;
  if (parsed.lift !== undefined) score += 0.02;
  if (parsed.generator !== undefined) score += 0.02;

  // Penalty for missing fields
  score -= missingFields.length * 0.02;

  return Math.max(0, Math.min(1, parseFloat(score.toFixed(2))));
}

// ── Red Flag Detection ──

function detectRedFlags(
  parsed: Partial<HarvestedListing>,
  rawText: string
): string[] {
  const flags: string[] = [];
  const text = rawText.toLowerCase();

  if (!parsed.serviceChargeKnown) {
    flags.push("Service charge unclear — could add ৳2,000–৳5,000/month");
  }
  if (!parsed.brokerFeeKnown) {
    flags.push("Broker fee unknown — may add up to 1 month rent");
  }
  if (parsed.gasType === "cylinder") {
    flags.push("Gas cylinder cost may be ৳1,500–৳2,500/month separate");
  }
  if (parsed.advanceMonths && parsed.advanceMonths >= 3) {
    flags.push(`High advance: ${parsed.advanceMonths} months required`);
  }
  if (text.includes("urgent") || text.includes("jaldi")) {
    flags.push("Pushy/urgent language — verify details carefully");
  }
  if (text.includes("media fee") || text.includes("মিডিয়া")) {
    flags.push("Broker/media fee applies");
  }
  if (parsed.lift && !parsed.generator) {
    flags.push("Lift present but no generator backup for power cuts");
  }

  return flags;
}

// ── Good Point Detection ──

function detectGoodPoints(parsed: Partial<HarvestedListing>): string[] {
  const points: string[] = [];

  if (parsed.brokerFee === 0 || parsed.brokerFeeKnown) {
    points.push("No broker fee — direct owner/contact");
  }
  if (parsed.serviceChargeKnown && parsed.serviceCharge !== undefined) {
    points.push("Service charge confirmed and transparent");
  }
  if (parsed.gasType === "line") {
    points.push("Government gas line connection (Titas)");
  }
  if (parsed.lift && parsed.generator) {
    points.push("Full lift + generator backup");
  }
  if (parsed.advanceMonths === 1) {
    points.push("Only 1 month advance — low entry cost");
  }

  return points;
}

// ── Missing Field Detection ──

function detectMissingFields(parsed: Partial<HarvestedListing>): string[] {
  const missing: string[] = [];

  if (!parsed.area) missing.push("Location/Area");
  if (!parsed.rent) missing.push("Rent Amount");
  if (!parsed.bedrooms) missing.push("Bedrooms Count");
  if (parsed.advanceMonths === undefined) missing.push("Upfront Advance/Deposit");
  if (!parsed.gasType || parsed.gasType === "unknown") missing.push("Gas Type (Line/Cylinder)");
  if (!parsed.serviceChargeKnown) missing.push("Service Charge Details");
  if (!parsed.brokerFeeKnown) missing.push("Broker Fee status");
  if (parsed.lift === undefined) missing.push("Lift Facility");
  if (parsed.generator === undefined) missing.push("Generator Backup");

  return missing;
}

// ── Helper Mappers ──

function mapTenantPreference(
  pref: string | null
): HarvestedListing["tenantPreference"] {
  if (!pref) return "unknown";
  const map: Record<string, HarvestedListing["tenantPreference"]> = {
    family: "family",
    bachelor: "bachelor",
    student: "student",
    female: "female",
    any: "any",
  };
  return map[pref.toLowerCase()] || "unknown";
}

function mapGasType(
  gas: string | null
): HarvestedListing["gasType"] {
  if (!gas) return "unknown";
  if (gas.includes("line") || gas.includes("titas")) return "line";
  if (gas.includes("cylinder") || gas.includes("lpg")) return "cylinder";
  return "unknown";
}
