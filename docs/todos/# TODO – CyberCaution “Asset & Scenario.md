# TODO – CyberCaution “Asset & Scenario Pre-Check” v1

## Objective

Expose a **real feature** using the signal spine:

- A CyberCaution-facing view that:
  - Lists assets grouped by **visibility readiness** for scenarios.
  - Uses **drift + SBOM + vendor signals** (no risk scores).
  - Can be used as:
    - A pre-flight check for ransomware tabletop exercises.
    - A quick “where is our understanding unstable?” view for asset selection.

No new scoring or posture logic. Purely **visibility + stability**.

---

## 1) Define a Scenario Readiness Mapping (Drift → Readiness)

### 1.1 Add a small mapping helper

**File:** `src/cybercaution/readiness/readinessMapper.ts` (new)

**Tasks:**
- Define:

```ts
import { DriftStatus } from '@/contracts/cyberSoluce.drift.contract';

export type ScenarioReadiness =
  | 'ready'
  | 'needs-clarification'
  | 'unstable'
  | 'no-history';

export interface AssetScenarioReadiness {
  assetId: string;
  name?: string;
  driftStatus: DriftStatus;
  hasSBOM: boolean;
  hasVendorLinks: boolean;
  readiness: ScenarioReadiness;
}
Add a mapping function:

ts
Copy code
export function mapDriftToReadiness(status: DriftStatus): ScenarioReadiness {
  switch (status) {
    case 'stable-visibility':
      return 'ready';
    case 'emerging-change':
      return 'needs-clarification';
    case 'increasing-uncertainty':
    case 'high-variance':
      return 'unstable';
    case 'no-history':
    default:
      return 'no-history';
  }
}
This is visibility-readiness, not risk.

2) Build a Readiness Derivation Service
2.1 Derive readiness per asset using existing spine
File: src/cybercaution/readiness/assetReadinessService.ts (new)

Tasks:

Use existing pieces:

signalHistoryStore

analyzeSignalDrift

asset list (from your existing asset service)

signals (from your existing signal service)

SBOM and vendor info (via existing signals / tags)

Example:

ts
Copy code
import { signalHistoryStore } from '@/time/signalHistoryStore';
import { analyzeSignalDrift } from '@/time/signalDriftAnalyzer';
import { AssetScenarioReadiness, mapDriftToReadiness } from './readinessMapper';
import { AssetContract } from '@/contracts/cyberSoluce.asset.contract';
import { AssetSignal } from '@/contracts/cyberSoluce.signal.contract';

export async function computeAssetScenarioReadiness(
  assets: AssetContract[],
  signalsByAssetId: Map<string, AssetSignal[]>
): Promise<AssetScenarioReadiness[]> {
  const result: AssetScenarioReadiness[] = [];

  for (const asset of assets) {
    if (!asset.id) continue;

    const assetId = asset.id;
    const signals = signalsByAssetId.get(assetId) ?? [];

    const history = await signalHistoryStore.getHistory(assetId, { limit: 20 });
    const driftInsight = analyzeSignalDrift(history);

    const hasSBOM = signals.some(s =>
      String(s.signalType).includes('software-composition-known') ||
      String(s.signalType).includes('software-composition-partial'),
    );

    const hasVendorLinks = signals.some(s =>
      String(s.signalType).includes('vendor') ||
      String(s.description ?? '').toLowerCase().includes('vendor'),
    );

    const readiness = mapDriftToReadiness(driftInsight.status);

    result.push({
      assetId,
      name: asset.name,
      driftStatus: driftInsight.status,
      hasSBOM,
      hasVendorLinks,
      readiness,
    });
  }

  return result;
}
This service is the core brain for the CyberCaution pre-check.

3) CyberCaution Pre-Check Panel UI
3.1 Create the panel component
File: src/features/cyberCaution/ScenarioPreCheckPanel.tsx (new)

Tasks:

Use your existing design system (cards/tables).

Inputs:

optional scenario type: 'ransomware' | 'incident' | 'generic'

Internally:

Load current assets + signals (reuse existing selectors/services).

Call computeAssetScenarioReadiness.

Group results by readiness.

Pseudo-implementation:

tsx
Copy code
import { useEffect, useState } from 'react';
import { computeAssetScenarioReadiness, AssetScenarioReadiness } from '@/cybercaution/readiness/assetReadinessService';
import { useAssets } from '@/features/assets/useAssets';        // adapt to your hooks
import { useAssetSignals } from '@/features/signals/useAssetSignals';

type Props = {
  scenario?: 'ransomware' | 'incident' | 'generic';
};

export function ScenarioPreCheckPanel({ scenario = 'ransomware' }: Props) {
  const { assets, loading: assetsLoading } = useAssets();
  const { signalsByAssetId, loading: signalsLoading } = useAssetSignals();

  const [readiness, setReadiness] = useState<AssetScenarioReadiness[]>([]);
  const [error, setError] = useState<string | null>(null);
  const loading = assetsLoading || signalsLoading;

  useEffect(() => {
    if (loading) return;
    let isMounted = true;
    (async () => {
      try {
        const result = await computeAssetScenarioReadiness(assets, signalsByAssetId);
        if (!isMounted) return;
        setReadiness(result);
        setError(null);
      } catch (e) {
        console.error('Failed to compute scenario readiness:', e);
        if (!isMounted) return;
        setError('Could not compute scenario readiness. Please try again or refresh the page.');
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [assets, signalsByAssetId, loading]);

  const ready = readiness.filter(r => r.readiness === 'ready');
  const needsClarification = readiness.filter(r => r.readiness === 'needs-clarification');
  const unstable = readiness.filter(r => r.readiness === 'unstable');
  const noHistory = readiness.filter(r => r.readiness === 'no-history');

  // Render
  return (
    <section className="space-y-4">
      <header>
        <h2 className="text-sm font-semibold">
          {scenario === 'ransomware' ? 'Ransomware Scenario Pre-Check' : 'Scenario Pre-Check'}
        </h2>
        <p className="text-xs text-muted-foreground">
          This view highlights how stable your visibility is for assets you might include in a {scenario} scenario.
        </p>
      </header>

      {error && <p className="text-xs text-red-600">{error}</p>}

      {loading && <p className="text-xs text-muted-foreground">Loading assets and signals…</p>}

      {!loading && !error && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Ready */}
          <div className="border rounded-lg p-3">
            <h3 className="text-xs font-semibold mb-1">Visibility Ready</h3>
            <p className="text-[11px] text-muted-foreground mb-2">
              Assets with stable visibility – good candidates to anchor your scenario.
            </p>
            <ul className="space-y-1 max-h-40 overflow-auto text-[11px]">
              {ready.map(r => (
                <li key={r.assetId}>• {r.name ?? r.assetId}</li>
              ))}
              {!ready.length && <li className="text-muted-foreground">None identified yet.</li>}
            </ul>
          </div>

          {/* Needs clarification */}
          <div className="border rounded-lg p-3">
            <h3 className="text-xs font-semibold mb-1">Needs Clarification</h3>
            <p className="text-[11px] text-muted-foreground mb-2">
              Assets where visibility is changing – clarify before using them as critical scenario components.
            </p>
            <ul className="space-y-1 max-h-40 overflow-auto text-[11px]">
              {needsClarification.map(r => (
                <li key={r.assetId}>• {r.name ?? r.assetId}</li>
              ))}
              {!needsClarification.length && <li className="text-muted-foreground">None identified yet.</li>}
            </ul>
          </div>

          {/* Unstable */}
          <div className="border rounded-lg p-3">
            <h3 className="text-xs font-semibold mb-1">Unstable Visibility</h3>
            <p className="text-[11px] text-muted-foreground mb-2">
              Assets with high variance or growing uncertainty – typically poor anchors for a precise scenario.
            </p>
            <ul className="space-y-1 max-h-40 overflow-auto text-[11px]">
              {unstable.map(r => (
                <li key={r.assetId}>• {r.name ?? r.assetId}</li>
              ))}
              {!unstable.length && <li className="text-muted-foreground">None identified yet.</li>}
            </ul>
          </div>

          {/* No history */}
          <div className="border rounded-lg p-3">
            <h3 className="text-xs font-semibold mb-1">No History Yet</h3>
            <p className="text-[11px] text-muted-foreground mb-2">
              Assets without historical visibility – import more data or include them cautiously.
            </p>
            <ul className="space-y-1 max-h-40 overflow-auto text-[11px]">
              {noHistory.map(r => (
                <li key={r.assetId}>• {r.name ?? r.assetId}</li>
              ))}
              {!noHistory.length && <li className="text-muted-foreground">None identified yet.</li>}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
4) Wire the Panel into an Accessible Route
4.1 Add a “Pre-Check” view to existing navigation
File: src/pages/CyberCautionPreCheck.tsx (new)

tsx
Copy code
import { ScenarioPreCheckPanel } from '@/features/cyberCaution/ScenarioPreCheckPanel';

export default function CyberCautionPreCheckPage() {
  return (
    <main className="p-4 space-y-4">
      <ScenarioPreCheckPanel scenario="ransomware" />
    </main>
  );
}
File: src/router/routes.tsx (or equivalent)

Add route /cybercaution/precheck pointing to this page.

Add nav item in your main navigation under CyberCaution section.

5) Use This in Exports (Optional but Recommended)
5.1 Add readiness tags into CyberCaution export (non-blocking)
File: src/exports/toCyberCaution.ts

Tasks:

For each asset in the export, you already compute drift + driftHints.

Optionally add a field:

ts
Copy code
export interface CyberCautionExportAssetView {
  assetId: string;
  name?: string;
  driftStatus: DriftStatus;
  scenarioReadiness: ScenarioReadiness; // NEW
  hasSBOM: boolean;
  hasVendorLinks: boolean;
}
Use mapDriftToReadiness() to populate.

This does NOT change UI now, but gives the CyberCaution product a clean hook later.

Ensure you run contractGuard on the enriched export.

6) Validation Checklist
 ScenarioPreCheckPanel loads successfully with real CSV + SBOM-fed data.

 Assets are grouped into the four readiness buckets with no crashes.

 Language in the panel, helpers, and export:

Does NOT contain “risk”, “posture”, “compliant”, “secure / insecure”.

Only talks about visibility, stability, uncertainty.

 Removing the readiness module does not break exports (only removes extra hints).

 CyberCaution exports still validate under contractGuard.

sql
Copy code

---

Once you have this working with real CSV imports and at least one SBOM upload, you can honestly describe CyberCaution’s first feature as:

> “Scenario Pre-Check that tells you which assets are visibility-ready, unstable, or unknown before a ransomware exercise.”

Next step *after this* would be a similar **VendorSoluce “Supplier Visibility Watchlist” panel**, then a tiny HTML/Markdown generator for the STEEL “Visibility Annex” you can drop into client reports.






