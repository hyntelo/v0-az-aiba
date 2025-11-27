"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, FileText, Calendar, User, Bell, X, Sparkles } from "lucide-react"
import CampaignForm from "@/components/campaign-form"
import { BriefDisplay } from "@/components/brief-display"
import { AIGenerationModal } from "@/components/ai-generation-modal"
import { AppShell } from "@/components/app-shell"
import { useAppStore } from "@/lib/store"
import ProfilePage from "./profile/page"
import SettingsPage from "./settings/page"
import BrandGuidelinesPage from "./brand-guidelines/page"
import { useEffect } from "react"
import { existingBriefs } from "@/lib/mock-data"
import { useTranslation } from "@/lib/i18n"

const statusColors = {
  draft: "bg-gray-100 text-gray-800",
  "ai-reviewed": "bg-gradient-to-r from-green-100 to-blue-100 text-green-800",
}

interface CampaignData {
  projectName: string
  department: string
  brand: string
  expectedLaunchDate: string
  specialty: string
  requestSummary: string
  objective: string
  targetAudience: string
  channels: string[]
  additionalContext: string
}

export default function Dashboard() {
  const { t } = useTranslation()

  const {
    currentView,
    setCurrentView,
    campaignData,
    currentBrief,
    resetApp,
    createdBriefs,
    userProfile,
    canAccessView,
    addCreatedBrief,
    notifications,
    markNotificationAsRead,
    dismissNotification,
    setCurrentBrief,
  } = useAppStore()

  useEffect(() => {
    console.log("[v0] Forcing reset to mock data with correct statuses")
    useAppStore.setState({ createdBriefs: [...existingBriefs] })
  }, []) // Run only once on mount

  const draftCount = createdBriefs.filter((brief) => brief.status === "draft").length
  const aiReviewedCount = createdBriefs.filter((brief) => brief.status === "ai-reviewed").length

  console.log("[v0] Dashboard stats:", {
    draftCount,
    aiReviewedCount,
    totalBriefs: createdBriefs.length,
  })

  const handleCreateBrief = () => {
    console.log("[v0] Creating new brief - clearing campaign data")
    useAppStore.getState().setCampaignData({
      projectName: "",
      department: "",
      brand: "",
      expectedLaunchDate: "",
      specialty: "",
      requestSummary: "",
      objective: "",
      targetAudience: "",
      channels: [],
      additionalContext: "",
    })
    setCurrentView("form")
  }

  const handleBriefClick = (brief: any) => {
    console.log("[v0] Opening brief:", brief.title)
    setCurrentBrief(brief)
    setCurrentView("brief")
  }

  const handleBackToDashboard = () => {
    resetApp()
  }

  const NotificationBanner = () => {
    const recentNotifications = notifications.filter((n) => !n.isRead).slice(0, 3)

    if (recentNotifications.length === 0) return null

    return (
      <div className="mb-6 space-y-3">
        {recentNotifications.map((notification) => (
          <div
            key={notification.id}
            className="bg-gradient-to-r from-[#8582FC]/10 to-[#8EB4D6]/10 border border-[#8582FC]/20 rounded-lg p-4 flex items-start justify-between hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-start gap-3 flex-1">
              <div className="w-8 h-8 rounded-full bg-[#8582FC]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bell className="w-4 h-4 text-[#8582FC]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-[#211C38] text-sm">{notification.title}</h4>
                  <div className="w-2 h-2 rounded-full bg-[#8582FC]" />
                </div>
                <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-500">{new Date(notification.createdAt).toLocaleString()}</span>
                  {notification.actionUrl && (
                    <button
                      onClick={() => {
                        markNotificationAsRead(notification.id)
                        console.log("[v0] Navigate to:", notification.actionUrl)
                      }}
                      className="text-xs text-[#8582FC] hover:text-[#8582FC]/80 font-medium"
                    >
                      View Brief →
                    </button>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => dismissNotification(notification.id)}
              className="text-gray-400 hover:text-gray-600 p-1 ml-2"
              title="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    )
  }

  if (currentView === "profile") {
    return (
      <AppShell currentPage="profile">
        <div className="p-6">
          <ProfilePage />
        </div>
      </AppShell>
    )
  }

  if (currentView === "settings") {
    return (
      <AppShell currentPage="settings">
        <div className="p-6">
          <SettingsPage />
        </div>
      </AppShell>
    )
  }

  if (currentView === "brand-guidelines") {
    return (
      <AppShell currentPage="brand-guidelines">
        <div className="p-6">
          <BrandGuidelinesPage />
        </div>
      </AppShell>
    )
  }

  if (currentView === "form") {
    return (
      <AppShell currentPage="briefs">
        <div className="p-6">
          <CampaignForm />
        </div>
        <AIGenerationModal />
      </AppShell>
    )
  }

  if (currentView === "brief") {
    return (
      <AppShell currentPage="briefs">
        <div className="p-6 pt-0">
          <div className="mb-8"></div>
          <BriefDisplay />
        </div>
        <AIGenerationModal />
      </AppShell>
    )
  }

  return (
    <AppShell currentPage="dashboard" onCreateBrief={handleCreateBrief}>
      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-medium text-foreground mb-2">{t("dashboard.yourBriefs")}</h2>
          <p className="text-muted-foreground">{t("dashboard.subtitle")}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="hyntelo-elevation-3 hover:hyntelo-elevation-6 transition-all duration-150 ease-out cursor-pointer border-2 border-[#8582FC]/20 bg-gradient-to-br from-[#8582FC]/5 to-transparent">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#8582FC]/10 flex items-center justify-center">
                <Plus className="w-6 h-6 text-[#8582FC]" />
              </div>
              <h3 className="font-medium text-[#211C38] mb-2">{t("dashboard.createNewBrief")}</h3>
              <p className="text-sm text-muted-foreground mb-4">{t("dashboard.startNewCampaign")}</p>
              <Button onClick={handleCreateBrief} size="sm" className="bg-[#8582FC] hover:bg-[#8582FC]/90 text-white">
                {t("dashboard.getStarted")}
              </Button>
            </CardContent>
          </Card>

          <Card className="hyntelo-elevation-3 hover:hyntelo-elevation-6 transition-all duration-150 ease-out">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#8EB4D6]/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-[#8EB4D6]" />
              </div>
              <h3 className="font-medium text-[#211C38] mb-2">{t("dashboard.myDrafts")}</h3>
              <p className="text-sm text-muted-foreground mb-2">
                {draftCount} {draftCount === 1 ? t("dashboard.draft") : t("dashboard.drafts")}
              </p>
              <p className="text-xs text-muted-foreground">{t("dashboard.workInProgress")}</p>
            </CardContent>
          </Card>

          <Card className="hyntelo-elevation-3 hover:hyntelo-elevation-6 transition-all duration-150 ease-out">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#8582FC]/10 to-[#8EB4D6]/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-[#8582FC]" />
              </div>
              <h3 className="font-medium text-[#211C38] mb-2">{t("dashboard.aiReviewed")}</h3>
              <p className="text-sm text-muted-foreground mb-2">
                {aiReviewedCount} {t("dashboard.completed")}
              </p>
              <p className="text-xs text-muted-foreground">{t("dashboard.readyToUse")}</p>
            </CardContent>
          </Card>

          <Card className="hyntelo-elevation-3 hover:hyntelo-elevation-6 transition-all duration-150 ease-out">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                <User className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-medium text-[#211C38] mb-2">{t("dashboard.totalBriefs")}</h3>
              <p className="text-sm text-muted-foreground mb-2">
                {createdBriefs.length} {t("dashboard.created")}
              </p>
              <p className="text-xs text-muted-foreground">{t("dashboard.allTime")}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {createdBriefs.map((brief) => (
            <Card
              key={brief.id}
              className="hyntelo-elevation-3 hover:hyntelo-elevation-6 transition-all duration-150 ease-out cursor-pointer"
              onClick={() => handleBriefClick(brief)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg font-medium text-foreground line-clamp-2">{brief.title}</CardTitle>
                  <Badge
                    variant="secondary"
                    className={`ml-2 flex items-center gap-1 ${statusColors[brief.status as keyof typeof statusColors]}`}
                  >
                    {brief.status === "ai-reviewed" && <Sparkles className="w-3 h-3" />}
                    {brief.status === "draft"
                      ? t("dashboard.statusDraft")
                      : brief.status === "ai-reviewed"
                        ? t("dashboard.statusAiReviewed")
                        : brief.status.replace("-", " ").toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="w-4 h-4" />
                  {t("dashboard.campaignBrief")}
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {t("dashboard.you")}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(brief.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {createdBriefs.length === 0 && (
          <div className="mt-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                <Plus className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">{t("dashboard.readyToCreate")}</h3>
              <p className="text-muted-foreground mb-6">{t("dashboard.getStartedDescription")}</p>
              <Button
                onClick={handleCreateBrief}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-150 ease-out hover:scale-[0.97] active:scale-[0.97]"
              >
                <Plus className="w-5 h-5 mr-2" />
                {t("dashboard.createNewBrief")}
              </Button>
            </div>
          </div>
        )}
      </div>

      <AIGenerationModal />
    </AppShell>
  )
}
