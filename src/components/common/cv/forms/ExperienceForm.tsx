"use client"

import React, { useState } from 'react'
import { useCV } from '@/contexts/CVContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, Trash2 } from 'lucide-react'
import { Experience } from '@/types/cv'
import { useI18n } from '@/contexts/I18nContext'

const ExperienceForm: React.FC = () => {
  const { cvData, updateCVData } = useCV()
  const { t } = useI18n()
  const [currentExp, setCurrentExp] = useState<Partial<Experience>>({
    id: '',
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
  })

  const handleAdd = () => {
    if (currentExp.company && currentExp.position && currentExp.startDate) {
      const newExp: Experience = {
        id: Date.now().toString(),
        company: currentExp.company,
        position: currentExp.position,
        startDate: currentExp.startDate,
        endDate: currentExp.endDate || '',
        current: currentExp.current || false,
        description: currentExp.description || '',
      }

      updateCVData({
        experience: [...cvData.experience, newExp],
      })

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
  }

  const handleRemove = (id: string) => {
    updateCVData({
      experience: cvData.experience.filter((exp) => exp.id !== id),
    })
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
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemove(exp.id)}
                  className="text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
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
          </div>

          <Button onClick={handleAdd} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            {t('cv.experience.addButton')}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default ExperienceForm
