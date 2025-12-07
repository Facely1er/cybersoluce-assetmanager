import React from 'react';

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
  return (
    <div className={`flex items-center ${className}`}>
      <div className={`relative flex-shrink-0 ${sizeClasses[size]} transition-all duration-300`}>
        <img
          src="/cybersoluce.png"
          alt="CyberSoluce Logo"
          className="w-full h-full object-contain"
          aria-label="CyberSoluce Logo"
        />
      </div>
      
      {showText && (
        <div className="flex flex-col justify-center min-w-0 ml-2">
          {/* CyberSoluce - Main brand name matching CyberCaution pattern */}
          <h1 className="text-foreground font-bold text-base leading-none">
            CyberSoluce<sup className="text-xs font-bold leading-none relative -top-0.5">™</sup>
          </h1>
          {/* Asset Intelligence - Subtitle matching CyberCaution pattern */}
          <p className="text-muted-foreground text-xs leading-none mt-0.5">
            Asset Intelligence
          </p>
          {/* ERMITS LLC - Attribution matching CyberCaution pattern */}
          <p className="text-muted-foreground text-xs leading-none mt-0.5">
            by ERMITS LLC
          </p>
        </div>
      )}
    </div>
  );
};

