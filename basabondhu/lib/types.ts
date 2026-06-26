export type HouseholdType = 
  | "family" 
  | "couple" 
  | "bachelor" 
  | "student" 
  | "working-woman" 
  | "group"
  | "single-professional";

import { HiddenCostSourceId, HiddenCostSource } from "./domain/hidden-cost-sources";

export type Priority =
  | "commute" 
  | "rent" 
  | "school" 
  | "safety" 
  | "gas" 
  | "lift"
  | "generator" 
  | "no-waterlogging" 
  | "bachelor-friendly"
  | "family-friendly" 
  | "quiet-area" 
  | "direct-owner";

export type DealBreaker =
  | "broker" 
  | "high-advance" 
  | "family-only" 
  | "no-lift"
  | "no-gas" 
  | "heavy-waterlogging" 
  | "far-from-transport";

export type HiddenCostSensitivity = {
  advanceTerms: "low" | "medium" | "high";
  serviceChargeClarity: "low" | "medium" | "high";
  gasClarity: "low" | "medium" | "high";
  brokerFeeAvoidance: "low" | "medium" | "high";
  utilityBillingClarity: "low" | "medium" | "high";
  roadAccessConcern: "low" | "medium" | "high";
  waterloggingConcern: "low" | "medium" | "high";
  agreementReceiptImportance: "low" | "medium" | "high";
};

export type SearchProfile = {
  id: string;
  mode: "plan" | "check" | "compare" | "visit";
  rentingOrBuying: "renting" | "buying";
  householdType: HouseholdType;
  lookingFor: "full-flat" | "room-sublet" | "checking-listing";
  budgetMonthly: number;
  maxFirstMonthCash: number;
  commuteAnchors: { label: string; area: string }[];
  husbandJobLocation?: string;
  wifeJobLocation?: string;
  childSchoolLocation?: string;
  needsHealthcare?: boolean;
  ownsCar?: boolean;
  preferredFacing?: "south" | "east" | "west" | "north" | "any";
  wantsNearbyMarket?: boolean;
  environmentPreference?: "quiet" | "commercial" | "any";
  priorities: Priority[];
  dealBreakers: DealBreaker[];
  hiddenCostSensitivity?: HiddenCostSensitivity;
};

export type Verdict = "visit" | "maybe" | "call-first" | "avoid";

export type ListingHiddenCostSignals = {
  mentionedScopes: HiddenCostSourceId[];
  unclearScopes: HiddenCostSourceId[];
  missingImportantScopes: HiddenCostSourceId[];
  contradictionScopes: HiddenCostSourceId[];
  sourceType: "owner" | "broker" | "facebook" | "bikroy" | "bproperty" | "whatsapp" | "unknown";
  paymentBeforeVisitRisk: boolean;
  proofAvailable: {
    photos: boolean;
    video: boolean;
    utilityInfo: boolean;
    serviceChargeBreakdown: boolean;
    ownerContact: boolean;
  };
};

export type Listing = {
  id: string;
  title: string;
  rawText: string;
  sourceType: "facebook" | "bikroy" | "bproperty" | "broker" | "direct" | "seed" | "unknown";
  area: string;
  addressHint: string;
  city: "Dhaka";
  latitude: number;
  longitude: number;
  rent: number;
  bedrooms: number;
  bathrooms?: number;
  sizeSqft?: number;
  tenantPreference: "family" | "bachelor" | "student" | "female" | "any" | "unknown";
  familyAllowed: boolean;
  bachelorAllowed: boolean;
  femaleFriendly: boolean;
  studentFriendly: boolean;
  advanceMonths: number;
  brokerFee: number | null;
  serviceCharge: number | null;
  serviceChargeKnown: boolean;
  brokerFeeKnown: boolean;
  gasType: "line" | "cylinder" | "unknown";
  lift: boolean;
  generator: boolean;
  waterloggingRisk: "low" | "medium" | "high" | "unknown";
  utilityClarity: "clear" | "partial" | "unclear";
  parkingAvailable?: boolean;
  facing?: "south" | "east" | "west" | "north";
  distanceToHospitalMins?: number;
  distanceToMarketMins?: number;
  environment?: "quiet" | "commercial" | "residential";
  commuteNotes: string;
  houseRules: string[];
  redFlags: string[];
  goodPoints: string[];
  missingFields: string[];
  imageUrl?: string;
  isActive: boolean;
  isDemo: boolean;
  hiddenCostSignals?: ListingHiddenCostSignals;
};

