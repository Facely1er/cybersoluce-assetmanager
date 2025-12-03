// ERMITS platform – STEEL integration types only.
// Diagnostics run in CyberCaution; this repo only consumes the summary.

export type SteelExposureBand = 'low' | 'medium' | 'elevated' | 'high';

export interface SteelReadinessSummary {
  band: SteelExposureBand;
  keySignals: string[];   // short phrases from CyberCaution
  generatedAt: string;    // ISO timestamp
  source?: 'cyberCaution';
}
// No React components, no narratives, no scoring logic here.
