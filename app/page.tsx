"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { Plus, FileText, Calendar, User, Bell, X, Sparkles, MoreVertical, Search, ChevronUp, ChevronDown } from "lucide-react"
import CampaignForm from "@/components/campaign-form"
// BriefDisplay removed - step 6 is now the generated brief view
import { AIGenerationModal } from "@/components/ai-generation-modal"
import { AppShell } from "@/components/app-shell"
import { useAppStore } from "@/lib/store"
import ProfilePage from "./profile/page"
import SettingsPage from "./settings/page"
import BrandGuidelinesPage from "./brand-guidelines/page"
import { useEffect, useState, useMemo } from "react"
import { existingBriefs } from "@/lib/mock-data"
import { useTranslation } from "@/lib/i18n"
import type { BriefData } from "@/lib/store/types"

const statusColors = {
  draft: "bg-gray-100 text-gray-800",
  "ai-reviewed": "bg-gradient-to-r from-green-100 to-blue-100 text-green-800",
}

// Helper functions
const formatBriefId = (id: string): string => {
  // Extract numeric part from ID (e.g., "existing-brief-1" -> "1", then format as "IT-00001")
  const numericMatch = id.match(/\d+$/)
  if (numericMatch) {
    const num = numericMatch[0]
    return `IT-${num.padStart(5, "0")}`
  }
  // Fallback: use last part of ID
  const parts = id.split("-")
  const lastPart = parts[parts.length - 1]
  if (lastPart && /^\d+$/.test(lastPart)) {
    return `IT-${lastPart.padStart(5, "0")}`
  }
  return `IT-${id.slice(-5).padStart(5, "0")}`
}

const formatChannels = (channels: string[]): string => {
  return channels.join("; ")
}

const formatChannelsForTooltip = (channels: string[], t: (key: string) => string): string => {
  return channels.map((channel) => t(`form.channels.${channel}`) || channel).join(", ")
}

const formatDateTime = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")
  return `${day}/${month}/${year} ${hours}:${minutes}`
}

const formatDateShort = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = String(date.getFullYear()).slice(-2)
  return `${day}/${month}/${year}`
}

const getAuthorName = (brief: BriefData, userProfile: { name: string }): string => {
  // Extract author from statusHistory (first entry's changedBy field)
  const author = brief.statusHistory && brief.statusHistory.length > 0 
    ? brief.statusHistory[0].changedBy 
    : userProfile.name
  
  // Extract initials from user name (e.g., "Sarah Chen" -> "S. Chen")
  const nameParts = author.split(" ")
  if (nameParts.length >= 2) {
    return `${nameParts[0][0]}. ${nameParts[nameParts.length - 1]}`
  }
  return author
}

const getBriefAuthor = (brief: BriefData): string => {
  // Get the full author name from statusHistory
  return brief.statusHistory && brief.statusHistory.length > 0 
    ? brief.statusHistory[0].changedBy 
    : ""
}

interface CampaignData {
  projectName: string
  brand: string
  therapeuticArea: string
  expectedLaunchDate: string
  specialty: string
  requestSummary: string
  objective: string
  targetAudience: string
  channels: string[]
  additionalContext: string
}

type SortColumn = "id" | "title" | "author" | "brand" | "channels" | "createdAt" | "lastModified" | "status" | null
type SortDirection = "asc" | "desc"

