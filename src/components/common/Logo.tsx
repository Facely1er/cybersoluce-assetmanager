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
          {/* CyberSoluce - Increased size, refined styling */}
          <div className="flex items-baseline gap-0.5 leading-none">
            <span className="font-outfit text-2xl font-semibold tracking-tight bg-gradient-to-r from-gray-900 via-command-blue-600 to-action-cyan-400 dark:from-white dark:via-command-blue-400 dark:to-action-cyan-400 bg-clip-text text-transparent transition-all duration-300 whitespace-nowrap">
              CyberSoluce
            </span>
            <sup className="font-outfit text-[10px] font-semibold text-action-cyan-400 dark:text-action-cyan-300 leading-none relative -top-1">™</sup>
          </div>
          {/* Asset Manager - Decreased size, refined styling */}
          <span className="font-inter text-sm font-bold text-gray-900 dark:text-white tracking-tight whitespace-nowrap leading-none">
            Asset Manager
          </span>
          {/* ERMITS - Refined alignment */}
          <div className="flex items-baseline gap-1.5 leading-none">
            <span className="text-[9px] text-gray-500 dark:text-gray-400 font-medium tracking-wide">by</span>
            <span className="font-inter text-[10px] font-bold text-action-cyan-400 dark:text-action-cyan-300 uppercase tracking-widest whitespace-nowrap">
              ERMITS
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

