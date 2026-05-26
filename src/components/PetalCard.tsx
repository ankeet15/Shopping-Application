import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface PetalCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverEffect?: boolean;
}

export const PetalCard = React.forwardRef<HTMLDivElement, PetalCardProps>(
  ({ children, className, hoverEffect = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={twMerge(
          clsx(
            "bg-petal-card border border-petal-border rounded-card shadow-card-resting transition-all duration-200 ease-out",
            hoverEffect && "hover:-translate-y-1 hover:shadow-card-hover hover:border-petal-border-hover cursor-pointer"
          ),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

PetalCard.displayName = "PetalCard";
