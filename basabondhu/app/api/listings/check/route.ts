import { NextResponse } from "next/server";
import { parseMessyListing } from "@/lib/parser";
import { scoreListing } from "@/lib/scoring";
import { calculateFirstMonthCost } from "@/lib/cost-calculator";
import { SearchProfile, Listing, Verdict } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const { rawText, profile } = await req.json();

    if (!rawText || typeof rawText !== "string") {
      return NextResponse.json(
        { error: "rawText is required" },
        { status: 400 }
      );
    }

    // Parse the listing
    const parsed = parseMessyListing(rawText);

    // Create a temporary listing object for scoring
    const tempListing: Listing = {
      id: `check-${Date.now()}`,
      title: parsed.area ? `${parsed.area} listing check` : "Unknown area listing",
      rawText,
      sourceType: "direct",
      area: parsed.area || "Unknown",
      addressHint: "",
      city: "Dhaka",
      latitude: 0,
      longitude: 0,
      rent: parsed.rent || 0,
      bedrooms: parsed.bedrooms || 0,
      bathrooms: parsed.bathrooms || undefined,
      tenantPreference: (parsed.tenantPreference as Listing["tenantPreference"]) || "unknown",
      familyAllowed: parsed.tenantPreference === "family" || parsed.tenantPreference === "any" || parsed.tenantPreference === null,
      bachelorAllowed: parsed.tenantPreference === "bachelor" || parsed.tenantPreference === "any" || parsed.tenantPreference === null,
      femaleFriendly: parsed.tenantPreference === "female" || parsed.tenantPreference === "any",
      studentFriendly: parsed.tenantPreference === "student" || parsed.tenantPreference === "any",
      advanceMonths: parsed.advanceMonths || 0,
      brokerFee: parsed.brokerFee === "no-fee" ? 0 : parsed.brokerFee === "applicable" ? null : null,
      brokerFeeKnown: parsed.brokerFee !== null,
      serviceCharge: parsed.serviceCharge && parsed.serviceCharge !== "extra" && parsed.serviceCharge !== "included"
        ? parseInt(parsed.serviceCharge.replace(/[৳,]/g, "")) || null
        : null,
      serviceChargeKnown: parsed.serviceCharge !== null,
      gasType: (parsed.gasType as Listing["gasType"]) || "unknown",
      lift: parsed.lift || false,
      generator: parsed.generator || false,
      waterloggingRisk: "unknown",
      utilityClarity: parsed.missingFields.length <= 2 ? "clear" : parsed.missingFields.length <= 5 ? "partial" : "unclear",
      commuteNotes: "",
      houseRules: [],
      redFlags: [],
      goodPoints: [],
      missingFields: parsed.missingFields,
      isActive: true,
      isDemo: false,
    };

    // Score if profile is provided
    let verdict: Verdict = "call-first";
    let verdictReason = "Multiple details missing — call to verify before visiting.";
    let costBreakdown = calculateFirstMonthCost(tempListing);
    const questions: string[] = [];

    if (profile) {
      const scored = scoreListing(tempListing, profile as SearchProfile);
      verdict = scored.verdict;
      verdictReason = scored.whyItFits;
      questions.push(...scored.questionsToAsk);
    } else {
      // Default questions based on parsing
      if (parsed.missingFields.includes("Service Charge Details")) {
        questions.push("Service charge mash e koto? Electricity, water alada?");
      }
      if (parsed.missingFields.includes("Broker Fee status")) {
        questions.push("Broker/media fee lage? Koto?");
      }
      if (parsed.missingFields.includes("Gas Type (Line/Cylinder)")) {
        questions.push("Gas line naki cylinder?");
      }
      if (parsed.missingFields.includes("Lift Facility")) {
        questions.push("Building e lift ache?");
      }
    }

    // Determine confidence-based verdict override
    if (parsed.confidence === "low" && verdict !== "avoid") {
      verdict = "call-first";
      verdictReason = "Too many details missing. Call landlord to verify before visiting.";
    }

    // Generate call script
    const area = parsed.area || "your area";
    const rent = parsed.rent ? `৳${parsed.rent.toLocaleString()}` : "the listed amount";
    let callScript = `Assalamu Alaikum, ami ${area} er flat er ad dekhe call korchi.\n`;
    callScript += `Rent ${rent} right?\n\n`;
    questions.forEach((q, i) => {
      callScript += `${i + 1}. ${q}\n`;
    });
    callScript += `\nDhonnobad!`;

    return NextResponse.json({
      parsed,
      verdict,
      verdictReason,
      costBreakdown,
      missingFields: parsed.missingFields,
      redFlags: tempListing.redFlags,
      questions,
      callScript,
    });
  } catch (error) {
    console.error("POST /api/listings/check error:", error);
    return NextResponse.json(
      { ok: false, error: { code: "CHECK_FAILED", message: "Failed to check listing" }, fallback: {} },
      { status: 500 }
    );
  }
}
