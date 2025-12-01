"use client"

import React, { useState, useEffect } from "react"
import { X, Check } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n"

export interface ResultColumn<T> {
  key: string
  label: string
  render: (item: T) => React.ReactNode
  className?: string
}

interface SearchResultsModalProps<T> {
  isOpen: boolean
  onClose: () => void
  title: string
  items: T[]
  columns: ResultColumn<T>[]
  onSelect: (items: T[]) => void
  getItemId: (item: T) => string
  multiSelect?: boolean
  onItemClick?: (item: T) => void // Optional handler for clicking on an item
}

export function SearchResultsModal<T>({
  isOpen,
  onClose,
  title,
  items,
  columns,
  onSelect,
  getItemId,
  multiSelect = true,
  onItemClick,
}: SearchResultsModalProps<T>) {
  const { t } = useTranslation()
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  // Reset selection when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedIds(new Set())
    }
  }, [isOpen])

  const handleToggleSelection = (itemId: string) => {
    if (multiSelect) {
      setSelectedIds((prev) => {
        const next = new Set(prev)
        if (next.has(itemId)) {
          next.delete(itemId)
        } else {
          next.add(itemId)
        }
        return next
      })
    } else {
      setSelectedIds(new Set([itemId]))
    }
  }

  const handleConfirm = () => {
    const selectedItems = items.filter((item) => selectedIds.has(getItemId(item)))
    onSelect(selectedItems)
    setSelectedIds(new Set())
    onClose()
  }

  const handleCancel = () => {
    setSelectedIds(new Set())
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>Nessun risultato trovato</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  {multiSelect && <TableHead className="w-[50px]"></TableHead>}
                  {columns.map((column) => (
                    <TableHead key={column.key} className={column.className}>
                      {column.label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => {
                  const itemId = getItemId(item)
                  const isSelected = selectedIds.has(itemId)
                  return (
                    <TableRow
                      key={itemId}
                      className={cn(
                        "cursor-pointer",
                        isSelected && "bg-accent-violet/10"
                      )}
                      onClick={(e) => {
                        // If onItemClick is provided and click is not on checkbox, call it
                        if (onItemClick && !(e.target as HTMLElement).closest('input[type="checkbox"]')) {
                          onItemClick(item)
                        } else {
                          handleToggleSelection(itemId)
                        }
                      }}
                    >
                      {multiSelect && (
                        <TableCell 
                          onClick={(e) => e.stopPropagation()}
                          className="w-[50px]"
                        >
                          <div onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={(checked) => {
                                if (checked !== undefined) {
                                  handleToggleSelection(itemId)
                                }
                              }}
                            />
                          </div>
                        </TableCell>
                      )}
                      {columns.map((column) => (
                        <TableCell key={column.key} className={column.className}>
                          {column.render(item)}
                        </TableCell>
                      ))}
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </div>
        <div className="px-6 py-4 border-t flex justify-end gap-2">
          <Button variant="outline" onClick={handleCancel}>
            {t("common.cancel")}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={selectedIds.size === 0}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {multiSelect && selectedIds.size > 0
              ? `${t("common.select")} ${selectedIds.size} ${selectedIds.size === 1 ? "elemento" : "elementi"}`
              : t("common.select")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

