import React from "react";
import { Star } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface RatingStarProps extends React.HTMLAttributes<HTMLDivElement> {
  rating: number;
  reviewCount?: number;
  showCount?: boolean;
}

export const RatingStar: React.FC<RatingStarProps> = ({
  rating,
  reviewCount,
  showCount = true,
  className,
  ...props
}) => {
  const roundedRating = Math.round(rating);

  return (
    <div
      className={twMerge("flex items-center gap-1.5 font-dm", className)}
      {...props}
    >
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            className={clsx(
              star <= roundedRating
                ? "fill-petal-rose text-petal-rose"
                : "text-stone-200 fill-stone-100"
            )}
          />
        ))}
      </div>
      {showCount && reviewCount !== undefined && (
        <span className="text-xs text-petal-text-secondary font-medium">
          ({reviewCount})
        </span>
      )}
    </div>
  );
};
