"use client"

import React from 'react'
import { useCV } from '@/contexts/CVContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const PersonalInfoForm: React.FC = () => {
  const { cvData, updateCVData } = useCV()

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
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>
          Enter your basic contact information and professional details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            placeholder="John Doe"
            value={cvData.personalInfo.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
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
          <Label htmlFor="phone">Phone *</Label>
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
          <Label htmlFor="address">Address *</Label>
          <Input
            id="address"
            placeholder="123 Main St, City, Country"
            value={cvData.personalInfo.address}
            onChange={(e) => handleChange('address', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="linkedin">LinkedIn (Optional)</Label>
          <Input
            id="linkedin"
            placeholder="linkedin.com/in/johndoe"
            value={cvData.personalInfo.linkedin || ''}
            onChange={(e) => handleChange('linkedin', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website (Optional)</Label>
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
