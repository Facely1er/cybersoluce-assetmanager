import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../ui/button';

interface ThemeToggleProps {
  className?: string;
  variant?: 'default' | 'mobile';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', variant = 'default' }) => {
  const { theme, toggleTheme } = useTheme();

  if (variant === 'mobile') {
    return (
      <button
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-command-blue-600 dark:hover:text-command-blue-400 ${className}`}
      >
        {theme === 'light' ? (
          <>
            <Moon className="h-5 w-5 mr-3" />
            <span>Dark Mode</span>
          </>
        ) : (
          <>
            <Sun className="h-5 w-5 mr-3" />
            <span>Light Mode</span>
          </>
        )}
      </button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      className={`relative text-gray-700 dark:text-gray-300 hover:text-command-blue-600 dark:hover:text-command-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 ${className}`}
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </Button>
  );
};

