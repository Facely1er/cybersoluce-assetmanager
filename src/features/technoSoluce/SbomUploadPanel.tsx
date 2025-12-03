/**
 * SBOM Upload Panel
 * 
 * UI for uploading SBOM files and linking them to assets.
 */

import React, { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, Package } from 'lucide-react';
import { uploadSBOM } from '@/services/sbomUploadService';
import { getCurrentUser } from '@/lib/supabase';
import toast from 'react-hot-toast';

export interface SbomUploadPanelProps {
  availableAssetIds?: string[]; // Optional list of asset IDs for selector
  onUploadComplete?: () => void;
}

export const SbomUploadPanel: React.FC<SbomUploadPanelProps> = ({
  availableAssetIds = [],
  onUploadComplete,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [sourceLabel, setSourceLabel] = useState('');
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);
  const [customAssetId, setCustomAssetId] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<{ batchId: string; sbomId: string; componentsCount: number; linkedAssetIds: string[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Accept JSON files (SPDX and CycloneDX are typically JSON)
      const validTypes = ['application/json', 'text/json', 'text/plain'];
      const validExtensions = ['.json', '.spdx', '.xml'];
      const fileExtension = selectedFile.name.toLowerCase().substring(selectedFile.name.lastIndexOf('.'));

      if (
        validTypes.includes(selectedFile.type) ||
        validExtensions.some(ext => selectedFile.name.toLowerCase().endsWith(ext))
      ) {
        setFile(selectedFile);
        setError(null);
        setResult(null);
      } else {
        setError('Please select a valid SBOM file (JSON, SPDX, or XML format).');
        setFile(null);
      }
    }
  };

  const handleAssetIdToggle = (assetId: string) => {
    setSelectedAssetIds(prev => {
      if (prev.includes(assetId)) {
        return prev.filter(id => id !== assetId);
      } else {
        return [...prev, assetId];
      }
    });
  };

  const handleAddCustomAssetId = () => {
    if (customAssetId.trim() && !selectedAssetIds.includes(customAssetId.trim())) {
      setSelectedAssetIds(prev => [...prev, customAssetId.trim()]);
      setCustomAssetId('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError('Please select an SBOM file.');
      return;
    }

    if (!sourceLabel.trim()) {
      setError('Please provide a source label for this SBOM.');
      return;
    }

    const linkedAssetIds = selectedAssetIds.length > 0 ? selectedAssetIds : [];
    if (linkedAssetIds.length === 0) {
      setError('Please select at least one asset to link this SBOM to.');
      return;
    }

    setIsUploading(true);
    setError(null);
    setResult(null);

    try {
      // Get current user for created_by
      const user = await getCurrentUser();
      const createdBy = user?.email || user?.id || undefined;

      // Upload SBOM
      const uploadResult = await uploadSBOM(file, sourceLabel, linkedAssetIds, createdBy);

      setResult(uploadResult);
      toast.success(`Successfully uploaded SBOM with ${uploadResult.componentsCount} components`);
      
      // Reset form
      setFile(null);
      setSourceLabel('');
      setSelectedAssetIds([]);
      setCustomAssetId('');
      if (e.target instanceof HTMLFormElement) {
        e.target.reset();
      }

      // Notify parent
      if (onUploadComplete) {
        onUploadComplete();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload SBOM file.';
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
          Upload SBOM
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Upload an SBOM file (SPDX or CycloneDX format) to establish software composition visibility for assets.
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
            placeholder="e.g., Repo foo-service SBOM"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-command-blue-500 focus:border-transparent"
            required
            disabled={isUploading}
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            A descriptive label for this SBOM upload
          </p>
        </div>

        <div>
          <label htmlFor="sbomFile" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            SBOM File <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center space-x-4">
            <label
              htmlFor="sbomFile"
              className="flex-1 flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-command-blue-500 transition-colors"
            >
              <div className="flex flex-col items-center space-y-2">
                <Package className="h-8 w-8 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {file ? file.name : 'Click to select SBOM file (JSON, SPDX, XML)'}
                </span>
              </div>
              <input
                id="sbomFile"
                type="file"
                accept=".json,.spdx,.xml,application/json,text/json"
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

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Link to Assets <span className="text-red-500">*</span>
          </label>
          
          {availableAssetIds.length > 0 ? (
            <div className="space-y-2">
              <div className="max-h-40 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg p-2 space-y-1">
                {availableAssetIds.map(assetId => (
                  <label
                    key={assetId}
                    className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedAssetIds.includes(assetId)}
                      onChange={() => handleAssetIdToggle(assetId)}
                      disabled={isUploading}
                      className="rounded border-gray-300 text-command-blue-600 focus:ring-command-blue-500"
                    />
                    <span className="text-sm text-gray-900 dark:text-white">{assetId}</span>
                  </label>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              No assets available. Enter asset IDs manually below.
            </p>
          )}

          <div className="mt-2 flex space-x-2">
            <input
              type="text"
              value={customAssetId}
              onChange={(e) => setCustomAssetId(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddCustomAssetId();
                }
              }}
              placeholder="Enter asset ID"
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-command-blue-500 focus:border-transparent"
              disabled={isUploading}
            />
            <button
              type="button"
              onClick={handleAddCustomAssetId}
              disabled={!customAssetId.trim() || isUploading}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Add
            </button>
          </div>

          {selectedAssetIds.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedAssetIds.map(assetId => (
                <span
                  key={assetId}
                  className="inline-flex items-center px-2 py-1 bg-command-blue-100 dark:bg-command-blue-900 text-command-blue-800 dark:text-command-blue-200 rounded text-sm"
                >
                  {assetId}
                  <button
                    type="button"
                    onClick={() => handleAssetIdToggle(assetId)}
                    disabled={isUploading}
                    className="ml-2 text-command-blue-600 dark:text-command-blue-400 hover:text-command-blue-800 dark:hover:text-command-blue-200"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-red-900 dark:text-red-200">Upload Error</h3>
              <p className="text-sm text-red-800 dark:text-red-300 mt-1">{error}</p>
            </div>
          </div>
        )}

        {result && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-green-900 dark:text-green-200">Upload Successful</h3>
              <div className="text-sm text-green-800 dark:text-green-300 mt-1 space-y-1">
                <p>• {result.componentsCount} components recognized</p>
                <p>• Linked to {result.linkedAssetIds.length} asset(s)</p>
                <p className="text-xs mt-2">SBOM ID: {result.sbomId}</p>
                <p className="text-xs">Batch ID: {result.batchId}</p>
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={!file || !sourceLabel.trim() || selectedAssetIds.length === 0 || isUploading}
          className="w-full px-4 py-2 bg-command-blue-600 text-white rounded-lg font-semibold hover:bg-command-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              <span>Upload SBOM</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Supported Formats</h3>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          SPDX (JSON or tag-value) and CycloneDX (JSON or XML) formats are supported. The SBOM will be parsed to extract component metadata and establish software composition visibility.
        </p>
      </div>
    </div>
  );
};

