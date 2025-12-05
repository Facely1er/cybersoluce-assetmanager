/**
 * Hook for TechnoSoluce Export
 * 
 * Provides export functionality for TechnoSoluce integration.
 * Exports assets, dependencies, and signals relevant to software composition analysis.
 */

import { useState, useEffect, useCallback } from 'react';
import { exportToTechnoSoluce, TechnoSoluceExport } from '@/exports/toTechnoSoluce';
import { useAssetInventory } from '@/contexts/AssetInventoryContext';
import { signalDetectionService } from '@/services/signalDetectionService';
import { Dependency } from '@/types/dependency';
import { FocusSignal } from '@/types/enrichment';
import { logger } from '@/utils/logger';

export interface UseTechnoSoluceExportResult {
  exportPayload: TechnoSoluceExport | null;
  loading: boolean;
  error: string | null;
  exportToJson: () => string | null;
  downloadExport: () => void;
  refresh: () => void;
}

/**
 * Hook to generate and manage TechnoSoluce export
 */
export function useTechnoSoluceExport(): UseTechnoSoluceExportResult {
  const { assets } = useAssetInventory();
  
  const [exportPayload, setExportPayload] = useState<TechnoSoluceExport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateExport = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (!assets || assets.length === 0) {
        setExportPayload(null);
        setLoading(false);
        return;
      }

      // Filter to software-relevant assets
      const softwareAssets = assets.filter(asset =>
        asset.type === 'Application' ||
        asset.type === 'API' ||
        asset.type === 'Server' ||
        asset.type === 'Database' ||
        asset.type === 'Cloud Service'
      );

      // Detect signals for software assets
      const allSignals = await signalDetectionService.detectSignals(softwareAssets);
      
      // Filter to software domain signals
      const softwareSignals = allSignals.filter(s => s.signal_domain === 'software');

      // For now, use empty dependencies array
      // In a real implementation, dependencies would come from a dependencies context/service
      const dependencies: Dependency[] = [];

      // Generate export
      const payload = exportToTechnoSoluce(
        softwareAssets,
        dependencies,
        softwareSignals
      );

      setExportPayload(payload);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate export';
      setError(errorMessage);
      logger.error('Failed to generate TechnoSoluce export', err);
    } finally {
      setLoading(false);
    }
  }, [assets]);

  useEffect(() => {
    generateExport();
  }, [generateExport]);

  const exportToJson = useCallback((): string | null => {
    if (!exportPayload) return null;
    try {
      return JSON.stringify(exportPayload, null, 2);
    } catch (err) {
      logger.error('Failed to serialize export to JSON', err);
      return null;
    }
  }, [exportPayload]);

  const downloadExport = useCallback(() => {
    const json = exportToJson();
    if (!json) {
      setError('Unable to generate export file');
      return;
    }

    try {
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `technosoluce-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      logger.error('Failed to download export', err);
      setError('Failed to download export file');
    }
  }, [exportToJson]);

  return {
    exportPayload,
    loading,
    error,
    exportToJson,
    downloadExport,
    refresh: generateExport,
  };
}

