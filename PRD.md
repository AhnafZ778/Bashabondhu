# Product Requirements Document

# BasaBondhu

## From messy listings to 3 homes worth visiting

---

## 1\. Product summary

BasaBondhu is a guided house-hunting website for people looking to rent, shift homes, relocate to a city, find a room/sublet, or check whether a listing is worth visiting.

The product does not try to become another property marketplace. Instead, it helps users make better housing decisions from listings they already find on Facebook, Bikroy, Bproperty, WhatsApp, brokers, or friends.

The core promise is simple:

**BasaBondhu helps users turn confusing housing options into 3 homes worth visiting, with clear reasons, hidden-cost warnings, commute trade-offs, and call-before-visit questions.**

---

## 2\. Product philosophy

Most people do not struggle only because listings are unavailable.

They struggle because:

* they do not know which area makes sense

* they do not know what hidden costs to check

* they do not know whether a listing is realistic

* they do not know what to ask landlords or brokers

* they waste time visiting unsuitable homes

* they get confused by scattered Facebook/Bikroy/broker posts

* they feel shy or inexperienced while negotiating

* they discover problems after moving in

So BasaBondhu should not feel like a chatbot or a complicated dashboard.

It should feel like a calm, practical local helper saying:

**“This one is worth visiting. This one looks cheap but risky. This one is good, but call first and ask these exact questions.”**

---

## 3\. Final positioning

### Product name

**BasaBondhu**

### Tagline

**From messy listings to 3 homes worth visiting.**

### One-line pitch

BasaBondhu helps people moving in urban Bangladesh quickly decide which homes are worth visiting, what hidden risks to check, and what to ask before calling the landlord or broker.

### Longer pitch

Finding a home in Bangladesh is not only about rent and bedrooms. A family cares about school, commute, safety, lift, generator, and total move-in cost. A bachelor cares whether the landlord will accept them. A working woman cares about curfew, access, and safety. A newcomer does not know which area makes sense. BasaBondhu takes the user’s situation, reads or compares listings, and gives a clear shortlist with practical next steps.

---

## 4\. Target users

BasaBondhu must be broad enough for urban movers but focused enough for a strong demo.

### Primary users

#### *1\. Families shifting homes*

Needs:

* school access

* office commute

* safety

* lift/generator

* water/gas reliability

* reasonable first-month cost

* family-friendly area

#### *2\. Newly married couples*

Needs:

* balanced rent

* safe area

* manageable commute

* future child/school planning

* no hidden costs

* negotiation help

#### *3\. Job holders moving near office*

Needs:

* commute clarity

* transport options

* monthly budget control

* service charge clarity

* direct owner/broker clarity

#### *4\. People relocating from another city*

Needs:

* area guidance

* rent expectation

* commute expectation

* what to avoid

* how to call landlords

* what to ask before visiting

#### *5\. Students and bachelors*

Needs:

* bachelor acceptance

* room/sublet options

* curfew and guest rules

* roommate compatibility

* low budget

* near university/coaching/transport

#### *6\. Working women and female students*

Needs:

* safer area

* entry/curfew clarity

* female-friendly listings

* nearby transport

* house rules

* trusted contact process

### Secondary users

#### *7\. Buyers*

MVP will not fully solve buying. It will include only a preview.

Needs:

* area value check

* registration cost awareness

* usable space estimate

* document checklist

* red flags before talking to seller

#### *8\. Landlords and brokers*

Not the first user group. They come later when the user-side tool gains traction.

---

## 5\. Core problem statement

People looking for homes in urban Bangladesh face too many scattered listings and too little practical decision support. Existing platforms show homes, but they do not clearly explain which ones are worth visiting, what hidden costs may appear, what local risks matter, and what questions users should ask before spending time or money.

---

## 6\. What BasaBondhu must solve

### Main user problems

1. “I don’t know which area is best for my life.”

2. “I found many listings but don’t know which ones are worth visiting.”

3. “I don’t know the real first-month cost.”

4. “I don’t know what questions to ask the landlord.”

5. “I don’t know if the listing has hidden problems.”

6. “I’m shy or inexperienced in negotiation.”

7. “I’m moving to Dhaka and don’t understand area trade-offs.”

8. “I’m a bachelor/student/female renter and don’t know if I’ll be accepted.”

9. “I want to compare 2–3 listings clearly.”

10. “I don’t want to waste time calling fake, weak, or unsuitable listings.”

---

## 7\. Product goals

### Hackathon MVP goals

