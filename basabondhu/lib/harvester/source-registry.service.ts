/**
 * Source Registry Service
 *
 * Manages all data sources feeding the BasaBondhu harvester.
 * Each source has provenance metadata, permission status, and risk level.
 * In-memory store for hackathon; designed for Supabase migration later.
 */

import { DataSource, DataSourceType } from "@/lib/types/harvester";

// ── Demo Sources ──

const DEMO_SOURCES: DataSource[] = [
  {
    id: "src-user-paste",
    name: "User Pasted Listings",
    type: "user_paste",
    permissionStatus: "user_submitted",
    riskLevel: "low",
    enabled: true,
    notes: "Direct user input — highest trust for consent.",
  },
  {
    id: "src-partner-sheet",
    name: "Partner Google Sheet Feed",
    type: "google_sheet",
    permissionStatus: "partner_allowed",
    riskLevel: "low",
    enabled: true,
    refreshFrequencyHours: 24,
    notes: "Curated partner data via Google Sheets CSV export.",
  },
  {
    id: "src-partner-csv",
    name: "Partner CSV Import",
    type: "partner_csv",
    permissionStatus: "partner_allowed",
    riskLevel: "low",
    enabled: true,
    notes: "Direct CSV file upload from verified partners.",
  },
  {
    id: "src-agency-public",
    name: "Public Agency Listing Pages",
    type: "agency_website",
    permissionStatus: "public_allowed",
    riskLevel: "medium",
    enabled: true,
    refreshFrequencyHours: 12,
    notes: "Publicly accessible agency pages (Bproperty, Bikroy style).",
  },
  {
    id: "src-facebook-paste",
    name: "Facebook Group Posts via User Paste",
    type: "user_paste",
    permissionStatus: "user_submitted",
    riskLevel: "low",
    enabled: true,
    notes:
      "Users copy-paste from Facebook groups — consent is user-initiated.",
  },
  {
    id: "src-osm",
    name: "OpenStreetMap Area Context",
    type: "osm_area_data",
    permissionStatus: "public_allowed",
    riskLevel: "low",
    enabled: true,
    notes: "Static area enrichment from OSM-derived data.",
  },
  {
    id: "src-cached-crawl",
    name: "Cached Crawl Snapshots",
    type: "cached_snapshot",
    permissionStatus: "demo_snapshot",
    riskLevel: "low",
    enabled: true,
    notes: "Pre-cached demo crawl results for stable hackathon demos.",
  },
  {
    id: "src-seed",
    name: "Static Seed Listings",
    type: "seed",
    permissionStatus: "manual",
    riskLevel: "low",
    enabled: true,
    notes:
      "Hardcoded seed listings — always available as final fallback.",
  },
];

// ── In-Memory Store ──

let sources: DataSource[] = [...DEMO_SOURCES];

// ── Service Functions ──

export function registerSource(
  input: Omit<DataSource, "id"> & { id?: string }
): DataSource {
  const source: DataSource = {
    ...input,
    id: input.id || `src-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  };
  sources.push(source);
  return source;
}

export function getSources(): DataSource[] {
  return [...sources];
}

export function getEnabledSources(): DataSource[] {
  return sources.filter((s) => s.enabled);
}

export function getSourceById(sourceId: string): DataSource | undefined {
  return sources.find((s) => s.id === sourceId);
}

export function getSourcesByType(type: DataSourceType): DataSource[] {
  return sources.filter((s) => s.type === type);
}

export function updateSourceStatus(
  sourceId: string,
  updates: Partial<Pick<DataSource, "enabled" | "lastRunAt" | "notes">>
): DataSource | undefined {
  const index = sources.findIndex((s) => s.id === sourceId);
  if (index === -1) return undefined;

  sources[index] = { ...sources[index], ...updates };
  return sources[index];
}

export function canRunSource(source: DataSource): {
  canRun: boolean;
  reason?: string;
} {
  if (!source.enabled) {
    return { canRun: false, reason: "Source is disabled." };
  }

  if (source.permissionStatus === "blocked") {
    return { canRun: false, reason: "Source is blocked due to permission issues." };
  }

  // Check refresh cooldown
  if (source.lastRunAt && source.refreshFrequencyHours) {
    const lastRun = new Date(source.lastRunAt).getTime();
    const cooldownMs = source.refreshFrequencyHours * 60 * 60 * 1000;
    const now = Date.now();
    if (now - lastRun < cooldownMs) {
      const remainingMins = Math.ceil((cooldownMs - (now - lastRun)) / 60000);
      return {
        canRun: false,
        reason: `Cooldown active. Next run in ${remainingMins} minutes.`,
      };
    }
  }

  return { canRun: true };
}

export function resetSources(): void {
  sources = [...DEMO_SOURCES];
}

export function getSourceStats(): Record<string, number> {
  const stats: Record<string, number> = {};
  for (const source of sources) {
    stats[source.type] = (stats[source.type] || 0) + 1;
  }
  return stats;
}
