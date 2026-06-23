import { ScoredListing, SearchProfile } from "../types";

/**
 * Question Service
 * Generates contextual call-before-visit questions for listings.
 */

export function generateCallQuestions(
  listing: ScoredListing,
  profile: SearchProfile
): string[] {
  const questions: string[] = [];

  // Always ask about service charge clarity
  if (!listing.serviceChargeKnown) {
    questions.push("Service charge mash e koto? Electricity, water, gas ki alada?");
  }

  // Advance negotiation
  if (listing.advanceMonths >= 2) {
    questions.push(`Advance ${listing.advanceMonths} month dite hobe, 1 month e ki possible?`);
  }

  // Broker fee
  if (listing.sourceType === "broker" || listing.brokerFee === null) {
    questions.push("Broker/media fee koto lagbe? Negotiate kora jay?");
  }

  // Gas type verification
  if (listing.gasType === "unknown" || listing.gasType === "cylinder") {
    questions.push("Gas connection ki Titas line naki cylinder? Monthly koto khoroch hoy?");
  }

  // Generator/power backup
  if (!listing.generator) {
    questions.push("Load shedding er somoy ki IPS ba generator backup ache?");
  }

  // Waterlogging
  if (listing.waterloggingRisk === "high" || listing.waterloggingRisk === "medium") {
    questions.push("Barshat er somoy road e pani jome? Ground floor te ki kono problem hoy?");
  }

  // Household fit
  const userType = profile.householdType;
  if (listing.tenantPreference === "family" && (userType === "bachelor" || userType === "couple")) {
    questions.push("Amra couple/bachelor — apnar building e ki amader allow kora hobe?");
  }

  // Lift
  if (!listing.lift) {
    questions.push("Flat koto tala? Lift install er kono plan ache?");
  }

  // Parking
  if (listing.rent >= 25000) {
    questions.push("Car/bike parking er bebostha ache? Extra charge lage?");
  }

  // Move-in timing
  questions.push("Kobe theke shifting korte parbo? Rent ki sei din theke count hobe?");

  return questions;
}

export function generateCallScript(
  listing: ScoredListing,
  profile: SearchProfile
): string {
  const questions = generateCallQuestions(listing, profile);
  const area = listing.area;
  const rent = listing.rent.toLocaleString();

  let script = `Assalamu Alaikum, ami ${area} er flat er ad dekhe call korchi.\n`;
  script += `Apnar ${listing.bedrooms || "?"} bed flat ta ki ekhono available? Rent ৳${rent} right?\n\n`;
  script += `Amake kicchu confirm korte hobe:\n`;
  
  questions.forEach((q, i) => {
    script += `${i + 1}. ${q}\n`;
  });

  script += `\nDhonnobad, ami details note kore rakhchi. Kobe dekhte jete pari?`;

  return script;
}
