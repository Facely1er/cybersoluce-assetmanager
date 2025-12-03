import { useEffect, useState } from 'react';
import { buildVendorVisibilityWatchlist } from '../../vendorsoluce/watchlist/vendorWatchlistService';
import { VendorVisibilityItem } from '../../vendorsoluce/watchlist/vendorVisibilityMapper';
import { useVendorSoluceExport } from './useVendorSoluceExport';

export function VendorVisibilityWatchlistPanel() {
  const { exportPayload, loading, error } = useVendorSoluceExport();
  const [vendors, setVendors] = useState<VendorVisibilityItem[]>([]);

  useEffect(() => {
    if (!exportPayload?.driftHints) return;
    const list = buildVendorVisibilityWatchlist(exportPayload.driftHints);
    setVendors(list);
  }, [exportPayload]);

  if (loading) {
    return <p className="text-xs text-muted-foreground">Loading vendor visibility…</p>;
  }

  if (error) {
    return <p className="text-xs text-red-600">Unable to load vendor visibility.</p>;
  }

  const stable = vendors.filter(v => v.visibilityStatus === 'stable');
  const changing = vendors.filter(v => v.visibilityStatus === 'changing');
  const uncertain = vendors.filter(v => v.visibilityStatus === 'uncertain');
  const noHistory = vendors.filter(v => v.visibilityStatus === 'no-history');

  return (
    <section className="space-y-4">
      <header>
        <h2 className="text-sm font-semibold">Supplier Visibility Watchlist</h2>
        <p className="text-xs text-muted-foreground">
          This list highlights how stable or uncertain your visibility is across vendor-linked assets.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {renderBucket('Stable Visibility', stable,
          'Suppliers with consistently visible, well-understood asset relationships.')}

        {renderBucket('Changing Visibility', changing,
          'Suppliers whose technical or dependency visibility has recently changed.')}

        {renderBucket('Uncertain Visibility', uncertain,
          'Suppliers with fluctuating or unclear asset visibility over time.')}

        {renderBucket('No History Yet', noHistory,
          'Suppliers without sufficient historical visibility to assess changes.')}
      </div>
    </section>
  );
}

function renderBucket(
  title: string,
  items: VendorVisibilityItem[],
  description: string
) {
  return (
    <div className="border rounded-lg p-3">
      <h3 className="text-xs font-semibold mb-1">{title}</h3>
      <p className="text-[11px] text-muted-foreground mb-2">{description}</p>
      <ul className="space-y-1 max-h-48 overflow-auto text-[11px]">
        {items.map(v => (
          <li key={v.vendorId}>
            • {v.vendorName} ({v.relatedAssetIds.length} assets)
          </li>
        ))}
        {!items.length && (
          <li className="text-muted-foreground">None identified.</li>
        )}
      </ul>
    </div>
  );
}

