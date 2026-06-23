"use client";

import React from "react";
import ListingChecker from "@/components/ListingChecker";

export default function ParserPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-1 text-left">
        <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] uppercase font-black tracking-widest rounded-full border border-primary/20">
          Social Listing Analyzer
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-text-main tracking-tight transition-colors">Paste Confusing Social Listings</h2>
        <p className="text-xs sm:text-sm text-text-muted leading-relaxed transition-colors">
          Found a listing on a Facebook group, Bikroy, or Bproperty? Paste the raw copy text below. BasaBondhu parses it, flags hidden charges, waterlogging risks, and drafts call scripts.
        </p>
      </div>

      <ListingChecker />
    </div>
  );
}
