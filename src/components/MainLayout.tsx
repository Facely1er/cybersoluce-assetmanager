import React, { useState, Suspense, lazy, useCallback, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { NavigationSidebar } from './NavigationSidebar';
import { DashboardHome } from './DashboardHome';
import { LoadingSpinner } from './LoadingSpinner';
import { useAuth } from '../hooks/useAuth';
import { useAssetInventory } from '../contexts/AssetInventoryContext';
import { generateDemoDataPackage } from '../data/demoDataGenerator';
import toast from 'react-hot-toast';
import { logger } from '../utils/logger';

// Lazy load components for better performance
// Using .then() to handle named exports properly
const AssetInventoryDashboard = lazy(() => import('./AssetInventoryDashboard').then(module => ({ default: module.AssetInventoryDashboard })));
const UserManualPage = lazy(() => import('./UserManualPage').then(module => ({ default: module.UserManualPage })));
const GuidedWorkflow = lazy(() => import('./GuidedWorkflow').then(module => ({ default: module.GuidedWorkflow })));
const AdvancedReportingDashboard = lazy(() => import('./reports/AdvancedReportingDashboard').then(module => ({ default: module.AdvancedReportingDashboard })));
const ComplianceManagement = lazy(() => import('./compliance/ComplianceManagement').then(module => ({ default: module.ComplianceManagement })));
const PrivacyComplianceDashboard = lazy(() => import('./privacy/PrivacyComplianceDashboard').then(module => ({ default: module.PrivacyComplianceDashboard })));
const DependenciesPage = lazy(() => import('./dependencies/DependenciesPage').then(module => ({ default: module.DependenciesPage })));
const DataProtectionDashboard = lazy(() => import('./protection/DataProtectionDashboard').then(module => ({ default: module.DataProtectionDashboard })));
const VulnerabilityDashboard = lazy(() => import('./vulnerabilities/VulnerabilityDashboard').then(module => ({ default: module.VulnerabilityDashboard })));
const OrganizationManagement = lazy(() => import('./organizations/OrganizationManagement').then(module => ({ default: module.OrganizationManagement })));
const UserManagement = lazy(() => import('./users/UserManagement').then(module => ({ default: module.UserManagement })));
const ActivityLog = lazy(() => import('./activity/ActivityLog').then(module => ({ default: module.ActivityLog })));
const SystemSettings = lazy(() => import('./settings/SystemSettings').then(module => ({ default: module.SystemSettings })));
const DemoShowcase = lazy(() => import('./DemoShowcase').then(module => ({ default: module.DemoShowcase })));
const MitigationPageWrapper = lazy(() => import('./mitigation/MitigationPageWrapper').then(module => ({ default: module.MitigationPageWrapper })));
const BusinessImpactPageWrapper = lazy(() => import('./business-impact/BusinessImpactPageWrapper').then(module => ({ default: module.BusinessImpactPageWrapper })));
const NISTPageWrapper = lazy(() => import('./nist/NISTPageWrapper').then(module => ({ default: module.NISTPageWrapper })));
const FrameworkPageWrapper = lazy(() => import('./framework/FrameworkPageWrapper').then(module => ({ default: module.FrameworkPageWrapper })));
const DataNormalizationEngine = lazy(() => import('./DataNormalizationEngine'));

interface MainLayoutProps {
  onShowStartScreen?: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ onShowStartScreen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine active view from URL
  const getViewFromPath = () => {
    const path = location.pathname;
    if (path === '/dashboard' || path === '/dashboard/') {
      return 'dashboard';
    }
    const viewMatch = path.match(/\/dashboard\/(.+)$/);
    return viewMatch ? viewMatch[1] : 'dashboard';
  };
  
  const [activeView, setActiveView] = useState(() => {
    const path = location.pathname;
    if (path === '/dashboard' || path === '/dashboard/') {
      return 'dashboard';
    }
    const viewMatch = path.match(/\/dashboard\/(.+)$/);
    return viewMatch ? viewMatch[1] : 'dashboard';
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, signOut } = useAuth();
  const { stats, replaceAssets } = useAssetInventory();

  // Sync activeView with URL changes
  useEffect(() => {
    const view = getViewFromPath();
    setActiveView(view);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Navigate function that updates both state and URL
  const handleViewChange = useCallback((view: string) => {
    setActiveView(view);
    if (view === 'dashboard') {
      navigate('/dashboard', { replace: true });
    } else {
      navigate(`/dashboard/${view}`, { replace: true });
    }
  }, [navigate]);

  const handleNavigateToAssets = useCallback(() => {
    handleViewChange('assets');
  }, [handleViewChange]);

  const handleNavigateToReports = useCallback(() => {
    handleViewChange('analytics');
  }, [handleViewChange]);

  const handleNavigateToSettings = useCallback(() => {
    handleViewChange('settings');
  }, [handleViewChange]);

  const handleShowImport = useCallback(() => {
    handleViewChange('assets');
  }, [handleViewChange]);

  const handleShowInventoryGenerator = useCallback(() => {
    handleViewChange('assets');
  }, [handleViewChange]);

  const handleShowTeamManagement = useCallback(() => {
    handleViewChange('users');
  }, [handleViewChange]);

  const handleStartDemo = React.useCallback(async (scenarioId: string) => {
    try {
      // Show loading toast
      const loadingToast = toast.loading('Loading demo scenario...');
      
      // Generate demo data package
      const demoPackage = generateDemoDataPackage(scenarioId);
      
      // Replace current assets with demo assets
      replaceAssets(demoPackage.assets);
      
      // Navigate to assets view
      handleViewChange('assets');
      
      // Show success message with scenario details
      toast.dismiss(loadingToast);
      toast.success(
        `Demo scenario "${demoPackage.scenario.name}" loaded successfully! ` +
        `(${demoPackage.metadata.assetCount} assets, ${demoPackage.metadata.vulnerabilityCount} vulnerabilities)`,
        { duration: 5000 }
      );
    } catch (error) {
      logger.error('Error loading demo scenario', error instanceof Error ? error : undefined);
      toast.error(`Failed to load demo scenario: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [replaceAssets, handleViewChange]);

  const handleViewDemo = React.useCallback((scenarioId: string) => {
    // Show demo details
    handleViewChange('demo-scenarios');
  }, [handleViewChange]);

  const getCurrentStats = () => ({
    totalAssets: stats.total,
    hasAssets: stats.total > 0,
    hasTeam: false, // This would be determined by actual team data
    hasCompliance: Object.keys(stats.byType).length > 0 // Simple proxy for compliance setup
  });

  const renderContent = () => {
    const LoadingFallback = () => (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );

    switch (activeView) {
      case 'dashboard':
        return (
          <DashboardHome
            stats={stats}
            onNavigateToAssets={handleNavigateToAssets}
            onNavigateToReports={handleNavigateToReports}
            onNavigateToSettings={handleNavigateToSettings}
            onNavigateToActivity={() => handleViewChange('activity')}
          />
        );
      case 'assets':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <AssetInventoryDashboard />
          </Suspense>
        );
      case 'user-manual':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <UserManualPage />
          </Suspense>
        );
      case 'analytics':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <AdvancedReportingDashboard />
          </Suspense>
        );
      case 'workflow':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <GuidedWorkflow
              onNavigate={handleViewChange}
              onShowImport={handleShowImport}
              onShowInventoryGenerator={handleShowInventoryGenerator}
              onShowTeamManagement={handleShowTeamManagement}
              currentStats={getCurrentStats()}
            />
          </Suspense>
        );
      case 'compliance':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <ComplianceManagement />
          </Suspense>
        );
      case 'privacy-compliance':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <PrivacyComplianceDashboard />
          </Suspense>
        );
      case 'dependencies':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <DependenciesPage />
          </Suspense>
        );
      case 'data-protection':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <DataProtectionDashboard />
          </Suspense>
        );
      case 'vulnerabilities':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <VulnerabilityDashboard />
          </Suspense>
        );
      case 'mitigation':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <MitigationPageWrapper />
          </Suspense>
        );
      case 'business-impact':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <BusinessImpactPageWrapper />
          </Suspense>
        );
      case 'nist':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <NISTPageWrapper />
          </Suspense>
        );
      case 'framework':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <FrameworkPageWrapper />
          </Suspense>
        );
      case 'organizations':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <OrganizationManagement />
          </Suspense>
        );
      case 'users':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <UserManagement />
          </Suspense>
        );
      case 'activity':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <ActivityLog />
          </Suspense>
        );
      case 'settings':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <SystemSettings />
          </Suspense>
        );
      case 'demo-scenarios':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <DemoShowcase 
              onStartDemo={handleStartDemo}
              onViewDemo={handleViewDemo}
            />
          </Suspense>
        );
      case 'data-normalization':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <DataNormalizationEngine onViewChange={handleViewChange} />
          </Suspense>
        );
      case 'help':
        return (
          <div className="p-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
              <h2 className="text-2xl font-outfit font-bold text-gray-900 dark:text-white mb-4">
                Help & Support
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Additional support resources are under development.
              </p>
              <div className="space-y-4">
                <button
                  onClick={() => handleViewChange('user-manual')}
                  className="px-6 py-3 bg-action-cyan-600 dark:bg-action-cyan-500 text-white rounded-lg hover:bg-action-cyan-700 dark:hover:bg-action-cyan-600 transition-colors mr-4"
                >
                  View User Manual
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="px-6 py-3 bg-command-blue-600 dark:bg-command-blue-500 text-white rounded-lg hover:bg-command-blue-700 dark:hover:bg-command-blue-600 transition-colors mr-4"
                >
                  View Start Screen
                </button>
                <button
                  onClick={() => handleViewChange('assets')}
                  className="px-6 py-3 bg-gray-600 dark:bg-gray-500 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                >
                  View Assets
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <DashboardHome
            stats={stats}
            onNavigateToAssets={handleNavigateToAssets}
            onNavigateToReports={handleNavigateToReports}
            onNavigateToSettings={handleNavigateToSettings}
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 overflow-hidden">
      <NavigationSidebar
        activeView={activeView}
        onViewChange={handleViewChange}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        user={user}
        onShowTeamManagement={handleShowTeamManagement}
        signOut={signOut}
      />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gray-50 dark:bg-gray-900">
        {/* Minimal Header */}
        <header className="h-12 border-b border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm flex-shrink-0">
          <div className="h-full flex items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link 
              to="/" 
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
            >
              ← Back to Home
            </Link>
            <div className="text-xs text-gray-500 dark:text-gray-500">
              CyberSoluce™ Asset Manager
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 w-full">
            {renderContent()}
          </div>
        </main>

        {/* Minimal Footer */}
        <footer className="h-10 border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm flex-shrink-0">
          <div className="h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <p className="text-xs text-gray-500 dark:text-gray-500">
              © {new Date().getFullYear()} ERMITS LLC. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};