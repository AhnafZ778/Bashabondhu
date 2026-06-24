/**
 * Google Sheet Importer Service
 *
 * Fetches CSV from a Google Sheet export URL,
 * delegates to the partner CSV importer.
 */

import { importPartnerCSV } from "./partner-csv-importer.service";
import { ImportSummary } from "@/lib/types/harvester";

export async function importGoogleSheet(
  sheetCsvUrl: string,
  sourceName: string = "Google Sheet"
): Promise<ImportSummary> {
  try {
    const response = await fetch(sheetCsvUrl, {
      headers: { "User-Agent": "BasaBondhu-Harvester/1.0" },
    });

    if (!response.ok) {
      return {
        totalRows: 0, published: 0, needsReview: 0, rejected: 0, duplicates: 0,
        errors: [`Failed to fetch: ${response.status}`],
      };
    }

    const csvText = await response.text();
    if (!csvText?.trim()) {
      return {
        totalRows: 0, published: 0, needsReview: 0, rejected: 0, duplicates: 0,
        errors: ["Empty content"],
      };
    }

    return await importPartnerCSV(csvText, sourceName);
  } catch (error) {
    return {
      totalRows: 0, published: 0, needsReview: 0, rejected: 0, duplicates: 0,
      errors: [String(error)],
    };
  }
}

export function normalizeGoogleSheetUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.pathname.includes("/export") && parsed.searchParams.get("format") === "csv") {
      return url;
    }
    const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
    if (match) {
      return `https://docs.google.com/spreadsheets/d/${match[1]}/export?format=csv`;
    }
    return null;
  } catch {
    return null;
  }
}
