import { NextRequest, NextResponse } from "next/server";
import { processUserPaste } from "@/lib/harvester/user-paste-ingestion.service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { rawText, userContext } = body;

    if (!rawText || typeof rawText !== "string" || rawText.trim().length < 5) {
      return NextResponse.json(
        { ok: false, error: "rawText is required (min 5 characters)" },
        { status: 400 }
      );
    }

    const result = await processUserPaste(rawText.trim(), userContext);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: String(error) },
      { status: 500 }
    );
  }
}
