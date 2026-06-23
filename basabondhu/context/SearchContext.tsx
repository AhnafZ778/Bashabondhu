"use client";

import React, { createContext, useContext, useState } from "react";
import { SearchProfile, ScoredListing, ParsedListing, AreaProfile } from "@/lib/types";
import { listings } from "@/lib/data/listings";
import { areas } from "@/lib/data/areas";
import { scoreListing } from "@/lib/scoring";

type SearchContextType = {
  profile: SearchProfile | null;
  recommendedAreas: AreaProfile[];
  scoredListings: ScoredListing[];
  selectedForCompare: string[];
  parsedListing: ParsedListing | null;
  activeAdjustments: string[];
  planSearch: (profile: SearchProfile) => void;
  toggleAdjustment: (adjustment: string) => void;
  toggleCompare: (id: string) => void;
  clearCompare: () => void;
  setParsedListing: (parsed: ParsedListing | null) => void;
  resetSearch: () => void;
  viewMode: "landing" | "portal";
  setViewMode: (mode: "landing" | "portal") => void;
  activeTab: "search" | "check" | "compare" | "visit";
  setActiveTab: (tab: "search" | "check" | "compare" | "visit") => void;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<SearchProfile | null>(null);
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [parsedListing, setParsedListing] = useState<ParsedListing | null>(null);
  const [activeAdjustments, setActiveAdjustments] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"landing" | "portal">("landing");
  const [activeTab, setActiveTab] = useState<"search" | "check" | "compare" | "visit">("search");

  // Compute scored and ranked listings dynamically when profile or adjustments change
  const scoredListings = React.useMemo(() => {
    if (!profile) return [];

    const scored = listings.map(listing => 
      scoreListing(listing, profile, activeAdjustments)
    );

    // Sort by total score descending, put "avoid" at the bottom
    return scored.sort((a, b) => {
      if (a.verdict === "avoid" && b.verdict !== "avoid") return 1;
      if (a.verdict !== "avoid" && b.verdict === "avoid") return -1;
      return b.scores.total - a.scores.total;
    });
  }, [profile, activeAdjustments]);

  // Recommend Areas based on budget and suitability
  const recommendedAreas = React.useMemo(() => {
    if (!profile) return [];

    const userType = profile.householdType;
    const sortedAreas = [...areas].sort((a, b) => {
      // Suitability score based on user type
      let scoreA = 5;
      let scoreB = 5;
      if (userType === "family" || userType === "couple") {
        scoreA = a.familySuitability;
        scoreB = b.familySuitability;
      } else if (userType === "bachelor" || userType === "student") {
        scoreA = a.bachelorSuitability;
        scoreB = b.bachelorSuitability;
      } else if (userType === "working-woman") {
        scoreA = a.femaleSuitability;
        scoreB = b.femaleSuitability;
      }
      
      // Budget penalty if area average exceeds budget
      const budgetPenaltyA = a.rentLow > profile.budgetMonthly ? 5 : 0;
      const budgetPenaltyB = b.rentLow > profile.budgetMonthly ? 5 : 0;

      return (scoreB - budgetPenaltyB) - (scoreA - budgetPenaltyA);
    });

    return sortedAreas.slice(0, 4);
  }, [profile]);

  const planSearch = (newProfile: SearchProfile) => {
    setProfile(newProfile);
    setActiveAdjustments([]); // reset adjustments on new search
    setSelectedForCompare([]);
  };

  const toggleAdjustment = (adjustment: string) => {
    setActiveAdjustments(prev => 
      prev.includes(adjustment) 
        ? prev.filter(x => x !== adjustment) 
        : [...prev, adjustment]
    );
  };

  const toggleCompare = (id: string) => {
    setSelectedForCompare(prev => {
      if (prev.includes(id)) {
        return prev.filter(x => x !== id);
      }
      if (prev.length >= 3) {
        // limit comparison to 3 listings
        alert("You can compare up to 3 listings at a time.");
        return prev;
      }
      return [...prev, id];
    });
  };

  const clearCompare = () => {
    setSelectedForCompare([]);
  };

  const resetSearch = () => {
    setProfile(null);
    setSelectedForCompare([]);
    setParsedListing(null);
    setActiveAdjustments([]);
    setActiveTab("search");
  };

  return (
    <SearchContext.Provider
      value={{
        profile,
        recommendedAreas,
        scoredListings,
        selectedForCompare,
        parsedListing,
        activeAdjustments,
        planSearch,
        toggleAdjustment,
        toggleCompare,
        clearCompare,
        setParsedListing,
        resetSearch,
        viewMode,
        setViewMode,
        activeTab,
        setActiveTab
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}
