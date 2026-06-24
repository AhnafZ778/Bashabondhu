# BasaBondhu Complete Backend Design and Architecture

## 1. Backend Goal

The backend must support the final BasaBondhu product:

**“From messy listings to 3 homes worth visiting.”**

The backend should help users:

1. Plan where to live.
2. Check any messy listing.
3. Compare 2–3 homes.
4. Calculate real first-month cost.
5. Rank listings by practical fit.
6. Generate questions before calling.
7. Generate visit checklists.
8. Generate a final housing report.
9. Work reliably during a hackathon demo, even if AI or internet APIs fail.

The backend should not become a heavy enterprise system. It should be stable, demo-friendly, easy to understand, and easy to ship.

---

# 2. Final Backend Philosophy

## Main Backend Rule

**The app must work even if the AI API fails.**

AI can improve parsing and wording, but the core product must still work through:

* seeded data
* rule-based parser
* deterministic scoring
* cached demo examples
* local fallback functions

## Backend Priority

The backend should prioritize:

1. fast demo
2. stable responses
3. believable data
4. simple architecture
5. clean database design
6. no fragile live crawling
7. no complex auth dependency
8. no overbuilt admin system

## What the Backend Should Feel Like

To the judge, it should feel like:

* the product has structured data
* the system can parse messy listings
* recommendations are based on rules, not random AI text
* hidden costs are calculated clearly
* user inputs actually affect results
* the project can scale later

---

# 3. Final Architecture Decision

## Recommended Hackathon Architecture

Use this architecture:

```txt
Mobile / Web UI
     ↓
Next.js App Router Pages
     ↓
Client Components + Server Components
     ↓
Next.js Route Handlers
     ↓
Backend Service Layer
     ↓
Repository Layer
     ↓
Supabase Postgres OR Static Seed Fallback
     ↓
Optional OpenRouter Parser
```

## Final Stack

### Frontend

* Next.js
* TypeScript
* Tailwind CSS
* shadcn/ui
* Lucide icons

### Backend

* Next.js Route Handlers
* TypeScript service functions
* Supabase Postgres
* Optional Supabase Auth
* Optional Supabase Storage
* Optional Supabase Realtime later

### AI

* OpenRouter optional
* Regex/rule parser required
* AI must never be the only parser

### Maps

* Leaflet + OpenStreetMap optional
* Not required for core demo

### PDF/report

* Generate client-side or server-side using jsPDF, react-pdf, or simple printable HTML

### Deployment

* Vercel
* Supabase hosted project
* Environment-variable based feature flags

---

# 4. Critical Architecture Correction from Previous Backend Design

The previous backend design was more focused on:

* bachelor/student verification
* peer matching
* realtime chat
* sublet agreement generation
* verified badges

Those are still useful as future modules, but they are not the center anymore.

The final backend must support the broader product:

* plan search
* check listing
* compare homes
* shortlist 3 homes
* generate call script
* generate visit checklist
* final housing report

## Keep from old design

Keep:

* Supabase/Postgres
* Next.js/Vercel
* optional storage
* optional profile/session persistence
* deterministic scoring
* PDF/report generation
* demo-first architecture
* mobile-first PWA thinking

## Modify from old design

Change:

* “profiles + matches + chat” should not be the core schema.
* “verification” should be optional/future, not MVP core.
* “roommate matching” should become one mode, not the entire platform.
* “agreement generator” becomes report/checklist/call-script generation first.
* “listing decision support” becomes the main backend.

## Remove from MVP backend

Do not build:

* real chat
* full verification
* payments
* escrow
* landlord dashboard
* real scraping pipeline
* full legal agreement workflow
* complicated authentication
* realtime messaging

---

# 5. Backend Architecture Diagram

```txt
┌─────────────────────────────────────────┐
│              User Interface              │
│  Homepage / Plan / Check / Compare       │
└───────────────────┬─────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│          Next.js App Router              │
│ Pages + Server Components + Client UI    │
└───────────────────┬─────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│          Next.js API Routes              │
│ /api/search/plan                         │
│ /api/listings/check                      │
│ /api/listings/recommend                  │
│ /api/compare                             │
│ /api/report/generate                     │
└───────────────────┬─────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│             Service Layer                │
│ ListingParserService                     │
│ ScoringService                           │
│ RecommendationService                    │
│ CostService                              │
│ QuestionService                          │
│ ReportService                            │
└───────────────────┬─────────────────────┘
                    │
        ┌───────────┴───────────┐
        ▼                       ▼
┌──────────────────┐     ┌──────────────────┐
│ Supabase Postgres │     │ Static Seed Data  │
│ Main DB           │     │ Fallback / Demo   │
└──────────────────┘     └──────────────────┘
        │                       │
        └───────────┬───────────┘
                    ▼
┌─────────────────────────────────────────┐
│          Optional AI Layer               │
│ OpenRouter parse/explain only            │
│ Regex fallback always available          │
└─────────────────────────────────────────┘
```

---

# 6. Main Backend Modules

## 6.1 Listing Parser Module

Purpose:

Turn messy Bangla-English listing text into structured JSON.

Input:

```txt
Banasree te 2 bed flat rent 28k, family preferred, 2 month advance, lift ase, gas cylinder, service charge extra...
```

Output:

```json
{
  "area": "Banasree",
  "rent": 28000,
  "bedrooms": 2,
  "tenantPreference": "family",
  "advanceMonths": 2,
  "lift": true,
  "gasType": "cylinder",
  "serviceChargeKnown": false,
  "serviceChargeText": "extra",
  "missingFields": [
    "broker fee",
    "generator backup",
    "written agreement",
    "waterlogging"
  ]
}
```

Implementation:

* `parseListingRegex(rawText)`
* `parseListingWithOpenRouter(rawText)`
* `normalizeParsedListing(parsed)`
* `detectMissingFields(parsed)`
* `detectRedFlags(parsed)`

Rule:

OpenRouter can improve the parser, but regex must always work.

---

## 6.2 Search Profile Module

Purpose:

Convert user form answers into a structured search profile.

Input:

* household type
* monthly budget
* max first-month cash
* commute anchors
* priorities
* deal-breakers

Output:

```json
{
  "householdType": "couple",
  "monthlyBudget": 35000,
  "maxFirstMonthCash": 100000,
  "commuteAnchors": [
    {
      "label": "Banani office",
      "area": "Banani",
      "type": "office"
    }
  ],
  "priorities": ["commute", "family-friendly", "lift-generator", "low-hidden-cost"],
  "dealBreakers": ["high-broker-fee", "heavy-waterlogging", "unclear-service-charge"]
}
```

Implementation:

* `createSearchProfile(input)`
* `validateSearchProfile(profile)`
* `inferSearchMode(profile)`
* `deriveWeights(profile)`

---

## 6.3 Area Recommendation Module

Purpose:

Recommend areas before showing listings.

Input:

* user profile
* area profiles
* commute anchors
* budget

Output:

3–5 area cards:

```json
{
  "area": "Banasree",
  "whyItFits": "Better rent and more space for families.",
  "tradeoff": "Banani commute may take longer in rush hour.",
  "expectedRentRange": "৳25,000–৳38,000",
  "bestFor": ["families", "budget-conscious couples"],
  "avoidIf": ["you need a very short commute to Banani"]
}
```

Implementation:

* `scoreAreaForProfile(area, profile)`
* `getAreaRecommendations(profile)`
* `generateAreaTradeoff(area, profile)`

---

## 6.4 Recommendation Module

Purpose:

Reduce many listings to 3–5 visit-worthy listings.

Input:

* user profile
* listings
* area recommendations
* filter settings

Output:

* filtered listings
* score breakdowns
* verdicts
* reasons
* warnings

Implementation:

* `filterListings(profile, listings)`
* `scoreListing(listing, profile)`
* `rankListings(scoredListings)`
* `selectVisitWorthy(scoredListings, limit = 3)`
* `buildListingRecommendationCard(scoredListing)`

---

## 6.5 Scoring Module

Purpose:

Generate consistent internal scores.

Scores:

* budget fit
* first-month cash fit
* commute fit
* household fit
* hidden cost risk
* utility clarity
* waterlogging/access risk
* listing trust
* missing information risk
* final practical fit

Implementation:

* pure TypeScript
* no external API
* no AI
* deterministic
* testable

Main function:

```ts
calculateListingScore(listing: Listing, profile: SearchProfile): ListingScore
```

---

## 6.6 Cost Module

Purpose:

Calculate real first-month cost.

Inputs:

* rent
* advance months
* service charge
* broker fee
* moving estimate
* utility estimate

Output:

