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
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-black/[0.06] bg-white/75 backdrop-blur-xl transition-all duration-500 ease-in-out">
      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24 h-16 flex items-center justify-between">
        {/* Logo */}
        <div 
          className="flex items-center space-x-3 cursor-pointer group" 
          onClick={handleLogoClick}
        >
          <div className="w-10 h-10 rounded-xl bg-white border border-gold/30 flex items-center justify-center text-gold shadow-md shadow-gold/5 transition-all duration-300 group-hover:border-gold/60 group-hover:scale-105">
            <Home className="w-5 h-5 text-gold stroke-[2]" />
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-serif font-black tracking-[0.08em] uppercase text-text-main flex items-center gap-1 leading-none transition-colors">
              BASA<span className="text-primary">BONDHU</span>
            </span>
            <p className="text-[9px] uppercase tracking-widest text-text-muted mt-1.5 font-bold transition-colors">Dhaka House-Hunting Helper</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          {isPortal ? (
            <>
              <Link
                href="/"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-black/10 text-xs text-text-main hover:bg-black/5 hover:border-black/20 transition-all font-black uppercase tracking-widest cursor-pointer active:scale-95"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Home
              </Link>
              {profile && (
                <button
                  onClick={handleNewSearch}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-primary/20 text-xs text-primary hover:bg-primary/5 transition-all font-black uppercase tracking-widest cursor-pointer active:scale-95"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  New Search
                </button>
              )}
            </>
          ) : (
            <Link
              href="/portal"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-black uppercase tracking-widest hover:bg-secondary active:scale-[0.98] transition-all shadow-lg shadow-primary/15 border border-primary/20 cursor-pointer"
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
