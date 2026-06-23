"use client";

import React from "react";
import Wizard from "@/components/Wizard";

export default function WizardPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-1 text-left">
        <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] uppercase font-black tracking-widest rounded-full border border-primary/20">
          Guided Matcher
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-text-main tracking-tight transition-colors">Set shifting parameters</h2>
        <p className="text-xs sm:text-sm text-text-muted leading-relaxed transition-colors">
          Tell us about your household type, monthly budget, transit hub, and dealbreakers to find compatible rentals.
        </p>
      </div>

      <div className="bg-card border border-border-light rounded-3xl p-6 sm:p-8 shadow-xs">
        <Wizard />
      </div>
    </div>
  );
}
