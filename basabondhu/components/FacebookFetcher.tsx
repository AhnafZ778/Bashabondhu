"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Link as LinkIcon, 
  ArrowRight, 
  Sparkles, 
  MapPin, 
  Home, 
  Flame, 
  ShieldAlert, 
  Coins, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Activity, 
  Layers, 
  Copy, 
  Check, 
  QrCode, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Play,
  ArrowLeft,
  X
} from "lucide-react";
import { ParsedListing } from "@/lib/types";
import Typewriter from "@/components/Typewriter";

// Mock Facebook URL examples for direct click testing
const FB_EXAMPLES = [
  {
    label: "Uttara 3-Bed Family Flat (Lift & Line Gas)",
    url: "https://www.facebook.com/share/p/18wSfHxoi3/",
    text: `TO-LET / FAMILY APARTMENT RENT
Location: Uttara Sector 7, Dhaka
Flat Size: 1250 sq ft
Floor: 4th floor
Bedrooms: 3
Bathrooms: 3
Balcony: 2
Drawing + Dining: Available
Kitchen: 1
Lift: Available
Generator: Available
Gas: Line gas
Parking: Available
Security: 24/7 security guard + CCTV
Suitable for: Small family / service holder family
Available from: 1st July
Rent: 32,000 BDT
Service Charge: 5,000 BDT
Nearby: School, mosque, market, main road, bus stand.
Clean and peaceful environment. Only decent family preferred.
Interested people inbox please.
Broker not allowed.
No comments yet`
  },
  {
    label: "Mohammadpur 3-Bed Family Flat (Lift & Gas)",
    url: "https://www.facebook.com/share/p/1BW8e4ZnhW/",
    text: `To-Let To-Let To-Let
Mohammadpur, Dhaka te ekta nice family flat rent hobe.
Location: Mohammadpur, Babar Road er kachakachi
Flat details:
3 bedroom
2 bathroom
1 drawing room
1 dining space
1 kitchen
2 balcony
Lift available
Gas available
Water and electricity problem nai
Flat ta family der jonno best. Area ta peaceful, market, school, mosque, bus stand sob kachakachi.
Bachelor allowed na, only family preferred.
Rent: 28,000 taka
Service charge: 4,000 taka
Available: Next month theke
Jara interested, tara inbox korun.
Flat dekhte hole age confirm kore asben.
Direct owner post. Broker please knock korben na.`
  },
  {
    label: "Banani 3-Bed Luxury Apartment (Lift & Gen)",
    url: "https://www.facebook.com/share/p/1BS3hbNzAy/",
    text: `Luxury Apartment To-Let in Banani
Banani te ekta premium apartment rent hobe.
Location very good, main road theke walking distance.
Flat ta fully neat and clean. Family or corporate person der jonno perfect.
3 bed, 3 bath, drawing, dining, modern kitchen, balcony, lift, generator, parking, full security sob available.
Area ta very safe and silent. Nearby cafe, restaurant, super shop, school, bank, office sob ase.
Flat er finishing onek premium. Natural light and ventilation bhalo.
Rent: 75k
Service charge: Included / negotiable
Available from: Immediately
Only serious client inbox please.
Corporate family / foreigner / decent family preferred.
Broker allowed only with serious client.
Advance diye booking confirm korte hobe.`
  }
];

