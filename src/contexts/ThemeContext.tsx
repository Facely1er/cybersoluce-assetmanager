import React, { createContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
});

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark' || savedTheme === 'light') {
        return savedTheme;
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  // Apply theme immediately on mount and when it changes
  useEffect(() => {
    // Ensure theme is applied synchronously before render
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Save to localStorage
    localStorage.setItem('theme', theme);
    
    // Update meta theme-color for mobile browsers (Chrome, Safari, Edge)
    // Only create/update for browsers that support it (not Firefox/Opera)
    const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    const isOpera = navigator.userAgent.toLowerCase().indexOf('opr') > -1 || navigator.userAgent.toLowerCase().indexOf('opera') > -1;
    
    if (!isFirefox && !isOpera) {
      let metaThemeColor = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
      
      if (!metaThemeColor) {
        // Create meta tag if it doesn't exist (may not have been created by initial script)
        metaThemeColor = document.createElement('meta');
        metaThemeColor.name = 'theme-color';
        metaThemeColor.id = 'theme-color-meta';
        document.head.appendChild(metaThemeColor);
      }
      
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#111827' : '#ffffff');
    }
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      // Only auto-switch if user hasn't explicitly set a preference
      const savedTheme = localStorage.getItem('theme');
      if (!savedTheme || savedTheme === 'auto') {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    
    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

