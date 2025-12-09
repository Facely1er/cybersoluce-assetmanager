/**
 * Service Fallback Utility
 * Provides fallback mechanisms for external services when they're unavailable
 */

import { logger } from './logger';

export interface FallbackOptions<T> {
  /** The primary service call */
  serviceCall: () => Promise<T>;
  /** Fallback data/function to use when service fails */
  fallback: T | (() => T | Promise<T>);
  /** Error message to log */
  errorContext: string;
  /** Whether to throw error or return fallback silently */
  throwOnError?: boolean;
  /** Maximum retries before falling back */
  maxRetries?: number;
  /** Retry delay in milliseconds */
  retryDelay?: number;
}

export interface NetworkStatus {
  isOnline: boolean;
  lastCheck: number;
  consecutiveFailures: number;
}

class ServiceFallbackManager {
  private networkStatus: NetworkStatus = {
    isOnline: navigator.onLine !== false,
    lastCheck: Date.now(),
    consecutiveFailures: 0
  };

  private readonly MAX_CONSECUTIVE_FAILURES = 3;
  private readonly NETWORK_CHECK_INTERVAL = 30000; // 30 seconds

  // Store references for cleanup
  private onlineHandler?: () => void;
  private offlineHandler?: () => void;
  private networkCheckInterval?: number;

  constructor() {
    // Monitor network status
    if (typeof window !== 'undefined') {
      // Store handler references for cleanup
      this.onlineHandler = () => {
        this.networkStatus.isOnline = true;
        this.networkStatus.consecutiveFailures = 0;
        logger.info('Network connection restored');
      };

      this.offlineHandler = () => {
        this.networkStatus.isOnline = false;
        logger.warn('Network connection lost');
      };

      window.addEventListener('online', this.onlineHandler);
      window.addEventListener('offline', this.offlineHandler);

      // Periodic network check - store interval ID for cleanup
      this.networkCheckInterval = window.setInterval(
        () => this.checkNetworkStatus(),
        this.NETWORK_CHECK_INTERVAL
      );
    }
  }

  /**
   * Cleanup method to remove event listeners and clear intervals
   * Call this when the service is no longer needed (e.g., app unmount)
   */
  cleanup(): void {
    if (typeof window !== 'undefined') {
      if (this.onlineHandler) {
        window.removeEventListener('online', this.onlineHandler);
        this.onlineHandler = undefined;
      }
      if (this.offlineHandler) {
        window.removeEventListener('offline', this.offlineHandler);
        this.offlineHandler = undefined;
      }
      if (this.networkCheckInterval !== undefined) {
        window.clearInterval(this.networkCheckInterval);
        this.networkCheckInterval = undefined;
      }
    }
  }

  private async checkNetworkStatus(): Promise<void> {
    // Use navigator.onLine instead of external fetch to avoid CSP violations
    // The online/offline events are already handled in the constructor
    this.networkStatus.isOnline = navigator.onLine !== false;
    this.networkStatus.lastCheck = Date.now();
    
    // Reset failure counter if online
    if (this.networkStatus.isOnline) {
      this.networkStatus.consecutiveFailures = 0;
    }
  }

  /**
   * Check if network is available
   */
  isNetworkAvailable(): boolean {
    return this.networkStatus.isOnline && navigator.onLine !== false;
  }

  /**
   * Check if service should use fallback based on consecutive failures
   */
  shouldUseFallback(): boolean {
    return this.networkStatus.consecutiveFailures >= this.MAX_CONSECUTIVE_FAILURES;
  }

