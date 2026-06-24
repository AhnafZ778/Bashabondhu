import { NextResponse } from "next/server";
import { getAllListings } from "@/lib/repositories/listing.repository";
import { getRecommendations } from "@/lib/services/recommendation.service";
import { getRecommendedAreas } from "@/lib/services/area-recommendation.service";
import { generateProfileSummary } from "@/lib/services/search-profile.service";
import { SearchProfile } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const profile: SearchProfile = {
      id: `session-${Date.now()}`,
      mode: "plan",
      rentingOrBuying: "renting",
      householdType: body.householdType,
      lookingFor: body.lookingFor || "full-flat",
      budgetMonthly: body.monthlyBudget || body.budgetMonthly,
      maxFirstMonthCash: body.maxFirstMonthCash,
      commuteAnchors: body.commuteAnchors || [],
      priorities: body.priorities || [],
      dealBreakers: body.dealBreakers || [],
    };

    const listings = getAllListings();
    const { scanSummary, topListings } = getRecommendations(listings, profile);
    const recommendedAreas = getRecommendedAreas(profile);
    const profileSummary = generateProfileSummary(profile);

    return NextResponse.json({
      sessionId: profile.id,
      profileSummary,
      recommendedAreas,
      scanSummary,
      topListings,
    });
  } catch (error) {
    console.error("POST /api/search/plan error:", error);
    return NextResponse.json(
      { ok: false, error: { code: "PLAN_FAILED", message: "Failed to create search plan" }, fallback: {} },
      { status: 500 }
    );
  }
}
