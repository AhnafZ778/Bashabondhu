"use client";

import React from "react";
import VisitPlanner from "@/components/VisitPlanner";

export default function VisitPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-1 text-left">
        <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] uppercase font-black tracking-widest rounded-full border border-primary/20">
          Negotiation & Call Planner
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-text-main tracking-tight transition-colors">Visit Preparation Planner</h2>
        <p className="text-xs sm:text-sm text-text-muted leading-relaxed transition-colors">
          Generate tailored phone interview scripts to verify missing details from the landlord before scheduling physical site visits.
        </p>
      </div>

      <VisitPlanner />
    </div>
  );
}
