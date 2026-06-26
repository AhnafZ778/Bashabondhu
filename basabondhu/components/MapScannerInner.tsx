"use client";

import React, { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, CircleMarker, Circle, useMap, Popup, Marker } from "react-leaflet";
import { Eye, EyeOff, ShieldAlert, ArrowLeft } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Listing } from "@/lib/types";
import { useSearch } from "@/context/SearchContext";
import { areas } from "@/lib/data/areas";

// Fix default icon issues in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 14, { duration: 1.5, animate: true });
  }, [center, map]);
  return null;
}

type MapScannerInnerProps = {
  center: [number, number];
  currentStep: number;
  totalSteps: number;
  listings: Listing[];
  onSelectListing?: (listing: Listing | null) => void;
};

// Generate random points around a center
const generatePoints = (center: [number, number], count: number, radius: number = 0.015) => {
  return Array.from({ length: count }).map(() => [
    center[0] + (Math.random() - 0.5) * radius * 2,
    center[1] + (Math.random() - 0.5) * radius * 2,
  ] as [number, number]);
};

export default function MapScannerInner({ center, currentStep, totalSteps, listings, onSelectListing }: MapScannerInnerProps) {
  // Generate stable random points for different categories
  const infrastructurePoints = useMemo(() => generatePoints(center, 12, 0.015), [center]);
  const rawListingPoints = useMemo(() => listings.map(l => [l.latitude, l.longitude] as [number, number]), [listings]);

  const { profile } = useSearch();

  // Find target area details based on profile anchors
  const targetArea = useMemo(() => {
    const targetAreaName = profile?.commuteAnchors[0]?.area || "Dhaka";
    return areas.find(a => a.name.toLowerCase() === targetAreaName.toLowerCase());
  }, [profile]);

  const schoolIcon = useMemo(() => {
    return L.divIcon({
      html: `
        <div style="display: flex; justify-content: center; align-items: center; width: 30px; height: 30px; background-color: #6366f1; border: 2px solid #ffffff; border-radius: 50%; box-shadow: 0 2px 5px rgba(0,0,0,0.35);">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
            <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
          </svg>
        </div>
      `,
      className: "custom-school-icon",
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -15]
    });
  }, []);

  const hospitalIcon = useMemo(() => {
    return L.divIcon({
      html: `
        <div style="display: flex; justify-content: center; align-items: center; width: 30px; height: 30px; background-color: #ef4444; border: 2px solid #ffffff; border-radius: 50%; box-shadow: 0 2px 5px rgba(0,0,0,0.35);">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 14c1.66 0 3-1.34 3-3V3.5a1.5 1.5 0 0 0-1.5-1.5h-17A1.5 1.5 0 0 0 2 3.5V11c0 1.66 1.34 3 3 3"/>
            <path d="M12 2v20"/>
            <path d="M2 12h20"/>
          </svg>
        </div>
      `,
      className: "custom-hospital-icon",
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -15]
    });
  }, []);

  const landmarkIcon = useMemo(() => {
    return L.divIcon({
      html: `
        <div style="display: flex; justify-content: center; align-items: center; width: 30px; height: 30px; background-color: #eab308; border: 2px solid #ffffff; border-radius: 50%; box-shadow: 0 2px 5px rgba(0,0,0,0.35);">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        </div>
      `,
      className: "custom-landmark-icon",
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -15]
    });
  }, []);

  const localLandmarks = useMemo(() => {
    if (!targetArea) return [];
    if (targetArea.id === "banani") {
      return ["Banani Lake Park", "Kemal Ataturk Avenue Plaza", "Banani Club & Ground"];
    }
    if (targetArea.id === "mohammadpur") {
      return ["Mohammadpur Town Hall Market", "Geneva Camp Ground", "Suchona Community Center"];
    }
    if (targetArea.id === "merul-badda") {
      return ["Hatirjheel East Walkway", "Merul Badda Bazar", "DIT Road Corridor"];
    }
    return [`${targetArea.name} Center Park`, `${targetArea.name} Local Bazar`, `${targetArea.name} Community Hall`];
  }, [targetArea]);

  const mappedSchools = useMemo(() => {
    if (!targetArea || !targetArea.topSchools) return [];
    const schoolsList = targetArea.topSchools;
    return schoolsList.map((school, idx) => {
      const angle = (idx * 2 * Math.PI) / (schoolsList.length || 1);
      const radius = 0.005 + (idx * 0.001);
      return {
        name: school,
        lat: targetArea.latitude + Math.sin(angle) * radius,
        lng: targetArea.longitude + Math.cos(angle) * radius
      };
    });
  }, [targetArea]);

  const mappedHospitals = useMemo(() => {
    if (!targetArea || !targetArea.topHospitals) return [];
    const hospitalsList = targetArea.topHospitals;
    return hospitalsList.map((hospital, idx) => {
      const angle = (idx * 2 * Math.PI) / (hospitalsList.length || 1) + Math.PI / 4;
      const radius = 0.006 - (idx * 0.001);
      return {
        name: hospital,
        lat: targetArea.latitude + Math.sin(angle) * radius,
        lng: targetArea.longitude + Math.cos(angle) * radius
      };
    });
  }, [targetArea]);

  const mappedLandmarks = useMemo(() => {
    if (!targetArea) return [];
    return localLandmarks.map((landmark, idx) => {
      const angle = (idx * 2 * Math.PI) / (localLandmarks.length || 1) + Math.PI / 2;
      const radius = 0.004;
      return {
        name: landmark,
        lat: targetArea.latitude + Math.sin(angle) * radius,
        lng: targetArea.longitude + Math.cos(angle) * radius
      };
    });
  }, [targetArea, localLandmarks]);

  const [radius, setRadius] = useState(0);
  const [showHiddenCosts, setShowHiddenCosts] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [animateScores, setAnimateScores] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleSelectListing = (listing: Listing | null) => {
    setSelectedListing(listing);
    if (onSelectListing) {
      onSelectListing(listing);
    }
  };

  const houseGreenIcon = useMemo(() => {
    return L.divIcon({
      html: `
        <div style="display: flex; justify-content: center; align-items: center; width: 36px; height: 36px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="#0f5132" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0px 3px 5px rgba(0,0,0,0.55));">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" fill="#ffffff" />
          </svg>
        </div>
      `,
      className: "custom-house-green-icon",
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -18]
    });
  }, []);

  const houseRedIcon = useMemo(() => {
    return L.divIcon({
      html: `
        <div style="display: flex; justify-content: center; align-items: center; width: 36px; height: 36px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="#842029" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0px 3px 5px rgba(0,0,0,0.55));">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" fill="#ffffff" />
          </svg>
        </div>
      `,
      className: "custom-house-red-icon",
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -18]
    });
  }, []);

  useEffect(() => {
    if (selectedListing) {
      setAnimateScores(false);
      const timer = setTimeout(() => setAnimateScores(true), 100);
      return () => clearTimeout(timer);
    }
  }, [selectedListing]);

  // Radar animation
  useEffect(() => {
    if (currentStep >= totalSteps) return;
    
    let animationFrameId: number;
    let r = 0;
    
    const animate = () => {
      r += 10;
      if (r > 2000) r = 0;
      setRadius(r);
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, [currentStep, totalSteps]);

  const isComplete = currentStep >= totalSteps;

  const getSeverity = (scope: string) => {
    switch(scope) {
      case "service_charge": return 85;
      case "gas_type": return 90;
      case "broker_fee": return 75;
      case "advance_months": return 60;
      case "waterlogging": return 95;
      case "bachelor_restrictions": return 80;
      default: return 65;
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden rounded-3xl">
      {/* Selected Listing Detailed Speculator View */}
      {selectedListing && (
        <div className="absolute inset-0 z-[2000] bg-zinc-950 p-6 flex flex-col animate-in fade-in zoom-in-95 duration-200">
          <button 
            onClick={() => handleSelectListing(null)}
            className="flex items-center gap-2 text-zinc-400 hover:text-white font-medium mb-6 w-fit transition-colors"
          >
            <ArrowLeft size={16} /> Back to Map
          </button>
          
          <div className="flex-1 overflow-y-auto pr-2 pb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">{selectedListing.title}</h2>
            <p className="text-base text-zinc-400 mb-8">Detailed Hidden Cost Speculation Analysis</p>

            <div className="space-y-6">
              {(selectedListing.hiddenCostSignals?.mentionedScopes || ["service_charge", "gas_type", "broker_fee"]).map((scope, idx) => {
                const severity = getSeverity(scope);
                let colorClass = "bg-amber-500";
                if (severity > 80) colorClass = "bg-rose-500";
                else if (severity < 50) colorClass = "bg-blue-500";

                const getReasonsForScope = (scopeId: string, listing: Listing) => {
                  switch (scopeId) {
                    case "gas_type":
                      if (listing.gasType === "line") {
                        return "Pipeline gas connection active (Standard city utility bill).";
                      } else if (listing.gasType === "cylinder") {
                        return "No pipeline connection: tenants must purchase cylinder LPG (+৳1,500/mo).";
                      } else {
                        return "Gas type unverified in listing: high chance of cylinder-only setup (+৳1,500/mo).";
                      }
                    case "broker_fee":
                      if (listing.brokerFeeKnown && listing.brokerFee === 0) {
                        return "Direct owner post: zero broker commission fee (saves up to 1 month rent).";
                      } else if (listing.brokerFeeKnown && listing.brokerFee) {
                        return `Agent listing: requires a one-off broker commission fee of ৳${listing.brokerFee.toLocaleString()} BDT.`;
                      } else {
                        return "Posted by potential broker: unstated agent commission fee likely applies.";
                      }
                    case "service_charge":
                      if (listing.serviceChargeKnown && listing.serviceCharge) {
                        return `Service charge of ৳${listing.serviceCharge.toLocaleString()}/mo is billed separately.`;
                      } else if (listing.serviceChargeKnown && listing.serviceCharge === 0) {
                        return "Service charge is fully covered and included in the rent price.";
                      } else {
                        return "Service charge unstated: expect hidden building fee of ৳4k - ৳6k/mo.";
                      }
                    case "waterlogging":
                      if (listing.waterloggingRisk === "high") {
                        return "Severe waterlogging zone: street floods up to 1-2 feet during monsoon storms.";
                      } else if (listing.waterloggingRisk === "medium") {
                        return "Moderate waterlogging risk: lane waterlogs briefly during heavy rainfalls.";
                      } else {
                        return "Elevated road area: clean drainage sector with low waterlogging risk.";
                      }
                    case "advance_months":
                      if (listing.advanceMonths > 2) {
                        return `High security deposit: requires ${listing.advanceMonths} months advance cash layout.`;
                      } else {
                        return `Low deposit terms: only ${listing.advanceMonths} months rent advance deposit required.`;
                      }
                    default:
                      return "Unlisted secondary cost risk analyzed in this area sector.";
                  }
                };

                return (
                  <div key={idx} className="bg-zinc-900 border border-zinc-800 p-5 pt-16 rounded-xl flex flex-col justify-end">
                    
                    <div className="relative w-full">
                      {/* Bouncing Title stretched to the end of the bar */}
                      <div 
                        className="absolute bottom-full mb-2 left-0 flex flex-col items-end whitespace-nowrap"
                        style={{
                          width: animateScores ? `${severity}%` : '0%',
                          opacity: animateScores ? 1 : 0,
                          transition: 'width 800ms cubic-bezier(0.34, 1.56, 0.64, 1) 700ms, opacity 300ms ease 700ms'
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-zinc-100 capitalize text-lg tracking-wide">
                            {scope.replace("_", " ")}
                          </span>
                          <span className={`text-xs font-black px-2.5 py-1 rounded text-white ${colorClass}`}>
                            {severity}%
                          </span>
                        </div>
                      </div>

                      {/* Segmented Visual Bar Plot / Hover Tooltip Container */}
                      <div 
                        className="relative w-full h-8 cursor-pointer"
                        onMouseEnter={() => setHoveredIndex(idx)}
                        onMouseLeave={() => setHoveredIndex(null)}
                      >
                        {/* Progress Bar blocks (Fully visible at all times) */}
                        <div className="flex justify-between w-full h-full items-end gap-[2px]">
                          {[...Array(40)].map((_, i) => {
                            const activeSegments = Math.round((severity / 100) * 40);
                            const isActive = animateScores && i < activeSegments;
                            return (
                              <div 
                                key={i} 
                                className={`w-full h-full rounded-[1px] transition-colors duration-300 ${
                                  isActive ? colorClass : 'bg-zinc-800'
                                }`}
                                style={{ transitionDelay: `${i * 15}ms` }}
                              />
                            );
                          })}
                        </div>

                        {/* Floating Tooltip Callout positioned ABOVE the progress bar */}
                        <div 
                          className={`absolute bottom-[130%] left-0 right-0 bg-zinc-950 border-2 ${colorClass.replace('bg-', 'border-')} rounded-xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-md transition-all duration-300 z-50 flex flex-col gap-1.5 ${
                            hoveredIndex === idx ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95 pointer-events-none'
                          }`}
                        >
                          <div className="flex items-center gap-2 border-b border-zinc-850 pb-1.5">
                            <span className="text-amber-400 text-base">💡</span>
                            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                              Speculation Details
                            </span>
                          </div>
                          <p className="text-white text-lg font-extrabold leading-relaxed whitespace-normal">
                            {getReasonsForScope(scope, selectedListing)}
                          </p>
                          {/* Triangle Indicator Arrow pointing down to the bar */}
                          <div className={`absolute top-full left-[24px] w-3 h-3 border-r-2 border-b-2 ${colorClass.replace('bg-', 'border-')} bg-zinc-950 rotate-45 -translate-y-[7px]`}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Hidden Cost Speculator Toggle */}
      {currentStep >= 5 && (
        <div className="absolute top-4 left-4 z-[1000]">
          <button
            onClick={() => setShowHiddenCosts(!showHiddenCosts)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm shadow-xl transition-all ${
              showHiddenCosts 
                ? "bg-rose-500 text-white border-2 border-rose-400 hover:bg-rose-600" 
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {showHiddenCosts ? <EyeOff size={16} /> : <Eye size={16} />}
            {showHiddenCosts ? "Hide Speculator" : "Hidden Cost Speculator"}
          </button>
        </div>
      )}

      <MapContainer 
        center={[23.777176, 90.399452]} // Start far away (Dhaka center)
      zoom={11} 
      scrollWheelZoom={true}
      zoomControl={false}
      dragging={true}
      style={{ height: "100%", width: "100%", borderRadius: "1.5rem" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      <MapController center={center} />

      {!isComplete && (
        <>
          {/* Radar circle */}
          <Circle 
            center={center} 
            pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.1, weight: 1 }} 
            radius={radius} 
          />
          <Circle 
            center={center} 
            pathOptions={{ color: '#3b82f6', fillOpacity: 0, weight: 2 }} 
            radius={2000} 
          />
        </>
      )}

      {/* Step 1 & 2: Show adjacencies and infrastructure */}
      {currentStep < 5 && infrastructurePoints.map((pt, i) => (
         <CircleMarker key={`infra-${i}`} center={pt} radius={4} pathOptions={{ color: '#0ea5e9', fillColor: '#38bdf8', fillOpacity: 0.8, weight: 1 }} />
      ))}
      
      {/* Plot raw buildings and scan them */}
      {rawListingPoints.map((pt, i) => {
         let isFilteredOut = false;
         const total = rawListingPoints.length;
         const isFinalMatch = i < 3;
         
         if (!isFinalMatch) {
           const relIdx = i - 3;
           const otherTotal = total - 3;
           if (currentStep >= 1 && relIdx < otherTotal * 0.3) isFilteredOut = true;
           if (currentStep >= 2 && relIdx >= otherTotal * 0.3 && relIdx < otherTotal * 0.6) isFilteredOut = true;
           if (currentStep >= 3 && relIdx >= otherTotal * 0.6 && relIdx < otherTotal * 0.75) isFilteredOut = true;
           if (currentStep >= 4 && relIdx >= otherTotal * 0.75) isFilteredOut = true;
         }

         if (isFinalMatch && currentStep >= 5) {
             return null;
         }

         return (
           <CircleMarker 
             key={`raw-${i}`} 
             center={pt} 
             radius={isFilteredOut ? 2 : 3} 
             pathOptions={{ 
               color: isFilteredOut ? '#94a3b8' : '#f43f5e', 
               fillColor: isFilteredOut ? '#cbd5e1' : '#fb7185', 
               fillOpacity: isFilteredOut ? 0.2 : 0.9, 
               weight: 0 
             }} 
           />
         );
      })}

      {/* Step 5: Final visitable homes */}
      {currentStep >= 5 && listings.slice(0, 3).map((listing, i) => {
         return (
         <Marker 
           key={`final-${i}`} 
           position={[listing.latitude, listing.longitude]} 
           icon={showHiddenCosts ? houseRedIcon : houseGreenIcon}
           eventHandlers={{
             click: () => {
               if (showHiddenCosts) {
                 handleSelectListing(listing);
               }
             }
           }}
         >
           {/* Only show popup if not in Speculator Mode. In Speculator Mode, clicking replaces view. */}
           {!showHiddenCosts && (
             <Popup>
               <div className="min-w-[160px]">
                 <h3 className="font-bold text-xs text-slate-800 mb-1">{listing.title}</h3>
                 <p className="text-[10px] text-slate-500 mb-2 font-medium">Rent: {listing.rent.toLocaleString()} BDT • {listing.bedrooms} Beds</p>
                 <div className="flex flex-col gap-1">
                   {listing.goodPoints.slice(0, 2).map((point, idx) => (
                     <span key={idx} className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-1.5 py-0.5 rounded leading-tight">
                       ✓ {point}
                     </span>
                   ))}
                 </div>
               </div>
             </Popup>
           )}
         </Marker>
         );
       })}

      {/* Mapped Schools / Institutions */}
      {mappedSchools.map((school, i) => (
        <Marker key={`school-${i}`} position={[school.lat, school.lng]} icon={schoolIcon}>
          <Popup>
            <div className="min-w-[150px]">
              <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wide block">🏫 School / Institution</span>
              <p className="font-extrabold text-sm text-slate-800 mt-1">{school.name}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Located in {targetArea?.name}</p>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Mapped Hospitals / Medical Centers */}
      {mappedHospitals.map((hospital, i) => (
        <Marker key={`hospital-${i}`} position={[hospital.lat, hospital.lng]} icon={hospitalIcon}>
          <Popup>
            <div className="min-w-[150px]">
              <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wide block">🏥 Hospital / Clinic</span>
              <p className="font-extrabold text-sm text-slate-800 mt-1">{hospital.name}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Emergency Access Enabled</p>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Mapped Desired Places / Landmarks */}
      {mappedLandmarks.map((landmark, i) => (
        <Marker key={`landmark-${i}`} position={[landmark.lat, landmark.lng]} icon={landmarkIcon}>
          <Popup>
            <div className="min-w-[150px]">
              <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wide block">⭐ Neighborhood Landmark</span>
              <p className="font-extrabold text-sm text-slate-800 mt-1">{landmark.name}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Major Point of Interest</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
    </div>
  );
}
