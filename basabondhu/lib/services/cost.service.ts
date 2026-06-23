import { Listing, FirstMonthCost } from "../types";
import { calculateFirstMonthCost } from "../cost-calculator";

/**
 * Cost Service
 * Wraps calculateFirstMonthCost() with affordability checks and broker-fee toggle support.
 */

export function getCostBreakdown(listing: Listing): FirstMonthCost {
  return calculateFirstMonthCost(listing);
}

export function getCostWithBrokerToggle(
  listing: Listing,
  includeBrokerFee: boolean
): FirstMonthCost {
  const baseCost = calculateFirstMonthCost(listing);
  
  if (!includeBrokerFee) {
    const adjustedTotal = baseCost.total - baseCost.brokerFee;
    return {
      ...baseCost,
      brokerFee: 0,
      total: adjustedTotal,
      warnings: baseCost.warnings.filter(w => !w.includes("broker fee")),
    };
  }

  return baseCost;
}

export function checkAffordability(
  cost: FirstMonthCost,
  maxFirstMonthCash: number
): { affordable: boolean; shortfall: number; message: string } {
  const affordable = cost.total <= maxFirstMonthCash;
  const shortfall = affordable ? 0 : cost.total - maxFirstMonthCash;

  let message = "";
  if (affordable) {
    const remaining = maxFirstMonthCash - cost.total;
    message = `Within budget — ৳${remaining.toLocaleString()} remaining for move-in expenses.`;
  } else {
    message = `Exceeds your first-month cash by ৳${shortfall.toLocaleString()}. Consider negotiating advance or broker fee.`;
  }

  return { affordable, shortfall, message };
}
