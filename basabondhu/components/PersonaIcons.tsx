/**
 * PersonaIcons — High-quality SVG icons for each persona type.
 * Replaces all emojis with crisp, scalable vector icons.
 */

import React from "react";

interface IconProps {
  className?: string;
}

/**
 * Couple — Two people side by side with a heart accent
 */
export function CoupleIcon({ className = "w-8 h-8" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="14" r="6" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <circle cx="32" cy="14" r="6" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <path d="M4 38c0-6.627 5.373-12 12-12h1" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M44 38c0-6.627-5.373-12-12-12h-1" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M24 24l-3.5 3.5c-1.5 1.5-1.5 4 0 5.5s4 1.5 5.5 0L24 31l-2 2c-1.5 1.5-1.5 4 0 5.5s4 1.5 5.5 0L24 35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
    </svg>
  );
}

/**
 * Student — Graduation cap
 */
export function StudentIcon({ className = "w-8 h-8" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 6L4 18l20 12 20-12L24 6z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" fill="none" />
      <path d="M36 24v12c0 0-5 6-12 6s-12-6-12-6V24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <line x1="44" y1="18" x2="44" y2="38" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="44" cy="40" r="2" fill="currentColor" />
    </svg>
  );
}

/**
 * Professional — Briefcase / laptop
 */
export function ProfessionalIcon({ className = "w-8 h-8" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="16" width="36" height="24" rx="3" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <path d="M16 16V12a4 4 0 014-4h8a4 4 0 014 4v4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M6 26h36" stroke="currentColor" strokeWidth="2.5" />
      <rect x="20" y="22" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  );
}

/**
 * Family — House with people
 */
export function FamilyIcon({ className = "w-8 h-8" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 22L24 6l18 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <rect x="10" y="22" width="28" height="20" rx="2" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <rect x="20" y="30" width="8" height="12" rx="1" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="17" cy="28" r="2" fill="currentColor" opacity="0.4" />
      <circle cx="31" cy="28" r="2" fill="currentColor" opacity="0.4" />
      <circle cx="24" cy="26" r="1.5" fill="currentColor" opacity="0.3" />
    </svg>
  );
}

/**
 * Executive — Shield with star (security-focused professional)
 */
export function ExecutiveIcon({ className = "w-8 h-8" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 4L8 12v12c0 10.5 6.8 20.3 16 24 9.2-3.7 16-13.5 16-24V12L24 4z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" fill="none" />
      <path d="M24 18l2.5 5 5.5.8-4 3.9.9 5.3-4.9-2.6L19.1 33l.9-5.3-4-3.9 5.5-.8L24 18z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

/**
 * Map from iconId string to component
 */
const ICON_MAP: Record<string, React.FC<IconProps>> = {
  couple: CoupleIcon,
  student: StudentIcon,
  professional: ProfessionalIcon,
  family: FamilyIcon,
  executive: ExecutiveIcon,
};

export function PersonaIcon({ iconId, className }: { iconId: string; className?: string }) {
  const Icon = ICON_MAP[iconId];
  if (!Icon) return null;
  return <Icon className={className} />;
}