```json
{
  "rent": 28000,
  "advance": 56000,
  "serviceCharge": 3000,
  "brokerFee": 28000,
  "movingEstimate": 6000,
  "totalFirstMonthCash": 121000,
  "monthlyCostEstimate": 31000,
  "cashMultiplier": 4.32,
  "warnings": [
    "This is 4.3x the monthly rent.",
    "Broker fee may make this expensive upfront."
  ]
}
```

Implementation:

* `calculateFirstMonthCost(listing, profile)`
* `estimateMovingCost(area, bedrooms)`
* `estimateUtilityCost(listing)`
* `detectCostShock(cost, profile)`

---

## 6.7 Question Generator Module

Purpose:

Generate call-before-visit questions based on missing fields and risks.

Input:

* listing
* parsed fields
* detected risks
* user type

Output:

```json
[
  "Is service charge included in the rent?",
  "How many months advance do you require?",
  "Is there any broker fee?",
  "Is gas line available or cylinder?",
  "Does the road flood during heavy rain?",
  "Is a written agreement possible?"
]
```

Implementation:

* rule-based first
* optional AI rewrite for nicer wording

Functions:

* `generateCallQuestions(listing, profile)`
* `generateCallScript(listing, profile)`
* `generateNegotiationLine(listing, profile)`

---

## 6.8 Visit Checklist Module

Purpose:

Create practical visit checklist.

Categories:

* cost
* utilities
* building
* agreement
* safety/access
* family/student/bachelor-specific

Implementation:

* `generateVisitChecklist(listing, profile)`
* `getChecklistTemplate(profile.householdType)`
* `mergeRiskBasedChecklistItems(listingRisk)`

---

## 6.9 Compare Module

Purpose:

Compare 2–3 listings.

Input:

* selected listing IDs
* user profile

Output:

* comparison table data
* recommended visit order
* best option
* biggest risk per option

Implementation:

* `compareListings(listings, profile)`
* `rankVisitOrder(listings, profile)`
* `generateComparisonSummary(comparison)`

---

## 6.10 Report Module

Purpose:

Generate final housing plan.

Output:

* user profile summary
* recommended areas
* 3 homes worth visiting
* cost summary
* risks
* questions
* checklist
* final recommendation

Implementation:

* `buildReportData(sessionId)`
* `generateReportHtml(data)`
* optional `generateReportPdf(data)`

---

# 7. Database Strategy

## Hackathon Recommendation

Use Supabase Postgres as the main database, but keep static seed fallback.

Why:

* Supabase gives a real database for credibility.
* Static fallback protects demo if Supabase setup breaks.
* Next.js route handlers can choose the data source.
* The demo remains stable.

## Data Source Priority

```txt
1. Supabase data if configured
2. Static seed JSON if Supabase unavailable
3. Hardcoded demo fallback for key persona
```

## Environment Flag

