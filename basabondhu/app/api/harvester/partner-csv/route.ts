import { NextRequest, NextResponse } from "next/server";
import { importPartnerCSV } from "@/lib/harvester/partner-csv-importer.service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { csvText, sourceName } = body;

    if (!csvText || typeof csvText !== "string") {
      return NextResponse.json({ ok: false, error: "csvText is required" }, { status: 400 });
    }

    const result = await importPartnerCSV(csvText, sourceName || "Partner CSV");
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  }
}
