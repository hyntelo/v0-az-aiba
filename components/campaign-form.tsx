"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { demoData } from "@/lib/mock-data"
import { useTranslation } from "@/lib/i18n"
import { BriefStepper, type Step, type StepStatus } from "@/components/brief-stepper"
import { Step1CampaignContext } from "@/components/sections/step-1-campaign-context"
import { Step2AdditionalContext } from "@/components/sections/step-2-additional-context"
import { Step3StartingDocuments } from "@/components/sections/step-3-starting-documents"
import { Step4ScientificReferences } from "@/components/sections/step-4-scientific-references"
import { Step2dTechnicalFields } from "@/components/sections/step-2d-technical-fields"
import { Step6BriefRecap } from "@/components/sections/step-6-brief-recap"

const TOTAL_STEPS = 6

export default function CampaignForm() {
  const { t } = useTranslation()
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const topRef = useRef<HTMLDivElement>(null)

  const {
    campaignData,
    setCampaignData,
    formErrors,
    setFormErrors,
    clearFormErrors,
    isGeneratingBrief,
    setIsGeneratingBrief,
    setCurrentView,
    resetApp,
    generateBrief,
    currentBrief,
    autoSaveDraft,
    brandGuidelines,
  } = useAppStore()

  const formData = campaignData

  const fillDemoData = () => {
    const demoDataWithChannels = {
      ...demoData,
      channels: ["whatsapp", "email", "materialiCartacei"],
    }
    setCampaignData(demoDataWithChannels)
    clearFormErrors()
    console.log("[v0] Demo data filled via keyboard shortcut")
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isAltOrOption = event.altKey || (event.getModifierState && event.getModifierState("Alt"))
      const isCKey = event.key.toLowerCase() === "c" || event.code === "KeyC"

      if (isAltOrOption && isCKey) {
        console.log("[v0] Keyboard shortcut detected - filling demo data")
        event.preventDefault()
        event.stopPropagation()
        fillDemoData()
      }
    }

    document.addEventListener("keydown", handleKeyDown, true)
    return () => document.removeEventListener("keydown", handleKeyDown, true)
  }, [])

  useEffect(() => {
    const autoSaveInterval = setInterval(async () => {
      if (
        Object.values(formData).some((value) =>
          Array.isArray(value) ? value.length > 0 : value && value.toString().trim() !== "",
        ) &&
        currentBrief
      ) {
        console.log("[v0] Auto-saving draft...")
        await autoSaveDraft()
      }
    }, 30000)

    return () => clearInterval(autoSaveInterval)
  }, [formData, currentBrief, autoSaveDraft])

  // Scroll to top when step changes
  useEffect(() => {
    setTimeout(() => {
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      window.scrollTo({ top: 0, behavior: "smooth" })
    }, 100)
  }, [currentStep])

  // Validation functions
  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.projectName?.trim()) {
      newErrors.projectName = t("form.projectNameRequired")
    }
    if (!formData.brand?.trim()) {
      newErrors.brand = t("form.brandRequired")
    }
    if (!formData.expectedLaunchDate?.trim()) {
      newErrors.expectedLaunchDate = t("form.expectedLaunchDateRequired")
    }
    if (!formData.therapeuticArea?.trim()) {
      newErrors.therapeuticArea = t("form.therapeuticAreaRequired")
    }
    if (!formData.requestSummary?.trim()) {
      newErrors.requestSummary = t("form.requestSummaryRequired")
    }
    if (!formData.channels || formData.channels.length === 0) {
      newErrors.channels = t("form.atLeastOneChannelRequired")
    }

    if (formData.expectedLaunchDate) {
      const launchDate = new Date(formData.expectedLaunchDate)
      const today = new Date()
      if (launchDate < today) {
        newErrors.expectedLaunchDate = t("form.launchDateMustBeFuture")
      }
    }

    setFormErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = (): boolean => {
    // Placeholder - always valid for now
    return true
  }

  const validateStep3 = (): boolean => {
    // Placeholder - always valid for now
    return true
  }

  const validateStep4 = (): boolean => {
    // Placeholder - always valid for now
    return true
  }

  const validateStep2d = (): boolean => {
    // Placeholder - always valid for now
    return true
  }

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1:
        return validateStep1()
      case 2:
        return validateStep2()
      case 3:
        return validateStep3()
      case 4:
        return validateStep4()
      case 5:
        return validateStep2d()
      case 6:
        return true // Step 3 (generation) doesn't need validation
      default:
        return false
    }
  }

  const handleInputChange = (field: string, value: string | string[]) => {
    const updatedData = { ...formData, [field]: value }
    setCampaignData(updatedData)

    if (formErrors[field]) {
      const newErrors = { ...formErrors }
      delete newErrors[field]
      setFormErrors(newErrors)
    }
  }

  const handleChannelChange = (channel: string, checked: boolean) => {
    const newChannels = checked ? [...formData.channels, channel] : formData.channels.filter((c) => c !== channel)
    handleInputChange("channels", newChannels)
  }

  const handleNext = () => {
    if (validateCurrentStep()) {
      const newCompletedSteps = new Set(completedSteps)
      newCompletedSteps.add(currentStep)

      if (currentStep < TOTAL_STEPS) {
        setCompletedSteps(newCompletedSteps)
        setCurrentStep(currentStep + 1)
        // Scroll to top to show stepper and title
        setTimeout(() => {
          topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
          window.scrollTo({ top: 0, behavior: "smooth" })
        }, 0)
      }
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleStepClick = (stepId: number) => {
    // Allow navigation to any step that is before or equal to the current step
    if (stepId <= currentStep) {
      setCurrentStep(stepId)
    }
  }

  const handleGenerateBrief = async () => {
    setIsGeneratingBrief(true)

    setTimeout(() => {
      generateBrief()
      setIsGeneratingBrief(false)
      setCurrentView("brief")
    }, 3000)
  }

  const handleBack = () => {
    resetApp()
  }

  // Build steps for stepper
  const buildSteps = (): Step[] => {
    return [
      {
        id: 1,
        label: t("form.steps.step1.title"),
        status: getStepStatus(1),
      },
      {
        id: 2,
        label: t("form.steps.step2.title"),
        status: getStepStatus(2),
      },
      {
        id: 3,
        label: t("form.steps.step3.title"),
        status: getStepStatus(3),
      },
      {
        id: 4,
        label: t("form.steps.step4.title"),
        status: getStepStatus(4),
      },
      {
        id: 5,
        label: t("form.steps.step2d.title"),
        status: getStepStatus(5),
      },
      {
        id: 6,
        label: t("form.steps.step6.title"),
        status: getStepStatus(6),
      },
    ]
  }

  const getStepStatus = (stepId: number): StepStatus => {
    if (stepId === currentStep) {
      return "active"
    }
    return "pending"
  }

  if (isGeneratingBrief) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md hyntelo-elevation-6">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent-violet/10 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-accent-violet animate-spin" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">{t("form.generatingBrief")}</h3>
            <p className="text-muted-foreground mb-4">{t("form.generatingDescription")}</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-accent-violet h-2 rounded-full animate-pulse" style={{ width: "70%" }}></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1CampaignContext
            formData={formData}
            formErrors={formErrors}
            brandGuidelines={brandGuidelines}
            onInputChange={handleInputChange}
            onChannelChange={handleChannelChange}
          />
        )
      case 2:
        return <Step2AdditionalContext />
      case 3:
        return <Step3StartingDocuments />
      case 4:
        return <Step4ScientificReferences />
      case 5:
        return <Step2dTechnicalFields />
      case 6:
        return <Step6BriefRecap onStepNavigate={setCurrentStep} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div ref={topRef} className="mb-8">
          <BriefStepper steps={buildSteps()} onStepClick={handleStepClick} />
        </div>

        <div className="mb-8">{renderStepContent()}</div>

        <div className="flex justify-between gap-4">
          <div>
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                className="border-primary text-primary hover:bg-primary/6 bg-transparent"
              >
                {t("form.navigation.previous")}
              </Button>
            )}
          </div>
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="border-primary text-primary hover:bg-primary/6 bg-transparent"
            >
              {t("form.cancel")}
            </Button>
            {currentStep < TOTAL_STEPS ? (
              <Button
                type="button"
                onClick={handleNext}
                className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-150 ease-out hover:scale-[0.97] active:scale-[0.97]"
              >
                {t("form.navigation.next")}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleGenerateBrief}
                className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-150 ease-out hover:scale-[0.97] active:scale-[0.97]"
              >
                {t("form.navigation.generate")}
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
