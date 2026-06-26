"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearch } from "@/context/SearchContext";
import { personas } from "@/lib/data/personas";
import { SearchProfile, HouseholdType, Priority, DealBreaker } from "@/lib/types";
import { ArrowRight, ArrowLeft, Check, Sparkles, Info, Lightbulb, Home, Heart, Users, GraduationCap, Shield, MapPin, Wallet } from "lucide-react";
import { PersonaIcon } from "./PersonaIcons";

const HOUSEHOLD_OPTIONS: { value: HouseholdType; label: string; desc: string; iconId: string }[] = [
  { value: "family", label: "Family", desc: "Moving with children, parents or elders.", iconId: "family" },
  { value: "couple", label: "Married Couple", desc: "Just the two of you shifting.", iconId: "couple" },
  { value: "bachelor", label: "Bachelor Group", desc: "Job holders sharing a flat.", iconId: "professional" },
  { value: "student", label: "Student", desc: "Looking for sublet room or shared house.", iconId: "student" },
  { value: "working-woman", label: "Working Woman", desc: "Seeking secure, female-friendly space.", iconId: "executive" }
];

const PRIORITIES_OPTIONS: { value: Priority; label: string }[] = [
  { value: "commute", label: "Short Commute" },
  { value: "rent", label: "Lowest Rent" },
  { value: "safety", label: "24/7 Security" },
  { value: "gas", label: "Line Gas (Titas)" },
  { value: "lift", label: "Lift Facility" },
  { value: "generator", label: "Generator Backup" },
  { value: "no-waterlogging", label: "Zero Flooding Road" },
  { value: "family-friendly", label: "Family Friendly Area" },
  { value: "bachelor-friendly", label: "Bachelor Friendly Area" }
];

const DEAL_BREAKERS_OPTIONS: { value: DealBreaker; label: string; desc: string }[] = [
  { value: "broker", label: "No Brokers", desc: "Direct owners only — filter broker posts." },
  { value: "high-advance", label: "Low Advance", desc: "Max 1-2 months deposit upfront." },
  { value: "family-only", label: "Bachelor Welcomed", desc: "Filter out strict 'family-only' landlords." },
  { value: "no-lift", label: "Must Have Lift", desc: "Exclude buildings without lift access." },
  { value: "no-gas", label: "Must Have Line Gas", desc: "Exclude cylinder gas connections." },
  { value: "heavy-waterlogging", label: "Zero Waterlogging", desc: "Exclude areas notorious for flooding." }
];

const DHAKA_AREAS = [
  "Banani", "Gulshan", "Banasree", "Badda", "Merul Badda", "Mohakhali", "Tejgaon", 
  "Mohammadpur", "Lalmatia", "Mirpur", "Uttara", "Bashundhara", "Dhanmondi"
];