```env
NEXT_PUBLIC_USE_SUPABASE=true
NEXT_PUBLIC_DEMO_MODE=true
OPENROUTER_API_KEY=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Important:

* `SUPABASE_SERVICE_ROLE_KEY` must never be exposed to the browser.
* Public UI should only use anon key if needed.
* Admin seed operations should happen server-side only.

---

# 8. Database Tables

## 8.1 areas

Stores Dhaka area profiles.

```sql
create table areas (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  city text not null default 'Dhaka',
  rent_low int,
  rent_high int,
  rent_range_label text,
  latitude numeric(9,6),
  longitude numeric(9,6),

  affordability text check (affordability in ('low', 'medium', 'high')),
  family_suitability int check (family_suitability between 0 and 100),
  bachelor_suitability int check (bachelor_suitability between 0 and 100),
  female_suitability int check (female_suitability between 0 and 100),
  student_suitability int check (student_suitability between 0 and 100),

  transport_access text check (transport_access in ('low', 'medium', 'high')),
  school_access text check (school_access in ('low', 'medium', 'high')),
  utility_reliability text check (utility_reliability in ('low', 'medium', 'high')),
  waterlogging_risk text check (waterlogging_risk in ('low', 'medium', 'high', 'unknown')),

  best_for text[] default '{}',
  avoid_if text[] default '{}',
  commute_notes text,
  main_tradeoff text,
  notes text,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

---

## 8.2 listings

Stores structured rental listings.

```sql
create table listings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  raw_text text,
  source_type text check (source_type in ('facebook', 'bikroy', 'bproperty', 'broker', 'direct', 'seed')),
  area_id uuid references areas(id),
  area_name text not null,
  address_hint text,
  city text default 'Dhaka',
  latitude numeric(9,6),
  longitude numeric(9,6),

  rent int not null,
  bedrooms int,
  bathrooms int,
  size_sqft int,
  floor_number int,

  tenant_preference text check (tenant_preference in ('family', 'bachelor', 'student', 'female', 'any', 'unknown')),
  family_allowed boolean default true,
  bachelor_allowed boolean default false,
  female_friendly boolean default false,
  student_friendly boolean default false,

  advance_months numeric(4,1) default 1,
  broker_fee int,
  broker_fee_known boolean default false,
  service_charge int,
  service_charge_known boolean default false,

  gas_type text check (gas_type in ('line', 'cylinder', 'unknown')) default 'unknown',
  lift boolean default false,
  generator boolean default false,
  water_reliability text check (water_reliability in ('low', 'medium', 'high', 'unknown')) default 'unknown',
  electricity_backup text check (electricity_backup in ('none', 'ips', 'generator', 'unknown')) default 'unknown',
  utility_clarity text check (utility_clarity in ('clear', 'partial', 'unclear')) default 'unclear',

  waterlogging_risk text check (waterlogging_risk in ('low', 'medium', 'high', 'unknown')) default 'unknown',
  distance_to_main_road_minutes int,

  commute_notes text,
  house_rules text[] default '{}',
  red_flags text[] default '{}',
  good_points text[] default '{}',
  missing_fields text[] default '{}',

  is_active boolean default true,
  is_demo boolean default true,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

---

## 8.3 raw_listing_examples

Stores messy Bangla-English listing examples for parser demo.

```sql
create table raw_listing_examples (
  id uuid primary key default gen_random_uuid(),
  raw_text text not null,
  source_type text check (source_type in ('facebook', 'whatsapp', 'broker', 'bikroy', 'bproperty', 'other')),
  expected_area text,
  expected_rent int,
  expected_json jsonb,
  is_demo boolean default true,
  created_at timestamptz default now()
);
```

---

## 8.4 parsed_listing_checks

Stores user-pasted listing checks.

```sql
create table parsed_listing_checks (
  id uuid primary key default gen_random_uuid(),
  session_id uuid,
  user_id uuid,
  raw_text text not null,

  parser_used text check (parser_used in ('regex', 'openrouter', 'hybrid')),
  parsed_json jsonb not null,
  missing_fields text[] default '{}',
  red_flags text[] default '{}',

  verdict text check (verdict in ('visit', 'maybe', 'call_first', 'avoid')),
  verdict_reason text,
  questions text[] default '{}',
  cost_breakdown jsonb,

  created_at timestamptz default now()
);
```

---

## 8.5 search_sessions

Stores one user’s active housing journey.

```sql
create table search_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  mode text check (mode in ('plan_search', 'check_listing', 'compare_options', 'prepare_visit')),
  status text check (status in ('active', 'completed', 'abandoned')) default 'active',

  household_type text,
  monthly_budget int,
  max_first_month_cash int,
  commute_anchors jsonb default '[]',
  priorities text[] default '{}',
  deal_breakers text[] default '{}',

  profile_summary text,
  selected_area_ids uuid[] default '{}',
  selected_listing_ids uuid[] default '{}',

  is_demo boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

---

## 8.6 listing_evaluations

Stores scoring results per listing per session.

```sql
create table listing_evaluations (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references search_sessions(id) on delete cascade,
  listing_id uuid references listings(id) on delete cascade,

  budget_fit numeric(5,2),
  cash_fit numeric(5,2),
  commute_fit numeric(5,2),
  household_fit numeric(5,2),
  hidden_cost_risk numeric(5,2),
  utility_clarity_score numeric(5,2),
  waterlogging_risk_score numeric(5,2),
  listing_trust_score numeric(5,2),
  missing_info_risk numeric(5,2),

  final_score numeric(5,2),
  verdict text check (verdict in ('visit', 'maybe', 'call_first', 'avoid')),

  why_it_fits text[] default '{}',
  what_to_check text[] default '{}',
  questions text[] default '{}',
  cost_breakdown jsonb,

  created_at timestamptz default now(),

  unique(session_id, listing_id)
);
```

---

## 8.7 comparisons

Stores compare sessions.

```sql
create table comparisons (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references search_sessions(id) on delete cascade,
  listing_ids uuid[] not null,
  comparison_json jsonb not null,
  recommended_listing_id uuid references listings(id),
  visit_order uuid[] default '{}',
  summary text,
  created_at timestamptz default now()
);
```

---

## 8.8 reports

Stores final housing reports.

```sql
create table reports (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references search_sessions(id) on delete cascade,
  report_type text check (report_type in ('housing_plan', 'listing_check', 'comparison', 'visit_plan')),
  report_json jsonb not null,
  report_html text,
  pdf_url text,
  created_at timestamptz default now()
);
```

---

## 8.9 demo_personas

Stores pitch-ready personas.

```sql
create table demo_personas (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  household_type text,
  monthly_budget int,
  max_first_month_cash int,
  commute_anchors jsonb default '[]',
  priorities text[] default '{}',
  deal_breakers text[] default '{}',
  story text,
  is_primary boolean default false,
  created_at timestamptz default now()
);
```

---

## 8.10 app_events

Optional analytics table for demo.

```sql
create table app_events (
  id uuid primary key default gen_random_uuid(),
  session_id uuid,
  event_name text not null,
  event_payload jsonb default '{}',
  created_at timestamptz default now()
);
```

Use for:

* listing_checked
* search_started
* scan_completed
* comparison_created
* report_generated
* call_script_copied

---

# 9. Optional Auth Design

## Hackathon Decision

Auth is optional.

For the demo, users can use anonymous sessions.

## Recommended MVP

Use anonymous `session_id` in localStorage.

Flow:

```txt
User opens app
↓
Create local session_id
↓
Store search data temporarily
↓
Persist to Supabase if configured
```

## Post-MVP Auth

Add:

* phone-based login
* email login
* Google login
* saved reports
* saved comparisons
* user-submitted listing history

## profiles table for future

```sql
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  phone text,
  email text,
  preferred_language text default 'en',
  created_at timestamptz default now()
);
```

---

# 10. RLS Security Design

If Supabase is used publicly, enable RLS on user-generated tables.

## Public readable tables

These can be public read:

* areas
* listings
* raw_listing_examples if demo only

Policy:

```sql
alter table areas enable row level security;
alter table listings enable row level security;

create policy "Areas are public readable"
on areas for select
using (true);

create policy "Active listings are public readable"
on listings for select
using (is_active = true);
```

## User/session-owned tables

These should be restricted:

* search_sessions
* parsed_listing_checks
* listing_evaluations
* comparisons
* reports
* app_events

For hackathon without login, keep these server-side only using route handlers.

Do not expose direct client writes.

If auth is added:

```sql
alter table search_sessions enable row level security;

create policy "Users can read own sessions"
on search_sessions for select
using (auth.uid() = user_id);

create policy "Users can create own sessions"
on search_sessions for insert
with check (auth.uid() = user_id);
```

## Service role rule

Use service role only in server route handlers.

Never expose it to the browser.

---

# 11. Backend Folder Structure

Recommended project structure:

```txt
src/
  app/
    api/
      areas/
        route.ts
      listings/
        route.ts
      listings/
        check/
          route.ts
        recommend/
          route.ts
      search/
        plan/
          route.ts
      compare/
        route.ts
      report/
        generate/
          route.ts
      demo/
        seed/
          route.ts
    page.tsx
    start/
      page.tsx
    plan/
      page.tsx
    check-listing/
      page.tsx
    results/
      page.tsx
    listing/
      [id]/
        page.tsx
    compare/
      page.tsx
    visit-plan/
      page.tsx
    report/
      page.tsx
    demo-data/
      page.tsx

  components/
    ...

  lib/
    config/
      env.ts
    db/
      supabase-client.ts
      supabase-admin.ts
      repositories/
        area.repository.ts
        listing.repository.ts
        session.repository.ts
        parsed-listing.repository.ts
        evaluation.repository.ts
        report.repository.ts
    services/
      listing-parser.service.ts
      openrouter-parser.service.ts
      search-profile.service.ts
      area-recommendation.service.ts
      scoring.service.ts
      recommendation.service.ts
      cost.service.ts
      question.service.ts
      checklist.service.ts
      compare.service.ts
      report.service.ts
      demo-scan.service.ts
    seed/
      areas.seed.ts
      listings.seed.ts
      personas.seed.ts
      raw-listings.seed.ts
    types/
      area.ts
      listing.ts
      search-profile.ts
      scoring.ts
      parser.ts
      report.ts
    utils/
      currency.ts
      text-normalizer.ts
      banglish-parser-utils.ts
      geo.ts
      validators.ts
```

---

# 12. API Route Design

## 12.1 GET /api/areas

Purpose:

Fetch area profiles.

Response:

```json
{
  "areas": []
}
```

---

## 12.2 GET /api/listings

Purpose:

Fetch active listings.

Query params:

* area
* minRent
* maxRent
* householdType
* sourceType

Example:

```txt
/api/listings?area=Banasree&maxRent=35000
```

---

## 12.3 POST /api/listings/check

Purpose:

Parse and evaluate a pasted listing.

Request:

```json
{
  "rawText": "Banasree te 2 bed flat rent 28k...",
  "profile": {
    "householdType": "couple",
    "monthlyBudget": 35000,
    "maxFirstMonthCash": 100000
  }
}
```

Response:

```json
{
  "parsed": {},
  "missingFields": [],
  "redFlags": [],
  "costBreakdown": {},
  "verdict": "call_first",
  "verdictReason": "Service charge, broker fee, and generator backup are unclear.",
  "questions": [],
  "callScript": ""
}
```

Fallback behavior:

* Try regex parser.
* If OpenRouter key exists, try OpenRouter parser.
* Merge and normalize.
* If OpenRouter fails, return regex output.

---

## 12.4 POST /api/search/plan

Purpose:

Create a search plan from guided form.

Request:

```json
{
  "householdType": "couple",
  "monthlyBudget": 35000,
  "maxFirstMonthCash": 100000,
  "commuteAnchors": [
    {
      "label": "Banani office",
      "area": "Banani",
      "type": "office"
    }
  ],
  "priorities": ["commute", "family-friendly", "lift-generator"],
  "dealBreakers": ["high-broker-fee", "heavy-waterlogging"]
}
```

Response:

```json
{
  "sessionId": "uuid",
  "profileSummary": "You are looking for...",
  "recommendedAreas": [],
  "scanSummary": {
    "scanned": 104,
    "removedBudget": 37,
    "removedCommute": 21,
    "removedHiddenCost": 14,
    "selected": 3
  },
  "topListings": []
}
```

---

## 12.5 POST /api/listings/recommend

Purpose:

Re-rank listings when user taps adjustment buttons.

Request:

```json
{
  "sessionId": "uuid",
  "adjustment": "shorter_commute"
}
```

Response:

```json
{
  "message": "Shorter commute usually increases rent in this search. Showing closer options first.",
  "topListings": []
}
```

---

## 12.6 POST /api/compare

Purpose:

Compare selected listings.

Request:

```json
{
  "sessionId": "uuid",
  "listingIds": ["id1", "id2", "id3"]
}
```

Response:

```json
{
  "comparison": {},
  "recommendedListingId": "id1",
  "visitOrder": ["id1", "id2", "id3"],
  "summary": "Visit Mohakhali first for commute..."
}
```

---

## 12.7 POST /api/report/generate

Purpose:

Generate final report data.

Request:

```json
{
  "sessionId": "uuid",
  "reportType": "housing_plan"
}
```

Response:

```json
{
  "reportId": "uuid",
  "report": {},
  "html": "<html>...</html>"
}
```

---

## 12.8 POST /api/demo/seed

Purpose:

Seed demo data.

Only enabled in development/demo mode.

Request:

```json
{
  "secret": "demo-seed-secret"
}
```

Response:

```json
{
  "ok": true,
  "inserted": {
    "areas": 10,
    "listings": 120,
    "personas": 8
  }
}
```

---

# 13. Typescript Types

## 13.1 Listing

```ts
export type Listing = {
  id: string
  title: string
  rawText?: string
  sourceType: "facebook" | "bikroy" | "bproperty" | "broker" | "direct" | "seed"
  areaName: string
  addressHint?: string
  city: "Dhaka"
  latitude?: number
  longitude?: number

  rent: number
  bedrooms?: number
  bathrooms?: number
  sizeSqft?: number

  tenantPreference: "family" | "bachelor" | "student" | "female" | "any" | "unknown"
  familyAllowed: boolean
  bachelorAllowed: boolean
  femaleFriendly: boolean
  studentFriendly: boolean

  advanceMonths: number
  brokerFee?: number | null
  brokerFeeKnown: boolean
  serviceCharge?: number | null
  serviceChargeKnown: boolean

  gasType: "line" | "cylinder" | "unknown"
  lift: boolean
  generator: boolean
  waterReliability: "low" | "medium" | "high" | "unknown"
  electricityBackup: "none" | "ips" | "generator" | "unknown"
  utilityClarity: "clear" | "partial" | "unclear"

  waterloggingRisk: "low" | "medium" | "high" | "unknown"
  distanceToMainRoadMinutes?: number

  commuteNotes?: string
  houseRules: string[]
  redFlags: string[]
  goodPoints: string[]
  missingFields: string[]
}
```

---

## 13.2 SearchProfile

```ts
export type SearchProfile = {
  id?: string
  mode: "plan_search" | "check_listing" | "compare_options" | "prepare_visit"
  householdType: "family" | "couple" | "single_professional" | "student" | "bachelor" | "working_woman" | "roommates" | "relocation"
  monthlyBudget: number
  maxFirstMonthCash?: number
  commuteAnchors: CommuteAnchor[]
  priorities: string[]
  dealBreakers: string[]
  preferredAreas?: string[]
  avoidAreas?: string[]
  roomOrFullFlat?: "room" | "sublet" | "full_flat"
  minimumBedrooms?: number
}
```

---

## 13.3 ListingScore

```ts
export type ListingScore = {
  budgetFit: number
  cashFit: number
  commuteFit: number
  householdFit: number
  hiddenCostRisk: number
  utilityClarityScore: number
  waterloggingRiskScore: number
  listingTrustScore: number
  missingInfoRisk: number
  finalScore: number
  verdict: "visit" | "maybe" | "call_first" | "avoid"
  whyItFits: string[]
  whatToCheck: string[]
}
```

---

## 13.4 CostBreakdown

```ts
export type CostBreakdown = {
  rent: number
  advance: number
  serviceCharge: number
  brokerFee: number
  movingEstimate: number
  utilityEstimate: number
  totalFirstMonthCash: number
  monthlyCostEstimate: number
  cashMultiplier: number
  warnings: string[]
}
```

---

# 14. Scoring Design

## User-facing principle

Do not show too many scores.

Show:

* Visit
* Maybe
* Call first
* Avoid

Internally, calculate everything.

---

## 14.1 Budget Fit

```ts
if listing.rent <= profile.monthlyBudget:
  budgetFit = 100
else:
  budgetFit = max(0, 100 - ((rent - budget) / budget) * 200)
```

---

## 14.2 Cash Fit

```ts
cashFit = 100 if totalFirstMonthCash <= maxFirstMonthCash
cashFit decreases as totalFirstMonthCash exceeds maxFirstMonthCash
```

If maxFirstMonthCash is missing, default to neutral 60.

---

## 14.3 Commute Fit

For hackathon, use area-based approximation.

```ts
same_area_or_nearby = 100
reasonable = 75
medium = 50
long = 25
unknown = 50
```

Later, replace with map API.

---

## 14.4 Household Fit

Evaluate:

* family_allowed
* bachelor_allowed
* female_friendly
* student_friendly
* tenant_preference
* house_rules
* curfew
* guest policy

Examples:

* family user + family listing = high
* bachelor user + family-only listing = low
* student + student-friendly sublet = high
* working woman + female-friendly + clear house rules = high

---

## 14.5 Hidden Cost Risk

Risk increases if:

* advance months > 2
* broker fee exists
* broker fee unknown
* service charge unknown
* service charge is high
* gas cylinder cost separate
* utilities unclear

---

## 14.6 Utility Clarity Score

High when:

* gas type known
* generator/lift info known
* water info known
* electricity backup known

Low when:

* utility info missing
* gas/service charge unclear
* generator unknown

---

## 14.7 Waterlogging Risk

For MVP:

* inherit from listing if available
* else inherit from area
* else unknown/neutral

---

## 14.8 Listing Trust Score

Trust decreases if:

* raw text is too vague
* no exact area
* no rent
* no contact/source clarity
* too many missing fields
* suspicious urgency
* unusually low rent
* broker fee hidden

---

## 14.9 Missing Info Risk

Calculate from missing fields.

```ts
missingInfoRisk = min(100, missingFields.length * 12)
```

High missing info should push verdict toward “Call first,” not always “Avoid.”

---

## 14.10 Final Score Formula

For family/couple:

```txt
final =
  budgetFit * 0.22 +
  cashFit * 0.18 +
  commuteFit * 0.18 +
  householdFit * 0.14 +
  utilityClarityScore * 0.10 +
  listingTrustScore * 0.08 +
  (100 - hiddenCostRisk) * 0.07 +
  (100 - waterloggingRiskScore) * 0.03
```

For bachelor/student:

```txt
final =
  budgetFit * 0.22 +
  cashFit * 0.16 +
  householdFit * 0.22 +
  commuteFit * 0.16 +
  listingTrustScore * 0.10 +
  (100 - hiddenCostRisk) * 0.09 +
  utilityClarityScore * 0.05
```

For working woman/female student:

```txt
final =
  householdFit * 0.24 +
  commuteFit * 0.18 +
  budgetFit * 0.17 +
  cashFit * 0.14 +
  listingTrustScore * 0.12 +
  utilityClarityScore * 0.08 +
  (100 - hiddenCostRisk) * 0.07
```

For relocation user:

```txt
final =
  areaSuitability * 0.22 +
  budgetFit * 0.18 +
  cashFit * 0.16 +
  commuteFit * 0.16 +
  householdFit * 0.10 +
  listingTrustScore * 0.08 +
  (100 - hiddenCostRisk) * 0.06 +
  utilityClarityScore * 0.04
```

---

# 15. Verdict Logic

## Visit

Conditions:

* final score >= 78
* no severe red flags
* first-month cash not far above limit
* household fit acceptable

## Maybe

Conditions:

* final score between 60 and 77
* manageable trade-offs
* some missing info

## Call first

Conditions:

* service charge unknown
* broker fee unknown
* tenant preference unclear
* gas/generator unclear
* missing info risk high
* could be good but must verify first

## Avoid

Conditions:

* final score < 45
* clear deal-breaker conflict
* very high first-month cost
* household mismatch
* too many severe red flags

Important:

“Call first” is very important because many Bangladeshi listings are incomplete. Do not punish every incomplete listing as “Avoid.”

---

# 16. Listing Parser Design

## Required Regex Patterns

Detect rent:

```txt
28k, 28 k, ২৮ হাজার, 28000, rent 28,000, ভাড়া ২৮০০০
```

Detect area:

```txt
Banasree, Badda, Mohakhali, Tejgaon, Mohammadpur, Lalmatia, Mirpur, Uttara, Bashundhara, Dhanmondi
```

Detect bedrooms:

```txt
2 bed, 2 bedroom, ২ বেড, two bed
```

Detect tenant preference:

```txt
family preferred, family only, bachelor allowed, bachelor na, female only, student allowed
```

Detect advance:

```txt
2 month advance, ২ মাস অগ্রিম, advance 2 months
```

Detect service charge:

```txt
service charge extra, service included, service 3000, maintenance charge
```

Detect gas:

```txt
gas line, cylinder, LPG, titas, gas nai
```

Detect lift/generator:

```txt
lift ase, lift nai, generator, IPS, backup
```

Detect broker:

```txt
broker fee, commission, half commission, direct owner, no broker
```

---

# 17. OpenRouter Use

## Use OpenRouter for

* messy listing parsing
* natural call script
* final report wording
* short explanation rewriting

## Do not use OpenRouter for

* scoring
* ranking
* cost calculation
* filtering
* critical business logic

## Prompt for listing parser

```txt
Extract structured rental listing data from the text below.

Rules:
- Return only JSON.
- Do not guess unknown fields.
- Use null or "unknown" when missing.
- Preserve Bangladesh housing context.
- Identify hidden costs and missing fields.
- Text may be Bangla-English mixed.

Fields:
area, rent, bedrooms, bathrooms, tenantPreference, advanceMonths, serviceCharge, brokerFee, gasType, lift, generator, availability, missingFields, redFlags.

Text:
{{rawText}}
```

## Fallback

If OpenRouter fails:

* return regex parser output
* set `parser_used = "regex"`
* show “Some details are unclear. Ask before visiting.”

---

# 18. Seed Data Plan

## Required seed data

Generate:

* 10 areas
* 100–120 listings
* 20–30 raw listing examples
* 8 demo personas
* 10 cheap-but-risky listings
* 10 higher-cost but convenient listings
* 10 family-focused listings
* 10 bachelor/student listings
* 10 female-friendly listings
* 10 broker-heavy listings

## Main areas

* Banasree
* Badda
* Mohakhali
* Tejgaon
* Mohammadpur
* Lalmatia
* Mirpur
* Uttara
* Bashundhara
* Dhanmondi

## Data quality rule

Do not use placeholder names like:

* Flat A
* User 1
* John Doe
* Test Listing

Use realistic titles:

* Banasree 2-Bed Family Flat Near Main Road
* Mohakhali 2-Bed Apartment Near Office Zone
* Bashundhara Student-Friendly Sublet Near NSU
* Mohammadpur Family Flat Near School
* Mirpur 10 Budget Flat With Lift
* Dhanmondi Female-Friendly Sublet Near University Area

---

# 19. Demo Scan Logic

The “104 listings scanned” screen should be backed by calculated or semi-calculated data.

Function:

```ts
generateScanSummary(listings, profile)
```

Output:

```json
{
  "scanned": 104,
  "removedBudget": 37,
  "removedCommute": 21,
  "removedHiddenCost": 14,
  "removedHouseholdMismatch": 9,
  "selected": 3
}
```

For hackathon, numbers can be stable and demo-optimized.

But they should correspond roughly to the filtering logic.

---

# 20. Report Generation Design

## Report JSON

```ts
type HousingReport = {
  profileSummary: string
  recommendedAreas: AreaRecommendation[]
  topListings: ListingRecommendation[]
  comparison?: ComparisonResult
  costSummary: CostBreakdown[]
  mainRisks: string[]
  questionsToAsk: string[]
  visitChecklist: ChecklistSection[]
  finalRecommendation: string
}
```

## PDF Strategy

Hackathon simple version:

* render report as HTML
* use browser print/download
* or use jsPDF for static sections

Better version:

* use react-pdf or server-side HTML-to-PDF later

---

# 21. Repository Layer

Use repositories to isolate database/static fallback.

Example:

```ts
export interface ListingRepository {
  getListings(filters?: ListingFilters): Promise<Listing[]>
  getListingById(id: string): Promise<Listing | null>
  createParsedListingCheck(input: ParsedListingInput): Promise<ParsedListingCheck>
}
```

Implement:

* `SupabaseListingRepository`
* `StaticListingRepository`

Switch based on env:

```ts
const repo = process.env.NEXT_PUBLIC_USE_SUPABASE === "true"
  ? new SupabaseListingRepository()
  : new StaticListingRepository()
```

This is important for demo safety.

---

# 22. Error Handling Rules

Every API route must return safe JSON.

## Standard error response

```json
{
  "ok": false,
  "error": {
    "code": "PARSER_FAILED",
    "message": "We could not fully read this listing. Please check the missing fields manually."
  },
  "fallback": {}
}
```

## No route should crash the demo

If failure:

* return fallback seed response
* show user-friendly message
* log error server-side

---

# 23. API Validation

Use Zod.

Install:

```txt
zod
```

Validate:

* request body
* parser output
* profile input
* listing IDs
* report request

Example:

```ts
const CheckListingSchema = z.object({
  rawText: z.string().min(5),
  profile: SearchProfileSchema.optional()
})
```

---

# 24. Environment Variables

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_USE_SUPABASE=false

SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

OPENROUTER_API_KEY=
OPENROUTER_MODEL=google/gemini-flash-1.5

DEMO_SEED_SECRET=
```

## Production rule

* `NEXT_PUBLIC_` variables can be exposed to browser.
* secret keys must not use `NEXT_PUBLIC_`.

---

# 25. Hackathon MVP Build Order

## Phase 1: Static backend first

Build:

* seed data files
* TypeScript types
* parser
* scoring
* recommendation
* cost calculator
* API route stubs

This ensures the demo works without Supabase.

## Phase 2: Supabase integration

Add:

* tables
* seed script
* repositories
* DB fetch fallback

## Phase 3: Optional OpenRouter

Add:

* `/api/listings/check`
* OpenRouter call
* fallback to regex

## Phase 4: Report

Add:

* report JSON
* HTML report
* PDF/export if time

---

# 26. 4-Day Backend Schedule

## Day 1

* finalize database schema
* create seed data
* create TypeScript types
* create parser
* create cost calculator
* create scoring service

## Day 2

* create recommendation service
* create area recommendation service
* create `/api/search/plan`
* create `/api/listings/check`
* create `/api/listings/recommend`

## Day 3

* create compare service
* create report service
* add Supabase connection
* add seed route
* add optional OpenRouter
* add error handling

## Day 4

* stabilize API responses
* cache demo outputs
* test all routes
* freeze backend
* make fallback mode bulletproof
* prepare backup JSON responses

---

# 27. Required Backend Tests

At minimum, test manually:

## Parser tests

Input:

```txt
Banasree te 2 bed flat rent 28k, family preferred, 2 month advance, lift ase, gas cylinder, service charge extra
```

Expected:

* area Banasree
* rent 28000
* bedrooms 2
* family preference
* advance 2
* lift true
* gas cylinder
* service charge unclear/extra

## Cost tests

Rent 28,000
Advance 2 months
Broker fee 28,000
Service 3,000
Moving 6,000

Expected total:

121,000

## Recommendation tests

Profile:

* couple
* budget 35,000
* max cash 100,000
* commute to Banani
* avoid high broker fee

Expected:

* Mohakhali/Tejgaon should rank for commute
* Banasree should rank for budget
* high broker fee listings should drop or become “Call first”

## Verdict tests

* high score, clear data: Visit
* missing service charge/broker: Call first
* okay but trade-offs: Maybe
* deal-breaker conflict: Avoid

---

# 28. Backend Risks and Fixes

## Risk 1: Supabase setup wastes time

Fix:

Static repository fallback.

## Risk 2: OpenRouter fails

Fix:

Regex parser fallback.

## Risk 3: Parser output looks weak

Fix:

Prepare 20 strong demo examples.

## Risk 4: Scores feel fake

Fix:

Every recommendation must include reasons and warnings.

## Risk 5: Database schema becomes too big

Fix:

Build only areas, listings, parsed checks, sessions, evaluations, comparisons, reports.

## Risk 6: Demo route crashes

Fix:

Hardcode Rafi/Mita fallback response.

## Risk 7: API latency

Fix:

Cache demo output in memory or seed files.

---

# 29. Backend MVP Lock

Build these backend modules only:

1. listing parser
2. search profile builder
3. area recommender
4. listing scorer
5. listing recommender
6. first-month cost calculator
7. comparison service
8. question generator
9. visit checklist generator
10. report generator
11. Supabase/static repository layer

Everything else is future.

---

# 30. Future Backend Roadmap

## After hackathon

Add:

* real user accounts
* saved reports
* screenshot OCR
* partner listing ingestion
* better area intelligence
* user-submitted listing feedback
* phone login
* landlord direct submission
* admin approval panel

## Later

Add:

* PostGIS geospatial queries
* pgvector for semantic listing search
* verified listing badges
* rent trend analysis
* buyer checklist
* document checklist
* mobile PWA offline mode
* Bangla language support
* relocation reports for companies/universities

---

# 31. Final Backend Verdict

The backend should not be overbuilt.

The correct backend is:

```txt
Next.js Route Handlers
+ Supabase Postgres
+ Static Seed Fallback
+ Rule-Based Parser
+ Optional OpenRouter
+ Deterministic Scoring
+ Cost Calculator
+ Recommendation Service
+ Report Generator
```

This gives the project enough technical depth to impress judges while staying stable and buildable.

The backend must prove one thing:

**BasaBondhu can take a messy housing situation and turn it into a clear visit decision.**



------------------------


# BasaBondhu Complete Project Details

## 1. Project Name

**BasaBondhu**

## 2. Final Tagline

**From messy listings to 3 homes worth visiting.**

## 3. Final One-Line Idea

BasaBondhu helps people moving, renting, shifting homes, or checking housing listings in urban Bangladesh quickly decide which homes are actually worth visiting, what hidden risks to check, what the real move-in cost may be, and what to ask before calling the landlord or broker.

## 4. Core Product Promise

BasaBondhu does not try to become another property listing website.

It helps users make sense of listings they already find from:

* Facebook groups
* Bikroy
* Bproperty
* WhatsApp messages
* brokers
* friends/relatives
* direct landlord posts
* public to-let posts

The main promise is:

**Instead of giving people 100 confusing listings, BasaBondhu gives them 3 homes worth visiting, with clear reasons, hidden-cost warnings, trade-offs, and call-before-visit questions.**

## 5. What the Product Is

BasaBondhu is a practical house-hunting helper for urban Bangladesh.

It helps users:

* plan where to live
* check whether a listing is worth visiting
* compare 2–3 homes
* understand hidden costs
* understand commute trade-offs
* understand family/bachelor/student suitability
* avoid wasting visits
* prepare landlord/broker call questions
* prepare a visit checklist
* create a simple final housing plan

## 6. What the Product Is Not

BasaBondhu is not:

* a generic AI chatbot
* a normal property search portal
* a Bproperty/Bikroy clone
* a broker marketplace
* a full real-estate transaction platform
* a legal-advice platform
* a full buying/selling platform
* a landlord CRM
* a payment or escrow platform for the hackathon MVP
* a flashy “AI dashboard”
* a product built around buzzwords

The product should feel human, useful, and clear.

## 7. The Main Insight

People do not only struggle because there are no listings.

They struggle because they do not know:

* which area makes sense for their life
* whether a listing is worth calling
* whether the landlord accepts their tenant type
* whether the real move-in cost is far higher than listed rent
* whether service charge, gas, utility, or broker fee is hidden
* whether the commute is realistic
* whether the road floods during rain
* whether the building has lift/generator backup
* what questions to ask before visiting
* how to negotiate politely
* how to compare multiple options clearly

That is where BasaBondhu becomes useful.

## 8. The Central Product Line

**Search sites show homes. BasaBondhu helps you decide which ones are worth visiting.**

This line separates BasaBondhu from existing platforms.

## 9. Core Problem Statement

Urban housing search in Bangladesh is messy, stressful, and risky because users depend on scattered listings, brokers, social media posts, and incomplete property portals. Most platforms show rent, rooms, and location, but important practical details such as hidden first-month cost, service charge, advance, broker fee, gas type, utility backup, waterlogging, family/bachelor restrictions, and call-before-visit questions remain unclear until too late.

## 10. Final Positioning

BasaBondhu should be positioned as:

**A guided house-hunting helper for people moving in urban Bangladesh.**

Not:

“AI-powered rental engine.”

Not:

“Housing OS.”

Not:

“Real-estate intelligence system.”

Use simple language:

**BasaBondhu helps you choose where to live, which listing to call, what to avoid, and what to ask before visiting.**

## 11. Main Target Users

### 11.1 Families shifting homes

Problems:

* need school access
* need safe area
* need family-friendly environment
* need lift/generator
* need predictable monthly cost
* need reasonable office commute
* may not understand hidden fees before visiting

### 11.2 Newly married couples

Problems:

* need balanced rent
* may be planning future children
* may want safe, calm area
* may have limited moving budget
* may not be confident negotiating with brokers

### 11.3 Job holders moving near office

Problems:

* want shorter commute
* may be relocating from another district
* need transport access
* need budget control
* do not want to waste visits

### 11.4 People moving to Dhaka or another city

Problems:

* do not know area trade-offs
* do not know rent expectations
* do not know which locations are practical
* may depend heavily on brokers
* may be shy or inexperienced in calls

### 11.5 Students and bachelors

Problems:

* bachelor rejection
* family-only restrictions
* curfew rules
* guest restrictions
* low budget
* room/sublet needs
* mess/hostel quality issues
* wasted calls due to tenant restrictions

### 11.6 Working women and female students

Problems:

* safety concerns
* curfew and entry restrictions
* female-friendly housing needs
* transport access
* late-night access
* trust and verification concerns

### 11.7 Buyers

For MVP, buying is only a preview, not a full flow.

Potential future needs:

* document checklist
* registration cost awareness
* usable carpet area estimate
* area value comparison
* seller/broker caution
* legal red flags

## 12. Why the Scope Was Expanded Beyond “Rejected Renters”

Earlier versions focused heavily on bachelors, students, and rejected renters. That is still important, but it is too narrow as the main project.

The final version keeps those users as specific modes but expands the product to all urban movers:

* family mode
* bachelor mode
* student mode
* women-focused safety mode
* relocation mode
* office commute mode
* school priority mode
* listing checker mode
* compare options mode
* buying preview mode

This makes the project broader, more useful, and more scalable while preserving the strongest Bangladesh-specific rental problems.

## 13. Core Product Modes

The homepage should offer four main actions.

### Mode 1: Plan My Search

For users who do not know where to live.

Inputs:

* household type
* monthly budget
* maximum first-month cash
* office/school/university location
* important commute anchors
* top priorities
* deal-breakers

Outputs:

* user housing profile
* recommended areas
* area trade-offs
* sample listings
* 3 homes worth visiting

### Mode 2: Check This Listing

For users who already found a listing.

Inputs:

* pasted listing text
* optional screenshot
* optional user budget/location context

Outputs:

* clean listing summary
* missing information
* hidden-cost warnings
* visit/maybe/call first/avoid verdict
* first-month cost estimate
* questions to ask landlord/broker

This is one of the most important features because it makes BasaBondhu useful even without owning a listing marketplace.

### Mode 3: Compare My Options

For users choosing between 2–3 listings.

Inputs:

* selected listings
* pasted listings
* user priorities

Outputs:

* comparison table/cards
* best option
* biggest risk per option
* visit order
* final recommendation

### Mode 4: Prepare for Visit

For users ready to call or physically visit.

Outputs:

* call script
* negotiation script
* visit checklist
* cost checklist
* utility checklist
* agreement checklist
* questions to ask

## 14. Main User Flow

### Main demo persona

**Rafi and Mita**

They are moving to Dhaka from Cumilla.

Details:

* Rafi works in Banani
* Mita works from home
* monthly budget: ৳35,000
* maximum first-month cash: ৳100,000
* wants: family-friendly area, lift, generator, manageable commute
* avoids: high broker fee, unclear service charge, heavy waterlogging, high advance
* feels inexperienced negotiating with brokers

### Demo flow

1. Open homepage.
2. Click “Plan my search.”
3. Answer short guided questions.
4. BasaBondhu creates a housing profile.
5. BasaBondhu recommends areas with trade-offs.
6. BasaBondhu shows “104 listings scanned.”
7. It removes weak matches.
8. It shows “3 homes worth visiting.”
9. User taps “shorter commute.”
10. Listings re-rank with an explanation.
11. User pastes a messy broker listing.
12. BasaBondhu parses it into clean details.
13. It flags hidden costs and missing information.
14. It generates a call-before-visit script.
15. It produces a final housing report.

## 15. Core Screens

### 15.1 Homepage

Goal:

Immediately explain the product.

Hero title:

**Find 3 homes worth visiting.**

Subtitle:

**Paste a listing, plan your search, compare options, and know what to ask before calling.**

Primary buttons:

* Plan my search
* Check a listing
* Compare homes

Hero visual:

Floating cards showing:

* 104 listings scanned
* 3 homes selected
* First-month cost: ৳121,000
* Verdict: Call first
* Ask about service charge

### 15.2 Mode Selection

Title:

**What do you want to do today?**

Cards:

1. Plan my search
2. Check this listing
3. Compare my options
4. Prepare for visit

### 15.3 Guided Search Flow

Purpose:

Collect useful information without feeling like a boring survey.

Questions:

1. Who is moving?
2. What are you looking for?
3. What is your budget?
4. What is your maximum first-month cash?
5. Where do you need to go regularly?
6. What matters most?
7. What are your deal-breakers?

Use chips/cards instead of long forms.

### 15.4 Housing Profile Summary

Example:

**You are looking for a family-friendly flat under ৳35,000 with reasonable commute to Banani, low first-month cost, and lift/generator preference.**

### 15.5 Area Recommendation Screen

Title:

**Areas that make sense for you**

Each area card includes:

* area name
* why it fits
* main trade-off
* expected rent range
* best for
* avoid if
* button to view listings

Example:

**Banasree / Aftabnagar**

Why it fits:

Better rent and more space for families.

Trade-off:

Banani commute may take longer in rush hour.

### 15.6 Listing Shortlist Screen

Title:

**3 homes worth visiting**

Scan summary:

* 104 listings scanned
* 37 removed for budget mismatch
* 21 removed for commute pain
* 14 removed for hidden-cost risk
* 3 best visits selected

Listing card includes:

* verdict badge
* rent
* area
* first-month cost
* commute note
* why it fits
* what to check
* view details
* add to compare
* prepare call

### 15.7 Paste Listing Checker

Title:

**Check any listing before you call**

Input example:

“Banasree te 2 bed flat rent 28k, family preferred, 2 month advance, lift ase, gas cylinder, service charge extra…”

Output:

* clean summary
* missing information
* hidden-cost warnings
* verdict
* questions to ask

### 15.8 Listing Detail

Sections:

* verdict summary
* why it fits
* what to check
* first-month cost breakdown
* commute reality
* household suitability
* utility clarity
* questions to ask
* visit checklist

### 15.9 First-Month Cost Breakdown

Purpose:

Show real move-in cost, not just monthly rent.

Example:

* rent: ৳28,000
* advance, 2 months: ৳56,000
* broker fee: ৳28,000
* service charge: ৳3,000
* moving estimate: ৳6,000
* total: ৳121,000

Message:

**The listed rent is ৳28,000, but you may need around ৳121,000 before moving.**

### 15.10 Compare Homes

Compare up to 3 homes.

Rows:

* rent
* first-month cost
* commute
* best thing
* biggest risk
* household fit
* final verdict

Also show:

**Recommended visit order**

### 15.11 Adjustment Buttons

Interactive buttons:

* lower rent
* shorter commute
* avoid broker
* better for family
* better for bachelor
* better for women
* avoid waterlogging
* better school access
* bigger flat
* include nearby areas
* relax gas requirement
* keep first-month cost low

When clicked, results re-rank and explain the trade-off.

Example:

**Shorter commute usually increases rent in this search. Showing closer options first.**

### 15.12 Call-Before-Visit Script

Purpose:

Help shy or inexperienced users call confidently.

Example:

**Assalamu Alaikum, I saw the flat in Banasree. Before visiting, I wanted to confirm a few things so I don’t waste your time. Is the rent ৳28,000 fixed, or is service charge separate?**

Questions:

* Is service charge included?
* How many months advance?
* Is there broker fee?
* Is gas line available or cylinder?
* Is generator backup available for lift and water pump?
* Does the road flood during rain?
* Is a written agreement possible?
* Is the flat family/bachelor/student-friendly?

### 15.13 Visit Checklist

Sections:

Cost:

* confirm rent
* confirm advance
* confirm broker fee
* confirm service charge
* confirm utility split

Utilities:

* check gas
* check water pressure
* ask about electricity backup
* ask if generator supports lift
* ask about internet options

Building:

* check lift
* check stairs
* check entry gate
* check road condition
* check distance from main road

Agreement:

* ask for written agreement
* ask for rent receipt
* confirm notice period
* confirm rent increase terms

### 15.14 Final Report

Title:

**Your housing plan**

Sections:

* your profile
* best areas
* 3 homes worth visiting
* cost summary
* main risks
* questions to ask
* visit checklist
* final recommendation

Buttons:

* download report
* share report
* start new search

## 16. Feature List

### Must-build features for MVP

1. Homepage
2. Mode selection
3. Guided search form
4. Housing profile summary
5. Area recommendation
6. Listing shortlist
7. Paste listing checker
8. First-month cost calculator
9. Compare homes
10. Adjustment buttons
11. Call-before-visit script
12. Visit checklist
13. Final report
14. Demo data screen

### Nice-to-have features

1. Map view
2. Screenshot upload
3. Fake listing warning
4. Buyer preview
5. Saved journey
6. PDF export
7. Bangla language toggle
8. Better parser with OpenRouter
9. Shareable report link

### Not for MVP

1. Full chatbot
2. Full live crawler
3. Real payment/escrow
4. Real NID verification
5. Real legal advice
6. Full buying workflow
7. Full landlord dashboard
8. Real-time chat
9. User review system
10. Blockchain
11. Native mobile app

## 17. Data Strategy

### Hackathon dataset

Use realistic synthetic Dhaka-style data.

Minimum:

* 80 rental listings
* 10 Dhaka areas
* 20 messy raw listing examples
* 8 user personas
* 20 risk-tagged listings
* 10 family-friendly listings
* 10 bachelor-friendly listings
* 10 female-friendly listings
* 10 cheap-but-risky listings
* 10 higher-cost-but-convenient listings

Ideal:

* 100–120 listings
* 15 areas
* 30 raw listing examples
* 12 personas

### Areas to include

* Banasree
* Badda
* Mohakhali
* Tejgaon
* Mohammadpur
* Lalmatia
* Mirpur
* Uttara
* Bashundhara
* Dhanmondi

Optional:

* Farmgate
* Rampura
* Banani
* Gulshan
* Nilkhet
* Shyamoli

## 18. Listing Data Schema

Each listing should include:

* id
* title
* rawText
* sourceType
* area
* addressHint
* city
* latitude
* longitude
* rent
* bedrooms
* bathrooms
* sizeSqft
* floor
* tenantPreference
* familyAllowed
* bachelorAllowed
* femaleFriendly
* studentFriendly
* advanceMonths
* brokerFee
* serviceCharge
* serviceChargeKnown
* gasType
* lift
* generator
* waterReliability
* electricityBackup
* utilityClarity
* waterloggingRisk
* roadWidth
* distanceToMainRoadMinutes
* nearbyTransport
* nearbySchool
* nearbyHospital
* nearbyMarket
* commuteNotes
* houseRules
* curfew
* guestPolicy
* sourceTrust
* photosCount
* missingFields
* redFlags
* goodPoints
* notes

## 19. Area Profile Schema

Each area should include:

* id
* name
* city
* rentRange
* rentLow
* rentHigh
* bestFor
* avoidIf
* commuteNotes
* affordability
* familySuitability
* bachelorSuitability
* femaleSuitability
* schoolAccess
* transportAccess
* utilityReliability
* waterloggingRisk
* mainTradeoff
* sampleTradeoff

## 20. User Profile Schema

Each user/search profile should include:

* id
* mode
* rentingOrBuying
* householdType
* budgetMonthly
* maxFirstMonthCash
* preferredAreas
* avoidAreas
* commuteAnchors
* schoolAnchors
* priorityRankings
* dealBreakers
* genderSafetyPreference
* bachelorStatus
* familyStatus
* roomOrFullFlat
* minimumBedrooms
* liftRequired
* gasRequired
* avoidBroker
* avoidWaterlogging
* createdAt

## 21. Listing Parser Plan

The parser must work with Bangla-English/Banglish text.

Example:

“Banasree te 2 bed flat rent 28k, family preferred, 2 month advance, lift ase, gas cylinder, service charge extra, available from July.”

Expected output:

* area: Banasree
* rent: 28000
* bedrooms: 2
* tenant preference: family preferred
* advance: 2 months
* lift: yes
* gas: cylinder
* service charge: extra
* availability: July
* missing: broker fee, generator, written agreement, waterlogging

### Parser layers

Layer 1:

Regex/rule-based parser.

Must work without API.

Layer 2:

Optional OpenRouter parser.

Use only if API key exists.

Fallback:

If AI fails, regex parser still returns usable result.

### AI can be used for

* messy listing parsing
* natural explanation
* call script generation
* final report wording

### AI should not be used for

* scoring
* ranking
* cost calculation
* filters
* verdict logic

## 22. Scoring Logic

Scores are internal. User-facing UI should avoid too many numbers.

### Internal factors

1. Budget fit
2. First-month cash fit
3. Commute fit
4. Household fit
5. Hidden cost risk
6. Utility clarity
7. Waterlogging/access risk
8. Listing trust
9. Missing information
10. Tenant acceptance compatibility

### User-facing verdicts

Use:

* Visit
* Maybe
* Call first
* Avoid

### Meaning of verdicts

Visit:

Strong fit with manageable risks.

Maybe:

Could work, but trade-offs exist.

Call first:

Important information missing. Do not visit without confirming.

Avoid:

Strong mismatch or too many red flags.

## 23. Internal Ranking Logic

### For family/couple

* budget fit: 25%
* commute fit: 20%
* household fit: 15%
* utility clarity: 15%
* hidden cost risk: 15%
* monsoon/access risk: 10%

### For bachelor/student

* budget fit: 25%
* household fit: 25%
* commute fit: 20%
* hidden cost risk: 15%
* listing trust: 10%
* utility clarity: 5%

### For working woman/female student

* household/safety rule clarity: 25%
* commute fit: 20%
* budget fit: 20%
* listing trust: 15%
* hidden cost risk: 10%
* utility/access clarity: 10%

### For relocation user

* area suitability: 25%
* budget fit: 20%
* commute fit: 20%
* hidden cost risk: 15%
* household fit: 10%
* utility/monsoon clarity: 10%

## 24. Explanation Style

Do not show robotic scoring as the main result.

Bad:

“LifeFit Score 84.3 generated by AI model.”

Good:

**Worth visiting because rent fits your budget, commute is manageable, and family preference matches.**

Good:

**Call first because service charge, broker fee, and gas cost are unclear.**

Good:

**Looks cheap, but the real move-in cost may be much higher.**

## 25. Key Output Messages

Examples:

* “This one is worth calling first.”
* “Good fit, but check service charge.”
* “Looks cheap, but first-month cash is high.”
* “This may not work for bachelors. Call before visiting.”
* “Commute is better, but rent increases.”
* “This saves money, but your daily travel may get harder.”
* “Do not visit before confirming broker fee.”
* “Ask about gas, generator, and road flooding.”

## 26. Technology Stack

Locked stack:

* Next.js
* TypeScript
* Tailwind CSS
* shadcn/ui
* Lucide icons
* Vercel
* Static JSON/TypeScript seed data first
* Optional Supabase later
* Optional OpenRouter for AI parsing
* jsPDF or react-pdf for report export
* Leaflet/OpenStreetMap for optional map

## 27. Frontend Routes

Required routes:

* `/`
* `/start`
* `/plan`
* `/check-listing`
* `/results`
* `/listing/[id]`
* `/compare`
* `/visit-plan`
* `/report`
* `/demo-data`

## 28. Required Components

* ModeSelector
* GuidedForm
* PriorityPicker
* AreaCard
* ListingCard
* VerdictBadge
* RiskChips
* CostBreakdown
* CompareTable
* ListingParserBox
* AdjustmentButtons
* CallScriptCard
* VisitChecklist
* ReportPreview
* DemoScanAnimation
* HousingProfileSummary
* AreaRecommendationGrid
* ListingDetailPanel

## 29. UI Design Direction

The UI should be beautiful, calm, premium, and practical.

It should feel like:

* Airbnb clarity
* Apple simplicity
* Notion spacing
* Google Maps usefulness
* fintech-style cost clarity
* travel comparison simplicity

It should not feel like:

* AI SaaS dashboard
* crypto dashboard
* government portal
* crowded property marketplace
* chatbot wrapper
* generic hackathon template

## 30. Color Palette

Primary background:

* warm off-white: `#F7F6F2`

Secondary background:

* `#EFEAE1`

Cards:

* `#FFFFFF`
* `#F3EFE8`

Primary brand:

* deep green: `#1F4D3A`
* hover green: `#173B2D`
* soft green background: `#E7F2EC`
* success green: `#2E7D5B`

Accent:

* soft blue: `#4C86A8`
* blue tint: `#E7F1F6`

Warning:

* amber: `#E6A23C`
* amber background: `#FFF4DE`

Risk:

* soft red: `#D96B6B`
* red background: `#FCEAEA`

Text:

* primary: `#1F2933`
* secondary: `#5D6673`
* muted: `#8B949E`
* border: `#E1DED7`

## 31. Typography

Preferred font:

**Inter**

Fallback:

* SF Pro
* Manrope
* Plus Jakarta Sans

Rules:

* no uppercase shouting
* clear readable headings
* calm body text
* generous line height
* no tiny gray text

## 32. UI Principles

1. Clarity before cleverness.
2. Fewer options, better guidance.
3. Every listing needs a verdict.
4. Every warning needs an action.
5. Missing information should become questions.
6. Scores should support decisions, not dominate them.
7. User should always know the next step.
8. The product should feel trustworthy in 3 seconds.
9. Mobile-first.
10. No clutter.

## 33. Visual Layout Style

Use:

* warm background
* white rounded cards
* soft shadows
* large spacing
* 16–20px border radius
* clean chips
* soft warning panels
* large cost numbers
* simple icons
* gentle animations

Avoid:

* neon gradients
* robot graphics
* heavy 3D
* crowded tables
* too many charts
* dark dashboard look
* fake futuristic AI visuals

## 34. Motion Design

Subtle motion only:

* listing cards fade in
* scan numbers count up
* results reorder smoothly
* buttons gently lift on hover
* cost numbers animate
* progress moves smoothly

Avoid excessive animations.

## 35. Copywriting Rules

Use human language.

Good phrases:

* worth visiting
* call first
* maybe
* avoid
* this may cost more than it looks
* ask before going
* good for family, but commute is longer
* looks cheap, but service charge is unclear
* 3 homes worth visiting
* hidden cost
* first-month cost
* prepare call

Avoid:

* AI-powered engine
* housing OS
* optimization pipeline
* neural recommendation
* intelligent infrastructure
* predictive platform
* revolutionary AI solution

## 36. Google Stitch Design Prompt Summary

Design a stunning, premium, mobile-first web app for BasaBondhu.

The product helps users in Bangladesh turn messy rental listings into clear visit-worthy decisions.

Use:

* warm off-white background
* deep trust green
* soft amber warnings
* soft red risks
* soft blue commute accents
* Inter font
* rounded cards
* soft shadows
* spacious layout
* human microcopy

Core screens:

1. Homepage
2. Mode selection
3. Guided search
4. Housing profile summary
5. Area recommendation
6. Listing shortlist
7. Paste listing checker
8. Listing detail
9. Cost breakdown
10. Compare homes
11. Call-before-visit
12. Visit checklist
13. Final report

## 37. Hackathon Strategy

The goal is not perfect production architecture.

The goal is:

* clear idea
* beautiful demo
* local relevance
* practical usefulness
* strong story
* stable prototype
* enough technical depth to impress
* no flaky live dependencies
* no obvious placeholder data

## 38. What Judges May Attack

### “Isn’t this just Bproperty/Bikroy with filters?”

Answer:

No. Bproperty and Bikroy show listings. BasaBondhu helps users decide which listings are worth visiting, what hidden costs exist, and what to ask before calling.

### “Where does the data come from?”

Answer:

For the prototype, we use a prepared Dhaka-style dataset and listing-paste analysis. In production, this can ingest user-submitted listings, partner listings, and public listing data where permitted.

### “Can AI be wrong?”

Answer:

We do not guarantee final decisions. We highlight missing information and generate verification questions before the user visits.

### “Why would users use this?”

Answer:

Because house hunting wastes time. BasaBondhu reduces confusing listings into 3 practical options and gives users a clear call/visit plan.

### “Why would landlords care?”

Answer:

The product starts user-side. Landlord/verified listing tools can come later after user demand exists.

### “Can this scale?”

Answer:

Yes. The listing checker works across Facebook, broker messages, Bikroy, Bproperty, and WhatsApp posts. Over time, saved comparisons and user-submitted listing checks create practical area intelligence.

## 39. Major Risks

### Risk 1: Looks like a normal listing app

Fix:

Lead with “3 homes worth visiting” and listing checker.

### Risk 2: Scope creep

Fix:

Demo only one strong journey.

### Risk 3: Data issue

Fix:

Use seeded dataset and paste-listing checker.

### Risk 4: AI/API failure

Fix:

Regex parser fallback and cached demo examples.

### Risk 5: UI looks cheap

Fix:

Prioritize visual polish heavily.

### Risk 6: Too many scores

Fix:

Use human verdict labels.

### Risk 7: The form feels long

Fix:

Keep start flow short and allow refinement later.

## 40. MVP Feature Lock

Build only these for the hackathon:

1. Homepage
2. Mode selection
3. Plan my search
4. Check this listing
5. Area recommendations
6. 3 homes worth visiting
7. First-month cost calculator
8. Compare options
9. Adjustment buttons
10. Call-before-visit script
11. Visit checklist
12. Final report
13. Demo data route

Everything else is secondary.

## 41. Implementation Priority

### Priority 1

Check listing feature.

Reason:

It gives value even without owning a database.

### Priority 2

Plan search feature.

Reason:

It shows the broad user value.

### Priority 3

3 homes worth visiting.

Reason:

This is the main product promise.

### Priority 4

Compare homes.

Reason:

It makes decisions clear.

### Priority 5

Call script and checklist.

Reason:

It makes the product feel practical and human.

## 42. Build Plan

### Day 1

* set up Next.js/Tailwind/shadcn
* create design tokens
* create seed data
* build homepage
* build mode selection
* build guided form

### Day 2

* build area recommendations
* build listing cards
* build scoring/verdict logic
* build 3 homes worth visiting screen
* build cost calculator

### Day 3

* build paste listing checker
* build parser fallback
* build compare page
* build call script
* build visit checklist
* build report page

### Day 4

* polish UI
* fix bugs
* add animations
* prepare demo dataset
* rehearse pitch
* create backup video
* stop adding features

## 43. Final Demo Script

Opening:

“In Bangladesh, people already find housing listings everywhere: Facebook, Bikroy, brokers, and property sites. The real problem is knowing which ones are worth visiting.”

Show homepage.

Select:

Plan my search.

Enter Rafi and Mita’s details.

Show housing profile.

Show area recommendations.

Show scan animation:

104 listings scanned.

Show 3 homes worth visiting.

Tap “shorter commute.”

Show re-ranked results.

Paste messy listing.

Show parsed summary.

Show hidden cost warning.

Generate call script.

Show final report.

Closing:

“BasaBondhu does not replace listing sites. It helps people make sense of listings before they waste time, money, or visits.”

## 44. Final Pitch One-Liners

Use these:

**BasaBondhu turns messy listings into clear housing decisions.**

**Instead of showing 100 flats, BasaBondhu tells you which 3 are worth visiting.**

**Search sites show listings. BasaBondhu helps you decide what to call, what to avoid, and what to ask.**

**The goal is not more listings. The goal is fewer wasted visits.**

## 45. Final Product Verdict

The final project idea is:

**BasaBondhu: From messy listings to 3 homes worth visiting.**

It is a guided house-hunting helper for urban Bangladesh that helps renters, families, students, bachelors, working women, and relocating users plan where to live, check messy listings, compare options, understand hidden costs, and prepare for landlord/broker calls.

The project wins if the demo clearly shows:

Before BasaBondhu:

“I have 100 confusing listings and no idea what to do.”

After BasaBondhu:

“I know which 3 homes to visit, what each one risks, what it may really cost, and what to ask before calling.”

That is the complete project.
