"use client"

import React from 'react'
import { useCV } from '@/contexts/CVContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useI18n } from '@/contexts/I18nContext'

const PersonalInfoForm: React.FC = () => {
  const { cvData, updateCVData } = useCV()
  const { t } = useI18n()

  const handleChange = (field: string, value: string) => {
    updateCVData({
      personalInfo: {
        ...cvData.personalInfo,
        [field]: value,
      },
    })
  }

  return (
    <Card className="animate-fadeIn">
      <CardHeader>
        <CardTitle>{t('cv.personal.title')}</CardTitle>
        <CardDescription>
          {t('cv.personal.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">{t('cv.personal.fullName')}</Label>
          <Input
            id="fullName"
            placeholder="John Doe"
            value={cvData.personalInfo.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="professionalTitle">Professional Title</Label>
          <Input
            id="professionalTitle"
            placeholder="Senior Software Engineer"
            value={cvData.personalInfo.professionalTitle || ''}
            onChange={(e) => handleChange('professionalTitle', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">{t('common.email')} *</Label>
          <Input
            id="email"
            type="email"
            placeholder="john.doe@example.com"
            value={cvData.personalInfo.email}
            onChange={(e) => handleChange('email', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">{t('cv.personal.phone')}</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+1 (555) 123-4567"
            value={cvData.personalInfo.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">{t('cv.personal.address')}</Label>
          <Input
            id="address"
            placeholder="123 Main St, City, Country"
            value={cvData.personalInfo.address}
            onChange={(e) => handleChange('address', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="linkedin">{t('cv.personal.linkedin')}</Label>
          <Input
            id="linkedin"
            placeholder="linkedin.com/in/johndoe"
            value={cvData.personalInfo.linkedin || ''}
            onChange={(e) => handleChange('linkedin', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">{t('cv.personal.website')}</Label>
          <Input
            id="website"
            placeholder="www.johndoe.com"
            value={cvData.personalInfo.website || ''}
            onChange={(e) => handleChange('website', e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default PersonalInfoForm
