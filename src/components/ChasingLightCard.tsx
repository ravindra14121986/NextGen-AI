import React, { useState, useEffect } from 'react';
import { playClickSound } from '../utils/audio';

interface ChasingLightCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'indigo' | 'emerald' | 'amber' | 'purple' | 'cyan';
  rounded?: 'rounded-2xl' | 'rounded-3xl' | 'rounded-xl' | 'rounded-full';
  onClick?: () => void;
  alwaysActive?: boolean;
  enableClickSound?: boolean;
}

export const ChasingLightCard: React.FC<ChasingLightCardProps> = ({
  children,
  className = '',
  variant = 'indigo',
  rounded = 'rounded-3xl',
  onClick,
  alwaysActive = false,
  enableClickSound = true,
}) => {
  const [isChasing, setIsChasing] = useState(alwaysActive);
  const [clickCount, setClickCount] = useState(0);

  // Gradient definitions for chasing light
  const variantGradients = {
    indigo: 'from-transparent via-indigo-500 via-purple-500 to-transparent',
    emerald: 'from-transparent via-emerald-400 via-teal-500 to-transparent',
    amber: 'from-transparent via-amber-400 via-orange-500 to-transparent',
    purple: 'from-transparent via-fuchsia-500 via-purple-600 to-transparent',
    cyan: 'from-transparent via-cyan-400 via-blue-500 to-transparent',
  };

  const glowShadows = {
    indigo: 'shadow-[0_0_25px_rgba(99,102,241,0.4)]',
    emerald: 'shadow-[0_0_25px_rgba(16,185,129,0.4)]',
    amber: 'shadow-[0_0_25px_rgba(245,158,11,0.4)]',
    purple: 'shadow-[0_0_25px_rgba(168,85,247,0.4)]',
    cyan: 'shadow-[0_0_25px_rgba(6,182,212,0.4)]',
  };

  const handleClick = () => {
    if (enableClickSound) {
      playClickSound();
    }
    setClickCount((prev) => prev + 1);
    setIsChasing(true);

    if (onClick) {
      onClick();
    }
  };

  // Reset chasing light after 5 seconds if not alwaysActive
  useEffect(() => {
    if (!alwaysActive && isChasing) {
      const timer = setTimeout(() => {
        setIsChasing(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isChasing, clickCount, alwaysActive]);

  return (
    <div
      onClick={handleClick}
      className={`relative p-[2px] ${rounded} transition-all duration-300 cursor-pointer overflow-hidden group ${
        isChasing ? glowShadows[variant] : ''
      } ${className}`}
    >
      {/* The Chasing Light Runner Beam */}
      <div
        className={`absolute -inset-[100%] transition-opacity duration-300 pointer-events-none ${
          isChasing || alwaysActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'
        }`}
      >
        <div
          className={`w-full h-full animate-spin-slow bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,transparent_270deg,#6366f1_320deg,#ec4899_350deg,#38bdf8_360deg)]`}
          style={{
            animationDuration: isChasing ? '2s' : '4s',
          }}
        />
      </div>

      {/* Click status badge if triggered */}
      {isChasing && !alwaysActive && (
        <span className="absolute top-2 right-2 z-20 flex h-2.5 w-2.5 pointer-events-none">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500" />
        </span>
      )}

      {/* Internal Content Container */}
      <div className={`relative w-full h-full bg-white ${rounded} overflow-hidden z-10`}>
        {children}
      </div>
    </div>
  );
};
