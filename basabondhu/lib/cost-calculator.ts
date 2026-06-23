import { Listing, FirstMonthCost } from "./types";

export function calculateFirstMonthCost(listing: Listing): FirstMonthCost {
  const rent = listing.rent;
  const advance = rent * listing.advanceMonths;
  const serviceCharge = listing.serviceCharge ?? 0;
  const brokerFee = listing.brokerFee ?? 0;
  
  // Calculate moving cost estimate based on rent class
  const movingEstimate = rent <= 15000 ? 3000 : rent <= 30000 ? 5000 : 8000;
  const total = rent + advance + serviceCharge + brokerFee + movingEstimate;

  const warnings: string[] = [];
  if (!listing.serviceChargeKnown) {
    warnings.push("Service charge is unclear in listing — could add ৳2,000–৳5,000/month.");
  }
  if (listing.brokerFee === null) {
    warnings.push("Broker fee is unknown — may add up to 1 month rent if broker listing.");
  } else if (listing.brokerFee > 0) {
    warnings.push(`Upfront broker fee of ৳${listing.brokerFee.toLocaleString()} applies.`);
  }
  if (listing.advanceMonths >= 2) {
    warnings.push(`High advance required: ${listing.advanceMonths} months (৳${advance.toLocaleString()}) upfront.`);
  }
  if (listing.gasType === "cylinder") {
    warnings.push("Cylinder gas in use — adds ~৳1,500–৳2,500/month separate from utilities.");
  } else if (listing.gasType === "unknown") {
    warnings.push("Gas type is unknown — check if gas line is active or cylinder.");
  }
  if (listing.waterloggingRisk === "high") {
    warnings.push("Heavy waterlogging risk in this area during monsoons — check street height.");
  }

  return {
    rent,
    advance,
    serviceCharge,
    brokerFee,
    movingEstimate,
    total,
    warnings,
  };
}
