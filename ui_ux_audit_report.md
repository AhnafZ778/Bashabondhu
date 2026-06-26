# BasaBondhu: UI/UX & Frontend Audit Report

This report documents the UI/UX inconsistencies, non-local placeholder images, typography issues, and feature polish requirements identified during the end-to-end audit of the BasaBondhu application. Addressing these points will elevate the platform from a hackathon prototype to a premium, high-quality product tailored specifically for Bangladesh.

---

## 1. Non-Local Placeholder Image Mapping

BasaBondhu currently uses generic, Western-style placeholder images from Unsplash for its property listings, persona avatars, and section backgrounds. These present high-end Scandinavian or North American suburban interiors/exteriors that are completely out of place for Dhaka neighborhoods like Banasree, Dhanmondi, or Mohakhali.

Below is the mapping of all non-local placeholder images and where they are referenced in the codebase:

### Property Listings (`lib/data/listings.ts`)

| Array Index | Unsplash Image URL | Description of Visual / Why it Looks Wrong | Recommended Local replacement |
|---|---|---|---|
| `propertyImages[0]` | `photo-1502672260266-1c1ef2d93688` | Scandinavian-style minimalist living room with wooden floors and light-colored furniture. | A high-density Dhaka residential exterior/interior. |
| `propertyImages[1]` | `photo-1522708323590-d24dbb6b0267` | Nordic interior bedroom with white sheets, minimal decor, and soft warm lighting. | Local bedroom with traditional Bangladeshi furnishings. |
| `propertyImages[2]` | `photo-1484154218962-a197022b5858` | Modern European kitchen with steel utilities and brick tiling. | Dhaka kitchen style with standard exhaust fans and tiling. |
| `propertyImages[3]` | `photo-1560448204-e02f11c3d0e2` | Sleek commercial high-rise hallway from a Western business district. | Entrance lobby of a typical Dhaka apartment building. |
| `propertyImages[4]` | `photo-1560185127-6a2806647f81` | Cozy attic bedroom with sloped ceilings and wooden beams (non-existent in Dhaka). | A mid-range bedroom typical of Banasree or Mirpur flats. |
| `propertyImages[5]` | `photo-1545324418-cc1a3fa10c00` | Western residential block with high-end glass windows and pristine sidewalks. | Dhaka city street view or rooftop terrace scene. |
| `propertyImages[6]` | `photo-1600585154340-be6161a56a0c` | Ultra-luxurious open-concept kitchen and dining area from a US mansion. | Premium Gulshan or Banani apartment interior. |
| `propertyImages[7]` | `photo-1600607687939-ce8a6c25118c` | High-end modern house facade with manicured lawns and double garage. | Dhaka multi-story residential building with ground-floor parking. |
| `propertyImages[8]` | `photo-1600566753376-12c8ab7fb75b` | Modern duplex staircase with white drywall and hardwood steps. | Standard Dhaka duplex staircase with marble/mosaic and iron railings. |
| `propertyImages[9]` | `photo-1512917774080-9991f1c4c750` | California-style luxury estate with swimming pool and palm trees. | A premium rooftop garden or terrace from a building in Dhanmondi. |

### Search Personas (`lib/data/personas.ts`)

Every search persona currently maps directly to one of these Unsplash URLs. This means the visual representing their target home does not match Dhaka realities:
*   **Rafi & Mita (Demo Couple)**: Uses `photo-1600585154340-be6161a56a0c` (Western kitchen/dining).
*   **Nusrat (Female Student)**: Uses `photo-1522708323590-d24dbb6b0267` (Nordic bedroom).
*   **Abrar (Single Professional)**: Uses `photo-1502672260266-1c1ef2d93688` (Minimalist living room).
*   **Haque Family (4 Members)**: Uses `photo-1600566753376-12c8ab7fb75b` (Modern western duplex).
*   **Tasnim (Working Woman)**: Uses `photo-1560448204-e02f11c3d0e2` (Western commercial corridor).
*   **Sabbir (Relocating)**: Uses `photo-1545324418-cc1a3fa10c00` (Western residential block).
*   **Maliha & Roommates**: Uses `photo-1560185127-6a2806647f81` (Cozy attic).
*   **Kamal (Budget Bachelor)**: Uses `photo-1484154218962-a197022b5858` (European kitchen).

### Other Hardcoded Placeholder URLs
*   **Guided Matcher Entry Background** (`app/portal/page.tsx:L68`):
    `https://images.unsplash.com/photo-1600607687939-ce8a6c25118c` (Western villa facade).
