import { create } from "zustand";
import { createBriefSlice, BriefSlice } from "./briefSlice";
import { createUserSlice, UserSlice } from "./userSlice";
import { createSystemSlice, SystemSlice } from "./systemSlice";
import { createNavigationSlice, NavigationSlice } from "./navigationSlice";

export type AppStore = BriefSlice & UserSlice & SystemSlice & NavigationSlice;

export const useAppStore = create<AppStore>()((...a) => ({
  ...createBriefSlice(...a),
  ...createUserSlice(...a),
  ...createSystemSlice(...a),
  ...createNavigationSlice(...a),
}));
