"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ItemsManager } from "@/components/shared/items-manager"
import { type TableColumn } from "@/components/shared/searchable-items-table"
import { type ResultColumn } from "@/components/shared/search-results-modal"
import { useTranslation } from "@/lib/i18n"
import { useAppStore } from "@/lib/store"
import type { ScientificReference } from "@/lib/store/types"
import type { AttachmentFile } from "@/lib/file-utils"

export function Step4ScientificReferences() {
  const { t } = useTranslation()
  const { campaignData, setCampaignData, currentBrief } = useAppStore()
  const [references, setReferences] = useState<ScientificReference[]>(
    campaignData.scientificReferences || []
  )

  const handleReferencesChange = (newReferences: ScientificReference[]) => {
    setReferences(newReferences)
    setCampaignData({ ...campaignData, scientificReferences: newReferences })
  }

  // Mock AI search function - in real app, this would call knowledge base API
  const handleAiSearch = async (mode: "merge" | "replace"): Promise<void> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock results
    const mockResults: ScientificReference[] = [
      {
        id: `ref-${Date.now()}-1`,
        referenceId: "IT-762386",
        title: "Studio clinico esempio 1",
        authors: "Rossi et al.",
        journal: "Journal of Medicine",
        publicationDate: "2017-07-10",
      },
      {
        id: `ref-${Date.now()}-2`,
        referenceId: "IT-7657865",
        title: "Studio clinico esempio 2",
        authors: "Bianchi et al.",
        journal: "Medical Research",
        publicationDate: "2018-03-15",
      },
    ]

    if (mode === "replace") {
      handleReferencesChange(mockResults)
    } else {
      handleReferencesChange([...references, ...mockResults])
    }
  }

  // Mock regular search function
  const handleSearch = async (values: Record<string, string>): Promise<ScientificReference[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return [
      {
        id: `ref-${Date.now()}-1`,
        referenceId: "IT-762386",
        title: "Risultato ricerca esempio",
        authors: "Verdi et al.",
        journal: "Clinical Studies",
        publicationDate: "2019-05-20",
      },
    ]
  }

  const handleFileAdd = (file: AttachmentFile, metadata?: Record<string, string>) => {
    // Check for duplicates
    const existingRef = references.find(
      (ref) => ref.title === metadata?.title && ref.authors === metadata?.authors
    )

    if (existingRef) {
      // In real app, show error toast
      console.warn("Reference already exists")
      return
    }

    const newReference: ScientificReference = {
      id: `ref-${Date.now()}`,
      referenceId: `IT-${Math.floor(Math.random() * 1000000)}`,
      title: metadata?.title || file.name,
      authors: metadata?.authors || "Unknown",
      journal: metadata?.journal,
      publicationDate: metadata?.publicationDate,
    }

    handleReferencesChange([...references, newReference])
  }

  const tableColumns: TableColumn<ScientificReference>[] = [
    {
      key: "referenceId",
      label: t("form.steps.step4.table.referenceId"),
      render: (item) => (
        <div className="min-w-0 max-w-full">
          <span className="font-mono text-sm truncate block whitespace-nowrap" title={item.referenceId}>
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
  ]

  const resultColumns: ResultColumn<ScientificReference>[] = [
    {
      key: "referenceId",
      label: t("form.steps.step4.table.referenceId"),
      render: (item) => <span className="font-mono text-sm">{item.referenceId}</span>,
    },
    {
      key: "title",
      label: t("form.steps.step4.table.title"),
      render: (item) => <span>{item.title}</span>,
    },
    {
      key: "authors",
      label: t("form.steps.step4.table.authors"),
      render: (item) => <span>{item.authors}</span>,
    },
    {
      key: "publicationDate",
      label: t("form.steps.step4.table.publicationDate"),
      render: (item) => (
        <span>{item.publicationDate ? new Date(item.publicationDate).toLocaleDateString("it-IT") : "-"}</span>
      ),
    },
  ]

  return (
    <Card className="hyntelo-elevation-3">
      <CardHeader>
        <CardTitle className="text-lg font-medium">{t("form.steps.step4.title")}</CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          {t("form.steps.step4.description")}
        </p>
      </CardHeader>
      <CardContent>
        <ItemsManager
          searchConfig={{
            enabled: true,
            title: t("form.steps.step4.search.title"),
            subtitle: t("form.steps.step4.search.subtitle"),
            fields: [],
            onSearch: handleSearch,
            aiSearch: {
              label: t("form.steps.step4.search.aiButton"),
              onSearch: handleAiSearch,
              loading: false,
            },
            resultColumns,
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
          }}
          tableConfig={{
            title: t("form.steps.step4.table.title"),
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
  )
}

