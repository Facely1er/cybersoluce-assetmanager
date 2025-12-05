/**
 * FocusFunnel shows where attention clusters (privacy, ransomware, vendor, software, governance).
 * It must NOT:
 * - Act as a remediation engine
 * - Present posture or compliance conclusions
 * - Directly sell or mandate ERMITS products
 * 
 * Presents focus blocks that link to ERMITS services.
 * Uses language that suggests focus, not solutions.
 */

import React, { useState } from 'react';
import { 
  Shield, 
  Lock, 
  Building2, 
  Code, 
  FileText,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { FocusSignal } from '../types/enrichment';
import { SECTOR_SIGNAL_NARRATIVES, FocusSignalType } from '../demo/sectorNarratives';
import { getDemoContext } from '../demo/demoDataManager';
import { SectorKey } from '../demo/sampleAssetInventoryGenerator';
import { AssetSelector } from './funnel/AssetSelector';
import { ActiveFunnelRouter } from '../funnel/activeFunnelRouter';
import { useAssetInventory } from '../contexts/AssetInventoryContext';
import { useNavigate } from 'react-router-dom';

interface FocusFunnelProps {
  signals: FocusSignal[];
  enableActiveRouting?: boolean; // New prop to enable active routing
}

interface ServiceMapping {
  domain: FocusSignal['signal_domain'];
  serviceName: string;
  serviceUrl: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  description: string;
}

const SERVICE_MAPPINGS: ServiceMapping[] = [
  {
    domain: 'privacy',
    serviceName: 'CyberCorrect',
    serviceUrl: '/services/cybercorrect',
    icon: Shield,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    description: 'Privacy exposure evaluation and compliance support',
  },
  {
    domain: 'ransomware',
    serviceName: 'CyberCaution',
    serviceUrl: '/services/cybercaution',
    icon: Lock,
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    description: 'Ransomware readiness assessment and protection strategies',
  },
  {
    domain: 'vendor',
    serviceName: 'VendorSoluce',
    serviceUrl: '/services/vendorsoluce',
    icon: Building2,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    description: 'Vendor dependency analysis and risk management',
  },
  {
    domain: 'software',
    serviceName: 'TechnoSoluce',
    serviceUrl: '/services/technosoluce',
    icon: Code,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    description: 'Software dependency and component risk analysis',
  },
  {
    domain: 'governance',
    serviceName: 'ERMITS Advisory',
    serviceUrl: '/services/advisory',
    icon: FileText,
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    description: 'Governance and compliance advisory services',
  },
];

export const FocusFunnel: React.FC<FocusFunnelProps> = ({ signals, enableActiveRouting = false }) => {
  // Get demo context for sector-aware narratives
  const demoContext = getDemoContext();
  const sector = demoContext.sector || 'saas'; // Default to saas if no demo context
  
  // State for active routing
  const [showAssetSelector, setShowAssetSelector] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<FocusSignal['signal_domain'] | null>(null);
  const [routingInProgress, setRoutingInProgress] = useState(false);
  
  // Get assets from context
  const { assets } = useAssetInventory();
  const navigate = useNavigate();
  
  // Dependencies can be empty array for now (can be enhanced later)
  const dependencies: any[] = [];

  // Group signals by domain
  const signalsByDomain = signals.reduce((acc, signal) => {
    if (!acc[signal.signal_domain]) {
      acc[signal.signal_domain] = [];
    }
    acc[signal.signal_domain].push(signal);
    return acc;
  }, {} as Record<FocusSignal['signal_domain'], FocusSignal[]>);

  // Get unique domains with signals
  const activeDomains = Object.keys(signalsByDomain) as FocusSignal['signal_domain'][];

  if (activeDomains.length === 0) {
    return (
      <Card>
        <CardContent>
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              No focus signals detected at this time
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Focus areas will appear here as asset intelligence identifies concentration patterns
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="text-2xl font-outfit font-semibold text-gray-900 dark:text-white mb-2">
          Focus Areas
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Dependency-aware visibility into where attention may be warranted
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeDomains.map((domain) => {
          const domainSignals = signalsByDomain[domain];
          const serviceMapping = SERVICE_MAPPINGS.find(s => s.domain === domain);
          
          if (!serviceMapping) return null;

          const totalAffectedAssets = new Set(
            domainSignals.flatMap(s => s.affected_asset_ids)
          ).size;

          return (
            <Card
              key={domain}
              className={`${serviceMapping.bgColor} feature-card`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-lg ${serviceMapping.bgColor} border border-border`}>
                      <serviceMapping.icon className={`h-6 w-6 ${serviceMapping.color}`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {getFocusTitle(domain, sector)}
                      </CardTitle>
                      <CardDescription className="text-xs mt-1">
                        {totalAffectedAssets} asset{totalAffectedAssets !== 1 ? 's' : ''} affected
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
              <div className="space-y-3 mb-4">
                {domainSignals.map((signal) => {
                  // Get sector-specific narrative if available
                  const narrative = getSectorNarrative(sector, domain);
                  
                  return (
                    <Card key={signal.id} className="mb-3">
                      <CardContent className="p-3">
                      {narrative ? (
                        <>
                          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                            {narrative.summary}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                            {narrative.whyItMatters}
                          </p>
                          {narrative.typicalConsequences.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                              <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Typical considerations:
                              </p>
                              <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                                {narrative.typicalConsequences.map((consequence, idx) => (
                                  <li key={idx} className="flex items-start">
                                    <span className="text-gray-400 mr-2">•</span>
                                    <span>{consequence}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                            {signal.concentration_description}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {signal.description}
                          </p>
                        </>
                      )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-3">
                  These signals may warrant deeper evaluation
                </p>
                {enableActiveRouting ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedDomain(domain);
                      setShowAssetSelector(true);
                    }}
                    disabled={routingInProgress}
                    className={`${serviceMapping.color} border-current`}
                  >
                    {routingInProgress ? 'Routing...' : `Route to ${serviceMapping.serviceName}`}
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                ) : (
                  <a
                    href={serviceMapping.serviceUrl}
                    className={`inline-flex items-center text-sm font-medium ${serviceMapping.color} hover:underline`}
                  >
                    Explore {serviceMapping.serviceName}
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </a>
                )}
              </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Asset Selector Dialog for Active Routing */}
      {enableActiveRouting && showAssetSelector && selectedDomain && (
        <Dialog open={showAssetSelector} onOpenChange={setShowAssetSelector}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Select Assets to Route to {SERVICE_MAPPINGS.find(s => s.domain === selectedDomain)?.serviceName}
              </DialogTitle>
            </DialogHeader>
            <AssetSelector
              assets={assets}
              signals={signals}
              signalDomain={selectedDomain}
              onConfirm={async (selectedAssetIds) => {
                setRoutingInProgress(true);
                try {
                  const selectedAssets = assets.filter(a => selectedAssetIds.includes(a.id));
                  const domainSignals = signals.filter(s => s.signal_domain === selectedDomain);
                  
                  let result;
                  switch (selectedDomain) {
                    case 'privacy':
                      result = await ActiveFunnelRouter.routeToCyberCorrect(selectedAssets, domainSignals, dependencies);
                      break;
                    case 'vendor':
                      result = await ActiveFunnelRouter.routeToVendorSoluce(selectedAssets, domainSignals, dependencies);
                      break;
                    case 'software':
                      result = await ActiveFunnelRouter.routeToTechnoSoluce(selectedAssets, domainSignals, dependencies);
                      break;
                    default:
                      result = {
                        success: false,
                        destination: 'CyberCorrect',
                        assetCount: 0,
                        exportPayloadSize: 0,
                        navigationUrl: '/',
                        error: 'Unsupported domain',
                      };
                  }
                  
                  if (result.success) {
                    // Navigate to the target service
                    navigate(result.navigationUrl);
                    setShowAssetSelector(false);
                  } else {
                    alert(`Routing failed: ${result.error}`);
                  }
                } catch (error) {
                  console.error('Routing error:', error);
                  alert('Failed to route assets. Please try again.');
                } finally {
                  setRoutingInProgress(false);
                }
              }}
              onCancel={() => {
                setShowAssetSelector(false);
                setSelectedDomain(null);
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

/**
 * Get focus title for domain (sector-aware)
 */
function getFocusTitle(domain: FocusSignal['signal_domain'], sector: SectorKey): string {
  // Map signal domain to narrative type
  const domainToNarrativeType: Record<FocusSignal['signal_domain'], FocusSignalType | null> = {
    privacy: 'privacyExposure',
    ransomware: 'ransomwareExposure',
    vendor: 'vendorDependence',
    software: 'softwareConcentration',
    governance: 'governanceAmbiguity',
  };

  const narrativeType = domainToNarrativeType[domain];
  if (narrativeType) {
    const narrative = SECTOR_SIGNAL_NARRATIVES[sector]?.[narrativeType];
    if (narrative) {
      return narrative.title;
    }
  }

  // Fallback to generic titles
  const titles: Record<FocusSignal['signal_domain'], string> = {
    privacy: 'Review Privacy Exposure',
    ransomware: 'Assess Ransomware Readiness',
    vendor: 'Evaluate Vendor Dependence',
    software: 'Analyze Software Risk',
    governance: 'Review Governance Ambiguity',
  };
  return titles[domain] || 'Focus Area';
}

/**
 * Get sector-specific narrative for a signal domain
 */
function getSectorNarrative(
  sector: SectorKey,
  domain: FocusSignal['signal_domain']
): typeof SECTOR_SIGNAL_NARRATIVES[SectorKey][FocusSignalType] | null {
  const domainToNarrativeType: Record<FocusSignal['signal_domain'], FocusSignalType | null> = {
    privacy: 'privacyExposure',
    ransomware: 'ransomwareExposure',
    vendor: 'vendorDependence',
    software: 'softwareConcentration',
    governance: 'governanceAmbiguity',
  };

  const narrativeType = domainToNarrativeType[domain];
  if (!narrativeType) return null;

  return SECTOR_SIGNAL_NARRATIVES[sector]?.[narrativeType] || null;
}

