/**
 * Public URL Ingestion Service
 *
 * Fetches page text from public URLs, extracts listing data.
 * Gracefully handles failures without blocking the demo.
 */

import { createRawDocument } from "./raw-document.service";
import { extractWithRegex } from "./extractor.service";
import { buildStructuredListing } from "./structured-listing-builder.service";
import { createOfferSnapshot } from "./offer-snapshot.service";
import { enrichListingWithArea } from "./enrichment.service";
import { decidePublishStatus } from "./quality.service";
import { UserPasteResponse, PipelineStep } from "@/lib/types/harvester";

export async function processPublicUrl(
  url: string,
  sourceName: string = "Public URL"
): Promise<UserPasteResponse> {
  const steps: PipelineStep[] = [];
  const start = Date.now();
  const step = (id: string, label: string): PipelineStep => {
    const s: PipelineStep = { id, label, status: "running" };
    steps.push(s);
    return s;
  };
  const complete = (s: PipelineStep, d?: string) => {
    s.status = "completed"; s.duration = Date.now() - start; if (d) s.detail = d;
  };

  try {
    // Step 1: Fetch page
    const s1 = step("fetch", "Fetching page content");
    let pageText = "";
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "BasaBondhu-Harvester/1.0" },
        signal: AbortSignal.timeout(10000),
      });
      if (res.ok) {
        const html = await res.text();
        pageText = stripHtml(html);
        complete(s1, `${pageText.length} chars extracted`);
      } else {
        s1.status = "failed"; s1.detail = `HTTP ${res.status}`;
      }
    } catch (e) {
      s1.status = "failed"; s1.detail = String(e);
    }

    if (!pageText) {
      return {
        ok: false, createdListingId: "", rawDocumentId: "",
        parserUsed: "regex", confidenceScore: 0,
        parsedListing: {}, missingFields: [],
        redFlags: ["Could not fetch page content"],
        goodPoints: [], verdict: "avoid", questions: [],
        pipelineSteps: steps,
      };
    }

    // Step 2: Save raw document
    const s2 = step("raw-doc", "Saving raw document");
    const rawDoc = createRawDocument({
      sourceId: "src-agency-public",
      sourceUrl: url,
      rawText: pageText.slice(0, 10000),
      rawHtml: undefined,
      consentType: "public_allowed",
    });
    complete(s2);

    // Step 3: Extract
    const s3 = step("extract", "Extracting listing fields");
    const parsed = extractWithRegex(pageText, rawDoc.id);
    complete(s3, `Confidence: ${(parsed.confidenceScore * 100).toFixed(0)}%`);

    // Step 4: Build listing
    const s4 = step("build", "Building listing");
    const listing = buildStructuredListing(parsed, "src-agency-public", url);
    complete(s4, listing.title);

    // Step 5: Enrich
    const s5 = step("enrich", "Area enrichment");
    enrichListingWithArea(listing);
    complete(s5);

    // Step 6: Status
    listing.status = decidePublishStatus(listing, parsed.confidenceScore);

    // Step 7: Offer
    const s6 = step("offer", "Creating offer snapshot");
    const offer = createOfferSnapshot(listing);
    complete(s6, `৳${offer.totalFirstMonthCost.toLocaleString()}`);

    return {
      ok: true,
      createdListingId: listing.id,
      rawDocumentId: rawDoc.id,
      parserUsed: parsed.parserUsed,
      confidenceScore: parsed.confidenceScore,
      parsedListing: listing,
      missingFields: parsed.missingFields,
      redFlags: listing.redFlags,
      goodPoints: listing.goodPoints,
      verdict: parsed.confidenceScore >= 0.6 ? "call_first" : "maybe",
      questions: ["Verify this listing is still available", "Confirm all costs before visiting"],
      offerSnapshot: offer,
      pipelineSteps: steps,
    };
  } catch (error) {
    return {
      ok: false, createdListingId: "", rawDocumentId: "",
      parserUsed: "regex", confidenceScore: 0,
      parsedListing: {}, missingFields: [],
      redFlags: [String(error)],
      goodPoints: [], verdict: "avoid", questions: [],
      pipelineSteps: steps,
    };
  }
}

function stripHtml(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}
