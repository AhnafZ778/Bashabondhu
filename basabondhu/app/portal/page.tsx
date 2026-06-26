"use client";

import React, { useState, useCallback } from "react";
import { useSearch } from "@/context/SearchContext";
import AreaRecommendations from "@/components/AreaRecommendations";
import ListingGrid from "@/components/ListingGrid";
import DemoScanAnimation from "@/components/DemoScanAnimation";
import Link from "next/link";
import { Home as HomeIcon, Sparkles, HelpCircle, ArrowRight, Settings } from "lucide-react";
import { personas } from "@/lib/data/personas";
import { listings } from "@/lib/data/listings";
import { SearchProfile } from "@/lib/types";
import { PersonaIcon } from "@/components/PersonaIcons";
import { generateScanSummary } from "@/lib/services/demo-scan.service";

export default function PortalPage() {
  const { profile, planSearch, scoredListings, resetSearch, isSimulating, setIsSimulating } = useSearch();
  const [scanComplete, setScanComplete] = useState(false);

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
    setIsSimulating(true);
    setScanComplete(false);
  };

  const handleScanComplete = useCallback(() => {
    setScanComplete(true);
    setIsSimulating(false);
  }, [setIsSimulating]);

  // If search profile doesn't exist, show a clean onboarding screen with persona quick selectors
  if (!profile) {
    return (
      <div className="space-y-8 animate-fade-in py-4">
        {/* Header Section */}
        <div className="space-y-2 text-center md:text-left">
          <span className="text-[#C9952B] font-sans text-[10px] sm:text-xs uppercase tracking-[0.3em] block font-bold">
            Match Portal
          </span>
          <h2 className="text-3xl sm:text-4xl font-sans uppercase tracking-[0.08em] text-text-main font-black">
            Set Up Your Profile
          </h2>
          <p className="text-xs sm:text-sm text-text-muted max-w-xl leading-relaxed">
            Select a path below to build custom matcher criteria or load a preset renter profile.
          </p>
        </div>

        {/* Asymmetrical Image-Backed Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Option A: Custom Guided Matcher (Spans 2 columns on desktop) */}
          <div className="relative md:col-span-2 h-[320px] rounded-3xl overflow-hidden group shadow-md border border-black/[0.03]">
            {/* Background Image */}
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-103" style={{ backgroundImage: `url('/DhakaImages/highly-populated-dhaka-city-crammed-with-unplanned-buildings-KDCB15.jpg')` }} />
            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            
            {/* Content Overlay */}
            <div className="absolute inset-0 p-8 flex flex-col justify-between items-start text-white">
              <span className="px-2.5 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-[9px] uppercase font-black tracking-widest rounded-md text-[#C9952B]">
                Custom Path
              </span>
              
              <div className="space-y-4 w-full">
                <div className="space-y-1">
                  <h3 className="text-2xl font-sans uppercase tracking-wider font-bold">
                    Guided Matcher
                  </h3>
                  <p className="text-xs text-white/70 max-w-sm font-medium">
                    Customize your rent budget, daily commute hubs, and security rules in 3 steps.
                  </p>
                </div>
                
                <Link
                  href="/portal/wizard"
                  className="inline-flex items-center gap-1.5 px-5 py-3 bg-[#C9952B] hover:bg-[#b08020] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-[0.98] cursor-pointer"
                >
                  Start Guided Matcher
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Rafi & Mita (Demo Couple) */}
          {(() => {
            const p = personas.find(x => x.id === "rafi-mita") || personas[0];
            return (
              <button
                onClick={() => handlePersonaSelect(p)}
                className="relative h-[320px] rounded-3xl overflow-hidden group shadow-md text-left focus:outline-none border border-black/[0.03] cursor-pointer"
              >
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105" style={{ backgroundImage: `url('${p.imageUrl}')` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />
                
                <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
                  <div className="flex justify-between items-start w-full">
                    <span className="px-2 py-0.5 bg-white/15 backdrop-blur-md border border-white/20 text-[8px] font-black tracking-wider uppercase rounded">
                      Couple
                    </span>
                    <div className="w-7 h-7 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#C9952B]">
                      <PersonaIcon iconId={p.iconId} className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="text-base font-sans uppercase tracking-wide font-bold group-hover:text-[#C9952B] transition-colors">
                      {p.name.split(" (")[0]}
                    </h4>
                    <p className="text-[10px] text-[#C9952B] font-bold uppercase tracking-wider">
                      ৳{p.budgetMonthly.toLocaleString()}/mo
                    </p>
                  </div>
                </div>
              </button>
            );
          })()}

          {/* Row 2: 3 demo profiles (Nusrat, Abrar, Haque Family) */}
          {personas.filter(p => ["nusrat-student", "abrar-bachelor", "haque-family"].includes(p.id)).map((p) => {
            const label = p.id === "nusrat-student" ? "Student" : p.id === "abrar-bachelor" ? "Bachelor" : "Family";
            return (
              <button
                key={p.id}
                onClick={() => handlePersonaSelect(p)}
                className="relative h-[280px] rounded-3xl overflow-hidden group shadow-md text-left focus:outline-none border border-black/[0.03] cursor-pointer"
              >
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105" style={{ backgroundImage: `url('${p.imageUrl}')` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />
                
                <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
                  <div className="flex justify-between items-start w-full">
                    <span className="px-2 py-0.5 bg-white/15 backdrop-blur-md border border-white/20 text-[8px] font-black tracking-wider uppercase rounded">
                      {label}
                    </span>
                    <div className="w-7 h-7 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#C9952B]">
                      <PersonaIcon iconId={p.iconId} className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="text-base font-sans uppercase tracking-wide font-bold group-hover:text-[#C9952B] transition-colors">
                      {p.name.split(" (")[0]}
                    </h4>
                    <p className="text-[10px] text-[#C9952B] font-bold uppercase tracking-wider">
                      ৳{p.budgetMonthly.toLocaleString()}/mo
                    </p>
                  </div>
                </div>
              </button>
            );
          })}

          {/* Row 3: Tasnim (Wide banner spanning 3 columns) */}
          {(() => {
            const p = personas.find(x => x.id === "tasnim-woman") || personas[4];
            return (
              <button
                onClick={() => handlePersonaSelect(p)}
                className="relative md:col-span-3 h-[180px] rounded-3xl overflow-hidden group shadow-md text-left focus:outline-none border border-black/[0.03] cursor-pointer"
              >
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-103" style={{ backgroundImage: `url('${p.imageUrl}')` }} />
                <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-transparent" />
                
                <div className="absolute inset-0 p-8 flex flex-col justify-between text-white md:flex-row md:items-end">
                  <div className="space-y-3">
                    <span className="inline-block px-2 py-0.5 bg-white/15 backdrop-blur-md border border-white/20 text-[8px] font-black tracking-wider uppercase rounded">
                      Executive
                    </span>
                    <div className="space-y-1">
                      <h4 className="text-lg md:text-xl font-sans uppercase tracking-wide font-bold group-hover:text-[#C9952B] transition-colors">
                        {p.name.split(" (")[0]}
                      </h4>
                      <p className="text-[10px] text-[#C9952B] font-bold uppercase tracking-wider">
                        ৳{p.budgetMonthly.toLocaleString()}/mo
                      </p>
                    </div>
                  </div>
                  
                  <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#C9952B] shrink-0 mt-3 md:mt-0">
                    <PersonaIcon iconId={p.iconId} className="w-4 h-4" />
                  </div>
                </div>
              </button>
            );
          })()}
        </div>
      </div>
    );
  }

  // Show scan animation after profile is set
  if (profile && isSimulating) {
    const scanSummary = generateScanSummary(scoredListings, profile);
    return (
      <DemoScanAnimation
        scanSummary={scanSummary}
        profile={profile}
        listings={scoredListings}
        onComplete={handleScanComplete}
      />
    );
  }

  // Render listing matches and active filters
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* Left Sidebar Column - Active Params */}
      <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-32">
        <div className="bg-card border border-border-light rounded-3xl p-6 shadow-xs space-y-5 transition-all duration-300">
          <div className="flex items-center justify-between pb-3 border-b border-border-light">
            <h3 className="font-bold text-text-main text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors">
              <HomeIcon className="w-3.5 h-3.5 text-[#C9952B]" />
              Renter Criteria
            </h3>
            <button
              onClick={resetSearch}
              className="text-[9px] font-black text-[#C9952B] uppercase tracking-wider hover:underline cursor-pointer transition-colors"
            >
              Reset All
            </button>
          </div>

          <div className="space-y-1 text-xs divide-y divide-black/[0.04]">
            <div className="flex justify-between items-center py-2.5 transition-colors">
              <span className="text-text-muted font-medium">Household:</span>
              <span className="font-bold text-text-main capitalize">{profile.householdType}</span>
            </div>
            
            <div className="flex justify-between items-center py-2.5 transition-colors">
              <span className="text-text-muted font-medium">Budget Limit:</span>
              <span className="font-bold text-text-main">৳{profile.budgetMonthly.toLocaleString()}</span>
            </div>

            <div className="flex justify-between items-center py-2.5 transition-colors">
              <span className="text-text-muted font-medium">Transit Hub:</span>
              <span className="font-bold text-text-main">{profile.commuteAnchors[0]?.area || "Any"}</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <Link
              href="/portal/wizard"
              className="w-full py-2.5 px-4 bg-transparent hover:bg-bg border border-border-light hover:border-[#C9952B]/40 text-text-main rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all text-[10px] font-black uppercase tracking-wider"
            >
              <Settings className="w-3.5 h-3.5 text-[#C9952B]" />
              Modify Profile
            </Link>

            <div className="bg-[#C9952B]/5 border border-[#C9952B]/10 rounded-xl p-3 text-[10px] text-text-muted flex items-center justify-between transition-colors">
              <span className="font-bold text-[#C9952B] uppercase tracking-wider">Scored Matches</span>
              <span className="bg-[#C9952B] text-white px-2 py-0.5 rounded font-black text-[9px]">{highCompatCount} Homes</span>
            </div>
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
