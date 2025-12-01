"use client"

import React from "react"
import { Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

export interface TableColumn<T> {
  key: string
  label: string
  render: (item: T) => React.ReactNode
  className?: string
  hideOnMobile?: boolean
}

interface SearchableItemsTableProps<T> {
  items: T[]
  columns: TableColumn<T>[]
  onDelete: (itemId: string) => void
  getItemId: (item: T) => string
  emptyMessage?: string
  loading?: boolean
  className?: string
}

export function SearchableItemsTable<T>({
  items,
  columns,
  onDelete,
  getItemId,
  emptyMessage = "Nessun elemento",
  loading = false,
  className,
}: SearchableItemsTableProps<T>) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Caricamento...</span>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={column.key}
                    className={cn(
                      column.hideOnMobile && "hidden md:table-cell",
                      "min-w-0",
                      column.className
                    )}
              >
                {column.label}
              </TableHead>
            ))}
                <TableHead className="w-[80px] min-w-[80px] text-right whitespace-nowrap">Azioni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => {
            const itemId = getItemId(item)
            return (
              <TableRow key={itemId}>
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                        className={cn(
                          column.hideOnMobile && "hidden md:table-cell",
                          "min-w-0 max-w-0",
                          column.className
                        )}
                  >
                        <div className="min-w-0">
                    {column.render(item)}
                        </div>
                  </TableCell>
                ))}
                    <TableCell className="w-[80px] min-w-[80px] text-right whitespace-nowrap">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(itemId)}
                    className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                    aria-label="Elimina"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
        </div>
      </div>
    </div>
  )
}

