/**
 * DEMO-ONLY:
 * Manages demo asset data injection and isolation.
 * Ensures demo data never mixes with real organization data.
 */

import { Asset } from '../types/asset';
import { DemoAsset, SectorKey, OrgSize } from './sampleAssetInventoryGenerator';
import { useAssetInventory } from '../contexts/AssetInventoryContext';

export interface DemoDataOptions {
  sector: SectorKey;
  size: OrgSize;
}

export interface DemoContext {
  isDemoMode: boolean;
  sector?: SectorKey;
  size?: OrgSize;
  loadedAt?: Date;
}

// In-memory demo context (resets on page refresh)
let demoContext: DemoContext = {
  isDemoMode: false,
};

/**
 * Load demo assets into the application
 * Uses in-memory store approach - demo assets do not persist
 */
export function loadDemoAssets(
  assets: DemoAsset[],
  options?: DemoDataOptions
): void {
  // Mark all assets as demo
  const demoAssets: Asset[] = assets.map(asset => ({
    ...asset,
    tags: [...asset.tags, 'DEMO_ONLY_NOT_REAL'],
  }));

  // Store demo context
  demoContext = {
    isDemoMode: true,
    sector: options?.sector,
    size: options?.size,
    loadedAt: new Date(),
  };

  // Store in sessionStorage for persistence across page navigation
  // but clear on browser close
  try {
    sessionStorage.setItem('cybersoluce_demo_mode', JSON.stringify(demoContext));
    sessionStorage.setItem('cybersoluce_demo_assets', JSON.stringify(demoAssets));
  } catch (error) {
    console.warn('Failed to store demo data in sessionStorage:', error);
  }
}

/**
 * Get current demo context
 */
export function getDemoContext(): DemoContext {
  // Try to restore from sessionStorage
  try {
    const stored = sessionStorage.getItem('cybersoluce_demo_mode');
    if (stored) {
      const parsed = JSON.parse(stored);
      demoContext = {
        ...parsed,
        loadedAt: parsed.loadedAt ? new Date(parsed.loadedAt) : undefined,
      };
    }
  } catch (error) {
    console.warn('Failed to restore demo context from sessionStorage:', error);
  }

  return demoContext;
}

/**
 * Get demo assets from storage
 */
export function getDemoAssets(): Asset[] | null {
  try {
    const stored = sessionStorage.getItem('cybersoluce_demo_assets');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Failed to restore demo assets from sessionStorage:', error);
  }
  return null;
}

/**
 * Clear demo data
 */
export function clearDemoData(): void {
  demoContext = {
    isDemoMode: false,
  };

  try {
    sessionStorage.removeItem('cybersoluce_demo_mode');
    sessionStorage.removeItem('cybersoluce_demo_assets');
  } catch (error) {
    console.warn('Failed to clear demo data from sessionStorage:', error);
  }
}

/**
 * Check if currently in demo mode
 */
export function isDemoMode(): boolean {
  return getDemoContext().isDemoMode;
}

/**
 * Check if an asset is a demo asset
 */
export function isDemoAsset(asset: Asset): boolean {
  return asset.tags.includes('DEMO_ONLY_NOT_REAL') || 
         (asset as DemoAsset).demo === true;
}

