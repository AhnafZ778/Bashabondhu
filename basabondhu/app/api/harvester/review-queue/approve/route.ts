import { NextRequest, NextResponse } from "next/server";
import { approveReviewItem } from "@/lib/harvester/harvester-orchestrator.service";

export async function POST(request: NextRequest) {
  try {
    const { itemId, note } = await request.json();
    if (!itemId) return NextResponse.json({ ok: false, error: "itemId required" }, { status: 400 });
    const success = approveReviewItem(itemId, note);
    return NextResponse.json({ ok: success });
  } catch (error) {
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  }
}
