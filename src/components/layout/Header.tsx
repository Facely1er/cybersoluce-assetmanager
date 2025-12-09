import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeToggle } from '../common/ThemeToggle';
import { Logo } from '../common/Logo';
import { Home, Menu, X } from 'lucide-react';

interface HeaderProps {
  className?: string;
  [key: string]: unknown; // Allow other props but ignore them
}

export const Header: React.FC<HeaderProps> = (props) => {
  // Extract only the className prop, ignore any other props from React Router
  const { className = '', ...rest } = props;
  // Explicitly ignore rest props to prevent React Router from passing unexpected props
  void rest;
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navigationItems = [
    {
      label: 'Home',
      href: '/',
      icon: Home,
    },
    {
      label: 'Products',
      href: '/offerings',
      icon: null,
    },
    {
      label: 'Platform Ecosystem',
      href: '/ecosystem',
      icon: null,
    },
    {
      label: 'Free Tools',
      href: '/tools',
      icon: null,
    },
    {
      label: 'Advisory Services',
      href: 'https://www.ermits-advisory.com',
      icon: null,
      external: true,
    },
    {
      label: 'Pricing',
      href: '/pricing',
      icon: null,
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
    <>
      {/* Main Header */}
      <header className={`bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm sticky top-0 z-50 ${headerClassName}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 py-2">
            {/* Logo and Branding - Enhanced */}
            <Link to="/" className="flex items-center group flex-shrink-0">
              <Logo size="lg" showText={true} className="group-hover:scale-105 transition-transform duration-300" />
            </Link>

            {/* Center Navigation - Desktop - All menu items in order */}
            <nav className="hidden md:flex items-center space-x-2 flex-1 justify-center mx-4">
              {navigationItems.map((item, index) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                const iconClassName = active ? 'text-command-blue-600 dark:text-command-blue-400' : '';
                const linkClassName = `flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-command-blue-50 dark:bg-command-blue-900/30 text-command-blue-700 dark:text-command-blue-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-command-blue-600 dark:hover:text-command-blue-400'
                }`;
                
                return (
                  <React.Fragment key={item.label}>
                    {index > 0 && <span className="text-gray-300 dark:text-gray-600">|</span>}
                    {item.external ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={linkClassName}
                      >
                        {Icon && <Icon className={`h-4 w-4 mr-2 ${iconClassName}`} />}
                        <span>{item.label}</span>
                      </a>
                    ) : (
                      <Link
                        to={item.href}
                        className={linkClassName}
                      >
                        {Icon && <Icon className={`h-4 w-4 mr-2 ${iconClassName}`} />}
                        <span>{item.label}</span>
                      </Link>
                    )}
                  </React.Fragment>
                );
              })}
            </nav>

            {/* Right side utilities */}
            <div className="flex items-center gap-3 flex-shrink-0">
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
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4 bg-white dark:bg-gray-900">
            {/* Mobile Logo Display */}
            <div className="flex items-center mb-4 px-4 pb-4 border-b border-gray-200 dark:border-gray-800">
              <Logo size="md" showText={true} />
            </div>
            <nav className="flex flex-col space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                const iconClassName = active ? 'text-command-blue-600 dark:text-command-blue-400' : '';
                const linkClassName = `flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-command-blue-50 dark:bg-command-blue-900/30 text-command-blue-700 dark:text-command-blue-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-command-blue-600 dark:hover:text-command-blue-400'
                }`;
                
                return item.external ? (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileMenuOpen(false)}
                    className={linkClassName}
                  >
                    {Icon && <Icon className={`h-5 w-5 mr-3 ${iconClassName}`} />}
                    <span>{item.label}</span>
                  </a>
                ) : (
                  <Link
                    key={item.label}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={linkClassName}
                  >
                    {Icon && <Icon className={`h-5 w-5 mr-3 ${iconClassName}`} />}
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              {/* Theme Toggle in Mobile Menu */}
              <div className="px-4 pt-2 border-t border-gray-200 dark:border-gray-800 mt-2">
                <ThemeToggle variant="mobile" />
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
};

