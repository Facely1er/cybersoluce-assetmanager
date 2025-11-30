import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, CheckCircle, FileText, Clock, 
  DollarSign, Target, Zap, Settings,
  Activity, CheckSquare, Download,
  Briefcase, Lock
} from 'lucide-react';
import { ONE_TIME_PRODUCTS, getOneTimeCheckoutConfig } from '../config/stripe';
import { stripeClient } from '../lib/stripe';

const VcisoStarterKit: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'workflow' | 'templates'>('overview');
  const [loading, setLoading] = useState(false);
  const [workflowStep, setWorkflowStep] = useState(0);
  
  // Governance positioning statement
  const governanceStatement = "These artifacts support governance execution following a STEEL-validated decision.";

  const handlePurchase = async () => {
    try {
      setLoading(true);
      const config = getOneTimeCheckoutConfig('vcisoStarterKit');
      const { url } = await stripeClient.createCheckoutSession({
        priceId: ONE_TIME_PRODUCTS.vcisoStarterKit.priceId,
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

  const workflowSteps = [
    {
      title: 'Discovery & Proposal',
      duration: 'Week -2 to -1',
      activities: [
        'Initial discovery call (60 min)',
        'Current state assessment',
        'Needs analysis',
        'Tier recommendation',
        'Proposal development',
        'Proposal presentation'
      ],
      deliverables: ['Discovery notes', 'Proposal document', 'Service agreement']
    },
    {
      title: 'Contract & Kickoff',
      duration: 'Week 0-1',
      activities: [
        'Contract execution',
        'ERMITS platform provisioning',
        'Client workspace setup',
        'Kickoff meeting (90-120 min)',
        'Stakeholder introductions',
        'Communication setup'
      ],
      deliverables: ['Signed contract', 'Kickoff notes', '30/60/90 roadmap', 'Platform access']
    },
    {
      title: 'Initial Assessment',
      duration: 'Weeks 1-4',
      activities: [
        'Stakeholder interviews',
        'Documentation review',
        'STEEL assessment',
        'Gap analysis',
        'Platform deployment',
        'User training'
      ],
      deliverables: ['30-day assessment report', 'STEEL score baseline', 'Gap analysis', '90-day roadmap']
    },
    {
      title: 'Ongoing Delivery',
      duration: 'Month 2+',
      activities: [
        'Monthly executive briefings',
        'Weekly team meetings (Operational/Executive)',
        'Platform optimization',
        'Strategic initiatives',
        'Quarterly business reviews',
        'Continuous improvement'
      ],
      deliverables: ['Monthly reports', 'Quarterly board presentations', 'Platform analytics', 'Progress metrics']
    }
  ];

  const templates = [
    {
      category: 'Security Policies (10 Documents)',
      items: [
        { name: 'Information Security Policy', description: 'Foundational security governance and risk management framework' },
        { name: 'Access Control Policy', description: 'Role-based access control (RBAC) and privileged access management' },
        { name: 'Data Protection & Privacy Policy', description: 'GDPR/CCPA compliance and personal data handling' },
        { name: 'Incident Response Policy', description: 'Detection procedures, severity classifications, and response team roles' },
        { name: 'Business Continuity & Disaster Recovery', description: 'RTO/RPO definitions and test validation schedules' },
        { name: 'Acceptable Use Policy', description: 'Authorized usage guidelines and prohibited activities' },
        { name: 'Password Management Policy', description: 'Complexity requirements, rotation schedules, and MFA' },
        { name: 'Remote Access Security Policy', description: 'VPN requirements and device security standards' },
        { name: 'Third-Party Risk Management', description: 'Vendor assessment criteria and continuous monitoring' },
        { name: 'Vendor Management Policy', description: 'Procurement security requirements and SLAs' }
      ]
    },
    {
      category: 'Incident Response Playbooks (5 Documents)',
      items: [
        { name: 'Ransomware Response Playbook', description: 'Detection indicators, containment procedures, and recovery strategies' },
        { name: 'Data Breach Response Playbook', description: 'Investigation procedures, evidence preservation, and regulatory notifications' },
        { name: 'Credential Compromise Response', description: 'Identification procedures, password reset protocols, and MFA enforcement' },
        { name: 'Malware Outbreak Response', description: 'Detection procedures, isolation protocols, and eradication steps' },
        { name: 'Insider Threat Response', description: 'Suspicious activity indicators and investigation protocols' }
      ]
    },
    {
      category: 'Board Materials (4 Documents)',
      items: [
        { name: 'Monthly Security Executive Summary', description: 'Key metrics dashboard, incidents, compliance status, and budget tracking' },
        { name: 'Quarterly Board Briefing Presentation', description: 'Strategic risk overview, financial impact analysis, and ROI recommendations' },
        { name: 'Annual Risk Assessment Report', description: 'Enterprise-wide risk profile, trend analysis, and forward-looking recommendations' },
        { name: 'Crisis Communication Template', description: 'Stakeholder notification, media response framework, and executive talking points' }
      ]
    },
    {
      category: 'Compliance Checklists (8 Documents)',
      items: [
        { name: 'SOC 2 Type II Audit Checklist', description: 'Control categories, evidence requirements, and testing procedures' },
        { name: 'ISO 27001 Implementation Checklist', description: '114 control requirements and implementation status tracking' },
        { name: 'NIST Cybersecurity Framework Assessment', description: 'Function mapping and current state assessment' },
        { name: 'GDPR Compliance Checklist', description: 'Article-by-article requirements and data processing agreements' },
        { name: 'Vendor Security Assessment Form', description: 'Technical security questions, compliance certifications, and risk scoring' },
        { name: 'Security Awareness Training Tracker', description: 'Training attendance log, completion percentages, and phishing results' },
        { name: 'Penetration Testing Request for Proposal', description: 'Scope definition, deliverables specification, and budget guidelines' },
        { name: 'Annual Security Roadmap Template', description: 'Strategic initiatives, timeline, dependencies, and success metrics' }
      ]
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
          <div className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6">
            <span className="text-blue-700 dark:text-blue-300 font-semibold">Interactive vCISO Toolkit</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
            Governance Enablement Kit (vCISO Edition)
          </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-4">
                Self-service toolkit with 27 professional templates, playbooks, and delivery guides for vCISO practitioners
              </p>
              <p className="text-md text-blue-600 dark:text-blue-400 max-w-2xl mx-auto mb-8 font-medium italic">
                {governanceStatement}
              </p>
          
          {/* Price Badge */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="text-4xl font-bold text-gray-900 dark:text-white">$299</div>
            <div className="text-gray-600 dark:text-gray-400">One-time purchase</div>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {[
              { id: 'overview', label: 'Overview', icon: Briefcase },
              { id: 'templates', label: 'Template Library', icon: FileText },
              { id: 'workflow', label: 'Delivery Guides', icon: Activity }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'overview' | 'workflow' | 'templates')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Overview Tab */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                {[
                  { value: '27', label: 'Professional Templates', icon: FileText },
                  { value: '4', label: 'Template Categories', icon: Target },
                  { value: 'Instant', label: 'Digital Download', icon: Zap },
                  { value: '$299', label: 'One-Time Purchase', icon: DollarSign }
                ].map((metric, index) => {
                  const Icon = metric.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center h-full">
                        <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 inline-flex mb-4">
                          <Icon size={24} className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                          {metric.value}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {metric.label}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* What's Included */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
                  What's Included in the Toolkit
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {[
                    {
                      title: '27 Professional Templates',
                      description: 'Ready-to-use templates for all vCISO service delivery needs',
                      icon: FileText
                    },
                    {
                      title: 'Service Delivery Guides',
                      description: 'Complete workflows and processes for vCISO engagements',
                      icon: Activity
                    },
                    {
                      title: 'ERMITS Platform Integration',
                      description: 'Guides for integrating ERMITS platforms into your services',
                      icon: Settings
                    },
                    {
                      title: 'Board Presentation Templates',
                      description: 'Executive-ready presentation templates for board meetings',
                      icon: Briefcase
                    },
                    {
                      title: 'Policy Templates & Frameworks',
                      description: 'Comprehensive policy templates and governance frameworks',
                      icon: CheckSquare
                    },
                    {
                      title: 'Instant Digital Download',
                      description: 'Get immediate access after purchase - no waiting',
                      icon: Download
                    }
                  ].map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 h-full">
                          <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 inline-flex mb-4">
                            <Icon size={24} className="text-blue-600 dark:text-blue-400" />
                          </div>
                          <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">{item.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Upgrade CTA */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800 p-8 mb-12">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Need More? Upgrade to Professional Kit</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Get everything in Starter Kit PLUS complete vCISO delivery workflow guide, service delivery methodology, client engagement templates, and ERMITS platform integration workflows.
                    </p>
                    <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                      <li>✓ All Starter Kit templates ($299 value)</li>
                      <li>✓ Complete 4-step delivery workflow guide</li>
                      <li>✓ Client engagement & onboarding templates</li>
                      <li>✓ ERMITS platform integration workflows</li>
                    </ul>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">$499</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">One-time purchase</div>
                    </div>
                    <button
                      onClick={() => navigate('/products/vciso-professional')}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      View Professional Kit →
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Templates Tab */}
          {activeTab === 'templates' && (
            <motion.div
              key="templates"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="text-center mb-8">
                <FileText size={48} className="text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Template Library</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  27 professional templates organized by category for vCISO service delivery
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full text-green-700 dark:text-green-400 text-sm font-semibold">
                  <CheckCircle size={16} />
                  All templates included in your purchase
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {templates.map((category, catIndex) => (
                  <div key={catIndex} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                      <FileText size={20} />
                      {category.category}
                    </h3>
                    <ul className="space-y-3">
                      {category.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="border-l-2 border-blue-600 pl-4">
                          <div className="font-semibold text-sm text-gray-900 dark:text-white">{item.name}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {item.description}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg text-center p-8 text-white">
                <h3 className="text-2xl font-bold mb-2">Get the Complete vCISO Starter Kit</h3>
                <p className="text-blue-100 mb-1 text-lg font-semibold">$299 - One-Time Purchase</p>
                <p className="text-blue-200 mb-6 text-sm">
                  Instant digital download • 27 templates • All delivery guides included
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={handlePurchase}
                    disabled={loading}
                    className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                        Purchase Now - $299
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </div>
                <p className="text-blue-200 text-xs mt-4">
                  Secure checkout • Instant access • Lifetime updates
                </p>
              </div>
            </motion.div>
          )}

          {/* Workflow Tab - Preview Only */}
          {activeTab === 'workflow' && (
            <motion.div
              key="workflow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-8">
                  <Activity size={48} className="text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">vCISO Delivery Workflow</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Complete guide through the vCISO service delivery process
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/30 rounded-full text-amber-700 dark:text-amber-400 font-semibold mb-4">
                    <Lock size={16} />
                    <span>Full workflow guide included in Professional Kit</span>
                  </div>
                </div>

                {/* Preview - First Step Only */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 relative">
                  {workflowStep > 0 && (
                    <div className="absolute inset-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm z-10 rounded-lg flex items-center justify-center">
                      <div className="text-center p-8">
                        <Lock size={48} className="text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Unlock Full Workflow Guide</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md">
                          Get access to all 4 workflow steps, complete service delivery methodology, client engagement templates, and ERMITS platform integration guides.
                        </p>
                        <button
                          onClick={() => navigate('/products/vciso-professional')}
                          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                          View Professional Kit →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step Navigation */}
                  <div className="flex justify-center gap-4 mb-8 overflow-x-auto pb-4">
                    {workflowSteps.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setWorkflowStep(index)}
                        className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all relative ${
                          workflowStep === index
                            ? 'bg-blue-600 text-white'
                            : index > 0
                            ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                        disabled={index > 0}
                      >
                        Step {index + 1}
                        {index > 0 && (
                          <Lock size={12} className="absolute -top-1 -right-1 text-amber-500" />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Current Step Display */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                        {workflowSteps[workflowStep].title}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Clock size={16} />
                        <span>{workflowSteps[workflowStep].duration}</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Step {workflowStep + 1} of {workflowSteps.length}
                      {workflowStep === 0 && <span className="ml-2 text-green-600">(Preview)</span>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-gray-900 dark:text-white flex items-center gap-2">
                        <CheckSquare size={18} />
                        Key Activities
                      </h4>
                      <ul className="space-y-2">
                        {workflowSteps[workflowStep].activities.map((activity, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{activity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3 text-gray-900 dark:text-white flex items-center gap-2">
                        <FileText size={18} />
                        Deliverables
                      </h4>
                      <ul className="space-y-2">
                        {workflowSteps[workflowStep].deliverables.map((deliverable, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <FileText size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                            <span>{deliverable}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center mt-8"
        >
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-2"
          >
            ← Back to Home
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default VcisoStarterKit;