export default function Dashboard() {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState("")
  const [sortColumn, setSortColumn] = useState<SortColumn>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [statusFilter, setStatusFilter] = useState<"all" | "draft" | "ai-reviewed">("all")

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

  // Filter and sort briefs
  const filteredAndSortedBriefs = useMemo(() => {
    // First filter by status
    let filtered = createdBriefs
    if (statusFilter !== "all") {
      filtered = createdBriefs.filter((brief) => brief.status === statusFilter)
    }
    
    // Then filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((brief) => {
        const formattedId = formatBriefId(brief.id).toLowerCase()
        const title = brief.title.toLowerCase()
        const brand = brief.campaignData.brand.toLowerCase()
        return formattedId.includes(query) || title.includes(query) || brand.includes(query)
      })
    }

    // Then sort
    if (!sortColumn) {
      return filtered
    }

    const sorted = [...filtered].sort((a, b) => {
      let aValue: string | number
      let bValue: string | number

      switch (sortColumn) {
        case "id":
          aValue = formatBriefId(a.id)
          bValue = formatBriefId(b.id)
          break
        case "title":
          aValue = a.title.toLowerCase()
          bValue = b.title.toLowerCase()
          break
        case "author":
          aValue = getAuthorName(a, userProfile).toLowerCase()
          bValue = getAuthorName(b, userProfile).toLowerCase()
          break
        case "brand":
          aValue = a.campaignData.brand.toLowerCase()
          bValue = b.campaignData.brand.toLowerCase()
          break
        case "channels":
          aValue = formatChannels(a.campaignData.channels).toLowerCase()
          bValue = formatChannels(b.campaignData.channels).toLowerCase()
          break
        case "createdAt":
          aValue = a.createdAt.getTime()
          bValue = b.createdAt.getTime()
          break
        case "lastModified":
          aValue = a.lastModified.getTime()
          bValue = b.lastModified.getTime()
          break
        case "status":
          aValue = a.status
          bValue = b.status
          break
        default:
          return 0
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
      return 0
    })

    return sorted
  }, [createdBriefs, searchQuery, sortColumn, sortDirection, userProfile, statusFilter])

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  console.log("[v0] Dashboard stats:", {
    draftCount,
    aiReviewedCount,
    totalBriefs: createdBriefs.length,
  })

  const handleCreateBrief = () => {
    console.log("[v0] Creating new brief - clearing campaign data")
    useAppStore.getState().setCampaignData({
      projectName: "",
      brand: "",
      therapeuticArea: "",
      expectedLaunchDate: "",
      specialty: "",
      requestSummary: "",
      channels: [],
      additionalContext: "",
      attachments: [],
    })
    setCurrentView("form")
  }

  const handleBriefClick = (brief: BriefData) => {
    console.log("[v0] Opening brief:", brief.title)
    setCurrentBrief(brief)
    setCurrentView("form")
    // Brief is now shown in step 6 of the form
  }

  const handleEdit = (brief: BriefData) => {
    console.log("[v0] Edit brief:", brief.id)
    setCurrentBrief(brief)
    setCurrentView("form")
    // Brief is now shown in step 6 of the form
  }

  const handleDuplicate = (brief: BriefData) => {
    console.log("[v0] Duplicate brief:", brief.id)
    // TODO: Implement duplicate functionality
  }

  const handleDelete = (brief: BriefData) => {
    console.log("[v0] Delete brief:", brief.id)
    // TODO: Implement delete functionality
  }

  const handleArchive = (brief: BriefData) => {
    console.log("[v0] Archive brief:", brief.id)
    // TODO: Implement archive functionality
  }

  const getStatusLabel = (status: string): string => {
    if (status === "draft") {
      return t("dashboard.statusDraft")
    }
    if (status === "ai-reviewed") {
      return t("dashboard.statusComplete")
    }
    if (status === "completato") {
      return t("dashboard.statusCompletato")
    }
    return status.replace("-", " ").toUpperCase()
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

  // Removed "brief" view - step 6 is now the generated brief view

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

          <Card 
            className={`hyntelo-elevation-3 hover:hyntelo-elevation-6 transition-all duration-150 ease-out cursor-pointer ${
              statusFilter === "all" 
                ? "border-2 border-green-500/30 bg-gradient-to-br from-green-500/10 to-transparent" 
                : "border-2 border-transparent"
            }`}
            onClick={() => setStatusFilter("all")}
          >
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

          <Card 
            className={`hyntelo-elevation-3 hover:hyntelo-elevation-6 transition-all duration-150 ease-out cursor-pointer ${
              statusFilter === "draft" 
                ? "border-2 border-[#8EB4D6]/30 bg-gradient-to-br from-[#8EB4D6]/10 to-transparent" 
                : "border-2 border-transparent"
            }`}
            onClick={() => setStatusFilter("draft")}
          >
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

          <Card 
            className={`hyntelo-elevation-3 hover:hyntelo-elevation-6 transition-all duration-150 ease-out cursor-pointer ${
              statusFilter === "ai-reviewed" 
                ? "border-2 border-[#8582FC]/30 bg-gradient-to-br from-[#8582FC]/10 to-transparent" 
                : "border-2 border-transparent"
            }`}
            onClick={() => setStatusFilter("ai-reviewed")}
          >
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
        </div>

        <div className="mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <h3 className="text-lg font-medium text-foreground">{t("dashboard.briefList")}</h3>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t("common.search")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {filteredAndSortedBriefs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {searchQuery
                ? "Nessun brief trovato per la ricerca"
                : createdBriefs.length === 0
                  ? t("dashboard.readyToCreate")
                  : "Nessun brief corrisponde ai criteri di ricerca"}
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <TooltipProvider delayDuration={0}>
                <div className="overflow-x-auto">
                  <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="hidden sm:table-cell w-[100px] min-w-[100px] max-w-[100px] whitespace-nowrap">
                      <button
                        onClick={() => handleSort("id")}
                        className="flex items-center gap-2 hover:text-foreground transition-colors"
                      >
                        <span>{t("dashboard.table.id")}</span>
                        {sortColumn === "id" ? (
                          sortDirection === "asc" ? (
                            <ChevronUp className="h-4 w-4 text-foreground" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-foreground" />
                          )
                        ) : (
                          <div className="h-4 w-4 flex flex-col items-center justify-center opacity-30">
                            <ChevronUp className="h-2 w-2" />
                            <ChevronDown className="h-2 w-2 -mt-0.5" />
                          </div>
                        )}
                      </button>
                    </TableHead>
                    <TableHead className="min-w-[150px] sm:min-w-[200px]">
                      <button
                        onClick={() => handleSort("title")}
                        className="flex items-center gap-2 hover:text-foreground transition-colors w-full"
                      >
                        <span className="truncate">{t("dashboard.table.title")}</span>
                        {sortColumn === "title" ? (
                          sortDirection === "asc" ? (
                            <ChevronUp className="h-4 w-4 text-foreground" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-foreground" />
                          )
                        ) : (
                          <div className="h-4 w-4 flex flex-col items-center justify-center opacity-30">
                            <ChevronUp className="h-2 w-2" />
                            <ChevronDown className="h-2 w-2 -mt-0.5" />
                          </div>
                        )}
                      </button>
                    </TableHead>
                    <TableHead className="hidden md:table-cell min-w-[120px]">
                      <button
                        onClick={() => handleSort("author")}
                        className="flex items-center gap-2 hover:text-foreground transition-colors"
                      >
                        <span className="truncate">{t("dashboard.table.author")}</span>
                        {sortColumn === "author" ? (
                          sortDirection === "asc" ? (
                            <ChevronUp className="h-4 w-4 text-foreground" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-foreground" />
                          )
                        ) : (
                          <div className="h-4 w-4 flex flex-col items-center justify-center opacity-30">
                            <ChevronUp className="h-2 w-2" />
                            <ChevronDown className="h-2 w-2 -mt-0.5" />
                          </div>
                        )}
                      </button>
                    </TableHead>
                    <TableHead className="hidden lg:table-cell min-w-[100px]">
                      <button
                        onClick={() => handleSort("brand")}
                        className="flex items-center gap-2 hover:text-foreground transition-colors"
                      >
                        <span className="truncate">{t("dashboard.table.brand")}</span>
                        {sortColumn === "brand" ? (
                          sortDirection === "asc" ? (
                            <ChevronUp className="h-4 w-4 text-foreground" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-foreground" />
                          )
                        ) : (
                          <div className="h-4 w-4 flex flex-col items-center justify-center opacity-30">
                            <ChevronUp className="h-2 w-2" />
                            <ChevronDown className="h-2 w-2 -mt-0.5" />
                          </div>
                        )}
                      </button>
                    </TableHead>
                    <TableHead className="hidden xl:table-cell min-w-[150px]">
                      <button
                        onClick={() => handleSort("channels")}
                        className="flex items-center gap-2 hover:text-foreground transition-colors"
                      >
                        <span className="truncate">{t("dashboard.table.channels")}</span>
                        {sortColumn === "channels" ? (
                          sortDirection === "asc" ? (
                            <ChevronUp className="h-4 w-4 text-foreground" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-foreground" />
                          )
                        ) : (
                          <div className="h-4 w-4 flex flex-col items-center justify-center opacity-30">
                            <ChevronUp className="h-2 w-2" />
                            <ChevronDown className="h-2 w-2 -mt-0.5" />
                          </div>
                        )}
                      </button>
                    </TableHead>
                    <TableHead className="hidden md:table-cell min-w-[100px] whitespace-nowrap">
                      <button
                        onClick={() => handleSort("createdAt")}
                        className="flex items-center gap-2 hover:text-foreground transition-colors"
                      >
                        <span>{t("dashboard.table.creationDate")}</span>
                        {sortColumn === "createdAt" ? (
                          sortDirection === "asc" ? (
                            <ChevronUp className="h-4 w-4 text-foreground" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-foreground" />
                          )
                        ) : (
                          <div className="h-4 w-4 flex flex-col items-center justify-center opacity-30">
                            <ChevronUp className="h-2 w-2" />
                            <ChevronDown className="h-2 w-2 -mt-0.5" />
                          </div>
                        )}
                      </button>
                    </TableHead>
                    <TableHead className="hidden lg:table-cell min-w-[100px] whitespace-nowrap">
                      <button
                        onClick={() => handleSort("lastModified")}
                        className="flex items-center gap-2 hover:text-foreground transition-colors"
                      >
                        <span>{t("dashboard.table.modificationDate")}</span>
                        {sortColumn === "lastModified" ? (
                          sortDirection === "asc" ? (
                            <ChevronUp className="h-4 w-4 text-foreground" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-foreground" />
                          )
                        ) : (
                          <div className="h-4 w-4 flex flex-col items-center justify-center opacity-30">
                            <ChevronUp className="h-2 w-2" />
                            <ChevronDown className="h-2 w-2 -mt-0.5" />
                          </div>
                        )}
                      </button>
                    </TableHead>
                    <TableHead className="min-w-[100px] whitespace-nowrap">
                      <button
                        onClick={() => handleSort("status")}
                        className="flex items-center gap-2 hover:text-foreground transition-colors"
                      >
                        <span>{t("dashboard.table.status")}</span>
                        {sortColumn === "status" ? (
                          sortDirection === "asc" ? (
                            <ChevronUp className="h-4 w-4 text-foreground" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-foreground" />
                          )
                        ) : (
                          <div className="h-4 w-4 flex flex-col items-center justify-center opacity-30">
                            <ChevronUp className="h-2 w-2" />
                            <ChevronDown className="h-2 w-2 -mt-0.5" />
                          </div>
                        )}
                      </button>
                    </TableHead>
                    <TableHead className="w-[50px] min-w-[50px] max-w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedBriefs.map((brief) => (
                    <TableRow key={brief.id} className="hover:bg-muted/50">
                      <TableCell className="hidden sm:table-cell font-mono text-sm w-[100px] min-w-[100px] max-w-[100px] whitespace-nowrap">{formatBriefId(brief.id)}</TableCell>
                      <TableCell className="min-w-[150px] sm:min-w-[200px] max-w-0">
                        <div className="min-w-0">
                          <button
                            onClick={() => handleBriefClick(brief)}
                            className="text-left text-[#8582FC] hover:text-[#8582FC]/80 hover:underline font-medium truncate block w-full"
                            title={brief.title}
                          >
                            {brief.title}
                          </button>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell min-w-[120px] max-w-0">
                        <div className="min-w-0 truncate" title={getAuthorName(brief, userProfile)}>
                          {getAuthorName(brief, userProfile)}
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell min-w-[100px] max-w-0">
                        <div className="min-w-0 truncate" title={brief.campaignData.brand}>
                          {brief.campaignData.brand}
                        </div>
                      </TableCell>
                      <TableCell className="hidden xl:table-cell min-w-[150px] max-w-0">
                        <TooltipPrimitive.Root>
                          <TooltipTrigger asChild>
                            <div className="min-w-0 truncate cursor-help">
                          {formatChannels(brief.campaignData.channels)}
                        </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{formatChannelsForTooltip(brief.campaignData.channels, t)}</p>
                          </TooltipContent>
                        </TooltipPrimitive.Root>
                      </TableCell>
                      <TableCell className="hidden md:table-cell min-w-[100px] whitespace-nowrap">
                        <TooltipPrimitive.Root>
                          <TooltipTrigger asChild>
                            <span className="cursor-help">{formatDateShort(brief.createdAt)}</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{formatDateTime(brief.createdAt)}</p>
                          </TooltipContent>
                        </TooltipPrimitive.Root>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell min-w-[100px] whitespace-nowrap">
                        <TooltipPrimitive.Root>
                          <TooltipTrigger asChild>
                            <span className="cursor-help">{formatDateShort(brief.lastModified)}</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{formatDateTime(brief.lastModified)}</p>
                          </TooltipContent>
                        </TooltipPrimitive.Root>
                      </TableCell>
                      <TableCell className="min-w-[100px] whitespace-nowrap">
                        <Badge
                          variant="secondary"
                          className={`flex items-center gap-1 w-fit ${statusColors[brief.status as keyof typeof statusColors]}`}
                        >
                          {brief.status === "ai-reviewed" && <Sparkles className="w-3 h-3" />}
                          {getStatusLabel(brief.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="w-[50px] min-w-[50px] max-w-[50px]">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {getBriefAuthor(brief) === userProfile.name ? (
                              <>
                                <DropdownMenuItem onClick={() => handleEdit(brief)}>
                                  {t("dashboard.actions.edit")}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDuplicate(brief)}>
                                  {t("dashboard.actions.duplicate")}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDelete(brief)} className="text-destructive">
                                  {t("dashboard.actions.delete")}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleArchive(brief)}>
                                  {t("dashboard.actions.archive")}
                                </DropdownMenuItem>
                              </>
                            ) : (
                              <DropdownMenuItem onClick={() => handleDuplicate(brief)}>
                                {t("dashboard.actions.duplicate")}
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
                </div>
              </TooltipProvider>
            </div>
          )}
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
