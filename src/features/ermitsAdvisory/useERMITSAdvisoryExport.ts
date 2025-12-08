import { useState, useEffect } from 'react';
import { exportToERMITSAdvisory, ERMITSAdvisoryExport } from '../../exports/toERMITSAdvisory';
import { useAssetInventory } from '../../contexts/AssetInventoryContext';
import { Dependency } from '../../types/dependency';
import { FocusSignal } from '../../types/enrichment';
import { logger } from '../../utils/logger';

/**
 * Hook to fetch ERMITS Advisory export data
 * 
 * Uses existing assets from AssetInventoryContext and exports them to ERMITS Advisory format.
 */
export function useERMITSAdvisoryExport() {
  const { assets } = useAssetInventory();
  const [exportPayload, setExportPayload] = useState<ERMITSAdvisoryExport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchExport = async () => {
      if (!assets || assets.length === 0) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // For now, we'll use empty arrays for dependencies and signals
        // In a real implementation, these would come from their respective contexts/stores
        const dependencies: Dependency[] = [];
        const signals: FocusSignal[] = [];

        const payload = await exportToERMITSAdvisory(assets, dependencies, signals);
        setExportPayload(payload);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to export to ERMITS Advisory');
        setError(error);
        logger.error('Error exporting to ERMITS Advisory', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExport();
  }, [assets]);

  return { exportPayload, loading, error };
}

