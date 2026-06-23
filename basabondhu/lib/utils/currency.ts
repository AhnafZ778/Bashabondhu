/**
 * Currency Utilities
 * BDT (Bangladeshi Taka) formatting helpers.
 */

export function formatBDT(amount: number): string {
  return `৳${amount.toLocaleString("en-BD")}`;
}

export function formatBDTShort(amount: number): string {
  if (amount >= 100000) {
    return `৳${(amount / 100000).toFixed(1)} lac`;
  }
  if (amount >= 1000) {
    return `৳${(amount / 1000).toFixed(0)}k`;
  }
  return `৳${amount}`;
}

export function parseBDTString(text: string): number | null {
  // Handle "28k", "28,000", "28000", "৳28,000"
  const cleaned = text.replace(/[৳,\s]/g, "").toLowerCase();
  
  const shortMatch = cleaned.match(/^(\d+)k$/);
  if (shortMatch) {
    return parseInt(shortMatch[1]) * 1000;
  }

  const numMatch = cleaned.match(/^(\d+)$/);
  if (numMatch) {
    return parseInt(numMatch[1]);
  }

  return null;
}

export function formatRentRange(low: number, high: number): string {
  return `${formatBDTShort(low)} – ${formatBDTShort(high)}`;
}
