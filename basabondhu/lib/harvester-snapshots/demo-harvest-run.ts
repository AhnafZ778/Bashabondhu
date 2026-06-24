/**
 * Demo Harvest Run — Static Snapshot Data
 *
 * Provides realistic demo data so the dashboard always looks impressive.
 * Metrics: 127 docs → 92 parsed → 18 dupes → 61 published → 26 hidden-cost → 3 best deals
 */

import { HarvestRun, HarvesterStats, ReviewQueueItem, DataSource, RawDocument, HarvestedListing, OfferSnapshot, ListingChunk } from "@/lib/types/harvester";

export const DEMO_STATS: HarvesterStats = {
  totalRawDocuments: 127,
  totalParsedListings: 92,
  totalPublishedListings: 61,
  totalDuplicatesRemoved: 18,
  totalHiddenCostWarnings: 26,
  totalStaleListings: 14,
  totalChunksCreated: 347,
  totalBestDealsSelected: 3,
  totalAreaProfilesMatched: 10,
  totalNeedsReview: 9,
  sourceBreakdown: {
    "src-user-paste": 34,
    "src-partner-csv": 28,
    "src-partner-sheet": 15,
    "src-agency-public": 12,
    "src-facebook-paste": 18,
    "src-cached-crawl": 8,
    "src-osm": 10,
    "src-seed": 2,
  },
  confidenceDistribution: { high: 41, medium: 35, low: 16 },
  freshnessDistribution: { fresh: 47, aging: 18, stale: 14, expired: 13 },
};

export const DEMO_HARVEST_RUNS: HarvestRun[] = [
  {
    id: "run-demo-1",
    sourceId: "src-user-paste",
    runType: "user_submit",
    status: "completed",
    startedAt: new Date(Date.now() - 3600000).toISOString(),
    finishedAt: new Date(Date.now() - 3590000).toISOString(),
    totalFetched: 34,
    totalParsed: 31,
    totalPublished: 24,
    totalRejected: 3,
    totalDuplicates: 4,
  },
  {
    id: "run-demo-2",
    sourceId: "src-partner-csv",
    runType: "partner_import",
    status: "completed",
    startedAt: new Date(Date.now() - 7200000).toISOString(),
    finishedAt: new Date(Date.now() - 7190000).toISOString(),
    totalFetched: 50,
    totalParsed: 43,
    totalPublished: 28,
    totalRejected: 5,
    totalDuplicates: 8,
  },
  {
    id: "run-demo-3",
    sourceId: "src-agency-public",
    runType: "manual",
    status: "completed",
    startedAt: new Date(Date.now() - 14400000).toISOString(),
    finishedAt: new Date(Date.now() - 14350000).toISOString(),
    totalFetched: 12,
    totalParsed: 9,
    totalPublished: 5,
    totalRejected: 2,
    totalDuplicates: 3,
  },
];

export const DEMO_REVIEW_QUEUE: ReviewQueueItem[] = [
  {
    id: "rev-1", listingId: "hlst-demo-1", rawDocumentId: "rdoc-demo-1",
    reason: "Service charge and broker fee missing",
    rawTextPreview: "Banasree te 3 bed flat rent korbo, 25k. Family only. Call korun.",
    area: "Banasree", rent: 25000, confidenceScore: 0.62,
    missingFields: ["Service Charge", "Broker Fee", "Gas Type"],
    redFlags: ["Service charge unclear", "Broker fee unknown"],
    status: "pending",
  },
  {
    id: "rev-2", listingId: "hlst-demo-2", rawDocumentId: "rdoc-demo-2",
    reason: "Low confidence extraction",
    rawTextPreview: "flat ache Badda. cheap rent. bachelor ok. call koren.",
    area: "Badda", rent: undefined, confidenceScore: 0.38,
    missingFields: ["Rent", "Bedrooms", "Gas Type", "Lift", "Generator"],
    redFlags: ["Minimal information", "No rent specified"],
    status: "pending",
  },
  {
    id: "rev-3", listingId: "hlst-demo-3", rawDocumentId: "rdoc-demo-3",
    reason: "Possible duplicate",
    rawTextPreview: "Mohakhali flat 2 bed 28k, service charge 4000.",
    area: "Mohakhali", rent: 28000, confidenceScore: 0.71,
    missingFields: ["Broker Fee"],
    redFlags: ["Possible duplicate of existing listing"],
    status: "pending",
  },
];

// Demo published listings (minimal set for dashboard display)
export const DEMO_PUBLISHED_LISTINGS: Partial<HarvestedListing>[] = [
  {
    id: "hlst-pub-1", sourceId: "src-user-paste", rawDocumentId: "rdoc-1",
    title: "Banasree Block C 2-Bed Family Flat ৳20,000", area: "Banasree",
    city: "Dhaka", rent: 20000, bedrooms: 2, bathrooms: 2,
    tenantPreference: "family", familyAllowed: true, bachelorAllowed: false,
    femaleFriendly: false, studentFriendly: false, advanceMonths: 2,
    serviceCharge: 3000, serviceChargeKnown: true, brokerFee: 0, brokerFeeKnown: true,
    gasType: "line", lift: true, generator: false,
    utilityClarity: "clear", waterloggingRisk: "high",
    listingTrust: "high", freshnessStatus: "fresh", status: "active",
    goodPoints: ["No broker fee", "Gas line", "Lift available"],
    redFlags: ["Waterlogging risk", "No generator"], missingFields: [],
    bestDealScore: 82, bestDealLabel: "Best practical deal",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "hlst-pub-2", sourceId: "src-partner-csv", rawDocumentId: "rdoc-2",
    title: "Mohakhali 2-Bed Near Office Zone ৳28,000", area: "Mohakhali",
    city: "Dhaka", rent: 28000, bedrooms: 2, bathrooms: 2,
    tenantPreference: "any", familyAllowed: true, bachelorAllowed: true,
    femaleFriendly: true, studentFriendly: true, advanceMonths: 1,
    serviceCharge: 4000, serviceChargeKnown: true, brokerFee: 0, brokerFeeKnown: true,
    gasType: "line", lift: true, generator: true,
    utilityClarity: "clear", waterloggingRisk: "low",
    listingTrust: "high", freshnessStatus: "fresh", status: "active",
    goodPoints: ["Only 1 month advance", "Full backup", "Gas line"],
    redFlags: [], missingFields: [],
    bestDealScore: 91, bestDealLabel: "Best practical deal",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: "hlst-pub-3", sourceId: "src-facebook-paste", rawDocumentId: "rdoc-3",
    title: "Mirpur 10 Budget Flat ৳14,000", area: "Mirpur",
    city: "Dhaka", rent: 14000, bedrooms: 2, bathrooms: 2,
    tenantPreference: "any", familyAllowed: true, bachelorAllowed: true,
    femaleFriendly: true, studentFriendly: true, advanceMonths: 2,
    serviceCharge: 1500, serviceChargeKnown: true, brokerFee: 0, brokerFeeKnown: true,
    gasType: "cylinder", lift: false, generator: false,
    utilityClarity: "clear", waterloggingRisk: "medium",
    listingTrust: "medium", freshnessStatus: "fresh", status: "active",
    goodPoints: ["Near Metro Rail", "Cheap rent", "Bachelor friendly"],
    redFlags: ["No lift", "Cylinder gas"], missingFields: [],
    bestDealScore: 76, bestDealLabel: "Cheapest monthly rent",
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date(Date.now() - 259200000).toISOString(),
  },
];
