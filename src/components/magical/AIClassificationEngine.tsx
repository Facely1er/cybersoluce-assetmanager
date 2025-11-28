import React, { useState, useEffect } from 'react';
import { Cpu, Shield, Users, FileText, Network, AlertTriangle, CheckCircle, Clock, Brain } from 'lucide-react';

interface AssetData {
  id: string;
  name: string;
  type: 'hardware' | 'software' | 'data' | 'service' | 'vendor' | 'person';
  description: string;
  businessCriticality: 'critical' | 'high' | 'medium' | 'low';
  dataClassification: 'public' | 'internal' | 'confidential' | 'restricted';
  location: string;
  owner: string;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

interface ClassificationResult {
  assetId: string;
  primaryProduct: 'cybercaution' | 'cybersoluce' | 'vendorsoluce' | 'cybercorrect' | 'technosoluce';
  secondaryProducts: string[];
  confidence: number;
  reasoning: string[];
  suggestedActions: string[];
  enrichmentNeeds: string[];
}

interface AIInsight {
  type: 'risk' | 'compliance' | 'optimization' | 'vulnerability';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  recommendation: string;
}

const AIClassificationEngine: React.FC = () => {
  const [assets, setAssets] = useState<AssetData[]>([]);
  const [classifications, setClassifications] = useState<ClassificationResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<AssetData | null>(null);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [processingStats, setProcessingStats] = useState({
    totalAssets: 0,
    classified: 0,
    needsReview: 0,
    autoRouted: 0
  });

  // AI Classification Engine
  const classifyAsset = async (asset: AssetData): Promise<ClassificationResult> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 100));

    const keywords = `${asset.name} ${asset.description} ${asset.tags.join(' ')}`.toLowerCase();
    
    let primaryProduct: ClassificationResult['primaryProduct'] = 'cybercaution';
    let confidence = 0.5;
    const reasoning: string[] = [];
    const secondaryProducts: string[] = [];
    const suggestedActions: string[] = [];
    const enrichmentNeeds: string[] = [];

    // Vendor/Third-party detection
    if (asset.type === 'vendor' || keywords.includes('vendor') || keywords.includes('supplier') || keywords.includes('third party')) {
      primaryProduct = 'vendorsoluce';
      confidence = 0.95;
      reasoning.push('Detected vendor/supplier asset requiring risk assessment');
      suggestedActions.push('Initiate vendor risk assessment');
      suggestedActions.push('Send security questionnaire');
      enrichmentNeeds.push('Contract details', 'Security certifications', 'Financial stability rating');
    }
    // Software/Component detection
    else if (asset.type === 'software' || keywords.includes('application') || keywords.includes('software') || keywords.includes('component')) {
      primaryProduct = 'technosoluce';
      confidence = 0.90;
      reasoning.push('Software asset requires SBOM analysis and vulnerability tracking');
      suggestedActions.push('Generate SBOM analysis');
      suggestedActions.push('Scan for known vulnerabilities');
      secondaryProducts.push('cybercaution');
      enrichmentNeeds.push('Version information', 'License details', 'Dependencies');
    }
    // Data/Privacy detection
    else if (asset.type === 'data' || keywords.includes('personal') || keywords.includes('pii') || keywords.includes('gdpr') || keywords.includes('privacy')) {
      primaryProduct = 'cybercorrect';
      confidence = 0.92;
      reasoning.push('Data asset contains privacy-sensitive information');
      suggestedActions.push('Conduct privacy impact assessment');
      suggestedActions.push('Document data processing activities');
      secondaryProducts.push('cybersoluce');
      enrichmentNeeds.push('Data categories', 'Processing purposes', 'Retention periods');
    }
    // Governance/Policy detection
    else if (keywords.includes('policy') || keywords.includes('governance') || keywords.includes('compliance') || asset.businessCriticality === 'critical') {
      primaryProduct = 'cybersoluce';
      confidence = 0.88;
      reasoning.push('Strategic asset requiring governance oversight');
      suggestedActions.push('Assign to governance framework');
      suggestedActions.push('Define control mappings');
      secondaryProducts.push('cybercaution');
      enrichmentNeeds.push('Regulatory requirements', 'Control mappings', 'Risk tolerance');
    }
    // Default to CyberCaution
    else {
      primaryProduct = 'cybercaution';
      confidence = 0.75;
      reasoning.push('General security asset requiring baseline assessment');
      suggestedActions.push('Run security assessment');
      suggestedActions.push('Map to NIST framework');
      enrichmentNeeds.push('Security controls', 'Access permissions', 'Update frequency');
    }

    // Business criticality adjustments
    if (asset.businessCriticality === 'critical') {
      confidence += 0.1;
      if (!secondaryProducts.includes('cybersoluce')) {
        secondaryProducts.push('cybersoluce');
      }
      reasoning.push('Critical asset requires enhanced governance');
    }

    return {
      assetId: asset.id,
      primaryProduct,
      secondaryProducts: [...new Set(secondaryProducts)],
      confidence: Math.min(confidence, 1.0),
      reasoning,
      suggestedActions,
      enrichmentNeeds
    };
  };

  // Generate AI Insights
  const generateInsights = (classifications: ClassificationResult[]): AIInsight[] => {
    const insights: AIInsight[] = [];

    const highRiskAssets = classifications.filter(c => c.confidence < 0.7);
    if (highRiskAssets.length > 0) {
      insights.push({
        type: 'risk',
        severity: 'medium',
        title: 'Classification Uncertainty Detected',
        description: `${highRiskAssets.length} assets require manual review due to ambiguous classification`,
        recommendation: 'Review these assets manually to improve AI model accuracy'
      });
    }

    const dataAssets = classifications.filter(c => c.primaryProduct === 'cybercorrect');
    if (dataAssets.length > 5) {
      insights.push({
        type: 'compliance',
        severity: 'high',
        title: 'Privacy Compliance Focus Needed',
        description: `${dataAssets.length} data assets require privacy assessment`,
        recommendation: 'Prioritize GDPR compliance review for data processing activities'
      });
    }

    const vendorAssets = classifications.filter(c => c.primaryProduct === 'vendorsoluce');
    if (vendorAssets.length > 3) {
      insights.push({
        type: 'optimization',
        severity: 'low',
        title: 'Vendor Risk Consolidation Opportunity',
        description: `${vendorAssets.length} vendor relationships identified`,
        recommendation: 'Consider vendor consolidation to reduce supply chain risk'
      });
    }

    return insights;
  };

  // Batch process assets
  const processAssets = async () => {
    setIsAnalyzing(true);
    const results: ClassificationResult[] = [];
    
    for (const asset of assets) {
      const classification = await classifyAsset(asset);
      results.push(classification);
      
      setProcessingStats(prev => ({
        ...prev,
        classified: prev.classified + 1
      }));
    }

    setClassifications(results);
    setAiInsights(generateInsights(results));
    
    setProcessingStats({
      totalAssets: assets.length,
      classified: results.length,
      needsReview: results.filter(r => r.confidence < 0.8).length,
      autoRouted: results.filter(r => r.confidence >= 0.8).length
    });
    
    setIsAnalyzing(false);
  };

  // Sample assets for demo
  useEffect(() => {
    const sampleAssets: AssetData[] = [
      {
        id: '1',
        name: 'Customer Database',
        type: 'data',
        description: 'Primary customer data repository containing personal information',
        businessCriticality: 'critical',
        dataClassification: 'restricted',
        location: 'AWS US-East',
        owner: 'Data Team',
        tags: ['database', 'pii', 'gdpr', 'customer'],
        metadata: { records: 150000 }
      },
      {
        id: '2',
        name: 'Salesforce CRM',
        type: 'vendor',
        description: 'Cloud-based customer relationship management system',
        businessCriticality: 'high',
        dataClassification: 'internal',
        location: 'Salesforce Cloud',
        owner: 'Sales Team',
        tags: ['vendor', 'saas', 'crm'],
        metadata: { contract_expires: '2025-12-31' }
      },
      {
        id: '3',
        name: 'React Frontend Application',
        type: 'software',
        description: 'Main web application built with React and TypeScript',
        businessCriticality: 'high',
        dataClassification: 'internal',
        location: 'Internal Server',
        owner: 'Engineering Team',
        tags: ['react', 'typescript', 'web', 'application'],
        metadata: { version: '18.2.0' }
      },
      {
        id: '4',
        name: 'Security Policy Framework',
        type: 'data',
        description: 'Enterprise security governance documentation and policies',
        businessCriticality: 'critical',
        dataClassification: 'confidential',
        location: 'SharePoint',
        owner: 'CISO Office',
        tags: ['policy', 'governance', 'security', 'compliance'],
        metadata: { last_review: '2024-06-01' }
      },
      {
        id: '5',
        name: 'Development Laptop',
        type: 'hardware',
        description: 'MacBook Pro assigned to senior developer',
        businessCriticality: 'medium',
        dataClassification: 'internal',
        location: 'Remote Office',
        owner: 'John Smith',
        tags: ['laptop', 'macos', 'development'],
        metadata: { serial: 'C02YW2JPJGH5' }
      }
    ];
    
    setAssets(sampleAssets);
    setProcessingStats(prev => ({ ...prev, totalAssets: sampleAssets.length }));
  }, []);

  const getProductIcon = (product: string) => {
    switch (product) {
      case 'cybercaution': return <Shield className="w-4 h-4" />;
      case 'cybersoluce': return <Users className="w-4 h-4" />;
      case 'vendorsoluce': return <Network className="w-4 h-4" />;
      case 'cybercorrect': return <FileText className="w-4 h-4" />;
      case 'technosoluce': return <Cpu className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getProductColor = (product: string) => {
    switch (product) {
      case 'cybercaution': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300';
      case 'cybersoluce': return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300';
      case 'vendorsoluce': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300';
      case 'cybercorrect': return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300';
      case 'technosoluce': return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300';
      default: return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600 dark:text-green-400';
    if (confidence >= 0.8) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Brain className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">ERMITS AI Classification Engine</h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Intelligent asset routing powered by machine learning. Automatically classifies and routes assets to the optimal ERMITS product based on asset characteristics, business context, and risk profile.
          </p>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Assets</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{processingStats.totalAssets}</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Classified</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{processingStats.classified}</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Auto-Routed</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{processingStats.autoRouted}</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                <Brain className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Needs Review</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{processingStats.needsReview}</p>
              </div>
              <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Asset Analysis</h3>
              <p className="text-gray-600 dark:text-gray-400">Process assets through the AI classification engine</p>
            </div>
            <button
              onClick={processAssets}
              disabled={isAnalyzing}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Analyze Assets
                </>
              )}
            </button>
          </div>
        </div>

        {/* AI Insights */}
        {aiInsights.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">AI Insights</h3>
            <div className="space-y-4">
              {aiInsights.map((insight, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${
                        insight.severity === 'critical' ? 'bg-red-500' :
                        insight.severity === 'high' ? 'bg-orange-500' :
                        insight.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`} />
                      <span className="font-medium text-gray-900 dark:text-gray-100">{insight.title}</span>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      insight.type === 'risk' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                      insight.type === 'compliance' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                      insight.type === 'optimization' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                      'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
                    }`}>
                      {insight.type}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{insight.description}</p>
                  <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">{insight.recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Classification Results Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Asset Classification Results</h3>
            <p className="text-gray-600 dark:text-gray-400">AI-powered routing to optimal ERMITS products</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Asset</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Primary Product</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Confidence</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {assets.map((asset) => {
                  const classification = classifications.find(c => c.assetId === asset.id);
                  return (
                    <tr key={asset.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{asset.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{asset.description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 capitalize">
                          {asset.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {classification ? (
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getProductColor(classification.primaryProduct)}`}>
                            {getProductIcon(classification.primaryProduct)}
                            <span className="ml-2 capitalize">{classification.primaryProduct}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {classification ? (
                          <span className={`text-sm font-medium ${getConfidenceColor(classification.confidence)}`}>
                            {Math.round(classification.confidence * 100)}%
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedAsset(asset)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 text-sm font-medium"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Asset Detail Modal */}
        {selectedAsset && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Asset Details & Classification</h3>
                <button
                  onClick={() => setSelectedAsset(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
              
              {/* Asset Info */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">{selectedAsset.name}</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><strong>Type:</strong> {selectedAsset.type}</div>
                  <div><strong>Owner:</strong> {selectedAsset.owner}</div>
                  <div><strong>Criticality:</strong> {selectedAsset.businessCriticality}</div>
                  <div><strong>Classification:</strong> {selectedAsset.dataClassification}</div>
                  <div><strong>Location:</strong> {selectedAsset.location}</div>
                  <div><strong>Tags:</strong> {selectedAsset.tags.join(', ')}</div>
                </div>
              </div>

              {/* Classification Results */}
              {classifications.find(c => c.assetId === selectedAsset.id) && (
                <div className="space-y-4">
                  {(() => {
                    const classification = classifications.find(c => c.assetId === selectedAsset.id)!;
                    return (
                      <>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">AI Reasoning</h4>
                          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                            {classification.reasoning.map((reason, idx) => (
                              <li key={idx}>• {reason}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Suggested Actions</h4>
                          <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
                            {classification.suggestedActions.map((action, idx) => (
                              <li key={idx}>• {action}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Enrichment Needed</h4>
                          <div className="flex flex-wrap gap-2">
                            {classification.enrichmentNeeds.map((need, idx) => (
                              <span key={idx} className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 text-xs rounded">
                                {need}
                              </span>
                            ))}
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedAsset(null)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIClassificationEngine;

