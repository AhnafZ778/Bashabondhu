Yes, this needs to be very clear. After checking the available sources, the correct dataset plan for BasaBondhu is **not one single dataset** and **not one API**. It should be a layered pipeline.

The correct answer is:

> **Hackathon version = prepared seed dataset + user-paste listing parser + offline/downloaded area data.**
> **Production version = user-submitted listings + partner feeds + permitted public datasets + open geospatial data.**

Do **not** build the MVP around live scraping Bproperty, Bikroy, or Facebook. That sounds powerful, but it is risky, unstable, and unnecessary for what BasaBondhu is trying to prove.

---

# 1. Final decision: where the data should come from

## For the hackathon demo

Use these sources:

| Data need          | Best source                                                    | API or download?              | Use in MVP?                |
| ------------------ | -------------------------------------------------------------- | ----------------------------- | -------------------------- |
| Rental listings    | Synthetic Dhaka-style seed data based on real listing patterns | Manual/generated seed data    | Yes, main demo             |
| Messy listing text | Manually created Facebook/Bikroy/broker-style examples         | Manual seed data              | Yes, main demo             |
| Area profiles      | Manually curated from public knowledge + seed assumptions      | Manual seed data              | Yes                        |
| Map/POI data       | OpenStreetMap / Geofabrik Bangladesh extract                   | Download or small API queries | Optional but useful        |
| Geocoding          | Nominatim only for light user-triggered lookup                 | API, limited                  | Optional, cache results    |
| Affordability      | BBS HIES / census-style public reports                         | Download/PDF/static lookup    | Optional for scoring       |
| Bproperty/Bikroy   | Historical mirrors or manual examples only                     | Avoid live scraping           | Not core demo              |
| Facebook groups    | User-paste only                                                | User-submitted text           | Yes, through paste checker |

This aligns with the product: BasaBondhu does not need to “own all listings” on day one. The strongest feature is that users can paste any messy listing and get a clear decision.

---

# 2. Why we should not depend on live Bproperty/Bikroy scraping

Bproperty and Bikroy are useful references because they show real listing structures, but they should **not** be the live data backbone for the hackathon.

Your research notes that Bproperty listing data can include title, asking price, property type, address, coordinates, size, bedrooms, bathrooms, posting date, images, and verification status, but automated scraping has medium-to-high legal/ethical risk. Bikroy listings contain useful rent/location/bedroom/floor-area/seller-type data, but the research flags duplicates, outdated listings, irregular formats, and high scraping risk. 

Your platform analysis also shows that Bproperty and Bikroy collect useful standard fields, but they still miss the exact things BasaBondhu cares about: detailed utility costs, co-living rules, bachelor/female restrictions, guest policy, exact commute context, hidden broker cost, agreement readiness, and real visit-worthiness. 

So the right positioning is:

> “We do not rely on illegal or fragile scraping. For the prototype, we use a prepared Dhaka-style dataset and a paste-listing checker. In production, we grow through user-submitted listings, partner feeds, permitted public datasets, and open map data.”

That is both practical and judge-safe.

---

# 3. Source-by-source plan

## Source 1: Synthetic Dhaka-style seed dataset

This is the **main hackathon dataset**.

### Type

Manual/generated seed data.

### API?

No.

### Download?

No.

### How we create it

We generate 100–120 realistic listings based on common Dhaka rental patterns.

### Why this is correct

The demo must be stable. Judges do not care whether every listing is live; they care whether the product idea works and the demo feels believable.

### What it contains

Each listing should include:

* title
* raw text
* area
* rent
* bedrooms
* bathrooms
* size
* tenant preference
* family allowed
* bachelor allowed
* female-friendly
* student-friendly
* advance months
* broker fee
* service charge
* gas type
* lift
* generator
* utility clarity
* waterlogging risk
* good points
* red flags
* missing fields

### Example

