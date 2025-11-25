import React from 'react';
import { ArrowLeft, LucideIcon } from 'lucide-react';
import { Button } from '../ui/button';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  showBackButton?: boolean;
  backTo?: string;
  onBack?: () => void;
  actions?: React.ReactNode;
  breadcrumbs?: { label: string; href?: string; onClick?: () => void }[];
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  icon: Icon,
  showBackButton = false,
  backTo,
  onBack,
  actions,
  breadcrumbs,
  className = ''
}) => {
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (backTo) {
      window.location.href = backTo;
    } else {
      window.history.back();
    }
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 animate-fade-in ${className}`}
    >
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="mb-4" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            {breadcrumbs.map((crumb, index) => (
              <li key={index} className="flex items-center">
                {index > 0 && <span className="mx-2">/</span>}
                {crumb.href || crumb.onClick ? (
                  <button
                    onClick={crumb.onClick || (() => { if (crumb.href) window.location.href = crumb.href; })}
                    className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  >
                    {crumb.label}
                  </button>
                ) : (
                  <span className="text-gray-900 dark:text-white font-medium">
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="p-2"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          
          <div className="flex items-center space-x-3">
            {Icon && (
              <div className="bg-command-blue-100 dark:bg-command-blue-900/30 p-2 rounded-lg">
                <Icon className="h-6 w-6 text-command-blue-600 dark:text-command-blue-400" />
              </div>
            )}
            
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {title}
              </h1>
              {subtitle && (
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
        
        {actions && (
          <div className="flex items-center space-x-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;

