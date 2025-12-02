"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Lightbulb, MessageSquare, FileText, Radio } from "lucide-react"
import { useTranslation } from "@/lib/i18n"
import type { CampaignData } from "@/lib/store/types"

interface Step1CampaignContextProps {
  formData: CampaignData
  formErrors: Record<string, string>
  brandGuidelines: any
  onInputChange: (field: string, value: string | string[]) => void
  onChannelChange: (channel: string, checked: boolean) => void
}

// Channel keys used for storage (consistent across languages)
const channelKeys = [
  "email",
  "webPage",
  "emailWebpage",
  "materialiCartacei",
  "graficheStand",
  "video",
  "loghi",
  "slideDeck",
  "traduzioni",
  "iDetail",
  "whatsapp",
]

const therapeuticAreaOptions = [
  "Cardiologia",
  "Oncologia",
  "Endocrinologia",
  "Immunologia",
  "Neurologia",
  "Malattie Rare",
  "Malattie Respiratorie",
  "Nefrologia",
  "Gastroenterologia",
  "Reumatologia",
]

const specialtyOptions: Record<string, string[]> = {
  default: ["Oncology", "Cardiology", "Endocrinology", "Immunology", "Respiratory"],
}

export function Step1CampaignContext({
  formData,
  formErrors,
  brandGuidelines,
  onInputChange,
  onChannelChange,
}: Step1CampaignContextProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-8">
      {/* Section 1: Informazioni Progetto */}
      <Card className="hyntelo-elevation-3">
        <CardHeader>
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {t("form.steps.step1.title")}
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {t("form.steps.step1.description")}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="projectName" className="text-sm font-medium">
              {t("form.projectName")} *
            </Label>
            <Input
              id="projectName"
              value={formData.projectName || ""}
              onChange={(e) => onInputChange("projectName", e.target.value)}
              placeholder={t("form.projectNamePlaceholder")}
              className={formErrors.projectName ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
            {formErrors.projectName && <p className="text-sm text-red-600">{formErrors.projectName}</p>}
          </div>

          {/* Obiettivi e descrizione - PROMINENT */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="requestSummary" className="text-base font-semibold">
                {t("form.requestSummary")} *
              </Label>
              <div className="group relative inline-flex flex-shrink-0">
                <Lightbulb className="w-5 h-5 text-accent-violet cursor-help" />
                <div className="absolute left-0 top-6 w-64 p-3 bg-card border border-border rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10">
                  <p className="text-xs text-muted-foreground">{t("form.aiSuggestions.requestSummary")}</p>
                </div>
              </div>
            </div>
            <Textarea
              id="requestSummary"
              value={formData.requestSummary || ""}
              onChange={(e) => onInputChange("requestSummary", e.target.value)}
              placeholder={t("form.requestSummaryPlaceholder")}
              rows={9}
              className={`text-base min-h-[200px] border-2 focus-visible:ring-2 focus-visible:ring-accent-violet/20 ${
                formErrors.requestSummary
                  ? "border-red-500 focus-visible:ring-red-500"
                  : "border-accent-violet/30 focus-visible:border-accent-violet"
              }`}
            />
            {formErrors.requestSummary && <p className="text-sm text-red-600">{formErrors.requestSummary}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand" className="text-sm font-medium">
                {t("form.brandProduct")} *
              </Label>
              <Select value={formData.brand || ""} onValueChange={(value) => onInputChange("brand", value)}>
                <SelectTrigger
                  className={`!h-[42px] w-full ${formErrors.brand ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                >
                  <SelectValue placeholder={t("form.selectBrand")} />
                </SelectTrigger>
                <SelectContent>
                  {brandGuidelines.productBrandGuidelines.map((product: any) => (
                    <SelectItem key={product.id} value={product.productName}>
                      {product.productName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.brand && <p className="text-sm text-red-600">{formErrors.brand}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="therapeuticArea" className="text-sm font-medium">
                {t("form.therapeuticArea")} *
              </Label>
              <Select
                value={formData.therapeuticArea || ""}
                onValueChange={(value) => onInputChange("therapeuticArea", value)}
              >
                <SelectTrigger
                  className={`!h-[42px] w-full ${formErrors.therapeuticArea ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                >
                  <SelectValue placeholder={t("form.selectTherapeuticArea")} />
                </SelectTrigger>
                <SelectContent>
                  {therapeuticAreaOptions.map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.therapeuticArea && <p className="text-sm text-red-600">{formErrors.therapeuticArea}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="specialty" className="text-sm font-medium">
                {t("form.specialty")}
                </Label>
              <Select value={formData.specialty || ""} onValueChange={(value) => onInputChange("specialty", value)}>
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

            <div className="space-y-2">
              <Label htmlFor="expectedLaunchDate" className="text-sm font-medium">
                {t("form.expectedLaunchDate")} *
              </Label>
              <Input
                id="expectedLaunchDate"
                type="date"
                value={formData.expectedLaunchDate || ""}
                onChange={(e) => onInputChange("expectedLaunchDate", e.target.value)}
                className={`!h-[42px] w-full ${formErrors.expectedLaunchDate ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              />
              {formErrors.expectedLaunchDate && (
                <p className="text-sm text-red-600">{formErrors.expectedLaunchDate}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Obiettivi di Comunicazione */}
      <Card className="hyntelo-elevation-3">
        <CardHeader>
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            {t("form.communicationObjectives")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="communicationPersonality" className="text-sm font-medium">
                  {t("form.style")}
                </Label>
                <div className="group relative inline-flex flex-shrink-0">
                  <Lightbulb className="w-4 h-4 text-accent-violet cursor-help" />
                  <div className="absolute left-0 top-6 w-64 p-3 bg-card border border-border rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10">
                    <p className="text-xs text-muted-foreground">{t("form.aiSuggestions.communicationPersonality")}</p>
                  </div>
                </div>
              </div>
              <Select
                value={formData.communicationPersonalityId || ""}
                onValueChange={(value) => onInputChange("communicationPersonalityId", value)}
              >
                <SelectTrigger className="!h-[42px] w-full">
                  <SelectValue placeholder={t("form.selectCommunicationStyle")} />
                </SelectTrigger>
                <SelectContent>
                  {brandGuidelines.communicationPersonalities.map((personality: any) => (
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
                  {t("form.target")}
                </Label>
                <div className="group relative inline-flex flex-shrink-0">
                  <Lightbulb className="w-4 h-4 text-accent-violet cursor-help" />
                  <div className="absolute left-0 top-6 w-64 p-3 bg-card border border-border rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10">
                    <p className="text-xs text-muted-foreground">{t("form.aiSuggestions.targetAudiencePreset")}</p>
                  </div>
                </div>
              </div>
              <Select
                value={formData.targetAudiencePresetId || ""}
                onValueChange={(value) => onInputChange("targetAudiencePresetId", value)}
              >
                <SelectTrigger className="!h-[42px] w-full">
                  <SelectValue placeholder={t("form.selectAudiencePreset")} />
                </SelectTrigger>
                <SelectContent>
                  {brandGuidelines.targetAudiencePresets.map((audience: any) => (
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

            <div className="space-y-2">
              <Label htmlFor="typology" className="text-sm font-medium">
                {t("form.typology")}
              </Label>
              <Select
                value={formData.typology || ""}
                onValueChange={(value) => onInputChange("typology", value)}
              >
                <SelectTrigger className="!h-[42px] w-full">
                  <SelectValue placeholder={t("form.selectTypology")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="branded">{t("form.typologyOptions.branded")}</SelectItem>
                  <SelectItem value="unbranded">{t("form.typologyOptions.unbranded")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Mezzi */}
      <Card className="hyntelo-elevation-3">
        <CardHeader>
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Radio className="w-5 h-5" />
            {t("form.mezzi")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium">{t("form.selectMezzi")}*</Label>
              <div className="group relative inline-flex flex-shrink-0">
                <Lightbulb className="w-4 h-4 text-accent-violet cursor-help" />
                <div className="absolute left-0 top-6 w-64 p-3 bg-card border border-border rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10">
                  <p className="text-xs text-muted-foreground">{t("form.aiSuggestions.channels")}</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {channelKeys.map((channelKey) => {
                // Map old English channel names to new keys for backward compatibility
                const oldNameMap: Record<string, string> = {
                  "Email Marketing": "emailMarketing",
                  "Social Media": "socialMedia",
                  "Medical Conferences": "medicalConferences",
                  "Print Materials": "printMaterials",
                  "Digital Advertising": "digitalAdvertising",
                  "Webinars": "webinars",
                  "Sales Materials": "salesMaterials",
                }
                
                // Check if channel is selected (handle both new keys and old names)
                const isSelected = formData.channels.includes(channelKey) ||
                  Object.entries(oldNameMap).some(([oldName, key]) => 
                    key === channelKey && formData.channels.includes(oldName)
                  )
                
                return (
                  <div key={channelKey} className="flex items-center space-x-2">
                    <Checkbox
                      id={channelKey}
                      checked={isSelected}
                      onCheckedChange={(checked) => {
                        // Remove both old name and new key if they exist
                        const oldName = Object.entries(oldNameMap).find(([_, key]) => key === channelKey)?.[0]
                        const updatedChannels = formData.channels.filter(
                          (c) => c !== channelKey && c !== oldName
                        )
                        if (checked) {
                          updatedChannels.push(channelKey)
                        }
                        onInputChange("channels", updatedChannels)
                      }}
                    />
                    <Label htmlFor={channelKey} className="text-sm font-normal cursor-pointer">
                      {t(`form.channels.${channelKey}`)}
                    </Label>
                  </div>
                )
              })}
            </div>
            {formErrors.channels && <p className="text-sm text-red-600 mt-2">{formErrors.channels}</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
