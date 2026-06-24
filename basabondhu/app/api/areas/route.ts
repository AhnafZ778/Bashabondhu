import { NextResponse } from "next/server";
import { getAreas } from "@/lib/repositories/area.repository";

export async function GET() {
  try {
    const areas = getAreas();
    return NextResponse.json({ areas });
  } catch (error) {
    console.error("GET /api/areas error:", error);
    return NextResponse.json(
      { ok: false, error: { code: "AREAS_FETCH_FAILED", message: "Failed to fetch areas" }, fallback: {} },
      { status: 500 }
    );
  }
}
