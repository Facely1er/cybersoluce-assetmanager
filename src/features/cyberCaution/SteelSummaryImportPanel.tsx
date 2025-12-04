/**
 * STEEL Summary Import Panel
 * 
 * Minimal JSON import + display for STEEL readiness summaries from CyberCaution.
 * 
 * RULES:
 * - NO recomputation
 * - NO narratives
 * - NO diagnostic logic
 * - Only consume and display the summary
 */

import React, { useState } from 'react';
import type { SteelReadinessSummary } from '../steel';
import { Upload, FileText, AlertCircle } from 'lucide-react';

export function SteelSummaryImportPanel() {
  const [summary, setSummary] = useState<SteelReadinessSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setSummary(null);

    file.text()
      .then((text) => {
        try {
          const parsed = JSON.parse(text) as SteelReadinessSummary;
          
          // Basic validation
          if (!parsed.band || !parsed.keySignals || !parsed.generatedAt) {
            throw new Error('Invalid STEEL summary format. Missing required fields.');
          }
          
          if (!['low', 'medium', 'elevated', 'high'].includes(parsed.band)) {
            throw new Error('Invalid band value. Must be one of: low, medium, elevated, high');
          }
          
          setSummary(parsed);
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to parse JSON file.';
          setError(errorMessage);
        }
      })
      .catch(() => {
        setError('Failed to read file.');
      });
  }

  return (
    <div className="space-y-3">
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-4">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
          Import STEEL Readiness Summary
        </h2>
        <p className="text-xs text-muted-foreground mb-3">
          Upload a JSON summary file exported from CyberCaution.
        </p>
        
        <label
          htmlFor="steel-summary-file"
          className="flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-command-blue-500 transition-colors"
        >
          <div className="flex flex-col items-center space-y-2">
            <Upload className="h-6 w-6 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Click to select JSON file
            </span>
          </div>
          <input
            id="steel-summary-file"
            type="file"
            accept="application/json"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
        
        {error && (
          <div className="mt-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-start space-x-2">
            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-800 dark:text-red-300">{error}</p>
          </div>
        )}
      </div>

      {summary && (
        <div className="border rounded-md p-3 text-sm space-y-1 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <div className="font-semibold text-gray-900 dark:text-white">
            STEEL readiness band: {summary.band.toUpperCase()}
          </div>
          <div className="text-xs text-muted-foreground">
            Generated at: {new Date(summary.generatedAt).toLocaleString()}
          </div>
          {summary.source && (
            <div className="text-xs text-muted-foreground">
              Source: {summary.source}
            </div>
          )}
          {summary.keySignals.length > 0 && (
            <div className="mt-2">
              <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Key Signals:
              </div>
              <ul className="list-disc pl-4 space-y-0.5">
                {summary.keySignals.map((signal, idx) => (
                  <li key={idx} className="text-xs text-gray-600 dark:text-gray-400">
                    {signal}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

