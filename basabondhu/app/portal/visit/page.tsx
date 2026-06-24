"use client";

import React from "react";
import VisitPlanner from "@/components/VisitPlanner";

export default function VisitPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-1.5 text-left">
        <span className="text-[#C9952B] font-serif text-[10px] sm:text-xs uppercase tracking-[0.3em] font-bold">
          Call Scripts & Prep
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif uppercase tracking-wider text-text-main font-black transition-colors">Visit Preparation</h2>
        <p className="text-xs text-text-muted leading-relaxed transition-colors">
          Tailored call scripts to verify details and key physical visit checklists.
        </p>
      </div>

      <VisitPlanner />
    </div>
  );
}
