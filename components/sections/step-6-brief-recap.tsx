"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Edit2,
  Sparkles,
  CheckCircle2,
  Lock,
  Trash2,
  Loader2,
  Check,
  X,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { useTranslation } from "@/lib/i18n"
import { useAppStore } from "@/lib/store"
import type { KeyMessage, ScientificReference, Claim } from "@/lib/store/types"

interface Step6BriefRecapProps {
  onStepNavigate?: (step: number) => void
}

export function Step6BriefRecap({ onStepNavigate }: Step6BriefRecapProps) {
  const { t } = useTranslation()
  const {
    campaignData,
    currentBrief,
    brandGuidelines,
    updateBriefSection,
    regenerateSection,
    acceptRegeneration,
    rejectRegeneration,
    regeneratingSection,
    sectionStates,
    fillMockPrompt,
    updateBriefStatus,
    setCurrentView,
  } = useAppStore()

  // Local state for editing
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")
  const [editingKeyMessageId, setEditingKeyMessageId] = useState<string | null>(null)
  const [editKeyMessage, setEditKeyMessage] = useState<{ tag: string; description: string }>({
    tag: "",
    description: "",
  })
  const [confirmedSections, setConfirmedSections] = useState<Set<string>>(new Set())
  const [showRefineField, setShowRefineField] = useState<Record<string, boolean>>({})
  const [refinePrompts, setRefinePrompts] = useState<Record<string, string>>({})
  const [selectedChannel, setSelectedChannel] = useState<Record<string, string>>({})
  const [selectedReferenceForClaims, setSelectedReferenceForClaims] = useState<ScientificReference | null>(null)
  const [isClaimsDialogOpen, setIsClaimsDialogOpen] = useState(false)

  const brief = currentBrief
  if (!brief || !brief.generatedContent) {
    return (
      <Card className="hyntelo-elevation-3">
        <CardContent className="p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-accent-violet" />
          <p className="text-muted-foreground">{t("form.steps.step6.generating")}</p>
        </CardContent>
      </Card>
    )
  }

  const generatedContent = brief.generatedContent
  const channels = campaignData.channels || []

  // Get channel display name
  const getChannelDisplayName = (channelKey: string): string => {
    return t(`form.channels.${channelKey}`) || channelKey
  }

  // Handle edit start (with channel support)
  const handleEditStart = (section: string, content: string, channel?: string) => {
    // For channel-specific sections, include channel in the section key
    const sectionKey = channel ? `${section}.${channel}` : section
    setEditingSection(sectionKey)
    setEditContent(content)
  }

  // Handle edit save (with channel support)
  const handleEditSave = () => {
    if (editingSection) {
      // Check if it's a channel-specific update (format: "section.channel")
      if (editingSection.includes(".")) {
        const [section, channel] = editingSection.split(".")
        updateBriefSection(`${section}.${channel}`, editContent)
      } else {
        updateBriefSection(editingSection, editContent)
      }
      setEditingSection(null)
      setEditContent("")
    }
  }

  // Handle edit cancel
  const handleEditCancel = () => {
    setEditingSection(null)
    setEditContent("")
  }

  // Handle key message edit (channel-specific)
  const handleKeyMessageEditStart = (message: KeyMessage, channel: string) => {
    setEditingKeyMessageId(`${message.id}.${channel}`)
    setEditKeyMessage({ tag: message.tag, description: message.description })
  }

  const handleKeyMessageEditSave = (channel: string) => {
    if (editingKeyMessageId && generatedContent.keyMessages) {
      const [messageId] = editingKeyMessageId.split(".")
      const channelMessages = generatedContent.keyMessages[channel] || []
      const updated = channelMessages.map((msg) =>
        msg.id === messageId
          ? { ...msg, tag: editKeyMessage.tag, description: editKeyMessage.description }
          : msg
      )
      // Update channel-specific key messages
      updateBriefSection(`keyMessages.${channel}`, updated as any)
      setEditingKeyMessageId(null)
      setEditKeyMessage({ tag: "", description: "" })
    }
  }

  const handleKeyMessageDelete = (messageId: string, channel: string) => {
    if (generatedContent.keyMessages && generatedContent.keyMessages[channel]) {
      const updated = generatedContent.keyMessages[channel].filter((msg) => msg.id !== messageId)
      // Update channel-specific key messages
      updateBriefSection(`keyMessages.${channel}`, updated as any)
    }
  }

  // Handle refine (with channel support)
  const handleRefine = async (sectionKey: string, channel?: string) => {
    const prompt = refinePrompts[sectionKey] || ""
    // For channel-specific sections, include channel in the section key
    const fullSectionKey = channel ? `${sectionKey}.${channel}` : sectionKey
    await regenerateSection(fullSectionKey, prompt)
  }

  // Handle confirm
  const handleConfirm = (sectionKey: string) => {
    const newConfirmed = new Set(confirmedSections)
    newConfirmed.add(sectionKey)
    setConfirmedSections(newConfirmed)
  }

  // Handle confirm all
  const handleConfirmAll = () => {
    const allSections = ["objectives", "keyMessages", "toneOfVoice", "complianceNotes"]
    setConfirmedSections(new Set(allSections))
  }

  // Toggle refine field
  const toggleRefineField = (sectionKey: string) => {
    setShowRefineField((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }))
  }

  // Get section content (handles channel-specific)
  const getSectionContent = (sectionKey: string, channel?: string): string => {
    const targetChannel = channel || selectedChannel[sectionKey] || channels[0] || ""
    
    if (sectionKey === "toneOfVoice" || sectionKey === "complianceNotes") {
      const content = generatedContent[sectionKey as keyof typeof generatedContent]
      if (typeof content === "object" && content !== null && !Array.isArray(content)) {
        return (content as Record<string, string>)[targetChannel] || ""
      }
    }
    
    const content = generatedContent[sectionKey as keyof typeof generatedContent]
    if (typeof content === "string") {
      return content
    }
    return ""
  }

  // Get key messages for a specific channel
  const getKeyMessagesForChannel = (channel: string): KeyMessage[] => {
    if (generatedContent.keyMessages && typeof generatedContent.keyMessages === "object") {
      return generatedContent.keyMessages[channel] || []
    }
    return []
  }

  // Check if section is confirmed
  const isSectionConfirmed = (sectionKey: string): boolean => {
    return confirmedSections.has(sectionKey)
  }

  // Get confirmation count
  const confirmationCount = confirmedSections.size
  const totalSections = 4

  // Render content card
  const renderContentCard = (
    title: string,
    sectionKey: string,
    isChannelSpecific: boolean = false
  ) => {
    const isEditing = editingSection === sectionKey
    const isRefining = regeneratingSection === sectionKey
    const isConfirmed = isSectionConfirmed(sectionKey)
    const sectionState = sectionStates[sectionKey] || { state: "original" }
    const showRefine = showRefineField[sectionKey]
    const content = getSectionContent(sectionKey)

    return (
      <Card className="hyntelo-elevation-3">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-accent-violet" />
              <CardTitle className="text-lg font-medium">{title}</CardTitle>
            </div>
            {isConfirmed && (
              <div className="flex items-center gap-1 text-green-600">
                <Lock className="w-4 h-4" />
                <span className="text-sm">{t("form.steps.step6.confirmed")}</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isChannelSpecific && channels.length > 1 && (
            <Tabs
              value={selectedChannel[sectionKey] || channels[0]}
              onValueChange={(value) =>
                setSelectedChannel((prev) => ({ ...prev, [sectionKey]: value }))
              }
              className="mb-4"
            >
              <TabsList>
                {channels.map((channel) => (
                  <TabsTrigger key={channel} value={channel}>
                    {getChannelDisplayName(channel)}
                  </TabsTrigger>
                ))}
              </TabsList>
              {channels.map((channel) => (
                <TabsContent key={channel} value={channel} />
              ))}
            </Tabs>
          )}

          {showRefine && !isConfirmed && (
            <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder={`${t("form.steps.step6.refinePlaceholder")}... (Press Alt+C for suggestions)`}
                  value={refinePrompts[sectionKey] || ""}
                  onChange={(e) =>
                    setRefinePrompts((prev) => ({
                      ...prev,
                      [sectionKey]: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => {
                    if (e.altKey && e.key === "c") {
                      e.preventDefault()
                      const mockPrompt = fillMockPrompt(sectionKey)
                      setRefinePrompts((prev) => ({
                        ...prev,
                        [sectionKey]: mockPrompt,
                      }))
                    }
                  }}
                  className="flex-1"
                />
                <Button
                  onClick={() => {
                    const channel = isChannelSpecific ? (selectedChannel[sectionKey] || channels[0] || "") : undefined
                    handleRefine(sectionKey, channel)
                  }}
                  disabled={isRefining}
                  className="flex items-center gap-2"
                >
                  {isRefining ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  {t("form.steps.step6.regenerate")}
                </Button>
              </div>
            </div>
          )}

          {isEditing && !isConfirmed ? (
            <div>
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full min-h-[150px]"
                placeholder={title}
              />
              <div className="flex gap-2 mt-3">
                <Button onClick={handleEditSave} size="sm">
                  {t("common.save")}
                </Button>
                <Button variant="outline" onClick={handleEditCancel} size="sm">
                  {t("common.cancel")}
                </Button>
              </div>
              {isChannelSpecific && (
                <p className="text-xs text-muted-foreground mt-2">
                  {t("form.steps.step6.editingChannel")}: {getChannelDisplayName(selectedChannel[sectionKey] || channels[0] || "")}
                </p>
              )}
            </div>
          ) : (
            <div>
              {isRefining && (
                <div className="flex items-center gap-2 text-gray-500 py-8">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{t("form.steps.step6.regenerating")}...</span>
                </div>
              )}

              {sectionState.state === "staged" && !isRefining && (
                <div className="space-y-4">
                  <div className="relative">
                    <pre className="whitespace-pre-wrap text-gray-400 font-sans leading-relaxed line-through opacity-60">
                      {sectionState.originalContent}
                    </pre>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-3 top-0 bottom-0 w-1 bg-accent-violet rounded-full"></div>
                    <pre className="whitespace-pre-wrap text-gray-700 font-sans leading-relaxed bg-accent-violet/5 p-3 rounded-lg">
                      {sectionState.stagedContent}
                    </pre>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => acceptRegeneration(sectionKey)}
                      className="flex items-center gap-1"
                      size="sm"
                    >
                      <Check className="w-4 h-4" />
                      {t("form.steps.step6.accept")}
                    </Button>
                    <Button
                      onClick={() => rejectRegeneration(sectionKey)}
                      variant="outline"
                      className="flex items-center gap-1"
                      size="sm"
                    >
                      <X className="w-4 h-4" />
                      {t("form.steps.step6.reject")}
                    </Button>
                  </div>
                </div>
              )}

              {(sectionState.state === "original" || sectionState.state === "confirmed") && (
                <pre className="whitespace-pre-wrap text-gray-700 font-sans leading-relaxed">
                  {content}
                </pre>
              )}
            </div>
          )}
        </CardContent>
        {!isConfirmed && (
          <CardFooter className="flex items-center justify-end gap-2 border-t pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleRefineField(sectionKey)}
              className="flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {t("form.steps.step6.refine")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const channel = isChannelSpecific ? (selectedChannel[sectionKey] || channels[0] || "") : undefined
                handleEditStart(sectionKey, content, channel)
              }}
              className="flex items-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              {t("form.steps.step6.modify")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleConfirm(sectionKey)}
              className="flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              {t("form.steps.step6.confirm")}
            </Button>
          </CardFooter>
        )}
      </Card>
    )
  }

  // Render key messages card (channel-specific)
  const renderKeyMessagesCard = () => {
    const isConfirmed = isSectionConfirmed("keyMessages")
    const currentChannel = selectedChannel["keyMessages"] || channels[0] || ""
    const keyMessages = getKeyMessagesForChannel(currentChannel)

    return (
      <Card className="hyntelo-elevation-3">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-accent-violet" />
              <CardTitle className="text-lg font-medium">
                {t("form.steps.step6.keyMessages")}
              </CardTitle>
            </div>
            {isConfirmed && (
              <div className="flex items-center gap-1 text-green-600">
                <Lock className="w-4 h-4" />
                <span className="text-sm">{t("form.steps.step6.confirmed")}</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {showRefineField["keyMessages"] && !isConfirmed && (
            <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder={`${t("form.steps.step6.refinePlaceholder")}...`}
                  value={refinePrompts["keyMessages"] || ""}
                  onChange={(e) =>
                    setRefinePrompts((prev) => ({
                      ...prev,
                      keyMessages: e.target.value,
                    }))
                  }
                  className="flex-1"
                />
                <Button
                  onClick={() => handleRefine(`keyMessages.${currentChannel}`)}
                  disabled={regeneratingSection === `keyMessages.${currentChannel}`}
                  className="flex items-center gap-2"
                >
                  {regeneratingSection === `keyMessages.${currentChannel}` ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  {t("form.steps.step6.regenerate")}
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {keyMessages.map((message) => {
              const editingId = `${message.id}.${currentChannel}`
              const isEditing = editingKeyMessageId === editingId
              
              return (
                <div
                  key={message.id}
                  className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                >
                  {isEditing ? (
                    <div className="space-y-3">
                      <Input
                        value={editKeyMessage.tag}
                        onChange={(e) =>
                          setEditKeyMessage((prev) => ({ ...prev, tag: e.target.value }))
                        }
                        placeholder={t("form.steps.step6.keyMessageTag")}
                        className="font-semibold"
                      />
                      <Textarea
                        value={editKeyMessage.description}
                        onChange={(e) =>
                          setEditKeyMessage((prev) => ({ ...prev, description: e.target.value }))
                        }
                        placeholder={t("form.steps.step6.keyMessageDescription")}
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button onClick={() => handleKeyMessageEditSave(currentChannel)} size="sm">
                          {t("common.save")}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setEditingKeyMessageId(null)
                            setEditKeyMessage({ tag: "", description: "" })
                          }}
                          size="sm"
                        >
                          {t("common.cancel")}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="font-semibold">
                            {message.tag}
                          </Badge>
                        </div>
                        <p className="text-gray-700">{message.description}</p>
                      </div>
                      {!isConfirmed && (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleKeyMessageEditStart(message, currentChannel)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleKeyMessageDelete(message.id, currentChannel)}
                            className="h-8 w-8 p-0 text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
        {!isConfirmed && (
          <CardFooter className="flex items-center justify-end gap-2 border-t pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleRefineField("keyMessages")}
              className="flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {t("form.steps.step6.refine")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleConfirm("keyMessages")}
              className="flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              {t("form.steps.step6.confirm")}
            </Button>
          </CardFooter>
        )}
      </Card>
    )
  }

  // Get communication style name
  const getCommunicationStyleName = () => {
    const personality = brandGuidelines.communicationPersonalities.find(
      (p: any) => p.id === campaignData.communicationPersonalityId
    )
    return personality?.name || "-"
  }

  // Get target audience name
  const getTargetAudienceName = () => {
    const audience = brandGuidelines.targetAudiencePresets.find(
      (a: any) => a.id === campaignData.targetAudiencePresetId
    )
    return audience?.name || "-"
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card className="hyntelo-elevation-3">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-medium text-primary mb-2">{campaignData.projectName || brief.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                  {t("form.steps.step6.draft")}
                </Badge>
                <span>
                  {t("form.steps.step6.created")}:{" "}
                  {new Date(brief.createdAt).toLocaleDateString("it-IT")}
                </span>
                <span className="flex items-center gap-1 text-accent-violet">
                  <CheckCircle2 className="w-4 h-4" />
                  {confirmationCount}/{totalSections} {t("form.steps.step6.confirmed")}
                </span>
              </div>
            </div>
            <Button
              onClick={handleConfirmAll}
              disabled={confirmationCount === totalSections}
              variant="outline"
              className="flex items-center gap-2"
            >
              {t("form.steps.step6.confirmAll")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Accordion Section - Steps Recap */}
      <Card className="hyntelo-elevation-3">
        <CardHeader>
          <CardTitle className="text-lg font-medium">
            {t("form.steps.step6.stepsRecap")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full">
            {/* Step 1: Campaign Context */}
            <AccordionItem value="step1">
              <AccordionTrigger className="text-base font-semibold">
                <span className="mr-2 text-accent-violet font-bold">1.</span>
                {t("form.steps.step1.title")}
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      {t("form.projectName")}
                    </label>
                    <p className="text-gray-900">{campaignData.projectName || "-"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      {t("form.brandProduct")}
                    </label>
                    <p className="text-gray-900">{campaignData.brand || "-"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      {t("form.therapeuticArea")}
                    </label>
                    <p className="text-gray-900">{campaignData.therapeuticArea || "-"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      {t("form.specialty")}
                    </label>
                    <p className="text-gray-900">{campaignData.specialty || "-"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      {t("form.expectedLaunchDate")}
                    </label>
                    <p className="text-gray-900">
                      {campaignData.expectedLaunchDate
                        ? new Date(campaignData.expectedLaunchDate).toLocaleDateString("it-IT")
                        : "-"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      {t("form.communicationStyle")}
                    </label>
                    <p className="text-gray-900">{getCommunicationStyleName()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      {t("form.audiencePreset")}
                    </label>
                    <p className="text-gray-900">{getTargetAudienceName()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      {t("form.contentFormats")}
                    </label>
                    <p className="text-gray-900">
                      {channels.length > 0
                        ? channels.map((c) => getChannelDisplayName(c)).join(", ")
                        : "-"}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">
                      {t("form.requestSummary")}
                    </label>
                    <p className="text-gray-900 whitespace-pre-wrap">{campaignData.requestSummary || "-"}</p>
                  </div>
                </div>
                {onStepNavigate && (
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onStepNavigate(1)}
                      className="flex items-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      {t("form.steps.step6.modify")}
                    </Button>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>

            {/* Step 2: Additional Context */}
            <AccordionItem value="step2">
              <AccordionTrigger className="text-base font-semibold">
                <span className="mr-2 text-accent-violet font-bold">2.</span>
                {t("form.steps.step2.title")}
              </AccordionTrigger>
              <AccordionContent>
                <div>
                  {campaignData.attachments && campaignData.attachments.length > 0 ? (
                    <ul className="space-y-2">
                      {campaignData.attachments.map((att) => (
                        <li key={att.id} className="text-gray-900">
                          {att.name}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">{t("form.steps.step6.noContent")}</p>
                  )}
                </div>
                {onStepNavigate && (
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onStepNavigate(2)}
                      className="flex items-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      {t("form.steps.step6.modify")}
                    </Button>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>

            {/* Step 3: Starting Documents */}
            <AccordionItem value="step3">
              <AccordionTrigger className="text-base font-semibold">
                <span className="mr-2 text-accent-violet font-bold">3.</span>
                {t("form.steps.step3.title")}
              </AccordionTrigger>
              <AccordionContent>
                <div>
                  {campaignData.startingDocuments && campaignData.startingDocuments.length > 0 ? (
                    <ul className="space-y-3">
                      {campaignData.startingDocuments.map((doc) => (
                        <li key={doc.id} className="text-gray-900 border-b pb-2 last:border-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="font-medium">
                                <span className="font-mono text-sm">{doc.documentId}</span> - {doc.title}
                              </div>
                              <div className="text-sm text-gray-600 mt-1">
                                {doc.usage && doc.pages && (
                                  <div className="inline-flex items-center gap-2">
                                    <span>
                                      <span className="font-medium">{t("form.steps.step3.table.usage")}:</span>{" "}
                                      {t(`form.steps.step3.usage.${doc.usage === "global-adapt" ? "globalAdapt" : doc.usage}`)}
                                    </span>
                                    <span className="text-gray-400">•</span>
                                    <span>
                                      <span className="font-medium">{t("form.steps.step3.table.pages")}:</span> {doc.pages}
                                    </span>
                                  </div>
                                )}
                                {doc.usage && !doc.pages && (
                                  <div>
                                    <span className="font-medium">{t("form.steps.step3.table.usage")}:</span>{" "}
                                    {t(`form.steps.step3.usage.${doc.usage === "global-adapt" ? "globalAdapt" : doc.usage}`)}
                                  </div>
                                )}
                                {!doc.usage && doc.pages && (
                                  <div>
                                    <span className="font-medium">{t("form.steps.step3.table.pages")}:</span> {doc.pages}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">{t("form.steps.step6.noContent")}</p>
                  )}
                </div>
                {onStepNavigate && (
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onStepNavigate(3)}
                      className="flex items-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      {t("form.steps.step6.modify")}
                    </Button>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>

            {/* Step 4: Scientific References */}
            <AccordionItem value="step4">
              <AccordionTrigger className="text-base font-semibold">
                <span className="mr-2 text-accent-violet font-bold">4.</span>
                {t("form.steps.step4.title")}
              </AccordionTrigger>
              <AccordionContent>
                <div>
                  {campaignData.scientificReferences && campaignData.scientificReferences.length > 0 ? (
                    <ul className="space-y-3">
                      {campaignData.scientificReferences.map((ref) => {
                        const selectedCount = ref.selectedClaims?.length || 0
                        const totalCount = ref.claimsCount || ref.claims?.length || 0
                        const hasSelectedClaims = selectedCount > 0 && ref.claims && ref.claims.length > 0

                        return (
                          <li key={ref.id} className="text-gray-900 border-b pb-2 last:border-0">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="font-medium">
                                  <span className="font-mono text-sm">{ref.referenceId}</span> - {ref.title}
                                </div>
                                {totalCount > 0 && (
                                  <div className="text-sm text-gray-600 mt-1">
                                    <button
                                      onClick={() => {
                                        if (hasSelectedClaims) {
                                          setSelectedReferenceForClaims(ref)
                                          setIsClaimsDialogOpen(true)
                                        }
                                      }}
                                      className={`${
                                        hasSelectedClaims
                                          ? "text-accent-violet hover:underline cursor-pointer"
                                          : "text-gray-500 cursor-default"
                                      }`}
                                    >
                                      <span className="font-medium">{t("form.steps.step4.table.claimsCount")}:</span>{" "}
                                      {selectedCount} di {totalCount}
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  ) : (
                    <p className="text-gray-500">{t("form.steps.step6.noContent")}</p>
                  )}
                </div>
                {onStepNavigate && (
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onStepNavigate(4)}
                      className="flex items-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      {t("form.steps.step6.modify")}
                    </Button>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>

            {/* Step 5: Technical Fields */}
            <AccordionItem value="step5">
              <AccordionTrigger className="text-base font-semibold">
                <span className="mr-2 text-accent-violet font-bold">5.</span>
                {t("form.steps.step2d.title")}
              </AccordionTrigger>
              <AccordionContent>
                <div>
                  {campaignData.technicalFields &&
                  Object.keys(campaignData.technicalFields).length > 0 ? (
                    <div className="space-y-6">
                      {Object.entries(campaignData.technicalFields).map(([channel, fields]: [string, any]) => (
                        <div key={channel} className="border-b pb-4 last:border-0">
                          <h4 className="font-medium text-gray-900 mb-3">
                            {getChannelDisplayName(channel)}
                          </h4>
                          <div className="space-y-3 text-sm">
                            {fields.vvpmPlaceholderId && (
                              <div>
                                <span className="font-medium text-gray-700">
                                  {channel === "email" || channel === "whatsapp"
                                    ? t(`form.steps.step2d.${channel}.vvpmPlaceholderId`)
                                    : "VVPM Placeholder ID"}
                                  :
                                </span>{" "}
                                <span className="text-gray-900">{fields.vvpmPlaceholderId}</span>
                              </div>
                            )}
                            {fields.utmCode && (
                              <div>
                                <span className="font-medium text-gray-700">
                                  {t(`form.steps.step2d.${channel}.utmCode`)}:
                                </span>{" "}
                                <span className="text-gray-900">{fields.utmCode}</span>
                              </div>
                            )}
                            {fields.warehouseCode && (
                              <div>
                                <span className="font-medium text-gray-700">Warehouse Code:</span>{" "}
                                <span className="text-gray-900">{fields.warehouseCode}</span>
                              </div>
                            )}
                            {fields.qrCodeLink && (
                              <div>
                                <span className="font-medium text-gray-700">QR Code Link:</span>{" "}
                                <span className="text-gray-900">{fields.qrCodeLink}</span>
                              </div>
                            )}
                            {fields.rcp && (
                              <div>
                                <span className="font-medium text-gray-700">RCP:</span>{" "}
                                <span className="text-gray-900">{fields.rcp}</span>
                              </div>
                            )}
                            {fields.aifaWording && (
                              <div>
                                <span className="font-medium text-gray-700">AIFA Wording:</span>{" "}
                                <span className="text-gray-900">{fields.aifaWording}</span>
                              </div>
                            )}
                            {fields.ctas && fields.ctas.length > 0 && (
                              <div>
                                <span className="font-medium text-gray-700">CTAs:</span>
                                <ul className="mt-1 space-y-1 ml-4">
                                  {fields.ctas.map((cta: any) => (
                                    <li key={cta.id} className="text-gray-900">
                                      <span className="font-medium">{cta.name}:</span> {cta.link}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">{t("form.steps.step6.noContent")}</p>
                  )}
                </div>
                {onStepNavigate && (
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onStepNavigate(5)}
                      className="flex items-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      {t("form.steps.step6.modify")}
                    </Button>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* AI-Generated Content Cards */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-primary">
          {t("form.steps.step6.generatedContent")}
        </h2>

        {/* Objectives Card */}
        {renderContentCard(t("form.steps.step6.objectives"), "objectives")}

        {/* Key Messages Card */}
        {renderKeyMessagesCard()}

        {/* Tone of Voice Card */}
        {renderContentCard(t("form.steps.step6.toneOfVoice"), "toneOfVoice", true)}

        {/* Compliance Notes Card */}
        {renderContentCard(t("form.steps.step6.complianceNotes"), "complianceNotes", true)}
      </div>

      {/* Giallature Dialog */}
      <Dialog open={isClaimsDialogOpen} onOpenChange={setIsClaimsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedReferenceForClaims && (
                <>
                  {t("form.steps.step4.table.claimsCount")} - {selectedReferenceForClaims.title}
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {selectedReferenceForClaims && (
                <>
                  {selectedReferenceForClaims.referenceId} - {selectedReferenceForClaims.selectedClaims?.length || 0} di{" "}
                  {selectedReferenceForClaims.claimsCount || selectedReferenceForClaims.claims?.length || 0}{" "}
                  {t("form.steps.step4.table.claimsCount").toLowerCase()}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          {selectedReferenceForClaims && selectedReferenceForClaims.claims && (
            <div className="space-y-4">
              {(() => {
                // Group claims by page and filter to only selected claims
                const selectedClaimIds = new Set(selectedReferenceForClaims.selectedClaims || [])
                const claimsByPage = selectedReferenceForClaims.claims
                  .filter((claim) => selectedClaimIds.has(claim.id))
                  .reduce((acc, claim) => {
                    if (!acc[claim.pageNumber]) {
                      acc[claim.pageNumber] = []
                    }
                    acc[claim.pageNumber].push(claim)
                    return acc
                  }, {} as Record<number, Claim[]>)

                const sortedPages = Object.keys(claimsByPage)
                  .map(Number)
                  .sort((a, b) => a - b)

                return sortedPages.map((pageNumber) => (
                  <div key={pageNumber} className="border rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">
                      {t("form.steps.step4.claimsModal.page", { page: pageNumber })}
                    </h4>
                    <ul className="space-y-2">
                      {claimsByPage[pageNumber]
                        .sort((a, b) => a.id.localeCompare(b.id))
                        .map((claim) => (
                          <li key={claim.id} className="text-sm text-gray-700 pl-4 border-l-2 border-accent-violet/30">
                            {claim.text}
                          </li>
                        ))}
                    </ul>
                  </div>
                ))
              })()}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

