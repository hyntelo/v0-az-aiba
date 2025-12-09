"use client"

import { useEffect, useState } from "react"
import { useAppStore } from "@/lib/store"
import { useTranslation } from "@/lib/i18n"

export function AIGenerationModal() {
  const { t } = useTranslation()
  const { isGeneratingBrief } = useAppStore()
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState("")

  useEffect(() => {
    if (!isGeneratingBrief) return

    const steps = [
      t("aiGeneration.analyzingCampaign"),
      t("aiGeneration.applyingTemplates"),
      t("aiGeneration.generatingMessages"),
      t("aiGeneration.creatingTone"),
      t("aiGeneration.integratingTimeline"),
      t("aiGeneration.finalizingBrief"),
    ]

    setCurrentStep(steps[0])

    let stepIndex = 0
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 20
        if (newProgress >= 100) {
          clearInterval(interval)
          // DON'T call generateBrief here - it's already called by campaign-form
          // The store's generateBrief() handles brief creation properly
          return 100
        }

        if (stepIndex < steps.length - 1) {
          stepIndex++
          setCurrentStep(steps[stepIndex])
        }

        return newProgress
      })
    }, 600)

    return () => clearInterval(interval)
  }, [isGeneratingBrief, t])

  if (!isGeneratingBrief) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-popover rounded-lg p-8 max-w-md w-full mx-4 shadow-xl">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <div className="absolute inset-0 border-4 border-[var(--accent-violet)] border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-2 bg-[var(--accent-violet)]/10 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-[var(--accent-violet)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>

          <h3 className="text-xl font-medium text-[var(--color-primary)] mb-2">
            {t("aiGeneration.generatingYourBrief")}
          </h3>

          <p className="text-gray-600 mb-6">{currentStep}</p>

          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="bg-[var(--accent-violet)] h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <p className="text-sm text-gray-500">
            {progress}% {t("aiGeneration.complete")}
          </p>
        </div>
      </div>
    </div>
  )
}
