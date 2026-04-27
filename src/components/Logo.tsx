import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "w-32 h-32" }) => {
  return (
    <svg viewBox="0 0 400 400" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sunset" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ff4500" />
          <stop offset="50%" stopColor="#ff8c00" />
          <stop offset="100%" stopColor="#ffd700" />
        </linearGradient>
        <linearGradient id="road" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#2c3e50" />
          <stop offset="100%" stopColor="#1a252f" />
        </linearGradient>
      </defs>

      {/* Background Circle / Sun */}
      <circle cx="200" cy="200" r="180" fill="url(#sunset)" />

      {/* Mountains */}
      <path d="M 20 280 L 120 180 L 220 260 L 320 150 L 380 230 L 380 280 L 20 280 Z" fill="#800000" opacity="0.6"/>
      <path d="M 50 280 L 160 140 L 260 240 L 350 160 L 380 200 L 380 280 L 50 280 Z" fill="#4a0e0e" opacity="0.8"/>

      {/* Palm Trees */}
      <g stroke="#2a0800" strokeWidth="4" strokeLinecap="round">
        {/* Left Palm */}
        <path d="M 80 280 Q 70 200 90 140" fill="none" strokeWidth="6" />
        <path d="M 90 140 Q 60 160 50 180" fill="none" />
        <path d="M 90 140 Q 50 130 40 140" fill="none" />
        <path d="M 90 140 Q 70 100 80 80" fill="none" />
        <path d="M 90 140 Q 110 110 130 100" fill="none" />
        <path d="M 90 140 Q 130 140 140 160" fill="none" />

        {/* Right Palm */}
        <path d="M 320 280 Q 330 200 310 130" fill="none" strokeWidth="6" />
        <path d="M 310 130 Q 340 150 350 170" fill="none" />
        <path d="M 310 130 Q 350 120 360 130" fill="none" />
        <path d="M 310 130 Q 330 90 320 70" fill="none" />
        <path d="M 310 130 Q 290 100 270 90" fill="none" />
        <path d="M 310 130 Q 270 130 260 150" fill="none" />
      </g>

      {/* Road */}
      <path d="M 160 280 L 240 280 L 380 380 L 20 380 Z" fill="url(#road)" />

      {/* Road Lines */}
      <path d="M 200 290 L 200 310 M 200 330 L 200 360" stroke="#ffd700" strokeWidth="4" />

      {/* Sports Car Silhouette */}
      <path d="M 130 320 Q 150 290 200 290 Q 250 290 270 320 L 290 350 L 110 350 Z" fill="#000" />
      <path d="M 150 320 Q 170 300 200 300 Q 230 300 250 320 Z" fill="#333" />
      {/* Wheels */}
      <ellipse cx="140" cy="350" rx="15" ry="10" fill="#111" />
      <ellipse cx="260" cy="350" rx="15" ry="10" fill="#111" />
      {/* Headlights */}
      <path d="M 120 335 L 140 330 L 140 340 Z" fill="#ffffe0" />
      <path d="M 280 335 L 260 330 L 260 340 Z" fill="#ffffe0" />
    </svg>
  );
};
