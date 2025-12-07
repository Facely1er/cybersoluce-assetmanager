import React, { useState, useEffect } from 'react';
import { X, Server, Shield, Network, AlertTriangle, Calendar, MapPin, User, Tag, HardDrive } from 'lucide-react';
import { Asset } from '../types/asset';
import { getCriticalityColor, getStatusColor, getRiskScoreColor } from '../utils/assetUtils';
import { format } from 'date-fns';
import { signalHistoryStore } from '../time/signalHistoryStore';
import { analyzeSignalDrift } from '../time/signalDriftAnalyzer';
import { DriftInsight } from '../contracts/cyberSoluce.drift.contract';
import { EnrichedDataDisplay } from './assets/EnrichedDataDisplay';
import { logger } from '../utils/logger';

interface AssetDetailModalProps {
  asset: Asset | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
}

export const AssetDetailModal: React.FC<AssetDetailModalProps> = ({
  asset,
  isOpen,
  onClose,
  onEdit,
}) => {
  const [driftInsight, setDriftInsight] = useState<DriftInsight | null>(null);

  // Load drift insight when asset changes
  useEffect(() => {
    if (!isOpen || !asset) {
      setDriftInsight(null);
      return;
    }

    let isMounted = true;
    (async () => {
      try {
        const history = await signalHistoryStore.getHistory(asset.id, { limit: 20 });
        const insight = analyzeSignalDrift(history);
        if (isMounted) {
          setDriftInsight(insight);
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          logger.warn('[AssetDetailModal] Failed to load drift insight:', error);
        }
        if (isMounted) {
          setDriftInsight(null);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [asset?.id, isOpen]);

  if (!isOpen || !asset) return null;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Server': return <Server className="h-5 w-5" />;
      case 'Network': return <Network className="h-5 w-5" />;
      default: return <Shield className="h-5 w-5" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-command-blue-600 to-action-cyan-500 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                {getTypeIcon(asset.type)}
              </div>
              <div>
                <h2 className="text-xl font-outfit font-bold">{asset.name}</h2>
                <p className="text-sm opacity-90">{asset.type} • {asset.location}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Basic Information */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-outfit font-semibold text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Owner</p>
                      <p className="font-medium text-gray-900">{asset.owner}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium text-gray-900">{asset.location}</p>
                    </div>
                  </div>
                  {asset.ipAddress && (
                    <div className="flex items-center space-x-3">
                      <HardDrive className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">IP Address</p>
                        <p className="font-medium text-gray-900">{asset.ipAddress}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Last Assessed</p>
                      <p className="font-medium text-gray-900">{format(asset.lastAssessed, 'MMM dd, yyyy')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-outfit font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700">{asset.description}</p>
              </div>

              {/* Visibility Over Time */}
              <div className="bg-gray-50 rounded-lg p-4 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Visibility Over Time</h3>
                {!driftInsight || driftInsight.status === 'no-history' ? (
                  <p className="text-xs text-gray-500">
                    No historical visibility yet for this asset.
                  </p>
                ) : (
                  <>
                    <p className="text-xs font-medium text-gray-700 mb-2">
                      {driftInsight.status === 'stable-visibility' && 'Visibility has been broadly stable across observations.'}
                      {driftInsight.status === 'emerging-change' && 'Recent changes in how this asset appears in your landscape.'}
                      {driftInsight.status === 'increasing-uncertainty' && 'Signals indicate growing uncertainty around this asset.'}
                      {driftInsight.status === 'high-variance' && 'Signals about this asset have varied significantly over time.'}
                    </p>
                    <ul className="mt-1 space-y-1">
                      {driftInsight.supportingSignals.map((msg, idx) => (
                        <li key={idx} className="text-xs text-gray-600">• {msg}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

              {/* Tags */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-outfit font-semibold text-gray-900 mb-4 flex items-center">
                  <Tag className="h-5 w-5 mr-2" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(asset.tags || []).length > 0 ? (
                    (asset.tags || []).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-command-blue-100 text-command-blue-800"
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No tags assigned</p>
                  )}
                </div>
              </div>

              {/* Compliance Frameworks */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-outfit font-semibold text-gray-900 mb-4 flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Compliance Frameworks
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(asset.complianceFrameworks || []).length > 0 ? (
                    (asset.complianceFrameworks || []).map((framework) => (
                      <span
                        key={framework}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                      >
                        {framework}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No compliance frameworks assigned</p>
                  )}
                </div>
              </div>

              {/* Relationships */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-outfit font-semibold text-gray-900 mb-4">Asset Relationships</h3>
                {(asset.relationships || []).length > 0 ? (
                  <div className="space-y-3">
                    {(asset.relationships || []).map((relationship) => (
                      <div key={relationship.id} className="p-3 bg-white rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-gray-900">{relationship.relatedAssetName}</p>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                            relationship.strength === 'Strong' ? 'bg-red-50 text-red-800 border-red-200' :
                            relationship.strength === 'Medium' ? 'bg-yellow-50 text-yellow-800 border-yellow-200' :
                            'bg-green-50 text-green-800 border-green-200'
                          }`}>
                            {relationship.strength}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{relationship.relationshipType}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No relationships defined</p>
                )}
              </div>
            </div>

            {/* Risk & Status Sidebar */}
            <div className="space-y-6">
              {/* Status Card */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-outfit font-semibold text-gray-900 mb-4">Status & Risk</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Criticality</p>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getCriticalityColor(asset.criticality)}`}>
                      {asset.criticality}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Status</p>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(asset.status)}`}>
                      {asset.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Risk Score</p>
                    <div className={`inline-flex items-center px-3 py-2 rounded-lg font-semibold ${getRiskScoreColor(asset.riskScore)}`}>
                      {asset.riskScore}/100
                    </div>
                  </div>
                </div>
              </div>

              {/* Vulnerabilities */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-outfit font-semibold text-gray-900 mb-4 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
                  Vulnerabilities
                </h3>
                {(asset.vulnerabilities || []).length > 0 ? (
                  <div className="space-y-3">
                    {(asset.vulnerabilities || []).map((vuln) => (
                      <div key={vuln.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{vuln.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCriticalityColor(vuln.severity)}`}>
                            {vuln.severity}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{vuln.description}</p>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Discovered: {format(vuln.discoveredAt, 'MMM dd, yyyy')}</span>
                          <span className={`px-2 py-1 rounded-full border ${
                            vuln.status === 'Open' ? 'bg-red-50 text-red-800 border-red-200' :
                            vuln.status === 'In Progress' ? 'bg-yellow-50 text-yellow-800 border-yellow-200' :
                            vuln.status === 'Resolved' ? 'bg-green-50 text-green-800 border-green-200' :
                            'bg-gray-50 text-gray-800 border-gray-200'
                          }`}>
                            {vuln.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No vulnerabilities found</p>
                )}
              </div>

              {/* Enriched Data from Other Services */}
              <EnrichedDataDisplay asset={asset} />

              {/* Activity Log */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-outfit font-semibold text-gray-900 mb-4">Activity Log</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Asset updated</p>
                      <p className="text-xs text-gray-500">{format(asset.updatedAt, 'MMM dd, yyyy HH:mm')}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Asset created</p>
                      <p className="text-xs text-gray-500">{format(asset.createdAt, 'MMM dd, yyyy HH:mm')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-command-blue-500 focus:border-command-blue-500 transition-colors"
          >
            Close
          </button>
          {onEdit && (
            <button
              onClick={onEdit}
              className="px-4 py-2 bg-command-blue-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-command-blue-700 focus:outline-none focus:ring-2 focus:ring-command-blue-500 focus:ring-offset-2 transition-colors"
            >
              Edit Asset
            </button>
          )}
        </div>
      </div>
    </div>
  );
};