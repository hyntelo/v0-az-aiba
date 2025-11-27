import type { StateCreator } from "zustand";
import type { Notification, NetworkStatus, StorageInfo } from "./types";

export interface SystemSlice {
  notifications: Notification[];
  addNotification: (n: Omit<Notification, "id" | "createdAt" | "isRead">) => void;
  markNotificationAsRead: (id: string) => void;
  dismissNotification: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  getUnreadNotificationCount: () => number;
  networkStatus: NetworkStatus;
  setNetworkStatus: (status: Partial<NetworkStatus>) => void;
  storageInfo: StorageInfo;
  updateStorageInfo: () => void;
}

export const createSystemSlice: StateCreator<SystemSlice, [], [], SystemSlice> = (set, get) => ({
  notifications: [],
  addNotification: (n) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        { ...n, id: `notif-${Date.now()}`, createdAt: new Date(), isRead: false },
      ],
    })),
  markNotificationAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n,
      ),
    })),
  dismissNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
  markAllNotificationsAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
    })),
  getUnreadNotificationCount: () =>
    get().notifications.filter((n) => !n.isRead).length,
  networkStatus: { isOnline: true, saveQueue: [], retryAttempts: 0 },
  setNetworkStatus: (status) =>
    set((state) => ({ networkStatus: { ...state.networkStatus, ...status } })),
  storageInfo: { usage: 0, quota: 0, isNearLimit: false },
  updateStorageInfo: () => {},
});
