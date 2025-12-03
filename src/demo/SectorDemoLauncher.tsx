/**
 * DEMO-ONLY:
 * Sector Demo Launcher component for generating and loading demo asset inventories.
 * Guided sales demo with sector + size + scenario selection.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Users, AlertTriangle, Rocket, Loader2, Target } from 'lucide-react';
import { generateSectorDemoAssets } from './sampleAssetInventoryGenerator';
import { getSectorDemoConfig, PrimaryScenario, SectorId } from './sectorDemoConfig';
import { buildSectorDemoSignals } from './sectorDemoSignals';
import { useAssetInventory } from '../contexts/AssetInventoryContext';
import toast from 'react-hot-toast';

const SECTORS: { value: SectorId; label: string; description: string }[] = [
  { value: 'healthcare', label: 'Healthcare', description: 'Hospitals, clinics, medical facilities' },
  { value: 'financial', label: 'Financial Services', description: 'Banks, credit unions, fintech' },
  { value: 'saas', label: 'SaaS / Technology', description: 'Software-as-a-Service companies' },
  { value: 'manufacturing', label: 'Manufacturing', description: 'Industrial and production facilities' },
  { value: 'education', label: 'Education', description: 'Universities, schools, districts' },
  { value: 'publicSector', label: 'Public Sector', description: 'Government agencies and services' },
];

const ORG_SIZES: { value: 'small' | 'medium' | 'large'; label: string; description: string }[] = [
  { value: 'small', label: 'Small', description: '25-50 assets' },
  { value: 'medium', label: 'Medium', description: '55-100 assets' },
  { value: 'large', label: 'Large', description: '100+ assets' },
];

const SCENARIOS: { value: PrimaryScenario; label: string; description: string }[] = [
  { value: 'privacy', label: 'Privacy', description: 'Data privacy and protection concerns' },
  { value: 'ransomware', label: 'Ransomware', description: 'Ransomware readiness and recovery' },
  { value: 'vendor-risk', label: 'Vendor Risk', description: 'Third-party vendor dependencies' },
  { value: 'software-supply-chain', label: 'Software Supply Chain', description: 'Software component dependencies' },
];

export const SectorDemoLauncher: React.FC = () => {
  const navigate = useNavigate();
  const { replaceAssets } = useAssetInventory();
  const [selectedSector, setSelectedSector] = useState<SectorId>('healthcare');
  const [selectedSize, setSelectedSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [selectedScenario, setSelectedScenario] = useState<PrimaryScenario>('privacy');
  const [isLoading, setIsLoading] = useState(false);

  const handleLaunchDemo = async () => {
    setIsLoading(true);
    
    try {
      // Get demo config
      const config = getSectorDemoConfig(selectedSector, selectedSize, selectedScenario);
      if (!config) {
        toast.error('Invalid demo configuration. Please try again.');
        return;
      }
      
      // Generate demo assets (wrapped in contracts)
      const demoAssets = generateSectorDemoAssets(selectedSector, selectedSize);
      
      // Generate signals
      const signals = buildSectorDemoSignals(demoAssets, config);
      
      // Store demo data in sessionStorage for orchestrator
      sessionStorage.setItem('cybersoluce_guided_demo', JSON.stringify({
        assets: demoAssets,
        signals: signals,
        config: config,
      }));

      // Convert contract assets back to Asset format for context (temporary)
      // Note: In a real implementation, we'd want to keep contracts separate
      const assetsForContext = demoAssets.map(asset => ({
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

      // Replace assets in context
      replaceAssets(assetsForContext);

      toast.success(`Demo inventory generated: ${demoAssets.length} assets for ${SECTORS.find(s => s.value === selectedSector)?.label}`);
      
      // Navigate to orchestrator
      navigate('/demo/orchestrator');
    } catch (error) {
      console.error('Failed to launch demo:', error);
      toast.error('Failed to generate demo inventory. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-command-blue-100 dark:bg-command-blue-900/30 rounded-full mb-4">
            <Rocket className="h-8 w-8 text-command-blue-600 dark:text-command-blue-400" />
          </div>
          <h1 className="text-3xl font-outfit font-bold text-gray-900 dark:text-white mb-2">
            See how asset intelligence drives your next cybersecurity move.
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Pick a sector and scenario. We'll generate a realistic asset map, highlight weak visibility points, and show you which ERMITS product takes over from there – without scores or compliance claims.
          </p>
        </div>

        {/* Demo Warning */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-xl p-6 mb-8">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-2">
                DEMO Data Notice
              </h3>
              <p className="text-sm text-yellow-800 dark:text-yellow-300">
                This is DEMO data generated for illustration only.
                It does not reflect your environment and should not be used for any decisions.
              </p>
            </div>
          </div>
        </div>

        {/* Scenario Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Target className="h-5 w-5 text-command-blue-600 dark:text-command-blue-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Scenario Focus
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SCENARIOS.map((scenario) => (
              <button
                key={scenario.value}
                onClick={() => setSelectedScenario(scenario.value)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  selectedScenario === scenario.value
                    ? 'border-command-blue-500 bg-command-blue-50 dark:bg-command-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="font-semibold text-gray-900 dark:text-white mb-1">
                  {scenario.label}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {scenario.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Sector Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Building2 className="h-5 w-5 text-command-blue-600 dark:text-command-blue-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Select Sector
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SECTORS.map((sector) => (
              <button
                key={sector.value}
                onClick={() => setSelectedSector(sector.value)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  selectedSector === sector.value
                    ? 'border-command-blue-500 bg-command-blue-50 dark:bg-command-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="font-semibold text-gray-900 dark:text-white mb-1">
                  {sector.label}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {sector.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Organization Size Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Users className="h-5 w-5 text-command-blue-600 dark:text-command-blue-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Organization Size
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ORG_SIZES.map((size) => (
              <button
                key={size.value}
                onClick={() => setSelectedSize(size.value)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  selectedSize === size.value
                    ? 'border-command-blue-500 bg-command-blue-50 dark:bg-command-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="font-semibold text-gray-900 dark:text-white mb-1">
                  {size.label}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {size.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Launch Button */}
        <div className="flex justify-center">
          <button
            onClick={handleLaunchDemo}
            disabled={isLoading}
            className="inline-flex items-center px-8 py-4 bg-command-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-command-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Generating Demo...
              </>
            ) : (
              <>
                <Rocket className="h-5 w-5 mr-2" />
                Start Guided Demo
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

