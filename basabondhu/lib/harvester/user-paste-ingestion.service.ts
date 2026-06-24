/**
 * User Paste Ingestion Service
 *
 * Full pipeline for user-pasted listings.
 * Creates raw document → normalize → extract → build listing
 * → dedupe → enrich → score → create offer → build chunks.
 */

import { createRawDocument } from "./raw-document.service";
import { normalizeForPipeline } from "./text-normalizer.service";
import { extractWithRegex, mergeExtractions } from "./extractor.service";
import { extractWithOpenRouter } from "./openrouter-extractor.service";
import { buildStructuredListing } from "./structured-listing-builder.service";
import { calculateCompletenessScore, decidePublishStatus } from "./quality.service";
import { calculateFreshnessStatus } from "./freshness.service";
import { createOfferSnapshot, calculateBestDealScore } from "./offer-snapshot.service";
import { buildChunksForListing } from "./chunk-builder.service";
import { enrichListingWithArea } from "./enrichment.service";
import { findPossibleDuplicates } from "./dedupe.service";
import {
  UserPasteResponse,
  PipelineStep,
  HarvestedListing,
} from "@/lib/types/harvester";

export async function processUserPaste(
  rawText: string,
  userContext?: {
    householdType?: string;
    budget?: number;
    maxFirstMonthCash?: number;
  }
): Promise<UserPasteResponse> {
  const steps: PipelineStep[] = [];
  const startTime = Date.now();

  const step = (id: string, label: string): PipelineStep => {
    const s: PipelineStep = { id, label, status: "running" };
    steps.push(s);
    return s;
  };

  const complete = (s: PipelineStep, detail?: string) => {
    s.status = "completed";
    s.duration = Date.now() - startTime;
    if (detail) s.detail = detail;
  };

  try {
    // Step 1: Create raw document
    const s1 = step("raw-doc", "Saving raw document");
    const rawDoc = createRawDocument({
      sourceId: "src-user-paste",
      rawText,
      consentType: "user_submitted",
    });
    complete(s1, `Document ${rawDoc.id}`);

    // Step 2: Normalize text
    const s2 = step("normalize", "Normalizing Banglish text");
    const normResult = normalizeForPipeline(rawText);
    complete(s2, normResult.changesApplied.join(", ") || "No changes needed");

    // Step 3: Extract with regex
    const s3 = step("regex-extract", "Extracting listing fields (regex)");
    const regexParsed = extractWithRegex(normResult.normalizedText, rawDoc.id);
    complete(s3, `Confidence: ${(regexParsed.confidenceScore * 100).toFixed(0)}%`);

    // Step 4: Try OpenRouter AI (optional)
    const s4 = step("ai-extract", "AI extraction (OpenRouter)");
    let finalParsed = regexParsed;
    try {
      const aiResult = await extractWithOpenRouter(rawText);
      if (aiResult) {
        finalParsed = mergeExtractions(regexParsed, aiResult);
        complete(s4, "AI merge successful");
      } else {
        s4.status = "skipped";
        s4.detail = "OpenRouter unavailable — using regex only";
      }
    } catch {
      s4.status = "skipped";
      s4.detail = "AI extraction failed — using regex only";
    }

    // Step 5: Build structured listing
    const s5 = step("build-listing", "Building structured listing");
    const listing = buildStructuredListing(finalParsed, "src-user-paste");
    complete(s5, listing.title);

    // Step 6: Check duplicates
    const s6 = step("dedupe", "Checking for duplicates");
    const dupes = findPossibleDuplicates(listing);
    if (dupes.length > 0) {
      complete(s6, `${dupes.length} possible duplicate(s) found`);
    } else {
      complete(s6, "No duplicates");
    }

    // Step 7: Area enrichment
    const s7 = step("enrich", "Matching area profile");
    const enriched = enrichListingWithArea(listing);
    complete(s7, enriched.areaContext ? "Area profile matched" : "No area match");

    // Step 8: Quality + freshness
    const s8 = step("quality", "Calculating quality & freshness");
    const completeness = calculateCompletenessScore(enriched);
    enriched.freshnessStatus = calculateFreshnessStatus(enriched);
    enriched.status = decidePublishStatus(enriched, finalParsed.confidenceScore);
    complete(s8, `Completeness: ${(completeness * 100).toFixed(0)}%`);

    // Step 9: Create offer snapshot
    const s9 = step("offer", "Calculating first-month cost");
    const offer = createOfferSnapshot(enriched);
    complete(s9, `Total: ৳${offer.totalFirstMonthCost.toLocaleString()}`);

    // Step 10: Build RAG chunks
    const s10 = step("chunks", "Building search chunks");
    const chunks = buildChunksForListing(enriched, offer);
    complete(s10, `${chunks.length} chunks created`);

    // Step 11: Best deal scoring
    const s11 = step("best-deal", "Scoring best deal");
    const dealResult = calculateBestDealScore(enriched, offer, {
      budget: userContext?.budget,
      maxFirstMonthCash: userContext?.maxFirstMonthCash,
    });
    enriched.bestDealScore = dealResult.score;
    enriched.bestDealLabel = dealResult.label;
    enriched.bestDealExplanation = dealResult.explanation;
    complete(s11, dealResult.label);

    // Determine verdict
    const verdict = determineVerdict(enriched, finalParsed);

    // Generate call questions
    const questions = generateCallQuestions(enriched);

    return {
      ok: true,
      createdListingId: enriched.id,
      rawDocumentId: rawDoc.id,
      parserUsed: finalParsed.parserUsed,
      confidenceScore: finalParsed.confidenceScore,
      parsedListing: enriched,
      missingFields: finalParsed.missingFields,
      redFlags: enriched.redFlags,
      goodPoints: enriched.goodPoints,
      verdict,
      questions,
      offerSnapshot: offer,
      pipelineSteps: steps,
    };
  } catch (error) {
    return {
      ok: false,
      createdListingId: "",
      rawDocumentId: "",
      parserUsed: "regex",
      confidenceScore: 0,
      parsedListing: {},
      missingFields: [],
      redFlags: ["Pipeline error: " + String(error)],
      goodPoints: [],
      verdict: "avoid",
      questions: [],
      pipelineSteps: steps,
    };
  }
}

