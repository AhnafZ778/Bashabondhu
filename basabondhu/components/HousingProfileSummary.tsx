"use client";

import React from "react";
import { SearchProfile } from "@/lib/types";

type HousingProfileSummaryProps = {
  profile: SearchProfile;
  compact?: boolean;
};

const HOUSEHOLD_LABELS: Record<string, string> = {
  family: "👨‍👩‍👧‍👦 Family",
  couple: "💑 Couple",
  bachelor: "🧑 Bachelor",
  student: "🎓 Student",
  "working-woman": "👩‍💼 Working Woman",
  group: "👥 Group",
  "single-professional": "💼 Professional",
};

export default function HousingProfileSummary({ profile, compact = false }: HousingProfileSummaryProps) {
  if (compact) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        padding: "0.5rem 1rem",
        background: "var(--surface-secondary, #f1f5f9)",
        borderRadius: "12px",
        fontSize: "0.85rem",
      }}>
        <span style={{ fontWeight: 700 }}>{HOUSEHOLD_LABELS[profile.householdType] || profile.householdType}</span>
        <span style={{ color: "var(--text-secondary, #64748b)" }}>•</span>
        <span>৳{profile.budgetMonthly.toLocaleString()}/mo</span>
        <span style={{ color: "var(--text-secondary, #64748b)" }}>•</span>
        <span>{profile.commuteAnchors[0]?.label || "No commute anchor"}</span>
      </div>
    );
  }

  return (
    <div style={{
      padding: "1.25rem",
      background: "var(--surface-primary, #ffffff)",
      border: "1px solid var(--border, #e2e8f0)",
      borderRadius: "16px",
    }}>
      <h3 style={{
        fontSize: "0.9rem",
        fontWeight: 700,
        color: "var(--text-secondary, #64748b)",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        marginBottom: "1rem",
      }}>
        Your Housing Profile
      </h3>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
        <ProfileField label="Household" value={HOUSEHOLD_LABELS[profile.householdType] || profile.householdType} />
        <ProfileField label="Looking For" value={profile.lookingFor === "room-sublet" ? "Room/Sublet" : "Full Flat"} />
        <ProfileField label="Monthly Budget" value={`৳${profile.budgetMonthly.toLocaleString()}`} />
        <ProfileField label="First Month Cash" value={`৳${profile.maxFirstMonthCash.toLocaleString()}`} />
        <ProfileField
          label="Commute To"
          value={profile.commuteAnchors.map(a => a.label).join(", ") || "Not specified"}
        />
        <ProfileField
          label="Top Priority"
          value={profile.priorities[0] || "None set"}
        />
      </div>

      {profile.dealBreakers.length > 0 && (
        <div style={{ marginTop: "0.75rem" }}>
          <span style={{ fontSize: "0.8rem", color: "var(--text-secondary, #64748b)" }}>Deal-breakers: </span>
          <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#ef4444" }}>
            {profile.dealBreakers.join(", ")}
          </span>
        </div>
      )}
    </div>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: "0.75rem", color: "var(--text-secondary, #64748b)", marginBottom: "2px" }}>
        {label}
      </div>
      <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-primary, #1a1a2e)" }}>
        {value}
      </div>
    </div>
  );
}
