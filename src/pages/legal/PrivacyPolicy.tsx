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
                  MASTER PRIVACY POLICY
                </h1>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  <p><strong>Effective Date:</strong> November 19, 2025</p>
                  <p><strong>Last Updated:</strong> October 31, 2025</p>
                </div>
              </div>
            </div>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                ERMITS LLC ("ERMITS," "we," "our," or "us") is committed to protecting your privacy through a Privacy-First Architecture that ensures you maintain control over your data. This Privacy Policy explains how we collect, use, disclose, and safeguard information when you use our Services across all ERMITS product lines.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                By using our Services, you consent to the data practices described in this policy. If you do not agree with this Privacy Policy, please do not use our Services.
              </p>

              <div className="border-t border-gray-300 dark:border-gray-600 my-8"></div>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">1. SCOPE AND APPLICABILITY</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">1.1 Services Covered</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">This Privacy Policy applies to all ERMITS products and services, including:</p>
                
                <div className="space-y-4 mb-4">
                  <div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold">ERMITS Advisory + STEEL™:</p>
                    <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                      <li>Strategic cybersecurity assessments and advisory services</li>
                      <li>STEEL™ (Strategic Threat & Enterprise Evaluation Layer) framework assessments</li>
                      <li>vCISO services and security consulting</li>
                      <li>Compliance advisory and implementation services</li>
                    </ul>
                  </div>

                  <div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold">SocialCaution:</p>
                    <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                      <li>Personalized privacy platform</li>
                      <li>AI-powered persona detection</li>
                      <li>Privacy exposure index and risk scoring</li>
                      <li>Service catalog with privacy risk profiles</li>
                    </ul>
                  </div>

                  <div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold">TechnoSoluce™:</p>
                    <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                      <li>SBOM (Software Bill of Materials) Analyzer</li>
                      <li>Software supply chain security and vulnerability analysis</li>
                      <li>Client-side SBOM processing</li>
                    </ul>
                  </div>

                  <div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold">CyberCertitude™:</p>
                    <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                      <li>CMMC 2.0 Level 1 Implementation Suite</li>
                      <li>CMMC 2.0 Level 2 Compliance Platform</li>
                      <li>NIST SP 800-171 assessment and compliance tools</li>
                      <li>Original Toolkit (localStorage-based compliance management)</li>
                    </ul>
                  </div>

                  <div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold">VendorSoluce™:</p>
                    <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                      <li>Supply Chain Risk Management Platform</li>
                      <li>Vendor assessment and monitoring</li>
                      <li>Third-party risk evaluation</li>
                    </ul>
                  </div>

                  <div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold">CyberCorrect™:</p>
                    <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                      <li>Privacy Portal (workplace privacy compliance)</li>
                      <li>Privacy Platform (multi-regulation privacy management)</li>
                      <li>Data subject rights management</li>
                    </ul>
                  </div>

                  <div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold">CyberCaution™:</p>
                    <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                      <li>RansomCheck (ransomware readiness assessment)</li>
                      <li>Security Toolkit (comprehensive cybersecurity assessments)</li>
                      <li>RiskProfessional (CISA-aligned security assessments)</li>
                    </ul>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">1.2 Geographic Scope</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">This Privacy Policy applies to users worldwide and complies with:</p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                  <li>General Data Protection Regulation (GDPR) - European Union, United Kingdom, Switzerland</li>
                  <li>California Consumer Privacy Act (CCPA) / California Privacy Rights Act (CPRA)</li>
                  <li>Personal Information Protection and Electronic Documents Act (PIPEDA) - Canada</li>
                  <li>Lei Geral de Proteção de Dados (LGPD) - Brazil</li>
                  <li>Other applicable privacy and data protection laws</li>
                </ul>
              </section>

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
                      <li><strong>Security Assessments:</strong> STEEL™, CMMC, cybersecurity assessments processed in your browser</li>
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

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">3. INFORMATION WE COLLECT</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">3.1 Information You Provide Directly</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold">Account Information (Optional):</p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">When you create an account or subscribe to paid features, we collect:</p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                  <li><strong>Name:</strong> Your full name or preferred name</li>
                  <li><strong>Email Address:</strong> For authentication, communications, and billing</li>
                  <li><strong>Company Name and Job Title:</strong> Optional, for business context</li>
                  <li><strong>Billing Information:</strong> Processed by Stripe, Inc. (our payment processor)</li>
                  <li><strong>Password:</strong> Cryptographically hashed using bcrypt, never stored in plaintext</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">3.2 Information We Do NOT Collect</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  <strong>ERMITS explicitly does NOT collect, access, store, or transmit:</strong>
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                  <li>Security assessment responses or scores</li>
                  <li>CMMC compliance assessments or documentation</li>
                  <li>STEEL™ assessment responses or risk scores</li>
                  <li>SBOM (Software Bill of Materials) files or contents</li>
                  <li>Software component lists or dependency graphs</li>
                  <li>Vulnerability scan results or CVE findings</li>
                  <li>System Security Plans (SSPs) or Plans of Action and Milestones (POA&Ms)</li>
                  <li>CUI (Controlled Unclassified Information) or FCI (Federal Contract Information)</li>
                  <li>PHI (Protected Health Information) under HIPAA</li>
                  <li>Trade secrets or proprietary information</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 italic">
                  Due to our client-side processing model, this data is processed entirely in your browser or local environment. It never leaves your device unless you explicitly enable cloud sync with encryption. When encrypted, we cannot access or decrypt this data.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">3.3 Automatically Collected Information</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold">Pseudonymized Telemetry (Optional - Opt-In Required):</p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">With your explicit consent, we collect anonymous, aggregated performance data:</p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                  <li>Feature usage statistics (which tools are used, how often)</li>
                  <li>Performance metrics (page load times, API response times)</li>
                  <li>Error reports (crash logs, exceptions) with PII automatically scrubbed by Sentry</li>
                  <li>Browser and device information (browser type/version, OS, screen resolution)</li>
                  <li>Session metadata (session duration, navigation paths, timestamps)</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold mt-4">Privacy Protections:</p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                  <li><strong>Irreversible Pseudonymization:</strong> User identifiers are cryptographically hashed (SHA-256) and cannot be reverse-engineered</li>
                  <li><strong>No Content Data:</strong> Telemetry never includes file contents, assessment results, or user inputs</li>
                  <li><strong>Differential Privacy:</strong> PostHog analytics use differential privacy techniques to prevent individual identification</li>
                  <li><strong>Opt-Out Available:</strong> You can disable telemetry at any time in account settings with retroactive deletion</li>
                  <li><strong>Aggregate Only:</strong> Data used only in aggregate; individual user behavior cannot be identified</li>
                </ul>
              </section>

              <div className="border-t border-gray-300 dark:border-gray-600 my-8"></div>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">4. HOW WE USE INFORMATION</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">We use collected information to:</p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                  <li>Provide Services and deliver ERMITS products</li>
                  <li>Process transactions, handle subscriptions, and billing</li>
                  <li>Authenticate users and maintain account security</li>
                  <li>Enable features like cloud synchronization and multi-device access</li>
                  <li>Provide customer support and respond to inquiries</li>
                  <li>Improve service performance and reliability</li>
                  <li>Detect and prevent security threats and fraud</li>
                  <li>Comply with legal obligations and enforce agreements</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold mt-4">We do NOT:</p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                  <li>Sell or rent your personal information to third parties</li>
                  <li>Use your data for advertising or marketing to others</li>
                  <li>Share your User Data with third parties except as disclosed</li>
                  <li>Train AI models on your User Data or assessment content</li>
                  <li>Analyze your results for any purpose (we cannot access encrypted data)</li>
                  <li>Profile users for behavioral targeting or manipulation</li>
                </ul>
              </section>

              <div className="border-t border-gray-300 dark:border-gray-600 my-8"></div>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">5. INFORMATION SHARING AND DISCLOSURE</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  We share limited data with trusted third-party service providers who assist in delivering the Services. All sub-processors are contractually required to use data only for specified purposes, implement appropriate security measures, comply with applicable privacy laws, and delete data when no longer needed.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold mt-4">Service Providers:</p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                  <li><strong>Supabase, Inc.:</strong> Database and authentication</li>
                  <li><strong>Stripe, Inc.:</strong> Payment processing</li>
                  <li><strong>Sentry:</strong> Error monitoring</li>
                  <li><strong>PostHog, Inc.:</strong> Analytics (opt-in)</li>
                  <li><strong>Vercel, Inc.:</strong> Hosting and CDN</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  We may also disclose information if required by law, in response to court orders or government requests, or in connection with business transfers. When legally permitted, we will notify affected users of legal requests before disclosure.
                </p>
              </section>

              <div className="border-t border-gray-300 dark:border-gray-600 my-8"></div>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">6. DATA SECURITY MEASURES</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">We implement comprehensive security measures including:</p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                  <li><strong>Encryption:</strong> TLS 1.3 for data in transit, AES-256-GCM for data at rest</li>
                  <li><strong>Access Controls:</strong> Multi-factor authentication, role-based access control, row-level security</li>
                  <li><strong>Infrastructure Security:</strong> Enterprise-grade hosting, DDoS protection, regular security assessments</li>
                  <li><strong>Application Security:</strong> Secure coding practices, input validation, dependency management</li>
                  <li><strong>Incident Response:</strong> 24/7 monitoring, 72-hour breach notification requirement</li>
                </ul>
              </section>

              <div className="border-t border-gray-300 dark:border-gray-600 my-8"></div>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">7. DATA RETENTION</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">We retain your data for as long as your account is active or as needed to provide Services:</p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                  <li><strong>Account Information:</strong> Duration of account + 30 days after termination</li>
                  <li><strong>User-Generated Content:</strong> User-controlled (can delete anytime); deleted 30 days after account termination</li>
                  <li><strong>Encrypted Cloud Data:</strong> User-controlled; deleted 30 days after account termination</li>
                  <li><strong>Support Communications:</strong> 3 years after last interaction</li>
                  <li><strong>Server Logs:</strong> 90 days, then automatically deleted</li>
                  <li><strong>Pseudonymized Telemetry:</strong> Indefinite (anonymous, cannot be deleted or linked to individuals)</li>
                </ul>
              </section>

              <div className="border-t border-gray-300 dark:border-gray-600 my-8"></div>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">8. YOUR PRIVACY RIGHTS</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold">Universal Rights (All Users):</p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                  <li><strong>Right to Access:</strong> Request a copy of all personal data we hold about you</li>
                  <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete personal data</li>
                  <li><strong>Right to Deletion:</strong> Request deletion of your personal data</li>
                  <li><strong>Right to Data Portability:</strong> Export your data in machine-readable formats</li>
                  <li><strong>Right to Restriction of Processing:</strong> Request limitation of processing</li>
                  <li><strong>Right to Object:</strong> Object to processing based on legitimate interests</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold mt-4">Additional Rights for EU/UK/Swiss Users (GDPR):</p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                  <li>Right to withdraw consent at any time</li>
                  <li>Right to lodge a complaint with your local data protection authority</li>
                  <li>Right to data protection impact assessment information</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold mt-4">Additional Rights for California Residents (CCPA/CPRA):</p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                  <li>Right to know what personal information is collected</li>
                  <li>Right to delete personal information</li>
                  <li>Right to opt-out of sale (ERMITS does not sell personal information)</li>
                  <li>Right to correct inaccurate information</li>
                  <li>Right to non-discrimination</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3 mt-4">
                  To exercise your rights, contact us at <a href="mailto:privacy@ermits.com" className="text-command-blue-600 dark:text-command-blue-400 hover:underline">privacy@ermits.com</a> or use the online form at www.ermits.com/privacy-request
                </p>
              </section>

              <div className="border-t border-gray-300 dark:border-gray-600 my-8"></div>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">9. INTERNATIONAL DATA TRANSFERS</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  ERMITS is based in the United States. If you access Services from outside the U.S., your data may be transferred to, stored, and processed in the United States or other countries where our service providers operate.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  For data transfers from the EEA, UK, or Switzerland to the United States, we use European Commission-approved Standard Contractual Clauses (SCCs) and implement additional safeguards including encryption, access controls, and regular security assessments.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  EU data residency options are available. Enterprise customers can deploy to their own cloud infrastructure or on-premises for complete data sovereignty.
                </p>
              </section>

              <div className="border-t border-gray-300 dark:border-gray-600 my-8"></div>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">10. CHILDREN'S PRIVACY</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  <strong>The Services are not intended for children under 18 years of age.</strong> We do not knowingly collect personal information from children under 18. If we learn that we have collected personal information from a child under 18 without verified parental consent, we will delete the information as quickly as possible.
                </p>
              </section>

              <div className="border-t border-gray-300 dark:border-gray-600 my-8"></div>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">11. UPDATES TO THIS PRIVACY POLICY</h2>
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
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">12. CONTACT INFORMATION</h2>
                <div className="space-y-3 text-gray-700 dark:text-gray-300">
                  <p><strong>General Privacy Questions:</strong><br />
                  Email: <a href="mailto:privacy@ermits.com" className="text-command-blue-600 dark:text-command-blue-400 hover:underline">privacy@ermits.com</a><br />
                  Subject: "Privacy Inquiry"</p>
                  
                  <p><strong>Data Rights Requests:</strong><br />
                  Email: <a href="mailto:privacy@ermits.com" className="text-command-blue-600 dark:text-command-blue-400 hover:underline">privacy@ermits.com</a><br />
                  Subject: "Privacy Rights Request - [Type]"<br />
                  Online Form: <a href="https://www.ermits.com/privacy-request" target="_blank" rel="noopener noreferrer" className="text-command-blue-600 dark:text-command-blue-400 hover:underline">www.ermits.com/privacy-request</a></p>
                  
                  <p><strong>Data Protection Officer (EU/UK/Swiss):</strong><br />
                  Email: <a href="mailto:privacy@ermits.com" className="text-command-blue-600 dark:text-command-blue-400 hover:underline">privacy@ermits.com</a><br />
                  Subject: "GDPR Inquiry - DPO"</p>
                  
                  <p><strong>California Privacy Requests (CCPA/CPRA):</strong><br />
                  Email: <a href="mailto:privacy@ermits.com" className="text-command-blue-600 dark:text-command-blue-400 hover:underline">privacy@ermits.com</a><br />
                  Subject: "CCPA Request"</p>
                </div>
              </section>

              <div className="border-t border-gray-300 dark:border-gray-600 my-8"></div>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">13. EFFECTIVE DATE AND ACCEPTANCE</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  <strong>Effective Date:</strong> November 19, 2025<br />
                  <strong>Last Updated:</strong> October 31, 2025
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  <strong>By using ERMITS Services, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy.</strong>
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  If you do not agree with this Privacy Policy, you must discontinue use of all ERMITS Services immediately.
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
