/**
 * Harvester Orchestrator Service
 *
 * Master pipeline orchestrator. Manages harvest runs,
 * coordinates all services, and provides unified stats.
 */

import { HarvestRun, HarvesterStats, ReviewQueueItem, HarvestedListing } from "@/lib/types/harvester";
import { getRawDocumentCount, getDocumentStats } from "./raw-document.service";
import { getHarvestedListings, getPublishedListings, getListingsByStatus } from "./structured-listing-builder.service";
import { getChunkCount } from "./chunk-builder.service";
import { getOfferSnapshots, calculateBestDealScore } from "./offer-snapshot.service";

// ── Harvest Runs Store ──
let harvestRuns: HarvestRun[] = [];

// ── Review Queue Store ──
let reviewQueue: ReviewQueueItem[] = [];

// ── Lazy Demo Seeder ──
let demoSeeded = false;

export function ensureDemoSeeded(): void {
  if (demoSeeded) return;
  demoSeeded = true;

  try {
    const { DEMO_HARVEST_RUNS, DEMO_REVIEW_QUEUE, DEMO_PUBLISHED_LISTINGS } = require("../harvester-snapshots/demo-harvest-run");
    harvestRuns = [...DEMO_HARVEST_RUNS];
    reviewQueue = [...DEMO_REVIEW_QUEUE];

    // Seed raw documents
    const { seedRawDocuments, getRawDocuments } = require("./raw-document.service");
    if (getRawDocuments().length === 0) {
      const { DEMO_RAW_DOCUMENTS } = require("../harvester-snapshots/raw-documents");
      seedRawDocuments(DEMO_RAW_DOCUMENTS);
    }

    // Seed harvested listings
    const { seedHarvestedListings, getHarvestedListings } = require("./structured-listing-builder.service");
    if (getHarvestedListings().length === 0) {
      const { DEMO_HARVESTED_LISTINGS } = require("../harvester-snapshots/listings");
      seedHarvestedListings(DEMO_HARVESTED_LISTINGS);
      
      const existingIds = new Set(getHarvestedListings().map((l: HarvestedListing) => l.id));
      const toSeed = DEMO_PUBLISHED_LISTINGS.filter((l: any) => !existingIds.has(l.id));
      seedHarvestedListings(toSeed as any[]);
    }

    // Seed offer snapshots
    const { seedOfferSnapshots, getOfferSnapshots } = require("./offer-snapshot.service");
    if (getOfferSnapshots().length === 0) {
      const { DEMO_OFFER_SNAPSHOTS } = require("../harvester-snapshots/offer-snapshots");
      seedOfferSnapshots(DEMO_OFFER_SNAPSHOTS);
    }
  } catch (err) {
    console.error("Failed to seed demo data in harvester orchestrator:", err);
  }
}

// ── Harvest Runs ──

export function addHarvestRun(run: HarvestRun): void {
  harvestRuns.push(run);
}

export function getHarvestRuns(): HarvestRun[] {
  ensureDemoSeeded();
  return [...harvestRuns].sort((a, b) =>
    new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
  );
}

export function getLatestRun(): HarvestRun | undefined {
  return getHarvestRuns()[0];
}

// ── Review Queue ──

export function addToReviewQueue(item: ReviewQueueItem): void {
  reviewQueue.push(item);
}

export function getReviewQueue(): ReviewQueueItem[] {
  ensureDemoSeeded();
  return reviewQueue.filter((i) => i.status === "pending");
}

export function approveReviewItem(itemId: string, note?: string): boolean {
  const idx = reviewQueue.findIndex((i) => i.id === itemId);
  if (idx === -1) return false;
  reviewQueue[idx].status = "approved";
  reviewQueue[idx].reviewedAt = new Date().toISOString();
  reviewQueue[idx].reviewNote = note;
  // Also update the listing status
  const { updateListingStatus } = require("./structured-listing-builder.service");
  updateListingStatus(reviewQueue[idx].listingId, "active");
  return true;
}

