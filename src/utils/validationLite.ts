import { APP_CONFIG } from './constantsLite';
import { DataInventoryItem } from '../types/dataInventory';
import { LiteAsset } from '../types/assetLite';

export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '')
    .substring(0, APP_CONFIG.SEARCH.MAX_SEARCH_LENGTH);
};

export const validateSearchQuery = (query: string): boolean => {
  if (!query || typeof query !== 'string') return false;
  
  const sanitized = sanitizeInput(query);
  
  if (sanitized.length < APP_CONFIG.SEARCH.MIN_SEARCH_LENGTH) return false;
  
  const maliciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /eval\s*\(/i,
  ];
  
  return !maliciousPatterns.some(pattern => pattern.test(sanitized));
};

export const validateDataInventoryItem = (item: Partial<DataInventoryItem>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!item.name || item.name.trim().length === 0) {
    errors.push('Name is required');
  }
  
  if (!item.dataType) {
    errors.push('Data type is required');
  }
  
  if (!item.classification) {
    errors.push('Classification is required');
  }
  
  if (!item.owner || item.owner.trim().length === 0) {
    errors.push('Owner is required');
  }
  
  if (!item.location || item.location.trim().length === 0) {
    errors.push('Location is required');
  }
  
  if (item.tags && Array.isArray(item.tags)) {
    if (item.tags.length > APP_CONFIG.DATA_LIMITS.MAX_TAGS) {
      errors.push(`Maximum ${APP_CONFIG.DATA_LIMITS.MAX_TAGS} tags allowed`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateAsset = (asset: Partial<LiteAsset>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!asset.name || asset.name.trim().length === 0) {
    errors.push('Name is required');
  }
  
  if (!asset.type) {
    errors.push('Type is required');
  }
  
  if (!asset.criticality) {
    errors.push('Criticality is required');
  }
  
  if (!asset.owner || asset.owner.trim().length === 0) {
    errors.push('Owner is required');
  }
  
  if (!asset.location || asset.location.trim().length === 0) {
    errors.push('Location is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

