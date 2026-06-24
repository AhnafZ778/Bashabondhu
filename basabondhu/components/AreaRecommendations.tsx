"use client";

import React, { useState } from "react";
import { useSearch } from "@/context/SearchContext";
import { MapPin, Droplets, AlertTriangle, X, ArrowRight } from "lucide-react";
import { AreaProfile } from "@/lib/types";

export default function AreaRecommendations() {
  const { recommendedAreas, profile } = useSearch();
  const [selectedArea, setSelectedArea] = useState<AreaProfile | null>(null);

  if (!profile || recommendedAreas.length === 0) return null;

  return (
    <div className="w-full mb-8">
      {/* Compact Horizon Banner */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#C9952B]" />
              <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider">
                Suitability Matrix
              </h3>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {recommendedAreas.map((area) => {
              const suitability = 
                profile.householdType === "family" || profile.householdType === "couple"
                  ? area.familySuitability
                  : profile.householdType === "working-woman"
                  ? area.femaleSuitability
                  : area.bachelorSuitability;

              return (
                <button
                  key={area.id}
                  onClick={() => setSelectedArea(area)}
                  className="px-3 py-2 bg-slate-50 hover:bg-[#C9952B]/5 hover:border-[#C9952B]/40 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:text-text-main transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <span className="font-semibold">{area.name}</span>
                  <span className="bg-[#C9952B]/10 text-[#C9952B] text-[10px] font-black px-1.5 py-0.5 rounded-md">
                    {suitability}/10 Fit
                  </span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modern Dialog/Modal for Area Details */}
      {selectedArea && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden border border-slate-200 shadow-2xl relative flex flex-col">
            
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase font-black tracking-widest text-[#C9952B] bg-[#C9952B]/10 border border-[#C9952B]/20 px-2 py-0.5 rounded-md">
                  Area Analysis
                </span>
                <h4 className="text-xl font-black text-slate-900 mt-2">{selectedArea.name}</h4>
                <p className="text-xs text-slate-400 mt-0.5">Average monthly rent: {selectedArea.rentRange}</p>
              </div>
              <button
                onClick={() => setSelectedArea(null)}
                className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-5 overflow-y-auto max-h-[60vh]">
              {/* Suitability Scores */}
              <div className="space-y-3 bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Demographic Suitability</h5>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>Family suitability</span>
                      <span className="font-bold text-slate-800">{selectedArea.familySuitability}/10</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="bg-[#C9952B] h-full rounded-full" 
                        style={{ width: `${selectedArea.familySuitability * 10}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>Bachelor / Student suitability</span>
                      <span className="font-bold text-slate-800">{selectedArea.bachelorSuitability}/10</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="bg-[#C9952B] h-full rounded-full" 
                        style={{ width: `${selectedArea.bachelorSuitability * 10}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Tag Badges */}
              <div className="space-y-2">
                <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Best Suited For</h5>
                <div className="flex flex-wrap gap-1.5">
                  {selectedArea.bestFor.map((tag) => (
                    <span 
                      key={tag} 
                      className="text-[10px] px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-bold border border-slate-200/50"
                    >
                      {tag}
                    </span>
                  ))}
                  {selectedArea.waterloggingRisk === "high" && (
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-rose-50 text-rose-600 border border-rose-100 font-bold flex items-center gap-1">
                      <Droplets className="w-3.5 h-3.5" /> High Flooding Risk
                    </span>
                  )}
                </div>
              </div>

              {/* Transit & Commuting Notes */}
              <div className="space-y-2">
                <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Transit & Commute Notes</h5>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {selectedArea.commuteNotes}
                </p>
              </div>

              {/* Main Trade-off Card */}
              <div className="bg-amber-550/5 border border-amber-500/10 rounded-2xl p-4 text-xs text-amber-900 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-amber-850">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>The Neighborhood Trade-off</span>
                </div>
                <p className="text-slate-600 leading-relaxed font-medium">
                  {selectedArea.mainTradeoff}
                </p>
              </div>
            </div>

            {/* Footer button */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 text-right">
              <button
                onClick={() => setSelectedArea(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-850 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Close Details
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
