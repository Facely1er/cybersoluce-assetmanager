/**
 * TechnoSoluce Signal Import Panel
 * 
 * UI for importing SBOM-derived signals from TechnoSoluce.
 * 
 * RULES:
 * - Only signals are imported (never risk scores, vulnerabilities, or compliance status)
 * - Signals follow SBOMSignal contract
 * - All signals are qualitative visibility indicators only
 */

import React, { useState } from 'react';
import { Upload, FileJson, CheckCircle, AlertCircle, Loader2, Package } from 'lucide-react';
import { importTechnoSoluceSignalsFromJson } from '@/imports/fromTechnoSoluce';
import toast from 'react-hot-toast';

export interface TechnoSoluceSignalImportPanelProps {
  onImportComplete?: () => void;
}

export const TechnoSoluceSignalImportPanel: React.FC<TechnoSoluceSignalImportPanelProps> = ({
  onImportComplete,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [result, setResult] = useState<{ recorded: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Accept JSON files only
      const validTypes = ['application/json', 'text/json'];
      const validExtensions = ['.json'];

      if (
        validTypes.includes(selectedFile.type) ||
        validExtensions.some(ext => selectedFile.name.toLowerCase().endsWith(ext))
      ) {
        setFile(selectedFile);
        setError(null);
        setResult(null);
      } else {
        setError('Please select a valid JSON file containing TechnoSoluce signals.');
        setFile(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError('Please select a JSON file.');
      return;
    }

    setIsImporting(true);
    setError(null);
    setResult(null);

    try {
      // Read file content
      const jsonContent = await file.text();

      // Import signals
      const importResult = await importTechnoSoluceSignalsFromJson(jsonContent);

      if (importResult.success) {
        setResult({ recorded: importResult.recorded });
        toast.success(`Successfully imported ${importResult.recorded} signal snapshot(s) from TechnoSoluce`);
        
        // Reset form
        setFile(null);
        if (e.target instanceof HTMLFormElement) {
          e.target.reset();
        }

        // Notify parent
        if (onImportComplete) {
          onImportComplete();
        }
      } else {
        const errorMessage = importResult.errors.join('; ') || 'Failed to import signals.';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to import signals.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Import TechnoSoluce Signals
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Import SBOM-derived signals from TechnoSoluce. Only qualitative visibility signals are imported - no risk assessments or vulnerability data.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="technoSoluceSignalFile" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            TechnoSoluce Signal File (JSON) <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center space-x-4">
            <label
              htmlFor="technoSoluceSignalFile"
              className="flex-1 flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-command-blue-500 transition-colors"
            >
              <div className="flex flex-col items-center space-y-2">
                <Package className="h-8 w-8 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {file ? file.name : 'Click to select JSON file with TechnoSoluce signals'}
                </span>
              </div>
              <input
                id="technoSoluceSignalFile"
                type="file"
                accept=".json,application/json,text/json"
                onChange={handleFileChange}
                className="hidden"
                disabled={isImporting}
              />
            </label>
          </div>
          {file && (
            <div className="mt-2 flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <FileJson className="h-4 w-4" />
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
              <div className="text-sm text-green-800 dark:text-green-300 mt-1">
                <p>• {result.recorded} signal snapshot(s) recorded</p>
                <p className="text-xs mt-2 text-green-700 dark:text-green-400">
                  Signals have been added to signal history for the specified assets.
                </p>
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={!file || isImporting}
          className="w-full px-4 py-2 bg-command-blue-600 text-white rounded-lg font-semibold hover:bg-command-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
        >
          {isImporting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Importing...</span>
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              <span>Import Signals</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">About TechnoSoluce Signals</h3>
        <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <p>
            TechnoSoluce analyzes SBOMs and exports qualitative signals about software composition visibility.
          </p>
          <p className="mt-2 font-medium">Signal Types:</p>
          <ul className="list-disc pl-4 mt-1 space-y-0.5">
            <li>software-composition-known: Full visibility into software components</li>
            <li>software-composition-partial: Some visibility but incomplete</li>
            <li>software-composition-unknown: No SBOM data available</li>
            <li>component-churn-detected: Component count changes detected over time</li>
          </ul>
          <p className="mt-2 text-yellow-700 dark:text-yellow-400">
            Note: Only signals are imported. Risk assessments, vulnerabilities, and compliance status remain in TechnoSoluce.
          </p>
        </div>
      </div>
    </div>
  );
};

