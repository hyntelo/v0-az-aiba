"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Lightbulb, Loader2, MessageSquare } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { useEffect } from "react"
import { demoData } from "@/lib/mock-data"
import { FileUpload } from "@/components/file-upload"
import { useTranslation } from "@/lib/i18n"

interface CampaignFormProps {
  onBack: () => void
  onSubmit: (data: any) => void
}

const channelOptions = [
  "Email Marketing",
  "Social Media",
  "Medical Conferences",
  "Print Materials",
  "Digital Advertising",
  "Webinars",
  "Sales Materials",
]

const departmentOptions = [
  "Medical Affairs",
  "Marketing",
  "Clinical Development",
  "Regulatory Affairs",
  "Commercial",
  "Market Access",
]

const specialtyOptions: Record<string, string[]> = {
  default: ["Oncology", "Cardiology", "Endocrinology", "Immunology", "Respiratory"],
}

const launchDateOptions = [
  "2025-03-15",
  "2025-04-01",
  "2025-04-15",
  "2025-05-01",
  "2025-06-01",
  "2025-07-01",
  "2025-08-01",
  "2025-09-01",
  "2025-10-01",
  "2025-11-01",
  "2025-12-01",
  "2026-01-01",
]

const aiSuggestions = {
  objective: "Considera l'uso di obiettivi SMART (Specifici, Misurabili, Raggiungibili, Rilevanti, Temporizzati)",
  targetAudience: "Includi dati demografici, specialità mediche e fattori decisionali",
  channels: "Seleziona i canali che si allineano con i metodi di comunicazione preferiti dal tuo pubblico",
  requestSummary: "Fornisci una panoramica concisa che catturi l'essenza della tua richiesta di campagna",
  specialty: "Seleziona la specialità medica più rilevante per il focus della tua campagna",
  communicationPersonality:
    "Scegli uno stile di comunicazione che corrisponda agli obiettivi della campagna e al pubblico",
  targetAudiencePreset: "Seleziona un pubblico predefinito per applicare linee guida di comunicazione specifiche",
}

