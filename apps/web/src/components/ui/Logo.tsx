import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/cn';

export interface LogoProps {
  /** Size preset or pixel dimensions */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Whether to show the "AcadFlows" brand text alongside the icon */
  showText?: boolean;
  /** Custom class for the wrapper */
  className?: string;
  /** Custom class for the text */
  textClassName?: string;
  /** If provided, renders as a Link to that destination */
  to?: string;
}

const sizeMap = {
  xs: { icon: 'w-6 h-6', text: 'text-base' },
  sm: { icon: 'w-8 h-8', text: 'text-lg' },
  md: { icon: 'w-9 h-9', text: 'text-xl' },
  lg: { icon: 'w-10 h-10', text: 'text-2xl' },
  xl: { icon: 'w-12 h-12', text: 'text-3xl' },
};

export const LogoIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('aspect-square select-none shrink-0 drop-shadow-sm', className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="af-icon-bg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF5238" />
          <stop offset="45%" stopColor="#DF301C" />
          <stop offset="100%" stopColor="#8F1407" />
        </linearGradient>

        <linearGradient id="af-icon-amber" x1="16" y1="46" x2="48" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF8A00" />
          <stop offset="60%" stopColor="#FFB319" />
          <stop offset="100%" stopColor="#FFDE59" />
        </linearGradient>

        <linearGradient id="af-icon-white" x1="20" y1="14" x2="44" y2="46" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#FDECE9" />
        </linearGradient>

        <linearGradient id="af-icon-ring" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
        </linearGradient>

        <filter id="af-icon-glow" x="-10%" y="-10%" width="120%" height="120%" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#4A0500" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* Rounded Squircle Container */}
      <rect width="64" height="64" rx="16" fill="url(#af-icon-bg)" />
      <rect width="62" height="62" x="1" y="1" rx="15" stroke="url(#af-icon-ring)" strokeWidth="1.5" />

      {/* Emblem Graphic */}
      <g filter="url(#af-icon-glow)">
        {/* Graduation Diamond Apex */}
        <polygon points="32,14 49,22 32,30 15,22" fill="url(#af-icon-white)" />
        <polygon points="15,22 32,30 32,32.5 15,24.5" fill="#E8B5AD" opacity="0.9" />
        <polygon points="49,22 32,30 32,32.5 49,24.5" fill="#C98177" opacity="0.9" />

        {/* Academic Open Pages */}
        <path
          d="M20,29.5 C24,32.5 28.5,34 31,35 L31,46 C27.5,44.5 22.5,42.5 18.5,37 L18.5,29 C19,29.1 19.5,29.3 20,29.5 Z"
          fill="url(#af-icon-white)"
          opacity="0.96"
        />
        <path
          d="M44,29.5 C40,32.5 35.5,34 33,35 L33,46 C36.5,44.5 41.5,42.5 45.5,37 L45.5,29 C45,29.1 44.5,29.3 44,29.5 Z"
          fill="url(#af-icon-white)"
          opacity="0.82"
        />

        {/* Dynamic Fluid Flow Ribbon */}
        <path
          d="M17.5,44 C23,37.5 30.5,36 44.5,35.5 C40,38.5 35,40.2 26.5,41 C22.5,41.4 19.5,43 17.5,44 Z"
          fill="url(#af-icon-amber)"
        />

        {/* Cap Tassel Knot & Golden Stream */}
        <circle cx="32" cy="22" r="2.2" fill="url(#af-icon-amber)" />
        <path
          d="M32,22 C39,22.5 44,25 45,29.5"
          stroke="url(#af-icon-amber)"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="45" cy="29.5" r="1.3" fill="url(#af-icon-amber)" />
      </g>
    </svg>
  );
};

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  className,
  textClassName,
  to,
}) => {
  const currentSize = sizeMap[size];

  const content = (
    <div className={cn('inline-flex items-center gap-2.5 group transition-transform duration-150', className)}>
      <div className={cn(currentSize.icon, 'transition-transform duration-200 group-hover:scale-105')}>
        <LogoIcon className="w-full h-full" />
      </div>
      {showText && (
        <span
          className={cn(
            currentSize.text,
            'font-bold tracking-tight text-foreground select-none',
            textClassName,
          )}
        >
          Acad<span className="text-primary-500 font-extrabold">Flows</span>
        </span>
      )}
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="inline-flex focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-lg">
        {content}
      </Link>
    );
  }

  return content;
};

export default Logo;

