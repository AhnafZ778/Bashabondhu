/**
 * Text Normalizer (Extended)
 * Banglish text cleaning and normalization for consistent parsing.
 * Extended for the harvester pipeline with rent, area, housing term normalization.
 */

// Bangla numeral to English numeral mapping
const BANGLA_DIGITS: Record<string, string> = {
  "০": "0", "১": "1", "২": "2", "৩": "3", "৪": "4",
  "৫": "5", "৬": "6", "৭": "7", "৮": "8", "৯": "9"
};

export function normalizeBanglaDigits(text: string): string {
  return text.replace(/[০-৯]/g, match => BANGLA_DIGITS[match] || match);
}

/**
 * Normalize rent-related text patterns.
 * Converts "28k", "28K", "২৮ হাজার", "৳২৮,০০০" → standard numeric forms.
 */
export function normalizeRentText(text: string): string {
  let normalized = text;

  // "28k" or "28K" → "28000"
  normalized = normalized.replace(/\b(\d{1,3})\s*[kK]\b/g, (_, num) => {
    return String(parseInt(num) * 1000);
  });

  // "হাজার" (hajar = thousand) → multiply
  normalized = normalized.replace(
    /(\d+)\s*হাজার/g,
    (_, num) => String(parseInt(num) * 1000)
  );

  // "লাখ" (lakh = 100,000) → multiply
  normalized = normalized.replace(
    /(\d+)\s*লাখ/g,
    (_, num) => String(parseInt(num) * 100000)
  );

  // Remove ৳ symbol and commas from numbers
  normalized = normalized.replace(/৳\s*/g, "");
  normalized = normalized.replace(/(\d),(\d{3})/g, "$1$2");

  return normalized;
}

/**
 * Normalize Dhaka area names to canonical forms.
 */
const AREA_ALIASES: Record<string, string> = {
  "banashree": "Banasree",
  "banasree": "Banasree",
  "বানাশ্রী": "Banasree",
  "badda": "Badda",
  "বাড্ডা": "Badda",
  "natun bazar": "Badda",
  "mohakhali": "Mohakhali",
  "মহাখালী": "Mohakhali",
  "tejgaon": "Tejgaon",
  "তেজগাঁও": "Tejgaon",
  "mohammadpur": "Mohammadpur",
  "মোহাম্মদপুর": "Mohammadpur",
  "lalmatia": "Lalmatia",
  "লালমাটিয়া": "Lalmatia",
  "mirpur": "Mirpur",
  "মিরপুর": "Mirpur",
  "uttara": "Uttara",
  "উত্তরা": "Uttara",
  "bashundhara": "Bashundhara",
  "বসুন্ধরা": "Bashundhara",
  "dhanmondi": "Dhanmondi",
  "ধানমন্ডি": "Dhanmondi",
  "gulshan": "Gulshan",
  "গুলশান": "Gulshan",
  "banani": "Banani",
  "বনানী": "Banani",
  "motijheel": "Motijheel",
  "মতিঝিল": "Motijheel",
  "farmgate": "Farmgate",
  "ফার্মগেট": "Farmgate",
  "rampura": "Rampura",
  "রামপুরা": "Rampura",
  "shekhertek": "Mohammadpur",
  "tajmahal road": "Mohammadpur",
  "mirpur dohs": "Mirpur",
};

export function normalizeAreaNames(text: string): string {
  let normalized = text;
  for (const [alias, canonical] of Object.entries(AREA_ALIASES)) {
    const regex = new RegExp(alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    normalized = normalized.replace(regex, canonical);
  }
  return normalized;
}

/**
 * Normalize housing-specific terms.
 */
export function normalizeHousingTerms(text: string): string {
  let normalized = text;

  // Bangla housing terms → English
  const termMap: [RegExp, string][] = [
    [/ভাড়া/g, "rent"],
    [/বেড/g, "bed"],
    [/বেডরুম/g, "bedroom"],
    [/বাথরুম/g, "bathroom"],
    [/বাথ/g, "bath"],
    [/রুম/g, "room"],
    [/পরিবার/g, "family"],
    [/ব্যাচেলর/g, "bachelor"],
    [/মহিলা/g, "female"],
    [/ছাত্র/g, "student"],
    [/অগ্রিম/g, "advance"],
    [/ডিপোজিট/g, "deposit"],
    [/সার্ভিস চার্জ/g, "service charge"],
    [/সিলিন্ডার/g, "cylinder"],
    [/লাইন গ্যাস/g, "line gas"],
    [/সরকারি গ্যাস/g, "line gas"],
    [/সরকারী গ্যাস/g, "line gas"],
    [/তিতাস/g, "titas"],
    [/লিফট/g, "lift"],
    [/জেনারেটর/g, "generator"],
    [/ব্রোকার/g, "broker"],
    [/মিডিয়া/g, "media"],
    [/মালিক/g, "owner"],
    [/মাস/g, "month"],
    [/টাকা/g, "taka"],
    [/ফ্ল্যাট/g, "flat"],
  ];

  for (const [pattern, replacement] of termMap) {
    normalized = normalized.replace(pattern, replacement);
  }

  return normalized;
}

/**
 * Normalize spacing and clean up text.
 */
export function normalizeSpacing(text: string): string {
  return text
    .replace(/\s+/g, " ")       // collapse multiple spaces
    .replace(/\n+/g, " ")       // newlines to spaces
    .replace(/\t+/g, " ")       // tabs to spaces
    .replace(/\s*,\s*/g, ", ")   // normalize comma spacing
    .replace(/\s*\.\s*/g, ". ") // normalize period spacing
    .trim();
}

/**
 * Master normalizer — chains all normalizers in correct order.
 * This is the primary entry point for the harvester pipeline.
 */
export function normalizeListingText(text: string): string {
  let normalized = text;
  normalized = normalizeBanglaDigits(normalized);
  normalized = normalizeRentText(normalized);
  normalized = normalizeAreaNames(normalized);
  normalized = normalizeHousingTerms(normalized);
  normalized = normalizeText(normalized);
  normalized = normalizeSpacing(normalized);
  return normalized;
}

// ── Legacy functions (kept for backward compatibility) ──

export function normalizeText(text: string): string {
  let normalized = text;

  // Convert Bangla digits to English
  normalized = normalizeBanglaDigits(normalized);

  // Normalize common Banglish abbreviations
  normalized = normalized
    .replace(/\bbed\s*room\b/gi, "bedroom")
    .replace(/\bbath\s*room\b/gi, "bathroom")
    .replace(/\b(\d+)\s*tk\b/gi, "$1")
    .replace(/\b(\d+)\s*taka\b/gi, "$1")
    .replace(/৳/g, "")
    .replace(/\bsc\b/gi, "service charge")
    .replace(/\badv\b/gi, "advance")
    .replace(/\bsqft\b/gi, "sq ft")
    .replace(/\bbchlr\b/gi, "bachelor")
    .replace(/\bcylndr\b/gi, "cylinder")
    .replace(/\blft\b/gi, "lift")
    .replace(/\brnt\b/gi, "rent")
    .replace(/\bavlbl\b/gi, "available")
    .replace(/\bnr\b/gi, "near")
    .replace(/\bimmd\b/gi, "immediately");

  return normalized.trim();
}

export function extractPhoneNumber(text: string): string | null {
  const phoneMatch = text.match(/(?:01[3-9]\d{8}|017XXXXXXXX|018XXXXXXXX|019XXXXXXXX)/);
  return phoneMatch ? phoneMatch[0] : null;
}
