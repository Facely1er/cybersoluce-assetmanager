/**
 * TechnoSoluce Export Panel
 * 
 * UI for exporting assets and signals to TechnoSoluce for SBOM analysis.
 * 
 * RULES:
 * - Only exports factual data and qualitative signals
 * - No risk assessments or vulnerability data
 * - Software-relevant assets and dependencies only
 */

import React from 'react';
import { Code, Download, FileJson, CheckCircle, AlertCircle, Loader2, Package } from 'lucide-react';
import { useTechnoSoluceExport } from './useTechnoSoluceExport';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const TechnoSoluceExportPanel: React.FC = () => {
  const { exportPayload, loading, error, downloadExport, refresh } = useTechnoSoluceExport();

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-command-blue-600" />
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Generating export...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-red-900 dark:text-red-200">Export Error</h3>
              <p className="text-sm text-red-800 dark:text-red-300 mt-1">{error}</p>
              <Button
                onClick={refresh}
                variant="outline"
                size="sm"
                className="mt-2"
              >
                Try Again
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!exportPayload) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">No software assets available for export.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { manifest, assets, dependencies, signals } = exportPayload;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Code className="h-5 w-5 text-green-600 dark:text-green-400" />
            <CardTitle className="text-lg">Export to TechnoSoluce</CardTitle>
          </div>
          <Button
            onClick={downloadExport}
            className="flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Download JSON</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Export Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {assets.length}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Software Assets
            </div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {dependencies.length}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Dependencies
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {signals.length}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Software Signals
            </div>
          </div>
        </div>

        {/* Export Details */}
        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Export Details
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Handoff Intent:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {manifest.handoffIntent}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Next Question:</span>
                <span className="font-medium text-gray-900 dark:text-white text-right max-w-xs">
                  {manifest.nextQuestionPrompt}
                </span>
              </div>
            </div>
          </div>

          {/* Asset Types Included */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Asset Types Included
            </h3>
            <div className="flex flex-wrap gap-2">
              {['Application', 'API', 'Server', 'Database', 'Cloud Service'].map(type => {
                const count = assets.filter(a => a.type === type).length;
                if (count === 0) return null;
                return (
                  <span
                    key={type}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
                  >
                    {type} ({count})
                  </span>
                );
              })}
            </div>
          </div>

          {/* Signal Types */}
          {signals.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Signal Types
              </h3>
              <div className="space-y-1">
                {signals.map((signal, idx) => (
                  <div
                    key={idx}
                    className="text-xs text-gray-600 dark:text-gray-400 p-2 bg-gray-50 dark:bg-gray-800 rounded"
                  >
                    <div className="font-medium text-gray-900 dark:text-white">
                      {signal.signalType || 'Unknown'}
                    </div>
                    <div className="mt-1">{signal.description}</div>
                    {signal.concentrationDescription && (
                      <div className="mt-1 text-gray-500 dark:text-gray-500">
                        {signal.concentrationDescription}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Info Panel */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <FileJson className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-blue-800 dark:text-blue-300">
              <p className="font-medium mb-1">About This Export</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Contains software-relevant assets and dependencies</li>
                <li>Includes qualitative visibility signals only</li>
                <li>No risk assessments or vulnerability data included</li>
                <li>TechnoSoluce will analyze SBOMs and provide component visibility signals</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

