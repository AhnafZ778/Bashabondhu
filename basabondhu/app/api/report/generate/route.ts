import { NextResponse } from "next/server";
import { generateReport } from "@/lib/services/report.service";
import { SearchProfile, ScoredListing, AreaProfile, ScanSummary } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const { profile, topListings, recommendedAreas, scanSummary } = await req.json();

    if (!profile || !topListings) {
      return NextResponse.json(
        { error: "Profile and topListings are required" },
        { status: 400 }
      );
    }

    const report = generateReport(
      profile as SearchProfile,
      topListings as ScoredListing[],
      (recommendedAreas || []) as AreaProfile[],
      (scanSummary || { scanned: 0, removedBudget: 0, removedCommute: 0, removedHiddenCost: 0, removedHouseholdMismatch: 0, selected: 0 }) as ScanSummary
    );

    // Generate simplified HTML for print/PDF
    const html = generateReportHTML(report);

    return NextResponse.json({ report, html });
  } catch (error) {
    console.error("POST /api/report/generate error:", error);
    return NextResponse.json(
      { ok: false, error: { code: "REPORT_FAILED", message: "Failed to generate report" }, fallback: {} },
      { status: 500 }
    );
  }
}

function generateReportHTML(report: ReturnType<typeof generateReport>): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>BasaBondhu Housing Report</title>
  <style>
    body { font-family: 'Inter', system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; color: #1a1a2e; }
    h1 { color: #16213e; border-bottom: 3px solid #0f3460; padding-bottom: 0.5rem; }
    h2 { color: #0f3460; margin-top: 2rem; }
    .section { margin-bottom: 2rem; padding: 1rem; background: #f8f9fa; border-radius: 8px; }
    .listing-card { border: 1px solid #dee2e6; padding: 1rem; margin: 0.5rem 0; border-radius: 6px; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: 600; }
    .badge-visit { background: #d4edda; color: #155724; }
    .badge-maybe { background: #fff3cd; color: #856404; }
    .badge-call { background: #cce5ff; color: #004085; }
    .badge-avoid { background: #f8d7da; color: #721c24; }
    .footer { margin-top: 3rem; text-align: center; color: #6c757d; font-size: 0.85rem; }
    @media print { body { padding: 0; } .section { break-inside: avoid; } }
  </style>
</head>
<body>
  <h1>🏠 BasaBondhu Housing Report</h1>
  <p><em>Generated: ${new Date(report.generatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</em></p>
  
  <div class="section">
    <h2>Your Profile</h2>
    <p>${report.profileSummary}</p>
  </div>

  <div class="section">
    <h2>Scan Summary</h2>
    <p>${report.scanSummary.scanned} listings scanned → ${report.scanSummary.selected} worth visiting</p>
    <ul>
      <li>${report.scanSummary.removedBudget} removed for budget mismatch</li>
      <li>${report.scanSummary.removedCommute} removed for commute distance</li>
      <li>${report.scanSummary.removedHiddenCost} removed for hidden cost risk</li>
      <li>${report.scanSummary.removedHouseholdMismatch} removed for household mismatch</li>
    </ul>
  </div>

  <div class="section">
    <h2>Top ${report.topListings.length} Listings</h2>
    ${report.topListings.map(l => `
      <div class="listing-card">
        <strong>${l.title}</strong> — ${l.area}<br/>
        <span>Rent: ৳${l.rent.toLocaleString()} | Score: ${l.scores.total}/100</span>
        <span class="badge badge-${l.verdict}">${l.verdict.toUpperCase()}</span>
        <p><small>${l.whyItFits}</small></p>
      </div>
    `).join("")}
  </div>

  <div class="section">
    <h2>Key Risks</h2>
    <ul>${report.mainRisks.map(r => `<li>${r}</li>`).join("")}</ul>
  </div>

  <div class="section">
    <h2>Questions to Ask</h2>
    <ol>${report.questionsToAsk.map(q => `<li>${q}</li>`).join("")}</ol>
  </div>

  <div class="section">
    <h2>Final Recommendation</h2>
    <p>${report.finalRecommendation}</p>
  </div>

  <div class="footer">
    <p>BasaBondhu — From messy listings to 3 homes worth visiting.</p>
  </div>
</body>
</html>`;
}
