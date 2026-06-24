import { NextRequest, NextResponse } from "next/server";
import { processPublicUrl } from "@/lib/harvester/public-url-ingestion.service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, sourceName } = body;

    if (!url) {
      return NextResponse.json({ ok: false, error: "url is required" }, { status: 400 });
    }

    const result = await processPublicUrl(url, sourceName || "Public URL");
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  }
}
