import { ParsedListing } from "../types";
import { parseMessyListing } from "../parser";

/**
 * Listing Parser Service
 * Orchestrates regex parser with optional OpenRouter AI fallback.
 */

export async function parseListing(rawText: string): Promise<ParsedListing> {
  // Primary: regex parser (always available)
  const regexResult = parseMessyListing(rawText);

  // Optional: Try OpenRouter AI parser for better results
  if (typeof window !== "undefined") {
    // Client-side: call the API route
    try {
      const response = await fetch("/api/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: rawText }),
      });

      if (response.ok) {
        const aiResult = await response.json();
        return mergeParseResults(regexResult, aiResult);
      }
    } catch {
      // AI parser failed — use regex result
    }
  }

  return regexResult;
}

export function parseListingSync(rawText: string): ParsedListing {
  return parseMessyListing(rawText);
}

function mergeParseResults(
  regex: ParsedListing,
  ai: Partial<ParsedListing>
): ParsedListing {
  // AI fills gaps in regex output; regex values take priority when both exist
  return {
    area: regex.area ?? ai.area ?? null,
    rent: regex.rent ?? ai.rent ?? null,
    bedrooms: regex.bedrooms ?? ai.bedrooms ?? null,
    bathrooms: regex.bathrooms ?? ai.bathrooms ?? null,
    tenantPreference: regex.tenantPreference ?? ai.tenantPreference ?? null,
    advanceMonths: regex.advanceMonths ?? ai.advanceMonths ?? null,
    lift: regex.lift ?? ai.lift ?? null,
    generator: regex.generator ?? ai.generator ?? null,
    gasType: regex.gasType ?? ai.gasType ?? null,
    serviceCharge: regex.serviceCharge ?? ai.serviceCharge ?? null,
    brokerFee: regex.brokerFee ?? ai.brokerFee ?? null,
    availability: regex.availability ?? ai.availability ?? null,
    missingFields: regex.missingFields.length < (ai.missingFields?.length ?? 99) 
      ? regex.missingFields 
      : (ai.missingFields ?? regex.missingFields),
    confidence: regex.confidence === "high" || ai.confidence === "high" 
      ? "high" 
      : regex.confidence === "medium" || ai.confidence === "medium" 
        ? "medium" 
        : "low",
  };
}
