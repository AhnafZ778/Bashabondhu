import { NextResponse } from "next/server";
import { getReviewQueue } from "@/lib/harvester/harvester-orchestrator.service";
import { DEMO_REVIEW_QUEUE } from "@/lib/harvester-snapshots/demo-harvest-run";

export async function GET() {
  const queue = getReviewQueue();
  const data = queue.length > 0 ? queue : DEMO_REVIEW_QUEUE;
  return NextResponse.json({ ok: true, queue: data });
}
