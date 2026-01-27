"use client"

import React, { useState } from 'react'
import { useCV } from '@/contexts/CVContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'
import { Skill } from '@/types/cv'

const SkillsForm: React.FC = () => {
  const { cvData, updateCVData } = useCV()
  const [currentSkill, setCurrentSkill] = useState<Partial<Skill>>({
    id: '',
    name: '',
  })

  const handleAdd = () => {
    if (currentSkill.name) {
      const newSkill: Skill = {
        id: Date.now().toString(),
        name: currentSkill.name,
      }

      updateCVData({
        skills: [...cvData.skills, newSkill],
      })

      setCurrentSkill({
        id: '',
        name: '',
      })
    }
  }

  const handleRemove = (id: string) => {
    updateCVData({
      skills: cvData.skills.filter((skill) => skill.id !== id),
    })
  }

  return (
    <Card className="animate-fadeIn">
      <CardHeader>
        <CardTitle>Skills</CardTitle>
        <CardDescription>Add your technical and soft skills</CardDescription>
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
                  onClick={() => handleRemove(skill.id)}
                  className="hover:opacity-70 transition-opacity"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add New Skill Form */}
        <div className="space-y-4 pt-4 border-t">
          <h4 className="font-medium">Add New Skill</h4>

          <div className="space-y-2">
            <Label htmlFor="skillName">Skill Name</Label>
            <Input
              id="skillName"
              placeholder="e.g., JavaScript, Leadership..."
              value={currentSkill.name || ''}
              onChange={(e) => setCurrentSkill({ ...currentSkill, name: e.target.value })}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAdd()
                }
              }}
            />
          </div>

          <Button onClick={handleAdd} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Skill
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default SkillsForm
