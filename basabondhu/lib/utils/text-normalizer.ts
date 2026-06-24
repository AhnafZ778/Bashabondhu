/**
 * Text Normalizer
 * Banglish text cleaning and normalization for consistent parsing.
 */

// Bangla numeral to English numeral mapping
const BANGLA_DIGITS: Record<string, string> = {
  "০": "0", "১": "1", "২": "2", "৩": "3", "৪": "4",
  "৫": "5", "৬": "6", "৭": "7", "৮": "8", "৯": "9"
};

export function normalizeBanglaDigits(text: string): string {
  return text.replace(/[০-৯]/g, match => BANGLA_DIGITS[match] || match);
}

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
