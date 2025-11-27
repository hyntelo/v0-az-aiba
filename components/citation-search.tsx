"use client"

import React, { useMemo, useState } from "react"
import { Search, Loader2, Sparkles } from "lucide-react"
import { CitationItem } from "./citation-item"
import { CitationsModal } from "./citations-modal"
import { SplitButton } from "./ui/split-button"
import { useAppStore } from "@/lib/store"
import { useTranslation } from "@/lib/i18n"

export const CitationSearch = React.memo(() => {
  const { t } = useTranslation()

  const {
    citations,
    currentBrief,
    searchCitationsWithAI,
    setCitationSearchQuery,
    getFilteredCitations,
    setAiSelectionMode,
    selectSelectionCount,
  } = useAppStore()

  const [showModal, setShowModal] = useState(false)

  const filteredCitations = useMemo(
    () => getFilteredCitations(),
    [citations.citationSearchQuery, citations.mockCitations],
  )

  const sortedCitations = useMemo(() => {
    return [...filteredCitations].sort((a, b) => {
      // Sort by relevance score first
      if (b.relevanceScore !== a.relevanceScore) {
        return b.relevanceScore - a.relevanceScore
      }
      // Then by year (newer first)
      if (b.year !== a.year) {
        return b.year - a.year
      }
      // Finally by title for stable sorting
      return a.title.localeCompare(b.title)
    })
  }, [filteredCitations])

  const displayedCitations = sortedCitations.slice(0, 5)
  const shouldShowViewAll = sortedCitations.length > 5

  const selectionCount = selectSelectionCount()

  const handleAISearch = async (mode: "merge" | "replace") => {
    if (!currentBrief) return

    setAiSelectionMode(mode)
    const briefContext = {
      topic: currentBrief.title,
      id: currentBrief.id,
    }

    await searchCitationsWithAI(briefContext)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCitationSearchQuery(e.target.value)
  }

  const handleViewAllClick = () => {
    setShowModal(true)
  }

  const handleModalClose = () => {
    setShowModal(false)
  }

  return (
    <div className="space-y-4">
      {/* AI Discovery Button with Split Options */}
      <div className="flex items-center gap-3">
        <SplitButton
          label={t("citationSearch.findWithAI")}
          icon={
            citations.isSearchingCitations ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )
          }
          loading={citations.isSearchingCitations}
          onPrimary={() => handleAISearch("merge")}
          menuItems={[
            {
              label: t("citationSearch.addToSelection"),
              onSelect: () => handleAISearch("merge"),
            },
            {
              label: t("citationSearch.replaceSelection"),
              onSelect: () => handleAISearch("replace"),
            },
          ]}
        />

        {selectionCount > 0 && (
          <span className="text-sm text-muted-foreground">
            {selectionCount}{" "}
            {selectionCount === 1 ? t("citationSearch.citationSelected") : t("citationSearch.citationsSelected")}
          </span>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder={t("citationSearch.searchPlaceholder")}
          value={citations.citationSearchQuery}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--accent-violet)] focus:border-transparent"
          aria-label={t("citationSearch.searchPlaceholder")}
        />
      </div>

      {/* Loading State */}
      {citations.isSearchingCitations && (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-3 text-gray-600">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>{t("citationSearch.aiSearching")}</span>
          </div>
        </div>
      )}

      {/* Citations List */}
      {!citations.isSearchingCitations && (
        <div className="space-y-3">
          {displayedCitations.length > 0 ? (
            <>
              {displayedCitations.map((citation) => (
                <CitationItem key={citation.id} citation={citation} searchQuery={citations.citationSearchQuery} />
              ))}

              {shouldShowViewAll && (
                <div className="pt-2">
                  <button
                    onClick={handleViewAllClick}
                    className="w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    {t("citationSearch.viewAll")} ({sortedCitations.length})
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>{t("citationSearch.noCitationsFound")}</p>
              <p className="text-sm">{t("citationSearch.tryAdjusting")}</p>
            </div>
          )}
        </div>
      )}

      <CitationsModal
        isOpen={showModal}
        onClose={handleModalClose}
        citations={sortedCitations}
        searchQuery={citations.citationSearchQuery}
      />
    </div>
  )
})

CitationSearch.displayName = "CitationSearch"
