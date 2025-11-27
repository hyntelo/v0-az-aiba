"use client"

import type React from "react"
import { useState } from "react"
import { useTranslation } from "@/lib/i18n"
import { useAppStore } from "@/lib/store"
import { mockBriefAISuggestions } from "@/lib/mock-data"
import { ReferenceManager } from "./reference-manager"
import { ExportModal } from "./export-modal"
import { AIReviewModal } from "./ai-review-modal"
import { CheckCircle2, Lightbulb, Tag, Lock, Undo2, Check, X, Loader2, Sparkles } from "lucide-react"

export default function BriefDisplay() {
  const { t } = useTranslation()
  const {
    currentBrief,
    setCurrentView,
    resetApp,
    addReferenceToBrief,
    removeReferenceFromBrief,
    updateBriefSection,
    saveDraft,
    updateBriefStatus,
    regeneratingSection,
    sectionStates,
    regenerateSection,
    acceptRegeneration,
    rejectRegeneration,
    undoConfirmedRegeneration,
    fillMockPrompt,
    brandGuidelines,
    getSelectedCitations,
  } = useAppStore()
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")
  const [showExportModal, setShowExportModal] = useState(false)
  const [showAIReviewModal, setShowAIReviewModal] = useState(false)
  const [confirmedSections, setConfirmedSections] = useState<Set<string>>(new Set())
  const [showAITips, setShowAITips] = useState<Record<string, boolean>>({})
  const [saveMessage, setSaveMessage] = useState<string | null>(null)
  const [regenerationPrompts, setRegenerationPrompts] = useState<Record<string, string>>({})
  const [showRegenerateField, setShowRegenerateField] = useState<Record<string, boolean>>({})

  const selectedCitations = getSelectedCitations()

  if (!currentBrief) return null

  const handleSubmitForAIReview = () => {
    if (currentBrief && currentBrief.status === "draft") {
      const success = updateBriefStatus(currentBrief.id, "ai-reviewed", "Brief reviewed and approved by AI")
      if (success) {
        setShowAIReviewModal(false)
        setSaveMessage(t("briefDisplay.aiReviewCompletedSuccessfully"))
        setTimeout(() => setSaveMessage(null), 3000)
      }
    }
  }

  const canEdit = currentBrief && !currentBrief.isReadOnly

  const handleEditStart = (section: string, content: string) => {
    if (!canEdit) return
    setEditingSection(section)
    setEditContent(content)
  }

  const handleEditSave = () => {
    if (editingSection) {
      updateBriefSection(editingSection, editContent)
      const newConfirmed = new Set(confirmedSections)
      newConfirmed.delete(editingSection)
      setConfirmedSections(newConfirmed)
    }
    setEditingSection(null)
    setEditContent("")
  }

  const handleEditCancel = () => {
    setEditingSection(null)
    setEditContent("")
  }

  const toggleConfirmation = (sectionKey: string) => {
    const newConfirmed = new Set(confirmedSections)
    if (newConfirmed.has(sectionKey)) {
      newConfirmed.delete(sectionKey)
    } else {
      newConfirmed.add(sectionKey)
    }
    setConfirmedSections(newConfirmed)
  }

  const confirmAllSections = () => {
    const allSectionKeys = sections.map((section) => section.key)
    setConfirmedSections(new Set(allSectionKeys))
  }

  const toggleAITip = (sectionKey: string) => {
    setShowAITips((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }))
  }

  const handleSaveDraft = () => {
    if (currentBrief) {
      saveDraft(currentBrief.id)
      setSaveMessage("Draft saved successfully!")
      setTimeout(() => setSaveMessage(null), 3000)
    }
  }

  const handleRegenerateSection = async (sectionKey: string) => {
    const prompt = regenerationPrompts[sectionKey] || ""
    await regenerateSection(sectionKey, prompt)
  }

  const handleAcceptRegeneration = (sectionKey: string) => {
    acceptRegeneration(sectionKey)
    const newConfirmed = new Set(confirmedSections)
    newConfirmed.delete(sectionKey)
    setConfirmedSections(newConfirmed)
  }

  const handlePromptChange = (sectionKey: string, value: string) => {
    setRegenerationPrompts((prev) => ({
      ...prev,
      [sectionKey]: value,
    }))
  }

  const handlePromptKeyDown = (e: React.KeyboardEvent, sectionKey: string) => {
    if (e.altKey && e.key === "c") {
      e.preventDefault()
      const mockPrompt = fillMockPrompt(sectionKey)
      handlePromptChange(sectionKey, mockPrompt)
    }
  }

  const toggleRegenerateField = (sectionKey: string) => {
    setShowRegenerateField((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }))
  }

  const sections = [
    {
      key: "objectives",
      title: t("briefDisplay.campaignObjectives"),
      content: currentBrief.generatedContent?.objectives || "",
      icon: "🎯",
      aiTip: mockBriefAISuggestions.objectives,
      priority: "high",
    },
    {
      key: "keyMessages",
      title: t("briefDisplay.keyMessages"),
      content: currentBrief.generatedContent?.keyMessages || "",
      icon: "💬",
      aiTip: mockBriefAISuggestions.keyMessages,
      priority: "high",
    },
    {
      key: "toneOfVoice",
      title: t("briefDisplay.toneOfVoice"),
      content: currentBrief.generatedContent?.toneOfVoice || "",
      icon: "🎭",
      aiTip: mockBriefAISuggestions.toneOfVoice,
      priority: "medium",
    },
    {
      key: "complianceNotes",
      title: t("briefDisplay.complianceNotes"),
      content: currentBrief.generatedContent?.complianceNotes || "",
      icon: "⚖️",
      aiTip: mockBriefAISuggestions.complianceNotes,
      priority: "high",
    },
  ]

  const allConfirmed = sections.length > 0 && confirmedSections.size === sections.length

  const handleAIReviewClick = () => {
    if (!allConfirmed) {
      return // Gate: don't open modal if not all sections are confirmed
    }
    setShowAIReviewModal(true)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-card rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-medium text-[var(--color-primary)] mb-2">{currentBrief.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>
                {t("briefDisplay.created")}: {new Date(currentBrief.createdAt).toLocaleDateString()}
              </span>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                    currentBrief.status === "draft"
                      ? "bg-[var(--accent-yellow)]/20 text-[var(--color-primary)]"
                      : currentBrief.status === "ai-reviewed"
                        ? "bg-gradient-to-r from-green-100 to-blue-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {currentBrief.status === "ai-reviewed" && <Sparkles className="w-3 h-3" />}
                  {currentBrief.status === "draft"
                    ? t("briefDisplay.draft")
                    : currentBrief.status === "ai-reviewed"
                      ? t("briefDisplay.aiReviewed")
                      : ""}
                </span>
                {currentBrief.isReadOnly && (
                  <span className="flex items-center gap-1 text-gray-500 text-xs">
                    <Lock className="w-3 h-3" />
                    {t("briefDisplay.readOnly")}
                  </span>
                )}
              </div>
              {currentBrief.status !== "ai-reviewed" && (
                <span className="flex items-center gap-1 text-[var(--accent-violet)]">
                  <CheckCircle2 className="w-4 h-4" />
                  {confirmedSections.size}/{sections.length} {t("briefDisplay.confirmed")}
                </span>
              )}
              {canEdit && currentBrief.status !== "ai-reviewed" && (
                <button
                  onClick={confirmAllSections}
                  disabled={allConfirmed}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                    allConfirmed
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-[var(--accent-violet)]/10 text-[var(--accent-violet)] hover:bg-[var(--accent-violet)]/20"
                  }`}
                >
                  {t("briefDisplay.confirmAllSections")}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-[var(--color-primary)]">{t("briefDisplay.campaignContext")}</h2>
          {canEdit && (
            <button
              onClick={() => setCurrentView("form")}
              aria-label={t("briefDisplay.editCampaignDetails")}
              data-testid="edit-campaign-details-inline"
              className="text-sm font-medium opacity-70 hover:opacity-100 underline text-[var(--color-primary)] hover:text-[var(--accent-violet)] transition-all"
            >
              {t("briefDisplay.editCampaignDetails")}
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">{t("briefDisplay.brand")}</label>
            <p className="text-gray-900">{currentBrief.campaignData.brand}</p>
          </div>
          {currentBrief.campaignData.targetAudiencePresetId && (
            <div>
              <label className="text-sm font-medium text-gray-700">{t("briefDisplay.targetAudience")}</label>
              <p className="text-gray-900">
                {brandGuidelines.targetAudiencePresets.find(
                  (preset) => preset.id === currentBrief.campaignData.targetAudiencePresetId,
                )?.name || "-"}
              </p>
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-gray-700">{t("briefDisplay.communicationStyle")}</label>
            <p className="text-gray-900">
              {brandGuidelines.communicationPersonalities.find(
                (p) => p.id === currentBrief.campaignData.communicationPersonalityId,
              )?.name || "-"}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">{t("briefDisplay.requestSummary")}</label>
            <p className="text-gray-900">{currentBrief.campaignData.requestSummary}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">{t("briefDisplay.channels")}</label>
            <p className="text-gray-900">{currentBrief.campaignData.channels.join(", ")}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {sections.map((section) => {
          const sectionState = sectionStates[section.key] || { state: "original" }
          const isRegenerating = regeneratingSection === section.key
          const showRegenerationControls = canEdit && !isRegenerating
          const shouldShowRegenerateField = showRegenerateField[section.key] && showRegenerationControls

          return (
            <div key={section.key} className="bg-card rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-medium text-[var(--color-primary)] flex items-center gap-2">
                      <span>{section.icon}</span>
                      {section.title}
                    </h3>
                    {section.priority === "high" && (
                      <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                        {t("briefDisplay.highPriority")}
                      </span>
                    )}
                    {confirmedSections.has(section.key) && (
                      <span className="flex items-center gap-1 text-green-600 text-sm">
                        <CheckCircle2 className="w-4 h-4" />
                        {t("briefDisplay.confirmed")}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleAITip(section.key)}
                      className="text-[var(--accent-sky)] hover:text-[var(--accent-sky)]/80 p-1"
                      title={t("briefDisplay.showAISuggestions")}
                    >
                      <Lightbulb className="w-4 h-4" />
                    </button>
                    {canEdit && (
                      <button
                        onClick={() => toggleConfirmation(section.key)}
                        className={`p-1 rounded ${
                          confirmedSections.has(section.key)
                            ? "text-green-600 hover:text-green-700"
                            : "text-gray-400 hover:text-[var(--accent-violet)]"
                        }`}
                        title={
                          confirmedSections.has(section.key)
                            ? t("briefDisplay.markAsNeedsReview")
                            : t("briefDisplay.markAsConfirmed")
                        }
                      >
                        <Tag className="w-4 h-4" />
                      </button>
                    )}
                    {canEdit && (
                      <button
                        onClick={() => toggleRegenerateField(section.key)}
                        className="px-3 py-1 text-xs font-medium rounded-lg transition-colors bg-[var(--accent-violet)]/10 text-[var(--accent-violet)] hover:bg-[var(--accent-violet)]/20"
                        aria-label={t("briefDisplay.toggleRefineField")}
                      >
                        {t("briefDisplay.refine")}
                      </button>
                    )}
                    {canEdit && (
                      <button
                        onClick={() => {
                          // Prevent duplicate edit actions when already editing this section
                          if (editingSection !== section.key) {
                            handleEditStart(section.key, section.content)
                          }
                        }}
                        disabled={editingSection === section.key}
                        className={`text-sm font-medium px-2 py-1 transition-colors ${
                          editingSection === section.key
                            ? "text-gray-400 cursor-not-allowed opacity-50"
                            : "text-[var(--accent-violet)] hover:text-[var(--accent-violet)]/80"
                        }`}
                      >
                        {t("briefDisplay.edit")}
                      </button>
                    )}
                    {canEdit && sectionState.state === "confirmed" && (
                      <button
                        onClick={() => undoConfirmedRegeneration(section.key)}
                        className="text-gray-500 hover:text-[var(--accent-violet)] p-1"
                        title={t("briefDisplay.undoRegeneration")}
                      >
                        <Undo2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {showAITips[section.key] && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-blue-900 mb-1">{t("briefDisplay.aiSuggestion")}</p>
                        <p className="text-sm text-blue-800">{section.aiTip}</p>
                      </div>
                    </div>
                  </div>
                )}

                {shouldShowRegenerateField && (
                  <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder={`${t("briefDisplay.refineThisSection")}... (Press Alt+C for suggestions)}`}
                        value={regenerationPrompts[section.key] || ""}
                        onChange={(e) => handlePromptChange(section.key, e.target.value)}
                        onKeyDown={(e) => handlePromptKeyDown(e, section.key)}
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--accent-violet)] focus:border-transparent"
                      />
                      <button
                        onClick={() => handleRegenerateSection(section.key)}
                        className="px-3 py-2 bg-[var(--accent-violet)] text-white rounded-lg hover:bg-[var(--accent-violet)]/90 transition-colors text-sm flex items-center gap-1"
                      >
                        {t("briefDisplay.regenerate")}
                      </button>
                    </div>
                  </div>
                )}

                {editingSection === section.key && canEdit ? (
                  <div>
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--accent-violet)] focus:border-transparent resize-none"
                      placeholder={`${t("briefDisplay.edit").toLowerCase()} ${section.title.toLowerCase()}...`}
                    />
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={handleEditSave}
                        className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary)]/90 transition-colors text-sm"
                      >
                        {t("briefDisplay.saveChanges")}
                      </button>
                      <button
                        onClick={handleEditCancel}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                      >
                        {t("briefDisplay.cancel")}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="prose prose-sm max-w-none">
                    {sectionState.state === "regenerating" && (
                      <div className="flex items-center gap-2 text-gray-500 py-8">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>{t("briefDisplay.regeneratingContentWithAI")}...</span>
                      </div>
                    )}

                    {sectionState.state === "staged" && (
                      <div className="space-y-4">
                        <div className="relative">
                          <pre className="whitespace-pre-wrap text-gray-400 font-sans leading-relaxed line-through opacity-60">
                            {sectionState.originalContent}
                          </pre>
                        </div>

                        <div className="relative">
                          <div className="absolute -left-3 top-0 bottom-0 w-1 bg-[var(--accent-violet)] rounded-full"></div>
                          <pre className="whitespace-pre-wrap text-gray-700 font-sans leading-relaxed bg-[var(--accent-violet)]/5 p-3 rounded-lg">
                            {sectionState.stagedContent}
                          </pre>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={() => handleAcceptRegeneration(section.key)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center gap-1"
                          >
                            <Check className="w-4 h-4" />
                            {t("briefDisplay.accept")}
                          </button>
                          <button
                            onClick={() => rejectRegeneration(section.key)}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center gap-1"
                          >
                            <X className="w-4 h-4" />
                            {t("briefDisplay.reject")}
                          </button>
                        </div>
                      </div>
                    )}

                    {(sectionState.state === "original" || sectionState.state === "confirmed") && (
                      <div>
                        <pre className="whitespace-pre-wrap text-gray-700 font-sans leading-relaxed">
                          {section.content}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6">
        <ReferenceManager
          references={currentBrief.references}
          onAddReference={addReferenceToBrief}
          onRemoveReference={removeReferenceFromBrief}
        />
      </div>

      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
        <button onClick={() => setCurrentView("dashboard")} className="text-gray-600 hover:text-gray-800 text-sm">
          ← {t("briefDisplay.backToDashboard")}
        </button>
        <div className="flex gap-3">
          {saveMessage && (
            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm">
              <CheckCircle2 className="w-4 h-4" />
              {saveMessage}
            </div>
          )}
          {canEdit && currentBrief.status === "draft" && (
            <>
              <button
                onClick={handleSaveDraft}
                className="px-6 py-2 border-2 border-[var(--color-primary)] text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary)]/5 transition-colors"
              >
                {t("briefDisplay.saveDraft")}
              </button>
              <button
                onClick={handleAIReviewClick}
                disabled={!allConfirmed}
                className={`px-6 py-2 rounded-lg transition-all flex items-center gap-2 ${
                  allConfirmed
                    ? "bg-gradient-to-r from-[var(--accent-violet)] to-[var(--accent-sky)] text-white hover:opacity-90"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <Sparkles className="w-4 h-4" />
                {t("briefDisplay.submitForAIReview")}
              </button>
            </>
          )}
          <button
            onClick={() => setShowExportModal(true)}
            className="px-6 py-2 bg-[var(--accent-sky)] text-white rounded-lg hover:bg-[var(--accent-sky)]/90 transition-colors"
          >
            {t("briefDisplay.exportBrief")}
          </button>
        </div>
      </div>

      <AIReviewModal
        isOpen={showAIReviewModal}
        onClose={() => setShowAIReviewModal(false)}
        onConfirm={handleSubmitForAIReview}
        briefTitle={currentBrief.title}
        briefSummary={{
          sections: sections.length,
          confirmedSections: confirmedSections.size,
          assets: 0,
          references: selectedCitations.length,
        }}
      />

      <ExportModal isOpen={showExportModal} onClose={() => setShowExportModal(false)} briefTitle={currentBrief.title} />
    </div>
  )
}

export { BriefDisplay }