```ts
{
  id: "L-001",
  title: "Banasree 2-Bed Family Flat Near Main Road",
  rawText: "Banasree te 2 bed flat rent 28k, family preferred, 2 month advance, lift ase, gas cylinder, service charge extra.",
  sourceType: "facebook",
  area: "Banasree",
  rent: 28000,
  bedrooms: 2,
  bathrooms: 2,
  tenantPreference: "family",
  familyAllowed: true,
  bachelorAllowed: false,
  femaleFriendly: true,
  studentFriendly: false,
  advanceMonths: 2,
  brokerFee: null,
  brokerFeeKnown: false,
  serviceCharge: null,
  serviceChargeKnown: false,
  gasType: "cylinder",
  lift: true,
  generator: false,
  utilityClarity: "partial",
  waterloggingRisk: "medium",
  goodPoints: ["Within family budget", "Lift available", "Main road nearby"],
  redFlags: ["Service charge unclear", "Broker fee unknown", "Gas cylinder cost separate"],
  missingFields: ["broker fee", "generator backup", "written agreement"]
}
```

This is the dataset that powers:

* homepage demo
* 104 listings scanned
* 3 homes worth visiting
* comparison screen
* cost calculator
* visit checklist
* final report

---

## Source 2: Raw messy listing examples

This is the dataset for the **Paste Listing Checker**.

### Type

Manual/generated examples.

### API?

No.

### Download?

No.

### Why this matters

This is the most realistic user acquisition path. People already find listings on Facebook, WhatsApp, Bikroy, broker messages, and Bproperty. BasaBondhu becomes useful when they paste those listings and get clear advice.

The original project idea already said users depend on brokers, scattered Facebook groups, and listing platforms, while key details like flood-prone streets, unreliable gas/electricity, and family-only rules appear too late. 

### What to create

Create 30 messy examples:

```ts
{
  id: "RAW-001",
  sourceStyle: "facebook",
  rawText: "Banasree te 2 bed flat rent 28k, family preferred, 2 month advance, lift ase, gas cylinder, service charge extra.",
  expectedParse: {
    area: "Banasree",
    rent: 28000,
    bedrooms: 2,
    tenantPreference: "family",
    advanceMonths: 2,
    lift: true,
    gasType: "cylinder",
    serviceChargeKnown: false
  }
}
```

Include:

* Banglish text
* Bangla numerals
* “28k” style rent
* “service charge extra”
* “family preferred”
* “bachelor allowed”
* “gas nai”
* “cylinder”
* “direct owner”
* “broker fee”
* “1 month advance”
* “female sublet”
* “student seat”

This should be stored in:

```txt
src/lib/seed/raw-listings.ts
```

Later, user-pasted listings go into the database.

---

## Source 3: OpenStreetMap / Geofabrik

This is for **area, map, POI, and rough location intelligence**.

### Type

Open geospatial data.

### API or download?

Both are possible.

### Best hackathon approach

Use **downloaded/static data** or manually seeded area coordinates.

Geofabrik provides downloadable Bangladesh OpenStreetMap extracts in formats like `.osm.pbf`, shapefile, and GeoPackage; the Bangladesh `.osm.pbf` extract is listed as a commonly used format, and the page also provides `.shp.zip` and `.gpkg.zip` formats. ([Geofabrik Download Server][1])

### What we should use it for

Use OSM/Geofabrik for:

* area coordinates
* schools
* universities
* hospitals
* markets
* roads
* transport points
* map display
* rough POI count near an area

### What we should not use it for in hackathon

Do not calculate perfect real-time commute. That will slow down the build.

### Hackathon shortcut

Create area profiles manually:

```ts
{
  name: "Banasree",
  latitude: 23.763,
  longitude: 90.431,
  nearbySchools: ["Ideal School Banasree Branch"],
  transportAccess: "medium",
  waterloggingRisk: "medium",
  familySuitability: 82,
  commuteNotes: "Better for Rampura/Badda access, longer for Banani in rush hour."
}
```

### Production upgrade

Use:

* Geofabrik Bangladesh download for offline POI extraction
* Overpass API for small, specific POI queries
* Nominatim for light geocoding only

