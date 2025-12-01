"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  FileText,
  BookTemplate as Template,
  Settings,
  User,
  Bell,
  Menu,
  X,
  Plus,
  PanelLeft,
  PanelRight,
} from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/lib/store"
import { useTranslation } from "@/lib/i18n"

interface AppShellProps {
  children: React.ReactNode
  currentPage?: string
  onCreateBrief?: () => void
}

export function AppShell({ children, currentPage = "dashboard", onCreateBrief }: AppShellProps) {
  const { t } = useTranslation()
  const {
    currentView,
    setCurrentView,
    userProfile,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    getUnreadNotificationCount,
    canAccessView,
    getNavigationItems,
  } = useAppStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const unreadCount = getUnreadNotificationCount()

  const navigationItems = getNavigationItems(userProfile.role)
    .filter((item) => {
      const allowedItems = ["dashboard", "brand-guidelines", "settings"]
      return allowedItems.includes(item.id)
    })
    .map((item) => ({
      ...item,
      label: t(`appShell.${item.id}`) || item.label, // Translate label
      icon:
        item.icon === "LayoutDashboard"
          ? LayoutDashboard
          : item.icon === "FileText"
            ? FileText
            : item.icon === "Template"
              ? Template
              : item.icon === "Settings"
                ? Settings
                : item.icon === "User"
                  ? User
                  : LayoutDashboard,
    }))

  const formatRelativeTime = (date: Date | string | number | undefined): string => {
    if (!date) {
      console.warn("[v0] No date provided to formatRelativeTime")
      return t("common.unknown")
    }

    const now = new Date()
    let notificationDate: Date

    if (date instanceof Date) {
      notificationDate = date
    } else if (typeof date === "string" || typeof date === "number") {
      notificationDate = new Date(date)
    } else {
      console.warn("[v0] Invalid date format:", date)
      return t("common.unknown")
    }

    if (isNaN(notificationDate.getTime())) {
      console.warn("[v0] Invalid date value:", date)
      return t("common.unknown")
    }

    const diffInMinutes = Math.floor((now.getTime() - notificationDate.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return t("common.justNow")
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const handleNotificationClick = (notification: any) => {
    if (!notification.isRead) {
      markNotificationAsRead(notification.id)
    }
    // In a real app, this would navigate to the brief
    console.log("[v0] Navigate to:", notification.actionUrl)
  }

  const handleNavigation = (itemId: string) => {
    if (!canAccessView(itemId, userProfile.role)) {
      console.warn("[v0] Access denied to view:", itemId, "for role:", userProfile.role)
      return
    }

    setCurrentView(itemId as any)
    setSidebarOpen(false) // Close mobile sidebar on navigation
  }

  const handleProfileClick = () => {
    setCurrentView("profile")
  }

  const handleSettingsClick = () => {
    setCurrentView("settings")
  }

  const pageTitle =
    currentView === "profile"
      ? t("appShell.profile")
      : currentView === "form"
        ? t("appShell.newBrief")
        : currentView === "brief"
          ? t("appShell.generatedBrief")
          : currentView === "brand-guidelines"
            ? t("appShell.brand-guidelines")
            : currentView === "settings"
              ? t("appShell.settings")
              : t("appShell.dashboard")

  return (
    <div className="min-h-screen bg-background">

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-sidebar border-r border-sidebar-border transform transition-all duration-200 ease-in-out lg:translate-x-0",
          sidebarCollapsed ? "w-16" : "w-64",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar Header */}
          <div
            className={cn(
              "flex h-16 items-center justify-between border-b border-sidebar-border transition-all duration-200 px-4",
            )}
          >
            <div className={cn("flex items-center gap-3 min-w-0", !sidebarCollapsed && "flex-1")}>
              <Image
                src="/logo-small.png"
                alt="Logo"
                width={24}
                height={24}
                className="flex-shrink-0 h-6 w-6"
              />
              {!sidebarCollapsed && (
                <span className="text-[rgba(133,130,252,1)] font-medium text-xs text-left truncate">Brief Assistant</span>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 flex-shrink-0"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              {sidebarCollapsed ? <PanelRight className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = currentView === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={cn(
                    "w-full flex items-center text-sm font-medium rounded-lg transition-colors",
                    sidebarCollapsed ? "justify-center px-3 py-3" : "gap-3 px-3 py-2",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                  )}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!sidebarCollapsed && item.label}
                </button>
              )
            })}
          </nav>

          {/* User Profile */}
          <div className="border-t border-sidebar-border p-4">
            <button
              onClick={handleProfileClick}
              className={cn(
                "w-full flex items-center transition-all duration-200 ease-out rounded-lg p-2 -m-2",
                "hover:bg-sidebar-accent/30 hover:scale-[1.02] active:scale-[0.98]",
                sidebarCollapsed ? "justify-center" : "gap-3",
              )}
              title={sidebarCollapsed ? "Profile" : undefined}
            >
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src={userProfile.avatar || "/placeholder.svg"} />
                <AvatarFallback>
                  {userProfile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              {!sidebarCollapsed && (
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">{userProfile.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{userProfile.title}</p>
                </div>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className={cn("transition-all duration-200 ease-in-out", sidebarCollapsed ? "lg:pl-16" : "lg:pl-64")}>
        {/* Top header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 px-6">
          {/* Mobile menu button */}
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>

          {/* Page title */}
          <div className="flex-1">
            <h1 className="font-medium text-foreground text-base">{pageTitle}</h1>
          </div>

          {/* Header actions */}
          <div className="flex items-center gap-3">
            {onCreateBrief && (
              <Button
                onClick={onCreateBrief}
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-150 ease-out hover:scale-[0.97] active:scale-[0.97]"
              >
                <Plus className="w-4 h-4 mr-2" />
                {t("appShell.newBrief")}
              </Button>
            )}

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between px-3 py-2">
                  <DropdownMenuLabel className="p-0">{t("appShell.notifications")}</DropdownMenuLabel>
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-1 text-xs text-muted-foreground hover:text-foreground"
                      onClick={markAllNotificationsAsRead}
                    >
                      {t("appShell.markAllRead")}
                    </Button>
                  )}
                </div>
                <DropdownMenuSeparator />
                {notifications.length === 0 ? (
                  <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                    {t("appShell.noNotifications")}
                  </div>
                ) : (
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.slice(0, 10).map((notification) => (
                      <DropdownMenuItem
                        key={notification.id}
                        className="flex flex-col items-start gap-1 p-3 cursor-pointer hover:bg-accent/50"
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-center gap-2 w-full">
                          <span
                            className={cn(
                              "font-medium text-sm",
                              !notification.isRead && "text-foreground",
                              notification.isRead && "text-muted-foreground",
                            )}
                          >
                            {notification.title}
                          </span>
                          {!notification.isRead && <div className="h-2 w-2 rounded-full bg-accent-violet" />}
                        </div>
                        <span className="text-xs text-muted-foreground line-clamp-2">{notification.message}</span>
                        <span className="text-xs text-muted-foreground/70">
                          {formatRelativeTime(notification.createdAt)}
                        </span>
                      </DropdownMenuItem>
                    ))}
                    {notifications.length > 10 && (
                      <div className="px-3 py-2 text-center text-xs text-muted-foreground border-t">
                        +{notifications.length - 10} {t("appShell.moreNotifications")}
                      </div>
                    )}
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={userProfile.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {userProfile.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{userProfile.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{userProfile.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleProfileClick}>
                  <User className="mr-2 h-4 w-4" />
                  <span>{t("appShell.profile")}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSettingsClick}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>{t("appShell.settings")}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <span>{t("appShell.logOut")}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1">{children}</main>
      </div>

      {/* Mobile sidebar close button */}
      {sidebarOpen && (
        <Button
          variant="ghost"
          size="sm"
          className="fixed top-4 right-4 z-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="h-5 w-5" />
        </Button>
      )}
    </div>
  )
}
