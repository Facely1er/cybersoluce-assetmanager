/**
 * Production-safe logging utility
 * Automatically filters out logs in production unless explicitly enabled
 * Supports Sentry integration for error tracking
 */

const isDev = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;
const debugMode = import.meta.env.VITE_DEBUG_MODE === 'true';
const enableErrorReporting = import.meta.env.VITE_ENABLE_ERROR_REPORTING === 'true';
const sentryDsn = import.meta.env.VITE_SENTRY_DSN;

// Sentry integration helper
// Type definition for Sentry when loaded via CDN
interface SentryType {
  captureException: (error: Error, options?: { extra?: Record<string, unknown>; tags?: Record<string, string> }) => void;
  captureMessage: (message: string, level: 'warning' | 'error', options?: { extra?: Record<string, unknown>; tags?: Record<string, string> }) => void;
}

const sendToSentry = (level: 'warning' | 'error', message: string, error?: Error, context?: Record<string, unknown>) => {
  if (!enableErrorReporting || !isProduction) return;
  
  // Check if Sentry is available (will be loaded via CDN or npm package)
  if (typeof window !== 'undefined' && 'Sentry' in window) {
    const Sentry = (window as typeof window & { Sentry: SentryType }).Sentry;
    try {
      if (level === 'error' && error) {
        Sentry.captureException(error, {
          extra: context,
          tags: { source: 'logger' }
        });
      } else {
        Sentry.captureMessage(message, level, {
          extra: context,
          tags: { source: 'logger' }
        });
      }
    } catch (sentryError) {
      // Fail silently if Sentry fails
      console.warn('Failed to send to Sentry:', sentryError);
    }
  }
};

/**
 * Logger utility that respects environment settings
 */
export const logger = {
  /**
   * Log debug information (only in development or debug mode)
   */
  debug: (...args: unknown[]) => {
    if (isDev || debugMode) {
      console.debug('[DEBUG]', ...args);
    }
  },

  /**
   * Log information (only in development or debug mode)
   */
  info: (...args: unknown[]) => {
    if (isDev || debugMode) {
      console.info('[INFO]', ...args);
    }
  },

  /**
   * Log warnings (always logged, but filtered in production)
   */
  warn: (...args: unknown[]) => {
    if (isDev || debugMode || enableErrorReporting) {
      console.warn('[WARN]', ...args);
    }
    // In production, send to error tracking service
    if (isProduction && enableErrorReporting) {
      const message = args.map(arg => String(arg)).join(' ');
      sendToSentry('warning', message, undefined, { args });
    }
  },

  /**
   * Log errors (always logged, sent to error tracking in production)
   */
  error: (message: string, error?: Error | unknown, context?: Record<string, unknown>) => {
    // Always log errors
    if (error instanceof Error) {
      console.error('[ERROR]', message, error, context);
    } else {
      console.error('[ERROR]', message, error, context);
    }

    // In production, send to error tracking service
    if (isProduction && enableErrorReporting) {
      const errorObj = error instanceof Error ? error : new Error(message);
      sendToSentry('error', message, errorObj, context);
    }
  },

  /**
   * Log in development only (will be stripped in production builds)
   */
  dev: (...args: unknown[]) => {
    if (isDev) {
      console.log('[DEV]', ...args);
    }
  },

  /**
   * Group logs (only in development)
   */
  group: (label: string) => {
    if (isDev || debugMode) {
      console.group(label);
    }
  },

  /**
   * End log group (only in development)
   */
  groupEnd: () => {
    if (isDev || debugMode) {
      console.groupEnd();
    }
  },

  /**
   * Table log (only in development)
   */
  table: (data: unknown) => {
    if (isDev || debugMode) {
      console.table(data);
    }
  }
};

/**
 * Legacy console wrapper for gradual migration
 * Use logger.* methods instead when possible
 */
export const safeConsole = {
  log: (...args: unknown[]) => logger.debug(...args),
  info: (...args: unknown[]) => logger.info(...args),
  warn: (...args: unknown[]) => logger.warn(...args),
  error: (...args: unknown[]) => {
    const message = args[0] as string;
    const error = args[1] as Error | undefined;
    logger.error(message, error);
  },
  debug: (...args: unknown[]) => logger.debug(...args)
};

