import { create } from "zustand";
import { MockOrder } from "@/lib/mockData";

interface OrderStore {
  orders: MockOrder[];
  setOrders: (orders: MockOrder[]) => void;
  addOrder: (order: MockOrder) => void;
  updateStatus: (orderId: string, status: string) => void;
}

const getInitialOrders = (): MockOrder[] => {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem("petal_dynamic_orders");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const useOrderStore = create<OrderStore>((set) => ({
  orders: getInitialOrders(),
  
  setOrders: (orders) => {
    set({ orders });
    if (typeof window !== "undefined") {
      localStorage.setItem("petal_dynamic_orders", JSON.stringify(orders));
    }
  },
  
  addOrder: (order) => {
    set((state) => {
      // Avoid duplicate keys
      const exists = state.orders.some((o) => o.id === order.id);
      if (exists) return state;
      const updated = [order, ...state.orders];
      if (typeof window !== "undefined") {
        localStorage.setItem("petal_dynamic_orders", JSON.stringify(updated));
      }
      return { orders: updated };
    });
  },
  
  updateStatus: (orderId, status) => {
    set((state) => {
      const updated = state.orders.map((o) =>
        o.id === orderId ? { ...o, status: status.toUpperCase() } : o
      );
      if (typeof window !== "undefined") {
        localStorage.setItem("petal_dynamic_orders", JSON.stringify(updated));
      }
      return { orders: updated };
    });
  },
}));
