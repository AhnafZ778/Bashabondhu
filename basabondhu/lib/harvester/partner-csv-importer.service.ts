/**
 * Partner CSV Importer Service
 *
 * Parses CSV data, validates rows, creates listings.
 * No external CSV library — uses built-in string parsing.
 */

import { createRawDocument } from "./raw-document.service";
import { extractWithRegex } from "./extractor.service";
import { buildStructuredListing, updateListing } from "./structured-listing-builder.service";
import { decidePublishStatus } from "./quality.service";
import { createOfferSnapshot } from "./offer-snapshot.service";
import { findPossibleDuplicates } from "./dedupe.service";
import { enrichListingWithArea } from "./enrichment.service";
import { buildChunksForListing } from "./chunk-builder.service";
import { ImportSummary, HarvestedListing, HarvestRun } from "@/lib/types/harvester";
import { addHarvestRun } from "./harvester-orchestrator.service";

// ── CSV Column Mapping ──

const EXPECTED_COLUMNS = [
  "title", "area", "rent", "bedrooms", "bathrooms", "sizeSqft",
  "tenantPreference", "advanceMonths", "serviceCharge", "brokerFee",
  "gasType", "lift", "generator", "contactType", "availability", "notes",
];

// ── CSV Parser ──

function parseCSV(csvText: string): Record<string, string>[] {
  const lines = csvText.trim().split("\n");
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const row: Record<string, string> = {};
    headers.forEach((header, idx) => {
      row[header] = values[idx]?.trim().replace(/^"|"$/g, "") || "";
    });
    rows.push(row);
  }

  return rows;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

// ── Row to Listing Converter ──

function rowToRawText(row: Record<string, string>): string {
  const parts: string[] = [];
  if (row.area) parts.push(row.area);
  if (row.title) parts.push(row.title);
  if (row.rent) parts.push(`rent ${row.rent}`);
  if (row.bedrooms) parts.push(`${row.bedrooms} bed`);
  if (row.bathrooms) parts.push(`${row.bathrooms} bath`);
  if (row.sizeSqft) parts.push(`${row.sizeSqft} sqft`);
  if (row.tenantPreference) parts.push(`${row.tenantPreference} preferred`);
  if (row.advanceMonths) parts.push(`${row.advanceMonths} month advance`);
  if (row.serviceCharge) parts.push(`service charge ${row.serviceCharge}`);
  if (row.brokerFee) parts.push(`broker fee ${row.brokerFee}`);
  if (row.gasType) parts.push(`gas ${row.gasType}`);
  if (row.lift) parts.push(row.lift.toLowerCase() === "yes" ? "lift available" : "no lift");
  if (row.generator) parts.push(row.generator.toLowerCase() === "yes" ? "generator backup" : "no generator");
  if (row.notes) parts.push(row.notes);
  return parts.join(". ") + ".";
}

function validateRow(row: Record<string, string>): { valid: boolean; error?: string } {
  if (!row.area && !row.title) {
    return { valid: false, error: "Missing area and title" };
  }
  if (!row.rent || isNaN(parseInt(row.rent))) {
    return { valid: false, error: "Invalid or missing rent" };
  }
  return { valid: true };
}

// ── Main Import Function ──

export async function importPartnerCSV(
  csvText: string,
  sourceName: string = "Partner CSV"
): Promise<ImportSummary> {
  const rows = parseCSV(csvText);
  const summary: ImportSummary = {
    totalRows: rows.length,
    published: 0,
    needsReview: 0,
    rejected: 0,
    duplicates: 0,
    errors: [],
  };

  // Create harvest run
  const run: HarvestRun = {
    id: `run-csv-${Date.now()}`,
    sourceId: "src-partner-csv",
    runType: "partner_import",
    status: "running",
    startedAt: new Date().toISOString(),
    totalFetched: rows.length,
    totalParsed: 0,
    totalPublished: 0,
    totalRejected: 0,
    totalDuplicates: 0,
  };

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const validation = validateRow(row);

    if (!validation.valid) {
      summary.rejected++;
      summary.errors.push(`Row ${i + 1}: ${validation.error}`);
      continue;
    }

    try {
      // Create raw document from CSV row
      const rawText = rowToRawText(row);
      const rawDoc = createRawDocument({
        sourceId: "src-partner-csv",
        harvestRunId: run.id,
        rawText,
        rawJson: row,
        consentType: "partner_provided",
      });

      // Extract
      const parsed = extractWithRegex(rawText, rawDoc.id);

      // Override with direct CSV values where available
      if (row.area) parsed.parsedJson.area = row.area;
      if (row.rent) parsed.parsedJson.rent = parseInt(row.rent);
      if (row.bedrooms) parsed.parsedJson.bedrooms = parseInt(row.bedrooms);
      if (row.bathrooms) parsed.parsedJson.bathrooms = parseInt(row.bathrooms);
      if (row.sizeSqft) parsed.parsedJson.sizeSqft = parseInt(row.sizeSqft);
      if (row.advanceMonths) parsed.parsedJson.advanceMonths = parseInt(row.advanceMonths);
      if (row.serviceCharge) {
        parsed.parsedJson.serviceCharge = parseInt(row.serviceCharge);
        parsed.parsedJson.serviceChargeKnown = true;
      }
      if (row.brokerFee) {
        parsed.parsedJson.brokerFee = parseInt(row.brokerFee);
        parsed.parsedJson.brokerFeeKnown = true;
      }

      // Boost confidence for structured CSV data
      parsed.confidenceScore = Math.min(1, parsed.confidenceScore + 0.15);

      // Build listing
      const listing = buildStructuredListing(parsed, "src-partner-csv");

      // Check duplicates
      const dupes = findPossibleDuplicates(listing);
      if (dupes.length > 0) {
        updateListing(listing.id, { status: "duplicate" });
        summary.duplicates++;
        continue;
      }

      // Enrich
      enrichListingWithArea(listing);

      // Status decision
      const status = decidePublishStatus(listing, parsed.confidenceScore);
      updateListing(listing.id, { status });

      // Create offer
      const offer = createOfferSnapshot(listing);

      // Build chunks
      buildChunksForListing(listing, offer);

      if (status === "active") {
        summary.published++;
      } else {
        summary.needsReview++;
      }

      run.totalParsed++;
    } catch (error) {
      summary.rejected++;
      summary.errors.push(`Row ${i + 1}: ${String(error)}`);
    }
  }

  // Finalize harvest run
  run.status = "completed";
  run.finishedAt = new Date().toISOString();
  run.totalPublished = summary.published;
  run.totalRejected = summary.rejected;
  run.totalDuplicates = summary.duplicates;
  addHarvestRun(run);

  return summary;
}

export { EXPECTED_COLUMNS };
