/**
 * Freshness Service
 *
 * Tracks listing freshness based on source type and age.
 * Prevents stale listings from being shown as "Visit" without warning.
 */

import { HarvestedListing, DataSourceType } from "@/lib/types/harvester";

// ── Freshness Windows (in days) ──

const FRESHNESS_WINDOWS: Record<
  DataSourceType,
  { agingDays: number; staleDays: number }
> = {
  user_paste: { agingDays: 7, staleDays: 14 },
  partner_csv: { agingDays: 14, staleDays: 30 },
  google_sheet: { agingDays: 14, staleDays: 30 },
  manual_admin: { agingDays: 14, staleDays: 30 },
  agency_website: { agingDays: 7, staleDays: 14 },
  public_directory: { agingDays: 7, staleDays: 14 },
  cached_snapshot: { agingDays: 30, staleDays: 60 },
  osm_area_data: { agingDays: 365, staleDays: 730 },
  seed: { agingDays: 30, staleDays: 90 },
};

// ── Freshness Calculation ──

export function calculateFreshnessStatus(
  listing: HarvestedListing,
  sourceType: DataSourceType = "user_paste"
): HarvestedListing["freshnessStatus"] {
  const windows = FRESHNESS_WINDOWS[sourceType] || FRESHNESS_WINDOWS.user_paste;
  const createdAt = new Date(listing.createdAt).getTime();
  const now = Date.now();
  const ageDays = (now - createdAt) / (1000 * 60 * 60 * 24);

  if (ageDays <= windows.agingDays) return "fresh";
  if (ageDays <= windows.staleDays) return "aging";
  if (ageDays <= windows.staleDays * 1.5) return "stale";
  return "expired";
}

// ── User-Facing Labels ──

export function getFreshnessLabel(
  status: HarvestedListing["freshnessStatus"]
): string {
  const labels: Record<HarvestedListing["freshnessStatus"], string> = {
    fresh: "Fresh",
    aging: "Call first",
    stale: "Possibly outdated",
    expired: "Needs confirmation",
  };
  return labels[status];
}

export function getFreshnessColor(
  status: HarvestedListing["freshnessStatus"]
): string {
  const colors: Record<HarvestedListing["freshnessStatus"], string> = {
    fresh: "#2E7D5B",   // green
    aging: "#D4943A",   // amber
    stale: "#C97D2F",   // dark amber
    expired: "#C44040", // red
  };
  return colors[status];
}

// ── Batch Staleness Update ──

export function markStaleListings(
  listings: HarvestedListing[],
  sourceType: DataSourceType = "user_paste"
): { updated: number; staleIds: string[] } {
  let updated = 0;
  const staleIds: string[] = [];

  for (const listing of listings) {
    const newStatus = calculateFreshnessStatus(listing, sourceType);
    if (newStatus !== listing.freshnessStatus) {
      listing.freshnessStatus = newStatus;
      listing.updatedAt = new Date().toISOString();
      updated++;

      if (newStatus === "stale" || newStatus === "expired") {
        staleIds.push(listing.id);
        if (listing.status === "active") {
          listing.status = "stale";
        }
      }
    }
  }

  return { updated, staleIds };
}

// ── Freshness Warning ──

export function shouldShowFreshnessWarning(
  listing: HarvestedListing
): boolean {
  return (
    listing.freshnessStatus === "aging" ||
    listing.freshnessStatus === "stale" ||
    listing.freshnessStatus === "expired"
  );
}

export function getFreshnessWarning(
  listing: HarvestedListing
): string | null {
  if (listing.freshnessStatus === "aging") {
    return "This listing was posted over a week ago. Call to confirm availability.";
  }
  if (listing.freshnessStatus === "stale") {
    return "This listing may be outdated. Confirm availability before visiting.";
  }
  if (listing.freshnessStatus === "expired") {
    return "This listing is likely no longer available. Use for reference only.";
  }
  return null;
}

// ── Days Since Posted ──

export function getDaysSincePosted(listing: HarvestedListing): number {
  const createdAt = new Date(listing.createdAt).getTime();
  const now = Date.now();
  return Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));
}