Overpass is a read-only API for querying selected OpenStreetMap data by location, object type, tags, and proximity, which makes it suitable for “find schools/hospitals/markets near this area” style enrichment. ([OpenStreetMap][2])

---

## Source 4: Nominatim geocoding

This is for converting area names or addresses into coordinates.

### Type

API.

### Should we use it?

Only lightly.

### Why careful?

The official Nominatim usage policy says the public service has limited capacity, requires a proper User-Agent/Referer, limits heavy use, and sets an absolute maximum of 1 request per second. It also says bulk geocoding is generally discouraged and results should be cached. ([OSMF Operations][3])

### Hackathon recommendation

Do not depend on live Nominatim.

Use fixed area coordinates for:

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

### Production recommendation

Use Nominatim or a commercial geocoding provider through a backend proxy with caching.

---

## Source 5: BBS / HIES / public government reports

This is for **affordability logic**, not listing discovery.

### Type

Public government data.

### API or download?

Mostly download/PDF/static lookup.

### Use in BasaBondhu

Use BBS/HIES-type data for:

* rent burden logic
* income-to-rent threshold
* urban affordability baseline
* explaining why first-month cost matters

Your research identifies BBS HIES as a high-reliability source containing household income and expenditure data, including housing, utilities, education, food, and household size indicators. 

### Hackathon recommendation

Do not build a complex BBS data pipeline.

Hardcode a simple affordability lookup:

```ts
const affordabilityRules = {
  comfortable: "rent + utility under 30% of estimated monthly income",
  pressured: "30% to 50%",
  highRisk: "above 50%"
}
```

Use it only to support warnings like:

> “This may create monthly cost pressure.”

---

## Source 6: Kaggle / historical public datasets

This can help with **seed generation** and **price/rent baselines**.

### Type

Download.

### API?

Kaggle has APIs, but for the hackathon, manual download is easier.

### Use in BasaBondhu

Use historical datasets for:

* approximate rent range
* area-based rent baselines
* realistic seed data generation
* validation of synthetic listings

Your research specifically mentions a Kaggle mirror for “House Rent of Dhaka and Chittagong (Bproperty)” and a Bangladesh house-price dataset as possible public dataset references. 

### Important warning

Do not rely on Kaggle as live data.

Use it as:

* reference
* seed baseline
* demo data support

---

## Source 7: User-pasted listings

This is the **most important production dataset**.

### Type

User-submitted.

### API?

No.

### Download?

No.

### How it works

User pastes:

* Facebook post
* broker WhatsApp message
* Bikroy listing text
* Bproperty listing text
* to-let message
* landlord SMS

BasaBondhu parses it.

Then it stores:

* raw text
* parsed result
* missing fields
* red flags
* verdict
* questions generated
* user feedback later

### Why this is the best path

It avoids needing to own all listings. It also works across platforms.

This supports the core product promise:

> “Paste any messy listing and know if it is worth visiting.”

Over time, this becomes the strongest dataset because users are feeding real market examples.

---

## Source 8: Partner feeds

This is the long-term clean listing source.

### Type

Partner-provided data.

### API or upload?

Start with:

* Google Sheet import
* CSV upload
* manual form
* partner dashboard

Later:

* partner API

### Possible partners

* small brokers
* direct landlords
* university housing groups
* mess/hostel operators
* relocation agencies
* property managers

### Use in BasaBondhu

Partner listings provide cleaner data than scraping.

This is the right long-term path if BasaBondhu becomes real.

---

# 4. Final source matrix

