/**
 * Service Placeholder Component
 * 
 * Displays a placeholder page for ERMITS services that are being routed to
 * from CyberSoluce. Shows routing context, asset details, and export payload information.
 */

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  ArrowLeft, 
  Package, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Database,
  Network,
  Shield,
  FileText,
  Info,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { ActiveFunnelRouter, RoutingContext, FunnelDestination } from '../funnel/activeFunnelRouter';

interface ServicePlaceholderProps {
  service: string;
}

export const ServicePlaceholder: React.FC<ServicePlaceholderProps> = ({ service }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [routingContext, setRoutingContext] = useState<RoutingContext | null>(null);
  const [assetCount, setAssetCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    setLoading(true);
    
    // Get routing context from sessionStorage
    const context = ActiveFunnelRouter.getRoutingContext(service as FunnelDestination);
    if (context) {
      setRoutingContext(context);
      const count = context.selectedAssets.length || context.exportPayload.assets?.length || 0;
      setAssetCount(count);
    } else {
      // Also check URL params as fallback
      const params = new URLSearchParams(location.search);
      const urlAssetCount = params.get('assetCount');
      if (urlAssetCount) {
        setAssetCount(parseInt(urlAssetCount, 10));
      }
    }
    
    setLoading(false);
  }, [service, location.search]);

  const serviceInfo: Record<string, { description: string; color: string; bgColor: string; icon: React.ComponentType<{ className?: string }> }> = {
    CyberCorrect: {
      description: 'Privacy exposure evaluation and compliance support',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      icon: Shield,
    },
    VendorSoluce: {
      description: 'Vendor dependency analysis and risk management',
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      icon: Package,
    },
    TechnoSoluce: {
      description: 'Software dependency and component risk analysis',
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      icon: Database,
    },
    CyberCaution: {
      description: 'Ransomware readiness assessment and protection strategies',
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      icon: AlertCircle,
    },
    ERMITSAdvisory: {
      description: 'Governance and compliance advisory services',
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      icon: FileText,
    },
  };

  const info = serviceInfo[service] || {
    description: 'ERMITS service integration',
    color: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-50 dark:bg-gray-900/20',
    icon: Package,
  };

  const Icon = info.icon;

  const handleDownloadPayload = () => {
    if (!routingContext) return;
    
    const payload = {
      service: service,
      routedAt: new Date().toISOString(),
      context: routingContext,
    };
    
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${service.toLowerCase()}-routing-payload-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportPayloadSize = routingContext 
    ? JSON.stringify(routingContext.exportPayload).length 
    : 0;
  const payloadSizeKB = (exportPayloadSize / 1024).toFixed(2);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-command-blue-600" />
            <p className="text-muted-foreground">Loading routing context...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg ${info.bgColor}`}>
                  <Icon className={`h-8 w-8 ${info.color}`} />
                </div>
                <div>
                  <CardTitle className="text-2xl">{service}</CardTitle>
                  <CardDescription className="mt-1">{info.description}</CardDescription>
                </div>
              </div>
              <Badge variant="outline" className="text-sm">
                Integration Pending
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Routing Context Summary */}
        {routingContext && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  Routing Context
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDetails(!showDetails)}
                >
                  {showDetails ? 'Hide' : 'Show'} Details
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Summary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                  <div className="text-xs text-muted-foreground mb-1">Assets</div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {assetCount || 0}
                  </div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                  <div className="text-xs text-muted-foreground mb-1">Signals</div>
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {routingContext.signals.length}
                  </div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                  <div className="text-xs text-muted-foreground mb-1">Dependencies</div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {routingContext.dependencies.length}
                  </div>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3">
                  <div className="text-xs text-muted-foreground mb-1">Payload Size</div>
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {payloadSizeKB} KB
                  </div>
                </div>
              </div>

              {/* Rationale */}
              {routingContext.rationale && (
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="text-sm font-medium mb-1">Routing Rationale</div>
                      <p className="text-sm text-muted-foreground">{routingContext.rationale}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Handoff Intent */}
              {routingContext.handoffIntent && (
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <ExternalLink className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="text-sm font-medium mb-1">Handoff Intent</div>
                      <Badge variant="secondary" className="text-xs">
                        {routingContext.handoffIntent}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}

              {/* Detailed Information */}
              {showDetails && (
                <div className="space-y-4 pt-4 border-t">
                  {/* Asset List */}
                  {(() => {
                    // Get assets from either selectedAssets or exportPayload
                    const selectedAssets = routingContext.selectedAssets || [];
                    const exportAssets = (routingContext.exportPayload.assets as Array<{ assetId?: string; id?: string; name?: string; type?: string; assetType?: string }>) || [];
                    const assets = selectedAssets.length > 0 ? selectedAssets : exportAssets;
                    const assetCount = assets.length;
                    
                    if (assetCount === 0) return null;
                    
                    return (
                      <div>
                        <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                          <Database className="h-4 w-4" />
                          Routed Assets ({assetCount})
                        </h4>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {assets.slice(0, 10).map((asset, idx: number) => {
                            // Handle both Asset type and export payload asset type
                            const assetId = 'id' in asset ? asset.id : ('assetId' in asset ? asset.assetId : undefined);
                            const assetName = 'name' in asset ? asset.name : undefined;
                            const assetType = 'type' in asset ? asset.type : ('assetType' in asset ? asset.assetType : undefined);
                            
                            return (
                              <div
                                key={assetId || idx}
                                className="bg-muted rounded p-2 text-sm flex items-center justify-between"
                              >
                                <span className="font-medium truncate">{assetName || assetId || `Asset ${idx + 1}`}</span>
                                <Badge variant="outline" className="ml-2 text-xs">
                                  {assetType || 'Unknown'}
                                </Badge>
                              </div>
                            );
                          })}
                          {assetCount > 10 && (
                            <div className="text-xs text-muted-foreground text-center pt-2">
                              + {assetCount - 10} more assets
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Signals */}
                  {routingContext.signals.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <Network className="h-4 w-4" />
                        Focus Signals ({routingContext.signals.length})
                      </h4>
                      <div className="space-y-2">
                        {routingContext.signals.slice(0, 5).map((signal, idx) => (
                          <div
                            key={idx}
                            className="bg-muted rounded p-2 text-sm"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium capitalize">{signal.signal_domain}</span>
                              <Badge variant="outline" className="text-xs">
                                {signal.signal_type}
                              </Badge>
                            </div>
                            {signal.description && (
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {signal.description}
                              </p>
                            )}
                          </div>
                        ))}
                        {routingContext.signals.length > 5 && (
                          <div className="text-xs text-muted-foreground text-center pt-2">
                            + {routingContext.signals.length - 5} more signals
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Export Payload Info */}
                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Export Payload
                    </h4>
                    <div className="bg-muted rounded p-3 text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Assets in payload:</span>
                        <span className="font-medium">
                          {routingContext.exportPayload.assets?.length || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Signals in payload:</span>
                        <span className="font-medium">
                          {routingContext.exportPayload.signals?.length || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Dependencies in payload:</span>
                        <span className="font-medium">
                          {routingContext.exportPayload.dependencies?.length || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Service Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              Service Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <p className="text-sm text-amber-800 dark:text-amber-200 mb-3">
                This service is currently being integrated with CyberSoluce. 
                Your assets have been prepared and are ready for analysis when the service becomes available.
              </p>
              {routingContext && (
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  Routing context is stored in your session and will be available when you return to this service.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => navigate('/dashboard')}
                className="flex-1"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Return to Dashboard
              </Button>
              {routingContext && (
                <Button
                  variant="outline"
                  onClick={handleDownloadPayload}
                  className="flex-1"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Payload
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className="flex-1"
              >
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