  /**
   * Execute service call with fallback mechanism
   */
  async executeWithFallback<T>(options: FallbackOptions<T>): Promise<T> {
    const {
      serviceCall,
      fallback,
      errorContext,
      throwOnError = false,
      maxRetries = 2,
      retryDelay = 1000
    } = options;

    // If network is down or too many failures, use fallback immediately
    if (!this.isNetworkAvailable() || this.shouldUseFallback()) {
      logger.warn(`${errorContext}: Using fallback due to network issues`);
      return this.getFallbackValue(fallback);
    }

    let lastError: Error | null = null;

    // Retry logic
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await Promise.race([
          serviceCall(),
          this.createTimeout(10000) // 10 second timeout
        ]);

        // Success - reset failure counter
        this.networkStatus.consecutiveFailures = 0;
        return result as T;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        // Check if it's a network error
        const isNetworkError = this.isNetworkError(lastError);
        
        if (isNetworkError) {
          this.networkStatus.consecutiveFailures++;
        }

        // Don't retry on certain errors (auth, validation, etc.)
        if (this.isNonRetryableError(lastError)) {
          // Log 401/403 errors at debug level since they're expected when not authenticated
          const isAuthError = this.isAuthError(lastError);
          if (isAuthError) {
            logger.debug(`${errorContext}: Authentication required, using fallback`);
          } else {
            logger.error(`${errorContext}: Non-retryable error`, lastError);
          }
          if (throwOnError) {
            throw lastError;
          }
          return this.getFallbackValue(fallback);
        }

        // Last attempt failed
        if (attempt === maxRetries) {
          // Check if it's an auth error before logging as error
          const isAuthError = this.isAuthError(lastError);
          if (isAuthError) {
            logger.debug(`${errorContext}: Authentication required, using fallback`);
          } else {
            logger.error(`${errorContext}: All retries exhausted, using fallback`, lastError);
          }
          if (throwOnError) {
            throw lastError;
          }
          return this.getFallbackValue(fallback);
        }

        // Wait before retry with exponential backoff
        await this.delay(retryDelay * Math.pow(2, attempt));
      }
    }

    // Should never reach here, but TypeScript needs it
    return this.getFallbackValue(fallback);
  }

  /**
   * Check if error is a network-related error
   */
  private isNetworkError(error: Error): boolean {
    const networkErrorPatterns = [
      'fetch',
      'network',
      'NetworkError',
      'Failed to fetch',
      'timeout',
      'ECONNREFUSED',
      'ENOTFOUND',
      'ETIMEDOUT',
      'ERR_INTERNET_DISCONNECTED',
      'ERR_NETWORK_CHANGED',
      'ERR_CONNECTION_REFUSED',
      'ERR_CONNECTION_RESET',
      'ERR_CONNECTION_TIMED_OUT'
    ];

    const errorMessage = error.message.toLowerCase();
    return networkErrorPatterns.some(pattern => errorMessage.includes(pattern.toLowerCase()));
  }

  /**
   * Check if error is an authentication/authorization error
   */
  private isAuthError(error: Error): boolean {
    // Check for status codes in error object (Supabase errors may have status property)
    if (error && typeof error === 'object') {
      const errorObj = error as any;
      if (errorObj.status === 401 || errorObj.status === 403) {
        return true;
      }
      // Check for Supabase error codes related to auth
      if (errorObj.code === 'PGRST301') {
        return true;
      }
    }

    const authErrorPatterns = [
      '401',
      '403',
      'authentication',
      'authorization',
      'unauthorized',
      'not authorized',
      'forbidden'
    ];

    const errorMessage = error.message.toLowerCase();
    return authErrorPatterns.some(pattern => errorMessage.includes(pattern.toLowerCase()));
  }

  /**
   * Check if error should not be retried
   */
  private isNonRetryableError(error: Error): boolean {
    // Check for status codes in error object (Supabase errors may have status property)
    if (error && typeof error === 'object') {
      const errorObj = error as any;
      if (errorObj.status === 401 || errorObj.status === 403 || errorObj.status === 404) {
        return true;
      }
      // Check for Supabase error codes
      if (errorObj.code === 'PGRST301' || errorObj.code === 'PGRST116') {
        return true;
      }
    }

    const nonRetryablePatterns = [
      '401', // Unauthorized
      '403', // Forbidden
      '404', // Not Found
      '422', // Validation Error
      '400', // Bad Request
      'authentication',
      'authorization',
      'permission',
      'invalid',
      'validation',
      'unauthorized', // Additional check for unauthorized errors
      'not authorized'
    ];

    const errorMessage = error.message.toLowerCase();
    return nonRetryablePatterns.some(pattern => errorMessage.includes(pattern.toLowerCase()));
  }

  /**
   * Get fallback value (handles both sync and async fallbacks)
   */
  private async getFallbackValue<T>(fallback: T | (() => T | Promise<T>)): Promise<T> {
    if (typeof fallback === 'function') {
      return await (fallback as () => T | Promise<T>)();
    }
    return fallback;
  }

  /**
   * Create a timeout promise
   */
  private createTimeout(ms: number): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), ms);
    });
  }

  /**
   * Delay utility
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Reset failure counter (call when service is confirmed working)
   */
  resetFailureCounter(): void {
    this.networkStatus.consecutiveFailures = 0;
  }
}

// Singleton instance
export const serviceFallback = new ServiceFallbackManager();

/**
 * Convenience function for executing service calls with fallback
 */
export async function withFallback<T>(
  serviceCall: () => Promise<T>,
  fallback: T | (() => T | Promise<T>),
  errorContext: string,
  options?: Partial<FallbackOptions<T>>
): Promise<T> {
  return serviceFallback.executeWithFallback({
    serviceCall,
    fallback,
    errorContext,
    ...options
  });
}

/**
 * Check if service is available (network + connectivity)
 */
export function isServiceAvailable(): boolean {
  return serviceFallback.isNetworkAvailable() && !serviceFallback.shouldUseFallback();
}

