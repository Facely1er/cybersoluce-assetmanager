# TODO[STEEL-SUMMARY-INTEGRATION]

GOAL  
Create a clean, explicit integration contract between:
- CyberCaution (STEEL readiness diagnostic producer), and
- CyberSoluce / ERMITS platform (consumer)

STEEL diagnostics MUST remain in CyberCaution.
CyberSoluce MUST only consume a summary object.

---

## 1. Align on a shared STEEL summary contract (both repos)

### 1.1 CyberCaution – define the summary type

- [ ] Create file:
  `src/features/steel/steelReadinessSummary.ts`

- [ ] Add the following EXACT definitions:

```ts
// Shared STEEL readiness summary emitted by CyberCaution
// and consumed by the ERMITS platform.

export type SteelExposureBand = 'low' | 'medium' | 'elevated' | 'high';

export interface SteelReadinessSummary {
  band: SteelExposureBand;
  keySignals: string[];
  generatedAt: string;    // ISO timestamp
  source?: 'cyberCaution';
}
Do NOT add:

scores

percentages

narratives

remediation guidance

1.2 CyberSoluce – confirm matching contract
 Verify src/features/steel/index.ts contains the SAME structure:

ts
Copy code
export type SteelExposureBand = 'low' | 'medium' | 'elevated' | 'high';

export interface SteelReadinessSummary {
  band: SteelExposureBand;
  keySignals: string[];
  generatedAt: string;
  source?: 'cyberCaution';
}
 Ensure this file exports types only.

2. CyberCaution – build the summary from STEEL results
2.1 Create summary builder
 In CyberCaution, extend steelReadinessSummary.ts:

ts
Copy code
import { mapAnswersToSignals } from './mapSignals';
import type { SteelExposureBand, SteelReadinessSummary } from './steelReadinessSummary';

export function buildSteelReadinessSummary(params: {
  band: SteelExposureBand;
  answers: Record<string, string>;
}): SteelReadinessSummary {
  const signals = mapAnswersToSignals(params.answers);

  const keySignals: string[] = [];

  if (signals.weakGovernance) keySignals.push('Governance & ownership under stress');
  if (signals.weakAssetReality) keySignals.push('Asset and service reality unclear');
  if (signals.weakVendorHandling) keySignals.push('Vendor handling under incident pressure');
  if (signals.weakComms) keySignals.push('Executive & stakeholder communication risk');
  if (signals.weakExecution) keySignals.push('Execution under pressure unreliable');
  if (signals.weakLearning) keySignals.push('Learning does not stick over time');

  return {
    band: params.band,
    keySignals,
    generatedAt: new Date().toISOString(),
    source: 'cyberCaution',
  };
}
Confirm:

No extra logic

No UI code

No remediation text

3. CyberCaution – expose the summary in the results UI
3.1 Generate summary in results component
 In:
src/features/steel/components/SteelV3ResultsCyberCaution.tsx

 When band and answers are available:

Call buildSteelReadinessSummary({ band, answers })

Store as const summary

3.2 Add JSON export (integration artifact)
 Add a “Download STEEL summary (JSON)” button.

 Implement helper:

ts
Copy code
function downloadJson(summary: SteelReadinessSummary) {
  const blob = new Blob([JSON.stringify(summary, null, 2)], {
    type: 'application/json',
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `steel-readiness-summary-${summary.generatedAt}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
 Button MUST:

Not imply assessment or audit export

Be clearly labeled as “summary”

4. CyberSoluce – minimal consumer (manual first)
4.1 Create import panel
 Create file:
src/features/cyberCaution/SteelSummaryImportPanel.tsx

 Implement minimal JSON import + display:

ts
Copy code
import React, { useState } from 'react';
import type { SteelReadinessSummary } from '@/features/steel';

export function SteelSummaryImportPanel() {
  const [summary, setSummary] = useState<SteelReadinessSummary | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    file.text()
      .then((text) => setSummary(JSON.parse(text)))
      .catch(() => {});
  }

  return (
    <div className="space-y-3">
      <input type="file" accept="application/json" onChange={handleFileChange} />

      {summary && (
        <div className="border rounded-md p-3 text-sm space-y-1">
          <div className="font-semibold">
            STEEL readiness band: {summary.band.toUpperCase()}
          </div>
          <div className="text-xs text-muted-foreground">
            Generated at: {summary.generatedAt}
          </div>
          <ul className="list-disc pl-4 mt-2">
            {summary.keySignals.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
No:

recomputation

narratives

diagnostic logic

5. Guardrails (mandatory)
5.1 CyberCaution README reminder
Confirm src/features/steel/README.md states:

STEEL produces readiness signals only

No asset or platform logic

5.2 CyberSoluce README reminder
Confirm src/features/steel/README.md states:

This repo consumes STEEL summaries

No diagnostic/question/tabletop code allowed here

6. Final verification
 CyberCaution:

Build passes

STEEL results page shows diagnostics + tabletop

JSON summary downloads correctly

 CyberSoluce:

JSON summary imports successfully

Only band + key signals displayed

No STEEL logic exists outside CyberCaution

SUCCESS CONDITION:

CyberCaution produces STEEL readiness truth.
CyberSoluce consumes it without interpretation.

Do NOT extend beyond this until the contract is stable.