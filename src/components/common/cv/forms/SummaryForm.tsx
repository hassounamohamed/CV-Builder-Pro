"use client"

import React from 'react'
import { useCV } from '@/contexts/CVContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const SummaryForm: React.FC = () => {
  const { cvData, updateCVData } = useCV()

  const handleChange = (value: string) => {
    updateCVData({ summary: value })
  }

  return (
    <Card className="animate-fadeIn">
      <CardHeader>
        <CardTitle>Professional Summary</CardTitle>
        <CardDescription>
          Write a brief summary of your professional background, skills, and career goals
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="summary">Summary</Label>
          <Textarea
            id="summary"
            placeholder="A dedicated professional with X years of experience in..."
            value={cvData.summary}
            onChange={(e) => handleChange(e.target.value)}
            className="min-h-[200px]"
          />
          <p className="text-xs text-muted-foreground">
            {cvData.summary.length} / 500 characters
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default SummaryForm
