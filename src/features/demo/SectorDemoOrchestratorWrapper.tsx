/**
 * Sector Demo Orchestrator Wrapper
 * 
 * Loads demo data from sessionStorage and renders the orchestrator.
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SectorDemoOrchestrator } from './SectorDemoOrchestrator';
import { CyberSoluceAssetContract } from '../../contracts/cyberSoluce.asset.contract';
import { CyberSoluceSignalContract } from '../../contracts/cyberSoluce.signal.contract';
import { SectorDemoConfig } from '../../demo/sectorDemoConfig';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export const SectorDemoOrchestratorWrapper: React.FC = () => {
  const navigate = useNavigate();
  const [assets, setAssets] = useState<CyberSoluceAssetContract[] | null>(null);
  const [signals, setSignals] = useState<CyberSoluceSignalContract[] | null>(null);
  const [config, setConfig] = useState<SectorDemoConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const demoDataStr = sessionStorage.getItem('cybersoluce_guided_demo');
      if (!demoDataStr) {
        // No demo data, redirect to launcher
        navigate('/demo/sector');
        return;
      }

      const demoData = JSON.parse(demoDataStr);
      setAssets(demoData.assets || []);
      setSignals(demoData.signals || []);
      setConfig(demoData.config);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load demo data:', error);
      navigate('/demo/sector');
    }
  }, [navigate]);

  if (loading || !assets || !signals || !config) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading demo..." />
      </div>
    );
  }

  return <SectorDemoOrchestrator assets={assets} signals={signals} config={config} />;
};

