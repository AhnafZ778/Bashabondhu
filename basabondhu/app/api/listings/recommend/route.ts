import { NextResponse } from "next/server";
import { getAllListings } from "@/lib/repositories/listing.repository";
import { getTopListings } from "@/lib/services/scoring.service";
import { SearchProfile } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const { profile, adjustment } = await req.json();

    if (!profile) {
      return NextResponse.json(
        { error: "Profile is required" },
        { status: 400 }
      );
    }

    const adjustments = adjustment ? [adjustment] : [];
    const listings = getAllListings();
    const topListings = getTopListings(listings, profile as SearchProfile, adjustments);

    const adjustmentMessages: Record<string, string> = {
      "shorter-commute": "Prioritized commute convenience. Average rent may increase by ৳5,000–৳8,000.",
      "lower-rent": "Prioritized lower rent. Commute may get longer.",
      "avoid-broker": "Filtered out broker listings. Some good options may be excluded.",
      "avoid-waterlogging": "Penalized waterlogging-prone areas. Rent may be slightly higher in safer zones.",
    };

    return NextResponse.json({
      message: adjustmentMessages[adjustment] || "Listings re-ranked.",
      topListings,
    });
  } catch (error) {
    console.error("POST /api/listings/recommend error:", error);
    return NextResponse.json(
      { ok: false, error: { code: "RECOMMEND_FAILED", message: "Failed to re-rank listings" }, fallback: {} },
      { status: 500 }
    );
  }
}
