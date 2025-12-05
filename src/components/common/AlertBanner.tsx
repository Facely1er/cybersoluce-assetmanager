import React, { useState, useEffect } from 'react';
import { X, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/utils/cn';

interface AlertBannerProps {
  message: string;
  type?: 'critical' | 'warning' | 'info';
  dismissible?: boolean;
  action?: React.ReactNode;
  className?: string;
}

const AlertBanner: React.FC<AlertBannerProps> = ({
  message,
  type = 'info',
  dismissible = true,
  action,
  className,
}) => {
  const [visible, setVisible] = useState(true);
  const [isNew, setIsNew] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsNew(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (!visible) return null;
  
  // Determine icon and styles based on type
  let icon;
  let bgColor;
  let borderColor;
  let textColor;
  
  switch (type) {
    case 'critical':
      icon = <AlertCircle className="h-5 w-5 text-white" />;
      bgColor = 'bg-error-500 animate-pulse';
      borderColor = 'border-error-400';
      textColor = 'text-white';
      break;
    case 'warning':
      icon = <AlertTriangle className="h-5 w-5 text-white" />;
      bgColor = 'bg-warning-500';
      borderColor = 'border-warning-400';
      textColor = 'text-white';
      break;
    case 'info':
    default:
      icon = <Info className="h-5 w-5 text-white" />;
      bgColor = 'bg-primary-500';
      borderColor = 'border-primary-400';
      textColor = 'text-white';
  }
  
  return (
    <div 
      className={cn(
        bgColor,
        isNew ? 'animate-pulse' : '',
        borderColor,
        "px-4 py-3 shadow-sm transition-all duration-300 ease-in-out",
        className
      )}
      role="alert"
    >
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <span className="flex-shrink-0">{icon}</span>
          <p className={cn("ml-3 font-medium", textColor)}>{message}</p>
        </div>
        
        <div className="flex items-center">
          {action && <div className="mr-4">{action}</div>}
          
          {dismissible && (
            <button
              onClick={() => setVisible(false)}
              type="button"
              className={cn(
                "-mr-1 flex p-1.5 rounded-full",
                textColor,
                "hover:bg-white/20 focus:outline-none"
              )}
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertBanner;

