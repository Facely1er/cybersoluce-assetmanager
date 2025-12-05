export const APP_CONFIG = {
  NAME: 'CyberSoluce Lite',
  VERSION: '1.0.0',
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  SUPPORTED_FILE_TYPES: ['.csv', '.json'] as const,
  
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
    SETTINGS: 'cybersoluce-lite-settings'
  }
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  FILE_TOO_LARGE: `File size must be less than ${APP_CONFIG.MAX_FILE_SIZE / (1024 * 1024)}MB`,
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

