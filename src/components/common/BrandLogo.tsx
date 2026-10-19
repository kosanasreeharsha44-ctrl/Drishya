import React from 'react';

interface BrandLogoProps {
  className?: string;
  showWordmark?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  showWordmark = true,
  size = 'md',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Neon D + Eye Emblem */}
      <div className={`relative ${iconSizes[size]} flex-shrink-0 group`}>
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#00E5FF] via-[#7B5CFF] to-[#FF2E9A] blur-[6px] opacity-70 group-hover:opacity-100 transition-opacity" />
        <svg
          viewBox="0 0 100 100"
          className="relative w-full h-full drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Base Emblem shape */}
          <rect width="100" height="100" rx="22" fill="#07070D" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
          
          {/* Stylized 'D' */}
          <path
            d="M 28 22 L 50 22 C 72 22 82 35 82 50 C 82 65 72 78 50 78 L 28 78 Z"
            stroke="url(#neonDGrad)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Eye lens in Drishya */}
          <path
            d="M 37 50 C 44 40 56 40 63 50 C 56 60 44 60 37 50 Z"
            stroke="#00E5FF"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Iris Pupil */}
          <circle cx="50" cy="50" r="5" fill="#FF2E9A" />
          <circle cx="52" cy="48" r="1.5" fill="#FFFFFF" />

          <defs>
            <linearGradient id="neonDGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00E5FF" />
              <stop offset="50%" stopColor="#7B5CFF" />
              <stop offset="100%" stopColor="#FF2E9A" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {showWordmark && (
        <span
          className={`font-display font-extrabold tracking-wider bg-gradient-to-r from-white via-[#F2F4FF] to-[#9AA0B8] bg-clip-text text-transparent uppercase ${textSizes[size]}`}
        >
          Drishya
        </span>
      )}
    </div>
  );
};
