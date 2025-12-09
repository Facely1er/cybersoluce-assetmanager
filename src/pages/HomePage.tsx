import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Shield, 
  ArrowRight, 
  Target, 
  Brain, 
  GitBranch, 
  BarChart3, 
  Users, 
  DollarSign,
  CheckCircle,
  TrendingUp,
  Eye,
  Zap,
  Play,
  Database,
  Lock,
  Globe,
  Gift,
  FileText,
  Building2,
  ExternalLink,
  AlertTriangle,
  Activity
} from 'lucide-react';
import DomainBackground from '../components/common/DomainBackground';
import TextCarousel from '../components/common/TextCarousel';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const heroCarouselItems = [
    {
      primary: "Unified Asset Inventory",
      secondary: "The foundational Intelligence Operations platform that powers the entire ERMITS ecosystem through a single source of truth"
    },
    {
      primary: "Enterprise Asset Management",
      secondary: "Comprehensive cybersecurity asset inventory platform with automated risk analysis, compliance evaluation, and intelligent analytics"
    },
    {
      primary: "Dependency-Aware Visibility",
      secondary: "Advanced cybersecurity insights with predictive analytics and cross-product data correlation across global frameworks"
    }
  ];

  const coreModules = [
    {
      icon: Database,
      title: 'Comprehensive Asset Management',
      description: 'Track, categorize, and manage all your digital assets in one centralized platform with advanced filtering, search capabilities, and relationship mapping.',
      link: '/dashboard'
    },
    {
      icon: BarChart3,
      title: 'Risk Analysis & Analytics',
      description: 'Get detailed insights into your asset risk profile with automated risk scoring, vulnerability tracking, compliance evaluation, and comprehensive reporting.',
      link: '/dashboard'
    },
    {
      icon: Lock,
      title: 'Security & Compliance',
      description: 'Ensure your assets meet industry standards with built-in compliance frameworks (SOC 2, ISO 27001, NIST, GDPR) and security best practices.',
      link: '/dashboard'
    },
    {
      icon: Globe,
      title: 'Enterprise Integration',
      description: 'Seamlessly integrate with your existing tools and workflows through our robust API, CSV/Excel import/export, and external data source connections.',
      link: '/dashboard'
    },
    {
      icon: Target,
      title: 'Automated Compliance',
      description: 'Streamline compliance workflows with automated checks, audit trails, and multi-framework support for comprehensive governance.',
      link: '/dashboard'
    },
    {
      icon: Brain,
      title: 'Intelligent Analytics',
      description: 'AI-powered insights with predictive analytics, risk correlation, and strategic recommendations for optimal asset management.',
      link: '/dashboard'
    }
  ];


  const keyCapabilities = [
    {
      icon: Database,
      title: 'Unified Asset Inventory',
      description: 'Single source of truth for all assets with advanced tracking, categorization, and relationship mapping',
      metrics: { value: '95%', label: 'Code Reuse' },
      link: '/dashboard'
    },
    {
      icon: Shield,
      title: 'Automated Risk Analysis',
      description: 'Automated risk scoring and vulnerability tracking across all assets in your inventory',
      metrics: { value: '80%', label: 'Efficiency Gain' },
      link: '/dashboard'
    },
    {
      icon: Eye,
      title: 'Executive Intelligence',
      description: 'Board-level dashboards with predictive analytics, strategic insights, and real-time KPIs',
      metrics: { value: '24/7', label: 'Monitoring' },
      link: '/dashboard'
    },
    {
      icon: Zap,
      title: 'Enterprise Integration',
      description: 'Seamless data flow with API integration, CSV/Excel import/export, and external connections',
      metrics: { value: '4+', label: 'Integrations' },
      link: '/dashboard'
    },
    {
      icon: Brain,
      title: 'Asset Intelligence',
      description: 'AI-powered insights with predictive modeling, automated recommendations, and correlation',
      metrics: { value: '95%', label: 'Accuracy' },
      link: '/dashboard'
    },
    {
      icon: GitBranch,
      title: 'Multi-Framework Support',
      description: 'Support for SOC 2, ISO 27001, NIST, GDPR, and other compliance frameworks',
      metrics: { value: '25+', label: 'Frameworks' },
      link: '/dashboard'
    }
  ];

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

  const fadeInRightVariants = {
    hidden: { opacity: 0, x: -40 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" } 
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
        {/* Use DomainBackground component for animated background */}
        <DomainBackground color="0, 91, 150" secondaryColor="51, 161, 222" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-white"
            >
              <motion.div
                variants={itemVariants}
                className="mb-8 max-w-lg"
              >
                <TextCarousel 
                  items={heroCarouselItems}
                  interval={4000}
                />
              </motion.div>
              
              <motion.div 
                variants={itemVariants}
                className="flex flex-wrap gap-4 mb-8"
              >
                <Link to="/dashboard" className="px-6 py-3 bg-white text-command-blue-700 rounded-lg font-medium hover:bg-command-blue-50 transition-all shadow-lg hover:shadow-xl">
                  Access Command Center
                </Link>
                <button
                  onClick={() => navigate('/dashboard/demo-scenarios')}
                  className="px-6 py-3 bg-command-blue-500 text-white rounded-lg font-medium hover:bg-command-blue-600 transition-all shadow-lg hover:shadow-command-blue-500/20 inline-flex items-center"
                >
                  <Play size={18} className="mr-2 inline-block" />
                  View Demo
                </button>
              </motion.div>
            </motion.div>
            
            {/* Dashboard Visualization */}
            <motion.div 
              variants={fadeInRightVariants}
              initial="hidden"
              animate="visible"
              className="relative rounded-2xl overflow-hidden shadow-2xl mt-8 lg:mt-0"
            >
              <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-xl p-6 border border-command-blue-400/30 shadow-inner">
                {/* Dashboard Header */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">Command Center</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Real-time Dashboard</p>
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                </motion.div>
                
                {/* Key Metrics Grid */}
                <motion.div 
                  variants={staggerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-2 gap-3 mb-6"
                >
                  <motion.div 
                    variants={itemVariants}
                    className="bg-gradient-to-br from-command-blue-50 to-action-cyan-50 dark:from-command-blue-900/30 dark:to-action-cyan-900/30 p-3 rounded-lg border border-command-blue-200/50 dark:border-command-blue-700/50"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Shield className="h-4 w-4 text-command-blue-600 dark:text-command-blue-400" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">Total</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">247</div>
                    <div className="text-xs text-green-600 dark:text-green-400 mt-1">+12 this month</div>
                  </motion.div>
                  
                  <motion.div 
                    variants={itemVariants}
                    className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/30 dark:to-orange-900/30 p-3 rounded-lg border border-red-200/50 dark:border-red-700/50"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">Critical</span>
                    </div>
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">18</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">7% of total</div>
                  </motion.div>
                  
                  <motion.div 
                    variants={itemVariants}
                    className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/30 dark:to-amber-900/30 p-3 rounded-lg border border-yellow-200/50 dark:border-yellow-700/50"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Activity className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">Risk</span>
                    </div>
                    <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">42</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Moderate</div>
                  </motion.div>
                  
                  <motion.div 
                    variants={itemVariants}
                    className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 p-3 rounded-lg border border-green-200/50 dark:border-green-700/50"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">Compliance</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">94%</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Assets tagged</div>
                  </motion.div>
                </motion.div>
                
                {/* Asset Distribution Chart */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                  className="mb-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Asset Distribution</h4>
                    <BarChart3 className="h-3 w-3 text-gray-400" />
                  </div>
                  <div className="space-y-2">
                    {[
                      { type: 'Server', count: 89, color: 'bg-blue-500', width: '36%' },
                      { type: 'Database', count: 52, color: 'bg-green-500', width: '21%' },
                      { type: 'Application', count: 67, color: 'bg-purple-500', width: '27%' },
                      { type: 'Network', count: 39, color: 'bg-orange-500', width: '16%' },
                    ].map((item, index) => (
                      <div key={item.type} className="flex items-center justify-between">
                        <div className="flex items-center flex-1">
                          <div className={`w-2 h-2 rounded-full mr-2 ${item.color}`}></div>
                          <span className="text-xs text-gray-600 dark:text-gray-400">{item.type}</span>
                        </div>
                        <div className="flex items-center space-x-2 flex-1 max-w-[100px]">
                          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: item.width }}
                              transition={{ duration: 1, delay: 1.2 + index * 0.1 }}
                              className={`h-1.5 rounded-full ${item.color}`}
                            ></motion.div>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-500 w-6 text-right">{item.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
                
                {/* Quick Actions */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1.4 }}
                  className="pt-4 border-t border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Quick Actions</span>
                    <Zap className="h-3 w-3 text-gray-400" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {[
                      { icon: Shield, label: 'Assets', color: 'text-command-blue-600 dark:text-command-blue-400' },
                      { icon: BarChart3, label: 'Reports', color: 'text-action-cyan-600 dark:text-action-cyan-400' },
                      { icon: Target, label: 'Settings', color: 'text-purple-600 dark:text-purple-400' },
                    ].map((action, index) => {
                      const Icon = action.icon;
                      return (
                        <motion.div
                          key={action.label}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200, delay: 1.5 + index * 0.1 }}
                          className="flex flex-col items-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                        >
                          <Icon className={`h-4 w-4 ${action.color} mb-1`} />
                          <span className="text-xs text-gray-600 dark:text-gray-400">{action.label}</span>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              </div>
              
              {/* Reflection effect */}
              <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white/20 to-transparent dark:from-gray-900/20"></div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Core Modules Section */}
      <section className="py-24 bg-white dark:bg-gray-800 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Core Asset Management Modules
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Comprehensive capabilities for strategic cybersecurity asset management
            </p>
          </motion.div>
          
          <motion.div 
            variants={staggerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {coreModules.map((module, index) => {
              const Icon = module.icon;
              return (
                <Link key={module.title} to={module.link}>
                  <motion.div
                    variants={itemVariants}
                    whileHover={{ y: -10, boxShadow: '0 10px 25px -5px rgba(0, 91, 150, 0.5), 0 8px 10px -6px rgba(0, 91, 150, 0.1)' }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 border border-gray-100 dark:border-gray-700 hover:border-command-blue-200 dark:hover:border-command-blue-700 transition-all duration-300 transform cursor-pointer text-center"
                  >
                    <motion.div
                      className="bg-gradient-to-br from-command-blue-50 to-action-cyan-50 dark:from-command-blue-900/30 dark:to-action-cyan-900/30 p-4 rounded-2xl mb-6 w-16 h-16 flex items-center justify-center shadow-inner mx-auto"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 * index }}
                    >
                      <Icon className="h-8 w-8 text-command-blue-600 dark:text-command-blue-400" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {module.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {module.description}
                    </p>
                  </motion.div>
                </Link>
              );
            })}
          </motion.div>
        </div>
        
        {/* Dotted background */}
        <div className="absolute inset-0 pointer-events-none opacity-10 dark:opacity-5" 
             style={{
               backgroundImage: 'radial-gradient(#005B96 1px, transparent 1px), radial-gradient(#005B96 1px, transparent 1px)',
               backgroundSize: '40px 40px',
               backgroundPosition: '0 0, 20px 20px'
             }}>
        </div>
      </section>
      
      {/* Key Capabilities Section */}
      <section className="py-24 bg-white dark:bg-gray-800">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-5 dark:opacity-10"
               style={{
                 backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23005B96' fill-opacity='0.2' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
                 backgroundSize: '20px 20px'
               }}>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Key Capabilities
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Strategic asset management capabilities that transform cybersecurity operations
            </p>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {keyCapabilities.map((capability, index) => {
              const Icon = capability.icon;
              return (
                <Link key={capability.title} to={capability.link}>
                  <motion.div
                    variants={itemVariants}
                    whileHover={{ 
                      y: -12, 
                      scale: 1.02,
                      boxShadow: '0 20px 40px -8px rgba(0, 91, 150, 0.3), 0 12px 16px -8px rgba(0, 91, 150, 0.15)' 
                    }}
                    className="bg-gradient-to-br from-white to-command-blue-50 dark:from-gray-800 dark:to-command-blue-900/20 rounded-xl shadow-md p-8 text-center border border-gray-100 dark:border-gray-700 hover:border-command-blue-200 dark:hover:border-command-blue-700 transition-all duration-300"
                  >
                    <motion.div 
                      className="bg-gradient-to-br from-command-blue-100 to-action-cyan-100 dark:from-command-blue-900/40 dark:to-action-cyan-900/40 p-4 rounded-2xl w-16 h-16 mx-auto mb-6 flex items-center justify-center shadow-inner"
                      initial={{ scale: 0, rotate: -10 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 * index }}
                    >
                      <Icon className="h-8 w-8 text-command-blue-600 dark:text-command-blue-400" />
                    </motion.div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{capability.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{capability.description}</p>
                    
                    {/* Capability Metrics */}
                    <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="text-2xl font-bold text-command-blue-600 dark:text-command-blue-400">
                          {capability.metrics.value}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {capability.metrics.label}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </motion.div>
        </div>
      </section>
      
      {/* Free Tools Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center justify-center mb-4">
              <Gift className="h-8 w-8 text-command-blue-600 dark:text-command-blue-400 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Free Browser-Based Tools
              </h2>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-4">
              Start your cybersecurity journey with our professional asset evaluation and inventory tools. 
              No installation, no account required. Privacy-first design.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                No Installation
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Privacy-First
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Instant Access
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Export Ready
              </div>
            </div>
          </motion.div>
          
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
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Data Inventory Tool
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                Discover, catalog, and track all organizational data. Perfect for GDPR Article 30 preparation and compliance documentation.
              </p>
              <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1 mb-6">
                <li>• 13 core data fields</li>
                <li>• PII & Sensitive tracking</li>
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
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Information Asset Register
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                Comprehensive asset management with automated gap analysis and compliance tracking. Ideal for ISO 27001, SOC 2, and NIST.
              </p>
              <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1 mb-6">
                <li>• 20+ asset fields</li>
                <li>• 8-point control framework</li>
                <li>• Automated gap analysis</li>
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
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Vendor Register Manager
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                Third-party risk management with automated risk scoring and compliance tracking. Track contracts and vendor relationships.
              </p>
              <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1 mb-6">
                <li>• 15+ vendor fields</li>
                <li>• Automated risk scoring</li>
                <li>• 9-point compliance checklist</li>
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

          {/* View All Tools CTA */}
          <motion.div 
            variants={fadeInUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center"
          >
            <a
              href="/tools/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-command-blue-600 to-action-cyan-600 text-white rounded-lg font-semibold hover:from-command-blue-700 hover:to-action-cyan-700 transition-all shadow-lg hover:shadow-xl"
            >
              <Gift className="mr-2 h-5 w-5" />
              View All Free Tools
              <ExternalLink className="ml-2 h-5 w-5" />
            </a>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              Import your data into CyberSoluce Asset Intelligence when ready to upgrade
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
              Ready to transform your asset management?
            </h2>
            <p className="text-xl text-command-blue-100 mb-10 max-w-3xl mx-auto">
              Experience the power of unified asset inventory with AI-powered intelligence
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <motion.div 
                whileHover={{ scale: 1.05, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -6px rgba(0, 0, 0, 0.1)' }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  to="/dashboard" 
                  className="inline-flex items-center px-8 py-4 bg-white text-command-blue-700 rounded-lg font-semibold hover:bg-command-blue-50 transition-all shadow-lg hover:shadow-xl"
                >
                  Access Command Center
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05, boxShadow: '0 20px 25px -5px rgba(255, 255, 255, 0.2), 0 10px 10px -6px rgba(255, 255, 255, 0.1)' }}
                whileTap={{ scale: 0.95 }}
              >
                <button
                  onClick={() => navigate('/dashboard/demo-scenarios')}
                  className="inline-flex items-center px-8 py-4 bg-command-blue-500 text-white rounded-lg font-semibold hover:bg-command-blue-600 transition-all shadow-lg hover:shadow-xl border border-command-blue-400"
                >
                  View Demo
                  <Play className="ml-2 h-5 w-5" />
                </button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

