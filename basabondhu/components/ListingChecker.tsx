"use client";

import React, { useState } from "react";
import { useSearch } from "@/context/SearchContext";
import { parseMessyListing } from "@/lib/parser";
import { messyExamples } from "@/lib/data/messy-examples";
import { scoreListing } from "@/lib/scoring";
import { ParsedListing, ScoredListing, Listing } from "@/lib/types";
import { calculateFirstMonthCost } from "@/lib/cost-calculator";
import { 
  Clipboard, 
  AlertTriangle, 
  HelpCircle, 
  CheckCircle2, 
  Play, 
  Sparkles, 
  Copy, 
  Check,
  Phone
} from "lucide-react";

export default function ListingChecker() {
  const { profile } = useSearch();
  const [rawText, setRawText] = useState("");
  const [parsed, setParsed] = useState<ParsedListing | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState(false);
  
  // Custom manual overrides for parsed values
  const [overrideRent, setOverrideRent] = useState<number>(0);
  const [overrideAdvance, setOverrideAdvance] = useState<number>(0);
  const [overrideServiceCharge, setOverrideServiceCharge] = useState<number>(0);
  const [overrideBrokerFee, setOverrideBrokerFee] = useState<number>(0);

  const updateTextAndParse = (text: string) => {
    setRawText(text);
    if (!text.trim()) {
      setParsed(null);
      setApiError(null);
      return;
    }
    const result = parseMessyListing(text);
    setParsed(result);
    
    // Set initial override defaults from parsed values
    setOverrideRent(result.rent ?? 20000);
    setOverrideAdvance(result.advanceMonths ?? 1);
    
    const scNum = result.serviceCharge ? parseInt(result.serviceCharge.replace(/\D/g, "")) : 0;
    setOverrideServiceCharge(isNaN(scNum) ? 2000 : scNum);
    
    const bfNum = result.brokerFee && result.brokerFee !== "no-fee" ? 10000 : 0;
    setOverrideBrokerFee(bfNum);
  };

  const handleAIParse = async () => {
    if (!rawText.trim()) return;
    setIsParsing(true);
    setApiError(null);
    try {
      const res = await fetch("/api/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: rawText })
      });
      const data = await res.json();
      if (data.fallback || data.error) {
        setApiError(data.error || "Fell back to local parser.");
      } else {
        setParsed(data);
        setOverrideRent(data.rent ?? 20000);
        setOverrideAdvance(data.advanceMonths ?? 1);
        const scNum = data.serviceCharge ? parseInt(data.serviceCharge.replace(/\D/g, "")) : 0;
        setOverrideServiceCharge(isNaN(scNum) ? 2000 : scNum);
        const bfNum = data.brokerFee && data.brokerFee !== "no-fee" ? 10000 : 0;
        setOverrideBrokerFee(bfNum);
      }
    } catch {
      setApiError("Network error. Using local regex parser instead.");
    } finally {
      setIsParsing(false);
    }
  };

  const loadExample = (text: string) => {
    updateTextAndParse(text);
  };

  const handleCopyScript = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const getVerdictLabel = (verdict: string) => {
    switch (verdict) {
      case "visit": return "Visit Worthy";
      case "maybe": return "Verify First";
      case "call-first": return "Call Landlord First";
      case "avoid": return "Avoid / Mismatch";
      default: return verdict;
    }
  };

  // Convert parsed result + overrides into a Listing object to calculate scores and costs
  const getSimulatedListing = (): Listing => {
    if (!parsed) {
      throw new Error("No parsed data");
    }

    return {
      id: "simulated-checker",
      title: parsed.area ? `${parsed.area} Messy Listing` : "Pasted Listing Room",
      rawText: rawText,
      sourceType: overrideBrokerFee > 0 ? "broker" : "direct",
      area: parsed.area ?? "Banasree",
      addressHint: "Pasted location info",
      city: "Dhaka",
      latitude: 23.75,
      longitude: 90.40,
      rent: overrideRent,
      bedrooms: parsed.bedrooms ?? 2,
      bathrooms: parsed.bathrooms ?? 2,
      tenantPreference: (parsed.tenantPreference as "family" | "bachelor" | "student" | "female" | "any" | "unknown") ?? "any",
      familyAllowed: parsed.tenantPreference === "family" || parsed.tenantPreference === "any",
      bachelorAllowed: parsed.tenantPreference === "bachelor" || parsed.tenantPreference === "any",
      femaleFriendly: parsed.tenantPreference === "female" || parsed.tenantPreference === "any",
      studentFriendly: parsed.tenantPreference === "student" || parsed.tenantPreference === "any",
      advanceMonths: overrideAdvance,
      brokerFee: overrideBrokerFee,
      serviceCharge: overrideServiceCharge,
      serviceChargeKnown: overrideServiceCharge > 0,
      gasType: (parsed.gasType as "line" | "cylinder" | "unknown") ?? "unknown",
      lift: parsed.lift ?? false,
      generator: parsed.generator ?? false,
      waterloggingRisk: "medium",
      utilityClarity: "clear",
      commuteNotes: "",
      houseRules: [],
      redFlags: [],
      goodPoints: []
    };
  };

  const simulatedListing = parsed ? getSimulatedListing() : null;
  const cost = simulatedListing ? calculateFirstMonthCost(simulatedListing) : null;
  const scoredSimulated: ScoredListing | null = simulatedListing && profile 
    ? scoreListing(simulatedListing, profile, []) 
    : null;

  return (
    <div className="w-full transition-colors duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Paste Input & Preset Examples */}
        <div className="lg:col-span-5 bg-card border border-border-light rounded-3xl p-6 shadow-md space-y-5 transition-colors duration-300">
          <div>
            <div className="flex justify-between items-center mb-2.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-text-muted">
                Paste Rental Post Text
              </label>
              {rawText.trim() && (
                <button 
                  onClick={() => updateTextAndParse("")} 
                  className="text-[10px] font-bold text-text-muted hover:text-text-main cursor-pointer"
                >
                  Clear Input
                </button>
              )}
            </div>
            
            <textarea
              className="w-full h-48 p-4 text-xs border border-border-light rounded-2xl focus:border-primary focus:ring-1 focus:ring-primary/10 bg-bg-alt text-text-main placeholder-text-muted/65 font-mono leading-relaxed"
              placeholder="Paste Facebook group descriptions, Bikroy ads, or broker messages here..."
              value={rawText}
              onChange={(e) => updateTextAndParse(e.target.value)}
            />

            {rawText.trim() && (
              <div className="mt-3.5">
                <button
                  onClick={handleAIParse}
                  disabled={isParsing}
                  className="w-full py-3 px-4 bg-[#C9952B] text-white text-xs font-black tracking-wider uppercase rounded-xl hover:bg-[#b08020] active:scale-[0.98] transition-all shadow-md shadow-[#C9952B]/10 disabled:bg-bg-alt disabled:text-text-muted/40 disabled:shadow-none flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 fill-white text-white" />
                  {isParsing ? "Analyzing..." : "Gemini AI Parse"}
                </button>
              </div>
            )}

            {apiError && (
              <div className="mt-3 text-[10px] text-amber-700 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 font-semibold flex items-start gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span>{apiError}</span>
              </div>
            )}
          </div>

          <div className="border-t border-border-light pt-4">
            <span className="block text-[10px] font-black uppercase tracking-wider text-text-muted mb-3">
              Try a demo post
            </span>
            <div className="space-y-2">
              {messyExamples.slice(0, 4).map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => loadExample(ex.text)}
                  className="w-full flex items-center justify-between text-left p-3 rounded-xl border border-border-light bg-bg-alt hover:bg-card hover:border-[#C9952B]/30 transition-all text-xs font-semibold group cursor-pointer text-text-main"
                >
                  <span className="text-text-main line-clamp-1 flex-1 pr-2">{ex.title}</span>
                  <Play className="w-3 h-3 text-[#C9952B] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Structured Values & Cost Calculator */}
        <div className="lg:col-span-7">
          {!parsed ? (
            <div className="h-full min-h-[350px] border-2 border-dashed border-border-light rounded-3xl flex flex-col items-center justify-center p-8 text-center bg-card shadow-sm transition-colors duration-300">
              <Clipboard className="w-12 h-12 text-text-muted/40 mb-3.5" />
              <h3 className="font-extrabold text-text-main text-base font-serif uppercase tracking-wider">Unpack Social Media Listings</h3>
              <p className="text-xs text-text-muted mt-2 max-w-sm leading-relaxed">
                Paste a rental post on the left to parse budget rules and missing details.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Specs extraction */}
              <div className="bg-card border border-border-light rounded-3xl p-6 shadow-md transition-colors duration-300">
                <div className="flex justify-between items-center mb-5 pb-3.5 border-b border-border-light">
                  <h3 className="font-extrabold text-text-main text-sm">1. Extracted Property Specifications</h3>
                  <span className={`text-[9px] uppercase font-black tracking-wider px-2.5 py-1 rounded-md border ${
                    parsed.confidence === "high" 
                      ? "bg-emerald-500/10 text-visit border-visit/20" 
                      : (parsed.confidence === "medium" ? "bg-amber-500/10 text-gold border-gold/20" : "bg-rose-500/10 text-avoid border-avoid/20")
                  }`}>
                    {parsed.confidence} confidence
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold text-text-main">
                  <div className="bg-bg-alt p-3.5 rounded-xl border border-border-light">
                    <span className="text-[10px] text-text-muted block font-bold mb-0.5">Area</span>
                    <span className={parsed.area ? "text-text-main" : "text-rose-500 flex items-center gap-1"}>
                      {parsed.area ? parsed.area : "Unknown"}
                    </span>
                  </div>
                  <div className="bg-bg-alt p-3.5 rounded-xl border border-border-light">
                    <span className="text-[10px] text-text-muted block font-bold mb-0.5">Bedrooms</span>
                    <span className={parsed.bedrooms ? "text-text-main" : "text-rose-500 flex items-center gap-1"}>
                      {parsed.bedrooms ? `${parsed.bedrooms} Bed` : "Not listed"}
                    </span>
                  </div>
                  <div className="bg-bg-alt p-3.5 rounded-xl border border-border-light">
                    <span className="text-[10px] text-text-muted block font-bold mb-0.5">Tenant Type</span>
                    <span className="text-text-main capitalize">{parsed.tenantPreference ?? "Any"}</span>
                  </div>
                  <div className="bg-bg-alt p-3.5 rounded-xl border border-border-light">
                    <span className="text-[10px] text-text-muted block font-bold mb-0.5">Cooking Gas</span>
                    <span className="text-text-main capitalize">{parsed.gasType ?? "Unspecified"}</span>
                  </div>
                </div>

                {/* Missing Details Flags */}
                {parsed.missingFields.length > 0 && (
                  <div className="mt-5 p-4 bg-rose-500/5 border border-rose-200/30 rounded-2xl flex gap-3">
                    <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-rose-600">Undisclosed details to verify:</span>
                      <p className="text-[11px] text-text-muted mt-1 leading-normal">
                        <span className="font-semibold">{parsed.missingFields.join(", ")}</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Shifting Cash Flow Overrides */}
              <div className="bg-card border border-border-light rounded-3xl p-6 shadow-md transition-colors duration-300">
                <div className="flex justify-between items-center mb-5 pb-3.5 border-b border-border-light">
                  <h3 className="font-extrabold text-text-main text-sm">2. Upfront Shifting Calculator</h3>
                  <span className="text-[10px] text-text-muted font-bold">Interactive Adjustments</span>
                </div>

                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-wider text-text-muted block mb-1">
                        Monthly Rent (৳)
                      </label>
                      <input
                        type="number"
                        className="w-full p-2.5 border border-border-light rounded-xl text-xs font-bold bg-bg-alt text-text-main focus:outline-none focus:border-primary"
                        value={overrideRent}
                        onChange={(e) => setOverrideRent(parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-wider text-text-muted block mb-1">
                        Advance Months
                      </label>
                      <input
                        type="number"
                        className="w-full p-2.5 border border-border-light rounded-xl text-xs font-bold bg-bg-alt text-text-main focus:outline-none focus:border-primary"
                        value={overrideAdvance}
                        onChange={(e) => setOverrideAdvance(parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-wider text-text-muted block mb-1">
                        Service Charge (৳)
                      </label>
                      <input
                        type="number"
                        className="w-full p-2.5 border border-border-light rounded-xl text-xs font-bold bg-bg-alt text-text-main focus:outline-none focus:border-primary"
                        value={overrideServiceCharge}
                        onChange={(e) => setOverrideServiceCharge(parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-wider text-text-muted block mb-1">
                        Broker Fee (৳)
                      </label>
                      <input
                        type="number"
                        className="w-full p-2.5 border border-border-light rounded-xl text-xs font-bold bg-bg-alt text-text-main focus:outline-none focus:border-primary"
                        value={overrideBrokerFee}
                        onChange={(e) => setOverrideBrokerFee(parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>

                  {/* Cash Flow Invoice Card */}
                  {cost && (
                    <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-3 shadow-md border border-slate-800">
                      <div className="flex justify-between text-xs opacity-85">
                        <span>First Month Rent</span>
                        <span>৳{cost.rent.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs opacity-85">
                        <span>Security Deposit Advance ({overrideAdvance} mo)</span>
                        <span>৳{cost.advance.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs opacity-85">
                        <span>Service Charge</span>
                        <span>৳{cost.serviceCharge.toLocaleString()}</span>
                      </div>
                      {cost.brokerFee > 0 && (
                        <div className="flex justify-between text-xs opacity-85">
                          <span>Broker Media Fee</span>
                          <span>৳{cost.brokerFee.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-xs opacity-85">
                        <span>Movers Truck / Logistics Estimate</span>
                        <span>৳2,500</span>
                      </div>
                      
                      <div className="flex justify-between pt-3.5 border-t border-white/10 font-black text-sm">
                        <span className="text-white opacity-90">True Upfront Shifting Cost</span>
                        <span className={profile && cost.total > profile.maxFirstMonthCash ? "text-rose-300 font-extrabold" : "text-[#C9952B] font-extrabold"}>
                          ৳{cost.total.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* warnings list */}
                  {cost && cost.warnings.length > 0 && (
                    <div className="space-y-2">
                      {cost.warnings.slice(0, 2).map((w, idx) => (
                        <div key={idx} className="text-xs text-amber-800 bg-amber-500/10 p-3 rounded-xl border border-amber-500/20 flex items-start gap-2 font-semibold">
                          <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <span>{w}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* simulated compatibility scores */}
              {scoredSimulated && profile && (
                <div className="bg-card border border-border-light rounded-3xl p-6 shadow-md space-y-4 transition-colors duration-300">
                  <div className="flex justify-between items-center pb-3.5 border-b border-border-light">
                    <h3 className="font-extrabold text-text-main text-sm">3. Compatibility Analysis</h3>
                    <span className="text-xs font-black text-[#C9952B]">
                      {scoredSimulated.scores.total}% Fit Score
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#C9952B]/10 flex items-center justify-center shrink-0 border border-[#C9952B]/20">
                      <CheckCircle2 className="w-5 h-5 text-[#C9952B]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-text-main">Verdict: {getVerdictLabel(scoredSimulated.verdict)}</h4>
                      <p className="text-[11px] text-text-muted mt-1 leading-relaxed font-semibold">{scoredSimulated.whyItFits}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Landlord verification script */}
              <div className="bg-bg-alt border border-border-light rounded-3xl p-6 shadow-md space-y-3.5 transition-colors duration-300">
                <div className="flex justify-between items-center">
                  <h3 className="font-extrabold text-text-main text-sm flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-[#C9952B]" />
                  Pre-Visit Verification Script
                </h3>
                  <button
                    onClick={() => handleCopyScript(`Assalamu Alaikum. Flat er post ti dekhe jogajog korlam. Apnar flat-er details a service charge ar advance koto lagbe jana jabe ki? Flat ti ki titas pipeline gas? Shifting kobe kora jabe?`)}
                    className="text-xs font-bold text-[#C9952B] hover:text-[#b08020] flex items-center gap-1 bg-card px-2.5 py-1.5 rounded-xl border border-border-light shadow-xs cursor-pointer"
                  >
                    {copiedText ? <Check className="w-3.5 h-3.5 text-[#C9952B]" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedText ? "Copied" : "Copy Script"}
                  </button>
                </div>
                
                <div className="p-4 bg-card border border-border-light rounded-2xl text-xs text-text-main leading-relaxed italic font-semibold shadow-xs">
                  &ldquo;Assalamu Alaikum, apnar flat er tothho dekhlam. Shifting er planning korchi. 
                  {parsed.missingFields.includes("Service Charge Details") && " Flat er service charge details ta ki bola jabe?"}
                  {parsed.missingFields.includes("Gas Type (Line/Cylinder)") && " Gas ki govt line connection?"}
                  {parsed.missingFields.includes("Upfront Advance/Deposit") && " Advance koto mash er deya lagbe?"}
                  {parsed.missingFields.includes("Lift Facility") && " Elevators / Generator backup facility kemon?"}
                  &rdquo;
                </div>
              </div>

            </div>
          )}
        </div>
 
      </div>
    </div>
  );
}
