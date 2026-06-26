"use client";

import React from "react";
import ListingChecker from "@/components/ListingChecker";

export default function ParserPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-1.5 text-left">
        <span className="text-[#C9952B] font-sans text-[10px] sm:text-xs uppercase tracking-[0.3em] font-bold">
          Social Parser
        </span>
        <h2 className="text-2xl sm:text-3xl font-sans uppercase tracking-wider text-text-main font-black transition-colors">Messy Listing Parser</h2>
        <p className="text-xs text-text-muted leading-relaxed transition-colors">
          Paste any raw rental post to scan for hidden moving costs and waterlogging risks.
        </p>
      </div>

      <ListingChecker />
    </div>
  );
}
