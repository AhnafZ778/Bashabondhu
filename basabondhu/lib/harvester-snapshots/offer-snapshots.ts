import { OfferSnapshot } from "@/lib/types/harvester";

export const DEMO_OFFER_SNAPSHOTS: OfferSnapshot[] = [
  {
    id: "off-demo-1",
    listingId: "hlst-demo-1",
    offerType: "listed",
    monthlyRent: 25000,
    advanceMonths: 2,
    serviceCharge: 3000,
    brokerFee: 0,
    movingEstimate: 5000,
    totalFirstMonthCost: 58000, // (25000 * 2 advance) + 25000 rent + 3000 service + 5000 move
    negotiable: true,
    includedUtilities: ["water"],
    confidence: "confirmed",
    capturedAt: new Date(Date.now() - 3600000).toISOString(),
    warnings: ["High advance payment required (2 months)"],
  },
  {
    id: "off-demo-2",
    listingId: "hlst-demo-2",
    offerType: "listed",
    monthlyRent: 32000,
    advanceMonths: 1,
    serviceCharge: 4500,
    brokerFee: 0,
    movingEstimate: 6000,
    totalFirstMonthCost: 74500, // (32000 * 1 advance) + 32000 rent + 4500 service + 6000 move
    negotiable: false,
    includedUtilities: ["gas", "water"],
    confidence: "confirmed",
    capturedAt: new Date(Date.now() - 7200000).toISOString(),
    warnings: [],
  },
];
