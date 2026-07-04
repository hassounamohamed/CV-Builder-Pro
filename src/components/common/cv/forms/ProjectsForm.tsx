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
import { Project } from '@/types/cv'
import { useI18n } from '@/contexts/I18nContext'
import { useAI } from '@/hooks/useAI'

const ProjectsForm: React.FC = () => {
  const { cvData, updateCVData } = useCV()
  const { t } = useI18n()
  const { improve, isLoading } = useAI()
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null)
  const [currentProject, setCurrentProject] = useState<Partial<Project>>({
    id: '',
    name: '',
    role: '',
    technologies: '',
    link: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
  })

  const resetCurrentProject = () => {
    setCurrentProject({
      id: '',
      name: '',
      role: '',
      technologies: '',
      link: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    })
  }

  const handleSave = () => {
    if (currentProject.name) {
      const newProject: Project = {
        id: editingProjectId || Date.now().toString(),
        name: currentProject.name,
        role: currentProject.role || '',
        technologies: currentProject.technologies || '',
        link: currentProject.link || '',
        startDate: currentProject.startDate || '',
        endDate: currentProject.endDate || '',
        current: currentProject.current || false,
        description: currentProject.description || '',
      }

      if (editingProjectId) {
        updateCVData({
          projects: cvData.projects.map((project) =>
            project.id === editingProjectId ? newProject : project
          ),
        })
      } else {
        updateCVData({
          projects: [...cvData.projects, newProject],
        })
      }

      setEditingProjectId(null)
      resetCurrentProject()
    }
  }

  const handleEdit = (project: Project) => {
    setCurrentProject({ ...project })
    setEditingProjectId(project.id)
  }

  const handleCancelEdit = () => {
    setEditingProjectId(null)
    resetCurrentProject()
  }

  const handleRemove = (id: string) => {
    updateCVData({
      projects: cvData.projects.filter((project) => project.id !== id),
    })
  }

  const handleImproveDescription = async () => {
    const description = currentProject.description || ''
    const result = await improve({ type: 'improve-experience', content: description })
    if (result) {
      setCurrentProject({ ...currentProject, description: result })
    }
  }

  const handleGrammarDescription = async () => {
    const description = currentProject.description || ''
    const result = await improve({ type: 'check-grammar', content: description })
    if (result) {
      setCurrentProject({ ...currentProject, description: result })
    }
  }

  return (
    <Card className="animate-fadeIn">
      <CardHeader>
        <CardTitle>{t('cv.projects.title')}</CardTitle>
        <CardDescription>{t('cv.projects.description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {cvData.projects.length > 0 && (
          <div className="space-y-3">
            {cvData.projects.map((project) => (
              <div
                key={project.id}
                className="p-4 border rounded-lg bg-muted/50 flex justify-between items-start"
              >
                <div className="flex-1">
                  <h4 className="font-semibold">{project.name}</h4>
                  {project.role && <p className="text-sm text-muted-foreground">{project.role}</p>}
                  {(project.startDate || project.endDate || project.current) && (
                    <p className="text-xs text-muted-foreground">
                      {project.startDate || t('common.present')} - {project.current ? t('common.present') : project.endDate}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(project)}
                    aria-label={t('common.edit')}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemove(project.id)}
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

        <div className="space-y-4 pt-4 border-t">
          <h4 className="font-medium">{t('cv.projects.addTitle')}</h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="projectName">{t('cv.projects.name')}</Label>
              <Input
                id="projectName"
                placeholder={t('cv.projects.namePlaceholder')}
                value={currentProject.name || ''}
                onChange={(e) => setCurrentProject({ ...currentProject, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectRole">{t('cv.projects.role')}</Label>
              <Input
                id="projectRole"
                placeholder={t('cv.projects.rolePlaceholder')}
                value={currentProject.role || ''}
                onChange={(e) => setCurrentProject({ ...currentProject, role: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectTechnologies">{t('cv.projects.technologies')}</Label>
            <Input
              id="projectTechnologies"
              placeholder={t('cv.projects.technologiesPlaceholder')}
              value={currentProject.technologies || ''}
              onChange={(e) => setCurrentProject({ ...currentProject, technologies: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectLink">{t('cv.projects.link')}</Label>
            <Input
              id="projectLink"
              placeholder={t('cv.projects.linkPlaceholder')}
              value={currentProject.link || ''}
              onChange={(e) => setCurrentProject({ ...currentProject, link: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="projectStartDate">{t('cv.projects.startDate')}</Label>
              <Input
                id="projectStartDate"
                type="month"
                value={currentProject.startDate || ''}
                onChange={(e) => setCurrentProject({ ...currentProject, startDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectEndDate">{t('cv.projects.endDate')}</Label>
              <Input
                id="projectEndDate"
                type="month"
                value={currentProject.endDate || ''}
                onChange={(e) => setCurrentProject({ ...currentProject, endDate: e.target.value })}
                disabled={currentProject.current}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="currentProject"
              checked={currentProject.current}
              onCheckedChange={(checked) =>
                setCurrentProject({ ...currentProject, current: checked as boolean })
              }
            />
            <label htmlFor="currentProject" className="text-sm">
              {t('cv.projects.currentProject')}
            </label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectDescription">{t('cv.projects.descriptionLabel')}</Label>
            <Textarea
              id="projectDescription"
              placeholder={t('cv.projects.descriptionPlaceholder')}
              value={currentProject.description || ''}
              onChange={(e) => setCurrentProject({ ...currentProject, description: e.target.value })}
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
              {editingProjectId ? t('common.update') : t('cv.projects.addButton')}
            </Button>
            {editingProjectId && (
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

export default ProjectsForm
