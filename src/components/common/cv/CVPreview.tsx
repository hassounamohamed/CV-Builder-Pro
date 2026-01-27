"use client"

import React, { forwardRef } from 'react'
import { CVData } from '@/types/cv'

interface CVPreviewProps {
  cvData: CVData
}

const CVPreview = forwardRef<HTMLDivElement, CVPreviewProps>(({ cvData }, ref) => {
  const formatDate = (date: string) => {
    if (date === 'Present') return 'Present'
    if (!date) return ''
    const [year, month] = date.split('-')
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${months[parseInt(month) - 1]} ${year}`
  }

  const getSkillLevelWidth = (level: string) => {
    switch (level) {
      case 'beginner':
        return '25%'
      case 'intermediate':
        return '50%'
      case 'advanced':
        return '75%'
      case 'expert':
        return '100%'
      default:
        return '50%'
    }
  }

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
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <div style={{ paddingBottom: '1rem', marginBottom: '1.5rem', borderBottom: '3px solid #000000' }}>
        <h1 style={{ color: '#000000', fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', margin: '0 0 1rem 0' }}>
          {cvData.personalInfo.fullName || 'Your Name'}
        </h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', fontSize: '0.9rem', color: '#374151', lineHeight: '1.5' }}>
          {cvData.personalInfo.email && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>✉</span>
              <span>{cvData.personalInfo.email}</span>
            </div>
          )}
          {cvData.personalInfo.phone && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>☎</span>
              <span>{cvData.personalInfo.phone}</span>
            </div>
          )}
          {cvData.personalInfo.address && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>📍</span>
              <span>{cvData.personalInfo.address}</span>
            </div>
          )}
          {cvData.personalInfo.linkedin && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontWeight: 'bold', fontSize: '0.75rem', backgroundColor: '#0077b5', color: '#ffffff', padding: '2px 5px', borderRadius: '2px', fontFamily: 'sans-serif' }}>in</span>
              <span>{cvData.personalInfo.linkedin}</span>
            </div>
          )}
          {cvData.personalInfo.website && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>🌐</span>
              <span>{cvData.personalInfo.website}</span>
            </div>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {cvData.summary && (
        <div style={{ marginBottom: '1.5rem', pageBreakInside: 'avoid' }}>
          <h2 style={{ color: '#000000', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.75rem 0' }}>
            Professional Summary
          </h2>
          <p style={{ color: '#374151', lineHeight: '1.7', fontSize: '0.95rem', margin: '0', wordWrap: 'break-word', whiteSpace: 'normal' }}>{cvData.summary}</p>
        </div>
      )}

      {/* Experience */}
      {cvData.experience.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ color: '#000000', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.75rem 0' }}>
            Work Experience
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {cvData.experience.map((exp) => (
              <div key={exp.id} style={{ paddingLeft: '1rem', borderLeft: '3px solid #6b7280', paddingBottom: '0.5rem', pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem', gap: '1rem' }}>
                  <h3 style={{ color: '#000000', fontSize: '1.1rem', fontWeight: 'bold', margin: '0' }}>{exp.position}</h3>
                  <span style={{ color: '#6b7280', fontSize: '0.85rem', whiteSpace: 'nowrap', flexShrink: 0 }}>
                    {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                  </span>
                </div>
                <p style={{ color: '#374151', fontSize: '0.95rem', fontWeight: '600', marginBottom: '0.5rem', margin: '0 0 0.5rem 0' }}>{exp.company}</p>
                <p style={{ color: '#4b5563', lineHeight: '1.7', whiteSpace: 'pre-wrap', fontSize: '0.9rem', margin: '0', wordWrap: 'break-word' }}>
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {cvData.education.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ color: '#000000', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.75rem 0' }}>
            Education
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {cvData.education.map((edu) => (
              <div key={edu.id} style={{ paddingLeft: '1rem', borderLeft: '3px solid #6b7280', paddingBottom: '0.5rem', pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem', gap: '1rem' }}>
                  <h3 style={{ color: '#000000', fontSize: '1.1rem', fontWeight: 'bold', margin: '0' }}>
                    {edu.degree} in {edu.field}
                  </h3>
                  <span style={{ color: '#6b7280', fontSize: '0.85rem', whiteSpace: 'nowrap', flexShrink: 0 }}>
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </span>
                </div>
                <p style={{ color: '#374151', fontSize: '0.95rem', fontWeight: '600', marginBottom: '0.5rem', margin: '0 0 0.5rem 0' }}>{edu.institution}</p>
                {edu.description && (
                  <p style={{ color: '#4b5563', lineHeight: '1.7', fontSize: '0.9rem', margin: '0', wordWrap: 'break-word', whiteSpace: 'normal' }}>{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {cvData.skills.length > 0 && (
        <div style={{ marginBottom: '1.5rem', pageBreakInside: 'avoid', breakInside: 'avoid' }}>
          <h2 style={{ color: '#000000', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.75rem 0' }}>
            Skills
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
            {cvData.skills.map((skill) => (
              <span
                key={skill.id}
                style={{
                  padding: '0.4rem 0.9rem',
              
          
            
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  display: 'inline-block',
                  pageBreakInside: 'avoid',
                  breakInside: 'avoid'
                }}
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {cvData.languages.length > 0 && (
        <div style={{ marginBottom: '1.5rem', pageBreakInside: 'avoid', breakInside: 'avoid' }}>
          <h2 style={{ color: '#000000', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.75rem 0' }}>
            Languages
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
            {cvData.languages.map((language) => (
              <span
                key={language.id}
                style={{
                  padding: '0.4rem 0.9rem',

                 
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  display: 'inline-block',
                  pageBreakInside: 'avoid',
                  breakInside: 'avoid'
                }}
              >
                {language.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
})

CVPreview.displayName = 'CVPreview'

export default CVPreview
