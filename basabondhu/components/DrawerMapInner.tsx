"use client";

import React, { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Tooltip, Circle, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ScoredListing } from "@/lib/types";
import { areas } from "@/lib/data/areas";
import { useSearch } from "@/context/SearchContext";

// Fix default icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Haversine distance calculator
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const generateRoadPath = (from: [number, number], to: [number, number], seed: number): [number, number][] => {
  const [lat1, lng1] = from;
  const [lat2, lng2] = to;
  const latMid1 = lat1 + (lat2 - lat1) * 0.4 + (Math.sin(seed) * 0.00015);
  const lngMid1 = lng1 + (lng2 - lng1) * 0.35 + (Math.cos(seed) * 0.00015);
  
  const latMid2 = lat1 + (lat2 - lat1) * 0.75 + (Math.cos(seed * 2) * 0.00015);
  const lngMid2 = lng1 + (lng2 - lng1) * 0.8 + (Math.sin(seed * 2) * 0.00015);
  
  return [
    from,
    [latMid1, lngMid1],
    [latMid1, lngMid2],
    [latMid2, lngMid2],
    to
  ];
};

function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 15);
  }, [center, map]);
  return null;
}

type DrawerMapInnerProps = {
  listing: ScoredListing;
};

export default function DrawerMapInner({ listing }: DrawerMapInnerProps) {
  const center: [number, number] = [listing.latitude, listing.longitude];
  const { profile, showNeighborhoodFactors, setShowNeighborhoodFactors } = useSearch();
  const [aiOverlayActive, setAiOverlayActive] = useState(false);
  const [trafficEpoch, setTrafficEpoch] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [hudTab, setHudTab] = useState<"analysis" | "routing" | "neighbourhood">("analysis");
  const [loadingNeighborhoodPaths, setLoadingNeighborhoodPaths] = useState(false);

  // Fetch target area details for schools and hospitals
  const targetArea = useMemo(() => {
    return areas.find(a => a.name.toLowerCase() === listing.area.toLowerCase());
  }, [listing.area]);

  // Icons configured to stand upright like 3D chess pieces on a board
  const targetIcon = useMemo(() => {
    return L.divIcon({
      html: `
        <div style="background-color: rgba(9, 9, 11, 0.95); border: 2.5px solid #d4a853; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); padding: 8px; width: 140px; display: flex; flex-direction: column; align-items: center; backdrop-filter: blur(8px); z-index: 10;">
          <img src="${listing.imageUrl}" style="width: 100%; height: 65px; object-fit: cover; border-radius: 8px;" />
          <span style="font-size: 10px; font-weight: 900; color: #d4a853; margin-top: 5px; text-transform: uppercase; letter-spacing: 0.05em;">Target Flat</span>
          <span style="font-size: 13px; font-weight: 900; color: #ffffff; margin-top: 2px;">৳${listing.rent.toLocaleString()}</span>
        </div>
      `,
      className: "2d-target-marker",
      iconSize: [140, 115],
      iconAnchor: [70, 115],
      popupAnchor: [0, -115]
    });
  }, [listing]);

  const schoolIcon = (name: string) => {
    return L.divIcon({
      html: `
        <div style="background-color: rgba(30, 27, 75, 0.95); border: 1.5px solid #6366f1; border-radius: 10px; padding: 6px 12px; box-shadow: 0 6px 16px rgba(0,0,0,0.3); display: flex; align-items: center; gap: 8px; backdrop-filter: blur(6px); width: fit-content; max-width: 180px; z-index: 5; white-space: nowrap;">
          <span style="font-size: 15px;">🏫</span>
          <span style="font-size: 12px; font-weight: 800; color: #ffffff; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 130px;">${name}</span>
        </div>
      `,
      className: "2d-school-marker",
      iconSize: [180, 36],
      iconAnchor: [90, 36]
    });
  };

  const hospitalIcon = (name: string) => {
    return L.divIcon({
      html: `
        <div style="background-color: rgba(69, 10, 10, 0.95); border: 1.5px solid #ef4444; border-radius: 10px; padding: 6px 12px; box-shadow: 0 6px 16px rgba(0,0,0,0.3); display: flex; align-items: center; gap: 8px; backdrop-filter: blur(6px); width: fit-content; max-width: 180px; z-index: 5; white-space: nowrap;">
          <span style="font-size: 15px;">🏥</span>
          <span style="font-size: 12px; font-weight: 800; color: #ffffff; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 130px;">${name}</span>
        </div>
      `,
      className: "2d-hospital-marker",
      iconSize: [180, 36],
      iconAnchor: [90, 36]
    });
  };

  const landmarkIcon = (name: string) => {
    return L.divIcon({
      html: `
        <div style="background-color: rgba(69, 39, 0, 0.95); border: 1.5px solid #eab308; border-radius: 10px; padding: 6px 12px; box-shadow: 0 6px 16px rgba(0,0,0,0.3); display: flex; align-items: center; gap: 8px; backdrop-filter: blur(6px); width: fit-content; max-width: 180px; z-index: 5; white-space: nowrap;">
          <span style="font-size: 15px;">⭐</span>
          <span style="font-size: 12px; font-weight: 800; color: #ffffff; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 130px;">${name}</span>
        </div>
      `,
      className: "2d-landmark-marker",
      iconSize: [180, 36],
      iconAnchor: [90, 36]
    });
  };

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
      const radius = 0.0035 + (idx * 0.0008);
      return {
        name: school,
        lat: center[0] + Math.sin(angle) * radius,
        lng: center[1] + Math.cos(angle) * radius
      };
    });
  }, [targetArea, center]);

  const mappedHospitals = useMemo(() => {
    if (!targetArea || !targetArea.topHospitals) return [];
    const hospitalsList = targetArea.topHospitals;
    return hospitalsList.map((hospital, idx) => {
      const angle = (idx * 2 * Math.PI) / (hospitalsList.length || 1) + Math.PI / 4;
      const radius = 0.0042 - (idx * 0.0008);
      return {
        name: hospital,
        lat: center[0] + Math.sin(angle) * radius,
        lng: center[1] + Math.cos(angle) * radius
      };
    });
  }, [targetArea, center]);

  const mappedLandmarks = useMemo(() => {
    if (!targetArea) return [];
    return localLandmarks.map((landmark, idx) => {
      const angle = (idx * 2 * Math.PI) / (localLandmarks.length || 1) + Math.PI / 2;
      const radius = 0.0028;
      return {
        name: landmark,
        lat: center[0] + Math.sin(angle) * radius,
        lng: center[1] + Math.cos(angle) * radius
      };
    });
  }, [targetArea, localLandmarks, center]);

  // Dynamic AI spatial metrics
  const commuteScore = useMemo(() => {
    if (!profile || !profile.commuteAnchors[0]) return 75;
    const anchorArea = profile.commuteAnchors[0].area;
    const matrix: Record<string, Record<string, number>> = {
      Banasree: { Banasree: 100, Badda: 80, "Merul Badda": 90, Mohakhali: 60, Tejgaon: 60, Mohammadpur: 40, Lalmatia: 40, Mirpur: 30, Uttara: 30, Bashundhara: 60, Dhanmondi: 45, Banani: 65, Gulshan: 70 },
      Badda: { Banasree: 80, Badda: 100, "Merul Badda": 95, Mohakhali: 75, Tejgaon: 70, Mohammadpur: 45, Lalmatia: 45, Mirpur: 40, Uttara: 50, Bashundhara: 80, Dhanmondi: 45, Banani: 75, Gulshan: 85 },
      "Merul Badda": { Banasree: 90, Badda: 95, "Merul Badda": 100, Mohakhali: 70, Tejgaon: 70, Mohammadpur: 40, Lalmatia: 40, Mirpur: 35, Uttara: 45, Bashundhara: 75, Dhanmondi: 45, Banani: 70, Gulshan: 80 },
      Mohakhali: { Banasree: 60, Badda: 75, "Merul Badda": 70, Mohakhali: 100, Tejgaon: 90, Mohammadpur: 65, Lalmatia: 70, Mirpur: 60, Uttara: 70, Bashundhara: 70, Dhanmondi: 70, Banani: 90, Gulshan: 85 },
      Tejgaon: { Banasree: 60, Badda: 70, "Merul Badda": 70, Mohakhali: 90, Tejgaon: 100, Mohammadpur: 70, Lalmatia: 75, Mirpur: 60, Uttara: 60, Bashundhara: 65, Dhanmondi: 75, Banani: 80, Gulshan: 75 },
      Mohammadpur: { Banasree: 40, Badda: 45, "Merul Badda": 40, Mohakhali: 65, Tejgaon: 70, Mohammadpur: 100, Lalmatia: 90, Mirpur: 70, Uttara: 45, Bashundhara: 40, Dhanmondi: 85, Banani: 55, Gulshan: 50 },
      Lalmatia: { Banasree: 40, Badda: 45, "Merul Badda": 40, Mohakhali: 70, Tejgaon: 75, Mohammadpur: 90, Lalmatia: 100, Mirpur: 65, Uttara: 45, Bashundhara: 40, Dhanmondi: 90, Banani: 55, Gulshan: 50 },
      Mirpur: { Banasree: 30, Badda: 40, "Merul Badda": 35, Mohakhali: 60, Tejgaon: 60, Mohammadpur: 70, Lalmatia: 65, Mirpur: 100, Uttara: 65, Bashundhara: 50, Dhanmondi: 60, Banani: 60, Gulshan: 55 },
      Uttara: { Banasree: 30, Badda: 50, "Merul Badda": 45, Mohakhali: 70, Tejgaon: 60, Mohammadpur: 45, Lalmatia: 45, Mirpur: 65, Uttara: 100, Bashundhara: 70, Dhanmondi: 45, Banani: 65, Gulshan: 60 },
      Bashundhara: { Banasree: 60, Badda: 80, "Merul Badda": 75, Mohakhali: 70, Tejgaon: 65, Mohammadpur: 40, Lalmatia: 40, Mirpur: 50, Uttara: 70, Bashundhara: 100, Dhanmondi: 45, Banani: 75, Gulshan: 80 },
      Dhanmondi: { Banasree: 45, Badda: 45, "Merul Badda": 45, Mohakhali: 70, Tejgaon: 75, Mohammadpur: 85, Lalmatia: 90, Mirpur: 60, Uttara: 45, Bashundhara: 45, Dhanmondi: 100, Banani: 55, Gulshan: 50 },
      Banani: { Banasree: 65, Badda: 75, "Merul Badda": 70, Mohakhali: 90, Tejgaon: 80, Mohammadpur: 55, Lalmatia: 55, Mirpur: 60, Uttara: 65, Bashundhara: 75, Dhanmondi: 55, Banani: 100, Gulshan: 95 },
      Gulshan: { Banasree: 70, Badda: 85, "Merul Badda": 80, Mohakhali: 85, Tejgaon: 75, Mohammadpur: 50, Lalmatia: 50, Mirpur: 55, Uttara: 60, Bashundhara: 80, Dhanmondi: 50, Banani: 95, Gulshan: 100 }
    };
    return matrix[listing.area]?.[anchorArea] ?? 75;
  }, [profile, listing.area]);

  // Find closest entities to listing center
  const closestSchool = useMemo(() => {
    if (mappedSchools.length === 0) return null;
    return mappedSchools.reduce((closest, current) => {
      const distCurrent = calculateDistanceKm(center[0], center[1], current.lat, current.lng);
      const distClosest = calculateDistanceKm(center[0], center[1], closest.lat, closest.lng);
      return distCurrent < distClosest ? current : closest;
    });
  }, [mappedSchools, center]);

  const closestHospital = useMemo(() => {
    if (mappedHospitals.length === 0) return null;
    return mappedHospitals.reduce((closest, current) => {
      const distCurrent = calculateDistanceKm(center[0], center[1], current.lat, current.lng);
      const distClosest = calculateDistanceKm(center[0], center[1], closest.lat, closest.lng);
      return distCurrent < distClosest ? current : closest;
    });
  }, [mappedHospitals, center]);

  const closestLandmark = useMemo(() => {
    if (mappedLandmarks.length === 0) return null;
    return mappedLandmarks.reduce((closest, current) => {
      const distCurrent = calculateDistanceKm(center[0], center[1], current.lat, current.lng);
      const distClosest = calculateDistanceKm(center[0], center[1], closest.lat, closest.lng);
      return distCurrent < distClosest ? current : closest;
    });
  }, [mappedLandmarks, center]);

  const schoolDist = useMemo(() => {
    if (!closestSchool) return 0.45;
    return calculateDistanceKm(center[0], center[1], closestSchool.lat, closestSchool.lng);
  }, [closestSchool, center]);

  const hospitalDist = useMemo(() => {
    if (!closestHospital) return 0.65;
    return calculateDistanceKm(center[0], center[1], closestHospital.lat, closestHospital.lng);
  }, [closestHospital, center]);

  const walkTimeSchool = Math.round(schoolDist * 12);
  const driveTimeHospital = Math.round(hospitalDist * 4 + 2);

  const landmarkDistVal = useMemo(() => {
    if (!closestLandmark) return 0.5;
    return calculateDistanceKm(center[0], center[1], closestLandmark.lat, closestLandmark.lng);
  }, [closestLandmark, center]);

  const aiNeighborhoodDecision = useMemo(() => {
    const factors: string[] = [];
    const reasons: string[] = [];

    if (!profile) return { factors, reasons };

    // AI Decision 1: School path
    const hasSchoolPriority = profile.priorities?.includes("school") || !!profile.childSchoolLocation;
    if (hasSchoolPriority || profile.householdType === "family") {
      factors.push("school");
      reasons.push("AI mapped the school route because your profile indicates school proximity is a priority.");
    }

    // AI Decision 2: Hospital path
    if (profile.needsHealthcare) {
      factors.push("hospital");
      reasons.push("AI mapped the hospital path to guarantee rapid access to medical cover for healthcare needs.");
    } else {
      if (hospitalDist < 0.6) {
        factors.push("hospital");
        reasons.push(`AI mapped the hospital path because ${closestHospital?.name.split(" ")[0] || "hospital"} is exceptionally close (${hospitalDist.toFixed(2)}km).`);
      }
    }

    // AI Decision 3: Commute / Landmark path
    const hasCommutePriority = profile.commuteAnchors && profile.commuteAnchors.length > 0;
    if (hasCommutePriority) {
      factors.push("landmark");
      reasons.push(`AI mapped the path to ${closestLandmark?.name || "commute anchor"} to facilitate easy routing to local landmarks.`);
    }

    // Fallback if AI didn't choose any
    if (factors.length === 0) {
      factors.push("landmark");
      reasons.push("AI highlighted neighborhood landmarks to establish spatial connectivity mapping.");
    }

    return { factors, reasons };
  }, [profile, listing, closestSchool, closestHospital, closestLandmark, schoolDist, hospitalDist, landmarkDistVal]);

  // Sync HUD Tab and trigger dynamic loading when toggled
  useEffect(() => {
    if (showNeighborhoodFactors) {
      setLoadingNeighborhoodPaths(true);
      setHudTab("neighbourhood");
      const timer = setTimeout(() => {
        setLoadingNeighborhoodPaths(false);
      }, 1000); // 1s dynamic loading delay
      return () => clearTimeout(timer);
    }
  }, [showNeighborhoodFactors]);

  useEffect(() => {
    if (showNeighborhoodFactors && !aiOverlayActive) {
      setHudTab("neighbourhood");
    } else if (aiOverlayActive && !showNeighborhoodFactors) {
      setHudTab("analysis");
    }
  }, [aiOverlayActive, showNeighborhoodFactors]);

  // Trigger continuous recalculation of traffic
  useEffect(() => {
    if (!aiOverlayActive) return;
    
    // Simulate real-time updates every 6 seconds
    const interval = setInterval(() => {
      setIsCalculating(true);
      const timer = setTimeout(() => {
        setIsCalculating(false);
        setTrafficEpoch(prev => prev + 1);
      }, 800); // 800ms of calculating state
      return () => clearTimeout(timer);
    }, 6000);

    return () => clearInterval(interval);
  }, [aiOverlayActive]);

  const routeDetails = useMemo(() => {
    const getJamState = (val: number) => {
      const states = [
        { label: "Clear Route", color: "#10b981", delayMin: 0, level: "low" },
        { label: "Light Congestion", color: "#10b981", delayMin: 2, level: "low-med" },
        { label: "Moderate Jam", color: "#eab308", delayMin: 6, level: "medium" },
        { label: "Heavy Jam", color: "#f43f5e", delayMin: 12, level: "high" },
        { label: "Severe Gridlock", color: "#e11d48", delayMin: 22, level: "critical" },
      ];
      return states[val % states.length];
    };

    // School route
    const schoolJam = getJamState(trafficEpoch + 1);
    const schoolBaseTime = Math.round(schoolDist * 12); // walking
    const schoolTotalTime = schoolBaseTime + (schoolJam.level !== "low" ? Math.round(schoolJam.delayMin / 2) : 0);

    // Hospital route
    const hospitalJam = getJamState(trafficEpoch + 3);
    const hospitalBaseTime = Math.round(hospitalDist * 4 + 2); // driving
    const hospitalTotalTime = hospitalBaseTime + hospitalJam.delayMin;

    // Landmark route
    const landmarkJam = getJamState(trafficEpoch + 2);
    const landmarkDistVal = closestLandmark ? calculateDistanceKm(center[0], center[1], closestLandmark.lat, closestLandmark.lng) : 0.5;
    const landmarkBaseTime = Math.round(landmarkDistVal * 12);
    const landmarkTotalTime = landmarkBaseTime + (landmarkJam.level !== "low" ? Math.round(landmarkJam.delayMin / 2) : 0);

    return {
      school: {
        jam: schoolJam,
        time: schoolTotalTime,
        dist: schoolDist,
        path: closestSchool ? generateRoadPath(center, [closestSchool.lat, closestSchool.lng], 12) : []
      },
      hospital: {
        jam: hospitalJam,
        time: hospitalTotalTime,
        dist: hospitalDist,
        path: closestHospital ? generateRoadPath(center, [closestHospital.lat, closestHospital.lng], 24) : []
      },
      landmark: {
        jam: landmarkJam,
        time: landmarkTotalTime,
        dist: landmarkDistVal,
        path: closestLandmark ? generateRoadPath(center, [closestLandmark.lat, closestLandmark.lng], 36) : []
      }
    };
  }, [trafficEpoch, center, closestSchool, closestHospital, closestLandmark, schoolDist, hospitalDist]);

  // Dynamic Pros and Cons based on User Scanner Card preferences and listing amenities
  const { dynamicPros, dynamicCons } = useMemo(() => {
    const pros: string[] = [];
    const cons: string[] = [];

    const priorities = profile?.priorities || ["rent", "school", "commute"];
    const dealBreakers = profile?.dealBreakers || ["heavy-waterlogging"];
    const budgetMonthly = profile?.budgetMonthly || 30000;
    const commuteAnchors = profile?.commuteAnchors || [];
    const needsHealthcare = profile?.needsHealthcare || false;

    // 1. Budget checking
    if (listing.rent <= budgetMonthly) {
      pros.push(`Saves ৳${(budgetMonthly - listing.rent).toLocaleString()} monthly against your budget limit, increasing your disposable income.`);
    } else {
      cons.push(`Overruns budget limit by ৳${(listing.rent - budgetMonthly).toLocaleString()} monthly, which may strain your finances.`);
    }

    // 2. Commute check
    if (commuteAnchors && commuteAnchors[0]) {
      const anchorArea = commuteAnchors[0].area;
      if (listing.area.toLowerCase() === anchorArea.toLowerCase()) {
        pros.push(`Living inside your commute anchor (${listing.area}) eliminates long transit times and reduces daily fatigue.`);
      } else if (commuteScore >= 80) {
        pros.push(`High commute compatibility (${commuteScore}%) to ${anchorArea} ensures smooth, predictable daily travel.`);
      } else if (commuteScore < 60) {
        cons.push(`Low commute compatibility (${commuteScore}%) to ${anchorArea} will result in tedious, exhausting travel times.`);
      }
    }

    // 3. School proximity
    if (closestSchool) {
      if (schoolDist < 0.6) {
        pros.push(`A short ${walkTimeSchool}-minute walk (${schoolDist.toFixed(2)}km) to ${closestSchool.name.split(" ")[0]} enables a stress-free morning routine.`);
      } else if (priorities.includes("school") && schoolDist > 1.2) {
        cons.push(`Distance of ${schoolDist.toFixed(2)}km to the nearest school will increase transit fatigue for children.`);
      }
    }

    // 4. Hospital proximity
    if (closestHospital) {
      if (hospitalDist < 0.8) {
        pros.push(`Nearby medical cover at ${closestHospital.name.split(" ")[0]} (${hospitalDist.toFixed(2)}km) ensures quick access during health emergencies.`);
      } else if (needsHealthcare && hospitalDist > 1.5) {
        cons.push(`Distant medical support (${hospitalDist.toFixed(2)}km) could delay critical response times during health emergencies.`);
      }
    }

    // 5. Waterlogging checking
    if (listing.waterloggingRisk === "low") {
      if (priorities.includes("no-waterlogging")) {
        pros.push("Low waterlogging risk secures hassle-free road access and safety during heavy monsoon showers.");
      }
    } else if (listing.waterloggingRisk === "high" || listing.waterloggingRisk === "medium") {
      cons.push(`${listing.waterloggingRisk === "high" ? "High" : "Medium"} waterlogging risk in this area can disrupt transit and block access during rain.`);
    }

    // 6. Amenities check
    if (listing.lift) {
      if (priorities.includes("lift")) {
        pros.push("An elevator/lift in the building makes carrying groceries and moving heavy items effortless.");
      }
    } else {
      if (dealBreakers.includes("no-lift")) {
        cons.push("Lack of a lift violates your dealbreaker, requiring strenuous daily stair-climbing.");
      } else {
        cons.push("Lack of a lift requires climbing stairs daily, straining energy and affecting elderly accessibility.");
      }
    }

    if (listing.generator) {
      pros.push("Full power generator backup prevents remote work disruptions and keeps appliances running.");
    }

    if (listing.gasType === "line") {
      pros.push("Active pipeline gas connection ensures uninterrupted cooking without the hassle of refilling cylinders.");
    } else if (listing.gasType === "cylinder") {
      cons.push("Reliance on cylinder gas demands manual monitoring and brings risk of running out mid-meal.");
    }

    // Fallbacks
    if (pros.length === 0) pros.push("Good road connectivity ensures you can easily hail rides and navigate the neighborhood.");
    if (cons.length === 0) cons.push("Absence of clear service details means you must verify utility charges to avoid unexpected bills.");

    return {
      dynamicPros: pros.slice(0, 3),
      dynamicCons: cons.slice(0, 3),
    };
  }, [profile, listing, center, closestSchool, closestHospital, schoolDist, hospitalDist, walkTimeSchool, driveTimeHospital, commuteScore]);

  // Leaflet 3D billboard markers for Pros & Cons in the map (styled as physical standing pawn pieces)
  const aiProsCardIcon = useMemo(() => {
    const prosHtml = dynamicPros.map(pro => `
      <li style="margin-bottom: 4px; display: flex; align-items: flex-start; gap: 4px;">
        <span style="color: #10b981; font-weight: 900; line-height: 1.1; font-size: 10px;">✓</span>
        <span style="color: #e4e4e7; font-size: 10px; font-weight: 700; line-height: 1.25;">${pro}</span>
      </li>
    `).join("");

    return L.divIcon({
      html: `
        <div style="background-color: rgba(9, 9, 11, 0.95); border: 2px solid #10b981; border-radius: 10px; box-shadow: 0 6px 16px rgba(16,185,129,0.25); padding: 7px 11px; backdrop-filter: blur(6px); width: 190px; z-index: 10;">
          <div style="display: flex; align-items: center; gap: 4px; border-bottom: 1px solid rgba(16,185,129,0.25); padding-bottom: 4px; margin-bottom: 6px;">
            <span style="font-size: 9px; font-weight: 900; color: #10b981; text-transform: uppercase; letter-spacing: 0.05em;">AI Pros Match</span>
          </div>
          <ul style="margin: 0; padding: 0; list-style: none;">
            ${prosHtml}
          </ul>
        </div>
      `,
      className: "2d-ai-pros-marker",
      iconSize: [190, 120],
      iconAnchor: [95, 120]
    });
  }, [dynamicPros]);

  const aiConsCardIcon = useMemo(() => {
    const consHtml = dynamicCons.map(con => `
      <li style="margin-bottom: 4px; display: flex; align-items: flex-start; gap: 4px;">
        <span style="color: #f43f5e; font-weight: 900; line-height: 1.1; font-size: 10px;">•</span>
        <span style="color: #e4e4e7; font-size: 10px; font-weight: 700; line-height: 1.25;">${con}</span>
      </li>
    `).join("");

    return L.divIcon({
      html: `
        <div style="background-color: rgba(9, 9, 11, 0.95); border: 2px solid #f43f5e; border-radius: 10px; box-shadow: 0 6px 16px rgba(244,63,94,0.25); padding: 7px 11px; backdrop-filter: blur(6px); width: 190px; z-index: 10;">
          <div style="display: flex; align-items: center; gap: 4px; border-bottom: 1px solid rgba(244,63,94,0.25); padding-bottom: 4px; margin-bottom: 6px;">
            <span style="font-size: 9px; font-weight: 900; color: #f43f5e; text-transform: uppercase; letter-spacing: 0.05em;">AI Risk Alert</span>
          </div>
          <ul style="margin: 0; padding: 0; list-style: none;">
            ${consHtml}
          </ul>
        </div>
      `,
      className: "2d-ai-cons-marker",
      iconSize: [190, 120],
      iconAnchor: [95, 120]
    });
  }, [dynamicCons]);

  return (
    <div 
      className="relative w-full h-[85%] rounded-[24px] overflow-hidden bg-zinc-950" 
      style={{
        perspective: "1200px",
        transformStyle: "preserve-3d",
        boxShadow: "0 25px 60px -15px rgba(0,0,0,0.8)",
        border: "1px solid rgba(255,255,255,0.08)"
      }}
    >
      <style>{`
        @keyframes leaflet-dash-flow {
          to {
            stroke-dashoffset: -20;
          }
        }
        .leaflet-animated-route-dash {
          stroke-dasharray: 8, 12;
          animation: leaflet-dash-flow 1.5s linear infinite;
        }
      `}</style>
      
      {/* Dynamic Control Buttons */}
      <div className="absolute top-4 right-4 z-[2000] flex flex-col md:flex-row gap-2">
        <button
          onClick={() => setAiOverlayActive(!aiOverlayActive)}
          className={`px-4 py-2 rounded-full font-bold text-xs shadow-2xl flex items-center gap-1.5 transition-all duration-300 border cursor-pointer uppercase tracking-wider ${
            aiOverlayActive 
              ? "bg-cyan-500 text-zinc-950 border-cyan-400 hover:bg-cyan-400 font-black animate-pulse shadow-cyan-500/25" 
              : "bg-zinc-900/90 text-cyan-400 border-zinc-800 hover:bg-zinc-800 hover:border-cyan-500/30"
          }`}
        >
          <span>{aiOverlayActive ? "AI Analyst: Active" : "Activate AI Overlay"}</span>
        </button>

        <button
          onClick={() => setShowNeighborhoodFactors(!showNeighborhoodFactors)}
          className={`px-4 py-2 rounded-full font-bold text-xs shadow-2xl flex items-center gap-1.5 transition-all duration-300 border cursor-pointer uppercase tracking-wider ${
            showNeighborhoodFactors 
              ? "bg-indigo-500 text-white border-indigo-400 hover:bg-indigo-400 font-black shadow-indigo-500/25" 
              : "bg-zinc-900/90 text-indigo-400 border-zinc-800 hover:bg-zinc-800 hover:border-indigo-500/30"
          }`}
        >
          <span>{showNeighborhoodFactors ? "Neighbourhood Factors: On" : "Neighbourhood Factors"}</span>
        </button>
      </div>

      {/* Futuristic Floating HUD Panel (Fades in on toggle) */}
      {(aiOverlayActive || showNeighborhoodFactors) && (
        <div 
          className="absolute bottom-4 left-4 z-[2000] p-4 rounded-xl bg-zinc-950/95 border-2 border-cyan-500/50 shadow-2xl backdrop-blur-md animate-fade-in flex flex-col gap-2.5 w-[calc(100%-2rem)] md:w-[380px] max-h-[250px] text-white overflow-y-auto"
          style={{ transform: "translateZ(30px)" }}
        >
          <div className="flex justify-between items-center pb-1.5 border-b border-zinc-850 shrink-0">
            <span className="text-[10px] font-black uppercase text-cyan-400 tracking-widest flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              AI Spatial HUD
            </span>
            <div className="flex gap-1">
              {aiOverlayActive && (
                <>
                  <button 
                    onClick={() => setHudTab("analysis")}
                    className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-wider transition-colors cursor-pointer ${
                      hudTab === "analysis" ? "bg-cyan-500 text-zinc-950" : "bg-zinc-900 text-zinc-400 hover:text-white"
                    }`}
                  >
                    Analysis
                  </button>
                  <button 
                    onClick={() => setHudTab("routing")}
                    className={`px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-wider transition-colors cursor-pointer ${
                      hudTab === "routing" ? "bg-cyan-500 text-zinc-950" : "bg-zinc-900 text-zinc-400 hover:text-white"
                    }`}
                  >
                    Routing
                  </button>
                </>
              )}
              {showNeighborhoodFactors && (
                <button 
                  onClick={() => setHudTab("neighbourhood")}
                  className={`px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-wider transition-colors cursor-pointer ${
                    hudTab === "neighbourhood" ? "bg-indigo-500 text-white" : "bg-zinc-900 text-zinc-400 hover:text-white"
                  }`}
                >
                  Neighbourhood
                </button>
              )}
            </div>
          </div>
          
          {hudTab === "analysis" && aiOverlayActive && (
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px] block mb-0.5">Pros Match</span>
                <ul className="list-disc pl-4 space-y-1.5 text-zinc-300 text-[11px] font-semibold leading-relaxed">
                  {dynamicPros.map((pro, index) => (
                    <li key={`hud-pro-${index}`}>{pro}</li>
                  ))}
                </ul>
              </div>
              <div className="border-t border-zinc-900 pt-1.5">
                <span className="text-rose-400 font-bold uppercase tracking-wider text-[10px] block mb-0.5">Risks & Drawbacks</span>
                <ul className="list-disc pl-4 space-y-1.5 text-zinc-300 text-[11px] font-semibold leading-relaxed">
                  {dynamicCons.map((con, index) => (
                    <li key={`hud-con-${index}`}>{con}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {hudTab === "routing" && aiOverlayActive && (
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-cyan-400 font-bold uppercase tracking-wider text-[10px]">Jam Engine</span>
                <span className={`text-[8px] px-1 py-0.5 rounded font-black uppercase ${isCalculating ? "bg-amber-500/20 text-amber-400 animate-pulse" : "bg-cyan-500/20 text-cyan-400"}`}>
                  {isCalculating ? "Recalculating..." : "Sync Active"}
                </span>
              </div>
              <div className="space-y-1 text-[11px] font-semibold text-zinc-300">
                <div className="flex justify-between items-center bg-zinc-900/60 p-1.5 rounded border border-zinc-800/30">
                  <span className="text-indigo-400">School Path:</span>
                  <span>
                    {routeDetails.school.dist.toFixed(2)}km • <span style={{ color: routeDetails.school.jam.color }}>{routeDetails.school.time}m ({routeDetails.school.jam.label})</span>
                  </span>
                </div>
                <div className="flex justify-between items-center bg-zinc-900/60 p-1.5 rounded border border-zinc-800/30">
                  <span className="text-rose-400">Hospital Path:</span>
                  <span>
                    {routeDetails.hospital.dist.toFixed(2)}km • <span style={{ color: routeDetails.hospital.jam.color }}>{routeDetails.hospital.time}m ({routeDetails.hospital.jam.label})</span>
                  </span>
                </div>
                <div className="flex justify-between items-center bg-zinc-900/60 p-1.5 rounded border border-zinc-800/30">
                  <span className="text-yellow-400">Landmark Path:</span>
                  <span>
                    {routeDetails.landmark.dist.toFixed(2)}km • <span style={{ color: routeDetails.landmark.jam.color }}>{routeDetails.landmark.time}m ({routeDetails.landmark.jam.label})</span>
                  </span>
                </div>
              </div>
            </div>
          )}

          {hudTab === "neighbourhood" && showNeighborhoodFactors && (
            loadingNeighborhoodPaths ? (
              <div className="flex flex-col items-center justify-center py-6 gap-2 shrink-0">
                <div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest animate-pulse">
                  AI computing infrastructure paths...
                </span>
              </div>
            ) : (
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center pb-1 border-b border-zinc-900">
                  <span className="text-indigo-400 font-extrabold uppercase tracking-wider text-[10px]">
                    AI Infrastructure Decisions
                  </span>
                  <span className="text-[8px] bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded font-black uppercase">
                    AI Active
                  </span>
                </div>
                <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                  {aiNeighborhoodDecision.reasons.map((reason, idx) => (
                    <div key={`reason-${idx}`} className="bg-zinc-900/60 p-2 rounded border border-zinc-800/30 text-[10.5px] font-semibold text-zinc-300 leading-normal">
                      {reason}
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      )}

      {/* The Orthogonal Map Container */}
      <div 
        className="absolute inset-0" 
        style={{
          filter: aiOverlayActive ? "hue-rotate(180deg) brightness(0.85) contrast(1.1)" : "none" // futuristic visual take-over
        }}
      >
        <MapContainer
          center={center}
          zoom={15}
          scrollWheelZoom={true}
          zoomControl={true}
          dragging={true}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            key={aiOverlayActive ? "dark-theme" : "voyager-theme"}
            attribution='&copy; OSM Voyager'
            url={aiOverlayActive 
              ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            }
          />
          <MapController center={center} />

          {/* AI concentric zoning rings */}
          {aiOverlayActive && (
            <>
              {/* Zone 1: Immediate Access Zone (300m) */}
              <Circle
                center={center}
                radius={300}
                pathOptions={{
                  color: "#06b6d4",
                  fillColor: "#06b6d4",
                  fillOpacity: 0.05,
                  weight: 1.5,
                  dashArray: "4, 6"
                }}
              >
                <Tooltip sticky permanent={true} direction="top" opacity={0.8}>
                  <span style={{ fontSize: "12px", fontWeight: "900", color: "#22d3ee", textTransform: "uppercase", letterSpacing: "0.05em", backgroundColor: "rgba(9, 9, 11, 0.9)", border: "1px solid #0891b2", padding: "2px 6px", borderRadius: "4px" }}>
                    Zone 1: Walking Access (300m)
                  </span>
                </Tooltip>
              </Circle>

              {/* Zone 2: Proximity Radius (600m) */}
              <Circle
                center={center}
                radius={600}
                pathOptions={{
                  color: "#8b5cf6",
                  fillColor: "#8b5cf6",
                  fillOpacity: 0.03,
                  weight: 1.5,
                  dashArray: "4, 6"
                }}
              >
                <Tooltip sticky permanent={true} direction="top" opacity={0.8}>
                  <span style={{ fontSize: "12px", fontWeight: "900", color: "#c084fc", textTransform: "uppercase", letterSpacing: "0.05em", backgroundColor: "rgba(9, 9, 11, 0.9)", border: "1px solid #7c3aed", padding: "2px 6px", borderRadius: "4px" }}>
                    Zone 2: Proximity Radius (600m)
                  </span>
                </Tooltip>
              </Circle>

              {/* Zone 3: Transit Corridor (900m) */}
              <Circle
                center={center}
                radius={900}
                pathOptions={{
                  color: "#f59e0b",
                  fillColor: "#f59e0b",
                  fillOpacity: 0.01,
                  weight: 1.5,
                  dashArray: "4, 6"
                }}
              >
                <Tooltip sticky permanent={true} direction="top" opacity={0.8}>
                  <span style={{ fontSize: "12px", fontWeight: "900", color: "#fbbf24", textTransform: "uppercase", letterSpacing: "0.05em", backgroundColor: "rgba(9, 9, 11, 0.9)", border: "1px solid #d97706", padding: "2px 6px", borderRadius: "4px" }}>
                    Zone 3: Transit Corridor (900m)
                  </span>
                </Tooltip>
              </Circle>
            </>
          )}

          {/* Main listing flat marker */}
          <Marker position={center} icon={targetIcon}>
            <Tooltip direction="top" offset={[0, -200]} opacity={0.95} permanent={false}>
              <div style={{ backgroundColor: "#09090b", color: "#ffffff", border: "1px solid #3f3f46", padding: "12px", borderRadius: "12px", boxShadow: "0 10px 25px rgba(0,0,0,0.5)", fontSize: "15px", fontWeight: "bold", display: "flex", flexDirection: "column", gap: "6px", maxWidth: "280px" }}>
                <span style={{ color: "#d4a853", fontWeight: "900", textTransform: "uppercase", fontSize: "12px", letterSpacing: "0.05em" }}>🏠 Target Apartment</span>
                <p style={{ margin: 0, color: "#ffffff", fontWeight: "900", lineHeight: "1.3" }}>{listing.title}</p>
                <p style={{ margin: "2px 0 0 0", color: "#a1a1aa", fontSize: "13px", fontWeight: "600" }}>Rent: ৳{listing.rent.toLocaleString()}/mo • Service charge: ৳{listing.serviceCharge || 0}</p>
              </div>
            </Tooltip>
            <Popup>
              <div className="text-xs">
                <span className="font-extrabold text-[#d4a853] block uppercase tracking-wide">Target Apartment</span>
                <p className="font-bold text-slate-800 mt-1">{listing.title}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Rent: {listing.rent.toLocaleString()} BDT</p>
              </div>
            </Popup>
          </Marker>

          {/* Local Schools */}
          {mappedSchools.map((school, idx) => {
            const distance = calculateDistanceKm(center[0], center[1], school.lat, school.lng);
            const walkTime = Math.round(distance * 12);
            return (
              <Marker key={`sch-${idx}`} position={[school.lat, school.lng]} icon={schoolIcon(school.name)}>
                <Tooltip direction="top" offset={[0, -110]} opacity={0.95} permanent={false}>
                  <div style={{ backgroundColor: "#09090b", color: "#ffffff", border: "1px solid #3f3f46", padding: "12px", borderRadius: "12px", boxShadow: "0 10px 25px rgba(0,0,0,0.5)", fontSize: "15px", fontWeight: "bold", display: "flex", flexDirection: "column", gap: "6px", maxWidth: "280px" }}>
                    <span style={{ color: "#818cf8", fontWeight: "900", textTransform: "uppercase", fontSize: "12px", letterSpacing: "0.05em" }}>🏫 School / College</span>
                    <p style={{ margin: 0, color: "#ffffff", fontWeight: "900", lineHeight: "1.3" }}>{school.name}</p>
                    <div style={{ display: "flex", gap: "8px", color: "#a1a1aa", fontSize: "13px", fontWeight: "600", marginTop: "4px", borderTop: "1px solid #27272a", paddingTop: "6px" }}>
                      <span>📍 {distance.toFixed(2)} km</span>
                      <span>•</span>
                      <span>🚶 {walkTime} mins walk</span>
                    </div>
                  </div>
                </Tooltip>
                <Popup>
                  <div className="text-xs">
                    <span className="font-extrabold text-indigo-500 block uppercase tracking-wide">School / College</span>
                    <p className="font-bold text-slate-800 mt-0.5">{school.name}</p>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* Local Hospitals */}
          {mappedHospitals.map((hospital, idx) => {
            const distance = calculateDistanceKm(center[0], center[1], hospital.lat, hospital.lng);
            const driveTime = Math.round(distance * 4 + 2);
            return (
              <Marker key={`hosp-${idx}`} position={[hospital.lat, hospital.lng]} icon={hospitalIcon(hospital.name)}>
                <Tooltip direction="top" offset={[0, -110]} opacity={0.95} permanent={false}>
                  <div style={{ backgroundColor: "#09090b", color: "#ffffff", border: "1px solid #3f3f46", padding: "12px", borderRadius: "12px", boxShadow: "0 10px 25px rgba(0,0,0,0.5)", fontSize: "15px", fontWeight: "bold", display: "flex", flexDirection: "column", gap: "6px", maxWidth: "280px" }}>
                    <span style={{ color: "#fca5a5", fontWeight: "900", textTransform: "uppercase", fontSize: "12px", letterSpacing: "0.05em" }}>🏥 Hospital / Clinic</span>
                    <p style={{ margin: 0, color: "#ffffff", fontWeight: "900", lineHeight: "1.3" }}>{hospital.name}</p>
                    <div style={{ display: "flex", gap: "8px", color: "#a1a1aa", fontSize: "13px", fontWeight: "600", marginTop: "4px", borderTop: "1px solid #27272a", paddingTop: "6px" }}>
                      <span>📍 {distance.toFixed(2)} km</span>
                      <span>•</span>
                      <span>🚗 {driveTime} mins drive</span>
                    </div>
                  </div>
                </Tooltip>
                <Popup>
                  <div className="text-xs">
                    <span className="font-extrabold text-rose-500 block uppercase tracking-wide">Hospital / Clinic</span>
                    <p className="font-bold text-slate-800 mt-0.5">{hospital.name}</p>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* Local Landmarks */}
          {mappedLandmarks.map((landmark, idx) => {
            const distance = calculateDistanceKm(center[0], center[1], landmark.lat, landmark.lng);
            const walkTime = Math.round(distance * 12);
            return (
              <Marker key={`land-${idx}`} position={[landmark.lat, landmark.lng]} icon={landmarkIcon(landmark.name)}>
                <Tooltip direction="top" offset={[0, -110]} opacity={0.95} permanent={false}>
                  <div style={{ backgroundColor: "#09090b", color: "#ffffff", border: "1px solid #3f3f46", padding: "12px", borderRadius: "12px", boxShadow: "0 10px 25px rgba(0,0,0,0.5)", fontSize: "15px", fontWeight: "bold", display: "flex", flexDirection: "column", gap: "6px", maxWidth: "280px" }}>
                    <span style={{ color: "#fef08a", fontWeight: "900", textTransform: "uppercase", fontSize: "12px", letterSpacing: "0.05em" }}>⭐ Landmark / Desired Spot</span>
                    <p style={{ margin: 0, color: "#ffffff", fontWeight: "900", lineHeight: "1.3" }}>{landmark.name}</p>
                    <div style={{ display: "flex", gap: "8px", color: "#a1a1aa", fontSize: "13px", fontWeight: "600", marginTop: "4px", borderTop: "1px solid #27272a", paddingTop: "6px" }}>
                      <span>📍 {distance.toFixed(2)} km</span>
                      <span>•</span>
                      <span>🚶 {walkTime} mins walk</span>
                    </div>
                  </div>
                </Tooltip>
                <Popup>
                  <div className="text-xs">
                    <span className="font-extrabold text-amber-500 block uppercase tracking-wide">Landmark</span>
                    <p className="font-bold text-slate-800 mt-0.5">{landmark.name}</p>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* AI Overlay spatial connecting lines & floating billboard callouts */}
          {/* AI Overlay spatial connecting lines & floating billboard callouts */}
          {(aiOverlayActive || (showNeighborhoodFactors && !loadingNeighborhoodPaths)) && (
            <>
              {/* School Path Base & Flow */}
              {closestSchool && routeDetails.school.path.length > 0 && (aiOverlayActive || aiNeighborhoodDecision.factors.includes("school")) && (
                <>
                  <Polyline
                    positions={routeDetails.school.path}
                    pathOptions={{
                      color: "#1e1e24",
                      weight: 6,
                      opacity: 0.5,
                      lineCap: "round"
                    }}
                  />
                  <Polyline
                    positions={routeDetails.school.path}
                    pathOptions={{
                      color: routeDetails.school.jam.color,
                      weight: 4,
                      opacity: 0.95,
                      className: "leaflet-animated-route-dash",
                      lineCap: "round"
                    }}
                  >
                    <Tooltip sticky={true} opacity={0.95}>
                      <div style={{ backgroundColor: "#09090b", color: "#ffffff", border: `1px solid ${routeDetails.school.jam.color}`, padding: "8px", borderRadius: "8px", fontSize: "12px", fontWeight: "bold" }}>
                        <span style={{ color: "#818cf8" }}>Route to School</span>
                        <div style={{ marginTop: "4px" }}>Distance: {routeDetails.school.dist.toFixed(2)} km</div>
                        <div>Time: {routeDetails.school.time} mins (Walk)</div>
                        <div style={{ color: routeDetails.school.jam.color }}>Jam Level: {routeDetails.school.jam.label}</div>
                      </div>
                    </Tooltip>
                  </Polyline>
                </>
              )}

              {/* Hospital Path Base & Flow */}
              {closestHospital && routeDetails.hospital.path.length > 0 && (aiOverlayActive || aiNeighborhoodDecision.factors.includes("hospital")) && (
                <>
                  <Polyline
                    positions={routeDetails.hospital.path}
                    pathOptions={{
                      color: "#1e1e24",
                      weight: 6,
                      opacity: 0.5,
                      lineCap: "round"
                    }}
                  />
                  <Polyline
                    positions={routeDetails.hospital.path}
                    pathOptions={{
                      color: routeDetails.hospital.jam.color,
                      weight: 4,
                      opacity: 0.95,
                      className: "leaflet-animated-route-dash",
                      lineCap: "round"
                    }}
                  >
                    <Tooltip sticky={true} opacity={0.95}>
                      <div style={{ backgroundColor: "#09090b", color: "#ffffff", border: `1px solid ${routeDetails.hospital.jam.color}`, padding: "8px", borderRadius: "8px", fontSize: "12px", fontWeight: "bold" }}>
                        <span style={{ color: "#fca5a5" }}>Route to Hospital</span>
                        <div style={{ marginTop: "4px" }}>Distance: {routeDetails.hospital.dist.toFixed(2)} km</div>
                        <div>Time: {routeDetails.hospital.time} mins (Drive)</div>
                        <div style={{ color: routeDetails.hospital.jam.color }}>Jam Level: {routeDetails.hospital.jam.label}</div>
                      </div>
                    </Tooltip>
                  </Polyline>
                </>
              )}

              {/* Landmark Path Base & Flow */}
              {closestLandmark && routeDetails.landmark.path.length > 0 && (aiOverlayActive || aiNeighborhoodDecision.factors.includes("landmark")) && (
                <>
                  <Polyline
                    positions={routeDetails.landmark.path}
                    pathOptions={{
                      color: "#1e1e24",
                      weight: 6,
                      opacity: 0.5,
                      lineCap: "round"
                    }}
                  />
                  <Polyline
                    positions={routeDetails.landmark.path}
                    pathOptions={{
                      color: routeDetails.landmark.jam.color,
                      weight: 4,
                      opacity: 0.95,
                      className: "leaflet-animated-route-dash",
                      lineCap: "round"
                    }}
                  >
                    <Tooltip sticky={true} opacity={0.95}>
                      <div style={{ backgroundColor: "#09090b", color: "#ffffff", border: `1px solid ${routeDetails.landmark.jam.color}`, padding: "8px", borderRadius: "8px", fontSize: "12px", fontWeight: "bold" }}>
                        <span style={{ color: "#fef08a" }}>Route to Landmark</span>
                        <div style={{ marginTop: "4px" }}>Distance: {routeDetails.landmark.dist.toFixed(2)} km</div>
                        <div>Time: {routeDetails.landmark.time} mins (Walk)</div>
                        <div style={{ color: routeDetails.landmark.jam.color }}>Jam Level: {routeDetails.landmark.jam.label}</div>
                      </div>
                    </Tooltip>
                  </Polyline>
                </>
              )}
              {aiOverlayActive && (
                <>
                  <Marker position={[center[0] + 0.0024, center[1] - 0.0034]} icon={aiProsCardIcon} />
                  <Marker position={[center[0] - 0.0024, center[1] + 0.0034]} icon={aiConsCardIcon} />
                </>
              )}
            </>
          )}
        </MapContainer>
      </div>
    </div>
  );
}
