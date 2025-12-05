import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Database, FileText, Building2, CheckCircle, Lock, Zap, FileDown, Award, ArrowLeft } from 'lucide-react';

/**
 * ToolsPage component - Displays the free cybersecurity tools page
 */
const ToolsPage: React.FC = () => {
  useEffect(() => {
    // Sync theme with main app
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, []);


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#005B96] to-[#33A1DE] text-white pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center relative">
            {/* Back to Main Site Button */}
            <Link
              to="/"
              className="absolute top-0 left-0 flex items-center gap-2 text-white/90 hover:text-white transition-colors text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Main Site
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Free Cybersecurity Assessment Tools</h1>
            <p className="text-lg md:text-xl text-gray-100 mb-8 max-w-3xl mx-auto">
              Start your cybersecurity journey with our professional, browser-based tools. No installation, no account required. Privacy-first design.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-200 flex-wrap">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                No Installation
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Privacy-First
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Instant Access
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Data Inventory Tool */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700">
            <div className="w-12 h-12 bg-[#E6F2FF] dark:bg-[#1a3a5c] text-[#005B96] dark:text-[#33A1DE] rounded-xl flex items-center justify-center mb-6">
              <Database className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Data Inventory Tool</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Discover, catalog, and track all organizational data. Perfect for GDPR Article 30 preparation, data mapping, and compliance documentation.
            </p>
            <div className="mb-6">
              <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Key Features:</div>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• 13 core data fields</li>
                <li>• PII, Sensitive, Regulated tracking</li>
                <li>• Documentation completeness scoring</li>
                <li>• CSV/JSON import & export</li>
                <li>• 20 sample items included</li>
              </ul>
            </div>
            <a
              href="/tools/DataInventoryTool.html"
              className="block w-full bg-[#005B96] hover:bg-[#004A7A] dark:bg-[#0066B3] dark:hover:bg-[#005B96] text-white text-center font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Open Data Inventory Tool →
            </a>
          </div>

          {/* Information Asset Register */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700">
            <div className="w-12 h-12 bg-[#E6F2FF] dark:bg-[#1a3a5c] text-[#005B96] dark:text-[#33A1DE] rounded-xl flex items-center justify-center mb-6">
              <FileText className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Information Asset Register</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Comprehensive asset management with automated gap analysis, compliance tracking, and 4-level classification system. Ideal for ISO 27001, SOC 2, and NIST frameworks.
            </p>
            <div className="mb-6">
              <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Key Features:</div>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• 20+ asset fields</li>
                <li>• 8-point control framework</li>
                <li>• Automated gap analysis</li>
                <li>• Multi-framework compliance</li>
                <li>• 20 sample assets included</li>
              </ul>
            </div>
            <a
              href="/tools/InformationAssetRegister.html"
              className="block w-full bg-[#005B96] hover:bg-[#004A7A] dark:bg-[#0066B3] dark:hover:bg-[#005B96] text-white text-center font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Open Asset Register →
            </a>
          </div>

          {/* Vendor Register Manager */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700">
            <div className="w-12 h-12 bg-[#E6F5FA] dark:bg-[#1a3a5c] text-[#33A1DE] dark:text-[#5BB8E8] rounded-xl flex items-center justify-center mb-6">
              <Building2 className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Vendor Register Manager</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Third-party risk management with automated risk scoring, gap analysis, and compliance tracking. Track contracts, certifications, and vendor relationships.
            </p>
            <div className="mb-6">
              <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Key Features:</div>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• 15+ vendor fields</li>
                <li>• Automated risk scoring (0-100)</li>
                <li>• 9-point compliance checklist</li>
                <li>• Contract lifecycle tracking</li>
                <li>• 20 sample vendors included</li>
              </ul>
            </div>
            <a
              href="/tools/VendorRegisterManager.html"
              className="block w-full bg-[#33A1DE] hover:bg-[#2A8BC4] dark:bg-[#5BB8E8] dark:hover:bg-[#33A1DE] text-white text-center font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Open Vendor Register →
            </a>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-12 border border-gray-200 dark:border-gray-700">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Why Use These Tools?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Instant Access</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">No installation or setup required. Open in any browser and start immediately.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Privacy-First</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">All processing happens in your browser. No data sent to servers. GDPR-friendly.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileDown className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Export Ready</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Export to CSV or JSON. Import into CyberSoluce platform when ready to upgrade.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Professional Grade</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Built for compliance professionals. Aligned with GDPR, ISO 27001, SOC 2, NIST.</p>
            </div>
          </div>
        </div>

        {/* Upgrade CTA */}
        <div className="bg-gradient-to-r from-[#005B96] to-[#33A1DE] rounded-xl shadow-lg p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready for More?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Import your data into CyberSoluce Asset Intelligence for advanced features: real-time collaboration, automated compliance tracking, vulnerability management, and more.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="bg-white text-[#005B96] font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Explore CyberSoluce Platform
            </Link>
            <Link
              to="/dashboard/assets"
              className="bg-[#004A7A] text-white font-semibold py-3 px-8 rounded-lg hover:bg-[#003d66] transition-colors border-2 border-white"
            >
              Import Your Data
            </Link>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-gray-600 dark:text-gray-400 text-sm">
          <p className="mb-2">
            <strong>ERMITS CyberSoluce</strong> - Professional Cybersecurity Management Tools
          </p>
          <p>
            These tools are provided free of charge. For enterprise features, compliance automation, and team collaboration, upgrade to{' '}
            <Link to="/" className="text-[#005B96] dark:text-[#33A1DE] hover:underline">
              CyberSoluce Asset Intelligence
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default ToolsPage;
