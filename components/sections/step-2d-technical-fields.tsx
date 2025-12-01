"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Search, Plus, Trash2 } from "lucide-react"
import { useTranslation } from "@/lib/i18n"
import { useAppStore } from "@/lib/store"
import type { TechnicalFields } from "@/lib/store/types"

export function Step2dTechnicalFields() {
  const { t } = useTranslation()
  const { campaignData, setCampaignData } = useAppStore()

  // Initialize technical fields from campaign data or empty object
  const [technicalFields, setTechnicalFields] = useState<TechnicalFields>(
    campaignData.technicalFields || {}
  )

  // Sync with campaignData when it changes externally
  useEffect(() => {
    if (campaignData.technicalFields) {
      setTechnicalFields(campaignData.technicalFields)
    }
  }, [campaignData.technicalFields])

  // Local state for CTA inputs
  const [ctaInputs, setCtaInputs] = useState<Record<string, { name: string; link: string }>>({})

  // Get selected channels from step 1
  const selectedChannels = campaignData.channels || []

  // Map channel keys to their display names
  const getChannelDisplayName = (channelKey: string): string => {
    return t(`form.channels.${channelKey}`)
  }

  // Handle field changes for any channel
  const handleChannelFieldChange = (channel: string, field: string, value: string) => {
    const updatedFields = {
      ...technicalFields,
      [channel]: {
        ...(technicalFields[channel as keyof TechnicalFields] as any),
        [field]: value,
      },
    }
    setTechnicalFields(updatedFields)
    setCampaignData({ ...campaignData, technicalFields: updatedFields })
  }

  // Handle adding CTA for VAE or WhatsApp
  const handleAddCta = (channel: string) => {
    const input = ctaInputs[channel] || { name: "", link: "" }
    if (!input.name.trim() || !input.link.trim()) {
      return
    }

    const channelData = technicalFields[channel as keyof TechnicalFields] as any
    const existingCtas = channelData?.ctas || []
    const newCta = {
      id: `cta-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: input.name.trim(),
      link: input.link.trim(),
    }

    const updatedFields = {
      ...technicalFields,
      [channel]: {
        ...channelData,
        ctas: [...existingCtas, newCta],
      },
    }

    setTechnicalFields(updatedFields)
    setCampaignData({ ...campaignData, technicalFields: updatedFields })
    setCtaInputs({ ...ctaInputs, [channel]: { name: "", link: "" } })
  }

  // Handle removing CTA
  const handleRemoveCta = (channel: string, ctaId: string) => {
    const channelData = technicalFields[channel as keyof TechnicalFields] as any
    const existingCtas = channelData?.ctas || []
    const updatedCtas = existingCtas.filter((cta: any) => cta.id !== ctaId)

    const updatedFields = {
      ...technicalFields,
      [channel]: {
        ...channelData,
        ctas: updatedCtas,
      },
    }

    setTechnicalFields(updatedFields)
    setCampaignData({ ...campaignData, technicalFields: updatedFields })
  }

  // Handle CTA input changes
  const handleCtaInputChange = (channel: string, field: "name" | "link", value: string) => {
    setCtaInputs({
      ...ctaInputs,
      [channel]: {
        ...(ctaInputs[channel] || { name: "", link: "" }),
        [field]: value,
      },
    })
  }

  // Placeholder handlers for search and create
  const handleSearchPlaceholder = (channel: string) => {
    console.log(`Search placeholder for ${channel}`)
    // TODO: Implement search functionality
  }

  const handleCreatePlaceholder = (channel: string) => {
    console.log(`Create placeholder for ${channel}`)
    // TODO: Implement create functionality
  }

  // Render VAE or WhatsApp section (same structure)
  const renderVaeWhatsappSection = (channel: "vae" | "whatsapp") => {
    const channelData = technicalFields[channel] || {}
    const ctaInput = ctaInputs[channel] || { name: "", link: "" }
    const ctas = channelData.ctas || []

    return (
      <div className="space-y-6">
        {/* VVPM Placeholder ID with Search/Create buttons */}
        <div className="space-y-2">
          <Label htmlFor={`${channel}-vvpm`} className="text-sm font-medium">
            {t(`form.steps.step2d.${channel}.vvpmPlaceholderId`)}
          </Label>
          <div className="flex gap-2">
            <Input
              id={`${channel}-vvpm`}
              value={channelData.vvpmPlaceholderId || ""}
              onChange={(e) => handleChannelFieldChange(channel, "vvpmPlaceholderId", e.target.value)}
              placeholder={t(`form.steps.step2d.${channel}.vvpmPlaceholderId`)}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSearchPlaceholder(channel)}
              className="flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              {t(`form.steps.step2d.${channel}.search`)}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleCreatePlaceholder(channel)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {t(`form.steps.step2d.${channel}.create`)}
            </Button>
          </div>
        </div>

        {/* UTM Code */}
        <div className="space-y-2">
          <Label htmlFor={`${channel}-utm`} className="text-sm font-medium">
            {t(`form.steps.step2d.${channel}.utmCode`)}
          </Label>
          <Input
            id={`${channel}-utm`}
            value={channelData.utmCode || ""}
            onChange={(e) => handleChannelFieldChange(channel, "utmCode", e.target.value)}
            placeholder={t(`form.steps.step2d.${channel}.utmCode`)}
          />
        </div>

        {/* CTA Management */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">CTA</Label>
            <div className="flex gap-2">
              <Input
                placeholder={t(`form.steps.step2d.${channel}.ctaName`)}
                value={ctaInput.name}
                onChange={(e) => handleCtaInputChange(channel, "name", e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder={t(`form.steps.step2d.${channel}.ctaLink`)}
                value={ctaInput.link}
                onChange={(e) => handleCtaInputChange(channel, "link", e.target.value)}
                className="flex-1"
              />
              <Button
                type="button"
                onClick={() => handleAddCta(channel)}
                className="flex items-center gap-2"
              >
                {t(`form.steps.step2d.${channel}.addCta`)}
              </Button>
            </div>
          </div>

          {/* CTA Table */}
          {ctas.length > 0 && (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("form.steps.step2d.ctaTable.name")}</TableHead>
                    <TableHead>{t("form.steps.step2d.ctaTable.link")}</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ctas.map((cta: any) => (
                    <TableRow key={cta.id}>
                      <TableCell>{cta.name}</TableCell>
                      <TableCell>{cta.link}</TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveCta(channel, cta.id)}
                          className="h-8 w-8"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Render Print Materials section
  const renderPrintMaterialsSection = () => {
    const channelData = technicalFields.printMaterials || {}

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="print-warehouse" className="text-sm font-medium">
            {t("form.steps.step2d.printMaterials.warehouseCode")}
          </Label>
          <Input
            id="print-warehouse"
            value={channelData.warehouseCode || ""}
            onChange={(e) =>
              handleChannelFieldChange("printMaterials", "warehouseCode", e.target.value)
            }
            placeholder={t("form.steps.step2d.printMaterials.warehouseCode")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="print-qr" className="text-sm font-medium">
            {t("form.steps.step2d.printMaterials.qrCodeLink")}
          </Label>
          <Input
            id="print-qr"
            value={channelData.qrCodeLink || ""}
            onChange={(e) =>
              handleChannelFieldChange("printMaterials", "qrCodeLink", e.target.value)
            }
            placeholder={t("form.steps.step2d.printMaterials.qrCodeLink")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="print-rcp" className="text-sm font-medium">
            {t("form.steps.step2d.printMaterials.rcp")}
          </Label>
          <Input
            id="print-rcp"
            value={channelData.rcp || ""}
            onChange={(e) => handleChannelFieldChange("printMaterials", "rcp", e.target.value)}
            placeholder={t("form.steps.step2d.printMaterials.rcp")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="print-aifa" className="text-sm font-medium">
            {t("form.steps.step2d.printMaterials.aifaWording")}
          </Label>
          <Input
            id="print-aifa"
            value={channelData.aifaWording || ""}
            onChange={(e) =>
              handleChannelFieldChange("printMaterials", "aifaWording", e.target.value)
            }
            placeholder={t("form.steps.step2d.printMaterials.aifaWording")}
          />
        </div>
      </div>
    )
  }

  // Map channel keys to their internal representation
  const channelMap: Record<string, string> = {
    vae: "vae",
    whatsapp: "whatsapp",
    printMaterials: "printMaterials",
    salesMaterials: "printMaterials", // Sales materials also use print materials section
    // Handle legacy channel names
    "Print Materials": "printMaterials",
    "Sales Materials": "printMaterials",
  }

  // Determine which channels need accordions (only channels that have technical fields)
  const channelsToRender = selectedChannels.filter(
    (channel) =>
      channel === "vae" ||
      channel === "whatsapp" ||
      channel === "printMaterials" ||
      channel === "salesMaterials" ||
      channelMap[channel] !== undefined
  )

  return (
    <Card className="hyntelo-elevation-3">
      <CardHeader>
        <CardTitle className="text-lg font-medium">{t("form.steps.step2d.title")}</CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          {t("form.steps.step2d.subtitle")}
        </p>
      </CardHeader>
      <CardContent>
        {channelsToRender.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {t("form.steps.step2d.noChannelsSelected") || "No channels selected. Please select channels in step 1."}
          </p>
        ) : (
          <Accordion type="multiple" className="w-full">
            {channelsToRender.map((channelKey) => {
              const mappedChannel = channelMap[channelKey] || channelKey
              const displayName = getChannelDisplayName(channelKey)

              return (
                <AccordionItem key={channelKey} value={channelKey}>
                  <AccordionTrigger className="text-base font-semibold">
                    {displayName}
                  </AccordionTrigger>
                  <AccordionContent>
                    {mappedChannel === "vae" && renderVaeWhatsappSection("vae")}
                    {mappedChannel === "whatsapp" && renderVaeWhatsappSection("whatsapp")}
                    {mappedChannel === "printMaterials" && renderPrintMaterialsSection()}
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        )}
      </CardContent>
    </Card>
  )
}
