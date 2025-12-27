/**
 * Storage Service for CyberSoluce Lite
 * Handles localStorage persistence for data inventory and assets
 * Enhanced with workspace isolation support (migrated from Lite version)
 */

import { APP_CONFIG } from '../utils/constantsLite';
import { DataInventoryItem } from '../types/dataInventory';
import { LiteAsset } from '../types/assetLite';
import { logger } from '../utils/logger';

export class StorageService {
  /**
   * Get workspace ID (for multi-tenant isolation)
   * Defaults to 'default' for single-tenant use
   */
  private static getWorkspaceId(): string {
    try {
      const workspaceId = localStorage.getItem(`${APP_CONFIG.STORAGE_KEYS.SETTINGS}-workspace-id`);
      return workspaceId || 'default';
    } catch {
      return 'default';
    }
  }

  /**
   * Get storage key with workspace prefix
   */
  private static getStorageKey(key: string): string {
    const workspaceId = this.getWorkspaceId();
    return `${workspaceId}-${key}`;
  }

  /**
   * Set workspace ID (for multi-tenant isolation)
   */
  static setWorkspaceId(workspaceId: string): void {
    try {
      localStorage.setItem(`${APP_CONFIG.STORAGE_KEYS.SETTINGS}-workspace-id`, workspaceId);
    } catch (error) {
      logger.error('Error setting workspace ID', error instanceof Error ? error : new Error(String(error)));
    }
  }

  /**
   * Verify data persistence
   */
  static verifyPersistence(): {
    assets: boolean;
    dependencies: boolean;
    dataInventory: boolean;
    settings: boolean;
  } {
    try {
      // Check if we can read/write to localStorage
      const testKey = 'cybersoluce-persistence-test';
      localStorage.setItem(testKey, 'test');
      const canWrite = localStorage.getItem(testKey) === 'test';
      localStorage.removeItem(testKey);

      if (!canWrite) {
        return {
          assets: false,
          dependencies: false,
          dataInventory: false,
          settings: false,
        };
      }

      // Check if data exists (null is OK, means empty but accessible)
      const assets = localStorage.getItem(this.getStorageKey(APP_CONFIG.STORAGE_KEYS.ASSETS));
      const dependencies = localStorage.getItem(this.getStorageKey(APP_CONFIG.STORAGE_KEYS.DEPENDENCIES));
      const dataInventory = localStorage.getItem(this.getStorageKey(APP_CONFIG.STORAGE_KEYS.DATA_INVENTORY));
      const settings = localStorage.getItem(this.getStorageKey(APP_CONFIG.STORAGE_KEYS.SETTINGS));

      // Return true if key exists (even if empty array) or if we can access localStorage
      return {
        assets: assets !== null || canWrite,
        dependencies: dependencies !== null || canWrite,
        dataInventory: dataInventory !== null || canWrite,
        settings: settings !== null || canWrite,
      };
    } catch {
      return {
        assets: false,
        dependencies: false,
        dataInventory: false,
        settings: false,
      };
    }
  }

  /**
   * Data Inventory Operations
   */
  static getDataInventory(): DataInventoryItem[] {
    try {
      const stored = localStorage.getItem(this.getStorageKey(APP_CONFIG.STORAGE_KEYS.DATA_INVENTORY));
      if (!stored) return [];
      
      const items = JSON.parse(stored) as Partial<DataInventoryItem>[];
      return items
        .filter((item): item is DataInventoryItem => item.id !== undefined)
        .map((item) => ({
          ...item,
          id: item.id!,
          createdAt: new Date(item.createdAt || Date.now()),
          updatedAt: new Date(item.updatedAt || Date.now()),
        } as DataInventoryItem));
    } catch (error) {
      logger.error('Error loading data inventory', error instanceof Error ? error : new Error(String(error)));
      return [];
    }
  }

  static saveDataInventory(items: DataInventoryItem[]): void {
    try {
      localStorage.setItem(this.getStorageKey(APP_CONFIG.STORAGE_KEYS.DATA_INVENTORY), JSON.stringify(items));
    } catch (error) {
      logger.error('Error saving data inventory', error instanceof Error ? error : new Error(String(error)));
      throw new Error('Failed to save data inventory');
    }
  }

