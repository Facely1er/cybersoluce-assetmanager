import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Lock } from 'lucide-react';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';

export const PrivacyPolicy: React.FC = () => {
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
                <Lock className="h-6 w-6 text-command-blue-600 dark:text-command-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Master Privacy Policy
                </h1>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  <p><strong>Effective Date:</strong> October 31, 2025</p>
                  <p><strong>Last Updated:</strong> December 13, 2025</p>
                </div>
              </div>
            </div>

            <div className="prose prose-gray dark:prose-invert max-w-none text-slate-200 space-y-8">
              <div className="bg-slate-800/50 dark:bg-gray-800/50 border-l-4 border-command-blue-500 dark:border-command-blue-400 p-6 rounded-r-lg mb-8">
                <p className="text-base text-gray-700 dark:text-slate-200 leading-relaxed m-0">
                  ERMITS LLC ("ERMITS," "we," "our," or "us") is committed to protecting your privacy through a Privacy-First Architecture that ensures you maintain control over your data. This Privacy Policy explains how we collect, use, disclose, and safeguard information when you use our Services across all ERMITS product lines.
                </p>
                <p className="text-base text-gray-700 dark:text-slate-200 leading-relaxed mt-4 mb-0">
                  By using our Services, you consent to the data practices described in this policy. If you do not agree with this Privacy Policy, please do not use our Services.
                </p>
              </div>

              <div className="border-t border-gray-300 dark:border-gray-600 my-8"></div>

              <h2 id="section-1" className="text-2xl font-bold text-gray-900 dark:text-slate-50 mt-12 mb-6 pb-3 border-b border-gray-300 dark:border-slate-700">1. SCOPE AND APPLICABILITY</h2>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-50 mt-8 mb-4">1.1 Services Covered</h3>

              <p className="text-sm text-gray-700 dark:text-slate-200 leading-relaxed mb-4">This Privacy Policy applies to all ERMITS products and services, including:</p>

              <div className="bg-slate-800/30 dark:bg-gray-800/30 rounded-lg p-6 my-6 space-y-4">
                <div className="border-l-4 border-command-blue-500 dark:border-command-blue-400 pl-4">
                  <p className="font-bold text-gray-900 dark:text-slate-50 mb-2">CyberSoluce™:</p>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-slate-300">
                    <li>Enhanced Asset Inventory Management Platform</li>
                    <li>Dependency-aware visibility into asset inventory</li>
                    <li>Focus signals for attention areas</li>
                    <li>Service funneling guidance toward appropriate ERMITS services</li>
                  </ul>
                </div>

                <div className="border-l-4 border-indigo-500 dark:border-indigo-400 pl-4">
                  <p className="font-bold text-gray-900 dark:text-slate-50 mb-2">SocialCaution:</p>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-slate-300">
                    <li>Personalized privacy platform</li>
                    <li>AI-powered persona detection</li>
                    <li>Privacy exposure index and risk scoring</li>
                    <li>Service catalog with privacy risk profiles</li>
                  </ul>
                </div>

                <div className="border-l-4 border-yellow-500 dark:border-yellow-400 pl-4">
                  <p className="font-bold text-gray-900 dark:text-slate-50 mb-2">TechnoSoluce™:</p>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-slate-300">
                    <li>SBOM (Software Bill of Materials) Analyzer</li>
                    <li>Software supply chain security and vulnerability analysis</li>
                    <li>Client-side SBOM processing</li>
                  </ul>
                </div>

                <div className="border-l-4 border-orange-500 dark:border-orange-400 pl-4">
                  <p className="font-bold text-gray-900 dark:text-slate-50 mb-2">CyberCertitude™:</p>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-slate-300">
                    <li>CMMC 2.0 Level 1 Implementation Suite</li>
                    <li>CMMC 2.0 Level 2 Compliance Platform</li>
                    <li>NIST SP 800-171 assessment and compliance tools</li>
                    <li>Original Toolkit (localStorage-based compliance management)</li>
                  </ul>
                </div>

                <div className="border-l-4 border-green-500 dark:border-green-400 pl-4">
                  <p className="font-bold text-gray-900 dark:text-slate-50 mb-2">VendorSoluce™:</p>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-slate-300">
                    <li>Supply Chain Risk Management Platform</li>
                    <li>Vendor assessment and monitoring</li>
                    <li>Third-party risk evaluation</li>
                  </ul>
                </div>

                <div className="border-l-4 border-green-500 dark:border-green-400 pl-4">
                  <p className="font-bold text-gray-900 dark:text-slate-50 mb-2">CyberCorrect™:</p>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-slate-300">
                    <li>Privacy Portal (Workplace privacy compliance)</li>
                    <li>Privacy Platform (Multi-regulation privacy compliance automation)</li>
                  </ul>
                </div>

                <div className="border-l-4 border-indigo-500 dark:border-indigo-400 pl-4">
                  <p className="font-bold text-gray-900 dark:text-slate-50 mb-2">CyberCaution™:</p>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-slate-300">
                    <li>RansomCheck (ransomware readiness assessment)</li>
                    <li>Security Toolkit (comprehensive cybersecurity assessments)</li>
                    <li>RiskProfessional (CISA-aligned security assessments)</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-50 mt-8 mb-4">1.2 Geographic Scope</h3>

              <p className="text-sm text-gray-700 dark:text-slate-200 leading-relaxed mb-4">This Privacy Policy applies to users worldwide and complies with:</p>

              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-slate-300">
                <li>General Data Protection Regulation (GDPR) - European Union, United Kingdom, Switzerland</li>
                <li>California Consumer Privacy Act (CCPA) / California Privacy Rights Act (CPRA)</li>
                <li>Personal Information Protection and Electronic Documents Act (PIPEDA) - Canada</li>
                <li>Lei Geral de Proteção de Dados (LGPD) - Brazil</li>
                <li>Other applicable privacy and data protection laws</li>
              </ul>

              <h2 id="section-2" className="text-2xl font-bold text-gray-900 dark:text-slate-50 mt-12 mb-6 pb-3 border-b border-gray-300 dark:border-slate-700">2. PRIVACY-FIRST ARCHITECTURE OVERVIEW</h2>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-50 mt-8 mb-4">2.1 Core Privacy Principles</h3>

              <p className="text-sm text-gray-700 dark:text-slate-200 leading-relaxed mb-4">ERMITS implements Privacy-First Architecture built on five fundamental principles that distinguish our approach:</p>

              <div className="bg-slate-800/30 dark:bg-gray-800/30 rounded-lg p-6 my-6 space-y-6">
                <div className="border-l-4 border-yellow-500 dark:border-yellow-400 pl-4">
                  <p className="font-bold text-gray-900 dark:text-slate-50 mb-3">1. Client-Side Processing</p>
                  <p className="text-gray-700 dark:text-slate-300 leading-relaxed mb-2">All core computational functions are performed locally within your browser or self-managed environment whenever technically feasible:</p>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-slate-300">
                    <li>Security Assessments: CMMC, cybersecurity assessments processed in your browser</li>
                    <li>Asset Inventory: CyberSoluce asset data processed client-side</li>
                    <li>SBOM Analysis: TechnoSoluce processes SBOM files entirely client-side</li>
                    <li>Risk Scoring: All risk calculations performed locally</li>
                    <li>Compliance Evaluations: Assessment scoring and gap analysis done in your browser</li>
                    <li>Privacy Analysis: SocialCaution persona detection runs entirely client-side</li>
                  </ul>
                  <p className="text-gray-700 dark:text-slate-300 leading-relaxed mt-2 italic">Your data remains under your control throughout the analysis process.</p>
                </div>

                <div className="border-l-4 border-command-blue-500 dark:border-command-blue-400 pl-4">
                  <p className="font-bold text-gray-900 dark:text-slate-50 mb-3">2. Data Sovereignty Options</p>
                  <p className="text-gray-700 dark:text-slate-300 leading-relaxed mb-2">You choose where your data resides:</p>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-slate-300">
                    <li><strong>Local-Only Mode:</strong> All data stored exclusively in your browser (IndexedDB, localStorage)</li>
                    <li><strong>Self-Managed Cloud:</strong> Deploy to your own cloud infrastructure with full control (AWS, Azure, GCP)</li>
                    <li><strong>ERMITS-Managed Cloud:</strong> Optional encrypted cloud synchronization with zero-knowledge architecture</li>
                    <li><strong>Hybrid Deployment:</strong> Local processing with selective encrypted cloud backup</li>
                    <li><strong>On-Premises:</strong> Enterprise customers can deploy on their own infrastructure</li>
                  </ul>
                </div>

                <div className="border-l-4 border-indigo-500 dark:border-indigo-400 pl-4">
                  <p className="font-bold text-gray-900 dark:text-slate-50 mb-3">3. Zero-Knowledge Encryption</p>
                  <p className="text-gray-700 dark:text-slate-300 leading-relaxed mb-2">When using ERMITS-managed cloud features with encryption enabled:</p>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-slate-300">
                    <li>Data is encrypted client-side using <strong>AES-256-GCM</strong> before transmission</li>
                    <li>Encryption keys are <strong>derived from your credentials</strong> using PBKDF2 and never transmitted to ERMITS</li>
                    <li>ERMITS <strong>cannot decrypt, access, or view</strong> your encrypted data</li>
                    <li>You are <strong>solely responsible</strong> for maintaining access to encryption keys</li>
                    <li><strong>Lost keys = permanent data loss</strong> (we cannot recover your data)</li>
                  </ul>
                </div>

                <div className="border-l-4 border-orange-500 dark:border-orange-400 pl-4">
                  <p className="font-bold text-gray-900 dark:text-slate-50 mb-3">4. Data Minimization</p>
                  <p className="text-gray-700 dark:text-slate-300 leading-relaxed mb-2">We collect only the minimum data necessary for service functionality:</p>
                  <p className="font-semibold text-gray-800 dark:text-slate-200 mt-3 mb-1">Never Collected:</p>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-slate-300 mb-3">
                    <li>Asset inventory data and dependency information</li>
                    <li>Raw SBOM files, component lists, dependency graphs</li>
                    <li>Assessment content, responses, or findings</li>
                    <li>Vulnerability scan results or CVE data</li>
                    <li>Compliance documentation (SSPs, POA&Ms, evidence)</li>
                    <li>CUI (Controlled Unclassified Information)</li>
                    <li>FCI (Federal Contract Information)</li>
                    <li>PHI (Protected Health Information)</li>
                    <li>Proprietary business data or trade secrets</li>
                  </ul>
                  <p className="font-semibold text-gray-800 dark:text-slate-200 mt-3 mb-1">Optionally Collected:</p>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-slate-300">
                    <li>Account information (name, email, company) - only when you create an account</li>
                    <li>Pseudonymized telemetry (anonymous performance metrics) - opt-in only</li>
                    <li>Encrypted user data (if cloud sync enabled) - we cannot decrypt</li>
                  </ul>
                </div>

                <div className="border-l-4 border-green-500 dark:border-green-400 pl-4">
                  <p className="font-bold text-gray-900 dark:text-slate-50 mb-3">5. Transparency and Control</p>
                  <p className="text-gray-700 dark:text-slate-300 leading-relaxed mb-2">You have complete control over your data:</p>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-slate-300">
                    <li><strong>Export</strong> all data at any time in standard formats (JSON, CSV, PDF)</li>
                    <li><strong>Delete</strong> all data permanently with one click</li>
                    <li><strong>Opt in or opt out</strong> of telemetry collection anytime</li>
                    <li><strong>Choose</strong> your deployment and storage model</li>
                    <li><strong>Review</strong> detailed data flow documentation for each product</li>
                  </ul>
                </div>
              </div>

              <div className="border-t border-gray-300 dark:border-gray-600 my-8"></div>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">2. PRIVACY-FIRST ARCHITECTURE OVERVIEW</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">2.1 Core Privacy Principles</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  ERMITS implements Privacy-First Architecture built on five fundamental principles that distinguish our approach:
                </p>

                <div className="space-y-4 mb-4">
                  <div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold">1. Client-Side Processing</p>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
                      All core computational functions are performed locally within your browser or self-managed environment whenever technically feasible:
                    </p>
                    <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                      <li><strong>Security Assessments:</strong> CMMC, cybersecurity assessments processed in your browser</li>
                      <li><strong>Asset Inventory:</strong> CyberSoluce asset data processed client-side</li>
                      <li><strong>SBOM Analysis:</strong> TechnoSoluce processes SBOM files entirely client-side</li>
                      <li><strong>Risk Scoring:</strong> All risk calculations performed locally</li>
                      <li><strong>Compliance Evaluations:</strong> Assessment scoring and gap analysis done in your browser</li>
                      <li><strong>Privacy Analysis:</strong> SocialCaution persona detection runs entirely client-side</li>
                    </ul>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 mt-2 italic">
                      Your data remains under your control throughout the analysis process.
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold">2. Data Sovereignty Options</p>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">You choose where your data resides:</p>
                    <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                      <li><strong>Local-Only Mode:</strong> All data stored exclusively in your browser (IndexedDB, localStorage)</li>
                      <li><strong>Self-Managed Cloud:</strong> Deploy to your own cloud infrastructure with full control (AWS, Azure, GCP)</li>
                      <li><strong>ERMITS-Managed Cloud:</strong> Optional encrypted cloud synchronization with zero-knowledge architecture</li>
                      <li><strong>Hybrid Deployment:</strong> Local processing with selective encrypted cloud backup</li>
                      <li><strong>On-Premises:</strong> Enterprise customers can deploy on their own infrastructure</li>
                    </ul>
                  </div>

                  <div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold">3. Zero-Knowledge Encryption</p>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
                      When using ERMITS-managed cloud features with encryption enabled:
                    </p>
                    <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                      <li>Data is encrypted client-side using <strong>AES-256-GCM</strong> before transmission</li>
                      <li>Encryption keys are <strong>derived from your credentials</strong> using PBKDF2 and never transmitted to ERMITS</li>
                      <li>ERMITS <strong>cannot decrypt, access, or view</strong> your encrypted data</li>
                      <li>You are <strong>solely responsible</strong> for maintaining access to encryption keys</li>
                      <li><strong>Lost keys = permanent data loss</strong> (we cannot recover your data)</li>
                    </ul>
                  </div>

                  <div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold">4. Data Minimization</p>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">We collect only the minimum data necessary for service functionality:</p>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold">Never Collected:</p>
                    <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                      <li>Raw SBOM files, component lists, dependency graphs</li>
                      <li>Assessment content, responses, or findings</li>
                      <li>Vulnerability scan results or CVE data</li>
                      <li>Compliance documentation (SSPs, POA&Ms, evidence)</li>
                      <li>CUI (Controlled Unclassified Information)</li>
                      <li>FCI (Federal Contract Information)</li>
                      <li>PHI (Protected Health Information)</li>
                      <li>Proprietary business data or trade secrets</li>
                    </ul>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold mt-4">Optionally Collected:</p>
                    <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                      <li>Account information (name, email, company) - only when you create an account</li>
                      <li>Pseudonymized telemetry (anonymous performance metrics) - opt-in only</li>
                      <li>Encrypted user data (if cloud sync enabled) - we cannot decrypt</li>
                    </ul>
                  </div>

                  <div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold">5. Transparency and Control</p>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">You have complete control over your data:</p>
                    <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                      <li><strong>Export</strong> all data at any time in standard formats (JSON, CSV, PDF)</li>
                      <li><strong>Delete</strong> all data permanently with one click</li>
                      <li><strong>Opt in or opt out</strong> of telemetry collection anytime</li>
                      <li><strong>Choose</strong> your deployment and storage model</li>
                      <li><strong>Review</strong> detailed data flow documentation for each product</li>
                    </ul>
                  </div>
                </div>
              </section>

              <div className="border-t border-gray-300 dark:border-gray-600 my-8"></div>

              <h2 id="section-3" className="text-2xl font-bold text-gray-900 dark:text-slate-50 mt-12 mb-6 pb-3 border-b border-gray-300 dark:border-slate-700">3. INFORMATION WE COLLECT</h2>
                
              <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-50 mt-8 mb-4">3.1 Information You Provide Directly</h3>

              <div className="bg-slate-800/30 dark:bg-gray-800/30 rounded-lg p-6 my-6">
                <p className="font-bold text-gray-900 dark:text-slate-50 mb-3">Account Information (Optional):</p>
                <p className="text-gray-700 dark:text-slate-300 mb-2">When you create an account or subscribe to paid features, we collect:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-slate-300">
                  <li><strong>Name:</strong> Your full name or preferred name</li>
                  <li><strong>Email Address:</strong> For authentication, communications, and billing</li>
                  <li><strong>Company Name and Job Title:</strong> Optional, for business context</li>
                  <li><strong>Billing Information:</strong> Processed by Stripe, Inc. (our payment processor)
                    <ul className="list-circle pl-6 mt-1">
                      <li>ERMITS does not store complete payment card information</li>
                      <li>We receive only: transaction status, last 4 digits of card, billing address</li>
                    </ul>
                  </li>
                  <li><strong>Password:</strong> Cryptographically hashed using bcrypt, never stored in plaintext</li>
                </ul>
              </div>

              <div className="bg-slate-800/30 dark:bg-gray-800/30 rounded-lg p-6 my-6">
                <p className="font-bold text-gray-900 dark:text-slate-50 mb-3">User-Generated Content:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-slate-300">
                  <li><strong>Support Requests:</strong> Questions, issues, or feedback sent to support@ermits.com</li>
                  <li><strong>Survey Responses:</strong> Feedback provided through user surveys</li>
                  <li><strong>Customization Preferences:</strong> UI preferences, notification settings, feature preferences</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-50 mt-8 mb-4">3.2 Information We Do NOT Collect</h3>

              <div className="bg-red-900/20 dark:bg-red-900/20 border-l-4 border-red-500 p-6 rounded-r-lg my-6">
                <p className="font-bold text-gray-900 dark:text-slate-50 mb-3">ERMITS explicitly does NOT collect, access, store, or transmit:</p>

                <p className="font-semibold text-gray-800 dark:text-slate-200 mt-4 mb-2">Assessment and Analysis Data:</p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-slate-300">
                  <li>Asset inventory data and dependency information</li>
                  <li>Security assessment responses or scores</li>
                  <li>CMMC compliance assessments or documentation</li>
                  <li>Cybersecurity evaluation results</li>
                  <li>Privacy assessments or persona analysis results</li>
                </ul>

                <p className="font-semibold text-gray-800 dark:text-slate-200 mt-4 mb-2">Technical Data:</p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-slate-300">
                  <li>SBOM (Software Bill of Materials) files or contents</li>
                  <li>Software component lists or dependency graphs</li>
                  <li>Vulnerability scan results or CVE findings</li>
                  <li>Package metadata or software inventories</li>
                </ul>

                <p className="font-semibold text-gray-800 dark:text-slate-200 mt-4 mb-2">Compliance and Regulatory Data:</p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-slate-300">
                  <li>System Security Plans (SSPs)</li>
                  <li>Plans of Action and Milestones (POA&Ms)</li>
                  <li>Compliance evidence or audit documentation</li>
                  <li>Certification materials or assessment reports</li>
                </ul>

                <p className="font-semibold text-gray-800 dark:text-slate-200 mt-4 mb-2">Controlled Information:</p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-slate-300">
                  <li>CUI (Controlled Unclassified Information)</li>
                  <li>FCI (Federal Contract Information)</li>
                  <li>PHI (Protected Health Information) under HIPAA</li>
                  <li>PCI data (payment card information) except via Stripe</li>
                </ul>

                <p className="font-semibold text-gray-800 dark:text-slate-200 mt-4 mb-2">Business Data:</p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-slate-300">
                  <li>Trade secrets or proprietary information</li>
                  <li>Confidential business strategies</li>
                  <li>Financial records (except billing data)</li>
                  <li>Customer lists or business relationships</li>
                </ul>

                <p className="text-gray-700 dark:text-slate-300 italic mt-4">Due to our client-side processing model, this data is processed entirely in your browser or local environment. It never leaves your device unless you explicitly enable cloud sync with encryption.</p>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-50 mt-8 mb-4">3.3 Automatically Collected Information</h3>

              <div className="bg-slate-800/30 dark:bg-gray-800/30 rounded-lg p-6 my-6">
                <p className="font-bold text-gray-900 dark:text-slate-50 mb-3">Pseudonymized Telemetry (Optional - Opt-In Required):</p>
                <p className="text-gray-700 dark:text-slate-300 mb-2">With your explicit consent, we collect anonymous, aggregated performance data:</p>

                <p className="font-semibold text-gray-800 dark:text-slate-200 mt-3 mb-1">What We Collect:</p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-slate-300">
                  <li>Feature usage statistics (which tools are used, how often)</li>
                  <li>Performance metrics (page load times, API response times)</li>
                  <li>Error reports (crash logs, exceptions) with PII automatically scrubbed by Sentry</li>
                  <li>Browser and device information (browser type/version, OS, screen resolution)</li>
                  <li>Session metadata (session duration, navigation paths, timestamps)</li>
                </ul>

                <p className="font-semibold text-gray-800 dark:text-slate-200 mt-4 mb-1">Privacy Protections:</p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-slate-300">
                  <li><strong>Irreversible Pseudonymization:</strong> User identifiers are cryptographically hashed (SHA-256) and cannot be reverse-engineered</li>
                  <li><strong>No Content Data:</strong> Telemetry never includes file contents, assessment results, or user inputs</li>
                  <li><strong>Differential Privacy:</strong> PostHog analytics use differential privacy techniques to prevent individual identification</li>
                  <li><strong>Opt-Out Available:</strong> You can disable telemetry at any time in account settings with retroactive deletion</li>
                  <li><strong>Aggregate Only:</strong> Data used only in aggregate; individual user behavior cannot be identified</li>
                </ul>
              </div>

              <div className="bg-slate-800/30 dark:bg-gray-800/30 rounded-lg p-6 my-6">
                <p className="font-bold text-gray-900 dark:text-slate-50 mb-3">Technical and Security Data:</p>

                <p className="font-semibold text-gray-800 dark:text-slate-200 mt-3 mb-1">IP Addresses:</p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-slate-300">
                  <li><strong>Collected for:</strong> Security monitoring, rate limiting, geolocation for service delivery</li>
                  <li><strong>Not linked to:</strong> User accounts or identifiable information</li>
                  <li><strong>Retention:</strong> 90 days in server logs, then automatically deleted</li>
                  <li><strong>Use:</strong> Fraud prevention, DDoS protection, regional service optimization</li>
                </ul>

                <p className="font-semibold text-gray-800 dark:text-slate-200 mt-3 mb-1">Server Logs:</p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-slate-300">
                  <li>Standard web server access logs (timestamp, HTTP method, endpoint, status code, IP)</li>
                  <li>Error logs for debugging and system monitoring</li>
                  <li>Retention: 90 days, then automatically deleted</li>
                  <li>Access: Restricted to security and engineering teams only</li>
                </ul>

                <p className="font-semibold text-gray-800 dark:text-slate-200 mt-3 mb-1">Cookies and Similar Technologies:</p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-slate-300">
                  <li>See our separate <Link to="/legal/cookie-policy" className="text-command-blue-600 dark:text-command-blue-400 hover:underline">Cookie Policy</Link> for detailed information</li>
                  <li>Essential cookies for authentication and security only (required)</li>
                  <li>Optional cookies for analytics and preferences (opt-in)</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-50 mt-8 mb-4">3.4 Information from Third Parties</h3>

              <div className="bg-slate-800/30 dark:bg-gray-800/30 rounded-lg p-6 my-6">
                <p className="font-bold text-gray-900 dark:text-slate-50 mb-3">Authentication Providers (OAuth):</p>
                <p className="text-gray-700 dark:text-slate-300 mb-2">If you use OAuth for authentication (Google, Microsoft, GitHub), we receive:</p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-slate-300">
                  <li>Name and email address from the provider</li>
                  <li>Profile information you choose to share with the provider's permission</li>
                  <li>Provider's unique identifier for your account (for account linking)</li>
                </ul>
                <p className="text-gray-700 dark:text-slate-300 italic mt-2">We do not access your contacts, files, or other data from these providers.</p>
              </div>

              <div className="bg-slate-800/30 dark:bg-gray-800/30 rounded-lg p-6 my-6">
                <p className="font-bold text-gray-900 dark:text-slate-50 mb-3">Payment Processor (Stripe):</p>
                <p className="text-gray-700 dark:text-slate-300 mb-2">Stripe provides us with:</p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-slate-300">
                  <li>Payment success/failure status</li>
                  <li>Subscription status and billing cycle information</li>
                  <li>Last 4 digits of payment method (for your reference)</li>
                  <li>Billing address (for tax compliance)</li>
                </ul>
                <p className="text-gray-700 dark:text-slate-300 italic mt-2">We do not receive or store complete payment card numbers.</p>
              </div>

              <div className="bg-slate-800/30 dark:bg-gray-800/30 rounded-lg p-6 my-6">
                <p className="font-bold text-gray-900 dark:text-slate-50 mb-3">Vulnerability Databases (Public APIs):</p>
                <p className="text-gray-700 dark:text-slate-300 mb-2">When you use SBOM analysis or security assessment tools, your browser makes anonymous, client-side queries to:</p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-slate-300">
                  <li><strong>OSV.dev</strong> (Google Open Source Vulnerabilities)</li>
                  <li><strong>NIST National Vulnerability Database (NVD)</strong></li>
                  <li><strong>CISA Known Exploited Vulnerabilities (KEV) catalog</strong></li>
                </ul>

                <p className="font-semibold text-gray-800 dark:text-slate-200 mt-4 mb-1">Privacy Protection:</p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-slate-300">
                  <li>Queries performed <strong>client-side</strong> directly from your browser</li>
                  <li>Only public component identifiers sent (package name, version)</li>
                  <li>No proprietary information, file paths, or business context transmitted</li>
                  <li>ERMITS does not track or log your queries to these services</li>
                  <li>These services may have their own logging policies (outside ERMITS control)</li>
                </ul>
              </div>

              <h2 id="section-4" className="text-2xl font-bold text-gray-900 dark:text-slate-50 mt-12 mb-6 pb-3 border-b border-gray-300 dark:border-slate-700">4. HOW WE USE INFORMATION</h2>

              <div className="border-t border-gray-300 dark:border-gray-600 my-8"></div>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-50 mt-8 mb-4">4.1 Service Delivery and Operation</h3>

              <p className="text-gray-700 dark:text-slate-300 mb-2">We use collected information to:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-slate-300">
                <li><strong>Provide Services:</strong> Deliver CyberSoluce, SocialCaution, TechnoSoluce, CyberCertitude, VendorSoluce, CyberCorrect, and CyberCaution services</li>
                <li><strong>Process Transactions:</strong> Handle subscriptions, billing, and payment confirmations</li>
                <li><strong>Authenticate Users:</strong> Verify identity and maintain account security</li>
                <li><strong>Enable Features:</strong> Provide cloud synchronization, multi-device access, collaboration features (when opted-in)</li>
                <li><strong>Customer Support:</strong> Respond to inquiries, troubleshoot issues, provide technical assistance</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-50 mt-8 mb-4">4.2 Service Improvement and Analytics</h3>

              <p className="text-gray-700 dark:text-slate-300 mb-2">We use pseudonymized, aggregate data to:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-slate-300">
                <li><strong>Analyze Usage Patterns:</strong> Understand which features are used and how often (aggregate only)</li>
                <li><strong>Identify Issues:</strong> Detect and fix bugs, errors, and performance problems</li>
                <li><strong>Develop Features:</strong> Plan and build new features based on anonymized usage trends</li>
                <li><strong>Conduct Research:</strong> Perform security and privacy research using aggregated, anonymous data</li>
                <li><strong>Benchmark Performance:</strong> Measure and improve service performance and reliability</li>
              </ul>

              <div className="bg-red-900/20 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-r-lg my-4">
                <p className="font-bold text-gray-900 dark:text-slate-50 mb-2">We do NOT:</p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-slate-300">
                  <li>Analyze your individual assessment results or SBOM data</li>
                  <li>Use your data to train AI models or machine learning systems</li>
                  <li>Profile users for behavioral targeting or marketing</li>
                  <li>Sell or monetize your data in any way</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-50 mt-8 mb-4">4.3 Communication</h3>

              <p className="text-gray-700 dark:text-slate-300 mb-2">We use your contact information to:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-slate-300">
                <li><strong>Service Announcements:</strong> Notify you of system updates, maintenance, or service changes</li>
                <li><strong>Security Alerts:</strong> Send critical security notifications or breach notifications</li>
                <li><strong>Support Responses:</strong> Reply to your support requests and feedback</li>
                <li><strong>Transactional Emails:</strong> Send receipts, invoices, account confirmations</li>
                <li><strong>Product Updates:</strong> Inform you of new features or product launches (opt-in only)</li>
                <li><strong>Marketing Communications:</strong> Send promotional content only with your explicit consent (easy opt-out)</li>
              </ul>

              <p className="text-gray-700 dark:text-slate-300 italic mt-3">You can opt out of marketing emails anytime. You cannot opt out of critical service/security notifications.</p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-50 mt-8 mb-4">4.4 Security and Fraud Prevention</h3>

              <p className="text-gray-700 dark:text-slate-300 mb-2">We use technical data to:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-slate-300">
                <li><strong>Detect Threats:</strong> Identify and prevent security threats, attacks, and abuse</li>
                <li><strong>Monitor Security:</strong> Track unauthorized access attempts or account compromise</li>
                <li><strong>Enforce Policies:</strong> Ensure compliance with <Link to="/legal/terms-of-service" className="text-command-blue-600 dark:text-command-blue-400 hover:underline">Terms of Service</Link> and <Link to="/legal/acceptable-use-policy" className="text-command-blue-600 dark:text-command-blue-400 hover:underline">Acceptable Use Policy</Link></li>
                <li><strong>Prevent Fraud:</strong> Detect fraudulent transactions, account creation, or service abuse</li>
                <li><strong>Protect Users:</strong> Safeguard ERMITS, our users, and third parties from harm</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-50 mt-8 mb-4">4.5 Legal and Compliance</h3>

              <p className="text-gray-700 dark:text-slate-300 mb-2">We process information as required to:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-slate-300">
                <li><strong>Comply with Laws:</strong> Fulfill legal obligations and respond to lawful requests</li>
                <li><strong>Enforce Rights:</strong> Protect ERMITS' legal rights and enforce agreements</li>
                <li><strong>Liability Protection:</strong> Defend against legal claims or liability</li>
                <li><strong>Audits:</strong> Conduct internal audits and maintain business records</li>
                <li><strong>Regulatory Compliance:</strong> Meet requirements under GDPR, CCPA, HIPAA, and other laws</li>
              </ul>

              <h2 id="section-5" className="text-2xl font-bold text-gray-900 dark:text-slate-50 mt-12 mb-6 pb-3 border-b border-gray-300 dark:border-slate-700">5. INFORMATION SHARING AND DISCLOSURE</h2>

              <div className="border-t border-gray-300 dark:border-gray-600 my-8"></div>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">5. INFORMATION SHARING AND DISCLOSURE</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">5.1 Service Providers (Sub-Processors)</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">We share limited data with trusted third-party service providers who assist in delivering the Services:</p>
                
                <div className="overflow-x-auto my-4">
                  <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600 text-sm">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-gray-700">
                        <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left font-semibold text-gray-900 dark:text-white">Service Provider</th>
                        <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left font-semibold text-gray-900 dark:text-white">Purpose</th>
                        <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left font-semibold text-gray-900 dark:text-white">Data Shared</th>
                        <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left font-semibold text-gray-900 dark:text-white">Location</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-700 dark:text-gray-300">
                      <tr>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2"><strong>Supabase, Inc.</strong></td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Database and authentication</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Email, encrypted user data (if cloud sync enabled)</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">United States / EU (customer choice)</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2"><strong>Stripe, Inc.</strong></td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Payment processing</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Email, billing information</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">United States</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2"><strong>Sentry (Functional Software)</strong></td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Error monitoring</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Error logs with PII automatically scrubbed</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">United States</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2"><strong>PostHog, Inc.</strong></td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Analytics (opt-in)</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Pseudonymized usage metrics with differential privacy</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">United States / EU</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2"><strong>Vercel, Inc.</strong></td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Hosting and CDN</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">IP address, HTTP headers (standard web traffic)</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Global CDN</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold mt-4">Sub-Processor Requirements:</p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">All sub-processors are contractually required to:</p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                  <li>Use data <strong>only for specified purposes</strong> (providing services to ERMITS)</li>
                  <li>Implement <strong>appropriate security measures</strong> equivalent to ERMITS standards</li>
                  <li>Comply with <strong>applicable privacy laws</strong> (GDPR, CCPA, etc.)</li>
                  <li><strong>Not use data for their own purposes</strong> or share with others</li>
                  <li><strong>Delete data</strong> when no longer needed for service provision</li>
                  <li>Execute <strong>Data Processing Agreements</strong> and <strong>Standard Contractual Clauses</strong> (for international transfers)</li>
                </ul>

                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold mt-4">Sub-Processor Changes:</p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                  <li>30 days' advance notice before adding or changing sub-processors</li>
                  <li>Notification via email and in-app announcement</li>
                  <li>Enterprise customers may object to new sub-processors</li>
                  <li>Alternative arrangements if objection cannot be resolved</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">5.2 Legal Requirements</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">We may disclose information if required by law or in response to:</p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                  <li><strong>Court Orders:</strong> Subpoenas, search warrants, or judicial orders</li>
                  <li><strong>Government Requests:</strong> Law enforcement or regulatory investigations</li>
                  <li><strong>Legal Process:</strong> Lawful requests under applicable legal authority</li>
                  <li><strong>National Security:</strong> Threats to national security or public safety (where legally required)</li>
                </ul>

                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 my-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold">Our Commitments When Legally Required to Disclose:</p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">When legally permitted, we will:</p>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                    <li><strong>Notify affected users</strong> of legal requests before disclosure</li>
                    <li><strong>Challenge requests</strong> that are overly broad, improper, or unlawful</li>
                    <li><strong>Provide only minimum information</strong> required by law</li>
                    <li><strong>Seek confidentiality</strong> for user information disclosed</li>
                    <li><strong>Publish transparency reports</strong> when request volume warrants</li>
                  </ul>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 mt-3 italic"><strong>Privacy-First Architecture Limitation:</strong> Due to zero-knowledge encryption, we <strong>cannot decrypt</strong> user data even under legal compulsion. We can only provide account metadata and encrypted data (which we cannot read). Users should be aware that encryption keys may be subject to legal requests in their jurisdiction.</p>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">5.3 Business Transfers</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">If ERMITS is involved in a merger, acquisition, asset sale, or bankruptcy:</p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                  <li>User information may be transferred as part of business assets</li>
                  <li><strong>We will provide notice</strong> before information is transferred to a new entity</li>
                  <li>The <strong>successor entity will be bound</strong> by this Privacy Policy</li>
                  <li>You will have the <strong>option to delete your data</strong> before transfer (minimum 30 days notice)</li>
                  <li><strong>Enterprise contracts</strong> and DPAs will remain in effect or require renegotiation</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">5.4 Consent-Based Sharing</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">We may share information with your explicit consent for purposes such as:</p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                  <li><strong>Third-Party Integrations:</strong> Sharing data with services you authorize (HRIS, GRC platforms, etc.)</li>
                  <li><strong>Organization Administrators:</strong> Sharing data with your organization's designated admins (Enterprise accounts)</li>
                  <li><strong>Testimonials:</strong> Publicly sharing your feedback with identifying information only if you approve</li>
                  <li><strong>Case Studies:</strong> Using your organization as a case study with explicit written permission</li>
                  <li><strong>Research Participation:</strong> Including your data in research studies with explicit opt-in consent</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">5.5 Aggregated and Anonymous Data</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">We may share aggregated, anonymous data that <strong>cannot identify you</strong>:</p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                  <li><strong>Industry Benchmarks:</strong> Comparative statistics for security maturity, compliance readiness</li>
                  <li><strong>Research Publications:</strong> Academic or industry research on cybersecurity trends</li>
                  <li><strong>Public Reports:</strong> Trend analysis, threat intelligence, industry insights</li>
                  <li><strong>Product Insights:</strong> Feature adoption rates, performance statistics</li>
                </ul>

                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 my-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold">Privacy Protections:</p>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                    <li>Data is <strong>irreversibly anonymized</strong> using differential privacy techniques</li>
                    <li><strong>Minimum anonymity set:</strong> At least 10 organizations in any aggregate statistic</li>
                    <li><strong>Cannot be reverse-engineered</strong> to identify individuals or organizations</li>
                    <li><strong>Opt-out available:</strong> You can request exclusion from aggregated datasets</li>
                  </ul>
                </div>
              </section>

              <div className="border-t border-gray-300 dark:border-gray-600 my-8"></div>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">6. DATA SECURITY MEASURES</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">6.1 Encryption</h3>
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 my-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold">Data in Transit:</p>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                    <li><strong>TLS 1.3</strong> encryption for all data transmission (minimum TLS 1.2 for legacy systems)</li>
                    <li><strong>HTTPS required</strong> for all web traffic</li>
                    <li><strong>Certificate Pinning</strong> for critical connections</li>
                    <li><strong>Perfect Forward Secrecy (PFS)</strong> enabled to protect past sessions</li>
                    <li><strong>Strong Cipher Suites</strong> only (AES-256-GCM, ChaCha20-Poly1305)</li>
                  </ul>

                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold mt-4">Data at Rest:</p>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                    <li><strong>AES-256-GCM</strong> encryption for cloud-stored data</li>
                    <li><strong>Client-Side Encryption</strong> with user-controlled keys (zero-knowledge architecture)</li>
                    <li><strong>Encrypted Database Backups</strong> with separate encryption keys</li>
                    <li><strong>Secure Key Management</strong> using industry-standard HSMs and key rotation</li>
                  </ul>

                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold mt-4">Data in Use:</p>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                    <li><strong>Client-Side Processing</strong> minimizes data exposure during computation</li>
                    <li><strong>Memory Encryption</strong> where supported by browser and OS</li>
                    <li><strong>Secure Coding Practices</strong> to prevent data leakage</li>
                    <li><strong>Input Validation and Output Encoding</strong> to prevent injection attacks</li>
                  </ul>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">6.2 Access Controls</h3>
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 my-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold">Authentication:</p>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                    <li><strong>Multi-Factor Authentication (MFA)</strong> available for all accounts, required for administrators</li>
                    <li><strong>Strong Password Requirements:</strong> Minimum 12 characters, complexity requirements</li>
                    <li><strong>Password Breach Detection:</strong> Checking against known compromised password databases</li>
                    <li><strong>Session Management:</strong> Automatic timeout after 4 hours idle, 12 hours maximum</li>
                    <li><strong>OAuth 2.0 Integration</strong> with trusted providers (Google, Microsoft, GitHub)</li>
                  </ul>

                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold mt-4">Authorization:</p>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                    <li><strong>Row-Level Security (RLS):</strong> Database-level policies ensure users can only access their own data</li>
                    <li><strong>Role-Based Access Control (RBAC):</strong> Granular permissions (Admin, Editor, Viewer, etc.)</li>
                    <li><strong>Principle of Least Privilege:</strong> Users and systems granted minimum necessary permissions</li>
                    <li><strong>Attribute-Based Access Control:</strong> Fine-grained policies based on user attributes and context</li>
                    <li><strong>Just-in-Time Access:</strong> Temporary elevated permissions for specific tasks</li>
                  </ul>

                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold mt-4">Access Logging:</p>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                    <li>All data access logged with <strong>timestamp, user, action, resource</strong></li>
                    <li><strong>Audit logs retained</strong> for 3 years (configurable for Enterprise)</li>
                    <li><strong>Regular audit log review</strong> for anomalies and security events</li>
                    <li><strong>Immutable logs</strong> stored separately (cannot be altered or deleted)</li>
                    <li><strong>SIEM integration</strong> available for enterprise security monitoring</li>
                  </ul>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">6.3 Infrastructure Security</h3>
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 my-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold">Cloud Security:</p>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                    <li><strong>Secure Hosting:</strong> Enterprise-grade infrastructure (Supabase on AWS, Vercel on AWS/GCP)</li>
                    <li><strong>Network Segmentation:</strong> Isolated production, staging, and development environments</li>
                    <li><strong>DDoS Protection:</strong> Distributed denial-of-service attack mitigation</li>
                    <li><strong>Web Application Firewall (WAF):</strong> Protection against common web attacks</li>
                    <li><strong>Intrusion Detection/Prevention (IDS/IPS):</strong> 24/7 monitoring for suspicious activity</li>
                    <li><strong>Regular Vulnerability Scanning:</strong> Automated and manual security assessments</li>
                    <li><strong>Penetration Testing:</strong> Annual third-party security audits</li>
                  </ul>

                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold mt-4">Application Security:</p>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                    <li><strong>Secure Coding Practices:</strong> Following OWASP Top 10 guidelines</li>
                    <li><strong>Code Review:</strong> All code changes reviewed for security issues</li>
                    <li><strong>Input Validation:</strong> Comprehensive sanitization of all user inputs</li>
                    <li><strong>SQL Injection Prevention:</strong> Parameterized queries and prepared statements</li>
                    <li><strong>XSS Protection:</strong> Content Security Policy (CSP) and output encoding</li>
                    <li><strong>CSRF Protection:</strong> Anti-CSRF tokens for state-changing operations</li>
                    <li><strong>Dependency Management:</strong> Regular updates and vulnerability scanning</li>
                    <li><strong>Security Headers:</strong> HSTS, X-Frame-Options, CSP, and other protective headers</li>
                  </ul>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">6.4 Employee and Contractor Access</h3>
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 my-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold">Personnel Security:</p>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                    <li><strong>Background Checks</strong> for employees with data access</li>
                    <li><strong>Enhanced Screening</strong> for security and engineering roles</li>
                    <li><strong>Confidentiality Agreements:</strong> All employees and contractors sign NDAs</li>
                    <li><strong>Security Training:</strong> Annual security awareness training, GDPR training</li>
                    <li><strong>Access on Need-to-Know Basis:</strong> Limited to personnel requiring access</li>
                    <li><strong>Regular Access Reviews:</strong> Quarterly review and revocation of unnecessary access</li>
                    <li><strong>Immediate Revocation:</strong> Access terminated immediately upon employment end</li>
                  </ul>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">6.5 Security Incident Response</h3>
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 my-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">In the event of a data breach or security incident:</p>

                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold mt-3">Detection:</p>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                    <li>24/7 security monitoring and alerting systems</li>
                    <li>Automated threat detection and anomaly analysis</li>
                    <li>Real-time intrusion detection</li>
                  </ul>

                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold mt-3">Containment:</p>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                    <li>Immediate action to isolate affected systems</li>
                    <li>Disable compromised accounts or services</li>
                    <li>Prevent further unauthorized access</li>
                  </ul>

                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold mt-3">Investigation:</p>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                    <li>Forensic analysis to determine scope and impact</li>
                    <li>Root cause identification</li>
                    <li>Evidence preservation for potential legal action</li>
                  </ul>

                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold mt-3">Notification:</p>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                    <li><strong>Users notified within 72 hours</strong> of breach discovery (GDPR requirement)</li>
                    <li><strong>Supervisory authorities notified</strong> as required by law</li>
                    <li><strong>Notification includes:</strong> Nature of breach, data affected, steps taken, recommendations for users</li>
                  </ul>

                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold mt-3">Remediation:</p>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                    <li>Implement fixes to prevent recurrence</li>
                    <li>Update security controls and policies</li>
                    <li>Provide credit monitoring or identity theft protection if appropriate</li>
                    <li>Conduct post-incident review and lessons learned</li>
                  </ul>
                </div>
              </section>

              <div className="border-t border-gray-300 dark:border-gray-600 my-8"></div>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">7. DATA RETENTION</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">7.1 Active Account Data</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">We retain your data for as long as your account is active or as needed to provide Services:</p>
                
                <div className="overflow-x-auto my-6">
                  <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600 text-sm">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                      <tr>
                        <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left font-semibold text-gray-900 dark:text-white">Data Type</th>
                        <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left font-semibold text-gray-900 dark:text-white">Retention Period</th>
                        <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left font-semibold text-gray-900 dark:text-white">Purpose</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-700 dark:text-gray-300">
                      <tr>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2"><strong>Account Information</strong></td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Duration of account + 30 days after termination</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Service delivery, support, billing</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2"><strong>User-Generated Content</strong></td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">User-controlled (can delete anytime); deleted 30 days after account termination (90 days for backups)</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Service functionality, user requests</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2"><strong>Encrypted Cloud Data</strong></td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">User-controlled (can delete anytime); deleted 30 days after account termination (90 days for backups)</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Cloud synchronization, multi-device access</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2"><strong>Authentication Tokens</strong></td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">1 hour (access token), 30 days (refresh token)</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Session management, security</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2"><strong>Support Communications</strong></td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">3 years after last interaction</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Customer support, quality improvement, legal compliance</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2"><strong>Pseudonymized Telemetry</strong></td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Indefinite (anonymous, cannot be deleted or linked to individuals)</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Service improvement, analytics, research</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2"><strong>Server Logs (IP addresses)</strong></td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">90 days</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Security monitoring, fraud prevention, debugging</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">7.2 Product-Specific Retention</h3>
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 my-4 space-y-4">
                  <div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold">TechnoSoluce (SBOM Analyzer):</p>
                    <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                      <li>SBOM files: Never transmitted to or stored on ERMITS servers</li>
                      <li>Analysis results: Stored locally in user's browser only</li>
                      <li>No retention on ERMITS infrastructure</li>
                    </ul>
                  </div>

                  <div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold">CyberCertitude (CMMC Compliance):</p>
                    <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                      <li>Assessments: User-controlled; deleted with account or on-demand</li>
                      <li>Compliance documentation: User-controlled</li>
                      <li>Historical assessment data: Retained while account active (for trend analysis)</li>
                    </ul>
                  </div>

                  <div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold">SocialCaution:</p>
                    <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                      <li>Privacy assessments: User-controlled; stored locally in browser only</li>
                      <li>User preferences: Duration of account + 30 days</li>
                      <li>No personal data from assessments stored on ERMITS servers</li>
                    </ul>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">7.3 Deleted Accounts</h3>
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 my-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">When you delete your account or request data deletion:</p>

                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold mt-3">Immediate (within 24 hours):</p>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                    <li>Account access disabled</li>
                    <li>Data marked for deletion</li>
                    <li>Stop all processing of personal data</li>
                  </ul>

                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold mt-3">Within 30 days:</p>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                    <li>User Data permanently deleted from production systems</li>
                    <li>Account information removed from active databases</li>
                    <li>Encrypted cloud data deleted (we cannot decrypt, but keys are destroyed)</li>
                  </ul>

                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold mt-3">Within 90 days:</p>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                    <li>Backup copies permanently deleted</li>
                    <li>All traces removed from backup systems</li>
                    <li>Deletion verification available upon request</li>
                  </ul>

                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold mt-3">Exceptions (data retained longer):</p>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                    <li><strong>Financial Records:</strong> 7 years (tax and audit requirements - IRS, SOX)</li>
                    <li><strong>Legal Hold Data:</strong> Retained as required by litigation or investigation</li>
                    <li><strong>Pseudonymized Analytics:</strong> Indefinite (anonymous, cannot identify individuals)</li>
                    <li><strong>Aggregated Statistics:</strong> Indefinite (cannot be reverse-engineered to identify you)</li>
                  </ul>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">7.4 Data Deletion Verification</h3>
                <p className="text-gray-700 dark:text-gray-300">Upon request, we will provide written certification that your data has been deleted in accordance with this policy. Contact: <a href="mailto:privacy@ermits.com" className="text-command-blue-600 dark:text-command-blue-400 hover:underline">privacy@ermits.com</a></p>
              </section>

              <div className="border-t border-gray-300 dark:border-gray-600 my-8"></div>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">8. YOUR PRIVACY RIGHTS</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">8.1 Universal Rights (All Users)</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">All users have the following rights regardless of location:</p>
                
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 my-4 space-y-4">
                  <div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold">Right to Access:</p>
                    <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                      <li>Request a copy of all personal data we hold about you</li>
                      <li>Receive information about how your data is processed</li>
                      <li>Access your data via Account Settings → Export Data anytime</li>
                      <li>Request human-readable summary of data processing activities</li>
                    </ul>
                  </div>

                  <div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold">Right to Rectification:</p>
                    <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                      <li>Correct inaccurate or incomplete personal data</li>
                      <li>Update information directly in Account Settings</li>
                      <li>Contact support for assistance: <a href="mailto:privacy@ermits.com" className="text-command-blue-600 dark:text-command-blue-400 hover:underline">privacy@ermits.com</a></li>
                      <li>We will correct errors within 10 business days</li>
                    </ul>
                  </div>

                  <div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold">Right to Deletion (Right to be Forgotten):</p>
                    <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                      <li>Request deletion of your personal data</li>
                      <li>Delete account and all data via Account Settings → Delete Account</li>
                      <li>Data deleted within 30 days (production), 90 days (backups)</li>
                      <li>Some data retained for legal compliance (financial records, legal holds)</li>
                    </ul>
                  </div>

                  <div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold">Right to Data Portability:</p>
                    <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                      <li>Export your data in machine-readable formats (JSON, CSV, PDF)</li>
                      <li>Transfer data to another service provider</li>
                      <li>Export available anytime via Account Settings → Export Data</li>
                      <li>Includes all personal data you provided and data generated about you</li>
                    </ul>
                  </div>

                  <div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold">Right to Restriction of Processing:</p>
                    <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                      <li>Request limitation of processing in certain circumstances</li>
                      <li>Temporarily suspend processing while disputes are resolved</li>
                      <li>Object to specific processing activities</li>
                    </ul>
                  </div>

                  <div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold">Right to Object:</p>
                    <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                      <li>Object to processing based on legitimate interests</li>
                      <li>Opt out of marketing communications anytime</li>
                      <li>Disable telemetry collection</li>
                      <li>Withdraw consent for optional data processing</li>
                    </ul>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">8.2 Additional Rights for EU/UK/Swiss Users (GDPR)</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">If you are located in the European Economic Area, United Kingdom, or Switzerland, you have additional rights:</p>
                
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 my-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold">Legal Basis for Processing:</p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">We process your data based on:</p>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                    <li><strong>Consent:</strong> When you provide explicit consent (marketing, telemetry, optional features)</li>
                    <li><strong>Contract:</strong> To perform our contract with you (provide Services you purchased)</li>
                    <li><strong>Legitimate Interests:</strong> For service improvement, security, fraud prevention (balanced against your rights)</li>
                    <li><strong>Legal Obligation:</strong> To comply with applicable laws (tax, financial reporting, law enforcement)</li>
                  </ul>

                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold mt-4">Right to Withdraw Consent:</p>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                    <li>Withdraw consent at any time (does not affect prior processing)</li>
                    <li>Disable telemetry in Account Settings → Privacy → Data Collection</li>
                    <li>Unsubscribe from marketing emails via link in each email</li>
                    <li>Withdrawal processed immediately</li>
                  </ul>

                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold mt-4">Right to Lodge a Complaint:</p>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                    <li>File complaint with your local data protection authority (DPA)</li>
                    <li><strong>EU:</strong> Find your DPA at <a href="https://edpb.europa.eu/about-edpb/board/members_en" target="_blank" rel="noopener noreferrer" className="text-command-blue-600 dark:text-command-blue-400 hover:underline">edpb.europa.eu</a></li>
                    <li><strong>UK:</strong> Information Commissioner's Office (ICO) - <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-command-blue-600 dark:text-command-blue-400 hover:underline">ico.org.uk</a></li>
                    <li><strong>Switzerland:</strong> Federal Data Protection and Information Commissioner (FDPIC)</li>
                    <li>You may also contact us first to resolve issues: <a href="mailto:privacy@ermits.com" className="text-command-blue-600 dark:text-command-blue-400 hover:underline">privacy@ermits.com</a></li>
                  </ul>

                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold mt-4">Data Protection Officer:</p>
                  <p className="text-gray-700 dark:text-gray-300">For GDPR-related inquiries, contact: <a href="mailto:privacy@ermits.com" className="text-command-blue-600 dark:text-command-blue-400 hover:underline">privacy@ermits.com</a> (Subject: "GDPR Inquiry - [Your Name]")</p>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">8.3 Additional Rights for California Residents (CCPA/CPRA)</h3>
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 my-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">If you are a California resident, you have additional rights under CCPA and CPRA:</p>

                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold mt-3">Right to Know:</p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-1">You can request information about:</p>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                    <li>Categories of personal information collected</li>
                    <li>Categories of sources of personal information</li>
                    <li>Business or commercial purposes for collecting or selling personal information</li>
                    <li>Categories of third parties with whom we share personal information</li>
                    <li>Specific pieces of personal information collected about you</li>
                  </ul>

                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold mt-3">Right to Delete:</p>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                    <li>Request deletion of personal information (subject to legal exceptions)</li>
                    <li>Exceptions: Legal compliance, fraud prevention, internal uses, service provision</li>
                  </ul>

                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold mt-3">Right to Opt-Out of Sale:</p>
                  <p className="text-gray-700 dark:text-gray-300"><strong>ERMITS does not sell personal information</strong> and has not sold personal information in the past 12 months. We do not sell personal information of minors under 16.</p>

                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold mt-3">Right to Correct:</p>
                  <p className="text-gray-700 dark:text-gray-300">Request correction of inaccurate personal information. We will correct errors within 45 days.</p>

                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold mt-3">Right to Non-Discrimination:</p>
                  <p className="text-gray-700 dark:text-gray-300">Equal service and pricing regardless of privacy rights exercise. No denial of goods or services for exercising privacy rights.</p>

                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold mt-3">California Consumer Privacy Request:</p>
                  <p className="text-gray-700 dark:text-gray-300">Submit requests via email: <a href="mailto:privacy@ermits.com" className="text-command-blue-600 dark:text-command-blue-400 hover:underline">privacy@ermits.com</a> (Subject: "CCPA Request - [Your Name]")</p>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">8.4 Exercising Your Rights</h3>
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 my-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold">How to Submit Requests:</p>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                    <li><strong>Email:</strong> <a href="mailto:privacy@ermits.com" className="text-command-blue-600 dark:text-command-blue-400 hover:underline">privacy@ermits.com</a> (Subject: "Privacy Rights Request - [Type of Request]")</li>
                    <li><strong>In-App:</strong> Navigate to Account Settings → Privacy Rights</li>
                    <li><strong>Response Timeline:</strong> Initial response within 10 business days; complete response within 45 days (may extend for complex requests)</li>
                    <li><strong>Free of Charge:</strong> First two requests per year are free; reasonable fee may apply for excessive, repetitive, or manifestly unfounded requests</li>
                  </ul>
                </div>
              </section>

              <div className="border-t border-gray-300 dark:border-gray-600 my-8"></div>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">9. INTERNATIONAL DATA TRANSFERS</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">9.1 Data Processing Locations</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">ERMITS is based in the United States. If you access Services from outside the U.S., your data may be transferred to, stored, and processed in the United States or other countries where our service providers operate.</p>
                
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 my-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold">Primary Data Locations:</p>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                    <li><strong>United States:</strong> Primary data processing and storage (Supabase US, Vercel US)</li>
                    <li><strong>European Union:</strong> Optional data residency for EU customers (Supabase EU region - Frankfurt)</li>
                    <li><strong>Global CDN:</strong> Content delivery network nodes worldwide (Vercel Edge Network)</li>
                  </ul>

                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold mt-4">Service Provider Locations:</p>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                    <li><strong>Supabase:</strong> United States (default), EU (optional)</li>
                    <li><strong>Stripe:</strong> United States (global processing)</li>
                    <li><strong>Sentry:</strong> United States</li>
                    <li><strong>PostHog:</strong> United States / EU (customer choice)</li>
                    <li><strong>Vercel:</strong> Global (primary US)</li>
                  </ul>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">9.2 Safeguards for International Transfers</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">For data transfers from the EEA, UK, or Switzerland to the United States:</p>
                
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 my-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold">Standard Contractual Clauses (SCCs):</p>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                    <li>ERMITS uses European Commission-approved Standard Contractual Clauses (Decision 2021/914)</li>
                    <li>SCCs incorporated into agreements with all sub-processors</li>
                    <li>Module Two (Controller to Processor) SCCs apply</li>
                    <li>Full text available upon request: <a href="mailto:privacy@ermits.com" className="text-command-blue-600 dark:text-command-blue-400 hover:underline">privacy@ermits.com</a></li>
                  </ul>

                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold mt-4">UK International Data Transfer Addendum:</p>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                    <li>UK Addendum to EU SCCs for UK data transfers</li>
                    <li>Approved by UK Information Commissioner's Office (ICO)</li>
                    <li>Compliance with UK GDPR requirements</li>
                  </ul>

                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold mt-4">Additional Safeguards:</p>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                    <li><strong>Encryption in Transit and at Rest:</strong> TLS 1.3, AES-256</li>
                    <li><strong>Access Controls:</strong> RBAC, MFA, Row-Level Security</li>
                    <li><strong>Regular Security Assessments:</strong> Audits, penetration testing</li>
                    <li><strong>Incident Response Procedures:</strong> 72-hour breach notification</li>
                    <li><strong>Transparency:</strong> Government access request notifications (when legally permitted)</li>
                    <li><strong>Zero-Knowledge Architecture:</strong> Technical impossibility of accessing encrypted data</li>
                  </ul>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">9.3 Data Residency Options</h3>
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 my-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold">EU Data Residency (Available Now):</p>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                    <li>Supabase EU region (Frankfurt, Germany)</li>
                    <li>All data stored and processed within EU</li>
                    <li>EU-based backups and disaster recovery</li>
                    <li>Request at signup or contact: <a href="mailto:privacy@ermits.com" className="text-command-blue-600 dark:text-command-blue-400 hover:underline">privacy@ermits.com</a></li>
                  </ul>

                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold mt-4">Self-Managed Infrastructure (Enterprise):</p>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                    <li>Deploy to your own cloud environment (AWS, Azure, GCP)</li>
                    <li>Choose any geographic region</li>
                    <li>Complete control over data location</li>
                    <li>ERMITS provides software and support only</li>
                  </ul>

                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold mt-4">On-Premises Deployment (Enterprise Plus):</p>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                    <li>Install on your own servers</li>
                    <li>Air-gapped operation supported</li>
                    <li>No data leaves your network</li>
                    <li>Complete data sovereignty</li>
                  </ul>
                </div>
              </section>

              <div className="border-t border-gray-300 dark:border-gray-600 my-8"></div>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">10. CHILDREN'S PRIVACY</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">10.1 Age Restrictions</h3>
                <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-6 rounded-r-lg my-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3 font-semibold">
                    <strong>The Services are not intended for children under 18 years of age.</strong> We do not knowingly collect personal information from children under 18.
                  </p>

                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold mt-4">If You Are Under 18:</p>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                    <li>Do not use the Services</li>
                    <li>Do not provide any information to ERMITS</li>
                    <li>Do not create an account</li>
                    <li>Have a parent or guardian contact us if you have provided information</li>
                  </ul>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">10.2 Parental Rights</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">If we learn that we have collected personal information from a child under 18 without verified parental consent:</p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                  <li>We will <strong>delete the information as quickly as possible</strong></li>
                  <li>Parents may contact us to request deletion: <a href="mailto:privacy@ermits.com" className="text-command-blue-600 dark:text-command-blue-400 hover:underline">privacy@ermits.com</a></li>
                  <li>Parents have the right to review information collected from their child, request deletion, refuse further collection, and receive information about our data practices</li>
                </ul>
              </section>

              <div className="border-t border-gray-300 dark:border-gray-600 my-8"></div>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">11. PRODUCT-SPECIFIC PRIVACY CONSIDERATIONS</h2>
                
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 my-4 space-y-6">
                  <div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold">TechnoSoluce™ (SBOM Analyzer):</p>
                    <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                      <li>SBOM files: Never transmitted to or stored on ERMITS servers</li>
                      <li>Analysis results: Stored locally in user's browser only</li>
                      <li>No retention on ERMITS infrastructure</li>
                    </ul>
                  </div>

                  <div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold">SocialCaution:</p>
                    <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                      <li>Privacy assessment responses: Processed 100% client-side</li>
                      <li>All assessment data stored locally in browser (IndexedDB, localStorage)</li>
                      <li>Zero data transmission to ERMITS servers during assessments</li>
                    </ul>
                  </div>

                  <div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold">CyberCertitude™ (CMMC Compliance):</p>
                    <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                      <li>Toolkit (localStorage-based): 100% local storage, no data collected</li>
                      <li>Level 1 & 2 Platform: Encrypted compliance data with zero-knowledge E2EE</li>
                      <li>ERMITS cannot decrypt your compliance data</li>
                    </ul>
                  </div>

                  <div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold">CyberCaution™ (Security Assessments):</p>
                    <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                      <li>Browser-Based: 100% local processing, no data collected</li>
                      <li>Cloud-Enabled: Encrypted security assessment data (if cloud sync enabled)</li>
                      <li>Anonymous benchmarking opt-in only with differential privacy</li>
                    </ul>
                  </div>
                </div>
              </section>

              <div className="border-t border-gray-300 dark:border-gray-600 my-8"></div>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">12. SPECIAL CONSIDERATIONS</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">12.1 Federal Contractor Privacy</h3>
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 my-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">For users handling Controlled Unclassified Information (CUI) or Federal Contract Information (FCI):</p>

                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold mt-3">Privacy-First Architecture Benefits:</p>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                    <li>CUI/FCI processed client-side; never transmitted to ERMITS</li>
                    <li>Zero-knowledge encryption ensures ERMITS cannot access CUI/FCI</li>
                    <li>Local storage options eliminate cloud transmission of sensitive data</li>
                    <li>You maintain complete control over CUI/FCI data</li>
                  </ul>

                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold mt-3">Your Responsibilities:</p>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                    <li>Properly mark and handle CUI/FCI according to NIST SP 800-171 and 32 CFR Part 2002</li>
                    <li>Use encryption features and self-managed deployment options for CUI/FCI</li>
                    <li>Implement appropriate access controls per DFARS requirements</li>
                    <li>Maintain audit logs for CUI/FCI access</li>
                    <li>Report cyber incidents as required by DFARS 252.204-7012 (within 72 hours to DoD)</li>
                  </ul>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">12.2 Healthcare Privacy (HIPAA)</h3>
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 my-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">For healthcare organizations subject to HIPAA:</p>

                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold mt-3">Business Associate Agreement (BAA) Available:</p>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                    <li>Required for healthcare customers processing PHI</li>
                    <li>Contact: <a href="mailto:privacy@ermits.com" className="text-command-blue-600 dark:text-command-blue-400 hover:underline">privacy@ermits.com</a> to execute BAA</li>
                    <li>HIPAA-compliant infrastructure and safeguards</li>
                  </ul>

                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold mt-3">Recommended Configuration:</p>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                    <li>Use local-only storage for all PHI</li>
                    <li>Use self-managed cloud infrastructure</li>
                    <li>Enable client-side encryption for any cloud-stored data</li>
                    <li>Implement access controls per HIPAA Security Rule</li>
                  </ul>
                </div>
              </section>

              <div className="border-t border-gray-300 dark:border-gray-600 my-8"></div>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">13. UPDATES TO THIS PRIVACY POLICY</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">We may update this Privacy Policy periodically to reflect:</p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                  <li>Changes in data practices or Services</li>
                  <li>New product launches or features</li>
                  <li>Legal or regulatory developments</li>
                  <li>Technological improvements</li>
                  <li>User feedback and industry best practices</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold mt-4">Material Changes:</p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                  <li>30 days' advance notice via email and in-app announcement</li>
                  <li>Prominent display on website and in Services</li>
                  <li>Option to export data and close account before changes take effect</li>
                </ul>
              </section>

              <div className="border-t border-gray-300 dark:border-gray-600 my-8"></div>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">14. CONTACT INFORMATION</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">14.1 Privacy Inquiries</h3>
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 my-4 space-y-3">
                  <p className="text-gray-700 dark:text-gray-300"><strong>General Privacy Questions:</strong><br />
                  Email: <a href="mailto:privacy@ermits.com" className="text-command-blue-600 dark:text-command-blue-400 hover:underline">privacy@ermits.com</a><br />
                  Subject: "Privacy Inquiry"</p>
                  
                  <p className="text-gray-700 dark:text-gray-300"><strong>Data Rights Requests:</strong><br />
                  Online Form: <a href="https://www.ermits.com/privacy-request" target="_blank" rel="noopener noreferrer" className="text-command-blue-600 dark:text-command-blue-400 hover:underline">www.ermits.com/privacy-request</a><br />
                  Email: <a href="mailto:privacy@ermits.com" className="text-command-blue-600 dark:text-command-blue-400 hover:underline">privacy@ermits.com</a><br />
                  Subject: "Privacy Rights Request - [Type]"</p>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">14.2 Jurisdiction-Specific Contacts</h3>
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 my-4 space-y-3">
                  <p className="text-gray-700 dark:text-gray-300"><strong>Data Protection Officer (EU/UK/Swiss):</strong><br />
                  Email: <a href="mailto:privacy@ermits.com" className="text-command-blue-600 dark:text-command-blue-400 hover:underline">privacy@ermits.com</a><br />
                  Subject: "GDPR Inquiry - DPO"</p>
                  
                  <p className="text-gray-700 dark:text-gray-300"><strong>California Privacy Requests (CCPA/CPRA):</strong><br />
                  Online Form: <a href="https://www.ermits.com/privacy-request" target="_blank" rel="noopener noreferrer" className="text-command-blue-600 dark:text-command-blue-400 hover:underline">www.ermits.com/privacy-request</a><br />
                  Email: <a href="mailto:privacy@ermits.com" className="text-command-blue-600 dark:text-command-blue-400 hover:underline">privacy@ermits.com</a><br />
                  Subject: "CCPA Request"</p>
                  
                  <p className="text-gray-700 dark:text-gray-300"><strong>HIPAA Privacy Officer (Healthcare):</strong><br />
                  Email: <a href="mailto:privacy@ermits.com" className="text-command-blue-600 dark:text-command-blue-400 hover:underline">privacy@ermits.com</a><br />
                  Subject: "HIPAA Privacy Matter"</p>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">14.3 Security Concerns</h3>
                <p className="text-gray-700 dark:text-gray-300">Email: <a href="mailto:security@ermits.com" className="text-command-blue-600 dark:text-command-blue-400 hover:underline">security@ermits.com</a><br />
                Subject: "Security Issue - [Urgent/Non-Urgent]"</p>
              </section>

              <div className="border-t border-gray-300 dark:border-gray-600 my-8"></div>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">15. EFFECTIVE DATE AND ACCEPTANCE</h2>
                <div className="bg-gray-50 dark:bg-gray-900/50 border-l-4 border-command-blue-500 p-6 rounded-r-lg my-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
                    <strong>Effective Date:</strong> October 31, 2025
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
                    <strong>Last Updated:</strong> December 13, 2025
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                    <strong>By using ERMITS Services, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy.</strong>
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-2">
                    If you do not agree with this Privacy Policy, you must discontinue use of all ERMITS Services immediately.
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
