import { create } from "zustand";

export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "neutral";
}

interface UIState {
  cartOpen: boolean;
  wishlistOpen: boolean;
  quickViewProductId: string | null;
  toasts: Toast[];
  setCartOpen: (open: boolean) => void;
  setWishlistOpen: (open: boolean) => void;
  setQuickViewProductId: (id: string | null) => void;
  addToast: (message: string, type?: Toast["type"]) => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  cartOpen: false,
  wishlistOpen: false,
  quickViewProductId: null,
  toasts: [],
  setCartOpen: (open) => set({ cartOpen: open }),
  setWishlistOpen: (open) => set({ wishlistOpen: open }),
  setQuickViewProductId: (id) => set({ quickViewProductId: id }),
  addToast: (message, type = "neutral") => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }));
    // Auto dismiss after 3 seconds
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, 3000);
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));
