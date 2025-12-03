/**
 * CyberCaution Pre-Check Page
 * 
 * Page component for the scenario pre-check feature.
 */

import { ScenarioPreCheckPanel } from '@/features/cyberCaution/ScenarioPreCheckPanel';

export default function CyberCautionPreCheckPage() {
  return (
    <main className="p-4 space-y-4">
      <ScenarioPreCheckPanel scenario="ransomware" />
    </main>
  );
}

