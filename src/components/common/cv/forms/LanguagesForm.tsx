"use client"

import React, { useState } from 'react'
import { useCV } from '@/contexts/CVContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Pencil } from 'lucide-react'
import { Certification, Language } from '@/types/cv'
import { useI18n } from '@/contexts/I18nContext'

const LanguagesForm: React.FC = () => {
  const { cvData, updateCVData } = useCV()
  const { t } = useI18n()
  const [editingLanguageId, setEditingLanguageId] = useState<string | null>(null)
  const [editingCertificationId, setEditingCertificationId] = useState<string | null>(null)
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

  const resetCurrentLanguage = () => {
    setCurrentLanguage({
      id: '',
      name: '',
    })
  }

  const handleSaveLanguage = () => {
    if (currentLanguage.name) {
      const newLanguage: Language = {
        id: editingLanguageId || Date.now().toString(),
        name: currentLanguage.name,
      }

      if (editingLanguageId) {
        updateCVData({
          languages: cvData.languages.map((lang) =>
            lang.id === editingLanguageId ? newLanguage : lang
          ),
        })
      } else {
        updateCVData({
          languages: [...cvData.languages, newLanguage],
        })
      }

      setEditingLanguageId(null)
      resetCurrentLanguage()
    }
  }

  const handleEditLanguage = (language: Language) => {
    setCurrentLanguage({ ...language })
    setEditingLanguageId(language.id)
  }

  const handleCancelLanguageEdit = () => {
    setEditingLanguageId(null)
    resetCurrentLanguage()
  }

  const handleRemove = (id: string) => {
    updateCVData({
      languages: cvData.languages.filter((lang) => lang.id !== id),
    })
  }

  const resetCurrentCertification = () => {
    setCurrentCertification({
      id: '',
      name: '',
      issuer: '',
      date: '',
    })
  }

  const handleSaveCertification = () => {
    if (currentCertification.name) {
      const newCertification: Certification = {
        id: editingCertificationId || Date.now().toString(),
        name: currentCertification.name,
        issuer: currentCertification.issuer || '',
        date: currentCertification.date || '',
      }

      if (editingCertificationId) {
        updateCVData({
          certifications: (cvData.certifications || []).map((cert) =>
            cert.id === editingCertificationId ? newCertification : cert
          ),
        })
      } else {
        updateCVData({
          certifications: [...(cvData.certifications || []), newCertification],
        })
      }

      setEditingCertificationId(null)
      resetCurrentCertification()
    }
  }

  const handleEditCertification = (certification: Certification) => {
    setCurrentCertification({ ...certification })
    setEditingCertificationId(certification.id)
  }

  const handleCancelCertificationEdit = () => {
    setEditingCertificationId(null)
    resetCurrentCertification()
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
                  onClick={() => handleEditLanguage(language)}
                  className="hover:opacity-70 transition-opacity"
                  aria-label={t('common.edit')}
                >
                  <Pencil className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleRemove(language.id)}
                  className="text-destructive hover:text-destructive/80 transition-colors"
                  aria-label={t('common.delete')}
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
                  handleSaveLanguage()
                }
              }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Button onClick={handleSaveLanguage} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              {editingLanguageId ? t('common.update') : t('cv.languages.addButton')}
            </Button>
            {editingLanguageId && (
              <Button type="button" variant="outline" className="w-full" onClick={handleCancelLanguageEdit}>
                {t('common.cancel')}
              </Button>
            )}
          </div>
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
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEditCertification(certification)}
                      className="hover:opacity-70 transition-opacity"
                      aria-label={t('common.edit')}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleRemoveCertification(certification.id)}
                      className="text-destructive hover:text-destructive/80 transition-colors"
                      aria-label={t('common.delete')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Button onClick={handleSaveCertification} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              {editingCertificationId ? t('common.update') : 'Add Certification'}
            </Button>
            {editingCertificationId && (
              <Button type="button" variant="outline" className="w-full" onClick={handleCancelCertificationEdit}>
                {t('common.cancel')}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default LanguagesForm
