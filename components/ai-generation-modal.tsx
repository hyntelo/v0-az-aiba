"use client"

import { useEffect, useState } from "react"
import { useAppStore } from "@/lib/store"
import { useTranslation } from "@/lib/i18n"

export function AIGenerationModal() {
  const { t } = useTranslation()
  const { isGeneratingBrief, setIsGeneratingBrief, campaignData, setCurrentBrief, setCurrentView } = useAppStore()
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
          setTimeout(() => {
            generateBrief()
          }, 500)
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

  const generateBrief = () => {
    if (!campaignData) return

    const mockBrief = {
      id: `brief-${Date.now()}`,
      title: `${campaignData.brand} - ${campaignData.objective}`,
      campaignData,
      generatedContent: {
        objectives: `Primary Objective: ${campaignData.objective}\n\nSMART Goals:\n• Specific: Target ${campaignData.targetAudience} with tailored messaging\n• Measurable: Track engagement metrics across ${campaignData.channels.join(", ")}\n• Achievable: Leverage existing brand equity and market position\n• Relevant: Address current market needs and patient journey\n• Time-bound: Execute campaign within Q3-Q4 timeline`,
        keyMessages: `Core Message: "${campaignData.brand} - Advancing Patient Care Through Innovation"\n\nSupporting Messages:\n• Proven efficacy backed by clinical data\n• Patient-centric approach to treatment\n• Healthcare provider partnership and support\n• Commitment to safety and regulatory compliance\n\nCall-to-Action: "Discover how ${campaignData.brand} can make a difference in your patients' lives"`,
        toneOfVoice: `Professional & Empathetic\n\n• Authoritative yet approachable\n• Evidence-based and scientifically accurate\n• Patient-focused and compassionate\n• Clear and accessible language\n• Confident but not overpromising\n\nAvoid:\n• Overly technical jargon\n• Promotional or sales-heavy language\n• Unsubstantiated claims\n• Emotional manipulation`,
        complianceNotes: `Regulatory Requirements:\n\n• All claims must be substantiated by approved clinical data\n• Include required safety information and contraindications\n• Ensure fair balance in all promotional materials\n• Obtain legal/regulatory review before publication\n• Include appropriate copyright and trademark notices\n\nGuidelines:\n• Follow FDA/EMA promotional guidelines\n• Maintain consistency with approved labeling\n• Document all claims with supporting references\n• Review with medical affairs team`,
      },
      createdAt: new Date(),
      status: "draft" as const,
    }

    setCurrentBrief(mockBrief)
    setIsGeneratingBrief(false)
    // Don't navigate away - stay in form view (step 6 will show the brief)
  }

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
