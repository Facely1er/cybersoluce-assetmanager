import React from 'react';
import { Search, Download, Upload, Plus, Trash2, Edit3, Shield, Building2, Filter, BarChart3, TrendingUp, FileText, Database } from 'lucide-react';
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
  onInsightsDashboard?: () => void;
  onAdvancedVisualization?: () => void;
  onAutomatedReporting?: () => void;
  onExternalIntegration?: () => void;
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
  onInsightsDashboard,
  onAdvancedVisualization,
  onAutomatedReporting,
  onExternalIntegration,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Shield className="h-8 w-8 text-command-blue-600 dark:text-command-blue-400" />
          <div>
            <h1 className="text-lg font-outfit font-semibold text-gray-900 dark:text-white leading-tight tracking-tight">
              CyberSoluce<sup className="text-[10px] font-semibold">™</sup>
            </h1>
            <p className="text-base font-bold text-gray-900 dark:text-white leading-tight">Asset Manager</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 tracking-wide">by ERMITS</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {onInsightsDashboard && (
            <button
              onClick={onInsightsDashboard}
              className="inline-flex items-center px-4 py-2 border border-green-300 dark:border-green-700 rounded-lg text-sm font-medium text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Insights
            </button>
          )}
          
          {onAdvancedVisualization && (
            <button
              onClick={onAdvancedVisualization}
              className="inline-flex items-center px-4 py-2 border border-indigo-300 dark:border-indigo-700 rounded-lg text-sm font-medium text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Analytics
            </button>
          )}
          
          {onAutomatedReporting && (
            <button
              onClick={onAutomatedReporting}
              className="inline-flex items-center px-4 py-2 border border-orange-300 dark:border-orange-700 rounded-lg text-sm font-medium text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            >
              <FileText className="h-4 w-4 mr-2" />
              Reports
            </button>
          )}
          
          {onExternalIntegration && (
            <button
              onClick={onExternalIntegration}
              className="inline-flex items-center px-4 py-2 border border-cyan-300 dark:border-cyan-700 rounded-lg text-sm font-medium text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/20 hover:bg-cyan-100 dark:hover:bg-cyan-900/30 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
            >
              <Database className="h-4 w-4 mr-2" />
              Integrations
            </button>
          )}
          
          {onAdvancedFilters && (
            <button
              onClick={onAdvancedFilters}
              className="inline-flex items-center px-4 py-2 border border-purple-300 dark:border-purple-700 rounded-lg text-sm font-medium text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
            >
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filters
            </button>
          )}
          
          {onGenerateInventory && (
            <button
              onClick={onGenerateInventory}
              className="inline-flex items-center px-4 py-2 border border-command-blue-300 dark:border-command-blue-700 rounded-lg text-sm font-medium text-command-blue-700 dark:text-command-blue-400 bg-command-blue-50 dark:bg-command-blue-900/20 hover:bg-command-blue-100 dark:hover:bg-command-blue-900/30 focus:outline-none focus:ring-2 focus:ring-command-blue-500 focus:border-command-blue-500 transition-colors"
            >
              <Building2 className="h-4 w-4 mr-2" />
              Generate Inventory
            </button>
          )}
          
          <button
            onClick={onExport}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-command-blue-500 focus:border-command-blue-500 transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          
          <button
            onClick={onImport}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-command-blue-500 focus:border-command-blue-500 transition-colors"
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
              <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search assets by name, description, owner, location, tags..."
              value={filters.search}
              onChange={(e) => updateFilters({ search: e.target.value })}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 dark:focus:placeholder-gray-500 focus:ring-2 focus:ring-command-blue-500 focus:border-command-blue-500 sm:text-sm transition-colors"
            />
          </div>
        </div>

        {selectedAssets.length > 0 && (
          <div className="flex items-center space-x-3 ml-6">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {selectedAssets.length} asset{selectedAssets.length !== 1 ? 's' : ''} selected
            </span>
            
            <button
              onClick={onBulkEdit}
              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-command-blue-500 focus:border-command-blue-500 transition-colors"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Edit
            </button>
            
            <button
              onClick={onBulkDelete}
              className="inline-flex items-center px-3 py-2 border border-red-300 dark:border-red-700 rounded-lg text-sm font-medium text-red-700 dark:text-red-400 bg-white dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
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