# IMPLEMENTATION_PLAN.md — BasaBondhu Hackathon MVP

---

## 1. Project Build Objective

### What will be built

A complete guided house-hunting web app for urban Bangladesh that takes a user's housing situation and returns **3 homes worth visiting**, with hidden-cost warnings, commute trade-offs, call-before-visit scripts, and a final housing report.

### Product promise

**"From messy listings to 3 homes worth visiting."**

### What is included in MVP

1. Landing page with search widget and persona quick-start
2. Mode selection (Plan / Check / Compare / Visit Prep)
3. Guided 4-step wizard form
4. Area recommendation cards (10 Dhaka areas)
5. Scan funnel animation ("104 listings scanned → 3 selected")
6. Top 3 listing cards with deep analysis drawer
7. Adjustment buttons (shorter commute, lower rent, skip brokers, no waterlogging)
8. Paste-listing checker with regex + optional OpenRouter parsing
9. First-month cost calculator with broker-fee toggle
10. Side-by-side comparison table (2–3 listings)
11. Call-before-visit Banglish script with copy button
12. Visit checklist adapted to user type
13. Final housing report (printable HTML / PDF)
14. Demo data seeding route
15. 100+ seed listings, 10 areas, 8 messy examples, 5 personas

### What is excluded from MVP

- Full property marketplace / listing portal
- Live scraping of Bproperty, Bikroy, Facebook
- Real authentication / user accounts
- Real payments, escrow, or legal agreements
- Landlord dashboard or admin panel
- Real-time chat or messaging
- Native mobile app
- Full buying workflow
- Map view (nice-to-have only)
- Screenshot OCR upload

---

## 2. Current Assumptions

### Stack assumptions

- Next.js 16 App Router with TypeScript (already initialized)
- Tailwind CSS v4 with `@tailwindcss/postcss` (already configured)
- Lucide icons (already installed)
- Inter font via `next/font/google` (already configured)
- No shadcn/ui installed yet — will add as needed
- Framer Motion installed (available for animations)

### What already exists

