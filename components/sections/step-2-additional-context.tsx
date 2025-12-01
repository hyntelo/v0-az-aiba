"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ItemsManager } from "@/components/shared/items-manager"
import { type TableColumn } from "@/components/shared/searchable-items-table"
import { useTranslation } from "@/lib/i18n"
import { useAppStore } from "@/lib/store"
import type { AttachmentFile } from "@/lib/file-utils"
import { Edit2 } from "lucide-react"

interface AttachmentWithDescription extends AttachmentFile {
  description?: string
}

// Random description templates for demo purposes
const generateRandomDescription = (fileName: string): string => {
  const templates = [
    `Documento ${fileName} contenente informazioni dettagliate sul prodotto farmaceutico, inclusi dati clinici e risultati di studi.`,
    `File ${fileName} con analisi di mercato e strategie di comunicazione per il lancio del prodotto.`,
    `${fileName} include linee guida per la compliance e materiali di riferimento per la campagna.`,
    `Documento ${fileName} contenente specifiche tecniche, target audience e messaggi chiave per la comunicazione.`,
    `${fileName} presenta dati di efficacia clinica e profilo di sicurezza del prodotto.`,
    `File ${fileName} con contenuti per materiali promozionali e strategie di engagement con gli HCP.`,
    `${fileName} include informazioni su competitor analysis e posizionamento del brand.`,
    `Documento ${fileName} con template e linee guida per la creazione di contenuti multicanale.`,
  ]
  return templates[Math.floor(Math.random() * templates.length)]
}

export function Step2AdditionalContext() {
  const { t } = useTranslation()
  const { campaignData, setCampaignData } = useAppStore()
  const [attachments, setAttachments] = useState<AttachmentWithDescription[]>(
    campaignData.attachments.map((att) => ({
      ...att,
      description: (att as any).description || "",
    })) || []
  )
  const [editingFileId, setEditingFileId] = useState<string | null>(null)
  const [editDescription, setEditDescription] = useState("")

  const handleFileAdd = (file: AttachmentFile) => {
    // Auto-generate random description (simulated genAI for demo)
    const generatedDescription = generateRandomDescription(file.name)
    const newAttachment: AttachmentWithDescription = {
      ...file,
      description: generatedDescription,
    }
    const updatedAttachments = [...attachments, newAttachment]
    setAttachments(updatedAttachments)
    setCampaignData({ ...campaignData, attachments: updatedAttachments })
  }

  const handleFileRemove = (fileId: string) => {
    const updatedAttachments = attachments.filter((att) => att.id !== fileId)
    setAttachments(updatedAttachments)
    setCampaignData({ ...campaignData, attachments: updatedAttachments })
  }

  const handleDescriptionChange = (fileId: string, description: string) => {
    const updatedAttachments = attachments.map((att) =>
      att.id === fileId ? { ...att, description } : att
    )
    setAttachments(updatedAttachments)
    setCampaignData({ ...campaignData, attachments: updatedAttachments })
  }

  const handleEditClick = (fileId: string) => {
    const attachment = attachments.find((att) => att.id === fileId)
    if (attachment) {
      setEditDescription(attachment.description || "")
      setEditingFileId(fileId)
    }
  }

  const handleEditSave = () => {
    if (editingFileId) {
      handleDescriptionChange(editingFileId, editDescription)
      setEditingFileId(null)
      setEditDescription("")
    }
  }

  const handleEditCancel = () => {
    setEditingFileId(null)
    setEditDescription("")
  }

  const tableColumns: TableColumn<AttachmentWithDescription>[] = [
    {
      key: "name",
      label: t("form.steps.step2.table.attachmentName"),
      render: (item) => (
        <div className="min-w-0 max-w-full">
          <span className="text-sm truncate block" title={item.name}>
            {item.name}
          </span>
        </div>
      ),
    },
    {
      key: "description",
      label: t("form.steps.step2.table.description"),
      render: (item) => (
        <div className="flex items-center gap-2 min-w-0 max-w-full">
          <span 
            className="text-sm text-muted-foreground flex-1 truncate min-w-0" 
            title={item.description || t("form.steps.step2.table.noDescription")}
          >
            {item.description || t("form.steps.step2.table.noDescription")}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditClick(item.id)}
            className="h-8 w-8 p-0 flex-shrink-0"
            aria-label={t("common.edit")}
          >
            <Edit2 className="w-4 h-4" />
          </Button>
        </div>
      ),
      hideOnMobile: true,
    },
  ]

  const editingAttachment = attachments.find((att) => att.id === editingFileId)

  return (
    <>
      <Card className="hyntelo-elevation-3">
        <CardHeader>
          <CardTitle className="text-lg font-medium">{t("form.steps.step2.title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Items Manager for Attachments */}
          <ItemsManager
            uploadConfig={{
              enabled: true,
              title: t("form.steps.step2.upload.title"),
              subtitle: t("form.steps.step2.upload.subtitle"),
              autoGenerateDescription: true,
            }}
            tableConfig={{
              title: t("form.steps.step2.table.title"),
              columns: tableColumns,
              emptyMessage: t("form.steps.step2.table.emptyMessage"),
            }}
            items={attachments}
            onItemsChange={setAttachments}
            getItemId={(item) => item.id}
            onFileAdd={handleFileAdd}
            onFileRemove={handleFileRemove}
            files={attachments}
          />
        </CardContent>
      </Card>

      {/* Edit Description Dialog */}
      <Dialog open={editingFileId !== null} onOpenChange={(open) => !open && handleEditCancel()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("form.steps.step2.editDescription.title")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-file-name">{t("form.steps.step2.table.attachmentName")}</Label>
              <Input
                id="edit-file-name"
                value={editingAttachment?.name || ""}
                disabled
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">{t("form.steps.step2.table.description")}</Label>
              <Textarea
                id="edit-description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder={t("form.steps.step2.table.descriptionPlaceholder")}
                rows={6}
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleEditCancel}>
              {t("common.cancel")}
            </Button>
            <Button onClick={handleEditSave}>
              {t("common.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

