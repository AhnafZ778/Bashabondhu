import { NextResponse } from "next/server";
import { getListingsByIds } from "@/lib/repositories/listing.repository";
import { compareListings } from "@/lib/services/compare.service";
import { scoreListing } from "@/lib/scoring";
import { SearchProfile, ScoredListing } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const { listingIds, profile } = await req.json();

    if (!listingIds || !Array.isArray(listingIds) || listingIds.length < 2) {
      return NextResponse.json(
        { error: "At least 2 listing IDs are required" },
        { status: 400 }
      );
    }

    const listings = getListingsByIds(listingIds);

    if (listings.length < 2) {
      return NextResponse.json(
        { error: "Could not find enough valid listings" },
        { status: 404 }
      );
    }

    // Score listings if profile is provided
    let scoredListings: ScoredListing[];
    if (profile) {
      scoredListings = listings.map(l => scoreListing(l, profile as SearchProfile));
    } else {
      // Create default scored listings without profile
      const defaultProfile: SearchProfile = {
        id: "default",
        mode: "compare",
        rentingOrBuying: "renting",
        householdType: "family",
        lookingFor: "full-flat",
        budgetMonthly: 30000,
        maxFirstMonthCash: 100000,
        commuteAnchors: [],
        priorities: [],
        dealBreakers: [],
      };
      scoredListings = listings.map(l => scoreListing(l, defaultProfile));
    }

    const comparison = compareListings(scoredListings);

    return NextResponse.json({ comparison });
  } catch (error) {
    console.error("POST /api/compare error:", error);
    return NextResponse.json(
      { ok: false, error: { code: "COMPARE_FAILED", message: "Failed to compare listings" }, fallback: {} },
      { status: 500 }
    );
  }
}
