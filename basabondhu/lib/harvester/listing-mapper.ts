import { Listing } from "@/lib/types";
import { HarvestedListing } from "@/lib/types/harvester";
import { areas } from "@/lib/data/areas";

export function mapHarvestedListingToListing(h: HarvestedListing): Listing {
  // Find coordinates and details from area profile if available
  const areaData = areas.find(
    (a) => a.name.toLowerCase() === h.area.toLowerCase()
  );
  const lat = areaData?.latitude || 23.7500;
  const lng = areaData?.longitude || 90.4000;
  const commute = areaData?.commuteNotes || "Commute details unavailable.";

  // Map sourceId to sourceType enum
  let sourceType: Listing["sourceType"] = "direct";
  const sid = h.sourceId.toLowerCase();
  if (sid.includes("facebook")) sourceType = "facebook";
  else if (sid.includes("bikroy")) sourceType = "bikroy";
  else if (sid.includes("bproperty")) sourceType = "bproperty";
  else if (sid.includes("partner")) sourceType = "broker";

  // Default property image
  const defaultImage =
    "/DhakaImages/highly-populated-dhaka-city-crammed-with-unplanned-buildings-KDCB15.jpg";

  return {
    id: h.id,
    title: h.title,
    rawText: h.title + (h.areaContext ? ". " + h.areaContext : ""),
    sourceType,
    area: h.area,
    addressHint: h.addressHint || "Dhaka, Bangladesh",
    city: "Dhaka",
    latitude: lat,
    longitude: lng,
    rent: h.rent,
    bedrooms: h.bedrooms || 2,
    bathrooms: h.bathrooms || 2,
    sizeSqft: h.sizeSqft || 1000,
    tenantPreference: h.tenantPreference,
    familyAllowed: h.familyAllowed,
    bachelorAllowed: h.bachelorAllowed,
    femaleFriendly: h.femaleFriendly,
    studentFriendly: h.studentFriendly,
    advanceMonths: h.advanceMonths ?? 2,
    brokerFee: h.brokerFee ?? null,
    serviceCharge: h.serviceCharge ?? null,
    serviceChargeKnown: h.serviceChargeKnown,
    brokerFeeKnown: h.brokerFeeKnown,
    gasType: h.gasType,
    lift: h.lift ?? false,
    generator: h.generator ?? false,
    waterloggingRisk: h.waterloggingRisk,
    utilityClarity: h.utilityClarity,
    commuteNotes: commute,
    houseRules: [],
    redFlags: h.redFlags,
    goodPoints: h.goodPoints,
    missingFields: h.missingFields,
    imageUrl: defaultImage,
    isActive: h.status === "active",
    isDemo: false,
  };
}
