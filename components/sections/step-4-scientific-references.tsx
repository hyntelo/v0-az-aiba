"use client"

import React, { useState, useEffect, useRef, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ItemsManager } from "@/components/shared/items-manager"
import { type TableColumn } from "@/components/shared/searchable-items-table"
import { type ResultColumn } from "@/components/shared/search-results-modal"
import { useTranslation } from "@/lib/i18n"
import { useAppStore } from "@/lib/store"
import type { ScientificReference, KnowledgeBaseDocument } from "@/lib/store/types"
import type { AttachmentFile } from "@/lib/file-utils"
import { searchKnowledgeBase, addDocumentToKnowledgeBase, extractClaimsFromFile } from "@/lib/mock-knowledge-base"
import { ClaimsSelectionModal } from "./claims-selection-modal"
import { ChevronDown, ChevronUp, Loader2, Search, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

export function Step4ScientificReferences() {
  const { t } = useTranslation()
  const { campaignData, setCampaignData, currentBrief } = useAppStore()
  const [references, setReferences] = useState<ScientificReference[]>(
    campaignData.scientificReferences || []
  )
  const [isAutoSearching, setIsAutoSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<KnowledgeBaseDocument[]>([])
  const [isClaimsModalOpen, setIsClaimsModalOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<KnowledgeBaseDocument | null>(null)
  const [isSearchResultsExpanded, setIsSearchResultsExpanded] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  
  // Track last searched context to avoid redundant searches
  const lastSearchedContextRef = useRef<string>("")
  
  // Filter search results based on search query
  const filteredSearchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return searchResults
    }
    
    const query = searchQuery.toLowerCase()
    return searchResults.filter((doc) => {
      return (
        doc.title.toLowerCase().includes(query) ||
        doc.authors.toLowerCase().includes(query) ||
        doc.journal?.toLowerCase().includes(query) ||
        doc.referenceId.toLowerCase().includes(query)
      )
    })
  }, [searchResults, searchQuery])

  const handleReferencesChange = (newReferences: ScientificReference[]) => {
    setReferences(newReferences)
    setCampaignData({ ...campaignData, scientificReferences: newReferences })
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


  // Handle clicking on a document in search results
  const handleDocumentClick = (item: ScientificReference) => {
    // Find the full document with claims from search results
    const fullDocument = searchResults.find((doc) => doc.id === item.id)
    if (fullDocument && fullDocument.claims && fullDocument.claims.length > 0) {
      setSelectedDocument(fullDocument)
      setIsClaimsModalOpen(true)
    } else {
      // If no claims, just add directly
      handleAddDocumentToBrief(item, [])
    }
  }

  // Handle claims selection confirmation
  const handleClaimsConfirm = (document: KnowledgeBaseDocument, selectedClaimIds: string[]) => {
    handleAddDocumentToBrief(document, selectedClaimIds)
    setIsClaimsModalOpen(false)
    setSelectedDocument(null)
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

  // Mock regular search function
  const handleSearch = async (values: Record<string, string>): Promise<ScientificReference[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return searchResults.map((doc) => ({
      id: doc.id,
      referenceId: doc.referenceId,
      title: doc.title,
      authors: doc.authors,
      journal: doc.journal,
      publicationDate: doc.publicationDate,
      claimsCount: doc.claimsCount,
    }))
  }

  const handleFileAdd = async (file: AttachmentFile, metadata?: Record<string, string>) => {
    // Check for duplicates
    const existingRef = references.find(
      (ref) => ref.title === metadata?.title && ref.authors === metadata?.authors
    )

    if (existingRef) {
      console.warn("Reference already exists")
      return
    }

    // Extract claims from file
    const claims = await extractClaimsFromFile(new File([], file.name, { type: file.type }))

    // Create knowledge base document and add to knowledge base (not to selected materials)
    const knowledgeBaseDoc: KnowledgeBaseDocument = {
      id: `ref-${Date.now()}`,
      referenceId: `IT-${Math.floor(Math.random() * 1000000)}`,
      title: metadata?.title || file.name,
      authors: metadata?.authors || "Unknown",
      journal: metadata?.journal,
      publicationDate: metadata?.publicationDate,
      claimsCount: claims.length,
      selectedClaims: [],
      claims,
      uploadedAt: new Date(),
    }

    // Add to knowledge base only (in reverse order - newest first)
    addDocumentToKnowledgeBase(knowledgeBaseDoc)
    
    // Refresh search results to show the newly uploaded document at the top
    const updatedResults = await searchKnowledgeBase(campaignData)
    setSearchResults(updatedResults)

    // Show success message (in real app, use toast)
    console.log(t("form.steps.step4.upload.addedToKnowledgeBase"))
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
      label: t("form.steps.step4.table.title"),
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
      label: t("form.steps.step4.table.title"),
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
          {isAutoSearching && (
            <p className="text-xs text-muted-foreground mt-2">
              {t("citationSearch.aiSearching")}
            </p>
          )}
        </CardHeader>
        <CardContent>
          {/* Inline Search Results Section */}
          <Card className="hyntelo-elevation-1 mb-6">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-medium">{t("form.steps.step4.search.title")}</CardTitle>
                  {t("form.steps.step4.search.subtitle") && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {t("form.steps.step4.search.subtitle")}
                    </p>
                  )}
                </div>
                {searchResults.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsSearchResultsExpanded(!isSearchResultsExpanded)}
                    className="h-8"
                  >
                    {isSearchResultsExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </Button>
                )}
              </div>
              {isAutoSearching && (
                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t("citationSearch.aiSearching")}</span>
                </div>
              )}
            </CardHeader>
            {searchResults.length > 0 && isSearchResultsExpanded && (
              <CardContent className="pt-0 space-y-4">
                {/* Search Bar */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Cerca tra i documenti..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                
                <div className="border rounded-lg overflow-hidden">
                  <Table className="table-fixed" style={{ tableLayout: "fixed" }}>
                    <TableHeader>
                      <TableRow>
                        {resultColumns.map((column) => (
                          <TableHead 
                            key={column.key} 
                            className={cn(
                              column.hideOnMobile && "hidden md:table-cell",
                              column.className
                            )}
                          >
                            {column.label}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSearchResults.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={resultColumns.length} className="text-center py-8 text-muted-foreground">
                            Nessun documento trovato per "{searchQuery}"
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredSearchResults.map((doc) => {
                          const item: ScientificReference = {
                            id: doc.id,
                            referenceId: doc.referenceId,
                            title: doc.title,
                            authors: doc.authors,
                            journal: doc.journal,
                            publicationDate: doc.publicationDate,
                            claimsCount: doc.claimsCount,
                          }
                          return (
                            <TableRow
                              key={doc.id}
                              className="cursor-pointer hover:bg-accent-violet/5"
                              onClick={() => handleDocumentClick(item)}
                            >
                              {resultColumns.map((column) => {
                                // Special handling for title column to show upload icon
                                if (column.key === "title") {
                                  return (
                                    <TableCell 
                                      key={column.key} 
                                      className={cn(
                                        column.hideOnMobile && "hidden md:table-cell",
                                        column.className,
                                        "min-w-0"
                                      )}
                                    >
                                      <div className="flex items-center gap-2 min-w-0">
                                        {doc.uploadedAt && (
                                          <Upload className="w-4 h-4 text-accent-violet flex-shrink-0" title="Documento caricato" />
                                        )}
                                        <span className="truncate block" title={item.title}>
                                          {item.title}
                                        </span>
                                      </div>
                                    </TableCell>
                                  )
                                }
                                return (
                                  <TableCell 
                                    key={column.key} 
                                    className={cn(
                                      column.hideOnMobile && "hidden md:table-cell",
                                      column.className,
                                      "min-w-0"
                                    )}
                                  >
                                    <div className="min-w-0">
                                      {column.render(item)}
                                    </div>
                                  </TableCell>
                                )
                              })}
                            </TableRow>
                          )
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>
                {searchResults.length > 5 && (
                  <p className="text-xs text-muted-foreground text-center">
                    {filteredSearchResults.length === searchResults.length
                      ? `${searchResults.length} documenti trovati. Clicca su un documento per selezionare le giallature.`
                      : `${filteredSearchResults.length} di ${searchResults.length} documenti mostrati.`}
                  </p>
                )}
              </CardContent>
            )}
            {searchResults.length === 0 && !isAutoSearching && (
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground text-center py-4">
                  I risultati della ricerca verranno mostrati qui quando disponibili.
                </p>
              </CardContent>
            )}
          </Card>

          <ItemsManager
            searchConfig={{
              enabled: false, // Disable search section since we show results inline
            }}
            uploadConfig={{
              enabled: true,
              title: t("form.steps.step4.upload.title"),
              subtitle: t("form.steps.step4.upload.subtitle"),
              showMetadataForm: true,
              metadataFields: {
                title: true,
                authors: true,
                journal: true,
                publicationDate: true,
              },
              showDisclaimer: true,
              disclaimerText: t("form.steps.step4.upload.disclaimer"),
            }}
            tableConfig={{
              title: (count: number) => t("form.steps.step4.table.titleWithCount", { count }),
              columns: tableColumns,
              emptyMessage: t("form.steps.step4.table.emptyMessage"),
            }}
            items={references}
            onItemsChange={handleReferencesChange}
            getItemId={(item) => item.id}
            onFileAdd={handleFileAdd}
          />
        </CardContent>
      </Card>

      {/* Claims Selection Modal */}
      <ClaimsSelectionModal
        isOpen={isClaimsModalOpen}
        onClose={() => {
          setIsClaimsModalOpen(false)
          setSelectedDocument(null)
        }}
        document={selectedDocument}
        onConfirm={handleClaimsConfirm}
      />
    </>
  )
}
