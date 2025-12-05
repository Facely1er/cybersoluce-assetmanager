/**
 * Stakeholder Report Generator Component
 * 
 * UI component for generating multistakeholder reports that aggregate
 * data from all ERMITS services.
 */

import React, { useState } from 'react';
import { FileText, Download, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select } from '../ui/select';
import { Asset } from '../../types/asset';
import { FocusSignal } from '../../types/enrichment';
import {
  MultistakeholderReportService,
  StakeholderType,
  StakeholderReport,
} from '../../services/reports/multistakeholderReportService';

interface StakeholderReportGeneratorProps {
  assets: Asset[];
  signals: FocusSignal[];
  enrichedData?: {
    cyberCorrect?: any[];
    vendorSoluce?: any[];
    technoSoluce?: any[];
  };
}

export const StakeholderReportGenerator: React.FC<StakeholderReportGeneratorProps> = ({
  assets,
  signals,
  enrichedData,
}) => {
  const [selectedType, setSelectedType] = useState<StakeholderType>('executive');
  const [generating, setGenerating] = useState(false);
  const [report, setReport] = useState<StakeholderReport | null>(null);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const generatedReport = await MultistakeholderReportService.generateReport(
        assets,
        signals,
        selectedType,
        enrichedData
      );
      setReport(generatedReport);
    } catch (error) {
      console.error('Report generation failed:', error);
    } finally {
      setGenerating(false);
    }
  };

  const handleExport = (format: 'json' | 'csv' | 'pdf') => {
    if (!report) return;

    const exported = MultistakeholderReportService.exportReport(report, format);
    
    if (format === 'json') {
      const blob = new Blob([exported as string], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${report.title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'csv') {
      const blob = new Blob([exported as string], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${report.title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>Multistakeholder Report Generator</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Report Type</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as StakeholderType)}
            className="w-full p-2 border rounded-md"
          >
            <option value="executive">Executive/Board Report</option>
            <option value="technical">Technical Team Report</option>
            <option value="compliance">Compliance Team Report</option>
            <option value="vendor-management">Vendor Management Report</option>
            <option value="comprehensive">Comprehensive Report</option>
          </select>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={generating || assets.length === 0}
          className="w-full"
        >
          {generating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating Report...
            </>
          ) : (
            <>
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </>
          )}
        </Button>

        {report && (
          <div className="space-y-3 border-t pt-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Report Generated</h4>
              <p className="text-xs text-muted-foreground">
                {report.summary.totalAssets} assets • {report.summary.highRiskAssets} high-risk • 
                Risk Score: {report.summary.overallRiskScore}/100
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('json')}
              >
                <Download className="h-4 w-4 mr-2" />
                Export JSON
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('csv')}
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>

            {report.recommendations.length > 0 && (
              <div className="mt-3 pt-3 border-t">
                <h5 className="text-xs font-medium mb-2">Key Recommendations</h5>
                <ul className="text-xs space-y-1">
                  {report.recommendations.slice(0, 3).map((rec, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

