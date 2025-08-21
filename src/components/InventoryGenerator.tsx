import React, { useState } from 'react';
import { Building2, Download, RefreshCw, Info } from 'lucide-react';
import { INVENTORY_SCENARIOS, generateAssetInventory, InventoryScenario } from '../data/assetGenerators';
import { Asset } from '../types/asset';
import { exportToCSV } from '../utils/assetUtils';
import { toast } from 'react-hot-toast';

interface InventoryGeneratorProps {
  onInventoryGenerated: (assets: Asset[], scenarioName: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const InventoryGenerator: React.FC<InventoryGeneratorProps> = ({
  onInventoryGenerated,
  isOpen,
  onClose
}) => {
  const [selectedScenario, setSelectedScenario] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAssets, setGeneratedAssets] = useState<Asset[]>([]);

  const handleGenerate = async () => {
    if (!selectedScenario) {
      toast.error('Please select a scenario');
      return;
    }

    setIsGenerating(true);
    try {
      // Add a small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const assets = generateAssetInventory(selectedScenario);
      const scenario = INVENTORY_SCENARIOS.find(s => s.id === selectedScenario);
      
      setGeneratedAssets(assets);
      onInventoryGenerated(assets, scenario?.name || selectedScenario);
      
      toast.success(`Generated ${assets.length} assets for ${scenario?.name}`);
    } catch (error) {
      toast.error('Failed to generate inventory');
      console.error('Generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = async () => {
    if (generatedAssets.length === 0) {
      toast.error('No assets to export');
      return;
    }

    try {
      await exportToCSV(generatedAssets);
      toast.success('Inventory exported successfully');
    } catch (error) {
      toast.error('Failed to export inventory');
    }
  };

  const handleLoadToInventory = () => {
    if (generatedAssets.length === 0) {
      toast.error('No assets to load');
      return;
    }

    const scenario = INVENTORY_SCENARIOS.find(s => s.id === selectedScenario);
    onInventoryGenerated(generatedAssets, scenario?.name || selectedScenario);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-command-blue-600 to-action-cyan-500 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-outfit font-bold">Asset Inventory Generator</h2>
                <p className="text-sm opacity-90">Generate realistic asset inventories for different scenarios</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Scenario Selection */}
            <div>
              <h3 className="text-lg font-outfit font-semibold text-gray-900 mb-4">
                Select Scenario
              </h3>
              <div className="space-y-3">
                {INVENTORY_SCENARIOS.map((scenario) => (
                  <div
                    key={scenario.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedScenario === scenario.id
                        ? 'border-command-blue-500 bg-command-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedScenario(scenario.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{scenario.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{scenario.description}</p>
                        <div className="flex items-center mt-2 text-xs text-gray-500">
                          <span className="bg-gray-100 px-2 py-1 rounded">
                            ~{scenario.assetCount} assets
                          </span>
                        </div>
                      </div>
                      <input
                        type="radio"
                        checked={selectedScenario === scenario.id}
                        onChange={() => setSelectedScenario(scenario.id)}
                        className="mt-1 h-4 w-4 text-command-blue-600 focus:ring-command-blue-500"
                      />
                    </div>
                    <div className="mt-3">
                      <div className="flex flex-wrap gap-1">
                        {scenario.characteristics.map((char) => (
                          <span
                            key={char}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {char}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Preview and Actions */}
            <div>
              <h3 className="text-lg font-outfit font-semibold text-gray-900 mb-4">
                Preview & Actions
              </h3>
              
              {selectedScenario && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center mb-2">
                    <Info className="h-4 w-4 text-blue-500 mr-2" />
                    <span className="text-sm font-medium text-gray-900">Scenario Details</span>
                  </div>
                  {(() => {
                    const scenario = INVENTORY_SCENARIOS.find(s => s.id === selectedScenario);
                    return scenario ? (
                      <div className="text-sm text-gray-600">
                        <p className="mb-2">{scenario.description}</p>
                        <p><strong>Expected Assets:</strong> ~{scenario.assetCount}</p>
                        <p><strong>Characteristics:</strong> {scenario.characteristics.join(', ')}</p>
                      </div>
                    ) : null;
                  })()}
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={handleGenerate}
                  disabled={!selectedScenario || isGenerating}
                  className="w-full flex items-center justify-center px-4 py-3 bg-command-blue-600 text-white rounded-lg hover:bg-command-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Generate Inventory
                    </>
                  )}
                </button>

                {generatedAssets.length > 0 && (
                  <>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm text-green-800">
                        ✓ Generated {generatedAssets.length} assets successfully
                      </p>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={handleExport}
                        className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export CSV
                      </button>
                      
                      <button
                        onClick={handleLoadToInventory}
                        className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Load to Inventory
                      </button>
                    </div>
                  </>
                )}
              </div>

              {generatedAssets.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Asset Summary</h4>
                  <div className="space-y-2">
                    {(() => {
                      const summary = generatedAssets.reduce((acc, asset) => {
                        acc[asset.type] = (acc[asset.type] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>);

                      return Object.entries(summary).map(([type, count]) => (
                        <div key={type} className="flex justify-between text-sm">
                          <span className="text-gray-600">{type}</span>
                          <span className="font-medium">{count}</span>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};