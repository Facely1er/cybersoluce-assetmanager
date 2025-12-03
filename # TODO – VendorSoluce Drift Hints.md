# TODO – VendorSoluce Drift Hints v1 (Supplier Visibility, No Risk Language)

## Objective

Expose **visibility-over-time hints** for vendor-related assets to VendorSoluce so it can:
- See which vendors are backed by **stable** vs **shifting/uncertain** asset visibility.
- Use hints as **prioritization context**, not as risk scores.
- Avoid any posture, compliance, or “vendor is safe/unsafe” semantics.

We only extend the `toVendorSoluce` export adapter and contracts.

---

## 1. VendorSoluce Drift Hint Contract

### 1.1 Create export-side contract

**File:** `src/contracts/vendorSoluce.driftHint.contract.ts`

**Tasks:**
- Define:

```ts
import { DriftStatus } from '@/contracts/cyberSoluce.drift.contract';

export interface VendorSoluceDriftHint {
  vendorId: string;
  relatedAssetIds: string[];
  status: DriftStatus;
  summary: string;   // one-line qualitative explanation
  details: string[]; // short bullet-level hints
}
Add doc comment:

“VendorSoluce drift hints describe how visibility around vendor-related assets has changed over time. They are qualitative and do not express vendor risk scores, posture, or compliance status.”

Export from src/contracts/index.ts.

2. Extend toVendorSoluce Export Adapter
2.1 Wire in history + drift analysis
File: src/exports/toVendorSoluce.ts

Tasks:

Import needed bits:

ts
Copy code
import { signalHistoryStore } from '@/time/signalHistoryStore';
import { analyzeSignalDrift } from '@/time/signalDriftAnalyzer';
import { VendorSoluceDriftHint } from '@/contracts/vendorSoluce.driftHint.contract';
import { DriftStatus } from '@/contracts/cyberSoluce.drift.contract';
import { contractGuard } from '@/guards/contractGuard';
Extend your export payload type to add optional drift hints:

ts
Copy code
export interface VendorSoluceExportPayload {
  vendors: /* existing */;
  assets: /* existing */;
  dependencies: /* existing */;
  handoffIntent: string;
  nextQuestionPrompt: string;
  driftHints?: VendorSoluceDriftHint[]; // NEW
}
Keep driftHints optional for backward compatibility.

2.2 Map vendors → related assets
You already have some way to derive “vendor-related assets” (e.g., via dependencies, tags, or fields). Use whatever you already mapped.

Inside toVendorSoluce main export:

After you’ve determined the set of vendors and associated assets:

ts
Copy code
const vendorToAssets: Map<string, string[]> = buildVendorToAssetMap(/* your data here */);
Implement a helper:

ts
Copy code
async function buildVendorDriftHints(
  vendorToAssets: Map<string, string[]>
): Promise<VendorSoluceDriftHint[]> {
  const hints: VendorSoluceDriftHint[] = [];

  for (const [vendorId, assetIds] of vendorToAssets.entries()) {
    const statuses: DriftStatus[] = [];
    const narratives: string[] = [];

    for (const assetId of assetIds) {
      const history = await signalHistoryStore.getHistory(assetId, { limit: 20 });
      const insight = analyzeSignalDrift(history);

      if (insight.status === 'no-history') continue;

      statuses.push(insight.status);
      narratives.push(...insight.supportingSignals);
    }

    if (!statuses.length) {
      continue; // no history for any assets tied to this vendor
    }

    const aggregatedStatus = aggregateVendorDriftStatus(statuses);
    const summary = summarizeVendorDrift(aggregatedStatus);

    const details = dedupeAndTrimNarratives(narratives, 4);

    hints.push({
      vendorId,
      relatedAssetIds: assetIds,
      status: aggregatedStatus,
      summary,
      details,
    });
  }

  return hints;
}

function aggregateVendorDriftStatus(statuses: DriftStatus[]): DriftStatus {
  // crude aggregation rules, explicit and readable:
  if (statuses.includes('high-variance')) return 'high-variance';
  if (statuses.includes('increasing-uncertainty')) return 'increasing-uncertainty';
  if (statuses.includes('emerging-change')) return 'emerging-change';
  if (statuses.includes('stable-visibility')) return 'stable-visibility';
  return 'no-history';
}

function summarizeVendorDrift(status: DriftStatus): string {
  switch (status) {
    case 'stable-visibility':
      return 'Assets related to this vendor have shown broadly stable visibility across observations.';
    case 'emerging-change':
      return 'Recent updates have changed how vendor-related assets appear in your environment.';
    case 'increasing-uncertainty':
      return 'Signals indicate growing uncertainty around how this vendor’s assets are mapped or understood.';
    case 'high-variance':
      return 'Signals tied to this vendor’s assets have varied significantly over time.';
    case 'no-history':
    default:
      return 'No historical visibility is available for assets tied to this vendor.';
  }
}

function dedupeAndTrimNarratives(messages: string[], maxItems: number): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const msg of messages) {
    const trimmed = msg.trim();
    if (!trimmed || seen.has(trimmed)) continue;
    seen.add(trimmed);
    result.push(trimmed);
    if (result.length >= maxItems) break;
  }
  return result;
}
Integrate into export:

ts
Copy code
export async function toVendorSoluce(/* existing params */): Promise<VendorSoluceExportPayload> {
  // existing logic: derive vendors, assets, dependencies, handoffIntent, nextQuestionPrompt

  const vendorToAssets = buildVendorToAssetMap(/* your existing structures */);
  const driftHints = await buildVendorDriftHints(vendorToAssets);

  const payload: VendorSoluceExportPayload = {
    vendors,
    assets,
    dependencies,
    handoffIntent,
    nextQuestionPrompt,
    driftHints: driftHints.length ? driftHints : undefined,
  };

  contractGuard.validateExport(payload, 'VendorSoluceExportPayload'); // or your equivalent
  return payload;
}
If you don’t have a clean buildVendorToAssetMap yet, create a simple helper reusing existing vendor linkage; don’t invent a new model here.

3. Language & Guardrails
3.1 Check all wording
Files to scan:

vendorSoluce.driftHint.contract.ts

toVendorSoluce.ts

Drift narratives reused from signalDriftAnalyzer.ts

Ensure you DO NOT say:

“Vendor risk is increasing / decreasing”

“Vendor posture is worsening”

“This vendor is high risk”

“Vendor is compliant / non-compliant”

Allowed patterns:

“Visibility has been stable/changed”

“Uncertainty has increased”

“Signals have varied significantly”

“Observations about vendor-linked assets have evolved”

3.2 Contract guard
File: src/guards/contractGuard.ts

Tasks:

Ensure the guard:

Runs on VendorSoluceExportPayload including driftHints.

Will flag any forbidden keywords (trend, risk trend, improving, worsening, heatmap, etc.) if they sneak in.

No weakening or exceptions for VendorSoluce.

4. Documentation – How VendorSoluce Uses This
4.1 Add VendorSoluce drift hint section
File: docs/ecosystem-data-boundaries.md

Tasks:

Add a subsection:

VendorSoluce – Supplier Visibility Drift Hints
“VendorSoluce receives text-only hints that summarize how visibility around vendor-related assets has changed over time.”

“Hints help prioritize which vendors and integrations may warrant closer review, refreshed questionnaires, or scenario analysis.”

“Hints are not vendor risk ratings or compliance judgements.”

Update any data flow diagrams / bullets to mention:

toVendorSoluce.ts → “includes optional supplier visibility drift hints”.

5. Validation Checklist
 toVendorSoluce returns driftHints only for vendors with at least one asset that has history.

 Vendors whose assets have no history do not produce hints.

 VendorSoluceDriftHint.summary and details are qualitative and contain none of:

“high risk”, “low risk”, “posture”, “secure”, “insecure”, “compliant”, “non-compliant”.

 contractGuard validates VendorSoluceExportPayload in dev without bypass.

 Removing the drift/history layer still leaves toVendorSoluce working (payload minus driftHints).

 No changes were needed in VendorSoluce UI – it can safely ignore driftHints until wired.

If any check fails, fix the adapter and wording, not the guardrails.

yaml
Copy code

---

When you’ve implemented this, give me a short **“VendorSoluce drift integration” summary** (same pattern: files changed, payload structure, checks passed). After that, ERMITS Advisory + STEEL can be wired to **read** these layers for reports instead of inventing a separate “trend” system.






