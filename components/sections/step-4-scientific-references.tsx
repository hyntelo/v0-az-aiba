"use client"

import React, { useState, useEffect, useRef, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ItemsManager } from "@/components/shared/items-manager"
import { type TableColumn } from "@/components/shared/searchable-items-table"
import { type ResultColumn } from "@/components/shared/search-results-modal"
import { useTranslation } from "@/lib/i18n"
import { useAppStore } from "@/lib/store"
import type { ScientificReference, KnowledgeBaseDocument, BriefData } from "@/lib/store/types"
import { searchKnowledgeBase, addDocumentToKnowledgeBase } from "@/lib/mock-knowledge-base"
import { KnowledgeBaseModal } from "./knowledge-base-modal"
import { UploadPaperModal } from "./upload-paper-modal"
import { Search, Upload, Check, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function Step4ScientificReferences() {
  const { t } = useTranslation()
  const { campaignData, setCampaignData, currentBrief, createdBriefs } = useAppStore()
  const [references, setReferences] = useState<ScientificReference[]>(
    campaignData.scientificReferences || []
  )
  const [isAutoSearching, setIsAutoSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<KnowledgeBaseDocument[]>([])
  const [isKnowledgeBaseModalOpen, setIsKnowledgeBaseModalOpen] = useState(false)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  
  // Track last searched context to avoid redundant searches
  const lastSearchedContextRef = useRef<string>("")
  
  // Sync references when campaignData changes
  useEffect(() => {
    if (campaignData.scientificReferences) {
      setReferences(campaignData.scientificReferences)
    }
  }, [campaignData.scientificReferences])
  
  // Get original brief if current brief is duplicated
  const originalBrief: BriefData | null = useMemo(() => {
    if (!currentBrief?.duplicatedFromBriefId) {
      return null
    }
    return createdBriefs.find((b) => b.id === currentBrief.duplicatedFromBriefId) || null
  }, [currentBrief, createdBriefs])
  
  // Identify inherited references (references that exist in original brief)
  const inheritedReferenceIds = useMemo(() => {
    if (!originalBrief) {
      return new Set<string>()
    }
    const originalReferences = originalBrief.campaignData.scientificReferences || []
    return new Set(originalReferences.map((ref) => ref.id))
  }, [originalBrief])
  
  // Get validated reference IDs
  const validatedReferenceIds = useMemo(() => {
    return new Set(campaignData.validatedReferences || [])
  }, [campaignData.validatedReferences])
  
  // Check if there are unvalidated inherited references
  const hasUnvalidatedInherited = useMemo(() => {
    if (!originalBrief) {
      return false
    }
    const unvalidated = references.filter(
      (ref) => inheritedReferenceIds.has(ref.id) && !validatedReferenceIds.has(ref.id)
    )
    return unvalidated.length > 0
  }, [references, inheritedReferenceIds, validatedReferenceIds, originalBrief])
  
  // Validate a single reference
  const validateReference = (referenceId: string) => {
    const currentValidated = campaignData.validatedReferences || []
    if (!currentValidated.includes(referenceId)) {
      setCampaignData({
        ...campaignData,
        validatedReferences: [...currentValidated, referenceId],
      })
    }
  }
  
  // Validate all inherited references
  const validateAllReferences = () => {
    const inheritedIds = references
      .filter((ref) => inheritedReferenceIds.has(ref.id))
      .map((ref) => ref.id)
    const currentValidated = campaignData.validatedReferences || []
    const newValidated = Array.from(new Set([...currentValidated, ...inheritedIds]))
    setCampaignData({
      ...campaignData,
      validatedReferences: newValidated,
    })
  }

  const handleReferencesChange = (newReferences: ScientificReference[]) => {
    setReferences(newReferences)
    
    // Remove validation state for deleted references
    const currentValidated = campaignData.validatedReferences || []
    const remainingIds = new Set(newReferences.map((ref) => ref.id))
    const updatedValidated = currentValidated.filter((id) => remainingIds.has(id))
    
    setCampaignData({
      ...campaignData,
      scientificReferences: newReferences,
      validatedReferences: updatedValidated,
    })
  }

  // Automatic AI search when Step 1 context changes
  useEffect(() => {
    const contextKey = JSON.stringify({
      projectName: campaignData.projectName,
      brand: campaignData.brand,
      specialty: campaignData.specialty,
      requestSummary: campaignData.requestSummary,
      therapeuticArea: campaignData.therapeuticArea,
    })

    // Only search if context has changed and we have enough context
    if (
      contextKey !== lastSearchedContextRef.current &&
      (campaignData.projectName || campaignData.specialty || campaignData.requestSummary)
    ) {
      lastSearchedContextRef.current = contextKey
      performAutoSearch()
    }
  }, [
    campaignData.projectName,
    campaignData.brand,
    campaignData.specialty,
    campaignData.requestSummary,
    campaignData.therapeuticArea,
  ])

  const performAutoSearch = async () => {
    setIsAutoSearching(true)
    try {
      const results = await searchKnowledgeBase(campaignData)
      setSearchResults(results)
    } catch (error) {
      console.error("Auto search error:", error)
    } finally {
      setIsAutoSearching(false)
    }
  }


  // Handle document selection from modal
  const handleDocumentSelect = (document: KnowledgeBaseDocument, selectedClaimIds: string[]) => {
    handleAddDocumentToBrief(document, selectedClaimIds)
    setIsKnowledgeBaseModalOpen(false)
  }

  // Add document to brief with selected claims
  const handleAddDocumentToBrief = (document: ScientificReference | KnowledgeBaseDocument, selectedClaimIds: string[]) => {
    const referenceToAdd: ScientificReference = {
      ...document,
      selectedClaims: selectedClaimIds,
      claimsCount: document.claimsCount || (document as KnowledgeBaseDocument).claims?.length || 0,
    }

    // Check if already exists
    const exists = references.some((ref) => ref.id === referenceToAdd.id)
    if (exists) {
      // Update existing
      const updated = references.map((ref) =>
        ref.id === referenceToAdd.id ? referenceToAdd : ref
      )
      handleReferencesChange(updated)
    } else {
      // Add new
      handleReferencesChange([...references, referenceToAdd])
    }
  }

  // Handle opening the knowledge base modal
  const handleOpenKnowledgeBaseModal = async () => {
    // If we don't have search results yet, perform search
    if (searchResults.length === 0 && !isAutoSearching) {
      await performAutoSearch()
    }
    setIsKnowledgeBaseModalOpen(true)
  }

  // Handle opening the upload modal
  const handleOpenUploadModal = () => {
    setIsUploadModalOpen(true)
  }

  // Handle upload completion - adds to both knowledge base and selected materials
  const handleUploadComplete = async (
    document: KnowledgeBaseDocument,
    selectedClaimIds: string[]
  ) => {
    // Check for duplicates
    const existingRef = references.find(
      (ref) => ref.title === document.title && ref.authors === document.authors
    )

    if (existingRef) {
      console.warn("Reference already exists")
      setIsUploadModalOpen(false)
      return
    }

    // Add to knowledge base
    addDocumentToKnowledgeBase(document)

    // Add to selected materials with selected claims
    handleAddDocumentToBrief(document, selectedClaimIds)

    // Refresh search results to show the newly uploaded document at the top
    const updatedResults = await searchKnowledgeBase(campaignData)
    setSearchResults(updatedResults)

    // Close modal
    setIsUploadModalOpen(false)

    // Show success message (in real app, use toast)
    console.log(t("form.steps.step4.upload.addedToKnowledgeBase"))
  }

  // Render validation action for table rows
  const renderValidationAction = (item: ScientificReference, itemId: string) => {
    const isInherited = inheritedReferenceIds.has(itemId)
    const isValidated = validatedReferenceIds.has(itemId)
    
    if (!isInherited) {
      return null
    }
    
    if (isValidated) {
      return (
        <Button
          variant="ghost"
          size="sm"
          disabled
          className="h-8 text-green-600 hover:text-green-600"
          aria-label={t("form.steps.step4.validatedReference")}
        >
          <Check className="w-4 h-4" />
        </Button>
      )
    }
    
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => validateReference(itemId)}
        className="h-8"
        aria-label={t("form.steps.step4.validateReference")}
      >
        {t("form.steps.step4.validateReference")}
      </Button>
    )
  }
  
  const tableColumns: TableColumn<ScientificReference>[] = [
    {
      key: "referenceId",
      label: t("form.steps.step4.table.referenceId"),
      render: (item) => (
        <div className="min-w-0 max-w-full">
          <span className="font-mono text-sm truncate block" title={item.referenceId}>
            {item.referenceId}
          </span>
        </div>
      ),
      hideOnMobile: true,
    },
    {
      key: "title",
      label: t("form.steps.step4.table.titleColumn"),
      render: (item) => (
        <div className="min-w-0 max-w-full">
          <span className="truncate block" title={item.title}>
            {item.title}
          </span>
        </div>
      ),
    },
    {
      key: "authors",
      label: t("form.steps.step4.table.authors"),
      render: (item) => (
        <div className="min-w-0 max-w-full">
          <span className="truncate block" title={item.authors}>
            {item.authors}
          </span>
        </div>
      ),
    },
    {
      key: "publicationDate",
      label: t("form.steps.step4.table.publicationDate"),
      render: (item) => (
        <div className="min-w-0 max-w-full whitespace-nowrap">
          <span>
            {item.publicationDate ? new Date(item.publicationDate).toLocaleDateString("it-IT") : "-"}
          </span>
        </div>
      ),
      hideOnMobile: true,
    },
    {
      key: "claimsCount",
      label: t("form.steps.step4.table.claimsCount"),
      render: (item) => {
        const selectedCount = item.selectedClaims?.length || 0
        const totalCount = item.claimsCount || 0
        return (
          <div className="min-w-0 max-w-full whitespace-nowrap">
            <span className="text-sm text-muted-foreground">
              {selectedCount} di {totalCount}
            </span>
          </div>
        )
      },
      hideOnMobile: true,
    },
  ]

  const resultColumns: ResultColumn<ScientificReference>[] = [
    {
      key: "referenceId",
      label: t("form.steps.step4.table.referenceId"),
      render: (item) => <span className="font-mono text-sm">{item.referenceId}</span>,
      className: "w-[120px]",
      hideOnMobile: true,
    },
    {
      key: "title",
      label: t("form.steps.step4.table.titleColumn"),
      render: (item) => <span className="truncate block" title={item.title}>{item.title}</span>,
    },
    {
      key: "authors",
      label: t("form.steps.step4.table.authors"),
      render: (item) => <span className="truncate block" title={item.authors}>{item.authors}</span>,
    },
    {
      key: "publicationDate",
      label: t("form.steps.step4.table.publicationDate"),
      render: (item) => (
        <span className="whitespace-nowrap">
          {item.publicationDate ? new Date(item.publicationDate).toLocaleDateString("it-IT") : "-"}
        </span>
      ),
      className: "w-[120px]",
      hideOnMobile: true,
    },
    {
      key: "claimsCount",
      label: t("form.steps.step4.table.claimsCount"),
      render: (item) => (
        <span className="text-sm font-medium whitespace-nowrap">
          {item.claimsCount || 0}
        </span>
      ),
      className: "w-[100px] text-center",
      hideOnMobile: true,
    },
  ]

  return (
    <>
      <Card className="hyntelo-elevation-3">
        <CardHeader>
          <CardTitle className="text-lg font-medium">{t("form.steps.step4.title")}</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {t("form.steps.step4.description")}
          </p>
        </CardHeader>
        <CardContent>
          {/* Action Buttons */}
          <div className="flex gap-3 mb-6">
            <Button
              onClick={handleOpenKnowledgeBaseModal}
              variant="default"
              className="flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              {t("form.steps.step4.buttons.search")}
            </Button>
            <Button
              onClick={handleOpenUploadModal}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              {t("form.steps.step4.buttons.upload")}
            </Button>
          </div>

          {/* Alert banner for duplicated briefs */}
          {originalBrief && hasUnvalidatedInherited && (
            <Alert className="mb-6 border-amber-200 bg-amber-50">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                {t("form.steps.step4.duplicationWarning")}
              </AlertDescription>
            </Alert>
          )}
          
          {/* Validate all button */}
          {originalBrief && hasUnvalidatedInherited && (
            <div className="mb-4">
              <Button
                onClick={validateAllReferences}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                {t("form.steps.step4.validateAllReferences")}
              </Button>
            </div>
          )}

          <ItemsManager
            searchConfig={{
              enabled: false, // Disable search section since we show results in modal
            }}
            uploadConfig={{
              enabled: false, // Disable upload section since we use the upload modal
            }}
            tableConfig={{
              title: (count: number) => t("form.steps.step4.table.titleWithCount", { count }),
              columns: tableColumns,
              emptyMessage: t("form.steps.step4.table.emptyMessage"),
              renderActions: renderValidationAction,
            }}
            items={references}
            onItemsChange={handleReferencesChange}
            getItemId={(item) => item.id}
          />
        </CardContent>
      </Card>

      {/* Knowledge Base Modal */}
      <KnowledgeBaseModal
        isOpen={isKnowledgeBaseModalOpen}
        onClose={() => setIsKnowledgeBaseModalOpen(false)}
        documents={searchResults}
        isLoading={isAutoSearching}
        onDocumentSelect={handleDocumentSelect}
        resultColumns={resultColumns}
      />

      {/* Upload Paper Modal */}
      <UploadPaperModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onComplete={handleUploadComplete}
      />
    </>
  )
}
