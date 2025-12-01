"use client"

import React, { useState } from "react"
import { Search, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SplitButton } from "@/components/ui/split-button"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export interface SearchField {
  name: string
  label: string
  type: "text" | "select"
  placeholder?: string
  options?: { label: string; value: string }[]
}

export interface AiSearchButton {
  label: string
  onSearch: (mode: "merge" | "replace") => Promise<void>
  loading?: boolean
}

interface SearchSectionProps {
  title: string
  subtitle?: string
  fields: SearchField[]
  onSearch: (values: Record<string, string>) => Promise<void>
  aiSearchButton?: AiSearchButton
  searchButtonLabel?: string
  className?: string
}

export function SearchSection({
  title,
  subtitle,
  fields,
  onSearch,
  aiSearchButton,
  searchButtonLabel = "Cerca",
  className,
}: SearchSectionProps) {
  const [searchValues, setSearchValues] = useState<Record<string, string>>({})
  const [isSearching, setIsSearching] = useState(false)

  const handleFieldChange = (name: string, value: string) => {
    setSearchValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleSearch = async () => {
    setIsSearching(true)
    try {
      await onSearch(searchValues)
    } finally {
      setIsSearching(false)
    }
  }

  const handleAiSearch = async (mode: "merge" | "replace") => {
    if (aiSearchButton) {
      setIsSearching(true)
      try {
        await aiSearchButton.onSearch(mode)
      } finally {
        setIsSearching(false)
      }
    }
  }

  return (
    <Card className={cn("hyntelo-elevation-1", className)}>
      <CardHeader>
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* AI Search Button (if provided) */}
        {aiSearchButton && (
          <div className="flex items-center gap-3">
            <SplitButton
              label={aiSearchButton.label}
              icon={
                aiSearchButton.loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : undefined
              }
              onPrimary={() => handleAiSearch("merge")}
              menuItems={[
                {
                  label: "Aggiungi alla selezione",
                  onSelect: () => handleAiSearch("merge"),
                },
                {
                  label: "Sostituisci selezione",
                  onSelect: () => handleAiSearch("replace"),
                },
              ]}
              loading={aiSearchButton.loading || isSearching}
            />
          </div>
        )}

        {/* Search Fields */}
        <div className="space-y-4">
          {/* Text Fields - Prominent, full width */}
          {fields
            .filter((field) => field.type === "text")
            .map((field) => (
            <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name} className="text-base font-medium">
                  {field.label}
                </Label>
                <Input
                  id={field.name}
                  type="text"
                  placeholder={field.placeholder}
                  value={searchValues[field.name] || ""}
                  onChange={(e) => handleFieldChange(field.name, e.target.value)}
                  className="w-full"
                />
              </div>
            ))}

          {/* Select Fields - All in one row */}
          {fields.filter((field) => field.type === "select").length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {fields
                .filter((field) => field.type === "select")
                .map((field) => (
                  <div key={field.name} className="space-y-2">
                    <Label htmlFor={field.name}>{field.label}</Label>
                <Select
                  value={searchValues[field.name] || ""}
                  onValueChange={(value) => handleFieldChange(field.name, value)}
                >
                  <SelectTrigger id={field.name} className="w-full">
                    <SelectValue placeholder={field.placeholder || field.label} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Search Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSearch}
            disabled={isSearching}
            className="w-full md:w-auto"
          >
            {isSearching ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Ricerca...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                {searchButtonLabel}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

