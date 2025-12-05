/**
 * Storage Service for CyberSoluce Lite
 * Handles localStorage persistence for data inventory and assets
 */

import { APP_CONFIG } from '../utils/constantsLite';
import { DataInventoryItem } from '../types/dataInventory';
import { LiteAsset } from '../types/assetLite';

export class StorageService {
  /**
   * Data Inventory Operations
   */
  static getDataInventory(): DataInventoryItem[] {
    try {
      const stored = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.DATA_INVENTORY);
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
      console.error('Error loading data inventory:', error);
      return [];
    }
  }

  static saveDataInventory(items: DataInventoryItem[]): void {
    try {
      localStorage.setItem(APP_CONFIG.STORAGE_KEYS.DATA_INVENTORY, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving data inventory:', error);
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
      const stored = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.ASSETS);
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
      console.error('Error loading assets:', error);
      return [];
    }
  }

  static saveAssets(assets: LiteAsset[]): void {
    try {
      localStorage.setItem(APP_CONFIG.STORAGE_KEYS.ASSETS, JSON.stringify(assets));
    } catch (error) {
      console.error('Error saving assets:', error);
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
    localStorage.removeItem(APP_CONFIG.STORAGE_KEYS.DATA_INVENTORY);
    localStorage.removeItem(APP_CONFIG.STORAGE_KEYS.ASSETS);
    localStorage.removeItem(APP_CONFIG.STORAGE_KEYS.SETTINGS);
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

