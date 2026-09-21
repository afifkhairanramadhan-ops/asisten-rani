import React from "react";

interface KemenagLogoProps {
  customLogoUrl?: string | null;
  className?: string;
  size?: number;
}

/**
 * Official Kementerian Agama Republic of Indonesia Logo
 * Features:
 * - Green Pentagon (Perisai Segi Lima)
 * - Yellow Golden Border
 * - 5-Point Golden Star (Ketuhanan Yang Maha Esa)
 * - 17 White Cotton Flowers (Kiri) & 45 Golden Rice Grains (Kanan)
 * - Open Holy Book / Al-Qur'an & Kitab Suci on White-Black Rehal
 * - White Ribbon Banner with "IKHLAS BERAMAL"
 */
export const KemenagOfficialSvg: React.FC<{ size?: number; className?: string }> = ({
  size = 64,
  className = ""
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 400 400"
      width={size}
      height={size}
      className={`shrink-0 ${className}`}
      aria-label="Logo Resmi Kementerian Agama RI - Ikhlas Beramal"
    >
      <defs>
        {/* Shadow & Gradients */}
        <filter id="kemenag-shadow" x="-5%" y="-5%" width="110%" height="110%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.25" />
        </filter>
        <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="50%" stopColor="#EAB308" />
          <stop offset="100%" stopColor="#CA8A04" />
        </linearGradient>
      </defs>

      {/* Outer Golden Border Pentagon */}
      <polygon
        points="200,18 382,150 312,382 88,382 18,150"
        fill="#FACC15"
        stroke="#CA8A04"
        strokeWidth="3"
        filter="url(#kemenag-shadow)"
      />

      {/* Inner Green Pentagon */}
      <polygon
        points="200,38 362,156 300,364 100,364 38,156"
        fill="#047857"
        stroke="#065F46"
        strokeWidth="2"
      />

      {/* Golden Star at Top Center */}
      <polygon
        points="200,68 207,90 230,90 211,104 218,126 200,112 182,126 189,104 170,90 193,90"
        fill="url(#gold-grad)"
        stroke="#A16207"
        strokeWidth="1"
      />

      {/* Left: Kapas (Cotton Stalk & Flowers - White with Green Sepals) */}
      <g stroke="#ffffff" strokeWidth="2">
        {/* Main stem */}
        <path
          d="M 190,300 C 130,270 100,200 120,130"
          fill="none"
          stroke="#A7F3D0"
          strokeWidth="4"
          strokeLinecap="round"
        />
        {/* Cotton Buds */}
        {[
          { cx: 125, cy: 135, r: 8 },
          { cx: 110, cy: 155, r: 9 },
          { cx: 135, cy: 165, r: 8 },
          { cx: 102, cy: 185, r: 10 },
          { cx: 125, cy: 198, r: 9 },
          { cx: 98, cy: 220, r: 10 },
          { cx: 122, cy: 232, r: 9 },
          { cx: 105, cy: 255, r: 10 },
          { cx: 130, cy: 265, r: 9 },
          { cx: 118, cy: 290, r: 9 },
          { cx: 145, cy: 295, r: 9 },
          { cx: 168, cy: 305, r: 8 }
        ].map((bud, i) => (
          <g key={`cotton-${i}`}>
            <circle cx={bud.cx} cy={bud.cy} r={bud.r} fill="#ffffff" stroke="#E2E8F0" strokeWidth="1" />
            <circle cx={bud.cx - 2} cy={bud.cy - 2} r={bud.r * 0.4} fill="#F8FAFC" />
          </g>
        ))}
      </g>

      {/* Right: Padi (Golden Rice Grains) */}
      <g>
        {/* Main rice stem */}
        <path
          d="M 210,300 C 270,270 300,200 280,130"
          fill="none"
          stroke="#CA8A04"
          strokeWidth="4"
          strokeLinecap="round"
        />
        {/* Rice grains */}
        {[
          { x: 275, y: 135, angle: 30 },
          { x: 290, y: 155, angle: 40 },
          { x: 265, y: 165, angle: 20 },
          { x: 298, y: 185, angle: 45 },
          { x: 275, y: 198, angle: 25 },
          { x: 300, y: 220, angle: 50 },
          { x: 278, y: 232, angle: 30 },
          { x: 295, y: 255, angle: 55 },
          { x: 270, y: 265, angle: 35 },
          { x: 280, y: 290, angle: 60 },
          { x: 255, y: 295, angle: 40 },
          { x: 230, y: 305, angle: 45 }
        ].map((g, i) => (
          <ellipse
            key={`rice-${i}`}
            cx={g.x}
            cy={g.y}
            rx="11"
            ry="6"
            transform={`rotate(${g.angle} ${g.x} ${g.y})`}
            fill="url(#gold-grad)"
            stroke="#854D0E"
            strokeWidth="1"
          />
        ))}
      </g>

      {/* Rehal (Alas Kitab Suci - Crossed Stand) */}
      <g>
        {/* Back legs */}
        <polygon points="170,230 230,285 210,295 150,240" fill="#1E293B" stroke="#0F172A" strokeWidth="1" />
        <polygon points="230,230 170,285 190,295 250,240" fill="#1E293B" stroke="#0F172A" strokeWidth="1" />
        {/* White front border */}
        <line x1="165" y1="235" x2="235" y2="290" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
        <line x1="235" y1="235" x2="165" y2="290" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
      </g>

      {/* Open Holy Book / Kitab Suci Al-Qur'an (Gold & White Pages) */}
      <g filter="url(#kemenag-shadow)">
        {/* Book Covers */}
        <polygon points="200,242 145,225 150,185 200,200" fill="#B45309" stroke="#78350F" strokeWidth="1" />
        <polygon points="200,242 255,225 250,185 200,200" fill="#B45309" stroke="#78350F" strokeWidth="1" />

        {/* Left Page (Golden gradient) */}
        <polygon points="200,200 152,185 150,225 200,238" fill="url(#gold-grad)" stroke="#CA8A04" strokeWidth="1" />
        {/* Right Page */}
        <polygon points="200,200 248,185 250,225 200,238" fill="url(#gold-grad)" stroke="#CA8A04" strokeWidth="1" />

        {/* Page text lines representation */}
        <line x1="162" y1="198" x2="190" y2="206" stroke="#92400E" strokeWidth="1.5" strokeDasharray="3 2" />
        <line x1="162" y1="208" x2="190" y2="216" stroke="#92400E" strokeWidth="1.5" strokeDasharray="3 2" />
        <line x1="162" y1="218" x2="190" y2="226" stroke="#92400E" strokeWidth="1.5" strokeDasharray="3 2" />

        <line x1="210" y1="206" x2="238" y2="198" stroke="#92400E" strokeWidth="1.5" strokeDasharray="3 2" />
        <line x1="210" y1="216" x2="238" y2="208" stroke="#92400E" strokeWidth="1.5" strokeDasharray="3 2" />
        <line x1="210" y1="226" x2="238" y2="218" stroke="#92400E" strokeWidth="1.5" strokeDasharray="3 2" />

        {/* Book spine line */}
        <line x1="200" y1="200" x2="200" y2="242" stroke="#78350F" strokeWidth="2" />
      </g>

      {/* Bottom Ribbon Banner (Pita Putih "IKHLAS BERAMAL") */}
      <g filter="url(#kemenag-shadow)">
        {/* Ribbon Fold Tails */}
        <polygon points="80,310 65,335 90,335" fill="#CBD5E1" stroke="#475569" strokeWidth="1" />
        <polygon points="320,310 335,335 310,335" fill="#CBD5E1" stroke="#475569" strokeWidth="1" />

        {/* Main Ribbon Body */}
        <path
          d="M 75,325 C 130,345 270,345 325,325 L 315,300 C 265,320 135,320 85,300 Z"
          fill="#FFFFFF"
          stroke="#334155"
          strokeWidth="2"
        />

        {/* Banner Text "IKHLAS BERAMAL" */}
        <path
          id="text-path-ribbon"
          d="M 85,322 C 140,338 260,338 315,322"
          fill="none"
        />
        <text
          fill="#0F172A"
          fontSize="17"
          fontWeight="900"
          fontFamily="Arial, Helvetica, sans-serif"
          letterSpacing="2.5"
        >
          <textPath href="#text-path-ribbon" startOffset="50%" textAnchor="middle">
            IKHLAS BERAMAL
          </textPath>
        </text>
      </g>
    </svg>
  );
};

export const KemenagLogo: React.FC<KemenagLogoProps> = ({
  customLogoUrl,
  className = "",
  size = 64,
}) => {
  if (customLogoUrl) {
    return (
      <img
        src={customLogoUrl}
        alt="Logo Kementerian Agama"
        style={{ width: size, height: size }}
        className={`object-contain shrink-0 ${className}`}
        crossOrigin="anonymous"
      />
    );
  }

  return <KemenagOfficialSvg size={size} className={className} />;
};
