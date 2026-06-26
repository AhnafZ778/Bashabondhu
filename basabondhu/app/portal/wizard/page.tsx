"use client";

import React, { useState } from "react";
import Wizard from "@/components/Wizard";
import Typewriter from "@/components/Typewriter";
import { Sparkles, Bot } from "lucide-react";

export default function WizardPage() {
  const [introDone, setIntroDone] = useState(false);

  const introText = `Welcome to the Guided Matcher. I am your BasaBondhu AI house-hunting assistant.

I will build a customized search profile to find your ideal rental in 4 simple steps:
1. **Household Structure:** Tell us who is shifting.
2. **Budget & Advance:** Set your financial boundaries.
3. **Commute Anchors:** Define your daily travel hubs.
4. **Priorities & Deal-Breakers:** Filter out the noise.

Ready? Let's configure your profile below...`;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-4 text-left bg-emerald-500/5 border border-emerald-500/20 rounded-3xl p-6 shadow-sm relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
        
        <div className="flex justify-between items-center relative z-10">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-black text-emerald-600 tracking-tight uppercase">AI Matcher Initialization</h2>
          </div>
          <button 
            onClick={() => setIntroDone(true)}
            className={`text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded-full border border-emerald-600/20 text-emerald-600 hover:bg-emerald-600/10 transition-colors ${introDone ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            Skip Intro
          </button>
        </div>
        
        <div className="text-sm text-text-main leading-relaxed font-medium min-h-[180px] relative z-10">
          <Typewriter 
            content={introText} 
            speed={20} 
            onComplete={() => setIntroDone(true)} 
            skip={introDone}
          />
        </div>
      </div>

      <div className={`transition-all duration-1000 transform ${introDone ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
        <div className="bg-card border border-border-light rounded-3xl p-6 sm:p-8 shadow-xs">
          <Wizard />
        </div>
      </div>
    </div>
  );
}
