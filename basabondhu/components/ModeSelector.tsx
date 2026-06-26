"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Search, Clipboard, GitCompare, Phone } from "lucide-react";

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const modes = [
  {
    mode: "plan",
    title: "Plan My Search",
    description: "Tell us about your situation — we'll scan 100+ listings and find 3 worth visiting.",
    Icon: Search,
    route: "/portal/wizard",
    solidBg: "bg-blue-600 hover:bg-blue-700",
    iconBg: "bg-white/20",
    textMuted: "text-blue-100",
  },
  {
    mode: "check",
    title: "Check This Listing",
    description: "Paste any messy listing text — we'll extract details, spot red flags, and give a verdict.",
    Icon: Clipboard,
    route: "/portal/parser",
    solidBg: "bg-emerald-600 hover:bg-emerald-700",
    iconBg: "bg-white/20",
    textMuted: "text-emerald-100",
  },
  {
    mode: "fb-fetch",
    title: "Facebook Fetcher",
    description: "Directly parse a Facebook listing URL — extract all rent, specs, and details automatically.",
    Icon: FacebookIcon,
    route: "/portal/fb-fetch",
    solidBg: "bg-[#1877F2] hover:bg-[#166FE5]",
    iconBg: "bg-white/20",
    textMuted: "text-blue-150 text-white/80",
  },
  {
    mode: "compare",
    title: "Compare My Options",
    description: "Put 2-3 listings side by side — see which has the best rent, commute, and lowest upfront cost.",
    Icon: GitCompare,
    route: "/portal/compare",
    solidBg: "bg-violet-600 hover:bg-violet-700",
    iconBg: "bg-white/20",
    textMuted: "text-violet-100",
  },
  {
    mode: "visit",
    title: "Prepare for Visit",
    description: "Get a call-before-visit script in Banglish, plus a custom checklist for your household type.",
    Icon: Phone,
    route: "/portal/visit",
    solidBg: "bg-amber-600 hover:bg-amber-700",
    iconBg: "bg-white/20",
    textMuted: "text-amber-100",
  },
];

export default function ModeSelector() {
  const router = useRouter();
  const [isAssembled, setIsAssembled] = React.useState(true);
  const [isDesktop, setIsDesktop] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1280);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  React.useEffect(() => {
    if (!isDesktop) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsAssembled(false);
        } else {
          if (entry.boundingClientRect.top > 0) {
            setIsAssembled(true);
          }
        }
      },
      { threshold: 0.15 }
    );

    const el = containerRef.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, [isDesktop]);

  const getTranslateStyle = (index: number) => {
    if (!isDesktop || !isAssembled) {
      return {
        transform: "translate(0, 0) scale(1)",
        zIndex: 1,
      };
    }

    const colOffset = 2 - index;
    const tx = `calc(${colOffset * 100}% + ${colOffset * 16}px)`;
    const ty = `${index * 90}px`;

    return {
      transform: `translate(${tx}, ${ty}) scale(0.95)`,
      zIndex: 10 - index,
    };
  };

  const getRoundedClass = (index: number) => {
    if (isDesktop && isAssembled) {
      if (index === 0) return "rounded-t-xl rounded-b-none";
      if (index === 4) return "rounded-b-xl rounded-t-none";
      return "rounded-none";
    }
    return "rounded-xl";
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] ${
        isDesktop && isAssembled ? "min-h-[460px] pb-40" : "min-h-0 pb-0"
      }`}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 h-full w-full">
        {modes.map((mode, index) => {
          const Icon = mode.Icon;
          return (
            <button
              key={mode.mode}
              onClick={() => router.push(mode.route)}
              style={getTranslateStyle(index)}
              className={`relative flex flex-col items-start ${
                mode.solidBg
              } ${getRoundedClass(index)} text-left cursor-pointer hover:shadow-xl transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] group overflow-hidden border-0 text-white ${
                isDesktop && isAssembled 
                  ? "w-full max-w-[260px] h-[90px] p-3 justify-center mx-auto gap-1" 
                  : "w-full h-full min-h-[250px] p-6 sm:p-8 justify-between gap-6"
              }`}
            >
              {/* Building Window grid overlay */}
              <div 
                className={`absolute inset-0 grid grid-cols-4 gap-1.5 p-3.5 transition-opacity duration-700 pointer-events-none ${
                  isDesktop && isAssembled ? "opacity-30" : "opacity-0"
                }`}
              >
                {Array.from({ length: 8 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="border border-white/20 rounded-[1px] bg-yellow-100/10 shadow-[0_0_2px_rgba(254,240,138,0.2)]" 
                  />
                ))}
              </div>

              <div className={`flex flex-col items-start w-full ${isDesktop && isAssembled ? "gap-1" : "gap-4"}`}>
                <div className={`flex items-center gap-3 w-full transition-all duration-500 ${isDesktop && isAssembled ? "flex-row justify-start" : "flex-col items-start gap-4"}`}>
                  <div className={`rounded-xl ${mode.iconBg} flex items-center justify-center transition-all duration-500 ${isDesktop && isAssembled ? "w-8 h-8 shrink-0 bg-white/15 rounded-lg" : "w-12 h-12"}`}>
                    <Icon className={`text-white transition-all duration-500 ${isDesktop && isAssembled ? "w-4 h-4" : "w-6 h-6"}`} />
                  </div>
                  <h3 className={`font-black text-white tracking-tight transition-all duration-500 ${isDesktop && isAssembled ? "text-xs font-extrabold" : "text-lg sm:text-xl"}`}>
                    {mode.title}
                  </h3>
                </div>

                <p className={`leading-relaxed transition-all duration-500 ${
                  isDesktop && isAssembled 
                    ? "opacity-0 max-h-0 overflow-hidden mt-0 text-xs" 
                    : `opacity-100 max-h-24 mt-1 text-xs sm:text-sm font-medium ${mode.textMuted}`
                }`}>
                  {mode.description}
                </p>
              </div>

              <span className={`text-xs sm:text-sm font-bold text-white transition-all duration-500 ${isDesktop && isAssembled ? "opacity-0 max-h-0 overflow-hidden" : "opacity-100 max-h-6 mt-2 hover:translate-x-1 duration-300 inline-flex items-center"}`}>
                Get started <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
