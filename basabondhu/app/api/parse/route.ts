import { NextResponse } from "next/server";
import { callOpenRouter } from "@/lib/services/openrouter.service";
import { ParsedListing } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const systemPrompt = `You are a rental listing parser for Dhaka, Bangladesh. Parse the messy Banglish/Bangla/English rental listing text into a JSON object.
    
    You MUST respond with a single JSON object matching this TypeScript interface exactly:
    interface ParsedListing {
      area: string | null; // must be one of: Banasree, Badda, Mohakhali, Tejgaon, Mohammadpur, Lalmatia, Mirpur, Uttara, Bashundhara, Dhanmondi, Banani
      rent: number | null; // rent amount in BDT (number only, e.g., 28000)
      bedrooms: number | null;
      bathrooms: number | null;
      tenantPreference: "family" | "bachelor" | "student" | "female" | "any" | null;
      advanceMonths: number | null; // how many months advance deposit is required
      lift: boolean | null;
      generator: boolean | null;
      gasType: "line" | "cylinder" | "unknown" | null;
      serviceCharge: string | null; // text or amount, e.g. "৳3,000" or "extra" or "included"
      brokerFee: string | null; // e.g. "no-fee" or "applicable" or "1 month rent"
      availability: string | null; // e.g. "July" or "immediate"
      missingFields: string[]; // List of critical fields that were NOT mentioned in the text (choose from: Location/Area, Rent Amount, Bedrooms Count, Upfront Advance/Deposit, Gas Type, Service Charge Details, Broker Fee status, Lift Facility, Generator Backup)
      confidence: "high" | "medium" | "low";
      hiddenCostMentions?: {
        serviceCharge?: string;
        brokerFee?: string;
        gas?: string;
        electricity?: string;
        water?: string;
        road?: string;
        waterlogging?: string;
        tenantRestriction?: string;
        agreementReceiptTerms?: string;
        payBeforeVisit?: string;
        advanceTerms?: string;
        liftGeneratorCharge?: string;
        parking?: string;
        repairCleaningPaint?: string;
      };
    }

    Respond ONLY with the JSON block. Do not write any markdown markers, backticks, or intro/outro text.`;

    const prompt = `${systemPrompt}\n\nTEXT TO PARSE:\n${text}`;

    // Call the robust OpenRouter service with key rotation support
    const content = await callOpenRouter(prompt, true);
    const parsedJsonText = content?.trim();

    if (!parsedJsonText) {
      throw new Error("Empty response from LLM");
    }

    // Clean markdown code blocks if the model returned backticks
    let cleaned = parsedJsonText;
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
    }

    const parsedData: ParsedListing = JSON.parse(cleaned);
    return NextResponse.json(parsedData);

  } catch (error) {
    console.error("OpenRouter API error in parse endpoint:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to call LLM parser";
    return NextResponse.json({ 
      error: errorMessage,
      fallback: true
    }, { status: 500 });
  }
}
