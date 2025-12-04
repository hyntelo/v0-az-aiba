"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Upload, ArrowLeft, Loader2 } from "lucide-react"
import { useTranslation } from "@/lib/i18n"
import type { KnowledgeBaseDocument, Claim, ScientificReference } from "@/lib/store/types"
import { cn } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { ResultColumn } from "@/components/shared/search-results-modal"

interface KnowledgeBaseModalProps {
  isOpen: boolean
  onClose: () => void
  documents: KnowledgeBaseDocument[]
  isLoading?: boolean
  onDocumentSelect: (document: KnowledgeBaseDocument, selectedClaimIds: string[]) => void
  resultColumns: ResultColumn<ScientificReference>[]
}

type ModalView = "search" | "claims"

export function KnowledgeBaseModal({
  isOpen,
  onClose,
  documents,
  isLoading = false,
  onDocumentSelect,
  resultColumns,
}: KnowledgeBaseModalProps) {
  const { t } = useTranslation()
  const [view, setView] = useState<ModalView>("search")
  const [selectedDocument, setSelectedDocument] = useState<KnowledgeBaseDocument | null>(null)
  const [selectedClaimIds, setSelectedClaimIds] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState("")

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setView("search")
      setSelectedDocument(null)
      setSelectedClaimIds(new Set())
      setSearchQuery("")
    }
  }, [isOpen])

  // Filter documents based on search query
  const filteredDocuments = useMemo(() => {
    if (!searchQuery.trim()) {
      return documents
    }
    
    const query = searchQuery.toLowerCase()
    return documents.filter((doc) => {
      return (
        doc.title.toLowerCase().includes(query) ||
        doc.authors.toLowerCase().includes(query) ||
        doc.journal?.toLowerCase().includes(query) ||
        doc.referenceId.toLowerCase().includes(query)
      )
    })
  }, [documents, searchQuery])

  // Group claims by page number and sort
  const claimsByPage = useMemo(() => {
    if (!selectedDocument?.claims) return []

    const grouped = selectedDocument.claims.reduce((acc, claim) => {
      if (!acc[claim.pageNumber]) {
        acc[claim.pageNumber] = []
      }
      acc[claim.pageNumber].push(claim)
      return acc
    }, {} as Record<number, Claim[]>)

    // Sort pages and claims within each page
    return Object.entries(grouped)
      .map(([page, claims]) => ({
        pageNumber: parseInt(page, 10),
        claims: claims.sort((a, b) => a.id.localeCompare(b.id)),
      }))
      .sort((a, b) => a.pageNumber - b.pageNumber)
  }, [selectedDocument])

  const handleDocumentClick = (doc: KnowledgeBaseDocument) => {
    if (doc.claims && doc.claims.length > 0) {
      setSelectedDocument(doc)
      setView("claims")
      setSelectedClaimIds(new Set())
    } else {
      // If no claims, add directly
      onDocumentSelect(doc, [])
    }
  }

  const handleToggleClaim = (claimId: string) => {
    setSelectedClaimIds((prev) => {
      const next = new Set(prev)
      if (next.has(claimId)) {
        next.delete(claimId)
      } else {
        next.add(claimId)
      }
      return next
    })
  }

  const handleSaveClaims = () => {
    if (!selectedDocument) return

    const selectedIds = Array.from(selectedClaimIds)
    onDocumentSelect(selectedDocument, selectedIds)
    setView("search")
    setSelectedDocument(null)
    setSelectedClaimIds(new Set())
  }

  const handleBackToSearch = () => {
    setView("search")
    setSelectedDocument(null)
    setSelectedClaimIds(new Set())
  }

  const handleCancel = () => {
    setView("search")
    setSelectedDocument(null)
    setSelectedClaimIds(new Set())
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0">
        {view === "search" ? (
          <>
            <DialogHeader className="px-6 pt-6 pb-4 border-b">
              <DialogTitle>{t("form.steps.step4.search.title")}</DialogTitle>
              {t("form.steps.step4.search.subtitle") && (
                <p className="text-sm text-muted-foreground mt-1">
                  {t("form.steps.step4.search.subtitle")}
                </p>
              )}
            </DialogHeader>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-sm text-muted-foreground">
                    {t("citationSearch.aiSearching")}
                  </span>
                </div>
              ) : (
                <>
                  {/* Search Bar */}
                  <div className="flex items-center gap-3 mb-4">
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

                  {filteredDocuments.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <p>
                        {searchQuery
                          ? `Nessun documento trovato per "${searchQuery}"`
                          : "Nessun documento disponibile"}
                      </p>
                    </div>
                  ) : (
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
                          {filteredDocuments.map((doc) => {
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
                                onClick={() => handleDocumentClick(doc)}
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
                                            <Upload
                                              className="w-4 h-4 text-accent-violet flex-shrink-0"
                                              title="Documento caricato"
                                            />
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
                                      <div className="min-w-0">{column.render(item)}</div>
                                    </TableCell>
                                  )
                                })}
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </>
              )}
            </div>

            <DialogFooter className="px-6 py-4 border-t">
              <Button variant="outline" onClick={handleCancel}>
                {t("common.cancel")}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader className="px-6 pt-6 pb-4 border-b">
              <div className="flex items-center gap-2 mb-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToSearch}
                  className="h-8 w-8 p-0"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <DialogTitle className="flex-1">
                  {t("form.steps.step4.claimsModal.title")}
                </DialogTitle>
              </div>
              {selectedDocument && (
                <div className="mt-2 space-y-1">
                  <p className="text-sm font-medium">{selectedDocument.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedDocument.authors}{" "}
                    {selectedDocument.journal && `• ${selectedDocument.journal}`}
                    {selectedDocument.publicationDate &&
                      ` • ${new Date(selectedDocument.publicationDate).toLocaleDateString("it-IT")}`}
                  </p>
                </div>
              )}
            </DialogHeader>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {claimsByPage.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Nessuna giallatura disponibile per questo documento</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {claimsByPage.map(({ pageNumber, claims }) => (
                    <Card key={pageNumber} className="hyntelo-elevation-1">
                      <CardContent className="p-4">
                        <h3 className="text-sm font-semibold mb-3 text-foreground">
                          {t("form.steps.step4.claimsModal.page", { page: pageNumber })}
                        </h3>
                        <div className="space-y-3">
                          {claims.map((claim) => {
                            const isSelected = selectedClaimIds.has(claim.id)
                            return (
                              <label
                                key={claim.id}
                                className={cn(
                                  "flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                                  isSelected
                                    ? "border-accent-violet bg-accent-violet/5"
                                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                )}
                              >
                                <div className="flex-shrink-0 mt-0.5">
                                  <Checkbox
                                    checked={isSelected}
                                    onCheckedChange={(checked) => {
                                      if (checked !== undefined) {
                                        handleToggleClaim(claim.id)
                                      }
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-foreground leading-relaxed">
                                    {claim.text}
                                  </p>
                                </div>
                              </label>
                            )
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            <DialogFooter className="px-6 py-4 border-t">
              <Button variant="outline" onClick={handleBackToSearch}>
                {t("common.cancel")}
              </Button>
              <Button
                onClick={handleSaveClaims}
                disabled={selectedClaimIds.size === 0}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {t("form.steps.step4.claimsModal.addToBrief")}
                {selectedClaimIds.size > 0 && ` (${selectedClaimIds.size})`}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

