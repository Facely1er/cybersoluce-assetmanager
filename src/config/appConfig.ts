/**
 * Application Configuration
 * 
 * Central configuration for app-wide settings including demo mode.
 */

/**
 * Application modes
 */
export const APP_MODES = {
  /** Demo mode - enables sector demo features */
  demo: import.meta.env.VITE_CYBERSOLUCE_DEMO_ENABLED !== 'false',
  
  /** Live mode - production mode */
  live: true,
} as const;

/**
 * Check if demo mode is enabled
 */
export function isDemoModeEnabled(): boolean {
  return APP_MODES.demo;
}

/**
 * Check if a feature should be available based on mode
 */
export function isFeatureEnabled(feature: 'demo' | 'live'): boolean {
  return APP_MODES[feature];
}

