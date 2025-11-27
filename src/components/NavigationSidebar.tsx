import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import { 
  Home, 
  Shield, 
  BarChart3, 
  Settings, 
  FileText, 
  Users,
  Activity,
  BookOpen,
  User as UserIcon,
  Zap,
  LogOut,
  Target,
  Play,
  Database,
  Network,
  Lock,
  AlertTriangle,
  CheckCircle2,
  Building2,
  TrendingUp,
  Code,
  Gift,
  Globe,
  HelpCircle,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { ThemeToggle } from './common/ThemeToggle';
import { Logo } from './common/Logo';

type NavigationItem = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  external?: boolean;
  href?: string;
  group?: string; // For visual grouping
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
  const location = useLocation();
  
  // State to track which groups are expanded/collapsed
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['core', 'security', 'compliance', 'tools', 'system']));
  
  // Toggle group expansion
  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };
  
  // Helper to get route path for a view
  const getViewPath = (viewId: string) => {
    if (viewId === 'dashboard') {
      return '/dashboard';
    }
    return `/dashboard/${viewId}`;
  };
  
  // Determine if a view is active based on current location
  const isViewActive = (viewId: string) => {
    const currentPath = location.pathname;
    if (viewId === 'dashboard') {
      return currentPath === '/dashboard' || currentPath === '/dashboard/';
    }
    return currentPath === `/dashboard/${viewId}`;
  };

  // Organized navigation groups for better visual hierarchy
  const navigationGroups = [
    {
      id: 'core',
      label: 'Core',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: Home,
          description: 'Overview and analytics',
          group: 'core'
        },
        {
          id: 'assets',
          label: 'Assets',
          icon: Shield,
          description: 'Manage your inventory',
          group: 'core'
        },
        {
          id: 'analytics',
          label: 'Analytics',
          icon: BarChart3,
          description: 'Reports and insights',
          group: 'core'
        }
      ]
    },
    {
      id: 'security',
      label: 'Security & Risk',
      items: [
        {
          id: 'vulnerabilities',
          label: 'Vulnerabilities',
          icon: AlertTriangle,
          description: 'Security issues',
          group: 'security'
        },
        {
          id: 'data-protection',
          label: 'Data Protection',
          icon: Lock,
          description: 'Security controls & data protection',
          group: 'security'
        },
        {
          id: 'mitigation',
          label: 'Mitigation',
          icon: CheckCircle2,
          description: 'Risk mitigation planning',
          group: 'security'
        },
        {
          id: 'dependencies',
          label: 'Dependencies',
          icon: Network,
          description: 'Asset dependencies mapping',
          group: 'security'
        },
        {
          id: 'business-impact',
          label: 'Business Impact',
          icon: Building2,
          description: 'BIA and continuity planning',
          group: 'security'
        }
      ]
    },
    {
      id: 'compliance',
      label: 'Compliance & Privacy',
      items: [
        {
          id: 'compliance',
          label: 'Compliance',
          icon: FileText,
          description: 'Framework management',
          group: 'compliance'
        },
        {
          id: 'privacy-compliance',
          label: 'Privacy & Data',
          icon: Database,
          description: 'Privacy compliance & data protection',
          group: 'compliance'
        },
        {
          id: 'nist',
          label: 'NIST Framework',
          icon: Shield,
          description: 'NIST CSF implementation',
          group: 'compliance'
        },
        {
          id: 'framework',
          label: 'Framework',
          icon: TrendingUp,
          description: 'Implementation tracking',
          group: 'compliance'
        }
      ]
    },
    {
      id: 'tools',
      label: 'Tools & Resources',
      items: [
        {
          id: 'workflow',
          label: 'Setup Workflow',
          icon: Target,
          description: 'Guided setup and roadmap',
          group: 'tools'
        },
        {
          id: 'demo-scenarios',
          label: 'Demo Scenarios',
          icon: Play,
          description: 'Industry use cases and demos',
          group: 'tools'
        },
        {
          id: 'free-tools',
          label: 'Free Tools',
          icon: Gift,
          description: 'Browser-based asset evaluation tools',
          external: true,
          href: '/tools/',
          group: 'tools'
        },
        {
          id: 'data-normalization',
          label: 'Data Normalization',
          icon: Code,
          description: 'Transform and standardize data',
          group: 'tools'
        }
      ]
    },
    {
      id: 'system',
      label: 'System',
      items: [
        {
          id: 'organizations',
          label: 'Organizations',
          icon: Building2,
          description: 'Manage entities',
          group: 'system'
        },
        {
          id: 'users',
          label: 'Users',
          icon: Users,
          description: 'User management',
          group: 'system'
        },
        {
          id: 'activity',
          label: 'Activity Log',
          icon: Activity,
          description: 'System activity',
          group: 'system'
        },
        {
          id: 'settings',
          label: 'Settings',
          icon: Settings,
          description: 'System configuration',
          group: 'system'
        },
        {
          id: 'user-manual',
          label: 'User Manual',
          icon: BookOpen,
          description: 'Help and documentation',
          group: 'system'
        },
        {
          id: 'help',
          label: 'Help & Support',
          icon: HelpCircle,
          description: 'Additional support',
          group: 'system'
        }
      ]
    }
  ];

  return (
    <div className={`bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-r border-gray-200/60 dark:border-gray-800/60 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    } flex flex-col h-screen shadow-sm flex-shrink-0`}>
      {/* Header - Enhanced */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className={`flex items-center gap-3 ${isCollapsed ? 'flex-col' : 'justify-between'}`}>
          {!isCollapsed ? (
            <Logo size="md" showText={true} />
          ) : (
            <Logo size="sm" showText={false} />
          )}
          <div className={`flex items-center gap-1.5 ${isCollapsed ? 'flex-col w-full' : ''}`}>
            <ThemeToggle className={isCollapsed ? 'w-full' : ''} />
            <button
              onClick={onToggleCollapse}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-command-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 flex-shrink-0"
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
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

      {/* Navigation Items - Enhanced with Grouping */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
        <div className="p-4 space-y-6">
          {navigationGroups.map((group, groupIndex) => {
            const hasItems = group.items.length > 0;
            if (!hasItems) return null;

            const isExpanded = expandedGroups.has(group.id);
            const hasActiveItem = group.items.some(item => isViewActive(item.id));

            return (
              <div key={group.id} className="space-y-2">
                {/* Group Header - Collapsible */}
                {!isCollapsed && (
                  <button
                    onClick={() => toggleGroup(group.id)}
                    className="w-full flex items-center justify-between px-3 py-2 mb-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors group"
                    aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${group.label}`}
                  >
                    <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                      {group.label}
                    </h3>
                    <ChevronDown 
                      className={`h-3.5 w-3.5 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${
                        isExpanded ? 'rotate-0' : '-rotate-90'
                      }`}
                    />
                  </button>
                )}

                {/* Group Items - Conditionally rendered */}
                {(!isCollapsed ? isExpanded : true) && (
                  <div className="space-y-1">
                  {group.items.map((item) => {
                    const navItem = item as NavigationItem;
                    const isExternal = navItem.external === true;
                    const href = navItem.href;
                    const isActive = isViewActive(item.id) || activeView === item.id;

                    // Render external link
                    if (isExternal && href) {
                      return (
                        <a
                          key={item.id}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${
                            isCollapsed ? 'justify-center px-2' : ''
                          } ${
                            isActive
                              ? 'bg-gradient-to-r from-command-blue-50 to-action-cyan-50 dark:from-command-blue-900/30 dark:to-action-cyan-900/30 text-command-blue-700 dark:text-command-blue-300 border border-command-blue-200 dark:border-command-blue-800 shadow-sm'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-white'
                          }`}
                          title={isCollapsed ? item.label : undefined}
                          aria-label={item.label}
                        >
                          <item.icon className={`flex-shrink-0 ${isCollapsed ? 'h-5 w-5' : 'h-4 w-4'} ${
                            isActive
                              ? 'text-command-blue-600 dark:text-command-blue-400'
                              : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200'
                          } transition-colors`} />
                          {!isCollapsed && (
                            <>
                              <div className="flex-1 min-w-0">
                                <div className={`text-sm font-medium truncate ${
                                  isActive ? 'text-command-blue-700 dark:text-command-blue-300' : 'text-gray-900 dark:text-gray-100'
                                }`}>
                                  {item.label}
                                </div>
                                <div className={`text-xs mt-0.5 truncate ${
                                  isActive
                                    ? 'text-command-blue-600/80 dark:text-command-blue-400/80'
                                    : 'text-gray-500 dark:text-gray-400'
                                }`}>
                                  {item.description}
                                </div>
                              </div>
                              <Globe className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500 flex-shrink-0 ml-1" />
                            </>
                          )}
                          {!isCollapsed && isActive && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-command-blue-600 dark:bg-command-blue-400 rounded-r-full"></div>
                          )}
                        </a>
                      );
                    }

                    // Render internal link
                    return (
                      <Link
                        key={item.id}
                        to={getViewPath(item.id)}
                        onClick={() => onViewChange(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${
                          isCollapsed ? 'justify-center px-2' : ''
                        } ${
                          isActive
                            ? 'bg-gradient-to-r from-command-blue-50 to-action-cyan-50 dark:from-command-blue-900/30 dark:to-action-cyan-900/30 text-command-blue-700 dark:text-command-blue-300 border border-command-blue-200 dark:border-command-blue-800 shadow-sm'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-white'
                        }`}
                        title={isCollapsed ? item.label : undefined}
                        aria-label={item.label}
                      >
                        <item.icon className={`flex-shrink-0 ${isCollapsed ? 'h-5 w-5' : 'h-4 w-4'} ${
                          isActive
                            ? 'text-command-blue-600 dark:text-command-blue-400'
                            : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200'
                        } transition-colors`} />
                        {!isCollapsed && (
                          <div className="flex-1 min-w-0">
                            <div className={`text-sm font-medium truncate ${
                              isActive ? 'text-command-blue-700 dark:text-command-blue-300' : 'text-gray-900 dark:text-gray-100'
                            }`}>
                              {item.label}
                            </div>
                            <div className={`text-xs mt-0.5 truncate ${
                              isActive
                                ? 'text-command-blue-600/80 dark:text-command-blue-400/80'
                                : 'text-gray-500 dark:text-gray-400'
                            }`}>
                              {item.description}
                            </div>
                          </div>
                        )}
                        {!isCollapsed && isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-command-blue-600 dark:bg-command-blue-400 rounded-r-full"></div>
                        )}
                      </Link>
                    );
                  })}
                  </div>
                )}

                {/* Group Separator */}
                {groupIndex < navigationGroups.length - 1 && !isCollapsed && (
                  <div className="my-4 border-t border-gray-200 dark:border-gray-700/50"></div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* User Section - Enhanced */}
      {!isCollapsed && user && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-200 dark:border-gray-800">
            <div className="w-9 h-9 bg-gradient-to-br from-command-blue-100 to-action-cyan-100 dark:from-command-blue-900/40 dark:to-action-cyan-900/40 rounded-lg flex items-center justify-center flex-shrink-0">
              <UserIcon className="h-5 w-5 text-command-blue-600 dark:text-command-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {(user.user_metadata?.['full_name'] as string) || user.email}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
            </div>
          </div>
          <div className="space-y-1.5">
            {onShowTeamManagement && (
              <button
                onClick={onShowTeamManagement}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="Team Settings"
              >
                <Zap className="h-4 w-4" />
                <span>Team Settings</span>
              </button>
            )}
            <button
              onClick={() => signOut?.()}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              aria-label="Sign Out"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* Footer - Enhanced */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-command-blue-50/80 to-action-cyan-50/80 dark:from-command-blue-900/20 dark:to-action-cyan-900/20 rounded-xl p-4 border border-command-blue-100 dark:border-command-blue-900/30">
            <div className="flex items-start gap-3 mb-2">
              <HelpCircle className="h-5 w-5 text-command-blue-600 dark:text-command-blue-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                  Need Help?
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  Check our documentation and support resources
                </div>
              </div>
            </div>
            <button 
              onClick={() => onViewChange('user-manual')}
              className="w-full mt-3 text-xs text-command-blue-600 dark:text-command-blue-400 font-semibold hover:text-command-blue-700 dark:hover:text-command-blue-300 transition-colors flex items-center gap-1.5 justify-center"
              aria-label="View User Manual"
            >
              <span>View User Manual</span>
              <span>→</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};