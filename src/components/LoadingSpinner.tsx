"use client";

import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  text?: string;
}

export function LoadingSpinner({ 
  className, 
  size = "md", 
  text = "Generating your image..." 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  };

  return (
    <div className={cn("flex flex-col items-center justify-center space-y-4", className)}>
      <div className="relative">
        <div className={cn(
          "animate-spin rounded-full border-4 border-slate-200 border-t-blue-600",
          sizeClasses[size]
        )} />
        <div className={cn(
          "absolute inset-0 animate-pulse rounded-full border-4 border-transparent border-t-blue-400 opacity-50",
          sizeClasses[size]
        )} />
      </div>
      {text && (
        <p className={cn(
          "text-slate-600 dark:text-slate-300 font-medium animate-pulse",
          textSizeClasses[size]
        )}>
          {text}
        </p>
      )}
    </div>
  );
}