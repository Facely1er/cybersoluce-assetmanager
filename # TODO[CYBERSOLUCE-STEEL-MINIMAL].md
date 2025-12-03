# TODO[CYBERSOLUCE-STEEL-MINIMAL]

GOAL
Make this repo (ERMITS / CyberSoluce platform) only CONSUME STEEL readiness,
not implement the diagnostic.

---

## 1. Clean up src/features/steel in THIS repo

- [ ] In this repo, open:
      `src/features/steel/`

- [ ] Delete these files IF they exist here:

      - `bandNarratives.ts`
      - `SteelV3ResultsCyberCaution.tsx`

  (They belong ONLY in the CyberCaution repo, which already has its own
   `steelV3Narratives.ts` and `components/SteelV3ResultsCyberCaution.tsx`.)

- [ ] Ensure only these remain in this folder:

      - `index.ts`      (integration types)
      - `README.md`     (guardrail, optional)

---

## 2. Turn index.ts into types-only integration

- [ ] Replace content of `src/features/steel/index.ts` with:

  ```ts
  // ERMITS platform – STEEL integration types only.
  // Diagnostics run in CyberCaution; this repo only consumes the summary.

  export type SteelExposureBand = 'low' | 'medium' | 'elevated' | 'high';

  export interface SteelReadinessSummary {
    band: SteelExposureBand;
    keySignals: string[];   // short phrases from CyberCaution
    generatedAt: string;    // ISO timestamp
    source?: 'cyberCaution';
  }
→ No React components, no narratives, no scoring logic here.

3. Fix imports that referenced removed files
 Global search in THIS repo for:

markdown
Copy code
- `SteelV3ResultsCyberCaution`
- `bandNarratives`
- `from 'src/features/steel`
 For each place that tried to render a full STEEL UI:

markdown
Copy code
- Remove the STEEL results component import.
- Replace with either:
  - a simple badge that takes `SteelReadinessSummary`, or
  - a CTA/link back to CyberCaution (e.g. “Open detailed readiness view in CyberCaution”).
Example stub:

ts
Copy code
import type { SteelReadinessSummary } from '@/features/steel';

interface Props {
  summary: SteelReadinessSummary | null;
}

export function SteelSummaryBadge({ summary }: Props) {
  if (!summary) return null;

  return (
    <span className="inline-flex items-center gap-2 text-xs rounded-full border px-2 py-1">
      <span className="font-medium">STEEL readiness:</span>
      <span className="uppercase">{summary.band}</span>
    </span>
  );
}
4. Guardrail doc (optional but recommended)
 Create src/features/steel/README.md:

md
Copy code
ERMITS Platform – STEEL Integration

This repo only consumes STEEL readiness summaries from CyberCaution.

It MUST NOT:
- Implement STEEL questions or scoring
- Render full diagnostic or tabletop
- Contain narratives or band explanations

Source-of-truth for STEEL diagnostics = CyberCaution repo.
5. Sanity check
 Search this repo for:

arduino
Copy code
- "LightRansomwareTabletop"
- "Readiness Diagnostic"
- "steelQuestionnaire"
- "mapSignals"
None of these should exist here after cleanup.

 Run:

bash
Copy code
npm run lint
npm run typecheck
npm run build
Build must pass. Any remaining errors about missing SteelV3ResultsCyberCaution
or bandNarratives mean a leftover import that needs to be removed or simplified.

yaml
Copy code

---

Net-net:

- **CyberCaution** → you’re good; STEEL + tabletop live there and are intact.  
- **CyberSoluce** → run the minimal cleanup above so it only sees a `SteelReadinessSummary` type and stops pretending to run the diagnostic itself.