"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Tag, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useUIStore } from "@/store/uiStore";
import { QuantityStepper } from "./QuantityStepper";
import { validateCoupon } from "@/lib/db";

export const CartDrawer: React.FC = () => {
  const router = useRouter();
  const { cartOpen, setCartOpen, addToast } = useUIStore();
  const {
    items,
    removeItem,
    updateQuantity,
    couponCode,
    applyCoupon,
    removeCoupon,
    getSubtotal,
    getDiscountAmount,
    getDeliveryCost,
    getTotal,
  } = useCartStore();

  const [couponInput, setCouponInput] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const delivery = getDeliveryCost();
  const total = getTotal();

  const freeDeliveryThreshold = 100;
  const progressPercent = Math.min((subtotal / freeDeliveryThreshold) * 100, 100);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setCouponLoading(true);
    const valid = await validateCoupon(couponInput.trim());
    setCouponLoading(false);

    if (valid) {
      applyCoupon(valid.code, valid.value, valid.type);
      addToast(`Coupon "${valid.code}" applied successfully!`, "success");
      setCouponInput("");
    } else {
      addToast("Invalid or expired coupon code.", "error");
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    addToast("Coupon removed.", "neutral");
  };

  const handleCheckoutClick = () => {
    setCartOpen(false);
    router.push("/checkout");
  };

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          {/* Dark Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 bg-black/20 z-[90] backdrop-blur-sm cursor-pointer"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-[420px] bg-white rounded-l-[24px] shadow-2xl z-[91] flex flex-col font-dm border-l border-petal-border"
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-petal-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="font-playfair text-xl italic font-bold text-petal-text-primary">
                  Your bag
                </h3>
                <span className="bg-petal-subtle text-petal-lavender text-xs font-bold px-3 py-1 rounded-badge border border-purple-50">
                  {items.reduce((sum, item) => sum + item.quantity, 0)} items
                </span>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-600 transition-colors"
                aria-label="Close cart"
              >
                <X size={18} />
              </button>
            </div>

            {/* Free Delivery Progress */}
            {items.length > 0 && (
              <div className="px-6 py-4 bg-petal-canvas border-b border-petal-border/60 text-left">
                <div className="text-xs font-semibold text-petal-text-secondary mb-2 flex items-center justify-between">
                  {subtotal >= freeDeliveryThreshold ? (
                    <span className="text-petal-sage font-bold flex items-center gap-1.5">
                      ✓ Qualified for Free Standard Delivery
                    </span>
                  ) : (
                    <span>
                      Spend <strong className="text-petal-text-primary">${(freeDeliveryThreshold - subtotal).toFixed(2)}</strong> more for free delivery
                    </span>
                  )}
                  <span className="text-[10px] text-stone-400">{Math.round(progressPercent)}%</span>
                </div>
                <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-petal-sage rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}

            {/* Drawer Items Scroll Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {items.length > 0 ? (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 pb-4 border-b border-stone-50 last:border-0 last:pb-0"
                  >
                    {/* Item Image */}
                    <div className="w-16 h-16 rounded-[12px] bg-stone-50 border border-stone-100 overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>

                    {/* Item details */}
                    <div className="flex-1 flex flex-col justify-between text-left">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-bold text-petal-text-primary line-clamp-1">
                            {item.title}
                          </h4>
                          <span className="text-xs font-bold text-petal-text-primary">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                        <span className="text-[10px] uppercase font-bold text-petal-text-tertiary tracking-wide mt-0.5 block">
                          {item.brand}
                        </span>
                        {/* Variant details */}
                        <div className="flex items-center gap-2 mt-1">
                          {item.color && item.color !== "default" && (
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-stone-200"
                              style={{ backgroundColor: item.color }}
                            />
                          )}
                          {item.size && item.size !== "default" && (
                            <span className="text-[10px] font-bold text-petal-text-secondary bg-stone-50 px-2 py-0.5 rounded-badge border border-petal-border">
                              {item.size}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity Stepper + Trash */}
                      <div className="flex items-center justify-between mt-2.5">
                        <QuantityStepper
                          value={item.quantity}
                          onChange={(qty) => updateQuantity(item.id, qty)}
                          className="h-8 px-1"
                        />
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-stone-400 hover:text-petal-rose p-1.5 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                /* Empty state */
                <div className="flex flex-col items-center justify-center py-20 text-center select-none">
                  <div className="w-24 h-24 text-petal-rose/40 mb-6 flex items-center justify-center bg-rose-50/50 rounded-full border border-rose-100">
                    <ShoppingBag size={42} className="stroke-[1.3]" />
                  </div>
                  <h4 className="font-playfair text-xl italic font-bold text-petal-text-primary mb-2">
                    Your bag is empty
                  </h4>
                  <p className="text-xs text-petal-text-secondary max-w-[220px] leading-relaxed mb-6 font-medium">
                    Rest your eyes on our collections and add a touch of warm simplicity to your sanctuary.
                  </p>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="bg-petal-rose text-white font-semibold text-xs px-6 py-2.5 rounded-button shadow-md hover:bg-rose-500 transition-all duration-200"
                  >
                    Browse Collections
                  </button>
                </div>
              )}
            </div>

            {/* Drawer Footer Summary (only if items exist) */}
            {items.length > 0 && (
              <div className="p-6 border-t border-petal-border bg-petal-canvas rounded-t-[20px] text-left">
                {/* Coupon HUD */}
                {couponCode ? (
                  <div className="bg-purple-50 border border-purple-100 rounded-badge px-3.5 py-2 flex items-center justify-between text-xs text-petal-lavender font-bold mb-5">
                    <span className="flex items-center gap-1.5">
                      <Tag size={13} />
                      Coupon &ldquo;{couponCode}&rdquo; active (-${discount.toFixed(2)})
                    </span>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-stone-400 hover:text-petal-rose font-bold ml-2 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2 mb-5">
                    <input
                      type="text"
                      placeholder="Coupon Code (e.g. SLOW10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 bg-white border border-petal-border rounded-input px-3 py-2 text-xs text-petal-text-primary placeholder-petal-text-tertiary focus:outline-none focus:border-petal-lavender focus:ring-2 focus:ring-petal-lavender/10 transition-all duration-200"
                    />
                    <button
                      type="submit"
                      disabled={couponLoading}
                      className="bg-purple-50 hover:bg-petal-subtle text-petal-lavender font-semibold text-xs px-4 rounded-button border border-purple-100 hover:border-petal-lavender transition-all duration-200"
                    >
                      Apply
                    </button>
                  </form>
                )}

                {/* Subtotals Block */}
                <div className="space-y-2.5 text-xs text-petal-text-secondary font-medium mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-petal-text-primary">${subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-petal-rose">
                      <span>Discount</span>
                      <span>−${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span className="text-petal-text-primary">
                      {delivery === 0 ? "Free" : `$${delivery.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-petal-text-primary pt-2.5 border-t border-stone-200/60">
                    <span className="font-playfair text-base italic">Total</span>
                    <span className="font-playfair text-lg font-bold">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Place Order Checkout CTA */}
                <button
                  onClick={handleCheckoutClick}
                  className="w-full bg-petal-rose text-white font-semibold text-[15px] py-3.5 rounded-button shadow-md hover:bg-rose-500 hover:shadow-btn-active transition-all duration-200 flex items-center justify-center gap-2"
                >
                  Go to Checkout
                  <ArrowRight size={15} />
                </button>
                <button
                  onClick={() => setCartOpen(false)}
                  className="w-full text-center text-xs font-bold text-petal-text-secondary hover:text-petal-rose transition-colors duration-200 mt-4 block"
                >
                  Continue browsing
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
