/**
 * Text Normalizer Service (Harvester Layer)
 *
 * Thin wrapper around the text normalizer utility for pipeline integration.
 * Adds normalization step tracking for the live progress UI.
 */

import { normalizeListingText } from "@/lib/utils/text-normalizer";

export type NormalizationResult = {
  originalText: string;
  normalizedText: string;
  changesApplied: string[];
  originalLength: number;
  normalizedLength: number;
};

export function normalizeForPipeline(rawText: string): NormalizationResult {
  const changes: string[] = [];

  // Detect what will change
  if (/[০-৯]/.test(rawText)) {
    changes.push("Converted Bangla numerals to English");
  }
  if (/\d+\s*[kK]\b/.test(rawText) || /হাজার/.test(rawText)) {
    changes.push("Expanded shorthand rent amounts");
  }
  if (/৳/.test(rawText)) {
    changes.push("Removed currency symbols");
  }
  if (/ভাড়া|বেড|পরিবার|ব্যাচেলর|সার্ভিস চার্জ|লিফট|জেনারেটর/.test(rawText)) {
    changes.push("Translated Bangla housing terms");
  }
  if (/\bbchlr\b|\brnt\b|\bsc\b|\blft\b|\bavlbl\b/i.test(rawText)) {
    changes.push("Expanded Banglish abbreviations");
  }

  const normalizedText = normalizeListingText(rawText);

  if (normalizedText !== rawText && changes.length === 0) {
    changes.push("Applied spacing and formatting cleanup");
  }

  return {
    originalText: rawText,
    normalizedText,
    changesApplied: changes,
    originalLength: rawText.length,
    normalizedLength: normalizedText.length,
  };
}
