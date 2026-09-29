/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';

interface BiophilicCityBackgroundProps {
  opacity?: number;
}

export default function BiophilicCityBackground({ opacity = 0.85 }: BiophilicCityBackgroundProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0 select-none transition-opacity duration-700"
      style={{ opacity }}
    >
      {/* Real Image Loader with Automatic Fallback to High-Fidelity Vector Scene */}
      {!imageError ? (
        <img
          src="/promt to pixel.jpeg"
          alt="Biophilic futuristic smart city with vertical green towers and transit infrastructure"
          className="absolute inset-0 w-full h-full object-cover object-center transform scale-100"
          onError={() => setImageError(true)}
        />
      ) : null}

      {/* High-Fidelity Full-Width Vector Scene of the Biophilic Vertical Forest City */}
      {imageError && (
        <svg
          className="absolute inset-0 w-full h-full object-cover"
          viewBox="0 0 1600 900"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Bright Azure Sky Gradient */}
            <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.95" />
              <stop offset="35%" stopColor="#7dd3fc" stopOpacity="0.88" />
              <stop offset="70%" stopColor="#bae6fd" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#e0f2fe" stopOpacity="0.6" />
            </linearGradient>

            {/* Sunlight Dispersion Flare */}
            <radialGradient id="sunFlare" cx="55%" cy="12%" r="55%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.75" />
              <stop offset="25%" stopColor="#fed7aa" stopOpacity="0.4" />
              <stop offset="60%" stopColor="#bae6fd" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
            </radialGradient>

            {/* Modern Glass Tower Gradient */}
            <linearGradient id="glassTowerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0f172a" stopOpacity="0.85" />
              <stop offset="25%" stopColor="#38bdf8" stopOpacity="0.4" />
              <stop offset="65%" stopColor="#67e8f9" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="0.65" />
            </linearGradient>

            {/* Lush Vertical Garden Foliage Gradients */}
            <linearGradient id="foliageDense" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4ade80" />
              <stop offset="45%" stopColor="#22c55e" />
              <stop offset="85%" stopColor="#15803d" />
              <stop offset="100%" stopColor="#14532d" />
            </linearGradient>

            <linearGradient id="foliageBright" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#86efac" />
              <stop offset="50%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#166534" />
            </linearGradient>

            {/* High-Speed Aerodynamic Bullet Train Gradient */}
            <linearGradient id="trainBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="30%" stopColor="#cbd5e1" />
              <stop offset="65%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#065f46" />
            </linearGradient>

            {/* Concrete Trench & Retaining Walls */}
            <linearGradient id="concreteTrench" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#64748b" />
              <stop offset="50%" stopColor="#475569" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>
          </defs>

          {/* Sky & Radiant Sunlight */}
          <rect width="1600" height="900" fill="url(#skyGrad)" />
          <rect width="1600" height="900" fill="url(#sunFlare)" />

          {/* Fluffy Summer Clouds */}
          <g opacity="0.45" fill="#ffffff">
            <path d="M 250 140 Q 320 90 400 120 Q 480 100 550 150 Q 580 190 500 210 Q 350 220 230 190 Z" />
            <path d="M 850 100 Q 940 60 1040 90 Q 1140 70 1220 120 Q 1260 170 1170 190 Q 1020 200 870 170 Z" />
            <path d="M 600 80 Q 660 50 720 80 Q 780 65 830 100 Q 820 135 740 140 Q 640 140 590 110 Z" />
          </g>

          {/* Distant Background City Skyline */}
          <g opacity="0.6">
            <rect x="580" y="240" width="85" height="420" fill="#94a3b8" rx="4" />
            <rect x="680" y="200" width="95" height="460" fill="#cbd5e1" rx="4" />
            <rect x="790" y="260" width="75" height="400" fill="#94a3b8" rx="4" />
            <rect x="880" y="220" width="90" height="440" fill="#cbd5e1" rx="4" />
            <rect x="480" y="280" width="80" height="380" fill="#64748b" rx="4" />
          </g>

          {/* LEFT FLANK: Vertical Forest Tower 1 (Far Left Cascading Complex) */}
          <g>
            <rect x="30" y="40" width="220" height="740" fill="url(#glassTowerGrad)" rx="8" />
            {Array.from({ length: 18 }).map((_, i) => (
              <g key={`lt1-${i}`}>
                <line x1="30" y1={70 + i * 38} x2="250" y2={70 + i * 38} stroke="#bae6fd" strokeWidth="2" strokeOpacity="0.4" />
                <rect x="20" y={75 + i * 38} width="240" height="8" fill="#e2e8f0" rx="3" />
                <path
                  d={`M ${25} ${83 + i * 38} Q ${80} ${108 + i * 38} ${140} ${85 + i * 38} Q ${195} ${110 + i * 38} ${255} ${84 + i * 38} Z`}
                  fill="url(#foliageDense)"
                />
              </g>
            ))}
          </g>

          {/* LEFT-MID FLANK: Vertical Forest Tower 2 (Bosco Highrise) */}
          <g>
            <rect x="270" y="90" width="180" height="690" fill="url(#glassTowerGrad)" rx="8" />
            {Array.from({ length: 17 }).map((_, i) => (
              <g key={`lt2-${i}`}>
                <line x1="270" y1={120 + i * 36} x2="450" y2={120 + i * 36} stroke="#bae6fd" strokeWidth="1.8" strokeOpacity="0.45" />
                <rect x="260" y={125 + i * 36} width="200" height="7" fill="#f8fafc" rx="2" />
                <path
                  d={`M ${265} ${132 + i * 36} Q ${310} ${152 + i * 36} ${360} ${134 + i * 36} Q ${410} ${154 + i * 36} ${455} ${132 + i * 36} Z`}
                  fill="url(#foliageBright)"
                />
              </g>
            ))}
          </g>

          {/* RIGHT-MID FLANK: Vertical Forest Tower 3 (Prominent Center-Right) */}
          <g>
            <rect x="980" y="80" width="190" height="700" fill="url(#glassTowerGrad)" rx="8" />
            {Array.from({ length: 17 }).map((_, i) => (
              <g key={`rt3-${i}`}>
                <line x1="980" y1={110 + i * 36} x2="1170" y2={110 + i * 36} stroke="#bae6fd" strokeWidth="1.8" strokeOpacity="0.45" />
                <rect x="970" y={115 + i * 36} width="210" height="7" fill="#f8fafc" rx="2" />
                <path
                  d={`M ${975} ${122 + i * 36} Q ${1030} ${142 + i * 36} ${1080} ${124 + i * 36} Q ${1130} ${144 + i * 36} ${1175} ${122 + i * 36} Z`}
                  fill="url(#foliageDense)"
                />
              </g>
            ))}
          </g>

          {/* FAR RIGHT FLANK: Vertical Forest Tower 4 (Massive Right Wing) */}
          <g>
            <rect x="1200" y="30" width="370" height="750" fill="url(#glassTowerGrad)" rx="8" />
            {Array.from({ length: 20 }).map((_, i) => (
              <g key={`rt4-${i}`}>
                <line x1="1200" y1={60 + i * 35} x2="1570" y2={60 + i * 35} stroke="#bae6fd" strokeWidth="2" strokeOpacity="0.4" />
                <rect x="1190" y={65 + i * 35} width="390" height="8" fill="#e2e8f0" rx="3" />
                <path
                  d={`M ${1195} ${73 + i * 35} Q ${1280} ${96 + i * 35} ${1380} ${75 + i * 35} Q ${1480} ${98 + i * 35} ${1575} ${74 + i * 35} Z`}
                  fill="url(#foliageBright)"
                />
              </g>
            ))}
          </g>

          {/* STREET & PLAZA LEVEL: Elevated Boulevard & Tree Canopy */}
          <g>
            {/* Street Platform Slab */}
            <rect x="0" y="580" width="1600" height="60" fill="url(#concreteTrench)" />
            
            {/* Lush Street Trees Across the Horizon */}
            {Array.from({ length: 24 }).map((_, i) => (
              <circle
                key={`st-tree-${i}`}
                cx={60 + i * 66}
                cy={580 + (i % 3) * 3}
                r={16 + (i % 3) * 4}
                fill="#15803d"
                opacity="0.95"
              />
            ))}

            {/* Elevated Modern Light-Rail Tram on Upper Deck */}
            <g transform="translate(680, 550)">
              <rect x="0" y="0" width="130" height="30" rx="6" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
              <rect x="6" y="6" width="24" height="15" rx="3" fill="#0284c7" opacity="0.85" />
              <rect x="36" y="6" width="24" height="15" rx="3" fill="#0284c7" opacity="0.85" />
              <rect x="66" y="6" width="24" height="15" rx="3" fill="#0284c7" opacity="0.85" />
              <rect x="96" y="6" width="24" height="15" rx="3" fill="#0284c7" opacity="0.85" />
              <line x1="0" y1="24" x2="130" y2="24" stroke="#10b981" strokeWidth="4" />
            </g>
          </g>

          {/* PEDESTRIAN BRIDGE OVERPASS */}
          <g>
            <rect x="580" y="620" width="360" height="30" fill="#e2e8f0" rx="4" />
            <line x1="580" y1="620" x2="940" y2="620" stroke="#94a3b8" strokeWidth="3" />
            {/* Glass Protective Railings */}
            <rect x="585" y="605" width="350" height="15" fill="#38bdf8" opacity="0.4" rx="2" stroke="#e2e8f0" strokeWidth="1" />
            {/* Pedestrians silhouettes on bridge */}
            <circle cx="650" cy="597" r="4.5" fill="#1e293b" />
            <line x1="650" y1="601" x2="650" y2="612" stroke="#1e293b" strokeWidth="2.5" />
            <circle cx="780" cy="597" r="4.5" fill="#1e293b" />
            <line x1="780" y1="601" x2="780" y2="612" stroke="#1e293b" strokeWidth="2.5" />
            <circle cx="860" cy="597" r="4.5" fill="#1e293b" />
            <line x1="860" y1="601" x2="860" y2="612" stroke="#1e293b" strokeWidth="2.5" />
          </g>

          {/* LOWER TRANSIT CORRIDOR / SUNKEN METRO TRENCH */}
          <g>
            {/* Dark Sunken Trench Channel */}
            <polygon points="360,650 1160,650 1340,900 180,900" fill="#0f172a" />
            {/* Retaining Side Walls */}
            <polygon points="180,900 360,650 440,650 280,900" fill="#334155" />
            <polygon points="1160,650 1340,900 1240,900 1080,650" fill="#334155" />

            {/* Concrete Station Platform Edges with Yellow Tactile Warning Lines */}
            <polygon points="390,680 430,680 320,900 270,900" fill="#475569" />
            <polygon points="1090,680 1130,680 1230,900 1180,900" fill="#475569" />
            <line x1="428" y1="680" x2="318" y2="900" stroke="#eab308" strokeWidth="5" strokeDasharray="12 8" />
            <line x1="1092" y1="680" x2="1192" y2="900" stroke="#eab308" strokeWidth="5" strokeDasharray="12 8" />

            {/* High-Speed Bullet Train Inbound (Center of photo) */}
            <g transform="translate(610, 670)">
              {/* Sleek Aerodynamic Train Nose */}
              <path
                d="M 60 210 L 25 90 Q 30 15 105 5 Q 180 15 185 90 L 150 210 Z"
                fill="url(#trainBodyGrad)"
              />
              {/* Wraparound Cockpit Windshield */}
              <path
                d="M 45 75 Q 105 28 165 75 L 155 120 Q 105 95 55 120 Z"
                fill="#0369a1"
                stroke="#38bdf8"
                strokeWidth="2.5"
              />
              {/* High-Luminosity LED Twin Headlights */}
              <circle cx="55" cy="155" r="9" fill="#fef08a" filter="drop-shadow(0 0 10px #fef08a)" />
              <circle cx="155" cy="155" r="9" fill="#fef08a" filter="drop-shadow(0 0 10px #fef08a)" />
              {/* High-Tech Destination Sign */}
              <rect x="75" y="50" width="60" height="15" fill="#0f172a" rx="3" />
              <text x="105" y="61" fill="#4ade80" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                NEXUS-01
              </text>
            </g>

            {/* Outbound Train Moving Away */}
            <g transform="translate(830, 660)">
              <polygon points="10,70 160,60 200,230 45,240" fill="#94a3b8" opacity="0.85" />
              <polygon points="10,70 160,60 170,90 15,100" fill="#10b981" />
              <polygon points="25,110 160,100 165,150 30,160" fill="#0284c7" opacity="0.75" />
            </g>
          </g>
        </svg>
      )}

      {/* Uniform Atmospheric Scrim across the Whole Uppermost Area for Text & Centerpiece Legibility */}
      <div className="absolute inset-0 bg-[#070B14]/55 dark:bg-[#070B14]/65 light:bg-[#F8FAFC]/60 backdrop-blur-[0.5px] z-10 pointer-events-none" />

      {/* Seamless Bottom Fade: Smoothly dissolves the image strictly at the bottom of the Hero section into the base background */}
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[var(--bg-base)] via-[var(--bg-base)]/90 to-transparent z-10 pointer-events-none" />

      {/* Top Navbar Vignette: Soft gradient under sticky navbar */}
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[var(--bg-base)]/80 to-transparent z-10 pointer-events-none" />

      {/* Subtle Ambient Cybernetic Dot Grid */}
      <div
        className="absolute inset-0 opacity-[0.08] z-10 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(34, 211, 238, 0.4) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />
    </div>
  );
}
