/**
 * Offer Snapshot Service
 *
 * Creates offer snapshots for every listing.
 * Calculates total first-month cost including all hidden fees.
 * Wraps the existing cost-calculator with harvester metadata.
 */

import { OfferSnapshot, HarvestedListing } from "@/lib/types/harvester";

// ── In-Memory Store ──

let offerSnapshots: OfferSnapshot[] = [];

// ── Create Offer Snapshot ──

export function createOfferSnapshot(
  listing: HarvestedListing
): OfferSnapshot {
  const rent = listing.rent;
  const advanceMonths = listing.advanceMonths ?? 2;
  const advance = rent * advanceMonths;

  // Service charge estimate
  let serviceCharge = listing.serviceCharge ?? null;
  if (!listing.serviceChargeKnown && serviceCharge === null) {
    // Estimate based on rent
    serviceCharge = rent <= 15000 ? 1500 : rent <= 30000 ? 3000 : 5000;
  }

  // Broker fee estimate
  let brokerFee = listing.brokerFee ?? null;
  if (!listing.brokerFeeKnown && brokerFee === null) {
    brokerFee = rent; // assume 1 month if unknown
  }

  // Moving estimate
  const movingEstimate = rent <= 15000 ? 3000 : rent <= 30000 ? 5000 : 8000;

  // Total first-month cost
  const totalFirstMonthCost =
    rent +
    advance +
    (serviceCharge ?? 0) +
    (brokerFee ?? 0) +
    movingEstimate;

  // Determine confidence
  let confidence: OfferSnapshot["confidence"] = "confirmed";
  if (!listing.serviceChargeKnown || !listing.brokerFeeKnown) {
    confidence = "estimated";
  }
  if (!listing.serviceChargeKnown && !listing.brokerFeeKnown) {
    confidence = "unconfirmed";
  }

  // Determine included utilities
  const includedUtilities: string[] = [];
  if (listing.serviceChargeKnown && listing.serviceCharge === 0) {
    includedUtilities.push("Service charge included");
  }
  if (listing.gasType === "line") {
    includedUtilities.push("Government gas line");
  }

  // Warnings
  const warnings: string[] = [];
  if (!listing.serviceChargeKnown) {
    warnings.push("Service charge unclear — could add ৳2,000–৳5,000/month");
  }
  if (!listing.brokerFeeKnown) {
    warnings.push("Broker fee unknown — may add up to 1 month rent");
  }
  if (advanceMonths >= 3) {
    warnings.push(`High advance: ${advanceMonths} months (৳${advance.toLocaleString()}) upfront`);
  }
  if (listing.gasType === "cylinder") {
    warnings.push("Cylinder gas adds ~৳1,500–৳2,500/month");
  }

  const snapshot: OfferSnapshot = {
    id: `offer-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    listingId: listing.id,
    offerType: "listed",
    monthlyRent: rent,
    advanceMonths,
    serviceCharge,
    brokerFee,
    movingEstimate,
    totalFirstMonthCost,
    negotiable: listing.brokerFee !== null && listing.brokerFee !== undefined && listing.brokerFee > 0,
    includedUtilities,
    confidence,
    validUntil: listing.expiresAt,
    capturedAt: new Date().toISOString(),
    warnings,
  };

  offerSnapshots.push(snapshot);
  return snapshot;
}

// ── Getters ──

export function getOfferSnapshots(): OfferSnapshot[] {
  return [...offerSnapshots];
}

export function getOfferByListingId(listingId: string): OfferSnapshot | undefined {
  return offerSnapshots.find((o) => o.listingId === listingId);
}

export function getOffersByConfidence(
  confidence: OfferSnapshot["confidence"]
): OfferSnapshot[] {
  return offerSnapshots.filter((o) => o.confidence === confidence);
}

// ── Best Deal Scoring ──

export function calculateBestDealScore(
  listing: HarvestedListing,
  offer: OfferSnapshot,
  userProfile?: { budget?: number; maxFirstMonthCash?: number }
): {
  score: number;
  label: string;
  explanation: string;
} {
  let score = 50; // base
  const reasons: string[] = [];

  const budget = userProfile?.budget ?? 30000;
  const maxCash = userProfile?.maxFirstMonthCash ?? 100000;

  // Monthly rent fit (25 points max)
  if (offer.monthlyRent <= budget) {
    score += 25;
    reasons.push("rent fits budget");
  } else if (offer.monthlyRent <= budget * 1.1) {
    score += 15;
    reasons.push("rent slightly above budget");
  }

  // First-month cash fit (15 points max)
  if (offer.totalFirstMonthCost <= maxCash) {
    score += 15;
    reasons.push("first-month cost affordable");
  } else if (offer.totalFirstMonthCost <= maxCash * 1.2) {
    score += 8;
  }

  // Broker fee advantage (10 points)
  if (listing.brokerFeeKnown && (listing.brokerFee === 0 || listing.brokerFee === null)) {
    score += 10;
    reasons.push("no broker fee");
  }

  // Service charge clarity (8 points)
  if (listing.serviceChargeKnown) {
    score += 8;
    reasons.push("service charge confirmed");
  }

  // Utility clarity (5 points)
  if (listing.utilityClarity === "clear") score += 5;

  // Source confidence (5 points)
  if (listing.listingTrust === "high") score += 5;

  // Freshness (5 points)
  if (listing.freshnessStatus === "fresh") score += 5;

  // Low advance bonus (5 points)
  if ((listing.advanceMonths ?? 2) <= 1) {
    score += 5;
    reasons.push("only 1 month advance");
  }

  // Penalties
  if (!listing.serviceChargeKnown) score -= 5;
  if (!listing.brokerFeeKnown) score -= 5;
  if (listing.waterloggingRisk === "high") score -= 8;
  if (listing.freshnessStatus === "stale") score -= 10;
  if (listing.missingFields.length > 4) score -= 5;

  // Normalize
  score = Math.max(0, Math.min(100, score));

  // Label
  let label = "Standard option";
  if (score >= 85) label = "Best practical deal";
  else if (score >= 75) label = "Strong candidate";
  else if (score >= 60) label = "Worth considering";
  else if (score >= 40) label = "Call first";
  else label = "Needs verification";

  // Explanation
  const explanation =
    score >= 75
      ? `This is ${label.toLowerCase()} because ${reasons.join(", ")}.`
      : `This listing scores ${score}/100. ${reasons.length > 0 ? `Strengths: ${reasons.join(", ")}.` : "Review details carefully."}`;

  return { score, label, explanation };
}

// ── Utility ──

export function seedOfferSnapshots(offers: OfferSnapshot[]): void {
  offerSnapshots = [...offerSnapshots, ...offers];
}

export function resetOfferSnapshots(): void {
  offerSnapshots = [];
}
