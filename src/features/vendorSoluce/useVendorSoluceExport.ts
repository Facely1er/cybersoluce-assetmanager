import { useState, useEffect } from 'react';
import { exportToVendorSoluce, VendorSoluceExport } from '../../exports/toVendorSoluce';
import { useAssetInventory } from '../../contexts/AssetInventoryContext';
import { Dependency } from '../../types/dependency';
import { FocusSignal } from '../../types/enrichment';

/**
 * Hook to fetch VendorSoluce export data
 * 
 * Uses existing assets from AssetInventoryContext and exports them to VendorSoluce format.
 */
export function useVendorSoluceExport() {
  const { assets } = useAssetInventory();
  const [exportPayload, setExportPayload] = useState<VendorSoluceExport | null>(null);
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

        const payload = await exportToVendorSoluce(assets, dependencies, signals);
        setExportPayload(payload);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to export to VendorSoluce');
        setError(error);
        console.error('Error exporting to VendorSoluce:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExport();
  }, [assets]);

  return { exportPayload, loading, error };
}

