"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from "@/lib/i18n"

export function Step2bStartingDocuments() {
  const { t } = useTranslation()

  return (
    <Card className="hyntelo-elevation-3">
      <CardHeader>
        <CardTitle className="text-lg font-medium">{t("form.steps.step2b.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{t("form.steps.step2b.description")}</p>
        {/* Content will be added later */}
      </CardContent>
    </Card>
  )
}

