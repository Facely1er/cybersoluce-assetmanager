# TODO – VendorSoluce "Supplier Visibility Watchlist" v1

## Objective

Surface a **VendorSoluce-facing feature** that answers one clear question:

> “Which suppliers have stable technical visibility, and which ones show changing or uncertain visibility over time?”

This feature:
- Uses existing **vendor-level drift hints** (already implemented).
- Introduces **NO risk scoring**, ratings, or compliance language.
- Is purely a **visibility prioritization surface**.

---

## 1) Vendor Visibility Readiness Model

### 1.1 Define readiness buckets for vendors

**File:** `src/vendorsoluce/watchlist/vendorVisibilityMapper.ts` (new)

```ts
import { DriftStatus } from '@/contracts/cyberSoluce.drift.contract';

export type VendorVisibilityStatus =
  | 'stable'
  | 'changing'
  | 'uncertain'
  | 'no-history';

export interface VendorVisibilityItem {
  vendorId: string;
  vendorName?: string;
  relatedAssetIds: string[];
  driftStatus: DriftStatus;
  visibilityStatus: VendorVisibilityStatus;
  summary: string;
  details: string[];
}
1.2 Map drift → visibility state
ts
Copy code
export function mapDriftToVendorVisibility(
  drift: DriftStatus
): VendorVisibilityStatus {
  switch (drift) {
    case 'stable-visibility':
      return 'stable';
    case 'emerging-change':
      return 'changing';
    case 'increasing-uncertainty':
    case 'high-variance':
      return 'uncertain';
    case 'no-history':
    default:
      return 'no-history';
  }
}
Terminology deliberately avoids “risk”, “rating”, or “posture”.

2) Vendor Watchlist Derivation Service
2.1 Build vendor visibility list from existing export data
File: src/vendorsoluce/watchlist/vendorWatchlistService.ts (new)

ts
Copy code
import { VendorSoluceDriftHint } from '@/contracts/vendorSoluce.driftHint.contract';
import {
  VendorVisibilityItem,
  mapDriftToVendorVisibility
} from './vendorVisibilityMapper';

export function buildVendorVisibilityWatchlist(
  driftHints: VendorSoluceDriftHint[]
): VendorVisibilityItem[] {
  return driftHints.map(hint => ({
    vendorId: hint.vendorId,
    vendorName: hint.vendorId, // swap for real vendor name if available
    relatedAssetIds: hint.relatedAssetIds,
    driftStatus: hint.status,
    visibilityStatus: mapDriftToVendorVisibility(hint.status),
    summary: hint.summary,
    details: hint.details,
  }));
}
No new computation, no history calls — this reuses the VendorSoluce drift layer exactly as designed.

3) VendorSoluce Watchlist Panel UI
3.1 Create Watchlist Panel
File: src/features/vendorSoluce/VendorVisibilityWatchlistPanel.tsx

tsx
Copy code
import { useEffect, useState } from 'react';
import { buildVendorVisibilityWatchlist } from '@/vendorsoluce/watchlist/vendorWatchlistService';
import { VendorVisibilityItem } from '@/vendorsoluce/watchlist/vendorVisibilityMapper';
import { useVendorSoluceExport } from '@/features/vendorSoluce/useVendorSoluceExport';

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
4) Page and Routing
4.1 Create VendorSoluce Watchlist Page
File: src/pages/VendorSoluceWatchlist.tsx

tsx
Copy code
import { VendorVisibilityWatchlistPanel } from '@/features/vendorSoluce/VendorVisibilityWatchlistPanel';

export default function VendorSoluceWatchlistPage() {
  return (
    <main className="p-4 space-y-4">
      <VendorVisibilityWatchlistPanel />
    </main>
  );
}
4.2 Add Route + Navigation
Update routing:

Path: /vendorsoluce/watchlist

Page: VendorSoluceWatchlistPage

Update sidebar/navigation:

Under VendorSoluce:

“Supplier Visibility Watchlist”

5) Validation Checklist
 Watchlist loads using existing VendorSoluce export + driftHints.

 Vendors are grouped into four visibility buckets without error.

 Language remains visibility-focused:

“stable”, “changing”, “uncertain”

NO “risk”, “rating”, “secure”, “compliant”.

 Removing drift logic removes hints but does not break the page.

 No new persistence, scoring, or analytics introduced.

Definition of Done (Product-Level)
You can now accurately say:

“VendorSoluce highlights suppliers whose technical visibility is stable versus drifting over time, helping teams prioritize which relationships merit closer attention.”

This is a real product surface, not a demo.