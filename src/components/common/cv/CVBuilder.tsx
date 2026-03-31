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
import { ChevronLeft, ChevronRight, Save, Download, Eye, EyeOff, LogOut, Share2 } from 'lucide-react'
import { toast } from 'sonner'
import { useI18n } from '@/contexts/I18nContext'
import LanguageSwitcher from '@/components/common/language-switcher'

const CVBuilder: React.FC = () => {
  const { cvData, currentStep, setCurrentStep, setCVData, updateCVData } = useCV()
  const { user, signOut } = useAuth()
  const { saveCV, loadCV, createShareLink } = useCVStorage()
  const [completedSteps, setCompletedSteps] = useState<CVStep[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [isDownloadingWord, setIsDownloadingWord] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const [isBootstrapping, setIsBootstrapping] = useState(true)
  const [showPreview, setShowPreview] = useState(true)
  const previewRef = useRef<HTMLDivElement>(null)
  const { t, locale } = useI18n()

  // Load CV on mount
  useEffect(() => {
    const loadUserCV = async () => {
      try {
        const savedCV = await loadCV()
        if (savedCV) {
          setCVData(savedCV)
        }
      } finally {
        setIsBootstrapping(false)
      }
    }

    if (user) {
      loadUserCV()
    } else {
      setIsBootstrapping(false)
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

  const sanitizeFileName = (value: string) => value.trim().replace(/[\\/:*?"<>|]/g, '_')

  const handleDownloadPDF = useCallback(async () => {
    if (!previewRef.current) {
      toast.error(t('cv.errors.previewUnavailable'))
      return
    }

    setIsDownloading(true)

    try {
      // Dynamic imports to avoid SSR issues
      const { jsPDF } = await import('jspdf')
      const html2canvas = await import('html2canvas')
      
      const element = previewRef.current
      const fileName = `${cvData.personalInfo.fullName || 'resume'}_CV.pdf`
      
      // Create a deep clone of the element
      const clonedElement = element.cloneNode(true) as HTMLElement
      
      // Create a temporary container with proper styling
      const tempContainer = document.createElement('div')
      tempContainer.style.position = 'absolute'
      tempContainer.style.left = '-9999px'
      tempContainer.style.top = '-9999px'
      tempContainer.style.width = '21cm'
      tempContainer.style.height = 'auto'
      tempContainer.style.display = 'block'
      tempContainer.style.backgroundColor = '#ffffff'
      
      // Create override style tag to force safe colors before html2canvas processes
      const overrideStyle = document.createElement('style')
      overrideStyle.setAttribute('data-pdf-override', 'true')
      overrideStyle.textContent = `
        * {
          background-color: #ffffff !important;
          color: #000000 !important;
          border-color: #111111 !important;
        }
      `
      clonedElement.insertBefore(overrideStyle, clonedElement.firstChild)
      
      // Reset all transform and scale styles on the cloned element
      clonedElement.style.transform = 'none'
      clonedElement.style.scale = '1'
      clonedElement.style.width = '21cm'
      clonedElement.style.minHeight = '29.7cm'
      clonedElement.style.margin = '0'
      clonedElement.style.padding = '1.5cm'
      clonedElement.style.fontFamily = 'Arial, sans-serif'
      clonedElement.style.backgroundColor = '#ffffff'
      clonedElement.style.color = '#000000'
      clonedElement.style.boxShadow = 'none'
      clonedElement.style.display = 'block'
      
      // Remove any transform from child elements
      clonedElement.querySelectorAll('*').forEach((el) => {
        if (el instanceof HTMLElement) {
          el.style.transform = 'none'
          el.style.scale = '1'
        }
      })
      
      tempContainer.appendChild(clonedElement)
      document.body.appendChild(tempContainer)
      
      try {
        // Wait for rendering and style application
        await new Promise(resolve => setTimeout(resolve, 200))
        
        // Render to canvas
        const canvas = await html2canvas.default(clonedElement, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          allowTaint: true,
          imageTimeout: 15000,
          ignoreElements: (element: Element) => {
            const tagName = element.tagName?.toLowerCase()
            return tagName === 'svg' || tagName === 'script'
          }
        })
        
        // A4 size in mm
        const A4_WIDTH = 210
        const A4_HEIGHT = 297
        const MARGIN = 5
        
        const contentWidth = A4_WIDTH - MARGIN * 2
        const contentHeight = (canvas.height * contentWidth) / canvas.width
        
        // Create PDF
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
        })
        
        // Calculate pages needed
        const pageContentHeight = A4_HEIGHT - MARGIN * 2
        let currentY = MARGIN
        let imageOffsetY = 0
        
        const imageData = canvas.toDataURL('image/jpeg', 0.98)
        let pageNum = 0
        
        while (imageOffsetY < canvas.height) {
          // Add new page (except for first iteration)
          if (pageNum > 0) {
            pdf.addPage()
            currentY = MARGIN
          }
          
          // Calculate how much of the image fits on this page
          const imageHeightForPage = (pageContentHeight / contentHeight) * canvas.height
          
          // Create temp canvas for this page section
          const pageCanvas = document.createElement('canvas')
          pageCanvas.width = canvas.width
          pageCanvas.height = Math.min(imageHeightForPage, canvas.height - imageOffsetY)
          
          const ctx = pageCanvas.getContext('2d')
          if (ctx) {
            ctx.drawImage(
              canvas,
              0, imageOffsetY,
              canvas.width, pageCanvas.height,
              0, 0,
              canvas.width, pageCanvas.height
            )
            
            const pageImageData = pageCanvas.toDataURL('image/jpeg', 0.98)
            const pageHeight = Math.min(pageContentHeight, (pageCanvas.height * contentWidth) / canvas.width)
            
            pdf.addImage(pageImageData, 'JPEG', MARGIN, currentY, contentWidth, pageHeight)
          }
          
          imageOffsetY += pageCanvas.height
          pageNum++
        }
        
        pdf.save(fileName)
        toast.success(t('cv.errors.cvDownloaded'))
      } finally {
        document.body.removeChild(tempContainer)
      }
    } catch (error: unknown) {
      console.error('PDF generation error:', error)
      const errorMessage = error instanceof Error ? error.message : t('cv.errors.unknownError')
      toast.error(`${t('cv.errors.pdfDownloadFailed')}: ${errorMessage}`)
    } finally {
      setIsDownloading(false)
    }
  }, [cvData.personalInfo.fullName, t])

  const handleDownloadWord = useCallback(async () => {
    setIsDownloadingWord(true)

    try {
      const docxModule = await import('docx')
      const fileSaverModule = await import('file-saver')

      const { Document, Packer, Paragraph, TextRun, AlignmentType } = docxModule
      const { saveAs } = fileSaverModule

      const formatDateForExport = (date: string) => {
        if (!date) return ''
        const [year, month] = date.split('-')
        const parsedYear = Number(year)
        const parsedMonth = Number(month)

        if (
          !Number.isFinite(parsedYear) ||
          !Number.isFinite(parsedMonth) ||
          parsedMonth < 1 ||
          parsedMonth > 12
        ) {
          return date
        }

        return new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric' }).format(
          new Date(parsedYear, parsedMonth - 1, 1)
        )
      }

      const toBullets = (text: string) =>
        text
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean)

      const fullName = cvData.personalInfo.fullName || t('cv.preview.yourName')
      const lines: InstanceType<typeof Paragraph>[] = [
        new Paragraph({
          children: [new TextRun({ text: fullName.toUpperCase(), bold: true, size: 36 })],
          spacing: { after: 120 },
        }),
      ]

      if (cvData.personalInfo.professionalTitle) {
        lines.push(
          new Paragraph({
            children: [
              new TextRun({
                text: cvData.personalInfo.professionalTitle.toUpperCase(),
                size: 24,
              }),
            ],
            spacing: { after: 120 },
          })
        )
      }

      const contactLine = [
        cvData.personalInfo.email,
        cvData.personalInfo.phone,
        cvData.personalInfo.address,
        cvData.personalInfo.linkedin,
        cvData.personalInfo.website,
      ]
        .filter(Boolean)
        .join(' | ')

      if (contactLine) {
        lines.push(new Paragraph({ text: contactLine, spacing: { after: 140 } }))
      }

      const pushSectionTitle = (title: string) => {
        lines.push(
          new Paragraph({
            children: [new TextRun({ text: title.toUpperCase(), bold: true, size: 24 })],
            border: {
              bottom: {
                color: '111111',
                space: 1,
                style: 'single',
                size: 6,
              },
            },
            spacing: { before: 220, after: 120 },
          })
        )
      }

      if (cvData.summary) {
        pushSectionTitle(t('cv.preview.professionalSummary'))
        lines.push(new Paragraph({ text: cvData.summary, spacing: { after: 120 } }))
      }

      if (cvData.experience.length > 0) {
        pushSectionTitle(t('cv.preview.workExperience'))

        cvData.experience.forEach((exp) => {
          const dateRange = `${formatDateForExport(exp.startDate)} - ${exp.current ? t('common.present') : formatDateForExport(exp.endDate)}`
          const expHeading = `${exp.position}${exp.company ? `, ${exp.company}` : ''}`
          lines.push(
            new Paragraph({
              children: [new TextRun({ text: expHeading, bold: true })],
              spacing: { after: 40 },
            })
          )

          lines.push(
            new Paragraph({
              children: [new TextRun({ text: dateRange, italics: true })],
              alignment: AlignmentType.RIGHT,
              spacing: { after: 40 },
            })
          )

          if (exp.description) {
            toBullets(exp.description).forEach((bullet) => {
              lines.push(
                new Paragraph({
                  text: bullet,
                  bullet: { level: 0 },
                })
              )
            })
          }
          lines.push(new Paragraph({ text: '', spacing: { after: 80 } }))
        })
      }

      if (cvData.education.length > 0) {
        pushSectionTitle(t('cv.preview.education'))

        cvData.education.forEach((edu) => {
          const title = `${edu.degree} ${t('cv.education.in')} ${edu.field}`
          const dateRange = `${formatDateForExport(edu.startDate)} - ${edu.current ? t('common.present') : formatDateForExport(edu.endDate)}`
          lines.push(new Paragraph({ children: [new TextRun({ text: title, bold: true })], spacing: { after: 40 } }))
          lines.push(new Paragraph({ text: edu.institution, spacing: { after: 40 } }))
          lines.push(
            new Paragraph({
              children: [new TextRun({ text: dateRange, italics: true })],
              alignment: AlignmentType.RIGHT,
              spacing: { after: 40 },
            })
          )
          if (edu.description) {
            toBullets(edu.description).forEach((bullet) => {
              lines.push(
                new Paragraph({
                  text: bullet,
                  bullet: { level: 0 },
                })
              )
            })
          }
          lines.push(new Paragraph({ text: '', spacing: { after: 80 } }))
        })
      }

      if (cvData.skills.length > 0) {
        pushSectionTitle(t('cv.preview.skills'))
        lines.push(new Paragraph({ text: cvData.skills.map((skill) => skill.name).join(', ') }))
      }

      const hasAdditionalInfo =
        cvData.languages.length > 0 ||
        (cvData.certifications && cvData.certifications.length > 0) ||
        (cvData.awards && cvData.awards.length > 0)

      if (hasAdditionalInfo) {
        pushSectionTitle('Additional Information')

        if (cvData.languages.length > 0) {
          lines.push(
            new Paragraph({
              children: [
                new TextRun({ text: `${t('cv.preview.languages')}: `, bold: true }),
                new TextRun({ text: cvData.languages.map((language) => language.name).join(', ') }),
              ],
              bullet: { level: 0 },
            })
          )
        }

        if (cvData.certifications && cvData.certifications.length > 0) {
          lines.push(
            new Paragraph({
              children: [
                new TextRun({ text: 'Certifications: ', bold: true }),
                new TextRun({
                  text: cvData.certifications
                    .map((cert) => [cert.name, cert.issuer, cert.date].filter(Boolean).join(' - '))
                    .join(', '),
                }),
              ],
              bullet: { level: 0 },
            })
          )
        }

        if (cvData.awards && cvData.awards.length > 0) {
          lines.push(
            new Paragraph({
              children: [
                new TextRun({ text: 'Awards/Activities: ', bold: true }),
                new TextRun({
                  text: cvData.awards
                    .map((award) => [award.name, award.description].filter(Boolean).join(' - '))
                    .join(', '),
                }),
              ],
              bullet: { level: 0 },
            })
          )
        }
      }

      const document = new Document({
        sections: [
          {
            children: lines,
          },
        ],
      })

      const blob = await Packer.toBlob(document)
      const fileName = `${sanitizeFileName(cvData.personalInfo.fullName || 'resume')}_CV.docx`
      saveAs(blob, fileName)
      toast.success(t('cv.errors.wordDownloaded'))
    } catch (error: unknown) {
      console.error('Word generation error:', error)
      const errorMessage = error instanceof Error ? error.message : t('cv.errors.unknownError')
      toast.error(`${t('cv.errors.wordDownloadFailed')}: ${errorMessage}`)
    } finally {
      setIsDownloadingWord(false)
    }
  }, [cvData, locale, t])

  const handleShareLink = useCallback(async () => {
    setIsSharing(true)

    try {
      const savedData = await saveCV(cvData)
      if (savedData) {
        updateCVData({ id: savedData.id })
      }

      const shareUrl = await createShareLink({
        ...cvData,
        id: savedData?.id ?? cvData.id,
        userId: user?.id,
      })

      if (!shareUrl) {
        toast.error(t('cv.errors.shareLinkFailed'))
        return
      }

      try {
        await navigator.clipboard.writeText(shareUrl)
        toast.success(t('cv.errors.linkCopied'))
      } catch {
        toast.success(`${t('cv.errors.shareLinkCreated')}: ${shareUrl}`)
        toast.error(t('cv.errors.linkCopyFailed'))
      }
    } catch (error) {
      console.error('Share link error:', error)
      toast.error(t('cv.errors.shareLinkFailed'))
    } finally {
      setIsSharing(false)
    }
  }, [createShareLink, cvData, saveCV, t, updateCVData, user?.id])

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

  if (isBootstrapping) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-muted-foreground">{t('common.loadingCv')}</p>
      </div>
    )
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
          <div className="ml-4 flex items-center gap-2">
            <LanguageSwitcher />
            <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
              {t('common.logout')}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form Section */}
          <div className="flex-1 lg:max-w-xl">
            {renderForm()}

            {/* Navigation Buttons */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                disabled={currentStepIndex === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                {t('common.previous')}
              </Button>

              <Button variant="outline" size="sm" onClick={handleSave} disabled={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? t('common.saving') : t('common.save')}
              </Button>

              <Button variant="outline" size="sm" onClick={handleDownloadPDF} disabled={isDownloading}>
                <Download className="w-4 h-4 mr-2" />
                {isDownloading ? t('common.generatingPdf') : t('common.downloadPdf')}
              </Button>

              <Button variant="outline" size="sm" onClick={handleDownloadWord} disabled={isDownloadingWord}>
                <Download className="w-4 h-4 mr-2" />
                {isDownloadingWord ? t('common.generatingWord') : t('common.downloadWord')}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleShareLink}
                disabled={isSharing}
              >
                <Share2 className="w-4 h-4 mr-2" />
                {isSharing ? t('common.creatingLink') : t('common.shareLink')}
              </Button>

              <Button
                size="sm"
                onClick={handleNext}
                disabled={currentStepIndex === cvSteps.length - 1}
                className="ml-auto"
              >
                {t('common.next')}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {/* Mobile Preview Toggle */}
            <Button
              variant="ghost"
              onClick={() => setShowPreview(!showPreview)}
              className="w-full mt-2 lg:hidden"
            >
              {showPreview ? (
                <>
                  <EyeOff className="w-4 h-4 mr-2" />
                  {t('common.hidePreview')}
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  {t('common.showPreview')}
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
                {t('common.livePreview')}
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
