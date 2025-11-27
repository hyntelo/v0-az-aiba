"use client"

import { Badge } from "@/components/ui/badge"
import { Clock, Eye } from "lucide-react"
import type { BriefStatus } from "@/lib/store/types"
import { useTranslation } from "@/lib/i18n"

interface BriefStatusIndicatorProps {
  status: BriefStatus
  size?: "sm" | "md" | "lg"
  showIcon?: boolean
}

export default function BriefStatusIndicator({ status, size = "md", showIcon = true }: BriefStatusIndicatorProps) {
  const { t } = useTranslation()

  const statusConfig = {
    draft: {
      label: t("briefStatus.draft"),
      color: "bg-gray-100 text-gray-800 border-gray-200",
      icon: Clock,
    },
    "ai-reviewed": {
      label: t("briefStatus.aiReviewed"),
      color: "bg-accent-sky/10 text-accent-sky border-accent-sky/20",
      icon: Eye,
    },
  } as const

  const config = statusConfig[status]
  const Icon = config.icon

  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-2",
  }

  return (
    <Badge variant="outline" className={`${config.color} ${sizeClasses[size]} font-medium border`}>
      {showIcon && <Icon className="w-3 h-3 mr-1" />}
      {config.label}
    </Badge>
  )
}
