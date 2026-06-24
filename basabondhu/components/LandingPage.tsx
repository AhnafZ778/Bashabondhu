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
  Droplets, 
  Flame, 
  Coins, 
  Lock, 
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
  "Banani", "Gulshan", "Banasree", "Badda", "Mohakhali", "Tejgaon", 
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
    imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80"
  },
  {
    index: "02",
    subtitle: "HISTORICAL FLOOD DATA",
    title: "Waterlogging Risk",
    desc: "Banasree Block D or Dhanmondi 27 looks pristine in the dry winter. By July, the access roads are knee-deep. BasaBondhu overlays historical monsoon water levels and drainage quality to highlight flood-prone areas before you lease.",
    imageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=400&q=80"
  },
  {
    index: "03",
    subtitle: "UTILITY CONNECTION AUDIT",
    title: "Gas Line Lies",
    desc: "Listing descriptions stating \"gas available\" frequently mask cylinder dependencies, which add up to ৳2,000/month to your basic utilities. We directly verify the pipeline connection type before you make a visit.",
    imageUrl: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=400&q=80"
  },
  {
    index: "04",
    subtitle: "LIFESTYLE MATCHING",
    title: "Restrictive Rules",
    desc: "Bachelors and students face strict 11 PM curfews, gate locks, and no-overnight-guest rules. Families require secure compounds. We audit tenant agreement rules to match listings to your lifestyle.",
    imageUrl: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=400&q=80"
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
    <div className="flex-1 flex flex-col bg-[#fbfbfb]">

      {/* ══════════════════════════════════════════════════
          IMMERSIVE SCROLL VIDEO — Full-screen, navbar hidden
          Scroll-driven frame-by-frame cinematic experience.
          This is the FIRST thing visitors see.
          ══════════════════════════════════════════════════ */}
      <div ref={videoSectionRef}>
        <ScrollVideo />
      </div>

      {/* ══════════════════════════════════════════════════
          HERO — Full-cover background image with floating search card
          ══════════════════════════════════════════════════ */}
      <section className="relative min-h-[720px] text-text-main flex items-center overflow-hidden py-12">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/landing.jpeg" 
            alt="BasaBondhu Hero Background" 
            className="w-full h-full object-cover grayscale-[15%] brightness-[90%]" 
          />
          <div className="absolute inset-0 bg-white/20" />
        </div>

        {/* Solid Content Card Overlay */}
        <div className="relative z-10 w-full px-6 sm:px-10 lg:px-16 xl:px-24 py-16 flex justify-start">
          <div className="max-w-xl bg-white border border-black/5 p-8 sm:p-10 rounded-2xl shadow-2xl space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gold/10 border border-gold/20 text-[10px] font-black uppercase tracking-[0.2em] text-[#b5955a]">
              <Sparkles className="w-3.5 h-3.5" />
              Broaden Home Boundaries
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-serif font-bold uppercase tracking-[0.1em] leading-[1.2] text-[#111111]">
              From messy listings to<br />
              <span className="text-gold font-bold">3 homes worth visiting.</span>
            </h1>

            <p className="text-text-muted text-xs sm:text-sm leading-relaxed">
              Tired of scrolling endless Facebook groups, calling bad brokers, and facing surprise landlord curfews? BasaBondhu filters out Dhaka rent traps instantly.
            </p>

            {/* Search Widget */}
            <form 
              onSubmit={handleSearchSubmit} 
              className="space-y-4 w-full pt-2"
            >
              <div className="flex items-center gap-2.5 px-3 py-2.5 bg-bg-alt rounded-lg border border-black/10 hover:border-gold/50 transition-colors">
                <MapPin className="w-4 h-4 text-gold shrink-0" />
                <div className="flex-1 text-left min-w-0">
                  <label className="block text-[8px] uppercase tracking-[0.15em] font-black text-text-muted">Where do you live/work?</label>
                  <select 
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                    className="block w-full text-xs font-bold text-text-main bg-transparent border-0 p-0 focus:ring-0 focus:outline-hidden mt-0.5"
                  >
                    {DHAKA_AREAS.map(area => (
                      <option key={area} value={area} className="bg-card text-text-main font-bold">{area}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2.5 px-3 py-2.5 bg-bg-alt rounded-lg border border-black/10 hover:border-gold/50 transition-colors">
                  <Users className="w-4 h-4 text-gold shrink-0" />
                  <div className="flex-1 text-left min-w-0">
                    <label className="block text-[8px] uppercase tracking-[0.15em] font-black text-text-muted">Who is shifting?</label>
                    <select 
                      value={selectedHousehold}
                      onChange={(e) => setSelectedHousehold(e.target.value as HouseholdType)}
                      className="block w-full text-xs font-bold text-text-main bg-transparent border-0 p-0 focus:ring-0 focus:outline-hidden mt-0.5"
                    >
                      {HOUSEHOLD_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value} className="bg-card text-text-main font-bold">{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 px-3 py-2.5 bg-bg-alt rounded-lg border border-black/10 hover:border-gold/50 transition-colors">
                  <Wallet className="w-4 h-4 text-gold shrink-0" />
                  <div className="flex-1 text-left min-w-0">
                    <label className="block text-[8px] uppercase tracking-[0.15em] font-black text-text-muted">Monthly Budget</label>
                    <select 
                      value={selectedBudget}
                      onChange={(e) => setSelectedBudget(parseInt(e.target.value))}
                      className="block w-full text-xs font-bold text-text-main bg-transparent border-0 p-0 focus:ring-0 focus:outline-hidden mt-0.5"
                    >
                      {BUDGET_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value} className="bg-card text-text-main font-bold">{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gold hover:bg-[#b5955a] text-white font-serif text-[10px] tracking-[0.25em] font-bold rounded-lg uppercase shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all duration-300"
              >
                <Search className="w-4 h-4" />
                Find My Match
              </button>
            </form>

            <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold text-text-muted pt-4 border-t border-black/5">
              <span className="uppercase tracking-wider">Or analyze custom ad:</span>
              <button
                onClick={() => { router.push("/portal/parser"); }}
                className="px-4 py-2 bg-bg-alt hover:bg-white border border-black/10 hover:border-gold text-text-main rounded-lg flex items-center gap-2 cursor-pointer transition-all duration-300"
              >
                <Clipboard className="w-3.5 h-3.5 text-gold" />
                PASTE A FACEBOOK LISTING AD
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          LATEST MATCHES — Navana style launches section
          ══════════════════════════════════════════════════ */}
      <section className="bg-[#eaeaea] py-20 px-6 sm:px-10 lg:px-16 xl:px-24 border-y border-black/5">
        <div className="text-center space-y-2 mb-16">
          <span className="text-gold font-serif text-[10px] sm:text-xs uppercase tracking-[0.4em] block">
            Curated Listings
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif uppercase tracking-[0.15em] text-[#111111] font-bold">
            Latest Matches
          </h2>
          <div className="w-12 h-[1px] bg-gold mx-auto mt-4" />
          <p className="text-xs text-text-muted tracking-wide max-w-md mx-auto pt-2">
            Premium hand-picked listings currently verified in Dhaka's core commuter areas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              tag: "BANANI, DHAKA",
              title: "The Belmont Suites",
              specs: "৳35,000 / month • 3 Beds • Lift & Generator",
              badge: "R E N T A L",
              img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80"
            },
            {
              tag: "GULSHAN, DHAKA",
              title: "Serene Vista Residences",
              specs: "৳45,000 / month • 2 Beds • Piping Gas",
              badge: "R E N T A L",
              img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80"
            },
            {
              tag: "BASHUNDHARA, DHAKA",
              title: "Oakridge Student Studio",
              specs: "৳18,000 / month • 1 Bed • Bachelor Allowed",
              badge: "S U B L E T",
              img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80"
            }
          ].map((item, index) => (
            <div 
              key={index}
              className="relative bg-white border border-black/5 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 pr-8 group cursor-pointer"
              onClick={() => { router.push("/portal"); }}
            >
              {/* Card Image */}
              <div className="aspect-[4/3] w-full overflow-hidden relative">
                <img 
                  src={item.img} 
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
              </div>

              {/* Card Content */}
              <div className="p-6 space-y-2 text-left">
                <span className="text-[9px] uppercase tracking-[0.2em] font-black text-gold block">
                  {item.tag}
                </span>
                <h3 className="font-serif text-lg uppercase tracking-wider text-[#111111] font-bold group-hover:text-gold transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-xs text-text-muted leading-relaxed font-semibold">
                  {item.specs}
                </p>
                <div className="pt-2 flex items-center gap-1.5 text-[9px] uppercase tracking-widest font-black text-primary group-hover:translate-x-1.5 transition-transform duration-300">
                  <span>Explore Match</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </div>

              {/* Rotated Vertical Badge Ribbons */}
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-[#c9a96e] group-hover:bg-[#b5955a] flex items-center justify-center select-none transition-colors duration-300">
                <span className="writing-mode-vertical text-white font-sans text-[8px] font-black uppercase tracking-[0.3em] rotate-180">
                  {item.badge}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          ALL EYES ON VERIFICATION — Twin column design layout
          ══════════════════════════════════════════════════ */}
      <section className="bg-white py-20 px-6 sm:px-10 lg:px-16 xl:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column - Large Image w/ Title Overlap */}
          <div className="lg:col-span-7 relative h-[450px] lg:h-[550px] w-full overflow-hidden rounded-xl shadow-md border border-black/5">
            <img 
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80" 
              alt="BasaBondhu Verification Auditing" 
              className="w-full h-full object-cover grayscale-[10%]"
            />
            {/* Dark tint overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
            
            {/* Giant Title Overlay */}
            <div className="absolute inset-0 flex items-end p-8 sm:p-12">
              <h2 className="font-serif text-white/35 text-5xl sm:text-6xl lg:text-[6.5rem] leading-[0.85] uppercase tracking-[0.05em] select-none font-bold">
                ZERO<br />GUESSWORK
              </h2>
            </div>
          </div>

          {/* Right Column - Overlapping Slideshow Card */}
          <div className="lg:col-span-5 lg:-ml-16 relative z-10">
            <div className="bg-[#fbfbfb] border border-black/10 rounded-xl p-8 sm:p-10 shadow-2xl space-y-6 text-left">
              <div className="flex items-center justify-between pb-4 border-b border-black/5">
                <div>
                  <span className="text-[#c9a96e] font-serif text-2xl font-bold">
                    {VERIFICATION_SLIDES[activeVerificationIndex].index}
                  </span>
                  <span className="text-text-muted/30 font-sans text-xs ml-1">/ 04</span>
                </div>
                <span className="px-2.5 py-1 bg-gold/10 text-gold text-[9px] uppercase font-black tracking-widest rounded-md">
                  {VERIFICATION_SLIDES[activeVerificationIndex].subtitle}
                </span>
              </div>

              <div className="space-y-3">
                <h3 className="font-serif text-xl sm:text-2xl uppercase tracking-wider text-[#111111] font-bold">
                  {VERIFICATION_SLIDES[activeVerificationIndex].title}
                </h3>
                <p className="text-xs text-text-muted leading-relaxed font-semibold">
                  {VERIFICATION_SLIDES[activeVerificationIndex].desc}
                </p>
              </div>

              {/* Crop image for index visual interest */}
              <div className="h-32 w-full overflow-hidden rounded-lg relative">
                <img 
                  src={VERIFICATION_SLIDES[activeVerificationIndex].imageUrl} 
                  alt="Slide Detail" 
                  className="w-full h-full object-cover grayscale-[15%] transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gold/5" />
              </div>

              {/* Slider Dots */}
              <div className="flex items-center gap-2 pt-2">
                {VERIFICATION_SLIDES.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveVerificationIndex(index)}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      activeVerificationIndex === index ? "w-8 bg-[#c9a96e]" : "w-2 bg-black/10 hover:bg-black/30"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          MODE SELECTOR — What do you want to do today?
          ══════════════════════════════════════════════════ */}
      <section className="bg-card border-y border-border-light py-16 px-6 sm:px-10 lg:px-16 xl:px-24 transition-colors duration-300">
        <div className="mb-10">
          <span className="px-3 py-1 bg-primary/8 border border-primary/12 text-primary text-[10px] uppercase font-black tracking-widest rounded-full">
            Choose Your Path
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-text-main tracking-tight mt-4">
            What do you want to do today?
          </h2>
          <p className="text-sm text-text-muted mt-2 max-w-2xl leading-relaxed">
            Each mode gives you a different kind of help — from planning your search to preparing for a flat visit.
          </p>
        </div>
        <ModeSelector />
      </section>

      {/* ══════════════════════════════════════════════════
          PERSONA QUICK-START — Pick your situation
          Premium image-backed cards with SVG icons
          ══════════════════════════════════════════════════ */}
      <section className="bg-[#111111] border-y border-black/5 py-24 px-6 sm:px-10 lg:px-16 xl:px-24 text-center">
        <div className="mb-16 space-y-2">
          <span className="text-gold font-serif text-[10px] sm:text-xs uppercase tracking-[0.4em] block">
            Direct Entry
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif uppercase tracking-[0.15em] text-white font-bold">
            Pick Your Situation
          </h2>
          <div className="w-12 h-[1px] bg-gold mx-auto mt-4" />
          <p className="text-xs text-white/50 tracking-wide max-w-md mx-auto pt-2 font-semibold">
            Select a persona to see instant matching results, cost breakdowns, and call scripts — no signup needed.
          </p>
        </div>

        {/* Top row: 3 large cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          {personas.slice(0, 3).map((p) => (
            <button
              key={p.id}
              onClick={() => handlePersonaSelect(p)}
              className="relative group cursor-pointer rounded-xl overflow-hidden text-left h-[380px] focus:outline-none focus:ring-2 focus:ring-gold/50"
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
              <div className="absolute bottom-0 left-0 right-0 p-6 z-10 space-y-3">
                <div className="space-y-1">
                  <h4 className="text-lg font-serif uppercase tracking-wider text-white font-bold group-hover:text-gold transition-colors duration-300">
                    {p.name}
                  </h4>
                  <p className="text-[10px] uppercase tracking-widest font-black text-gold/80">
                    ৳{p.budgetMonthly.toLocaleString()}/mo
                  </p>
                </div>
                <p className="text-xs text-white/60 leading-relaxed font-semibold line-clamp-2">
                  {p.description}
                </p>
                <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                  <span className="text-[9px] uppercase font-black tracking-widest text-white/70 group-hover:text-gold transition-colors duration-300">
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
              className="relative group cursor-pointer rounded-xl overflow-hidden text-left h-[320px] focus:outline-none focus:ring-2 focus:ring-gold/50"
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
                    <p className="text-xs text-white/60 leading-relaxed font-semibold line-clamp-2 max-w-lg">
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

      {/* ══════════════════════════════════════════════════
          COMPARISON — How We're Different
          ══════════════════════════════════════════════════ */}
      <section className="bg-white py-20 px-6 sm:px-10 lg:px-16 xl:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-4 space-y-6 text-left">
            <div>
              <span className="text-[#c9a96e] font-serif text-[10px] sm:text-xs uppercase tracking-[0.4em] block">
                Integrity first
              </span>
              <h2 className="text-3xl font-serif uppercase tracking-[0.1em] text-[#111111] font-bold mt-2">
                3 Steps to Protect Your Wallet
              </h2>
              <div className="w-12 h-[1px] bg-gold mt-4" />
            </div>

            <p className="text-xs text-text-muted leading-relaxed font-semibold">
              Don't call landlords blind. Query, filter, verify — then visit only 2 or 3 verified places.
            </p>
            
            <div className="space-y-4 pt-2">
              {[
                { n: "1", title: "Define Lifestyle Needs", desc: "Budget, commute hubs, waterlogging tolerance, gas type preferences." },
                { n: "2", title: "Paste & Parse Listings", desc: "Paste a Facebook listing ad. We extract real rent, service charges, and score safety." },
                { n: "3", title: "Verify Before Visiting", desc: "Use custom phone scripts to ask landlords hard questions first." },
              ].map((step) => (
                <div key={step.n} className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-[#c9a96e] text-white font-serif text-xs flex items-center justify-center shrink-0 font-bold select-none">{step.n}</div>
                  <div>
                    <h4 className="font-serif text-sm uppercase tracking-wider text-[#111111] font-bold">{step.title}</h4>
                    <p className="text-[11px] text-text-muted mt-0.5 leading-relaxed font-semibold">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-8 bg-[#fbfbfb] border border-black/10 rounded-xl p-6 sm:p-8 shadow-xl text-left">
            <h3 className="font-serif text-sm uppercase tracking-widest text-[#111111] mb-6 flex items-center gap-2 font-bold">
              <Layers className="w-4 h-4 text-[#c9a96e]" />
              BasaBondhu vs Typical Portals
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-black/5 text-text-muted font-black uppercase tracking-[0.15em] text-[9px] pb-3">
                    <th className="pb-3 pr-4">Feature</th>
                    <th className="pb-3 px-4 text-text-muted/40">Others</th>
                    <th className="pb-3 pl-4 text-gold font-bold">BasaBondhu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 font-semibold text-xs">
                  {[
                    { field: "Search Filters", others: "Price, bedrooms — that's it.", us: "Waterlogging, gas type, curfew rules, commute hubs." },
                    { field: "Messy Ad Parsing", others: "Cannot handle unstructured posts.", us: "Gemini AI parses Facebook posts and extracts metrics." },
                    { field: "Upfront Cost", others: "Shows monthly rent only.", us: "Calculates real day-one shifting cash with advance." },
                    { field: "Landlord Prep", others: "None. You call completely blind.", us: "Custom Banglish phone scripts for every listing." },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-black/5 transition-colors duration-150">
                      <td className="py-4 pr-4 font-serif uppercase tracking-wider text-[#111111] font-bold text-[11px]">{row.field}</td>
                      <td className="py-4 px-4 text-text-muted">{row.others}</td>
                      <td className="py-4 pl-4 font-bold text-[#c9a96e]">
                        <span className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 shrink-0" />
                          {row.us}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          CTA — Solid Theme-Integrated Background
          ══════════════════════════════════════════════════ */}
      <section className="bg-[#111111] text-white py-16 px-6 sm:px-10 lg:px-16 xl:px-24">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 text-left">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-serif uppercase tracking-[0.15em] font-bold text-white">
              Stop Wasting Weekends on Bad Apartments
            </h2>
            <p className="text-white/60 text-xs sm:text-sm max-w-xl leading-relaxed font-semibold">
              Parse confusing listings, calculate real day-one upfront costs, and verify critical details with landlords — all before you leave your home.
            </p>
          </div>
          <button
            onClick={() => { router.push("/portal"); }}
            className="px-8 py-4.5 bg-gold hover:bg-[#b5955a] text-white font-serif text-[10px] tracking-[0.25em] font-bold rounded-lg uppercase transition-all duration-300 shadow-lg shadow-gold/15 flex items-center gap-2 cursor-pointer shrink-0"
          >
            Get Started Free
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
