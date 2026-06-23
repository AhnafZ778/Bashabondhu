"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSearch } from "@/context/SearchContext";
import { personas } from "@/lib/data/personas";
import { 
  Search, 
  Clipboard, 
  Sparkles, 
  Check, 
  Droplets, 
  Flame, 
  Coins, 
  Lock, 
  Layers,
  ChevronRight,
  ArrowRight,
  MapPin,
  Users,
  Wallet
} from "lucide-react";
import { SearchProfile, HouseholdType } from "@/lib/types";
import ModeSelector from "./ModeSelector";

const DHAKA_AREAS = [
  "Banani", "Gulshan", "Banasree", "Badda", "Mohakhali", "Tejgaon", 
  "Mohammadpur", "Lalmatia", "Mirpur", "Uttara", "Bashundhara", "Dhanmondi"
];

const BUDGET_OPTIONS = [
  { value: 15000, label: "৳15,000 / month" },
  { value: 25000, label: "৳25,000 / month" },
  { value: 35000, label: "৳35,000 / month" },
  { value: 45000, label: "৳45,000 / month" },
  { value: 60000, label: "৳60,000+ / month" }
];

const HOUSEHOLD_OPTIONS: { value: HouseholdType; label: string }[] = [
  { value: "family", label: "Family" },
  { value: "couple", label: "Married Couple" },
  { value: "bachelor", label: "Bachelor Group" },
  { value: "student", label: "Student" },
  { value: "working-woman", label: "Working Woman" }
];

