import * as React from "react";
import { LucideIcon } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  loading?: boolean;
  hoverLift?: boolean;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
}

const Button: React.FC<ButtonProps> = ({
  className,
  variant = "default",
  size = "default",
  loading = false,
  hoverLift = true,
  disabled,
  children,
  icon: Icon,
  iconPosition = "left",
  ...props
}) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus-enhanced disabled:opacity-50 disabled:pointer-events-none";
  
  const variantClasses = {
    default: "bg-command-blue-600 hover:bg-command-blue-700 text-white shadow-sm hover:shadow-md",
    destructive: "bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow-md",
    outline: "border border-gray-300 dark:border-gray-600 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100",
    ghost: "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100",
    link: "bg-transparent text-command-blue-600 dark:text-command-blue-400 underline-offset-4 hover:underline p-0",
  };
  
  const sizeClasses = {
    default: "h-10 py-2 px-4 text-sm",
    sm: "h-9 px-3 text-sm rounded-md",
    lg: "h-11 px-8 text-base rounded-md",
    icon: "h-10 w-10 p-0",
  };
  
  const iconSizeClasses = {
    default: "h-4 w-4",
    sm: "h-3.5 w-3.5",
    lg: "h-5 w-5",
    icon: "h-5 w-5",
  };
  
  const liftClass = hoverLift && variant !== "link" ? "btn-hover-lift" : "";
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${liftClass} ${className || ""}`;
  
  const iconSize = iconSizeClasses[size];
  const showIcon = Icon && !loading;
  const showLoading = loading;
  
  // For icon-only buttons, don't show children
  const isIconOnly = size === "icon" || (!children && Icon);
  
  return (
    <button 
      className={classes} 
      disabled={disabled || loading}
      {...props}
    >
      {showLoading && (
        <svg className={`animate-spin ${iconSize} ${children ? (iconPosition === "left" ? "-ml-1 mr-3" : "-mr-1 ml-3") : ""}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {!showLoading && showIcon && iconPosition === "left" && (
        <Icon className={`${iconSize} ${children ? "mr-2" : ""}`} />
      )}
      {!isIconOnly && children}
      {!showLoading && showIcon && iconPosition === "right" && (
        <Icon className={`${iconSize} ${children ? "ml-2" : ""}`} />
      )}
    </button>
  );
};

Button.displayName = "Button";

export { Button };

