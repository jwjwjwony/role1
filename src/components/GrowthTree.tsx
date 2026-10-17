import React from 'react';
import { GrowthStageId } from '../types/growth';

interface GrowthTreeProps {
  stageId: GrowthStageId;
  points: number;
  studentName: string;
}

export const GrowthTree: React.FC<GrowthTreeProps> = ({ stageId, points, studentName }) => {
  return (
    <div className="relative w-full aspect-[4/3] max-h-[380px] flex items-center justify-center select-none overflow-hidden rounded-3xl bg-gradient-to-b from-pink-100/70 via-rose-50/40 to-pink-50/60 p-4 border border-pink-200 shadow-inner">
      {/* Sun & Clouds backdrop (Pink/Warm theme) */}
      <div className="absolute top-4 right-6 w-14 h-14 rounded-full bg-pink-200/60 blur-[1px] flex items-center justify-center animate-gentle-bounce">
        <div className="w-10 h-10 rounded-full bg-pink-300 shadow-[0_0_20px_rgba(244,114,182,0.5)]" />
      </div>

      <div className="absolute top-6 left-8 flex items-center gap-1 opacity-70">
        <div className="w-8 h-4 rounded-full bg-white shadow-sm" />
        <div className="w-12 h-6 rounded-full bg-white -ml-4 shadow-sm" />
        <div className="w-7 h-4 rounded-full bg-white -ml-3 shadow-sm" />
      </div>

      {/* Floating Gentle Elements (Petals) */}
      {(stageId === 'flowering_tree' || stageId === 'tree') && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-10 left-1/4 w-3.5 h-3.5 bg-pink-300 rounded-full rounded-tr-none rotate-45 opacity-80 animate-gentle-bounce" />
          <div className="absolute top-20 right-1/4 w-4 h-4 bg-rose-300 rounded-full rounded-bl-none rotate-12 opacity-80 animate-gentle-bounce" style={{ animationDelay: '1s' }} />
          <div className="absolute top-28 left-1/3 w-3 h-3 bg-pink-200 rounded-full rounded-br-none -rotate-12 opacity-90 animate-gentle-bounce" style={{ animationDelay: '2s' }} />
        </div>
      )}

      {/* Main SVG Growth Tree Canvas */}
      <svg
        viewBox="0 0 400 320"
        className="w-full h-full max-w-[420px] transition-all duration-700 ease-in-out"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Ground Gradients (Soft Pink & Minty Meadow) */}
          <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FBCFE8" />
            <stop offset="50%" stopColor="#F472B6" />
            <stop offset="100%" stopColor="#DB2777" />
          </linearGradient>

          <linearGradient id="trunkGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#835858" />
            <stop offset="50%" stopColor="#A27B7B" />
            <stop offset="100%" stopColor="#6C4545" />
          </linearGradient>

          <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.12" />
          </filter>
        </defs>

        {/* 1. Ground & Grass Hills in Soft Pink & Meadow Tones */}
        <ellipse cx="200" cy="300" rx="180" ry="36" fill="#FCE7F3" />
        <ellipse cx="200" cy="298" rx="150" ry="22" fill="#FDF2F8" opacity="0.8" />

        {/* Little Wild Flowers on Ground */}
        <circle cx="110" cy="292" r="4" fill="#F472B6" />
        <circle cx="106" cy="292" r="2.5" fill="#FDA4AF" />
        <circle cx="114" cy="292" r="2.5" fill="#FDA4AF" />
        <circle cx="110" cy="288" r="2.5" fill="#FDA4AF" />
        <circle cx="110" cy="296" r="2.5" fill="#FDA4AF" />

        <circle cx="290" cy="294" r="3.5" fill="#F472B6" />
        <circle cx="287" cy="294" r="2" fill="#FBCFE8" />
        <circle cx="293" cy="294" r="2" fill="#FBCFE8" />
        <circle cx="290" cy="291" r="2" fill="#FBCFE8" />

        {/* ================= STAGE 1: 새싹 (0-9P) ================= */}
        {stageId === 'sprout' && (
          <g className="animate-gentle-sway" style={{ transformOrigin: '200px 290px' }}>
            {/* Seed Mound */}
            <ellipse cx="200" cy="290" rx="22" ry="7" fill="#835858" />
            <ellipse cx="200" cy="288" rx="16" ry="5" fill="#A27B7B" />

            {/* Sprout Stem */}
            <path
              d="M 200 288 Q 198 250 199 220"
              stroke="#F472B6"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
            />

            {/* Left Leaf (Pinkish Green) */}
            <path
              d="M 198 235 C 170 235 155 210 162 195 C 180 195 195 215 198 235 Z"
              fill="#F472B6"
              stroke="#EC4899"
              strokeWidth="1.5"
              filter="url(#softShadow)"
            />
            <path d="M 196 230 Q 182 218 168 202" stroke="#DB2777" strokeWidth="1.5" strokeLinecap="round" />

            {/* Right Leaf */}
            <path
              d="M 200 225 C 228 225 242 200 234 185 C 218 185 204 205 200 225 Z"
              fill="#FBCFE8"
              stroke="#EC4899"
              strokeWidth="1.5"
              filter="url(#softShadow)"
            />
            <path d="M 202 220 Q 216 208 230 192" stroke="#DB2777" strokeWidth="1.5" strokeLinecap="round" />

            {/* Dewdrop on leaf */}
            <circle cx="172" cy="198" r="3.5" fill="#FFF1F2" opacity="0.9" />
            <circle cx="171" cy="197" r="1.2" fill="#FFFFFF" />

            {/* Cute Little Face on Sprout Stem */}
            <circle cx="194" cy="245" r="2" fill="#831843" />
            <circle cx="204" cy="245" r="2" fill="#831843" />
            <ellipse cx="199" cy="251" rx="2.5" ry="1.5" fill="#FB7185" />
          </g>
        )}

        {/* ================= STAGE 2: 어린 나무 (10-24P) ================= */}
        {stageId === 'sapling' && (
          <g className="animate-gentle-sway" style={{ transformOrigin: '200px 290px' }}>
            {/* Trunk */}
            <path
              d="M 193 290 Q 192 230 195 180 L 205 180 Q 208 230 207 290 Z"
              fill="url(#trunkGrad)"
              filter="url(#softShadow)"
            />

            {/* Left Branch */}
            <path
              d="M 195 230 Q 170 215 155 195"
              stroke="#6C4545"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Right Branch */}
            <path
              d="M 204 210 Q 230 195 245 180"
              stroke="#6C4545"
              strokeWidth="4.5"
              strokeLinecap="round"
              fill="none"
            />

            {/* Leaf Cluster 1 (Left Branch - Pink Blossom) */}
            <ellipse cx="145" cy="190" rx="26" ry="18" fill="#F472B6" filter="url(#softShadow)" />
            <ellipse cx="152" cy="180" rx="20" ry="15" fill="#FBCFE8" />

            {/* Leaf Cluster 2 (Right Branch) */}
            <ellipse cx="255" cy="175" rx="24" ry="16" fill="#FB7185" filter="url(#softShadow)" />
            <ellipse cx="248" cy="168" rx="18" ry="14" fill="#FDA4AF" />

            {/* Top Leaf Canopy Cluster */}
            <ellipse cx="200" cy="160" rx="38" ry="32" fill="#EC4899" filter="url(#softShadow)" />
            <ellipse cx="190" cy="148" rx="30" ry="24" fill="#F472B6" />
            <ellipse cx="212" cy="152" rx="28" ry="22" fill="#FBCFE8" />

            {/* Cute Pink Butterfly fluttering */}
            <g transform="translate(255, 120)">
              <ellipse cx="0" cy="0" rx="5" ry="3" fill="#FB7185" />
              <ellipse cx="-4" cy="-4" rx="5" ry="4" fill="#FDA4AF" transform="rotate(-30)" />
              <ellipse cx="4" cy="-4" rx="5" ry="4" fill="#FDA4AF" transform="rotate(30)" />
            </g>
          </g>
        )}

        {/* ================= STAGE 3: 큰 나무 (25-49P) ================= */}
        {stageId === 'tree' && (
          <g className="animate-gentle-sway" style={{ transformOrigin: '200px 290px' }}>
            {/* Sturdy Trunk & Roots */}
            <path
              d="M 184 290 Q 186 200 190 150 L 210 150 Q 214 200 216 290 Q 230 294 235 298 L 220 298 Q 200 292 180 298 L 165 298 Q 170 294 184 290 Z"
              fill="url(#trunkGrad)"
              filter="url(#softShadow)"
            />

            {/* Bark Texture */}
            <path d="M 196 260 Q 198 230 195 210" stroke="#523232" strokeWidth="2" strokeLinecap="round" />
            <path d="M 204 270 Q 202 245 205 225" stroke="#523232" strokeWidth="2" strokeLinecap="round" />

            {/* Layered Pink Sakura Canopy */}
            <circle cx="150" cy="165" r="46" fill="#DB2777" filter="url(#softShadow)" />
            <circle cx="250" cy="165" r="46" fill="#DB2777" filter="url(#softShadow)" />
            <circle cx="200" cy="115" r="54" fill="#EC4899" filter="url(#softShadow)" />

            <circle cx="160" cy="140" r="44" fill="#F472B6" />
            <circle cx="240" cy="140" r="44" fill="#F472B6" />
            <circle cx="200" cy="125" r="48" fill="#FBCFE8" />

            <circle cx="175" cy="115" r="34" fill="#FDF2F8" opacity="0.9" />
            <circle cx="225" cy="115" r="32" fill="#FDF2F8" opacity="0.9" />
            <circle cx="200" cy="95" r="32" fill="#FFFFFF" opacity="0.85" />

            {/* Cute Little Bird resting on branch */}
            <g transform="translate(245, 160)">
              <ellipse cx="0" cy="0" rx="8" ry="6" fill="#F43F5E" />
              <ellipse cx="-4" cy="1" rx="4" ry="4" fill="#FDA4AF" />
              <circle cx="5" cy="-3" r="4" fill="#E11D48" />
              <polygon points="9,-3 13,-2 9,-1" fill="#FBBF24" />
              <circle cx="6" cy="-4" r="1" fill="#FFFFFF" />
            </g>
          </g>
        )}

        {/* ================= STAGE 4: 꽃나무 (50P+) ================= */}
        {stageId === 'flowering_tree' && (
          <g className="animate-gentle-sway" style={{ transformOrigin: '200px 290px' }}>
            {/* Majestic Trunk */}
            <path
              d="M 180 290 Q 185 190 190 140 L 210 140 Q 215 190 220 290 Q 236 295 242 298 L 225 298 Q 200 292 175 298 L 158 298 Q 165 294 180 290 Z"
              fill="url(#trunkGrad)"
              filter="url(#softShadow)"
            />

            {/* Spreading Branches */}
            <path d="M 190 160 Q 150 145 130 130" stroke="#6C4545" strokeWidth="6" strokeLinecap="round" />
            <path d="M 210 160 Q 250 145 270 130" stroke="#6C4545" strokeWidth="6" strokeLinecap="round" />

            {/* Base Canopy in Soft Rosy Pink */}
            <circle cx="140" cy="150" r="48" fill="#EC4899" filter="url(#softShadow)" />
            <circle cx="260" cy="150" r="48" fill="#EC4899" filter="url(#softShadow)" />
            <circle cx="200" cy="100" r="56" fill="#F472B6" filter="url(#softShadow)" />
            <circle cx="160" cy="120" r="46" fill="#FBCFE8" />
            <circle cx="240" cy="120" r="46" fill="#FBCFE8" />
            <circle cx="200" cy="85" r="44" fill="#FDF2F8" />

            {/* Abundant Pink Blossoms */}
            {[
              { x: 130, y: 125, size: 7.5 },
              { x: 155, y: 100, size: 8.5 },
              { x: 185, y: 70, size: 8.5 },
              { x: 215, y: 75, size: 8.5 },
              { x: 245, y: 105, size: 8 },
              { x: 270, y: 135, size: 7.5 },
              { x: 160, y: 155, size: 7 },
              { x: 235, y: 155, size: 7 },
              { x: 195, y: 125, size: 9 },
              { x: 175, y: 140, size: 7.5 },
              { x: 220, y: 135, size: 7.5 },
            ].map((flower, idx) => (
              <g key={`flower-${idx}`} transform={`translate(${flower.x}, ${flower.y})`}>
                {[0, 72, 144, 216, 288].map((angle, pIdx) => (
                  <ellipse
                    key={pIdx}
                    cx="0"
                    cy={-flower.size * 0.9}
                    rx={flower.size * 0.7}
                    ry={flower.size * 0.9}
                    fill="#FB7185"
                    opacity="0.95"
                    transform={`rotate(${angle})`}
                  />
                ))}
                <circle cx="0" cy="0" r={flower.size * 0.45} fill="#FEF08A" />
                <circle cx="0" cy="0" r={flower.size * 0.25} fill="#F43F5E" />
              </g>
            ))}

            {/* Golden Star Fruits */}
            {[
              { x: 140, y: 165 },
              { x: 200, y: 150 },
              { x: 260, y: 165 },
              { x: 180, y: 95 },
              { x: 220, y: 95 },
            ].map((star, idx) => (
              <g key={`star-${idx}`} transform={`translate(${star.x}, ${star.y}) scale(0.95)`}>
                <polygon
                  points="0,-8 2.5,-2.5 8,-2.5 4,1 6,7 0,3.5 -6,7 -4,1 -8,-2.5 -2.5,-2.5"
                  fill="#FBBF24"
                  stroke="#F59E0B"
                  strokeWidth="1"
                  filter="url(#softShadow)"
                  className="animate-pulse"
                />
              </g>
            ))}
          </g>
        )}
      </svg>

      {/* Stage Badge Chip Overlay */}
      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="bg-white/95 backdrop-blur-sm px-3.5 py-1.5 rounded-full shadow-sm border border-pink-200 flex items-center gap-1.5">
          <span className="text-xs font-semibold text-pink-900">
            {studentName}의 핑크빛 정원
          </span>
        </div>

        <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-pink-200 flex items-center gap-1">
          <span className="text-xs font-bold text-pink-600">
            누적 {points}P
          </span>
        </div>
      </div>
    </div>
  );
};
