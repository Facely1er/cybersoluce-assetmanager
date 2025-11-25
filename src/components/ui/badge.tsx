import * as React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info";
  size?: "sm" | "md" | "lg";
}

const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "default",
  size = "md",
  ...props
}) => {
  const variantClasses = {
    default: "bg-command-blue-100 text-command-blue-800 dark:bg-command-blue-900/30 dark:text-command-blue-300",
    secondary: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
    destructive: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    outline: "text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600",
    success: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    info: "bg-action-cyan-100 text-action-cyan-800 dark:bg-action-cyan-900/30 dark:text-action-cyan-300",
  };

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-0.5 text-sm",
    lg: "px-3 py-1 text-base",
  };

  return (
    <div
      className={`
        inline-flex items-center rounded-full font-medium
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className || ""}
      `}
      {...props}
    />
  );
};

Badge.displayName = "Badge";

export { Badge };

