import React from 'react';

export const LeafLogoIcon: React.FC<{ className?: string }> = ({ className = 'w-9 h-9' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Left Leaf */}
    <path
      d="M20 38C20 38 10 32 10 20C10 13 15 8 20 8C20 16 23 26 23 32"
      fill="#437759"
    />
    <path
      d="M20 8C20 18 16 28 10 33"
      stroke="#2D5A40"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    {/* Right Large Leaf */}
    <path
      d="M22 40C22 40 38 34 38 18C38 9 30 4 23 4C23 15 25 30 22 40Z"
      fill="#254D3A"
    />
    <path
      d="M23 4C23 18 30 28 36 32"
      stroke="#193B2B"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    {/* Stem */}
    <path
      d="M21 42C21 40 22 35 22 30"
      stroke="#193B2B"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

export const SidebarLeavesGraphic: React.FC = () => (
  <div className="relative w-full h-44 overflow-hidden pointer-events-none select-none opacity-90">
    <svg viewBox="0 0 240 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="leafGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7DA282" />
          <stop offset="60%" stopColor="#3C674E" />
          <stop offset="100%" stopColor="#1E3E2D" />
        </linearGradient>
        <linearGradient id="leafGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#254D3A" />
          <stop offset="100%" stopColor="#6C9572" />
        </linearGradient>
      </defs>
      {/* Lower Stem */}
      <path d="M-10 190 Q40 120 70 70 Q90 35 110 10" stroke="#375D46" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Leaf 1 (Left low) */}
      <path d="M15 150 C-10 130 5 100 40 115 C55 125 50 145 15 150 Z" fill="url(#leafGrad1)" />
      {/* Leaf 2 (Main curved) */}
      <path d="M45 120 C40 80 85 75 110 85 C105 110 80 125 45 120 Z" fill="url(#leafGrad2)" />
      {/* Leaf 3 (Graceful upright leaf) */}
      <path d="M70 70 C70 30 110 25 135 45 C125 75 95 80 70 70 Z" fill="url(#leafGrad1)" />
      {/* Leaf 4 (Top tender leaf) */}
      <path d="M95 30 C100 5 125 5 140 20 C135 38 115 42 95 30 Z" fill="url(#leafGrad2)" opacity="0.9" />
    </svg>
  </div>
);
