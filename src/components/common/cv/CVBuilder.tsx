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
import ProjectsForm from './forms/ProjectsForm'
import EducationForm from './forms/EducationForm'
import SkillsForm from './forms/SkillsForm'
import LanguagesForm from './forms/LanguagesForm'
import CVPreview from './CVPreview'
import FeedbackModal from './FeedbackModal'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Save, Download, Eye, EyeOff, LogOut, Share2, CheckCheck } from 'lucide-react'
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
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
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
    } else {
      // Last step — mark complete and show feedback modal
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep])
      }
      setShowFeedbackModal(true)
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
      const { jsPDF } = await import('jspdf')
      const html2canvas = await import('html2canvas')

      const element = previewRef.current
      const fileName = `${sanitizeFileName(cvData.personalInfo.fullName || 'resume')}_CV.pdf`

      // ── Step 1: Capture computed (rgb) colors from the live DOM ─────────────
      // Browser's getComputedStyle resolves oklch/lab → rgb automatically.
      // We must do this NOW, while elements are in the real document.
      const COLOR_PROPS = [
        'color', 'backgroundColor',
        'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor',
        'outlineColor', 'textDecorationColor',
      ]
      const liveEls = [element, ...Array.from(element.querySelectorAll<HTMLElement>('*'))]
      const capturedColors = liveEls.map((el) => {
        const cs = window.getComputedStyle(el)
        const map: Record<string, string> = {}
        for (const p of COLOR_PROPS) {
          const v = cs.getPropertyValue(p)
          if (v && v !== 'initial' && v !== 'inherit') map[p] = v
        }
        return map
      })

      // ── Step 2: Build a clean offscreen clone at full A4 width ──────────────
      // The live CVPreview is inside a `scale(0.5)` wrapper for UI display.
      // If we pass the live element to html2canvas, the scale transform causes
      // text to overlap. Instead we clone it into an isolated container that
      // has NO parent transforms, so layout is fully re-computed at full size.
      const clone = element.cloneNode(true) as HTMLElement

      // Override every CSS custom property to safe hex (avoids oklch parse errors)
      const safeVarsStyle = document.createElement('style')
      safeVarsStyle.textContent = `
        *, :root {
          --background: #ffffff; --foreground: #252525;
          --card: #ffffff; --card-foreground: #252525;
          --popover: #ffffff; --popover-foreground: #252525;
          --primary: #333333; --primary-foreground: #fafafa;
          --secondary: #f7f7f7; --secondary-foreground: #333333;
          --muted: #f7f7f7; --muted-foreground: #717171;
          --accent: #f7f7f7; --accent-foreground: #333333;
          --destructive: #dc2626;
          --border: #e9e9e9; --input: #e9e9e9; --ring: #b3b3b3;
        }
      `
      clone.prepend(safeVarsStyle)

      // Reset clone layout: full A4 width, no scale, no shadow
      clone.style.cssText = `
        width: 794px !important;
        min-height: auto !important;
        padding: 56px !important;
        margin: 0 !important;
        transform: none !important;
        scale: 1 !important;
        font-family: Arial, sans-serif !important;
        background-color: #ffffff !important;
        color: #111111 !important;
        box-shadow: none !important;
        box-sizing: border-box !important;
        overflow: visible !important;
        position: static !important;
      `

      // Inline the rgb() colors we captured + reset transforms on every child
      const cloneEls = Array.from(clone.querySelectorAll<HTMLElement>('*'))
      cloneEls.forEach((el, i) => {
        el.style.transform = 'none'
        el.style.animation = 'none'
        el.style.transition = 'none'
        // i+1 because capturedColors[0] = root element (clone itself)
        const map = capturedColors[i + 1]
        if (map) {
          for (const [prop, val] of Object.entries(map)) {
            ;(el.style as unknown as Record<string, string>)[prop] = val
          }
        }
      })
      // Apply root colors too
      if (capturedColors[0]) {
        for (const [prop, val] of Object.entries(capturedColors[0])) {
          ;(clone.style as unknown as Record<string, string>)[prop] = val
        }
      }

      // Mount offscreen — must be in DOM for html2canvas to measure layout
      const wrapper = document.createElement('div')
      wrapper.style.cssText = `
        position: fixed; left: -9999px; top: 0;
        width: 794px; height: auto; overflow: visible;
        background: #ffffff; z-index: -9999;
        transform: none !important;
      `
      wrapper.appendChild(clone)
      document.body.appendChild(wrapper)

      try {
        // Let the browser fully paint the cloned layout
        await new Promise((r) => setTimeout(r, 350))

        const canvas = await html2canvas.default(clone, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          allowTaint: true,
          imageTimeout: 15000,
          // onclone safety net: override CSS vars again in h2c's own clone doc
          onclone: (doc: Document) => {
            const s = doc.createElement('style')
            s.textContent = `
              *, :root {
                --background:#ffffff; --foreground:#252525;
                --card:#ffffff; --card-foreground:#252525;
                --secondary:#f7f7f7; --secondary-foreground:#333333;
                --muted:#f7f7f7; --muted-foreground:#717171;
                --accent:#f7f7f7; --accent-foreground:#333333;
                --destructive:#dc2626;
                --border:#e9e9e9; --input:#e9e9e9; --ring:#b3b3b3;
              }
            `
            doc.head.appendChild(s)
          },
        })

        // ── Step 3: Smart page break detection + build PDF ────────────────────
        // Instead of slicing at a fixed A4 height (which cuts through text),
        // we scan pixel rows near each potential cut point and find the row
        // with the most white/near-white pixels — i.e. a gap between sections.
        const A4_W = 210
        const A4_H = 297
        const MARGIN = 5
        const contentWidth = A4_W - MARGIN * 2
        const contentHeight = (canvas.height * contentWidth) / canvas.width

        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
        })

        // How many canvas pixels correspond to one A4 page of content
        const pageContentHeight = A4_H - MARGIN * 2
        const pageHeightInPx = Math.floor((pageContentHeight / contentHeight) * canvas.height)

        // Read the full canvas pixel data once (avoid repeated reads)
        const fullCtx = document.createElement('canvas')
        fullCtx.width = canvas.width
        fullCtx.height = canvas.height
        const fullCtx2d = fullCtx.getContext('2d')!
        fullCtx2d.drawImage(canvas, 0, 0)
        const pixelData = fullCtx2d.getImageData(0, 0, canvas.width, canvas.height).data

        // Counts how many "white-ish" pixels are in a given row
        const whitenessOfRow = (row: number): number => {
          let count = 0
          const rowStart = row * canvas.width * 4
          for (let x = 0; x < canvas.width; x++) {
            const i = rowStart + x * 4
            const r = pixelData[i], g = pixelData[i + 1], b = pixelData[i + 2]
            if (r > 240 && g > 240 && b > 240) count++
          }
          return count
        }

        // Find the best (whitest) row within a search window around `targetRow`
        const findBestBreak = (targetRow: number): number => {
          const window = Math.floor(pageHeightInPx * 0.08) // ±8% of page height
          const lo = Math.max(0, targetRow - window)
          const hi = Math.min(canvas.height - 1, targetRow + window)
          let bestRow = targetRow
          let bestScore = -1
          for (let row = lo; row <= hi; row++) {
            const score = whitenessOfRow(row)
            if (score > bestScore) { bestScore = score; bestRow = row }
          }
          return bestRow
        }

        let imageOffsetY = 0
        let pageNum = 0

        while (imageOffsetY < canvas.height) {
          if (pageNum > 0) pdf.addPage()

          const nominalEnd = imageOffsetY + pageHeightInPx
          // For last page or if there's little content left, don't search
          const cutRow = nominalEnd >= canvas.height
            ? canvas.height
            : findBestBreak(nominalEnd)

          const sliceHeight = cutRow - imageOffsetY
          const pageCanvas = document.createElement('canvas')
          pageCanvas.width = canvas.width
          pageCanvas.height = Math.max(1, sliceHeight)

          const ctx = pageCanvas.getContext('2d')!
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height)
          ctx.drawImage(canvas, 0, imageOffsetY, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight)

          const pageImageData = pageCanvas.toDataURL('image/jpeg', 0.95)
          const pageHeight = (sliceHeight * contentWidth) / canvas.width
          pdf.addImage(pageImageData, 'JPEG', MARGIN, MARGIN, contentWidth, pageHeight)

          imageOffsetY = cutRow
          pageNum++
        }

        pdf.save(fileName)
        toast.success(t('cv.errors.cvDownloaded'))
        // Show feedback modal after successful download
        setShowFeedbackModal(true)
      } finally {
        // Always clean up the offscreen wrapper
        document.body.removeChild(wrapper)
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

      if (cvData.projects.length > 0) {
        pushSectionTitle(t('cv.preview.projects'))

        cvData.projects.forEach((project) => {
          const hasDates = project.startDate || project.endDate || project.current
          const dateRange = hasDates
            ? `${formatDateForExport(project.startDate || '')} - ${project.current ? t('common.present') : formatDateForExport(project.endDate || '')}`
            : ''
          const title = project.role ? `${project.name} (${project.role})` : project.name

          lines.push(
            new Paragraph({
              children: [new TextRun({ text: title, bold: true })],
              spacing: { after: 40 },
            })
          )

          if (dateRange) {
            lines.push(
              new Paragraph({
                children: [new TextRun({ text: dateRange, italics: true })],
                alignment: AlignmentType.RIGHT,
                spacing: { after: 40 },
              })
            )
          }

          if (project.technologies) {
            lines.push(
              new Paragraph({
                children: [
                  new TextRun({ text: `${t('cv.projects.technologies')}: `, bold: true }),
                  new TextRun({ text: project.technologies }),
                ],
                spacing: { after: 40 },
              })
            )
          }

          if (project.link) {
            lines.push(
              new Paragraph({
                children: [
                  new TextRun({ text: `${t('cv.projects.link')}: `, bold: true }),
                  new TextRun({ text: project.link }),
                ],
                spacing: { after: 40 },
              })
            )
          }

          if (project.description) {
            toBullets(project.description).forEach((bullet) => {
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
      // Show feedback modal after successful download
      setShowFeedbackModal(true)
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
      case 'projects':
        return <ProjectsForm />
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
    <>
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
                className="ml-auto"
                id={currentStepIndex === cvSteps.length - 1 ? 'cv-finish-btn' : 'cv-next-btn'}
              >
                {currentStepIndex === cvSteps.length - 1 ? (
                  <>
                    <CheckCheck className="w-4 h-4 mr-2" />
                    Finish
                  </>
                ) : (
                  <>
                    {t('common.next')}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </>
                )}
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

    {/* Feedback Modal */}
    {showFeedbackModal && (
      <FeedbackModal
        defaultName={cvData.personalInfo.fullName}
        onClose={() => setShowFeedbackModal(false)}
      />
    )}
    </>
  )
}

export default CVBuilder
