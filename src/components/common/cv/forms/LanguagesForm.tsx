"use client"

import React, { useState } from 'react'
import { useCV } from '@/contexts/CVContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'
import { Certification, Language } from '@/types/cv'
import { useI18n } from '@/contexts/I18nContext'

const LanguagesForm: React.FC = () => {
  const { cvData, updateCVData } = useCV()
  const { t } = useI18n()
  const [currentLanguage, setCurrentLanguage] = useState<Partial<Language>>({
    id: '',
    name: '',
  })
  const [currentCertification, setCurrentCertification] = useState<Partial<Certification>>({
    id: '',
    name: '',
    issuer: '',
    date: '',
  })

  const handleAdd = () => {
    if (currentLanguage.name) {
      const newLanguage: Language = {
        id: Date.now().toString(),
        name: currentLanguage.name,
      }

      updateCVData({
        languages: [...cvData.languages, newLanguage],
      })

      setCurrentLanguage({
        id: '',
        name: '',
      })
    }
  }

  const handleRemove = (id: string) => {
    updateCVData({
      languages: cvData.languages.filter((lang) => lang.id !== id),
    })
  }

  const handleAddCertification = () => {
    if (currentCertification.name) {
      const newCertification: Certification = {
        id: Date.now().toString(),
        name: currentCertification.name,
        issuer: currentCertification.issuer || '',
        date: currentCertification.date || '',
      }

      updateCVData({
        certifications: [...(cvData.certifications || []), newCertification],
      })

      setCurrentCertification({
        id: '',
        name: '',
        issuer: '',
        date: '',
      })
    }
  }

  const handleRemoveCertification = (id: string) => {
    updateCVData({
      certifications: (cvData.certifications || []).filter((cert) => cert.id !== id),
    })
  }

  return (
    <Card className="animate-fadeIn">
      <CardHeader>
        <CardTitle>{t('cv.languages.title')}</CardTitle>
        <CardDescription>{t('cv.languages.description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Added Languages */}
        {cvData.languages.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {cvData.languages.map((language) => (
              <div
                key={language.id}
                className="px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 border border-gray-300 dark:border-gray-600"
              >
                <span>{language.name}</span>
                <button
                  onClick={() => handleRemove(language.id)}
                  className="hover:opacity-70 transition-opacity"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add New Language Form */}
        <div className="space-y-4 pt-4 border-t">
          <h4 className="font-medium">{t('cv.languages.addTitle')}</h4>

          <div className="space-y-2">
            <Label htmlFor="languageName">{t('cv.languages.name')}</Label>
            <Input
              id="languageName"
              placeholder={t('cv.languages.placeholder')}
              value={currentLanguage.name || ''}
              onChange={(e) => setCurrentLanguage({ ...currentLanguage, name: e.target.value })}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAdd()
                }
              }}
            />
          </div>

          <Button onClick={handleAdd} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            {t('cv.languages.addButton')}
          </Button>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <h4 className="font-medium">Certifications</h4>

          {(cvData.certifications || []).length > 0 && (
            <div className="space-y-2">
              {(cvData.certifications || []).map((certification) => (
                <div
                  key={certification.id}
                  className="p-3 rounded-md border border-gray-300 dark:border-gray-600 flex items-start justify-between gap-3"
                >
                  <div className="text-sm">
                    <p className="font-medium">{certification.name}</p>
                    {(certification.issuer || certification.date) && (
                      <p className="text-muted-foreground">
                        {certification.issuer}
                        {certification.issuer && certification.date ? ' | ' : ''}
                        {certification.date}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemoveCertification(certification.id)}
                    className="hover:opacity-70 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="certName">Certification Name</Label>
            <Input
              id="certName"
              placeholder="AWS Certified Developer"
              value={currentCertification.name || ''}
              onChange={(e) => setCurrentCertification({ ...currentCertification, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="certIssuer">Issuer (Optional)</Label>
            <Input
              id="certIssuer"
              placeholder="Amazon Web Services"
              value={currentCertification.issuer || ''}
              onChange={(e) => setCurrentCertification({ ...currentCertification, issuer: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="certDate">Date (Optional)</Label>
            <Input
              id="certDate"
              placeholder="2026"
              value={currentCertification.date || ''}
              onChange={(e) => setCurrentCertification({ ...currentCertification, date: e.target.value })}
            />
          </div>

          <Button onClick={handleAddCertification} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Certification
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default LanguagesForm
