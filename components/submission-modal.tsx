"use client"

import { useState } from "react"
import { X, Send, CheckCircle2, AlertTriangle, FileText, ImageIcon, Link } from "lucide-react"
import { useTranslation } from "@/lib/i18n"

interface SubmissionModalProps {
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

export function SubmissionModal({ isOpen, onClose, onConfirm, briefTitle, briefSummary }: SubmissionModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { t } = useTranslation()

  if (!isOpen) return null

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simulate submission delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
    onConfirm()
    setIsSubmitting(false)
  }

  const completionPercentage = Math.round((briefSummary.confirmedSections / briefSummary.sections) * 100)
  const isReadyForSubmission = briefSummary.confirmedSections >= Math.ceil(briefSummary.sections * 0.5) // At least 50% confirmed

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div
        className="bg-popover rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        style={{ boxShadow: "0 12px 24px rgba(0, 0, 0, 0.12)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-medium" style={{ color: "#211C38" }}>
            {t("submissionModal.submitBriefForReview")}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-2">{briefTitle}</h3>
            <p className="text-sm text-gray-600">{t("submissionModal.submittingBriefForReview")}</p>
          </div>

          {/* Brief Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-gray-900 mb-3">{t("submissionModal.briefSummary")}</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FileText className="w-4 h-4" />
                  {t("submissionModal.contentSections")}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {briefSummary.confirmedSections}/{briefSummary.sections}
                  </span>
                  <div
                    className={`w-2 h-2 rounded-full ${
                      completionPercentage >= 75
                        ? "bg-green-500"
                        : completionPercentage >= 50
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }`}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <ImageIcon className="w-4 h-4" />
                  {t("submissionModal.attachedAssets")}
                </div>
                <span className="text-sm font-medium">{briefSummary.assets}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Link className="w-4 h-4" />
                  {t("submissionModal.references")}
                </div>
                <span className="text-sm font-medium">{briefSummary.references}</span>
              </div>
            </div>

            {/* Completion Status */}
            <div className="mt-4 pt-3 border-t border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                {isReadyForSubmission ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                )}
                <span className="text-sm font-medium">
                  {completionPercentage}% {t("submissionModal.complete")}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    completionPercentage >= 75
                      ? "bg-green-500"
                      : completionPercentage >= 50
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Warning for incomplete briefs */}
          {!isReadyForSubmission && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">{t("submissionModal.incompleteBrief")}</p>
                  <p className="text-sm text-yellow-700">{t("submissionModal.considerConfirmingMoreSections")}</p>
                </div>
              </div>
            </div>
          )}

          {/* Submission Info */}
          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <Send className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-800">{t("submissionModal.whatHappensNext")}</p>
              <ul className="text-sm text-blue-700 mt-1 space-y-1">
                <li>• {t("submissionModal.statusChanges")}</li>
                <li>• {t("submissionModal.strategistNotified")}</li>
                <li>• {t("submissionModal.becomesReadOnly")}</li>
                <li>• {t("submissionModal.youllBeNotified")}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={isSubmitting}
          >
            {t("submissionModal.cancel")}
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: "#8582FC" }}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {t("submissionModal.submitting")}
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                {t("submissionModal.submitForReview")}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
