"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import { RatingStar } from "./RatingStar";
import { PetalBadge } from "./PetalBadge";
import { PetalCard } from "./PetalCard";

interface ProductCardProps {
  id: string;
  image: string;
  brand: string;
  name: string;
  rating: number;
  reviewCount: number;
  price: number;
  comparePrice?: number;
  onAddToCart?: (e: React.MouseEvent) => void;
  onWishlist?: (e: React.MouseEvent) => void;
  onQuickView?: (e: React.MouseEvent) => void;
  isWishlisted?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  image,
  brand,
  name,
  rating,
  reviewCount,
  price,
  comparePrice,
  onAddToCart,
  onWishlist,
  onQuickView,
  isWishlisted = false,
}) => {
  const [hovered, setHovered] = useState(false);
  const discountPercent =
    comparePrice && comparePrice > price
      ? Math.round(((comparePrice - price) / comparePrice) * 100)
      : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full"
    >
      <PetalCard
        hoverEffect={false}
        className="group overflow-hidden flex flex-col h-[440px] relative font-dm"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onWishlist) onWishlist(e);
          }}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 shadow-sm border border-stone-100 hover:bg-white transition-colors duration-200"
          aria-label="Add to wishlist"
        >
          <Heart
            size={18}
            className={
              isWishlisted
                ? "fill-petal-rose text-petal-rose"
                : "text-petal-text-secondary hover:text-petal-rose transition-colors duration-200"
            }
          />
        </button>

        {/* Top 65% - Image Wrapper */}
        <div className="h-[62%] relative overflow-hidden bg-stone-50 rounded-t-[20px]">
          <motion.img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
            animate={{ scale: hovered ? 1.06 : 1.0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />

          {/* Quick View Overlay */}
          <div className="absolute inset-0 bg-black/5 flex items-center justify-center transition-opacity duration-300">
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                if (onQuickView) onQuickView(e);
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 10 }}
              transition={{ duration: 0.2 }}
              className="bg-white/95 backdrop-blur-sm text-petal-text-primary px-5 py-2.5 rounded-full font-semibold text-xs shadow-md hover:bg-white transition-all flex items-center gap-1.5 border border-petal-border"
            >
              <Eye size={13} />
              Quick view
            </motion.button>
          </div>

          {/* Discount Badge */}
          {discountPercent && (
            <div className="absolute top-4 left-4 z-10">
              <PetalBadge label={`−${discountPercent}%`} variant="rose" />
            </div>
          )}
        </div>

        {/* Bottom 35% - Details */}
        <div className="h-[38%] p-5 flex flex-col justify-between relative bg-white rounded-b-[20px]">
          <div className="flex flex-col gap-1 pr-10">
            <span className="text-[10px] tracking-widest font-bold uppercase text-petal-text-tertiary">
              {brand}
            </span>
            <h3 className="text-sm font-semibold text-petal-text-primary line-clamp-1 group-hover:text-petal-rose transition-colors duration-200">
              {name}
            </h3>
            <RatingStar rating={rating} reviewCount={reviewCount} className="mt-1" />
          </div>

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold text-petal-text-primary">
                Rs {price.toFixed(2)}
              </span>
              {comparePrice && comparePrice > price && (
                <span className="text-xs text-petal-text-tertiary line-through font-medium">
                  Rs {comparePrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Add to Cart Button */}
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                if (onAddToCart) onAddToCart(e);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 bg-petal-rose text-white rounded-full shadow-md hover:bg-rose-500 hover:shadow-btn-active active:shadow-sm transition-all duration-200"
              aria-label="Add to cart"
            >
              <ShoppingBag size={16} />
            </motion.button>
          </div>
        </div>
      </PetalCard>
    </motion.div>
  );
};
