import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Cookie } from 'lucide-react';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';

export const CookiePolicy: React.FC = () => {
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
                <Cookie className="h-6 w-6 text-command-blue-600 dark:text-command-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  COOKIE POLICY
                </h1>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  <p><strong>Effective Date:</strong> October 31, 2025</p>
                  <p><strong>Last Updated:</strong> December 13, 2025</p>
                </div>
              </div>
            </div>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                This Cookie Policy explains how ERMITS LLC ("ERMITS," "we," "our," or "us") uses cookies and similar technologies when you use our Services. This policy should be read in conjunction with our Privacy Policy.
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">1 What Are Cookies?</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">1.1 Definition</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Cookies are small text files stored on your device (computer, tablet, smartphone) when you visit websites or use applications. Cookies enable websites to remember your actions and preferences over time.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">1.2 Similar Technologies</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">This policy also covers similar technologies including:</p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                  <li><strong>Local Storage:</strong> Browser-based storage (localStorage, IndexedDB)</li>
                  <li><strong>Session Storage:</strong> Temporary storage cleared when browser closes</li>
                  <li><strong>Web Beacons (Pixels):</strong> Small graphics that track page views</li>
                  <li><strong>SDKs:</strong> Software development kits for mobile applications</li>
                  <li><strong>Fingerprinting:</strong> Device and browser characteristic collection</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">2 How We Use Cookies</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">2.1 Cookie Categories</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">We use the following categories of cookies:</p>
                
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold mt-4">Essential Cookies (Always Active):</p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">Required for basic service functionality:</p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                  <li>Authentication and session management</li>
                  <li>Security and fraud prevention</li>
                  <li>Load balancing and performance</li>
                  <li>User preference storage (language, theme)</li>
                </ul>

                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold mt-4">Performance Cookies (Optional):</p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">Help us improve service performance:</p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                  <li>Page load time measurement</li>
                  <li>Error tracking and debugging (Sentry)</li>
                  <li>Feature usage analytics</li>
                  <li>Service optimization</li>
                </ul>

                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold mt-4">Analytics Cookies (Optional):</p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">Help us understand how Services are used:</p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                  <li>User behavior patterns (PostHog with differential privacy)</li>
                  <li>Popular features and pages</li>
                  <li>User journey analysis</li>
                  <li>Conversion tracking</li>
                </ul>

                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold mt-4">Functional Cookies (Optional):</p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">Enable enhanced functionality:</p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                  <li>Remember settings and preferences</li>
                  <li>Personalize user experience</li>
                  <li>Enable integrations with third-party services</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">3 Specific Cookies We Use</h2>
                <div className="overflow-x-auto mb-4">
                  <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-gray-700">
                        <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left font-semibold text-gray-900 dark:text-white">Cookie Name</th>
                        <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left font-semibold text-gray-900 dark:text-white">Provider</th>
                        <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left font-semibold text-gray-900 dark:text-white">Purpose</th>
                        <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left font-semibold text-gray-900 dark:text-white">Type</th>
                        <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left font-semibold text-gray-900 dark:text-white">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-700 dark:text-gray-300">
                      <tr>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2"><strong>sb-access-token</strong></td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Supabase</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Authentication</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Essential</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">1 hour</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2"><strong>sb-refresh-token</strong></td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Supabase</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Session renewal</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Essential</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">30 days</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2"><strong>theme</strong></td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">ERMITS</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">UI theme preference (light/dark)</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Functional</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">1 year</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2"><strong>language</strong></td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">ERMITS</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Language preference</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Functional</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">1 year</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2"><strong>consent</strong></td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">ERMITS</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Cookie consent preferences</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Essential</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">1 year</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2"><strong>phc_***</strong></td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">PostHog</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Anonymous analytics</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Analytics</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">1 year</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2"><strong>sentry-session</strong></td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Sentry</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Error tracking session</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Performance</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Session</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 text-sm italic">
                  <strong>Note:</strong> Cookie names and specifics may change. This table represents typical cookies; actual implementation may vary by product.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">4 Third-Party Cookies</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">4.1 Third-Party Service Providers</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">We use third-party services that may set cookies:</p>
                
                <div className="space-y-4 mb-4">
                  <div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold">Supabase (Authentication & Database):</p>
                    <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                      <li>Purpose: User authentication and session management</li>
                      <li>Privacy: Essential for service functionality</li>
                      <li>Control: Required for service use; cannot be disabled</li>
                      <li>More info: <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-command-blue-600 dark:text-command-blue-400 hover:underline">https://supabase.com/privacy</a></li>
                    </ul>
                  </div>

                  <div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold">Sentry (Error Tracking):</p>
                    <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                      <li>Purpose: Monitor application errors and performance</li>
                      <li>Privacy: Automatically scrubs PII from error reports</li>
                      <li>Control: Can be disabled in privacy settings</li>
                      <li>More info: <a href="https://sentry.io/privacy/" target="_blank" rel="noopener noreferrer" className="text-command-blue-600 dark:text-command-blue-400 hover:underline">https://sentry.io/privacy/</a></li>
                    </ul>
                  </div>

                  <div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold">PostHog (Analytics):</p>
                    <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                      <li>Purpose: Anonymous usage analytics with differential privacy</li>
                      <li>Privacy: Cannot identify individual users</li>
                      <li>Control: Can be disabled in privacy settings (opt-out)</li>
                      <li>More info: <a href="https://posthog.com/privacy" target="_blank" rel="noopener noreferrer" className="text-command-blue-600 dark:text-command-blue-400 hover:underline">https://posthog.com/privacy</a></li>
                    </ul>
                  </div>

                  <div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold">Stripe (Payment Processing):</p>
                    <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                      <li>Purpose: Payment processing and fraud prevention</li>
                      <li>Privacy: Handles payment information securely</li>
                      <li>Control: Required for payment functionality</li>
                      <li>More info: <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-command-blue-600 dark:text-command-blue-400 hover:underline">https://stripe.com/privacy</a></li>
                    </ul>
                  </div>

                  <div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold">Vercel (Hosting & CDN):</p>
                    <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                      <li>Purpose: Content delivery and performance optimization</li>
                      <li>Privacy: Standard web server logs</li>
                      <li>Control: Required for service delivery</li>
                      <li>More info: <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-command-blue-600 dark:text-command-blue-400 hover:underline">https://vercel.com/legal/privacy-policy</a></li>
                    </ul>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">4.2 Third-Party Privacy</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  ERMITS is not responsible for third-party cookie practices. We encourage you to review third-party privacy policies. We contractually require third parties to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                  <li>Use data only for specified purposes</li>
                  <li>Comply with applicable privacy laws</li>
                  <li>Implement appropriate security measures</li>
                  <li>Respect user privacy choices</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">5 Cookies and Privacy-First Architecture</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">5.1 Minimal Cookie Use</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">Due to Privacy-First Architecture:</p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                  <li><strong>No tracking cookies</strong> for advertising or marketing</li>
                  <li><strong>No cross-site tracking</strong> or profiling</li>
                  <li><strong>Minimal essential cookies</strong> only for functionality</li>
                  <li><strong>Local processing</strong> reduces need for server-side cookies</li>
                  <li><strong>Pseudonymized analytics</strong> cannot identify individual users</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">5.2 Data Minimization</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">Cookies are designed to collect minimum data necessary:</p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                  <li><strong>No PII in cookies</strong> (names, emails, addresses not stored in cookies)</li>
                  <li><strong>Session tokens only</strong> for authentication</li>
                  <li><strong>Hashed identifiers</strong> for analytics (cannot be reverse-engineered)</li>
                  <li><strong>No sensitive data</strong> in cookies (passwords, financial info, CUI/FCI)</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">6 Your Cookie Choices</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">6.1 Cookie Consent</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">When you first visit ERMITS Services:</p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                  <li><strong>Cookie Banner:</strong> You'll see a cookie consent banner</li>
                  <li><strong>Granular Control:</strong> Choose which cookie categories to accept</li>
                  <li><strong>Default Settings:</strong> Only essential cookies enabled by default</li>
                  <li><strong>Change Anytime:</strong> Update preferences in Account Settings</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">6.2 Managing Cookie Preferences</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold">Within ERMITS Services:</p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                  <li>Navigate to Account Settings → Privacy → Cookie Preferences</li>
                  <li>Toggle categories on/off (except essential cookies)</li>
                  <li>Save preferences (stored in essential consent cookie)</li>
                </ul>

                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold mt-4">Browser Controls:</p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">Most browsers allow cookie management:</p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                  <li><strong>Block all cookies:</strong> May prevent service functionality</li>
                  <li><strong>Block third-party cookies:</strong> Reduces tracking</li>
                  <li><strong>Delete cookies:</strong> Clear existing cookies</li>
                  <li><strong>Incognito/Private mode:</strong> Cookies deleted when browser closes</li>
                </ul>

                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold mt-4">Browser-Specific Instructions:</p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                  <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies</li>
                  <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</li>
                  <li><strong>Safari:</strong> Preferences → Privacy → Cookies and Website Data</li>
                  <li><strong>Edge:</strong> Settings → Privacy, Search, and Services → Cookies</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">6.3 Opt-Out Tools</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold">Analytics Opt-Out:</p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                  <li>Disable analytics cookies in Account Settings</li>
                  <li>Use browser Do Not Track (DNT) signal (we honor DNT)</li>
                  <li>PostHog opt-out: <a href="https://posthog.com/opt-out" target="_blank" rel="noopener noreferrer" className="text-command-blue-600 dark:text-command-blue-400 hover:underline">https://posthog.com/opt-out</a></li>
                </ul>

                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold mt-4">Error Tracking Opt-Out:</p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                  <li>Disable performance cookies in Account Settings</li>
                  <li>Sentry respects privacy settings</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">7 Do Not Track (DNT)</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">7.1 DNT Support</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">ERMITS respects browser Do Not Track signals:</p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                  <li><strong>DNT Enabled:</strong> We disable optional analytics and performance cookies</li>
                  <li><strong>Essential Cookies Only:</strong> Authentication and security cookies remain active</li>
                  <li><strong>No Tracking:</strong> No behavioral tracking when DNT is enabled</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">7.2 Enabling DNT</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">To enable Do Not Track in your browser:</p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                  <li><strong>Chrome:</strong> Not supported (use cookie controls instead)</li>
                  <li><strong>Firefox:</strong> Settings → Privacy & Security → Send websites a "Do Not Track" signal</li>
                  <li><strong>Safari:</strong> Preferences → Privacy → Website Tracking → Prevent cross-site tracking</li>
                  <li><strong>Edge:</strong> Settings → Privacy, Search, and Services → Send "Do Not Track" requests</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">8 Cookies and International Privacy Laws</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">8.1 GDPR Compliance (EU/UK/Swiss)</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">For users in the European Economic Area, United Kingdom, or Switzerland:</p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                  <li><strong>Consent Required:</strong> We obtain consent before setting non-essential cookies</li>
                  <li><strong>Granular Control:</strong> You can accept/reject specific cookie categories</li>
                  <li><strong>Easy Withdrawal:</strong> Withdraw consent anytime in Account Settings</li>
                  <li><strong>Pre-Checked Boxes Prohibited:</strong> Cookie preferences start with only essential cookies enabled</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">8.2 CCPA Compliance (California)</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">For California residents:</p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                  <li><strong>No Sale of Data:</strong> We do not sell personal information collected via cookies</li>
                  <li><strong>Opt-Out Rights:</strong> You can disable optional cookies anytime</li>
                  <li><strong>Disclosure:</strong> This policy discloses all cookies used</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">9 Cookies and Security</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">9.1 Secure Cookie Practices</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">ERMITS implements secure cookie handling:</p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                  <li><strong>Secure Flag:</strong> Cookies transmitted only over HTTPS</li>
                  <li><strong>HttpOnly Flag:</strong> Cookies inaccessible to JavaScript (prevents XSS attacks)</li>
                  <li><strong>SameSite Attribute:</strong> Cookies sent only to same-site requests (prevents CSRF)</li>
                  <li><strong>Encrypted Values:</strong> Sensitive cookie values are encrypted</li>
                  <li><strong>Short Expiration:</strong> Session cookies expire quickly</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">10 Updates to This Cookie Policy</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">10.1 Policy Changes</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">We may update this Cookie Policy to reflect:</p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                  <li>New cookies or technologies</li>
                  <li>Changes in legal requirements</li>
                  <li>Service updates or new features</li>
                  <li>User feedback</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">10.2 Notification</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold">Material Changes:</p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                  <li>30 days' advance notice via email</li>
                  <li>Updated cookie consent banner on first visit</li>
                  <li>Opportunity to review and adjust preferences</li>
                </ul>

                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 font-semibold mt-4">Non-Material Changes:</p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                  <li>Update "Last Updated" date</li>
                  <li>Effective immediately upon posting</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">11 Contact Information</h2>
                <div className="space-y-3 text-gray-700 dark:text-gray-300">
                  <p><strong>Cookie Policy Questions:</strong><br />
                  Email: contact@ermits.com<br />
                  Subject: "Cookie Policy Inquiry"</p>
                  
                  <p><strong>Cookie Preferences:</strong><br />
                  Account Settings → Privacy → Cookie Preferences</p>
                  
                  <p><strong>Data Protection Officer (EU/UK/Swiss):</strong><br />
                  Email: contact@ermits.com<br />
                  Subject: "Cookie GDPR Inquiry"</p>
                  
                  <p><strong>Technical Support:</strong><br />
                  Email: contact@ermits.com</p>
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
