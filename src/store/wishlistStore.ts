import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistState {
  productIds: string[];
  toggleWishlist: (productId: string) => boolean;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      productIds: [],

      toggleWishlist: (productId) => {
        const ids = [...get().productIds];
        const index = ids.indexOf(productId);
        let added = false;

        if (index >= 0) {
          ids.splice(index, 1);
        } else {
          ids.push(productId);
          added = true;
        }

        set({ productIds: ids });
        return added;
      },

      isInWishlist: (productId) => {
        return get().productIds.includes(productId);
      },

      clearWishlist: () => set({ productIds: [] }),
    }),
    {
      name: "petal-wishlist-store",
    }
  )
);
