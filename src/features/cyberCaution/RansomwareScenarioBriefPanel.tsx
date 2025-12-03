/**
 * Ransomware Scenario Brief Panel
 * 
 * Displays a generated markdown scenario brief for ransomware tabletop exercises
 * based on current exposure band and asset visibility readiness.
 * 
 * RULES:
 * - NO risk, posture, compliant, secure/insecure language
 * - Only scenario planning language
 * - Focus on visibility, stability, uncertainty, decision-making
 */

import { useMemo, useState, useEffect } from 'react';
import { AssetScenarioReadiness } from '@/cybercaution/readiness/readinessMapper';
import { generateRansomwareScenarioBriefMarkdown, ExposureBand } from '@/cybercaution/tabletop/scenarioBriefGenerator';
import { useAssetInventory } from '@/contexts/AssetInventoryContext';
import { signalDetectionService } from '@/services/signalDetectionService';
import { computeAssetScenarioReadiness } from '@/cybercaution/readiness/assetReadinessService';
import { FocusSignal } from '@/types/enrichment';
import { getDemoContext } from '@/demo/demoDataManager';
import { Copy, Check } from 'lucide-react';

type Props = {
  orgName?: string;
  sector?: string;
  exposureBand: ExposureBand;
};

export function RansomwareScenarioBriefPanel({ orgName, sector, exposureBand }: Props) {
  const { assets, loading: assetsLoading } = useAssetInventory();
  const [signals, setSignals] = useState<FocusSignal[]>([]);
  const [signalsLoading, setSignalsLoading] = useState(false);
  const [readiness, setReadiness] = useState<AssetScenarioReadiness[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [copied, setCopied] = useState(false);

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
        console.error('Failed to compute readiness for scenario brief:', e);
        if (!isMounted) return;
        setError('Could not generate scenario brief data. Please try again.');
      }
    })();
    
    return () => {
      isMounted = false;
    };
  }, [assets, signals, assetsLoading, signalsLoading]);

  const loading = assetsLoading || signalsLoading;

  const markdown = useMemo(() => {
    if (!exposureBand || !readiness.length) return '';
    return generateRansomwareScenarioBriefMarkdown({
      orgName,
      sector,
      exposureBand,
      readiness,
    });
  }, [orgName, sector, exposureBand, readiness]);

  const handleCopy = async () => {
    if (!markdown) return;
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy scenario brief:', e);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-4">
        <p className="text-xs text-muted-foreground">Preparing scenario brief…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-red-200 dark:border-red-800 shadow-sm p-4">
        <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (!exposureBand || !markdown) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-4">
        <p className="text-xs text-muted-foreground">No exposure band or readiness data available yet.</p>
      </div>
    );
  }

  return (
    <section className="space-y-3">
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <header className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
              Ransomware Tabletop Scenario Brief
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Generated from current exposure band and asset visibility readiness. Copy into your tabletop materials.
            </p>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded px-2.5 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Copy Markdown
              </>
            )}
          </button>
        </header>

        <div className="p-4">
          <pre className="text-[11px] bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded p-3 max-h-96 overflow-auto whitespace-pre-wrap font-mono text-gray-800 dark:text-gray-200">
            {markdown}
          </pre>
        </div>
      </div>
    </section>
  );
}

