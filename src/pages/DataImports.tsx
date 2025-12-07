/**
 * Data Imports Page
 * 
 * Page for importing CSV assets and uploading SBOM files.
 */

import React, { useState, useEffect } from 'react';
import { CsvAssetImportPanel } from '../features/import/CsvAssetImportPanel';
import { SbomUploadPanel } from '../features/technoSoluce/SbomUploadPanel';
import { TechnoSoluceSignalImportPanel } from '../features/technoSoluce/TechnoSoluceSignalImportPanel';
import { FileText, Package, Database, RefreshCw, Code } from 'lucide-react';
import { listImportBatches } from '../services/csvImportService';
import { supabase, isSupabaseEnabled } from '../lib/supabase';
import { useAssetInventory } from '../contexts/AssetInventoryContext';
import { logger } from '../utils/logger';

export default function DataImports() {
  const [activeTab, setActiveTab] = useState<'csv' | 'sbom' | 'technosoluce'>('csv');
  const [recentBatches, setRecentBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { assets } = useAssetInventory();
  
  // Get available asset IDs for SBOM upload
  const availableAssetIds = assets.map(asset => asset.id);

  const loadRecentBatches = async () => {
    if (!isSupabaseEnabled) return;
    
    setLoading(true);
    try {
      const batches = await listImportBatches(5);
      setRecentBatches(batches);
    } catch (error) {
      logger.error('Failed to load import batches', error instanceof Error ? error : new Error(String(error)));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecentBatches();
  }, []);

  const handleImportComplete = () => {
    loadRecentBatches();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-outfit font-bold text-gray-900 dark:text-white mb-2">
            Data Imports
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Import assets from CSV files or upload SBOM files to establish visibility and track signal history.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex space-x-4 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('csv')}
            className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
              activeTab === 'csv'
                ? 'border-command-blue-600 text-command-blue-600 dark:text-command-blue-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>CSV Asset Import</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('sbom')}
            className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
              activeTab === 'sbom'
                ? 'border-command-blue-600 text-command-blue-600 dark:text-command-blue-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>SBOM Upload</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('technosoluce')}
            className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
              activeTab === 'technosoluce'
                ? 'border-command-blue-600 text-command-blue-600 dark:text-command-blue-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Code className="h-5 w-5" />
              <span>TechnoSoluce Signals</span>
            </div>
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'csv' ? (
            <CsvAssetImportPanel onImportComplete={handleImportComplete} />
          ) : activeTab === 'sbom' ? (
            <SbomUploadPanel 
              availableAssetIds={availableAssetIds}
              onUploadComplete={handleImportComplete} 
            />
          ) : (
            <TechnoSoluceSignalImportPanel 
              onImportComplete={handleImportComplete} 
            />
          )}

          {/* Recent Imports */}
          {isSupabaseEnabled && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                  <Database className="h-5 w-5" />
                  <span>Recent Imports</span>
                </h2>
                <button
                  onClick={loadRecentBatches}
                  disabled={loading}
                  className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>

              {loading ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  Loading...
                </div>
              ) : recentBatches.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No import batches yet. Import CSV files or upload SBOM files to see history here.
                </div>
              ) : (
                <div className="space-y-3">
                  {recentBatches.map((batch) => (
                    <div
                      key={batch.id}
                      className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {batch.source_label}
                            </span>
                            <span className="px-2 py-0.5 text-xs bg-command-blue-100 dark:bg-command-blue-900 text-command-blue-800 dark:text-command-blue-200 rounded">
                              {batch.type}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(batch.created_at).toLocaleString()}
                            {batch.created_by && ` • ${batch.created_by}`}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {batch.id.substring(0, 8)}...
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Info Panel */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-6">
            <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-3">
              About Data Imports
            </h3>
            <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
              <li>• CSV imports create asset visibility snapshots and establish signal history</li>
              <li>• SBOM uploads link software composition data to assets for TechnoSoluce integration</li>
              <li>• TechnoSoluce signal imports bring in SBOM-derived visibility signals (signal-only, no risk data)</li>
              <li>• Each import creates a batch record for tracking and audit purposes</li>
              <li>• Signal history enables drift analysis and change-over-time intelligence</li>
              <li>• All imports are qualitative - no risk scoring or compliance assessment</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

