/**
 * Raw Document Service
 *
 * Manages raw documents collected from all sources.
 * Every piece of housing data enters the pipeline through this service.
 * Tracks: content hash (for dedup), consent type, processing status.
 *
 * In-memory store for hackathon; designed for Supabase migration later.
 */

import { RawDocument } from "@/lib/types/harvester";

// ── In-Memory Store ──

let rawDocuments: RawDocument[] = [];

// ── Hash Utility ──

function simpleHash(text: string): string {
  // Simple FNV-1a hash for content deduplication
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = (hash * 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, "0");
}

// ── Service Functions ──

export function createRawDocument(input: {
  sourceId: string;
  harvestRunId?: string;
  sourceUrl?: string;
  rawText?: string;
  rawHtml?: string;
  rawJson?: unknown;
  consentType: RawDocument["consentType"];
}): RawDocument {
  const contentToHash =
    input.rawText || input.rawHtml || JSON.stringify(input.rawJson) || "";
  const contentHash = simpleHash(contentToHash);

  // Check for existing document with same hash
  const existing = rawDocuments.find((d) => d.contentHash === contentHash);
  if (existing) {
    return existing;
  }

  const doc: RawDocument = {
    id: `rdoc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    sourceId: input.sourceId,
    harvestRunId: input.harvestRunId,
    sourceUrl: input.sourceUrl,
    rawText: input.rawText,
    rawHtml: input.rawHtml,
    rawJson: input.rawJson,
    contentHash,
    capturedAt: new Date().toISOString(),
    consentType: input.consentType,
    processingStatus: "pending",
  };

  rawDocuments.push(doc);
  return doc;
}

export function getRawDocuments(): RawDocument[] {
  return [...rawDocuments];
}

export function getRawDocumentById(id: string): RawDocument | undefined {
  return rawDocuments.find((d) => d.id === id);
}

export function getRawDocumentsBySource(sourceId: string): RawDocument[] {
  return rawDocuments.filter((d) => d.sourceId === sourceId);
}

export function getRawDocumentsByStatus(
  status: RawDocument["processingStatus"]
): RawDocument[] {
  return rawDocuments.filter((d) => d.processingStatus === status);
}

export function updateDocumentStatus(
  docId: string,
  status: RawDocument["processingStatus"]
): RawDocument | undefined {
  const index = rawDocuments.findIndex((d) => d.id === docId);
  if (index === -1) return undefined;
  rawDocuments[index] = { ...rawDocuments[index], processingStatus: status };
  return rawDocuments[index];
}

export function findDuplicateDocument(contentHash: string): RawDocument | undefined {
  return rawDocuments.find((d) => d.contentHash === contentHash);
}

export function getRawDocumentCount(): number {
  return rawDocuments.length;
}

export function getDocumentStats(): {
  total: number;
  pending: number;
  parsed: number;
  failed: number;
  rejected: number;
} {
  return {
    total: rawDocuments.length,
    pending: rawDocuments.filter((d) => d.processingStatus === "pending").length,
    parsed: rawDocuments.filter((d) => d.processingStatus === "parsed").length,
    failed: rawDocuments.filter((d) => d.processingStatus === "failed").length,
    rejected: rawDocuments.filter((d) => d.processingStatus === "rejected").length,
  };
}

export function seedRawDocuments(docs: RawDocument[]): void {
  rawDocuments = [...rawDocuments, ...docs];
}

export function resetRawDocuments(): void {
  rawDocuments = [];
}
