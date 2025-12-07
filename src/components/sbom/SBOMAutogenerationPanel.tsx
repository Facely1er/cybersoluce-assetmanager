/**
 * SBOM Autogeneration Panel
 * 
 * UI component for triggering and displaying SBOM autogeneration results.
 * Integrates with baseline directory and requests uploads when needed.
 */

import React, { useState, useEffect } from 'react';
import { Code, Upload, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Asset } from '../../types/asset';
import { SBOMAutogenerationService, SBOMAutogenerationResult } from '../../services/sbom/sbomAutogenerationService';
import BaselineSBOMService, { BaselineSBOM } from '../../services/sbom/baselineSBOMService';
import { logger } from '../../utils/logger';

interface SBOMAutogenerationPanelProps {
  assets: Asset[];
  onSBOMGenerated?: (result: SBOMAutogenerationResult) => void;
  onUploadRequested?: (assetId: string) => void;
}

export const SBOMAutogenerationPanel: React.FC<SBOMAutogenerationPanelProps> = ({
  assets,
  onSBOMGenerated,
  onUploadRequested,
}) => {
  const [baselines, setBaselines] = useState<BaselineSBOM[]>([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SBOMAutogenerationResult[]>([]);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadBaselines();
  }, []);

  const loadBaselines = async () => {
    try {
      const allBaselines = await BaselineSBOMService.getAllBaselines();
      setBaselines(allBaselines);
    } catch (error) {
      logger.error('Failed to load baselines', error instanceof Error ? error : new Error(String(error)));
    }
  };

  const handleAutogenerate = async () => {
    setProcessing(true);
    setLoading(true);
    
    try {
      const results = await SBOMAutogenerationService.processSoftwareAssets(assets, baselines);
      setResults(results);
      
      // Trigger callbacks
      results.forEach(result => {
        if (result.status === 'auto-generated' && onSBOMGenerated) {
          onSBOMGenerated(result);
        } else if (result.status === 'upload-required' && onUploadRequested) {
          onUploadRequested(result.assetId);
        }
      });
    } catch (error) {
      logger.error('Autogeneration failed', error instanceof Error ? error : new Error(String(error)));
    } finally {
      setLoading(false);
      setProcessing(false);
    }
  };

  const softwareAssets = SBOMAutogenerationService.detectSoftwareAssets(assets);
  const canAutogenerate = softwareAssets.length > 0 && baselines.length > 0;

  if (softwareAssets.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          <Code className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No software assets detected</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Code className="h-5 w-5" />
          <span>SBOM Autogeneration</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              {softwareAssets.length} software asset(s) detected
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {baselines.length} baseline SBOM(s) available
            </p>
          </div>
          <Button
            onClick={handleAutogenerate}
            disabled={!canAutogenerate || processing}
            size="sm"
          >
            {processing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Code className="h-4 w-4 mr-2" />
                Auto-generate SBOMs
              </>
            )}
          </Button>
        </div>

        {results.length > 0 && (
          <div className="space-y-2 border-t pt-4">
            <h4 className="text-sm font-medium">Results:</h4>
            {results.map((result, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 bg-muted rounded text-sm"
              >
                <div className="flex items-center space-x-2">
                  {result.status === 'auto-generated' && (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  )}
                  {result.status === 'upload-required' && (
                    <Upload className="h-4 w-4 text-amber-600" />
                  )}
                  {result.status === 'already-exists' && (
                    <CheckCircle2 className="h-4 w-4 text-blue-600" />
                  )}
                  {result.status === 'error' && (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span className="font-medium">{result.assetName}</span>
                </div>
                <Badge
                  variant={
                    result.status === 'auto-generated'
                      ? 'default'
                      : result.status === 'upload-required'
                      ? 'secondary'
                      : result.status === 'error'
                      ? 'destructive'
                      : 'outline'
                  }
                >
                  {result.status === 'auto-generated' && 'Generated'}
                  {result.status === 'upload-required' && 'Upload Required'}
                  {result.status === 'already-exists' && 'Exists'}
                  {result.status === 'error' && 'Error'}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

