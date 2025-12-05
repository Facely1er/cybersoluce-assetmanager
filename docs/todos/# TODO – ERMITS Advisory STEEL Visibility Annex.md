# TODO – ERMITS Advisory "STEEL Visibility Annex" v1 (Markdown Export)

## Objective

Turn `SteelOrgVisibilitySnapshot` into a **report-ready markdown annex**:

- 1–2 pages of:
  - Narrative bullets,
  - Asset visibility table,
  - Domain-level visibility notes.
- Zero posture / risk / compliance language.
- Something you can:
  - Embed in STEEL reports,
  - Export to PDF later,
  - Show as a simple “Copy as Markdown” in UI.

---

## 1) Core Generator – Snapshot → Markdown

### 1.1 Create generator module

**File:** `src/ermitsAdvisory/steelVisibilityAnnex.ts` (new)

```ts
import { SteelOrgVisibilitySnapshot } from '@/contracts/ermitsAdvisory.steelVisibility.contract';

export function generateSteelVisibilityAnnexMarkdown(
  snapshot: SteelOrgVisibilitySnapshot,
  options?: { orgName?: string }
): string {
  const { capturedAt, assets, domains, narrative } = snapshot;
  const orgName = options?.orgName ?? 'The organisation';

  const lines: string[] = [];

  // Title & intro
  lines.push(`# Visibility Snapshot Annex`);
  lines.push('');
  lines.push(`**Organisation:** ${orgName}`);
  lines.push(`**Snapshot captured:** ${capturedAt}`);
  lines.push('');
  lines.push(
    `This annex summarises how well key assets, suppliers, and software composition are currently understood, ` +
      `based on observed signals and visibility changes over time. It focuses on visibility and stability, not risk or compliance judgments.`
  );
  lines.push('');

  // Narrative section
  if (narrative && narrative.length) {
    lines.push(`## Narrative Summary`);
    lines.push('');
    lines.push(`- ` + narrative.join('\n- '));
    lines.push('');
  }

  // Domain-level section
  if (domains && domains.length) {
    lines.push(`## Domain Visibility Highlights`);
    lines.push('');
    for (const d of domains) {
      const label = domainLabel(d.domain);
      lines.push(`### ${label}`);
      lines.push('');
      if (d.keyMessages.length) {
        lines.push(`- ` + d.keyMessages.join('\n- '));
      } else {
        lines.push(`- No specific visibility observations recorded in this snapshot.`);
      }
      lines.push('');
    }
  }

  // Asset table
  if (assets && assets.length) {
    lines.push(`## Asset-Level Visibility Overview`);
    lines.push('');
    lines.push(`| Asset ID | Key Role | Drift Status | SBOM Documented | Vendor Linked |`);
    lines.push(`|----------|----------|--------------|-----------------|---------------|`);

    for (const a of assets) {
      lines.push(
        `| ${safe(a.assetId)} | ${safe(a.keyRole) || '-'} | ${a.driftStatus} | ${a.hasSBOM ? 'Yes' : 'No'} | ${
          a.hasVendorLinks ? 'Yes' : 'No'
        } |`
      );
    }
    lines.push('');
  } else {
    lines.push(`## Asset-Level Visibility Overview`);
    lines.push('');
    lines.push(`No asset visibility summaries are available in this snapshot.`);
    lines.push('');
  }

  // Closing note
  lines.push(`---`);
  lines.push(
    `_This annex describes the current state of asset and supplier visibility, including where understanding is stable versus changing or uncertain. ` +
      `It does not represent security posture, risk ratings, or compliance status._`
  );

  return lines.join('\n');
}

function domainLabel(domain: string): string {
  switch (domain) {
    case 'privacy':
      return 'Privacy-Relevant Assets';
    case 'ransomware':
      return 'Ransomware-Relevant Assets & Paths';
    case 'vendor':
      return 'Supplier & Third-Party Touchpoints';
    case 'software-supply-chain':
      return 'Software Composition & Supply Chain';
    default:
      return 'Visibility Domain';
  }
}

