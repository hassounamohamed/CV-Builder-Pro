"use client"

import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useCV } from '@/contexts/CVContext'
import { useAuth } from '@/contexts/AuthContext'
import { useCVStorage } from '@/hooks/useCVStorage'
import { cvSteps, CVStep } from '@/types/cv'
import StepIndicator from './StepIndicator'
import PersonalInfoForm from './forms/PersonalInfoForm'
import SummaryForm from './forms/SummaryForm'
import ExperienceForm from './forms/ExperienceForm'
import EducationForm from './forms/EducationForm'
import SkillsForm from './forms/SkillsForm'
import LanguagesForm from './forms/LanguagesForm'
import CVPreview from './CVPreview'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Save, Download, Eye, EyeOff, LogOut } from 'lucide-react'
import { toast } from 'sonner'

const CVBuilder: React.FC = () => {
  const { cvData, currentStep, setCurrentStep, setCVData, updateCVData } = useCV()
  const { user, signOut } = useAuth()
  const { saveCV, loadCV } = useCVStorage()
  const [completedSteps, setCompletedSteps] = useState<CVStep[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [showPreview, setShowPreview] = useState(true)
  const previewRef = useRef<HTMLDivElement>(null)

  // Load CV on mount
  useEffect(() => {
    const loadUserCV = async () => {
      const savedCV = await loadCV()
      if (savedCV) {
        setCVData(savedCV)
      }
    }
    if (user) {
      loadUserCV()
    }
  }, [user, loadCV, setCVData])

  const currentStepIndex = cvSteps.findIndex((s) => s.id === currentStep)

  const handleStepClick = (step: CVStep) => {
    setCurrentStep(step)
  }

  const handleNext = () => {
    if (currentStepIndex < cvSteps.length - 1) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep])
      }
      setCurrentStep(cvSteps[currentStepIndex + 1].id)
    }
  }

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(cvSteps[currentStepIndex - 1].id)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    const savedData = await saveCV(cvData)
    if (savedData) {
      updateCVData({ id: savedData.id })
    }
    setIsSaving(false)
  }

  const handleLogout = async () => {
    await signOut()
    window.location.href = '/'
  }

  const handleDownloadPDF = useCallback(async () => {
    if (!previewRef.current) {
      toast.error('Preview not available')
      return
    }

    setIsDownloading(true)

    try {
      // Dynamic import to avoid SSR issues
      const html2pdfModule = await import('html2pdf.js')
      const html2pdf = html2pdfModule.default || html2pdfModule
      
      const element = previewRef.current
      
      // Clone the element to avoid modifying the original
      const clonedElement = element.cloneNode(true) as HTMLElement
      
      // Remove all class attributes to avoid Tailwind CSS
      const removeClasses = (el: HTMLElement) => {
        el.removeAttribute('class')
        Array.from(el.children).forEach(child => removeClasses(child as HTMLElement))
      }
      removeClasses(clonedElement)
      
      const opt = {
        margin: 0,
        filename: `cv_${cvData.personalInfo.fullName || 'resume'}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          ignoreElements: (element: any) => {
            return element.tagName === 'STYLE' || element.tagName === 'LINK'
          }
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait' as const,
        },
      }

      console.log('Generating PDF...')
      await html2pdf().set(opt).from(clonedElement).save()

      toast.success('Your CV has been downloaded!')
    } catch (error: any) {
      console.error('PDF generation error:', error)
      toast.error(`PDF download failed: ${error.message || 'Unknown error'}`)
    } finally {
      setIsDownloading(false)
    }
  }, [cvData.personalInfo.fullName])

  const renderForm = () => {
    switch (currentStep) {
      case 'personal':
        return <PersonalInfoForm />
      case 'summary':
        return <SummaryForm />
      case 'experience':
        return <ExperienceForm />
      case 'education':
        return <EducationForm />
      case 'skills':
        return <SkillsForm />
      case 'languages':
        return <LanguagesForm />
      default:
        return <PersonalInfoForm />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Logout */}
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex-1">
            <StepIndicator
              currentStep={currentStep}
              onStepClick={handleStepClick}
              completedSteps={completedSteps}
            />
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="ml-4">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form Section */}
          <div className="flex-1 lg:max-w-xl">
            {renderForm()}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-6 gap-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStepIndex === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              <div className="flex gap-2">
                <Button variant="outline" onClick={handleSave} disabled={isSaving}>
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>

                <Button
                  variant="outline"
                  onClick={handleDownloadPDF}
                  disabled={isDownloading}
                  className="hidden sm:flex"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isDownloading ? 'Generating...' : 'Download PDF'}
                </Button>
              </div>

              <Button
                onClick={handleNext}
                disabled={currentStepIndex === cvSteps.length - 1}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {/* Mobile Download Button */}
            <Button
              variant="default"
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="w-full mt-4 sm:hidden"
            >
              <Download className="w-4 h-4 mr-2" />
              {isDownloading ? 'Generating PDF...' : 'Download PDF'}
            </Button>

            {/* Mobile Preview Toggle */}
            <Button
              variant="ghost"
              onClick={() => setShowPreview(!showPreview)}
              className="w-full mt-2 lg:hidden"
            >
              {showPreview ? (
                <>
                  <EyeOff className="w-4 h-4 mr-2" />
                  Hide Preview
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Show Preview
                </>
              )}
            </Button>
          </div>

          {/* Preview Section */}
          <div
            className={`flex-1 lg:sticky lg:top-24 lg:self-start ${
              showPreview ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="bg-muted p-4 rounded-xl overflow-auto max-h-[calc(100vh-200px)]">
              <h3 className="text-sm font-medium text-muted-foreground mb-4 text-center">
                Live Preview
              </h3>
              <div className="flex justify-center">
                <div className="transform scale-[0.5] origin-top lg:scale-[0.6] xl:scale-[0.7]">
                  <CVPreview ref={previewRef} cvData={cvData} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CVBuilder
