import { Asset } from '../types/asset';

export interface ValidationError {
  field: string;
  message: string;
}

export const validateAsset = (asset: Partial<Asset>): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Required fields validation
  if (!asset.name?.trim()) {
    errors.push({ field: 'name', message: 'Asset name is required' });
  } else if (asset.name.length > 100) {
    errors.push({ field: 'name', message: 'Asset name must be less than 100 characters' });
  }

  if (!asset.type) {
    errors.push({ field: 'type', message: 'Asset type is required' });
  }

  if (!asset.criticality) {
    errors.push({ field: 'criticality', message: 'Criticality level is required' });
  }

  if (!asset.owner?.trim()) {
    errors.push({ field: 'owner', message: 'Asset owner is required' });
  }

  if (!asset.location?.trim()) {
    errors.push({ field: 'location', message: 'Asset location is required' });
  }

  // IP Address validation
  if (asset.ipAddress && asset.ipAddress.trim() && !isValidIPAddress(asset.ipAddress)) {
    errors.push({ field: 'ipAddress', message: 'Invalid IP address format' });
  }

  // Risk score validation
  if (asset.riskScore !== undefined) {
    if (isNaN(asset.riskScore) || asset.riskScore < 0 || asset.riskScore > 100) {
      errors.push({ field: 'riskScore', message: 'Risk score must be between 0 and 100' });
    }
  }

  // Description validation
  if (asset.description && asset.description.length > 500) {
    errors.push({ field: 'description', message: 'Description must be less than 500 characters' });
  }

  return errors;
};

export const isValidIPAddress = (ip: string): boolean => {
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const validateSearchQuery = (query: string): boolean => {
  // Prevent potential XSS or injection attacks
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+=/i,
    /data:/i
  ];
  
  return !dangerousPatterns.some(pattern => pattern.test(query));
};