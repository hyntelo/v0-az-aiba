"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Bell, Palette, Shield, Download, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAppStore } from "@/lib/store"
import { useTheme } from "next-themes"
import { useEffect } from "react"
import { useTranslation } from "@/lib/i18n"

export default function SettingsPage() {
  const { toast } = useToast()
  const { userSettings, updateUserSettings } = useAppStore()
  const { setTheme } = useTheme()
  const { t } = useTranslation()

  useEffect(() => {
    setTheme(userSettings.preferences.theme)
  }, [])

  const handleNotificationChange = (key: string, value: boolean) => {
    updateUserSettings({
      notifications: { ...userSettings.notifications, [key]: value },
    })
    toast({
      title: t("settings.toasts.notificationUpdated"),
      description: `${key} ${t(value ? "settings.toasts.notificationEnabled" : "settings.toasts.notificationDisabled")}.`,
    })
  }

  const handlePreferenceChange = (key: string, value: string | boolean) => {
    updateUserSettings({
      preferences: { ...userSettings.preferences, [key]: value },
    })
    if (key === "theme" && typeof value === "string") {
      setTheme(value)
    }
    toast({
      title: t("settings.toasts.preferencesUpdated"),
      description: t("settings.toasts.preferencesSaved"),
    })
  }

  const handlePrivacyChange = (key: string, value: string | boolean) => {
    updateUserSettings({
      privacy: { ...userSettings.privacy, [key]: value },
    })
    toast({
      title: t("settings.toasts.privacyUpdated"),
      description: t("settings.toasts.privacySaved"),
    })
  }

  const handleExportData = () => {
    toast({
      title: t("settings.toasts.dataExport"),
      description: t("settings.toasts.dataExportDesc"),
    })
  }

  const handleDeleteAccount = () => {
    toast({
      title: t("settings.toasts.accountDeletion"),
      description: t("settings.toasts.accountDeletionDesc"),
      variant: "destructive",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-foreground font-medium text-2xl">{t("settings.title")}</h1>
        <p className="text-muted-foreground">{t("settings.subtitle")}</p>
      </div>

      <div className="grid gap-6">
        {/* Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <CardTitle>{t("settings.notifications.title")}</CardTitle>
            </div>
            <CardDescription>{t("settings.notifications.description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t("settings.notifications.email")}</Label>
                  <p className="text-sm text-muted-foreground">{t("settings.notifications.emailDesc")}</p>
                </div>
                <Switch
                  checked={userSettings.notifications.email}
                  onCheckedChange={(checked) => handleNotificationChange("email", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t("settings.notifications.push")}</Label>
                  <p className="text-sm text-muted-foreground">{t("settings.notifications.pushDesc")}</p>
                </div>
                <Switch
                  checked={userSettings.notifications.push}
                  onCheckedChange={(checked) => handleNotificationChange("push", checked)}
                />
              </div>
              <Separator />
              <div className="space-y-4">
                <h4 className="font-medium">{t("settings.notifications.types")}</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>{t("settings.notifications.briefSubmitted")}</Label>
                    <Switch
                      checked={userSettings.notifications.briefSubmitted}
                      onCheckedChange={(checked) => handleNotificationChange("briefSubmitted", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>{t("settings.notifications.briefApproved")}</Label>
                    <Switch
                      checked={userSettings.notifications.briefApproved}
                      onCheckedChange={(checked) => handleNotificationChange("briefApproved", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>{t("settings.notifications.briefReturned")}</Label>
                    <Switch
                      checked={userSettings.notifications.briefReturned}
                      onCheckedChange={(checked) => handleNotificationChange("briefReturned", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>{t("settings.notifications.deadlineReminders")}</Label>
                    <Switch
                      checked={userSettings.notifications.deadlineReminders}
                      onCheckedChange={(checked) => handleNotificationChange("deadlineReminders", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>{t("settings.notifications.weeklyDigest")}</Label>
                    <Switch
                      checked={userSettings.notifications.weeklyDigest}
                      onCheckedChange={(checked) => handleNotificationChange("weeklyDigest", checked)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              <CardTitle>{t("settings.preferences.title")}</CardTitle>
            </div>
            <CardDescription>{t("settings.preferences.description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>{t("settings.preferences.language")}</Label>
                <Select
                  value={userSettings.preferences.language}
                  onValueChange={(value) => handlePreferenceChange("language", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="it">Italiano</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t("settings.preferences.timezone")}</Label>
                <Select
                  value={userSettings.preferences.timezone}
                  onValueChange={(value) => handlePreferenceChange("timezone", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/New_York">Eastern Time</SelectItem>
                    <SelectItem value="America/Chicago">Central Time</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                    <SelectItem value="Europe/London">London</SelectItem>
                    <SelectItem value="Europe/Paris">Paris</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t("settings.preferences.theme")}</Label>
                <Select
                  value={userSettings.preferences.theme}
                  onValueChange={(value) => handlePreferenceChange("theme", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t("settings.preferences.defaultTemplate")}</Label>
                <Select
                  value={userSettings.preferences.defaultTemplate}
                  onValueChange={(value) => handlePreferenceChange("defaultTemplate", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email-campaign">Email Campaign</SelectItem>
                    <SelectItem value="print-materials">Print Materials</SelectItem>
                    <SelectItem value="digital-campaign">Digital Campaign</SelectItem>
                    <SelectItem value="medical-education">Medical Education</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t("settings.preferences.autoSave")}</Label>
                  <p className="text-sm text-muted-foreground">{t("settings.preferences.autoSaveDesc")}</p>
                </div>
                <Switch
                  checked={userSettings.preferences.autoSave}
                  onCheckedChange={(checked) => handlePreferenceChange("autoSave", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t("settings.preferences.showTips")}</Label>
                  <p className="text-sm text-muted-foreground">{t("settings.preferences.showTipsDesc")}</p>
                </div>
                <Switch
                  checked={userSettings.preferences.showTips}
                  onCheckedChange={(checked) => handlePreferenceChange("showTips", checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <CardTitle>{t("settings.privacy.title")}</CardTitle>
            </div>
            <CardDescription>{t("settings.privacy.description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>{t("settings.privacy.profileVisibility")}</Label>
                <Select
                  value={userSettings.privacy.profileVisibility}
                  onValueChange={(value) => handlePrivacyChange("profileVisibility", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="team">Team Only</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t("settings.privacy.activityTracking")}</Label>
                  <p className="text-sm text-muted-foreground">{t("settings.privacy.activityTrackingDesc")}</p>
                </div>
                <Switch
                  checked={userSettings.privacy.activityTracking}
                  onCheckedChange={(checked) => handlePrivacyChange("activityTracking", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t("settings.privacy.dataCollection")}</Label>
                  <p className="text-sm text-muted-foreground">{t("settings.privacy.dataCollectionDesc")}</p>
                </div>
                <Switch
                  checked={userSettings.privacy.dataCollection}
                  onCheckedChange={(checked) => handlePrivacyChange("dataCollection", checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Management */}
        <Card>
          <CardHeader>
            <CardTitle>{t("settings.account.title")}</CardTitle>
            <CardDescription>{t("settings.account.description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>{t("settings.account.exportData")}</Label>
                <p className="text-sm text-muted-foreground">{t("settings.account.exportDataDesc")}</p>
              </div>
              <Button variant="outline" onClick={handleExportData} className="gap-2 bg-transparent">
                <Download className="h-4 w-4" />
                {t("common.export")}
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-destructive">{t("settings.account.deleteAccount")}</Label>
                <p className="text-sm text-muted-foreground">{t("settings.account.deleteAccountDesc")}</p>
              </div>
              <Button variant="destructive" onClick={handleDeleteAccount} className="gap-2">
                <Trash2 className="h-4 w-4" />
                {t("settings.account.deleteAccount")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
