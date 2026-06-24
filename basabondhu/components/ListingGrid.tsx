"use client";

import React, { useState } from "react";
import { useSearch } from "@/context/SearchContext";
import { ScoredListing } from "@/lib/types";
import { calculateFirstMonthCost } from "@/lib/cost-calculator";
import { 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize, 
  Plus, 
  Minus, 
  Building, 
  ArrowRight, 
  SlidersHorizontal, 
  Phone, 
  Copy, 
  Calculator, 
  Compass, 
  X,
  Sparkles,
  Check,
  AlertOctagon
} from "lucide-react";

export default function ListingGrid() {
  const { 
    profile, 
    scoredListings, 
    selectedForCompare, 
    toggleCompare, 
    activeAdjustments, 
    toggleAdjustment 
  } = useSearch();

  const [showAvoided, setShowAvoided] = useState(false);
  const [selectedListingDetail, setSelectedListingDetail] = useState<ScoredListing | null>(null);
  const [activeTab, setActiveTab] = useState<"analysis" | "costs" | "script">("analysis");
  const [copiedText, setCopiedText] = useState(false);

  if (!profile || scoredListings.length === 0) return null;

  // Split listings
  const topRecommendations = scoredListings
    .filter(l => l.verdict !== "avoid")
    .slice(0, 3);
    
  const otherListings = scoredListings
    .filter(l => l.verdict !== "avoid")
    .slice(3);

  const avoidedListings = scoredListings.filter(l => l.verdict === "avoid");

  const getVerdictStyles = (verdict: string) => {
    switch (verdict) {
      case "visit":
        return {
          badge: "bg-emerald-500/10 text-visit border-visit/20",
          text: "text-visit",
          pill: "bg-visit"
        };
      case "maybe":
        return {
          badge: "bg-gold-bg text-gold border-gold/20",
          text: "text-gold",
          pill: "bg-gold"
        };
      case "call-first":
        return {
          badge: "bg-orange-500/10 text-callfirst border-callfirst/20",
          text: "text-callfirst",
          pill: "bg-callfirst"
        };
      case "avoid":
        return {
          badge: "bg-rose-500/10 text-avoid border-avoid/20",
          text: "text-avoid",
          pill: "bg-avoid"
        };
      default:
        return {
          badge: "bg-slate-500/10 text-text-muted border-border-light",
          text: "text-text-muted",
          pill: "bg-slate-500"
        };
    }
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

  const handleCopyScript = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="w-full transition-colors duration-300">
      {/* Dynamic Adjustment Filters Panel */}
      <div className="mb-8 bg-bg border border-border-light rounded-2xl p-4 transition-colors duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-1.5 shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#C9952B]" />
            <span className="text-[10px] font-black text-[#C9952B] uppercase tracking-wider">Refine:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { value: "shorter-commute", label: "Shorter Commute" },
              { value: "lower-rent", label: "Lower Rent" },
              { value: "avoid-broker", label: "Direct Owner Only" },
              { value: "avoid-waterlogging", label: "Dry Areas Only" }
            ].map((adj) => {
              const isActive = activeAdjustments.includes(adj.value);
              return (
                <button
                  key={adj.value}
                  onClick={() => toggleAdjustment(adj.value)}
                  className={`px-3 py-1.5 rounded-lg border text-[11px] font-bold tracking-tight transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "bg-[#C9952B] border-[#C9952B] text-white shadow-sm"
                      : "bg-card border-border-light text-text-main hover:border-[#C9952B]/40 hover:bg-bg-alt"
                  }`}
                >
                  {adj.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Results Showcase */}
      <div className="mb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C9952B]" />
              <span className="text-[10px] font-extrabold text-[#C9952B] uppercase tracking-[0.2em] font-serif">Recommendations</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif uppercase tracking-wider text-text-main font-black transition-colors">Top Matches</h2>
          </div>
        </div>

        {/* 3 Prominent Image-Driven Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {topRecommendations.map((listing, idx) => {
            const isSelected = selectedForCompare.includes(listing.id);
            const firstMonthCost = calculateFirstMonthCost(listing);
            return (
              <div
                key={listing.id}
                onClick={() => {
                  setSelectedListingDetail(listing);
                  setActiveTab("analysis");
                }}
                className={`relative bg-card rounded-3xl overflow-hidden border cursor-pointer group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between ${
                  idx === 0 
                    ? "ring-2 ring-gold border-transparent shadow-xl shadow-gold/5" 
                    : "border-border-light shadow-md"
                }`}
              >
                {/* Image Section */}
                <div className="relative h-48 w-full overflow-hidden bg-bg-alt shrink-0">
                  <img
                    src={listing.imageUrl || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80"}
                    alt={listing.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 ease-out"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80";
                    }}
                  />
                  
                  {/* Rating/Match Score Badge in Gold */}
                  <div className="absolute top-3 left-3 bg-[#C9952B] text-white text-[10px] px-2.5 py-1 rounded-md font-extrabold shadow-sm">
                    {listing.scores.total}% Match
                  </div>

                  {/* Verdict pill overlay */}
                  <div className="absolute top-3 right-3 bg-slate-900/90 text-white text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md">
                    {getVerdictLabel(listing.verdict)}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    {/* Area + source info */}
                    <div className="flex justify-between items-center text-[10px] font-bold text-text-muted uppercase tracking-wider">
                      <span>{listing.area} • {listing.addressHint}</span>
                      <span>{listing.sourceType}</span>
                    </div>

                    <h3 className="font-extrabold text-text-main text-sm leading-tight group-hover:text-primary transition-colors duration-200 line-clamp-2">
                      {listing.title}
                    </h3>

                    {/* Quick Core Specs Layout */}
                    <div className="grid grid-cols-3 gap-1 py-2 px-3 bg-bg-alt rounded-xl border border-border-light text-text-main text-[11px] font-semibold">
                      <div className="flex items-center gap-1 justify-center">
                        <Bed className="w-3.5 h-3.5 text-text-muted" />
                        <span>{listing.bedrooms} Beds</span>
                      </div>
                      <div className="flex items-center gap-1 justify-center border-x border-border-light">
                        <Bath className="w-3.5 h-3.5 text-text-muted" />
                        <span>{listing.bathrooms || 2} Baths</span>
                      </div>
                      <div className="flex items-center gap-1 justify-center">
                        <Maximize className="w-3.5 h-3.5 text-text-muted" />
                        <span>{listing.sizeSqft || 1200} sqft</span>
                      </div>
                    </div>

                    {/* Quick highlights */}
                    <div className="flex flex-wrap gap-1 pt-1.5">
                      {listing.goodPoints.slice(0, 2).map((pt, idx) => (
                        <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold border border-slate-200/20">
                          {pt}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Pricing and Action row */}
                  <div className="space-y-3.5">
                    {/* Pricing box (Solid backdrop) */}
                    <div className="bg-bg-alt border border-border-light p-3 rounded-xl flex justify-between items-center">
                      <div>
                        <p className="text-[9px] uppercase font-extrabold text-text-muted tracking-wider">Monthly Rent</p>
                        <p className="text-sm font-black text-text-main">৳{listing.rent.toLocaleString()}</p>
                      </div>
                      <div className="text-right border-l border-border-light pl-4">
                        <p className="text-[9px] uppercase font-extrabold text-text-muted tracking-wider">Est. Upfront Cash</p>
                        <p className="text-xs font-bold text-primary">৳{firstMonthCost.total.toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Bottom Action buttons */}
                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCompare(listing.id);
                        }}
                        className={`px-3 py-2 rounded-xl border text-[11px] font-extrabold transition-all cursor-pointer flex items-center gap-1 ${
                          isSelected
                            ? "bg-rose-500/10 border-rose-200 text-rose-600"
                            : "bg-card border-border-light text-text-muted hover:text-primary hover:border-primary/30"
                        }`}
                        title={isSelected ? "Remove from comparison" : "Add to comparison"}
                      >
                        {isSelected ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                        {isSelected ? "Remove" : "Compare"}
                      </button>

                      <span className="text-[11px] font-black text-primary group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                        Analyze Details
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Other matches with clean, visual card format */}
      {otherListings.length > 0 && (
        <div className="mb-12">
          <h3 className="font-bold text-text-main text-base mb-5 flex items-center gap-2 transition-colors">
            <Building className="w-4 h-4 text-primary" />
            Other Worthy Matches ({otherListings.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {otherListings.map((listing) => {
              const isSelected = selectedForCompare.includes(listing.id);
              const firstMonthCost = calculateFirstMonthCost(listing);
              const styles = getVerdictStyles(listing.verdict);
              
              return (
                <div
                  key={listing.id}
                  onClick={() => {
                    setSelectedListingDetail(listing);
                    setActiveTab("analysis");
                  }}
                  className="bg-card border border-border-light rounded-2xl overflow-hidden hover:shadow-xl cursor-pointer group transition-all duration-300 flex"
                >
                  {/* Visual block */}
                  <div className="relative w-40 h-full min-h-[160px] shrink-0 bg-bg-alt hidden sm:block">
                    <img
                      src={listing.imageUrl || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80"}
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80";
                      }}
                    />
                    <div className="absolute top-2 left-2 bg-white/95 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">
                      {listing.scores.total}% Fit
                    </div>
                  </div>

                  {/* Body details */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`text-[9px] uppercase font-black tracking-wider px-2 py-0.5 rounded-md border ${styles.badge}`}>
                          {getVerdictLabel(listing.verdict)}
                        </span>
                        <span className="text-[10px] text-text-muted font-bold uppercase">{listing.area}</span>
                      </div>
                      <h4 className="font-bold text-text-main text-sm group-hover:text-primary transition-colors line-clamp-1">
                        {listing.title}
                      </h4>
                      <p className="text-xs font-bold text-text-main mt-1">
                        ৳{listing.rent.toLocaleString()}/mo • <span className="text-text-muted font-normal">{listing.bedrooms} Beds | {listing.bathrooms || 2} Baths</span>
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border-light flex items-center justify-between text-xs">
                      <span className="text-[10px] font-bold text-text-muted">Upfront: ৳{firstMonthCost.total.toLocaleString()}</span>
                      
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => toggleCompare(listing.id)}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                            isSelected
                              ? "bg-rose-550/10 border-rose-200 text-rose-600"
                              : "border-border-light text-text-main hover:text-primary hover:border-primary/30"
                          }`}
                        >
                          {isSelected ? "Remove" : "Compare"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Avoided listings warning section */}
      {avoidedListings.length > 0 && (
        <div className="border-t border-border-light pt-6 mt-10">
          <button
            onClick={() => setShowAvoided(!showAvoided)}
            className="text-xs font-bold text-text-muted hover:text-text-main transition-colors flex items-center gap-1.5 uppercase tracking-wider cursor-pointer"
          >
            {showAvoided ? "Hide" : "Show"} Mismatched/Avoided Options ({avoidedListings.length})
          </button>

          {showAvoided && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              {avoidedListings.map((listing) => (
                <div
                  key={listing.id}
                  className="bg-rose-500/5 border border-rose-200/30 rounded-xl p-4 text-xs flex justify-between items-center group hover:bg-rose-550/10 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] uppercase font-black px-2 py-0.5 rounded bg-rose-100 text-rose-700">
                        Mismatched
                      </span>
                      <span className="text-[10px] font-bold text-text-muted">{listing.area}</span>
                    </div>
                    <h4 className="font-bold text-text-main line-clamp-1">{listing.title}</h4>
                    <p className="text-[11px] text-text-muted mt-2 flex items-start gap-1 font-medium">
                      <AlertOctagon className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span>{listing.whyItFits}</span>
                    </p>
                  </div>
                  <div className="text-right ml-4 shrink-0">
                    <span className="text-[10px] text-text-muted block uppercase font-bold">Match Score</span>
                    <span className="text-sm font-black text-rose-700">{listing.scores.total}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Details Slide-over Drawer */}
      {selectedListingDetail && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-card w-full max-w-lg h-full border-l border-border-light shadow-2xl flex flex-col justify-between animate-slide-in">
            {/* Header */}
            <div className="p-5 border-b border-border-light flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-black tracking-widest text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-md">
                  Listing Analysis
                </span>
                <span className="text-xs bg-gold/10 text-gold border border-gold/25 px-2.5 py-1 rounded-md font-bold">
                  {selectedListingDetail.scores.total}% Match
                </span>
              </div>
              <button
                onClick={() => setSelectedListingDetail(null)}
                className="p-2 hover:bg-bg-alt rounded-full text-text-muted hover:text-text-main transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable details */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              <div>
                <span className="text-[10px] font-black uppercase text-gold tracking-widest">{selectedListingDetail.area}</span>
                <h3 className="text-xl font-black text-text-main mt-1 leading-snug">{selectedListingDetail.title}</h3>
                <p className="text-xs text-text-muted mt-1">{selectedListingDetail.addressHint}</p>
              </div>

              {/* Slider tabs inside Drawer */}
              <div className="flex border-b border-border-light text-xs font-bold">
                {[
                  { id: "analysis", label: "Deep Analysis" },
                  { id: "costs", label: "Moving Cost Math" },
                  { id: "script", label: "Phone Script" }
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id as any)}
                    className={`flex-1 pb-2.5 text-center border-b-2 cursor-pointer transition-all ${
                      activeTab === t.id
                        ? "border-primary text-primary"
                        : "border-transparent text-text-muted hover:text-text-main"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* TAB 1: Rationale & Specs */}
              {activeTab === "analysis" && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Key specs grid */}
                  <div className="grid grid-cols-2 gap-3 bg-bg-alt p-4 rounded-2xl border border-border-light text-xs text-text-main">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] uppercase font-bold text-text-muted">Rent Price</span>
                      <span className="font-extrabold text-sm text-primary">৳{selectedListingDetail.rent.toLocaleString()}/mo</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] uppercase font-bold text-text-muted">Upfront Cash</span>
                      <span className="font-extrabold text-sm text-gold">
                        ৳{calculateFirstMonthCost(selectedListingDetail).total.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 border-t border-border-light pt-3">
                      <span className="text-[10px] uppercase font-bold text-text-muted">Flat Size</span>
                      <span className="font-bold">{selectedListingDetail.sizeSqft} sqft • {selectedListingDetail.bedrooms} Bed / {selectedListingDetail.bathrooms} Bath</span>
                    </div>
                    <div className="flex flex-col gap-1 border-t border-border-light pt-3">
                      <span className="text-[10px] uppercase font-bold text-text-muted">Utility Amenities</span>
                      <span className="font-bold capitalize">
                        {selectedListingDetail.lift ? "Yes" : "No"} Lift • {selectedListingDetail.gasType} Gas
                      </span>
                    </div>
                  </div>

                  {/* Fit Rationale */}
                  <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4.5">
                    <h4 className="font-bold text-xs text-primary uppercase tracking-wider mb-1.5">Why it fits you</h4>
                    <p className="text-xs text-text-main leading-relaxed font-semibold">
                      {selectedListingDetail.whyItFits}
                    </p>
                  </div>

                  {/* Warnings & Risks */}
                  {selectedListingDetail.biggestRisk !== "None detected" && (
                    <div className="bg-rose-500/5 border border-rose-200/30 rounded-2xl p-4.5">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <AlertTriangle className="w-4 h-4 text-rose-500" />
                        <h4 className="font-bold text-xs text-rose-600 uppercase tracking-wider">Key Hazards & Flags</h4>
                      </div>
                      <p className="text-xs text-text-main leading-relaxed font-semibold">
                        {selectedListingDetail.biggestRisk}
                      </p>
                    </div>
                  )}

                  {/* Dhaka-Specific Environmental Risks */}
                  <div className="bg-bg-alt border border-border-light rounded-2xl p-4.5">
                    <h4 className="font-bold text-xs text-text-main uppercase tracking-wider mb-2">Neighborhood Factors</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs text-text-muted mb-1">
                          <span>Monsoon Waterlogging Risk</span>
                          <span className="font-bold capitalize text-text-main">{selectedListingDetail.waterloggingRisk}</span>
                        </div>
                        <div className="w-full bg-border-light h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              selectedListingDetail.waterloggingRisk === "high" ? "bg-rose-500" :
                              selectedListingDetail.waterloggingRisk === "medium" ? "bg-amber-500" : "bg-emerald-500"
                            }`} 
                            style={{ width: selectedListingDetail.waterloggingRisk === "high" ? "100%" : selectedListingDetail.waterloggingRisk === "medium" ? "50%" : "15%" }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-text-muted mb-1">
                          <span>Commute Anchors (Avg Transit Time)</span>
                          <span className="font-bold text-text-main">Estimated</span>
                        </div>
                        <p className="text-xs text-text-muted font-medium">
                          {selectedListingDetail.commuteNotes}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Good points */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-xs text-text-main uppercase tracking-wider">Advantage Summary</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {selectedListingDetail.goodPoints.map((pt, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-bg-alt p-2.5 rounded-xl border border-border-light text-xs text-text-main">
                          <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                          <span>{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: Shifting Cost Math */}
              {activeTab === "costs" && (
                <div className="space-y-5 animate-fade-in">
                  <div className="bg-primary text-white rounded-2xl p-5 shadow-sm">
                    <p className="text-[10px] uppercase font-bold tracking-wider opacity-80">Estimated Total Upfront Cash Needed</p>
                    <h4 className="text-3xl font-black mt-1">
                      ৳{calculateFirstMonthCost(selectedListingDetail).total.toLocaleString()}
                    </h4>
                    <p className="text-[11px] opacity-75 mt-2">Includes security advance deposits, first month rent, shifting charges, and fees.</p>
                  </div>

                  {/* Itemized list */}
                  <div className="bg-card border border-border-light rounded-2xl p-4.5 space-y-3.5 text-xs text-text-main transition-colors">
                    <h4 className="font-bold text-text-main text-xs uppercase tracking-wider pb-2.5 border-b border-border-light">
                      Cost Breakdown Detail
                    </h4>
                    <div className="flex justify-between">
                      <span className="text-text-muted">First Month Rent</span>
                      <span className="font-bold text-text-main">৳{selectedListingDetail.rent.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Security Advance ({selectedListingDetail.advanceMonths} month)</span>
                      <span className="font-bold text-text-main">৳{(selectedListingDetail.rent * selectedListingDetail.advanceMonths).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Service Charge</span>
                      <span className="font-bold text-text-main">
                        ৳{(selectedListingDetail.serviceCharge || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Brokerage Fee</span>
                      <span className="font-bold text-text-main">
                        {selectedListingDetail.brokerFee ? `৳${selectedListingDetail.brokerFee.toLocaleString()}` : "৳0"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Moving Truck / Rickshaw Estimate</span>
                      <span className="font-bold text-text-main">৳2,500</span>
                    </div>
                  </div>

                  {/* Cost Warnings */}
                  {calculateFirstMonthCost(selectedListingDetail).warnings.length > 0 && (
                    <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-4.5">
                      <div className="flex items-center gap-1.5 mb-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <h4 className="font-bold text-xs text-amber-800 uppercase tracking-wider">Hidden Cost Warnings</h4>
                      </div>
                      <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700">
                        {calculateFirstMonthCost(selectedListingDetail).warnings.map((w, idx) => (
                          <li key={idx} className="font-semibold">{w}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: Pre-Visit Script & Missing details */}
              {activeTab === "script" && (
                <div className="space-y-5 animate-fade-in">
                  
                  {/* Script copy box */}
                  <div className="bg-bg-alt border border-border-light rounded-2xl p-4.5">
                    <div className="flex justify-between items-center mb-2.5">
                      <h4 className="font-bold text-xs text-text-main uppercase tracking-wider">Landlord Interview Script</h4>
                      <button
                        onClick={() => handleCopyScript(`Assalamu Alaikum, ${selectedListingDetail.area} er flat er post ta dekhlam. Flat ti ki government gas pipeline connected? Flat er service charge ebong security advance koto lagbe? Shiting er jonno ready ache ki?`)}
                        className="text-xs font-bold text-primary hover:text-secondary flex items-center gap-1 bg-card px-2.5 py-1 rounded-lg border border-border-light cursor-pointer"
                      >
                        {copiedText ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedText ? "Copied" : "Copy"}
                      </button>
                    </div>

                    <div className="p-4 bg-card border border-border-light rounded-xl text-xs text-text-main leading-relaxed italic font-semibold">
                      &ldquo;Assalamu Alaikum. Ami apnar flat er tothho dekhlam. Ami amam poribarer (husband/wife) shathe 
                      shifting er plan korchi. Flat a ki titas government gas line connected? Service charge ta ki fixed naki 
                      utilities (pani, electricity) extra dite hobe? Apni ki advance 1 mash nite parben?&rdquo;
                    </div>
                  </div>

                  {/* customized missing data list */}
                  <div className="bg-card border border-border-light rounded-2xl p-4.5 space-y-3">
                    <h4 className="font-bold text-text-main uppercase tracking-wider">
                      Verify these before scheduling a visit:
                    </h4>
                    <ul className="space-y-2.5">
                      {selectedListingDetail.questionsToAsk.map((q, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-text-muted leading-normal">
                          <span className="w-2.5 h-2.5 rounded-full bg-gold shrink-0 mt-0.5"></span>
                          <span>{q}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Dial landlord direct */}
                  <a 
                    href="tel:+8801700000000"
                    className="w-full py-3.5 bg-primary hover:bg-secondary text-white font-extrabold text-xs tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 uppercase shadow-md shadow-primary/10"
                  >
                    <Phone className="w-4 h-4 fill-white" />
                    Place Mock Call to Landlord
                  </a>

                </div>
              )}

            </div>

            {/* Footer actions */}
            <div className="p-5 border-t border-border-light bg-bg-alt shrink-0 flex items-center justify-between">
              <span className="text-[10px] text-text-muted font-bold uppercase">Ready to Shifting?</span>
              <button
                onClick={() => setSelectedListingDetail(null)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Close Panel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
