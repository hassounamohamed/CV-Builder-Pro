"use client"

import React, { useState } from 'react'
import { useCV } from '@/contexts/CVContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Pencil } from 'lucide-react'
import { Skill } from '@/types/cv'
import { useI18n } from '@/contexts/I18nContext'

const SkillsForm: React.FC = () => {
  const { cvData, updateCVData } = useCV()
  const { t } = useI18n()
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null)
  const [currentSkill, setCurrentSkill] = useState<Partial<Skill>>({
    id: '',
    name: '',
  })

  const resetCurrentSkill = () => {
    setCurrentSkill({
      id: '',
      name: '',
    })
  }

  const handleSave = () => {
    if (currentSkill.name) {
      const newSkill: Skill = {
        id: editingSkillId || Date.now().toString(),
        name: currentSkill.name,
      }

      if (editingSkillId) {
        updateCVData({
          skills: cvData.skills.map((skill) =>
            skill.id === editingSkillId ? newSkill : skill
          ),
        })
      } else {
        updateCVData({
          skills: [...cvData.skills, newSkill],
        })
      }

      setEditingSkillId(null)
      resetCurrentSkill()
    }
  }

  const handleEdit = (skill: Skill) => {
    setCurrentSkill({ ...skill })
    setEditingSkillId(skill.id)
  }

  const handleCancelEdit = () => {
    setEditingSkillId(null)
    resetCurrentSkill()
  }

  const handleRemove = (id: string) => {
    updateCVData({
      skills: cvData.skills.filter((skill) => skill.id !== id),
    })
  }

  return (
    <Card className="animate-fadeIn">
      <CardHeader>
        <CardTitle>{t('cv.skills.title')}</CardTitle>
        <CardDescription>{t('cv.skills.description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Added Skills */}
        {cvData.skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {cvData.skills.map((skill) => (
              <div
                key={skill.id}
                className="px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 border border-gray-300 dark:border-gray-600"
              >
                <span>{skill.name}</span>
                <button
                  onClick={() => handleEdit(skill)}
                  className="hover:opacity-70 transition-opacity"
                  aria-label={t('common.edit')}
                >
                  <Pencil className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleRemove(skill.id)}
                  className="text-destructive hover:text-destructive/80 transition-colors"
                  aria-label={t('common.delete')}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add New Skill Form */}
        <div className="space-y-4 pt-4 border-t">
          <h4 className="font-medium">{t('cv.skills.addTitle')}</h4>

          <div className="space-y-2">
            <Label htmlFor="skillName">{t('cv.skills.name')}</Label>
            <Input
              id="skillName"
              placeholder={t('cv.skills.placeholder')}
              value={currentSkill.name || ''}
              onChange={(e) => setCurrentSkill({ ...currentSkill, name: e.target.value })}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSave()
                }
              }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Button onClick={handleSave} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              {editingSkillId ? t('common.update') : t('cv.skills.addButton')}
            </Button>
            {editingSkillId && (
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

export default SkillsForm
