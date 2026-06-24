import { NextRequest, NextResponse } from "next/server";
import { getListings } from "@/lib/repositories/listing.repository";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const area = searchParams.get("area") || undefined;
    const maxRent = searchParams.get("maxRent") ? parseInt(searchParams.get("maxRent")!) : undefined;
    const minRent = searchParams.get("minRent") ? parseInt(searchParams.get("minRent")!) : undefined;
    const householdType = searchParams.get("householdType") || undefined;

    const listings = getListings({ area, maxRent, minRent, householdType });

    return NextResponse.json({ listings, total: listings.length });
  } catch (error) {
    console.error("GET /api/listings error:", error);
    return NextResponse.json(
      { ok: false, error: { code: "LISTINGS_FETCH_FAILED", message: "Failed to fetch listings" }, fallback: {} },
      { status: 500 }
    );
  }
}
