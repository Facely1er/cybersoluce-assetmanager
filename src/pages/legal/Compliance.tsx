import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Scale } from 'lucide-react';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';

export const Compliance: React.FC = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-command-blue-600 dark:text-command-blue-400 hover:text-command-blue-700 dark:hover:text-command-blue-300 mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-command-blue-100 dark:bg-command-blue-900/30 p-3 rounded-lg">
                <Scale className="h-6 w-6 text-command-blue-600 dark:text-command-blue-400" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Compliance Information
              </h1>
            </div>

            <div className="text-sm text-gray-500 dark:text-gray-400 mb-8">
              Last updated: January 2025
            </div>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Regulatory Compliance
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  ERMITS LLC and CyberSoluce™ AssetManager are committed to maintaining compliance with 
                  applicable data protection and privacy regulations, including but not limited to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                  <li><strong>GDPR (General Data Protection Regulation):</strong> EU data protection and privacy regulation</li>
                  <li><strong>CCPA (California Consumer Privacy Act):</strong> California state privacy law</li>
                  <li><strong>SOC 2:</strong> Security, availability, and confidentiality controls</li>
                  <li><strong>ISO 27001:</strong> Information security management standards</li>
                  <li><strong>NIST Framework:</strong> Cybersecurity framework guidelines</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Data Processing
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  We process personal data in accordance with applicable data protection laws. We implement 
                  appropriate technical and organizational measures to ensure data security and compliance 
                  with regulatory requirements.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Data Subject Rights
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Under applicable data protection laws, you have the right to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                  <li>Access your personal data</li>
                  <li>Rectify inaccurate or incomplete data</li>
                  <li>Request deletion of your data</li>
                  <li>Object to processing of your data</li>
                  <li>Request restriction of processing</li>
                  <li>Data portability</li>
                  <li>Withdraw consent at any time</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Security Measures
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  We maintain industry-standard security measures to protect your data, including:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security assessments and audits</li>
                  <li>Access controls and authentication mechanisms</li>
                  <li>Incident response procedures</li>
                  <li>Employee training on data protection</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Compliance Certifications
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  We are continuously working to obtain and maintain relevant compliance certifications. 
                  For the most current information about our compliance status, please contact us.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Contact Us
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  For questions about our compliance practices or to exercise your data protection rights, 
                  please contact us at:
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-2">
                  <strong>ERMITS LLC</strong><br />
                  Email: compliance@ermits.com<br />
                  Website: <a href="/" className="text-command-blue-600 dark:text-command-blue-400 hover:underline">cybersoluce.com</a>
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