export type ScoredListing = Listing & {
  scores: {
    budgetFit: number;
    firstMonthFit: number;
    commuteFit: number;
    householdFit: number;
    hiddenScopePenalty: number;
    utilityClarity: number;
    waterloggingRisk: number;
    listingTrust: number;
    amenityFit: number;
    total: number;
  };
  hiddenCostScopes: HiddenCostSource[];
  verdict: Verdict;
  whyItFits: string;
  biggestRisk: string;
  questionsToAsk: string[];
};

export type AreaHiddenCostProfile = {
  commonHiddenCostScopes: HiddenCostSourceId[];
  highAttentionScopes: HiddenCostSourceId[];
  commonListingAmbiguities: HiddenCostSourceId[];
  rainyDayRisk: "low" | "medium" | "high";
  roadAccessRisk: "low" | "medium" | "high";
  utilityClarityRisk: "low" | "medium" | "high";
  brokerPresence: "low" | "medium" | "high";
  tenantRestrictionFrequency: "low" | "medium" | "high";
  localNotes: string[];
};

export type AreaProfile = {
  id: string;
  name: string;
  rentRange: string;
  rentLow: number;
  rentHigh: number;
  bestFor: string[];
  avoidIf: string[];
  commuteNotes: string;
  affordability: "low" | "medium" | "high";
  familySuitability: number;
  bachelorSuitability: number;
  femaleSuitability: number;
  schoolAccess: number;
  waterloggingRisk: "low" | "medium" | "high";
  utilityReliability: "low" | "medium" | "high";
  mainTradeoff: string;
  latitude: number;
  longitude: number;
  hiddenCostProfile?: AreaHiddenCostProfile;
  topSchools?: string[];
  topHospitals?: string[];
};

export type FirstMonthCost = {
  rent: number;
  advance: number;
  serviceCharge: number;
  brokerFee: number;
  movingEstimate: number;
  total: number;
  warnings: string[];
};

export type ParsedListing = {
  area: string | null;
  rent: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  tenantPreference: string | null;
  advanceMonths: number | null;
  lift: boolean | null;
  generator: boolean | null;
  gasType: string | null;
  serviceCharge: string | null;
  brokerFee: string | null;
  availability: string | null;
  missingFields: string[];
  confidence: "high" | "medium" | "low";
  hiddenCostMentions?: {
    advanceTerms?: string;
    serviceCharge?: string;
    brokerFee?: string;
    gasType?: string;
    electricityBilling?: string;
    waterBilling?: string;
    liftGeneratorCharge?: string;
    maintenanceSecurityCleaning?: string;
    parking?: string;
    repairCleaningPaint?: string;
    roadAccess?: string;
    waterlogging?: string;
    tenantRestriction?: string;
    agreementReceiptTerms?: string;
    rentIncreaseTerms?: string;
  };
};

export type ScanSummary = {
  scanned: number;
  removedBudget: number;
  removedCommute: number;
  removedHiddenCost: number;
  removedHouseholdMismatch: number;
  selected: number;
};

export type ComparisonResult = {
  listings: ScoredListing[];
  recommendedListingId: string;
  visitOrder: string[];
  summary: string;
  bestRentId: string;
  bestCommuteId: string;
  lowestUpfrontId: string;
};

export type ChecklistSection = {
  category: string;
  items: { label: string; description: string; checked: boolean }[];
};

export type HousingReport = {
  profileSummary: string;
  recommendedAreas: AreaProfile[];
  scanSummary: ScanSummary;
  topListings: ScoredListing[];
  comparison?: ComparisonResult;
  costSummaries: FirstMonthCost[];
  mainRisks: string[];
  questionsToAsk: string[];
  visitChecklist: ChecklistSection[];
  finalRecommendation: string;
  generatedAt: string;
};