By the end of the hackathon, BasaBondhu must be able to:

1. Take a short user input about budget, household type, priorities, and commute anchors.

2. Recommend sensible areas based on the user’s situation.

3. Show a shortlist of 3–5 homes worth visiting.

4. Let users paste a messy listing and get a clean breakdown.

5. Show real first-month cost, including rent, advance, service charge, broker fee, and moving estimate.

6. Compare 2–3 options side by side.

7. Generate call-before-visit questions.

8. Generate a visit checklist.

9. Let users adjust results using simple buttons like “lower rent,” “shorter commute,” or “avoid broker.”

10. Look polished, stable, and practical enough for judges to believe people would use it.

### Product goals after hackathon

1. Support real user-submitted listing checks.

2. Build a listing intelligence dataset from pasted listings.

3. Add verified partner listings.

4. Add neighborhood-level insights.

5. Add landlord/broker reliability signals.

6. Add buying assistance slowly.

7. Add saved search journeys.

8. Add relocation reports for companies/universities.

---

## 8\. Non-goals for hackathon MVP

Do not build these now:

1. Full property marketplace

2. Full live crawler from Bproperty/Bikroy/Facebook

3. Real payment or escrow

4. Full buying workflow

5. Real government/NID integration

6. Real legal advice

7. Full landlord dashboard

8. Full chatbot

9. Native mobile app

10. Full user review/rating system

11. Full authentication system

12. Complex admin panel

13. Real-time chat

14. Blockchain

15. Full AI agent workflow

These can be mentioned as future possibilities, but they should not be part of the hackathon build.

---

## 9\. Core product modes

The homepage should not start with a long form.

It should ask:

## “What do you want to do today?”

### Mode 1: Plan my search

For users who do not know where to live.

User provides:

* household type

* budget

* office/school/university location

* top priorities

* deal-breakers

Output:

* recommended areas

* area trade-offs

* expected rent range

* best-fit listing examples

* what to avoid

### Mode 2: Check this listing

For users who already found a listing on Facebook, Bikroy, WhatsApp, broker message, or elsewhere.

User provides:

* pasted listing text

* optional screenshot upload

* optional target location or budget

Output:

* clean listing summary

* missing information

* hidden-cost warning

* tenant restriction warning

* visit/maybe/avoid verdict

* landlord call questions

### Mode 3: Compare my options

For users choosing between 2–3 homes.

User provides:

* pasted listings or selected saved listings

Output:

* comparison table

* best option

* biggest risk per option

* total first-month cost

* commute comparison

* final visit order

### Mode 4: Prepare for visit

For users who are ready to call or visit.

Output:

* call script

* negotiation script

* visit checklist

* document checklist

* first-month cost summary

* “do not pay before checking” warning

---

## 10\. MVP scope

### Must-have features

#### *Feature 1: Short guided form*

Purpose:

Collect enough information to personalize results without annoying the user.

Questions:

1. Are you renting or buying?

2. What are you looking for? Full flat, room/sublet, or checking a listing?

3. Who is moving? Family, couple, bachelor, student, working woman, group, single professional.

4. Monthly budget?

5. Maximum first-month cash?

6. Important regular locations? Office, school, university, parent’s home, hospital, business area.

7. Top 3 priorities: commute, rent, school, safety, gas, lift, generator, no waterlogging, bachelor-friendly, family-friendly, quiet area, direct owner.

8. Deal-breakers: broker, high advance, family-only, no lift, no gas, heavy waterlogging, too far from transport.

Acceptance criteria:

* User can finish in under 60 seconds.

* User can skip non-essential fields.

* User can edit priorities after results.

* No page should feel like a government form.

---

#### *Feature 2: Area recommendation*

Purpose:

Before showing listings, help the user understand which areas make sense.

Input:

* user budget

* target commute places

* household type

* priorities

* deal-breakers

Output:

Recommended area cards:

* area name

* why it fits

* trade-off

* expected rent range

* best for

* avoid if

Example:

Area: Banasree  
Why it fits: Better rent for families, more space, reasonable access to Rampura/Badda.  
Trade-off: Banani commute may take longer in rush hour.  
Best for: budget-conscious family or couple.  
Avoid if: you need very short commute to Gulshan/Banani.

Acceptance criteria:

* Show 3–5 recommended areas.

* Each area must include a human explanation.

* Do not show only scores.

* User can tap “show listings in this area.”

---

#### *Feature 3: Listing shortlist*

Purpose:

