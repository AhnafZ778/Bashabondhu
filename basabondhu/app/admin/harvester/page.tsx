"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Database, FileText, Search, Shield, Zap, BarChart3,
  CheckCircle2, AlertTriangle, Clock, TrendingUp, RefreshCw,
  ArrowLeft, Play, Upload, Globe, Layers, Eye, XCircle,
  ChevronRight, Activity, Award
} from "lucide-react";
import Link from "next/link";

/* ── Types ── */
type Stats = {
  totalRawDocuments: number; totalParsedListings: number;
  totalPublishedListings: number; totalDuplicatesRemoved: number;
  totalHiddenCostWarnings: number; totalStaleListings: number;
  totalChunksCreated: number; totalBestDealsSelected: number;
  totalAreaProfilesMatched: number; totalNeedsReview: number;
  confidenceDistribution: { high: number; medium: number; low: number };
  freshnessDistribution: { fresh: number; aging: number; stale: number; expired: number };
};

type ReviewItem = {
  id: string; listingId: string; rawTextPreview: string;
  area?: string; rent?: number; confidenceScore: number;
  missingFields: string[]; redFlags: string[]; reason: string;
  status: string;
};

type PipelineStep = {
  label: string; status: "pending" | "running" | "completed" | "failed";
  detail?: string;
};

type PublishedListing = {
  id: string; title: string; area: string; rent: number;
  listingTrust: string; freshnessStatus: string; bestDealLabel?: string;
  sourceId: string; status: string; bestDealScore?: number;
};

/* ── Constants ── */
const SOURCE_CARDS = [
  { id: "user-paste", label: "User Paste", icon: FileText, color: "#6366f1", count: 34 },
  { id: "partner-csv", label: "Partner CSV", icon: Upload, color: "#8b5cf6", count: 28 },
  { id: "google-sheet", label: "Google Sheet", icon: Layers, color: "#a855f7", count: 15 },
  { id: "public-url", label: "Public URL", icon: Globe, color: "#ec4899", count: 12 },
  { id: "cached-crawl", label: "Cached Crawl", icon: Database, color: "#f43f5e", count: 8 },
  { id: "osm-area", label: "OSM Area Data", icon: Search, color: "#14b8a6", count: 10 },
];

const PIPELINE_STEPS: PipelineStep[] = [
  { label: "Fetching source", status: "completed" },
  { label: "Saving raw document", status: "completed" },
  { label: "Normalizing Banglish text", status: "completed" },
  { label: "Extracting listing fields", status: "completed" },
  { label: "Removing duplicates", status: "completed" },
  { label: "Matching area profile", status: "completed" },
  { label: "Detecting hidden costs", status: "completed" },
  { label: "Building RAG chunks", status: "completed" },
  { label: "Publishing listings", status: "completed" },
];

/* ── Animated Counter ── */
function Counter({ value, duration = 1.5 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = value;
    const step = Math.ceil(end / (duration * 60));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(start);
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [value, duration]);
  return <span>{count.toLocaleString()}</span>;
}