// ── Verdict Logic ──

function determineVerdict(
  listing: HarvestedListing,
  parsed: { confidenceScore: number; missingFields: string[] }
): UserPasteResponse["verdict"] {
  if (parsed.confidenceScore >= 0.8 && listing.redFlags.length <= 1) {
    return "visit";
  }
  if (parsed.confidenceScore >= 0.6 && listing.redFlags.length <= 3) {
    return "call_first";
  }
  if (parsed.confidenceScore >= 0.4) {
    return "maybe";
  }
  return "avoid";
}

// ── Call Question Generation ──

function generateCallQuestions(listing: HarvestedListing): string[] {
  const questions: string[] = [];

  if (!listing.serviceChargeKnown) {
    questions.push("Is service charge included in the rent?");
  }
  if (!listing.brokerFeeKnown) {
    questions.push("Is there any broker fee?");
  }
  if (listing.waterloggingRisk === "high" || listing.waterloggingRisk === "unknown") {
    questions.push("Does the road flood during heavy rain?");
  }
  if (listing.lift && !listing.generator) {
    questions.push("Is generator backup available for lift and water pump?");
  }
  if (listing.gasType === "unknown") {
    questions.push("Is there a government gas line or cylinder?");
  }
  if (!listing.advanceMonths) {
    questions.push("How many months advance is required?");
  }
  if (listing.tenantPreference === "unknown") {
    questions.push("Is this for family, bachelor, or any tenant?");
  }

  // Always add these practical questions
  questions.push("Is a written rental agreement provided?");
  questions.push("When is the flat available for viewing?");

  return questions;
}