Show only the most visit-worthy options instead of endless listings.

Input:

* seeded listings

* user preferences

* area recommendations

Output:

3–5 listing cards.

Each card must show:

* title

* area

* rent

* first-month cost estimate

* commute note

* household suitability

* hidden risk

* verdict: Visit / Maybe / Avoid

* why it fits

* what to ask before calling

Acceptance criteria:

* Listing cards must be readable in 5 seconds.

* Each card must say why it is recommended.

* Each card must include at least one warning or trade-off.

* User can compare or save a listing.

---

#### *Feature 4: Paste-listing checker*

Purpose:

Make BasaBondhu useful even without owning listings.

User pastes messy listing text.

Example input:

“Banasree te 2 bed flat rent 28k, family preferred, 2 month advance, lift ase, gas cylinder, service charge extra, available from July.”

Output:

Clean summary:

* Area: Banasree

* Rent: ৳28,000

* Bedrooms: 2

* Tenant preference: family preferred

* Advance: 2 months

* Lift: yes

* Gas: cylinder

* Service charge: unclear/extra

* Broker: unknown

* Availability: July

Verdict:

“Maybe visit, but call first.”

Warnings:

* service charge unclear

* gas cost may be separate

* total move-in cash may be high

* ask about broker fee

Acceptance criteria:

* Must work with Bangla-English mixed text.

* Must extract at least rent, area, bedroom count, advance, tenant preference, gas, service charge if present.

* Missing data must be shown as “unknown,” not guessed.

* Must generate call-before-visit questions.

Implementation note:

For hackathon, use a mix of simple regex/rule parsing and one optional OpenRouter call for messy examples. Keep 10–20 prepared listing examples that always parse well.

---

#### *Feature 5: First-month cost calculator*

Purpose:

Show the real cash needed before moving.

Inputs:

* rent

* advance months

* broker fee

* service charge

* utility estimate

* moving cost estimate

Output:

Cost breakdown:

* rent

* advance

* broker fee

* service charge

* moving estimate

* total before moving

Example:

Rent: ৳28,000  
Advance, 2 months: ৳56,000  
Service charge: ৳3,000  
Broker fee: ৳28,000  
Moving estimate: ৳6,000  
Total: ৳121,000

Human message:

“The rent is ৳28,000, but you may need around ৳121,000 before moving.”

Acceptance criteria:

* Must clearly separate monthly rent and first-month cash.

* Must show warning if first-month cost exceeds user’s cash limit.

* Must allow user to toggle broker fee on/off.

* Must allow unknown costs.

---

#### *Feature 6: Compare options*

Purpose:

Help users choose between shortlisted homes.

Input:

* 2–3 selected listings

Output:

Comparison view:

* rent

* first-month cost

* commute

* hidden cost

* household fit

* utility clarity

* broker/direct

* biggest advantage

* biggest risk

* final verdict

Acceptance criteria:

* Must highlight one “visit first” option.

* Must explain trade-offs in plain language.

* Must not rely only on numeric scores.

* Must allow user to adjust priority, e.g. “shorter commute” or “lower rent.”

---

#### *Feature 7: Guided adjustment buttons*

Purpose:

Make the product feel interactive without becoming a chatbot.

Buttons:

* Lower rent

* Shorter commute

* Avoid broker

* Better for family

* Better for bachelor

* Better for women

* Avoid waterlogging

* Better school access

* Bigger flat

* Include nearby areas

* Relax gas requirement

* Keep first-month cost low

Behavior:

When tapped, results re-rank and show a short explanation.

Example:

User taps “Shorter commute.”

System says:

“Shorter commute raises average rent by around ৳5,000–৳8,000 in this search. Showing closer options first.”

Acceptance criteria:

* Buttons must update result order.

* System must explain the consequence of the change.

* User must feel in control.

---

#### *Feature 8: Call-before-visit script*

Purpose:

Help shy or inexperienced users call landlords/brokers confidently.

Output:

A short script:

“Assalamu Alaikum, I saw the flat in Banasree. Before visiting, I wanted to confirm a few things so I don’t waste your time. Is the rent ৳28,000 fixed, or is service charge separate?”

Questions:

1. Is service charge included?

2. How many months advance?

3. Is there broker fee?

4. Is gas line available or cylinder?

5. Is generator backup for lift/water pump?

6. Does the road flood during heavy rain?

7. Is a written agreement possible?

8. Are families/bachelors/students allowed?

9. Is the rent negotiable?

10. When can I visit?

Acceptance criteria:

