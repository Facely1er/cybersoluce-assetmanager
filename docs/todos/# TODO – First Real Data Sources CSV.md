# TODO – First Real Data Sources: CSV Asset+Vendor Import & SBOM Upload API

## Assumptions

- You have access to a Postgres DB (Supabase, RDS, etc.).
- App already has:
  - `AssetContract`, `AssetSignal`, `SignalSnapshot` contracts.
  - `signalHistoryStore` factory with `BackendSignalHistoryStore` placeholder.
- You can create migrations (SQL or via your usual tool).

---

## 1) Database Schema – signal_history + import batches

### 1.1 Create `signal_history` table

**File:** `supabase/migrations/<timestamp>_create_signal_history.sql` (or your migration path)

```sql
CREATE TABLE IF NOT EXISTS signal_history (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id      text NOT NULL,
  captured_at   timestamptz NOT NULL,
  source        text NOT NULL, -- 'cybersoluce' | 'technosoluce' | 'vendorsoluce' | 'demo'
  signals_json  jsonb NOT NULL,
  import_batch_id uuid NULL,   -- optional link to CSV/SBOM batch
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_signal_history_asset_time
  ON signal_history (asset_id, captured_at DESC);

CREATE INDEX IF NOT EXISTS idx_signal_history_source
  ON signal_history (source);
1.2 Create asset_import_batch table (for CSV & SBOM grouping)
sql
Copy code
CREATE TABLE IF NOT EXISTS asset_import_batch (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type         text NOT NULL,  -- 'csv-assets' | 'sbom-upload'
  source_label text NOT NULL,  -- e.g. 'CustomerX CSV 2025-12-02', 'Repo foo-service SBOM'
  created_at   timestamptz NOT NULL DEFAULT now(),
  created_by   text NULL       -- identifier for user/tenant if available
);
You’re not storing assets here – just history snapshots and which import batch created them. Asset storage remains wherever it is now.

2) Implement BackendSignalHistoryStore (Supabase/Postgres-backed)
2.1 Implement store using HTTP/DB client
File: src/time/signalHistoryStore.ts (extend existing)

Tasks:

Import your Supabase client or DB helper.

Example with Supabase (adapt if different):

ts
Copy code
import { createClient } from '@supabase/supabase-js';
import { SignalSnapshot, SignalHistory } from '@/contracts/cyberSoluce.signalHistory.contract';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY!; // or secure backend-side key
const supabase = createClient(supabaseUrl, supabaseKey);

export class BackendSignalHistoryStore implements SignalHistoryStore {
  async recordSnapshot(snapshot: SignalSnapshot & { importBatchId?: string }): Promise<void> {
    const { error } = await supabase.from('signal_history').insert({
      asset_id: snapshot.assetId,
      captured_at: snapshot.capturedAt,
      source: snapshot.source,
      signals_json: snapshot.signals,
      import_batch_id: snapshot.importBatchId ?? null,
    });
    if (error) throw error;
  }

  async getHistory(
    assetId: string,
    options?: { limit?: number; since?: string }
  ): Promise<SignalHistory | null> {
    let query = supabase
      .from('signal_history')
      .select('asset_id, captured_at, source, signals_json')
      .eq('asset_id', assetId)
      .order('captured_at', { ascending: true });

    if (options?.since) {
      query = query.gte('captured_at', options.since);
    }
    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    if (!data || !data.length) return null;

    return {
      assetId,
      snapshots: data.map(row => ({
        assetId: row.asset_id,
        capturedAt: row.captured_at,
        source: row.source,
        signals: row.signals_json,
      })),
    };
  }
}
Keep your createSignalHistoryStore() factory and set:

VITE_HISTORY_STORE_MODE=backend in env when ready.

3) CSV Asset + Vendor Import Pipeline
3.1 Define CSV format
Target a simple, enforceable schema. Example columns:

asset_id

asset_name

asset_type

business_role (optional)

vendor_name (optional, for mapping)

owner_team (optional)

environment (e.g. prod/test)

critical_flag (ignored for risk; only as descriptor)

Document this in docs/signal-spine-v1.md under “CSV Import v1”.

3.2 Create CSV parsing service (frontend or backend)
File: src/import/csvAssetImportService.ts

Tasks:

Use a CSV parser (e.g. Papaparse) to turn file into rows.

Map rows → AssetContract + vendor mapping + initial AssetSignal[].

Example:

ts
Copy code
import { AssetContract } from '@/contracts/cyberSoluce.asset.contract';
import { AssetSignal } from '@/contracts/cyberSoluce.signal.contract';

export interface ParsedCsvAssetRow {
  assetId: string;
  assetName: string;
  assetType?: string;
  businessRole?: string;
  vendorName?: string;
  ownerTeam?: string;
  environment?: string;
}

export function mapCsvRowToAsset(row: ParsedCsvAssetRow): AssetContract {
  return {
    id: row.assetId,
    name: row.assetName,
    type: row.assetType ?? 'unknown',
    tags: [
      row.businessRole && `role:${row.businessRole}`,
      row.ownerTeam && `owner:${row.ownerTeam}`,
      row.environment && `env:${row.environment}`,
    ].filter(Boolean) as string[],
  };
}

export function buildInitialSignalsForCsvAsset(row: ParsedCsvAssetRow): AssetSignal[] {
  const signals: AssetSignal[] = [];

  signals.push({
    assetId: row.assetId,
    signalType: 'exposure',
    description: 'Asset imported from CSV inventory – visibility established.',
    confidence: 'medium',
    source: 'import',
    timestamp: new Date().toISOString(),
  });

  if (row.vendorName) {
    signals.push({
      assetId: row.assetId,
      signalType: 'dependency',
      description: `Asset is linked to vendor: ${row.vendorName}.`,
      confidence: 'medium',
      source: 'import',
      timestamp: new Date().toISOString(),
    });
  }

  return signals;
}
Still qualitative, no risk/compliance.

3.3 Create backend API to handle CSV import
File (backend/edge function placeholder): functions/importCsvAssets.ts or api/import/csv-assets.ts

Tasks:

Accept:

CSV file

sourceLabel (string, for asset_import_batch entry)

Steps:

Create asset_import_batch row and get batchId.

Parse CSV → ParsedCsvAssetRow[].

Map to AssetContract + signals.

Persist assets via your existing asset persistence mechanism (if any).

For each asset:

Call BackendSignalHistoryStore.recordSnapshot() with:

assetId

capturedAt (now)

source: 'cybersoluce'

signals (the array from buildInitialSignalsForCsvAsset)

importBatchId: batchId.

Return a summary JSON:

json
Copy code
{
  "batchId": "uuid",
  "assetCount": 42,
  "vendorLinkedAssets": 17
}
4) SBOM Upload API → TechnoSoluce → Signal Snapshot
4.1 SBOM upload endpoint
File: functions/uploadSbom.ts or api/upload/sbom.ts

Tasks:

Accept:

File (SPDX/CycloneDX)

sourceLabel (e.g. repo/service name)

linkedAssetId or list of asset IDs

Steps:

Create asset_import_batch entry with type='sbom-upload'.

Parse just enough SBOM metadata to populate SBOMIntake:

format, generatedAt, toolName, componentsCount, hasLicenses, hasDependencies.

For each linked asset:

Use buildSBOMSignals(sbom, [assetId]) you already implemented.

Call BackendSignalHistoryStore.recordSnapshot() with:

source: 'technosoluce'

importBatchId: batchId.

You’re not doing vulns or severity – just composition visibility + change over time.

5) Wire UI → Real Import Flows
5.1 CSV import UI (simple panel)
File: src/features/import/CsvAssetImportPanel.tsx

Tasks:

Upload field + sourceLabel input.

On submit:

Call your importCsvAssets API endpoint.

Show count of assets imported and vendor-linked assets.

After success:

Optionally refresh:

asset list

drift views & exports

Keep it boring and reliable; this is a data pipe, not a marketing hero.

5.2 SBOM upload UI (for TechnoSoluce)
File: src/features/technoSoluce/SbomUploadPanel.tsx

Tasks:

Upload field + sourceLabel + asset selector (drop-down of assets).

On submit:

Call uploadSbom endpoint.

On success, show:

how many components were recognized (componentsCount)

which assets were updated.

Behind the scenes, snapshots are recorded and drift will reflect software composition visibility changes over time.

6) Validation Checklist (This Time, Against Real Data Flow)
 Running migrations creates signal_history + asset_import_batch tables without errors.

 VITE_HISTORY_STORE_MODE=backend uses BackendSignalHistoryStore and does not crash when recording/getting history.

 CSV import:

Creates an asset_import_batch row.

Records signal_history rows per asset.

Triggers meaningful drift after multiple imports with changes.

 SBOM upload:

Creates asset_import_batch row with type='sbom-upload'.

Records signal_history rows with source='technosoluce'.

SBOM-derived signals show up in drift & SBOM-related summaries.

 CyberCaution, VendorSoluce, and ERMITS Advisory exports:

Work unchanged, but now reflect real historical changes once multiple imports/uploads have occurred.

yaml
Copy code

---

If you implement this, you’ll have:

- Real, persistent history (not just demo).
- A clear CSV → signal → drift pipeline.
- A real SBOM feed that affects TechnoSoluce and downstream narratives.

When you’re done and have at least **two CSV imports** + **two SBOM uploads** for the same assets, you’ll start seeing 