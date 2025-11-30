import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, Code2, Palette, Settings, Upload, BarChart3 } from 'lucide-react';
import { ONE_TIME_PRODUCTS, getOneTimeCheckoutConfig } from '../config/stripe';
import { stripeClient } from '../lib/stripe';

const ExecutiveDashboardTemplate: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    try {
      setLoading(true);
      const config = getOneTimeCheckoutConfig('executiveDashboardTemplate');
      const { url } = await stripeClient.createCheckoutSession({
        priceId: ONE_TIME_PRODUCTS.executiveDashboardTemplate.priceId,
        successUrl: config.successUrl,
        cancelUrl: config.cancelUrl,
        metadata: config.metadata,
      });
      window.location.href = url;
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout. Please try again or contact support.');
      setLoading(false);
    }
  };

  const features = [
    {
      icon: Code2,
      title: "HTML/CSS/JS Template",
      description: "Clean, modern code ready to customize with your data"
    },
    {
      icon: Palette,
      title: "White-Label Ready",
      description: "Rebrand with your logo, colors, and company name"
    },
    {
      icon: Upload,
      title: "CSV Data Import",
      description: "Easily load your own security metrics and KPIs"
    },
    {
      icon: BarChart3,
      title: "Professional Charts",
      description: "Interactive visualizations with Chart.js and custom displays"
    },
    {
      icon: Settings,
      title: "Fully Responsive",
      description: "Works perfectly on desktop, tablet, and mobile devices"
    },
    {
      icon: Palette,
      title: "Dark/Light Modes",
      description: "Built-in theme toggle for user preferences"
    }
  ];

  const sections = [
    "Executive Summary Dashboard",
    "Real-time Risk Radar (6D STEEL)",
    "Strategic Actions & Recommendations",
    "Threat Intelligence Feed",
    "Compliance Scorecard",
    "Custom Metrics Builder"
  ];

  const useCases = [
    {
      title: "Consultants",
      description: "White-label and customize for each client engagement"
    },
    {
      title: "Organizations",
      description: "Deploy internally to showcase your security posture"
    },
    {
      title: "Resellers",
      description: "Rebrand and sell as your own product"
    },
    {
      title: "MSPs",
      description: "Offer as value-add to managed security services"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-8 mb-12 text-center"
        >
          <div className="inline-block px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-6">
            <span className="text-purple-700 dark:text-purple-300 font-semibold">White-Label Template</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
            Executive Security Dashboard
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Professional HTML/CSS template for security executives to visualize risk, metrics, and strategic actions
          </p>
        </motion.div>

        {/* Pricing Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16 max-w-2xl mx-auto"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border-2 border-purple-200 dark:border-purple-800 p-8">
            <div className="text-center mb-8">
              <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
                $79
              </div>
              <p className="text-gray-600 dark:text-gray-300">One-time purchase • Lifetime license • Free updates</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handlePurchase}
                disabled={loading}
                className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <Settings size={18} />
                    Buy Now - $79
                  </>
                )}
              </button>
            </div>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
              Secure payment options • Instant download
            </p>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">What's Included</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                  <div className="flex flex-col h-full">
                    <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 w-fit mb-4">
                      <Icon size={24} className="text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 flex-grow">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Dashboard Sections</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sections.map((section, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-300">{section}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Customization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Easy Customization</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Branding</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <CheckCircle size={16} className="text-green-500" />
                  Upload your logo
                </li>
                <li className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <CheckCircle size={16} className="text-green-500" />
                  Change color scheme
                </li>
                <li className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <CheckCircle size={16} className="text-green-500" />
                  Add company name
                </li>
                <li className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <CheckCircle size={16} className="text-green-500" />
                  Customize menu items
                </li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Data</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <CheckCircle size={16} className="text-green-500" />
                  Import CSV metrics
                </li>
                <li className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <CheckCircle size={16} className="text-green-500" />
                  Add your threat data
                </li>
                <li className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <CheckCircle size={16} className="text-green-500" />
                  Update KPIs
                </li>
                <li className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <CheckCircle size={16} className="text-green-500" />
                  Modify visualizations
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Use Cases */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Perfect For</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {useCases.map((usecase, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">{usecase.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{usecase.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Package Contents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">In The Box</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold mb-4 text-gray-900 dark:text-white">Files Included</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <CheckCircle size={16} className="text-green-500" />
                    index.html
                  </li>
                  <li className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <CheckCircle size={16} className="text-green-500" />
                    styles.css (fully customizable)
                  </li>
                  <li className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <CheckCircle size={16} className="text-green-500" />
                    script.js (Chart.js integration)
                  </li>
                  <li className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <CheckCircle size={16} className="text-green-500" />
                    sample-data.csv
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4 text-gray-900 dark:text-white">Documentation</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <CheckCircle size={16} className="text-green-500" />
                    Setup guide
                  </li>
                  <li className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <CheckCircle size={16} className="text-green-500" />
                    Customization guide
                  </li>
                  <li className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <CheckCircle size={16} className="text-green-500" />
                    FAQ & Troubleshooting
                  </li>
                  <li className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <CheckCircle size={16} className="text-green-500" />
                    Free updates
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-center mb-12"
        >
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg text-center p-8 text-white">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Impress Your Board?</h3>
            <p className="text-purple-100 mb-6">Get the dashboard template and customize in minutes</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handlePurchase}
                disabled={loading}
                className="px-8 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    Buy Now - $79
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
            <p className="text-purple-200 text-xs mt-4">
              Secure checkout • Instant download • Lifetime license
            </p>
          </div>
        </motion.div>

        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <button
            onClick={() => navigate('/')}
            className="text-purple-600 dark:text-purple-400 hover:underline inline-flex items-center gap-2"
          >
            ← Back to Home
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default ExecutiveDashboardTemplate;