* Must be written in natural Bangla-English style or simple English.

* Must adapt to listing risks.

* Must have copy button.

---

#### *Feature 9: Visit checklist*

Purpose:

Help users avoid mistakes during physical visit.

Checklist:

* Check water pressure

* Ask about gas line/cylinder

* Ask about electricity backup

* Check lift backup

* Check road condition

* Check distance from main road

* Confirm service charge

* Confirm advance and broker fee

* Confirm written agreement

* Take photos before move-in

* Ask about notice period

* Ask about rent increase

Acceptance criteria:

* User can mark checklist items.

* Checklist must adapt to user type.

* Family users see school/safety questions.

* Bachelor users see tenant acceptance/curfew questions.

* Female users see entry, lighting, guard, and late-night access questions.

---

#### *Feature 10: Final decision report*

Purpose:

Give a tangible output for demo and user value.

Output:

One-page report:

* user profile summary

* recommended areas

* top 3 visit-worthy homes

* comparison

* first-month cost

* call questions

* visit checklist

* final recommendation

Acceptance criteria:

* Must be printable or downloadable as PDF.

* Must look clean enough for demo.

* Must not be too long.

* Must be generated from current user session.

---

## 11\. Nice-to-have features

Only build after must-haves work.

### Nice-to-have 1: Map view

Show recommended areas and listings on a map.

Use:

* Leaflet

* OpenStreetMap

* seeded coordinates

### Nice-to-have 2: Buy preview

A small future-facing tab for buyers.

Features:

* usable carpet area estimator

* registration cost awareness

* document checklist

* “talk to lawyer before payment” reminder

Do not build full buying.

### Nice-to-have 3: Listing screenshot upload

User uploads screenshot of listing.

For MVP:

* show upload UI

* optionally use OCR only if easy

* fallback to paste text

### Nice-to-have 4: Fake listing warning

Simple rules:

* too cheap for area

* asks advance before visit

* no exact location

* no service charge info

* stock-looking photo

* urgent pressure wording

* broker pretending to be owner

### Nice-to-have 5: Saved journey

Save user search profile and selected listings locally.

---

## 12\. User journeys

### Journey 1: Couple moving to Dhaka

Rafi and Mita are moving from Cumilla to Dhaka. Rafi works in Banani. Mita works from home. Their budget is ৳35,000. They want a family-friendly area, lift, generator, and low waterlogging risk.

Flow:

1. They choose “Plan my search.”

2. They enter budget and Banani as work location.

3. They choose priorities: commute, safety, lift/generator, low waterlogging.

4. BasaBondhu recommends Mohakhali/Tejgaon, Banasree/Aftabnagar, Mohammadpur/Lalmatia, and Mirpur/Uttara with trade-offs.

5. They see 3 homes worth visiting.

6. They tap “keep budget strict.”

7. BasaBondhu re-ranks cheaper but farther options.

8. They compare 3 flats.

9. They generate a call script and visit checklist.

Success moment:

They understand where to search and which 3 homes to call first.

---

### Journey 2: Student checking a Facebook listing

Nusrat is a university student. She finds a listing in a Facebook group.

Flow:

1. She chooses “Check this listing.”

2. She pastes the listing text.

3. BasaBondhu extracts rent, location, advance, tenant rule, and service charge.

4. It warns that curfew and utility split are unclear.

5. It gives verdict: “Maybe visit, but call first.”

6. It generates questions about curfew, guest policy, service charge, and written agreement.

Success moment:

She avoids visiting without confirming key details.

---

### Journey 3: Family comparing school and commute

A family wants to move closer to children’s school and father’s office.

Flow:

1. They enter school and office as two commute anchors.

2. They choose “school access” and “reasonable commute” as priorities.

3. BasaBondhu recommends areas that balance both.

4. It shows trade-off: closer to school increases father’s commute.

5. They compare 3 options.

6. The app recommends the best compromise.

Success moment:

They understand the trade-off instead of randomly choosing by rent.

---

### Journey 4: Bachelor trying to avoid rejection

A young job holder wants a room near Mohakhali but does not want to waste calls on family-only listings.

Flow:

1. He selects “room/sublet” and “bachelor.”

2. BasaBondhu filters bachelor-friendly listings.

3. It flags “family preferred” listings as call-before-visit.

4. It shows curfew and guest rules where available.

5. It gives a call script to confirm acceptance before visiting.

Success moment:

He saves time and avoids useless visits.

---

## 13\. Key screens

