"use client"

import React, { useState, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Loader2 } from "lucide-react"
import { useTranslation } from "@/lib/i18n"
import type { KnowledgeBaseDocument, Claim } from "@/lib/store/types"
import type { AttachmentFile } from "@/lib/file-utils"
import { extractClaimsFromFile } from "@/lib/mock-knowledge-base"
import { FileUpload } from "@/components/file-upload"
import { cn } from "@/lib/utils"

type ModalStep = "upload" | "metadata" | "claims"

interface UploadPaperModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: (document: KnowledgeBaseDocument, selectedClaimIds: string[]) => void
}

export function UploadPaperModal({
  isOpen,
  onClose,
  onComplete,
}: UploadPaperModalProps) {
  const { t } = useTranslation()
  const [step, setStep] = useState<ModalStep>("upload")
  const [uploadedFile, setUploadedFile] = useState<AttachmentFile | null>(null)
  const [metadata, setMetadata] = useState<Record<string, string>>({})
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false)
  const [claims, setClaims] = useState<Claim[]>([])
  const [selectedClaimIds, setSelectedClaimIds] = useState<Set<string>>(new Set())
  const [isExtractingClaims, setIsExtractingClaims] = useState(false)

  // Reset state when modal opens/closes
  React.useEffect(() => {
    if (!isOpen) {
      setStep("upload")
      setUploadedFile(null)
      setMetadata({})
      setDisclaimerAccepted(false)
      setClaims([])
      setSelectedClaimIds(new Set())
    }
  }, [isOpen])

  // Group claims by page number and sort
  const claimsByPage = useMemo(() => {
    if (!claims || claims.length === 0) return []

    const grouped = claims.reduce((acc, claim) => {
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
  }, [claims])

  const handleFileAdd = async (file: AttachmentFile) => {
    setUploadedFile(file)
    setStep("metadata")
  }

  const handleMetadataNext = async () => {
    if (!uploadedFile) return

    // Validate required fields
    if (!metadata.title || !metadata.authors) return
    if (!disclaimerAccepted) return

    // Extract claims from file
    setIsExtractingClaims(true)
    try {
      const extractedClaims = await extractClaimsFromFile(
        new File([], uploadedFile.name, { type: uploadedFile.type })
      )
      setClaims(extractedClaims)
      setStep("claims")
    } catch (error) {
      console.error("Error extracting claims:", error)
      // Even if extraction fails, continue with empty claims
      setClaims([])
      setStep("claims")
    } finally {
      setIsExtractingClaims(false)
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

  const handleSave = () => {
    if (!uploadedFile) return

    // Create knowledge base document
    const document: KnowledgeBaseDocument = {
      id: `ref-${Date.now()}`,
      referenceId: `IT-${Math.floor(Math.random() * 1000000)}`,
      title: metadata.title || uploadedFile.name,
      authors: metadata.authors || "Unknown",
      journal: metadata.journal,
      publicationDate: metadata.publicationDate,
      claimsCount: claims.length,
      selectedClaims: [],
      claims,
      uploadedAt: new Date(),
    }

    const selectedIds = Array.from(selectedClaimIds)
    onComplete(document, selectedIds)
  }

  const handleBack = () => {
    if (step === "claims") {
      setStep("metadata")
      setSelectedClaimIds(new Set())
    } else if (step === "metadata") {
      setStep("upload")
      setMetadata({})
      setDisclaimerAccepted(false)
    }
  }

  const handleCancel = () => {
    setStep("upload")
    setUploadedFile(null)
    setMetadata({})
    setDisclaimerAccepted(false)
    setClaims([])
    setSelectedClaimIds(new Set())
    onClose()
  }

  const canProceedFromMetadata =
    metadata.title &&
    metadata.authors &&
    (!t("form.steps.step4.upload.disclaimer") || disclaimerAccepted)

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0">
        {step === "upload" && (
          <>
            <DialogHeader className="px-6 pt-6 pb-4 border-b">
              <DialogTitle>{t("form.steps.step4.upload.title")}</DialogTitle>
              {t("form.steps.step4.upload.subtitle") && (
                <p className="text-sm text-muted-foreground mt-1">
                  {t("form.steps.step4.upload.subtitle")}
                </p>
              )}
            </DialogHeader>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              <FileUpload
                attachments={uploadedFile ? [uploadedFile] : []}
                onAttachmentAdd={handleFileAdd}
                onAttachmentRemove={() => setUploadedFile(null)}
              />
            </div>

            <DialogFooter className="px-6 py-4 border-t">
              <Button variant="outline" onClick={handleCancel}>
                {t("common.cancel")}
              </Button>
            </DialogFooter>
          </>
        )}

        {step === "metadata" && (
          <>
            <DialogHeader className="px-6 pt-6 pb-4 border-b">
              <div className="flex items-center gap-2 mb-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  className="h-8 w-8 p-0"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <DialogTitle className="flex-1">
                  Inserisci informazioni documento
                </DialogTitle>
              </div>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="metadata-title">Titolo *</Label>
                  <Input
                    id="metadata-title"
                    value={metadata.title || ""}
                    onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
                    placeholder="Inserisci il titolo del documento"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metadata-authors">Autori *</Label>
                  <Input
                    id="metadata-authors"
                    value={metadata.authors || ""}
                    onChange={(e) => setMetadata({ ...metadata, authors: e.target.value })}
                    placeholder="Es: Rossi et al."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metadata-journal">Journal</Label>
                  <Input
                    id="metadata-journal"
                    value={metadata.journal || ""}
                    onChange={(e) => setMetadata({ ...metadata, journal: e.target.value })}
                    placeholder="Nome del journal"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metadata-date">Data di pubblicazione</Label>
                  <Input
                    id="metadata-date"
                    type="date"
                    value={metadata.publicationDate || ""}
                    onChange={(e) => setMetadata({ ...metadata, publicationDate: e.target.value })}
                  />
                </div>
                {t("form.steps.step4.upload.disclaimer") && (
                  <div className="space-y-2 pt-2 border-t">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="disclaimer-checkbox"
                        checked={disclaimerAccepted}
                        onCheckedChange={(checked) => setDisclaimerAccepted(checked === true)}
                        className="mt-1"
                      />
                      <Label
                        htmlFor="disclaimer-checkbox"
                        className="text-sm leading-relaxed cursor-pointer"
                      >
                        {t("form.steps.step4.upload.disclaimer")}
                      </Label>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter className="px-6 py-4 border-t">
              <Button variant="outline" onClick={handleBack}>
                {t("common.cancel")}
              </Button>
              <Button
                onClick={handleMetadataNext}
                disabled={!canProceedFromMetadata || isExtractingClaims}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isExtractingClaims ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Estrazione giallature...
                  </>
                ) : (
                  "Continua"
                )}
              </Button>
            </DialogFooter>
          </>
        )}

        {step === "claims" && (
          <>
            <DialogHeader className="px-6 pt-6 pb-4 border-b">
              <div className="flex items-center gap-2 mb-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  className="h-8 w-8 p-0"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <DialogTitle className="flex-1">
                  {t("form.steps.step4.claimsModal.title")}
                </DialogTitle>
              </div>
              {metadata.title && (
                <div className="mt-2 space-y-1">
                  <p className="text-sm font-medium">{metadata.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {metadata.authors}{" "}
                    {metadata.journal && `• ${metadata.journal}`}
                    {metadata.publicationDate &&
                      ` • ${new Date(metadata.publicationDate).toLocaleDateString("it-IT")}`}
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
              <Button variant="outline" onClick={handleBack}>
                {t("common.cancel")}
              </Button>
              <Button
                onClick={handleSave}
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

