import { logger } from './logger';

export const APP_CONFIG = {
  NAME: 'CyberSoluce Lite',
  VERSION: '1.0.0',
  
  // File size limits (in bytes) - customizable
  FILE_SIZE_LIMITS: {
    CSV: 50 * 1024 * 1024,      // 50MB default for CSV
    JSON: 50 * 1024 * 1024,     // 50MB default for JSON
    XLSX: 100 * 1024 * 1024,    // 100MB default for XLSX
    DEFAULT: 50 * 1024 * 1024,  // 50MB default fallback
    MAX: 500 * 1024 * 1024,     // 500MB absolute maximum
    MIN: 1024,                   // 1KB minimum
  },
  
  // Legacy support
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB (kept for backward compatibility)
  
  SUPPORTED_FILE_TYPES: ['.csv', '.json', '.xlsx', '.xls'] as const,
  
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 25,
    MAX_PAGE_SIZE: 100,
    PAGE_SIZE_OPTIONS: [10, 25, 50, 100] as const
  },
  
  SEARCH: {
    DEBOUNCE_DELAY: 300,
    MIN_SEARCH_LENGTH: 2,
    MAX_SEARCH_LENGTH: 100,
    MAX_RESULTS: 1000
  },
  
  DATA_LIMITS: {
    MAX_TAGS: 20,
    MAX_ITEMS: 10000
  },
  
  STORAGE_KEYS: {
    DATA_INVENTORY: 'cybersoluce-lite-data-inventory',
    ASSETS: 'cybersoluce-lite-assets',
    DEPENDENCIES: 'cybersoluce-lite-dependencies',
    SETTINGS: 'cybersoluce-lite-settings',
    FILE_SIZE_LIMITS: 'cybersoluce-lite-file-size-limits',
    FILTERS: 'cybersoluce-lite-filters'
  }
} as const;

// Helper function to get effective file size limit
export const getFileSizeLimit = (fileType: 'csv' | 'json' | 'xlsx'): number => {
  // Try to load custom limits from localStorage
  try {
    const saved = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.FILE_SIZE_LIMITS);
    if (saved) {
      const customLimits = JSON.parse(saved);
      const customLimit = customLimits[fileType.toUpperCase()];
      if (customLimit !== null && customLimit !== undefined && customLimit > 0) {
        // Clamp between MIN and MAX
        return Math.max(
          APP_CONFIG.FILE_SIZE_LIMITS.MIN,
          Math.min(customLimit, APP_CONFIG.FILE_SIZE_LIMITS.MAX)
        );
      }
    }
  } catch (e) {
    logger.warn('Failed to load custom file size limits:', e);
  }
  
  // Return default limit for file type
  return APP_CONFIG.FILE_SIZE_LIMITS[fileType.toUpperCase() as 'CSV' | 'JSON' | 'XLSX'] || APP_CONFIG.FILE_SIZE_LIMITS.DEFAULT;
};

// Format file size for display
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  FILE_TOO_LARGE: (size: number, limit: number) => 
    `File size (${formatFileSize(size)}) exceeds the limit of ${formatFileSize(limit)}`,
  UNSUPPORTED_FILE_TYPE: `Supported file types: ${APP_CONFIG.SUPPORTED_FILE_TYPES.join(', ')}`,
} as const;

export const SUCCESS_MESSAGES = {
  DATA_SAVED: 'Data saved successfully',
  DATA_IMPORTED: 'Data imported successfully',
  DATA_EXPORTED: 'Data exported successfully',
  ITEM_CREATED: 'Item created successfully',
  ITEM_UPDATED: 'Item updated successfully',
  ITEM_DELETED: 'Item deleted successfully',
} as const;