### Screen 1: Landing page

Hero:

“Find 3 homes actually worth visiting.”

Subtext:

“Paste a listing, plan your search, compare options, and know what to ask before calling.”

Primary buttons:

* Check a listing

* Plan my search

* Compare options

Secondary text:

“For renters, families, students, bachelors, and people moving to a new city.”

---

### Screen 2: Choose mode

Cards:

1. Plan my search

2. Check this listing

3. Compare my options

4. Prepare for visit

---

### Screen 3: Guided form

Clean step-by-step form.

Progress:

“Step 1 of 4”

Do not show more than 2–3 fields per screen.

---

### Screen 4: Housing profile summary

Show:

* user type

* budget

* regular destinations

* top priorities

* deal-breakers

Example:

“You are looking for a family-friendly flat under ৳35,000 with reasonable commute to Banani, low first-month cash, and lift/generator preference.”

---

### Screen 5: Area recommendations

Cards:

* area name

* why it fits

* trade-off

* rent range

* best for

* avoid if

---

### Screen 6: Listing shortlist

Header:

“3 homes worth visiting”

Cards:

* listing title

* rent

* location

* visit/maybe/avoid

* biggest benefit

* biggest risk

* first-month cost

* ask before calling

---

### Screen 7: Listing checker

Input:

* paste listing text

* upload screenshot optional

Output:

* clean summary

* missing info

* risks

* verdict

* questions

---

### Screen 8: Compare page

Table/card comparison:

* rent

* first-month cash

* commute

* household fit

* hidden cost

* utility clarity

* final verdict

---

### Screen 9: Adjustment controls

Buttons:

* Lower rent

* Shorter commute

* Avoid broker

* Better for family

* Better for bachelor

* Safer for women

* Avoid waterlogging

* Better school access

Each button changes results and shows explanation.

---

### Screen 10: Call script

Shows:

* short intro script

* questions

* negotiation line

* copy button

---

### Screen 11: Visit checklist

Interactive checklist.

---

### Screen 12: Final report

One-page printable summary.

---

## 14\. Data requirements

### Seed dataset size for hackathon

Minimum:

* 80 rental listings

* 10 Dhaka areas

* 20 messy raw listing examples

* 8 user personas

* 20 risk-tagged listings

* 10 family-focused listings

* 10 bachelor-focused listings

* 10 female-friendly listings

* 10 cheap-but-risky listings

* 10 higher-cost-but-convenient listings

* 5 buyer-preview examples

Ideal:

* 120 listings

* 15 areas

* 30 raw listing examples

* 12 personas

---

## 15\. Listing data schema

Each listing should include:

* id

* title

* raw\_text

* source\_type

* area

* address\_hint

* city

* latitude

* longitude

* rent

* bedrooms

* bathrooms

* size\_sqft

* floor

* tenant\_preference

* family\_allowed

* bachelor\_allowed

* female\_friendly

* student\_friendly

* advance\_months

* broker\_fee

* service\_charge

* gas\_type

* lift

* generator

* water\_reliability

* electricity\_backup

* road\_width

* waterlogging\_risk

* distance\_to\_main\_road\_minutes

* nearby\_transport

* nearby\_school

* nearby\_hospital

* nearby\_market

* commute\_times

* house\_rules

* curfew

* guest\_policy

* source\_trust

* photos\_count

* missing\_fields

* red\_flags

* notes

---

## 16\. User profile schema

Each user/search profile should include:

* id

* mode

* renting\_or\_buying

* household\_type

* budget\_monthly

* max\_first\_month\_cash

* preferred\_areas

* avoid\_areas

* commute\_anchors

* school\_anchors

* priority\_rankings

* deal\_breakers

* gender\_safety\_preference

* bachelor\_status

* family\_status

* room\_or\_full\_flat

* minimum\_bedrooms

* lift\_required

* gas\_required

* avoid\_broker

* avoid\_waterlogging

* created\_at

---

## 17\. Area data schema

Each area should include:

* area\_id

* name

* city

* average\_rent\_low

* average\_rent\_high

* commute\_notes

* family\_suitability

* bachelor\_suitability

* female\_suitability

* school\_access

* office\_access

* transport\_access

* affordability

* waterlogging\_risk

* utility\_reliability

* noise\_level

* best\_for

* avoid\_if

* sample\_tradeoff

---

## 18\. Scoring and recommendation logic

Do not over-show scores to users. Use scores internally and explain results in human language.

### Internal scores

#### *1\. Budget fit*

Based on:

