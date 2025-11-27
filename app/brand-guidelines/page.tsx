"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Building2, Users, MessageSquare, Package, Lock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAppStore } from "@/lib/store"
import { useTranslation } from "@/lib/i18n"

const ReadOnlyText = ({ label, value, className = "" }: { label: string; value: string; className?: string }) => (
  <div className={`space-y-2 ${className}`}>
    <Label className="text-sm font-medium text-muted-foreground">{label}</Label>
    <div className="p-3 bg-muted/30 rounded-md border text-sm leading-relaxed whitespace-pre-wrap">{value}</div>
  </div>
)

export default function BrandGuidelinesPage() {
  const { toast } = useToast()
  const { t } = useTranslation()

  const {
    brandGuidelines,
    updateCompanyGuidelines,
    addCommunicationPersonality,
    updateCommunicationPersonality,
    removeCommunicationPersonality,
    addTargetAudiencePreset,
    updateTargetAudiencePreset,
    removeTargetAudiencePreset,
    addProductBrandGuidelines,
    updateProductBrandGuidelines,
    removeProductBrandGuidelines,
    captureCompanyGuidelinesSnapshot,
    undoCompanyGuidelinesChanges,
    hasCompanyGuidelinesChanges,
    captureCommunicationPersonalitySnapshot,
    undoCommunicationPersonalityChanges,
    hasCommunicationPersonalityChanges,
    captureTargetAudienceSnapshot,
    undoTargetAudienceChanges,
    hasTargetAudienceChanges,
    captureProductGuidelinesSnapshot,
    undoProductGuidelinesChanges,
    hasProductGuidelinesChanges,
    clearCompanyGuidelinesSnapshot,
    clearCommunicationPersonalitySnapshot,
    clearTargetAudienceSnapshot,
    clearProductGuidelinesSnapshot,
    selectIsBrandGuidelinesReadOnly,
    selectCanEditBrandGuidelines,
    selectUserRole,
  } = useAppStore()

  const isReadOnly = selectIsBrandGuidelinesReadOnly()
  const canEdit = selectCanEditBrandGuidelines()
  const userRole = selectUserRole()

  const [companyGuidelinesForm, setCompanyGuidelinesForm] = useState(brandGuidelines.companyGuidelines)
  const [personalityForm, setPersonalityForm] = useState({ name: "", description: "", guidelines: "" })
  const [audienceForm, setAudienceForm] = useState({ name: "", description: "", guidelines: "" })
  const [productForm, setProductForm] = useState({ productName: "", guidelines: "" })
  const [editingPersonality, setEditingPersonality] = useState<string | null>(null)
  const [editingAudience, setEditingAudience] = useState<string | null>(null)
  const [editingProduct, setEditingProduct] = useState<string | null>(null)

  const [companyGuidelinesEditingStarted, setCompanyGuidelinesEditingStarted] = useState(false)

  const [recentlyDeleted, setRecentlyDeleted] = useState<{
    personalities: Array<{ item: any; timestamp: number }>
    audiences: Array<{ item: any; timestamp: number }>
    products: Array<{ item: any; timestamp: number }>
  }>({
    personalities: [],
    audiences: [],
    products: [],
  })

  const companyChangesDetected = useMemo(() => {
    if (!companyGuidelinesEditingStarted || isReadOnly) return false

    const current = companyGuidelinesForm
    const original = brandGuidelines.companyGuidelines

    return (
      current.toneOfVoice !== original.toneOfVoice ||
      current.companyValues !== original.companyValues ||
      current.dos !== original.dos ||
      current.donts !== original.donts
    )
  }, [companyGuidelinesForm, brandGuidelines.companyGuidelines, companyGuidelinesEditingStarted, isReadOnly])

  const getPersonalityChanges = useCallback(
    (id: string) => {
      if (editingPersonality !== id || isReadOnly) return false

      const original = brandGuidelines.communicationPersonalities.find((p) => p.id === id)
      if (!original) return false

      return (
        personalityForm.name !== original.name ||
        personalityForm.description !== original.description ||
        personalityForm.guidelines !== original.guidelines
      )
    },
    [editingPersonality, personalityForm, brandGuidelines.communicationPersonalities, isReadOnly],
  )

  const getAudienceChanges = useCallback(
    (id: string) => {
      if (editingAudience !== id || isReadOnly) return false

      const original = brandGuidelines.targetAudiencePresets.find((a) => a.id === id)
      if (!original) return false

      return (
        audienceForm.name !== original.name ||
        audienceForm.description !== original.description ||
        audienceForm.guidelines !== original.guidelines
      )
    },
    [editingAudience, audienceForm, brandGuidelines.targetAudiencePresets, isReadOnly],
  )

  const getProductChanges = useCallback(
    (id: string) => {
      if (editingProduct !== id || isReadOnly) return false

      const original = brandGuidelines.productBrandGuidelines.find((p) => p.id === id)
      if (!original) return false

      return productForm.productName !== original.productName || productForm.guidelines !== original.guidelines
    },
    [editingProduct, productForm, brandGuidelines.productBrandGuidelines, isReadOnly],
  )

  useEffect(() => {
    if (companyGuidelinesEditingStarted && !isReadOnly) {
      captureCompanyGuidelinesSnapshot()
    }
  }, [companyGuidelinesEditingStarted, captureCompanyGuidelinesSnapshot, isReadOnly])

  const handleCompanyGuidelinesChange = (field: string, value: string) => {
    if (isReadOnly) return
    if (!companyGuidelinesEditingStarted) {
      setCompanyGuidelinesEditingStarted(true)
    }
    setCompanyGuidelinesForm({ ...companyGuidelinesForm, [field]: value })
  }

  const handleSaveCompanyGuidelines = () => {
    if (isReadOnly) return
    updateCompanyGuidelines(companyGuidelinesForm)
    setCompanyGuidelinesEditingStarted(false)
    clearCompanyGuidelinesSnapshot()

    toast({
      title: t("brandGuidelines.toasts.companyGuidelinesSaved"),
      description: t("brandGuidelines.toasts.companyGuidelinesSavedDesc"),
    })
  }

  const handleUndoCompanyGuidelines = () => {
    if (isReadOnly) return
    console.log("[v0] Undoing company guidelines changes")
    undoCompanyGuidelinesChanges()
    setCompanyGuidelinesForm(brandGuidelines.companyGuidelines)
    setCompanyGuidelinesEditingStarted(false)
    console.log("[v0] Company guidelines restored to:", brandGuidelines.companyGuidelines)
  }

  const handleAddPersonality = () => {
    if (isReadOnly) return
    if (personalityForm.name && personalityForm.description && personalityForm.guidelines) {
      addCommunicationPersonality(personalityForm)
      setPersonalityForm({ name: "", description: "", guidelines: "" })
      toast({
        title: t("brandGuidelines.toasts.personalityAdded"),
        description: `"${personalityForm.name}" ${t("brandGuidelines.toasts.personalityAddedDesc")}`,
      })
    }
  }

  const handleEditPersonality = (personality: any) => {
    if (isReadOnly) return
    captureCommunicationPersonalitySnapshot(personality.id)
    setEditingPersonality(personality.id)
    setPersonalityForm({
      name: personality.name,
      description: personality.description,
      guidelines: personality.guidelines,
    })
  }

  const handleUpdatePersonality = () => {
    if (isReadOnly) return
    if (editingPersonality && personalityForm.name && personalityForm.description && personalityForm.guidelines) {
      updateCommunicationPersonality(editingPersonality, personalityForm)
      const personalityId = editingPersonality
      const personalityName = personalityForm.name
      setEditingPersonality(null)
      clearCommunicationPersonalitySnapshot(personalityId)
      toast({
        title: t("brandGuidelines.toasts.personalityUpdated"),
        description: `"${personalityName}" ${t("brandGuidelines.toasts.personalityUpdatedDesc")}`,
      })
    }
  }

  const handleUndoPersonalityChanges = (id: string) => {
    if (isReadOnly) return
    console.log("[v0] Undoing communication personality changes for:", id)
    undoCommunicationPersonalityChanges(id)
    const originalPersonality = brandGuidelines.communicationPersonalities.find((p) => p.id === id)
    if (originalPersonality) {
      setPersonalityForm({
        name: originalPersonality.name,
        description: originalPersonality.description,
        guidelines: originalPersonality.guidelines,
      })
      console.log("[v0] Communication personality restored to:", originalPersonality)
    }
  }

  const handleDeletePersonality = (personality: any) => {
    if (isReadOnly) return
    removeCommunicationPersonality(personality.id)
    setRecentlyDeleted((prev) => ({
      ...prev,
      personalities: [...prev.personalities, { item: personality, timestamp: Date.now() }],
    }))
    toast({
      title: t("brandGuidelines.toasts.personalityDeleted"),
      description: `"${personality.name}" ${t("brandGuidelines.toasts.personalityDeletedDesc")}`,
      action: (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleUndoDeletePersonality(personality)}
          className="border-orange-200 text-orange-600 hover:bg-orange-50"
        >
          {t("brandGuidelines.toasts.undo")}
        </Button>
      ),
    })
  }

  const handleUndoDeletePersonality = (personality: any) => {
    if (isReadOnly) return
    addCommunicationPersonality(personality)
    setRecentlyDeleted((prev) => ({
      ...prev,
      personalities: prev.personalities.filter((p) => p.item.id !== personality.id),
    }))
    toast({
      title: t("brandGuidelines.toasts.deletionUndone"),
      description: `"${personality.name}" ${t("brandGuidelines.toasts.deletionUndoneDesc")}`,
    })
  }

  const handleAddAudience = () => {
    if (isReadOnly) return
    if (audienceForm.name && audienceForm.description && audienceForm.guidelines) {
      addTargetAudiencePreset(audienceForm)
      setAudienceForm({ name: "", description: "", guidelines: "" })
      toast({
        title: t("brandGuidelines.toasts.audienceAdded"),
        description: `"${audienceForm.name}" ${t("brandGuidelines.toasts.audienceAddedDesc")}`,
      })
    }
  }

  const handleEditAudience = (audience: any) => {
    if (isReadOnly) return
    captureTargetAudienceSnapshot(audience.id)
    setEditingAudience(audience.id)
    setAudienceForm({
      name: audience.name,
      description: audience.description,
      guidelines: audience.guidelines,
    })
  }

  const handleUpdateAudience = () => {
    if (isReadOnly) return
    if (editingAudience && audienceForm.name && audienceForm.description && audienceForm.guidelines) {
      updateTargetAudiencePreset(editingAudience, audienceForm)
      const audienceId = editingAudience
      const audienceName = audienceForm.name
      setEditingAudience(null)
      clearTargetAudienceSnapshot(audienceId)
      toast({
        title: t("brandGuidelines.toasts.audienceUpdated"),
        description: `"${audienceName}" ${t("brandGuidelines.toasts.audienceUpdatedDesc")}`,
      })
    }
  }

  const handleUndoAudienceChanges = (id: string) => {
    if (isReadOnly) return
    console.log("[v0] Undoing target audience changes for:", id)
    undoTargetAudienceChanges(id)
    const originalAudience = brandGuidelines.targetAudiencePresets.find((a) => a.id === id)
    if (originalAudience) {
      setAudienceForm({
        name: originalAudience.name,
        description: originalAudience.description,
        guidelines: originalAudience.guidelines,
      })
      console.log("[v0] Target audience restored to:", originalAudience)
    }
  }

  const handleDeleteAudience = (audience: any) => {
    if (isReadOnly) return
    removeTargetAudiencePreset(audience.id)
    setRecentlyDeleted((prev) => ({
      ...prev,
      audiences: [...prev.audiences, { item: audience, timestamp: Date.now() }],
    }))
    toast({
      title: t("brandGuidelines.toasts.audienceDeleted"),
      description: `"${audience.name}" ${t("brandGuidelines.toasts.audienceDeletedDesc")}`,
      action: (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleUndoDeleteAudience(audience)}
          className="border-orange-200 text-orange-600 hover:bg-orange-50"
        >
          {t("brandGuidelines.toasts.undo")}
        </Button>
      ),
    })
  }

  const handleUndoDeleteAudience = (audience: any) => {
    if (isReadOnly) return
    addTargetAudiencePreset(audience)
    setRecentlyDeleted((prev) => ({
      ...prev,
      audiences: prev.audiences.filter((a) => a.item.id !== audience.id),
    }))
    toast({
      title: t("brandGuidelines.toasts.deletionUndone"),
      description: `"${audience.name}" ${t("brandGuidelines.toasts.deletionUndoneDesc")}`,
    })
  }

  const handleAddProduct = () => {
    if (isReadOnly) return
    if (productForm.productName && productForm.guidelines) {
      addProductBrandGuidelines(productForm)
      setProductForm({ productName: "", guidelines: "" })
      toast({
        title: t("brandGuidelines.toasts.productAdded"),
        description: `${t("brandGuidelines.toasts.productAddedDesc")} "${productForm.productName}" ${t("brandGuidelines.toasts.productAddedDescEnd")}`,
      })
    }
  }

  const handleEditProduct = (product: any) => {
    if (isReadOnly) return
    captureProductGuidelinesSnapshot(product.id)
    setEditingProduct(product.id)
    setProductForm({
      productName: product.productName,
      guidelines: product.guidelines,
    })
  }

  const handleUpdateProduct = () => {
    if (isReadOnly) return
    if (editingProduct && productForm.productName && productForm.guidelines) {
      updateProductBrandGuidelines(editingProduct, productForm)
      const productId = editingProduct
      const productName = productForm.productName
      setEditingProduct(null)
      clearProductGuidelinesSnapshot(productId)
      toast({
        title: t("brandGuidelines.toasts.productUpdated"),
        description: `${t("brandGuidelines.toasts.productUpdatedDesc")} "${productName}" ${t("brandGuidelines.toasts.productUpdatedDescEnd")}`,
      })
    }
  }

  const handleUndoProductChanges = (id: string) => {
    if (isReadOnly) return
    console.log("[v0] Undoing product guidelines changes for:", id)
    undoProductGuidelinesChanges(id)
    const originalProduct = brandGuidelines.productBrandGuidelines.find((p) => p.id === id)
    if (originalProduct) {
      setProductForm({
        productName: originalProduct.productName,
        guidelines: originalProduct.guidelines,
      })
      console.log("[v0] Product guidelines restored to:", originalProduct)
    }
  }

  const handleDeleteProduct = (product: any) => {
    if (isReadOnly) return
    removeProductBrandGuidelines(product.id)
    setRecentlyDeleted((prev) => ({
      ...prev,
      products: [...prev.products, { item: product, timestamp: Date.now() }],
    }))
    toast({
      title: t("brandGuidelines.toasts.productDeleted"),
      description: `${t("brandGuidelines.toasts.productDeletedDesc")} "${product.productName}" ${t("brandGuidelines.toasts.productDeletedDescEnd")}`,
      action: (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleUndoDeleteProduct(product)}
          className="border-orange-200 text-orange-600 hover:bg-orange-50 bg-transparent"
        >
          {t("brandGuidelines.toasts.undo")}
        </Button>
      ),
    })
  }

  const handleUndoDeleteProduct = (product: any) => {
    if (isReadOnly) return
    addProductBrandGuidelines(product)
    setRecentlyDeleted((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p.item.id !== product.id),
    }))
    toast({
      title: t("brandGuidelines.toasts.deletionUndone"),
      description: `${t("brandGuidelines.toasts.deletionUndoneDescProduct")} "${product.productName}" ${t("brandGuidelines.toasts.deletionUndoneDescProductEnd")}`,
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-medium text-[var(--color-primary)] mb-2">{t("brandGuidelines.title")}</h1>
        <p className="text-muted-foreground">{t("brandGuidelines.subtitle")}</p>
      </div>

      {isReadOnly && (
        <Alert className="border-blue-200 bg-blue-50">
          <Lock className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>{t("brandGuidelines.viewOnlyAccess")}</strong> {t("brandGuidelines.viewOnlyDescription")}
          </AlertDescription>
        </Alert>
      )}

      {/* Company Guidelines */}
      <Card className="hyntelo-elevation-3">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--accent-violet)]/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-[var(--accent-violet)]" />
            </div>
            <div>
              <CardTitle className="text-[var(--color-primary)]">
                {t("brandGuidelines.companyGuidelines.title")}
              </CardTitle>
              <CardDescription>{t("brandGuidelines.companyGuidelines.description")}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {isReadOnly ? (
            <>
              <ReadOnlyText
                label={t("brandGuidelines.companyGuidelines.toneOfVoice")}
                value={brandGuidelines.companyGuidelines.toneOfVoice}
              />
              <ReadOnlyText
                label={t("brandGuidelines.companyGuidelines.companyValues")}
                value={brandGuidelines.companyGuidelines.companyValues}
              />
              <ReadOnlyText
                label={t("brandGuidelines.companyGuidelines.dos")}
                value={brandGuidelines.companyGuidelines.dos}
              />
              <ReadOnlyText
                label={t("brandGuidelines.companyGuidelines.donts")}
                value={brandGuidelines.companyGuidelines.donts}
              />
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="toneOfVoice">{t("brandGuidelines.companyGuidelines.toneOfVoice")}</Label>
                <Textarea
                  id="toneOfVoice"
                  value={companyGuidelinesForm.toneOfVoice}
                  onChange={(e) => handleCompanyGuidelinesChange("toneOfVoice", e.target.value)}
                  placeholder={t("brandGuidelines.companyGuidelines.toneOfVoicePlaceholder")}
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyValues">{t("brandGuidelines.companyGuidelines.companyValues")}</Label>
                <Textarea
                  id="companyValues"
                  value={companyGuidelinesForm.companyValues}
                  onChange={(e) => handleCompanyGuidelinesChange("companyValues", e.target.value)}
                  placeholder={t("brandGuidelines.companyGuidelines.companyValuesPlaceholder")}
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dos">{t("brandGuidelines.companyGuidelines.dos")}</Label>
                <Textarea
                  id="dos"
                  value={companyGuidelinesForm.dos}
                  onChange={(e) => handleCompanyGuidelinesChange("dos", e.target.value)}
                  placeholder={t("brandGuidelines.companyGuidelines.dosPlaceholder")}
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="donts">{t("brandGuidelines.companyGuidelines.donts")}</Label>
                <Textarea
                  id="donts"
                  value={companyGuidelinesForm.donts}
                  onChange={(e) => handleCompanyGuidelinesChange("donts", e.target.value)}
                  placeholder={t("brandGuidelines.companyGuidelines.dontsPlaceholder")}
                  className="min-h-[100px]"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleSaveCompanyGuidelines}
                  disabled={isReadOnly}
                  className="bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-[var(--on-primary)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t("brandGuidelines.companyGuidelines.saveButton")}
                </Button>
                {companyChangesDetected && (
                  <Button
                    variant="outline"
                    onClick={handleUndoCompanyGuidelines}
                    disabled={isReadOnly}
                    className="border-orange-200 text-orange-600 hover:bg-orange-50 bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t("brandGuidelines.companyGuidelines.undoButton")}
                  </Button>
                )}
              </div>
              {companyChangesDetected && (
                <div className="text-sm text-orange-600 bg-orange-50 p-3 rounded-lg border border-orange-200">
                  {t("brandGuidelines.companyGuidelines.unsavedChanges")}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Communication Personalities */}
      <Card className="hyntelo-elevation-3">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[var(--accent-sky)]/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-[var(--accent-sky)]" />
              </div>
              <div>
                <CardTitle className="text-[var(--color-primary)]">
                  {t("brandGuidelines.communicationPersonalities.title")}
                </CardTitle>
                <CardDescription>{t("brandGuidelines.communicationPersonalities.description")}</CardDescription>
              </div>
            </div>
            {!isReadOnly && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-[var(--accent-sky)] hover:bg-[var(--accent-sky)]/90 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    {t("brandGuidelines.communicationPersonalities.addButton")}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t("brandGuidelines.communicationPersonalities.addDialogTitle")}</DialogTitle>
                    <DialogDescription>
                      {t("brandGuidelines.communicationPersonalities.addDialogDescription")}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="personalityName">{t("brandGuidelines.communicationPersonalities.name")}</Label>
                      <Input
                        id="personalityName"
                        value={personalityForm.name}
                        onChange={(e) => setPersonalityForm({ ...personalityForm, name: e.target.value })}
                        placeholder={t("brandGuidelines.communicationPersonalities.namePlaceholder")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="personalityDescription">
                        {t("brandGuidelines.communicationPersonalities.descriptionLabel")}
                      </Label>
                      <Input
                        id="personalityDescription"
                        value={personalityForm.description}
                        onChange={(e) => setPersonalityForm({ ...personalityForm, description: e.target.value })}
                        placeholder={t("brandGuidelines.communicationPersonalities.descriptionPlaceholder")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="personalityGuidelines">
                        {t("brandGuidelines.communicationPersonalities.guidelines")}
                      </Label>
                      <Textarea
                        id="personalityGuidelines"
                        value={personalityForm.guidelines}
                        onChange={(e) => setPersonalityForm({ ...personalityForm, guidelines: e.target.value })}
                        placeholder={t("brandGuidelines.communicationPersonalities.guidelinesPlaceholder")}
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={handleAddPersonality}
                      className="bg-[var(--accent-sky)] hover:bg-[var(--accent-sky)]/90 text-white"
                    >
                      {t("brandGuidelines.communicationPersonalities.addButton")}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
            {isReadOnly && (
              <Button
                size="sm"
                disabled
                className="bg-[var(--accent-sky)]/50 text-white cursor-not-allowed opacity-50"
                aria-label={`${t("brandGuidelines.communicationPersonalities.addButton")} (${t("brandGuidelines.adminOnly")})`}
              >
                <Plus className="w-4 h-4 mr-2" />
                {t("brandGuidelines.communicationPersonalities.addButton")}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {brandGuidelines.communicationPersonalities.map((personality) => (
              <Card key={personality.id} className="hyntelo-elevation-1">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base text-[var(--color-primary)]">{personality.name}</CardTitle>
                      <CardDescription className="text-sm">{personality.description}</CardDescription>
                      {getPersonalityChanges(personality.id) && (
                        <Badge variant="outline" className="mt-1 text-xs border-orange-200 text-orange-600">
                          {t("brandGuidelines.communicationPersonalities.unsavedChanges")}
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-1">
                      {!isReadOnly ? (
                        <>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => handleEditPersonality(personality)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>
                                  {t("brandGuidelines.communicationPersonalities.editDialogTitle")}
                                </DialogTitle>
                                <DialogDescription>
                                  {t("brandGuidelines.communicationPersonalities.editDialogDescription")}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="editPersonalityName">
                                    {t("brandGuidelines.communicationPersonalities.name")}
                                  </Label>
                                  <Input
                                    id="editPersonalityName"
                                    value={personalityForm.name}
                                    onChange={(e) => setPersonalityForm({ ...personalityForm, name: e.target.value })}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="editPersonalityDescription">
                                    {t("brandGuidelines.communicationPersonalities.descriptionLabel")}
                                  </Label>
                                  <Input
                                    id="editPersonalityDescription"
                                    value={personalityForm.description}
                                    onChange={(e) =>
                                      setPersonalityForm({ ...personalityForm, description: e.target.value })
                                    }
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="editPersonalityGuidelines">
                                    {t("brandGuidelines.communicationPersonalities.guidelines")}
                                  </Label>
                                  <Textarea
                                    id="editPersonalityGuidelines"
                                    value={personalityForm.guidelines}
                                    onChange={(e) =>
                                      setPersonalityForm({ ...personalityForm, guidelines: e.target.value })
                                    }
                                    className="min-h-[100px]"
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <div className="flex gap-2">
                                  {editingPersonality && getPersonalityChanges(editingPersonality) && (
                                    <Button
                                      variant="outline"
                                      onClick={() => handleUndoPersonalityChanges(editingPersonality)}
                                      className="border-orange-200 text-orange-600 hover:bg-orange-50"
                                    >
                                      {t("brandGuidelines.communicationPersonalities.undoButton")}
                                    </Button>
                                  )}
                                  <Button
                                    onClick={handleUpdatePersonality}
                                    className="bg-[var(--accent-sky)] hover:bg-[var(--accent-sky)]/90 text-white"
                                  >
                                    {t("brandGuidelines.communicationPersonalities.updateButton")}
                                  </Button>
                                </div>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          <Button variant="ghost" size="sm" onClick={() => handleDeletePersonality(personality)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled
                            className="opacity-50 cursor-not-allowed"
                            aria-label={`${t("common.edit")} (${t("brandGuidelines.adminOnly")})`}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled
                            className="opacity-50 cursor-not-allowed"
                            aria-label={`${t("common.delete")} (${t("brandGuidelines.adminOnly")})`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground line-clamp-3">{personality.guidelines}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Target Audience Presets */}
      <Card className="hyntelo-elevation-3">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[var(--accent-yellow)]/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-[var(--accent-yellow)]" />
              </div>
              <div>
                <CardTitle className="text-[var(--color-primary)]">
                  {t("brandGuidelines.targetAudience.title")}
                </CardTitle>
                <CardDescription>{t("brandGuidelines.targetAudience.description")}</CardDescription>
              </div>
            </div>
            {!isReadOnly && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    className="bg-[var(--accent-yellow)] hover:bg-[var(--accent-yellow)]/90 text-[var(--color-primary)]"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {t("brandGuidelines.targetAudience.addButton")}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t("brandGuidelines.targetAudience.addDialogTitle")}</DialogTitle>
                    <DialogDescription>{t("brandGuidelines.targetAudience.addDialogDescription")}</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="audienceName">{t("brandGuidelines.targetAudience.name")}</Label>
                      <Input
                        id="audienceName"
                        value={audienceForm.name}
                        onChange={(e) => setAudienceForm({ ...audienceForm, name: e.target.value })}
                        placeholder={t("brandGuidelines.targetAudience.namePlaceholder")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="audienceDescription">
                        {t("brandGuidelines.targetAudience.descriptionLabel")}
                      </Label>
                      <Input
                        id="audienceDescription"
                        value={audienceForm.description}
                        onChange={(e) => setAudienceForm({ ...audienceForm, description: e.target.value })}
                        placeholder={t("brandGuidelines.targetAudience.descriptionPlaceholder")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="audienceGuidelines">{t("brandGuidelines.targetAudience.guidelines")}</Label>
                      <Textarea
                        id="audienceGuidelines"
                        value={audienceForm.guidelines}
                        onChange={(e) => setAudienceForm({ ...audienceForm, guidelines: e.target.value })}
                        placeholder={t("brandGuidelines.targetAudience.guidelinesPlaceholder")}
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={handleAddAudience}
                      className="bg-[var(--accent-yellow)] hover:bg-[var(--accent-yellow)]/90 text-[var(--color-primary)]"
                    >
                      {t("brandGuidelines.targetAudience.addButton")}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
            {isReadOnly && (
              <Button
                size="sm"
                disabled
                className="bg-[var(--accent-yellow)]/50 text-[var(--color-primary)] cursor-not-allowed opacity-50"
                aria-label={`${t("brandGuidelines.targetAudience.addButton")} (${t("brandGuidelines.adminOnly")})`}
              >
                <Plus className="w-4 h-4 mr-2" />
                {t("brandGuidelines.targetAudience.addButton")}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {brandGuidelines.targetAudiencePresets.map((audience) => (
              <Card key={audience.id} className="hyntelo-elevation-1">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base text-[var(--color-primary)]">{audience.name}</CardTitle>
                      <CardDescription className="text-sm">{audience.description}</CardDescription>
                      {getAudienceChanges(audience.id) && (
                        <Badge variant="outline" className="mt-1 text-xs border-orange-200 text-orange-600">
                          {t("brandGuidelines.targetAudience.unsavedChanges")}
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-1">
                      {!isReadOnly ? (
                        <>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => handleEditAudience(audience)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>{t("brandGuidelines.targetAudience.editDialogTitle")}</DialogTitle>
                                <DialogDescription>
                                  {t("brandGuidelines.targetAudience.editDialogDescription")}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="editAudienceName">{t("brandGuidelines.targetAudience.name")}</Label>
                                  <Input
                                    id="editAudienceName"
                                    value={audienceForm.name}
                                    onChange={(e) => setAudienceForm({ ...audienceForm, name: e.target.value })}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="editAudienceDescription">
                                    {t("brandGuidelines.targetAudience.descriptionLabel")}
                                  </Label>
                                  <Input
                                    id="editAudienceDescription"
                                    value={audienceForm.description}
                                    onChange={(e) => setAudienceForm({ ...audienceForm, description: e.target.value })}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="editAudienceGuidelines">
                                    {t("brandGuidelines.targetAudience.guidelines")}
                                  </Label>
                                  <Textarea
                                    id="editAudienceGuidelines"
                                    value={audienceForm.guidelines}
                                    onChange={(e) => setAudienceForm({ ...audienceForm, guidelines: e.target.value })}
                                    className="min-h-[100px]"
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <div className="flex gap-2">
                                  {editingAudience && getAudienceChanges(editingAudience) && (
                                    <Button
                                      variant="outline"
                                      onClick={() => handleUndoAudienceChanges(editingAudience)}
                                      className="border-orange-200 text-orange-600 hover:bg-orange-50"
                                    >
                                      {t("brandGuidelines.targetAudience.undoButton")}
                                    </Button>
                                  )}
                                  <Button
                                    onClick={handleUpdateAudience}
                                    className="bg-[var(--accent-yellow)] hover:bg-[var(--accent-yellow)]/90 text-[var(--color-primary)]"
                                  >
                                    {t("brandGuidelines.targetAudience.updateButton")}
                                  </Button>
                                </div>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteAudience(audience)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled
                            className="opacity-50 cursor-not-allowed"
                            aria-label={`${t("common.edit")} (${t("brandGuidelines.adminOnly")})`}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled
                            className="opacity-50 cursor-not-allowed"
                            aria-label={`${t("common.delete")} (${t("brandGuidelines.adminOnly")})`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground line-clamp-3">{audience.guidelines}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Product-Specific Guidelines */}
      <Card className="hyntelo-elevation-3">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[var(--accent-violet)]/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-[var(--accent-violet)]" />
              </div>
              <div>
                <CardTitle className="text-[var(--color-primary)]">
                  {t("brandGuidelines.productGuidelines.title")}
                </CardTitle>
                <CardDescription>{t("brandGuidelines.productGuidelines.description")}</CardDescription>
              </div>
            </div>
            {!isReadOnly && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-[var(--accent-violet)] hover:bg-[var(--accent-violet)]/90 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    {t("brandGuidelines.productGuidelines.addButton")}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t("brandGuidelines.productGuidelines.addDialogTitle")}</DialogTitle>
                    <DialogDescription>{t("brandGuidelines.productGuidelines.addDialogDescription")}</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="productName">{t("brandGuidelines.productGuidelines.productName")}</Label>
                      <Input
                        id="productName"
                        value={productForm.productName}
                        onChange={(e) => setProductForm({ ...productForm, productName: e.target.value })}
                        placeholder={t("brandGuidelines.productGuidelines.productNamePlaceholder")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="productGuidelines">{t("brandGuidelines.productGuidelines.guidelines")}</Label>
                      <Textarea
                        id="productGuidelines"
                        value={productForm.guidelines}
                        onChange={(e) => setProductForm({ ...productForm, guidelines: e.target.value })}
                        placeholder={t("brandGuidelines.productGuidelines.guidelinesPlaceholder")}
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={handleAddProduct}
                      className="bg-[var(--accent-violet)] hover:bg-[var(--accent-violet)]/90 text-white"
                    >
                      {t("brandGuidelines.productGuidelines.addButton")}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
            {isReadOnly && (
              <Button
                size="sm"
                disabled
                className="bg-[var(--accent-violet)]/50 text-white cursor-not-allowed opacity-50"
                aria-label={`${t("brandGuidelines.productGuidelines.addButton")} (${t("brandGuidelines.adminOnly")})`}
              >
                <Plus className="w-4 h-4 mr-2" />
                {t("brandGuidelines.productGuidelines.addButton")}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {brandGuidelines.productBrandGuidelines.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {t("brandGuidelines.productGuidelines.emptyState")}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {brandGuidelines.productBrandGuidelines.map((product) => (
                <Card key={product.id} className="hyntelo-elevation-1">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base text-[var(--color-primary)]">{product.productName}</CardTitle>
                        {getProductChanges(product.id) && (
                          <Badge variant="outline" className="mt-1 text-xs border-orange-200 text-orange-600">
                            {t("brandGuidelines.productGuidelines.unsavedChanges")}
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-1">
                        {!isReadOnly ? (
                          <>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" onClick={() => handleEditProduct(product)}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>{t("brandGuidelines.productGuidelines.editDialogTitle")}</DialogTitle>
                                  <DialogDescription>
                                    {t("brandGuidelines.productGuidelines.editDialogDescription")}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="editProductName">
                                      {t("brandGuidelines.productGuidelines.productName")}
                                    </Label>
                                    <Input
                                      id="editProductName"
                                      value={productForm.productName}
                                      onChange={(e) => setProductForm({ ...productForm, productName: e.target.value })}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="editProductGuidelines">
                                      {t("brandGuidelines.productGuidelines.guidelines")}
                                    </Label>
                                    <Textarea
                                      id="editProductGuidelines"
                                      value={productForm.guidelines}
                                      onChange={(e) => setProductForm({ ...productForm, guidelines: e.target.value })}
                                      className="min-h-[100px]"
                                    />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <div className="flex gap-2">
                                    {editingProduct && getProductChanges(editingProduct) && (
                                      <Button
                                        variant="outline"
                                        onClick={() => handleUndoProductChanges(editingProduct)}
                                        className="border-orange-200 text-orange-600 hover:bg-orange-50"
                                      >
                                        {t("brandGuidelines.productGuidelines.undoButton")}
                                      </Button>
                                    )}
                                    <Button
                                      onClick={handleUpdateProduct}
                                      className="bg-[var(--accent-violet)] hover:bg-[var(--accent-violet)]/90 text-white"
                                    >
                                      {t("brandGuidelines.productGuidelines.updateButton")}
                                    </Button>
                                  </div>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteProduct(product)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled
                              className="opacity-50 cursor-not-allowed"
                              aria-label={`${t("common.edit")} (${t("brandGuidelines.adminOnly")})`}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled
                              className="opacity-50 cursor-not-allowed"
                              aria-label={`${t("common.delete")} (${t("brandGuidelines.adminOnly")})`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground line-clamp-3">{product.guidelines}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
