/**
 * CSV Asset Import Panel
 * 
 * Simple UI for importing CSV assets and recording signal history.
 */

import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { importCsvAssets } from '@/services/csvImportService';
import { getCurrentUser } from '@/lib/supabase';
import toast from 'react-hot-toast';

export interface CsvAssetImportPanelProps {
  onImportComplete?: () => void;
}

export const CsvAssetImportPanel: React.FC<CsvAssetImportPanelProps> = ({
  onImportComplete,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [sourceLabel, setSourceLabel] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<{ batchId: string; assetCount: number; vendorLinkedAssets: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        setError(null);
        setResult(null);
      } else {
        setError('Please select a CSV file.');
        setFile(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError('Please select a CSV file.');
      return;
    }

    if (!sourceLabel.trim()) {
      setError('Please provide a source label for this import.');
      return;
    }

    setIsUploading(true);
    setError(null);
    setResult(null);

    try {
      // Read file content
      const content = await file.text();

      // Get current user for created_by
      const user = await getCurrentUser();
      const createdBy = user?.email || user?.id || undefined;

      // Import CSV
      const importResult = await importCsvAssets(content, sourceLabel, createdBy);

      setResult(importResult);
      toast.success(`Successfully imported ${importResult.assetCount} assets`);
      
      // Reset form
      setFile(null);
      setSourceLabel('');
      if (e.target instanceof HTMLFormElement) {
        e.target.reset();
      }

      // Notify parent
      if (onImportComplete) {
        onImportComplete();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to import CSV file.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Import Assets from CSV
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Upload a CSV file to import assets and establish visibility. Each import creates a signal history snapshot.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="sourceLabel" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Source Label <span className="text-red-500">*</span>
          </label>
          <input
            id="sourceLabel"
            type="text"
            value={sourceLabel}
            onChange={(e) => setSourceLabel(e.target.value)}
            placeholder="e.g., CustomerX CSV 2025-12-02"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-command-blue-500 focus:border-transparent"
            required
            disabled={isUploading}
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            A descriptive label for this import batch
          </p>
        </div>

        <div>
          <label htmlFor="csvFile" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            CSV File <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center space-x-4">
            <label
              htmlFor="csvFile"
              className="flex-1 flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-command-blue-500 transition-colors"
            >
              <div className="flex flex-col items-center space-y-2">
                <Upload className="h-8 w-8 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {file ? file.name : 'Click to select CSV file'}
                </span>
              </div>
              <input
                id="csvFile"
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileChange}
                className="hidden"
                disabled={isUploading}
              />
            </label>
          </div>
          {file && (
            <div className="mt-2 flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <FileText className="h-4 w-4" />
              <span>{file.name} ({(file.size / 1024).toFixed(2)} KB)</span>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-red-900 dark:text-red-200">Import Error</h3>
              <p className="text-sm text-red-800 dark:text-red-300 mt-1">{error}</p>
            </div>
          </div>
        )}

        {result && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-green-900 dark:text-green-200">Import Successful</h3>
              <div className="text-sm text-green-800 dark:text-green-300 mt-1 space-y-1">
                <p>• {result.assetCount} assets imported</p>
                <p>• {result.vendorLinkedAssets} assets linked to vendors</p>
                <p className="text-xs mt-2">Batch ID: {result.batchId}</p>
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={!file || !sourceLabel.trim() || isUploading}
          className="w-full px-4 py-2 bg-command-blue-600 text-white rounded-lg font-semibold hover:bg-command-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Importing...</span>
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              <span>Import CSV</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">CSV Format</h3>
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
          Required columns: <code className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">asset_id</code>, <code className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">asset_name</code>
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Optional columns: <code className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">asset_type</code>, <code className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">business_role</code>, <code className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">vendor_name</code>, <code className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">owner_team</code>, <code className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">environment</code>
        </p>
      </div>
    </div>
  );
};

