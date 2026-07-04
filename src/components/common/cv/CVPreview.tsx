"use client"

import React, { forwardRef } from 'react'
import { CVData } from '@/types/cv'
import { useI18n } from '@/contexts/I18nContext'

interface CVPreviewProps {
  cvData: CVData
}

const CVPreview = forwardRef<HTMLDivElement, CVPreviewProps>(({ cvData }, ref) => {
  const { t, locale, dir } = useI18n()

  const formatDate = (date: string) => {
    if (!date) return ''
    const [year, month] = date.split('-')
    const parsedYear = Number(year)
    const parsedMonth = Number(month)

    if (!Number.isFinite(parsedYear) || !Number.isFinite(parsedMonth) || parsedMonth < 1 || parsedMonth > 12) {
      return date
    }

    const dateObject = new Date(parsedYear, parsedMonth - 1, 1)
    return new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric' }).format(dateObject)
  }

  const toBullets = (text: string) =>
    text
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)

  const contactLine = [
    cvData.personalInfo.email,
    cvData.personalInfo.phone,
    cvData.personalInfo.address,
    cvData.personalInfo.linkedin,
    cvData.personalInfo.website,
  ]
    .filter(Boolean)
    .join(' | ')

  const hasAdditionalInfo =
    cvData.languages.length > 0 ||
    (cvData.certifications && cvData.certifications.length > 0) ||
    (cvData.awards && cvData.awards.length > 0)

  return (
    <div
      ref={ref}
      style={{ 
        width: '21cm',
        minHeight: '29.7cm',
        padding: '1.5cm',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#ffffff',
        color: '#000000',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        margin: '0 auto',
        boxSizing: 'border-box',
        overflow: 'hidden',
        direction: dir
      }}
    >
      <div style={{ marginBottom: '1.25rem' }}>
        <h1 style={{ color: '#000000', fontSize: '2rem', fontWeight: '700', margin: '0 0 0.35rem 0', textTransform: 'uppercase', letterSpacing: '0.01em' }}>
          {cvData.personalInfo.fullName || t('cv.preview.yourName')}
        </h1>
        {cvData.personalInfo.professionalTitle && (
          <p style={{ color: '#111111', fontSize: '1.1rem', fontWeight: '500', margin: '0 0 0.45rem 0', textTransform: 'uppercase' }}>
            {cvData.personalInfo.professionalTitle}
          </p>
        )}
        {contactLine && (
          <div style={{ fontSize: '0.9rem', color: '#111111', lineHeight: '1.4', marginBottom: '0.5rem' }}>
            {contactLine}
          </div>
        )}
      </div>

      {cvData.summary && (
        <div style={{ marginBottom: '1rem', pageBreakInside: 'avoid' }}>
          <h2 style={{ color: '#000000', fontSize: '1.05rem', fontWeight: '700', textTransform: 'uppercase', margin: '0 0 0.45rem 0', borderBottom: '1px solid #111111', paddingBottom: '0.22rem' }}>
            {t('cv.preview.professionalSummary')}
          </h2>
          <p style={{ color: '#111111', lineHeight: '1.45', fontSize: '0.96rem', margin: '0' }}>{cvData.summary}</p>
        </div>
      )}

      {cvData.experience.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <h2 style={{ color: '#000000', fontSize: '1.05rem', fontWeight: '700', textTransform: 'uppercase', margin: '0 0 0.45rem 0', borderBottom: '1px solid #111111', paddingBottom: '0.22rem' }}>
            {t('cv.preview.workExperience')}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
            {cvData.experience.map((exp) => (
              <div key={exp.id} style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.2rem', gap: '0.8rem' }}>
                  <h3 style={{ color: '#000000', fontSize: '1rem', fontWeight: '700', margin: '0' }}>
                    {exp.position}{exp.company ? `, ${exp.company}` : ''}
                  </h3>
                  <span style={{ color: '#333333', fontSize: '0.9rem', whiteSpace: 'nowrap', flexShrink: 0, fontStyle: 'italic' }}>
                    {formatDate(exp.startDate)} - {exp.current ? t('common.present') : formatDate(exp.endDate)}
                  </span>
                </div>
                {toBullets(exp.description).length > 0 && (
                  <ul style={{ margin: '0.2rem 0 0 1rem', padding: 0, color: '#111111', fontSize: '0.94rem', lineHeight: '1.35' }}>
                    {toBullets(exp.description).map((line, idx) => (
                      <li key={`${exp.id}-${idx}`} style={{ marginBottom: '0.12rem' }}>
                        {line}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {cvData.projects.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <h2 style={{ color: '#000000', fontSize: '1.05rem', fontWeight: '700', textTransform: 'uppercase', margin: '0 0 0.45rem 0', borderBottom: '1px solid #111111', paddingBottom: '0.22rem' }}>
            {t('cv.preview.projects')}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
            {cvData.projects.map((project) => {
              const hasDates = project.startDate || project.endDate || project.current
              const hasLink = Boolean(project.link)

              return (
                <div key={project.id} style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.2rem', gap: '0.8rem' }}>
                    <h3 style={{ color: '#000000', fontSize: '1rem', fontWeight: '700', margin: '0' }}>
                      {project.name}{project.role ? ` (${project.role})` : ''}
                    </h3>
                    {hasDates && (
                      <span style={{ color: '#333333', fontSize: '0.9rem', whiteSpace: 'nowrap', flexShrink: 0, fontStyle: 'italic' }}>
                        {formatDate(project.startDate || '')} - {project.current ? t('common.present') : formatDate(project.endDate || '')}
                      </span>
                    )}
                  </div>

                  {project.technologies && (
                    <p style={{ color: '#111111', fontSize: '0.92rem', margin: '0 0 0.2rem 0' }}>
                      <strong>{t('cv.projects.technologies')}:</strong> {project.technologies}
                    </p>
                  )}

                  {hasLink && (
                    <p style={{ color: '#111111', fontSize: '0.92rem', margin: '0 0 0.2rem 0' }}>
                      <strong>{t('cv.projects.link')}:</strong> {project.link}
                    </p>
                  )}

                  {project.description && (
                    <ul style={{ margin: '0.1rem 0 0 1rem', padding: 0, color: '#111111', fontSize: '0.92rem', lineHeight: '1.35' }}>
                      {toBullets(project.description).map((line, idx) => (
                        <li key={`${project.id}-${idx}`}>{line}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {cvData.education.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <h2 style={{ color: '#000000', fontSize: '1.05rem', fontWeight: '700', textTransform: 'uppercase', margin: '0 0 0.45rem 0', borderBottom: '1px solid #111111', paddingBottom: '0.22rem' }}>
            {t('cv.preview.education')}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
            {cvData.education.map((edu) => (
              <div key={edu.id} style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.2rem', gap: '0.8rem' }}>
                  <h3 style={{ color: '#000000', fontSize: '1rem', fontWeight: '700', margin: '0' }}>
                    {edu.degree}{edu.field ? ` ${t('cv.education.in')} ${edu.field}` : ''}
                  </h3>
                  <span style={{ color: '#333333', fontSize: '0.9rem', whiteSpace: 'nowrap', flexShrink: 0, fontStyle: 'italic' }}>
                    {formatDate(edu.startDate)} - {edu.current ? t('common.present') : formatDate(edu.endDate)}
                  </span>
                </div>
                <p style={{ color: '#111111', fontSize: '0.95rem', margin: '0 0 0.2rem 0' }}>{edu.institution}</p>
                {edu.description && (
                  <ul style={{ margin: '0.1rem 0 0 1rem', padding: 0, color: '#111111', fontSize: '0.92rem', lineHeight: '1.35' }}>
                    {toBullets(edu.description).map((line, idx) => (
                      <li key={`${edu.id}-${idx}`}>{line}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {cvData.skills.length > 0 && (
        <div style={{ marginBottom: '1rem', pageBreakInside: 'avoid', breakInside: 'avoid' }}>
          <h2 style={{ color: '#000000', fontSize: '1.05rem', fontWeight: '700', textTransform: 'uppercase', margin: '0 0 0.45rem 0', borderBottom: '1px solid #111111', paddingBottom: '0.22rem' }}>
            {t('cv.preview.skills')}
          </h2>
          <p style={{ margin: 0, fontSize: '0.95rem', color: '#111111', lineHeight: '1.35' }}>
            {cvData.skills.map((skill) => skill.name).join(', ')}
          </p>
        </div>
      )}

      {hasAdditionalInfo && (
        <div style={{ marginBottom: '0.8rem', pageBreakInside: 'avoid', breakInside: 'avoid' }}>
          <h2 style={{ color: '#000000', fontSize: '1.05rem', fontWeight: '700', textTransform: 'uppercase', margin: '0 0 0.45rem 0', borderBottom: '1px solid #111111', paddingBottom: '0.22rem' }}>
            Additional Information
          </h2>
          <ul style={{ margin: '0 0 0 1rem', padding: 0, color: '#111111', fontSize: '0.94rem', lineHeight: '1.5', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
            {cvData.languages.length > 0 && (
              <li style={{ marginBottom: '0.35rem' }}>
                <strong>{t('cv.preview.languages')}:</strong> {cvData.languages.map((language) => language.name).join(', ')}
              </li>
            )}
            {cvData.certifications && cvData.certifications.length > 0 && (
              <li style={{ marginBottom: '0.35rem' }}>
                <strong>Certifications:</strong>{' '}
                {cvData.certifications
                  .map((cert) => [cert.name, cert.issuer, cert.date].filter(Boolean).join(' - '))
                  .join(', ')}
              </li>
            )}
            {cvData.awards && cvData.awards.length > 0 && (
              <li style={{ marginBottom: '0.35rem' }}>
                <strong>Awards/Activities:</strong>{' '}
                {cvData.awards
                  .map((award) => [award.name, award.description].filter(Boolean).join(' - '))
                  .join(', ')}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
})

CVPreview.displayName = 'CVPreview'

export default CVPreview
