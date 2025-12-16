import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Database, FileText, Building2, CheckCircle, Lock, Zap, FileDown, Award, ExternalLink, Gift } from 'lucide-react';
import DomainBackground from '../components/common/DomainBackground';

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2 
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.5 } 
    }
  };

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 } 
    }
  };

  const staggerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      }
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-command-blue-600 py-24">
        <DomainBackground color="0, 91, 150" secondaryColor="51, 161, 222" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center text-white"
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center justify-center mb-4"
            >
              <Gift className="h-8 w-8 text-white mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold">Free Cybersecurity Assessment Tools</h1>
            </motion.div>
            <motion.p 
              variants={itemVariants}
              className="text-lg md:text-xl text-command-blue-100 mb-8 max-w-3xl mx-auto"
            >
              Start your cybersecurity journey with our professional, browser-based tools. No installation, no account required. Privacy-first design.
            </motion.p>
            <motion.div 
              variants={itemVariants}
              className="flex items-center justify-center gap-4 text-sm text-command-blue-100 flex-wrap"
            >
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
              <div className="flex items-center gap-2">
                <FileDown className="w-5 h-5" />
                Export Ready
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Tools Grid Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={staggerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
          >
            {/* Data Inventory Tool */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 hover:border-command-blue-300 dark:hover:border-command-blue-700 transition-all"
            >
              <div className="bg-gradient-to-br from-command-blue-50 to-action-cyan-50 dark:from-command-blue-900/30 dark:to-action-cyan-900/30 p-4 rounded-2xl w-16 h-16 flex items-center justify-center mb-6">
                <FileText className="h-8 w-8 text-command-blue-600 dark:text-command-blue-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Data Inventory Tool</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                Discover, catalog, and track all organizational data. Perfect for GDPR Article 30 preparation and compliance documentation.
              </p>
              <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1 mb-6">
                <li>• 13 core data fields</li>
                <li>• PII & Sensitive tracking</li>
                <li>• Documentation completeness scoring</li>
                <li>• CSV/JSON export</li>
                <li>• 20 sample items</li>
              </ul>
              <a 
                href="/tools/DataInventoryTool.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center w-full justify-center px-4 py-3 bg-command-blue-600 hover:bg-command-blue-700 text-white rounded-lg font-semibold transition-colors"
              >
                Open Tool
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </motion.div>

            {/* Information Asset Register */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 hover:border-command-blue-300 dark:hover:border-command-blue-700 transition-all"
            >
              <div className="bg-gradient-to-br from-command-blue-50 to-action-cyan-50 dark:from-command-blue-900/30 dark:to-action-cyan-900/30 p-4 rounded-2xl w-16 h-16 flex items-center justify-center mb-6">
                <Database className="h-8 w-8 text-command-blue-600 dark:text-command-blue-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Information Asset Register</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                Comprehensive asset management with automated gap analysis and compliance tracking. Ideal for ISO 27001, SOC 2, and NIST.
              </p>
              <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1 mb-6">
                <li>• 20+ asset fields</li>
                <li>• 8-point control framework</li>
                <li>• Automated gap analysis</li>
                <li>• Multi-framework compliance</li>
                <li>• 20 sample assets</li>
              </ul>
              <a 
                href="/tools/InformationAssetRegister.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center w-full justify-center px-4 py-3 bg-command-blue-600 hover:bg-command-blue-700 text-white rounded-lg font-semibold transition-colors"
              >
                Open Tool
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </motion.div>

            {/* Vendor Register Manager */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 hover:border-action-cyan-300 dark:hover:border-action-cyan-700 transition-all"
            >
              <div className="bg-gradient-to-br from-action-cyan-50 to-command-blue-50 dark:from-action-cyan-900/30 dark:to-command-blue-900/30 p-4 rounded-2xl w-16 h-16 flex items-center justify-center mb-6">
                <Building2 className="h-8 w-8 text-action-cyan-600 dark:text-action-cyan-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Vendor Register Manager</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                Third-party risk management with automated risk scoring and compliance tracking. Track contracts and vendor relationships.
              </p>
              <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1 mb-6">
                <li>• 15+ vendor fields</li>
                <li>• Automated risk scoring</li>
                <li>• 9-point compliance checklist</li>
                <li>• Contract lifecycle tracking</li>
                <li>• 20 sample vendors</li>
              </ul>
              <a 
                href="/tools/VendorRegisterManager.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center w-full justify-center px-4 py-3 bg-action-cyan-600 hover:bg-action-cyan-700 text-white rounded-lg font-semibold transition-colors"
              >
                Open Tool
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </motion.div>
          </motion.div>

          {/* Features Section */}
          <motion.div 
            variants={fadeInUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-12 border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Why Use These Tools?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div 
                variants={itemVariants}
                className="text-center"
              >
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Instant Access</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">No installation or setup required. Open in any browser and start immediately.</p>
              </motion.div>
              <motion.div 
                variants={itemVariants}
                className="text-center"
              >
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Privacy-First</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">All processing happens in your browser. No data sent to servers. GDPR-friendly.</p>
              </motion.div>
              <motion.div 
                variants={itemVariants}
                className="text-center"
              >
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileDown className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Export Ready</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Export to CSV or JSON. Import into CyberSoluce platform when ready to upgrade.</p>
              </motion.div>
              <motion.div 
                variants={itemVariants}
                className="text-center"
              >
                <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Professional Grade</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Built for compliance professionals. Aligned with GDPR, ISO 27001, SOC 2, NIST.</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Info Section */}
          <motion.div 
            variants={fadeInUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center text-gray-600 dark:text-gray-400 text-sm mb-12"
          >
            <p className="mb-2">
              <strong className="text-gray-900 dark:text-white">ERMITS CyberSoluce</strong> - Professional Cybersecurity Management Tools
            </p>
            <p>
              These tools are provided free of charge. For enterprise features, compliance automation, and team collaboration, upgrade to{' '}
              <Link to="/" className="text-command-blue-600 dark:text-command-blue-400 hover:underline">
                CyberSoluce Asset Intelligence
              </Link>
              .
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-command-blue-600 relative overflow-hidden">
        <DomainBackground color="0, 91, 150" secondaryColor="51, 161, 222" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="text-center"
            variants={fadeInUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-6 drop-shadow-sm">
              Ready for More?
            </h2>
            <p className="text-xl text-command-blue-100 mb-10 max-w-3xl mx-auto">
              Import your data into CyberSoluce Asset Intelligence for advanced features: real-time collaboration, automated compliance tracking, vulnerability management, and more.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <motion.div 
                whileHover={{ scale: 1.05, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -6px rgba(0, 0, 0, 0.1)' }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  to="/" 
                  className="inline-flex items-center px-8 py-4 bg-white text-command-blue-700 rounded-lg font-semibold hover:bg-command-blue-50 transition-all shadow-lg hover:shadow-xl"
                >
                  Explore CyberSoluce Platform
                </Link>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05, boxShadow: '0 20px 25px -5px rgba(255, 255, 255, 0.2), 0 10px 10px -6px rgba(255, 255, 255, 0.1)' }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/dashboard/assets"
                  className="inline-flex items-center px-8 py-4 bg-command-blue-500 text-white rounded-lg font-semibold hover:bg-command-blue-600 transition-all shadow-lg hover:shadow-xl border border-command-blue-400"
                >
                  Import Your Data
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ToolsPage;