export default function LandingPage() {
  const { planSearch } = useSearch();
  const router = useRouter();

  // Search widget local states
  const [selectedHousehold, setSelectedHousehold] = useState<HouseholdType>("family");
  const [selectedArea, setSelectedArea] = useState<string>("Banani");
  const [selectedBudget, setSelectedBudget] = useState<number>(25000);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Infer lookingFor type
    const lookingFor = (selectedHousehold === "student" || selectedHousehold === "working-woman")
      ? "room-sublet"
      : "full-flat";

    // Build profile matching options
    const profile: SearchProfile = {
      id: "custom-search",
      mode: "plan",
      rentingOrBuying: "renting",
      householdType: selectedHousehold,
      lookingFor,
      budgetMonthly: selectedBudget,
      maxFirstMonthCash: selectedBudget * 3, // reasonable estimate
      commuteAnchors: [{ label: "Work/School", area: selectedArea }],
      priorities: ["commute", "rent"],
      dealBreakers: []
    };

    planSearch(profile);
    router.push("/portal");
  };

  const handlePersonaSelect = (p: typeof personas[0]) => {
    const profile: SearchProfile = {
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
    planSearch(profile);
    router.push("/portal");
  };

  return (
    <div className="flex-1 flex flex-col transition-colors duration-300">

      {/* ══════════════════════════════════════════════════
          HERO — Solid, full-width theme-integrated background
          ══════════════════════════════════════════════════ */}
      <section className="relative min-h-[700px] border-b border-border-light text-text-main flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/landing.jpeg" 
            alt="BasaBondhu Hero Background" 
            className="w-full h-full object-cover" 
          />
        </div>

        {/* Solid Content Card Overlay (Left-aligned, utilizing space beautifully) */}
        <div className="relative z-10 w-full px-6 sm:px-10 lg:px-16 xl:px-24 py-16">
          <div className="max-w-2xl bg-white border border-border-light p-8 sm:p-10 rounded-3xl shadow-xl space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-[10px] font-extrabold uppercase tracking-widest text-primary">
              <Sparkles className="w-3.5 h-3.5" />
              Dhaka House-Hunting, Simplified
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1]">
              From messy listings to{" "}
              <span className="text-primary">3 homes worth visiting.</span>
            </h1>

            <p className="text-text-muted text-sm sm:text-base leading-relaxed">
              Tired of scrolling endless Facebook groups, calling bad brokers, and facing surprise landlord curfews? BasaBondhu filters out Dhaka rent traps instantly.
            </p>

            {/* Trivago-Style Search Widget - Stacked inside the floating card */}
            <form 
              onSubmit={handleSearchSubmit} 
              className="space-y-3 w-full"
            >
              {/* Dropdown 1: Area */}
              <div className="flex items-center gap-2.5 px-3 py-2 bg-bg-alt rounded-xl border border-border-light hover:border-border-hover transition-colors">
                <MapPin className="w-5 h-5 text-text-muted shrink-0" />
                <div className="flex-1 text-left min-w-0">
                  <label className="block text-[9px] uppercase tracking-wider font-extrabold text-text-muted">Where do you live/work?</label>
                  <select 
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                    className="block w-full text-xs font-bold text-text-main bg-transparent border-0 p-0 focus:ring-0 focus:outline-hidden"
                  >
                    {DHAKA_AREAS.map(area => (
                      <option key={area} value={area} className="bg-card text-text-main font-bold">{area}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Dropdown 2: Household Type */}
                <div className="flex items-center gap-2.5 px-3 py-2 bg-bg-alt rounded-xl border border-border-light hover:border-border-hover transition-colors">
                  <Users className="w-5 h-5 text-text-muted shrink-0" />
                  <div className="flex-1 text-left min-w-0">
                    <label className="block text-[9px] uppercase tracking-wider font-extrabold text-text-muted">Who is shifting?</label>
                    <select 
                      value={selectedHousehold}
                      onChange={(e) => setSelectedHousehold(e.target.value as HouseholdType)}
                      className="block w-full text-xs font-bold text-text-main bg-transparent border-0 p-0 focus:ring-0 focus:outline-hidden"
                    >
                      {HOUSEHOLD_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value} className="bg-card text-text-main font-bold">{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Dropdown 3: Budget */}
                <div className="flex items-center gap-2.5 px-3 py-2 bg-bg-alt rounded-xl border border-border-light hover:border-border-hover transition-colors">
                  <Wallet className="w-5 h-5 text-text-muted shrink-0" />
                  <div className="flex-1 text-left min-w-0">
                    <label className="block text-[9px] uppercase tracking-wider font-extrabold text-text-muted">Monthly Budget</label>
                    <select 
                      value={selectedBudget}
                      onChange={(e) => setSelectedBudget(parseInt(e.target.value))}
                      className="block w-full text-xs font-bold text-text-main bg-transparent border-0 p-0 focus:ring-0 focus:outline-hidden"
                    >
                      {BUDGET_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value} className="bg-card text-text-main font-bold">{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Search button */}
              <button
                type="submit"
                className="w-full py-3.5 bg-primary hover:bg-secondary text-white font-black text-xs tracking-wider rounded-xl uppercase shadow-md shadow-primary/10 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
              >
                <Search className="w-4 h-4" />
                Find My Match
              </button>
            </form>

            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-text-muted pt-4 border-t border-border-light">
              <span>Or analyze custom text:</span>
              <button
                onClick={() => {
                  router.push("/portal/parser");
                }}
                className="px-4 py-2 bg-bg-alt hover:bg-card border border-border-light hover:border-primary/30 text-text-main rounded-xl flex items-center gap-2 cursor-pointer transition-all"
              >
                <Clipboard className="w-3.5 h-3.5 text-primary" />
                Paste a Facebook Listing Ad
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          PAIN POINTS — Full-width, left-aligned heading
          ══════════════════════════════════════════════════ */}
      <section className="bg-bg-alt py-16 px-6 sm:px-10 lg:px-16 xl:px-24 transition-colors duration-300">
        <div className="mb-10">
          <span className="px-3 py-1 bg-primary/8 border border-primary/12 text-primary text-[10px] uppercase font-black tracking-widest rounded-full">
            The Real Problem
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-text-main tracking-tight mt-4">
            Every renter in Dhaka faces the same traps
          </h2>
          <p className="text-sm text-text-muted mt-2 max-w-2xl leading-relaxed">
            Listings are everywhere. The hard part is knowing what you&apos;ll actually pay, what the landlord won&apos;t tell you, and whether the road floods in July.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { icon: Coins, title: "Upfront Cash Trap", desc: "Advertised ৳22k rent. Real day-one cost: ৳87k after advance, service charge, broker fee, and movers.", color: "#D1523F" },
            { icon: Droplets, title: "Waterlogging Risk", desc: "Banasree Block D looks perfect in December. In July, the road is knee-deep. We flag flood-prone zones.", color: "#3B82F6" },
            { icon: Flame, title: "Gas Line Lies", desc: "\"Gas available\" often means cylinder gas — ৳1,500/month extra. We verify the actual connection type.", color: "#F59E0B" },
            { icon: Lock, title: "Curfews & Rules", desc: "Bachelors face 11 PM gate locks and no-guest policies. Families want secure compounds. We match rules to lifestyle.", color: "#8B5CF6" },
          ].map((item, i) => (
            <div key={i} className="bg-card border border-border-light rounded-xl p-5 hover:shadow-md transition-all duration-200 space-y-3 group">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${item.color}14`, border: `1px solid ${item.color}22` }}
              >
                <item.icon className="w-5 h-5" style={{ color: item.color }} />
              </div>
              <h3 className="font-extrabold text-text-main text-sm">{item.title}</h3>
              <p className="text-xs text-text-muted leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          MODE SELECTOR — What do you want to do today?
          ══════════════════════════════════════════════════ */}
      <section className="bg-card border-y border-border-light py-16 px-6 sm:px-10 lg:px-16 xl:px-24 transition-colors duration-300">
        <div className="mb-10">
          <span className="px-3 py-1 bg-primary/8 border border-primary/12 text-primary text-[10px] uppercase font-black tracking-widest rounded-full">
            Choose Your Path
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-text-main tracking-tight mt-4">
            What do you want to do today?
          </h2>
          <p className="text-sm text-text-muted mt-2 max-w-2xl leading-relaxed">
            Each mode gives you a different kind of help — from planning your search to preparing for a flat visit.
          </p>
        </div>
        <ModeSelector />
      </section>

      {/* ══════════════════════════════════════════════════
          PERSONA QUICK-START — Full width grid
          ══════════════════════════════════════════════════ */}
      <section className="bg-bg-alt py-16 px-6 sm:px-10 lg:px-16 xl:px-24 transition-colors duration-300">
        <div className="mb-10">
          <span className="px-3 py-1 bg-primary/8 border border-primary/12 text-primary text-[10px] uppercase font-black tracking-widest rounded-full">
            Try it Now
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-text-main tracking-tight mt-4">
            Pick your situation
          </h2>
          <p className="text-sm text-text-muted mt-2 max-w-2xl leading-relaxed">
            Select a persona to see instant matching results, cost breakdowns, and call scripts — no signup needed.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {personas.map((p) => (
            <button
              key={p.id}
              onClick={() => handlePersonaSelect(p)}
              className="flex items-start text-left p-4 rounded-xl border border-border-light bg-bg-alt hover:bg-bg hover:border-primary/25 hover:shadow-md transition-all duration-200 group cursor-pointer"
            >
              <span className="text-2xl mr-3 group-hover:scale-110 transition-transform select-none shrink-0">{p.avatar}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-extrabold text-text-main group-hover:text-primary transition-colors leading-tight">{p.name}</h4>
                  <ChevronRight className="w-3.5 h-3.5 text-text-muted group-hover:text-primary shrink-0 mt-0.5 transition-colors" />
                </div>
                <p className="text-[9px] uppercase tracking-wider font-bold text-text-muted mt-0.5">
                  {p.householdType} • ৳{p.budgetMonthly.toLocaleString()}/mo
                </p>
                <p className="text-[11px] text-text-muted mt-1.5 leading-relaxed line-clamp-2">
                  {p.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          COMPARISON — Full width two-column
          ══════════════════════════════════════════════════ */}
      <section className="bg-bg-alt py-16 px-6 sm:px-10 lg:px-16 xl:px-24 transition-colors duration-300">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 space-y-4">
            <span className="px-3 py-1 bg-primary/8 border border-primary/12 text-primary text-[10px] uppercase font-black tracking-widest rounded-full">
              How We&apos;re Different
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-text-main tracking-tight leading-tight mt-4">
              3 steps to protect your weekend and wallet
            </h2>
            <p className="text-sm text-text-muted leading-relaxed">
              Don&apos;t call landlords blind. Query, filter, verify — then visit only 2 or 3 places.
            </p>
            
            <div className="space-y-4 pt-2">
              {[
                { n: "1", title: "Define Lifestyle Needs", desc: "Budget, commute, waterlogging tolerance, gas requirements." },
                { n: "2", title: "Paste & Parse Listings", desc: "Paste a Facebook ad. We extract rent, service charge, and score it." },
                { n: "3", title: "Verify Before Visiting", desc: "Use custom phone scripts to ask landlords hard questions first." },
              ].map((step) => (
                <div key={step.n} className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary text-white font-extrabold text-xs flex items-center justify-center shrink-0">{step.n}</div>
                  <div>
                    <h4 className="font-extrabold text-sm text-text-main">{step.title}</h4>
                    <p className="text-xs text-text-muted mt-0.5 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-8 bg-card border border-border-light rounded-xl p-5 sm:p-6 shadow-sm transition-colors duration-300">
            <h3 className="font-extrabold text-sm text-text-main mb-5 flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" />
              BasaBondhu vs Typical Portals
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border-light text-text-muted font-bold uppercase tracking-wider text-[10px]">
                    <th className="pb-3 pr-4">Feature</th>
                    <th className="pb-3 px-4 text-text-muted/50">Others</th>
                    <th className="pb-3 pl-4 text-primary font-black">BasaBondhu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light">
                  {[
                    { field: "Search Filters", others: "Price, bedrooms — that's it.", us: "Waterlogging, gas type, curfew rules, commute hubs." },
                    { field: "Messy Ad Parsing", others: "Cannot handle unstructured text.", us: "Gemini AI parses Facebook posts and extracts data." },
                    { field: "Upfront Cost", others: "Shows monthly rent only.", us: "Calculates real day-one shifting cash including deposit." },
                    { field: "Landlord Prep", others: "None. You call blind.", us: "Custom Banglish phone scripts for every listing." },
                  ].map((row, i) => (
                    <tr key={i}>
                      <td className="py-3 pr-4 font-bold text-text-main">{row.field}</td>
                      <td className="py-3 px-4 text-text-muted">{row.others}</td>
                      <td className="py-3 pl-4 font-bold text-primary">
                        <span className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 shrink-0" />
                          {row.us}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          CTA — Solid Theme-Integrated Background
          ══════════════════════════════════════════════════ */}
      <section className="bg-bg border-t border-border-light text-text-main py-14 px-6 sm:px-10 lg:px-16 xl:px-24">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              Stop wasting weekends on bad apartments
            </h2>
            <p className="text-text-muted text-sm mt-2 max-w-xl leading-relaxed">
              Parse confusing listings, calculate real costs, verify details with landlords — all before you leave your chair.
            </p>
          </div>
          <button
            onClick={() => {
              router.push("/portal");
            }}
            className="px-7 py-4 bg-primary hover:bg-secondary text-white font-black text-sm tracking-wider rounded-xl uppercase active:scale-[0.97] transition-all shadow-lg shadow-primary/20 flex items-center gap-2 cursor-pointer shrink-0"
          >
            Get Started Free
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
