"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Switch } from "@/components/ui/switch"
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
  Undo2,
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
  const [refiningKeyMessageId, setRefiningKeyMessageId] = useState<string | null>(null)
  const [refineKeyMessagePrompts, setRefineKeyMessagePrompts] = useState<Record<string, string>>({})
  const [keyMessageStagedStates, setKeyMessageStagedStates] = useState<Record<string, { originalDescription: string; stagedDescription: string }>>({})
  const [confirmedSections, setConfirmedSections] = useState<Set<string>>(new Set())
  // Track confirmed channels per section (for per-channel mode)
  const [confirmedChannels, setConfirmedChannels] = useState<Record<string, Set<string>>>({})
  const [showRefineField, setShowRefineField] = useState<Record<string, boolean>>({})
  const [refinePrompts, setRefinePrompts] = useState<Record<string, string>>({})
  const [selectedChannel, setSelectedChannel] = useState<Record<string, string>>({})
  const [selectedReferenceForClaims, setSelectedReferenceForClaims] = useState<ScientificReference | null>(null)
  const [isClaimsDialogOpen, setIsClaimsDialogOpen] = useState(false)
  // State for unified mode (single for all channels) vs per-channel mode
  const [isUnifiedMode, setIsUnifiedMode] = useState<Record<string, boolean>>({
    toneOfVoice: true, // Default to unified mode
    complianceNotes: true,
  })
  // State for accordion open/close (only used in per-channel mode)
  const [openAccordionItems, setOpenAccordionItems] = useState<Record<string, string[]>>({
    toneOfVoice: [],
    complianceNotes: [],
  })

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

  // Available key message tags
  const keyMessageTags = ["EFFICACY", "AWARENESS", "SAFETY", "QUALITY", "INNOVATION", "PATIENT_CARE", "CLINICAL_EVIDENCE"]

  // Get channel display name
  const getChannelDisplayName = (channelKey: string): string => {
    return t(`form.channels.${channelKey}`) || channelKey
  }

  // Handle edit start (with channel support)
  const handleEditStart = (section: string, content: string, channel?: string) => {
    // For channel-specific sections in unified mode, use "section.all"
    // For per-channel mode, use "section.channel"
    // For non-channel-specific sections, use just "section"
    const isUnified = (section === "toneOfVoice" || section === "complianceNotes") && (isUnifiedMode[section] ?? true)
    const sectionKey = channel ? `${section}.${channel}` : (isUnified && (section === "toneOfVoice" || section === "complianceNotes") ? `${section}.all` : section)
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

  // Handle key message refine
  const handleKeyMessageRefineStart = (messageId: string, channel: string) => {
    setRefiningKeyMessageId(`${messageId}.${channel}`)
    setRefineKeyMessagePrompts((prev) => ({
      ...prev,
      [`${messageId}.${channel}`]: "",
    }))
  }

  const handleKeyMessageRefine = async (messageId: string, channel: string) => {
    const refineKey = `${messageId}.${channel}`
    const prompt = refineKeyMessagePrompts[refineKey] || ""
    const channelMessages = generatedContent.keyMessages?.[channel] || []
    const currentMessage = channelMessages.find((msg) => msg.id === messageId)
    
    if (!currentMessage) return
    
    // Save original description
    const originalDescription = currentMessage.description
    
    // Simulate regeneration - in real app this would call an API
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    // Generate a new description (mock - in real app this would come from API)
    // For now, create a variation based on the prompt
    let stagedDescription = currentMessage.description
    if (prompt.trim()) {
      // Generate refined version without indication text
      stagedDescription = `${currentMessage.description}`
    } else {
      // Default enhancement without indication text
      stagedDescription = `${currentMessage.description}`
    }
    
    // Save staged state for this specific message
    setKeyMessageStagedStates((prev) => ({
      ...prev,
      [refineKey]: {
        originalDescription,
        stagedDescription,
      },
    }))
  }

  const handleKeyMessageRefineCancel = (messageId: string, channel: string) => {
    const refineKey = `${messageId}.${channel}`
    // Only allow cancel if not staged
    if (!keyMessageStagedStates[refineKey]) {
      setRefiningKeyMessageId(null)
      setRefineKeyMessagePrompts((prev) => {
        const newPrompts = { ...prev }
        delete newPrompts[refineKey]
        return newPrompts
      })
    }
  }

  const handleKeyMessageAccept = (messageId: string, channel: string) => {
    const refineKey = `${messageId}.${channel}`
    const stagedState = keyMessageStagedStates[refineKey]
    
    if (stagedState && generatedContent.keyMessages?.[channel]) {
      const updated = generatedContent.keyMessages[channel].map((msg) =>
        msg.id === messageId
          ? { ...msg, description: stagedState.stagedDescription }
          : msg
      )
      updateBriefSection(`keyMessages.${channel}`, updated as any)
    }
    
    // Clear staged state and exit refine mode
    setKeyMessageStagedStates((prev) => {
      const newStates = { ...prev }
      delete newStates[refineKey]
      return newStates
    })
    setRefiningKeyMessageId(null)
    setRefineKeyMessagePrompts((prev) => {
      const newPrompts = { ...prev }
      delete newPrompts[refineKey]
      return newPrompts
    })
  }

  const handleKeyMessageReject = (messageId: string, channel: string) => {
    const refineKey = `${messageId}.${channel}`
    
    // Clear staged state and exit refine mode
    setKeyMessageStagedStates((prev) => {
      const newStates = { ...prev }
      delete newStates[refineKey]
      return newStates
    })
    setRefiningKeyMessageId(null)
    setRefineKeyMessagePrompts((prev) => {
      const newPrompts = { ...prev }
      delete newPrompts[refineKey]
      return newPrompts
    })
  }

  // Handle refine (with channel support)
  const handleRefine = async (sectionKey: string, channel?: string) => {
    // For channel-specific sections in unified mode, use "sectionKey.all"
    // For per-channel mode, use "sectionKey.channel"
    const isUnified = (sectionKey === "toneOfVoice" || sectionKey === "complianceNotes") && (isUnifiedMode[sectionKey] ?? true)
    const fullSectionKey = channel ? `${sectionKey}.${channel}` : (isUnified && (sectionKey === "toneOfVoice" || sectionKey === "complianceNotes") ? `${sectionKey}.all` : sectionKey)
    const prompt = refinePrompts[fullSectionKey] || ""
    await regenerateSection(fullSectionKey, prompt)
  }

  // Handle confirm
  const handleConfirm = (sectionKey: string) => {
    const newConfirmed = new Set(confirmedSections)
    newConfirmed.add(sectionKey)
    setConfirmedSections(newConfirmed)
  }

  // Handle unconfirm (undo confirmation)
  const handleUnconfirm = (sectionKey: string) => {
    const newConfirmed = new Set(confirmedSections)
    newConfirmed.delete(sectionKey)
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

  // Handle toggle between unified and per-channel mode
  const handleToggleMode = (sectionKey: string, newUnifiedMode: boolean) => {
    const content = generatedContent[sectionKey as keyof typeof generatedContent]
    
    if (newUnifiedMode) {
      // Switching to unified mode: use first channel's content as the unified content
      if (typeof content === "object" && content !== null && !Array.isArray(content)) {
        const contentObj = content as Record<string, string>
        const firstChannel = channels[0] || ""
        const unifiedContent = contentObj[firstChannel] || ""
        if (unifiedContent) {
          // Store as "all" key
          updateBriefSection(`${sectionKey}.all`, unifiedContent)
        }
      }
    } else {
      // Switching to per-channel mode: copy unified content to all channels if it exists
      if (typeof content === "object" && content !== null && !Array.isArray(content)) {
        const contentObj = content as Record<string, string>
        const unifiedContent = contentObj.all
        if (unifiedContent) {
          // Copy to all channels
          channels.forEach((channel) => {
            if (!contentObj[channel]) {
              updateBriefSection(`${sectionKey}.${channel}`, unifiedContent)
            }
          })
        }
      } else if (typeof content === "string" && content) {
        // If it's a string, copy to all channels
        channels.forEach((channel) => {
          updateBriefSection(`${sectionKey}.${channel}`, content)
        })
      }
    }
    
    setIsUnifiedMode((prev) => ({
      ...prev,
      [sectionKey]: newUnifiedMode,
    }))
    
    // Clear any editing/refining state when switching modes
    if (editingSection?.startsWith(sectionKey)) {
      setEditingSection(null)
      setEditContent("")
    }
    if (showRefineField[sectionKey]) {
      toggleRefineField(sectionKey)
    }
  }

  // Get section content (handles channel-specific and unified modes)
  const getSectionContent = (sectionKey: string, channel?: string): string => {
    if (sectionKey === "toneOfVoice" || sectionKey === "complianceNotes") {
      const content = generatedContent[sectionKey as keyof typeof generatedContent]
      const isUnified = isUnifiedMode[sectionKey] ?? true
      
      if (isUnified) {
        // Unified mode: check for "all" key first, then fallback to string or first channel
        if (typeof content === "object" && content !== null && !Array.isArray(content)) {
          const contentObj = content as Record<string, string>
          if (contentObj.all) {
            return contentObj.all
          }
          // Fallback to first channel if "all" doesn't exist
          const firstChannel = channels[0] || ""
          return contentObj[firstChannel] || ""
        }
        // If it's a string, return it directly
        if (typeof content === "string") {
          return content
        }
        return ""
      } else {
        // Per-channel mode: get content for specific channel
        const targetChannel = channel || selectedChannel[sectionKey] || channels[0] || ""
        if (typeof content === "object" && content !== null && !Array.isArray(content)) {
          return (content as Record<string, string>)[targetChannel] || ""
        }
      }
    }
    
    // For non-channel-specific sections
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
    // In unified mode, check if section is confirmed
    if (isUnifiedMode[sectionKey] ?? true) {
      return confirmedSections.has(sectionKey)
    }
    // In per-channel mode, check if all channels are confirmed
    const sectionChannels = confirmedChannels[sectionKey] || new Set()
    return channels.length > 0 && sectionChannels.size === channels.length
  }

  // Check if a specific channel is confirmed
  const isChannelConfirmed = (sectionKey: string, channel: string): boolean => {
    const sectionChannels = confirmedChannels[sectionKey] || new Set()
    return sectionChannels.has(channel)
  }

  // Handle confirm for a specific channel
  const handleConfirmChannel = (sectionKey: string, channel: string) => {
    setConfirmedChannels((prev) => {
      const sectionChannels = prev[sectionKey] || new Set()
      const newSet = new Set(sectionChannels)
      newSet.add(channel)
      return {
        ...prev,
        [sectionKey]: newSet,
      }
    })
  }

  // Handle unconfirm for a specific channel
  const handleUnconfirmChannel = (sectionKey: string, channel: string) => {
    setConfirmedChannels((prev) => {
      const sectionChannels = prev[sectionKey] || new Set()
      const newSet = new Set(sectionChannels)
      newSet.delete(channel)
      return {
        ...prev,
        [sectionKey]: newSet,
      }
    })
  }

  // Handle confirm all channels for a section
  const handleConfirmAllChannels = (sectionKey: string) => {
    setConfirmedChannels((prev) => ({
      ...prev,
      [sectionKey]: new Set(channels),
    }))
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
    const isUnified = isChannelSpecific ? (isUnifiedMode[sectionKey] ?? true) : true
    const activeChannel = isChannelSpecific && !isUnified ? (selectedChannel[sectionKey] || channels[0] || "") : undefined
    // Use channel-specific section key for channel-specific sections
    const fullSectionKey = activeChannel ? `${sectionKey}.${activeChannel}` : (isUnified && isChannelSpecific ? `${sectionKey}.all` : sectionKey)
    
    const isEditing = editingSection === fullSectionKey
    const isRefining = regeneratingSection === fullSectionKey
    const isConfirmed = isSectionConfirmed(sectionKey)
    const sectionState = sectionStates[fullSectionKey] || { state: "original" }
    const showRefine = showRefineField[fullSectionKey] || false
    const content = getSectionContent(sectionKey, activeChannel)

    // Render content for a specific channel (used in accordion)
    const renderChannelContent = (channel: string) => {
      const channelSectionKey = `${sectionKey}.${channel}`
      const channelIsEditing = editingSection === channelSectionKey
      const channelIsRefining = regeneratingSection === channelSectionKey
      const channelSectionState = sectionStates[channelSectionKey] || { state: "original" }
      const channelShowRefine = showRefineField[channelSectionKey]
      const channelContent = getSectionContent(sectionKey, channel)
      const channelFullSectionKey = channelSectionKey
      const channelIsConfirmed = isChannelConfirmed(sectionKey, channel)

      return (
        <div>
          {channelIsEditing && !channelIsConfirmed ? (
            <div>
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full min-h-[150px]"
                placeholder={title}
              />
            </div>
          ) : (
            <div>
              {channelIsRefining && (
                <div className="flex items-center gap-2 text-gray-500 py-8">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{t("form.steps.step6.regenerating")}...</span>
                </div>
              )}

              {channelSectionState.state === "staged" && !channelIsRefining && (
                <div className="space-y-4">
                  <div className="relative">
                    <pre className="whitespace-pre-wrap text-gray-400 font-sans leading-relaxed line-through opacity-60">
                      {channelSectionState.originalContent}
                    </pre>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-3 top-0 bottom-0 w-1 bg-accent-violet rounded-full"></div>
                    <pre className="whitespace-pre-wrap text-gray-700 font-sans leading-relaxed bg-accent-violet/5 p-3 rounded-lg">
                      {channelSectionState.stagedContent}
                    </pre>
                  </div>
                </div>
              )}

              {(channelSectionState.state === "original" || channelSectionState.state === "confirmed") && (
                <pre className="whitespace-pre-wrap text-gray-700 font-sans leading-relaxed">
                  {channelContent}
                </pre>
              )}
            </div>
          )}
          
          {!channelIsConfirmed && (
            <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t">
              {channelIsEditing ? (
                <div className="flex items-center justify-end gap-2 w-full">
                  <Button 
                    onClick={() => {
                      if (channelIsEditing) {
                        handleEditSave()
                      }
                    }} 
                    size="sm" 
                    className="flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {t("common.save")}
                  </Button>
                  <Button variant="outline" onClick={handleEditCancel} size="sm" className="flex items-center gap-2">
                    <X className="w-4 h-4" />
                    {t("common.cancel")}
                  </Button>
                </div>
              ) : channelShowRefine ? (
                channelSectionState.state === "staged" && !channelIsRefining ? (
                  <div className="flex items-center justify-end gap-2 w-full">
                    <Button
                      onClick={() => {
                        acceptRegeneration(channelFullSectionKey)
                        setShowRefineField((prev) => {
                          const newFields = { ...prev }
                          delete newFields[channelSectionKey]
                          return newFields
                        })
                        setRefinePrompts((prev) => {
                          const newPrompts = { ...prev }
                          delete newPrompts[channelFullSectionKey]
                          return newPrompts
                        })
                      }}
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      {t("form.steps.step6.accept")}
                    </Button>
                    <Button
                      onClick={() => {
                        rejectRegeneration(channelFullSectionKey)
                        setShowRefineField((prev) => {
                          const newFields = { ...prev }
                          delete newFields[channelSectionKey]
                          return newFields
                        })
                        setRefinePrompts((prev) => {
                          const newPrompts = { ...prev }
                          delete newPrompts[channelFullSectionKey]
                          return newPrompts
                        })
                      }}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      {t("form.steps.step6.reject")}
                    </Button>
                  </div>
                ) : (
                  <>
                    <Input
                      type="text"
                      placeholder={`${t("form.steps.step6.refinePlaceholder")}... (Press Alt+C for suggestions)`}
                      value={refinePrompts[channelFullSectionKey] || ""}
                      onChange={(e) =>
                        setRefinePrompts((prev) => ({
                          ...prev,
                          [channelFullSectionKey]: e.target.value,
                        }))
                      }
                      onKeyDown={(e) => {
                        if (e.altKey && e.key === "c") {
                          e.preventDefault()
                          const mockPrompt = fillMockPrompt(channelFullSectionKey)
                          setRefinePrompts((prev) => ({
                            ...prev,
                            [channelFullSectionKey]: mockPrompt,
                          }))
                        }
                      }}
                      className="flex-1"
                    />
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => {
                          handleRefine(sectionKey, channel)
                        }}
                        disabled={channelIsRefining || !refinePrompts[channelFullSectionKey]?.trim()}
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        {channelIsRefining ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Sparkles className="w-4 h-4" />
                        )}
                        {t("form.steps.step6.regenerate")}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          if (channelSectionState.state !== "staged") {
                            setShowRefineField((prev) => {
                              const newFields = { ...prev }
                              delete newFields[channelSectionKey]
                              return newFields
                            })
                          }
                        }}
                        disabled={channelSectionState.state === "staged"}
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        {t("common.cancel")}
                      </Button>
                    </div>
                  </>
                )
              ) : (
                <div className="flex items-center justify-end gap-2 w-full">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowRefineField((prev) => ({ ...prev, [channelSectionKey]: true }))
                    }}
                    className="flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    {t("form.steps.step6.refine")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      handleEditStart(sectionKey, channelContent, channel)
                    }}
                    className="flex items-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    {t("form.steps.step6.modify")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleConfirmChannel(sectionKey, channel)}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {t("form.steps.step6.confirm")}
                  </Button>
                </div>
              )}
            </div>
          )}
          {channelIsConfirmed && (
            <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-green-600">
                  <Lock className="w-4 h-4" />
                  <span className="text-sm">{t("form.steps.step6.confirmed")}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleUnconfirmChannel(sectionKey, channel)}
                  className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
                  title={t("form.steps.step6.undoConfirm") || "Annulla conferma"}
                >
                  <Undo2 className="w-4 h-4" />
                  <span className="text-sm">{t("form.steps.step6.undo") || "Annulla"}</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      )
    }

    return (
      <Card className="hyntelo-elevation-3">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-accent-violet" />
              <CardTitle className="text-lg font-medium">{title}</CardTitle>
            </div>
            <div className="flex items-center gap-4">
              {isChannelSpecific && channels.length > 1 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {isUnified ? (t("form.steps.step6.unifiedMode") || "Uno per tutti") : (t("form.steps.step6.perChannelMode") || "Uno per mezzo")}
                  </span>
                  <Switch
                    checked={isUnified}
                    onCheckedChange={(checked) => handleToggleMode(sectionKey, checked)}
                    disabled={isEditing || isRefining || showRefine || isConfirmed}
                  />
                </div>
              )}
              {isConfirmed && (
                <div className="flex items-center gap-2">
                  {!isUnified && isChannelSpecific ? (
                    <div className="flex items-center gap-1 text-green-600">
                      <Lock className="w-4 h-4" />
                      <span className="text-sm">
                        {(confirmedChannels[sectionKey]?.size || 0)}/{channels.length} {t("form.steps.step6.confirmed")}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-green-600">
                      <Lock className="w-4 h-4" />
                      <span className="text-sm">{t("form.steps.step6.confirmed")}</span>
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (!isUnified && isChannelSpecific) {
                        // Clear all channel confirmations
                        setConfirmedChannels((prev) => ({
                          ...prev,
                          [sectionKey]: new Set(),
                        }))
                      } else {
                        handleUnconfirm(sectionKey)
                      }
                    }}
                    className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
                    title={t("form.steps.step6.undoConfirm") || "Annulla conferma"}
                  >
                    <Undo2 className="w-4 h-4" />
                    <span className="text-sm">{t("form.steps.step6.undo") || "Annulla"}</span>
                  </Button>
                </div>
              )}
              {!isConfirmed && !isUnified && isChannelSpecific && channels.length > 0 && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <span className="text-sm">
                    {(confirmedChannels[sectionKey]?.size || 0)}/{channels.length} {t("form.steps.step6.confirmed")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isChannelSpecific && channels.length > 1 && !isUnified ? (
            <Accordion
              type="multiple"
              className="w-full"
              value={openAccordionItems[sectionKey] || []}
              onValueChange={(value) => {
                // Prevent accordion change when editing or refining
                const isAnyChannelEditing = channels.some((ch) => {
                  const chKey = `${sectionKey}.${ch}`
                  return editingSection === chKey || regeneratingSection === chKey || showRefineField[chKey]
                })
                if (!isAnyChannelEditing) {
                  setOpenAccordionItems((prev) => ({
                    ...prev,
                    [sectionKey]: value,
                  }))
                }
              }}
            >
              {channels.map((channel) => {
                const channelKey = `${sectionKey}.${channel}`
                const channelIsEditing = editingSection === channelKey
                const channelIsRefining = regeneratingSection === channelKey
                const channelShowRefine = showRefineField[channelKey]
                const channelIsConfirmed = isChannelConfirmed(sectionKey, channel)
                const isAnyChannelInEditOrRefine = channels.some((ch) => {
                  const chKey = `${sectionKey}.${ch}`
                  return editingSection === chKey || regeneratingSection === chKey || showRefineField[chKey]
                })
                const shouldDisable = isAnyChannelInEditOrRefine && !channelIsEditing && !channelIsRefining && !channelShowRefine

                return (
                  <AccordionItem key={channel} value={channel} disabled={shouldDisable}>
                    <AccordionTrigger className="text-base font-semibold flex items-center gap-2">
                      <span className="flex items-center gap-2">
                        {channelIsConfirmed && (
                          <span className="[&>svg]:!rotate-0">
                            <Lock className="w-4 h-4 text-green-600" />
                          </span>
                        )}
                        {channelIsEditing && !channelIsConfirmed && (
                          <Edit2 className="w-3.5 h-3.5" />
                        )}
                        {channelIsRefining && !channelIsEditing && !channelIsConfirmed && (
                          <Sparkles className="w-3.5 h-3.5" />
                        )}
                        {channelShowRefine && !channelIsEditing && !channelIsRefining && !channelIsConfirmed && (
                          <Sparkles className="w-3.5 h-3.5" />
                        )}
                        {getChannelDisplayName(channel)}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      {renderChannelContent(channel)}
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
            </Accordion>
          ) : (
            <>
              {isEditing && !isConfirmed ? (
            <div>
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full min-h-[150px]"
                placeholder={title}
              />
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
                </div>
              )}

              {(sectionState.state === "original" || sectionState.state === "confirmed") && (
                <pre className="whitespace-pre-wrap text-gray-700 font-sans leading-relaxed">
                  {content}
                </pre>
              )}
            </div>
          )}
            </>
          )}
        </CardContent>
        {!isConfirmed && (
          <CardFooter className="flex items-center gap-2 border-t pt-4">
            {!isChannelSpecific || isUnified ? (
              <>
                {isEditing ? (
              <div className="flex items-center justify-end gap-2 w-full">
                <Button onClick={handleEditSave} size="sm" className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  {t("common.save")}
                </Button>
                <Button variant="outline" onClick={handleEditCancel} size="sm" className="flex items-center gap-2">
                  <X className="w-4 h-4" />
                  {t("common.cancel")}
                </Button>
              </div>
            ) : showRefine ? (
              sectionState.state === "staged" && !isRefining ? (
                // When content is staged, show only accept/reject buttons
                <div className="flex items-center justify-end gap-2 w-full">
                  <Button
                    onClick={() => {
                      acceptRegeneration(fullSectionKey)
                      setShowRefineField((prev) => {
                        const newFields = { ...prev }
                        delete newFields[fullSectionKey]
                        return newFields
                      })
                      // Clear the prompt
                      setRefinePrompts((prev) => {
                        const newPrompts = { ...prev }
                        delete newPrompts[fullSectionKey]
                        return newPrompts
                      })
                    }}
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    {t("form.steps.step6.accept")}
                  </Button>
                  <Button
                    onClick={() => {
                      rejectRegeneration(fullSectionKey)
                      setShowRefineField((prev) => {
                        const newFields = { ...prev }
                        delete newFields[fullSectionKey]
                        return newFields
                      })
                      // Clear the prompt
                      setRefinePrompts((prev) => {
                        const newPrompts = { ...prev }
                        delete newPrompts[fullSectionKey]
                        return newPrompts
                      })
                    }}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    {t("form.steps.step6.reject")}
                  </Button>
                </div>
              ) : (
                // When not staged, show input with regenerate/cancel buttons
                <>
                  <Input
                    type="text"
                    placeholder={`${t("form.steps.step6.refinePlaceholder")}... (Press Alt+C for suggestions)`}
                    value={refinePrompts[fullSectionKey] || ""}
                    onChange={(e) =>
                      setRefinePrompts((prev) => ({
                        ...prev,
                        [fullSectionKey]: e.target.value,
                      }))
                    }
                    onKeyDown={(e) => {
                      if (e.altKey && e.key === "c") {
                        e.preventDefault()
                        const mockPrompt = fillMockPrompt(fullSectionKey)
                        setRefinePrompts((prev) => ({
                          ...prev,
                          [fullSectionKey]: mockPrompt,
                        }))
                      }
                    }}
                    className="flex-1"
                  />
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => {
                        handleRefine(sectionKey, activeChannel)
                      }}
                      disabled={isRefining || !refinePrompts[fullSectionKey]?.trim()}
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      {isRefining ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4" />
                      )}
                      {t("form.steps.step6.regenerate")}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        // Only allow cancel if not staged
                        if (sectionState.state !== "staged") {
                          toggleRefineField(sectionKey)
                        }
                      }}
                      disabled={sectionState.state === "staged"}
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      {t("common.cancel")}
                    </Button>
                  </div>
                </>
              )
            ) : (
              <div className="flex items-center justify-end gap-2 w-full">
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
                    handleEditStart(sectionKey, content, activeChannel)
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
              </div>
            )}
              </>
            ) : (
              // Per-channel mode: show "conferma tutti" button
              <div className="flex items-center justify-end gap-2 w-full">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleConfirmAllChannels(sectionKey)}
                  disabled={isConfirmed}
                  className="flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {t("form.steps.step6.confirmAllChannels")}
                </Button>
              </div>
            )}
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
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-green-600">
                  <Lock className="w-4 h-4" />
                  <span className="text-sm">{t("form.steps.step6.confirmed")}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleUnconfirm("keyMessages")}
                  className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
                  title={t("form.steps.step6.undoConfirm") || "Annulla conferma"}
                >
                  <Undo2 className="w-4 h-4" />
                  <span className="text-sm">{t("form.steps.step6.undo") || "Annulla"}</span>
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {keyMessages.map((message) => {
              const editingId = `${message.id}.${currentChannel}`
              const refiningId = `${message.id}.${currentChannel}`
              const isEditing = editingKeyMessageId === editingId
              const isRefining = refiningKeyMessageId === refiningId
              const refineKey = refiningId
              const refinePrompt = refineKeyMessagePrompts[refineKey] || ""
              const stagedState = keyMessageStagedStates[refineKey]
              const isStaged = !!stagedState
              
              // Disable edit/refine for other messages when one is in edit/refine mode
              const isAnyMessageInEditOrRefine = editingKeyMessageId !== null || refiningKeyMessageId !== null
              const isDisabled = isAnyMessageInEditOrRefine && !isEditing && !isRefining
              
              return (
                <div
                  key={message.id}
                  className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                >
                  {isEditing ? (
                    <div className="space-y-3">
                      <Select
                        value={editKeyMessage.tag}
                        onValueChange={(value) =>
                          setEditKeyMessage((prev) => ({ ...prev, tag: value }))
                        }
                      >
                        <SelectTrigger className="font-semibold">
                          <SelectValue placeholder={t("form.steps.step6.keyMessageTag")} />
                        </SelectTrigger>
                        <SelectContent>
                          {keyMessageTags.map((tag) => (
                            <SelectItem key={tag} value={tag}>
                              {tag}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Textarea
                        value={editKeyMessage.description}
                        onChange={(e) =>
                          setEditKeyMessage((prev) => ({ ...prev, description: e.target.value }))
                        }
                        placeholder={t("form.steps.step6.keyMessageDescription")}
                        rows={3}
                      />
                      <div className="flex gap-2 justify-end">
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
                  ) : isRefining ? (
                    isStaged ? (
                      // When content is staged, show old and new proposal with accept/reject buttons
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="font-semibold">
                            {message.tag}
                          </Badge>
                        </div>
                        <div className="relative">
                          <pre className="whitespace-pre-wrap text-gray-400 font-sans leading-relaxed line-through opacity-60 text-sm">
                            {stagedState.originalDescription}
                          </pre>
                        </div>
                        <div className="relative">
                          <div className="absolute -left-3 top-0 bottom-0 w-1 bg-accent-violet rounded-full"></div>
                          <pre className="whitespace-pre-wrap text-gray-700 font-sans leading-relaxed bg-accent-violet/5 p-3 rounded-lg text-sm">
                            {stagedState.stagedDescription}
                          </pre>
                        </div>
                        <div className="flex gap-2 justify-end pt-2">
                          <Button
                            onClick={() => handleKeyMessageAccept(message.id, currentChannel)}
                            size="sm"
                            className="flex items-center gap-2"
                          >
                            <Check className="w-4 h-4" />
                            {t("form.steps.step6.accept")}
                          </Button>
                          <Button
                            onClick={() => handleKeyMessageReject(message.id, currentChannel)}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                          >
                            <X className="w-4 h-4" />
                            {t("form.steps.step6.reject")}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // When not staged, show input with regenerate/cancel buttons inline
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="font-semibold">
                            {message.tag}
                          </Badge>
                        </div>
                        <p className="text-gray-700 mb-3">{message.description}</p>
                        <div className="flex items-center gap-2">
                          <Input
                            type="text"
                            placeholder={`${t("form.steps.step6.refinePlaceholder")}... (Press Alt+C for suggestions)`}
                            value={refinePrompt}
                            onChange={(e) =>
                              setRefineKeyMessagePrompts((prev) => ({
                                ...prev,
                                [refineKey]: e.target.value,
                              }))
                            }
                            onKeyDown={(e) => {
                              if (e.altKey && e.key === "c") {
                                e.preventDefault()
                                const mockPrompt = fillMockPrompt(`keyMessages.${currentChannel}`)
                                setRefineKeyMessagePrompts((prev) => ({
                                  ...prev,
                                  [refineKey]: mockPrompt,
                                }))
                              }
                            }}
                            className="flex-1"
                          />
                          <Button
                            onClick={() => handleKeyMessageRefine(message.id, currentChannel)}
                            disabled={!refinePrompt.trim()}
                            size="sm"
                            className="flex items-center gap-2"
                          >
                            <Sparkles className="w-4 h-4" />
                            {t("form.steps.step6.regenerate")}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleKeyMessageRefineCancel(message.id, currentChannel)}
                            disabled={isStaged}
                            size="sm"
                            className="flex items-center gap-2"
                          >
                            <X className="w-4 h-4" />
                            {t("common.cancel")}
                          </Button>
                        </div>
                      </div>
                    )
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
                            onClick={() => handleKeyMessageRefineStart(message.id, currentChannel)}
                            disabled={isDisabled}
                            className="h-8 w-8 p-0"
                            title={isDisabled ? t("form.steps.step6.editingChannel") || "Another message is being edited" : t("form.steps.step6.refine")}
                          >
                            <Sparkles className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleKeyMessageEditStart(message, currentChannel)}
                            disabled={isDisabled}
                            className="h-8 w-8 p-0"
                            title={isDisabled ? t("form.steps.step6.editingChannel") || "Another message is being edited" : t("common.edit")}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleKeyMessageDelete(message.id, currentChannel)}
                            disabled={isDisabled}
                            className="h-8 w-8 p-0 text-destructive"
                            title={isDisabled ? t("form.steps.step6.editingChannel") || "Another message is being edited" : t("common.delete")}
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
              <AccordionTrigger className="text-base font-semibold flex items-center text-left">
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

            {/* Step 2: Starting Documents */}
            <AccordionItem value="step2">
              <AccordionTrigger className="text-base font-semibold flex items-center text-left">
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

            {/* Step 3: Scientific References */}
            <AccordionItem value="step3">
              <AccordionTrigger className="text-base font-semibold flex items-center text-left">
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

            {/* Step 4: Technical Fields */}
            <AccordionItem value="step4">
              <AccordionTrigger className="text-base font-semibold flex items-center text-left">
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

