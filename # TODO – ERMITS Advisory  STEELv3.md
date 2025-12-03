# TODO – ERMITS Advisory / STEEL Visibility Feed v1 (Narrative Only)

## Objective

Expose CyberSoluce + TechnoSoluce + Drift intelligence to **ERMITS Advisory / STEEL** as:
- Textual, decision-support **narratives** (no scores, no posture).
- Lightweight, report-ready exports for:
  - board decks,
  - STEEL assessments,
  - advisory deliverables.

We only add **export-side aggregation + copy logic**. No new UI, no scoring.

---

## 1. Define STEEL Visibility Summary Contract

### 1.1 Create advisory-side contract

**File:** `src/contracts/ermitsAdvisory.steelVisibility.contract.ts`

**Tasks:**
- Define three layers:

```ts
import { DriftStatus } from '@/contracts/cyberSoluce.drift.contract';

export interface SteelAssetVisibilitySummary {
  assetId: string;
  keyRole?: string;          // e.g. 'payment-processing', 'ehr-db' (optional)
  driftStatus: DriftStatus;  // from drift analyzer
  hasSBOM: boolean;          // true if software-composition-known/partial
  hasVendorLinks: boolean;   // asset participates in vendor dependencies
}

export interface SteelDomainVisibilitySummary {
  domain: 'privacy' | 'ransomware' | 'vendor' | 'software-supply-chain';
  keyMessages: string[];   // short 1–2 line messages
}

export interface SteelOrgVisibilitySnapshot {
  capturedAt: string; // ISO timestamp
  assets: SteelAssetVisibilitySummary[];
  domains: SteelDomainVisibilitySummary[];
  narrative: string[]; // 5–10 bullet-level lines suitable for STEEL report inserts
}
Add a doc comment:

“STEEL visibility summaries describe how well the organisation understands its assets, software composition, and vendor touchpoints over time. They are not risk ratings, posture scores, or compliance conclusions.”

Export from src/contracts/index.ts.

2. Extend toERMITSAdvisory Export Adapter
2.1 Wire in assets, SBOM signals, drift, vendor links
File: src/exports/toERMITSAdvisory.ts

(If this file already exists, extend it; if not, create it based on your existing manifest + adapters pattern.)

Tasks:

Imports:

ts
Copy code
import { signalHistoryStore } from '@/time/signalHistoryStore';
import { analyzeSignalDrift } from '@/time/signalDriftAnalyzer';
import { SteelOrgVisibilitySnapshot, SteelAssetVisibilitySummary, SteelDomainVisibilitySummary } from '@/contracts/ermitsAdvisory.steelVisibility.contract';
import { AssetSignal } from '@/contracts/cyberSoluce.signal.contract';
import { SBOMSignalType } from '@/contracts/technoSoluce.sbom.signals'; // if exported
import { contractGuard } from '@/guards/contractGuard';
Define an export payload:

ts
Copy code
export interface ERMITSAdvisoryExportPayload {
  manifest: CyberSoluceExportManifest;
  assets: Partial<CyberSoluceAssetContract>[];
  dependencies: Partial<CyberSoluceDependencyContract>[];
  signals: Partial<CyberSoluceSignalContract>[];
  steelVisibilitySnapshot: SteelOrgVisibilitySnapshot; // NEW
}
2.2 Build per-asset summary
Inside toERMITSAdvisory or helper file:

ts
Copy code
async function buildAssetVisibilitySummaries(
  assets: Partial<CyberSoluceAssetContract>[],
  signalsByAssetId: Map<string, AssetSignal[]>
): Promise<SteelAssetVisibilitySummary[]> {
  const result: SteelAssetVisibilitySummary[] = [];

  for (const asset of assets) {
    if (!asset.id) continue;

    const assetId = asset.id;
    const signals = signalsByAssetId.get(assetId) ?? [];

    const history = await signalHistoryStore.getHistory(assetId, { limit: 20 });
    const insight = analyzeSignalDrift(history);

    const hasSBOM = signals.some(s =>
      String(s.signalType).includes('software-composition-known') ||
      String(s.signalType).includes('software-composition-partial'),
    );

    const hasVendorLinks = signals.some(s =>
      String(s.signalType).includes('vendor') ||
      String(s.description ?? '').toLowerCase().includes('third-party'),
    );

    const keyRole = deriveKeyRoleFromTagsOrName(asset); // small helper; optional

    result.push({
      assetId,
      keyRole,
      driftStatus: insight.status,
      hasSBOM,
      hasVendorLinks,
    });
  }

  return result;
}

function deriveKeyRoleFromTagsOrName(asset: Partial<CyberSoluceAssetContract>): string | undefined {
  const name = (asset.name ?? '').toLowerCase();
  const tags = (asset.tags ?? []).map(t => String(t).toLowerCase());

  if (name.includes('ehr') || tags.includes('health')) return 'clinical-records';
  if (name.includes('payment') || tags.includes('billing')) return 'payment-processing';
  if (name.includes('crm')) return 'customer-relationship';
  if (name.includes('erp')) return 'core-business-platform';

  return undefined;
}
Keep this role derivation simple and heuristic; it’s for advisory text only.

2.3 Aggregate into domain summaries
ts
Copy code
function buildDomainVisibilitySummaries(
  assets: SteelAssetVisibilitySummary[]
): SteelDomainVisibilitySummary[] {
  const domains: SteelDomainVisibilitySummary[] = [];

  // Privacy domain
  const privacyAssets = assets.filter(a => a.keyRole === 'clinical-records' || a.keyRole === 'customer-relationship');
  domains.push(buildPrivacySummary(privacyAssets));

  // Ransomware domain – use drift + SBOM presence as proxies for assets where ransomware paths matter
  domains.push(buildRansomwareSummary(assets));

  // Vendor domain – use hasVendorLinks
  const vendorAssets = assets.filter(a => a.hasVendorLinks);
  domains.push(buildVendorSummary(vendorAssets));

  // Software supply-chain domain – use hasSBOM
  const ssAssets = assets.filter(a => a.hasSBOM);
  domains.push(buildSoftwareSupplyChainSummary(ssAssets));

  return domains;
}

function buildPrivacySummary(assets: SteelAssetVisibilitySummary[]): SteelDomainVisibilitySummary {
  const messages: string[] = [];

  if (!assets.length) {
    messages.push('No specific privacy-critical assets have been tagged or surfaced in the current view.');
  } else {
    const unstable = assets.filter(a =>
      a.driftStatus === 'emerging-change' || a.driftStatus === 'increasing-uncertainty' || a.driftStatus === 'high-variance',
    );
    const stable = assets.filter(a => a.driftStatus === 'stable-visibility');

    if (stable.length) {
      messages.push('Some privacy-relevant assets show stable visibility across observations.');
    }
    if (unstable.length) {
      messages.push('Several privacy-relevant assets exhibit changing or uncertain visibility, indicating the need for clearer mapping.');
    }
  }

  return {
    domain: 'privacy',
    keyMessages: messages,
  };
}

// Implement `buildRansomwareSummary`, `buildVendorSummary`, `buildSoftwareSupplyChainSummary`
// using the same pattern: visibility + stability/uncertainty language only.
2.4 Build overall narrative
ts
Copy code
function buildOrgVisibilityNarrative(
  assets: SteelAssetVisibilitySummary[],
  domains: SteelDomainVisibilitySummary[]
): string[] {
  const lines: string[] = [];

  const unstableAssets = assets.filter(a =>
    a.driftStatus === 'emerging-change' || a.driftStatus === 'increasing-uncertainty' || a.driftStatus === 'high-variance',
  );

  const withSBOM = assets.filter(a => a.hasSBOM);
  const withVendor = assets.filter(a => a.hasVendorLinks);

  if (!assets.length) {
    lines.push('Asset visibility is not yet established in this snapshot; historical insights are limited.');
  } else {
    lines.push(`Asset visibility is established for ${assets.length} assets in the current snapshot.`);
  }

  if (unstableAssets.length) {
    lines.push('A subset of assets shows changing or uncertain visibility, which may warrant closer mapping or clarification.');
  }

  if (withSBOM.length) {
    lines.push('Software composition is partially documented for some assets, enabling more informed technical discussions without assessing risk directly.');
  } else {
    lines.push('Software composition has not yet been systematically documented across assets in this snapshot.');
  }

  if (withVendor.length) {
    lines.push('Several assets are clearly linked to external vendors, creating opportunities to connect technical visibility with supplier oversight.');
  }

  // Include domain-level key messages
  domains.forEach(d => {
    d.keyMessages.forEach(msg => lines.push(msg));
  });

  return lines;
}
2.5 Assemble export payload
In toERMITSAdvisory:

ts
Copy code
export async function toERMITSAdvisory(
  /* existing params */
): Promise<ERMITSAdvisoryExportPayload> {
  // existing: build manifest, assets, dependencies, signals

  const signalsByAssetId = groupSignalsByAssetId(signals); // helper

  const assetSummaries = await buildAssetVisibilitySummaries(assets, signalsByAssetId);
  const domains = buildDomainVisibilitySummaries(assetSummaries);
  const narrative = buildOrgVisibilityNarrative(assetSummaries, domains);

  const steelVisibilitySnapshot: SteelOrgVisibilitySnapshot = {
    capturedAt: new Date().toISOString(),
    assets: assetSummaries,
    domains,
    narrative,
  };

  const payload: ERMITSAdvisoryExportPayload = {
    manifest,
    assets,
    dependencies,
    signals,
    steelVisibilitySnapshot,
  };

  contractGuard.validateExport(payload, 'ERMITSAdvisoryExportPayload');
  return payload;
}
groupSignalsByAssetId is a small helper reusing your existing signal structures; keep it simple.

3. Guardrails & Language
3.1 Scan for forbidden phrasing
Files:

ermitsAdvisory.steelVisibility.contract.ts

toERMITSAdvisory.ts

All build*Summary and narrative builders

Ensure none of these appear:

“high risk / low risk / critical risk”

“posture has improved / worsened”

“compliant / non-compliant”

“secure / insecure”

“risk trend”, “trend score”

Allowed:

“visibility is stable / changing / uncertain”

“signals have evolved”

“asset mapping is clearer / remains unclear”

“software composition is documented / not documented”

4. Documentation – STEEL Integration
4.1 Update ecosystem-data-boundaries.md
Tasks:

Add section:

ERMITS Advisory / STEEL – Visibility Snapshot
“Receives an organisation-level visibility snapshot including:

per-asset summaries (drift, SBOM presence, vendor linkage),

per-domain visibility messages (privacy, ransomware, vendor, software supply-chain),

narrative bullet points suitable for STEEL reports and advisory deliverables.”

“These narratives describe what we know and how stable that knowledge is, not whether the organisation is ‘secure’ or ‘compliant’.”

Link to:

toERMITSAdvisory.ts

ermitsAdvisory.steelVisibility.contract.ts

5. Validation Checklist
 toERMITSAdvisory builds SteelOrgVisibilitySnapshot without errors.

 At least one test run produces:

asset-level summaries,

domain-level messages,

a narrative array of 5–10 lines.

 No narrative lines contain forbidden risk/posture/compliance language.

 contractGuard validates ERMITSAdvisoryExportPayload.

 Removing drift/SBOM/vendor hints still leaves toERMITSAdvisory working (minimal snapshot with limited content).

 STEEL / advisory consumers can treat steelVisibilitySnapshot.narrative as drop-in report text.

yaml
Copy code

---

If you implement this, you’ll have:

- **Ops side**: CyberCaution + VendorSoluce seeing “what’s moving.”
- **Advisory side**: STEEL getting **ready-to-drop narrative** grounded in the same signals.

Once that’s in, we can talk about **hardening** (history persistence, job queues, “snapshot on schedule” for advisory), instead of bolting features onto an in-memory toy.






