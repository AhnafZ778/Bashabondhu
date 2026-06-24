import { RawDocument } from "@/lib/types/harvester";

export const DEMO_RAW_DOCUMENTS: RawDocument[] = [
  {
    id: "rdoc-demo-1",
    sourceId: "src-user-paste",
    rawText: "Banasree te 3 bed flat rent korbo, 25k. Family preferred. Line gas ace, lift generator ace. 2 advance. Call 01700000000.",
    contentHash: "h1a2b3c4d5",
    capturedAt: new Date(Date.now() - 3600000).toISOString(),
    consentType: "user_submitted",
    processingStatus: "parsed",
  },
  {
    id: "rdoc-demo-2",
    sourceId: "src-facebook-paste",
    rawText: "Flat for Rent in Dhanmondi. 2 Bedrooms, 2 Baths. Bachelor allowed. Gas line, Lift, Generator. Rent: 32000 BDT + Service charge. 1 Month advance.",
    contentHash: "h6e7f8g9h0",
    capturedAt: new Date(Date.now() - 7200000).toISOString(),
    consentType: "public_allowed",
    processingStatus: "parsed",
  },
  {
    id: "rdoc-demo-3",
    sourceId: "src-partner-csv",
    rawText: "Gulshan 1, Road 5. 3 Bed, 4 Bath, drawing dining. Family / Corporate Office. Lift, Generator, 2 Car Parking, gas cylinder. Rent 75,000 + service 8,000. 3 Advance. Broker fee half month rent applies.",
    contentHash: "h2j3k4l5m6",
    capturedAt: new Date(Date.now() - 14400000).toISOString(),
    consentType: "partner_provided",
    processingStatus: "parsed",
  },
];
