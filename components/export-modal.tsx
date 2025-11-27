"use client"

import { useState } from "react"
import { X, FileText, File, CheckCircle2 } from "lucide-react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n"
import { useAppStore } from "@/lib/store"

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
  briefTitle: string
}

export function ExportModal({ isOpen, onClose, briefTitle }: ExportModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [exportComplete, setExportComplete] = useState(false)

  const { t } = useTranslation()
  const { currentBrief, brandGuidelines, getSelectedCitations } = useAppStore()

  const exportFormats = [
    {
      id: "pdf",
      name: t("exportModal.pdfDocument"),
      description: t("exportModal.pdfDescription"),
      icon: FileText,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      id: "word",
      name: t("exportModal.wordDocument"),
      description: t("exportModal.wordDescription"),
      icon: File,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
  ]

  const handleExport = async (formatId: string) => {
    setSelectedFormat(formatId)
    setIsExporting(true)
    setExportComplete(false)

    if (formatId === "pdf" && currentBrief) {
      try {
        const { default: jsPDF } = await import("jspdf")
        const doc = new jsPDF()

        const selectedCitations = getSelectedCitations()

        const targetAudienceName = currentBrief.campaignData.targetAudiencePresetId
          ? brandGuidelines.targetAudiencePresets.find(
              (preset) => preset.id === currentBrief.campaignData.targetAudiencePresetId,
            )?.name
          : undefined

        const communicationStyleName = currentBrief.campaignData.communicationPersonalityId
          ? brandGuidelines.communicationPersonalities.find(
              (p) => p.id === currentBrief.campaignData.communicationPersonalityId,
            )?.name
          : undefined

        const pageWidth = doc.internal.pageSize.getWidth()
        const pageHeight = doc.internal.pageSize.getHeight()
        const margin = 20
        const maxWidth = pageWidth - 2 * margin
        let yPosition = margin

        const addText = (text: string, fontSize: number, isBold = false) => {
          doc.setFontSize(fontSize)
          doc.setFont("helvetica", isBold ? "bold" : "normal")
          const lines = doc.splitTextToSize(text, maxWidth)

          lines.forEach((line: string) => {
            if (yPosition > pageHeight - margin) {
              doc.addPage()
              yPosition = margin
            }
            doc.text(line, margin, yPosition)
            yPosition += fontSize * 0.5
          })
          yPosition += 5
        }

        addText(currentBrief.title, 20, true)
        yPosition += 5

        addText("Campaign Context", 16, true)
        addText(`Brand: ${currentBrief.campaignData.brand}`, 11)
        if (targetAudienceName) {
          addText(`Target Audience: ${targetAudienceName}`, 11)
        }
        if (communicationStyleName) {
          addText(`Communication Style: ${communicationStyleName}`, 11)
        }
        if (currentBrief.campaignData.channels && currentBrief.campaignData.channels.length > 0) {
          addText(`Channels: ${currentBrief.campaignData.channels.join(", ")}`, 11)
        }
        if (currentBrief.campaignData.requestSummary) {
          addText("Request Summary:", 11, true)
          addText(currentBrief.campaignData.requestSummary, 11)
        }
        yPosition += 10

        if (currentBrief.generatedContent?.objectives) {
          addText("Campaign Objectives", 16, true)
          addText(currentBrief.generatedContent.objectives, 11)
          yPosition += 10
        }

        if (currentBrief.generatedContent?.keyMessages) {
          addText("Key Messages", 16, true)
          addText(currentBrief.generatedContent.keyMessages, 11)
          yPosition += 10
        }

        if (currentBrief.generatedContent?.toneOfVoice) {
          addText("Tone of Voice", 16, true)
          addText(currentBrief.generatedContent.toneOfVoice, 11)
          yPosition += 10
        }

        if (currentBrief.generatedContent?.complianceNotes) {
          addText("Compliance Notes", 16, true)
          addText(currentBrief.generatedContent.complianceNotes, 11)
          yPosition += 10
        }

        if (selectedCitations.length > 0) {
          addText("Selected References", 16, true)
          selectedCitations.forEach((citation, index) => {
            addText(`[${index + 1}] ${citation.title}`, 11, true)
            const authorsText = citation.authors.join(", ")
            addText(`Authors: ${authorsText}`, 10)
            addText(`${citation.journal} (${citation.year})`, 10)
            addText(`Study Type: ${citation.studyType}`, 10)
            yPosition += 3
          })
        }

        doc.save(`${briefTitle.replace(/\s+/g, "_")}.pdf`)
      } catch (error) {
        console.error("[v0] PDF generation error:", error)
      }
    } else if (formatId === "word") {
      await new Promise((resolve) => setTimeout(resolve, 2500))

      const format = exportFormats.find((f) => f.id === formatId)
      const fileName = `${briefTitle.replace(/\s+/g, "_")}.${formatId}`

      const mockContent = `Mock ${format?.name} export for: ${briefTitle}`
      const blob = new Blob([mockContent], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }

    setIsExporting(false)
    setExportComplete(true)
  }

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={onClose}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="ui-overlay data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className={cn(
            "fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-50",
            "bg-popover rounded-lg shadow-xl max-w-md w-full mx-4",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "duration-200",
          )}
          aria-describedby="export-modal-description"
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <DialogPrimitive.Title className="text-lg font-medium text-[var(--color-primary)]">
              {t("exportModal.exportBrief")}
            </DialogPrimitive.Title>
            <DialogPrimitive.Close className="text-gray-400 hover:text-gray-600 transition-colors">
              <X className="w-5 h-5" />
              <span className="sr-only">{t("common.close")}</span>
            </DialogPrimitive.Close>
          </div>

          <div className="p-6" id="export-modal-description">
            {!exportComplete ? (
              <>
                <p className="text-gray-600 mb-6">{t("exportModal.chooseFormat")}</p>

                <div className="space-y-3">
                  {exportFormats.map((format) => {
                    const Icon = format.icon
                    const isSelected = selectedFormat === format.id
                    const isCurrentlyExporting = isExporting && isSelected

                    return (
                      <button
                        key={format.id}
                        onClick={() => handleExport(format.id)}
                        disabled={isExporting}
                        className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                          isSelected
                            ? "border-[var(--accent-violet)] bg-[var(--accent-violet)]/5"
                            : "border-gray-200 hover:border-[var(--accent-violet)]/50 hover:bg-gray-50"
                        } ${isExporting && !isSelected ? "opacity-50" : ""}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${format.bgColor}`}>
                            <Icon className={`w-5 h-5 ${format.color}`} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{format.name}</h3>
                            <p className="text-sm text-gray-600">{format.description}</p>
                          </div>
                          {isCurrentlyExporting && (
                            <div className="flex items-center gap-2 text-[var(--accent-violet)]">
                              <div className="w-4 h-4 border-2 border-[var(--accent-violet)] border-t-transparent rounded-full animate-spin"></div>
                              <span className="text-sm">{t("exportModal.exporting")}</span>
                            </div>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t("exportModal.exportSuccessful")}</h3>
                <p className="text-gray-600 mb-6">{t("exportModal.downloadComplete")}</p>
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-[var(--accent-violet)] text-white rounded-lg hover:bg-[var(--accent-violet)]/90 transition-colors"
                >
                  {t("common.close")}
                </button>
              </div>
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