export function rejectReviewItem(itemId: string, note?: string): boolean {
  const idx = reviewQueue.findIndex((i) => i.id === itemId);
  if (idx === -1) return false;
  reviewQueue[idx].status = "rejected";
  reviewQueue[idx].reviewedAt = new Date().toISOString();
  reviewQueue[idx].reviewNote = note;
  const { updateListingStatus } = require("./structured-listing-builder.service");
  updateListingStatus(reviewQueue[idx].listingId, "rejected");
  return true;
}

// ── Auto-queue listings needing review ──

export function queueListingsForReview(): number {
  const needsReview = getListingsByStatus("needs_review");
  let queued = 0;

  for (const listing of needsReview) {
    const alreadyQueued = reviewQueue.some((q) => q.listingId === listing.id);
    if (alreadyQueued) continue;

    addToReviewQueue({
      id: `review-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      listingId: listing.id,
      rawDocumentId: listing.rawDocumentId,
      reason: listing.missingFields.length > 3
        ? "Too many missing fields"
        : listing.listingTrust === "low"
        ? "Low confidence"
        : "Needs verification",
      rawTextPreview: listing.title,
      area: listing.area,
      rent: listing.rent,
      confidenceScore: listing.listingTrust === "high" ? 0.85 : listing.listingTrust === "medium" ? 0.65 : 0.4,
      missingFields: listing.missingFields,
      redFlags: listing.redFlags,
      status: "pending",
    });
    queued++;
  }

  return queued;
}

// ── Stats ──

export function getHarvesterStats(): HarvesterStats {
  ensureDemoSeeded();
  const allListings = getHarvestedListings();
  const published = getPublishedListings();
  const docStats = getDocumentStats();

  // Count hidden cost warnings
  let hiddenCostWarnings = 0;
  for (const l of allListings) {
    if (!l.serviceChargeKnown) hiddenCostWarnings++;
    if (!l.brokerFeeKnown) hiddenCostWarnings++;
  }

  // Source breakdown
  const sourceBreakdown: Record<string, number> = {};
  for (const l of allListings) {
    sourceBreakdown[l.sourceId] = (sourceBreakdown[l.sourceId] || 0) + 1;
  }

  // Confidence distribution
  const confDist = { high: 0, medium: 0, low: 0 };
  for (const l of allListings) {
    confDist[l.listingTrust]++;
  }

  // Freshness distribution
  const freshDist = { fresh: 0, aging: 0, stale: 0, expired: 0 };
  for (const l of allListings) {
    freshDist[l.freshnessStatus]++;
  }

  // Area profiles matched
  const areaMatched = allListings.filter((l) => l.areaProfile).length;

  // Best deals
  const offers = getOfferSnapshots();
  let bestDeals = 0;
  for (const l of published) {
    const offer = offers.find((o) => o.listingId === l.id);
    if (offer) {
      const deal = calculateBestDealScore(l, offer);
      if (deal.score >= 75) bestDeals++;
    }
  }

  return {
    totalRawDocuments: getRawDocumentCount(),
    totalParsedListings: docStats.parsed,
    totalPublishedListings: published.length,
    totalDuplicatesRemoved: getListingsByStatus("duplicate").length,
    totalHiddenCostWarnings: hiddenCostWarnings,
    totalStaleListings: getListingsByStatus("stale").length,
    totalChunksCreated: getChunkCount(),
    totalBestDealsSelected: Math.min(bestDeals, 3),
    totalAreaProfilesMatched: areaMatched,
    totalNeedsReview: getReviewQueue().length,
    sourceBreakdown,
    confidenceDistribution: confDist,
    freshnessDistribution: freshDist,
  };
}

// ── Seed & Reset ──

export function seedHarvestRuns(runs: HarvestRun[]): void {
  harvestRuns = [...harvestRuns, ...runs];
}

export function seedReviewQueue(items: ReviewQueueItem[]): void {
  reviewQueue = [...reviewQueue, ...items];
}

export function resetOrchestrator(): void {
  harvestRuns = [];
  reviewQueue = [];
}
