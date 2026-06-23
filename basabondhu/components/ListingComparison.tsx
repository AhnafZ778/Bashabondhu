"use client";

import React from "react";
import { useSearch } from "@/context/SearchContext";
import { calculateFirstMonthCost } from "@/lib/cost-calculator";
import { GitCompare, Trash2, ShieldAlert, Sparkles } from "lucide-react";

export default function ListingComparison() {
  const { selectedForCompare, scoredListings, toggleCompare, clearCompare } = useSearch();

  // Find the selected listing data
  const listingsToCompare = scoredListings.filter(l => 
    selectedForCompare.includes(l.id)
  );

  if (listingsToCompare.length === 0) {
    return (
      <div className="bg-card border border-border-light rounded-3xl p-8 text-center shadow-sm transition-colors duration-300">
        <GitCompare className="w-12 h-12 text-primary/20 mx-auto mb-4" />
        <h3 className="font-bold text-base text-text-main">Compare Selected Houses</h3>
        <p className="text-xs text-text-muted mt-1.5 max-w-sm mx-auto">
          Click the &quot;Compare&quot; button on any listing card to compare upfront costs, commutes, and hidden rules side-by-side.
        </p>
      </div>
    );
  }

  // Find optimal values to highlight
  const rents = listingsToCompare.map(l => l.rent);
  const minRent = Math.min(...rents);

  const totalCosts = listingsToCompare.map(l => calculateFirstMonthCost(l).total);
  const minTotalCost = Math.min(...totalCosts);

  const scores = listingsToCompare.map(l => l.scores.total);
  const maxScore = Math.max(...scores);

  return (
    <div className="bg-card border border-border-light rounded-3xl p-6 shadow-sm overflow-hidden w-full transition-colors duration-300">
      <div className="flex justify-between items-center mb-6 pb-3 border-b border-border-light">
        <div className="flex items-center gap-2">
          <GitCompare className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-text-main font-sans">Side-by-Side Comparison</h2>
        </div>
        <button
          onClick={clearCompare}
          className="text-xs font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse min-w-[500px]">
          <thead>
            <tr className="border-b border-border-light">
              <th className="py-3 px-4 font-semibold text-text-muted w-1/4">Spec Sheet</th>
              {listingsToCompare.map((listing) => (
                <th key={listing.id} className="py-3 px-4 font-bold text-text-main relative">
                  <div className="flex justify-between items-start gap-4">
                    <span className="line-clamp-2">{listing.title}</span>
                    <button
                      onClick={() => toggleCompare(listing.id)}
                      className="text-text-muted hover:text-rose-500 hover:scale-105 shrink-0 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Match Score */}
            <tr className="border-b border-border-light hover:bg-bg-alt/50">
              <td className="py-3 px-4 text-text-muted font-medium">Compatibility Match</td>
              {listingsToCompare.map((l) => (
                <td key={l.id} className="py-3 px-4 font-bold">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg ${
                    l.scores.total === maxScore 
                      ? "bg-gold-bg text-gold font-extrabold border border-gold/20" 
                      : "text-text-main"
                  }`}>
                    {l.scores.total === maxScore && <Sparkles className="w-3 h-3 text-gold fill-gold" />}
                    {l.scores.total}% Match
                  </span>
                </td>
              ))}
            </tr>

            {/* Monthly Rent */}
            <tr className="border-b border-border-light hover:bg-bg-alt/50">
              <td className="py-3 px-4 text-text-muted font-medium">Monthly Rent</td>
              {listingsToCompare.map((l) => (
                <td key={l.id} className="py-3 px-4">
                  <span className={`font-bold ${l.rent === minRent ? "text-primary" : "text-text-main"}`}>
                    ৳{l.rent.toLocaleString()}
                  </span>
                  {l.rent === minRent && (
                    <span className="text-[9px] uppercase tracking-wide bg-primary/10 text-primary px-1.5 py-0.5 rounded ml-1.5 font-bold">
                      Cheapest
                    </span>
                  )}
                </td>
              ))}
            </tr>

            {/* Upfront Cash */}
            <tr className="border-b border-border-light hover:bg-bg-alt/50">
              <td className="py-3 px-4 text-text-muted font-medium">Upfront Shifting Cost</td>
              {listingsToCompare.map((l) => {
                const cost = calculateFirstMonthCost(l);
                return (
                  <td key={l.id} className="py-3 px-4">
                    <span className={`font-bold ${cost.total === minTotalCost ? "text-gold" : "text-text-main"}`}>
                      ৳{cost.total.toLocaleString()}
                    </span>
                    {cost.total === minTotalCost && (
                      <span className="text-[9px] uppercase tracking-wide bg-gold-bg text-gold px-1.5 py-0.5 rounded ml-1.5 font-bold">
                        Lowest Cash
                      </span>
                    )}
                    <span className="text-[10px] text-text-muted block mt-0.5">
                      (Includes {l.advanceMonths}m advance + mover)
                    </span>
                  </td>
                );
              })}
            </tr>

            {/* Service Charge */}
            <tr className="border-b border-border-light hover:bg-bg-alt/50">
              <td className="py-3 px-4 text-text-muted font-medium">Service Charge</td>
              {listingsToCompare.map((l) => (
                <td key={l.id} className="py-3 px-4 text-text-main font-medium">
                  {l.serviceChargeKnown && l.serviceCharge ? `৳${l.serviceCharge.toLocaleString()}` : "Not stated (Confirm!)"}
                </td>
              ))}
            </tr>

            {/* Bedrooms & Baths */}
            <tr className="border-b border-border-light hover:bg-bg-alt/50">
              <td className="py-3 px-4 text-text-muted font-medium">Bedrooms / Baths</td>
              {listingsToCompare.map((l) => (
                <td key={l.id} className="py-3 px-4 text-text-main font-semibold">
                  {l.bedrooms} Bedrooms • {l.bathrooms ?? 2} Bathrooms
                </td>
              ))}
            </tr>

            {/* Gas Type */}
            <tr className="border-b border-border-light hover:bg-bg-alt/50">
              <td className="py-3 px-4 text-text-muted font-medium">Gas Supply</td>
              {listingsToCompare.map((l) => (
                <td key={l.id} className="py-3 px-4">
                  <span className={`font-semibold capitalize ${l.gasType === "line" ? "text-primary" : "text-amber-500"}`}>
                    {l.gasType} Gas
                  </span>
                </td>
              ))}
            </tr>

            {/* Lift & Generator */}
            <tr className="border-b border-border-light hover:bg-bg-alt/50">
              <td className="py-3 px-4 text-text-muted font-medium">Lift / Generator</td>
              {listingsToCompare.map((l) => (
                <td key={l.id} className="py-3 px-4 text-text-main">
                  {l.lift ? "✅ Lift Present" : "❌ No Lift"} / {l.generator ? "✅ Generator backup" : "❌ No Generator"}
                </td>
              ))}
            </tr>

            {/* Waterlogging Risk */}
            <tr className="border-b border-border-light hover:bg-bg-alt/50">
              <td className="py-3 px-4 text-text-muted font-medium">Waterlogging Risk</td>
              {listingsToCompare.map((l) => (
                <td key={l.id} className="py-3 px-4">
                  <span className={`font-semibold capitalize ${
                    l.waterloggingRisk === "high" 
                      ? "text-rose-500" 
                      : (l.waterloggingRisk === "medium" ? "text-amber-500" : "text-visit")
                  }`}>
                    {l.waterloggingRisk} Risk
                  </span>
                </td>
              ))}
            </tr>

            {/* Disadvantages */}
            <tr className="border-b border-border-light hover:bg-bg-alt/50">
              <td className="py-3 px-4 text-text-muted font-medium">Biggest Risk / Red Flag</td>
              {listingsToCompare.map((l) => (
                <td key={l.id} className="py-3 px-4">
                  {l.biggestRisk !== "None detected" ? (
                    <div className="text-rose-500 font-semibold flex items-start gap-1">
                      <ShieldAlert className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>{l.biggestRisk}</span>
                    </div>
                  ) : (
                    <span className="text-text-muted font-medium">No major risks flagged.</span>
                  )}
                </td>
              ))}
            </tr>

            {/* Best For Summary */}
            <tr className="border-b border-border-light hover:bg-bg-alt/50 bg-gold-bg/30">
              <td className="py-3 px-4 text-gold font-bold">Best For</td>
              {listingsToCompare.map((l) => {
                const bestFor: string[] = [];
                if (l.rent === minRent) bestFor.push("Cheapest Rent");
                if (calculateFirstMonthCost(l).total === minTotalCost) bestFor.push("Lowest Upfront");
                if (l.scores.total === maxScore) bestFor.push("Overall Best Match");
                if (l.scores.commuteFit >= 80) bestFor.push("Great Commute");
                if (l.waterloggingRisk === "low") bestFor.push("Flood-Safe");
                if (l.gasType === "line") bestFor.push("Titas Gas Line");
                if (bestFor.length === 0) bestFor.push("Balanced Option");
                return (
                  <td key={l.id} className="py-3 px-4">
                    <div className="flex flex-wrap gap-1.5">
                      {bestFor.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="text-[9px] uppercase tracking-wide bg-gold/10 text-gold px-2 py-0.5 rounded-md font-bold border border-gold/15">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* Visit Order Recommendation */}
            <tr className="bg-primary/5">
              <td className="py-3.5 px-4 text-primary font-bold">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-primary fill-primary" />
                  Recommended Visit Order
                </div>
              </td>
              {(() => {
                // Sort by total score descending for visit order
                const sorted = [...listingsToCompare].sort((a, b) => b.scores.total - a.scores.total);
                return listingsToCompare.map((l) => {
                  const visitRank = sorted.findIndex(s => s.id === l.id) + 1;
                  const isFirst = visitRank === 1;
                  return (
                    <td key={l.id} className="py-3.5 px-4">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-extrabold text-xs ${
                        isFirst 
                          ? "bg-primary text-white shadow-sm shadow-primary/15" 
                          : "bg-bg-alt text-text-main border border-border-light"
                      }`}>
                        <span>{isFirst ? "🏆" : `#${visitRank}`}</span>
                        <span>{isFirst ? "Visit First" : `Visit ${visitRank}${visitRank === 2 ? "nd" : "rd"}`}</span>
                      </div>
                      {isFirst && (
                        <p className="text-[10px] text-primary font-semibold mt-1.5">
                          Highest overall score — best bang for your time.
                        </p>
                      )}
                    </td>
                  );
                });
              })()}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
