"use client";

import React, { useState, useEffect } from "react";
import { ScanSummary, SearchProfile, Listing } from "@/lib/types";
import { areas } from "@/lib/data/areas";
import { motion, AnimatePresence } from "framer-motion";
import MapScanner from "./MapScanner";
import { ArrowLeft, BarChart3, Settings2, Sparkles, CheckCircle2 } from "lucide-react";
import { useSearch } from "@/context/SearchContext";

type DemoScanAnimationProps = {
  scanSummary: ScanSummary;
  profile: SearchProfile;
  listings: Listing[];
  onComplete: () => void;
};

type ScanStep = {
  label: string;
  count: number;
  badge: string;
  color: string;
  paramName: string;
};

interface Question {
  id: string;
  question: string;
  options: string[];
  showIf?: (ans: Record<string, string>) => boolean;
}

interface AIPage {
  title: string;
  questions: Question[];
}

function RadarSimulation({ active }: { active: boolean }) {
  return (
    <div className="relative w-28 h-28 flex items-center justify-center bg-zinc-950 border border-zinc-800 rounded-full shadow-inner overflow-hidden mb-6 select-none">
      {/* Conic sweep line */}
      {active ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
          className="absolute inset-0 origin-center"
          style={{
            background: "conic-gradient(from 0deg at 50% 50%, rgba(16, 185, 129, 0.4) 0deg, rgba(16, 185, 129, 0) 90deg)"
          }}
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background: "conic-gradient(from 0deg at 50% 50%, rgba(16, 185, 129, 0.1) 0deg, rgba(16, 185, 129, 0) 90deg)"
          }}
        />
      )}
      
      {/* Grid rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[85%] h-[85%] rounded-full border border-emerald-500/25" />
        <div className="w-[60%] h-[60%] rounded-full border border-emerald-500/15" />
        <div className="w-[35%] h-[35%] rounded-full border border-emerald-500/10" />
      </div>

      {/* Grid lines (crosshairs) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-full h-[1px] bg-emerald-500/10" />
        <div className="h-full w-[1px] bg-emerald-500/10" />
      </div>

      {/* Locked Target dots */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={active ? { opacity: [0.2, 1, 0.2] } : { opacity: 1, scale: [1, 1.1, 1] }}
          transition={active ? { repeat: Infinity, duration: 1.5, delay: 0.2 } : { repeat: Infinity, duration: 2 }}
          className="absolute w-2.5 h-2.5 rounded-full bg-emerald-400 border border-emerald-300 shadow-md shadow-emerald-500/60" 
          style={{ top: "28%", left: "38%" }}
        />
        <motion.div 
          animate={active ? { opacity: [0.1, 0.8, 0.1] } : { opacity: 0.9, scale: [1, 1.1, 1] }}
          transition={active ? { repeat: Infinity, duration: 2, delay: 0.8 } : { repeat: Infinity, duration: 2, delay: 0.5 }}
          className="absolute w-2 h-2 rounded-full bg-emerald-400 border border-emerald-300 shadow-md shadow-emerald-500/60" 
          style={{ top: "62%", left: "68%" }}
        />
        <motion.div 
          animate={active ? { opacity: [0.3, 1, 0.3] } : { opacity: 1, scale: [1, 1.1, 1] }}
          transition={active ? { repeat: Infinity, duration: 1.8, delay: 0.5 } : { repeat: Infinity, duration: 2, delay: 1 }}
          className="absolute w-2.5 h-2.5 rounded-full bg-emerald-400 border border-emerald-300 shadow-md shadow-emerald-500/60" 
          style={{ top: "48%", left: "58%" }}
        />
      </div>

      {/* Radar Center Pin */}
      <div className="relative w-2 h-2 rounded-full bg-emerald-500 border border-white shadow-md z-10 animate-pulse" />
    </div>
  );
}

