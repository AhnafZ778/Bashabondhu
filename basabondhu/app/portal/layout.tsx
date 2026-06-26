"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import ErrorBoundary from "@/components/ErrorBoundary";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSearch } from "@/context/SearchContext";
import { Search, Clipboard, GitCompare, PhoneCall, FileText } from "lucide-react";

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

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { selectedForCompare } = useSearch();

  const navItems = [
    { href: "/portal", label: "Plan Search", icon: Search },
    { href: "/portal/parser", label: "Check Listing", icon: Clipboard },
    { href: "/portal/fb-fetch", label: "Facebook Fetcher", icon: FacebookIcon },
    { href: "/portal/compare", label: `Compare Homes (${selectedForCompare.length})`, icon: GitCompare },
    { href: "/portal/visit", label: "Prepare Visit", icon: PhoneCall },
    { href: "/portal/report", label: "Report", icon: FileText },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-bg-alt transition-colors duration-300 pt-16">
      <Navbar />

      {/* Portal Tabs Navigation */}
      <div className="border-b border-black/[0.04] bg-white/80 backdrop-blur-md sticky top-16 z-40 transition-colors duration-300">
        <div className={`w-full transition-all duration-300 ${
          pathname === "/portal/fb-fetch"
            ? "px-2 sm:px-4 lg:px-6"
            : "px-6 sm:px-10 lg:px-16 xl:px-24"
        }`}>
          <nav className="flex space-x-1 sm:space-x-2 py-3 overflow-x-auto" aria-label="Tabs">
            {navItems.map((tab) => {
              const Icon = tab.icon;
              // Match exact path or root portal tab
              const isActive = pathname === tab.href;

              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider shrink-0 transition-all cursor-pointer active:scale-95 border ${
                    isActive
                      ? "bg-primary text-white border-primary/10 shadow-md shadow-primary/15"
                      : "text-text-muted bg-transparent border-transparent hover:bg-black/[0.03] hover:text-text-main"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 stroke-[2]" />
                  {tab.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <main className={`flex-1 w-full py-8 transition-all duration-300 ${
        pathname === "/portal/fb-fetch"
          ? "px-2 sm:px-4 lg:px-6"
          : "px-6 sm:px-10 lg:px-16 xl:px-24"
      }`}>
        <ErrorBoundary fallbackTitle="This section encountered an error">
          <div key={pathname} className="animate-fade-in">
            {children}
          </div>
        </ErrorBoundary>
      </main>
    </div>
  );
}
