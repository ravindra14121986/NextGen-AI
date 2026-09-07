import React, { useState } from 'react';
import { playClickSound } from '../utils/audio';

interface CircularMetricBoxProps {
  title: string;
  value: string | number;
  subtitle?: string;
  badgeText?: string;
  trend?: string;
  variant: 'emerald' | 'indigo' | 'blue' | 'purple' | 'amber' | 'rose';
  icon?: React.ReactNode;
  footnote?: string;
  onClick?: () => void;
}

export const CircularMetricBox: React.FC<CircularMetricBoxProps> = ({
  title,
  value,
  subtitle,
  badgeText,
  trend,
  variant,
  icon,
  footnote,
  onClick,
}) => {
  const [isChasing, setIsChasing] = useState(false);

  const gradientStyles = {
    emerald: {
      bg: 'bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700',
      glow: 'shadow-emerald-500/20',
      ring: 'border-emerald-300/40',
      badgeBg: 'bg-emerald-950/40 text-emerald-200 border-emerald-400/30',
      iconColor: 'text-emerald-200',
      beam: 'from-emerald-300 via-teal-300 to-transparent',
    },
    indigo: {
      bg: 'bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800',
      glow: 'shadow-indigo-500/20',
      ring: 'border-indigo-300/40',
      badgeBg: 'bg-indigo-950/40 text-indigo-200 border-indigo-400/30',
      iconColor: 'text-indigo-200',
      beam: 'from-indigo-300 via-purple-300 to-transparent',
    },
    blue: {
      bg: 'bg-gradient-to-br from-blue-600 via-sky-600 to-cyan-700',
      glow: 'shadow-blue-500/20',
      ring: 'border-sky-300/40',
      badgeBg: 'bg-blue-950/40 text-sky-200 border-sky-400/30',
      iconColor: 'text-sky-200',
      beam: 'from-sky-300 via-cyan-300 to-transparent',
    },
    purple: {
      bg: 'bg-gradient-to-br from-purple-600 via-fuchsia-700 to-indigo-800',
      glow: 'shadow-purple-500/20',
      ring: 'border-purple-300/40',
      badgeBg: 'bg-purple-950/40 text-purple-200 border-purple-400/30',
      iconColor: 'text-purple-200',
      beam: 'from-purple-300 via-pink-300 to-transparent',
    },
    amber: {
      bg: 'bg-gradient-to-br from-amber-500 via-orange-600 to-rose-700',
      glow: 'shadow-amber-500/20',
      ring: 'border-amber-300/40',
      badgeBg: 'bg-amber-950/40 text-amber-200 border-amber-400/30',
      iconColor: 'text-amber-200',
      beam: 'from-amber-300 via-orange-300 to-transparent',
    },
    rose: {
      bg: 'bg-gradient-to-br from-rose-600 via-pink-600 to-purple-700',
      glow: 'shadow-rose-500/20',
      ring: 'border-rose-300/40',
      badgeBg: 'bg-rose-950/40 text-rose-200 border-rose-400/30',
      iconColor: 'text-rose-200',
      beam: 'from-rose-300 via-pink-300 to-transparent',
    },
  };

  const style = gradientStyles[variant];

  const handleClick = () => {
    playClickSound();
    setIsChasing(true);
    if (onClick) onClick();
    setTimeout(() => {
      setIsChasing(false);
    }, 4500);
  };

  return (
    <div
      onClick={handleClick}
      className="flex flex-col items-center group cursor-pointer select-none"
    >
      {/* Outer Circular Box with soft edge & gradient */}
      <div
        className={`relative w-44 h-44 sm:w-48 sm:h-48 md:w-52 md:h-52 rounded-full p-[3px] shadow-xl ${
          style.glow
        } transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl flex items-center justify-center overflow-hidden ${
          isChasing ? 'ring-4 ring-white/60 scale-105' : ''
        }`}
      >
        {/* Chasing Light Halo around perimeter */}
        <div
          className={`absolute -inset-[100%] transition-opacity duration-300 pointer-events-none ${
            isChasing ? 'opacity-100' : 'opacity-0 group-hover:opacity-75'
          }`}
        >
          <div
            className="w-full h-full animate-spin-slow bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,transparent_260deg,#ffffff_320deg,#67e8f9_350deg,#ec4899_360deg)]"
            style={{ animationDuration: isChasing ? '1.5s' : '3.5s' }}
          />
        </div>

        {/* Inner Gradient Disc */}
        <div
          className={`relative w-full h-full rounded-full ${style.bg} flex items-center justify-center p-1 z-10`}
        >
          {/* Soft edge ambient inner glow */}
          <div className="absolute inset-2 rounded-full border border-white/25 pointer-events-none opacity-80" />
          <div className="absolute inset-4 rounded-full border border-white/10 pointer-events-none" />

          {/* Inner Content Disc */}
          <div className="relative w-full h-full rounded-full flex flex-col items-center justify-center p-4 text-center text-white">
            {/* Top Tag or Icon */}
            <div className="flex items-center gap-1.5 mb-1">
              {icon && <span className={`${style.iconColor} drop-shadow`}>{icon}</span>}
              {badgeText && (
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${style.badgeBg} backdrop-blur-xs`}
                >
                  {badgeText}
                </span>
              )}
            </div>

            {/* Main Numeric Metric Value */}
            <div className="font-extrabold font-mono text-2xl sm:text-3xl tracking-tight drop-shadow-md text-white">
              {value}
            </div>

            {/* Title Label */}
            <div className="text-[11px] font-semibold uppercase tracking-wider text-white/90 mt-1 line-clamp-1 max-w-[130px]">
              {title}
            </div>

            {/* Subtitle / Context */}
            {subtitle && (
              <div className="text-[10px] text-white/75 font-medium mt-0.5 max-w-[120px] line-clamp-1">
                {subtitle}
              </div>
            )}

            {/* Trend badge */}
            {trend && (
              <div className="mt-1.5 text-[10px] font-mono text-emerald-100 bg-white/15 px-2 py-0.5 rounded-full border border-white/20">
                {trend}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footnote text below circle */}
      {footnote && (
        <span className="text-[11px] text-slate-500 font-medium mt-2.5 text-center max-w-[160px]">
          {footnote}
        </span>
      )}
    </div>
  );
};