| Source                           |                API? | Download? |         Manual? |              Use now? |            Use later? | Risk             |
| -------------------------------- | ------------------: | --------: | --------------: | --------------------: | --------------------: | ---------------- |
| Synthetic seed listings          |                  No |        No |             Yes |                   Yes |                    No | Low              |
| Raw messy listing examples       |                  No |        No |             Yes |                   Yes |                   Yes | Low              |
| User-pasted listings             |                  No |        No |      User input |                   Yes |                   Yes | Low              |
| OpenStreetMap Overpass           |                 Yes |        No |              No |              Optional |                   Yes | Low/medium       |
| Geofabrik Bangladesh OSM extract |                  No |       Yes |              No |              Optional |                   Yes | Low              |
| Nominatim                        |                 Yes |        No |              No | Avoid live dependency |           Yes, cached | Medium if abused |
| BBS/HIES                         |          No/limited |       Yes | Some processing |              Optional |                   Yes | Low              |
| Kaggle datasets                  |          API/manual |       Yes |              No |              Optional |              Optional | Low/medium       |
| Bproperty live scraping          | Not official/public |        No |              No |                    No |  Only with permission | Medium/high      |
| Bikroy live scraping             | Not official/public |        No |              No |                    No |  Only with permission | High             |
| Facebook group scraping          |     Not recommended |        No |              No |                    No | Avoid; use user-paste | High             |
| Partner listings                 |        Could be API | CSV/Sheet |             Yes |                    No |                   Yes | Low              |

---

# 5. Exact pipeline we should build

## Hackathon pipeline

This is the one we should implement now.

```txt
Manual dataset planning
        ↓
Generate 100–120 realistic Dhaka listings
        ↓
Generate 30 messy raw listing examples
        ↓
Create 10 area profiles
        ↓
Store in src/lib/seed/
        ↓
Run parser over raw listing examples
        ↓
Normalize listing fields
        ↓
Calculate first-month cost
        ↓
Generate risk/fit features
        ↓
Rank according to user profile
        ↓
Show 3 homes worth visiting
        ↓
Generate call questions + visit checklist + report
```

Files:

```txt
src/lib/seed/areas.ts
src/lib/seed/listings.ts
src/lib/seed/raw-listings.ts
src/lib/seed/personas.ts
src/lib/data/normalize.ts
src/lib/data/parser.ts
src/lib/data/scoring.ts
src/lib/data/recommend.ts
```

Optional Supabase tables can mirror the same structure.

---

## Production pipeline

This is the long-term path.

```txt
User-pasted listings + partner feeds + permitted public datasets + OSM
        ↓
Raw source registry
        ↓
Raw listing storage
        ↓
Text cleaning and Banglish normalization
        ↓
Regex parser + optional AI parser
        ↓
Structured listing record
        ↓
Deduplication
        ↓
Area/POI/geospatial enrichment
        ↓
Cost calculation
        ↓
Risk and fit feature generation
        ↓
User-specific ranking
        ↓
3 homes worth visiting
        ↓
User feedback after call/visit
        ↓
Better area and listing intelligence over time
```

---

# 6. Database design for dataset pipeline

Use these core tables.

## `data_sources`

Tracks where data came from.

```ts
{
  id: string
  name: string
  type: "seed" | "user_paste" | "partner" | "public_dataset" | "osm" | "manual"
  riskLevel: "low" | "medium" | "high"
  allowedUse: string
  notes: string
}
```

## `raw_listings`

Stores original raw text.

```ts
{
  id: string
  sourceId: string
  rawText: string
  rawJson?: object
  sourceUrl?: string
  capturedAt: string
  consentType: "demo_seed" | "user_submitted" | "partner_provided" | "public_dataset"
  processingStatus: "pending" | "parsed" | "failed" | "rejected"
}
```

## `parsed_listings`

Stores parser output.

```ts
{
  id: string
  rawListingId: string
  parserUsed: "regex" | "openrouter" | "hybrid" | "manual"
  parsedJson: object
  confidenceScore: number
  missingFields: string[]
  redFlags: string[]
}
```

## `listings`

Stores clean app-ready listings.

```ts
{
  id: string
  rawListingId: string
  title: string
  area: string
  rent: number
  bedrooms: number
  bathrooms: number
  tenantPreference: string
  advanceMonths: number
  serviceCharge: number | null
  brokerFee: number | null
  gasType: "line" | "cylinder" | "unknown"
  lift: boolean
  generator: boolean
  familyAllowed: boolean
  bachelorAllowed: boolean
  femaleFriendly: boolean
  studentFriendly: boolean
  waterloggingRisk: "low" | "medium" | "high" | "unknown"
  utilityClarity: "clear" | "partial" | "unclear"
}
```