  static addDataInventoryItem(item: DataInventoryItem): void {
    const items = this.getDataInventory();
    items.push(item);
    this.saveDataInventory(items);
  }

  static updateDataInventoryItem(id: string, updates: Partial<DataInventoryItem>): void {
    const items = this.getDataInventory();
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
      const existingItem = items[index];
      if (existingItem) {
        items[index] = {
          ...existingItem,
          ...updates,
          id: existingItem.id, // Ensure id is preserved
          updatedAt: new Date(),
        } as DataInventoryItem;
        this.saveDataInventory(items);
      }
    }
  }

  static deleteDataInventoryItem(id: string): void {
    const items = this.getDataInventory();
    const filtered = items.filter(item => item.id !== id);
    this.saveDataInventory(filtered);
  }

  /**
   * Asset Operations
   */
  static getAssets(): LiteAsset[] {
    try {
      const stored = localStorage.getItem(this.getStorageKey(APP_CONFIG.STORAGE_KEYS.ASSETS));
      if (!stored) return [];
      
      const assets = JSON.parse(stored) as Partial<LiteAsset>[];
      return assets
        .filter((asset): asset is LiteAsset => asset.id !== undefined)
        .map((asset) => ({
          ...asset,
          id: asset.id!,
          createdAt: new Date(asset.createdAt || Date.now()),
          updatedAt: new Date(asset.updatedAt || Date.now()),
        } as LiteAsset));
    } catch (error) {
      logger.error('Error loading assets', error instanceof Error ? error : new Error(String(error)));
      return [];
    }
  }

  static saveAssets(assets: LiteAsset[]): void {
    try {
      localStorage.setItem(this.getStorageKey(APP_CONFIG.STORAGE_KEYS.ASSETS), JSON.stringify(assets));
    } catch (error) {
      logger.error('Error saving assets', error instanceof Error ? error : new Error(String(error)));
      throw new Error('Failed to save assets');
    }
  }

  static addAsset(asset: LiteAsset): void {
    const assets = this.getAssets();
    assets.push(asset);
    this.saveAssets(assets);
  }

  static updateAsset(id: string, updates: Partial<LiteAsset>): void {
    const assets = this.getAssets();
    const index = assets.findIndex(asset => asset.id === id);
    if (index !== -1) {
      const existingAsset = assets[index];
      if (existingAsset) {
        assets[index] = {
          ...existingAsset,
          ...updates,
          id: existingAsset.id, // Ensure id is preserved
          updatedAt: new Date(),
        } as LiteAsset;
        this.saveAssets(assets);
      }
    }
  }

  static deleteAsset(id: string): void {
    const assets = this.getAssets();
    const filtered = assets.filter(asset => asset.id !== id);
    this.saveAssets(filtered);
  }

  /**
   * Clear all data
   */
  static clearAll(): void {
    localStorage.removeItem(this.getStorageKey(APP_CONFIG.STORAGE_KEYS.DATA_INVENTORY));
    localStorage.removeItem(this.getStorageKey(APP_CONFIG.STORAGE_KEYS.ASSETS));
    localStorage.removeItem(this.getStorageKey(APP_CONFIG.STORAGE_KEYS.SETTINGS));
  }

  /**
   * Clear session data only (not persistent data)
   * Used for logout - preserves user data
   */
  static clearSession(): void {
    // Only clear session-specific data, not user data
    // In a real app, this would clear auth tokens, etc.
    // For now, we preserve all data as per requirements
  }

  /**
   * Export all data
   */
  static exportAll(): { dataInventory: DataInventoryItem[]; assets: LiteAsset[] } {
    return {
      dataInventory: this.getDataInventory(),
      assets: this.getAssets(),
    };
  }

  /**
   * Import data
   */
  static importAll(data: { dataInventory?: DataInventoryItem[]; assets?: LiteAsset[] }): void {
    if (data.dataInventory) {
      this.saveDataInventory(data.dataInventory);
    }
    if (data.assets) {
      this.saveAssets(data.assets);
    }
  }
}