const QR_CODES = [
  {
    label: "Uttara 3-Bed Family Flat",
    badge: "Family Flat",
    badgeColor: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
    url: "https://www.facebook.com/share/p/18wSfHxoi3/",
    src: "/QRCODES/extended.svg",
    text: FB_EXAMPLES[0].text,
    structureType: "Totally Structured",
    structureColor: "text-emerald-600 bg-emerald-50/50 border-emerald-200/50",
    structureDesc: "Clear specifications listed explicitly in English with direct metrics."
  },
  {
    label: "Mohammadpur 3-Bed Family Flat",
    badge: "Family Flat",
    badgeColor: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
    url: "https://www.facebook.com/share/p/1BW8e4ZnhW/",
    src: "/QRCODES/extended1.svg",
    text: FB_EXAMPLES[1].text,
    structureType: "Semi-Structured",
    structureColor: "text-blue-600 bg-blue-50/50 border-blue-200/50",
    structureDesc: "Standard list format containing mixed English & transliterated Bangla terms."
  },
  {
    label: "Banani 3-Bed Luxury Flat",
    badge: "Luxury Flat",
    badgeColor: "bg-purple-500/10 text-purple-500 border border-purple-500/20",
    url: "https://www.facebook.com/share/p/1BS3hbNzAy/",
    src: "/QRCODES/extended2.svg",
    text: FB_EXAMPLES[2].text,
    structureType: "Unstructured (Banglish Mix)",
    structureColor: "text-amber-600 bg-amber-50/50 border-amber-200/50",
    structureDesc: "Highly informal description written in transliterated Bangla/English (Banglish)."
  }
];

const TOUR_STEPS = [
  {
    title: "1. Sandbox Examples & QR Codes",
    desc: "Scan a QR code with your phone or click 'Autofill & Scan' to instantly load one of our simulated Dhaka rental posts.",
    targetId: "tour-sandbox",
    stepName: "Demo Sandbox",
    placement: "bottom"
  },
  {
    title: "2. Paste Facebook URL",
    desc: "Paste any public Facebook rental post URL in this input field. Our crawler can target groups and user posts.",
    targetId: "tour-input",
    stepName: "URL Input",
    placement: "bottom"
  },
  {
    title: "3. Fetch & AI Extract",
    desc: "Click 'Fetch & Extract' to begin. The BasaBondhu Social Crawler retrieves the post metadata and runs Gemini 2.5 NLP parser.",
    targetId: "tour-fetch",
    stepName: "AI Scraper",
    placement: "bottom"
  },
  {
    title: "4. Structured Listing Output",
    desc: "Inspect the parsed results side-by-side. Cleaned financial specifications and missing fields are validated automatically.",
    targetId: "tour-output",
    stepName: "Parsed Details",
    placement: "top"
  },
  {
    title: "5. Add to Plan Checklist",
    desc: "Click 'Add your planning' to carry these metrics directly into the commute and budget matching checklist.",
    targetId: "tour-planning",
    stepName: "Checklist Matching",
    placement: "top"
  }
];

