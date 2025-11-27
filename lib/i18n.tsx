"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useAppStore } from "./store"
import enTranslations from "@/locales/en.json"
import itTranslations from "@/locales/it.json"

type Translations = Record<string, any>

interface I18nContextType {
  t: (key: string, variables?: Record<string, any> | string) => string
  locale: string
  setLocale: (locale: string) => void
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

const translationsMap: Record<string, Translations> = {
  en: enTranslations,
  it: itTranslations,
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const { userSettings, updateUserSettings } = useAppStore()
  const [locale, setLocaleState] = useState(userSettings.preferences.language)
  const [translations, setTranslations] = useState<Translations>(
    translationsMap[userSettings.preferences.language] || translationsMap.en,
  )

  useEffect(() => {
    console.log("[v0] i18n locale changed:", userSettings.preferences.language)
    const newLocale = userSettings.preferences.language
    setLocaleState(newLocale)
    setTranslations(translationsMap[newLocale] || translationsMap.en)
  }, [userSettings.preferences.language])

  const t = (key: string, variables?: Record<string, any> | string): string => {
    const keys = key.split(".")
    let value: any = translations

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k]
      } else {
        console.log("[v0] Translation missing for key:", key)
        // Handle backward compatibility: if variables is a string, it's the fallback
        return typeof variables === "string" ? variables : key
      }
    }

    if (typeof value !== "string") {
      return typeof variables === "string" ? variables : key
    }

    // If variables is an object, perform interpolation
    if (variables && typeof variables === "object") {
      return value.replace(/\{\{(\w+)\}\}/g, (match: string, varName: string) => {
        return variables[varName] !== undefined ? String(variables[varName]) : match
      })
    }

    return value
  }

  const setLocale = (newLocale: string) => {
    console.log("[v0] setLocale called with:", newLocale)
    updateUserSettings({
      preferences: { ...userSettings.preferences, language: newLocale },
    })
  }

  return <I18nContext.Provider value={{ t, locale, setLocale }}>{children}</I18nContext.Provider>
}

export function useTranslation() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error("useTranslation must be used within I18nProvider")
  }
  return context
}
