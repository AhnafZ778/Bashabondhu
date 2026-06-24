import { Listing } from "../types";
import { listings as seedListings } from "../data/listings";

/**
 * Listing Repository
 * Abstracts data access with static seed data fallback.
 * Supabase integration is optional behind env flag.
 */

export type ListingFilters = {
  area?: string;
  maxRent?: number;
  minRent?: number;
  householdType?: string;
  hasLift?: boolean;
  hasGenerator?: boolean;
  isActive?: boolean;
};

export function getListings(filters?: ListingFilters): Listing[] {
  // Static seed data (always available)
  let results = [...seedListings];

  if (filters) {
    if (filters.area) {
      results = results.filter(l => l.area.toLowerCase() === filters.area!.toLowerCase());
    }
    if (filters.maxRent !== undefined) {
      results = results.filter(l => l.rent <= filters.maxRent!);
    }
    if (filters.minRent !== undefined) {
      results = results.filter(l => l.rent >= filters.minRent!);
    }
    if (filters.householdType) {
      results = results.filter(l => {
        switch (filters.householdType) {
          case "family":
          case "couple":
            return l.familyAllowed;
          case "bachelor":
            return l.bachelorAllowed;
          case "student":
            return l.studentFriendly;
          case "working-woman":
            return l.femaleFriendly || l.familyAllowed;
          default:
            return true;
        }
      });
    }
    if (filters.hasLift !== undefined) {
      results = results.filter(l => l.lift === filters.hasLift);
    }
    if (filters.hasGenerator !== undefined) {
      results = results.filter(l => l.generator === filters.hasGenerator);
    }
    if (filters.isActive !== undefined) {
      results = results.filter(l => l.isActive === filters.isActive);
    }
  }

  return results;
}

export function getListingById(id: string): Listing | undefined {
  return seedListings.find(l => l.id === id);
}

export function getListingsByIds(ids: string[]): Listing[] {
  return seedListings.filter(l => ids.includes(l.id));
}

export function getAllListings(): Listing[] {
  return [...seedListings];
}
