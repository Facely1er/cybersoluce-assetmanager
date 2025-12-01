/**
 * Feature Gating Utilities for CyberSoluce AssetManager
 * Uses shared feature gating logic
 */

import { PRODUCTS, FEATURE_FLAGS, canAccessFeature, getUsageLimit } from '../config/stripe';
import { checkFeatureAccess, checkUsageLimit } from '@/shared-utils/feature-gating';

// Re-export shared utilities with platform-specific types
export function checkFeature(userTier: string, feature: string): boolean {
  return checkFeatureAccess(userTier, feature, FEATURE_FLAGS);
}

export function checkLimit(
  userTier: string,
  resource: string,
  currentUsage: number
): { allowed: boolean; limit: number | boolean; remaining: number | null } {
  const limits: Record<string, Record<string, number | boolean>> = {
    free: PRODUCTS.free.limits,
    professional: PRODUCTS.professional.limits,
    enterprise: PRODUCTS.enterprise.limits,
  };
  
  return checkUsageLimit(userTier, resource, currentUsage, limits);
}

// Platform-specific feature checks
export function canAddAsset(userTier: string, currentAssetCount: number): boolean {
  const limit = getUsageLimit(userTier as keyof typeof PRODUCTS, 'assets');
  if (limit === -1) return true;
  return currentAssetCount < (limit as number);
}

export function canUseAPI(userTier: string): boolean {
  return checkFeature(userTier, 'api_access');
}

export function canUseComplianceReports(userTier: string): boolean {
  return checkFeature(userTier, 'compliance_reporting');
}

export function canUseAdvancedAnalytics(userTier: string): boolean {
  return checkFeature(userTier, 'advanced_analytics');
}

export function canUseCustomIntegrations(userTier: string): boolean {
  return checkFeature(userTier, 'custom_integrations');
}

export function canUseSSO(userTier: string): boolean {
  return checkFeature(userTier, 'sso_saml');
}

// Usage limit checks
export function getAssetLimit(userTier: string): number {
  const limit = getUsageLimit(userTier as keyof typeof PRODUCTS, 'assets');
  return typeof limit === 'number' ? limit : -1;
}

export function getUserLimit(userTier: string): number {
  const limit = getUsageLimit(userTier as keyof typeof PRODUCTS, 'users');
  return typeof limit === 'number' ? limit : -1;
}

export function getAPICallLimit(userTier: string): number {
  const limit = getUsageLimit(userTier as keyof typeof PRODUCTS, 'api_calls');
  return typeof limit === 'number' ? limit : 0;
}

