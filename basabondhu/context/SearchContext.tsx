"use client";

import React, { createContext, useContext, useState } from "react";
import { SearchProfile, ScoredListing, ParsedListing, AreaProfile, Listing } from "@/lib/types";
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
  isSimulating: boolean;
  setIsSimulating: (simulating: boolean) => void;
  refinedScoredListings: ScoredListing[] | null;
  setRefinedScoredListings: (listings: ScoredListing[] | null) => void;
  showNeighborhoodFactors: boolean;
  setShowNeighborhoodFactors: (show: boolean) => void;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

import { mapHarvestedListingToListing } from "@/lib/harvester/listing-mapper";
import { useEffect } from "react";

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<SearchProfile | null>(null);
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [parsedListing, setParsedListing] = useState<ParsedListing | null>(null);
  const [activeAdjustments, setActiveAdjustments] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"landing" | "portal">("landing");
  const [activeTab, setActiveTab] = useState<"search" | "check" | "compare" | "visit">("search");
  const [dynamicListings, setDynamicListings] = useState<Listing[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [refinedScoredListings, setRefinedScoredListings] = useState<ScoredListing[] | null>(null);
  const [showNeighborhoodFactors, setShowNeighborhoodFactors] = useState(false);

  // Fetch live published listings from the harvester database
  useEffect(() => {
    fetch("/api/harvester/published-listings")
      .then((res) => res.json())
      .then((data) => {
        if (data.ok && Array.isArray(data.listings)) {
          const mapped = data.listings.map((l: any) => mapHarvestedListingToListing(l));
          setDynamicListings(mapped);
        }
      })
      .catch((err) => console.warn("Failed to fetch dynamic listings:", err));
  }, [profile]); // re-fetch when starting a new search profile

  // Compute scored and ranked listings dynamically when profile or adjustments change
  const scoredListings = React.useMemo(() => {
    if (!profile) return [];

    const combinedListings = [...dynamicListings, ...listings];

    let listToScore = refinedScoredListings || [];

    if (!refinedScoredListings) {
      listToScore = combinedListings.map(listing => 
        scoreListing(listing, profile, activeAdjustments)
      );
    }

    // Filter strictly by the user's selected commute anchor area
    const targetArea = profile.commuteAnchors[0]?.area;
    const filteredListings = targetArea
      ? listToScore.filter(l => l.area.toLowerCase() === targetArea.toLowerCase())
      : listToScore;

    // Sort by total score descending, put "avoid" at the bottom
    const sorted = [...filteredListings].sort((a, b) => {
      if (a.verdict === "avoid" && b.verdict !== "avoid") return 1;
      if (a.verdict !== "avoid" && b.verdict === "avoid") return -1;
      return b.scores.total - a.scores.total;
    });

    // Deduplicate by title to ensure different buildings
    const seenTitles = new Set<string>();
    const uniqueListings: ScoredListing[] = [];
    for (const listing of sorted) {
      const normalizedTitle = listing.title.toLowerCase().trim();
      if (!seenTitles.has(normalizedTitle)) {
        seenTitles.add(normalizedTitle);
        uniqueListings.push(listing);
      }
    }

    // DhakaImages files list
    const dhakaImagesList = [
      "8images.jpg",
      "highly-populated-dhaka-city-crammed-with-unplanned-buildings-KDCB15.jpg",
      "im88ages.jpg",
      "im99ages.jpg",
      "ima9ges.jpg",
      "imag22es.jpg",
      "imag999es.jpg",
      "imag9es.jpg",
      "image5s.jpg",
      "image88s.jpg",
      "image99s.jpg",
      "images.jpg",
      "istockphoto-2153844423-612x612.jpg"
    ];

    // Seed-based shuffle helper to ensure stability for current view/refinement
    const seed = (profile?.id || "") + (targetArea || "");
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    const getSeededRandom = (subSeed: number) => {
      const x = Math.sin(hash + subSeed) * 10000;
      return x - Math.floor(x);
    };

    const indices = Array.from({ length: dhakaImagesList.length }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const r = getSeededRandom(i);
      const j = Math.floor(r * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    let topCount = 0;
    return uniqueListings.map((listing) => {
      if (listing.verdict !== "avoid" && topCount < 3) {
        const imgName = dhakaImagesList[indices[topCount] % dhakaImagesList.length];
        topCount++;
        return {
          ...listing,
          imageUrl: `/DhakaImages/${imgName}`
        };
      }
      return listing;
    });
  }, [profile, activeAdjustments, refinedScoredListings, dynamicListings]);

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
    setRefinedScoredListings(null);
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
    setRefinedScoredListings(null);
    setActiveTab("search");
    setShowNeighborhoodFactors(false);
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
        setActiveTab,
        isSimulating,
        setIsSimulating,
        refinedScoredListings,
        setRefinedScoredListings,
        showNeighborhoodFactors,
        setShowNeighborhoodFactors
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
