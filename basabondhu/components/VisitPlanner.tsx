"use client";

import React from "react";
import { useSearch } from "@/context/SearchContext";
import { PhoneCall, Calendar, AlertTriangle, FileText, CheckCircle } from "lucide-react";

export default function VisitPlanner() {
  const { profile, scoredListings } = useSearch();

  if (!profile) return null;

  // Filter listings that are suitable to visit (verdict is "visit" or "maybe")
  const visitListings = scoredListings
    .filter((l) => l.verdict === "visit" || l.verdict === "maybe")
    .slice(0, 3);

  return (
    <div className="w-full space-y-6 transition-colors duration-300">
      <div className="flex items-center gap-1.5 mb-2">
        <PhoneCall className="w-4 h-4 text-[#C9952B]" />
        <h2 className="text-xs font-black uppercase text-slate-800 tracking-wider">Visit Planner & Scripts</h2>
      </div>

      {visitListings.length === 0 ? (
        <div className="bg-card border border-border-light rounded-3xl p-8 text-center shadow-xs transition-colors duration-300">
          <Calendar className="w-10 h-10 text-[#C9952B]/20 mx-auto mb-3" />
          <h3 className="font-sans uppercase tracking-wider text-xs font-bold text-text-main">No Shortlisted Homes</h3>
          <p className="text-[11px] text-text-muted mt-1 max-w-xs mx-auto">
            Select listings from top recommendations to generate verification scripts.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Column 1 & 2: Scripts and listings */}
          <div className="lg:col-span-8 space-y-6">
            {visitListings.map((l, idx) => {
              return (
                <div key={l.id} className="bg-card border border-border-light rounded-3xl p-5 shadow-xs space-y-4 transition-colors duration-300">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] uppercase font-extrabold bg-[#C9952B]/10 text-[#C9952B] px-2.5 py-1 rounded-md border border-[#C9952B]/20">
                        Script #{idx + 1}
                      </span>
                      <h3 className="font-bold text-text-main text-sm mt-2 leading-tight">{l.title}</h3>
                      <p className="text-[11px] text-text-muted">{l.area} • ৳{l.rent.toLocaleString()}/mo</p>
                    </div>
                    <span className="text-[10px] font-extrabold text-[#C9952B] bg-[#C9952B]/5 border border-[#C9952B]/20 px-2 py-0.5 rounded-md">
                      {l.scores.total}% Fit
                    </span>
                  </div>

                  {/* Banglish call script */}
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-[11px] leading-relaxed font-mono text-text-main">
                    <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-slate-200/50">
                      <PhoneCall className="w-3.5 h-3.5 text-[#C9952B]" />
                      <span className="font-black text-[#C9952B] uppercase tracking-wider text-[10px]">Call Script</span>
                    </div>
                    <p className="italic text-slate-700">
                      &ldquo;Assalamu Alaikum. Ami flat er post ti dekhe call korlam. Shifting plan korchi family/bachelor shathe. 
                      Flat a ki Govt gas connection ache naki cylinder? R service charge {l.serviceChargeKnown && l.serviceCharge ? `৳${l.serviceCharge.toLocaleString()}` : "koto fixed"}? 
                      Amra flat ti visit korte chaile kobe shubidha hobe?&rdquo;
                    </p>
                  </div>

                  {/* Specific warning checklist */}
                  <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-3.5 text-xs text-amber-800 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold mb-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span className="text-[11px] font-black uppercase tracking-wider">Verify before signing:</span>
                    </div>
                    <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                      <li>Refundability of the {l.advanceMonths}-month advance (৳{(l.rent * l.advanceMonths).toLocaleString()}).</li>
                      {l.gasType === "cylinder" && <li>Who pays for the cylinder refills.</li>}
                      {l.waterloggingRisk === "high" && <li>Waterlogging level in the alley during heavy rains.</li>}
                      {!l.generator && <li>IPS backup capacity for fan & light.</li>}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Column 3: Global Shifting checklist */}
          <div className="lg:col-span-4 bg-slate-50 border border-slate-200/80 rounded-3xl p-5 shadow-xs space-y-4 h-fit">
            <div className="flex items-center gap-1.5 pb-2 border-b border-slate-200">
              <FileText className="w-4 h-4 text-[#C9952B]" />
              <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider">Physical Visit</h3>
            </div>

            <div className="space-y-3.5 text-xs text-text-main">
              <div className="flex items-start gap-2.5">
                <div className="w-3.5 h-3.5 rounded border border-slate-300 flex items-center justify-center shrink-0 mt-0.5 bg-white">
                  <CheckCircle className="w-2.5 h-2.5 text-[#C9952B] opacity-0 hover:opacity-100 transition-opacity" />
                </div>
                <div>
                  <span className="font-bold text-text-main text-[11px] block">Water Quality & Pressure</span>
                  <p className="text-[10px] text-text-muted mt-0.5 leading-normal">Turn on taps. Check iron levels and flow pressure.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-3.5 h-3.5 rounded border border-slate-300 flex items-center justify-center shrink-0 mt-0.5 bg-white">
                  <CheckCircle className="w-2.5 h-2.5 text-[#C9952B] opacity-0 hover:opacity-100 transition-opacity" />
                </div>
                <div>
                  <span className="font-bold text-text-main text-[11px] block">Electricity Meters</span>
                  <p className="text-[10px] text-text-muted mt-0.5 leading-normal">Verify pre-paid electric meter tariff rates.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-3.5 h-3.5 rounded border border-slate-300 flex items-center justify-center shrink-0 mt-0.5 bg-white">
                  <CheckCircle className="w-2.5 h-2.5 text-[#C9952B] opacity-0 hover:opacity-100 transition-opacity" />
                </div>
                <div>
                  <span className="font-bold text-text-main text-[11px] block">Night Security</span>
                  <p className="text-[10px] text-text-muted mt-0.5 leading-normal">Confirm if alley is well-lit and guarded post 9 PM.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-3.5 h-3.5 rounded border border-slate-300 flex items-center justify-center shrink-0 mt-0.5 bg-white">
                  <CheckCircle className="w-2.5 h-2.5 text-[#C9952B] opacity-0 hover:opacity-100 transition-opacity" />
                </div>
                <div>
                  <span className="font-bold text-text-main text-[11px] block">DMP Verification Form</span>
                  <p className="text-[10px] text-text-muted mt-0.5 leading-normal">Confirm if police verification form is required.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