export default function DemoScanAnimation({ scanSummary, profile, listings, onComplete }: DemoScanAnimationProps) {
  const [hasStartedScan, setHasStartedScan] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showLogistics, setShowLogistics] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [selectedSpeculatorListing, setSelectedSpeculatorListing] = useState<any | null>(null);

  const [activeTab, setActiveTab] = useState<"summary" | "ai">("summary");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [aiResponse, setAiResponse] = useState("");
  const [isRefining, setIsRefining] = useState(false);
  const [refinementSuccess, setRefinementSuccess] = useState(false);
  const [aiStepPage, setAiStepPage] = useState(0);

  const { setRefinedScoredListings } = useSearch();

  const handleRefineSearch = async () => {
    setIsRefining(true);
    try {
      const response = await fetch("/api/search/refine", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          profile,
          answers,
          additionalQuery: aiResponse
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      if (data && data.listings) {
        setRefinedScoredListings(data.listings);
        // Launch scanning animation
        setHasStartedScan(true);
      } else {
        throw new Error("Invalid response format from refinement API");
      }
    } catch (err) {
      console.error("Refinement API failed, using fallback scan triggers:", err);
      // Trigger scan anyway so demo works
      setHasStartedScan(true);
    } finally {
      setIsRefining(false);
    }
  };

  const steps: ScanStep[] = [
    {
      label: `Loading the buildings nearby...`,
      count: scanSummary.scanned,
      badge: "SCAN",
      color: "var(--accent-blue, #3b82f6)",
      paramName: "Loading the buildings...",
    },
    {
      label: `Removed ${scanSummary.removedBudget} over budget`,
      count: scanSummary.removedBudget,
      badge: "BUDGET",
      color: "var(--accent-red, #ef4444)",
      paramName: "Budget Constraints",
    },
    {
      label: `Removed ${scanSummary.removedCommute} bad commute match`,
      count: scanSummary.removedCommute,
      badge: "COMMUTE",
      color: "var(--accent-orange, #f97316)",
      paramName: "Commute Feasibility",
    },
    {
      label: `Removed ${scanSummary.removedHiddenCost} hidden cost risk`,
      count: scanSummary.removedHiddenCost,
      badge: "COSTS",
      color: "var(--accent-yellow, #eab308)",
      paramName: "Hidden Cost Risks",
    },
    {
      label: `Removed ${scanSummary.removedHouseholdMismatch} household mismatch`,
      count: scanSummary.removedHouseholdMismatch,
      badge: "HOUSEHOLD",
      color: "var(--accent-purple, #8b5cf6)",
      paramName: "Household Type Mismatch",
    },
    {
      label: `Found ${scanSummary.selected} homes worth visiting!`,
      count: scanSummary.selected,
      badge: "SELECTED",
      color: "var(--accent-gold, #d4a853)",
      paramName: "Final Selection",
    },
  ];

  // Resolve target area center coordinates
  const targetAreaName = profile.commuteAnchors[0]?.area || "Dhaka";
  const targetArea = areas.find(a => a.name === targetAreaName);
  // Create stable center reference to prevent bubbling from re-renders
  const center = React.useMemo<[number, number]>(() => {
    return targetArea ? [targetArea.latitude, targetArea.longitude] : [23.777176, 90.399452];
  }, [targetArea]);

  // Math safety and progression calculations for points
  const p0 = scanSummary.scanned;
  const p1 = Math.max(0, p0 - scanSummary.removedBudget);
  const p2 = Math.max(0, p1 - scanSummary.removedCommute);
  const p3 = Math.max(0, p2 - scanSummary.removedHiddenCost);
  const p4 = Math.max(0, p3 - scanSummary.removedHouseholdMismatch);
  const p5 = scanSummary.selected;

  const points = [
    { label: "Start", value: p0, desc: "Buildings Loaded", color: "#3b82f6", change: 0 },
    { label: "Budget", value: p1, desc: "Passed Budget Filter", color: "#ef4444", change: -scanSummary.removedBudget },
    { label: "Commute", value: p2, desc: "Passed Commute Filter", color: "#f97316", change: -scanSummary.removedCommute },
    { label: "Hidden Cost", value: p3, desc: "Passed Hidden Cost Check", color: "#eab308", change: -scanSummary.removedHiddenCost },
    { label: "Household", value: p4, desc: "Passed Household Check", color: "#8b5cf6", change: -scanSummary.removedHouseholdMismatch },
    { label: "Final Selection", value: p5, desc: "Homes Worth Visiting", color: "#d4a853", change: p5 - p4 }
  ];

  // Coordinates math
  const width = 500;
  const height = 200;
  const paddingLeft = 50;
  const paddingRight = 30;
  const paddingTop = 30;
  const paddingBottom = 40;

  const getX = (index: number) => {
    return paddingLeft + index * ((width - paddingLeft - paddingRight) / (points.length - 1));
  };

  const getY = (val: number) => {
    return height - paddingBottom - (val / p0) * (height - paddingTop - paddingBottom);
  };

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(p.value)}`).join(' ');
  const areaPath = `${linePath} L ${getX(points.length - 1)} ${height - paddingBottom} L ${getX(0)} ${height - paddingBottom} Z`;


  // Progress through steps
  useEffect(() => {
    if (!hasStartedScan) return;

    if (currentStep >= steps.length) {
      setIsComplete(true);
      // Removed automatic transition
      return;
    }

    const delay = currentStep === 0 ? 4000 : 3500;
    const timer = setTimeout(() => {
      setCurrentStep(prev => prev + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [currentStep, steps.length, hasStartedScan]);

  const localSchools = targetArea?.topSchools || ["Scholastica", "Sunnydale", "Maple Leaf", "St. Joseph", "Sunbeams"];
  const localHospitals = targetArea?.topHospitals || ["Labaid Hospital", "Evercare Hospital", "Square Hospital", "United Hospital"];

  const hasKids = answers.familyStatus === "Married (With kids)" || answers.familyStatus === "Joint Family";

  const handleNextStep = () => {
    if (aiStepPage === 0) {
      if (hasKids) {
        setAiStepPage(1);
      } else {
        setAiStepPage(2);
      }
    } else if (aiStepPage === 1) {
      setAiStepPage(2);
    }
  };

  const handlePrevStep = () => {
    if (aiStepPage === 2) {
      if (hasKids) {
        setAiStepPage(1);
      } else {
        setAiStepPage(0);
      }
    } else if (aiStepPage === 1) {
      setAiStepPage(0);
    }
  };

  const displayStepNum = !hasKids && aiStepPage === 2 ? 2 : aiStepPage + 1;
  const displayTotalSteps = hasKids ? 3 : 2;

  const aiPages: AIPage[] = [
    {
      title: "1. Occupation & Family",
      questions: [
        {
          id: "jobType",
          question: "What is your primary employment type & regularity?",
          options: ["Corporate (Regular 9-5)", "Govt. Officer (Regular)", "Business Owner (Flexible)", "Freelancer (Project-based)", "Student (Academic)"]
        },
        {
          id: "familyStatus",
          question: "What is your household marital & family status?",
          options: ["Single / Bachelor", "Married (No kids)", "Married (With kids)", "Joint Family"]
        },
        {
          id: "spouseJob",
          question: "Is your spouse/partner currently employed?",
          options: ["Yes (Corporate/Regular)", "Yes (Flexible/Remote)", "No (Homemaker)", "Not Applicable"],
          showIf: (ans) => !!ans.familyStatus && ans.familyStatus !== "Single / Bachelor"
        },
        {
          id: "seniorPresent",
          question: "Are senior citizens / elderly family members present?",
          options: ["Yes, present", "No, just ourselves"],
          showIf: (ans) => !!ans.familyStatus && ans.familyStatus !== "Single / Bachelor"
        }
      ]
    },
    {
      title: "2. Kids & Education",
      questions: [
        {
          id: "kidsCount",
          question: "How many children do you have?",
          options: ["1 Child", "2 Children", "3+ Children"]
        },
        {
          id: "schoolTransfer",
          question: "Will you transfer your children to schools in this area?",
          options: ["Yes, will transfer", "No, keep current school"]
        },
        {
          id: "targetSchool",
          question: `Which school in ${targetAreaName} are you considering?`,
          options: [...localSchools.slice(0, 4), "Other / Private Tutor"],
          showIf: (ans) => ans.schoolTransfer === "Yes, will transfer"
        }
      ]
    },
    {
      title: "3. Logistics & Preferences",
      questions: [
        {
          id: "vehiclesCount",
          question: "How many personal vehicles do you have?",
          options: ["None (0)", "1 Vehicle", "2+ Vehicles"]
        },
        {
          id: "parkingSpaces",
          question: "How many parking spaces do you need?",
          options: ["No parking needed", "1 Space", "2 Spaces", "3+ Spaces"]
        },
        {
          id: "houseFacing",
          question: "What is your preferred apartment facing?",
          options: ["South Facing", "East Facing", "West/North Facing", "No Preference"]
        },
        {
          id: "marketProximity",
          question: "Do you prefer to live close to or far from local markets?",
          options: ["Close (Walking)", "Medium (5-10m drive)", "Far (Quieter zone)"]
        },
        {
          id: "streetAccess",
          question: "Preferred street access type?",
          options: ["Roadside (Main Road)", "Alley / Inside Road", "No Preference"]
        },
        {
          id: "hospitalNeed",
          question: `Hospitals (like ${localHospitals[0] || 'Square Hospital'}) required nearby?`,
          options: ["Yes, critical", "Preferred / Close", "Not urgent"]
        },
        {
          id: "uberFrequency",
          question: "Expected ridesharing (Uber Pool / Uber) usage frequency?",
          options: ["Daily commute (TK 5k+/mo)", "Weekly / Moderate (TK 2k-5k/mo)", "Rarely (Under TK 2k/mo)", "None / Personal Car"]
        }
      ]
    }
  ];

  return (
    <div className="w-full flex flex-col lg:flex-row min-h-[60vh] gap-6 animate-fade-in mb-8">
      
      {/* Map Scanner Side */}
      <div className="flex-1 rounded-3xl overflow-hidden shadow-sm border border-black/[0.05] relative min-h-[400px] bg-slate-100/50">
        <MapScanner 
          center={center} 
          currentStep={currentStep} 
          totalSteps={steps.length} 
          listings={listings}
          className="absolute inset-0 w-full h-full" 
          onSelectListing={setSelectedSpeculatorListing}
        />
        
        {/* Map Overlay Info */}
        {!selectedSpeculatorListing && (
          <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-black/5 z-[400] flex justify-between items-center">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                Live Geospatial Scan
              </p>
              <h3 className="text-sm font-extrabold text-text-main mt-0.5 truncate">Sector: {targetAreaName}</h3>
            </div>
            <div className="flex flex-col items-end">
              {!hasStartedScan ? (
                <div className="flex flex-col items-end">
                  <span className="text-[9px] uppercase font-bold text-text-muted">Status</span>
                  <span className="text-xs font-black uppercase tracking-wider text-indigo-400">
                    Ready to Refine
                  </span>
                </div>
              ) : !isComplete && currentStep < steps.length ? (
                <div className="flex flex-col items-end animate-fade-in" key={`param-${currentStep}`}>
                  <span className="text-[9px] uppercase font-bold text-text-muted">Active Filter Phase</span>
                  <span className="text-xs font-black uppercase tracking-wider" style={{ color: steps[currentStep].color }}>
                    {steps[currentStep].paramName}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="bg-emerald-100/90 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                    Scan Complete
                  </span>
                  <button
                    onClick={() => setShowLogistics(true)}
                    className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center gap-2 cursor-pointer"
                  >
                    <BarChart3 size={13} className="text-emerald-400" />
                    Show Logistics
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Scan Logistics Line Graph Overlay */}
        <AnimatePresence>
          {showLogistics && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="absolute inset-0 z-[1000] bg-zinc-950/95 backdrop-blur-md p-6 flex flex-col justify-between text-white"
            >
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <span className="text-xs font-black uppercase tracking-widest text-emerald-400">Scan Pipeline Diagnostics</span>
                    <h3 className="text-lg font-extrabold text-white">Elimination Progression</h3>
                  </div>
                  <button 
                    onClick={() => setShowLogistics(false)}
                    className="flex items-center gap-1.5 text-zinc-400 hover:text-white font-bold transition-colors cursor-pointer bg-zinc-900 border border-zinc-850 px-3.5 py-1.5 rounded-full text-xs"
                  >
                    <ArrowLeft size={14} /> Back to Map
                  </button>
                </div>
                <p className="text-sm text-zinc-400">
                  Visualizing how the candidate pool dropped from <span className="font-bold text-white">{p0}</span> to <span className="font-bold text-emerald-400">{p5}</span> listings.
                </p>
              </div>

              {/* The Graph Canvas */}
              <div className="relative flex-1 flex items-center justify-center min-h-[220px]">
                <svg viewBox="0 0 500 200" className="w-full h-full">
                  <defs>
                    <linearGradient id="line-grad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="50%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                    <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="2.5" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Horizontal Grid Lines */}
                  {[0, 0.25, 0.5, 0.75, 1].map((r, idx) => {
                    const val = Math.round(p0 * r);
                    const y = getY(val);
                    return (
                      <g key={idx}>
                        <line 
                          x1={paddingLeft} 
                          y1={y} 
                          x2={width - paddingRight} 
                          y2={y} 
                          stroke="#27272a" 
                          strokeWidth="1" 
                          strokeDasharray="4 4" 
                        />
                        <text 
                          x={paddingLeft - 8} 
                          y={y + 3} 
                          fill="#52525b" 
                          fontSize="9" 
                          textAnchor="end"
                          className="font-mono"
                        >
                          {val}
                        </text>
                      </g>
                    );
                  })}

                  {/* Area Chart under the line */}
                  <motion.path
                    d={areaPath}
                    fill="url(#area-grad)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  />

                  {/* The Line Graph path itself */}
                  <motion.path
                    d={linePath}
                    fill="none"
                    stroke="url(#line-grad)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#glow)"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                  />

                  {/* Node Dots & Interactions */}
                  {points.map((pt, idx) => {
                    const cx = getX(idx);
                    const cy = getY(pt.value);
                    const isHovered = hoveredIdx === idx;

                    return (
                      <g key={idx} className="cursor-pointer">
                        {/* Invisible larger hover catcher circle */}
                        <circle
                          cx={cx}
                          cy={cy}
                          r="15"
                          fill="transparent"
                          onMouseEnter={() => setHoveredIdx(idx)}
                          onMouseLeave={() => setHoveredIdx(null)}
                        />
                        
                        {/* Dynamic ripple glow around hovered node */}
                        <circle
                          cx={cx}
                          cy={cy}
                          r={isHovered ? 9 : 6}
                          fill={pt.color}
                          opacity={isHovered ? 0.35 : 0.12}
                          className="transition-all duration-300"
                        />

                        {/* Outer border of dot */}
                        <circle
                          cx={cx}
                          cy={cy}
                          r="5"
                          fill="#09090b"
                          stroke={pt.color}
                          strokeWidth="2"
                        />

                        {/* Center core of dot */}
                        <circle
                          cx={cx}
                          cy={cy}
                          r="1.5"
                          fill="#ffffff"
                        />

                        {/* Axis label at bottom */}
                        <text
                          x={cx}
                          y={height - 12}
                          fill={isHovered ? "#ffffff" : "#71717a"}
                          fontSize="10"
                          fontWeight={isHovered ? "bold" : "normal"}
                          textAnchor="middle"
                          className="transition-colors duration-200"
                        >
                          {pt.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Floating Tooltip HTML Overlay */}
                <AnimatePresence>
                  {hoveredIdx !== null && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.95 }}
                      className="absolute bg-zinc-900 border border-zinc-800 p-2.5 rounded-xl shadow-2xl z-[1100] pointer-events-none text-left min-w-[130px]"
                      style={{
                        left: `${(getX(hoveredIdx) / width) * 100}%`,
                        top: `${(getY(points[hoveredIdx].value) / height) * 100 - 24}%`,
                        transform: "translate(-50%, -100%)",
                      }}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[11px] px-1.5 py-0.5 rounded font-black text-white" style={{ backgroundColor: points[hoveredIdx].color }}>
                          {points[hoveredIdx].label}
                        </span>
                      </div>
                      <p className="text-xs font-black text-white">
                        {points[hoveredIdx].value} Listings Left
                      </p>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        {points[hoveredIdx].desc}
                      </p>
                      {points[hoveredIdx].change !== 0 && (
                        <p className="text-[11px] font-bold mt-1" style={{ color: points[hoveredIdx].change < 0 ? "#f87171" : "#34d399" }}>
                          {points[hoveredIdx].change > 0 ? "+" : ""}{points[hoveredIdx].change} listings
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bottom Telemetry Legend */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-2 border-t border-zinc-900 text-center">
                {points.map((pt, idx) => (
                  <div key={idx} className="bg-zinc-900/40 border border-zinc-900 p-2 rounded-lg">
                    <span className="text-[10px] font-bold text-zinc-500 block uppercase tracking-wider">{pt.label}</span>
                    <span className="text-base font-black mt-0.5 block" style={{ color: pt.color }}>{pt.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Terminal / Stats Side */}
      <div className="w-full lg:w-[400px] flex flex-col items-center justify-start bg-zinc-950 border border-zinc-800 rounded-3xl p-8 shadow-2xl transition-colors duration-300 text-white">
        
        {/* Radar Simulation */}
        <RadarSimulation active={hasStartedScan && !isComplete} />

        {/* Phase 1: Questionnaire (Before scan has started) */}
        {!hasStartedScan && (
          <div className="w-full text-left space-y-4 animate-in fade-in duration-200">
            <div className="text-center mb-4">
              <h4 className="text-base font-black text-white uppercase tracking-wider">AI Search Refinement</h4>
              <p className="text-xs text-zinc-400 mt-1">
                Configure your lifestyle preferences to align the AI matcher.
              </p>
            </div>

            {/* Step Progress Header */}
            <div className="bg-indigo-950/20 border border-indigo-900/30 p-3 rounded-xl">
              <p className="text-sm text-zinc-300 font-extrabold uppercase tracking-wider">
                {aiPages[aiStepPage].title}
              </p>
              <div className="w-full h-1 bg-zinc-850 rounded-full overflow-hidden mt-2">
                <div 
                  className="h-full bg-indigo-500 transition-all duration-300" 
                  style={{ width: `${(displayStepNum / displayTotalSteps) * 100}%` }}
                />
              </div>
            </div>

            {/* Question List for Current Page */}
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {aiPages[aiStepPage].questions
                .filter(q => !q.showIf || q.showIf(answers))
                .map((q: Question, idx: number) => (
                  <div key={q.id} className="bg-zinc-900 border border-zinc-850 p-3.5 rounded-xl">
                    <p className="text-sm text-zinc-100 font-bold leading-snug">
                      {idx + 1}. {q.question}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {q.options.map((opt: string, oIdx: number) => (
                        <button
                          key={oIdx}
                          type="button"
                          onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                          className={`text-xs font-bold px-2.5 py-1.5 rounded-md transition-all cursor-pointer ${
                            answers[q.id] === opt
                              ? "bg-indigo-600 border-indigo-500 text-white shadow-sm font-black"
                              : "bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 active:scale-95"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
            </div>

            {/* Additional Text Refinement (Only on Page 3) */}
            {aiStepPage === 2 && (
              <div className="border-t border-zinc-850 pt-3">
                <label className="text-[11px] font-extrabold text-zinc-400 uppercase block mb-1.5">Additional Constraints (Natural Language)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aiResponse}
                    onChange={(e) => setAiResponse(e.target.value)}
                    placeholder="e.g. only show quiet residential streets..."
                    className="flex-1 border border-zinc-800 text-xs rounded-lg px-3 py-2 bg-zinc-900 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-zinc-600"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (aiResponse.trim()) {
                        setAiResponse("");
                      }
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-lg cursor-pointer transition-colors active:scale-95"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}

            {/* Refine & Navigation buttons */}
            <div className="flex gap-2 border-t border-zinc-850 pt-3">
              {aiStepPage > 0 && (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="flex-1 py-2.5 px-4 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
                >
                  Back
                </button>
              )}
              {aiStepPage < 2 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleRefineSearch}
                  disabled={isRefining}
                  className="flex-1 py-2.5 px-4 bg-[#d4a853] hover:bg-[#bfa043] text-zinc-950 font-black uppercase tracking-wider rounded-xl shadow-lg shadow-yellow-500/10 transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer text-sm"
                >
                  {isRefining ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                      Refining...
                    </>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <Sparkles size={14} className="text-zinc-950" />
                      Refine & Scan
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Phase 2: Active scanning in progress */}
        {hasStartedScan && !isComplete && (
          <div className="w-full text-center flex flex-col items-center animate-in fade-in duration-200">
            {/* Current step label */}
            <AnimatePresence mode="wait">
              <motion.p
                key={currentStep}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-base font-bold text-center mt-6 mb-6"
                style={{ color: "#f4f4f5" }}
              >
                {currentStep < steps.length ? steps[currentStep].label : "Found matches worth visiting!"}
              </motion.p>
            </AnimatePresence>

            {/* Progress dots */}
            <div className="flex gap-2 mb-6">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0.8 }}
                  animate={{
                    scale: i <= currentStep ? 1 : 0.8,
                    backgroundColor: i < currentStep
                      ? step.color
                      : i === currentStep
                        ? step.color
                        : "#27272a",
                  }}
                  className="w-2.5 h-2.5 rounded-full transition-colors duration-300"
                />
              ))}
            </div>

            {/* Completed steps list */}
            <div className="w-full text-left space-y-2 border-t border-zinc-900 pt-4">
              {steps.slice(0, currentStep).map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-3 py-2 px-3 text-sm rounded-xl border border-zinc-900 bg-zinc-900/40 hover:bg-zinc-900/60 transition-colors"
                >
                  <span 
                    className="text-[9px] font-black uppercase px-2 py-0.5 rounded border tracking-wider select-none shrink-0" 
                    style={{ 
                      color: step.color, 
                      borderColor: `${step.color}40`, 
                      backgroundColor: `${step.color}15` 
                    }}
                  >
                    {step.badge}
                  </span>
                  <span className="font-bold truncate text-xs text-zinc-100">{step.label}</span>
                  <span className="ml-auto font-mono font-black text-xs px-2 py-0.5 rounded" style={{ backgroundColor: `${step.color}20`, color: step.color }}>
                    {step.count}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Phase 3: Completed Scan */}
        {isComplete && (
          <div className="w-full text-left space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="bg-emerald-950/30 border border-emerald-900/50 text-emerald-300 p-4 rounded-xl text-xs font-bold text-center flex flex-col items-center gap-2">
              <span className="flex items-center gap-1.5 font-black uppercase tracking-wider">
                <CheckCircle2 size={14} className="text-emerald-400" />
                Agentic Scan Complete!
              </span>
              <span className="font-medium text-zinc-400 text-[11px] leading-relaxed text-center">
                BasaBondhu AI evaluated all listings against your 14 custom criteria. The listing database has been refined.
              </span>
            </div>

            {/* Direct matches transition trigger */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onClick={onComplete}
              className="mt-4 w-full py-4.5 px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer text-sm font-black"
            >
              Show my best three matches
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </motion.button>

            {/* Back button to refine again */}
            <button
              onClick={() => {
                setHasStartedScan(false);
                setIsComplete(false);
                setCurrentStep(0);
              }}
              className="w-full py-3 px-4 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-400 hover:text-white font-extrabold uppercase tracking-wider rounded-xl transition-all cursor-pointer text-xs text-center flex items-center justify-center gap-1.5"
            >
              <Settings2 size={12} />
              Modify Criteria / Re-Refine
            </button>
          </div>
        )}
      </div>
      
    </div>
  );
}
