import { NextResponse } from "next/server";
import { getHarvestRuns } from "@/lib/harvester/harvester-orchestrator.service";
import { DEMO_HARVEST_RUNS } from "@/lib/harvester-snapshots/demo-harvest-run";

export async function GET() {
  const runs = getHarvestRuns();
  const data = runs.length > 0 ? runs : DEMO_HARVEST_RUNS;
  return NextResponse.json({ ok: true, runs: data });
}
