"use client";

import React from "react";

/* Reusable shimmer line */
function ShimmerLine({ width = "100%", height = "12px" }: { width?: string; height?: string }) {
  return (
    <div
      className="bg-border-light rounded-md animate-pulse"
      style={{ width, height }}
    />
  );
}

/* Card skeleton for listing cards */
export function ListingCardSkeleton() {
  return (
    <div className="bg-card rounded-3xl overflow-hidden border border-border-light shadow-sm">
      {/* Image placeholder */}
      <div className="h-48 w-full bg-bg-alt animate-pulse" />

      <div className="p-5 space-y-3">
        <ShimmerLine width="40%" height="10px" />
        <ShimmerLine width="80%" height="16px" />
        <ShimmerLine width="60%" height="12px" />

        <div className="flex gap-4 pt-2">
          <ShimmerLine width="70px" height="28px" />
          <ShimmerLine width="90px" height="28px" />
        </div>

        <div className="flex gap-2 pt-3">
          <ShimmerLine width="80px" height="24px" />
          <ShimmerLine width="100px" height="24px" />
        </div>
      </div>
    </div>
  );
}

/* Grid of listing card skeletons */
export function ListingGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <ListingCardSkeleton key={i} />
      ))}
    </div>
  );
}

/* Area card skeleton */
export function AreaCardSkeleton() {
  return (
    <div className="bg-card border border-border-light rounded-xl p-4 space-y-3">
      <ShimmerLine width="60%" height="14px" />
      <ShimmerLine width="90%" height="10px" />
      <div className="flex gap-2">
        <ShimmerLine width="50px" height="20px" />
        <ShimmerLine width="70px" height="20px" />
      </div>
    </div>
  );
}

/* Area recommendations skeleton */
export function AreaRecommendationsSkeleton() {
  return (
    <div className="space-y-4">
      <ShimmerLine width="200px" height="16px" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <AreaCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

/* Sidebar profile skeleton */
export function ProfileSidebarSkeleton() {
  return (
    <div className="bg-card border border-border-light rounded-3xl p-6 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-border-light">
        <ShimmerLine width="130px" height="12px" />
        <ShimmerLine width="60px" height="10px" />
      </div>
      <div className="space-y-3">
        <div className="bg-bg-alt p-3 rounded-xl border border-border-light">
          <ShimmerLine width="100%" height="10px" />
        </div>
        <div className="bg-bg-alt p-3 rounded-xl border border-border-light">
          <ShimmerLine width="100%" height="10px" />
        </div>
        <div className="bg-bg-alt p-3 rounded-xl border border-border-light">
          <ShimmerLine width="100%" height="10px" />
        </div>
      </div>
    </div>
  );
}

/* Comparison table skeleton */
export function ComparisonSkeleton() {
  return (
    <div className="bg-card border border-border-light rounded-3xl p-6 space-y-4">
      <ShimmerLine width="200px" height="18px" />
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex gap-4 py-2 border-b border-border-light">
            <ShimmerLine width="25%" height="12px" />
            <ShimmerLine width="35%" height="12px" />
            <ShimmerLine width="35%" height="12px" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* Report skeleton */
export function ReportSkeleton() {
  return (
    <div className="max-w-800 mx-auto space-y-6 p-6">
      <div className="text-center space-y-2">
        <ShimmerLine width="250px" height="24px" />
        <ShimmerLine width="150px" height="10px" />
      </div>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-card border border-border-light rounded-xl p-5 space-y-3">
          <ShimmerLine width="150px" height="14px" />
          <ShimmerLine width="100%" height="10px" />
          <ShimmerLine width="80%" height="10px" />
        </div>
      ))}
    </div>
  );
}

/* Full page loading state */
export function PageLoadingSkeleton() {
  return (
    <div className="animate-fade-in py-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4">
          <ProfileSidebarSkeleton />
        </div>
        <div className="lg:col-span-8 space-y-8">
          <AreaRecommendationsSkeleton />
          <ListingGridSkeleton />
        </div>
      </div>
    </div>
  );
}
