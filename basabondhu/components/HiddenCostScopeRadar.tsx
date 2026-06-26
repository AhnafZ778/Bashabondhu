import React from "react";
import { HiddenCostSource } from "../lib/domain/hidden-cost-sources";

export default function HiddenCostScopeRadar({ scopes }: { scopes: HiddenCostSource[] }) {
  if (!scopes || scopes.length === 0) {
    return (
      <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl">
        <h4 className="text-emerald-400 font-medium flex items-center gap-2">
          <span className="material-icons text-sm">verified</span> No Hidden Cost Scopes Detected
        </h4>
        <p className="text-emerald-400/70 text-sm mt-1">This listing appears transparent based on our scan.</p>
      </div>
    );
  }

  const critical = scopes.filter(s => s.seriousness === "critical");
  const high = scopes.filter(s => s.seriousness === "high");
  const medium = scopes.filter(s => s.seriousness === "medium");

  return (
    <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl">
      <h3 className="text-white font-medium mb-4 flex items-center gap-2">
        <span className="material-icons text-amber-500 text-sm">radar</span> Hidden Cost Scopes
      </h3>
      
      <div className="space-y-4">
        {critical.length > 0 && (
          <div>
            <h4 className="text-rose-500 text-xs font-bold uppercase tracking-wider mb-2">Critical Ambiguity</h4>
            <div className="space-y-2">
              {critical.map((s, i) => (
                <div key={i} className="bg-rose-500/10 border border-rose-500/20 p-3 rounded-lg">
                  <div className="flex justify-between items-start">
                    <span className="text-rose-400 font-medium text-sm">{s.label}</span>
                    <span className="bg-rose-500/20 text-rose-400 text-xs px-2 py-0.5 rounded">{s.status}</span>
                  </div>
                  <p className="text-zinc-400 text-xs mt-1">{s.userImpact}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {high.length > 0 && (
          <div>
            <h4 className="text-amber-500 text-xs font-bold uppercase tracking-wider mb-2">High Ambiguity</h4>
            <div className="space-y-2">
              {high.map((s, i) => (
                <div key={i} className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg">
                  <div className="flex justify-between items-start">
                    <span className="text-amber-400 font-medium text-sm">{s.label}</span>
                    <span className="bg-amber-500/20 text-amber-400 text-xs px-2 py-0.5 rounded">{s.status}</span>
                  </div>
                  <p className="text-zinc-400 text-xs mt-1">{s.userImpact}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {medium.length > 0 && (
          <div>
            <h4 className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">Medium Ambiguity</h4>
            <div className="space-y-2">
              {medium.map((s, i) => (
                <div key={i} className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-lg">
                  <div className="flex justify-between items-start">
                    <span className="text-blue-400 font-medium text-sm">{s.label}</span>
                    <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-0.5 rounded">{s.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
