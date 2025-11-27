"use client"

import React, { useState } from "react"
import { ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu"

interface MenuItem {
  label: string
  onSelect: () => void
}

interface SplitButtonProps {
  label: string
  icon?: React.ReactNode
  onPrimary: () => void
  menuItems: MenuItem[]
  loading?: boolean
  disabled?: boolean
  className?: string
}

export const SplitButton = React.forwardRef<HTMLDivElement, SplitButtonProps>(
  ({ label, icon, onPrimary, menuItems, loading = false, disabled = false, className = "" }, ref) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const handlePrimaryClick = () => {
      if (!loading && !disabled) {
        onPrimary()
      }
    }

    const buttonDisabled = loading || disabled

    return (
      <div
        ref={ref}
        role="group"
        className={`inline-flex focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[var(--accent-violet)] rounded-2xl ${className}`}
      >
        <button
          onClick={handlePrimaryClick}
          disabled={buttonDisabled}
          className={`h-10 px-4 inline-flex items-center gap-2 text-sm font-medium rounded-l-2xl transition-all ${
            buttonDisabled
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-[var(--accent-violet)] to-[var(--accent-sky)] text-white hover:opacity-90 active:scale-95"
          }`}
          aria-busy={loading}
        >
          {icon}
          {label}
        </button>

        <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <DropdownMenuTrigger asChild>
            <button
              disabled={buttonDisabled}
              aria-label="More options"
              className={`w-10 h-10 inline-flex items-center justify-center rounded-r-2xl border-l border-white/20 transition-all ${
                buttonDisabled
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-[var(--accent-violet)] to-[var(--accent-sky)] text-white hover:opacity-90 active:scale-95"
              }`}
            >
              <ChevronDown className={`w-4 h-4 transition-transform ${isMenuOpen ? "rotate-180" : ""}`} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {menuItems.map((item, index) => (
              <DropdownMenuItem
                key={index}
                onClick={() => {
                  item.onSelect()
                  setIsMenuOpen(false)
                }}
              >
                {item.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  },
)

SplitButton.displayName = "SplitButton"
