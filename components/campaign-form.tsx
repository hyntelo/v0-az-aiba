"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Save, Download, Sparkles } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { demoData } from "@/lib/mock-data"
import { useTranslation } from "@/lib/i18n"
import { useToast } from "@/hooks/use-toast"
import { BriefStepper, type Step, type StepStatus } from "@/components/brief-stepper"
import { Step1CampaignContext } from "@/components/sections/step-1-campaign-context"
import { Step3StartingDocuments } from "@/components/sections/step-3-starting-documents"
import { Step4ScientificReferences } from "@/components/sections/step-4-scientific-references"
import { Step2dTechnicalFields } from "@/components/sections/step-2d-technical-fields"
import { Step6BriefRecap } from "@/components/sections/step-6-brief-recap"
import { ExportModal } from "@/components/export-modal"

const TOTAL_STEPS = 5

export default function CampaignForm() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const [showExportModal, setShowExportModal] = useState(false)
  const [allSectionsConfirmed, setAllSectionsConfirmed] = useState(false)
  const topRef = useRef<HTMLDivElement>(null)

  const {
    campaignData,
    setCampaignData,
    formErrors,
    setFormErrors,
    clearFormErrors,
    isGeneratingBrief,
    setIsGeneratingBrief,
    resetApp,
    generateBrief,
    currentBrief,
    autoSaveDraft,
    brandGuidelines,
    saveDraft,
    setCurrentView,
    updateBriefStatus,
    addCreatedBrief,
    createdBriefs,
  } = useAppStore()
  
  // Get original brief if current brief is duplicated
  const originalBrief = currentBrief?.duplicatedFromBriefId
    ? createdBriefs.find((b) => b.id === currentBrief.duplicatedFromBriefId)
    : null

  const formData = campaignData

  // Load campaignData from currentBrief when it changes
  useEffect(() => {
    if (currentBrief && currentBrief.campaignData) {
      setCampaignData(currentBrief.campaignData)
      // If brief has generated content or is completed, navigate to step 6 (brief recap)
      // Otherwise, start at step 1 to allow editing
      if (currentBrief.generatedContent || currentBrief.status === "completato") {
        setCurrentStep(5) // Step 5 is the brief recap (step 6 in the flow)
        setCompletedSteps(new Set([1, 2, 3, 4, 5]))
        // For completed briefs, set all sections as confirmed
        if (currentBrief.status === "completato") {
          setAllSectionsConfirmed(true)
        }
      } else {
        // For drafts without generated content, start at step 1
        setCurrentStep(1)
        setCompletedSteps(new Set())
        setAllSectionsConfirmed(false)
      }
    }
  }, [currentBrief?.id, setCampaignData]) // Only run when brief ID changes

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isAltOrOption = event.altKey || (event.getModifierState && event.getModifierState("Alt"))
      const isCKey = event.key.toLowerCase() === "c" || event.code === "KeyC"

      if (isAltOrOption && isCKey) {
        // Only fill if we're on step 1
        if (currentStep !== 1) {
          return
        }

        console.log("[v0] Keyboard shortcut detected - filling step 1 MMR data")
        event.preventDefault()
        event.stopPropagation()

        // Get current campaign data from store
        const currentData = useAppStore.getState().campaignData

        const mmrData = {
          ...currentData,
          projectName: "Email su test MMR",
          requestSummary: "Approfondimento su classificazione. Modalità effettuazione del test. Linee guida ESGO. Cosa è MMR. Differenze tra dMMR e pMMR.",
          brand: "Lynparza",
          therapeuticArea: "Gyn/GU",
          specialty: "Ovaio",
          expectedLaunchDate: "2025-12-30",
          communicationPersonalityId: "scientific-communication",
          targetAudiencePresetId: "hcp",
          typology: "branded",
          channels: ["whatsapp", "email", "materialiCartacei"],
        }
        setCampaignData(mmrData)
        clearFormErrors()
        console.log("[v0] Step 1 MMR data filled via keyboard shortcut")
      }
    }

    document.addEventListener("keydown", handleKeyDown, true)
    return () => document.removeEventListener("keydown", handleKeyDown, true)
  }, [currentStep, setCampaignData, clearFormErrors])

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

  const validateStep3 = (): boolean => {
    // Placeholder - always valid for now
    return true
  }

  const validateStep4 = (): boolean => {
    // If brief is not duplicated, always valid
    if (!currentBrief?.duplicatedFromBriefId || !originalBrief) {
      return true
    }
    
    // Get original brief's scientific references
    const originalReferences = originalBrief.campaignData.scientificReferences || []
    const originalReferenceIds = new Set(originalReferences.map((ref) => ref.id))
    
    // Get current references
    const currentReferences = campaignData.scientificReferences || []
    
    // Find inherited references (references that exist in original brief)
    const inheritedReferences = currentReferences.filter((ref) =>
      originalReferenceIds.has(ref.id)
    )
    
    // If no inherited references, validation passes
    if (inheritedReferences.length === 0) {
      return true
    }
    
    // Get validated reference IDs
    const validatedReferenceIds = new Set(campaignData.validatedReferences || [])
    
    // Check if all inherited references are either validated or deleted
    // (deleted references won't be in currentReferences, so we only check existing ones)
    const unvalidatedInherited = inheritedReferences.filter(
      (ref) => !validatedReferenceIds.has(ref.id)
    )
    
    // Validation fails if there are unvalidated inherited references
    if (unvalidatedInherited.length > 0) {
      setFormErrors({
        ...formErrors,
        scientificReferences: t("form.steps.step4.referencesValidationRequired") || 
          "Devi confermare o eliminare tutti i materiali ereditati prima di procedere.",
      })
      return false
    }
    
    return true
  }

  const validateStep2d = (): boolean => {
    const newErrors: Record<string, string> = {}
    const { technicalFields, channels } = formData

    if (!channels || channels.length === 0) {
      // No channels selected, so no validation needed
      setFormErrors(newErrors)
      return true
    }

    // Channel mapping (same as in Step2dTechnicalFields)
    const channelMap: Record<string, string> = {
      email: "email",
      whatsapp: "whatsapp",
      printMaterials: "printMaterials",
      materialiCartacei: "printMaterials",
    }

    // Validate fields for each selected channel
    channels.forEach((channel) => {
      const mappedChannel = channelMap[channel] || channel
      const channelData = technicalFields?.[mappedChannel as keyof typeof technicalFields] as any

      // Email and WhatsApp have the same required fields
      if (channel === "email" || channel === "whatsapp") {
        if (!channelData?.vvpmPlaceholderId?.trim()) {
          newErrors[`${channel}.vvpmPlaceholderId`] = t("form.steps.step2d.validation.vvpmPlaceholderIdRequired", { channel: t(`form.channels.${channel}`) })
        }
        if (!channelData?.utmCode?.trim()) {
          newErrors[`${channel}.utmCode`] = t("form.steps.step2d.validation.utmCodeRequired", { channel: t(`form.channels.${channel}`) })
        }
      }

      // Print Materials (materialiCartacei maps to printMaterials)
      if (channel === "printMaterials" || channel === "materialiCartacei") {
        if (!channelData?.warehouseCode?.trim()) {
          newErrors["printMaterials.warehouseCode"] = t("form.steps.step2d.validation.warehouseCodeRequired")
        }
        if (!channelData?.qrCodeLink?.trim()) {
          newErrors["printMaterials.qrCodeLink"] = t("form.steps.step2d.validation.qrCodeLinkRequired")
        }
        if (!channelData?.rcp?.trim()) {
          newErrors["printMaterials.rcp"] = t("form.steps.step2d.validation.rcpRequired")
        }
        if (!channelData?.aifaWording?.trim()) {
          newErrors["printMaterials.aifaWording"] = t("form.steps.step2d.validation.aifaWordingRequired")
        }
      }
    })

    setFormErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1:
        return validateStep1()
      case 2:
        return validateStep3()
      case 3:
        return validateStep4()
      case 4:
        return validateStep2d()
      case 5:
        return true // Step 5 (generation) doesn't need validation
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
        // If moving from step 4 to step 5, trigger AI generation
        if (currentStep === 4) {
          // Set loading state first to show modal
          setIsGeneratingBrief(true)
          // Generate brief - isGeneratingBrief is controlled externally
          generateBrief().then(() => {
            // After 3 seconds, move to step 5 first, then hide modal
            // This prevents the flash of step 4 content
            setTimeout(() => {
              setCompletedSteps(newCompletedSteps)
              setCurrentStep(5)
              // Use requestAnimationFrame to ensure step 5 is painted before hiding loader
              // Double RAF ensures the browser has painted the new step before we clear the loading state
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  setIsGeneratingBrief(false)
                  // Scroll to top to show stepper and title
                  setTimeout(() => {
                    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }, 0)
                })
              })
            }, 3000)
          })
        } else {
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

  // Removed handleGenerateBrief - generation now happens between step 4 and 5

  const handleBack = () => {
    resetApp()
  }

  // Build steps for stepper
  const buildSteps = (): Step[] => {
    // Check if step 3 should show warning (duplicated brief with unvalidated inherited references)
    const shouldShowWarning = (): boolean => {
      // Only show warning on step 3 (scientific references)
      if (!currentBrief?.duplicatedFromBriefId || !originalBrief) {
        return false
      }
      
      const originalReferences = originalBrief.campaignData.scientificReferences || []
      const originalReferenceIds = new Set(originalReferences.map((ref) => ref.id))
      const currentReferences = campaignData.scientificReferences || []
      const inheritedReferences = currentReferences.filter((ref) =>
        originalReferenceIds.has(ref.id)
      )
      
      if (inheritedReferences.length === 0) {
        return false
      }
      
      const validatedReferenceIds = new Set(campaignData.validatedReferences || [])
      const unvalidatedInherited = inheritedReferences.filter(
        (ref) => !validatedReferenceIds.has(ref.id)
      )
      
      return unvalidatedInherited.length > 0
    }
    
    return [
      {
        id: 1,
        label: t("form.steps.step1.title"),
        status: getStepStatus(1),
      },
      {
        id: 2,
        label: t("form.steps.step3.title"),
        status: getStepStatus(2),
      },
      {
        id: 3,
        label: t("form.steps.step4.title"),
        status: getStepStatus(3),
        warning: shouldShowWarning(),
      },
      {
        id: 4,
        label: t("form.steps.step2d.title"),
        status: getStepStatus(4),
      },
      {
        id: 5,
        label: t("form.steps.step6.title"),
        status: getStepStatus(5),
      },
    ]
  }

  const getStepStatus = (stepId: number): StepStatus => {
    if (stepId === currentStep) {
      return "active"
    }
    return "pending"
  }

  // Show AI generation modal when generating brief
  // Keep showing while isGeneratingBrief is true to prevent flash of step 4 content during transition
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
        return <Step3StartingDocuments />
      case 3:
        return <Step4ScientificReferences />
      case 4:
        return <Step2dTechnicalFields />
      case 5:
        return <Step6BriefRecap onStepNavigate={setCurrentStep} onConfirmationChange={setAllSectionsConfirmed} />
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
                {currentStep === 4 ? t("form.navigation.generate") : t("form.navigation.next")}
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowExportModal(true)}
                  className="border-primary text-primary hover:bg-primary/6 bg-transparent flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  {t("common.export")}
                </Button>
                <Button
                  type="button"
                  onClick={async () => {
                    if (!currentBrief) return

                    // Check if all sections are confirmed
                    if (!allSectionsConfirmed) {
                      toast({
                        title: t("form.steps.step6.confirmAllRequired") || "Conferma tutte le sezioni",
                        description: t("form.steps.step6.confirmAllSectionsMessage") || "Per completare il brief, devi confermare tutte le sezioni.",
                        variant: "destructive",
                      })
                      return
                    }

                    // Ensure currentBrief is in createdBriefs and they're in sync
                    const briefInCreated = createdBriefs.find((b) => b.id === currentBrief.id)
                    if (!briefInCreated) {
                      // Brief exists in currentBrief but not in createdBriefs - add it
                      addCreatedBrief(currentBrief)
                    } else {
                      // Brief exists in both - ensure they're in sync
                      // Update createdBriefs with currentBrief data to keep them synchronized
                      useAppStore.setState({
                        createdBriefs: createdBriefs.map((b) => 
                          b.id === currentBrief.id ? currentBrief : b
                        ),
                      })
                    }

                    // All sections confirmed - update status to "completato"
                    const success = updateBriefStatus(
                      currentBrief.id,
                      "completato",
                      "Brief completato dall'utente"
                    )

                    if (success) {
                      // Navigate to dashboard
                      setCurrentView("dashboard")

                      // Show success toast
                      toast({
                        title: t("form.steps.step6.briefCompleted") || "Brief completato",
                        description: t("form.steps.step6.briefCompletedSuccess") || "Il brief è stato creato con successo e aggiunto alla dashboard.",
                      })
                    }
                  }}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-150 ease-out hover:scale-[0.97] active:scale-[0.97] flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Completa
                </Button>
              </>
            )}
          </div>
        </div>
      </main>
      {showExportModal && currentBrief && (
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          briefTitle={currentBrief.title}
        />
      )}
    </div>
  )
}
