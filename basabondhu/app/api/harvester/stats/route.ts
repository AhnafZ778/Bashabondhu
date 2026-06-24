import { NextResponse } from "next/server";
import { getHarvesterStats } from "@/lib/harvester/harvester-orchestrator.service";
import { DEMO_STATS } from "@/lib/harvester-snapshots/demo-harvest-run";

export async function GET() {
  const stats = getHarvesterStats();
  // Use demo stats if no real data
  const data = stats.totalRawDocuments > 0 ? stats : DEMO_STATS;
  return NextResponse.json({ ok: true, stats: data });
}
