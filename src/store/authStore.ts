import { create } from "zustand";

export interface AuthUser {
  uid: string;
  email: string;
  name: string;
  role: "customer" | "admin";
}

export interface AdminNotification {
  id: string;
  orderId: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  notifications: AdminNotification[];
  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
  addNotification: (orderId: string, message: string) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  logout: () => void;
}

// Simple local storage sync helper
const getInitialUser = (): AuthUser | null => {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem("petal_session_user");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const getInitialNotifications = (): AdminNotification[] => {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem("petal_admin_notifications");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  user: getInitialUser(),
  loading: false,
  notifications: getInitialNotifications(),

  setUser: (user) => {
    set({ user });
    if (typeof window !== "undefined") {
      if (user) {
        localStorage.setItem("petal_session_user", JSON.stringify(user));
      } else {
        localStorage.removeItem("petal_session_user");
      }
    }
  },

  setLoading: (loading) => set({ loading }),

  addNotification: (orderId, message) => {
    const newNotif: AdminNotification = {
      id: `notif_${Math.random().toString(36).substring(2, 9)}`,
      orderId,
      message,
      timestamp: new Date().toISOString(),
      read: false,
    };
    set((state) => {
      const updated = [newNotif, ...state.notifications];
      if (typeof window !== "undefined") {
        localStorage.setItem("petal_admin_notifications", JSON.stringify(updated));
      }
      return { notifications: updated };
    });
  },

  markNotificationAsRead: (id) => {
    set((state) => {
      const updated = state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      if (typeof window !== "undefined") {
        localStorage.setItem("petal_admin_notifications", JSON.stringify(updated));
      }
      return { notifications: updated };
    });
  },

  clearNotifications: () => {
    set({ notifications: [] });
    if (typeof window !== "undefined") {
      localStorage.removeItem("petal_admin_notifications");
    }
  },

  logout: () => {
    set({ user: null });
    if (typeof window !== "undefined") {
      localStorage.removeItem("petal_session_user");
    }
  },
}));
