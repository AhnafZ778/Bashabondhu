"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ScanSummary } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";

type DemoScanAnimationProps = {
  scanSummary: ScanSummary;
  onComplete: () => void;
};

type ScanStep = {
  label: string;
  count: number;
  icon: string;
  color: string;
};

export default function DemoScanAnimation({ scanSummary, onComplete }: DemoScanAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [displayCount, setDisplayCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const steps: ScanStep[] = [
    {
      label: `Scanning ${scanSummary.scanned} Dhaka listings...`,
      count: scanSummary.scanned,
      icon: "🔍",
      color: "var(--accent-blue, #3b82f6)",
    },
    {
      label: `Removed ${scanSummary.removedBudget} over budget`,
      count: scanSummary.removedBudget,
      icon: "💰",
      color: "var(--accent-red, #ef4444)",
    },
    {
      label: `Removed ${scanSummary.removedCommute} bad commute match`,
      count: scanSummary.removedCommute,
      icon: "🚌",
      color: "var(--accent-orange, #f97316)",
    },
    {
      label: `Removed ${scanSummary.removedHiddenCost} hidden cost risk`,
      count: scanSummary.removedHiddenCost,
      icon: "⚠️",
      color: "var(--accent-yellow, #eab308)",
    },
    {
      label: `Removed ${scanSummary.removedHouseholdMismatch} household mismatch`,
      count: scanSummary.removedHouseholdMismatch,
      icon: "🏠",
      color: "var(--accent-purple, #8b5cf6)",
    },
    {
      label: `Found ${scanSummary.selected} homes worth visiting!`,
      count: scanSummary.selected,
      icon: "✨",
      color: "var(--accent-gold, #d4a853)",
    },
  ];

  // Animate counter
  useEffect(() => {
    if (currentStep >= steps.length) return;

    const target = steps[currentStep].count;
    const duration = 600;
    const startTime = Date.now();
    const startVal = 0;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayCount(Math.round(startVal + (target - startVal) * eased));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [currentStep, steps]);

  // Progress through steps
  useEffect(() => {
    if (currentStep >= steps.length) {
      setIsComplete(true);
      const timer = setTimeout(onComplete, 800);
      return () => clearTimeout(timer);
    }

    const delay = currentStep === 0 ? 1200 : 800;
    const timer = setTimeout(() => {
      setCurrentStep(prev => prev + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [currentStep, steps.length, onComplete]);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "60vh",
      padding: "2rem",
      textAlign: "center",
    }}>
      {/* Animated radar/pulse effect */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={{
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          background: isComplete
            ? "linear-gradient(135deg, #d4a853, #f0c674)"
            : "linear-gradient(135deg, #3b82f6, #1d4ed8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "2rem",
          position: "relative",
        }}
      >
        {/* Pulse ring */}
        {!isComplete && (
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.6, 0, 0.6],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: "2px solid #3b82f6",
            }}
          />
        )}
        <span style={{ fontSize: "2.5rem" }}>
          {currentStep < steps.length ? steps[currentStep].icon : "✨"}
        </span>
      </motion.div>

      {/* Counter */}
      <motion.div
        key={currentStep}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        style={{
          fontSize: "3rem",
          fontWeight: 800,
          color: currentStep < steps.length ? steps[currentStep].color : "#d4a853",
          fontVariantNumeric: "tabular-nums",
          marginBottom: "0.5rem",
        }}
      >
        {displayCount}
      </motion.div>

      {/* Current step label */}
      <AnimatePresence mode="wait">
        <motion.p
          key={currentStep}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            fontSize: "1.25rem",
            fontWeight: 600,
            color: isComplete ? "#d4a853" : "var(--text-primary, #1a1a2e)",
            marginBottom: "2rem",
            maxWidth: "400px",
          }}
        >
          {currentStep < steps.length ? steps[currentStep].label : "Found homes worth visiting!"}
        </motion.p>
      </AnimatePresence>

      {/* Progress dots */}
      <div style={{ display: "flex", gap: "8px" }}>
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0.8 }}
            animate={{
              scale: i <= currentStep ? 1 : 0.8,
              backgroundColor: i < currentStep
                ? step.color
                : i === currentStep
                  ? step.color
                  : "var(--surface-secondary, #e2e8f0)",
            }}
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              transition: "background-color 0.3s",
            }}
          />
        ))}
      </div>

      {/* Completed steps list */}
      <div style={{ marginTop: "2rem", textAlign: "left", width: "100%", maxWidth: "400px" }}>
        {steps.slice(0, currentStep).map((step, i) => (
          <motion.div
            key={i}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.5rem 0",
              fontSize: "0.9rem",
              color: "var(--text-secondary, #64748b)",
              borderBottom: "1px solid var(--border, #e2e8f0)",
            }}
          >
            <span>{step.icon}</span>
            <span>{step.label}</span>
            <span style={{ marginLeft: "auto", fontWeight: 700, color: step.color }}>
              {step.count}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
