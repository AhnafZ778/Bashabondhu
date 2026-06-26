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
  setCompareListings: (ids: string[]) => void;
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

  // Scanning progress state
  scanStarted: boolean;
  setScanStarted: React.Dispatch<React.SetStateAction<boolean>>;
  scanStep: number;
  setScanStep: React.Dispatch<React.SetStateAction<number>>;
  scanComplete: boolean;
  setScanComplete: React.Dispatch<React.SetStateAction<boolean>>;
  scanAnswers: Record<string, string>;
  setScanAnswers: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  scanAiResponse: string;
  setScanAiResponse: React.Dispatch<React.SetStateAction<string>>;
  scanAiStepPage: number;
  setScanAiStepPage: React.Dispatch<React.SetStateAction<number>>;

  // Messy Listing Checker state
  checkerRawText: string;
  setCheckerRawText: React.Dispatch<React.SetStateAction<string>>;
  checkerParsed: ParsedListing | null;
  setCheckerParsed: React.Dispatch<React.SetStateAction<ParsedListing | null>>;
  checkerOverrideRent: number;
  setCheckerOverrideRent: React.Dispatch<React.SetStateAction<number>>;
  checkerOverrideAdvance: number;
  setCheckerOverrideAdvance: React.Dispatch<React.SetStateAction<number>>;
  checkerOverrideServiceCharge: number;
  setCheckerOverrideServiceCharge: React.Dispatch<React.SetStateAction<number>>;
  checkerOverrideBrokerFee: number;
  setCheckerOverrideBrokerFee: React.Dispatch<React.SetStateAction<number>>;
  checkerApiError: string | null;
  setCheckerApiError: React.Dispatch<React.SetStateAction<string | null>>;

  // Facebook Fetcher state
  fbUrl: string;
  setFbUrl: React.Dispatch<React.SetStateAction<string>>;
  fbCrawledText: string;
  setFbCrawledText: React.Dispatch<React.SetStateAction<string>>;
  fbParsed: ParsedListing | null;
  setFbParsed: React.Dispatch<React.SetStateAction<ParsedListing | null>>;
  fbIsCrawling: boolean;
  setFbIsCrawling: React.Dispatch<React.SetStateAction<boolean>>;
  fbCrawlLogs: string[];
  setFbCrawlLogs: React.Dispatch<React.SetStateAction<string[]>>;
  fbError: string | null;
  setFbError: React.Dispatch<React.SetStateAction<string | null>>;
  fbSkipTour: boolean;
  setFbSkipTour: React.Dispatch<React.SetStateAction<boolean>>;
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

  // Scanning progress state hooks
  const [scanStarted, setScanStarted] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [scanComplete, setScanComplete] = useState(false);
  const [scanAnswers, setScanAnswers] = useState<Record<string, string>>({});
  const [scanAiResponse, setScanAiResponse] = useState("");
  const [scanAiStepPage, setScanAiStepPage] = useState(0);

  // Messy Listing Checker state hooks
  const [checkerRawText, setCheckerRawText] = useState("");
  const [checkerParsed, setCheckerParsed] = useState<ParsedListing | null>(null);
  const [checkerOverrideRent, setCheckerOverrideRent] = useState<number>(0);
  const [checkerOverrideAdvance, setCheckerOverrideAdvance] = useState<number>(0);
  const [checkerOverrideServiceCharge, setCheckerOverrideServiceCharge] = useState<number>(0);
  const [checkerOverrideBrokerFee, setCheckerOverrideBrokerFee] = useState<number>(0);
  const [checkerApiError, setCheckerApiError] = useState<string | null>(null);

  // Facebook Fetcher state hooks
  const [fbUrl, setFbUrl] = useState("");
  const [fbCrawledText, setFbCrawledText] = useState("");
  const [fbParsed, setFbParsed] = useState<ParsedListing | null>(null);
  const [fbIsCrawling, setFbIsCrawling] = useState(false);
  const [fbCrawlLogs, setFbCrawlLogs] = useState<string[]>([]);
  const [fbError, setFbError] = useState<string | null>(null);
  const [fbSkipTour, setFbSkipTour] = useState(false);

  const [isLoaded, setIsLoaded] = useState(false);

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

  // Load state from localStorage on client-side mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("basabondhu_search_state");
      if (saved) {
        const parsedState = JSON.parse(saved);
        if (parsedState.profile) setProfile(parsedState.profile);
        if (parsedState.selectedForCompare) setSelectedForCompare(parsedState.selectedForCompare);
        if (parsedState.parsedListing) setParsedListing(parsedState.parsedListing);
        if (parsedState.activeAdjustments) setActiveAdjustments(parsedState.activeAdjustments);
        if (parsedState.viewMode) setViewMode(parsedState.viewMode);
        if (parsedState.activeTab) setActiveTab(parsedState.activeTab);
        if (parsedState.isSimulating !== undefined) setIsSimulating(parsedState.isSimulating);
        if (parsedState.refinedScoredListings) setRefinedScoredListings(parsedState.refinedScoredListings);
        if (parsedState.showNeighborhoodFactors !== undefined) setShowNeighborhoodFactors(parsedState.showNeighborhoodFactors);
        
        // Scanning states
        if (parsedState.scanStarted !== undefined) setScanStarted(parsedState.scanStarted);
        if (parsedState.scanStep !== undefined) setScanStep(parsedState.scanStep);
        if (parsedState.scanComplete !== undefined) setScanComplete(parsedState.scanComplete);
        if (parsedState.scanAnswers) setScanAnswers(parsedState.scanAnswers);
        if (parsedState.scanAiResponse !== undefined) setScanAiResponse(parsedState.scanAiResponse);
        if (parsedState.scanAiStepPage !== undefined) setScanAiStepPage(parsedState.scanAiStepPage);

        // Checker states
        if (parsedState.checkerRawText !== undefined) setCheckerRawText(parsedState.checkerRawText);
        if (parsedState.checkerParsed) setCheckerParsed(parsedState.checkerParsed);
        if (parsedState.checkerOverrideRent !== undefined) setCheckerOverrideRent(parsedState.checkerOverrideRent);
        if (parsedState.checkerOverrideAdvance !== undefined) setCheckerOverrideAdvance(parsedState.checkerOverrideAdvance);
        if (parsedState.checkerOverrideServiceCharge !== undefined) setCheckerOverrideServiceCharge(parsedState.checkerOverrideServiceCharge);
        if (parsedState.checkerOverrideBrokerFee !== undefined) setCheckerOverrideBrokerFee(parsedState.checkerOverrideBrokerFee);
        if (parsedState.checkerApiError !== undefined) setCheckerApiError(parsedState.checkerApiError);

        // Facebook states
        if (parsedState.fbUrl !== undefined) setFbUrl(parsedState.fbUrl);
        if (parsedState.fbCrawledText !== undefined) setFbCrawledText(parsedState.fbCrawledText);
        if (parsedState.fbParsed) setFbParsed(parsedState.fbParsed);
        if (parsedState.fbIsCrawling !== undefined) setFbIsCrawling(parsedState.fbIsCrawling);
        if (parsedState.fbCrawlLogs) setFbCrawlLogs(parsedState.fbCrawlLogs);
        if (parsedState.fbError !== undefined) setFbError(parsedState.fbError);
        if (parsedState.fbSkipTour !== undefined) setFbSkipTour(parsedState.fbSkipTour);
      }
    } catch (e) {
      console.warn("Failed to load search state from localStorage", e);
    }
    setIsLoaded(true);
  }, []);

  // Save state to localStorage on state changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      const stateToSave = {
        profile,
        selectedForCompare,
        parsedListing,
        activeAdjustments,
        viewMode,
        activeTab,
        isSimulating,
        refinedScoredListings,
        showNeighborhoodFactors,
        scanStarted,
        scanStep,
        scanComplete,
        scanAnswers,
        scanAiResponse,
        scanAiStepPage,
        checkerRawText,
        checkerParsed,
        checkerOverrideRent,
        checkerOverrideAdvance,
        checkerOverrideServiceCharge,
        checkerOverrideBrokerFee,
        checkerApiError,
        fbUrl,
        fbCrawledText,
        fbParsed,
        fbIsCrawling,
        fbCrawlLogs,
        fbError,
        fbSkipTour
      };
      localStorage.setItem("basabondhu_search_state", JSON.stringify(stateToSave));
    } catch (e) {
      console.warn("Failed to save search state to localStorage", e);
    }
  }, [
    isLoaded,
    profile,
    selectedForCompare,
    parsedListing,
    activeAdjustments,
    viewMode,
    activeTab,
    isSimulating,
    refinedScoredListings,
    showNeighborhoodFactors,
    scanStarted,
    scanStep,
    scanComplete,
    scanAnswers,
    scanAiResponse,
    scanAiStepPage,
    checkerRawText,
    checkerParsed,
    checkerOverrideRent,
    checkerOverrideAdvance,
    checkerOverrideServiceCharge,
    checkerOverrideBrokerFee,
    checkerApiError,
    fbUrl,
    fbCrawledText,
    fbParsed,
    fbIsCrawling,
    fbCrawlLogs,
    fbError,
    fbSkipTour
  ]);

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

    // Reset scan states
    setScanStarted(false);
    setScanStep(0);
    setScanComplete(false);
    setScanAnswers({});
    setScanAiResponse("");
    setScanAiStepPage(0);
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

  const setCompareListings = (ids: string[]) => {
    if (ids.length > 3) {
      setSelectedForCompare(ids.slice(0, 3));
    } else {
      setSelectedForCompare(ids);
    }
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

    // Reset scan states
    setScanStarted(false);
    setScanStep(0);
    setScanComplete(false);
    setScanAnswers({});
    setScanAiResponse("");
    setScanAiStepPage(0);

    // Reset checker states
    setCheckerRawText("");
    setCheckerParsed(null);
    setCheckerOverrideRent(0);
    setCheckerOverrideAdvance(0);
    setCheckerOverrideServiceCharge(0);
    setCheckerOverrideBrokerFee(0);
    setCheckerApiError(null);

    // Reset Facebook states
    setFbUrl("");
    setFbCrawledText("");
    setFbParsed(null);
    setFbIsCrawling(false);
    setFbCrawlLogs([]);
    setFbError(null);
    setFbSkipTour(false);
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
        setCompareListings,
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
        setShowNeighborhoodFactors,
        scanStarted,
        setScanStarted,
        scanStep,
        setScanStep,
        scanComplete,
        setScanComplete,
        scanAnswers,
        setScanAnswers,
        scanAiResponse,
        setScanAiResponse,
        scanAiStepPage,
        setScanAiStepPage,
        checkerRawText,
        setCheckerRawText,
        checkerParsed,
        setCheckerParsed,
        checkerOverrideRent,
        setCheckerOverrideRent,
        checkerOverrideAdvance,
        setCheckerOverrideAdvance,
        checkerOverrideServiceCharge,
        setCheckerOverrideServiceCharge,
        checkerOverrideBrokerFee,
        setCheckerOverrideBrokerFee,
        checkerApiError,
        setCheckerApiError,
        fbUrl,
        setFbUrl,
        fbCrawledText,
        setFbCrawledText,
        fbParsed,
        setFbParsed,
        fbIsCrawling,
        setFbIsCrawling,
        fbCrawlLogs,
        setFbCrawlLogs,
        fbError,
        setFbError,
        fbSkipTour,
        setFbSkipTour
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
