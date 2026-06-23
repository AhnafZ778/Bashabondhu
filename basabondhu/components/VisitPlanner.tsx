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
      <div className="flex items-center gap-2 mb-2">
        <PhoneCall className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold text-text-main font-sans">Visit Prep & Landlord Scripts</h2>
      </div>

      {visitListings.length === 0 ? (
        <div className="bg-card border border-border-light rounded-3xl p-8 text-center shadow-sm transition-colors duration-300">
          <Calendar className="w-12 h-12 text-primary/20 mx-auto mb-4" />
          <h3 className="font-bold text-base text-text-main">No Shortlisted Homes Yet</h3>
          <p className="text-xs text-text-muted mt-1.5 max-w-sm mx-auto">
            Run the guided search and select listings that are &quot;Visit Worthy&quot; or &quot;Maybe&quot; to generate custom call scripts.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Column 1 & 2: Scripts and listings */}
          <div className="md:col-span-2 space-y-6">
            {visitListings.map((l, idx) => {
              return (
                <div key={l.id} className="bg-card border border-border-light rounded-3xl p-5 shadow-sm space-y-4 transition-colors duration-300">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] uppercase font-extrabold bg-primary/10 text-primary px-2.5 py-1 rounded-md border border-primary/20">
                        Option #{idx + 1} script
                      </span>
                      <h3 className="font-bold text-text-main text-base mt-2 leading-tight">{l.title}</h3>
                      <p className="text-xs text-text-muted">{l.area} • ৳{l.rent.toLocaleString()}/mo</p>
                    </div>
                    <span className="text-xs font-extrabold text-gold bg-gold-bg border border-gold/25 px-2.5 py-1 rounded-md">
                      {l.scores.total}% Match
                    </span>
                  </div>

                  {/* Banglish call script */}
                  <div className="bg-bg-alt border border-border-light rounded-2xl p-4 text-xs leading-relaxed font-mono text-text-main">
                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border-light">
                      <PhoneCall className="w-3.5 h-3.5 text-primary" />
                      <span className="font-bold text-primary">Banglish Call Script</span>
                    </div>
                    <p className="italic">
                      &ldquo;Assalamu Alaikum. Ami apnar flat er post ti dekhlam. Shifting plan korchi family/bachelor shathe. 
                      Flat a ki Govt gas connection ache naki cylinder? R service charge {l.serviceChargeKnown && l.serviceCharge ? `৳${l.serviceCharge.toLocaleString()}` : "koto ashte pare fixed"}? 
                      Amra {new Date().toLocaleString('en-US', { month: 'long' })} a visit korte chaile kobe shubidha hobe?&rdquo;
                    </p>
                  </div>

                  {/* Specific warning checklist */}
                  <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-3.5 text-xs text-amber-850 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold mb-1">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      <span>Verify before signing agreement:</span>
                    </div>
                    <ul className="list-disc pl-5 space-y-1 text-[11px] text-amber-800">
                      <li>Verify if the {l.advanceMonths}-month advance (৳{(l.rent * l.advanceMonths).toLocaleString()}) is fully refundable in the contract.</li>
                      {l.gasType === "cylinder" && <li>Confirm who pays for the monthly empty cylinder replacement cylinder.</li>}
                      {l.waterloggingRisk === "high" && <li>Ask neighborhood shopkeepers if water logging rises above the gate level during heavy rain.</li>}
                      {!l.generator && <li>IPS backup settings: Confirm if IPS capacity is sufficient for fan and light during load shedding.</li>}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Column 3: Global Shifting checklist */}
          <div className="bg-primary/5 border border-primary/10 rounded-3xl p-5 shadow-sm space-y-5 h-fit transition-colors duration-300">
            <div className="flex items-center gap-2 pb-3 border-b border-primary/10">
              <FileText className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-sm text-primary">Physical Visit Checklist</h3>
            </div>

            <div className="space-y-4 text-xs text-text-main">
              <div className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded border border-border-light flex items-center justify-center shrink-0 mt-0.5 bg-card">
                  <CheckCircle className="w-3 h-3 text-primary opacity-0 hover:opacity-100 transition-opacity" />
                </div>
                <div>
                  <span className="font-semibold text-text-main block">Check Water Pressure & Quality</span>
                  <p className="text-[10px] text-text-muted mt-0.5">Turn on taps in toilets. Ensure water is clean, iron-free and pressure is good on upper floors.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded border border-border-light flex items-center justify-center shrink-0 mt-0.5 bg-card">
                  <CheckCircle className="w-3 h-3 text-primary opacity-0 hover:opacity-100 transition-opacity" />
                </div>
                <div>
                  <span className="font-semibold text-text-main block">Inspect Electric Load & Meters</span>
                  <p className="text-[10px] text-text-muted mt-0.5">Confirm if pre-paid electric meter is installed and check balance/tariff system.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded border border-border-light flex items-center justify-center shrink-0 mt-0.5 bg-card">
                  <CheckCircle className="w-3 h-3 text-primary opacity-0 hover:opacity-100 transition-opacity" />
                </div>
                <div>
                  <span className="font-semibold text-text-main block">Walk the local alley at night</span>
                  <p className="text-[10px] text-text-muted mt-0.5">Ensure the street is well-lit and secure after 9 PM. Ask guards about safety incidents.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded border border-border-light flex items-center justify-center shrink-0 mt-0.5 bg-card">
                  <CheckCircle className="w-3 h-3 text-primary opacity-0 hover:opacity-100 transition-opacity" />
                </div>
                <div>
                  <span className="font-semibold text-text-main block">Verify Tenant Information Form</span>
                  <p className="text-[10px] text-text-muted mt-0.5">Verify with landlord if DMP (Dhaka Metropolitan Police) verification form is required upon shifting.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
