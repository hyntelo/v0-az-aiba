"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { useTranslation } from "@/lib/i18n"
import type { KnowledgeBaseDocument, Claim } from "@/lib/store/types"
import { cn } from "@/lib/utils"

interface ClaimsSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  document: KnowledgeBaseDocument | null
  onConfirm: (document: KnowledgeBaseDocument, selectedClaimIds: string[]) => void
}

export function ClaimsSelectionModal({
  isOpen,
  onClose,
  document,
  onConfirm,
}: ClaimsSelectionModalProps) {
  const { t } = useTranslation()
  const [selectedClaimIds, setSelectedClaimIds] = useState<Set<string>>(new Set())

  // Reset selection when modal opens/closes or document changes
  useEffect(() => {
    if (!isOpen || !document) {
      setSelectedClaimIds(new Set())
    }
  }, [isOpen, document])

  // Group claims by page number and sort
  const claimsByPage = useMemo(() => {
    if (!document?.claims) return []

    const grouped = document.claims.reduce((acc, claim) => {
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
  }, [document])

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

  const handleConfirm = () => {
    if (!document) return

    const selectedIds = Array.from(selectedClaimIds)
    onConfirm(document, selectedIds)
    setSelectedClaimIds(new Set())
    onClose()
  }

  const handleCancel = () => {
    setSelectedClaimIds(new Set())
    onClose()
  }

  if (!document) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle>{t("form.steps.step4.claimsModal.title")}</DialogTitle>
          <div className="mt-2 space-y-1">
            <p className="text-sm font-medium">{document.title}</p>
            <p className="text-xs text-muted-foreground">
              {document.authors} {document.journal && `• ${document.journal}`}
              {document.publicationDate && ` • ${new Date(document.publicationDate).toLocaleDateString("it-IT")}`}
            </p>
          </div>
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
                              <p className="text-sm text-foreground leading-relaxed">{claim.text}</p>
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
          <Button variant="outline" onClick={handleCancel}>
            {t("common.cancel")}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={selectedClaimIds.size === 0}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {t("form.steps.step4.claimsModal.addToBrief")}
            {selectedClaimIds.size > 0 && ` (${selectedClaimIds.size})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

