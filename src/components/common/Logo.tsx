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

