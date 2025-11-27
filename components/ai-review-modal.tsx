"use client"

import { useState, useEffect, useMemo } from "react"
import {
  X,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Edit3,
  ChevronDown,
  ChevronRight,
  Star,
  StarOff,
  XCircle,
} from "lucide-react"
import { useAppStore } from "@/lib/store"
import { formatCitation } from "@/lib/mock-data"
import { type AIFeedback, scoringRules, calcStars } from "@/lib/store/types"
import { useTranslation } from "@/lib/i18n"

interface AIReviewModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  briefTitle: string
  briefSummary: {
    sections: number
    confirmedSections: number
    assets: number
    references: number
  }
}

const Stars = ({ count }: { count: number }) => {
  const total = 3
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: total }).map((_, i) =>
        i < count ? (
          <Star key={i} className="h-5 w-5 text-yellow-500 fill-yellow-500" />
        ) : (
          <StarOff key={i} className="h-5 w-5 text-muted-foreground" />
        ),
      )}
    </div>
  )
}

const Dimension = ({ ok, label, color }: { ok: boolean; label: string; color: string }) => (
  <div className="flex items-center gap-2">
    {ok ? <CheckCircle2 className={`h-5 w-5 ${color}`} /> : <XCircle className="h-5 w-5 text-destructive" />}
    <span className="text-sm">{label}</span>
  </div>
)

const makeMockFeedback = (t: any): AIFeedback => {
  const completeness = scoringRules.completeness()
  const messaging = scoringRules.messaging()
  const compliance = scoringRules.compliance()
  const overallStars = calcStars({ completeness, messaging, compliance })
  return {
    overallStars,
    completeness,
    messaging,
    compliance,
    suggestions: [t("aiReview.mockSuggestion")],
    positivePoints: [],
  }
}

export function AIReviewModal({ isOpen, onClose, onConfirm, briefTitle, briefSummary }: AIReviewModalProps) {
  const { t } = useTranslation()

  const [reviewStage, setReviewStage] = useState<"analyzing" | "results" | "submitting">("analyzing")
  const [aiFeedback, setAiFeedback] = useState<AIFeedback | null>(null)
  const [isCitationsExpanded, setIsCitationsExpanded] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})

  const { getSelectedCitations } = useAppStore()
  const selectedCitations = getSelectedCitations()

  useEffect(() => {
    if (isOpen) {
      setReviewStage("analyzing")
      setAiFeedback(null)

      // Simulate AI analysis
      setTimeout(() => {
        const mockFeedback = makeMockFeedback(t)
        setAiFeedback(mockFeedback)
        setReviewStage("results")
      }, 2500)
    }
  }, [isOpen, t])

  const overallQuality = useMemo(() => {
    if (!aiFeedback) return ""
    return aiFeedback.overallStars === 3
      ? t("aiReview.excellentQuality")
      : aiFeedback.overallStars === 2
        ? t("aiReview.goodMinorGaps")
        : aiFeedback.overallStars === 1
          ? t("aiReview.needsWork")
          : t("aiReview.failsBaseline")
  }, [aiFeedback, t])

  if (!isOpen) return null

  const handleAcceptAndSubmit = async () => {
    setReviewStage("submitting")
    // Simulate final submission
    await new Promise((resolve) => setTimeout(resolve, 1000))
    onConfirm()
  }

  const completionPercentage = Math.round((briefSummary.confirmedSections / briefSummary.sections) * 100)

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-popover rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#8582FC] to-[#8EB4D6] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-medium" style={{ color: "#211C38" }}>
              {t("aiReview.aiBriefReview")}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={reviewStage === "submitting"}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {reviewStage === "analyzing" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#8582FC]/10 to-[#8EB4D6]/10 flex items-center justify-center">
                <div className="w-8 h-8 border-3 border-[#8582FC]/30 border-t-[#8582FC] rounded-full animate-spin" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t("aiReview.analyzingYourBrief")}</h3>
              <p className="text-gray-600 mb-4">{t("aiReview.aiIsReviewingContent")}</p>
              <div className="max-w-sm mx-auto">
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>{t("aiReview.analyzingContent")}</span>
                  <span>85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-[#8582FC] to-[#8EB4D6] transition-all duration-1000"
                    style={{ width: "85%" }}
                  />
                </div>
              </div>
            </div>
          )}

          {reviewStage === "results" && aiFeedback && (
            <div className="space-y-6">
              {/* Brief Info */}
              <div>
                <h3 className="font-medium text-gray-900 mb-2">{briefTitle}</h3>
              </div>

              {/* Selected Citations */}
              {selectedCitations.length > 0 && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg">
                  <button
                    onClick={() => setIsCitationsExpanded(!isCitationsExpanded)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-100 transition-colors"
                  >
                    <h4 className="font-medium text-gray-900">
                      {t("aiReview.selectedCitations", { count: selectedCitations.length })}
                    </h4>
                    {isCitationsExpanded ? (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                  {isCitationsExpanded && (
                    <div className="px-4 pb-4 border-t border-gray-200">
                      <ul className="space-y-2 mt-3">
                        {selectedCitations.map((citation) => (
                          <li key={citation.id} className="text-sm text-gray-700">
                            • {formatCitation(citation)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800">{overallQuality}</span>
                  </div>
                  <div
                    className="flex items-center gap-2"
                    aria-label={`${t("aiReview.overallQuality")}: ${aiFeedback.overallStars} of 3 ${t("aiReview.stars")}`}
                  >
                    <Stars count={aiFeedback.overallStars} />
                  </div>
                </div>
                <p className="text-sm text-green-700">{t("aiReview.yourBriefDemonstrates")}</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Dimension ok={aiFeedback.completeness} label={t("aiReview.completeness")} color="text-green-600" />
                <Dimension ok={aiFeedback.messaging} label={t("aiReview.messaging")} color="text-green-600" />
                <Dimension ok={aiFeedback.compliance} label={t("aiReview.compliance")} color="text-green-600" />
              </div>

              {/* Suggestions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-2 mb-3">
                  <Edit3 className="w-4 h-4 text-blue-600" />
                  <h4 className="font-medium text-blue-800">{t("aiReview.aiSuggestions")}</h4>
                </div>
                <ul className="space-y-2">
                  {aiFeedback.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-blue-700">
                      <AlertCircle className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Next Steps */}
              <div className="bg-[#8582FC]/5 border border-[#8582FC]/20 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-[#8582FC] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-[#8582FC]">{t("aiReview.readyForFinalSubmission")}</p>
                    <p className="text-sm text-gray-600 mt-1">{t("aiReview.yourBriefHasPassed")}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {reviewStage === "submitting" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#8582FC]/10 to-[#8EB4D6]/10 flex items-center justify-center">
                <div className="w-8 h-8 border-3 border-[#8582FC]/30 border-t-[#8582FC] rounded-full animate-spin" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t("aiReview.finalizingSubmission")}</h3>
              <p className="text-gray-600">{t("aiReview.completingAiReview")}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {reviewStage === "results" && (
          <div className="flex gap-3 p-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t("aiReview.makeChanges")}
            </button>
            <button
              onClick={handleAcceptAndSubmit}
              className="flex-1 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-colors flex items-center justify-center gap-2"
              style={{ backgroundColor: "#8582FC" }}
            >
              <CheckCircle2 className="w-4 h-4" />
              {t("aiReview.acceptAndSubmit")}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
