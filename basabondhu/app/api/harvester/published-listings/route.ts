import { NextResponse } from "next/server";
import { getPublishedListings } from "@/lib/harvester/structured-listing-builder.service";
import { DEMO_PUBLISHED_LISTINGS } from "@/lib/harvester-snapshots/demo-harvest-run";

export async function GET() {
  const published = getPublishedListings();
  const data = published.length > 0 ? published : DEMO_PUBLISHED_LISTINGS;
  return NextResponse.json({ ok: true, listings: data });
}
