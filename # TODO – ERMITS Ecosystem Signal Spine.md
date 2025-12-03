# TODO – ERMITS Ecosystem Signal Spine Hardening v1

## 1) Persistence Adapter for Signal History

### 1.1 Introduce pluggable backend adapter

**File:** `src/time/signalHistoryStore.ts`

**Tasks:**
- Keep `InMemorySignalHistoryStore` as-is.
- Add an interface for a backend-backed implementation (no real backend needed yet):

```ts
export class BackendSignalHistoryStore implements SignalHistoryStore {
  async recordSnapshot(snapshot: SignalSnapshot): Promise<void> {
    // placeholder – throw if accidentally used without wiring
    throw new Error('BackendSignalHistoryStore is not yet configured.');
  }

  async getHistory(
    assetId: string,
    options?: { limit?: number; since?: string }
  ): Promise<SignalHistory | null> {
    throw new Error('BackendSignalHistoryStore is not yet configured.');
  }
}
Add a factory:

ts
Copy code
function createSignalHistoryStore(): SignalHistoryStore {
  const mode = import.meta.env.VITE_HISTORY_STORE_MODE ?? 'memory';
  if (mode === 'backend') {
    return new BackendSignalHistoryStore();
  }
  return new InMemorySignalHistoryStore();
}

export const signalHistoryStore: SignalHistoryStore = createSignalHistoryStore();
This prevents future developers from hard-wiring persistence into random places and forces them through this adapter.

2) Unit Tests for Drift Logic (Non-Negotiable)
2.1 Add tests for analyzeSignalDrift
Directory: src/time/__tests__/signalDriftAnalyzer.test.ts (or your test convention)

Cover at least:

no-history when history is null or snapshots = [].

stable-visibility for identical signal types across snapshots.

emerging-change when new signal types appear only in later snapshots.

increasing-uncertainty where “uncertainty”/“unknown” types increase over time.

high-variance when signal types jump around between snapshots (multiple diff sets).

Each test should assert:

status

that supportingSignals has at least 1 meaningful line

that no forbidden language appears (risk, posture, compliant, etc.).

3) Smoke Tests for Export Payload Shapes
3.1 CyberCaution export smoke test
File: src/exports/__tests__/toCyberCaution.test.ts

Tasks:

Mock:

signalHistoryStore.getHistory to return controlled histories.

analyzeSignalDrift to return a fixed status.

Call toCyberCaution with:

2–3 assets and signals

Assert:

driftHints exists and has the expected length.

Each hint has assetId, status, summary, details.

summary/details do not contain forbidden keywords.

3.2 VendorSoluce export smoke test
Similar to above:

Validate driftHints per vendor.

Ensure vendors with no history are skipped.

3.3 ERMITS Advisory export smoke test
Mock signalHistoryStore & analyzeSignalDrift.

Call toERMITSAdvisory.

Assert:

steelVisibilitySnapshot exists.

assets inside snapshot not empty (for test data).

domains contains entries for the 4 domains.

narrative has at least 5 lines, all plain text.

4) Guardrails on Async Exports in UI (No Silent Failures)
4.1 Demo orchestrators error handling
Files:

src/features/demo/SectorDemoOrchestrator.tsx

Any other component calling async exportToCyberCaution, exportToVendorSoluce, exportToERMITSAdvisory.

Tasks:

Wrap async calls in try/catch:

tsx
Copy code
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  let isMounted = true;
  (async () => {
    try {
      const exportPayload = await exportToCyberCaution(/* ... */);
      if (!isMounted) return;
      setExportPayload(exportPayload);
      setError(null);
    } catch (e) {
      if (!isMounted) return;
      console.error('Failed to generate CyberCaution export:', e);
      setError('We could not generate this export preview. Please try again or use live mode.');
    }
  })();
  return () => {
    isMounted = false;
  };
}, [/* deps */]);
In JSX, show a small inline error message when error is set, rather than failing silently.

5) Language Regression Guard (Cheap Safety Net)
5.1 Add a language snapshot test
File: src/__tests__/forbiddenLanguageSnapshot.test.ts

Tasks:

Collect all narrative builders and summaries:

signalDriftAnalyzer.buildSupportingNarrative

summarizeDriftStatus

summarizeVendorDrift

buildOrgVisibilityNarrative

STEEL domain summary builders

For each, call them with dummy inputs and assert that the resulting strings do not include:

risk

posture

compliant

non-compliant

secure

insecure

trend

score

This is a blunt instrument, but it will catch the inevitable “someone added a nice-sounding phrase that breaks your guardrails”.

6) Documentation – “Signal Spine v1” Snapshot
6.1 Add a high-level architecture doc
File: docs/signal-spine-v1.md

Tasks:

Diagram (textual is fine) the flow:

CyberSoluce: assets → signals → history → drift

TechnoSoluce: SBOM → SBOM signals

CyberCaution: asset drift hints

VendorSoluce: supplier drift hints

ERMITS Advisory: STEEL visibility snapshot + narrative

Explicit principles:

“No scores or posture in this layer.”

“Only qualitative visibility and stability over time.”

“Consumers (CyberCaution, VendorSoluce, Advisory) decide how to act.”

Link to:

contracts

stores

export adapters

yaml
Copy code

---

If you run this hardening pass, you’ll have:

- A signal system that **won’t collapse** the moment someone tweaks a string or refactors an adapter.
- A clear seam where you can later plug in **real persistence** (DB / event store) without rewriting logic.
- Enough tests to detect when some future “helpful” change quietly reintroduces risk scoring or posture language.

If you want, the *next* move after this is deciding **where to persist history** (Postgres table design + minimal API) and I can give you a schema + migration + service layer plan that doesn’t tangle with the rest of the ecosystem.






