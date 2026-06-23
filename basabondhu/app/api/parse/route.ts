import { NextResponse } from "next/server";
import { ParsedListing } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      // Return a message that API key is missing so we fell back to Regex client-side
      return NextResponse.json({ 
        error: "OpenRouter API Key not found. Falling back to local Regex parser.",
        fallback: true 
      });
    }

    const systemPrompt = `You are a rental listing parser for Dhaka, Bangladesh. Parse the messy Banglish/Bangla/English rental listing text into a JSON object.
    
    You MUST respond with a single JSON object matching this TypeScript interface exactly:
    interface ParsedListing {
      area: string | null; // must be one of: Banasree, Badda, Mohakhali, Tejgaon, Mohammadpur, Lalmatia, Mirpur, Uttara, Bashundhara, Dhanmondi
      rent: number | null; // rent amount in BDT (number only, e.g., 28000)
      bedrooms: number | null;
      bathrooms: number | null;
      tenantPreference: "family" | "bachelor" | "student" | "female" | "any" | null;
      advanceMonths: number | null; // how many months advance deposit is required
      lift: boolean | null;
      generator: boolean | null;
      gasType: "line" | "cylinder" | "unknown" | null;
      serviceCharge: string | null; // text or amount, e.g. "৳3,000" or "extra"
      brokerFee: string | null; // e.g. "no-fee" or "applicable" or "1 month rent"
      availability: string | null; // e.g. "July" or "immediate"
      missingFields: string[]; // List of critical fields that were NOT mentioned in the text (choose from: Location/Area, Rent Amount, Bedrooms Count, Upfront Advance/Deposit, Gas Type, Service Charge Details, Broker Fee status, Lift Facility, Generator Backup)
      confidence: "high" | "medium" | "low";
    }

    Respond ONLY with the JSON block. Do not write any markdown markers, backticks, or intro/outro text.`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "https://basabondhu.vercel.app", // Optional, for openrouter rankings
        "X-Title": "BasaBondhu AI Parser"
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: text }
        ],
        response_format: { type: "json_object" },
        temperature: 0.1
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter returned status ${response.status}`);
    }

    const data = await response.json();
    const parsedJsonText = data.choices[0]?.message?.content?.trim();

    if (!parsedJsonText) {
      throw new Error("Empty response from LLM");
    }

    const parsedData: ParsedListing = JSON.parse(parsedJsonText);
    return NextResponse.json(parsedData);

  } catch (error) {
    console.error("OpenRouter API error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to call LLM parser";
    return NextResponse.json({ 
      error: errorMessage,
      fallback: true
    }, { status: 500 });
  }
}
