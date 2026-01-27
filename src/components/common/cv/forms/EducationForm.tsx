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
import { Education } from '@/types/cv'

const EducationForm: React.FC = () => {
  const { cvData, updateCVData } = useCV()
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

  const handleAdd = () => {
    if (currentEdu.institution && currentEdu.degree && currentEdu.field && currentEdu.startDate) {
      const newEdu: Education = {
        id: Date.now().toString(),
        institution: currentEdu.institution,
        degree: currentEdu.degree,
        field: currentEdu.field,
        startDate: currentEdu.startDate,
        endDate: currentEdu.current ? 'Present' : currentEdu.endDate || '',
        current: currentEdu.current || false,
        description: currentEdu.description,
      }

      updateCVData({
        education: [...cvData.education, newEdu],
      })

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
  }

  const handleRemove = (id: string) => {
    updateCVData({
      education: cvData.education.filter((edu) => edu.id !== id),
    })
  }

  return (
    <Card className="animate-fadeIn">
      <CardHeader>
        <CardTitle>Education</CardTitle>
        <CardDescription>Add your educational background</CardDescription>
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
                  <h4 className="font-semibold">{edu.degree} in {edu.field}</h4>
                  <p className="text-sm text-muted-foreground">{edu.institution}</p>
                  <p className="text-xs text-muted-foreground">
                    {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemove(edu.id)}
                  className="text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Add New Education Form */}
        <div className="space-y-4 pt-4 border-t">
          <h4 className="font-medium">Add New Education</h4>

          <div className="space-y-2">
            <Label htmlFor="institution">Institution</Label>
            <Input
              id="institution"
              placeholder="University Name"
              value={currentEdu.institution || ''}
              onChange={(e) => setCurrentEdu({ ...currentEdu, institution: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="degree">Degree</Label>
              <Input
                id="degree"
                placeholder="Bachelor's, Master's, PhD..."
                value={currentEdu.degree || ''}
                onChange={(e) => setCurrentEdu({ ...currentEdu, degree: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="field">Field of Study</Label>
              <Input
                id="field"
                placeholder="Computer Science, Business..."
                value={currentEdu.field || ''}
                onChange={(e) => setCurrentEdu({ ...currentEdu, field: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="eduStartDate">Start Date</Label>
              <Input
                id="eduStartDate"
                type="month"
                value={currentEdu.startDate || ''}
                onChange={(e) => setCurrentEdu({ ...currentEdu, startDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="eduEndDate">End Date</Label>
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
              I currently study here
            </label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="eduDescription">Description (Optional)</Label>
            <Textarea
              id="eduDescription"
              placeholder="Relevant coursework, achievements, GPA..."
              value={currentEdu.description || ''}
              onChange={(e) => setCurrentEdu({ ...currentEdu, description: e.target.value })}
              className="min-h-[80px]"
            />
          </div>

          <Button onClick={handleAdd} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Education
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default EducationForm
