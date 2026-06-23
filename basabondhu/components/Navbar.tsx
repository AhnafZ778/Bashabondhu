"use client";

import React from "react";
import { useSearch } from "@/context/SearchContext";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Home, RefreshCw, Sparkles, ArrowLeft, ArrowRight } from "lucide-react";

export default function Navbar() {
  const { profile, resetSearch } = useSearch();
  const router = useRouter();
  const pathname = usePathname();

  const isPortal = pathname.startsWith("/portal");

  const handleLogoClick = () => {
    router.push("/");
  };

  const handleNewSearch = () => {
    resetSearch();
    router.push("/portal/wizard");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-light bg-bg/80 backdrop-blur-md transition-all duration-300">
      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24 h-16 flex items-center justify-between">
        {/* Logo */}
        <div 
          className="flex items-center space-x-2 cursor-pointer" 
          onClick={handleLogoClick}
        >
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-md shadow-primary/20 transition-all duration-300">
            <Home className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-text-main flex items-center gap-1.5 leading-none transition-colors">
              BasaBondhu <Sparkles className="w-3.5 h-3.5 text-gold fill-gold" />
            </span>
            <p className="text-[10px] text-text-muted mt-1 font-medium transition-colors">Dhaka House-Hunting Helper</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          {isPortal ? (
            <>
              <Link
                href="/"
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-border-light text-xs text-text-main hover:bg-bg-alt transition-all font-bold cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Home
              </Link>
              {profile && (
                <button
                  onClick={handleNewSearch}
                  className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-primary/20 text-xs text-primary hover:bg-primary/5 transition-all font-bold cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  New Search
                </button>
              )}
            </>
          ) : (
            <Link
              href="/portal"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-black uppercase tracking-wider hover:bg-secondary active:scale-[0.98] transition-all shadow-md shadow-primary/10 cursor-pointer"
            >
              Launch Portal
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
