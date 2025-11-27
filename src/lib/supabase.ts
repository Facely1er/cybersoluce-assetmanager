import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';
import { logger } from '../utils/logger';

// Environment variable validation
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if Supabase is configured (allow demo mode)
const isSupabaseConfigured = 
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('placeholder') && 
  !supabaseAnonKey.includes('placeholder') &&
  supabaseUrl.startsWith('https://') &&
  supabaseUrl.includes('.supabase.co');

// Log configuration status in development
if (import.meta.env.DEV) {
  if (!isSupabaseConfigured) {
    logger.info('Running in demo mode - Supabase not configured');
    logger.info('To enable database persistence, set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local');
  } else {
    logger.info('Supabase configured - database persistence enabled');
  }
}

// Create Supabase client if configured, otherwise null (for demo mode)
export const supabase = isSupabaseConfigured
  ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
      },
      realtime: {
        params: {
          eventsPerSecond: 10
        },
        heartbeatIntervalMs: 30000,
        reconnectAfterMs: (tries) => Math.min(tries * 1000, 30000)
      },
      global: {
        headers: {
          'X-Client-Info': 'ermits-cybersoluce@1.0.0'
        }
      }
    })
  : null;

// Export configuration status
export const isSupabaseEnabled = isSupabaseConfigured;

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: unknown): string => {
  // Network errors
  if (error instanceof Error && (error.message.includes('fetch') || error.name === 'TypeError')) {
    return 'Network connection error. Please check your internet connection.';
  }
  
  // Database errors
  if (error && typeof error === 'object' && 'code' in error) {
    const code = (error as { code: string }).code;
    
    if (code === 'PGRST116') {
      return 'No data found matching your criteria';
    }
    
    if (code === '23505') {
      return 'This record already exists. Please use a different name or identifier.';
    }
    
    if (code === '23503') {
      return 'Cannot delete this record as it is referenced by other records';
    }
    
    if (code === '42P01') {
      return 'Database table not found. Please ensure database migrations are applied.';
    }
  }
  
  // Status code errors
  if (error && typeof error === 'object' && 'status' in error) {
    const status = (error as { status: number }).status;
    
    if (status === 429) {
      return 'Too many requests. Please wait a moment and try again.';
    }
    
    if (status === 401) {
      return 'You are not authorized to perform this action. Please sign in.';
    }
    
    if (status === 403) {
      return 'Access denied. You do not have permission to perform this action.';
    }
    
    if (status >= 500) {
      return 'Server error occurred. Please try again later.';
    }
  }
  
  // Default error message
  if (error instanceof Error && error.message) {
    return error.message;
  }
  
  return 'An unexpected error occurred. Please try again.';
};

// Real-time subscription helper
export const subscribeToAssetChanges = (callback: (payload: Record<string, unknown>) => void) => {
  return supabase
    ?.channel('assets_changes')
    .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'assets' }, 
        callback
    )
    .subscribe();
};

// Get current user
export const getCurrentUser = async () => {
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Get current session
export const getCurrentSession = async () => {
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

// Simple retry mechanism for failed requests
export const retryRequest = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry on certain errors
      if (error instanceof Error && (
        error.message.includes('401') || 
        error.message.includes('403') ||
        error.message.includes('404')
      )) {
        throw error;
      }
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt - 1)));
    }
  }
  
  throw lastError!;
};
