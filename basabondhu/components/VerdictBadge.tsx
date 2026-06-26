"use client";

import React from "react";
import { Verdict } from "@/lib/types";
import { CheckCircle2, HelpCircle, PhoneCall, AlertTriangle } from "lucide-react";

type VerdictBadgeProps = {
  verdict: Verdict;
  size?: "sm" | "md" | "lg";
};

const VERDICT_CONFIG = {
  visit: {
    label: "Worth Visiting",
    icon: CheckCircle2,
    badgeClass: "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30",
  },
  maybe: {
    label: "Maybe",
    icon: HelpCircle,
    badgeClass: "bg-amber-500/10 text-amber-600 border border-amber-500/20 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30",
  },
  "call-first": {
    label: "Call First",
    icon: PhoneCall,
    badgeClass: "bg-sky-500/10 text-sky-600 border border-sky-500/20 dark:bg-sky-500/20 dark:text-sky-400 dark:border-sky-500/30",
  },
  avoid: {
    label: "Avoid",
    icon: AlertTriangle,
    badgeClass: "bg-rose-500/10 text-rose-600 border border-rose-500/20 dark:bg-rose-500/20 dark:text-rose-400 dark:border-rose-500/30",
  },
};

const SIZE_CLASSES = {
  sm: {
    wrapper: "px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider gap-1",
    icon: "w-3 h-3 stroke-[2.5]"
  },
  md: {
    wrapper: "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider gap-1.5",
    icon: "w-3.5 h-3.5 stroke-[2.5]"
  },
  lg: {
    wrapper: "px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider gap-2",
    icon: "w-4 h-4 stroke-[2.5]"
  },
};

export default function VerdictBadge({ verdict, size = "md" }: VerdictBadgeProps) {
  const config = VERDICT_CONFIG[verdict] || VERDICT_CONFIG.maybe;
  const sizeConfig = SIZE_CLASSES[size];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center justify-center font-bold tracking-wide uppercase transition-all duration-300 select-none shadow-xs backdrop-blur-xs ${config.badgeClass} ${sizeConfig.wrapper}`}
    >
      <Icon className={sizeConfig.icon} />
      <span>{config.label}</span>
    </span>
  );
}
