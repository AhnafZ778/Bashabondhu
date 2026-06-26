"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ScoredListing } from "@/lib/types";

const DrawerMapInner = dynamic(() => import("./DrawerMapInner"), {
  ssr: false,
  loading: () => (
    <div className="relative w-full h-[85%] rounded-[24px] bg-zinc-950 border border-zinc-850 animate-pulse flex items-center justify-center shadow-xl">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-[10px] font-black text-amber-500/85 uppercase tracking-widest">Generating Localized 3D Tabletop...</span>
      </div>
    </div>
  ),
});

type DrawerMapProps = {
  listing: ScoredListing;
};

export default function DrawerMap({ listing }: DrawerMapProps) {
  return <DrawerMapInner listing={listing} />;
}
