/**
 * Chunk Builder Service
 *
 * Creates RAG chunks from listings for search/retrieval.
 * MVP: keyword + metadata retrieval (no embeddings yet).
 */

import { ListingChunk, HarvestedListing, OfferSnapshot } from "@/lib/types/harvester";

// ── In-Memory Store ──
let chunks: ListingChunk[] = [];

export function buildChunksForListing(
  listing: HarvestedListing,
  offer?: OfferSnapshot
): ListingChunk[] {
  const meta = {
    area: listing.area,
    rent: listing.rent,
    tenantPreference: listing.tenantPreference,
    sourceType: listing.sourceId,
    freshnessStatus: listing.freshnessStatus,
  };

  const created: ListingChunk[] = [];
  const mk = (type: ListingChunk["chunkType"], content: string) => {
    const c: ListingChunk = {
      id: `chunk-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      listingId: listing.id,
      chunkType: type,
      content,
      metadata: meta,
    };
    chunks.push(c);
    created.push(c);
    return c;
  };

  // Summary chunk
  const beds = listing.bedrooms ? `${listing.bedrooms}-Bed` : "";
  const prefLabel = listing.tenantPreference !== "unknown" ? listing.tenantPreference : "";
  mk("summary",
    `${listing.area} ${beds} ${prefLabel} Flat. Rent ৳${listing.rent?.toLocaleString() || "N/A"}. ${listing.goodPoints.slice(0, 2).join(". ")}.`
  );

  // Cost chunk
  if (offer) {
    const sc = listing.serviceChargeKnown ? `SC ৳${(listing.serviceCharge ?? 0).toLocaleString()}` : "SC unknown";
    const bf = listing.brokerFeeKnown ? `Broker ৳${(listing.brokerFee ?? 0).toLocaleString()}` : "Broker fee unknown";
    mk("cost",
      `Advance ${listing.advanceMonths ?? "?"} months. ${sc}. ${bf}. Est. first-month ৳${offer.totalFirstMonthCost.toLocaleString()}.`
    );
  }

  // Rules chunk
  if (listing.tenantPreference !== "unknown" || listing.familyAllowed || listing.bachelorAllowed) {
    const rules: string[] = [];
    if (listing.tenantPreference !== "unknown") rules.push(`${listing.tenantPreference} preferred`);
    if (listing.familyAllowed) rules.push("family allowed");
    if (listing.bachelorAllowed) rules.push("bachelor allowed");
    if (listing.femaleFriendly) rules.push("female friendly");
    mk("rules", rules.join(". ") + ".");
  }

  // Utility chunk
  const gas = listing.gasType !== "unknown" ? `Gas: ${listing.gasType}` : "Gas type unknown";
  const lift = listing.lift !== undefined ? (listing.lift ? "Lift available" : "No lift") : "";
  const gen = listing.generator !== undefined ? (listing.generator ? "Generator backup" : "No generator") : "";
  mk("utility", [gas, lift, gen].filter(Boolean).join(". ") + ".");

  // Location chunk
  if (listing.areaContext) {
    mk("location", listing.areaContext);
  }

  // Risk chunk
  if (listing.redFlags.length > 0) {
    mk("risk", listing.redFlags.join(". ") + ".");
  }

  // Source note
  mk("source_note",
    `Source: ${listing.sourceId}. Trust: ${listing.listingTrust}. Freshness: ${listing.freshnessStatus}. Confidence: ${listing.listingTrust}.`
  );

  return created;
}

export function getChunks(): ListingChunk[] { return [...chunks]; }
export function getChunksByListing(id: string): ListingChunk[] { return chunks.filter(c => c.listingId === id); }
export function getChunkCount(): number { return chunks.length; }
export function seedChunks(c: ListingChunk[]): void { chunks = [...chunks, ...c]; }
export function resetChunks(): void { chunks = []; }
