import type { StateCreator } from "zustand"
import type { UserProfile, UserSettings } from "./types"

const DEFAULT_AVATAR = "/sarah-chen-avatar.png"

export interface UserSlice {
  userProfile: UserProfile
  updateUserProfile: (profile: Partial<UserProfile>) => void
  userSettings: UserSettings
  updateUserSettings: (settings: Partial<UserSettings>) => void
}

export const createUserSlice: StateCreator<UserSlice, [], [], UserSlice> = (set) => ({
  userProfile: {
    id: "user-1",
    name: "Sarah Chen",
    email: "sarah.chen@example.com",
    department: "Marketing",
    role: "Brief Creator",
    title: "Marketing Manager",
    phone: "",
    location: "",
    bio: "",
    avatar: DEFAULT_AVATAR,
  },
  updateUserProfile: (profile) => set((state) => ({ userProfile: { ...state.userProfile, ...profile } })),
  userSettings: {
    notifications: {
      email: true,
      push: true,
      briefSubmitted: true,
      briefApproved: true,
      briefReturned: true,
      deadlineReminders: true,
      weeklyDigest: false,
    },
    preferences: {
      language: "it", // Changed default language from "en" to "it" (Italian)
      timezone: "UTC",
      theme: "light",
      defaultTemplate: "",
      autoSave: true,
      showTips: true,
    },
    privacy: {
      profileVisibility: "team",
      activityTracking: true,
      dataCollection: true,
    },
  },
  updateUserSettings: (settings) => set((state) => ({ userSettings: { ...state.userSettings, ...settings } })),
})
