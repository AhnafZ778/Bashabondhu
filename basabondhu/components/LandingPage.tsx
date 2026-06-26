"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSearch } from "@/context/SearchContext";
import { personas } from "@/lib/data/personas";
import { 
  Search, 
  Clipboard, 
  Sparkles, 
  Check, 
  Layers,
  ChevronRight,
  ArrowRight,
  MapPin,
  Users,
  Wallet
} from "lucide-react";
import { SearchProfile, HouseholdType } from "@/lib/types";
import ScrollVideo from "./ScrollVideo";
import { PersonaIcon } from "./PersonaIcons";
import ModeSelector from "./ModeSelector";

const DHAKA_AREAS = [
  "Banani", "Gulshan", "Banasree", "Badda", "Merul Badda", "Mohakhali", "Tejgaon", 
  "Mohammadpur", "Lalmatia", "Mirpur", "Uttara", "Bashundhara", "Dhanmondi"
];

const BUDGET_OPTIONS = [
  { value: 15000, label: "৳15,000 / month" },
  { value: 25000, label: "৳25,000 / month" },
  { value: 35000, label: "৳35,000 / month" },
  { value: 45000, label: "৳45,000 / month" },
  { value: 60000, label: "৳60,000+ / month" }
];

const HOUSEHOLD_OPTIONS: { value: HouseholdType; label: string }[] = [
  { value: "family", label: "Family" },
  { value: "couple", label: "Married Couple" },
  { value: "bachelor", label: "Bachelor Group" },
  { value: "student", label: "Student" },
  { value: "working-woman", label: "Working Woman" }
];

const VERIFICATION_SLIDES = [
  {
    index: "01",
    subtitle: "TRUE COST AUDITING",
    title: "Upfront Cash Trap",
    desc: "Advertised ৳22k rent. Real day-one cost: ৳87k after security deposits, advance rent, lift/security service charges, broker commissions, and shifting movers. BasaBondhu computes the exact day-one outlay instantly so you never get blind-sided.",
    imageUrl: "/DhakaImages/imag999es.jpg"
  },
  {
    index: "02",
    subtitle: "HISTORICAL FLOOD DATA",
    title: "Waterlogging Risk",
    desc: "Banasree Block D or Dhanmondi 27 looks pristine in the dry winter. By July, the access roads are knee-deep. BasaBondhu overlays historical monsoon water levels and drainage quality to highlight flood-prone areas before you lease.",
    imageUrl: "/DhakaImages/highly-populated-dhaka-city-crammed-with-unplanned-buildings-KDCB15.jpg"
  },
  {
    index: "03",
    subtitle: "UTILITY CONNECTION AUDIT",
    title: "Gas Line Lies",
    desc: "Listing descriptions stating \"gas available\" frequently mask cylinder dependencies, which add up to ৳2,000/month to your basic utilities. We directly verify the pipeline connection type before you make a visit.",
    imageUrl: "/DhakaImages/image5s.jpg"
  },
  {
    index: "04",
    subtitle: "LIFESTYLE MATCHING",
    title: "Restrictive Rules",
    desc: "Bachelors and students face strict 11 PM curfews, gate locks, and no-overnight-guest rules. Families require secure compounds. We audit tenant agreement rules to match listings to your lifestyle.",
    imageUrl: "/DhakaImages/istockphoto-2153844423-612x612.jpg"
  }
];

type MindmapNode = {
  id: string;
  label: string;
  x: number; // percentage coordinate
  y: number; // percentage coordinate
  type: "hub" | "branch" | "leaf";
  colorClass: string;
  branch?: string;
  solutionTitle?: string;
  solutionDesc?: string;
};