* rent within budget

* first-month cost within limit

* service charge clarity

* broker fee

#### *2\. Commute fit*

Based on:

* distance/time to office/school/university

* number of important commute anchors

* commute priority weight

#### *3\. Household fit*

Based on:

* family/bachelor/student/female compatibility

* tenant preference in listing

* house rules

#### *4\. Hidden cost risk*

Based on:

* advance months

* broker fee

* service charge unclear

* utilities unclear

* moving cost

#### *5\. Utility clarity*

Based on:

* gas type known

* electricity backup known

* water source known

* lift/generator info known

#### *6\. Listing trust*

Based on:

* exact area present

* rent present

* phone/contact clarity

* too-cheap warning

* suspicious urgency

* missing info count

* source type

#### *7\. Monsoon/access risk*

Based on:

* area risk

* distance from main road

* road width

* waterlogging tag

---

## 19\. Ranking formula for MVP

Use a simple weighted formula.

For family/couple:

* Budget fit: 25%

* Commute fit: 20%

* Household fit: 15%

* Utility clarity: 15%

* Hidden cost risk: 15%

* Monsoon/access risk: 10%

For bachelor/student:

* Budget fit: 25%

* Household fit: 25%

* Commute fit: 20%

* Hidden cost risk: 15%

* Listing trust: 10%

* Utility clarity: 5%

For working woman/female student:

* Household fit/safety rule clarity: 25%

* Commute fit: 20%

* Budget fit: 20%

* Listing trust: 15%

* Hidden cost risk: 10%

* Utility/access clarity: 10%

For relocation user:

* Area suitability: 25%

* Budget fit: 20%

* Commute fit: 20%

* Hidden cost risk: 15%

* Household fit: 10%

* Utility/monsoon clarity: 10%

---

## 20\. User-facing verdict labels

Avoid showing too many numbers.

Use:

### Visit

The listing fits the user well and has manageable risks.

### Maybe

The listing could work, but important information is missing.

### Call first

The listing may be good, but the user should confirm key details before visiting.

### Avoid

The listing strongly conflicts with budget, commute, household type, or has too many red flags.

---

## 21\. Explanation templates

### Good fit

“This looks worth visiting because it fits your budget, commute is manageable, and the household rule matches your situation.”

### Hidden cost warning

“The listed rent looks okay, but the advance, service charge, and broker fee may make the real move-in cost much higher.”

### Commute trade-off

“This option saves rent, but your daily commute may become harder.”

### Tenant restriction warning

“This listing says family preferred. If you are a bachelor or student, call before visiting.”

### Utility warning

“Gas and service charge are unclear. Confirm before visiting.”

### Missing information warning

“Important details are missing. Ask these questions before spending time on a visit.”

---

## 22\. AI usage plan

Use AI only where it improves the demo.

### AI-supported tasks

1. Parse messy listing text

2. Convert user’s natural language into structured preferences

3. Generate natural call script

4. Generate final report wording

### Non-AI tasks

1. Scoring

2. Ranking

3. Cost calculation

4. Comparison

5. Area recommendation

6. Filtering

7. Verdict labels

8. Checklist generation

### API cost control

* Use OpenRouter only.

* Cache AI results.

* Prepare demo examples.

* Always include fallback parser.

* Do not depend on live AI for the entire demo.

---

## 23\. RAG/crawling approach for hackathon

Do not rely on live crawling during demo.

### Demo-safe approach

1. Create seeded dataset.

2. Create raw listing examples.

3. Show a “scanning listings” animation.

4. Use cached structured data.

5. Use paste-listing checker for interactivity.

### Production approach

Possible future sources:

* user-pasted listings

* public listing pages where permitted

* partner listings

* landlord direct submissions

* broker submissions

* university/community housing groups

* verified property managers

### Wording

Say:

“For the prototype, we use a prepared Dhaka-style dataset and listing-paste analysis. In production, the same pipeline can ingest partner listings and user-submitted posts.”

Do not say:

“We scrape everything live from Bproperty and Facebook.”

---

## 24\. Technical architecture

### Recommended stack

* Frontend: Next.js

* Styling: Tailwind CSS

* Components: shadcn/ui or simple custom components

* Backend: Supabase

* Database: Supabase Postgres

* Storage: Supabase Storage if screenshots/PDFs are needed

* Hosting: Vercel

* Map: Leaflet \+ OpenStreetMap

* PDF: jsPDF or react-pdf

* AI: OpenRouter

* Local fallback: static JSON data

