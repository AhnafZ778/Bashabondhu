/**
 * BasaBondhu Data Harvester — Type Definitions
 *
 * Complete type system for the real-world data supply chain.
 * Tracks data provenance, extraction confidence, freshness,
 * and quality for every listing flowing through the pipeline.
 */

// ── Source Types ──

export type DataSourceType =
  | "user_paste"
  | "partner_csv"
  | "google_sheet"
  | "manual_admin"
  | "agency_website"
  | "public_directory"
  | "cached_snapshot"
  | "osm_area_data"
  | "seed";

export type DataSource = {
  id: string;
  name: string;
  type: DataSourceType;
  baseUrl?: string;
  permissionStatus:
    | "user_submitted"
    | "partner_allowed"
    | "public_allowed"
    | "demo_snapshot"
    | "manual"
    | "unknown"
    | "blocked";
  riskLevel: "low" | "medium" | "high";
  enabled: boolean;
  refreshFrequencyHours?: number;
  lastRunAt?: string;
  notes?: string;
};

// ── Harvest Run ──

export type HarvestRun = {
  id: string;
  sourceId: string;
  runType:
    | "manual"
    | "scheduled"
    | "user_submit"
    | "partner_import"
    | "snapshot";
  status: "queued" | "running" | "completed" | "failed" | "partial";
  startedAt: string;
  finishedAt?: string;
  totalFetched: number;
  totalParsed: number;
  totalPublished: number;
  totalRejected: number;
  totalDuplicates: number;
  errorLog?: string;
};

// ── Raw Document ──

export type RawDocument = {
  id: string;
  sourceId: string;
  harvestRunId?: string;
  sourceUrl?: string;
  rawText?: string;
  rawHtml?: string;
  rawJson?: unknown;
  contentHash: string;
  capturedAt: string;
  consentType:
    | "user_submitted"
    | "partner_provided"
    | "public_allowed"
    | "manual_demo"
    | "cached_snapshot";
  processingStatus: "pending" | "parsed" | "failed" | "rejected";
};

// ── Parsed Listing (Harvester Extraction Output) ──

export type HarvesterParsedListing = {
  id: string;
  rawDocumentId: string;
  parserUsed: "regex" | "openrouter" | "crawl4ai" | "hybrid" | "manual";
  parsedJson: Partial<HarvestedListing>;
  confidenceScore: number;
  missingFields: string[];
  redFlags: string[];
  needsReview: boolean;
};

// ── Harvested Listing (Fully Structured) ──

export type HarvestedListing = {
  id: string;
  sourceId: string;
  rawDocumentId: string;
  title: string;
  area: string;
  addressHint?: string;
  city: "Dhaka";
  sourceUrl?: string;

  rent: number;
  bedrooms?: number;
  bathrooms?: number;
  sizeSqft?: number;
  floor?: number;

  tenantPreference:
    | "family"
    | "bachelor"
    | "student"
    | "female"
    | "any"
    | "unknown";
  familyAllowed: boolean;
  bachelorAllowed: boolean;
  femaleFriendly: boolean;
  studentFriendly: boolean;

  advanceMonths?: number;
  serviceCharge?: number | null;
  serviceChargeKnown: boolean;
  brokerFee?: number | null;
  brokerFeeKnown: boolean;

  gasType: "line" | "cylinder" | "unknown";
  lift?: boolean;
  generator?: boolean;

  utilityClarity: "clear" | "partial" | "unclear";
  waterloggingRisk: "low" | "medium" | "high" | "unknown";

  listingTrust: "high" | "medium" | "low";
  freshnessStatus: "fresh" | "aging" | "stale" | "expired";
  status: "active" | "needs_review" | "stale" | "duplicate" | "rejected";

  goodPoints: string[];
  redFlags: string[];
  missingFields: string[];

  // Area enrichment (attached post-enrichment)
  areaContext?: string;
  areaProfile?: {
    rentRange: string;
    bestFor: string[];
    avoidIf: string[];
    commuteNotes: string;
    waterloggingRisk: string;
    mainTradeoff: string;
  };

  // Best deal scoring
  bestDealScore?: number;
  bestDealLabel?: string;
  bestDealExplanation?: string;

  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
};

// ── Offer Snapshot ──

export type OfferSnapshot = {
  id: string;
  listingId: string;
  offerType:
    | "listed"
    | "negotiated"
    | "partner_quote"
    | "broker_quote"
    | "estimated";
  monthlyRent: number;
  advanceMonths?: number;
  serviceCharge?: number | null;
  brokerFee?: number | null;
  movingEstimate?: number;
  totalFirstMonthCost: number;
  negotiable: boolean;
  includedUtilities: string[];
  confidence: "confirmed" | "estimated" | "unconfirmed";
  validUntil?: string;
  capturedAt: string;
  warnings: string[];
};

// ── Listing Chunk (for RAG) ──

export type ListingChunk = {
  id: string;
  listingId: string;
  chunkType:
    | "summary"
    | "cost"
    | "rules"
    | "utility"
    | "location"
    | "risk"
    | "source_note";
  content: string;
  metadata: {
    area: string;
    rent?: number;
    tenantPreference?: string;
    sourceType: string;
    freshnessStatus: string;
  };
  embedding?: number[];
};

// ── Review Queue Item ──

export type ReviewQueueItem = {
  id: string;
  listingId: string;
  rawDocumentId: string;
  reason: string;
  rawTextPreview: string;
  area?: string;
  rent?: number;
  confidenceScore: number;
  missingFields: string[];
  redFlags: string[];
  status: "pending" | "approved" | "rejected" | "merged";
  reviewedAt?: string;
  reviewNote?: string;
};

// ── Harvester Stats ──

export type HarvesterStats = {
  totalRawDocuments: number;
  totalParsedListings: number;
  totalPublishedListings: number;
  totalDuplicatesRemoved: number;
  totalHiddenCostWarnings: number;
  totalStaleListings: number;
  totalChunksCreated: number;
  totalBestDealsSelected: number;
  totalAreaProfilesMatched: number;
  totalNeedsReview: number;
  sourceBreakdown: Record<string, number>;
  confidenceDistribution: {
    high: number;
    medium: number;
    low: number;
  };
  freshnessDistribution: {
    fresh: number;
    aging: number;
    stale: number;
    expired: number;
  };
};

// ── Pipeline Step (for live progress UI) ──

export type PipelineStep = {
  id: string;
  label: string;
  status: "pending" | "running" | "completed" | "failed" | "skipped";
  detail?: string;
  duration?: number;
};

// ── User Paste Request/Response ──

export type UserPasteRequest = {
  rawText: string;
  userContext?: {
    householdType?: string;
    budget?: number;
    maxFirstMonthCash?: number;
  };
};

export type UserPasteResponse = {
  ok: boolean;
  createdListingId: string;
  rawDocumentId: string;
  parserUsed: string;
  confidenceScore: number;
  parsedListing: Partial<HarvestedListing>;
  missingFields: string[];
  redFlags: string[];
  goodPoints: string[];
  verdict: "visit" | "call_first" | "maybe" | "avoid";
  questions: string[];
  offerSnapshot?: OfferSnapshot;
  pipelineSteps: PipelineStep[];
};

// ── CSV Import Summary ──

export type ImportSummary = {
  totalRows: number;
  published: number;
  needsReview: number;
  rejected: number;
  duplicates: number;
  errors: string[];
};