export default function Wizard() {
  const router = useRouter();
  const { planSearch, setIsSimulating } = useSearch();
  const [step, setStep] = useState(0);

  // Form State
  const [householdType, setHouseholdType] = useState<HouseholdType>("family");
  const [lookingFor, setLookingFor] = useState<"full-flat" | "room-sublet">("full-flat");
  const [budgetMonthly, setBudgetMonthly] = useState<number>(25000);
  const [maxFirstMonthCash, setMaxFirstMonthCash] = useState<number>(70000);
  const [commuteAnchor, setCommuteAnchor] = useState<string>("Banani");
  const [priorities, setPriorities] = useState<Priority[]>(["commute"]);
  const [dealBreakers, setDealBreakers] = useState<DealBreaker[]>([]);

  // Load from URL query parameters if present (for Facebook Fetcher integration)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const qArea = params.get("area");
      const qRent = params.get("rent");
      const qHousehold = params.get("household");
      const qLift = params.get("lift");
      const qGenerator = params.get("generator");
      const qGas = params.get("gasType");
      const qTenant = params.get("tenantPreference");

      if (qArea) {
        // Validate if area is in the list (case insensitive or direct matching)
        const matchedArea = DHAKA_AREAS.find(a => a.toLowerCase() === qArea.toLowerCase());
        if (matchedArea) setCommuteAnchor(matchedArea);
      }
      if (qRent) {
        const rentNum = parseInt(qRent);
        if (!isNaN(rentNum)) {
          setBudgetMonthly(rentNum);
          setMaxFirstMonthCash(rentNum * 2.5); // set fallback max first month cash (usually rent + 1.5 months advance)
        }
      }
      if (qHousehold) {
        const hType = qHousehold.toLowerCase();
        if (["family", "couple", "bachelor", "student", "working-woman"].includes(hType)) {
          setHouseholdType(hType as HouseholdType);
        }
      } else if (qTenant) {
        const tPref = qTenant.toLowerCase();
        if (tPref === "bachelor") setHouseholdType("bachelor");
        else if (tPref === "student") setHouseholdType("student");
        else if (tPref === "female") setHouseholdType("working-woman");
        else setHouseholdType("family");
      }
      
      const newPriorities: Priority[] = ["commute"];
      if (qLift === "true") newPriorities.push("lift");
      if (qGenerator === "true") newPriorities.push("generator");
      if (qGas === "line") newPriorities.push("gas");
      setPriorities(newPriorities);
    }
  }, []);

  // Prepopulate using a demo persona
  const selectPersona = (p: typeof personas[0]) => {
    setHouseholdType(p.householdType);
    setLookingFor(p.lookingFor as "full-flat" | "room-sublet");
    setBudgetMonthly(p.budgetMonthly);
    setMaxFirstMonthCash(p.maxFirstMonthCash);
    if (p.commuteAnchors.length > 0) {
      setCommuteAnchor(p.commuteAnchors[0].area);
    }
    setPriorities(p.priorities);
    setDealBreakers(p.dealBreakers);
    
    // Auto submit to make demo quick
    const profile: SearchProfile = {
      id: "custom",
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
    setIsSimulating(true);
    router.push("/portal");
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(prev => prev + 1);
    } else {
      // Submit form
      const profile: SearchProfile = {
        id: "custom",
        mode: "plan",
        rentingOrBuying: "renting",
        householdType,
        lookingFor,
        budgetMonthly,
        maxFirstMonthCash,
        commuteAnchors: [{ label: "Work/School", area: commuteAnchor }],
        priorities,
        dealBreakers
      };
      planSearch(profile);
      setIsSimulating(true);
      router.push("/portal");
    }
  };

  const handleBack = () => {
    setStep(prev => Math.max(0, prev - 1));
  };

  const togglePriority = (val: Priority) => {
    setPriorities(prev => 
      prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]
    );
  };

  const toggleDealBreaker = (val: DealBreaker) => {
    setDealBreakers(prev => 
      prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]
    );
  };

  return (
    <div className="w-full transition-colors duration-300">
      {/* Persona Quick Selectors */}
      {step === 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-1.5 mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">Quick Demo Personas</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {personas.slice(0, 4).map((p) => (
              <button
                key={p.id}
                onClick={() => selectPersona(p)}
                className="flex items-start text-left p-4 rounded-2xl border border-border-light bg-card hover:border-primary/45 hover:shadow-md transition-all group cursor-pointer"
              >
                <div className="w-10 h-10 mr-3.5 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                  <PersonaIcon iconId={p.iconId} className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[17px] font-extrabold text-primary group-hover:text-secondary transition-colors truncate">{p.name}</h4>
                  
                  <div className="mt-3 grid grid-cols-2 gap-y-2.5 gap-x-3 text-[14px]">
                    <div className="flex items-center text-text-muted">
                      <Home className="w-[18px] h-[18px] mr-2 shrink-0 opacity-70" />
                      <span className="truncate">{p.lookingFor === 'full-flat' ? 'Full Flat' : 'Room/Sublet'}</span>
                    </div>
                    <div className="flex items-center text-text-muted">
                      <Wallet className="w-[18px] h-[18px] mr-2 shrink-0 opacity-70" />
                      <span className="truncate font-semibold">৳{p.budgetMonthly.toLocaleString()}</span>
                    </div>
                    {p.commuteAnchors.length > 0 && (
                      <div className="flex items-center text-text-muted col-span-2">
                        <MapPin className="w-[18px] h-[18px] mr-2 shrink-0 opacity-70 text-rose-500" />
                        <span className="truncate">Target: <span className="font-medium text-text-main">{p.commuteAnchors[0].area}</span></span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    {p.priorities.slice(0, 2).map(priority => (
                      <span key={priority} className="text-[11px] px-2.5 py-1.5 rounded-md bg-emerald-600 text-white font-bold uppercase tracking-wider shadow-sm">
                        {priority.replace(/-/g, ' ')}
                      </span>
                    ))}
                    {p.dealBreakers.slice(0, 1).map(db => (
                      <span key={db} className="text-[11px] px-2.5 py-1.5 rounded-md bg-rose-600 text-white font-bold uppercase tracking-wider shadow-sm">
                        NO {db.replace(/-/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-4 p-3 bg-primary/5 rounded-xl border border-primary/10 text-xs text-primary">
            <Info className="w-4 h-4 shrink-0 text-primary" />
            <span className="font-medium text-text-main">Select a persona to instantly run the demo, or configure manually below.</span>
          </div>
        </div>
      )}

      {/* Main Guided Form */}
      <div className="bg-card border border-border-light rounded-3xl p-6 sm:p-8 shadow-sm transition-all duration-300">
        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-8">
          {[0, 1, 2, 3].map((s) => (
            <div key={s} className="flex-1 flex items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-colors ${
                  step >= s ? "bg-primary text-white" : "bg-primary/10 text-primary/40"
                }`}
              >
                {s + 1}
              </div>
              {s < 3 && (
                <div
                  className={`flex-1 h-1 mx-2 rounded-full transition-colors ${
                    step > s ? "bg-primary" : "bg-primary/10"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Contents */}
        {step === 0 && (
          <div>
            <h2 className="text-xl font-black text-text-main mb-1 transition-colors">Who is shifting?</h2>
            <p className="text-sm text-text-muted mb-6 transition-colors">Select your household structure to filter compatible landlord rules.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {HOUSEHOLD_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setHouseholdType(opt.value)}
                  className={`flex items-start p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    householdType === opt.value
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border-light hover:border-primary/30"
                  }`}
                >
                  <div className="w-9 h-9 mr-3 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <PersonaIcon iconId={opt.iconId} className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-text-main">{opt.label}</h4>
                    <p className="text-xs text-text-muted mt-0.5">{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-8 border-t border-border-light pt-6">
              <h3 className="font-bold text-sm text-text-main mb-3 transition-colors">Looking for:</h3>
              <div className="flex gap-4">
                <button
                  onClick={() => setLookingFor("full-flat")}
                  className={`flex-1 py-3 px-4 rounded-xl border text-center font-bold text-sm transition-all cursor-pointer ${
                    lookingFor === "full-flat"
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border-light hover:border-primary/30 text-text-muted"
                  }`}
                >
                  Entire Flat / Apartment
                </button>
                <button
                  onClick={() => setLookingFor("room-sublet")}
                  className={`flex-1 py-3 px-4 rounded-xl border text-center font-bold text-sm transition-all cursor-pointer ${
                    lookingFor === "room-sublet"
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border-light hover:border-primary/30 text-text-muted"
                  }`}
                >
                  Single Room / Sublet
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="text-xl font-black text-text-main mb-1 transition-colors">Define your budget</h2>
            <p className="text-sm text-text-muted mb-6 transition-colors">Enter monthly rent limits and the total cash you can afford upfront.</p>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-bold text-text-main">Monthly Rent Budget</label>
                  <span className="text-sm font-extrabold text-primary">৳{budgetMonthly.toLocaleString()} / month</span>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="60000"
                  step="1000"
                  value={budgetMonthly}
                  onChange={(e) => setBudgetMonthly(parseInt(e.target.value))}
                  className="w-full h-2 bg-primary/10 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-[10px] text-text-muted mt-1">
                  <span>৳10,000</span>
                  <span>৳30,000</span>
                  <span>৳60,000+</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-bold text-text-main">Max Cash Ready (First Month)</label>
                  <span className="text-sm font-extrabold text-primary">৳{maxFirstMonthCash.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="20000"
                  max="200000"
                  step="5000"
                  value={maxFirstMonthCash}
                  onChange={(e) => setMaxFirstMonthCash(parseInt(e.target.value))}
                  className="w-full h-2 bg-primary/10 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-[10px] text-text-muted mt-1">
                  <span>৳20,000 (Sublets)</span>
                  <span>৳100,000 (Average)</span>
                  <span>৳200,000 (Premium)</span>
                </div>
                <p className="text-[11px] text-text-muted mt-2 italic flex items-start gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
                  <span>This covers 1st month rent + 2 months advance + service charges + moving cost.</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-xl font-black text-text-main mb-1 transition-colors">Where is your daily anchor?</h2>
            <p className="text-sm text-text-muted mb-6 transition-colors">Select where you work or study to compute commute travel compatibilities.</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {DHAKA_AREAS.map((area) => (
                <button
                  key={area}
                  onClick={() => setCommuteAnchor(area)}
                  className={`py-3 px-4 rounded-xl border text-center font-bold text-sm transition-all cursor-pointer ${
                    commuteAnchor === area
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border-light hover:border-primary/30 text-text-main"
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-xl font-black text-text-main mb-1 transition-colors">Set Priorities & Deal-Breakers</h2>
            <p className="text-sm text-text-muted mb-6 transition-colors">We will flag warning notices on listings violating these conditions.</p>

            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3">Your Top Priorities</h3>
                <div className="flex flex-wrap gap-2">
                  {PRIORITIES_OPTIONS.map((opt) => {
                    const isSelected = priorities.includes(opt.value);
                    return (
                      <button
                        key={opt.value}
                        onClick={() => togglePriority(opt.value)}
                        className={`flex items-center gap-1 px-3 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? "bg-primary border-primary text-white"
                            : "bg-card border-border-light text-text-main hover:border-primary/30"
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3">Hard Deal-Breakers (Instantly Excludes)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {DEAL_BREAKERS_OPTIONS.map((opt) => {
                    const isSelected = dealBreakers.includes(opt.value);
                    return (
                      <button
                        key={opt.value}
                        onClick={() => toggleDealBreaker(opt.value)}
                        className={`flex items-start p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? "border-rose-500 bg-rose-500/5 ring-1 ring-rose-500"
                            : "border-border-light hover:border-primary/30"
                        }`}
                      >
                        <div className={`w-4 h-4 rounded mt-0.5 mr-2.5 flex items-center justify-center border ${
                          isSelected ? "border-rose-500 bg-rose-500 text-white" : "border-border-light bg-card"
                        }`}>
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-text-main">{opt.label}</h4>
                          <p className="text-[10px] text-text-muted mt-0.5">{opt.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-border-light">
          <button
            onClick={handleBack}
            disabled={step === 0}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold rounded-xl transition-all cursor-pointer ${
              step === 0
                ? "text-text-muted/40 cursor-not-allowed"
                : "text-text-main hover:bg-primary/5"
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-secondary shadow-md shadow-primary/10 active:scale-[0.98] transition-all cursor-pointer"
          >
            {step === 3 ? "Find My 3 Homes" : "Continue"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
