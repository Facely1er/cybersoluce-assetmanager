import React from 'react';
import { Search, Download, Upload, Plus, Trash2, Edit3, Shield, Building2, Filter } from 'lucide-react';
import { AssetFilters } from '../types/asset';

interface AssetInventoryHeaderProps {
  filters: AssetFilters;
  updateFilters: (filters: Partial<AssetFilters>) => void;
  selectedAssets: string[];
  onBulkDelete: () => void;
  onBulkEdit: () => void;
  onExport: () => void;
  onImport: () => void;
  onAddAsset: () => void;
  onGenerateInventory?: () => void;
  onAdvancedFilters?: () => void;
}

export const AssetInventoryHeader: React.FC<AssetInventoryHeaderProps> = ({
  filters,
  updateFilters,
  selectedAssets,
  onBulkDelete,
  onBulkEdit,
  onExport,
  onImport,
  onAddAsset,
  onGenerateInventory,
  onAdvancedFilters,
}) => {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Shield className="h-8 w-8 text-command-blue-600" />
          <div>
            <h1 className="text-2xl font-outfit font-bold text-gray-900">
              ERMITS CyberSoluce®
            </h1>
            <p className="text-sm text-gray-600">Asset Inventory Management</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {onAdvancedFilters && (
            <button
              onClick={onAdvancedFilters}
              className="inline-flex items-center px-4 py-2 border border-purple-300 rounded-lg text-sm font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
            >
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filters
            </button>
          )}
          
          {onGenerateInventory && (
            <button
              onClick={onGenerateInventory}
              className="inline-flex items-center px-4 py-2 border border-command-blue-300 rounded-lg text-sm font-medium text-command-blue-700 bg-command-blue-50 hover:bg-command-blue-100 focus:outline-none focus:ring-2 focus:ring-command-blue-500 focus:border-command-blue-500 transition-colors"
            >
              <Building2 className="h-4 w-4 mr-2" />
              Generate Inventory
            </button>
          )}
          
          <button
            onClick={onExport}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-command-blue-500 focus:border-command-blue-500 transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          
          <button
            onClick={onImport}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-command-blue-500 focus:border-command-blue-500 transition-colors"
          >
            <Upload className="h-4 w-4 mr-2" />
            Import
          </button>
          
          <button
            onClick={onAddAsset}
            className="inline-flex items-center px-4 py-2 bg-command-blue-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-command-blue-700 focus:outline-none focus:ring-2 focus:ring-command-blue-500 focus:ring-offset-2 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Asset
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search assets by name, description, owner, location, tags..."
              value={filters.search}
              onChange={(e) => updateFilters({ search: e.target.value })}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-command-blue-500 focus:border-command-blue-500 sm:text-sm transition-colors"
            />
          </div>
        </div>

        {selectedAssets.length > 0 && (
          <div className="flex items-center space-x-3 ml-6">
            <span className="text-sm text-gray-700">
              {selectedAssets.length} asset{selectedAssets.length !== 1 ? 's' : ''} selected
            </span>
            
            <button
              onClick={onBulkEdit}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-command-blue-500 focus:border-command-blue-500 transition-colors"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Edit
            </button>
            
            <button
              onClick={onBulkDelete}
              className="inline-flex items-center px-3 py-2 border border-red-300 rounded-lg text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};