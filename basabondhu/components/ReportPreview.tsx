"use client";

import React, { useRef } from "react";
import { HousingReport, ScoredListing, ChecklistSection } from "@/lib/types";
import VerdictBadge from "./VerdictBadge";
import { motion } from "framer-motion";

type ReportPreviewProps = {
  report: HousingReport;
};

export default function ReportPreview({ report }: ReportPreviewProps) {
  const reportRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Report link copied!");
  };

  return (
    <div ref={reportRef} style={{ maxWidth: "800px", margin: "0 auto", padding: "1.5rem" }}>
      {/* Header */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{
          textAlign: "center",
          marginBottom: "2rem",
          paddingBottom: "1.5rem",
          borderBottom: "3px solid var(--accent-primary, #0f3460)",
        }}
      >
        <h1 style={{
          fontSize: "1.75rem",
          fontWeight: 800,
          color: "var(--text-primary, #1a1a2e)",
          marginBottom: "0.5rem",
        }}>
          🏠 BasaBondhu Housing Report
        </h1>
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary, #64748b)" }}>
          Generated: {new Date(report.generatedAt).toLocaleDateString("en-GB", {
            day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
          })}
        </p>

        {/* Action buttons - hidden in print */}
        <div className="no-print" style={{ display: "flex", gap: "0.75rem", justifyContent: "center", marginTop: "1rem" }}>
          <button
            onClick={handlePrint}
            style={{
              padding: "0.5rem 1.25rem",
              background: "var(--accent-primary, #0f3460)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "0.85rem",
            }}
          >
            🖨️ Print / PDF
          </button>
          <button
            onClick={handleCopyLink}
            style={{
              padding: "0.5rem 1.25rem",
              background: "var(--surface-secondary, #f1f5f9)",
              color: "var(--text-primary, #1a1a2e)",
              border: "1px solid var(--border, #e2e8f0)",
              borderRadius: "8px",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "0.85rem",
            }}
          >
            📋 Copy Link
          </button>
        </div>
      </motion.div>

      {/* Section 1: Profile Summary */}
      <ReportSection title="📝 Your Profile" delay={0.1}>
        <p style={{ lineHeight: 1.7, color: "var(--text-primary, #1a1a2e)" }}>
          {report.profileSummary}
        </p>
      </ReportSection>

      {/* Section 2: Recommended Areas */}
      {report.recommendedAreas.length > 0 && (
        <ReportSection title="📍 Recommended Areas" delay={0.15}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.75rem" }}>
            {report.recommendedAreas.map(area => (
              <div
                key={area.id}
                style={{
                  padding: "0.75rem",
                  background: "var(--surface-secondary, #f8f9fa)",
                  borderRadius: "10px",
                  border: "1px solid var(--border, #e2e8f0)",
                }}
              >
                <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>{area.name}</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary, #64748b)" }}>
                  {area.rentRange} • {area.bestFor[0]}
                </div>
              </div>
            ))}
          </div>
        </ReportSection>
      )}

      {/* Section 3: Scan Summary */}
      <ReportSection title="🔍 Scan Summary" delay={0.2}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
          gap: "0.75rem",
          textAlign: "center",
        }}>
          <StatCard label="Scanned" value={report.scanSummary.scanned} color="#3b82f6" />
          <StatCard label="Over Budget" value={report.scanSummary.removedBudget} color="#ef4444" />
          <StatCard label="Bad Commute" value={report.scanSummary.removedCommute} color="#f97316" />
          <StatCard label="Hidden Cost" value={report.scanSummary.removedHiddenCost} color="#eab308" />
          <StatCard label="Selected" value={report.scanSummary.selected} color="#10b981" />
        </div>
      </ReportSection>

      {/* Section 4: Top Listings */}
      <ReportSection title="🏠 Top Listings" delay={0.25}>
        {report.topListings.map((listing, i) => (
          <ListingCard key={listing.id} listing={listing} rank={i + 1} />
        ))}
      </ReportSection>

      {/* Section 5: Cost Comparison */}
      {report.costSummaries.length > 0 && (
        <ReportSection title="💰 First-Month Costs" delay={0.3}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--border, #e2e8f0)" }}>
                <th style={thStyle}>Listing</th>
                <th style={thStyle}>Rent</th>
                <th style={thStyle}>Advance</th>
                <th style={thStyle}>Broker</th>
                <th style={thStyle}>Total</th>
              </tr>
            </thead>
            <tbody>
              {report.topListings.map((listing, i) => {
                const cost = report.costSummaries[i];
                if (!cost) return null;
                return (
                  <tr key={listing.id} style={{ borderBottom: "1px solid var(--border, #e2e8f0)" }}>
                    <td style={tdStyle}>{listing.title.slice(0, 30)}...</td>
                    <td style={tdStyle}>৳{cost.rent.toLocaleString()}</td>
                    <td style={tdStyle}>৳{cost.advance.toLocaleString()}</td>
                    <td style={tdStyle}>৳{cost.brokerFee.toLocaleString()}</td>
                    <td style={{ ...tdStyle, fontWeight: 700 }}>৳{cost.total.toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </ReportSection>
      )}

      {/* Section 6: Risks */}
      {report.mainRisks.length > 0 && (
        <ReportSection title="Key Risks" delay={0.35}>
          <ul style={{ paddingLeft: "1.25rem", lineHeight: 1.8 }}>
            {report.mainRisks.map((risk, i) => (
              <li key={i} style={{ color: "var(--text-primary, #1a1a2e)", fontSize: "0.9rem" }}>{risk}</li>
            ))}
          </ul>
        </ReportSection>
      )}

      {/* Section 7: Questions */}
      {report.questionsToAsk.length > 0 && (
        <ReportSection title="Questions to Ask" delay={0.4}>
          <ol style={{ paddingLeft: "1.25rem", lineHeight: 1.8 }}>
            {report.questionsToAsk.map((q, i) => (
              <li key={i} style={{ color: "var(--text-primary, #1a1a2e)", fontSize: "0.9rem" }}>{q}</li>
            ))}
          </ol>
        </ReportSection>
      )}

      {/* Section 8: Visit Checklist */}
      {report.visitChecklist.length > 0 && (
        <ReportSection title="Visit Checklist" delay={0.45}>
          {report.visitChecklist.slice(0, 3).map((section, i) => (
            <ChecklistSectionView key={i} section={section} />
          ))}
        </ReportSection>
      )}

      {/* Section 9: Final Recommendation */}
      <ReportSection title="Final Recommendation" delay={0.5}>
        <div style={{
          padding: "1.25rem",
          background: "linear-gradient(135deg, #f0fdf4, #ecfdf5)",
          borderRadius: "12px",
          border: "1px solid #bbf7d0",
        }}>
          <p style={{ lineHeight: 1.7, color: "#166534", fontWeight: 500, fontSize: "0.95rem" }}>
            {report.finalRecommendation}
          </p>
        </div>
      </ReportSection>

      {/* Footer */}
      <div style={{
        textAlign: "center",
        marginTop: "3rem",
        paddingTop: "1.5rem",
        borderTop: "2px solid var(--border, #e2e8f0)",
        color: "var(--text-secondary, #64748b)",
        fontSize: "0.8rem",
      }}>
        <p style={{ fontWeight: 600 }}>BasaBondhu — From messy listings to 3 homes worth visiting.</p>
        <p>This report was generated from your search data and does not constitute professional advice.</p>
      </div>
    </div>
  );
}

// Sub-components

function ReportSection({ title, delay, children }: { title: string; delay: number; children: React.ReactNode }) {
  return (
    <motion.section
      initial={{ y: 15, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.4 }}
      style={{
        marginBottom: "2rem",
        padding: "1.25rem",
        background: "var(--surface-primary, #ffffff)",
        border: "1px solid var(--border, #e2e8f0)",
        borderRadius: "12px",
      }}
    >
      <h2 style={{
        fontSize: "1.1rem",
        fontWeight: 700,
        color: "var(--text-primary, #1a1a2e)",
        marginBottom: "1rem",
        paddingBottom: "0.5rem",
        borderBottom: "1px solid var(--border, #e2e8f0)",
      }}>
        {title}
      </h2>
      {children}
    </motion.section>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{
      padding: "0.75rem",
      background: `${color}08`,
      borderRadius: "10px",
      border: `1px solid ${color}20`,
    }}>
      <div style={{ fontSize: "1.5rem", fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: "0.75rem", color: "var(--text-secondary, #64748b)" }}>{label}</div>
    </div>
  );
}

function ListingCard({ listing, rank }: { listing: ScoredListing; rank: number }) {
  return (
    <div style={{
      display: "flex",
      gap: "1rem",
      padding: "1rem",
      marginBottom: "0.75rem",
      background: "var(--surface-secondary, #f8f9fa)",
      borderRadius: "10px",
      border: "1px solid var(--border, #e2e8f0)",
      alignItems: "flex-start",
    }}>
      <div style={{
        minWidth: "32px",
        height: "32px",
        borderRadius: "50%",
        background: rank === 1 ? "#d4a853" : rank === 2 ? "#94a3b8" : "#cd7f32",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 800,
        fontSize: "0.85rem",
      }}>
        #{rank}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
          <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>{listing.title}</span>
          <VerdictBadge verdict={listing.verdict} size="sm" />
        </div>
        <div style={{ fontSize: "0.8rem", color: "var(--text-secondary, #64748b)", marginBottom: "0.25rem" }}>
          {listing.area} • ৳{listing.rent.toLocaleString()}/mo • Score: {listing.scores.total}/100
        </div>
        <p style={{ fontSize: "0.8rem", color: "var(--text-primary, #1a1a2e)", lineHeight: 1.5, margin: 0 }}>
          {listing.whyItFits}
        </p>
      </div>
    </div>
  );
}

function ChecklistSectionView({ section }: { section: ChecklistSection }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <h4 style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: "0.5rem" }}>{section.category}</h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        {section.items.slice(0, 3).map((item, i) => (
          <div key={i} style={{ fontSize: "0.8rem", display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
            <span>☐</span>
            <span><strong>{item.label}</strong> — {item.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "0.5rem",
  fontWeight: 700,
  color: "var(--text-secondary, #64748b)",
};

const tdStyle: React.CSSProperties = {
  padding: "0.5rem",
  color: "var(--text-primary, #1a1a2e)",
};
