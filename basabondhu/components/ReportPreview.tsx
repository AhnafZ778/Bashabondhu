"use client";

import React, { useRef, useState } from "react";
import { HousingReport, ScoredListing, ChecklistSection } from "@/lib/types";
import VerdictBadge from "./VerdictBadge";
import { motion } from "framer-motion";
import { 
  FileText, 
  MapPin, 
  Search, 
  Home, 
  Coins, 
  AlertTriangle, 
  HelpCircle, 
  CheckSquare, 
  ThumbsUp, 
  Printer, 
  Link2, 
  Check, 
  User 
} from "lucide-react";

type ReportPreviewProps = {
  report: HousingReport;
};

export default function ReportPreview({ report }: ReportPreviewProps) {
  const reportRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div ref={reportRef} className="max-w-3xl mx-auto px-4 py-8 space-y-8 select-none print:py-0 print:px-0">
      {/* Header */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center pb-8 border-b-2 border-[#C9952B] space-y-4 print:pb-4"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#C9952B]/10 border border-[#C9952B]/20 rounded-full text-[10px] font-black uppercase tracking-widest text-[#C9952B]">
          <FileText className="w-3.5 h-3.5" />
          Insight Housing Report
        </div>
        
        <h1 className="text-3xl font-black text-text-main uppercase tracking-wider print:text-2xl">
          BasaBondhu Report
        </h1>
        
        <p className="text-xs text-text-muted">
          Generated: {new Date(report.generatedAt).toLocaleDateString("en-GB", {
            day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
          })}
        </p>

        {/* Action buttons - hidden in print */}
        <div className="flex gap-3 justify-center pt-2 print:hidden">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-secondary text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Print / PDF
          </button>
          
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 px-5 py-2.5 bg-card border border-border-light hover:bg-black/[0.02] text-text-main text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-xs active:scale-95 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-500" />
                Copied!
              </>
            ) : (
              <>
                <Link2 className="w-4 h-4" />
                Copy Link
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* Section 1: Profile Summary */}
      <ReportSection title="Your Profile" icon={User} delay={0.1}>
        <p className="text-xs sm:text-sm text-text-main leading-relaxed font-medium bg-black/[0.01] p-4 rounded-2xl border border-black/[0.02]">
          {report.profileSummary}
        </p>
      </ReportSection>

      {/* Section 2: Recommended Areas */}
      {report.recommendedAreas && report.recommendedAreas.length > 0 && (
        <ReportSection title="Recommended Areas" icon={MapPin} delay={0.15}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {report.recommendedAreas.map(area => (
              <div
                key={area.id}
                className="p-4 bg-card border border-border-light rounded-2xl transition-all duration-300 hover:border-[#C9952B]/40"
              >
                <div className="font-extrabold text-text-main text-xs uppercase tracking-wider">{area.name}</div>
                <div className="text-[10px] text-text-muted mt-1 font-bold">
                  {area.rentRange} • {area.bestFor[0]}
                </div>
              </div>
            ))}
          </div>
        </ReportSection>
      )}

      {/* Section 3: Scan Summary */}
      <ReportSection title="Scan Summary" icon={Search} delay={0.2}>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <StatCard label="Scanned" value={report.scanSummary.scanned} type="blue" />
          <StatCard label="Over Budget" value={report.scanSummary.removedBudget} type="red" />
          <StatCard label="Bad Commute" value={report.scanSummary.removedCommute} type="orange" />
          <StatCard label="Hidden Cost" value={report.scanSummary.removedHiddenCost} type="yellow" />
          <StatCard label="Selected" value={report.scanSummary.selected} type="green" />
        </div>
      </ReportSection>

      {/* Section 4: Top Listings */}
      <ReportSection title="Top Listings" icon={Home} delay={0.25}>
        <div className="space-y-4">
          {report.topListings.map((listing, i) => (
            <ListingCard key={listing.id} listing={listing} rank={i + 1} />
          ))}
        </div>
      </ReportSection>

      {/* Section 5: Cost Comparison */}
      {report.costSummaries && report.costSummaries.length > 0 && (
        <ReportSection title="First-Month Costs" icon={Coins} delay={0.3}>
          <div className="overflow-x-auto border border-border-light rounded-2xl bg-card">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-border-light bg-black/[0.01]">
                  <th className="p-4 font-black uppercase tracking-wider text-text-muted text-[10px]">Listing</th>
                  <th className="p-4 font-black uppercase tracking-wider text-text-muted text-[10px]">Rent</th>
                  <th className="p-4 font-black uppercase tracking-wider text-text-muted text-[10px]">Advance</th>
                  <th className="p-4 font-black uppercase tracking-wider text-text-muted text-[10px]">Broker</th>
                  <th className="p-4 font-black uppercase tracking-wider text-text-muted text-[10px]">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.03]">
                {report.topListings.map((listing, i) => {
                  const cost = report.costSummaries[i];
                  if (!cost) return null;
                  return (
                    <tr key={listing.id} className="hover:bg-black/[0.01] transition-colors">
                      <td className="p-4 font-bold text-text-main truncate max-w-[180px]">{listing.title}</td>
                      <td className="p-4 font-semibold text-text-main">৳{cost.rent.toLocaleString()}</td>
                      <td className="p-4 font-semibold text-text-main">৳{cost.advance.toLocaleString()}</td>
                      <td className="p-4 font-semibold text-text-main">৳{cost.brokerFee.toLocaleString()}</td>
                      <td className="p-4 font-black text-primary">৳{cost.total.toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </ReportSection>
      )}

      {/* Section 6: Risks */}
      {report.mainRisks && report.mainRisks.length > 0 && (
        <ReportSection title="Key Risks" icon={AlertTriangle} delay={0.35}>
          <div className="space-y-2.5">
            {report.mainRisks.map((risk, i) => (
              <div key={i} className="flex gap-2.5 items-start bg-rose-500/5 border border-rose-500/10 p-3 rounded-xl">
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span className="text-xs font-semibold text-text-main leading-relaxed">{risk}</span>
              </div>
            ))}
          </div>
        </ReportSection>
      )}

      {/* Section 7: Questions */}
      {report.questionsToAsk && report.questionsToAsk.length > 0 && (
        <ReportSection title="Questions to Ask" icon={HelpCircle} delay={0.4}>
          <div className="space-y-3">
            {report.questionsToAsk.map((q, i) => (
              <div key={i} className="flex gap-3 items-start bg-black/[0.01] border border-black/[0.03] p-3 rounded-xl">
                <div className="w-5 h-5 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-black text-[10px] shrink-0">
                  {i + 1}
                </div>
                <span className="text-xs font-semibold text-text-main leading-relaxed">{q}</span>
              </div>
            ))}
          </div>
        </ReportSection>
      )}

      {/* Section 8: Visit Checklist */}
      {report.visitChecklist && report.visitChecklist.length > 0 && (
        <ReportSection title="Visit Checklist" icon={CheckSquare} delay={0.45}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {report.visitChecklist.slice(0, 4).map((section, i) => (
              <ChecklistSectionView key={i} section={section} />
            ))}
          </div>
        </ReportSection>
      )}

      {/* Section 9: Final Recommendation */}
      <ReportSection title="Final Recommendation" icon={ThumbsUp} delay={0.5}>
        <div className="p-6 bg-gradient-to-br from-emerald-500/5 to-emerald-600/10 border border-emerald-500/15 rounded-3xl flex gap-4 items-start shadow-xs">
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-2xl shrink-0">
            <ThumbsUp className="w-5 h-5" />
          </div>
          <p className="text-xs sm:text-sm leading-relaxed text-emerald-800 dark:text-emerald-300 font-semibold mt-1">
            {report.finalRecommendation}
          </p>
        </div>
      </ReportSection>

      {/* Footer */}
      <div className="text-center pt-8 border-t border-border-light text-[10px] text-text-muted font-bold uppercase tracking-wider space-y-1 print:pt-4">
        <p>BasaBondhu — Dhaka House-Hunting Helper</p>
        <p className="normal-case font-medium text-text-muted/70">
          This report is synthesized from custom renter profile matches and is designed for guidance purposes.
        </p>
      </div>
    </div>
  );
}

// Sub-components

function ReportSection({ 
  title, 
  icon: Icon, 
  delay, 
  children 
}: { 
  title: string; 
  icon: React.ComponentType<{ className?: string }>; 
  delay: number; 
  children: React.ReactNode 
}) {
  return (
    <motion.section
      initial={{ y: 15, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.4 }}
      className="bg-card border border-border-light rounded-3xl p-6 shadow-xs space-y-4 transition-colors duration-300 print:border-none print:shadow-none print:p-0"
    >
      <div className="flex items-center gap-2 pb-3 border-b border-border-light">
        <Icon className="w-4 h-4 text-[#C9952B]" />
        <h2 className="text-xs font-black uppercase text-text-main tracking-wider">{title}</h2>
      </div>
      {children}
    </motion.section>
  );
}

function StatCard({ 
  label, 
  value, 
  type 
}: { 
  label: string; 
  value: number; 
  type: "blue" | "red" | "orange" | "yellow" | "green" 
}) {
  const colorMap = {
    blue: "bg-blue-500/5 border-blue-500/10 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
    red: "bg-rose-500/5 border-rose-500/10 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
    orange: "bg-amber-500/5 border-amber-500/10 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
    yellow: "bg-yellow-500/5 border-yellow-500/10 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400",
    green: "bg-emerald-500/5 border-emerald-500/10 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
  };

  return (
    <div className={`p-4 border rounded-2xl text-center space-y-1 shadow-xs transition-all duration-300 ${colorMap[type]}`}>
      <div className="text-2xl font-black">{value}</div>
      <div className="text-[9px] uppercase tracking-wider font-extrabold opacity-80">{label}</div>
    </div>
  );
}

function ListingCard({ listing, rank }: { listing: ScoredListing; rank: number }) {
  const rankColors = rank === 1 ? "bg-gold text-white" : rank === 2 ? "bg-slate-400 text-white" : "bg-amber-700 text-white";

  return (
    <div className="flex gap-4 p-5 bg-card border border-border-light rounded-2xl transition-all duration-300 hover:border-[#C9952B]/40">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${rankColors}`}>
        #{rank}
      </div>
      
      <div className="space-y-2 flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="font-extrabold text-text-main text-sm truncate">{listing.title}</h3>
          <VerdictBadge verdict={listing.verdict} size="sm" />
        </div>
        
        <div className="text-[10px] text-text-muted font-bold uppercase tracking-wider">
          {listing.area} • ৳{listing.rent.toLocaleString()}/mo • Fit Score: {listing.scores.total}/100
        </div>
        
        <p className="text-xs text-text-main leading-relaxed font-semibold">
          {listing.whyItFits}
        </p>
      </div>
    </div>
  );
}

function ChecklistSectionView({ section }: { section: ChecklistSection }) {
  return (
    <div className="space-y-3 bg-black/[0.01] border border-black/[0.02] p-4 rounded-2xl">
      <h4 className="font-extrabold text-text-main text-xs uppercase tracking-wider border-b border-black/[0.03] pb-2">
        {section.category}
      </h4>
      <div className="space-y-2.5">
        {section.items.slice(0, 3).map((item, i) => (
          <div key={i} className="flex gap-2.5 items-start text-xs text-text-main font-semibold leading-relaxed">
            <span className="text-[#C9952B] mt-0.5 shrink-0">☐</span>
            <span>
              <strong className="text-text-main">{item.label}</strong> — {item.description}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
