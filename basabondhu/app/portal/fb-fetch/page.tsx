"use client";

import React from "react";
import FacebookFetcher from "@/components/FacebookFetcher";

export default function FacebookFetchPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-1.5 text-left">
        <span className="text-[#C9952B] font-serif text-[10px] sm:text-xs uppercase tracking-[0.3em] font-bold">
          Social Crawler
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif uppercase tracking-wider text-text-main font-black transition-colors">
          Facebook Post Fetcher
        </h2>
        <p className="text-xs text-text-muted leading-relaxed transition-colors">
          Paste any raw Facebook rental listing URL to fetch, parse, and structure its data instantly.
        </p>
      </div>

      <FacebookFetcher />
    </div>
  );
}
