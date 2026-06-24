import { AreaProfile } from "../types";
import { areas as seedAreas } from "../data/areas";

/**
 * Area Repository
 * Abstracts area data access with static seed data fallback.
 */

export function getAreas(): AreaProfile[] {
  return [...seedAreas];
}

export function getAreaBySlug(slug: string): AreaProfile | undefined {
  return seedAreas.find(
    a => a.id === slug || a.name.toLowerCase() === slug.toLowerCase()
  );
}

export function getAreaByName(name: string): AreaProfile | undefined {
  return seedAreas.find(
    a => a.name.toLowerCase() === name.toLowerCase()
  );
}

export function getAreaNames(): string[] {
  return seedAreas.map(a => a.name);
}
