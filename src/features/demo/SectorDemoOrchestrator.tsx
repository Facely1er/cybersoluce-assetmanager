/**
 * Sector Demo Orchestrator
 * 
 * Displays demo summary, asset preview, signals, and connects to focus funnel.
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Users, Target, ArrowRight, Eye, EyeOff, AlertCircle, Info } from 'lucide-react';
import { CyberSoluceAssetContract } from '../../contracts/cyberSoluce.asset.contract';
import { CyberSoluceSignalContract } from '../../contracts/cyberSoluce.signal.contract';
import { SectorDemoConfig } from '../../demo/sectorDemoConfig';
import { useFocusFunnel } from '../../funnel/useFocusFunnel';
import { FocusSignal } from '../../types/enrichment';
import { exportToCyberCorrect } from '../../exports/toCyberCorrect';
import { exportToCyberCaution } from '../../exports/toCyberCaution';
import { exportToVendorSoluce } from '../../exports/toVendorSoluce';
import { exportToTechnoSoluce } from '../../exports/toTechnoSoluce';
import { exportToERMITSAdvisory } from '../../exports/toERMITSAdvisory';
import { validateExport } from '../../guards/contractGuard';
import toast from 'react-hot-toast';

export interface SectorDemoOrchestratorProps {
  assets: CyberSoluceAssetContract[];
  signals: CyberSoluceSignalContract[];
  config: SectorDemoConfig;
}

const PRODUCT_NAMES: Record<string, string> = {
  CyberCorrect: 'CyberCorrect',
  CyberCaution: 'CyberCaution',
  VendorSoluce: 'VendorSoluce',
  TechnoSoluce: 'TechnoSoluce',
  ERMITSAdvisory: 'ERMITS Advisory',
};

export const SectorDemoOrchestrator: React.FC<SectorDemoOrchestratorProps> = ({
  assets,
  signals,
  config,
}) => {
  const navigate = useNavigate();
  const [showHandoffPayload, setShowHandoffPayload] = useState(false);
  const [exportPayload, setExportPayload] = useState<unknown>(null);
  const [contractViolation, setContractViolation] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);

  // Convert signals to FocusSignal format for useFocusFunnel
  const focusSignals: FocusSignal[] = signals.map(signal => ({
    id: signal.signalId,
    signal_type: signal.signalType,
    signal_domain: signal.signalDomain,
    description: signal.description,
    concentration_description: signal.concentrationDescription || '',
    detected_at: new Date(signal.timestamp),
    affected_asset_ids: signal.affectedAssetIds,
  }));

  // Map scenario to user intent
  const userIntentMap: Record<string, 'privacy-concern' | 'threat-readiness' | 'vendor-management' | 'software-analysis' | 'governance-review'> = {
    'privacy': 'privacy-concern',
    'ransomware': 'threat-readiness',
    'vendor-risk': 'vendor-management',
    'software-supply-chain': 'software-analysis',
  };

  const userIntent = userIntentMap[config.primaryScenario] || 'privacy-concern';

  // Use focus funnel in demo mode
  const decisions = useFocusFunnel(focusSignals, { userIntent, mode: 'demo' });
  const primaryDecision = decisions.length > 0 ? decisions[0] : null;

  // Generate export payload when decision is available
  useEffect(() => {
    if (!primaryDecision) return;

    let isMounted = true;

    (async () => {
      try {
        setExportError(null);
        setContractViolation(null);

        // Convert contract assets back to Asset format for export adapters
        // Note: This is a temporary conversion - in production, adapters should work with contracts directly
        const assetsForExport = assets.map(asset => ({
          id: asset.assetId,
          name: asset.name,
          type: asset.type,
          criticality: 'Medium' as const,
          owner: asset.owner,
          location: asset.location,
          ipAddress: asset.ipAddress,
          description: asset.description,
          complianceFrameworks: asset.complianceFrameworks,
          riskScore: 50,
          lastAssessed: new Date(asset.lastAssessed),
          tags: asset.tags,
          relationships: [],
          vulnerabilities: [],
          status: asset.status,
          createdAt: new Date(asset.createdAt),
          updatedAt: new Date(asset.updatedAt),
          dataClassification: asset.dataClassification,
          dataTypes: asset.dataTypes,
          retentionPeriod: asset.retentionPeriod,
          legalBasis: asset.legalBasis,
          dataSubjectRights: asset.dataSubjectRights,
          crossBorderTransfer: asset.crossBorderTransfer,
          thirdPartySharing: asset.thirdPartySharing,
          encryptionStatus: asset.encryptionStatus,
          accessControls: [],
          privacyImpactAssessment: null,
          dataBreachHistory: [],
          dependencies: [],
          requirements: [],
        }));

        const signalsForExport = focusSignals;

        let payload: unknown;
        switch (primaryDecision.destination) {
          case 'CyberCorrect':
            payload = exportToCyberCorrect(assetsForExport, [], signalsForExport);
            break;
          case 'CyberCaution':
            payload = await exportToCyberCaution(assetsForExport, [], signalsForExport);
            break;
          case 'VendorSoluce':
            payload = await exportToVendorSoluce(assetsForExport, [], signalsForExport);
            break;
          case 'TechnoSoluce':
            payload = exportToTechnoSoluce(assetsForExport, [], signalsForExport);
            break;
          case 'ERMITSAdvisory':
            payload = await exportToERMITSAdvisory(assetsForExport, [], signalsForExport);
            break;
          default:
            payload = null;
        }

        if (!isMounted) return;

        if (payload) {
          // Validate export payload
          const validation = validateExport(payload as { manifest?: unknown; assets?: unknown[]; dependencies?: unknown[]; signals?: unknown[]; drift?: unknown[] }, `exportTo${primaryDecision.destination}`);
          
          if (!validation.valid) {
            setContractViolation(validation.violations.join('\n'));
            if (process.env.NODE_ENV === 'development') {
              console.error('[ContractGuard] Demo payload violated data contract:', validation.violations);
              toast.error('Demo payload validation failed - see console');
            }
          } else {
            setContractViolation(null);
          }
          
          setExportPayload(payload);
          setExportError(null);
        }
      } catch (error) {
        if (!isMounted) return;
        console.error('Failed to generate export payload:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setExportError('We could not generate this export preview. Please try again or use live mode.');
        setContractViolation(`Error generating payload: ${errorMessage}`);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [primaryDecision, assets, focusSignals]);

  // Group assets by type
  const assetsByType = assets.reduce((acc, asset) => {
    if (!acc[asset.type]) {
      acc[asset.type] = [];
    }
    acc[asset.type]!.push(asset);
    return acc;
  }, {} as Record<string, CyberSoluceAssetContract[]>);

  const sectorLabel = config.sectorId.charAt(0).toUpperCase() + config.sectorId.slice(1);
  const sizeLabel = config.orgSize.charAt(0).toUpperCase() + config.orgSize.slice(1);
  const scenarioLabel = config.primaryScenario.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-outfit font-bold text-gray-900 dark:text-white mb-2">
            Guided Demo: {sectorLabel} Sector
          </h1>
          <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <Building2 className="h-4 w-4" />
              <span>{sectorLabel}</span>
            </div>
            <span>•</span>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Size: {sizeLabel}</span>
            </div>
            <span>•</span>
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>Scenario: {scenarioLabel}</span>
            </div>
          </div>
        </div>

        {/* Export Error Warning */}
        {exportError && (
          <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900 dark:text-red-200 mb-1">
                  Export Generation Failed
                </h3>
                <p className="text-sm text-red-800 dark:text-red-300">
                  {exportError}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Contract Violation Warning */}
        {contractViolation && !exportError && (
          <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900 dark:text-red-200 mb-1">
                  Demo payload violated data contract
                </h3>
                <p className="text-sm text-red-800 dark:text-red-300 font-mono">
                  {contractViolation}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Asset Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Asset Inventory Preview ({assets.length} assets)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(assetsByType).slice(0, 8).map(([type, typeAssets]) => (
              <div key={type} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-sm font-medium text-gray-900 dark:text-white">{type}</div>
                <div className="text-2xl font-bold text-command-blue-600 dark:text-command-blue-400">
                  {typeAssets.length}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Signals Preview */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Notable Signals ({signals.length} signals)
          </h2>
          <div className="space-y-3">
            {signals.slice(0, 5).map((signal) => (
              <div key={signal.signalId} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                  {signal.description}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {signal.signalDomain} • {signal.signalType} • {signal.affectedAssetIds.length} assets
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Focus Funnel Result */}
        {primaryDecision && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Recommended Next Step
              </h2>
              <button
                onClick={() => setShowHandoffPayload(!showHandoffPayload)}
                className="flex items-center space-x-2 px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {showHandoffPayload ? (
                  <>
                    <EyeOff className="h-4 w-4" />
                    <span>Hide Handoff Payload</span>
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4" />
                    <span>Show Handoff Payload</span>
                  </>
                )}
              </button>
            </div>
            
            <div className="mb-4">
              <div className="text-2xl font-bold text-command-blue-600 dark:text-command-blue-400 mb-2">
                {PRODUCT_NAMES[primaryDecision.destination]} – {primaryDecision.handoffIntent.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </div>
              <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {primaryDecision.rationale}
              </div>
            </div>

            {showHandoffPayload && exportPayload !== null && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <pre className="text-xs overflow-auto max-h-96 font-mono text-gray-800 dark:text-gray-200">
                  {JSON.stringify(exportPayload, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* What Happens Next Panel */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-6">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-3">
                What happens next?
              </h3>
              <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
                <li>• CyberSoluce stops at asset intelligence and qualitative signals.</li>
                <li>• Specialized ERMITS products interpret those signals for privacy, threats, vendors, or software supply chain.</li>
                <li>• You stay in control of decisions – our tools just make the landscape visible.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => navigate('/demo/sector')}
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Start New Demo
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-command-blue-600 text-white rounded-xl font-semibold hover:bg-command-blue-700 transition-colors flex items-center space-x-2"
          >
            <span>View in Dashboard</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

