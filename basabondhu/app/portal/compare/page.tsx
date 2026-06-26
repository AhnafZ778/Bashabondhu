"use client";

import React from "react";
import ListingComparison from "@/components/ListingComparison";

export default function ComparePage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-1.5 text-left">
        <span className="text-[#C9952B] font-sans text-[10px] sm:text-xs uppercase tracking-[0.3em] font-bold">
          Match Matrix
        </span>
        <h2 className="text-2xl sm:text-3xl font-sans uppercase tracking-wider text-text-main font-black transition-colors">Rental Matrix</h2>
        <p className="text-xs text-text-muted leading-relaxed transition-colors">
          Compare commutes, upfront costs, waterlogging reports, and utilities side-by-side.
        </p>
      </div>

      <ListingComparison />
    </div>
  );
}
