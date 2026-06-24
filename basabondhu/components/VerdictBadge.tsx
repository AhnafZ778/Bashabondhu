"use client";

import React from "react";
import { Verdict } from "@/lib/types";

type VerdictBadgeProps = {
  verdict: Verdict;
  size?: "sm" | "md" | "lg";
};

const VERDICT_CONFIG: Record<Verdict, { label: string; bg: string; color: string; icon: string }> = {
  visit: { label: "Worth Visiting", bg: "#d4edda", color: "#155724", icon: "✅" },
  maybe: { label: "Maybe", bg: "#fff3cd", color: "#856404", icon: "🤔" },
  "call-first": { label: "Call First", bg: "#cce5ff", color: "#004085", icon: "📞" },
  avoid: { label: "Avoid", bg: "#f8d7da", color: "#721c24", icon: "⛔" },
};

const SIZE_CONFIG = {
  sm: { fontSize: "0.7rem", padding: "2px 8px", gap: "3px" },
  md: { fontSize: "0.8rem", padding: "4px 12px", gap: "5px" },
  lg: { fontSize: "0.9rem", padding: "6px 16px", gap: "6px" },
};

export default function VerdictBadge({ verdict, size = "md" }: VerdictBadgeProps) {
  const config = VERDICT_CONFIG[verdict];
  const sizeConfig = SIZE_CONFIG[size];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: sizeConfig.gap,
        padding: sizeConfig.padding,
        borderRadius: "999px",
        fontSize: sizeConfig.fontSize,
        fontWeight: 700,
        backgroundColor: config.bg,
        color: config.color,
        whiteSpace: "nowrap",
        lineHeight: 1.4,
      }}
    >
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
}
