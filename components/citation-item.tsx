"use client"

import React from "react"
import { useAppStore } from "@/lib/store"
import type { MedicalCitation } from "@/lib/store/types"

interface CitationItemProps {
  citation: MedicalCitation
  searchQuery?: string
}

const studyTypeColors = {
  RCT: "bg-blue-100 text-blue-800",
  "Meta-analysis": "bg-purple-100 text-purple-800",
  "Clinical Trial": "bg-green-100 text-green-800",
  "Systematic Review": "bg-orange-100 text-orange-800",
  "Case Study": "bg-gray-100 text-gray-800",
}

export const CitationItem = React.memo(({ citation, searchQuery }: CitationItemProps) => {
  const { toggleCitationSelection, selectIsSelected } = useAppStore()
  const isSelected = selectIsSelected(citation.id)

  const checkboxId = `citation-checkbox-${citation.id}`

  const handleToggle = () => {
    toggleCitationSelection(citation.id)
  }

  const highlightText = (text: string, query?: string) => {
    if (!query || !query.trim()) return text

    const regex = new RegExp(`(${query.trim()})`, "gi")
    const parts = text.split(regex)

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      ),
    )
  }

  const authorsText =
    citation.authors.length > 3 ? `${citation.authors.slice(0, 3).join(", ")} et al.` : citation.authors.join(", ")

  return (
    <label
      htmlFor={checkboxId}
      className={`block border rounded-lg p-4 transition-all duration-200 cursor-pointer hover:shadow-md ${
        isSelected
          ? "border-[var(--accent-violet)] bg-[var(--accent-violet)]/5"
          : "border-gray-200 hover:border-gray-300"
      }`}
      aria-label={`${isSelected ? "Deselect" : "Select"} citation: ${citation.title}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          <input
            id={checkboxId}
            type="checkbox"
            checked={isSelected}
            onChange={handleToggle}
            className="w-4 h-4 text-[var(--accent-violet)] border-gray-300 rounded focus:ring-[var(--accent-violet)] focus:ring-2"
            aria-labelledby={`citation-title-${citation.id}`}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 id={`citation-title-${citation.id}`} className="font-medium text-gray-900 text-sm leading-tight">
              {highlightText(citation.title, searchQuery)}
            </h4>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${studyTypeColors[citation.studyType]}`}
            >
              {citation.studyType}
            </span>
          </div>

          <p className="text-sm text-gray-600 mb-2">{highlightText(authorsText, searchQuery)}</p>

          <div className="text-xs text-gray-500">
            <span>
              {highlightText(citation.journal, searchQuery)} • {citation.year}
            </span>
          </div>
        </div>
      </div>
    </label>
  )
})

CitationItem.displayName = "CitationItem"
