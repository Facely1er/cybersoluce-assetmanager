import React from 'react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '../common/ThemeToggle';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  return (
    <header className={`bg-white/98 dark:bg-gray-900/98 backdrop-blur-xl border-b border-gray-200/80 dark:border-gray-800/80 shadow-sm sticky top-0 z-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Branding */}
          <Link to="/" className="flex items-center group">
            <img 
              src="/cybersoluce.png" 
              alt="CyberSoluce Logo" 
              className="h-12 w-12 object-contain transition-transform group-hover:scale-110 drop-shadow-md"
            />
            <span className="ml-3">
              <span className="block text-xl font-bold text-gray-900 dark:text-white group-hover:text-command-blue-600 dark:group-hover:text-command-blue-400 transition-colors">
                CyberSoluce<sup className="text-xs font-normal text-command-blue-500 dark:text-action-cyan-400">™</sup>
              </span>
              <span className="block text-xs text-gray-600 dark:text-gray-400 font-medium">AssetManager</span>
              <span className="block text-xs text-gray-500 dark:text-gray-500 font-normal">by ERMITS</span>
            </span>
          </Link>

          {/* Right side utilities */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

