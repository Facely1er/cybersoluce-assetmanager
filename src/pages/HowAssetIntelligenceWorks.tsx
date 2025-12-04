/**
 * How Asset Intelligence Works Page
 * 
 * Explains what CyberSoluce does and does not do,
 * and how it fits into the ERMITS ecosystem.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  Shield, 
  Lock, 
  Building2, 
  Code, 
  FileText,
  Info
} from 'lucide-react';
import { PageShell } from '../layouts/PageShell';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';

export const HowAssetIntelligenceWorks: React.FC = () => {
  return (
    <PageShell
      title="How CyberSoluce Asset Intelligence Works"
      subtitle="Understanding the foundation layer of the ERMITS ecosystem"
    >

        {/* Section 1: What CyberSoluce Does */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 mr-3" />
              What CyberSoluce Does
            </CardTitle>
          </CardHeader>
          <CardContent>
          <ul className="space-y-4">
            <li className="flex items-start">
              <div className="flex-shrink-0 w-2 h-2 bg-command-blue-600 rounded-full mt-2 mr-4" />
              <p className="text-gray-700 dark:text-gray-300">
                Creates a dependency-aware view of systems, vendors, and data
              </p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 w-2 h-2 bg-command-blue-600 rounded-full mt-2 mr-4" />
              <p className="text-gray-700 dark:text-gray-300">
                Normalizes asset information from imports and manual input
              </p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 w-2 h-2 bg-command-blue-600 rounded-full mt-2 mr-4" />
              <p className="text-gray-700 dark:text-gray-300">
                Highlights where exposure and dependencies may concentrate
              </p>
            </li>
          </ul>
          </CardContent>
        </Card>

        {/* Section 2: What It Does Not Do */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <XCircle className="h-6 w-6 text-red-600 dark:text-red-400 mr-3" />
              What It Does Not Do
            </CardTitle>
          </CardHeader>
          <CardContent>
          <ul className="space-y-4">
            <li className="flex items-start">
              <div className="flex-shrink-0 w-2 h-2 bg-red-600 rounded-full mt-2 mr-4" />
              <p className="text-gray-700 dark:text-gray-300">
                Does not provide compliance or certification status
              </p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 w-2 h-2 bg-red-600 rounded-full mt-2 mr-4" />
              <p className="text-gray-700 dark:text-gray-300">
                Does not rate overall enterprise posture
              </p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 w-2 h-2 bg-red-600 rounded-full mt-2 mr-4" />
              <p className="text-gray-700 dark:text-gray-300">
                Does not replace expert, human-led analysis
              </p>
            </li>
          </ul>
          </CardContent>
        </Card>

        {/* Section 3: How Focus Areas Are Used */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>How Focus Areas Are Used</CardTitle>
          </CardHeader>
          <CardContent>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              When patterns emerge (e.g., sensitive data with unclear lineage, vendor concentration, software clustering), CyberSoluce surfaces them as focus areas.
            </p>
            <p>
              Specialized ERMITS products provide deeper evaluation of those areas.
            </p>
          </div>

          {/* ERMITS Products Grid */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                <h3 className="font-semibold text-gray-900 dark:text-white">CyberCorrect</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Privacy exposure evaluation and compliance support
              </p>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Lock className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
                <h3 className="font-semibold text-gray-900 dark:text-white">CyberCaution</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Ransomware readiness assessment and protection strategies
              </p>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Building2 className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
                <h3 className="font-semibold text-gray-900 dark:text-white">VendorSoluce</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Vendor dependency analysis and risk management
              </p>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Code className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                <h3 className="font-semibold text-gray-900 dark:text-white">TechnoSoluce</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Software dependency and component risk analysis
              </p>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 md:col-span-2">
              <div className="flex items-center mb-2">
                <FileText className="h-5 w-5 text-orange-600 dark:text-orange-400 mr-2" />
                <h3 className="font-semibold text-gray-900 dark:text-white">ERMITS Advisory</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Governance and compliance advisory services
              </p>
            </div>
          </div>
          </CardContent>
        </Card>

        {/* Section 4: Where It Fits in ERMITS */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Where It Fits in ERMITS</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground leading-relaxed">
              CyberSoluce sits at the foundation of the ERMITS ecosystem as the asset intelligence layer. It helps CyberCorrect, CyberCaution, VendorSoluce, TechnoSoluce, and ERMITS Advisory start from a cleaner map of what matters.
            </p>
          </CardContent>
        </Card>

        {/* Back to Dashboard Link */}
        <div className="flex justify-center mt-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center px-6 py-3 bg-command-blue-600 text-white rounded-lg font-semibold hover:bg-command-blue-700 transition-colors"
          >
            Return to Dashboard
            <ArrowRight className="h-5 w-5 ml-2" />
          </Link>
        </div>
    </PageShell>
  );
};