## `area_profiles`

Stores area intelligence.

```ts
{
  id: string
  area: string
  city: string
  rentRange: string
  bestFor: string[]
  avoidIf: string[]
  commuteNotes: string
  affordability: "low" | "medium" | "high"
  familySuitability: number
  bachelorSuitability: number
  femaleSuitability: number
  studentSuitability: number
  waterloggingRisk: "low" | "medium" | "high"
  utilityReliability: "low" | "medium" | "high"
  transportAccess: "low" | "medium" | "high"
  schoolAccess: "low" | "medium" | "high"
  mainTradeoff: string
}
```

## `listing_features`

Stores calculated decision data.

```ts
{
  listingId: string
  firstMonthCost: number
  budgetFit: number
  cashFit: number
  householdFit: number
  commuteFit: number
  hiddenCostRisk: number
  utilityClarity: number
  listingTrust: number
  missingInfoRisk: number
  finalScore: number
  defaultVerdict: "visit" | "maybe" | "call_first" | "avoid"
}
```

## `user_listing_feedback`

Future data moat.

```ts
{
  id: string
  listingId: string
  didCall: boolean
  didVisit: boolean
  rentAccurate: boolean | null
  serviceChargeAccurate: boolean | null
  brokerFeePresent: boolean | null
  listingFake: boolean | null
  notes: string
}
```

---

# 7. What to actually tell the team

Here is the exact decision:

## Build now

1. **Generate seed dataset manually**

   * 100–120 listings
   * 10 Dhaka areas
   * 30 messy listings
   * 8 personas

2. **Add paste-listing parser**

   * regex first
   * optional OpenRouter second
   * no API dependency

3. **Add area profiles**

   * manual seeded
   * optionally enriched with OSM later

4. **Use static files first**

   * fastest and safest

5. **Mirror to Supabase if time**

   * but do not depend on Supabase if setup fails

## Do not build now

1. Live Bproperty scraper
2. Live Bikroy scraper
3. Facebook group scraper
4. Live geocoding for every listing
5. Full Crawl4AI ingestion
6. Complex Kaggle ingestion pipeline
7. Real-time data refresh

---

# 8. How to explain this in the pitch

Say:

> “For this prototype, we use a prepared Dhaka-style dataset of 100+ listings, 10 area profiles, and 30 messy listing examples. We also built a paste-listing parser, so the product works even when users find listings outside our platform. We are not depending on fragile live scraping. In production, the data grows from user-submitted listings, partner feeds, permitted public datasets, and open geospatial data like OpenStreetMap.”

This is the best possible answer.

It shows you understand:

* data availability
* legal risk
* demo stability
* production growth
* why BasaBondhu is not just another listing site

---

# 9. Final verdict

The dataset source plan should be:

## For hackathon

**Synthetic seed data + paste-listing examples + manual area profiles.**

## For optional enrichment

**OpenStreetMap/Geofabrik download + small cached Overpass queries.**

## For affordability

**BBS/HIES public reports converted into static lookup rules.**

## For production

**User-pasted listings + partner feeds + permitted public datasets + user feedback loop.**

## Avoid as MVP dependency

**Live scraping of Bproperty, Bikroy, and Facebook groups.**

That aligns perfectly with the product purpose because BasaBondhu is not trying to own every listing. It is trying to help users decide which listings are worth visiting.

[1]: https://download.geofabrik.de/asia/bangladesh.html "Download OpenStreetMap for Bangladesh | Geofabrik Download Server"
[2]: https://wiki.openstreetmap.org/wiki/Overpass_API "Overpass API - OpenStreetMap Wiki"
[3]: https://operations.osmfoundation.org/policies/nominatim/ "Nominatim Usage Policy (aka Geocoding Policy)"
