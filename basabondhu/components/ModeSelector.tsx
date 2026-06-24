"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Search, Clipboard, GitCompare, Phone } from "lucide-react";

const modes = [
  {
    mode: "plan",
    title: "Plan My Search",
    description: "Tell us about your situation — we'll scan 100+ listings and find 3 worth visiting.",
    Icon: Search,
    route: "/portal/wizard",
    accent: "text-blue-600",
    bg: "bg-blue-500/8",
    border: "border-blue-500/15",
    topBar: "bg-blue-500",
  },
  {
    mode: "check",
    title: "Check This Listing",
    description: "Paste any messy listing text — we'll extract details, spot red flags, and give a verdict.",
    Icon: Clipboard,
    route: "/portal/parser",
    accent: "text-emerald-600",
    bg: "bg-emerald-500/8",
    border: "border-emerald-500/15",
    topBar: "bg-emerald-500",
  },
  {
    mode: "compare",
    title: "Compare My Options",
    description: "Put 2-3 listings side by side — see which has the best rent, commute, and lowest upfront cost.",
    Icon: GitCompare,
    route: "/portal/compare",
    accent: "text-violet-600",
    bg: "bg-violet-500/8",
    border: "border-violet-500/15",
    topBar: "bg-violet-500",
  },
  {
    mode: "visit",
    title: "Prepare for Visit",
    description: "Get a call-before-visit script in Banglish, plus a custom checklist for your household type.",
    Icon: Phone,
    route: "/portal/visit",
    accent: "text-amber-600",
    bg: "bg-amber-500/8",
    border: "border-amber-500/15",
    topBar: "bg-amber-500",
  },
];

export default function ModeSelector() {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {modes.map((mode) => {
        const Icon = mode.Icon;
        return (
          <button
            key={mode.mode}
            onClick={() => router.push(mode.route)}
            className="relative flex flex-col items-start gap-3 p-5 bg-card border border-border-light rounded-xl text-left cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group overflow-hidden"
          >
            {/* Accent top bar */}
            <div className={`absolute top-0 left-0 right-0 h-[3px] ${mode.topBar}`} />

            <div className={`w-10 h-10 rounded-lg ${mode.bg} ${mode.border} border flex items-center justify-center`}>
              <Icon className={`w-5 h-5 ${mode.accent}`} />
            </div>

            <h3 className="font-extrabold text-sm text-text-main group-hover:text-primary transition-colors">
              {mode.title}
            </h3>

            <p className="text-xs text-text-muted leading-relaxed">
              {mode.description}
            </p>

            <span className={`text-[11px] font-bold ${mode.accent} mt-auto`}>
              Get started →
            </span>
          </button>
        );
      })}
    </div>
  );
}
