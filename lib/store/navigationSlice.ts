import type { StateCreator } from "zustand";
import type { NavigationItem } from "./types";

export type View = "dashboard" | "form" | "brief" | "profile" | "settings" | "brand-guidelines";

export interface NavigationSlice {
  currentView: View;
  navigationHistory: View[];
  setCurrentView: (view: View) => void;
  goBack: () => void;
  canGoBack: () => boolean;
  resetApp: () => void;
  canAccessView: (view: string, role?: string) => boolean;
  getNavigationItems: (role: string) => NavigationItem[];
}

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { id: "form", label: "Form", icon: "Template" },
  { id: "brief", label: "Brief", icon: "FileText" },
  { id: "profile", label: "Profile", icon: "User" },
  { id: "settings", label: "Settings", icon: "Settings" },
  { id: "brand-guidelines", label: "Brand Guidelines", icon: "FileText" },
] satisfies NavigationItem[];

export const createNavigationSlice: StateCreator<NavigationSlice, [], [], NavigationSlice> = (
  set,
  get,
) => ({
  currentView: "dashboard",
  navigationHistory: [],
  setCurrentView: (view) =>
    set((state) => ({
      navigationHistory: [...state.navigationHistory, state.currentView],
      currentView: view,
    })),
  goBack: () =>
    set((state) => {
      const history = [...state.navigationHistory];
      const previous = history.pop() || "dashboard";
      return { currentView: previous, navigationHistory: history };
    }),
  canGoBack: () => get().navigationHistory.length > 0,
  resetApp: () => set({ currentView: "dashboard", navigationHistory: [] }),
  canAccessView: () => true,
  getNavigationItems: () => NAV_ITEMS,
});
