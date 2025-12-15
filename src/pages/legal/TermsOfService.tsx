import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';

export const TermsOfService: React.FC = () => {
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
                <FileText className="h-6 w-6 text-command-blue-600 dark:text-command-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  MASTER TERMS OF SERVICE
                </h1>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  <p><strong>Effective Date:</strong> November 19, 2025</p>
                  <p><strong>Last Updated:</strong> December 13, 2025</p>
                </div>
              </div>
            </div>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                By accessing or using any ERMITS LLC ("ERMITS," "we," "our," or "us") products, platforms, or services (collectively, the "Services"), you ("User," "you," or "your") agree to be bound by these Master Terms of Service ("Terms"). If you do not agree to these Terms, do not use our Services.
              </p>

              <div className="border-t border-gray-300 dark:border-gray-600 my-8"></div>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">1 Scope and Applicability</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">These Terms govern your use of all ERMITS products, including but not limited to:</p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                  <li><strong>TechnoSoluce™:</strong> SBOM Analyzer - Software supply chain security and vulnerability analysis</li>
                  <li><strong>CyberSoluce™:</strong> Enhanced Asset Inventory Management Platform - Dependency-aware asset visibility and management, focus signals for attention areas, service funneling guidance</li>
                  <li><strong>CyberCertitude™:</strong> CMMC 2.0 Level 1 & Level 2 Compliance Platforms, Original Toolkit</li>
                  <li><strong>VendorSoluce™:</strong> Supply Chain Risk Management Platform</li>
                  <li><strong>CyberCorrect™:</strong> Privacy Portal and Privacy Platform</li>
                  <li><strong>CyberCaution™:</strong> RansomCheck, Security Toolkit, RiskProfessional</li>
                  <li><strong>SocialCaution:</strong> Personalized Privacy Platform with AI-powered persona detection</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Product-specific terms may apply as set forth in Product-Specific Addendums.
                </p>
              </section>

              <div className="border-t border-gray-300 dark:border-gray-600 my-8"></div>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">2 Definitions</h2>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                  <li><strong>"Privacy-First Architecture"</strong> means ERMITS' system design philosophy ensuring that user data is processed locally whenever possible, with optional encrypted cloud synchronization, pseudonymized telemetry, and zero-knowledge data handling principles.</li>
                  <li><strong>"User Data"</strong> means any information, content, files, or materials that you upload, submit, generate, or process through the Services.</li>
                  <li><strong>"Controlled Unclassified Information" or "CUI"</strong> means information that requires safeguarding or dissemination controls pursuant to federal law, regulations, or government-wide policies.</li>
                  <li><strong>"Federal Contract Information" or "FCI"</strong> means information not intended for public release that is provided by or generated for the U.S. Government under a contract.</li>
                  <li><strong>"Beta Products"</strong> means Services explicitly marked as "Beta," "Preview," "Early Access," or similar designations indicating pre-release or testing status.</li>
                  <li><strong>"Privacy Persona"</strong> means the AI-determined privacy profile classification assigned by SocialCaution based on user assessment responses, used to personalize privacy recommendations and resources.</li>
                  <li><strong>"Privacy Exposure Index"</strong> means SocialCaution's quantified privacy risk score (0-100) for online services based on publicly available data, privacy policies, and service characteristics.</li>
                </ul>
              </section>

              <div className="border-t border-gray-300 dark:border-gray-600 my-8"></div>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">3 Eligibility and Account Requirements</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold">Age Requirement:</p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  You must be at least 18 years of age to use the Services. By using the Services, you represent and warrant that you meet this age requirement.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold">Account Security:</p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">You are responsible for:</p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                  <li>Maintaining the confidentiality of your account credentials</li>
                  <li>All activities that occur under your account</li>
                  <li>Notifying ERMITS immediately of any unauthorized access or security breach</li>
                  <li>Using strong, unique passwords and enabling multi-factor authentication where available</li>
                </ul>
              </section>

              <div className="border-t border-gray-300 dark:border-gray-600 my-8"></div>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">4 Privacy-First Architecture and Data Handling</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  ERMITS implements a Privacy-First Architecture across all products, built on the following principles:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                  <li><strong>Client-Side Processing:</strong> All core computational functions are performed locally within your browser or self-managed environment whenever technically feasible</li>
                  <li><strong>Data Sovereignty Options:</strong> You choose where your data resides - local storage, self-managed cloud, ERMITS-managed cloud, or on-premises</li>
                  <li><strong>Zero-Knowledge Principles:</strong> When using ERMITS-managed cloud services with encryption enabled, data is encrypted client-side and ERMITS cannot decrypt your data</li>
                  <li><strong>Data Minimization:</strong> ERMITS collects only the minimum data necessary for service functionality</li>
                </ul>
              </section>

              <div className="border-t border-gray-300 dark:border-gray-600 my-8"></div>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">5 License Grant and Restrictions</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  Subject to your compliance with these Terms, ERMITS grants you a limited, non-exclusive, non-transferable, revocable license to access and use the Services for your internal business or personal purposes.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold mt-4">You may not:</p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                  <li>Modify, copy, distribute, transmit, display, perform, reproduce, publish, license, create derivative works from, transfer, or sell any information, software, products, or services obtained from the Services</li>
                  <li>Reverse engineer, decompile, disassemble, or attempt to discover source code or underlying algorithms (except to the extent such restriction is prohibited by applicable law)</li>
                  <li>Remove, obscure, or alter any proprietary rights notices</li>
                  <li>Use the Services to develop competing products or services</li>
                  <li>Access the Services through automated means (bots, scrapers) without prior written authorization</li>
                  <li>Attempt to circumvent security measures or gain unauthorized access</li>
                  <li>Use the Services in any way that violates applicable laws or regulations</li>
                </ul>
              </section>

              <div className="border-t border-gray-300 dark:border-gray-600 my-8"></div>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">6 User Data Ownership and Responsibilities</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  You retain all ownership rights in your User Data. ERMITS does not claim any ownership or intellectual property rights in your User Data.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold mt-4">You are solely responsible for:</p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                  <li>The accuracy, quality, and legality of your User Data</li>
                  <li>The means by which you acquired User Data</li>
                  <li>Compliance with all applicable laws regarding User Data processing</li>
                  <li>Maintaining appropriate security controls for your User Data</li>
                  <li>Backup and disaster recovery of locally-stored data</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold mt-4">Prohibited Data:</p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">You may not upload, transmit, or process through the Services:</p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                  <li>Malware, viruses, or malicious code</li>
                  <li>Content that infringes intellectual property rights</li>
                  <li>Illegally obtained data or trade secrets</li>
                  <li>Personal data of minors without appropriate consent</li>
                  <li>Data in violation of applicable export control laws</li>
                </ul>
              </section>

              <div className="border-t border-gray-300 dark:border-gray-600 my-8"></div>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">7 Intellectual Property Rights</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  All intellectual property rights in the Services, including but not limited to software, algorithms, user interfaces, documentation, trademarks, and branding, are owned by ERMITS LLC or its licensors. No ownership rights are transferred to you under these Terms.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  TechnoSoluce™, CyberSoluce™, CyberCertitude™, VendorSoluce™, CyberCorrect™, CyberCaution™, SocialCaution™, and all associated logos and branding are trademarks of ERMITS LLC. You may not use these trademarks without ERMITS' prior written consent.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  Reports, assessments, and other outputs generated by the Services using your User Data remain your property. ERMITS does not claim ownership of such outputs.
                </p>
              </section>

              <div className="border-t border-gray-300 dark:border-gray-600 my-8"></div>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">8 Payment Terms</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold">Pricing and Billing:</p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                  <li>Pricing for Services is set forth on the ERMITS website or in your subscription agreement</li>
                  <li>All fees are in U.S. Dollars unless otherwise specified</li>
                  <li>Fees are non-refundable except as expressly provided in the Refund & Cancellation Policy</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold mt-4">Payment Processing:</p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                  <li>Payments are processed through Stripe, Inc. (primary) or Gumroad (digital products)</li>
                  <li>You authorize ERMITS to charge your designated payment method</li>
                  <li>You must provide accurate, current payment information</li>
                  <li>You are responsible for all applicable taxes</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold mt-4">Subscription Terms:</p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                  <li>Subscriptions automatically renew unless cancelled</li>
                  <li>Renewal pricing may change with 30 days' notice</li>
                  <li>Downgrades take effect at the next billing cycle</li>
                  <li>Cancellations must be submitted before renewal date</li>
                </ul>
              </section>

              <div className="border-t border-gray-300 dark:border-gray-600 my-8"></div>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">9 Term and Termination</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  These Terms remain in effect for as long as you access or use the Services.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold mt-4">Termination by You:</p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">You may terminate your account at any time through:</p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                  <li>Account settings within the Services</li>
                  <li>Contacting ERMITS support at contact@ermits.com</li>
                  <li>Following product-specific cancellation procedures</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold mt-4">Termination by ERMITS:</p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">ERMITS may suspend or terminate your access immediately without notice if:</p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                  <li>You breach these Terms or any applicable policies</li>
                  <li>Your account is inactive for 12+ months (free accounts)</li>
                  <li>Your payment method fails or account is delinquent</li>
                  <li>Required by law or regulatory authority</li>
                  <li>Necessary to protect ERMITS or other users</li>
                </ul>
              </section>

              <div className="border-t border-gray-300 dark:border-gray-600 my-8"></div>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">10 Warranties and Disclaimers</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold">Limited Warranty:</p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  ERMITS warrants that the Services will perform substantially in accordance with published documentation under normal use. This warranty does not apply to Beta Products, free tiers, issues caused by user error, third-party services, or force majeure events.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold mt-4">Disclaimer of Warranties:</p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  EXCEPT AS EXPRESSLY PROVIDED ABOVE, THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                  <li>No warranty that Services will meet your specific requirements</li>
                  <li>No guarantee of continuous, error-free operation</li>
                  <li>No guarantee that Services are completely secure or error-free</li>
                  <li>No warranty regarding accuracy, completeness, or reliability of outputs</li>
                  <li>No guarantee that use of Services will result in regulatory compliance or certification</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold mt-4">Compliance Disclaimer:</p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  ERMITS products and services are tools to assist with security and compliance efforts but do not guarantee compliance with any regulatory framework, do not constitute legal, compliance, or professional consulting advice, and do not replace qualified security assessments or professional audits.
                </p>
              </section>

              <div className="border-t border-gray-300 dark:border-gray-600 my-8"></div>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">11 Limitation of Liability</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL ERMITS LLC, ITS AFFILIATES, OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, OR LICENSORS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, REVENUE, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  ERMITS' TOTAL AGGREGATE LIABILITY ARISING OUT OF OR RELATED TO THESE TERMS OR USE OF THE SERVICES SHALL NOT EXCEED THE GREATER OF $100 USD OR THE TOTAL AMOUNT PAID BY YOU TO ERMITS IN THE 12 MONTHS PRECEDING THE CLAIM.
                </p>
              </section>

              <div className="border-t border-gray-300 dark:border-gray-600 my-8"></div>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">12 Indemnification</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  You agree to indemnify, defend, and hold harmless ERMITS LLC, its affiliates, and their respective officers, directors, employees, agents, and licensors from and against any claims, liabilities, damages, losses, costs, and expenses (including reasonable attorneys' fees) arising out of or related to your use or misuse of the Services, your User Data, your violation of these Terms or applicable laws, or your violation of third-party rights.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  ERMITS agrees to indemnify, defend, and hold you harmless from third-party claims alleging that the Services infringe a valid U.S. patent, copyright, or trademark, provided that you promptly notify ERMITS, grant ERMITS sole control of defense and settlement, and reasonably cooperate with ERMITS in the defense.
                </p>
              </section>

              <div className="border-t border-gray-300 dark:border-gray-600 my-8"></div>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">13 Governing Law and Dispute Resolution</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold">Governing Law:</p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  These Terms are governed by and construed in accordance with the laws of the District of Columbia, United States, without regard to conflict of law principles.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold mt-4">Binding Arbitration:</p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  Any dispute, controversy, or claim arising out of or relating to these Terms shall be resolved by binding arbitration administered by the American Arbitration Association (AAA) under its Commercial Arbitration Rules. Arbitration shall be conducted in Washington, D.C. by a single arbitrator applying District of Columbia law.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  YOU AND ERMITS AGREE THAT DISPUTES MUST BE BROUGHT ON AN INDIVIDUAL BASIS ONLY, AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS, REPRESENTATIVE, OR COLLECTIVE PROCEEDING. CLASS ARBITRATIONS, CLASS ACTIONS, AND REPRESENTATIVE ACTIONS ARE NOT PERMITTED.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  You may opt out of the arbitration provision by sending written notice to ERMITS at legal@ermits.com within 30 days of first accepting these Terms.
                </p>
              </section>

              <div className="border-t border-gray-300 dark:border-gray-600 my-8"></div>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">14 Contact Information</h2>
                <div className="space-y-3 text-gray-700 dark:text-gray-300">
                  <p><strong>For questions, concerns, or notices regarding these Terms:</strong><br />
                  ERMITS LLC<br />
                  Email: <a href="mailto:contact@ermits.com" className="text-command-blue-600 dark:text-command-blue-400 hover:underline">contact@ermits.com</a><br />
                  Website: <a href="https://www.ermits.com" target="_blank" rel="noopener noreferrer" className="text-command-blue-600 dark:text-command-blue-400 hover:underline">www.ermits.com</a></p>
                  
                  <p><strong>For technical support inquiries:</strong><br />
                  Email: <a href="mailto:contact@ermits.com" className="text-command-blue-600 dark:text-command-blue-400 hover:underline">contact@ermits.com</a></p>
                  
                  <p><strong>For privacy inquiries:</strong><br />
                  Email: <a href="mailto:privacy@ermits.com" className="text-command-blue-600 dark:text-command-blue-400 hover:underline">privacy@ermits.com</a></p>
                  
                  <p><strong>For compliance and legal inquiries:</strong><br />
                  Email: <a href="mailto:legal@ermits.com" className="text-command-blue-600 dark:text-command-blue-400 hover:underline">legal@ermits.com</a></p>
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
