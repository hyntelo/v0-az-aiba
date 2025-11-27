"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { X } from "lucide-react"
import { CitationItem } from "./citation-item"
import type { MedicalCitation } from "@/lib/store/types"

interface CitationsModalProps {
  isOpen: boolean
  onClose: () => void
  citations: MedicalCitation[]
  searchQuery?: string
}

export function CitationsModal({ isOpen, onClose, citations, searchQuery }: CitationsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)
  const scrollPositionRef = useRef<number>(0)

  useEffect(() => {
    if (isOpen) {
      scrollPositionRef.current = window.scrollY
      document.body.style.top = `-${scrollPositionRef.current}px`
      document.body.style.position = "fixed"
      document.body.style.width = "100%"

      // Store reference to the trigger element for focus restoration
      triggerRef.current = document.activeElement as HTMLElement
    } else {
      document.body.style.position = ""
      document.body.style.top = ""
      document.body.style.width = ""
      window.scrollTo(0, scrollPositionRef.current)

      // Restore focus to trigger element
      if (triggerRef.current) {
        triggerRef.current.focus()
      }
    }

    return () => {
      // Cleanup on unmount
      document.body.style.position = ""
      document.body.style.top = ""
      document.body.style.width = ""
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      return () => document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
      onClick={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className="bg-popover rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col"
        role="dialog"
        aria-labelledby="citations-modal-title"
        aria-modal="true"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <h2 id="citations-modal-title" className="text-xl font-medium text-gray-900">
            All Citations ({citations.length})
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            aria-label="Close citations modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-3">
            {citations.map((citation) => (
              <CitationItem key={citation.id} citation={citation} searchQuery={searchQuery} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
