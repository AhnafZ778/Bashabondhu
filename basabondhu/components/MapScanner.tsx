"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Listing } from "@/lib/types";

// Dynamically import the MapScannerInner component, which uses react-leaflet,
// to ensure it only renders on the client side, avoiding window is not defined errors.
const MapScannerInner = dynamic(() => import("./MapScannerInner"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-100 animate-pulse flex items-center justify-center rounded-3xl border border-slate-200">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Initializing Geospatial Engine...</span>
      </div>
    </div>
  ),
});

type MapScannerProps = {
  center: [number, number];
  currentStep: number;
  totalSteps: number;
  listings: Listing[];
  className?: string;
  onSelectListing?: (listing: Listing | null) => void;
};

export default function MapScanner({ center, currentStep, totalSteps, listings, className, onSelectListing }: MapScannerProps) {
  return (
    <div className={`relative overflow-hidden z-0 ${className || ""}`}>
      <MapScannerInner center={center} currentStep={currentStep} totalSteps={totalSteps} listings={listings} onSelectListing={onSelectListing} />
    </div>
  );
}