### Main frontend routes

* /

* /start

* /plan

* /check-listing

* /compare

* /results

* /listing/\[id\]

* /visit-plan

* /report

* /demo-data

### Main components

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

* MapView

* DemoScanAnimation

---

## 25\. Database tables

### users

For hackathon, optional.

Fields:

* id

* name

* phone

* email

* created\_at

### search\_profiles

Fields:

* id

* user\_id

* household\_type

* budget\_monthly

* max\_first\_month\_cash

* commute\_anchors

* priority\_rankings

* deal\_breakers

* mode

* created\_at

### listings

Fields:

* id

* title

* raw\_text

* source\_type

* area

* rent

* bedrooms

* bathrooms

* size\_sqft

* tenant\_preference

* advance\_months

* broker\_fee

* service\_charge

* gas\_type

* lift

* generator

* waterlogging\_risk

* latitude

* longitude

* house\_rules

* red\_flags

* created\_at

### areas

Fields:

* id

* name

* city

* rent\_low

* rent\_high

* family\_score

* bachelor\_score

* commute\_score

* school\_score

* utility\_score

* waterlogging\_risk

* notes

### recommendations

Fields:

* id

* search\_profile\_id

* listing\_id

* budget\_fit

* commute\_fit

* household\_fit

* hidden\_cost\_risk

* utility\_clarity

* trust\_score

* final\_verdict

* explanation

### parsed\_listings

Fields:

* id

* raw\_text

* parsed\_json

* missing\_fields

* verdict

* generated\_questions

* created\_at

---

## 26\. Analytics for product success

### Hackathon demo metrics

Show these as fake/seeded metrics in dashboard:

* 104 listings scanned

* 37 removed due to budget mismatch

* 21 removed due to commute mismatch

* 14 removed due to hidden-cost risk

* 9 removed due to unclear tenant rules

* 3 best visits selected

### Real product metrics

* Time to shortlist 3 options

* Number of listings checked

* Number of visits avoided

* Number of call scripts generated

* Number of comparisons created

* Number of user-saved reports

* Percentage of users who found at least 1 visit-worthy option

---

## 27\. UX principles

### Keep it human

Say:

“Good fit, but check service charge.”

Do not say:

“Utility Risk Score: 63.”

### Show fewer options

People do not need 100 listings. They need 3 good ones.

### Always show trade-offs

No home is perfect. Make the product feel honest.

### Make missing data useful

If data is missing, show questions to ask.

### Make it mobile-first

Most users will use it from a phone.

### Avoid long forms

Ask only what is needed. Let users refine later.

### Make every output actionable

Every result should answer:

“What should I do next?”

---

## 28\. Visual direction

### Style

Clean, warm, practical.

Avoid looking like:

* government portal

* student database project

* crypto dashboard

* overly futuristic AI app

### Suggested tone

* calm

* trustworthy

* helpful

* local

* direct

### Suggested colors

* white/off-white background

* deep green or navy primary

* soft yellow warning

* light red for avoid

* light green for visit

* gray for unknown/missing

### UI inspiration

* travel comparison sites

* fintech cost breakdowns

* clean checklist apps

* modern real estate cards

* health risk summary cards

---

## 29\. Copywriting rules

Use simple human language.

### Good copy

* “Worth visiting”

* “Call first”

* “This may cost more than it looks”

* “Ask before going”

* “Good for family, but commute is longer”

* “Looks cheap, but service charge is unclear”

### Bad copy

* “AI-powered rental intelligence”

* “Multi-dimensional urban housing optimization”

* “End-to-end property decision infrastructure”

* “Real estate operating system”

* “Revolutionary housing engine”

---

## 30\. Demo story

Use one main story.

### Main persona

Rafi and Mita are moving to Dhaka from Cumilla.

* Rafi works in Banani

* Mita works from home

* Budget: ৳35,000

* They want a future family-friendly area

* They care about lift, generator, commute, and low first-month cost

* They feel awkward negotiating with brokers

### Demo flow

1. Open homepage.

2. Select “Plan my search.”

3. Enter Rafi and Mita’s details.

4. BasaBondhu suggests 4 areas with trade-offs.

5. Show “104 listings scanned → 3 homes worth visiting.”

6. Show top 3 options.

7. Tap “shorter commute.”

8. Show results re-rank and explain rent trade-off.

9. Paste a messy broker listing.

10. Show clean summary and hidden cost warning.

11. Generate call script.

12. Show final report.

### Closing message

