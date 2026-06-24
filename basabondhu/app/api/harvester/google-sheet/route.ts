import { NextRequest, NextResponse } from "next/server";
import { importGoogleSheet, normalizeGoogleSheetUrl } from "@/lib/harvester/google-sheet-importer.service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sheetCsvUrl, sourceName } = body;

    if (!sheetCsvUrl) {
      return NextResponse.json({ ok: false, error: "sheetCsvUrl is required" }, { status: 400 });
    }

    const normalizedUrl = normalizeGoogleSheetUrl(sheetCsvUrl) || sheetCsvUrl;
    const result = await importGoogleSheet(normalizedUrl, sourceName || "Google Sheet");
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  }
}
