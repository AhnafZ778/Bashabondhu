import { NextRequest, NextResponse } from "next/server";
import { getSourceById, updateSourceStatus } from "@/lib/harvester/source-registry.service";
import { importGoogleSheet } from "@/lib/harvester/google-sheet-importer.service";
import { processPublicUrl } from "@/lib/harvester/public-url-ingestion.service";
import { addHarvestRun } from "@/lib/harvester/harvester-orchestrator.service";
import { HarvestRun } from "@/lib/types/harvester";

export async function POST(request: NextRequest) {
  try {
    const { sourceId } = await request.json();
    if (!sourceId) {
      return NextResponse.json({ ok: false, error: "sourceId is required" }, { status: 400 });
    }

    const source = getSourceById(sourceId);
    if (!source) {
      return NextResponse.json({ ok: false, error: "Source not found" }, { status: 404 });
    }

    // Create a new run record
    const runId = `run-${Date.now()}`;
    const run: HarvestRun = {
      id: runId,
      sourceId,
      runType: "manual",
      status: "running",
      startedAt: new Date().toISOString(),
      totalFetched: 0,
      totalParsed: 0,
      totalPublished: 0,
      totalRejected: 0,
      totalDuplicates: 0,
    };
    addHarvestRun(run);
    updateSourceStatus(sourceId, { lastRunAt: run.startedAt });

    // Handle different source runs
    if (source.type === "google_sheet") {
      const sheetUrl = "https://docs.google.com/spreadsheets/d/1t8d2C1c8kX3q6s4Uf8d-GZ9-gBfF0p59013/export?format=csv"; // fallback demo sheet
      const result = await importGoogleSheet(sheetUrl, source.name);
      run.status = "completed";
      run.finishedAt = new Date().toISOString();
      run.totalFetched = result.totalRows;
      run.totalParsed = result.published + result.needsReview;
      run.totalPublished = result.published;
      run.totalRejected = result.rejected;
      run.totalDuplicates = result.duplicates;
      return NextResponse.json({ ok: true, run, result });
    }

    if (source.type === "agency_website") {
      const url = "https://bproperty.com/en/dhaka/apartments-for-rent/"; // fallback demo URL
      const result = await processPublicUrl(url, source.name);
      run.status = result.ok ? "completed" : "failed";
      run.finishedAt = new Date().toISOString();
      run.totalFetched = 1;
      run.totalParsed = result.ok ? 1 : 0;
      run.totalPublished = result.ok && result.parsedListing.status === "active" ? 1 : 0;
      run.totalRejected = result.ok ? 0 : 1;
      return NextResponse.json({ ok: result.ok, run, result });
    }

    // Default simulation for others
    await new Promise((resolve) => setTimeout(resolve, 1500));
    run.status = "completed";
    run.finishedAt = new Date().toISOString();
    run.totalFetched = 10;
    run.totalParsed = 8;
    run.totalPublished = 6;
    run.totalDuplicates = 2;
    return NextResponse.json({ ok: true, run });
  } catch (error) {
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  }
}
