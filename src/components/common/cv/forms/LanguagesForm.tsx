"use client"

import React, { useState } from 'react'
import { useCV } from '@/contexts/CVContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'
import { Language } from '@/types/cv'

const LanguagesForm: React.FC = () => {
  const { cvData, updateCVData } = useCV()
  const [currentLanguage, setCurrentLanguage] = useState<Partial<Language>>({
    id: '',
    name: '',
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

  return (
    <Card className="animate-fadeIn">
      <CardHeader>
        <CardTitle>Languages</CardTitle>
        <CardDescription>Add the languages you speak</CardDescription>
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
          <h4 className="font-medium">Add New Language</h4>

          <div className="space-y-2">
            <Label htmlFor="languageName">Language</Label>
            <Input
              id="languageName"
              placeholder="e.g., English, French..."
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
            Add Language
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default LanguagesForm
