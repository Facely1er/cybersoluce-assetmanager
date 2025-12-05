/**
 * Enriched Data Display Component
 * 
 * Displays enriched data from other ERMITS services (CyberCorrect, VendorSoluce, TechnoSoluce)
 * in the asset detail view.
 */

import React from 'react';
import { Asset } from '../../types/asset';
import { Shield, Building2, Code, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

interface EnrichedDataDisplayProps {
  asset: Asset;
}

export const EnrichedDataDisplay: React.FC<EnrichedDataDisplayProps> = ({ asset }) => {
  const hasEnrichedData = 
    asset.cyberCorrectData || 
    asset.vendorSoluceData || 
    asset.technoSoluceData;

  if (!hasEnrichedData) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-outfit font-semibold text-gray-900 dark:text-white">
        Enriched Data from ERMITS Services
      </h3>

      {/* CyberCorrect Data */}
      {asset.cyberCorrectData && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-base">Privacy Data (CyberCorrect)</CardTitle>
              </div>
              {asset.cyberCorrectData.lastEnrichedAt && (
                <Badge variant="outline" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  {new Date(asset.cyberCorrectData.lastEnrichedAt).toLocaleDateString()}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {asset.cyberCorrectData.privacyAssessment && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Privacy Risk:</span>
                  <Badge
                    variant={
                      asset.cyberCorrectData.privacyAssessment.privacyRisk === 'very-high' ||
                      asset.cyberCorrectData.privacyAssessment.privacyRisk === 'high'
                        ? 'destructive'
                        : asset.cyberCorrectData.privacyAssessment.privacyRisk === 'medium'
                        ? 'default'
                        : 'secondary'
                    }
                  >
                    {asset.cyberCorrectData.privacyAssessment.privacyRisk}
                  </Badge>
                </div>
                {asset.cyberCorrectData.privacyAssessment.dataTypes && (
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Data Types: </span>
                    <span className="text-sm font-medium">
                      {asset.cyberCorrectData.privacyAssessment.dataTypes.join(', ')}
                    </span>
                  </div>
                )}
                <div className="flex items-center space-x-4 text-xs">
                  {asset.cyberCorrectData.privacyAssessment.gdprCompliant && (
                    <span className="flex items-center text-green-600">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      GDPR Compliant
                    </span>
                  )}
                  {asset.cyberCorrectData.privacyAssessment.ccpaCompliant && (
                    <span className="flex items-center text-green-600">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      CCPA Compliant
                    </span>
                  )}
                </div>
              </div>
            )}
            {asset.cyberCorrectData.dpias && asset.cyberCorrectData.dpias.length > 0 && (
              <div className="mt-3 pt-3 border-t">
                <span className="text-sm font-medium">DPIAs: </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {asset.cyberCorrectData.dpias.length} assessment(s)
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* VendorSoluce Data */}
      {asset.vendorSoluceData && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-purple-600" />
                <CardTitle className="text-base">Vendor Risk Data (VendorSoluce)</CardTitle>
              </div>
              {asset.vendorSoluceData.lastEnrichedAt && (
                <Badge variant="outline" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  {new Date(asset.vendorSoluceData.lastEnrichedAt).toLocaleDateString()}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {asset.vendorSoluceData.vendorAssessment && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Risk Rating:</span>
                  <Badge
                    variant={
                      asset.vendorSoluceData.vendorAssessment.overallRiskRating === 'critical' ||
                      asset.vendorSoluceData.vendorAssessment.overallRiskRating === 'high'
                        ? 'destructive'
                        : asset.vendorSoluceData.vendorAssessment.overallRiskRating === 'medium'
                        ? 'default'
                        : 'secondary'
                    }
                  >
                    {asset.vendorSoluceData.vendorAssessment.overallRiskRating}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Security Posture: </span>
                    <span className="font-medium">
                      {asset.vendorSoluceData.vendorAssessment.securityPosture}/100
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Compliance: </span>
                    <span className="font-medium">
                      {asset.vendorSoluceData.vendorAssessment.complianceAdherence}/100
                    </span>
                  </div>
                </div>
              </div>
            )}
            {asset.vendorSoluceData.vendorDetails && (
              <div className="mt-3 pt-3 border-t space-y-1 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Vendor: </span>
                  <span className="font-medium">{asset.vendorSoluceData.vendorDetails.vendorName}</span>
                </div>
                {asset.vendorSoluceData.vendorDetails.certifications && 
                 asset.vendorSoluceData.vendorDetails.certifications.length > 0 && (
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Certifications: </span>
                    <span className="font-medium">
                      {asset.vendorSoluceData.vendorDetails.certifications.join(', ')}
                    </span>
                  </div>
                )}
              </div>
            )}
            {asset.vendorSoluceData.riskGaps && asset.vendorSoluceData.riskGaps.length > 0 && (
              <div className="mt-3 pt-3 border-t">
                <div className="flex items-center space-x-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <span className="font-medium">
                    {asset.vendorSoluceData.riskGaps.length} risk gap(s) identified
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* TechnoSoluce Data */}
      {asset.technoSoluceData && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Code className="h-5 w-5 text-green-600" />
                <CardTitle className="text-base">SBOM Data (TechnoSoluce)</CardTitle>
              </div>
              {asset.technoSoluceData.lastEnrichedAt && (
                <Badge variant="outline" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  {new Date(asset.technoSoluceData.lastEnrichedAt).toLocaleDateString()}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {asset.technoSoluceData.sbomAvailable && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="font-medium">SBOM Available</span>
                </div>
                {asset.technoSoluceData.sbomAnalysis && (
                  <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Components: </span>
                      <span className="font-medium">
                        {asset.technoSoluceData.sbomAnalysis.componentCount || 0}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Vulnerabilities: </span>
                      <span className="font-medium">
                        {asset.technoSoluceData.sbomAnalysis.vulnerabilityCount || 0}
                      </span>
                    </div>
                  </div>
                )}
                {asset.technoSoluceData.sbomAnalysis?.criticalVulnerabilities > 0 && (
                  <div className="mt-2 flex items-center space-x-2 text-xs">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="text-red-600 font-medium">
                      {asset.technoSoluceData.sbomAnalysis.criticalVulnerabilities} critical vulnerability(ies)
                    </span>
                  </div>
                )}
                {asset.technoSoluceData.complianceStatus && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex items-center space-x-4 text-xs">
                      {asset.technoSoluceData.complianceStatus.ntiaCompliant && (
                        <span className="flex items-center text-green-600">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          NTIA Compliant
                        </span>
                      )}
                      {asset.technoSoluceData.complianceStatus.nistCompliant && (
                        <span className="flex items-center text-green-600">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          NIST Compliant
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

