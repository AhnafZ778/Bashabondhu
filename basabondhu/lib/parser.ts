import { ParsedListing } from "./types";

const DHAKA_AREAS = [
  "Banasree", "Badda", "Mohakhali", "Tejgaon", "Mohammadpur", 
  "Lalmatia", "Mirpur", "Uttara", "Bashundhara", "Dhanmondi"
];

export function parseMessyListing(rawText: string): ParsedListing {
  const text = rawText.toLowerCase();

  // 1. Area Extraction
  let area: string | null = null;
  for (const a of DHAKA_AREAS) {
    if (text.includes(a.toLowerCase())) {
      area = a;
      break;
    }
  }

  // 2. Rent Extraction
  let rent: number | null = null;
  // Match patterns like "28k", "28,000", "28000"
  const rentShortMatch = text.match(/\b(\d{1,2})k\b/);
  if (rentShortMatch) {
    rent = parseInt(rentShortMatch[1]) * 1000;
  } else {
    const rentMatch = text.match(/(?:rent|bhara|ভাড়া|taka|tk|৳)\s*[:=]?\s*(\d[\d,]*)/);
    if (rentMatch) {
      rent = parseInt(rentMatch[1].replace(/,/g, ""));
    }
  }

  // 3. Bedrooms Extraction
  let bedrooms: number | null = null;
  const bedMatch = text.match(/(\d)\s*(?:bed|bedroom|bed room|রুম|room)/);
  if (bedMatch) {
    bedrooms = parseInt(bedMatch[1]);
  }

  // 4. Bathrooms Extraction
  let bathrooms: number | null = null;
  const bathMatch = text.match(/(\d)\s*(?:bath|bathroom|bath room|বাথরুম)/);
  if (bathMatch) {
    bathrooms = parseInt(bathMatch[1]);
  }

  // 5. Tenant Preference Extraction
  let tenantPreference: string | null = null;
  if (text.includes("family only") || text.includes("family preferred") || text.includes("পরিবার")) {
    tenantPreference = "family";
  } else if (text.includes("bachelor") || text.includes("ব্যাচেলর")) {
    tenantPreference = "bachelor";
  } else if (text.includes("female") || text.includes("working lady") || text.includes("মহিলা")) {
    tenantPreference = "female";
  } else if (text.includes("student") || text.includes("ছাত্র")) {
    tenantPreference = "student";
  } else if (text.includes("any") || text.includes("everyone")) {
    tenantPreference = "any";
  }

  // 6. Advance Months Extraction
  let advanceMonths: number | null = null;
  const advanceMatch = text.match(/(\d)\s*(?:month|mas|মাস)?\s*(?:advance|security|অগ্রিম|ডিপোজিট)/);
  if (advanceMatch) {
    advanceMonths = parseInt(advanceMatch[1]);
  }

  // 7. Lift Extraction
  let lift: boolean | null = null;
  if (text.includes("lift") || text.includes("লিফট")) {
    lift = !text.includes("no lift") && !text.includes("লিফট নাই");
  }

  // 8. Generator Extraction
  let generator: boolean | null = null;
  if (text.includes("generator") || text.includes("জেনারেটর") || text.includes("gen backup") || text.includes("power backup")) {
    generator = !text.includes("no generator") && !text.includes("জেনারেটর নাই");
  }

  // 9. Gas Type Extraction
  let gasType: string | null = null;
  if (text.includes("cylinder") || text.includes("সিলিন্ডার") || text.includes("lpg")) {
    gasType = "cylinder";
  } else if (text.includes("line gas") || text.includes("titas") || text.includes("লাইন গ্যাস") || text.includes("সরকারী গ্যাস")) {
    gasType = "line";
  } else if (text.includes("gas") || text.includes("গ্যাস")) {
    gasType = "unknown";
  }

  // 10. Service Charge Extraction
  let serviceCharge: string | null = null;
  const serviceMatch = text.match(/(?:service charge|সার্ভিস চার্জ|sc)\s*[:=]?\s*(\d[\d,]*)/);
  if (serviceMatch) {
    serviceCharge = `৳${parseInt(serviceMatch[1].replace(/,/g, "")).toLocaleString()}`;
  } else if (text.includes("service charge extra") || text.includes("sc separate") || text.includes("সার্ভিস চার্জ আলাদা")) {
    serviceCharge = "extra";
  } else if (text.includes("inclusive") || text.includes("no service charge")) {
    serviceCharge = "included";
  }

  // 11. Broker Fee Extraction
  let brokerFee: string | null = null;
  if (text.includes("no broker") || text.includes("direct owner") || text.includes("মালিক সরাসরি")) {
    brokerFee = "no-fee";
  } else if (text.includes("broker fee") || text.includes("media fee") || text.includes("ব্রোকার") || text.includes("মিডিয়া")) {
    brokerFee = "applicable";
  }

  // 12. Availability Extraction
  let availability: string | null = null;
  const availMatch = text.match(/(?:available from|avail from|রানিং|চলতি|শুরু|জুন|জুলাই|আগস্ট|available|from)\s*([a-zA-Z\d\s]+)/);
  if (availMatch) {
    availability = availMatch[1].trim();
  }

  // Detect missing critical info
  const missingFields: string[] = [];
  if (area === null) missingFields.push("Location/Area");
  if (rent === null) missingFields.push("Rent Amount");
  if (bedrooms === null) missingFields.push("Bedrooms Count");
  if (advanceMonths === null) missingFields.push("Upfront Advance/Deposit");
  if (gasType === null) missingFields.push("Gas Type (Line/Cylinder)");
  if (serviceCharge === null) missingFields.push("Service Charge Details");
  if (brokerFee === null) missingFields.push("Broker Fee status");
  if (lift === null) missingFields.push("Lift Facility");
  if (generator === null) missingFields.push("Generator Backup");

  // Determine confidence
  let confidence: "high" | "medium" | "low" = "high";
  const missingCount = missingFields.length;
  if (missingCount >= 5) confidence = "low";
  else if (missingCount >= 2) confidence = "medium";

  return {
    area,
    rent,
    bedrooms,
    bathrooms,
    tenantPreference,
    advanceMonths,
    lift,
    generator,
    gasType,
    serviceCharge,
    brokerFee,
    availability,
    missingFields,
    confidence
  };
}