*   **Fallback Grid/Card Images** (`components/ListingGrid.tsx:L150, L154, L289, L293`):
    `https://images.unsplash.com/photo-1545324418-cc1a3fa10c00` (Western residential block).
*   **Harvester Fallback Image** (`lib/harvester/listing-mapper.ts:L24`):
    `https://images.unsplash.com/photo-1560448204-e02f11c3d0e2` (Western office hallway).

---

## 2. Typography & Styling Issues

To achieve a **premium and cohesive look**, the typography and layouts need refinement:

1.  **Serif Font vs. Sans-Serif Clashes**:
    *   `Cormorant_Garamond` is a beautiful serif font. However, it is currently styled with `font-black`, `uppercase`, and high tracking (e.g., `font-serif font-black tracking-wider uppercase`). Garamond does not scale well when capitalized and weighted heavily; it loses its calligraphic elegance and looks jagged.
    *   **Fix**: For heavy uppercase titles, switch to `Inter` (or a premium geometric sans-serif). Keep `Cormorant_Garamond` for normal-case/italic titles and quotes (e.g., *“Assalamu Alaikum...”*) to preserve its literary, premium quality.
2.  **Color Consistency**:
    *   The primary gold accent color (`text-gold`, `#C9952B` or similar) is used in multiple places but sometimes conflicts with pure Tailwind classes like `text-[#C9952B]`, `text-amber-500`, or `text-yellow-600`.
    *   **Fix**: Consolidate the gold accents to reference Tailwind v4 design tokens consistently (e.g. define a theme color `gold` and use it exclusively).
3.  **Tag and Badge Designs**:
    *   Compatibility verdicts (e.g. *Avoid / Mismatch*, *Verify First*, *Visit Worthy*) use standard borders that look like unstyled outlines.
    *   **Fix**: Upgrade them with glassmorphism or soft translucent backgrounds (e.g., `bg-rose-500/10 text-rose-500 border border-rose-500/20 shadow-sm`) and add custom micro-icons.

---

## 3. Feature Polish & Functional Glitches

Several features require attention to feel premium and work flawlessly:

1.  **Listing Checker (Parser) Hardcodings**:
    *   In `ListingChecker.tsx`, the broker fee is hardcoded to a flat `10000` BDT. In Dhaka, broker fees are typically calculated as a percentage of the monthly rent (typically 50% or 100% of 1 month's rent).
    *   **Fix**: Set the default broker fee to `0.5 * rent` (50%) if a broker fee is detected, rather than a hardcoded static value.
2.  **Comparison Tool Alignment**:
    *   In `/portal/compare`, the table structure for comparing listings has varying row heights when text lengths differ, leading to misaligned columns and a cluttered view.
    *   **Fix**: Use flex grid cards or defined table cells with unified layout heights.
3.  **Leaflet Map CSS Breakage**:
    *   Leaflet's default marker icons and tile layers sometimes fail to align correctly because the stylesheet (`leaflet.css`) is imported dynamically or conflicts with Next.js fast refresh.
    *   **Fix**: Ensure standard Leaflet stylesheets are correctly injected at the root level, and handle marker rendering safely without server-side rendering (SSR) mismatch warnings.
4.  **Map Drawer Details Scrolling**:
    *   In `ListingGrid.tsx`, when viewing details of a listing, long landlord scripts and checklists get clipped at the bottom of the viewport on standard screen sizes.
    *   **Fix**: Wrap the drawer panel body in a scrollable block (`overflow-y-auto max-h-[calc(100vh-8rem)]`).

---

## 4. Proposed Local Asset Replacements

We should map the non-local property images to the locally harvested Dhaka imagery already present in public/DhakaImages/:

*   **Banasree / High-Density Areas**: Use `/DhakaImages/highly-populated-dhaka-city-crammed-with-unplanned-buildings-KDCB15.jpg` or `/DhakaImages/images.jpg`.
*   **Residential Flats**: Use `/DhakaImages/imag9es.jpg`, `/DhakaImages/image5s.jpg`, `/DhakaImages/imag22es.jpg`, `/DhakaImages/im88ages.jpg`.
*   **Rooftops / Balconies**: Use `/DhakaImages/imag999es.jpg`, `/DhakaImages/image99s.jpg`.
*   **Streets / Overviews**: Use `/DhakaImages/8images.jpg` or `/DhakaImages/istockphoto-2153844423-612x612.jpg`.
