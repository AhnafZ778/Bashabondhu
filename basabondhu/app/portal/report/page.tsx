"use client";

import React, { useMemo } from "react";
import { useSearch } from "@/context/SearchContext";
import ReportPreview from "@/components/ReportPreview";
import { ReportSkeleton } from "@/components/Skeletons";
import { generateReport } from "@/lib/services/report.service";
import { generateScanSummary } from "@/lib/services/demo-scan.service";
import { listings } from "@/lib/data/listings";
import Link from "next/link";
import { FileText, ArrowRight } from "lucide-react";

export default function ReportPage() {
  const { profile, scoredListings, recommendedAreas } = useSearch();

  const report = useMemo(() => {
    if (!profile || scoredListings.length === 0) return null;

    const topListings = scoredListings
      .filter(l => l.verdict !== "avoid")
      .slice(0, 3);

    const scanSummary = generateScanSummary(listings, profile);

    return generateReport(profile, topListings, recommendedAreas, scanSummary);
  }, [profile, scoredListings, recommendedAreas]);

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8 animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-lg font-black text-text-main mb-2">
          No Search Data Yet
        </h2>
        <p className="text-xs text-text-muted max-w-sm leading-relaxed mb-6">
          Complete a search first to generate your housing report. Go to the Plan Search tab and fill in your details or select a persona.
        </p>
        <Link
          href="/portal"
          className="inline-flex items-center gap-2 px-5 py-3 bg-primary hover:bg-secondary text-white font-bold text-xs rounded-xl uppercase tracking-wider transition-all cursor-pointer"
        >
          Go to Plan Search
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  if (!report) {
    return <ReportSkeleton />;
  }

  return <ReportPreview report={report} />;
}
