import React, { useState } from 'react';
import { NavigationSidebar } from './NavigationSidebar';
import { DashboardHome } from './DashboardHome';
import { AssetInventoryDashboard } from './AssetInventoryDashboard';
import { UserManualPage } from './UserManualPage';
import { GuidedWorkflow } from './GuidedWorkflow';
import { AdvancedReportingDashboard } from './reports/AdvancedReportingDashboard';
import { ComplianceManagement } from './compliance/ComplianceManagement';
import { VulnerabilityDashboard } from './vulnerabilities/VulnerabilityDashboard';
import { OrganizationManagement } from './organizations/OrganizationManagement';
import { UserManagement } from './users/UserManagement';
import { ActivityLog } from './activity/ActivityLog';
import { SystemSettings } from './settings/SystemSettings';
import { useAuth } from '../contexts/AuthContext';
import { useAssetInventory } from '../hooks/useAssetInventory';

interface MainLayoutProps {
  onShowStartScreen: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ onShowStartScreen }) => {
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, signOut } = useAuth();
  const { stats } = useAssetInventory();

  const handleNavigateToAssets = React.useCallback(() => {
    setActiveView('assets');
  }, []);

  const handleNavigateToReports = React.useCallback(() => {
    setActiveView('analytics');
  }, []);

  const handleNavigateToSettings = React.useCallback(() => {
    setActiveView('settings');
  }, []);

  const getCurrentStats = () => ({
    totalAssets: stats.total,
    hasAssets: stats.total > 0,
    hasTeam: false, // This would be determined by actual team data
    hasCompliance: Object.keys(stats.byType).length > 0 // Simple proxy for compliance setup
  });

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <DashboardHome
            stats={stats}
            onNavigateToAssets={handleNavigateToAssets}
            onNavigateToReports={handleNavigateToReports}
            onNavigateToSettings={handleNavigateToSettings}
          />
        );
      case 'assets':
        return <AssetInventoryDashboard />;
      case 'user-manual':
        return <UserManualPage />;
      case 'analytics':
        return <AdvancedReportingDashboard />;
      case 'workflow':
        return (
          <GuidedWorkflow
            onNavigate={setActiveView}
            onShowImport={handleShowImport}
            onShowInventoryGenerator={handleShowInventoryGenerator}
            onShowTeamManagement={handleShowTeamManagement}
            currentStats={getCurrentStats()}
          />
        );
      case 'compliance':
        return <ComplianceManagement />;
      case 'vulnerabilities':
        return <VulnerabilityDashboard />;
      case 'organizations':
        return <OrganizationManagement />;
      case 'users':
        return <UserManagement />;
      case 'activity':
        return <ActivityLog />;
      case 'settings':
        return <SystemSettings />;
      case 'help':
        return (
          <div className="p-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <h2 className="text-2xl font-outfit font-bold text-gray-900 mb-4">
                Help & Support
              </h2>
              <p className="text-gray-600 mb-6">
                Additional support resources are under development.
              </p>
              <div className="space-y-4">
                <button
                  onClick={() => setActiveView('user-manual')}
                  className="px-6 py-3 bg-action-cyan-600 text-white rounded-lg hover:bg-action-cyan-700 transition-colors mr-4"
                >
                  View User Manual
                </button>
                <button
                  onClick={onShowStartScreen}
                  className="px-6 py-3 bg-command-blue-600 text-white rounded-lg hover:bg-command-blue-700 transition-colors mr-4"
                >
                  View Start Screen
                </button>
                <button
                  onClick={() => setActiveView('assets')}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
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
    <div className="flex h-screen bg-gray-50">
      <NavigationSidebar
        activeView={activeView}
        onViewChange={setActiveView}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        user={user}
        onShowTeamManagement={handleShowTeamManagement}
        signOut={signOut}
      />
      
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};