/* ── Main Page ── */
export default function HarvesterDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [reviewQueue, setReviewQueue] = useState<ReviewItem[]>([]);
  const [published, setPublished] = useState<PublishedListing[]>([]);
  const [pipelineRunning, setPipelineRunning] = useState(false);
  const [pipelineSteps, setPipelineSteps] = useState<PipelineStep[]>([]);
  const [pasteText, setPasteText] = useState("");
  const [pasteResult, setPasteResult] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    fetch("/api/harvester/stats").then(r => r.json()).then(d => setStats(d.stats)).catch(() => {});
    fetch("/api/harvester/review-queue").then(r => r.json()).then(d => setReviewQueue(d.queue || [])).catch(() => {});
    fetch("/api/harvester/published-listings").then(r => r.json()).then(d => setPublished(d.listings || [])).catch(() => {});
  }, []);

  const runPipeline = async () => {
    setPipelineRunning(true);
    const steps: PipelineStep[] = PIPELINE_STEPS.map(s => ({ ...s, status: "pending" }));
    setPipelineSteps(steps);
    for (let i = 0; i < steps.length; i++) {
      await new Promise(r => setTimeout(r, 300 + Math.random() * 400));
      steps[i].status = "completed";
      setPipelineSteps([...steps]);
    }
    setPipelineRunning(false);
    // Refresh stats
    fetch("/api/harvester/stats").then(r => r.json()).then(d => setStats(d.stats)).catch(() => {});
  };

  const handleUserPaste = async () => {
    if (!pasteText.trim()) return;
    setPasteResult(null);
    const res = await fetch("/api/harvester/user-paste", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rawText: pasteText }),
    });
    const data = await res.json();
    setPasteResult(data);
    // Refresh
    fetch("/api/harvester/stats").then(r => r.json()).then(d => setStats(d.stats)).catch(() => {});
    fetch("/api/harvester/published-listings").then(r => r.json()).then(d => setPublished(d.listings || [])).catch(() => {});
  };

  const trustColor = (t: string) => t === "high" ? "#22c55e" : t === "medium" ? "#f59e0b" : "#ef4444";
  const freshColor = (f: string) => f === "fresh" ? "#22c55e" : f === "aging" ? "#f59e0b" : "#ef4444";

  return (
    <div className="min-h-screen text-white p-4 md:p-8 font-sans" style={{ background: "linear-gradient(135deg, #0a0a1a 0%, #0f0f2e 50%, #0a0a1a 100%)" }}>
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors"><ArrowLeft size={20} /></Link>
          <div className="h-8 w-1 rounded-full" style={{ background: "linear-gradient(180deg, #e54a65, #c9a96e)" }} />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, #e54a65, #c9a96e)" }}>
              BasaBondhu Data Harvester
            </h1>
            <p className="text-gray-400 text-sm">Turning messy housing sources into clean visit-worthy listings</p>
          </div>
        </div>

        {/* Stats Grid */}
        {stats && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            {[
              { label: "Raw Documents", value: stats.totalRawDocuments, icon: FileText, color: "#6366f1" },
              { label: "Parsed Listings", value: stats.totalParsedListings, icon: Search, color: "#8b5cf6" },
              { label: "Published", value: stats.totalPublishedListings, icon: CheckCircle2, color: "#22c55e" },
              { label: "Duplicates Removed", value: stats.totalDuplicatesRemoved, icon: Layers, color: "#f59e0b" },
              { label: "Hidden-Cost Warnings", value: stats.totalHiddenCostWarnings, icon: AlertTriangle, color: "#ef4444" },
              { label: "Area Profiles Matched", value: stats.totalAreaProfilesMatched, icon: Globe, color: "#14b8a6" },
              { label: "RAG Chunks", value: stats.totalChunksCreated, icon: Database, color: "#a855f7" },
              { label: "Best Deals Selected", value: stats.totalBestDealsSelected, icon: Award, color: "#c9a96e" },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="rounded-xl p-4 border border-white/5" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <s.icon size={16} style={{ color: s.color }} />
                  <span className="text-xs text-gray-400">{s.label}</span>
                </div>
                <div className="text-2xl font-bold" style={{ color: s.color }}>
                  <Counter value={s.value} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Source Cards */}
        <h2 className="text-lg font-semibold mt-8 mb-3 flex items-center gap-2">
          <Zap size={18} className="text-yellow-400" /> Data Sources
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {SOURCE_CARDS.map((src, i) => (
            <motion.div key={src.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
              className="rounded-xl p-4 border border-white/5 hover:border-white/15 transition-all cursor-pointer group"
              style={{ background: "rgba(255,255,255,0.03)" }}>
              <src.icon size={20} style={{ color: src.color }} className="mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-sm font-medium">{src.label}</div>
              <div className="text-xs text-gray-500 mt-1">{src.count} records</div>
              <div className="flex items-center gap-1 mt-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[10px] text-green-400">Active</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Run Panel + User Paste */}
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          {/* Run Panel */}
          <div className="rounded-xl p-5 border border-white/5" style={{ background: "rgba(255,255,255,0.03)" }}>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Play size={16} className="text-green-400" /> Run Harvester
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Run Demo Pipeline", action: runPipeline, icon: RefreshCw },
                { label: "Import CSV", action: () => {}, icon: Upload },
                { label: "Extract URL", action: () => {}, icon: Globe },
                { label: "Build RAG Chunks", action: () => {}, icon: Database },
              ].map(btn => (
                <button key={btn.label} onClick={btn.action}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium border border-white/10 hover:border-white/25 hover:bg-white/5 transition-all">
                  <btn.icon size={14} /> {btn.label}
                </button>
              ))}
            </div>

            {/* Pipeline Progress */}
            <AnimatePresence>
              {pipelineSteps.length > 0 && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-4 space-y-1.5 overflow-hidden">
                  {pipelineSteps.map((step, i) => (
                    <motion.div key={i} initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-2 text-xs">
                      {step.status === "completed" ? <CheckCircle2 size={14} className="text-green-400" /> :
                       step.status === "running" ? <RefreshCw size={14} className="text-blue-400 animate-spin" /> :
                       <div className="w-3.5 h-3.5 rounded-full border border-gray-600" />}
                      <span className={step.status === "completed" ? "text-green-300" : step.status === "running" ? "text-blue-300" : "text-gray-500"}>
                        {step.label}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Paste */}
          <div className="rounded-xl p-5 border border-white/5" style={{ background: "rgba(255,255,255,0.03)" }}>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <FileText size={16} className="text-indigo-400" /> Paste a Listing
            </h3>
            <textarea value={pasteText} onChange={e => setPasteText(e.target.value)}
              placeholder="Paste a messy Banglish housing listing here..."
              className="w-full h-24 bg-black/30 border border-white/10 rounded-lg p-3 text-sm text-gray-200 placeholder-gray-600 resize-none focus:outline-none focus:border-indigo-500/50" />
            <button onClick={handleUserPaste} disabled={!pasteText.trim()}
              className="mt-2 w-full py-2.5 rounded-lg text-sm font-medium transition-all disabled:opacity-30"
              style={{ background: "linear-gradient(135deg, #e54a65, #c9a96e)" }}>
              Extract & Analyze
            </button>

            {pasteResult && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 p-3 rounded-lg bg-black/30 border border-white/10 text-xs space-y-1">
                <div className="flex items-center gap-2">
                  {(pasteResult as any).ok ? <CheckCircle2 size={14} className="text-green-400" /> : <XCircle size={14} className="text-red-400" />}
                  <span className="font-medium">{(pasteResult as any).ok ? "Listing Extracted" : "Extraction Failed"}</span>
                  <span className="ml-auto text-gray-400">
                    Confidence: {Math.round(((pasteResult as any).confidenceScore as number || 0) * 100)}%
                  </span>
                </div>
                {(pasteResult as any).verdict && (
                  <div className="mt-1 px-2 py-1 rounded inline-block text-[10px] font-bold uppercase"
                    style={{ background: (pasteResult as any).verdict === "visit" ? "#22c55e20" : (pasteResult as any).verdict === "call_first" ? "#f59e0b20" : "#ef444420",
                             color: (pasteResult as any).verdict === "visit" ? "#22c55e" : (pasteResult as any).verdict === "call_first" ? "#f59e0b" : "#ef4444" }}>
                    {String((pasteResult as any).verdict).replace("_", " ")}
                  </div>
                )}
                {Array.isArray((pasteResult as any).missingFields) && ((pasteResult as any).missingFields as string[]).length > 0 && (
                  <div className="text-yellow-400/70 mt-1">Missing: {((pasteResult as any).missingFields as string[]).join(", ")}</div>
                )}
              </motion.div>
            )}
          </div>
        </div>

        {/* Confidence Distribution */}
        {stats && (
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div className="rounded-xl p-5 border border-white/5" style={{ background: "rgba(255,255,255,0.03)" }}>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <BarChart3 size={16} className="text-purple-400" /> Confidence Distribution
              </h3>
              <div className="space-y-3">
                {[
                  { label: "High", value: stats.confidenceDistribution.high, color: "#22c55e", total: stats.totalParsedListings || 92 },
                  { label: "Medium", value: stats.confidenceDistribution.medium, color: "#f59e0b", total: stats.totalParsedListings || 92 },
                  { label: "Low", value: stats.confidenceDistribution.low, color: "#ef4444", total: stats.totalParsedListings || 92 },
                ].map(b => (
                  <div key={b.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">{b.label}</span>
                      <span style={{ color: b.color }}>{b.value}</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${(b.value / b.total) * 100}%` }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="h-full rounded-full" style={{ background: b.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl p-5 border border-white/5" style={{ background: "rgba(255,255,255,0.03)" }}>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Clock size={16} className="text-teal-400" /> Freshness Status
              </h3>
              <div className="space-y-3">
                {[
                  { label: "Fresh", value: stats.freshnessDistribution.fresh, color: "#22c55e" },
                  { label: "Aging", value: stats.freshnessDistribution.aging, color: "#f59e0b" },
                  { label: "Stale", value: stats.freshnessDistribution.stale, color: "#f97316" },
                  { label: "Expired", value: stats.freshnessDistribution.expired, color: "#ef4444" },
                ].map(b => (
                  <div key={b.label} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ background: b.color }} />
                    <span className="text-sm text-gray-300 flex-1">{b.label}</span>
                    <span className="text-sm font-mono" style={{ color: b.color }}>{b.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Review Queue */}
        <h2 className="text-lg font-semibold mt-8 mb-3 flex items-center gap-2">
          <Shield size={18} className="text-orange-400" /> Review Queue
          <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400">{reviewQueue.length}</span>
        </h2>
        <div className="rounded-xl border border-white/5 overflow-hidden" style={{ background: "rgba(255,255,255,0.02)" }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-gray-400 text-xs">
                  <th className="text-left p-3">Preview</th>
                  <th className="text-left p-3">Area</th>
                  <th className="text-left p-3">Rent</th>
                  <th className="text-left p-3">Confidence</th>
                  <th className="text-left p-3">Issues</th>
                  <th className="text-left p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {reviewQueue.map(item => (
                  <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-3 text-xs text-gray-300 max-w-[200px] truncate">{item.rawTextPreview}</td>
                    <td className="p-3 text-xs">{item.area || "—"}</td>
                    <td className="p-3 text-xs">{item.rent ? `৳${item.rent.toLocaleString()}` : "—"}</td>
                    <td className="p-3">
                      <span className="text-xs font-mono" style={{ color: item.confidenceScore >= 0.7 ? "#22c55e" : item.confidenceScore >= 0.5 ? "#f59e0b" : "#ef4444" }}>
                        {Math.round(item.confidenceScore * 100)}%
                      </span>
                    </td>
                    <td className="p-3 text-xs text-red-400/70">{item.redFlags.slice(0, 2).join(", ")}</td>
                    <td className="p-3 flex gap-1">
                      <button className="px-2 py-1 rounded text-[10px] bg-green-500/20 text-green-400 hover:bg-green-500/30">Approve</button>
                      <button className="px-2 py-1 rounded text-[10px] bg-red-500/20 text-red-400 hover:bg-red-500/30">Reject</button>
                    </td>
                  </tr>
                ))}
                {reviewQueue.length === 0 && (
                  <tr><td colSpan={6} className="p-6 text-center text-gray-500 text-xs">No items in review queue</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Published Listings */}
        <h2 className="text-lg font-semibold mt-8 mb-3 flex items-center gap-2">
          <TrendingUp size={18} className="text-green-400" /> Recently Published
        </h2>
        <div className="rounded-xl border border-white/5 overflow-hidden" style={{ background: "rgba(255,255,255,0.02)" }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-gray-400 text-xs">
                  <th className="text-left p-3">Title</th>
                  <th className="text-left p-3">Area</th>
                  <th className="text-left p-3">Rent</th>
                  <th className="text-left p-3">Source</th>
                  <th className="text-left p-3">Trust</th>
                  <th className="text-left p-3">Freshness</th>
                  <th className="text-left p-3">Deal</th>
                </tr>
              </thead>
              <tbody>
                {published.map((listing, i) => (
                  <motion.tr key={listing.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-3 text-xs font-medium max-w-[200px] truncate">{listing.title}</td>
                    <td className="p-3 text-xs text-gray-300">{listing.area}</td>
                    <td className="p-3 text-xs">৳{listing.rent?.toLocaleString()}</td>
                    <td className="p-3 text-xs text-gray-400">{listing.sourceId?.replace("src-", "")}</td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full"
                        style={{ background: trustColor(listing.listingTrust) + "20", color: trustColor(listing.listingTrust) }}>
                        <Eye size={10} /> {listing.listingTrust}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full"
                        style={{ background: freshColor(listing.freshnessStatus) + "20", color: freshColor(listing.freshnessStatus) }}>
                        {listing.freshnessStatus}
                      </span>
                    </td>
                    <td className="p-3">
                      {listing.bestDealLabel && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 font-medium">
                          {listing.bestDealLabel}
                        </span>
                      )}
                    </td>
                  </motion.tr>
                ))}
                {published.length === 0 && (
                  <tr><td colSpan={7} className="p-6 text-center text-gray-500 text-xs">No published listings yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pb-8 text-center text-xs text-gray-600">
          <Activity size={14} className="inline mr-1" />
          BasaBondhu Data Harvester v1.0 — Real-world housing intelligence pipeline
        </div>
      </div>
    </div>
  );
}
