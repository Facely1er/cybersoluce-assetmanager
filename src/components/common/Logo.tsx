import React from 'react';
import { useTheme } from '../../hooks/useTheme';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
  xl: 'h-20 w-20',
};

export const Logo: React.FC<LogoProps> = ({ 
  size = 'lg', 
  showText = true,
  className = '' 
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`flex items-center ${className}`}>
      <div className={`relative flex-shrink-0 ${sizeClasses[size]} transition-all duration-300`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 200 200"
          className="w-full h-full"
          aria-label="CyberSoluce Logo"
        >
          <defs>
            {/* Background gradient - adapts to theme */}
            <radialGradient id="bgGradient" cx="50%" cy="50%" r="50%">
              {isDark ? (
                <>
                  <stop offset="0%" style={{ stopColor: '#000000', stopOpacity: 1 }} />
                  <stop offset="70%" style={{ stopColor: '#0a0a1a', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#1a1a2e', stopOpacity: 1 }} />
                </>
              ) : (
                <>
                  <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 1 }} />
                  <stop offset="70%" style={{ stopColor: '#f0f9ff', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#e0f2fe', stopOpacity: 1 }} />
                </>
              )}
            </radialGradient>
            
            {/* Orbit glow filter */}
            <filter id="orbitGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur"/>
              <feColorMatrix 
                in="blur" 
                mode="matrix" 
                values={isDark 
                  ? "0 0 0 0 0.2  0 0.4 1 0 0.8  0 0.6 1 0 1  0 0 0 0 1"
                  : "0 0 0 0 0.1  0 0.2 0.5 0 0.6  0 0.3 0.6 0 0.8  0 0 0 0 1"
                } 
                result="glow"
              />
              <feMerge>
                <feMergeNode in="glow"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            
            {/* Particle glow filter */}
            <filter id="particleGlow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur"/>
              <feColorMatrix 
                in="blur" 
                mode="matrix" 
                values={isDark
                  ? "0.5 0.8 1 0 0.9  0.6 0.9 1 0 0.9  0.7 1 1 0 1  0 0 0 0 1"
                  : "0.2 0.4 0.6 0 0.7  0.3 0.5 0.7 0 0.8  0.4 0.6 0.8 0 0.9  0 0 0 0 1"
                } 
                result="glow"
              />
              <feMerge>
                <feMergeNode in="glow"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            
            {/* Shield glow filter */}
            <filter id="shieldGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur"/>
              <feColorMatrix 
                in="blur" 
                mode="matrix" 
                values={isDark
                  ? "0 0.2 0.5 0 0.3  0 0.3 0.6 0 0.4  0 0.4 0.7 0 0.5  0 0 0 0 1"
                  : "0 0.1 0.3 0 0.2  0 0.2 0.4 0 0.3  0 0.3 0.5 0 0.4  0 0 0 0 1"
                } 
                result="glow"
              />
              <feMerge>
                <feMergeNode in="glow"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Background */}
          <rect width="200" height="200" fill="url(#bgGradient)" rx="8"/>
          
          {/* Atom Orbits */}
          <ellipse 
            cx="100" 
            cy="100" 
            rx="70" 
            ry="25" 
            fill="none" 
            stroke={isDark ? "#3b82f6" : "#005B96"} 
            strokeWidth="2" 
            opacity="0.8"
            filter="url(#orbitGlow)"
          />
          
          <ellipse 
            cx="100" 
            cy="100" 
            rx="25" 
            ry="70" 
            fill="none" 
            stroke={isDark ? "#3b82f6" : "#005B96"} 
            strokeWidth="2" 
            opacity="0.8"
            filter="url(#orbitGlow)"
          />
          
          <ellipse 
            cx="100" 
            cy="100" 
            rx="50" 
            ry="50" 
            transform="rotate(45 100 100)"
            fill="none" 
            stroke={isDark ? "#3b82f6" : "#005B96"} 
            strokeWidth="2" 
            opacity="0.8"
            filter="url(#orbitGlow)"
          />
          
          {/* Glowing Particles */}
          <circle cx="100" cy="30" r="4" fill={isDark ? "#60a5fa" : "#005B96"} filter="url(#particleGlow)"/>
          <circle cx="170" cy="100" r="4" fill={isDark ? "#60a5fa" : "#005B96"} filter="url(#particleGlow)"/>
          <circle cx="100" cy="170" r="4" fill={isDark ? "#60a5fa" : "#005B96"} filter="url(#particleGlow)"/>
          <circle cx="30" cy="100" r="4" fill={isDark ? "#60a5fa" : "#005B96"} filter="url(#particleGlow)"/>
          
          {/* Central Shield */}
          <g filter="url(#shieldGlow)">
            <path 
              d="M 100 50 
               L 70 60 
               L 70 90 
               Q 70 110 80 120 
               Q 90 130 100 140 
               Q 110 130 120 120 
               Q 130 110 130 90 
               L 130 60 
               Z" 
              fill={isDark ? "#1e3a8a" : "#005B96"} 
              stroke={isDark ? "#3b82f6" : "#33A1DE"} 
              strokeWidth="2"
              opacity="0.95"
            />
            
            {/* Gears inside shield */}
            <g transform="translate(85, 95)">
              <circle cx="0" cy="0" r="12" fill={isDark ? "#60a5fa" : "#33A1DE"} opacity="0.9"/>
              <circle cx="0" cy="0" r="6" fill={isDark ? "#1e3a8a" : "#005B96"} />
              <rect x="-1" y="-14" width="2" height="4" fill={isDark ? "#60a5fa" : "#33A1DE"} opacity="0.9"/>
              <rect x="-1" y="10" width="2" height="4" fill={isDark ? "#60a5fa" : "#33A1DE"} opacity="0.9"/>
              <rect x="-14" y="-1" width="4" height="2" fill={isDark ? "#60a5fa" : "#33A1DE"} opacity="0.9"/>
              <rect x="10" y="-1" width="4" height="2" fill={isDark ? "#60a5fa" : "#33A1DE"} opacity="0.9"/>
              <rect x="-10" y="-10" width="2" height="3" fill={isDark ? "#60a5fa" : "#33A1DE"} opacity="0.9" transform="rotate(45)"/>
              <rect x="8" y="8" width="2" height="3" fill={isDark ? "#60a5fa" : "#33A1DE"} opacity="0.9" transform="rotate(45)"/>
              <rect x="10" y="-10" width="2" height="3" fill={isDark ? "#60a5fa" : "#33A1DE"} opacity="0.9" transform="rotate(-45)"/>
              <rect x="-10" y="8" width="2" height="3" fill={isDark ? "#60a5fa" : "#33A1DE"} opacity="0.9" transform="rotate(-45)"/>
            </g>
            
            <g transform="translate(115, 95)">
              <circle cx="0" cy="0" r="12" fill={isDark ? "#60a5fa" : "#33A1DE"} opacity="0.9"/>
              <circle cx="0" cy="0" r="6" fill={isDark ? "#1e3a8a" : "#005B96"} />
              <rect x="-1" y="-14" width="2" height="4" fill={isDark ? "#60a5fa" : "#33A1DE"} opacity="0.9"/>
              <rect x="-1" y="10" width="2" height="4" fill={isDark ? "#60a5fa" : "#33A1DE"} opacity="0.9"/>
              <rect x="-14" y="-1" width="4" height="2" fill={isDark ? "#60a5fa" : "#33A1DE"} opacity="0.9"/>
              <rect x="10" y="-1" width="4" height="2" fill={isDark ? "#60a5fa" : "#33A1DE"} opacity="0.9"/>
              <rect x="-10" y="-10" width="2" height="3" fill={isDark ? "#60a5fa" : "#33A1DE"} opacity="0.9" transform="rotate(45)"/>
              <rect x="8" y="8" width="2" height="3" fill={isDark ? "#60a5fa" : "#33A1DE"} opacity="0.9" transform="rotate(45)"/>
              <rect x="10" y="-10" width="2" height="3" fill={isDark ? "#60a5fa" : "#33A1DE"} opacity="0.9" transform="rotate(-45)"/>
              <rect x="-10" y="8" width="2" height="3" fill={isDark ? "#60a5fa" : "#33A1DE"} opacity="0.9" transform="rotate(-45)"/>
            </g>
            
            <g transform="translate(120, 115)">
              <circle cx="0" cy="0" r="8" fill={isDark ? "#60a5fa" : "#33A1DE"} opacity="0.9"/>
              <circle cx="0" cy="0" r="4" fill={isDark ? "#1e3a8a" : "#005B96"} />
              <rect x="-0.5" y="-10" width="1" height="3" fill={isDark ? "#60a5fa" : "#33A1DE"} opacity="0.9"/>
              <rect x="-0.5" y="7" width="1" height="3" fill={isDark ? "#60a5fa" : "#33A1DE"} opacity="0.9"/>
              <rect x="-10" y="-0.5" width="3" height="1" fill={isDark ? "#60a5fa" : "#33A1DE"} opacity="0.9"/>
              <rect x="7" y="-0.5" width="3" height="1" fill={isDark ? "#60a5fa" : "#33A1DE"} opacity="0.9"/>
              <rect x="-7" y="-7" width="1" height="2" fill={isDark ? "#60a5fa" : "#33A1DE"} opacity="0.9" transform="rotate(45)"/>
              <rect x="6" y="6" width="1" height="2" fill={isDark ? "#60a5fa" : "#33A1DE"} opacity="0.9" transform="rotate(45)"/>
              <rect x="7" y="-7" width="1" height="2" fill={isDark ? "#60a5fa" : "#33A1DE"} opacity="0.9" transform="rotate(-45)"/>
              <rect x="-7" y="6" width="1" height="2" fill={isDark ? "#60a5fa" : "#33A1DE"} opacity="0.9" transform="rotate(-45)"/>
            </g>
          </g>
        </svg>
      </div>
      
      {showText && (
        <div className="flex flex-col leading-tight min-w-0 ml-4">
          <div className="flex items-baseline gap-0.5 leading-none">
            <span className="font-outfit text-2xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-command-blue-600 to-action-cyan-400 dark:from-white dark:via-command-blue-400 dark:to-action-cyan-400 bg-clip-text text-transparent transition-all duration-300 whitespace-nowrap">
              CyberSoluce
            </span>
            <sup className="font-outfit text-xs font-bold text-action-cyan-400 dark:text-action-cyan-300 leading-none relative -top-1.5">™</sup>
          </div>
          <span className="font-inter text-sm font-semibold text-gray-600 dark:text-gray-300 tracking-wide leading-none -mt-0.5 whitespace-nowrap">
            AssetManager
          </span>
          <div className="flex items-baseline gap-1.5 leading-none -mt-0.5">
            <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">by</span>
            <span className="font-inter text-xs font-bold text-action-cyan-400 dark:text-action-cyan-300 uppercase tracking-wider whitespace-nowrap">
              ERMITS
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

