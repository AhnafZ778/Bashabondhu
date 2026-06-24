import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Harvester | BasaBondhu Admin",
  description: "Real-world housing data pipeline — ingestion, parsing, scoring, and publishing.",
};

export default function HarvesterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {children}
    </div>
  );
}
