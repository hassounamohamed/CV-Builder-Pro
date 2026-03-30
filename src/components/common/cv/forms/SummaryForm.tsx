"use client"

import React from 'react'
import { useCV } from '@/contexts/CVContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useI18n } from '@/contexts/I18nContext'

const SummaryForm: React.FC = () => {
  const { cvData, updateCVData } = useCV()
  const { t } = useI18n()

  const handleChange = (value: string) => {
    updateCVData({ summary: value })
  }

  return (
    <Card className="animate-fadeIn">
      <CardHeader>
        <CardTitle>{t('cv.summary.title')}</CardTitle>
        <CardDescription>
          {t('cv.summary.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="summary">{t('cv.summary.label')}</Label>
          <Textarea
            id="summary"
            placeholder={t('cv.summary.placeholder')}
            value={cvData.summary}
            onChange={(e) => handleChange(e.target.value)}
            className="min-h-[200px]"
          />
          <p className="text-xs text-muted-foreground">
            {cvData.summary.length} / 500 {t('cv.summary.characters')}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default SummaryForm
