import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export type BadgeVariant = "rose" | "lavender" | "sky" | "sage" | "neutral";

interface PetalBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  label: string;
  variant?: BadgeVariant;
}

export const PetalBadge: React.FC<PetalBadgeProps> = ({
  label,
  variant = "neutral",
  className,
  ...props
}) => {
  const styles = {
    rose: "bg-rose-50 text-petal-rose border border-rose-100",
    lavender: "bg-purple-50 text-petal-lavender border border-purple-100",
    sky: "bg-sky-50 text-petal-sky border border-sky-100",
    sage: "bg-emerald-50 text-petal-sage border border-emerald-100",
    neutral: "bg-stone-50 text-petal-text-secondary border border-petal-border",
  };

  return (
    <span
      className={twMerge(
        clsx(
          "inline-flex items-center px-3 py-1 text-xs font-semibold rounded-badge transition-colors duration-200",
          styles[variant]
        ),
        className
      )}
      {...props}
    >
      {label}
    </span>
  );
};
