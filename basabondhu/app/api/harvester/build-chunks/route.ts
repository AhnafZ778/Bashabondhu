import { NextRequest, NextResponse } from "next/server";
import { getListingById } from "@/lib/harvester/structured-listing-builder.service";
import { buildChunksForListing } from "@/lib/harvester/chunk-builder.service";
import { getOfferByListingId } from "@/lib/harvester/offer-snapshot.service";

export async function POST(request: NextRequest) {
  try {
    const { listingId } = await request.json();
    if (!listingId) {
      return NextResponse.json({ ok: false, error: "listingId is required" }, { status: 400 });
    }

    const listing = getListingById(listingId);
    if (!listing) {
      return NextResponse.json({ ok: false, error: "Listing not found" }, { status: 404 });
    }

    const offer = getOfferByListingId(listingId);
    const chunks = buildChunksForListing(listing, offer);

    return NextResponse.json({ ok: true, chunksCount: chunks.length, chunks });
  } catch (error) {
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  }
}