const MINDMAP_NODES: MindmapNode[] = [
  // Central Hub
  { 
    id: "hub", 
    label: "BASABONDHU CORE", 
    x: 50, 
    y: 50, 
    type: "hub", 
    colorClass: "border-gold bg-[#1e1a12] text-gold shadow-[0_0_20px_rgba(201,169,110,0.35)]" 
  },
  
  // Four Main Branches (2 Left, 2 Right)
  { 
    id: "financial", 
    label: "Financial Traps", 
    x: 33, 
    y: 28, 
    type: "branch", 
    colorClass: "border-rose-500/40 bg-[#1f1214] text-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.15)]" 
  },
  { 
    id: "logistical", 
    label: "Logistical Pitfalls", 
    x: 33, 
    y: 72, 
    type: "branch", 
    colorClass: "border-amber-500/40 bg-[#221a12] text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.15)]" 
  },
  { 
    id: "intelligent", 
    label: "Intelligent Scoring", 
    x: 67, 
    y: 28, 
    type: "branch", 
    colorClass: "border-emerald-500/40 bg-[#121f15] text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.15)]" 
  },
  { 
    id: "tools", 
    label: "Tenant Action Tools", 
    x: 67, 
    y: 72, 
    type: "branch", 
    colorClass: "border-indigo-500/40 bg-[#141524] text-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.15)]" 
  },
  
  // Leaves connected to Financial Traps (Left-Top)
  { 
    id: "deposit", 
    label: "Deposit Cash Lock", 
    x: 17, 
    y: 10, 
    type: "leaf", 
    branch: "financial",
    colorClass: "border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-rose-500/50 hover:text-rose-300",
    solutionTitle: "Upfront Cash Calculator",
    solutionDesc: "BasaBondhu aggregates security deposits, utility advances, and shifting costs immediately to prevent landlord deposit lockups from breaking your budget."
  },
  { 
    id: "broker", 
    label: "Double Broker Fees", 
    x: 11, 
    y: 26, 
    type: "leaf", 
    branch: "financial",
    colorClass: "border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-rose-500/50 hover:text-rose-300",
    solutionTitle: "Direct Owner Vetting",
    solutionDesc: "Screens out agent/broker commission claims by cross-referencing listing phone numbers and source signatures dynamically."
  },
  { 
    id: "hidden-bills", 
    label: "Hidden Service Bills", 
    x: 17, 
    y: 42, 
    type: "leaf", 
    branch: "financial",
    colorClass: "border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-rose-500/50 hover:text-rose-300",
    solutionTitle: "8-Factor Cost Auditor",
    solutionDesc: "Audits unlisted lift maintenance, water bills, security guard charges, and generator fuel surcharges before you sign."
  },
  
  // Leaves connected to Logistical Pitfalls (Left-Bottom)
  { 
    id: "waterlogging", 
    label: "Monsoon Drainage Floods", 
    x: 17, 
    y: 58, 
    type: "leaf", 
    branch: "logistical",
    colorClass: "border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-amber-500/50 hover:text-amber-300",
    solutionTitle: "Rain Drainage Safety Index",
    solutionDesc: "Integrates historical monsoon waterlogging profiles for Dhaka areas like Banasree, Badda, and Mirpur, warning you of flood risk before you visit."
  },
  { 
    id: "gas", 
    label: "Gas Pipeline Lies", 
    x: 11, 
    y: 74, 
    type: "leaf", 
    branch: "logistical",
    colorClass: "border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-amber-500/50 hover:text-amber-300",
    solutionTitle: "Titas Gas Line Verification",
    solutionDesc: "Differentiates true pipeline gas supply from expensive cylinder gas reliance, validating listing claims directly with landlord checks."
  },
  { 
    id: "commute", 
    label: "Commute Illusions", 
    x: 17, 
    y: 90, 
    type: "leaf", 
    branch: "logistical",
    colorClass: "border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-amber-500/50 hover:text-amber-300",
    solutionTitle: "Commute Anchors Matrix",
    solutionDesc: "Re-ranks property match recommendations according to real travel times to your multi-point commute anchors rather than standard map straight lines."
  },
  
  // Leaves connected to Intelligent Scoring (Right-Top)
  { 
    id: "scoring-engine", 
    label: "8-Factor Matching Engine", 
    x: 83, 
    y: 10, 
    type: "leaf", 
    branch: "intelligent",
    colorClass: "border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-emerald-500/50 hover:text-emerald-300",
    solutionTitle: "Multi-Factor Scoring Matrix",
    solutionDesc: "Weights budget, upfront cash, commute, household profiles, utility stability, waterlogging, and listing trust into a single score out of 100."
  },
  { 
    id: "gemini-parser", 
    label: "Gemini AI Listing Parser", 
    x: 89, 
    y: 26, 
    type: "leaf", 
    branch: "intelligent",
    colorClass: "border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-emerald-500/50 hover:text-emerald-300",
    solutionTitle: "NLP Bangla/Banglish Extractor",
    solutionDesc: "Uses Gemini AI NLP models to extract structured parameters (rent, service charge, lift, gas) and hidden rules from raw Facebook and social ads."
  },
  { 
    id: "comparison", 
    label: "Side-by-Side Comparison", 
    x: 83, 
    y: 42,  
    type: "leaf", 
    branch: "intelligent",
    colorClass: "border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-emerald-500/50 hover:text-emerald-300",
    solutionTitle: "Upfront vs. Monthly Matrix",
    solutionDesc: "Puts shortlisted or scanned candidates side-by-side to compare day-one liquid outlay, ongoing rent, utility reliability, and safety tags."
  },
  
  // Leaves connected to Tenant Action Tools (Right-Bottom)
  { 
    id: "scripts", 
    label: "Dynamic Calling Scripts", 
    x: 90, 
    y: 60, 
    type: "leaf", 
    branch: "tools",
    colorClass: "border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-indigo-500/50 hover:text-indigo-300",
    solutionTitle: "Banglish Telephone Guides",
    solutionDesc: "Provides copy-pasteable call scripts in natural urban Banglish, dynamically inserting questions to ask about missing utilities and rules."
  },
  { 
    id: "checklist", 
    label: "Adaptive Inspection Checklists", 
    x: 94, 
    y: 75, 
    type: "leaf", 
    branch: "tools",
    colorClass: "border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-indigo-500/50 hover:text-indigo-300",
    solutionTitle: "Custom Site-Inspection Guides",
    solutionDesc: "Generates custom guidelines based on tenant type (bachelors vs. families) covering wall dampness, water pressure, and mobile network strength."
  },
  { 
    id: "report", 
    label: "Printable Dossier Reports", 
    x: 92, 
    y: 90, 
    type: "leaf", 
    branch: "tools",
    colorClass: "border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-indigo-500/50 hover:text-indigo-300",
    solutionTitle: "Consolidated PDF Dossier",
    solutionDesc: "Generates a print-ready PDF containing search criteria, matching candidates list, call logs, and checklists to carry with you during house hunting."
  }
];

