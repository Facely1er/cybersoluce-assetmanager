import React from 'react';
import { ArrowUp, ArrowDown, ArrowRight } from 'lucide-react';
import { cn } from '@/utils/cn';

interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  icon: React.ReactNode;
  status?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  className?: string;
  loading?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  trend,
  trendValue,
  icon,
  status = 'neutral',
  className = '',
  loading = false,
}) => {
  // Determine colors based on status
  let bgClass;
  let iconClass;
  
  switch (status) {
    case 'success':
      bgClass = 'bg-gradient-to-br from-success-500/20 to-success-600/10 dark:from-success-500/30 dark:to-success-600/20';
      iconClass = 'text-success-500 bg-success-100 dark:bg-success-900/30';
      break;
    case 'warning':
      bgClass = 'bg-gradient-to-br from-warning-500/20 to-warning-600/10 dark:from-warning-500/30 dark:to-warning-600/20';
      iconClass = 'text-warning-500 bg-warning-100 dark:bg-warning-900/30';
      break;
    case 'error':
      bgClass = 'bg-gradient-to-br from-error-500/20 to-error-600/10 dark:from-error-500/30 dark:to-error-600/20';
      iconClass = 'text-error-500 bg-error-100 dark:bg-error-900/30';
      break;
    case 'info':
      bgClass = 'bg-gradient-to-br from-primary-500/20 to-primary-600/10 dark:from-primary-500/30 dark:to-primary-600/20';
      iconClass = 'text-primary-500 bg-primary-100 dark:bg-primary-900/30';
      break;
    case 'neutral':
    default:
      bgClass = 'bg-white dark:bg-dark-700';
      iconClass = 'text-gray-500 bg-gray-100 dark:bg-dark-600';
  }

  // Determine trend icon and color
  let trendIcon;
  let trendColor;
  
  switch (trend) {
    case 'up':
      trendIcon = <ArrowUp className="w-4 h-4" />;
      trendColor = 'text-success-500';
      break;
    case 'down':
      trendIcon = <ArrowDown className="w-4 h-4" />;
      trendColor = 'text-error-500';
      break;
    case 'stable':
      trendIcon = <ArrowRight className="w-4 h-4" />;
      trendColor = 'text-gray-500 dark:text-gray-400';
      break;
    default:
      trendIcon = null;
      trendColor = '';
  }

  return (
    <div className={cn(
      "rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg",
      bgClass,
      className
    )}>
      <div className="p-4">
        <div className="flex items-center">
          {/* Icon */}
          <div className={cn("p-2 rounded-lg", iconClass)}>
            {icon}
          </div>
          
          {/* Title */}
          <h3 className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
            {title}
          </h3>
        </div>
        
        {/* Value */}
        <div className="mt-4">
          {loading ? (
            <div className="h-8 bg-gray-200 dark:bg-dark-600 rounded animate-pulse"></div>
          ) : (
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {value}
            </p>
          )}
        </div>
        
        {/* Trend */}
        {(trend || trendValue) && !loading && (
          <div className="mt-1 flex items-center">
            {trendIcon && (
              <span className={trendColor}>
                {trendIcon}
              </span>
            )}
            {trendValue && (
              <span className={cn("text-xs font-medium ml-1", trendColor)}>
                {trendValue}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;

