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
import { Education } from '@/types/cv'
import { useI18n } from '@/contexts/I18nContext'

const EducationForm: React.FC = () => {
  const { cvData, updateCVData } = useCV()
  const { t } = useI18n()
  const [editingEduId, setEditingEduId] = useState<string | null>(null)
  const [currentEdu, setCurrentEdu] = useState<Partial<Education>>({
    id: '',
    institution: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
  })

  const resetCurrentEdu = () => {
    setCurrentEdu({
      id: '',
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    })
  }

  const handleSave = () => {
    if (currentEdu.institution && currentEdu.degree && currentEdu.field && currentEdu.startDate) {
      const newEdu: Education = {
        id: editingEduId || Date.now().toString(),
        institution: currentEdu.institution,
        degree: currentEdu.degree,
        field: currentEdu.field,
        startDate: currentEdu.startDate,
        endDate: currentEdu.endDate || '',
        current: currentEdu.current || false,
        description: currentEdu.description,
      }

      if (editingEduId) {
        updateCVData({
          education: cvData.education.map((edu) =>
            edu.id === editingEduId ? newEdu : edu
          ),
        })
      } else {
        updateCVData({
          education: [...cvData.education, newEdu],
        })
      }

      setEditingEduId(null)
      resetCurrentEdu()
    }
  }

  const handleEdit = (edu: Education) => {
    setCurrentEdu({ ...edu })
    setEditingEduId(edu.id)
  }

  const handleCancelEdit = () => {
    setEditingEduId(null)
    resetCurrentEdu()
  }

  const handleRemove = (id: string) => {
    updateCVData({
      education: cvData.education.filter((edu) => edu.id !== id),
    })
  }

  return (
    <Card className="animate-fadeIn">
      <CardHeader>
        <CardTitle>{t('cv.education.title')}</CardTitle>
        <CardDescription>{t('cv.education.description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Added Education */}
        {cvData.education.length > 0 && (
          <div className="space-y-3">
            {cvData.education.map((edu) => (
              <div
                key={edu.id}
                className="p-4 border rounded-lg bg-muted/50 flex justify-between items-start"
              >
                <div className="flex-1">
                  <h4 className="font-semibold">{edu.degree} {t('cv.education.in')} {edu.field}</h4>
                  <p className="text-sm text-muted-foreground">{edu.institution}</p>
                  <p className="text-xs text-muted-foreground">
                    {edu.startDate} - {edu.current ? t('common.present') : edu.endDate}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(edu)}
                    aria-label={t('common.edit')}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemove(edu.id)}
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

        {/* Add New Education Form */}
        <div className="space-y-4 pt-4 border-t">
          <h4 className="font-medium">{t('cv.education.addTitle')}</h4>

          <div className="space-y-2">
            <Label htmlFor="institution">{t('cv.education.institution')}</Label>
            <Input
              id="institution"
              placeholder={t('cv.education.institutionPlaceholder')}
              value={currentEdu.institution || ''}
              onChange={(e) => setCurrentEdu({ ...currentEdu, institution: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="degree">{t('cv.education.degree')}</Label>
              <Input
                id="degree"
                placeholder={t('cv.education.degreePlaceholder')}
                value={currentEdu.degree || ''}
                onChange={(e) => setCurrentEdu({ ...currentEdu, degree: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="field">{t('cv.education.field')}</Label>
              <Input
                id="field"
                placeholder={t('cv.education.fieldPlaceholder')}
                value={currentEdu.field || ''}
                onChange={(e) => setCurrentEdu({ ...currentEdu, field: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="eduStartDate">{t('cv.education.startDate')}</Label>
              <Input
                id="eduStartDate"
                type="month"
                value={currentEdu.startDate || ''}
                onChange={(e) => setCurrentEdu({ ...currentEdu, startDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="eduEndDate">{t('cv.education.endDate')}</Label>
              <Input
                id="eduEndDate"
                type="month"
                value={currentEdu.endDate || ''}
                onChange={(e) => setCurrentEdu({ ...currentEdu, endDate: e.target.value })}
                disabled={currentEdu.current}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="eduCurrent"
              checked={currentEdu.current}
              onCheckedChange={(checked) =>
                setCurrentEdu({ ...currentEdu, current: checked as boolean })
              }
            />
            <label htmlFor="eduCurrent" className="text-sm">
              {t('cv.education.currentStudy')}
            </label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="eduDescription">{t('cv.education.descriptionLabel')}</Label>
            <Textarea
              id="eduDescription"
              placeholder={t('cv.education.descriptionPlaceholder')}
              value={currentEdu.description || ''}
              onChange={(e) => setCurrentEdu({ ...currentEdu, description: e.target.value })}
              className="min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Button onClick={handleSave} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              {editingEduId ? t('common.update') : t('cv.education.addButton')}
            </Button>
            {editingEduId && (
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

export default EducationForm
