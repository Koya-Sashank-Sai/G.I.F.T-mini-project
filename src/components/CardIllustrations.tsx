import React from 'react';

// Crisp, high-end vector illustration of modern white EV for recommendation card
export const EvCarIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-36' }) => (
  <div className={`relative flex items-center justify-center bg-gradient-to-b from-[#EFF3EF] to-[#E2EAE3] rounded-xl overflow-hidden ${className}`}>
    <svg viewBox="0 0 320 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-56 h-auto drop-shadow-md">
      <defs>
        <linearGradient id="carBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="60%" stopColor="#F1F4F2" />
          <stop offset="100%" stopColor="#D4DDD6" />
        </linearGradient>
        <linearGradient id="windshield" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2A3831" />
          <stop offset="100%" stopColor="#1B2620" />
        </linearGradient>
      </defs>
      {/* Shadow */}
      <ellipse cx="160" cy="142" rx="120" ry="10" fill="#000000" fillOpacity="0.12" />
      {/* Car Base Chassis */}
      <path d="M40 120 C40 110 50 100 70 98 L110 96 C130 75 160 55 210 55 L250 68 C270 78 285 95 290 115 L285 125 C285 130 280 133 270 133 L55 133 C45 133 40 128 40 120 Z" fill="url(#carBody)" stroke="#9CB0A2" strokeWidth="1" />
      {/* Cabin & Roof */}
      <path d="M115 94 L150 62 L225 62 L258 94 Z" fill="url(#windshield)" />
      {/* Side Windows separator */}
      <line x1="185" y1="63" x2="185" y2="94" stroke="#D4DDD6" strokeWidth="3" />
      {/* Aerodynamic side contour */}
      <path d="M75 105 Q160 110 270 106" stroke="#90A697" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* Front Bumper & Green Accent */}
      <path d="M265 110 L286 112" stroke="#254D3A" strokeWidth="3.5" strokeLinecap="round" />
      {/* Headlight */}
      <path d="M260 96 L284 99 C284 103 278 105 264 103 Z" fill="#75C28F" opacity="0.9" />
      {/* Rear wheel */}
      <circle cx="90" cy="128" r="22" fill="#202A24" stroke="#687A6E" strokeWidth="3" />
      <circle cx="90" cy="128" r="10" fill="#EAEFEA" />
      {/* Front wheel */}
      <circle cx="235" cy="128" r="22" fill="#202A24" stroke="#687A6E" strokeWidth="3" />
      <circle cx="235" cy="128" r="10" fill="#EAEFEA" />
    </svg>
  </div>
);

// Crisp vector illustration of modern eco-home with solar panels
export const EcoHomeIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-36' }) => (
  <div className={`relative flex items-center justify-center bg-gradient-to-b from-[#EFF3EF] to-[#E2EAE3] rounded-xl overflow-hidden ${className}`}>
    <svg viewBox="0 0 320 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-56 h-auto drop-shadow-md">
      <defs>
        <linearGradient id="roofGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#37483E" />
          <stop offset="100%" stopColor="#1E2B23" />
        </linearGradient>
        <linearGradient id="wallGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#ECECE8" />
        </linearGradient>
      </defs>
      {/* Shadow */}
      <ellipse cx="160" cy="145" rx="130" ry="8" fill="#000000" fillOpacity="0.1" />
      {/* Background Trees */}
      <circle cx="75" cy="90" r="28" fill="#588566" opacity="0.8" />
      <circle cx="245" cy="95" r="24" fill="#6B9678" opacity="0.8" />
      <rect x="72" y="105" width="6" height="35" fill="#433527" />
      <rect x="243" y="110" width="5" height="30" fill="#433527" />
      {/* House Body */}
      <rect x="100" y="75" width="120" height="65" rx="2" fill="url(#wallGrad)" stroke="#B0BEB3" strokeWidth="1" />
      {/* Main Gabled Roof */}
      <polygon points="85,78 160,25 235,78" fill="url(#roofGrad)" />
      {/* Rooftop Solar Panels */}
      <polygon points="120,68 155,38 190,68" fill="#205072" stroke="#48789C" strokeWidth="1" />
      <line x1="155" y1="38" x2="155" y2="68" stroke="#7CB9E8" strokeWidth="1" />
      <line x1="135" y1="55" x2="175" y2="55" stroke="#7CB9E8" strokeWidth="1" />
      {/* Large Eco Windows */}
      <rect x="115" y="85" width="35" height="40" rx="1" fill="#71A186" opacity="0.4" stroke="#254D3A" strokeWidth="1.5" />
      <line x1="132" y1="85" x2="132" y2="125" stroke="#254D3A" strokeWidth="1" />
      {/* Wooden Front Door */}
      <rect x="165" y="95" width="22" height="45" fill="#8B6F52" stroke="#5E4733" strokeWidth="1" />
      <circle cx="170" cy="118" r="1.5" fill="#E6D3B3" />
      {/* Small Garden shrub */}
      <circle cx="102" cy="138" r="8" fill="#3E6B4B" />
      <circle cx="112" cy="139" r="6" fill="#538161" />
      <circle cx="205" cy="138" r="7" fill="#3E6B4B" />
    </svg>
  </div>
);

// Crisp vector illustration of high efficiency solar panel array
export const SolarPanelIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-36' }) => (
  <div className={`relative flex items-center justify-center bg-gradient-to-b from-[#EFF3EF] to-[#E2EAE3] rounded-xl overflow-hidden ${className}`}>
    <svg viewBox="0 0 320 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-56 h-auto drop-shadow-md">
      <defs>
        <linearGradient id="solarBlue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1E4B7A" />
          <stop offset="50%" stopColor="#103154" />
          <stop offset="100%" stopColor="#0B1F36" />
        </linearGradient>
      </defs>
      {/* Ground & Mount */}
      <ellipse cx="160" cy="144" rx="120" ry="8" fill="#000000" fillOpacity="0.1" />
      <rect x="110" y="105" width="8" height="35" fill="#697D8A" />
      <rect x="202" y="105" width="8" height="35" fill="#697D8A" />
      {/* Panel 3D Perspective Box */}
      <polygon points="60,115 110,40 260,40 210,115" fill="url(#solarBlue)" stroke="#8FA8BC" strokeWidth="2" />
      {/* Grid Lines - Longitudinal */}
      <line x1="110" y1="115" x2="148" y2="40" stroke="#7BA9CC" strokeWidth="1.2" opacity="0.8" />
      <line x1="160" y1="115" x2="185" y2="40" stroke="#7BA9CC" strokeWidth="1.2" opacity="0.8" />
      <line x1="210" y1="115" x2="223" y2="40" stroke="#7BA9CC" strokeWidth="1.2" opacity="0.8" />
      {/* Grid Lines - Latitudinal */}
      <line x1="77" y1="90" x2="227" y2="90" stroke="#7BA9CC" strokeWidth="1.2" opacity="0.8" />
      <line x1="93" y1="65" x2="243" y2="65" stroke="#7BA9CC" strokeWidth="1.2" opacity="0.8" />
      {/* Sun glow in corner */}
      <circle cx="270" cy="28" r="16" fill="#F4BA42" opacity="0.85" />
      <circle cx="270" cy="28" r="26" fill="#FCE5A4" opacity="0.3" />
    </svg>
  </div>
);
