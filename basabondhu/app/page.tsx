"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import LandingPage from "@/components/LandingPage";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-bg transition-colors duration-300">
      <Navbar />
      <LandingPage />
    </div>
  );
}
