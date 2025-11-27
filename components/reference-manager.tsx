"use client"

import { FileText } from "lucide-react"
import { CitationSearch } from "./citation-search"
import { useTranslation } from "@/lib/i18n"

interface Reference {
  id: string
  title: string
  url: string
  type: "clinical-study" | "regulatory" | "competitor" | "internal"
  description: string
  addedAt: Date
}

interface ReferenceManagerProps {
  references: Reference[]
  onAddReference: (reference: Omit<Reference, "id" | "addedAt">) => void
  onRemoveReference: (id: string) => void
}

export function ReferenceManager({ references, onAddReference, onRemoveReference }: ReferenceManagerProps) {
  const { t } = useTranslation()

  return (
    <div className="bg-card rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-[var(--color-primary)] flex items-center gap-2">
          <FileText className="w-5 h-5" />
          {t("referenceManager.title")}
        </h3>
      </div>

      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-900 mb-3">{t("referenceManager.medicalCitations")}</h4>
        <CitationSearch />
      </div>
    </div>
  )
}