function safe(value?: string): string {
  if (!value) return '';
  return value.replace(/\|/g, '\\|'); // basic markdown table safety
}
This uses your existing snapshot structure. No new data, no new logic.

2) Minimal UI Surface – “Copy Annex as Markdown”
2.1 Add an Advisory view component
File: src/features/ermitsAdvisory/SteelVisibilityAnnexPreview.tsx (new)

tsx
Copy code
import { useState, useMemo } from 'react';
import { useERMITSAdvisoryExport } from '@/features/ermitsAdvisory/useERMITSAdvisoryExport';
import { generateSteelVisibilityAnnexMarkdown } from '@/ermitsAdvisory/steelVisibilityAnnex';

export function SteelVisibilityAnnexPreview() {
  const { exportPayload, loading, error } = useERMITSAdvisoryExport();
  const [copied, setCopied] = useState(false);

  const markdown = useMemo(() => {
    if (!exportPayload?.steelVisibilitySnapshot) return '';
    return generateSteelVisibilityAnnexMarkdown(exportPayload.steelVisibilitySnapshot, {
      orgName: exportPayload.manifest?.organisationName,
    });
  }, [exportPayload]);

  const handleCopy = async () => {
    if (!markdown) return;
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy annex markdown:', e);
    }
  };

  if (loading) {
    return <p className="text-xs text-muted-foreground">Generating visibility annex…</p>;
  }

  if (error) {
    return <p className="text-xs text-red-600">Unable to load STEEL visibility snapshot.</p>;
  }

  if (!markdown) {
    return <p className="text-xs text-muted-foreground">No visibility snapshot is available yet.</p>;
  }

  return (
    <section className="space-y-3">
      <header className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold">STEEL Visibility Annex</h2>
          <p className="text-xs text-muted-foreground">
            Markdown annex generated from the current visibility snapshot. Copy into your report or export pipeline.
          </p>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="text-xs border rounded px-2 py-1 hover:bg-accent"
        >
          {copied ? 'Copied' : 'Copy Markdown'}
        </button>
      </header>

      <pre className="text-[11px] bg-muted border rounded p-3 max-h-80 overflow-auto">
        {markdown}
      </pre>
    </section>
  );
}
This gives you a useful, inspectable preview and a one-click copy.

3) Page & Routing
3.1 Advisory Annex Page
File: src/pages/ERMITSAdvisoryVisibilityAnnex.tsx (new)

tsx
Copy code
import { SteelVisibilityAnnexPreview } from '@/features/ermitsAdvisory/SteelVisibilityAnnexPreview';

export default function ERMITSAdvisoryVisibilityAnnexPage() {
  return (
    <main className="p-4 space-y-4">
      <SteelVisibilityAnnexPreview />
    </main>
  );
}
3.2 Route + Navigation
Add route: /ermits-advisory/visibility-annex → ERMITSAdvisoryVisibilityAnnexPage.

In navigation (probably under ERMITS Advisory / STEEL):

Label: STEEL Visibility Annex

No other UX is needed for v1.

4) Language & Guardrail Check
Files to check:

steelVisibilityAnnex.ts

SteelVisibilityAnnexPreview.tsx

Verify no usage of:

“risk”, “risk level”, “rating”

“posture”, “more secure”, “less secure”

“compliant”, “non-compliant”

Allowed: “visibility”, “stable”, “changing”, “uncertain”, “documented”, “not documented”.

5) Validation Checklist
 generateSteelVisibilityAnnexMarkdown() returns markdown when a snapshot exists.

 Generated markdown includes:

Title

Captured date

Bullet narrative

Domain sections

Asset table (if assets present)

Closing disclaimer

 Copy button works and handles errors gracefully.

 Removing the annex generator does not break export adapters; it’s just a consumer.

 Annex content stays within visibility/stability language only.

Definition of Done (business reality)
You can now present:

CyberCaution: Asset & Scenario Pre-Check

VendorSoluce: Supplier Visibility Watchlist

ERMITS Advisory: STEEL Visibility Annex (markdown for reports)

All three on top of the same signal spine, no posture/scoring BS, and each is demoable and invoiceable.