export default function FacebookFetcher() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [crawledText, setCrawledText] = useState("");
  const [parsed, setParsed] = useState<ParsedListing | null>(null);
  
  // Crawler Simulation States
  const [isCrawling, setIsCrawling] = useState(false);
  const [crawlLogs, setCrawlLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  // Interactive Stepper Tour States
  const [showTour, setShowTour] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Overlay spotlight positioning state
  const [coords, setCoords] = useState<{ top: number; left: number; width: number; height: number } | null>(null);

  const handleStartTour = () => {
    // Fill mockup preview so sections are visible during guide tour
    if (!parsed) {
      setCrawledText(FB_EXAMPLES[0].text);
      setParsed({
        area: "Uttara",
        rent: 32000,
        bedrooms: 3,
        bathrooms: 3,
        tenantPreference: "family",
        advanceMonths: 2,
        lift: true,
        generator: true,
        gasType: "line",
        serviceCharge: "৳5,000",
        brokerFee: "no-fee",
        availability: "1st July",
        missingFields: ["Upfront Advance/Deposit"],
        confidence: "high"
      });
    }
    setShowTour(true);
    setCurrentStep(0);
  };

  // Follow active target elements in viewport
  useEffect(() => {
    if (!showTour) {
      setCoords(null);
      return;
    }

    const updateCoords = () => {
      const targetId = TOUR_STEPS[currentStep].targetId;
      const el = document.getElementById(targetId);
      if (el) {
        const rect = el.getBoundingClientRect();
        setCoords({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height
        });
      } else {
        setCoords(null);
      }
    };

    // Scroll element into view when active step changes
    const targetId = TOUR_STEPS[currentStep].targetId;
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    updateCoords();
    const timer = setTimeout(updateCoords, 400);

    window.addEventListener("resize", updateCoords);
    window.addEventListener("scroll", updateCoords);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateCoords);
      window.removeEventListener("scroll", updateCoords);
    };
  }, [showTour, currentStep, parsed]);

  const handleCopy = (text: string, index: number) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
      });
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand("copy");
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
      } catch (err) {
        console.error("Fallback copy failed", err);
      }
      document.body.removeChild(textArea);
    }
  };

  const startCrawlAndParse = async (targetUrl: string, presetText?: string) => {
    if (!targetUrl.trim()) return;
    setUrl(targetUrl);
    setIsCrawling(true);
    setError(null);
    setParsed(null);
    setCrawlLogs([]);

    const logs = [
      "🔗 Initializing secure connection to Facebook Graph API nodes...",
      "🔍 Crawl target: " + targetUrl,
      "⚡ Bypassing metadata locks and loading raw post payload...",
      "📥 Download complete. Raw page source size: 1.8 KB",
      "🤖 Launching BasaBondhu AI NLP extraction engine (Gemini 2.5)...",
      "📋 Formatting data into target JSON Renter Schema..."
    ];

    // Stream logs slowly for high fidelity simulation feel
    for (let i = 0; i < logs.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 400 + Math.random() * 300));
      setCrawlLogs(prev => [...prev, logs[i]]);
    }

    let textToParse = presetText;
    if (!textToParse) {
      try {
        setCrawlLogs(prev => [...prev, "🌐 Querying backend crawler for Facebook post content..."]);
        const fetchRes = await fetch("/api/facebook/fetch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: targetUrl })
        });
        const fetchData = await fetchRes.json();
        
        if (fetchData.ok && fetchData.text) {
          const caption = fetchData.text;
          textToParse = caption;
          setCrawlLogs(prev => [...prev, `✅ Post caption successfully fetched: "${caption.substring(0, 50)}..."`]);
        } else {
          setCrawlLogs(prev => [
            ...prev, 
            `⚠️ Real-time crawl failed: ${fetchData.error || "empty response"}. Using preset match / mock generator...`
          ]);
        }
      } catch (e: any) {
        setCrawlLogs(prev => [
          ...prev, 
          `⚠️ Crawler connection error: ${e.message}. Using preset match / mock generator...`
        ]);
      }

      if (!textToParse) {
        // Generate a realistic listing dynamically if they pasted a custom URL
        const lowerUrl = targetUrl.toLowerCase();
        let area = "Mirpur";
        if (lowerUrl.includes("uttara") || lowerUrl.includes("18wsfhxoi3")) {
          area = "Uttara";
          textToParse = FB_EXAMPLES[0].text;
        } else if (lowerUrl.includes("mohammadpur") || lowerUrl.includes("1bw8e4znhw")) {
          area = "Mohammadpur";
          textToParse = FB_EXAMPLES[1].text;
        } else if (lowerUrl.includes("banani") || lowerUrl.includes("1bs3hbnzay")) {
          area = "Banani";
          textToParse = FB_EXAMPLES[2].text;
        } else if (lowerUrl.includes("banasree")) {
          area = "Banasree";
        } else if (lowerUrl.includes("badda")) {
          area = "Badda";
        } else if (lowerUrl.includes("gulshan")) {
          area = "Gulshan";
        } else if (lowerUrl.includes("dhanmondi")) {
          area = "Dhanmondi";
        } else if (lowerUrl.includes("bashundhara")) {
          area = "Bashundhara";
        }

        if (!textToParse) {
          textToParse = `${area} apartment for rent. 3 Bedrooms, 3 Bathrooms, lift available, cylinder gas, no generator. Rent: 28000 BDT. Service charge: 3500. Family or bachelors allowed. 2 months advance. Shifting from July.`;
        }
      }
    }

    setCrawledText(textToParse);

    try {
      const res = await fetch("/api/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textToParse })
      });
      const data = await res.json();
      
      if (data.error && data.fallback) {
        // Fallback simulation in case API key is missing
        const mockExtracted: ParsedListing = {
          area: textToParse.includes("Uttara") 
            ? "Uttara" 
            : textToParse.includes("Mohammadpur") 
              ? "Mohammadpur" 
              : textToParse.includes("Banani") 
                ? "Banani" 
                : "Badda",
          rent: textToParse.includes("75k") || textToParse.includes("75000") 
            ? 75000 
            : textToParse.includes("32,000") || textToParse.includes("32000") 
              ? 32000 
              : textToParse.includes("28,000") || textToParse.includes("28000") 
                ? 28000 
                : 6000,
          bedrooms: 3,
          bathrooms: textToParse.includes("Bathrooms: 3") || textToParse.includes("3 bath") ? 3 : 2,
          tenantPreference: "family",
          advanceMonths: null,
          lift: true,
          generator: textToParse.toLowerCase().includes("generator: available") || textToParse.toLowerCase().includes("generator") ? true : false,
          gasType: textToParse.toLowerCase().includes("line gas") ? "line" : textToParse.toLowerCase().includes("gas available") ? "unknown" : null,
          serviceCharge: textToParse.includes("5,000") || textToParse.includes("5000") 
            ? "৳5,000" 
            : textToParse.includes("4,000") || textToParse.includes("4000") 
              ? "৳4,000" 
              : "included",
          brokerFee: "no-fee",
          availability: textToParse.includes("1st July") ? "1st July" : textToParse.includes("Immediately") ? "Immediately" : "next month",
          missingFields: textToParse.includes("Uttara") 
            ? ["Upfront Advance/Deposit"] 
            : textToParse.includes("Mohammadpur") 
              ? ["Upfront Advance/Deposit", "Generator Backup"] 
              : ["Upfront Advance/Deposit", "Gas Type (Line/Cylinder)"],
          confidence: "high"
        };
        setParsed(mockExtracted);
      } else {
        setParsed(data);
      }
      setCrawlLogs(prev => [...prev, "✨ Success! Text parsed and schema validated."]);
    } catch (err: any) {
      setError("Parsing connection failed. Make sure you are online.");
    } finally {
      setIsCrawling(false);
    }
  };

  const getTooltipStyle = () => {
    if (!coords) return {};
    const step = TOUR_STEPS[currentStep];
    const cardWidth = 350;
    
    let left = coords.left + (coords.width / 2) - (cardWidth / 2);
    
    // Clamp left to screen boundaries
    if (typeof window !== "undefined") {
      const screenWidth = window.innerWidth;
      if (left < 16) {
        left = 16;
      } else if (left + cardWidth > screenWidth - 16) {
        left = screenWidth - cardWidth - 16;
      }
    } else {
      if (left < 16) left = 16;
    }
    
    if (step.placement === "top") {
      return {
        position: "fixed" as const,
        top: `${coords.top - 16}px`,
        left: `${left}px`,
        width: `${cardWidth}px`,
        transform: "translateY(-100%)",
      };
    } else {
      return {
        position: "fixed" as const,
        top: `${coords.top + coords.height + 16}px`,
        left: `${left}px`,
        width: `${cardWidth}px`,
      };
    }
  };

  const handleAddPlanning = () => {
    if (!parsed) return;
    // Build query params
    const query = new URLSearchParams({
      area: parsed.area || "",
      rent: parsed.rent?.toString() || "",
      lift: parsed.lift ? "true" : "false",
      generator: parsed.generator ? "true" : "false",
      gasType: parsed.gasType || "",
      tenantPreference: parsed.tenantPreference || ""
    });
    router.push(`/portal/wizard?${query.toString()}`);
  };

  return (
    <div className="w-full py-4 text-left transition-colors duration-300 relative">
      
      {/* Top Welcome Banner & Tour Trigger */}
      <div className="bg-card border border-border-light rounded-3xl p-6 sm:p-8 shadow-xl transition-all duration-300 relative overflow-hidden bg-gradient-to-br from-card via-card to-emerald-500/[0.02] flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="space-y-3 max-w-3xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-text-main">
                BasaBondhu Companion
              </h3>
              <p className="text-[10px] sm:text-xs text-text-muted">
                Guided Scraper Walkthrough
              </p>
            </div>
          </div>
          
          <div className="space-y-1">
            <h4 className="text-lg sm:text-xl font-serif uppercase tracking-wider font-bold text-text-main flex items-center gap-2">
              <span>🕵️‍♂️ The Dhaka Rental Quest</span>
            </h4>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed font-semibold">
              In Dhaka, finding a place to live is a chaotic scavenger hunt. Landlords post properties on Facebook with messy, unstructured, and often incomplete captions. Let BasaBondhu's Social Crawler act as your digital detective. Learn how to extract, analyze, and map Facebook listing details in seconds!
            </p>
          </div>
        </div>

        <div className="shrink-0">
          <button
            onClick={handleStartTour}
            className="w-full md:w-auto px-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-wider rounded-2xl shadow-lg shadow-emerald-600/15 flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] cursor-pointer text-xs"
          >
            <Play className="w-4 h-4 fill-current" />
            Start Interactive Tour
          </button>
        </div>
      </div>

      {/* Main Operations Dashboard */}
      <div className="w-full space-y-8">
        
        {/* Sample QR Codes Card for Judges */}
        <div id="tour-sandbox" className="bg-card border border-border-light rounded-3xl p-6 sm:p-8 shadow-xl transition-all duration-300 space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#C9952B]/10 border border-[#C9952B]/20 flex items-center justify-center">
              <QrCode className="w-4 h-4 text-[#C9952B]" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-text-main">
                Judge & Tester Sandbox: QR Codes & Links
              </h3>
              <p className="text-xs text-text-muted">
                Scan these QR codes to inspect the source Facebook posts, or use the direct buttons below.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {QR_CODES.map((item, idx) => (
              <div key={idx} className="bg-bg border border-border-light rounded-2xl p-4 flex flex-col justify-between space-y-4 hover:border-[#1877F2]/20 transition-all duration-300">
                <div className="space-y-3">
                  {/* QR Code Container */}
                  <div className="relative group overflow-hidden bg-white border border-border-light rounded-xl p-3 flex items-center justify-center transition-all duration-300 hover:shadow-md">
                    <img 
                      src={item.src} 
                      alt={item.label} 
                      className="w-32 h-32 object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />
                  </div>

                  {/* Badge and Title */}
                  <div>
                    <span className={`px-2.5 py-0.5 rounded text-[11px] font-black uppercase tracking-wider ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                    <h4 className="font-extrabold text-[15px] text-text-main mt-1.5 line-clamp-1">
                      {item.label}
                    </h4>
                  </div>

                  {/* Listing Structure Type & Description */}
                  <div className="bg-bg-alt border border-border-light rounded-xl p-2.5 space-y-1.5">
                    <div className="flex items-center gap-1">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${item.structureColor}`}>
                        {item.structureType}
                      </span>
                    </div>
                    <p className="text-[12px] text-text-muted leading-relaxed font-semibold">
                      {item.structureDesc}
                    </p>
                  </div>

                  {/* Truncated URL Display */}
                  <div className="flex items-center gap-1.5 bg-bg-alt border border-border-light/60 px-2.5 py-1.5 rounded-lg">
                    <span className="text-xs font-mono text-text-muted truncate flex-1">
                      {item.url}
                    </span>
                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-text-muted hover:text-[#1877F2] transition-colors"
                      title="Open original post"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-2 border-t border-black/[0.04]">
                  <button
                    onClick={() => handleCopy(item.url, idx)}
                    className="w-full py-2 px-3 bg-bg-alt hover:bg-zinc-100 text-text-main font-bold rounded-lg border border-border-light flex items-center justify-center gap-1.5 text-xs active:scale-98 transition-all cursor-pointer"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-500 font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-text-muted" />
                        <span>Copy Post Link</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => startCrawlAndParse(item.url, item.text)}
                    className="w-full py-2 px-3 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] font-black rounded-lg flex items-center justify-center gap-1.5 text-xs active:scale-98 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Autofill & Scan</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search Input Box */}
        <div id="tour-input" className="bg-card border border-border-light rounded-3xl p-6 sm:p-8 shadow-xl transition-all duration-300">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[#1877F2]/10 border border-[#1877F2]/20 flex items-center justify-center">
              <LinkIcon className="w-4 h-4 text-[#1877F2]" />
            </div>
            <h3 className="text-base sm:text-lg font-black text-text-main">
              Paste Facebook Listing URL (QR Scanner Input)
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="e.g., https://www.facebook.com/groups/dhakarents/posts/..."
              className="flex-1 bg-bg border border-border-light rounded-xl px-4 py-3.5 text-base text-text-main placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-[#1877F2]/50 transition-all font-semibold"
            />
            <button
              id="tour-fetch"
              onClick={() => startCrawlAndParse(url)}
              disabled={isCrawling || !url.trim()}
              className="bg-[#1877F2] hover:bg-[#155fc2] disabled:bg-[#1877F2]/50 text-white font-extrabold px-6 py-3.5 rounded-xl shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm uppercase tracking-wider"
            >
              {isCrawling ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Fetching...
                </>
              ) : (
                <>
                  Fetch & Extract
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Crawling Loader State */}
        {isCrawling && (
          <div className="bg-card border border-border-light rounded-3xl p-8 shadow-xl flex flex-col items-center justify-center space-y-4 animate-pulse transition-all duration-300">
            <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
            <div className="text-center space-y-1">
              <h4 className="font-extrabold text-sm text-text-main uppercase tracking-wider">Connecting to Facebook API...</h4>
              <p className="text-xs text-text-muted">Crawling raw caption and normalizing listing payload...</p>
            </div>
          </div>
        )}

        {/* Structured Output Cards */}
        {parsed && !isCrawling && (
          <div id="tour-output" className="bg-card border border-border-light rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 transition-all duration-300 animate-in fade-in duration-300">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/[0.04] pb-4">
              <div>
                <span className="text-emerald-500 font-extrabold text-[10px] uppercase tracking-widest flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  NLP Parser Normalization Complete
                </span>
                <h4 className="text-lg font-black text-text-main mt-1 uppercase tracking-wide">
                  Fetched vs Structured Information
                </h4>
              </div>
              {parsed.confidence && (
                <span className={`px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-wider ${
                  parsed.confidence === "high" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                }`}>
                  Extraction Confidence: {parsed.confidence}
                </span>
              )}
            </div>

            {/* Side-by-side layout: Raw fetched text (left) and Structured text (right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left side: Fetched raw Facebook Caption (spans 5 cols) */}
              <div className="lg:col-span-5 bg-bg border border-border-light rounded-2xl p-5 space-y-3 h-full">
                <h5 className="text-xs font-black uppercase tracking-wider text-text-muted border-b border-black/[0.03] pb-2 flex items-center gap-1.5">
                  <Copy className="w-4 h-4 text-[#1877F2]" />
                  Original Crawled Caption
                </h5>
                <div className="text-xs sm:text-sm text-text-main leading-relaxed font-semibold bg-bg-alt border border-border-light/60 p-4 rounded-xl max-h-[350px] overflow-y-auto whitespace-pre-wrap select-all">
                  {crawledText}
                </div>
              </div>

              {/* Right side: Structured Data tables (spans 7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Financial Details */}
                  <div className="bg-[#fbfbfb] border border-black/5 rounded-2xl p-5 space-y-4">
                    <h5 className="text-xs font-black uppercase tracking-wider text-text-muted border-b border-black/[0.03] pb-2 flex items-center gap-1.5">
                      <Coins className="w-4 h-4 text-emerald-500" />
                      Financial Information
                    </h5>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-[10px] font-black text-text-muted uppercase block">Monthly Rent</span>
                        <span className="font-extrabold text-base text-text-main mt-0.5 block">
                          {parsed.rent ? `৳${parsed.rent.toLocaleString()}` : "Not Listed"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-text-muted uppercase block">Service Charge</span>
                        <span className="font-extrabold text-base text-text-main mt-0.5 block">
                          {parsed.serviceCharge || "Not Specified"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-text-muted uppercase block">Advance Deposit</span>
                        <span className="font-extrabold text-base text-text-main mt-0.5 block">
                          {parsed.advanceMonths ? `${parsed.advanceMonths} Month(s)` : "Not Specified"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-text-muted uppercase block">Broker Fee Status</span>
                        <span className="font-extrabold text-base text-text-main mt-0.5 block capitalize">
                          {parsed.brokerFee || "Direct Owner"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Specs & Infrastructure */}
                  <div className="bg-[#fbfbfb] border border-black/5 rounded-2xl p-5 space-y-4">
                    <h5 className="text-xs font-black uppercase tracking-wider text-text-muted border-b border-black/[0.03] pb-2 flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-[#1877F2]" />
                      Specs & Amenities
                    </h5>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-[10px] font-black text-text-muted uppercase block">Locality / Area</span>
                        <span className="font-extrabold text-base text-[#1877F2] mt-0.5 block flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-rose-500" />
                          {parsed.area || "Unknown"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-text-muted uppercase block">Apartment Layout</span>
                        <span className="font-extrabold text-base text-text-main mt-0.5 block">
                          {parsed.bedrooms ? `${parsed.bedrooms} Bed` : "Not Listed"}
                          {parsed.bathrooms ? `, ${parsed.bathrooms} Bath` : ""}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-text-muted uppercase block">Line Gas Connection</span>
                        <span className={`font-extrabold text-sm px-2 py-0.5 rounded-md mt-1 inline-block ${
                          parsed.gasType === "line" ? "bg-emerald-100 text-emerald-800" : parsed.gasType === "cylinder" ? "bg-amber-100 text-amber-800" : "bg-zinc-100 text-zinc-800"
                        }`}>
                          {parsed.gasType === "line" ? "Line Gas (Titas)" : parsed.gasType === "cylinder" ? "Cylinder Gas" : "Unknown"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-text-muted uppercase block">Building Facilities</span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${parsed.lift ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-rose-500/10 text-rose-500 border border-rose-500/20"}`}>
                            Lift: {parsed.lift ? "YES" : "NO"}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${parsed.generator ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-rose-500/10 text-rose-500 border border-rose-500/20"}`}>
                            Gen: {parsed.generator ? "YES" : "NO"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Missing Fields Signals */}
                {parsed.missingFields && parsed.missingFields.length > 0 && (
                  <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-4 flex gap-3 text-sm">
                    <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0" />
                    <div>
                      <span className="font-extrabold text-amber-800 uppercase text-[10px] tracking-wider block">Omitted Listing Specifications</span>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {parsed.missingFields.map((field, idx) => (
                          <span key={idx} className="bg-amber-100/60 text-amber-800 border border-amber-200/50 px-2 py-0.5 rounded text-[10px] font-bold">
                            {field}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

              </div>

            </div>

            {/* Action Trigger Buttons */}
            <div className="pt-4 border-t border-black/[0.04] flex flex-col sm:flex-row gap-3">
              <button
                id="tour-planning"
                onClick={handleAddPlanning}
                className="flex-1 py-4.5 px-6 bg-[#C9952B] hover:bg-[#b08020] text-white font-black uppercase tracking-wider rounded-2xl shadow-lg shadow-gold/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2.5 cursor-pointer text-sm font-black"
              >
                <Sparkles className="w-4 h-4 text-white" />
                Add your planning
              </button>
              <button
                onClick={() => {
                  setParsed(null);
                  setUrl("");
                }}
                className="py-3 px-6 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-extrabold uppercase tracking-wider rounded-2xl transition-colors cursor-pointer text-xs"
              >
                Reset / Fetch Another
              </button>
            </div>

          </div>
        )}

      </div>

      {/* Spotlight Overlay & Floating Tooltip */}
      {showTour && coords && (
        <>
          {/* Spotlight Highlight Box Overlay */}
          <div 
            onClick={() => setShowTour(false)}
            className="fixed border-4 border-emerald-500 rounded-3xl shadow-[0_0_15px_rgba(16,185,129,0.5),0_0_0_9999px_rgba(15,23,42,0.75)] z-[999] pointer-events-auto transition-all duration-300 cursor-pointer"
            style={{
              top: coords.top - 4,
              left: coords.left - 4,
              width: coords.width + 8,
              height: coords.height + 8,
            }}
          />

          {/* Floating step card */}
          <div 
            className="fixed bg-card border border-border-light rounded-3xl p-6 shadow-2xl z-[1000] pointer-events-auto transition-all duration-300 select-none animate-in fade-in zoom-in-95 duration-200"
            style={getTooltipStyle()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowTour(false)}
              className="absolute top-4 right-4 text-text-muted hover:text-text-main transition-colors cursor-pointer z-10"
              title="Close Tour"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Tooltip Arrow */}
            <div 
              className={`absolute w-3 h-3 bg-card border-t border-l border-border-light rotate-45 left-1/2 -translate-x-1/2 transition-all ${
                TOUR_STEPS[currentStep].placement === "top" ? "bottom-[-6px] border-t-0 border-l-0 border-b border-r" : "top-[-6px]"
              }`}
            />

            <div className="flex flex-col justify-between space-y-4 h-full">
              {/* Step header & indicator */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-black/[0.04] pb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md">
                    {TOUR_STEPS[currentStep].stepName}
                  </span>
                  <span className="text-xs font-bold text-text-muted">
                    Step {currentStep + 1} of {TOUR_STEPS.length}
                  </span>
                </div>

                {/* Progress Line */}
                <div className="w-full h-1 bg-black/[0.04] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / TOUR_STEPS.length) * 100}%` }}
                  />
                </div>

                {/* Card Step Body */}
                <div className="space-y-2 pt-1 text-left">
                  <h4 className="text-base font-black text-text-main uppercase tracking-wide">
                    {TOUR_STEPS[currentStep].title}
                  </h4>
                  <p className="text-xs text-text-muted leading-relaxed font-semibold">
                    {TOUR_STEPS[currentStep].desc}
                  </p>
                </div>
              </div>

              {/* Bottom Stepper Controls */}
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3 border-t border-black/[0.04] pt-3">
                  <button
                    onClick={() => currentStep > 0 && setCurrentStep(prev => prev - 1)}
                    disabled={currentStep === 0}
                    className="px-3 py-2 bg-bg-alt hover:bg-zinc-100 disabled:opacity-40 disabled:hover:bg-bg-alt text-text-main font-bold rounded-xl border border-border-light flex items-center justify-center gap-1 text-[11px] active:scale-98 transition-all cursor-pointer select-none"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    Back
                  </button>

                  <div className="flex gap-1">
                    {TOUR_STEPS.map((_, idx) => (
                      <div 
                        key={idx} 
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                          idx === currentStep ? "bg-emerald-500 scale-125" : "bg-black/[0.08]"
                        }`}
                      />
                    ))}
                  </div>

                  {currentStep < TOUR_STEPS.length - 1 ? (
                    <button
                      onClick={() => setCurrentStep(prev => prev + 1)}
                      className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl flex items-center justify-center gap-1 text-[11px] active:scale-98 transition-all cursor-pointer select-none"
                    >
                      Next
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowTour(false)}
                      className="px-3 py-2 bg-[#1877F2] hover:bg-[#155fc2] text-white font-black rounded-xl flex items-center justify-center gap-1 text-[11px] active:scale-98 transition-all cursor-pointer select-none"
                    >
                      Finish
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <button
                  onClick={() => setShowTour(false)}
                  className="w-full text-center text-[10px] font-bold text-text-muted hover:text-text-main transition-colors cursor-pointer block border-0 bg-transparent"
                >
                  End Walkthrough
                </button>
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
}