“BasaBondhu does not replace listing sites. It helps people make sense of listings before they waste time, money, or visits.”

---

## 31\. 3-minute pitch structure

### 0:00–0:25 Problem

“In Bangladesh, house hunting is not just a search problem. People already find listings on Facebook, Bikroy, brokers, and property sites. The problem is deciding which ones are actually worth visiting.”

### 0:25–0:45 Product

“BasaBondhu turns messy listings into clear choices. It helps users choose areas, check hidden costs, compare options, and know what to ask before calling.”

### 0:45–2:10 Demo

Show one full journey.

### 2:10–2:35 Why it is different

“Existing platforms show listings. BasaBondhu helps users make the decision.”

### 2:35–2:50 Business potential

Start with user-side listing checks, then build verified listings, relocation reports, and partner tools.

### 2:50–3:00 Close

“Instead of giving people 200 listings, BasaBondhu gives them 3 homes worth visiting.”

---

## 32\. Business model

### Early model

* free listing checker

* paid detailed moving report

* premium comparison report

* relocation guide for newcomers

* university/student housing guides

### Marketplace model

* verified listing placement

* broker/landlord lead quality tools

* promoted visit-worthy listings

* direct owner listing tools

### B2B model

* HR relocation support for companies

* university accommodation support

* real-estate agency decision reports

* area insight reports

### Buyer expansion

* document checklist

* registration cost estimator

* usable space calculator

* buyer risk report

---

## 33\. Roadmap

### Hackathon MVP

* guided survey

* area recommendations

* listing shortlist

* paste-listing checker

* first-month cost calculator

* compare options

* call script

* visit checklist

* final report

### 1-month version

* real user accounts

* save searches

* better parser

* screenshot OCR

* larger listing dataset

* shareable reports

* user feedback collection

### 3-month version

* user-submitted listing database

* area-level rent insights

* verified partner listings

* landlord/broker onboarding

* basic mobile PWA polish

* Bangla interface

### 6-month version

* neighborhood intelligence

* relocation packages

* student/family/women-specific guides

* premium reports

* verified listing quality badge

### 12-month version

* multi-city support

* Chattogram/Sylhet/Khulna expansion

* partner data ingestion

* buyer assistance preview

* corporate relocation support

---

## 34\. Major risks and fixes

### Risk 1: Looks like another listing app

Fix:

Lead with listing checker and “3 homes worth visiting,” not search.

### Risk 2: Too broad

Fix:

Demo one narrow journey. Mention broader modes only after.

### Risk 3: Data challenge

Fix:

Use seeded dataset and paste-listing checker. Do not claim live scraping.

### Risk 4: AI unreliability

Fix:

Use rule-based fallback and prepared examples.

### Risk 5: User form too long

Fix:

Keep start form short. Let users refine later.

### Risk 6: Recommendations feel fake

Fix:

Every result must explain why, what risk, and what to ask.

### Risk 7: UI looks weak

Fix:

Spend serious time on visual polish and spacing.

### Risk 8: Judges ask “why not Bproperty?”

Fix:

Answer: “Bproperty shows listings. BasaBondhu helps decide whether a listing is worth visiting.”

---

## 35\. Acceptance criteria for hackathon

The project is ready only if:

1. User can complete guided search in under 60 seconds.

2. App returns area recommendations.

3. App shows 3 homes worth visiting.

4. Each listing has a clear verdict.

5. Paste-listing checker works with at least 10 messy examples.

6. First-month cost calculator works.

7. Compare page works.

8. Call script is generated.

9. Visit checklist is generated.

10. Final report page works.

11. Demo does not rely on fragile live APIs.

12. UI looks polished on mobile.

13. Team can explain the product in one sentence.

14. Team can answer “why not Bproperty?”

15. Team has backup video.

---

## 36\. Final MVP feature lock

Build only these:

1. Plan my search

2. Check this listing

3. Area recommendations

4. 3 homes worth visiting

5. First-month cost calculator

6. Compare options

7. Guided adjustment buttons

8. Call-before-visit script

9. Visit checklist

10. Final report

Everything else is secondary.

---

## 37\. Final verdict

The winning version of BasaBondhu is not a listing marketplace and not a chatbot.

It is a practical house-hunting helper.

It wins if the judge sees this clearly:

Before BasaBondhu:

“I have 100 confusing listings and no idea what to do.”

After BasaBondhu:

“I know which 3 homes to visit, what each one risks, what it will really cost, and what to ask before calling.”

That is the product.