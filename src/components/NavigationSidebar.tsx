import React from 'react';
import { User } from '@supabase/supabase-js';
import { 
  Home, 
  Shield, 
  BarChart3, 
  Settings, 
  FileText, 
  Users, 
  AlertTriangle,
  Building2,
  Activity,
  HelpCircle,
  BookOpen,
  User as UserIcon,
  Zap,
  LogOut,
  Target,
  Play,
  Database,
  Network,
  Lock,
  CheckCircle2,
  TrendingUp,
  Gift,
  Globe,
  Code
} from 'lucide-react';
import { ThemeToggle } from './common/ThemeToggle';

type NavigationItem = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  external?: boolean;
  href?: string;
}

interface NavigationSidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  user?: User | null;
  onShowTeamManagement?: () => void;
  signOut?: () => void;
}

export const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  activeView,
  onViewChange,
  isCollapsed,
  onToggleCollapse,
  user,
  onShowTeamManagement,
  signOut,
}) => {
  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      description: 'Overview and analytics'
    },
    {
      id: 'workflow',
      label: 'Setup Workflow',
      icon: Target,
      description: 'Guided setup and roadmap'
    },
    {
      id: 'demo-scenarios',
      label: 'Demo Scenarios',
      icon: Play,
      description: 'Industry use cases and demos'
    },
    {
      id: 'free-tools',
      label: 'Free Tools',
      icon: Gift,
      description: 'Browser-based assessment tools',
      external: true,
      href: '/tools/'
    },
    {
      id: 'data-normalization',
      label: 'Data Normalization',
      icon: Code,
      description: 'Transform and standardize data'
    },
    {
      id: 'assets',
      label: 'Assets',
      icon: Shield,
      description: 'Manage your inventory'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      description: 'Reports and insights'
    },
    {
      id: 'compliance',
      label: 'Compliance',
      icon: FileText,
      description: 'Framework management'
    },
    {
      id: 'privacy-compliance',
      label: 'Privacy & Data',
      icon: Database,
      description: 'Privacy compliance & data protection'
    },
    {
      id: 'dependencies',
      label: 'Dependencies',
      icon: Network,
      description: 'Asset dependencies mapping'
    },
    {
      id: 'data-protection',
      label: 'Data Protection',
      icon: Lock,
      description: 'Security controls & data protection'
    },
    {
      id: 'vulnerabilities',
      label: 'Vulnerabilities',
      icon: AlertTriangle,
      description: 'Security issues'
    },
    {
      id: 'mitigation',
      label: 'Mitigation',
      icon: CheckCircle2,
      description: 'Risk mitigation planning'
    },
    {
      id: 'business-impact',
      label: 'Business Impact',
      icon: Building2,
      description: 'BIA and continuity planning'
    },
    {
      id: 'nist',
      label: 'NIST Framework',
      icon: Shield,
      description: 'NIST CSF implementation'
    },
    {
      id: 'framework',
      label: 'Framework',
      icon: TrendingUp,
      description: 'Implementation tracking'
    },
    {
      id: 'organizations',
      label: 'Organizations',
      icon: Building2,
      description: 'Manage entities'
    },
    {
      id: 'users',
      label: 'Users',
      icon: Users,
      description: 'User management'
    },
    {
      id: 'activity',
      label: 'Activity Log',
      icon: Activity,
      description: 'System activity'
    },
    {
      id: 'user-manual',
      label: 'User Manual',
      icon: BookOpen,
      description: 'Help and documentation'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      description: 'System configuration'
    },
    {
      id: 'help',
      label: 'Help & Support',
      icon: HelpCircle,
      description: 'Additional support'
    }
  ];

  return (
    <div className={`bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-r border-gray-200/60 dark:border-gray-800/60 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    } flex flex-col h-full shadow-sm`}>
      {/* Header - Polished */}
      <div className="p-5 border-b border-gray-200/60 dark:border-gray-800/60">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <img 
                src="/icon.svg" 
                alt="CyberSoluce Logo" 
                className="h-10 w-10 object-contain flex-shrink-0"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = '<div class="h-10 w-10 p-2 bg-gradient-to-br from-command-blue-600 to-action-cyan-500 rounded-lg shadow-lg flex items-center justify-center"><svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg></div>';
                  }
                }}
              />
              <div>
                <div className="font-bold text-gray-900 dark:text-white leading-tight text-lg bg-gradient-to-r from-command-blue-600 to-action-cyan-500 bg-clip-text text-transparent">
                  CyberSoluce<sup className="text-xs font-normal">™</sup>
                </div>
                <div className="text-xs font-semibold text-gray-600 dark:text-gray-400">Asset Manager</div>
                <div className="text-xs text-gray-500 dark:text-gray-500">by ERMITS</div>
              </div>
            </div>
          )}
          {isCollapsed && (
            <img 
              src="/icon.svg" 
              alt="CyberSoluce" 
              className="h-8 w-8 mx-auto object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          )}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={onToggleCollapse}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-command-blue-500"
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <div className={`w-4 h-4 border-2 border-gray-400 dark:border-gray-500 rounded transition-transform ${
                isCollapsed ? 'rotate-180' : ''
              }`}>
                <div className="w-0 h-0 border-l-2 border-l-gray-400 dark:border-l-gray-500 border-t-2 border-t-transparent border-b-2 border-b-transparent ml-1"></div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Items - Polished */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navigationItems.map((item) => {
          const navItem = item as NavigationItem;
          const isExternal = navItem.external === true;
          const href = navItem.href;
          const isActive = activeView === item.id;
          
          if (isExternal && href) {
            return (
              <a
                key={item.id}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 group ${
                  isCollapsed ? 'justify-center' : ''
                } ${
                  isActive 
                    ? 'bg-gradient-to-r from-command-blue-50 to-action-cyan-50 dark:from-command-blue-900/30 dark:to-action-cyan-900/30 text-command-blue-700 dark:text-command-blue-300 border border-command-blue-200 dark:border-command-blue-800' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <item.icon className={`h-5 w-5 ${isCollapsed ? 'mx-auto' : 'mr-3'} ${
                  isActive 
                    ? 'text-command-blue-600 dark:text-command-blue-400' 
                    : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                } transition-colors`} />
                {!isCollapsed && (
                  <div className="flex-1 text-left">
                    <div className="font-medium dark:text-gray-200">{item.label}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300">
                      {item.description}
                    </div>
                  </div>
                )}
                {!isCollapsed && (
                  <Globe className="h-4 w-4 text-gray-400 dark:text-gray-500 ml-2" />
                )}
              </a>
            );
          }
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 group ${
                isCollapsed ? 'justify-center' : ''
              } ${
                isActive
                  ? 'bg-gradient-to-r from-command-blue-50 to-action-cyan-50 dark:from-command-blue-900/30 dark:to-action-cyan-900/30 text-command-blue-700 dark:text-command-blue-300 border border-command-blue-200 dark:border-command-blue-800 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <item.icon className={`h-5 w-5 ${isCollapsed ? 'mx-auto' : 'mr-3'} ${
                isActive
                  ? 'text-command-blue-600 dark:text-command-blue-400'
                  : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'
              } transition-colors`} />
              {!isCollapsed && (
                <div className="flex-1 text-left">
                  <div className={`font-semibold ${
                    isActive ? 'text-command-blue-700 dark:text-command-blue-300' : 'dark:text-gray-200'
                  }`}>{item.label}</div>
                  <div className={`text-xs mt-0.5 ${
                    isActive
                      ? 'text-command-blue-600 dark:text-command-blue-400'
                      : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                  }`}>
                    {item.description}
                  </div>
                </div>
              )}
              {!isCollapsed && isActive && (
                <div className="w-2 h-2 bg-command-blue-600 dark:bg-command-blue-400 rounded-full shadow-lg shadow-command-blue-500/50"></div>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Section */}
      {!isCollapsed && user && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-command-blue-100 dark:bg-command-blue-900/30 rounded-full flex items-center justify-center">
              <UserIcon className="h-4 w-4 text-command-blue-600 dark:text-command-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {(user.user_metadata?.['full_name'] as string) || user.email}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
            </div>
          </div>
          {onShowTeamManagement && (
            <button
              onClick={onShowTeamManagement}
              className="w-full flex items-center px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors mb-2"
            >
              <Zap className="h-4 w-4 mr-2" />
              Team Settings
            </button>
          )}
          <button
            onClick={() => signOut?.()}
            className="w-full flex items-center px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </button>
        </div>
      )}

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="bg-gradient-to-r from-command-blue-50 to-action-cyan-50 dark:from-command-blue-900/20 dark:to-action-cyan-900/20 rounded-lg p-3">
            <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
              Need Help?
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
              Check our documentation and support resources
            </div>
            <button 
              onClick={() => onViewChange('user-manual')}
              className="text-xs text-command-blue-600 dark:text-command-blue-400 font-medium hover:text-command-blue-700 dark:hover:text-command-blue-300 transition-colors"
            >
              View User Manual →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};