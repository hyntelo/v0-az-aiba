"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ItemsManager } from "@/components/shared/items-manager"
import { type TableColumn } from "@/components/shared/searchable-items-table"
import { type ResultColumn } from "@/components/shared/search-results-modal"
import { useTranslation } from "@/lib/i18n"
import { useAppStore } from "@/lib/store"
import type { StartingDocument } from "@/lib/store/types"

export function Step3StartingDocuments() {
  const { t } = useTranslation()
  const { campaignData, setCampaignData } = useAppStore()
  const [documents, setDocuments] = useState<StartingDocument[]>(
    campaignData.startingDocuments || []
  )

  const handleDocumentsChange = (newDocuments: StartingDocument[]) => {
    setDocuments(newDocuments)
    setCampaignData({ ...campaignData, startingDocuments: newDocuments })
  }

  const handleUsageChange = (documentId: string, usage: StartingDocument["usage"]) => {
    const updatedDocuments = documents.map((doc) =>
      doc.id === documentId ? { ...doc, usage } : doc
    )
    handleDocumentsChange(updatedDocuments)
  }

  // Mock search function - in real app, this would call VVPM API
  const handleSearch = async (values: Record<string, string>): Promise<StartingDocument[]> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Mock results
    return [
      {
        id: `doc-${Date.now()}-1`,
        documentId: "IT-762386",
        title: "Documento esempio 1",
        usage: "global-adapt",
      },
      {
        id: `doc-${Date.now()}-2`,
        documentId: "IT-7657865",
        title: "Documento esempio 2",
        usage: "update",
      },
    ]
  }

  const tableColumns: TableColumn<StartingDocument>[] = [
    {
      key: "documentId",
      label: t("form.steps.step3.table.documentId"),
      render: (item) => (
        <div className="min-w-0 max-w-full">
          <span className="font-mono text-sm truncate block" title={item.documentId}>
            {item.documentId}
          </span>
        </div>
      ),
      hideOnMobile: true,
    },
    {
      key: "title",
      label: t("form.steps.step3.table.title"),
      render: (item) => (
        <div className="min-w-0 max-w-full">
          <span className="truncate block" title={item.title}>
            {item.title}
          </span>
        </div>
      ),
    },
    {
      key: "usage",
      label: t("form.steps.step3.table.usage"),
      render: (item) => (
        <div className="min-w-[150px] max-w-[200px]">
          <Select
            value={item.usage}
            onValueChange={(value) =>
              handleUsageChange(item.id, value as StartingDocument["usage"])
            }
          >
            <SelectTrigger className="w-full max-w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="global-adapt">
                {t("form.steps.step3.usage.globalAdapt")}
              </SelectItem>
              <SelectItem value="update">{t("form.steps.step3.usage.update")}</SelectItem>
              <SelectItem value="inspiration">
                {t("form.steps.step3.usage.inspiration")}
              </SelectItem>
              <SelectItem value="other">{t("form.steps.step3.usage.other")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ),
    },
  ]

  const resultColumns: ResultColumn<StartingDocument>[] = [
    {
      key: "documentId",
      label: t("form.steps.step3.table.documentId"),
      render: (item) => <span className="font-mono text-sm">{item.documentId}</span>,
    },
    {
      key: "title",
      label: t("form.steps.step3.table.title"),
      render: (item) => <span>{item.title}</span>,
    },
  ]

  return (
    <Card className="hyntelo-elevation-3">
      <CardHeader>
        <CardTitle className="text-lg font-medium">{t("form.steps.step3.title")}</CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          {t("form.steps.step3.description")}
        </p>
      </CardHeader>
      <CardContent>
        <ItemsManager
          searchConfig={{
            enabled: true,
            title: t("form.steps.step3.search.title"),
            fields: [
              {
                name: "text",
                label: t("form.steps.step3.search.fields.text"),
                type: "text",
                placeholder: t("form.steps.step3.search.fields.textPlaceholder"),
              },
              {
                name: "country",
                label: t("form.steps.step3.search.fields.country"),
                type: "select",
                options: [
                  { label: "Italia", value: "IT" },
                  { label: "Germania", value: "DE" },
                  { label: "Francia", value: "FR" },
                ],
              },
              {
                name: "brand",
                label: t("form.steps.step3.search.fields.brand"),
                type: "select",
                options: [
                  { label: "Brand A", value: "brand-a" },
                  { label: "Brand B", value: "brand-b" },
                ],
              },
              {
                name: "channel",
                label: t("form.steps.step3.search.fields.channel"),
                type: "select",
                options: [
                  { label: "Email", value: "email" },
                  { label: "Social", value: "social" },
                ],
              },
              {
                name: "keyMessage",
                label: t("form.steps.step3.search.fields.keyMessage"),
                type: "select",
                options: [
                  { label: "Messaggio 1", value: "msg1" },
                  { label: "Messaggio 2", value: "msg2" },
                ],
              },
            ],
            onSearch: handleSearch,
            searchButtonLabel: t("form.steps.step3.search.button"),
            resultColumns,
          }}
          tableConfig={{
            title: (count: number) => t("form.steps.step3.table.titleWithCount", { count }),
            columns: tableColumns,
            emptyMessage: t("form.steps.step3.table.emptyMessage"),
          }}
          items={documents}
          onItemsChange={handleDocumentsChange}
          getItemId={(item) => item.id}
        />
      </CardContent>
    </Card>
  )
}