export default function LandingPage() {
  const { planSearch } = useSearch();
  const router = useRouter();

  // Search widget local states
  const [selectedHousehold, setSelectedHousehold] = useState<HouseholdType>("family");
  const [selectedArea, setSelectedArea] = useState<string>("Banani");
  const [selectedBudget, setSelectedBudget] = useState<number>(25000);

  // Track whether the video section is in view to hide/show navbar
  const videoSectionRef = useRef<HTMLDivElement>(null);
  const [isVideoInView, setIsVideoInView] = useState(false);

  // Active verification slide state
  const [activeVerificationIndex, setActiveVerificationIndex] = useState(0);
  const [isVerificationHovered, setIsVerificationHovered] = useState(false);

  // Active mindmap node state
  const [activeNode, setActiveNode] = useState<MindmapNode | null>(MINDMAP_NODES.find(n => n.id === "deposit") || null);

  // Auto-slide verification cards, pause on hover
  useEffect(() => {
    if (isVerificationHovered) return;
    const timer = setInterval(() => {
      setActiveVerificationIndex((prev) => (prev + 1) % VERIFICATION_SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isVerificationHovered]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVideoInView(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    const el = videoSectionRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  // Toggle navbar visibility based on video section presence
  useEffect(() => {
    const navbar = document.querySelector("header");
    if (!navbar) return;

    if (isVideoInView) {
      navbar.style.transform = "translateY(-100%)";
      navbar.style.opacity = "0";
      navbar.style.pointerEvents = "none";
    } else {
      navbar.style.transform = "translateY(0)";
      navbar.style.opacity = "1";
      navbar.style.pointerEvents = "auto";
    }
  }, [isVideoInView]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const lookingFor = (selectedHousehold === "student" || selectedHousehold === "working-woman")
      ? "room-sublet"
      : "full-flat";

    const profile: SearchProfile = {
      id: "custom-search",
      mode: "plan",
      rentingOrBuying: "renting",
      householdType: selectedHousehold,
      lookingFor,
      budgetMonthly: selectedBudget,
      maxFirstMonthCash: selectedBudget * 3,
      commuteAnchors: [{ label: "Work/School", area: selectedArea }],
      priorities: ["commute", "rent"],
      dealBreakers: []
    };

    planSearch(profile);
    router.push("/portal");
  };

  const handlePersonaSelect = (p: typeof personas[0]) => {
    const profile: SearchProfile = {
      id: p.id,
      mode: "plan",
      rentingOrBuying: "renting",
      householdType: p.householdType,
      lookingFor: p.lookingFor,
      budgetMonthly: p.budgetMonthly,
      maxFirstMonthCash: p.maxFirstMonthCash,
      commuteAnchors: p.commuteAnchors,
      priorities: p.priorities,
      dealBreakers: p.dealBreakers
    };
    planSearch(profile);
    router.push("/portal");
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0a0a0a] text-zinc-100 animate-fade-in">

      {/* ──────────────────────────────────────────────────
          IMMERSIVE SCROLL VIDEO — Full-screen, navbar hidden
          Scroll-driven frame-by-frame cinematic experience.
          This is the FIRST thing visitors see.
          ────────────────────────────────────────────────── */}
      <div ref={videoSectionRef}>
        <ScrollVideo />
      </div>

      {/* ──────────────────────────────────────────────────
          SLIDING LOGO BANNER (Replacing Mode Selector)
          ────────────────────────────────────────────────── */}
      <section className="bg-[#0f0f0f] border-y border-white/5 py-16 overflow-hidden relative select-none">
        {/* Soft left/right gradients for seamless entry/exit effect */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0f0f0f] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0f0f0f] to-transparent z-10 pointer-events-none" />
        
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 mb-8 text-center sm:text-left">
          <span className="px-3.5 py-1.5 bg-gold/10 border border-gold/20 text-gold text-[10px] sm:text-xs uppercase font-black tracking-widest rounded-full">
            Organizers
          </span>
        </div>

        {/* Sliding Wrapper */}
        <div className="flex w-[200%] animate-marquee-right [will-change:transform]">
          {/* First Set of Logos */}
          <div className="flex justify-around items-center min-w-full gap-8">
            <div className="flex flex-col items-center gap-3 bg-zinc-900/40 border border-white/5 backdrop-blur-md px-8 py-5 rounded-2xl w-64 hover:border-gold/30 hover:bg-zinc-900/60 transition-all duration-300 group">
              <div className="h-16 flex items-center justify-center">
                <img 
                  src="/Logos/AUST IDC - Black.png" 
                  alt="AUST IDC - Black" 
                  className="max-h-full max-w-[180px] object-contain opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300 brightness-0 invert" 
                />
              </div>
              <span className="text-zinc-500 group-hover:text-zinc-300 font-mono text-[11px] uppercase tracking-wider transition-colors">
                AUST IDC - Black
              </span>
            </div>

            <div className="flex flex-col items-center gap-3 bg-zinc-900/40 border border-white/5 backdrop-blur-md px-8 py-5 rounded-2xl w-64 hover:border-gold/30 hover:bg-zinc-900/60 transition-all duration-300 group">
              <div className="h-16 flex items-center justify-center">
                <img 
                  src="/Logos/Code front.png" 
                  alt="Code front" 
                  className="max-h-full max-w-[180px] object-contain opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300" 
                />
              </div>
              <span className="text-zinc-500 group-hover:text-zinc-300 font-mono text-[11px] uppercase tracking-wider transition-colors">
                Code front
              </span>
            </div>

            <div className="flex flex-col items-center gap-3 bg-zinc-900/40 border border-white/5 backdrop-blur-md px-8 py-5 rounded-2xl w-64 hover:border-gold/30 hover:bg-zinc-900/60 transition-all duration-300 group">
              <div className="h-16 flex items-center justify-center">
                <img 
                  src="/Logos/Mindsparks 26 Logo.png" 
                  alt="Mindsparks 26 Logo" 
                  className="max-h-full max-w-[180px] object-contain opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300" 
                />
              </div>
              <span className="text-zinc-500 group-hover:text-zinc-300 font-mono text-[11px] uppercase tracking-wider transition-colors">
                Mindsparks 26 Logo
              </span>
            </div>
          </div>

          {/* Second Duplicate Set of Logos (for seamless looping) */}
          <div className="flex justify-around items-center min-w-full gap-8">
            <div className="flex flex-col items-center gap-3 bg-zinc-900/40 border border-white/5 backdrop-blur-md px-8 py-5 rounded-2xl w-64 hover:border-gold/30 hover:bg-zinc-900/60 transition-all duration-300 group">
              <div className="h-16 flex items-center justify-center">
                <img 
                  src="/Logos/AUST IDC - Black.png" 
                  alt="AUST IDC - Black" 
                  className="max-h-full max-w-[180px] object-contain opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300 brightness-0 invert" 
                />
              </div>
              <span className="text-zinc-500 group-hover:text-zinc-300 font-mono text-[11px] uppercase tracking-wider transition-colors">
                AUST IDC - Black
              </span>
            </div>

            <div className="flex flex-col items-center gap-3 bg-zinc-900/40 border border-white/5 backdrop-blur-md px-8 py-5 rounded-2xl w-64 hover:border-gold/30 hover:bg-zinc-900/60 transition-all duration-300 group">
              <div className="h-16 flex items-center justify-center">
                <img 
                  src="/Logos/Code front.png" 
                  alt="Code front" 
                  className="max-h-full max-w-[180px] object-contain opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300" 
                />
              </div>
              <span className="text-zinc-500 group-hover:text-zinc-300 font-mono text-[11px] uppercase tracking-wider transition-colors">
                Code front
              </span>
            </div>

            <div className="flex flex-col items-center gap-3 bg-zinc-900/40 border border-white/5 backdrop-blur-md px-8 py-5 rounded-2xl w-64 hover:border-gold/30 hover:bg-zinc-900/60 transition-all duration-300 group">
              <div className="h-16 flex items-center justify-center">
                <img 
                  src="/Logos/Mindsparks 26 Logo.png" 
                  alt="Mindsparks 26 Logo" 
                  className="max-h-full max-w-[180px] object-contain opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300" 
                />
              </div>
              <span className="text-zinc-500 group-hover:text-zinc-300 font-mono text-[11px] uppercase tracking-wider transition-colors">
                Mindsparks 26 Logo
              </span>
            </div>
          </div>
        </div>
      </section>
      {/* ──────────────────────────────────────────────────
          HERO — Full-cover background image with floating search card
          ────────────────────────────────────────────────── */}
      <section className="relative min-h-[720px] text-white flex items-center overflow-hidden py-12">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/landing.jpeg" 
            alt="BasaBondhu Hero Background" 
            className="w-full h-full object-cover grayscale-[15%] brightness-[90%]" 
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Solid Content Card Overlay */}
        <div className="relative z-10 w-full px-6 sm:px-10 lg:px-16 xl:px-24 py-16 flex justify-start">
          <div className="max-w-xl bg-zinc-950/80 backdrop-blur-md border border-white/10 p-8 sm:p-10 rounded-2xl shadow-2xl space-y-6 text-left text-white">
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-gold/10 border border-gold/20 text-xs font-black uppercase tracking-[0.2em] text-gold">
              <Sparkles className="w-3.5 h-3.5" />
              Broaden Home Boundaries
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-serif font-bold uppercase tracking-[0.1em] leading-[1.2] text-white">
              From messy listings to<br />
              <span className="text-gold font-bold">3 homes worth visiting.</span>
            </h1>

            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
              Tired of scrolling endless Facebook groups, calling bad brokers, and facing surprise landlord curfews? BasaBondhu filters out Dhaka rent traps instantly.
            </p>

            {/* Search Widget */}
            <form 
              onSubmit={handleSearchSubmit} 
              className="space-y-4 w-full pt-2"
            >
              <div className="flex items-center gap-2.5 px-3.5 py-3 bg-zinc-900 border border-white/10 hover:border-gold/50 rounded-lg transition-colors">
                <MapPin className="w-4.5 h-4.5 text-gold shrink-0" />
                <div className="flex-1 text-left min-w-0">
                  <label className="block text-[10px] sm:text-xs uppercase tracking-[0.15em] font-black text-zinc-500">Where do you live/work?</label>
                  <select 
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                    className="block w-full text-sm font-bold text-white bg-transparent border-0 p-0 focus:ring-0 focus:outline-hidden mt-0.5"
                  >
                    {DHAKA_AREAS.map(area => (
                      <option key={area} value={area} className="bg-zinc-950 text-white font-bold">{area}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2.5 px-3.5 py-3 bg-zinc-900 border border-white/10 hover:border-gold/50 rounded-lg transition-colors">
                  <Users className="w-4.5 h-4.5 text-gold shrink-0" />
                  <div className="flex-1 text-left min-w-0">
                    <label className="block text-[10px] sm:text-xs uppercase tracking-[0.15em] font-black text-zinc-500">Who is shifting?</label>
                    <select 
                      value={selectedHousehold}
                      onChange={(e) => setSelectedHousehold(e.target.value as HouseholdType)}
                      className="block w-full text-sm font-bold text-white bg-transparent border-0 p-0 focus:ring-0 focus:outline-hidden mt-0.5"
                    >
                      {HOUSEHOLD_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value} className="bg-zinc-950 text-white font-bold">{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 px-3.5 py-3 bg-zinc-900 border border-white/10 hover:border-gold/50 rounded-lg transition-colors">
                  <Wallet className="w-4.5 h-4.5 text-gold shrink-0" />
                  <div className="flex-1 text-left min-w-0">
                    <label className="block text-[10px] sm:text-xs uppercase tracking-[0.15em] font-black text-zinc-500">Monthly Budget</label>
                    <select 
                      value={selectedBudget}
                      onChange={(e) => setSelectedBudget(parseInt(e.target.value))}
                      className="block w-full text-sm font-bold text-white bg-transparent border-0 p-0 focus:ring-0 focus:outline-hidden mt-0.5"
                    >
                      {BUDGET_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value} className="bg-zinc-950 text-white font-bold">{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4.5 bg-gold hover:bg-[#b5955a] text-white font-serif text-xs sm:text-sm tracking-[0.2em] font-bold rounded-lg uppercase shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all duration-300"
              >
                <Search className="w-4 h-4" />
                Find My Match
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────
          ALL EYES ON VERIFICATION — Twin column design layout
          ────────────────────────────────────────────────── */}
      <section className="bg-[#121212] py-20 px-6 sm:px-10 lg:px-16 xl:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column - Large Image w/ Title Overlap */}
          <div className="lg:col-span-7 relative h-[450px] lg:h-[550px] w-full overflow-hidden rounded-xl shadow-md border border-white/5">
            <img 
              src="/DhakaImages/highly-populated-dhaka-city-crammed-with-unplanned-buildings-KDCB15.jpg" 
              alt="BasaBondhu Verification Auditing" 
              className="w-full h-full object-cover grayscale-[10%]"
            />
            {/* Dark tint overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />
            
            {/* Giant Title Overlay */}
            <div className="absolute inset-0 flex items-end p-8 sm:p-12">
              <h2 className="font-serif text-white/20 text-5xl sm:text-6xl lg:text-[6.5rem] leading-[0.85] uppercase tracking-[0.05em] select-none font-bold">
                ZERO<br />GUESSWORK
              </h2>
            </div>
          </div>

          {/* Right Column - Overlapping Slideshow Card */}
          <div className="lg:col-span-5 lg:-ml-16 relative z-10">
            <div className="bg-zinc-950/60 backdrop-blur-sm border border-white/10 rounded-xl p-8 sm:p-10 shadow-2xl space-y-6 text-left text-white">
              <div className="flex items-center justify-between pb-4 border-b border-white/5">
                <div>
                  <span className="text-gold font-serif text-2xl font-bold">
                    {VERIFICATION_SLIDES[activeVerificationIndex].index}
                  </span>
                  <span className="text-zinc-500 font-sans text-xs ml-1">/ 04</span>
                </div>
                <span className="px-3 py-1 bg-gold/10 text-gold text-xs uppercase font-black tracking-widest rounded-md">
                  {VERIFICATION_SLIDES[activeVerificationIndex].subtitle}
                </span>
              </div>

              <div className="space-y-3">
                <h3 className="font-serif text-xl sm:text-2xl uppercase tracking-wider text-white font-bold">
                  {VERIFICATION_SLIDES[activeVerificationIndex].title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-semibold">
                  {VERIFICATION_SLIDES[activeVerificationIndex].desc}
                </p>
              </div>

              {/* Crop image for index visual interest */}
              <div 
                className="h-32 w-full overflow-hidden rounded-lg relative cursor-pointer"
                onMouseEnter={() => setIsVerificationHovered(true)}
                onMouseLeave={() => setIsVerificationHovered(false)}
              >
                <img 
                  src={VERIFICATION_SLIDES[activeVerificationIndex].imageUrl} 
                  alt="Slide Detail" 
                  className="w-full h-full object-cover grayscale-[15%] transition-all duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gold/15" />
              </div>

              {/* Slider Dots */}
              <div className="flex items-center gap-2 pt-2">
                {VERIFICATION_SLIDES.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveVerificationIndex(index)}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      activeVerificationIndex === index ? "w-8 bg-gold" : "w-2 bg-white/10 hover:bg-white/30"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ──────────────────────────────────────────────────
          PERSONA QUICK-START — Pick your situation
          Premium image-backed cards with SVG icons
          ────────────────────────────────────────────────── */}
      <section className="bg-[#111111] border-y border-black/5 py-24 px-6 sm:px-10 lg:px-16 xl:px-24 text-center">
        <div className="mb-16 space-y-3">
          <span className="text-gold font-serif text-xs sm:text-sm uppercase tracking-[0.4em] block">
            Direct Entry
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif uppercase tracking-[0.15em] text-white font-bold">
            Pick Your Situation
          </h2>
          <div className="w-12 h-[1px] bg-gold mx-auto mt-4" />
          <p className="text-sm sm:text-base text-white/50 tracking-wide max-w-2xl mx-auto pt-2 font-semibold">
            Select a persona to see instant matching results, cost breakdowns, and call scripts — no signup needed.
          </p>
        </div>

        {/* Top row: 3 large cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          {personas.slice(0, 3).map((p) => (
            <button
              key={p.id}
              onClick={() => handlePersonaSelect(p)}
              className="relative group cursor-pointer rounded-xl overflow-hidden text-left h-[380px] focus:outline-none focus:ring-2 focus:ring-gold/50 border-0"
            >
              {/* Background Image */}
              <img
                src={p.imageUrl}
                alt={p.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 group-hover:from-black/95 group-hover:via-black/50 transition-all duration-500" />
              
              {/* Top Badge */}
              <div className="absolute top-5 left-5 z-10">
                <span className="px-3.5 py-1.5 bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg text-[10px] sm:text-xs uppercase tracking-[0.2em] font-black text-white/85">
                  {p.householdType}
                </span>
              </div>

              {/* SVG Icon — Top Right */}
              <div className="absolute top-5 right-5 z-10">
                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center group-hover:bg-gold/20 group-hover:border-gold/30 transition-all duration-500">
                  <PersonaIcon iconId={p.iconId} className="w-6 h-6 text-white/70 group-hover:text-gold transition-colors duration-500" />
                </div>
              </div>

              {/* Content — Bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-6 z-10 space-y-3">
                <div className="space-y-1">
                  <h4 className="text-lg sm:text-xl font-serif uppercase tracking-wider text-white font-bold group-hover:text-gold transition-colors duration-300">
                    {p.name}
                  </h4>
                  <p className="text-xs uppercase tracking-widest font-black text-gold/80">
                    ৳{p.budgetMonthly.toLocaleString()}/mo
                  </p>
                </div>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-medium line-clamp-2">
                  {p.description}
                </p>
                <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                  <span className="text-[10px] sm:text-xs uppercase font-black tracking-widest text-white/70 group-hover:text-gold transition-colors duration-300">
                    Load Profile
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-white/40 group-hover:text-gold group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Bottom row: 2 wide cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {personas.slice(3).map((p) => (
            <button
              key={p.id}
              onClick={() => handlePersonaSelect(p)}
              className="relative group cursor-pointer rounded-xl overflow-hidden text-left h-[320px] focus:outline-none focus:ring-2 focus:ring-gold/50 border-0"
            >
              {/* Background Image */}
              <img
                src={p.imageUrl}
                alt={p.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 group-hover:from-black/95 group-hover:via-black/50 transition-all duration-500" />
              
              {/* Top Badge */}
              <div className="absolute top-5 left-5 z-10">
                <span className="px-3 py-1.5 bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg text-[8px] uppercase tracking-[0.2em] font-black text-white/80">
                  {p.householdType}
                </span>
              </div>

              {/* SVG Icon — Top Right */}
              <div className="absolute top-5 right-5 z-10">
                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center group-hover:bg-gold/20 group-hover:border-gold/30 transition-all duration-500">
                  <PersonaIcon iconId={p.iconId} className="w-6 h-6 text-white/70 group-hover:text-gold transition-colors duration-500" />
                </div>
              </div>

              {/* Content — Bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                <div className="flex items-end justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="space-y-1">
                      <h4 className="text-lg font-serif uppercase tracking-wider text-white font-bold group-hover:text-gold transition-colors duration-300">
                        {p.name}
                      </h4>
                      <p className="text-[10px] uppercase tracking-widest font-black text-gold/80">
                        ৳{p.budgetMonthly.toLocaleString()}/mo
                      </p>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed font-semibold line-clamp-2 max-w-lg">
                      {p.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 pb-1">
                    <span className="text-[9px] uppercase font-black tracking-widest text-white/70 group-hover:text-gold transition-colors duration-300">
                      Load Profile
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-white/40 group-hover:text-gold group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ──────────────────────────────────────────────────
          CRISIS MINDMAP — Replacing Comparison
          ────────────────────────────────────────────────── */}
      <section className="bg-[#0a0a0a] py-20 px-6 sm:px-10 lg:px-16 xl:px-24 border-t border-white/5">
        <div className="text-center space-y-6 max-w-4xl mx-auto mb-16">
          <div>
            <span className="text-gold font-serif text-xs sm:text-sm uppercase tracking-[0.4em] block">
              Integrity first
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif uppercase tracking-[0.1em] text-white font-bold mt-3">
              Dhaka's Rent Trap Mindmap
            </h2>
            <div className="w-12 h-[1px] bg-gold mx-auto mt-4" />
          </div>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-semibold">
            Every step of Dhaka's house hunting is loaded with hidden surprises. Click on any trap node in the mindmap below to see how BasaBondhu screens it out for you.
          </p>
        </div>

        {/* Visual SVG Mindmap - Desktop Only */}
        <div className="hidden lg:block w-full max-w-5xl mx-auto h-[620px] relative bg-zinc-950/40 border border-white/5 rounded-3xl p-6 shadow-2xl backdrop-blur-md overflow-hidden select-none">
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes drawPath {
              to {
                stroke-dashoffset: 0;
              }
            }
            .animate-draw-path {
              stroke-dasharray: 200;
              stroke-dashoffset: 200;
              animation: drawPath 1.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            }
            @keyframes pulseGlow {
              0% {
                stroke-dashoffset: 30;
              }
              100% {
                stroke-dashoffset: 0;
              }
            }
            .animate-pulse-glow {
              stroke-dasharray: 6, 12;
              animation: pulseGlow 1.5s linear infinite;
            }
            @keyframes popNode {
              0% {
                transform: translate(-50%, -50%) scale(0);
                opacity: 0;
              }
              60% {
                transform: translate(-50%, -50%) scale(1.08);
                opacity: 0.9;
              }
              100% {
                transform: translate(-50%, -50%) scale(1);
                opacity: 1;
              }
            }
          `}} />

          {/* Connection lines (SVG) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Hub to Branches */}
            <path d="M 50,50 Q 39,50 28,30" className="stroke-rose-500/40 stroke-[0.3] fill-none animate-draw-path" style={{ animationDelay: "0.1s" }} />
            <path d="M 50,50 Q 39,50 28,70" className="stroke-amber-500/40 stroke-[0.3] fill-none animate-draw-path" style={{ animationDelay: "0.1s" }} />
            <path d="M 50,50 Q 61,50 72,30" className="stroke-emerald-500/40 stroke-[0.3] fill-none animate-draw-path" style={{ animationDelay: "0.1s" }} />
            <path d="M 50,50 Q 61,50 72,70" className="stroke-indigo-500/40 stroke-[0.3] fill-none animate-draw-path" style={{ animationDelay: "0.1s" }} />

            {/* Financial Branch (Left Top: 28,30) to Leaves */}
            <path d="M 28,30 Q 18,30 14,12" className={`transition-all duration-300 ${activeNode?.id === "deposit" ? "stroke-rose-500 stroke-[0.5]" : "stroke-rose-500/20 stroke-[0.25]"} fill-none animate-draw-path`} style={{ animationDelay: "0.5s" }} />
            {activeNode?.id === "deposit" && <path d="M 28,30 Q 18,30 14,12" className="stroke-rose-400 stroke-[0.8] fill-none animate-pulse-glow" />}

            <path d="M 28,30 L 12,28" className={`transition-all duration-300 ${activeNode?.id === "broker" ? "stroke-rose-500 stroke-[0.5]" : "stroke-rose-500/20 stroke-[0.25]"} fill-none animate-draw-path`} style={{ animationDelay: "0.5s" }} />
            {activeNode?.id === "broker" && <path d="M 28,30 L 12,28" className="stroke-rose-400 stroke-[0.8] fill-none animate-pulse-glow" />}

            <path d="M 28,30 Q 19,30 16,42" className={`transition-all duration-300 ${activeNode?.id === "hidden-bills" ? "stroke-rose-500 stroke-[0.5]" : "stroke-rose-500/20 stroke-[0.25]"} fill-none animate-draw-path`} style={{ animationDelay: "0.5s" }} />
            {activeNode?.id === "hidden-bills" && <path d="M 28,30 Q 19,30 16,42" className="stroke-rose-400 stroke-[0.8] fill-none animate-pulse-glow" />}

            {/* Logistical Branch (Left Bottom: 28,70) to Leaves */}
            <path d="M 28,70 Q 19,70 16,58" className={`transition-all duration-300 ${activeNode?.id === "waterlogging" ? "stroke-amber-500 stroke-[0.5]" : "stroke-amber-500/20 stroke-[0.25]"} fill-none animate-draw-path`} style={{ animationDelay: "0.5s" }} />
            {activeNode?.id === "waterlogging" && <path d="M 28,70 Q 19,70 16,58" className="stroke-amber-400 stroke-[0.8] fill-none animate-pulse-glow" />}

            <path d="M 28,70 L 12,72" className={`transition-all duration-300 ${activeNode?.id === "gas" ? "stroke-amber-500 stroke-[0.5]" : "stroke-amber-500/20 stroke-[0.25]"} fill-none animate-draw-path`} style={{ animationDelay: "0.5s" }} />
            {activeNode?.id === "gas" && <path d="M 28,70 L 12,72" className="stroke-amber-400 stroke-[0.8] fill-none animate-pulse-glow" />}

            <path d="M 28,70 Q 18,70 14,88" className={`transition-all duration-300 ${activeNode?.id === "commute" ? "stroke-amber-500 stroke-[0.5]" : "stroke-amber-500/20 stroke-[0.25]"} fill-none animate-draw-path`} style={{ animationDelay: "0.5s" }} />
            {activeNode?.id === "commute" && <path d="M 28,70 Q 18,70 14,88" className="stroke-amber-400 stroke-[0.8] fill-none animate-pulse-glow" />}

            {/* Intelligent Branch (Right Top: 72,30) to Leaves */}
            <path d="M 72,30 Q 82,30 86,12" className={`transition-all duration-300 ${activeNode?.id === "scoring-engine" ? "stroke-emerald-500 stroke-[0.5]" : "stroke-emerald-500/20 stroke-[0.25]"} fill-none animate-draw-path`} style={{ animationDelay: "0.5s" }} />
            {activeNode?.id === "scoring-engine" && <path d="M 72,30 Q 82,30 86,12" className="stroke-emerald-400 stroke-[0.8] fill-none animate-pulse-glow" />}

            <path d="M 72,30 L 88,28" className={`transition-all duration-300 ${activeNode?.id === "gemini-parser" ? "stroke-emerald-500 stroke-[0.5]" : "stroke-emerald-500/20 stroke-[0.25]"} fill-none animate-draw-path`} style={{ animationDelay: "0.5s" }} />
            {activeNode?.id === "gemini-parser" && <path d="M 72,30 L 88,28" className="stroke-emerald-400 stroke-[0.8] fill-none animate-pulse-glow" />}

            <path d="M 72,30 Q 81,30 84,42" className={`transition-all duration-300 ${activeNode?.id === "comparison" ? "stroke-emerald-500 stroke-[0.5]" : "stroke-emerald-500/20 stroke-[0.25]"} fill-none animate-draw-path`} style={{ animationDelay: "0.5s" }} />
            {activeNode?.id === "comparison" && <path d="M 72,30 Q 81,30 84,42" className="stroke-emerald-400 stroke-[0.8] fill-none animate-pulse-glow" />}

            {/* Tenant Tools Branch (Right Bottom: 72,70) to Leaves */}
            <path d="M 72,70 Q 81,70 84,58" className={`transition-all duration-300 ${activeNode?.id === "scripts" ? "stroke-indigo-500 stroke-[0.5]" : "stroke-indigo-500/20 stroke-[0.25]"} fill-none animate-draw-path`} style={{ animationDelay: "0.5s" }} />
            {activeNode?.id === "scripts" && <path d="M 72,70 Q 81,70 84,58" className="stroke-indigo-400 stroke-[0.8] fill-none animate-pulse-glow" />}

            <path d="M 72,70 L 88,72" className={`transition-all duration-300 ${activeNode?.id === "checklist" ? "stroke-indigo-500 stroke-[0.5]" : "stroke-indigo-500/20 stroke-[0.25]"} fill-none animate-draw-path`} style={{ animationDelay: "0.5s" }} />
            {activeNode?.id === "checklist" && <path d="M 72,70 L 88,72" className="stroke-indigo-400 stroke-[0.8] fill-none animate-pulse-glow" />}

            <path d="M 72,70 Q 82,70 86,88" className={`transition-all duration-300 ${activeNode?.id === "report" ? "stroke-indigo-500 stroke-[0.5]" : "stroke-indigo-500/20 stroke-[0.25]"} fill-none animate-draw-path`} style={{ animationDelay: "0.5s" }} />
            {activeNode?.id === "report" && <path d="M 72,70 Q 82,70 86,88" className="stroke-indigo-400 stroke-[0.8] fill-none animate-pulse-glow" />}
          </svg>

          {/* Interactive Mindmap Nodes */}
          {MINDMAP_NODES.map((node, index) => {
            const isActive = activeNode?.id === node.id;
            const isLeaf = node.type === "leaf";

            // Calculate staggered animations
            let delay = 0.2;
            if (node.type === "branch") delay = 0.6;
            else if (node.type === "leaf") {
              delay = 1.0 + (index % 6) * 0.1;
            }

            return (
              <div
                key={node.id}
                style={{
                  position: "absolute",
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  transform: "translate(-50%, -50%)",
                  animation: `popNode 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}s forwards`,
                  opacity: 0
                }}
                className="z-10"
              >
                <button
                  onClick={() => {
                    if (isLeaf) {
                      setActiveNode(node);
                    }
                  }}
                  className={`px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-sans font-black uppercase tracking-wider transition-all duration-300 select-none cursor-pointer ${
                    node.type === "hub"
                      ? "text-sm font-serif font-black tracking-widest text-gold border-gold/40 bg-[#1e1a12]/95 shadow-[0_0_20px_rgba(201,169,110,0.35)]"
                      : node.type === "branch"
                      ? node.colorClass
                      : `${node.colorClass} cursor-pointer ${
                          isActive
                            ? "scale-105 border-white bg-white text-zinc-950 shadow-[0_0_20px_rgba(255,255,255,0.25)]"
                            : ""
                        }`
                  }`}
                >
                  {node.label}
                </button>
              </div>
            );
          })}
        </div>

        {/* Mobile Accordion tree view fallback */}
        <div className="lg:hidden block space-y-4 max-w-md mx-auto animate-fade-in">
          {MINDMAP_NODES.filter(n => n.type === "branch").map((branch) => {
            const leaves = MINDMAP_NODES.filter(n => n.branch === branch.id);
            return (
              <div key={branch.id} className="border border-white/5 bg-zinc-950/60 rounded-xl p-5 text-left">
                <h3 className={`font-serif font-extrabold text-base uppercase tracking-wide mb-3 ${
                  branch.id === "financial" 
                    ? "text-rose-400" 
                    : branch.id === "logistical" 
                    ? "text-amber-400" 
                    : branch.id === "intelligent" 
                    ? "text-emerald-400" 
                    : "text-indigo-400"
                }`}>
                  {branch.label}
                </h3>
                <div className="space-y-2">
                  {leaves.map((leaf) => (
                    <button
                      key={leaf.id}
                      onClick={() => setActiveNode(leaf)}
                      className={`w-full p-3.5 rounded-lg border text-left text-sm font-extrabold block transition-all ${
                        activeNode?.id === leaf.id
                          ? "border-white bg-white text-zinc-950 shadow-md"
                          : "border-zinc-800 bg-zinc-900/50 text-zinc-300"
                      }`}
                    >
                      {leaf.label}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Resolution Details Card */}
        {activeNode && (
          <div className="mt-8 w-full max-w-4xl mx-auto bg-zinc-950/60 border border-white/10 rounded-2xl p-6 md:p-8 text-left shadow-2xl backdrop-blur-md animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4 mb-4">
              <div>
                <span className={`text-[10px] sm:text-xs uppercase font-black tracking-[0.2em] px-3 py-1 rounded-md ${
                  activeNode.branch === "financial" 
                    ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" 
                    : activeNode.branch === "logistical"
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    : activeNode.branch === "intelligent"
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                }`}>
                  {activeNode.branch === "financial" 
                    ? "Financial Trap" 
                    : activeNode.branch === "logistical" 
                    ? "Logistical Mismatch" 
                    : activeNode.branch === "intelligent"
                    ? "Scoring Intelligence"
                    : "Tenant Toolkit"}
                </span>
                <h3 className="font-serif text-xl md:text-2xl uppercase tracking-wider text-white font-bold mt-3">
                  {activeNode.label}
                </h3>
              </div>
              
              <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gold font-bold">
                <Sparkles className="w-4 h-4 shrink-0 animate-pulse" />
                <span>{activeNode.solutionTitle}</span>
              </div>
            </div>
            
            <p className="text-sm md:text-base text-zinc-350 leading-relaxed font-medium">
              {activeNode.solutionDesc}
            </p>
          </div>
        )}
      </section>


    </div>
  );
}