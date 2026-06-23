export type HouseholdType = 
  | "family" 
  | "couple" 
  | "bachelor" 
  | "student" 
  | "working-woman" 
  | "group" 
  | "single-professional";

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

export type SearchProfile = {
  id: string;
  mode: "plan" | "check" | "compare" | "visit";
  rentingOrBuying: "renting" | "buying";
  householdType: HouseholdType;
  lookingFor: "full-flat" | "room-sublet" | "checking-listing";
  budgetMonthly: number;
  maxFirstMonthCash: number;
  commuteAnchors: { label: string; area: string }[];
  priorities: Priority[];
  dealBreakers: DealBreaker[];
};

export type Verdict = "visit" | "maybe" | "call-first" | "avoid";

export type Listing = {
  id: string;
  title: string;
  rawText: string;
  sourceType: "facebook" | "bikroy" | "bproperty" | "broker" | "direct";
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
  gasType: "line" | "cylinder" | "unknown";
  lift: boolean;
  generator: boolean;
  waterloggingRisk: "low" | "medium" | "high" | "unknown";
  utilityClarity: "clear" | "partial" | "unclear";
  commuteNotes: string;
  houseRules: string[];
  redFlags: string[];
  goodPoints: string[];
  imageUrl?: string;
};

export type ScoredListing = Listing & {
  scores: {
    budgetFit: number;
    firstMonthFit: number;
    commuteFit: number;
    householdFit: number;
    hiddenCostRisk: number;
    utilityClarity: number;
    waterloggingRisk: number;
    listingTrust: number;
    total: number;
  };
  verdict: Verdict;
  whyItFits: string;
  biggestRisk: string;
  questionsToAsk: string[];
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
};
