import * as React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  elevated?: boolean;
  glass?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  className, 
  hoverable = false,
  elevated = false,
  glass = false,
  ...props 
}) => {
  const baseClasses = "rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm transition-smooth border-gray-200 dark:border-gray-700";
  
  const variantClasses = [
    hoverable && "card-hoverable",
    elevated && "card-elevated",
    glass && "glass-card",
  ].filter(Boolean).join(" ");

  return (
    <div
      className={`${baseClasses} ${variantClasses} ${className || ""}`}
      {...props}
    />
  );
};

Card.displayName = "Card";

export { Card };

