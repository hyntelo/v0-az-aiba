"use client"

import { cn } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n"
import { AlertTriangle } from "lucide-react"

export type StepStatus = "completed" | "active" | "pending" | "disabled"

export interface Step {
  id: number
  label: string
  status: StepStatus
  warning?: boolean // Show warning icon when true
}

interface BriefStepperProps {
  steps: Step[]
  onStepClick?: (stepId: number) => void
}

export function BriefStepper({ steps, onStepClick }: BriefStepperProps) {
  const { t } = useTranslation()

  const handleStepClick = (step: Step) => {
    // Allow clicking on steps that are before the current active step (for backward navigation)
    if (onStepClick) {
      onStepClick(step.id)
    }
  }

  return (
    <div className="w-full py-4">
      <div className="flex items-start justify-between">
        {steps.map((step) => {
          return (
            <div key={step.id} className="flex flex-col items-center flex-1 relative">
              <button
                type="button"
                onClick={() => handleStepClick(step)}
                className={cn(
                  "flex items-center justify-center w-7 h-7 rounded-full border transition-all duration-200 relative",
                  {
                    "bg-[#8582FC]/10 border-[#8582FC] text-[#8582FC]": step.status === "active",
                    "bg-transparent border-gray-300 text-gray-500 cursor-pointer hover:border-gray-400 hover:text-gray-600":
                      step.status === "pending",
                    "bg-transparent border-gray-200 text-gray-300 cursor-not-allowed":
                      step.status === "disabled",
                  },
                  step.status !== "disabled" && "hover:scale-105"
                )}
              >
                <span className="text-xs font-medium">{step.id}</span>
                {step.warning && (
                  <AlertTriangle className="absolute -top-1 -right-1 w-4 h-4 text-amber-500 fill-amber-50" />
                )}
              </button>
              <div className="mt-1.5 text-center">
                <p
                  className={cn("text-[10px] leading-tight", {
                    "text-[#8582FC] font-medium": step.status === "active",
                    "text-gray-500": step.status === "pending" || step.status === "disabled",
                  })}
                >
                  {step.label}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

