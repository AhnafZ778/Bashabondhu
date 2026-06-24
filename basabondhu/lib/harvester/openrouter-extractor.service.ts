/**
 * OpenRouter Extractor Service
 *
 * Optional AI-powered structured extraction using OpenRouter.
 * Gracefully falls back to null if unavailable.
 * Uses the exact prompt specified in requirements.
 */

import { HarvestedListing } from "@/lib/types/harvester";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

const EXTRACTION_PROMPT = `Extract structured rental listing data from the text below.

Return only valid JSON.
Do not include markdown.
Do not invent unknown details.
Use null or "unknown" for missing fields.
The text may be Bangla, English, or Banglish.
This is for a Bangladeshi rental housing decision assistant.

Extract these fields:
title, area, rent, bedrooms, bathrooms, sizeSqft, tenantPreference, familyAllowed, bachelorAllowed, femaleFriendly, studentFriendly, advanceMonths, serviceCharge, serviceChargeKnown, brokerFee, brokerFeeKnown, gasType, lift, generator, availability, missingFields, redFlags, goodPoints.

Rules:
- Convert "28k" to 28000.
- Convert Bangla numerals to English numbers.
- If service charge is "extra" but no number is given, set serviceChargeKnown false.
- If broker fee is not mentioned, set brokerFeeKnown false.
- If tenant rules are unclear, set tenantPreference "unknown".
- If a field is not present, do not guess.

Listing text:
{{rawText}}`;

export async function extractWithOpenRouter(
  rawText: string
): Promise<Partial<HarvestedListing> | null> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return null;
  }

  try {
    const prompt = EXTRACTION_PROMPT.replace("{{rawText}}", rawText);

    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://basabondhu.vercel.app",
        "X-Title": "BasaBondhu Listing Extractor",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.1,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      console.warn(`OpenRouter extraction failed: ${response.status}`);
      return null;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return null;
    }

    // Parse the JSON response, handling potential markdown wrapping
    let jsonStr = content.trim();
    if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    const parsed = JSON.parse(jsonStr) as Partial<HarvestedListing>;
    return parsed;
  } catch (error) {
    console.warn("OpenRouter extraction error:", error);
    return null;
  }
}

export function isOpenRouterAvailable(): boolean {
  return !!process.env.OPENROUTER_API_KEY;
}
