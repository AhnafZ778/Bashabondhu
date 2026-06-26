import React from "react";
import { HiddenCostSource } from "../lib/domain/hidden-cost-sources";
import { 
  Zap, 
  Droplets, 
  Flame, 
  Coins, 
  FileText, 
  MapPin, 
  ShieldAlert, 
  AlertTriangle, 
  AlertCircle, 
  HelpCircle, 
  AlertOctagon,
  Radar
} from "lucide-react";

export default function HiddenCostScopeRadar({ scopes }: { scopes: HiddenCostSource[] }) {
  if (!scopes || scopes.length === 0) {
    return (
      <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-2xl">
        <h4 className="text-emerald-400 font-extrabold text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2">
          <span className="material-icons text-sm">verified</span> No Hidden Cost Scopes Detected
        </h4>
        <p className="text-emerald-400/70 text-xs mt-1.5 leading-relaxed">This listing appears fully transparent based on our social profile analysis.</p>
      </div>
    );
  }

  // Calculate total ambiguity score (0 to 100)
  let totalPenalty = 0;
  scopes.forEach(scope => {
    if (scope.seriousness === "critical") totalPenalty += 25;
    else if (scope.seriousness === "high") totalPenalty += 15;
    else if (scope.seriousness === "medium") totalPenalty += 5;
    else totalPenalty += 2;
  });
  const riskPercentage = Math.min(100, totalPenalty);

  let riskLabel = "Low Ambiguity";
  let riskTextColor = "text-emerald-400";
  let riskBgColor = "bg-emerald-500/5";
  let riskBorderColor = "border-emerald-500/15";
  
  if (riskPercentage > 60) {
    riskLabel = "Critical Ambiguity Risk";
    riskTextColor = "text-rose-400";
    riskBgColor = "bg-rose-500/5";
    riskBorderColor = "border-rose-500/15";
  } else if (riskPercentage > 35) {
    riskLabel = "High Ambiguity Risk";
    riskTextColor = "text-amber-400";
    riskBgColor = "bg-amber-500/5";
    riskBorderColor = "border-amber-500/15";
  } else if (riskPercentage > 15) {
    riskLabel = "Moderate Ambiguity Risk";
    riskTextColor = "text-sky-400";
    riskBgColor = "bg-sky-500/5";
    riskBorderColor = "border-sky-500/15";
  }

  // Dynamic Overall Gradient Risk Bar
  let riskGradient = "from-emerald-500 to-sky-400";
  if (riskPercentage > 60) {
    riskGradient = "from-amber-500 via-orange-500 to-rose-600 shadow-rose-500/25";
  } else if (riskPercentage > 35) {
    riskGradient = "from-sky-500 via-amber-400 to-amber-500 shadow-amber-500/15";
  } else if (riskPercentage > 15) {
    riskGradient = "from-emerald-500 to-sky-500";
  }

  const getCategoryDetails = (id: string) => {
    switch (id) {
      case "electricity_billing":
        return { 
          icon: <Zap className="w-4 h-4" />, 
          color: "text-amber-400 border-amber-500/30 bg-amber-500/10 shadow-[0_0_12px_rgba(245,158,11,0.12)]" 
        };
      case "water_billing":
        return { 
          icon: <Droplets className="w-4 h-4" />, 
          color: "text-sky-400 border-sky-500/30 bg-sky-500/10 shadow-[0_0_12px_rgba(14,165,233,0.12)]" 
        };
      case "gas_type":
        return { 
          icon: <Flame className="w-4 h-4" />, 
          color: "text-orange-400 border-orange-500/30 bg-orange-500/10 shadow-[0_0_12px_rgba(249,115,22,0.12)]" 
        };
      case "broker_fee":
      case "advance_terms":
      case "service_charge":
      case "generator_lift_charge":
      case "maintenance_security_cleaning":
        return { 
          icon: <Coins className="w-4 h-4" />, 
          color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10 shadow-[0_0_12px_rgba(16,185,129,0.12)]" 
        };
      case "agreement_receipt_terms":
      case "rent_increase_terms":
        return { 
          icon: <FileText className="w-4 h-4" />, 
          color: "text-purple-400 border-purple-500/30 bg-purple-500/10 shadow-[0_0_12px_rgba(168,85,247,0.12)]" 
        };
      case "road_access":
      case "moving_access":
        return { 
          icon: <MapPin className="w-4 h-4" />, 
          color: "text-rose-400 border-rose-500/30 bg-rose-500/10 shadow-[0_0_12px_rgba(244,63,94,0.12)]" 
        };
      default:
        return { 
          icon: <ShieldAlert className="w-4 h-4" />, 
          color: "text-zinc-400 border-zinc-500/30 bg-zinc-500/10" 
        };
    }
  };

  const renderThreatPulse = (seriousness: string) => {
    let color = "bg-emerald-500";
    if (seriousness === "critical") color = "bg-rose-500";
    else if (seriousness === "high") color = "bg-amber-500";
    else if (seriousness === "medium") color = "bg-sky-400";

    return (
      <span className="relative flex h-2 w-2 shrink-0">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${color} opacity-75`}></span>
        <span className={`relative inline-flex rounded-full h-2 w-2 ${color}`}></span>
      </span>
    );
  };

  const renderRiskBar = (seriousness: string) => {
    let percentage = 25;
    let barColor = "from-emerald-500 to-emerald-400";
    let glowColor = "shadow-emerald-500/20";
    let label = "Low";
    
    if (seriousness === "critical") {
      percentage = 100;
      barColor = "from-rose-600 to-pink-500";
      glowColor = "shadow-rose-500/30";
      label = "Critical";
    } else if (seriousness === "high") {
      percentage = 75;
      barColor = "from-amber-500 to-orange-400";
      glowColor = "shadow-amber-500/20";
      label = "High";
    } else if (seriousness === "medium") {
      percentage = 50;
      barColor = "from-sky-500 to-blue-400";
      glowColor = "shadow-sky-500/15";
      label = "Medium";
    }

    return (
      <div className="flex items-center gap-3 mt-3">
        <div className="flex-1 h-1.5 bg-zinc-900 rounded-full relative overflow-hidden border border-zinc-800/40">
          <div 
            className={`h-full rounded-full bg-gradient-to-r ${barColor} shadow-xs ${glowColor} transition-all duration-500`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-[9px] font-black uppercase tracking-wider text-zinc-400 w-12 text-right">
          {label}
        </span>
      </div>
    );
  };

  const critical = scopes.filter(s => s.seriousness === "critical");
  const high = scopes.filter(s => s.seriousness === "high");
  const medium = scopes.filter(s => s.seriousness === "medium");
  const low = scopes.filter(s => s.seriousness !== "critical" && s.seriousness !== "high" && s.seriousness !== "medium");

  const renderScopeItem = (s: HiddenCostSource, index: number) => {
    const details = getCategoryDetails(s.id);
    return (
      <div key={index} className="group bg-zinc-950/40 border border-zinc-800/60 p-4 rounded-2xl flex items-start gap-3.5 hover:border-zinc-700/60 hover:bg-zinc-900/10 hover:scale-[1.01] transition-all duration-300 shadow-inner">
        <div className={`p-2.5 rounded-xl border shrink-0 ${details.color} transition-all duration-300`}>
          {details.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center gap-2">
            <span className="text-zinc-200 font-extrabold text-xs sm:text-sm tracking-wide leading-tight group-hover:text-white transition-colors">
              {s.label}
            </span>
            {renderThreatPulse(s.seriousness)}
          </div>
          {s.userImpact && (
            <p className="text-zinc-400 text-[11px] font-semibold leading-relaxed mt-1">{s.userImpact}</p>
          )}
          {renderRiskBar(s.seriousness)}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-zinc-950/70 backdrop-blur-md border border-zinc-800/80 p-5 rounded-3xl space-y-6 shadow-2xl">
      {/* Top section: Overall Risk Meter */}
      <div className="bg-zinc-950/50 p-4 rounded-2xl border border-zinc-800/60 shadow-inner space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2">
            <Radar className="w-4 h-4 text-[#C9952B] animate-pulse" />
            Hidden Cost Scopes
          </h3>
          <span className={`text-[9px] px-2.5 py-1 rounded-full font-black uppercase tracking-widest ${riskTextColor} ${riskBgColor} border ${riskBorderColor}`}>
            {riskLabel}
          </span>
        </div>
        
        {/* Dynamic Gradient Risk Bar */}
        <div className="space-y-2">
          <div className="h-2.5 w-full bg-zinc-900 rounded-full overflow-hidden relative border border-zinc-800/80">
            <div 
              className={`h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r ${riskGradient} shadow-xs`}
              style={{ width: `${riskPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-zinc-500">
            <span>Transparent Listing</span>
            <span className="text-[#C9952B]">{riskPercentage}% Ambiguity Score</span>
            <span>Uncertain / Critical</span>
          </div>
        </div>
      </div>
      
      {/* Scopes List */}
      <div className="space-y-5">
        {critical.length > 0 && (
          <div className="space-y-2.5">
            <h4 className="text-rose-500 text-[10px] font-black uppercase tracking-widest border-b border-rose-500/10 pb-2 flex items-center gap-2">
              <AlertOctagon className="w-3.5 h-3.5" />
              Critical Ambiguities
            </h4>
            <div className="space-y-2.5">
              {critical.map((s, i) => renderScopeItem(s, i))}
            </div>
          </div>
        )}

        {high.length > 0 && (
          <div className="space-y-2.5">
            <h4 className="text-amber-500 text-[10px] font-black uppercase tracking-widest border-b border-amber-500/10 pb-2 flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5" />
              High Ambiguities
            </h4>
            <div className="space-y-2.5">
              {high.map((s, i) => renderScopeItem(s, i))}
            </div>
          </div>
        )}

        {medium.length > 0 && (
          <div className="space-y-2.5">
            <h4 className="text-sky-400 text-[10px] font-black uppercase tracking-widest border-b border-sky-500/10 pb-2 flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5" />
              Medium Ambiguities
            </h4>
            <div className="space-y-2.5">
              {medium.map((s, i) => renderScopeItem(s, i))}
            </div>
          </div>
        )}

        {low.length > 0 && (
          <div className="space-y-2.5">
            <h4 className="text-emerald-400 text-[10px] font-black uppercase tracking-widest border-b border-emerald-500/10 pb-2 flex items-center gap-2">
              <HelpCircle className="w-3.5 h-3.5" />
              Low Ambiguities
            </h4>
            <div className="space-y-2.5">
              {low.map((s, i) => renderScopeItem(s, i))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
