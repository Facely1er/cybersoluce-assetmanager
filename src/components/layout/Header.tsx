import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeToggle } from '../common/ThemeToggle';
import { Home, BarChart3, Menu, X, Shield, BookOpen, Play } from 'lucide-react';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className = '' }: HeaderProps) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navigationItems = [
    {
      label: 'Home',
      href: '/',
      icon: Home,
    },
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: BarChart3,
    },
    {
      label: 'Demo',
      href: '/dashboard/demo-scenarios',
      icon: Play,
    },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  // Ensure className is always a string
  const headerClassName = typeof className === 'string' ? className : '';

  return (
    <header className={`bg-white/98 dark:bg-gray-900/98 backdrop-blur-xl border-b border-gray-200/80 dark:border-gray-800/80 shadow-sm sticky top-0 z-50 ${headerClassName}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 py-2">
          {/* Logo and Branding - Enhanced */}
          <Link to="/" className="flex items-center group flex-shrink-0">
            <div className="relative flex-shrink-0">
              <img 
                src="/cybersoluce.png" 
                alt="CyberSoluce Logo" 
                className="h-16 w-16 object-contain transition-all duration-300 group-hover:scale-110 drop-shadow-lg"
                onError={(e) => {
                  // Fallback if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-command-blue-500/0 group-hover:bg-command-blue-500/10 rounded-full blur-xl transition-all duration-300"></div>
            </div>
            <div className="ml-4 flex flex-col leading-tight min-w-0">
              {/* Line 1: CyberSoluce™ */}
              <div className="flex items-baseline gap-0.5 leading-none">
                <span className="font-outfit text-2xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-command-blue-600 to-command-blue-700 dark:from-white dark:via-command-blue-400 dark:to-action-cyan-400 bg-clip-text text-transparent group-hover:from-command-blue-600 group-hover:to-action-cyan-500 dark:group-hover:from-command-blue-300 dark:group-hover:to-action-cyan-300 transition-all duration-300 whitespace-nowrap">
                  CyberSoluce
                </span>
                <sup className="font-outfit text-xs font-bold text-command-blue-500 dark:text-action-cyan-400 leading-none relative -top-1.5">™</sup>
              </div>
              {/* Line 2: AssetManager */}
              <span className="font-inter text-sm font-semibold text-gray-700 dark:text-gray-300 tracking-wide leading-none -mt-0.5 whitespace-nowrap">AssetManager</span>
              {/* Line 3: by ERMITS */}
              <div className="flex items-baseline gap-1.5 leading-none -mt-0.5">
                <span className="text-[10px] text-gray-500 dark:text-gray-500 font-medium">by</span>
                <span className="font-inter text-xs font-bold text-command-blue-600 dark:text-action-cyan-400 uppercase tracking-wider whitespace-nowrap">ERMITS</span>
              </div>
            </div>
          </Link>

          {/* Center Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-2 flex-1 justify-center mx-8">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              const iconClassName = active ? 'text-command-blue-600 dark:text-command-blue-400' : '';
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'bg-gradient-to-r from-command-blue-50 to-action-cyan-50 dark:from-command-blue-900/30 dark:to-action-cyan-900/20 text-command-blue-700 dark:text-command-blue-300 shadow-sm'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-command-blue-600 dark:hover:text-command-blue-400'
                  }`}
                >
                  {Icon && <Icon className={`h-4 w-4 mr-2 ${iconClassName}`} />}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right side utilities */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-800 py-4">
            {/* Mobile Logo Display */}
            <div className="flex items-center mb-4 px-4 pb-4 border-b border-gray-200 dark:border-gray-800">
              <img 
                src="/cybersoluce.png" 
                alt="CyberSoluce Logo" 
                className="h-12 w-12 object-contain mr-3"
              />
              <div className="flex flex-col">
                <div className="flex items-baseline gap-0.5">
                  <span className="font-outfit text-lg font-bold text-gray-900 dark:text-white">CyberSoluce</span>
                  <sup className="font-outfit text-[10px] font-bold text-command-blue-500 dark:text-action-cyan-400 relative -top-1">™</sup>
                </div>
                <span className="font-inter text-xs text-gray-600 dark:text-gray-400">AssetManager</span>
              </div>
            </div>
            <nav className="flex flex-col space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                const iconClassName = active ? 'text-command-blue-600 dark:text-command-blue-400' : '';
                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      active
                        ? 'bg-gradient-to-r from-command-blue-50 to-action-cyan-50 dark:from-command-blue-900/30 dark:to-action-cyan-900/20 text-command-blue-700 dark:text-command-blue-300 shadow-sm'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-command-blue-600 dark:hover:text-command-blue-400'
                    }`}
                  >
                    {Icon && <Icon className={`h-5 w-5 mr-3 ${iconClassName}`} />}
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