| Asset | Status | Location |
|-------|--------|----------|
| 10 area profiles | ✅ Done | [areas.ts](file:///home/aspen/ProjectCollections/bashaBondhu/Bashabondhu/basabondhu/lib/data/areas.ts) |
| 100+ listings (20 hand-crafted + 90 generated) | ✅ Done | [listings.ts](file:///home/aspen/ProjectCollections/bashaBondhu/Bashabondhu/basabondhu/lib/data/listings.ts) |
| 5 personas (incl. Rafi & Mita) | ✅ Done | [personas.ts](file:///home/aspen/ProjectCollections/bashaBondhu/Bashabondhu/basabondhu/lib/data/personas.ts) |
| 8 messy listing examples | ✅ Done | [messy-examples.ts](file:///home/aspen/ProjectCollections/bashaBondhu/Bashabondhu/basabondhu/lib/data/messy-examples.ts) |
| Regex parser (12 extraction rules) | ✅ Done | [parser.ts](file:///home/aspen/ProjectCollections/bashaBondhu/Bashabondhu/basabondhu/lib/parser.ts) |
| Scoring engine (8 factors + adjustments) | ✅ Done | [scoring.ts](file:///home/aspen/ProjectCollections/bashaBondhu/Bashabondhu/basabondhu/lib/scoring.ts) |
| Cost calculator | ✅ Done | [cost-calculator.ts](file:///home/aspen/ProjectCollections/bashaBondhu/Bashabondhu/basabondhu/lib/cost-calculator.ts) |
| TypeScript types (Listing, SearchProfile, ScoredListing, etc.) | ✅ Done | [types.ts](file:///home/aspen/ProjectCollections/bashaBondhu/Bashabondhu/basabondhu/lib/types.ts) |
| SearchContext (global state) | ✅ Done | [SearchContext.tsx](file:///home/aspen/ProjectCollections/bashaBondhu/Bashabondhu/basabondhu/context/SearchContext.tsx) |
| Landing page | ✅ Done | [LandingPage.tsx](file:///home/aspen/ProjectCollections/bashaBondhu/Bashabondhu/basabondhu/components/LandingPage.tsx) |
| Wizard (4-step form) | ✅ Done | [Wizard.tsx](file:///home/aspen/ProjectCollections/bashaBondhu/Bashabondhu/basabondhu/components/Wizard.tsx) |
| Area recommendations | ✅ Done | [AreaRecommendations.tsx](file:///home/aspen/ProjectCollections/bashaBondhu/Bashabondhu/basabondhu/components/AreaRecommendations.tsx) |
| Listing grid + detail drawer | ✅ Done | [ListingGrid.tsx](file:///home/aspen/ProjectCollections/bashaBondhu/Bashabondhu/basabondhu/components/ListingGrid.tsx) |
| Listing checker (paste + parse) | ✅ Done | [ListingChecker.tsx](file:///home/aspen/ProjectCollections/bashaBondhu/Bashabondhu/basabondhu/components/ListingChecker.tsx) |
| Comparison table | ✅ Done | [ListingComparison.tsx](file:///home/aspen/ProjectCollections/bashaBondhu/Bashabondhu/basabondhu/components/ListingComparison.tsx) |
| Visit planner + call scripts | ✅ Done | [VisitPlanner.tsx](file:///home/aspen/ProjectCollections/bashaBondhu/Bashabondhu/basabondhu/components/VisitPlanner.tsx) |
| Navbar | ✅ Done | [Navbar.tsx](file:///home/aspen/ProjectCollections/bashaBondhu/Bashabondhu/basabondhu/components/Navbar.tsx) |
| OpenRouter parse API route | ✅ Done | [route.ts](file:///home/aspen/ProjectCollections/bashaBondhu/Bashabondhu/basabondhu/app/api/parse/route.ts) |
| Design tokens (CSS variables) | ✅ Done | [globals.css](file:///home/aspen/ProjectCollections/bashaBondhu/Bashabondhu/basabondhu/app/globals.css) |
| Portal layout with tab nav | ✅ Done | [portal/layout.tsx](file:///home/aspen/ProjectCollections/bashaBondhu/Bashabondhu/basabondhu/app/portal/layout.tsx) |

### What is missing (gaps to close)

| Gap | Priority | Description |
|-----|----------|-------------|
| Scan funnel animation | 🔴 Critical | No interstitial "scanning 104 listings" screen between wizard and results |
| Final housing report page | 🔴 Critical | No `/report` route or printable report component |
| Dedicated mode selector | 🟡 Important | No explicit "What do you want to do today?" mode screen; homepage goes straight to search or portal |
| API routes (areas, listings, search/plan, compare, report) | 🟡 Important | Only `/api/parse` exists; no structured backend API layer |
| Service layer (separate `.service.ts` files) | 🟡 Important | Logic is embedded in components and `lib/`; no service abstraction |
| Seed data route (`/api/demo/seed`) | 🟡 Important | No demo data seeding endpoint |
| Repository pattern (static + Supabase) | 🟡 Important | No repository layer; components import seed data directly |
| 3 more personas to reach 8 | 🟡 Important | Only 5 personas exist |
| 22+ more messy listing examples to reach 30 | 🟡 Important | Only 8 messy examples exist |
| Broker-fee toggle in cost calculator UI | 🟢 Nice | Cost breakdown is static; no interactive toggle |
| User feedback / "Mark as Visited" flow | 🟢 Nice | No post-visit feedback mechanism |
| Income input for affordability warnings | 🟢 Nice | No BBS/HIES affordability threshold check |
| Map view | 🟢 Nice | No Leaflet/OSM integration |

### API assumptions

- OpenRouter is optional; regex parser is the required primary
- Supabase is optional; static seed data is the required primary
- No external API dependency for core demo flow

### Demo assumptions

- Primary demo persona: Rafi & Mita (couple from Cumilla)
- Demo must work offline with seed data
- "104 listings scanned" is backed by actual scoring of 100+ listings

---

## 3. System Architecture

```txt
┌─────────────────────────────────────────────────┐
│                  Browser / Client                │
│ Landing Page → Mode Selector → Wizard/Parser     │
│ → Scan Animation → Results → Compare → Report    │
└────────────────────────┬────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────┐
│              Next.js App Router                  │
│                                                  │
│ Client Components      Server Components         │
│ (SearchContext,         (metadata, layout)        │
│  interactive UI)                                  │
└────────────────────────┬────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────┐
│            Next.js Route Handlers                │
│                                                  │
│ GET  /api/areas                                  │
│ GET  /api/listings                               │
│ POST /api/listings/check                         │
│ POST /api/search/plan                            │
│ POST /api/listings/recommend                     │
│ POST /api/compare                                │
│ POST /api/report/generate                        │
│ POST /api/demo/seed                              │
└────────────────────────┬────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────┐
│              Service Layer                       │
│ listing-parser · scoring · recommendation        │
│ cost · question · checklist · compare · report   │
│ area-recommendation · demo-scan · search-profile │
└────────────────────────┬────────────────────────┘
                         │
             ┌───────────┴───────────┐
             ▼                       ▼
┌──────────────────────┐  ┌──────────────────────┐
│  Static Seed Data    │  │  Supabase Postgres    │
│  (always available)  │  │  (optional, enhanced) │
│                      │  │                       │
│  lib/data/areas.ts   │  │  areas table          │
│  lib/data/listings.ts│  │  listings table       │
│  lib/data/personas.ts│  │  search_sessions      │
│  lib/data/messy-     │  │  parsed_listing_checks│
│    examples.ts       │  │  listing_evaluations  │
└──────────────────────┘  └──────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────────┐
│           Optional AI Layer                       │
│ OpenRouter (google/gemini-2.5-flash)              │
│ For: messy listing parsing, call script rewriting │
│ Fallback: regex parser always available           │
└──────────────────────────────────────────────────┘
```

### Data flow rule

```txt
1. Try Supabase repository → if NEXT_PUBLIC_USE_SUPABASE=true
2. Fall back to static seed data → always available
3. Try OpenRouter parser → if OPENROUTER_API_KEY is set
4. Fall back to regex parser → always available
```

---

## 4. Final Folder Structure

```txt
basabondhu/
├── app/
│   ├── api/
│   │   ├── areas/
│   │   │   └── route.ts                    # GET areas
│   │   ├── listings/
│   │   │   ├── route.ts                    # GET listings
│   │   │   ├── check/
│   │   │   │   └── route.ts                # POST paste-listing check
│   │   │   └── recommend/
│   │   │       └── route.ts                # POST re-rank with adjustments
│   │   ├── search/
│   │   │   └── plan/
│   │   │       └── route.ts                # POST create search plan
│   │   ├── compare/
│   │   │   └── route.ts                    # POST compare listings
│   │   ├── report/
│   │   │   └── generate/
│   │   │       └── route.ts                # POST generate report
│   │   ├── demo/
│   │   │   └── seed/
│   │   │       └── route.ts                # POST seed demo data
│   │   └── parse/
│   │       └── route.ts                    # POST OpenRouter parse (existing)
│   ├── page.tsx                             # Landing (existing)
│   ├── layout.tsx                           # Root layout (existing)
│   ├── globals.css                          # Design tokens (existing)
│   ├── favicon.ico
│   └── portal/
│       ├── layout.tsx                       # Portal tab nav (existing)
│       ├── page.tsx                         # Results/dashboard (existing)
│       ├── wizard/
│       │   └── page.tsx                     # Guided form (existing)
│       ├── parser/
│       │   └── page.tsx                     # Check listing (existing)
│       ├── compare/
│       │   └── page.tsx                     # Compare view (existing)
│       ├── visit/
│       │   └── page.tsx                     # Visit prep (existing)
│       └── report/
│           └── page.tsx                     # [NEW] Final report page
│
├── components/
│   ├── Navbar.tsx                           # (existing)
│   ├── LandingPage.tsx                      # (existing)
│   ├── Wizard.tsx                           # (existing)
│   ├── AreaRecommendations.tsx              # (existing)
│   ├── ListingGrid.tsx                      # (existing)
│   ├── ListingChecker.tsx                   # (existing)
│   ├── ListingComparison.tsx                # (existing)
│   ├── VisitPlanner.tsx                     # (existing)
│   ├── DemoScanAnimation.tsx                # [NEW] Scan funnel interstitial
│   ├── ReportPreview.tsx                    # [NEW] Final report view
│   ├── ModeSelector.tsx                     # [NEW] "What do you want to do?"
│   ├── HousingProfileSummary.tsx            # [NEW] Profile recap card
│   └── VerdictBadge.tsx                     # [NEW] Reusable verdict pill
│
├── context/
│   └── SearchContext.tsx                    # (existing)
│
├── lib/
│   ├── types.ts                             # (existing — will extend)
│   ├── parser.ts                            # (existing)
│   ├── scoring.ts                           # (existing)
│   ├── cost-calculator.ts                   # (existing)
│   ├── data/
│   │   ├── areas.ts                         # (existing)
│   │   ├── listings.ts                      # (existing)
│   │   ├── personas.ts                      # (existing)
│   │   └── messy-examples.ts                # (existing — will expand)
│   ├── services/
│   │   ├── listing-parser.service.ts        # [NEW] Orchestrate regex + AI
│   │   ├── scoring.service.ts               # [NEW] Wrap scoring.ts
│   │   ├── recommendation.service.ts        # [NEW] Filter → Score → Rank → Select 3
│   │   ├── area-recommendation.service.ts   # [NEW] Area scoring for profile
│   │   ├── cost.service.ts                  # [NEW] Wrap cost-calculator.ts
│   │   ├── question.service.ts              # [NEW] Generate call questions
│   │   ├── checklist.service.ts             # [NEW] Generate visit checklist
│   │   ├── compare.service.ts               # [NEW] Compare 2-3 listings
│   │   ├── report.service.ts                # [NEW] Build report JSON + HTML
│   │   ├── demo-scan.service.ts             # [NEW] Generate scan funnel data
│   │   └── search-profile.service.ts        # [NEW] Validate + infer profile
│   ├── repositories/
│   │   ├── listing.repository.ts            # [NEW] Static + optional Supabase
│   │   └── area.repository.ts               # [NEW] Static + optional Supabase
│   └── utils/
│       ├── currency.ts                      # [NEW] BDT formatting helpers
│       └── text-normalizer.ts               # [NEW] Banglish text cleaning
│
├── public/
│   └── landing.jpeg                         # Hero image
│
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
└── eslint.config.mjs
```

---

## 5. Data Model

### 5.1 Listing (existing — extend)

```ts
export type Listing = {
  id: string;
  title: string;
  rawText: string;
  sourceType: "facebook" | "bikroy" | "bproperty" | "broker" | "direct" | "seed";
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
  brokerFeeKnown: boolean;       // [ADD]
  serviceCharge: number | null;
  serviceChargeKnown: boolean;
  gasType: "line" | "cylinder" | "unknown";
  lift: boolean;
  generator: boolean;
  waterReliability?: "low" | "medium" | "high" | "unknown";     // [ADD]
  electricityBackup?: "none" | "ips" | "generator" | "unknown"; // [ADD]
  waterloggingRisk: "low" | "medium" | "high" | "unknown";
  utilityClarity: "clear" | "partial" | "unclear";
  commuteNotes: string;
  houseRules: string[];
  redFlags: string[];
  goodPoints: string[];
  missingFields: string[];       // [ADD]
  imageUrl?: string;
  isActive?: boolean;            // [ADD]
  isDemo?: boolean;              // [ADD]
};
```

### 5.2 AreaProfile (existing — no changes needed)

```ts
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
  familySuitability: number;     // 1-10
  bachelorSuitability: number;   // 1-10
  femaleSuitability: number;     // 1-10
  schoolAccess: number;          // 1-10
  waterloggingRisk: "low" | "medium" | "high";
  utilityReliability: "low" | "medium" | "high";
  mainTradeoff: string;
  latitude: number;
  longitude: number;
};
```

### 5.3 SearchProfile (existing — no changes needed)

```ts
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
```

### 5.4 ScanSummary (NEW)

```ts
export type ScanSummary = {
  scanned: number;
  removedBudget: number;
  removedCommute: number;
  removedHiddenCost: number;
  removedHouseholdMismatch: number;
  selected: number;
};
```

### 5.5 ComparisonResult (NEW)

```ts
export type ComparisonResult = {
  listings: ScoredListing[];
  recommendedListingId: string;
  visitOrder: string[];
  summary: string;
  bestRentId: string;
  bestCommuteId: string;
  lowestUpfrontId: string;
};
```

### 5.6 HousingReport (NEW)

```ts
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

export type ChecklistSection = {
  category: string;
  items: { label: string; description: string; checked: boolean }[];
};
```

---

## 6. Database Plan

### Phase 1: Static seed data (required, already done)

All data lives in `lib/data/*.ts`. Components import directly.

### Phase 2: Supabase tables (optional, for credibility)

| Table | MVP Required? | Purpose |
|-------|---------------|---------|
| `areas` | Optional | Mirror of seed areas |
| `listings` | Optional | Mirror of seed listings |
| `raw_listing_examples` | Optional | Messy listing demo examples |
| `search_sessions` | Optional | User journey persistence |
| `parsed_listing_checks` | Optional | Store user-pasted checks |
| `listing_evaluations` | Optional | Per-listing scoring results |
| `comparisons` | Optional | Comparison snapshots |
| `reports` | Optional | Generated report storage |
| `demo_personas` | Optional | Pitch-ready personas |
| `app_events` | Optional | Analytics events |

### Repository pattern

```ts
// lib/repositories/listing.repository.ts
export function getListings(filters?: ListingFilters): Listing[] {
  if (process.env.NEXT_PUBLIC_USE_SUPABASE === "true") {
    return supabaseListingRepo.getListings(filters);
  }
  return staticListingRepo.getListings(filters);
}
```

---

## 7. Dataset Creation Plan

### 7.1 Area profiles — ✅ DONE (10 areas)

Already created: Banasree, Badda, Mohakhali, Tejgaon, Mohammadpur, Lalmatia, Mirpur, Uttara, Bashundhara, Dhanmondi.

### 7.2 Listings — ✅ DONE (100+ listings)

20 hand-crafted anchor listings + 90 generated listings (9 per area).

**Distribution of existing 20 anchors:**
- 2× Banasree (family, broker)
- 2× Badda (bachelor, student)
- 2× Mohakhali (premium, bachelor)
- 2× Tejgaon (couple, bachelor)
- 2× Mirpur (budget, female)
- 1× Uttara (couple)
- 1× Bashundhara (student sublet)
- 1× Dhanmondi (premium family)
- 1× Lalmatia (premium family)
- 1× Mohammadpur (family)
- 3× other anchors

**Improvement needed:** Add `missingFields` and `brokerFeeKnown` fields to existing listings type.

### 7.3 Messy raw listing examples — ⚠️ NEEDS EXPANSION (8 → 30)

Currently 8 examples. Need 22 more covering:
- 5 more Banglish Facebook-style posts
- 5 WhatsApp broker messages (vague, urgent)
- 3 Bikroy-style formatted posts
- 3 Bproperty-style posts
- 3 "to-let" sign style (minimal info)
- 3 mixed Bangla-numeral posts (৳২৮,০০০)

### 7.4 Personas — ⚠️ NEEDS EXPANSION (5 → 8)

Currently: Rafi & Mita, Nusrat, Abrar, Haque Family, Tasnim.

Add 3 more:
1. **Sabbir (Relocating Professional)** — Moving from Chittagong, budget ৳30k, works near Gulshan, needs area guidance
2. **Maliha & Roommates (Female Group)** — 3 working women, budget ৳18k, need female-friendly flat in Uttara/Bashundhara
3. **Kamal (Budget Bachelor)** — Just graduated, first job in Tejgaon, budget ৳10k, needs sublet

---

## 8. Listing Parser Plan

### 8.1 Regex parser — ✅ DONE

File: [parser.ts](file:///home/aspen/ProjectCollections/bashaBondhu/Bashabondhu/basabondhu/lib/parser.ts)

Already extracts: area, rent (28k format), bedrooms, bathrooms, tenant preference, advance months, lift, generator, gas type, service charge, broker fee, availability, missing fields, confidence.

### 8.2 OpenRouter parser — ✅ DONE

File: [route.ts](file:///home/aspen/ProjectCollections/bashaBondhu/Bashabondhu/basabondhu/app/api/parse/route.ts)

Uses `google/gemini-2.5-flash` via OpenRouter with structured JSON prompt.

### 8.3 Parser orchestration service — [NEW]

```ts
// lib/services/listing-parser.service.ts
export async function parseListing(rawText: string): Promise<ParsedListing> {
  const regexResult = parseMessyListing(rawText);

  if (process.env.OPENROUTER_API_KEY) {
    try {
      const aiResult = await callOpenRouterParser(rawText);
      return mergeParseResults(regexResult, aiResult);
    } catch {
      return regexResult; // fallback
    }
  }

  return regexResult;
}
```

### 8.4 Fallback behavior

```txt
1. Regex parser runs → always returns structured result
2. OpenRouter parser attempted → if API key exists
3. Results merged → AI fills gaps in regex output
4. If OpenRouter fails → regex result returned as-is
5. Confidence set to "low" if >5 fields missing
```

---

## 9. Scoring and Verdict Logic

### 9.1 Scoring factors — ✅ DONE

Already implemented in [scoring.ts](file:///home/aspen/ProjectCollections/bashaBondhu/Bashabondhu/basabondhu/lib/scoring.ts):

| Factor | Weight (default) | Source |
|--------|-------------------|--------|
| Budget Fit | 0.25 | `listing.rent` vs `profile.budgetMonthly` |
| First Month Fit | 0.10 | `cost.total` vs `profile.maxFirstMonthCash` |
| Commute Fit | 0.20 | 10×10 area commute matrix |
| Household Fit | 0.15 | Tenant preference vs user type |
| Hidden Cost Fit | 0.15 | Service charge + broker + advance clarity |
| Utility Clarity | 0.05 | Gas, service charge known |
| Waterlogging Fit | 0.05 | Area waterlogging risk level |
| Listing Trust | 0.05 | Completeness of listing data |

### 9.2 Dynamic weight adjustment — ✅ DONE

- `shorter-commute` → commute weight jumps to 0.40
- `lower-rent` → budget weight jumps to 0.40
- `avoid-broker` → 40-point penalty on broker listings
- `avoid-waterlogging` → 25–50 point penalty on medium/high risk

### 9.3 Verdict logic — ✅ DONE

| Verdict | Conditions |
|---------|-----------|
| **Visit** | `total >= 75` AND `hiddenCostRisk < 30` AND no deal-breaker |
| **Maybe** | `total >= 55` AND `hiddenCostRisk < 50` |
| **Call First** | Everything else that isn't avoid |
| **Avoid** | Deal-breaker triggered OR `total < 40` OR `householdFit === 0` |

---

## 10. Feature Implementation Cycles

### Cycle 0: Project Setup Verification

**Goal:** Ensure project builds and runs correctly.

**Tasks:**
1. [ ] Run `npm install` in `basabondhu/`
2. [ ] Run `npm run dev` and verify homepage loads
3. [ ] Verify all existing routes render without errors
4. [ ] Verify Rafi & Mita persona demo flow works end-to-end
5. [ ] Verify paste-listing checker works with sample text

**Acceptance criteria:**
- Dev server starts without errors
- All 4 portal tabs render content
- Persona click navigates to results with scored listings

---

### Cycle 1: Seed Data Expansion

**Goal:** Expand dataset to full hackathon spec.

**Tasks:**
1. [ ] Add `missingFields` and `brokerFeeKnown` to Listing type in `lib/types.ts`
2. [ ] Update existing 20 anchor listings with new fields in `lib/data/listings.ts`
3. [ ] Update generated listings to include new fields in `lib/data/listings.ts`
4. [ ] Add 3 new personas (Sabbir, Maliha, Kamal) to `lib/data/personas.ts`
5. [ ] Add 22 new messy listing examples to `lib/data/messy-examples.ts`

**Files:** `lib/types.ts`, `lib/data/listings.ts`, `lib/data/personas.ts`, `lib/data/messy-examples.ts`

**Acceptance criteria:**
- Types compile without errors
- `listings.length >= 100`
- `personas.length === 8`
- `messyExamples.length >= 30`
- All messy examples parse correctly with regex parser

---

### Cycle 2: Service Layer Extraction

**Goal:** Extract business logic from components into testable service files.

**Tasks:**
1. [ ] Create `lib/services/scoring.service.ts` — wraps `scoreListing()` with profile validation
2. [ ] Create `lib/services/cost.service.ts` — wraps `calculateFirstMonthCost()` with affordability warnings
3. [ ] Create `lib/services/listing-parser.service.ts` — orchestrates regex + optional OpenRouter
4. [ ] Create `lib/services/recommendation.service.ts` — filter → score → rank → select top 3
5. [ ] Create `lib/services/area-recommendation.service.ts` — area scoring for profile
6. [ ] Create `lib/services/question.service.ts` — generate call-before-visit questions
7. [ ] Create `lib/services/checklist.service.ts` — generate visit checklist by user type
8. [ ] Create `lib/services/compare.service.ts` — compare 2–3 listings with summary
9. [ ] Create `lib/services/demo-scan.service.ts` — generate scan funnel summary
10. [ ] Create `lib/services/search-profile.service.ts` — validate and infer search profile
11. [ ] Create `lib/services/report.service.ts` — build full report JSON

**Files:** All 11 service files in `lib/services/`

**Acceptance criteria:**
- Each service exports pure functions with typed inputs/outputs
- `recommendation.service.ts` returns `{ scanSummary, topListings, allScoredListings }`
- `demo-scan.service.ts` returns `ScanSummary` with accurate filter counts
- Services are importable from both client components and API routes

---

### Cycle 3: Scan Funnel Animation

**Goal:** Build the "104 listings scanned → 3 selected" interstitial that bridges wizard and results.

**Tasks:**
1. [ ] Create `components/DemoScanAnimation.tsx`
2. [ ] Show animated counter: "Scanning 104 Dhaka listings..."
3. [ ] Show step-by-step filter: "Removed 37 over budget" → "Removed 21 bad commute" → "Removed 14 hidden costs" → "Selected 3 worth visiting"
4. [ ] Use Framer Motion for number counting and step reveals
5. [ ] Auto-transition to results after animation completes (~4 seconds)
6. [ ] Integrate into portal flow: wizard submit → scan animation → results

**Files:** `components/DemoScanAnimation.tsx`, `context/SearchContext.tsx`, `app/portal/page.tsx`

**Acceptance criteria:**
- Animation plays for 3–4 seconds after wizard submit
- Numbers correspond to actual `ScanSummary` from `demo-scan.service.ts`
- Smooth transitions with Framer Motion
- Auto-navigates to results when done
- Judges see the "value demonstration" moment

---

### Cycle 4: Mode Selector + Landing Polish

**Goal:** Add explicit mode selection and polish the homepage.

**Tasks:**
1. [ ] Create `components/ModeSelector.tsx` — "What do you want to do today?"
2. [ ] Add 4 mode cards: Plan My Search, Check This Listing, Compare My Options, Prepare for Visit
3. [ ] Each card navigates to the appropriate portal tab
4. [ ] Integrate into landing page or portal entry
5. [ ] Polish landing hero section for demo impact

**Files:** `components/ModeSelector.tsx`, `components/LandingPage.tsx`

**Acceptance criteria:**
- 4 clear mode options visible
- Each mode navigates correctly
- UI is premium and calm, not cluttered

---

### Cycle 5: API Routes Implementation

**Goal:** Build all required backend API routes.

**Tasks:**
1. [ ] `GET /api/areas` — returns area profiles from seed/Supabase
2. [ ] `GET /api/listings` — returns filtered listings (area, minRent, maxRent, householdType)
3. [ ] `POST /api/listings/check` — parse + evaluate pasted listing, return verdict + questions
4. [ ] `POST /api/search/plan` — accept profile, return session + areas + scanSummary + topListings
5. [ ] `POST /api/listings/recommend` — accept session + adjustment, return re-ranked listings
6. [ ] `POST /api/compare` — accept listing IDs, return comparison table data
7. [ ] `POST /api/report/generate` — accept session data, return report JSON + HTML
8. [ ] `POST /api/demo/seed` — seed demo data (dev mode only)

**Files:** 8 route files in `app/api/`

**Acceptance criteria:**
- All routes return valid JSON
- All routes have error handling with fallback responses
- `/api/listings/check` returns regex result if OpenRouter fails
- `/api/search/plan` returns scan summary with real filter counts

---

### Cycle 6: Repository Layer

**Goal:** Abstract data access behind repository pattern.

**Tasks:**
1. [ ] Create `lib/repositories/listing.repository.ts` — `getListings()`, `getListingById()`
2. [ ] Create `lib/repositories/area.repository.ts` — `getAreas()`, `getAreaBySlug()`
3. [ ] Implement static fallback (import from `lib/data/`)
4. [ ] Add optional Supabase implementation behind env flag
5. [ ] Update API routes to use repositories

**Files:** `lib/repositories/*.ts`

**Acceptance criteria:**
- App works identically whether Supabase is connected or not
- `NEXT_PUBLIC_USE_SUPABASE=false` uses static seed data
- `NEXT_PUBLIC_USE_SUPABASE=true` attempts Supabase, falls back to static on error

---

### Cycle 7: Final Report Page

**Goal:** Build the printable housing report that consolidates the entire user journey.

**Tasks:**
1. [ ] Create `components/ReportPreview.tsx`
2. [ ] Create `app/portal/report/page.tsx`
3. [ ] Report sections: Profile Summary, Recommended Areas, Scan Summary, Top 3 Listings, Cost Comparison, Risk Summary, Call Questions, Visit Checklist, Final Recommendation
4. [ ] Add print-friendly CSS (`@media print`)
5. [ ] Add "Download as PDF" button using browser print or jsPDF
6. [ ] Add "Share Report" copy-to-clipboard

**Files:** `components/ReportPreview.tsx`, `app/portal/report/page.tsx`, `lib/services/report.service.ts`

**Acceptance criteria:**
- Report renders all 9 sections with real data from current session
- Report is printable with clean formatting
- PDF download works
- Report includes timestamp and BasaBondhu branding

---

### Cycle 8: Listing Detail + Compare Enhancements

**Goal:** Polish the listing detail drawer and comparison table.

**Tasks:**
1. [ ] Add broker-fee toggle to cost breakdown in `ListingGrid.tsx` detail drawer
2. [ ] Create `components/VerdictBadge.tsx` — reusable verdict pill component
3. [ ] Create `components/HousingProfileSummary.tsx` — compact profile recap
4. [ ] Add "Visit Order" recommendation to comparison table
5. [ ] Add "Best For" summary row to comparison table
6. [ ] Add recommended visit order section to `ListingComparison.tsx`

**Files:** `components/ListingGrid.tsx`, `components/ListingComparison.tsx`, new component files

**Acceptance criteria:**
- Toggling broker fee on/off recalculates upfront cost in real-time
- VerdictBadge shows correct color + label for all 4 verdicts
- Comparison table highlights "Visit First" recommendation

---

### Cycle 9: Portal Navigation + Tab Renaming

**Goal:** Align portal tabs with the 4 product modes.

**Tasks:**
1. [ ] Rename portal tabs to match product modes: "Plan Search" → "Check Listing" → "Compare Homes" → "Prepare Visit"
2. [ ] Add "Generate Report" tab/button
3. [ ] Add floating compare bar when listings are selected
4. [ ] Ensure portal sidebar shows profile summary when active
5. [ ] Add "Report" to portal navigation

**Files:** `app/portal/layout.tsx`, `app/portal/page.tsx`

**Acceptance criteria:**
- Tab labels match PRD mode names
- Report tab appears in navigation
- Compare count badge updates in real-time

---

### Cycle 10: Polish, Animations, Demo Hardening

**Goal:** Final visual polish and demo stability.

**Tasks:**
1. [ ] Add page transition animations using Framer Motion
2. [ ] Add skeleton loading states for all data-dependent components
3. [ ] Harden Rafi & Mita demo path: wizard → scan → results → adjust → paste → compare → report
4. [ ] Test all 8 personas produce reasonable results
5. [ ] Cache demo responses for stability
6. [ ] Add error boundaries to all route pages
7. [ ] Mobile responsiveness pass on all components
8. [ ] Verify color contrast meets WCAG AA
9. [ ] Test print layout for report
10. [ ] Freeze codebase — no more feature work

**Files:** All component files, `globals.css`

**Acceptance criteria:**
- Rafi & Mita demo completes without errors in under 3 minutes
- All pages render correctly on mobile (375px width)
- No console errors during demo flow
- Report prints cleanly on A4 paper

---

## 11. API Implementation Plan

### 11.1 GET /api/areas

| Field | Value |
|-------|-------|
| Method | GET |
| Request | None (optional `?city=Dhaka`) |
| Response | `{ areas: AreaProfile[] }` |
| Services | `area.repository.ts` |
| Fallback | Return static seed areas |

### 11.2 GET /api/listings

| Field | Value |
|-------|-------|
| Method | GET |
| Request | `?area=Banasree&maxRent=35000&householdType=couple` |
| Response | `{ listings: Listing[], total: number }` |
| Services | `listing.repository.ts` |
| Fallback | Return filtered static seed listings |

### 11.3 POST /api/listings/check

| Field | Value |
|-------|-------|
| Method | POST |
| Request | `{ rawText: string, profile?: Partial<SearchProfile> }` |
| Response | `{ parsed: ParsedListing, verdict: Verdict, verdictReason: string, costBreakdown: FirstMonthCost, missingFields: string[], redFlags: string[], questions: string[], callScript: string }` |
| Services | `listing-parser.service.ts`, `scoring.service.ts`, `cost.service.ts`, `question.service.ts` |
| Fallback | Regex parser if OpenRouter fails; neutral verdict if parsing confidence is low |

### 11.4 POST /api/search/plan

| Field | Value |
|-------|-------|
| Method | POST |
| Request | `{ householdType, monthlyBudget, maxFirstMonthCash, commuteAnchors, priorities, dealBreakers }` |
| Response | `{ sessionId: string, profileSummary: string, recommendedAreas: AreaProfile[], scanSummary: ScanSummary, topListings: ScoredListing[] }` |
| Services | `search-profile.service.ts`, `area-recommendation.service.ts`, `recommendation.service.ts`, `demo-scan.service.ts` |
| Fallback | Use seed listings + deterministic scoring (no external dependency) |

### 11.5 POST /api/listings/recommend

| Field | Value |
|-------|-------|
| Method | POST |
| Request | `{ sessionId: string, adjustment: string }` |
| Response | `{ message: string, topListings: ScoredListing[] }` |
| Services | `recommendation.service.ts` with adjusted weights |
| Fallback | Re-score with new weights using seed data |

### 11.6 POST /api/compare

| Field | Value |
|-------|-------|
| Method | POST |
| Request | `{ listingIds: string[] }` |
| Response | `{ comparison: ComparisonResult }` |
| Services | `compare.service.ts`, `cost.service.ts` |
| Fallback | Compare using seed listing data |

### 11.7 POST /api/report/generate

| Field | Value |
|-------|-------|
| Method | POST |
| Request | `{ profile: SearchProfile, topListings: ScoredListing[], recommendedAreas: AreaProfile[] }` |
| Response | `{ report: HousingReport, html: string }` |
| Services | `report.service.ts` |
| Fallback | Generate report from provided data (no external dependency) |

### 11.8 POST /api/demo/seed

| Field | Value |
|-------|-------|
| Method | POST |
| Request | `{ secret: string }` |
| Response | `{ ok: true, inserted: { areas: 10, listings: 110, personas: 8 } }` |
| Services | Seed data files |
| Fallback | Only enabled when `NEXT_PUBLIC_DEMO_MODE=true` |

---

## 12. Frontend Implementation Plan

### 12.1 `/` — Landing Page (existing)

- **Purpose:** First impression, hero + search widget + personas + comparison table
- **Components:** `LandingPage.tsx`, `Navbar.tsx`
- **Data:** Static personas, area list
- **User Actions:** Quick search submit, persona click, paste listing link
- **Status:** ✅ Done

### 12.2 `/portal` — Results Dashboard (existing)

- **Purpose:** Show match parameters sidebar + area recommendations + listing grid
- **Components:** `AreaRecommendations.tsx`, `ListingGrid.tsx`
- **Data:** `SearchContext` (profile, scoredListings, recommendedAreas)
- **User Actions:** Click listing for detail drawer, add to compare, toggle adjustments
- **Status:** ✅ Done — needs scan animation integration

### 12.3 `/portal/wizard` — Guided Form (existing)

- **Purpose:** 4-step form collecting household, budget, commute anchor, priorities
- **Components:** `Wizard.tsx`
- **Data:** Form state, persona presets
- **User Actions:** Fill steps, submit, or select demo persona
- **Status:** ✅ Done

### 12.4 `/portal/parser` — Check Listing (existing)

- **Purpose:** Paste messy listing text, get structured breakdown
- **Components:** `ListingChecker.tsx`
- **Data:** Raw text input, parsed result
- **User Actions:** Paste text, select example, view parsed fields, adjust overrides
- **Status:** ✅ Done

### 12.5 `/portal/compare` — Compare Homes (existing)

- **Purpose:** Side-by-side comparison of 2–3 selected listings
- **Components:** `ListingComparison.tsx`
- **Data:** `selectedForCompare` IDs from SearchContext
- **User Actions:** View comparison table, remove listing, clear all
- **Status:** ✅ Done — needs visit order + best-for summary

### 12.6 `/portal/visit` — Visit Prep (existing)

- **Purpose:** Call scripts, verification checklist, visit preparation
- **Components:** `VisitPlanner.tsx`
- **Data:** Top visit-worthy listings from SearchContext
- **User Actions:** Read scripts, check items, copy script
- **Status:** ✅ Done

### 12.7 `/portal/report` — Final Report (NEW)

- **Purpose:** Printable/downloadable housing plan consolidating entire journey
- **Components:** `ReportPreview.tsx`
- **Data:** Profile, areas, top listings, costs, questions, checklist from SearchContext
- **User Actions:** View report, print, download PDF, copy link
- **Acceptance criteria:**
  - Report renders with all 9 sections
  - Print layout is clean on A4
  - Download button produces PDF
  - Report is generated from current session data

---

## 13. Demo Data and Demo Flow

### Primary demo: Rafi & Mita

```txt
Step 1: Landing page loads
        → User sees hero: "From messy listings to 3 homes worth visiting."
        → User sees Rafi & Mita persona card

Step 2: Click Rafi & Mita persona
        → Profile auto-filled: couple, ৳35k budget, ৳100k cash, Banani commute
        → Redirects to portal

Step 3: Scan funnel animation plays
        → "Scanning 104 Dhaka listings..."
        → "Removed 37 over budget" (animated)
        → "Removed 21 bad commute match" (animated)
        → "Removed 14 hidden cost risk" (animated)
        → "Found 3 homes worth visiting!" (gold highlight)

Step 4: Results appear
        → 3 top listing cards with Match % badges
        → Area recommendation bar (Mohakhali, Tejgaon, Banasree, Badda)
        → Adjustment buttons visible

Step 5: User taps "Shorter Commute"
        → Listings re-rank
        → Mohakhali/Tejgaon listings rise
        → Banasree drops
        → Message: "Shorter commute raises average rent by ৳5,000–৳8,000"

Step 6: User clicks a listing card
        → Detail drawer opens with 3 tabs: Analysis, Costs, Script
        → Upfront cash: ৳93,000
        → Biggest risk: "Cylinder gas only — ৳1,500/month extra"

Step 7: User navigates to "Check Listing" tab
        → Pastes messy text: "Banasree te 2 bed flat rent 28k..."
        → Parser extracts: area, rent, bedrooms, advance, gas
        → Shows: "Call first — service charge and broker fee unclear"
        → Generates Banglish call script

Step 8: User navigates to "Compare" tab
        → 3 selected listings compared side by side
        → Cheapest highlighted, lowest upfront highlighted
        → Visit order: "Visit Mohakhali first for commute"

Step 9: User navigates to "Report" tab
        → Full housing plan generated
        → Profile summary + areas + 3 homes + costs + checklist
        → User clicks "Download PDF"
```

### Expected numbers for Rafi & Mita

| Metric | Expected |
|--------|----------|
| Listings scanned | 104–110 |
| Removed for budget | 30–40 |
| Removed for commute | 15–25 |
| Removed for hidden cost | 10–15 |
| Removed for household mismatch | 5–10 |
| Selected | 3 |
| Top area | Mohakhali or Tejgaon |
| Budget range | ৳25,000–৳35,000 |

---

## 14. Error Handling and Fallback Rules

| Scenario | Behavior |
|----------|----------|
| **Supabase unavailable** | Use static seed data from `lib/data/`. No user-facing error. |
| **OpenRouter API fails** | Return regex parser result. Show: "Parsed locally — some details may be approximate." |
| **Parser confidence is low** | Set verdict to "Call First". Add message: "Too many details missing. Call landlord to verify." |
| **No listings match profile** | Show: "No exact matches found. Try relaxing your budget or deal-breakers." Show 3 closest matches with explanation. |
| **Cost fields missing** | Use ৳0 for unknown broker fee and service charge. Add warning: "Broker fee unknown — may add up to 1 month rent." |
| **API route crashes** | Return `{ ok: false, error: { code, message }, fallback: {} }`. Log error server-side. Never crash the demo. |
| **Comparison with < 2 listings** | Show empty state with instruction to add listings from results. |
| **Report with no search data** | Show empty state: "Complete a search first to generate your housing report." |

---

## 15. Testing Checklist

### Parser tests
- [ ] `"Banasree te 2 bed flat rent 28k"` → area: Banasree, rent: 28000, bedrooms: 2
- [ ] `"Mohakhali 35k fixed, service charge 4000tk"` → rent: 35000, serviceCharge: "৳4,000"
- [ ] `"bachelor allowed, gas cylinder, no broker"` → tenantPreference: "bachelor", gasType: "cylinder", brokerFee: "no-fee"
- [ ] `"3 month advance required"` → advanceMonths: 3
- [ ] `"Uttara sector 4, lift + generator, titas gas"` → area: Uttara, lift: true, generator: true, gasType: "line"
- [ ] Empty string → all fields null, confidence: "low"

### Cost calculator tests
- [ ] Rent 28k, 2 months advance, broker 28k, SC 3k, moving 5k → total: 92,000
- [ ] Rent 15k, 1 month advance, no broker, SC 0, moving 3k → total: 33,000
- [ ] Unknown service charge → warning about unclear SC
- [ ] Cylinder gas → warning about ৳1,500–2,500/month extra

### Scoring tests
- [ ] Rafi & Mita profile + Mohakhali listing → high score, verdict: "visit"
- [ ] Rafi & Mita + bachelor-only listing → low householdFit, verdict: "avoid"
- [ ] Budget ৳25k + rent ৳40k → low budgetFit
- [ ] High waterlogging + "avoid-waterlogging" adjustment → heavy penalty

### Recommendation tests
- [ ] Rafi & Mita → returns exactly 3 non-"avoid" listings
- [ ] "shorter-commute" adjustment → Mohakhali/Tejgaon rise in rank
- [ ] "avoid-broker" adjustment → broker listings drop or disappear from top 3

### UI flow tests
- [ ] Landing → persona click → scan animation → results (no errors)
- [ ] Wizard complete → scan animation → results (no errors)
- [ ] Paste listing → parse → verdict shown → call script shown
- [ ] Add 3 listings to compare → compare tab shows table
- [ ] Report page renders with real data

### Demo path tests
- [ ] Rafi & Mita demo completes in <3 minutes without errors
- [ ] All 8 personas produce results
- [ ] All 8 messy examples parse successfully

---

## 16. Hackathon Delivery Schedule

### Day 1 — Foundation & Data

| Task | Owner | Status |
|------|-------|--------|
| Verify project builds and runs | Dev | |
| Expand personas (5 → 8) | Dev | |
| Expand messy examples (8 → 30) | Dev | |
| Add `missingFields`/`brokerFeeKnown` to Listing type | Dev | |
| Create all 11 service files (stubs first, then implementation) | Dev | |
| Create `DemoScanAnimation.tsx` component | Dev | |
| Create `demo-scan.service.ts` with real filter logic | Dev | |
| Integrate scan animation into portal flow | Dev | |

### Day 2 — Core Features

| Task | Owner | Status |
|------|-------|--------|
| Build all 8 API routes (stubs + core logic) | Dev | |
| Create repository layer (static + optional Supabase) | Dev | |
| Create `ModeSelector.tsx` component | Dev | |
| Create `VerdictBadge.tsx` reusable component | Dev | |
| Add broker-fee toggle to cost breakdown | Dev | |
| Add visit order to comparison table | Dev | |
| Rename portal tabs to match product modes | Dev | |

### Day 3 — Report + Polish

| Task | Owner | Status |
|------|-------|--------|
| Build `ReportPreview.tsx` + `/portal/report` page | Dev | |
| Build `report.service.ts` with full report generation | Dev | |
| Add print-friendly CSS and PDF download | Dev | |
| Create `HousingProfileSummary.tsx` | Dev | |
| Polish all components with animations | Dev | |
| Mobile responsiveness pass | Dev | |
| Test all 8 personas end-to-end | Dev | |

### Day 4 — Demo Hardening + Freeze

| Task | Owner | Status |
|------|-------|--------|
| Harden Rafi & Mita demo path (cache fallback responses) | Dev | |
| Fix any console errors | Dev | |
| Final UI polish pass | Dev | |
| Verify report prints cleanly | Dev | |
| Test offline/fallback mode | Dev | |
| **CODE FREEZE at 6 PM** | All | |
| Prepare demo script | All | |
| Practice demo 3 times | All | |

### Freeze rules

1. No new features after Day 3 end.
2. Day 4 is only bug fixes and demo polish.
3. If a feature doesn't work by Day 3, remove it. Don't debug during demo.
4. Cache hardcoded responses for Rafi & Mita persona as ultimate fallback.

---

## 17. MVP vs Nice-to-Have

### Must Build (MVP)

1. ✅ Landing page with search widget
2. ✅ Persona quick-start (8 personas)
3. ✅ Guided 4-step wizard
4. ✅ Area recommendation cards
5. 🔲 Scan funnel animation ("104 scanned → 3 selected")
6. ✅ Top 3 listing cards with detail drawer
7. ✅ Adjustment buttons (4 options)
8. ✅ Paste-listing checker
9. ✅ Cost calculator in detail drawer
10. ✅ Side-by-side comparison table
11. ✅ Call scripts (Banglish)
12. ✅ Visit checklist
13. 🔲 Final housing report (printable)
14. 🔲 All 8 API routes
15. 🔲 Service layer extraction
16. 🔲 Repository layer (static fallback)

### Nice-to-Have

1. Supabase integration (tables + seeding)
2. Leaflet map view
3. Interactive broker-fee toggle
4. Visit order in comparison
5. User feedback post-visit modal
6. Income input for affordability warnings
7. Screenshot upload with OCR
8. Framer Motion page transitions
9. Error boundary components
10. Skeleton loading states

### Do Not Build

1. Full property marketplace
2. Live scraping (Bproperty, Bikroy, Facebook)
3. Real authentication
4. Payments or escrow
5. Landlord dashboard
6. Real-time chat
7. Native mobile app
8. Full buying workflow
9. Blockchain / NFT
10. Complex admin panel

---

## 18. Definition of Done

### Product-level

- [ ] User can go from landing page to final report in < 3 minutes
- [ ] Rafi & Mita demo works flawlessly
- [ ] All 4 modes are accessible and functional
- [ ] Product feels calm, premium, and human — not like a generic AI dashboard

### Frontend

- [ ] All pages render without console errors
- [ ] Mobile-responsive (375px minimum)
- [ ] Design tokens from `globals.css` used consistently
- [ ] No placeholder text like "Lorem ipsum" or "User 1"
- [ ] All interactive elements have hover/active states
- [ ] Print layout works for report page

### Backend

- [ ] All 8 API routes return valid JSON
- [ ] Regex parser handles all 30 messy examples
- [ ] Scoring produces deterministic results
- [ ] Cost calculator is accurate
- [ ] App works when OpenRouter is unavailable
- [ ] App works when Supabase is unavailable

### Demo

- [ ] Rafi & Mita demo rehearsed 3+ times
- [ ] Demo completes in < 5 minutes
- [ ] Scan funnel animation plays
- [ ] Paste-listing check works live
- [ ] Report downloads as PDF
- [ ] No errors during demo

---

## 19. Final Developer Instruction

> [!CAUTION]
> **Do not overbuild.** The hackathon has 4 days. Every feature must serve the demo.

> [!IMPORTANT]
> **Prioritize stable demo and visual polish over backend completeness.** Judges see the frontend, not the database schema.

> [!TIP]
> **Keep every decision aligned with one sentence:** "From messy listings to 3 homes worth visiting."

Rules for all developers and agents:

1. **Demo-first development.** If a feature doesn't improve the Rafi & Mita demo, deprioritize it.
2. **No fragile dependencies.** If it requires an API key, internet, or external service to work, it must have a local fallback.
3. **Human language only.** No "AI LifeFit Score 84.3." Use "Worth visiting because rent fits and commute is manageable."
4. **No placeholder data.** Use realistic Dhaka listing titles, real area names, and believable rent numbers.
5. **Static seed first, Supabase second.** Get the app working entirely on seed data before connecting any database.
6. **Freeze on Day 4.** No new features. Only bug fixes and demo polish.
7. **Test the full demo path 3 times** before presenting.
