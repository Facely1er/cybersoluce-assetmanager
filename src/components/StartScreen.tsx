import React from 'react';
import { motion } from 'framer-motion';
import { logger } from '../utils/logger';
import { 
  Shield, 
  ArrowRight, 
  CheckCircle, 
  BarChart3,
  Lock,
  Globe,
  Play,
  Database,
  Target,
  Brain,
  GitBranch,
  Users,
  DollarSign,
  Eye,
  Zap
} from 'lucide-react';
import DomainBackground from './common/DomainBackground';
import TextCarousel from './common/TextCarousel';

interface StartScreenProps {
  onGetStarted: () => void;
  onLoadDemo: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onGetStarted, onLoadDemo }) => {
  const handleGetStarted = () => {
    try {
      onGetStarted();
    } catch (error) {
      logger.error('Error starting application', error instanceof Error ? error : undefined);
    }
  };

  const handleLoadDemo = () => {
    try {
      onLoadDemo();
    } catch (error) {
      logger.error('Error loading demo', error instanceof Error ? error : undefined);
    }
  };

  const heroCarouselItems = [
    {
      primary: "Unified Asset Inventory",
      secondary: "The foundational Intelligence Operations platform that powers the entire ERMITS ecosystem through a single source of truth"
    },
    {
      primary: "Enterprise Asset Management",
      secondary: "Comprehensive cybersecurity asset inventory platform with risk assessment, compliance tracking, and intelligent analytics"
    },
    {
      primary: "AI-Powered Intelligence Engine™",
      secondary: "Advanced cybersecurity insights with predictive analytics and cross-product data correlation across global frameworks"
    }
  ];

  const coreModules = [
    {
      icon: Database,
      title: 'Comprehensive Asset Management',
      description: 'Track, categorize, and manage all your digital assets in one centralized platform with advanced filtering, search capabilities, and relationship mapping.'
    },
    {
      icon: BarChart3,
      title: 'Risk Assessment & Analytics',
      description: 'Get detailed insights into your asset risk profile with automated scoring, vulnerability tracking, compliance monitoring, and comprehensive reporting.'
    },
    {
      icon: Lock,
      title: 'Security & Compliance',
      description: 'Ensure your assets meet industry standards with built-in compliance frameworks (SOC 2, ISO 27001, NIST, GDPR) and security best practices.'
    },
    {
      icon: Globe,
      title: 'Enterprise Integration',
      description: 'Seamlessly integrate with your existing tools and workflows through our robust API, CSV/Excel import/export, and external data source connections.'
    },
    {
      icon: Target,
      title: 'Automated Compliance',
      description: 'Streamline compliance workflows with automated checks, audit trails, and multi-framework support for comprehensive governance.'
    },
    {
      icon: Brain,
      title: 'Intelligent Analytics',
      description: 'AI-powered insights with predictive analytics, risk correlation, and strategic recommendations for optimal asset management.'
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
    <div className="w-full overflow-hidden">
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
                <button
                  onClick={handleGetStarted}
                  className="px-6 py-3 bg-white text-command-blue-700 rounded-lg font-medium hover:bg-command-blue-50 transition-all shadow-lg hover:shadow-xl"
                >
                  Access Command Center
                </button>
                <button
                  onClick={handleLoadDemo}
                  className="px-6 py-3 bg-command-blue-500 text-white rounded-lg font-medium hover:bg-command-blue-600 transition-all shadow-lg hover:shadow-command-blue-500/20 inline-flex items-center"
                >
                  <Play size={18} className="mr-2" />
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
              <div className="bg-command-blue-600/30 backdrop-blur-sm rounded-xl p-8 border border-command-blue-400/30 shadow-inner">
                {/* Asset Score */}
                <div className="mb-8 text-center">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    className="text-white text-sm mb-1 uppercase tracking-wider font-medium"
                  >
                    Asset Management Score
                  </motion.div>
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 100, 
                      delay: 0.9 
                    }}
                    className="text-white text-4xl font-bold mb-2"
                  >
                    4.2
                  </motion.div>
                  
                  <div className="h-3 bg-command-blue-900/50 rounded-full mt-4 mb-8">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "84%" }}
                      transition={{ duration: 1.5, delay: 1.1, ease: "easeOut" }}
                      className="h-3 bg-gradient-to-r from-command-blue-400 to-action-cyan-400 rounded-full"
                    ></motion.div>
                  </div>
                </div>
                
                {/* Asset Modules Grid */}
                <motion.div 
                  variants={staggerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-2 gap-4"
                >
                  <motion.div 
                    variants={itemVariants}
                    className="bg-command-blue-700/40 p-4 rounded-lg backdrop-blur-sm border border-command-blue-400/20"
                  >
                    <div className="flex justify-between mb-2">
                      <div className="text-sm text-command-blue-100 font-medium">Asset Tracking</div>
                      <div className="text-sm text-action-cyan-300 font-bold">96%</div>
                    </div>
                    <div className="h-2 bg-command-blue-900/50 rounded-full">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '96%' }}
                        transition={{ duration: 1, delay: 0.8 }}
                        className="h-2 bg-gradient-to-r from-action-cyan-400 to-action-cyan-500 rounded-full"
                      ></motion.div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    variants={itemVariants}
                    className="bg-command-blue-700/40 p-4 rounded-lg backdrop-blur-sm border border-command-blue-400/20"
                  >
                    <div className="flex justify-between mb-2">
                      <div className="text-sm text-command-blue-100 font-medium">Risk Assessment</div>
                      <div className="text-sm text-action-cyan-300 font-bold">89%</div>
                    </div>
                    <div className="h-2 bg-command-blue-900/50 rounded-full">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '89%' }}
                        transition={{ duration: 1, delay: 0.9 }}
                        className="h-2 bg-gradient-to-r from-action-cyan-400 to-action-cyan-500 rounded-full"
                      ></motion.div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    variants={itemVariants}
                    className="bg-command-blue-700/40 p-4 rounded-lg backdrop-blur-sm border border-command-blue-400/20"
                  >
                    <div className="flex justify-between mb-2">
                      <div className="text-sm text-command-blue-100 font-medium">Compliance</div>
                      <div className="text-sm text-action-cyan-300 font-bold">92%</div>
                    </div>
                    <div className="h-2 bg-command-blue-900/50 rounded-full">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '92%' }}
                        transition={{ duration: 1, delay: 1.0 }}
                        className="h-2 bg-gradient-to-r from-action-cyan-400 to-action-cyan-500 rounded-full"
                      ></motion.div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    variants={itemVariants}
                    className="bg-command-blue-700/40 p-4 rounded-lg backdrop-blur-sm border border-command-blue-400/20"
                  >
                    <div className="flex justify-between mb-2">
                      <div className="text-sm text-command-blue-100 font-medium">Integration</div>
                      <div className="text-sm text-action-cyan-300 font-bold">87%</div>
                    </div>
                    <div className="h-2 bg-command-blue-900/50 rounded-full">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '87%' }}
                        transition={{ duration: 1, delay: 1.1 }}
                        className="h-2 bg-gradient-to-r from-action-cyan-400 to-action-cyan-500 rounded-full"
                      ></motion.div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
              
              {/* Reflection effect */}
              <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-command-blue-400/10 to-transparent"></div>
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
                <motion.div
                  key={module.title}
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
      <section className="py-24 bg-gradient-to-br from-gray-50 to-command-blue-50 dark:from-gray-900 dark:to-command-blue-900/20 relative">
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(45deg, #005B96 25%, transparent 25%, transparent 50%, #005B96 50%, #005B96 75%, transparent 75%, transparent)',
            backgroundSize: '60px 60px',
            opacity: '0.03'
          }}></div>
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
            {[
              {
                icon: Database,
                title: 'Unified Asset Inventory',
                description: 'Single source of truth for all assets with advanced tracking, categorization, and relationship mapping',
                metrics: { value: '95%', label: 'Code Reuse' }
              },
              {
                icon: Shield,
                title: 'Risk Assessment',
                description: 'Automated risk scoring, vulnerability tracking, and compliance monitoring across all assets',
                metrics: { value: '80%', label: 'Efficiency Gain' }
              },
              {
                icon: Eye,
                title: 'Executive Intelligence',
                description: 'Board-level dashboards with predictive analytics, strategic insights, and real-time KPIs',
                metrics: { value: '24/7', label: 'Monitoring' }
              },
              {
                icon: Zap,
                title: 'Enterprise Integration',
                description: 'Seamless data flow with API integration, CSV/Excel import/export, and external connections',
                metrics: { value: '4+', label: 'Integrations' }
              },
              {
                icon: Brain,
                title: 'Intelligence Engine™',
                description: 'AI-powered insights with predictive modeling, automated recommendations, and correlation',
                metrics: { value: '95%', label: 'Accuracy' }
              },
              {
                icon: GitBranch,
                title: 'Multi-Framework Support',
                description: 'Support for SOC 2, ISO 27001, NIST, GDPR, and other compliance frameworks',
                metrics: { value: '25+', label: 'Frameworks' }
              }
            ].map((capability, index) => {
              const Icon = capability.icon;
              return (
                <motion.div
                  key={capability.title}
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
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{capability.description}</p>
                  
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
              );
            })}
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
                <button
                  onClick={handleGetStarted}
                  className="inline-flex items-center px-8 py-4 bg-white text-command-blue-700 rounded-lg font-semibold hover:bg-command-blue-50 transition-all shadow-lg hover:shadow-xl"
                >
                  Access Command Center
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05, boxShadow: '0 20px 25px -5px rgba(255, 255, 255, 0.2), 0 10px 10px -6px rgba(255, 255, 255, 0.1)' }}
                whileTap={{ scale: 0.95 }}
              >
                <button
                  onClick={handleLoadDemo}
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
