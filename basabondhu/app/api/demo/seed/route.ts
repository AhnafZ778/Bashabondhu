import { NextResponse } from "next/server";
import { listings } from "@/lib/data/listings";
import { areas } from "@/lib/data/areas";
import { personas } from "@/lib/data/personas";

export async function POST(req: Request) {
  try {
    // Only allow in demo mode
    const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true" || process.env.NODE_ENV === "development";
    
    if (!isDemoMode) {
      return NextResponse.json(
        { error: "Seed route is only available in demo/dev mode" },
        { status: 403 }
      );
    }

    // Return counts of available seed data
    return NextResponse.json({
      ok: true,
      inserted: {
        areas: areas.length,
        listings: listings.length,
        personas: personas.length,
      },
      message: "Seed data is available via static imports. No database seeding needed for demo mode.",
    });
  } catch (error) {
    console.error("POST /api/demo/seed error:", error);
    return NextResponse.json(
      { ok: false, error: { code: "SEED_FAILED", message: "Failed to seed demo data" }, fallback: {} },
      { status: 500 }
    );
  }
}
