"use client"

import React, { useState } from 'react'
import { useCV } from '@/contexts/CVContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, Trash2, Pencil } from 'lucide-react'
import { Experience } from '@/types/cv'
import { useI18n } from '@/contexts/I18nContext'
import { useAI } from '@/hooks/useAI'

const ExperienceForm: React.FC = () => {
  const { cvData, updateCVData } = useCV()
  const { t } = useI18n()
  const { improve, isLoading } = useAI()
  const [editingExpId, setEditingExpId] = useState<string | null>(null)
  const [currentExp, setCurrentExp] = useState<Partial<Experience>>({
    id: '',
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
  })

  const resetCurrentExp = () => {
    setCurrentExp({
      id: '',
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    })
  }

  const handleSave = () => {
    if (currentExp.company && currentExp.position && currentExp.startDate) {
      const newExp: Experience = {
        id: editingExpId || Date.now().toString(),
        company: currentExp.company,
        position: currentExp.position,
        startDate: currentExp.startDate,
        endDate: currentExp.endDate || '',
        current: currentExp.current || false,
        description: currentExp.description || '',
      }

      if (editingExpId) {
        updateCVData({
          experience: cvData.experience.map((exp) =>
            exp.id === editingExpId ? newExp : exp
          ),
        })
      } else {
        updateCVData({
          experience: [...cvData.experience, newExp],
        })
      }

      setEditingExpId(null)
      resetCurrentExp()
    }
  }

  const handleEdit = (exp: Experience) => {
    setCurrentExp({ ...exp })
    setEditingExpId(exp.id)
  }

  const handleCancelEdit = () => {
    setEditingExpId(null)
    resetCurrentExp()
  }

  const handleRemove = (id: string) => {
    updateCVData({
      experience: cvData.experience.filter((exp) => exp.id !== id),
    })
  }

  const handleImproveDescription = async () => {
    const description = currentExp.description || ''
    const result = await improve({ type: 'improve-experience', content: description })
    if (result) {
      setCurrentExp({ ...currentExp, description: result })
    }
  }

  const handleGrammarDescription = async () => {
    const description = currentExp.description || ''
    const result = await improve({ type: 'check-grammar', content: description })
    if (result) {
      setCurrentExp({ ...currentExp, description: result })
    }
  }

  return (
    <Card className="animate-fadeIn">
      <CardHeader>
        <CardTitle>{t('cv.experience.title')}</CardTitle>
        <CardDescription>{t('cv.experience.description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Added Experiences */}
        {cvData.experience.length > 0 && (
          <div className="space-y-3">
            {cvData.experience.map((exp) => (
              <div
                key={exp.id}
                className="p-4 border rounded-lg bg-muted/50 flex justify-between items-start"
              >
                <div className="flex-1">
                  <h4 className="font-semibold">{exp.position}</h4>
                  <p className="text-sm text-muted-foreground">{exp.company}</p>
                  <p className="text-xs text-muted-foreground">
                    {exp.startDate} - {exp.current ? t('common.present') : exp.endDate}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(exp)}
                    aria-label={t('common.edit')}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemove(exp.id)}
                    className="text-destructive hover:text-destructive/80"
                    aria-label={t('common.delete')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add New Experience Form */}
        <div className="space-y-4 pt-4 border-t">
          <h4 className="font-medium">{t('cv.experience.addTitle')}</h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">{t('cv.experience.company')}</Label>
              <Input
                id="company"
                placeholder={t('cv.experience.companyPlaceholder')}
                value={currentExp.company || ''}
                onChange={(e) => setCurrentExp({ ...currentExp, company: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">{t('cv.experience.position')}</Label>
              <Input
                id="position"
                placeholder={t('cv.experience.positionPlaceholder')}
                value={currentExp.position || ''}
                onChange={(e) => setCurrentExp({ ...currentExp, position: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">{t('cv.experience.startDate')}</Label>
              <Input
                id="startDate"
                type="month"
                value={currentExp.startDate || ''}
                onChange={(e) => setCurrentExp({ ...currentExp, startDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">{t('cv.experience.endDate')}</Label>
              <Input
                id="endDate"
                type="month"
                value={currentExp.endDate || ''}
                onChange={(e) => setCurrentExp({ ...currentExp, endDate: e.target.value })}
                disabled={currentExp.current}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="current"
              checked={currentExp.current}
              onCheckedChange={(checked) =>
                setCurrentExp({ ...currentExp, current: checked as boolean })
              }
            />
            <label htmlFor="current" className="text-sm">
              {t('cv.experience.currentWork')}
            </label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t('cv.experience.descriptionLabel')}</Label>
            <Textarea
              id="description"
              placeholder={t('cv.experience.descriptionPlaceholder')}
              value={currentExp.description || ''}
              onChange={(e) => setCurrentExp({ ...currentExp, description: e.target.value })}
              className="min-h-[100px]"
            />
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" onClick={handleImproveDescription} disabled={isLoading}>
                {t('cv.ai.improveDescription')}
              </Button>
              <Button type="button" variant="outline" onClick={handleGrammarDescription} disabled={isLoading}>
                {t('cv.ai.checkGrammar')}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Button onClick={handleSave} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              {editingExpId ? t('common.update') : t('cv.experience.addButton')}
            </Button>
            {editingExpId && (
              <Button type="button" variant="outline" className="w-full" onClick={handleCancelEdit}>
                {t('common.cancel')}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ExperienceForm
