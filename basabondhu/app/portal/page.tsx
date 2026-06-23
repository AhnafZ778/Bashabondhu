"use client";

import React from "react";
import { useSearch } from "@/context/SearchContext";
import AreaRecommendations from "@/components/AreaRecommendations";
import ListingGrid from "@/components/ListingGrid";
import Link from "next/link";
import { Home as HomeIcon, Sparkles, HelpCircle, ArrowRight, Settings } from "lucide-react";
import { personas } from "@/lib/data/personas";
import { SearchProfile } from "@/lib/types";

export default function PortalPage() {
  const { profile, planSearch, scoredListings, resetSearch } = useSearch();

  // Count high compatibility matches
  const highCompatCount = scoredListings.filter(l => l.scores.total >= 80).length;

  const handlePersonaSelect = (p: typeof personas[0]) => {
    const newProfile: SearchProfile = {
      id: p.id,
      mode: "plan",
      rentingOrBuying: "renting",
      householdType: p.householdType,
      lookingFor: p.lookingFor,
      budgetMonthly: p.budgetMonthly,
      maxFirstMonthCash: p.maxFirstMonthCash,
      commuteAnchors: p.commuteAnchors,
      priorities: p.priorities,
      dealBreakers: p.dealBreakers
    };
    planSearch(newProfile);
  };

  // If search profile doesn't exist, show a clean onboarding screen with persona quick selectors
  if (!profile) {
    return (
      <div className="space-y-10 animate-fade-in py-4">
        <div className="space-y-3 max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary text-[10px] uppercase font-extrabold tracking-widest rounded-full border border-primary/20">
            <Sparkles className="w-3 h-3" />
            Set Up Your Match Profile
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-text-main tracking-tight leading-tight">
            How do you want to find your next home?
          </h2>
          <p className="text-sm text-text-muted leading-relaxed">
            Configure your lifestyle criteria (commute daily anchor, maximum shifting budget, custom rules) to filter and rank Dhaka rentals with zero guesswork.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Action Card 1: Custom Wizard */}
          <div className="bg-card border border-border-light rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm">
            <h3 className="font-extrabold text-lg text-text-main">Option A: Build Custom Criteria</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Step-by-step profile matcher. We will ask you about your household type, maximum move-in cash, transit hub (work/school), and deal breakers. Takes less than 60 seconds.
            </p>
            <Link
              href="/portal/wizard"
              className="inline-flex items-center gap-1.5 px-5 py-3 bg-primary hover:bg-secondary text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md shadow-primary/10 active:scale-[0.98] cursor-pointer"
            >
              Start Guided Matcher
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Action Card 2: Quick Personas */}
          <div className="bg-card border border-border-light rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
            <h3 className="font-extrabold text-lg text-text-main">Option B: Use Demo Personas</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Instantly test BasaBondhu matches using preset Dhaka renter situations.
            </p>

            <div className="grid grid-cols-1 gap-2.5 pt-2">
              {personas.slice(0, 3).map((p) => (
                <button
                  key={p.id}
                  onClick={() => handlePersonaSelect(p)}
                  className="flex items-start text-left p-3.5 rounded-2xl border border-border-light bg-bg-alt hover:bg-card hover:border-primary/25 hover:shadow-xs transition-all group cursor-pointer"
                >
                  <span className="text-2xl mr-3 group-hover:scale-105 transition-transform select-none shrink-0">{p.avatar}</span>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-extrabold text-text-main group-hover:text-primary transition-colors leading-tight">{p.name}</h4>
                    <p className="text-[10px] text-text-muted mt-1 leading-relaxed line-clamp-1">
                      {p.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render listing matches and active filters
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* Left Sidebar Column - Active Params */}
      <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-32">
        <div className="bg-card border border-border-light rounded-3xl p-6 shadow-xs space-y-5 transition-all duration-300">
          <div className="flex items-center justify-between pb-3 border-b border-border-light">
            <h3 className="font-extrabold text-text-main text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors">
              <HomeIcon className="w-4 h-4 text-primary" />
              Match Parameters
            </h3>
            <button
              onClick={resetSearch}
              className="text-[10px] font-black text-primary uppercase hover:underline cursor-pointer transition-colors"
            >
              Reset All
            </button>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="flex justify-between items-center bg-bg-alt p-3 rounded-xl border border-border-light transition-colors">
              <span className="text-text-muted font-bold">Household Type:</span>
              <span className="font-extrabold text-text-main capitalize">{profile.householdType}</span>
            </div>
            
            <div className="flex justify-between items-center bg-bg-alt p-3 rounded-xl border border-border-light transition-colors">
              <span className="text-text-muted font-bold">Monthly Rent Limit:</span>
              <span className="font-extrabold text-text-main">৳{profile.budgetMonthly.toLocaleString()}</span>
            </div>

            <div className="flex justify-between items-center bg-bg-alt p-3 rounded-xl border border-border-light transition-colors">
              <span className="text-text-muted font-bold">Transit Daily Anchor:</span>
              <span className="font-extrabold text-text-main">{profile.commuteAnchors[0]?.area || "Any"}</span>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/portal/wizard"
              className="w-full py-3 px-4 bg-bg-alt hover:bg-bg border border-border-light hover:border-primary/30 text-text-main rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all text-xs font-extrabold"
            >
              <Settings className="w-3.5 h-3.5 text-primary" />
              Edit Criteria Details
            </Link>
          </div>

          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 text-[11px] text-text-main space-y-2 transition-colors">
            <div className="flex items-center gap-1.5 font-bold text-primary">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Matching Intelligence</span>
            </div>
            <p className="text-text-muted leading-relaxed font-medium">
              Found <strong className="text-primary">{highCompatCount} high-compatibility matches</strong> based on your preferences. Adjust sliders or active markers to re-score.
            </p>
          </div>
        </div>

        <div className="bg-card border border-border-light rounded-3xl p-5 shadow-xs flex items-start gap-3 transition-colors duration-300">
          <HelpCircle className="w-5 h-5 text-text-muted shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-text-main">Verify Details</h4>
            <p className="text-[10px] text-text-muted mt-1 leading-relaxed">
              Add compatible apartments to your Shortlist, then head to the <strong>Compare Shortlist</strong> and <strong>Call Scripts & Prep</strong> pages to prepare for calls.
            </p>
          </div>
        </div>
      </div>

      {/* Right Results Column */}
      <div className="lg:col-span-8 space-y-8">
        <AreaRecommendations />
        <ListingGrid />
      </div>

    </div>
  );
}
