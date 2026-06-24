/**
 * Enrichment Service
 *
 * Enriches listings with area context from static area profiles.
 * Generates human-readable insights for each listing.
 */

import { HarvestedListing } from "@/lib/types/harvester";
import { areas } from "@/lib/data/areas";
import { AreaProfile } from "@/lib/types";

export function enrichListingWithArea(listing: HarvestedListing): HarvestedListing {
  const areaProfile = findAreaProfile(listing.area);
  if (!areaProfile) return listing;

  // Attach area profile summary
  listing.areaProfile = {
    rentRange: areaProfile.rentRange,
    bestFor: areaProfile.bestFor,
    avoidIf: areaProfile.avoidIf,
    commuteNotes: areaProfile.commuteNotes,
    waterloggingRisk: areaProfile.waterloggingRisk,
    mainTradeoff: areaProfile.mainTradeoff,
  };

  // Set waterlogging risk from area if unknown
  if (listing.waterloggingRisk === "unknown") {
    listing.waterloggingRisk = areaProfile.waterloggingRisk;
  }

  // Generate contextual insight
  listing.areaContext = generateAreaContext(listing, areaProfile);

  return listing;
}

function findAreaProfile(areaName: string): AreaProfile | undefined {
  return areas.find(
    (a) => a.name.toLowerCase() === areaName.toLowerCase()
  );
}

function generateAreaContext(listing: HarvestedListing, area: AreaProfile): string {
  const parts: string[] = [];

  // Rent comparison
  if (listing.rent) {
    if (listing.rent < area.rentLow) {
      parts.push(`This rent (৳${listing.rent.toLocaleString()}) is below the typical ${area.name} range (${area.rentRange}) — verify the listing is genuine.`);
    } else if (listing.rent > area.rentHigh) {
      parts.push(`This rent (৳${listing.rent.toLocaleString()}) is above the typical ${area.name} range (${area.rentRange}).`);
    } else {
      parts.push(`Rent is within the normal ${area.name} range (${area.rentRange}).`);
    }
  }

  // Household suitability
  if (listing.tenantPreference === "family" && area.familySuitability >= 8) {
    parts.push(`${area.name} is excellent for families.`);
  }
  if (listing.tenantPreference === "bachelor" && area.bachelorSuitability >= 8) {
    parts.push(`${area.name} is highly bachelor-friendly.`);
  }
  if (listing.tenantPreference === "female" && area.femaleSuitability >= 8) {
    parts.push(`${area.name} is considered safe for women.`);
  }

  // Waterlogging warning
  if (area.waterloggingRisk === "high") {
    parts.push(`Warning: ${area.name} has significant waterlogging during monsoons.`);
  }

  // Main tradeoff
  parts.push(area.mainTradeoff);

  return parts.join(" ");
}

export function getAreaProfileForListing(areaName: string): AreaProfile | undefined {
  return findAreaProfile(areaName);
}

export function getAllEnrichedAreaNames(): string[] {
  return areas.map((a) => a.name);
}
