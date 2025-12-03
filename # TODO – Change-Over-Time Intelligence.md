# TODO – Change-Over-Time Intelligence (Signal Drift, No Dashboards)

## Objective (Hard Constraints)

Add **change-over-time intelligence** as a thin, domain layer that:
- Tracks how **qualitative signals** evolve over time per asset.
- Derives **“visibility drift”** insights (stable / emerging change / uncertainty / volatility).
- Never introduces:
  - scores
  - risk posture
  - compliance claims
  - charts/dashboards

UX surfaces = text-based hints and micro-insights only.

---

## 1. Signal History Contract (Time Series, Facts Only)

### 1.1 Create Signal History Contract

**File:** `src/contracts/cyberSoluce.signalHistory.contract.ts`

**Tasks:**
- Define:

```ts
import { AssetSignal } from '@/contracts/cyberSoluce.signal.contract';

export interface SignalSnapshot {
  assetId: string;
  capturedAt: string; // ISO timestamp
  signals: AssetSignal[];
  source: 'cybersoluce' | 'technosoluce' | 'vendorsoluce' | 'cybercaution' | 'demo';
}

export interface SignalHistory {
  assetId: string;
  snapshots: SignalSnapshot[];
}
