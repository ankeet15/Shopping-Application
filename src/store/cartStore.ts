import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string; // product_id + color + size combination
  productId: string;
  title: string;
  brand: string;
  price: number;
  image: string;
  color?: string;
  size?: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  couponCode: string | null;
  discountValue: number;
  discountType: "PERCENT" | "FIXED" | null;
  addItem: (item: Omit<CartItem, "id" | "quantity"> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  applyCoupon: (code: string, value: number, type: "PERCENT" | "FIXED") => void;
  removeCoupon: () => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getDeliveryCost: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,
      discountValue: 0,
      discountType: null,

      addItem: (item) => {
        const { productId, color = "default", size = "default", quantity = 1 } = item;
        const id = `${productId}-${color}-${size}`;

        set((state) => {
          const existingItemIndex = state.items.findIndex((i) => i.id === id);

          if (existingItemIndex >= 0) {
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex].quantity += quantity;
            return { items: updatedItems };
          }

          const newItem: CartItem = {
            id,
            productId,
            title: item.title,
            brand: item.brand,
            price: item.price,
            image: item.image,
            color: item.color,
            size: item.size,
            quantity,
          };

          return { items: [...state.items, newItem] };
        });
      },

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
          ),
        })),

      applyCoupon: (code, value, type) =>
        set({
          couponCode: code,
          discountValue: value,
          discountType: type,
        }),

      removeCoupon: () =>
        set({
          couponCode: null,
          discountValue: 0,
          discountType: null,
        }),

      clearCart: () =>
        set({
          items: [],
          couponCode: null,
          discountValue: 0,
          discountType: null,
        }),

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getDiscountAmount: () => {
        const subtotal = get().getSubtotal();
        const { discountValue, discountType } = get();

        if (!discountType) return 0;
        if (discountType === "PERCENT") {
          return (subtotal * discountValue) / 100;
        } else {
          return Math.min(subtotal, discountValue);
        }
      },

      getDeliveryCost: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0 || subtotal >= 100) return 0; // Free delivery above $100
        return 12.0; // Standard $12 delivery
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscountAmount();
        const delivery = get().getDeliveryCost();
        return Math.max(0, subtotal - discount + delivery);
      },
    }),
    {
      name: "petal-cart-store",
    }
  )
);
