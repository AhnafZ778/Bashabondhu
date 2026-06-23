"use client";

import React from "react";
import ListingComparison from "@/components/ListingComparison";

export default function ComparePage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-1 text-left">
        <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] uppercase font-black tracking-widest rounded-full border border-primary/20">
          Apartment Match Matrix
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-text-main tracking-tight transition-colors">Side-by-Side Rental Matrix</h2>
        <p className="text-xs sm:text-sm text-text-muted leading-relaxed transition-colors">
          Compare lift availability, gas line status, waterlogging reports, and true upfront moving budgets for your shortlisted apartments.
        </p>
      </div>

      <ListingComparison />
    </div>
  );
}
