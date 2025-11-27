"use client"

import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"

interface BackButtonProps {
  className?: string
}

export function BackButton({ className }: BackButtonProps) {
  const { currentView, goBack, canGoBack, navigationHistory } = useAppStore()

  const shouldShow = canGoBack()
  console.log("[v0] BackButton render:", {
    currentView,
    navigationHistory,
    shouldShow,
    canGoBack: canGoBack(),
  })

  if (!shouldShow) {
    return null
  }

  const handleBack = () => {
    console.log("[v0] Back button clicked")
    goBack()
  }

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={handleBack}
      className={cn(
        "fixed top-2 left-57 z-[9999] h-12 w-12 rounded-full",
        "bg-white/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20",
        "hover:bg-white/20 hover:border-[var(--color-primary)]/30 hover:scale-105",
        "active:scale-95 transition-all duration-200 ease-out",
        "shadow-sm hover:shadow-md backdrop-blur-sm",
        "focus-visible:ring-2 focus-visible:ring-[var(--accent-violet)] focus-visible:ring-offset-2",
        className,
      )}
      aria-label="Go back to previous page"
    >
      <ArrowLeft className="h-5 w-5 text-[var(--color-primary)]" />
    </Button>
  )
}