export default function CampaignForm() {
  const { t } = useTranslation()

  const {
    campaignData,
    setCampaignData,
    formErrors,
    setFormErrors,
    clearFormErrors,
    isGeneratingBrief,
    setIsGeneratingBrief,
    setCurrentView,
    resetApp,
    generateBrief,
    currentBrief,
    autoSaveDraft,
    brandGuidelines,
    addAttachmentToCampaign,
    removeAttachmentFromCampaign,
  } = useAppStore()

  const formData = campaignData

  const fillDemoData = () => {
    setCampaignData(demoData)
    clearFormErrors()
    console.log("[v0] Demo data filled via keyboard shortcut")
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      console.log("[v0] Key pressed:", {
        key: event.key,
        altKey: event.altKey,
        metaKey: event.metaKey,
        ctrlKey: event.ctrlKey,
        code: event.code,
        keyCode: event.keyCode,
      })

      const isAltOrOption = event.altKey || (event.getModifierState && event.getModifierState("Alt"))
      const isCKey = event.key.toLowerCase() === "c" || event.code === "KeyC"

      if (isAltOrOption && isCKey) {
        console.log("[v0] Keyboard shortcut detected - filling demo data")
        event.preventDefault()
        event.stopPropagation()
        fillDemoData()
      }
    }

    document.addEventListener("keydown", handleKeyDown, true)
    return () => document.removeEventListener("keydown", handleKeyDown, true)
  }, [])

  useEffect(() => {
    const autoSaveInterval = setInterval(async () => {
      if (
        Object.values(formData).some((value) =>
          Array.isArray(value) ? value.length > 0 : value && value.toString().trim() !== "",
        ) &&
        currentBrief
      ) {
        console.log("[v0] Auto-saving draft...")
        await autoSaveDraft(currentBrief.id)
      }
    }, 30000) // Auto-save every 30 seconds

    return () => clearInterval(autoSaveInterval)
  }, [formData, currentBrief, autoSaveDraft])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.projectName?.trim()) {
      newErrors.projectName = t("form.projectNameRequired")
    }
    if (!formData.department?.trim()) {
      newErrors.department = t("form.departmentRequired")
    }
    if (!formData.brand?.trim()) {
      newErrors.brand = t("form.brandRequired")
    }
    if (!formData.expectedLaunchDate?.trim()) {
      newErrors.expectedLaunchDate = t("form.expectedLaunchDateRequired")
    }
    if (!formData.specialty?.trim()) {
      newErrors.specialty = t("form.specialtyRequired")
    }
    if (!formData.requestSummary?.trim()) {
      newErrors.requestSummary = t("form.requestSummaryRequired")
    }
    if (!formData.channels || formData.channels.length === 0) {
      newErrors.channels = t("form.atLeastOneChannelRequired")
    }

    if (formData.expectedLaunchDate) {
      const launchDate = new Date(formData.expectedLaunchDate)
      const today = new Date()
      if (launchDate < today) {
        newErrors.expectedLaunchDate = t("form.launchDateMustBeFuture")
      }
    }

    setFormErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsGeneratingBrief(true)

    setTimeout(() => {
      generateBrief()
      setIsGeneratingBrief(false)
      setCurrentView("brief")
    }, 3000)
  }

  const handleInputChange = (field: string, value: string | string[]) => {
    const updatedData = { ...formData, [field]: value }
    setCampaignData(updatedData)

    if (formErrors[field]) {
      const newErrors = { ...formErrors }
      delete newErrors[field]
      setFormErrors(newErrors)
    }
  }

  const handleChannelChange = (channel: string, checked: boolean) => {
    const newChannels = checked ? [...formData.channels, channel] : formData.channels.filter((c) => c !== channel)
    handleInputChange("channels", newChannels)
  }

  const handleBack = () => {
    resetApp()
  }

  if (isGeneratingBrief) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md hyntelo-elevation-6">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent-violet/10 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-accent-violet animate-spin" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">{t("form.generatingBrief")}</h3>
            <p className="text-muted-foreground mb-4">{t("form.generatingDescription")}</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-accent-violet h-2 rounded-full animate-pulse" style={{ width: "70%" }}></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-medium text-foreground mb-2">{t("form.campaignContext")}</h2>
          <p className="text-muted-foreground">{t("form.campaignContextDescription")}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Card className="hyntelo-elevation-3">
            <CardHeader>
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                {t("form.brandGuidelines")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="communicationPersonality" className="text-sm font-medium">
                      {t("form.communicationStyle")}
                    </Label>
                    <div className="group relative">
                      <Lightbulb className="w-4 h-4 text-accent-violet cursor-help" />
                      <div className="absolute left-0 top-6 w-64 p-3 bg-card border border-border rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10">
                        <p className="text-xs text-muted-foreground">{aiSuggestions.communicationPersonality}</p>
                      </div>
                    </div>
                  </div>
                  <Select
                    value={formData.communicationPersonalityId || ""}
                    onValueChange={(value) => handleInputChange("communicationPersonalityId", value)}
                  >
                    <SelectTrigger className="!h-[42px] w-full">
                      <SelectValue placeholder={t("form.selectCommunicationStyle")} />
                    </SelectTrigger>
                    <SelectContent>
                      {brandGuidelines.communicationPersonalities.map((personality) => (
                        <SelectItem key={personality.id} value={personality.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{personality.name}</span>
                            <span className="text-xs text-muted-foreground">{personality.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="targetAudiencePreset" className="text-sm font-medium">
                      {t("form.audiencePreset")}
                    </Label>
                    <div className="group relative">
                      <Lightbulb className="w-4 h-4 text-accent-violet cursor-help" />
                      <div className="absolute left-0 top-6 w-64 p-3 bg-card border border-border rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10">
                        <p className="text-xs text-muted-foreground">{aiSuggestions.targetAudiencePreset}</p>
                      </div>
                    </div>
                  </div>
                  <Select
                    value={formData.targetAudiencePresetId || ""}
                    onValueChange={(value) => handleInputChange("targetAudiencePresetId", value)}
                  >
                    <SelectTrigger className="!h-[42px] w-full">
                      <SelectValue placeholder={t("form.selectAudiencePreset")} />
                    </SelectTrigger>
                    <SelectContent>
                      {brandGuidelines.targetAudiencePresets.map((audience) => (
                        <SelectItem key={audience.id} value={audience.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{audience.name}</span>
                            <span className="text-xs text-muted-foreground">{audience.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hyntelo-elevation-3">
            <CardHeader>
              <CardTitle className="text-lg font-medium">{t("form.projectInformation")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="projectName" className="text-sm font-medium">
                  {t("form.projectName")} *
                </Label>
                <Input
                  id="projectName"
                  value={formData.projectName || ""}
                  onChange={(e) => handleInputChange("projectName", e.target.value)}
                  placeholder={t("form.projectNamePlaceholder")}
                  className={formErrors.projectName ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                {formErrors.projectName && <p className="text-sm text-red-600">{formErrors.projectName}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department" className="text-sm font-medium">
                    {t("form.department")} *
                  </Label>
                  <Select
                    value={formData.department || ""}
                    onValueChange={(value) => handleInputChange("department", value)}
                  >
                    <SelectTrigger
                      className={`!h-[42px] w-full ${formErrors.department ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                    >
                      <SelectValue placeholder={t("form.selectDepartment")} />
                    </SelectTrigger>
                    <SelectContent>
                      {departmentOptions.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.department && <p className="text-sm text-red-600">{formErrors.department}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand" className="text-sm font-medium">
                    {t("form.brandProduct")} *
                  </Label>
                  <Select value={formData.brand || ""} onValueChange={(value) => handleInputChange("brand", value)}>
                    <SelectTrigger
                      className={`!h-[42px] w-full ${formErrors.brand ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                    >
                      <SelectValue placeholder={t("form.selectBrand")} />
                    </SelectTrigger>
                    <SelectContent>
                      {brandGuidelines.productBrandGuidelines.map((product) => (
                        <SelectItem key={product.id} value={product.productName}>
                          {product.productName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.brand && <p className="text-sm text-red-600">{formErrors.brand}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expectedLaunchDate" className="text-sm font-medium">
                    {t("form.expectedLaunchDate")} *
                  </Label>
                  <Input
                    id="expectedLaunchDate"
                    type="date"
                    value={formData.expectedLaunchDate || ""}
                    onChange={(e) => handleInputChange("expectedLaunchDate", e.target.value)}
                    className={`!h-[42px] w-full ${formErrors.expectedLaunchDate ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                  />
                  {formErrors.expectedLaunchDate && (
                    <p className="text-sm text-red-600">{formErrors.expectedLaunchDate}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="specialty" className="text-sm font-medium">
                      {t("form.specialty")} *
                    </Label>
                    <div className="group relative">
                      <Lightbulb className="w-4 h-4 text-accent-violet cursor-help" />
                      <div className="absolute left-0 top-6 w-64 p-3 bg-card border border-border rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10">
                        <p className="text-xs text-muted-foreground">{aiSuggestions.specialty}</p>
                      </div>
                    </div>
                  </div>
                  <Select
                    value={formData.specialty || ""}
                    onValueChange={(value) => handleInputChange("specialty", value)}
                  >
                    <SelectTrigger
                      className={`!h-[42px] w-full ${formErrors.specialty ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                    >
                      <SelectValue placeholder={t("form.selectSpecialty")} />
                    </SelectTrigger>
                    <SelectContent>
                      {specialtyOptions.default.map((specialty) => (
                        <SelectItem key={specialty} value={specialty}>
                          {specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.specialty && <p className="text-sm text-red-600">{formErrors.specialty}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="requestSummary" className="text-sm font-medium">
                    {t("form.requestSummary")} *
                  </Label>
                  <div className="group relative">
                    <Lightbulb className="w-4 h-4 text-accent-violet cursor-help" />
                    <div className="absolute left-0 top-6 w-64 p-3 bg-card border border-border rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10">
                      <p className="text-xs text-muted-foreground">{aiSuggestions.requestSummary}</p>
                    </div>
                  </div>
                </div>
                <Textarea
                  id="requestSummary"
                  value={formData.requestSummary || ""}
                  onChange={(e) => handleInputChange("requestSummary", e.target.value)}
                  placeholder={t("form.requestSummaryPlaceholder")}
                  rows={3}
                  className={formErrors.requestSummary ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                {formErrors.requestSummary && <p className="text-sm text-red-600">{formErrors.requestSummary}</p>}
              </div>
            </CardContent>
          </Card>

          <Card className="hyntelo-elevation-3">
            <CardHeader>
              <CardTitle className="text-lg font-medium">{t("form.contentFormats")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium">{t("form.selectFormats")}*</Label>
                  <div className="group relative">
                    <Lightbulb className="w-4 h-4 text-accent-violet cursor-help" />
                    <div className="absolute left-0 top-6 w-64 p-3 bg-card border border-border rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10">
                      <p className="text-xs text-muted-foreground">{aiSuggestions.channels}</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {channelOptions.map((channel) => (
                    <div key={channel} className="flex items-center space-x-2">
                      <Checkbox
                        id={channel}
                        checked={formData.channels.includes(channel)}
                        onCheckedChange={(checked) => handleChannelChange(channel, checked as boolean)}
                      />
                      <Label htmlFor={channel} className="text-sm font-normal cursor-pointer">
                        {channel}
                      </Label>
                    </div>
                  ))}
                </div>
                {formErrors.channels && <p className="text-sm text-red-600 mt-2">{formErrors.channels}</p>}
              </div>
            </CardContent>
          </Card>

          <Card className="hyntelo-elevation-3">
            <CardHeader>
              <CardTitle className="text-lg font-medium">{t("form.additionalContext")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="context" className="text-sm font-medium">
                  {t("form.additionalInformation")}
                </Label>
                <Textarea
                  id="context"
                  value={formData.additionalContext || ""}
                  onChange={(e) => handleInputChange("additionalContext", e.target.value)}
                  placeholder={t("form.additionalInformationPlaceholder")}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">{t("form.attachments")}</Label>
                <p className="text-xs text-muted-foreground mb-3">{t("form.attachmentsDescription")}</p>
                <FileUpload
                  attachments={formData.attachments || []}
                  onAttachmentAdd={addAttachmentToCampaign}
                  onAttachmentRemove={removeAttachmentFromCampaign}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="border-primary text-primary hover:bg-primary/6 bg-transparent"
            >
              {t("form.cancel")}
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-150 ease-out hover:scale-[0.97] active:scale-[0.97]"
            >
              {t("form.generateBrief")}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
