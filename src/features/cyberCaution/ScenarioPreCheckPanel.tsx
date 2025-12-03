/**
 * Scenario Pre-Check Panel
 * 
 * CyberCaution-facing view that lists assets grouped by visibility readiness for scenarios.
 * 
 * RULES:
 * - NO risk, posture, compliant, secure/insecure language
 * - Only talks about visibility, stability, uncertainty
 * - Uses drift + SBOM + vendor signals (no risk scores)
 */

import { useEffect, useState } from 'react';
import { computeAssetScenarioReadiness, AssetScenarioReadiness } from '@/cybercaution/readiness/assetReadinessService';
import { useAssetInventory } from '@/contexts/AssetInventoryContext';
import { signalDetectionService } from '@/services/signalDetectionService';
import { FocusSignal } from '@/types/enrichment';
import { getDemoContext } from '@/demo/demoDataManager';
import { CheckCircle2, AlertCircle, XCircle, HelpCircle } from 'lucide-react';

type Props = {
  scenario?: 'ransomware' | 'incident' | 'generic';
};

export function ScenarioPreCheckPanel({ scenario = 'ransomware' }: Props) {
  const { assets, loading: assetsLoading } = useAssetInventory();
  const [signals, setSignals] = useState<FocusSignal[]>([]);
  const [signalsLoading, setSignalsLoading] = useState(false);
  const [readiness, setReadiness] = useState<AssetScenarioReadiness[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  // Check for demo mode
  useEffect(() => {
    const demoContext = getDemoContext();
    setIsDemo(demoContext.isDemoMode);
  }, []);

  // Load signals when assets change
  useEffect(() => {
    const loadSignals = async () => {
      if (assets.length === 0) {
        setSignals([]);
        return;
      }

      setSignalsLoading(true);
      try {
        const detectedSignals = await signalDetectionService.detectSignals(assets, { isDemo });
        setSignals(detectedSignals);
      } catch (err) {
        console.error('Failed to detect signals:', err);
        setSignals([]);
      } finally {
        setSignalsLoading(false);
      }
    };

    loadSignals();
  }, [assets, isDemo]);

  // Compute readiness when assets and signals are ready
  useEffect(() => {
    if (assetsLoading || signalsLoading) return;
    
    let isMounted = true;
    (async () => {
      try {
        const result = await computeAssetScenarioReadiness(assets, signals);
        if (!isMounted) return;
        setReadiness(result);
        setError(null);
      } catch (e) {
        console.error('Failed to compute scenario readiness:', e);
        if (!isMounted) return;
        setError('Could not compute scenario readiness. Please try again or refresh the page.');
      }
    })();
    
    return () => {
      isMounted = false;
    };
  }, [assets, signals, assetsLoading, signalsLoading]);

  const loading = assetsLoading || signalsLoading;

  // Group by readiness
  const ready = readiness.filter(r => r.readiness === 'ready');
  const needsClarification = readiness.filter(r => r.readiness === 'needs-clarification');
  const unstable = readiness.filter(r => r.readiness === 'unstable');
  const noHistory = readiness.filter(r => r.readiness === 'no-history');

  // Readiness card configuration
  const readinessConfig = [
    {
      title: 'Visibility Ready',
      items: ready,
      icon: CheckCircle2,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
      description: 'Assets with stable visibility – good candidates to anchor your scenario.',
    },
    {
      title: 'Needs Clarification',
      items: needsClarification,
      icon: AlertCircle,
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      description: 'Assets where visibility is changing – clarify before using them as critical scenario components.',
    },
    {
      title: 'Unstable Visibility',
      items: unstable,
      icon: XCircle,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-800',
      description: 'Assets with high variance or growing uncertainty – typically poor anchors for a precise scenario.',
    },
    {
      title: 'No History Yet',
      items: noHistory,
      icon: HelpCircle,
      color: 'text-gray-600 dark:text-gray-400',
      bgColor: 'bg-gray-50 dark:bg-gray-900/20',
      borderColor: 'border-gray-200 dark:border-gray-800',
      description: 'Assets without historical visibility – import more data or include them cautiously.',
    },
  ];

  return (
    <section className="space-y-4">
      <header className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {scenario === 'ransomware' ? 'Ransomware Scenario Pre-Check' : 'Scenario Pre-Check'}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          This view highlights how stable your visibility is for assets you might include in a {scenario} scenario.
        </p>
      </header>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {loading && (
        <div className="p-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Loading assets and signals…</p>
        </div>
      )}

      {!loading && !error && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {readinessConfig.map((config) => {
            const Icon = config.icon;
            return (
              <div
                key={config.title}
                className={`border rounded-lg p-4 ${config.bgColor} ${config.borderColor}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`h-5 w-5 ${config.color}`} />
                  <h3 className={`text-sm font-semibold ${config.color}`}>{config.title}</h3>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                  {config.description}
                </p>
                <ul className="space-y-1 max-h-40 overflow-auto text-xs">
                  {config.items.map(r => (
                    <li key={r.assetId} className="text-gray-700 dark:text-gray-300">
                      • {r.name ?? r.assetId}
                    </li>
                  ))}
                  {!config.items.length && (
                    <li className="text-gray-500 dark:text-gray-500 italic">None identified yet.</li>
                  )}
                </ul>
                {config.items.length > 0 && (
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                    {config.items.length} asset{config.items.length !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

