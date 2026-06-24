/**
 * Structured Listing Builder Service
 *
 * Converts HarvesterParsedListing → HarvestedListing.
 * Maps parsed fields, fills defaults, generates title,
 * and attaches provenance metadata.
 */

import {
  HarvesterParsedListing,
  HarvestedListing,
} from "@/lib/types/harvester";

// ── In-Memory Store ──

let harvestedListings: HarvestedListing[] = [];

// ── Builder ──

export function buildStructuredListing(
  parsed: HarvesterParsedListing,
  sourceId: string,
  sourceUrl?: string
): HarvestedListing {
  const p = parsed.parsedJson;
  const now = new Date().toISOString();

  // Generate title
  const title = generateTitle(p);

  // Determine utility clarity
  const utilityClarity = determineUtilityClarity(p);

  // Determine listing trust
  const listingTrust = determineTrust(parsed.confidenceScore);

  const listing: HarvestedListing = {
    id: `hlst-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    sourceId,
    rawDocumentId: parsed.rawDocumentId,
    title,
    area: p.area || "Unknown",
    addressHint: p.addressHint,
    city: "Dhaka",
    sourceUrl,

    rent: p.rent || 0,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    sizeSqft: p.sizeSqft,
    floor: p.floor,

    tenantPreference: p.tenantPreference || "unknown",
    familyAllowed: p.familyAllowed ?? false,
    bachelorAllowed: p.bachelorAllowed ?? false,
    femaleFriendly: p.femaleFriendly ?? false,
    studentFriendly: p.studentFriendly ?? false,

    advanceMonths: p.advanceMonths,
    serviceCharge: p.serviceCharge,
    serviceChargeKnown: p.serviceChargeKnown ?? false,
    brokerFee: p.brokerFee,
    brokerFeeKnown: p.brokerFeeKnown ?? false,

    gasType: p.gasType || "unknown",
    lift: p.lift,
    generator: p.generator,

    utilityClarity,
    waterloggingRisk: p.waterloggingRisk || "unknown",

    listingTrust,
    freshnessStatus: "fresh",
    status: determineStatus(parsed),

    goodPoints: p.goodPoints || [],
    redFlags: p.redFlags || [],
    missingFields: parsed.missingFields,

    createdAt: now,
    updatedAt: now,
    expiresAt: calculateExpiryDate(now),
  };

  harvestedListings.push(listing);
  return listing;
}

// ── Getters ──

export function getHarvestedListings(): HarvestedListing[] {
  return [...harvestedListings];
}

export function getPublishedListings(): HarvestedListing[] {
  return harvestedListings.filter((l) => l.status === "active");
}

export function getListingById(id: string): HarvestedListing | undefined {
  return harvestedListings.find((l) => l.id === id);
}

export function getListingsByArea(area: string): HarvestedListing[] {
  return harvestedListings.filter(
    (l) => l.area.toLowerCase() === area.toLowerCase()
  );
}

export function getListingsByStatus(
  status: HarvestedListing["status"]
): HarvestedListing[] {
  return harvestedListings.filter((l) => l.status === status);
}

export function updateListingStatus(
  id: string,
  status: HarvestedListing["status"]
): HarvestedListing | undefined {
  const index = harvestedListings.findIndex((l) => l.id === id);
  if (index === -1) return undefined;
  harvestedListings[index] = {
    ...harvestedListings[index],
    status,
    updatedAt: new Date().toISOString(),
  };
  return harvestedListings[index];
}

export function updateListing(
  id: string,
  updates: Partial<HarvestedListing>
): HarvestedListing | undefined {
  const index = harvestedListings.findIndex((l) => l.id === id);
  if (index === -1) return undefined;
  harvestedListings[index] = {
    ...harvestedListings[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  return harvestedListings[index];
}

export function seedHarvestedListings(listings: HarvestedListing[]): void {
  harvestedListings = [...harvestedListings, ...listings];
}

export function getListingCount(): number {
  return harvestedListings.length;
}

export function resetListings(): void {
  harvestedListings = [];
}

// ── Private Helpers ──

function generateTitle(p: Partial<HarvestedListing>): string {
  const parts: string[] = [];

  if (p.area) parts.push(p.area);
  if (p.bedrooms) parts.push(`${p.bedrooms}-Bed`);

  const prefMap: Record<string, string> = {
    family: "Family Flat",
    bachelor: "Bachelor Flat",
    student: "Student Sublet",
    female: "Female Sublet",
    any: "Apartment",
    unknown: "Flat",
  };
  parts.push(prefMap[p.tenantPreference || "unknown"] || "Flat");

  if (p.rent) parts.push(`৳${p.rent.toLocaleString()}`);

  return parts.join(" ") || "Untitled Listing";
}

function determineUtilityClarity(
  p: Partial<HarvestedListing>
): HarvestedListing["utilityClarity"] {
  let clarity = 0;
  if (p.serviceChargeKnown) clarity++;
  if (p.brokerFeeKnown) clarity++;
  if (p.gasType && p.gasType !== "unknown") clarity++;
  if (p.lift !== undefined) clarity++;
  if (p.generator !== undefined) clarity++;

  if (clarity >= 4) return "clear";
  if (clarity >= 2) return "partial";
  return "unclear";
}

function determineTrust(
  confidence: number
): HarvestedListing["listingTrust"] {
  if (confidence >= 0.8) return "high";
  if (confidence >= 0.6) return "medium";
  return "low";
}

function determineStatus(
  parsed: HarvesterParsedListing
): HarvestedListing["status"] {
  const p = parsed.parsedJson;

  if (!p.area || !p.rent) return "needs_review";
  if (parsed.confidenceScore >= 0.75) return "active";
  if (parsed.confidenceScore >= 0.55) return "needs_review";
  return "needs_review";
}

function calculateExpiryDate(createdAt: string): string {
  const date = new Date(createdAt);
  date.setDate(date.getDate() + 14); // 2 weeks default
  return date.toISOString();
}
