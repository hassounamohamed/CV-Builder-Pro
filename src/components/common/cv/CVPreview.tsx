"use client"

import React, { forwardRef } from 'react'
import { CVData } from '@/types/cv'
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react'

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
        padding: '2cm',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#ffffff',
        color: '#000000',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        margin: '0 auto'
      }}
    >
      {/* Header */}
      <div style={{ paddingBottom: '1.5rem', marginBottom: '1.5rem', borderBottom: '4px solid #000000' }}>
        <h1 style={{ color: '#111827', fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          {cvData.personalInfo.fullName || 'Your Name'}
        </h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.875rem', color: '#4b5563' }}>
          {cvData.personalInfo.email && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Mail style={{ width: '1rem', height: '1rem' }} />
              <span>{cvData.personalInfo.email}</span>
            </div>
          )}
          {cvData.personalInfo.phone && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Phone style={{ width: '1rem', height: '1rem' }} />
              <span>{cvData.personalInfo.phone}</span>
            </div>
          )}
          {cvData.personalInfo.address && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <MapPin style={{ width: '1rem', height: '1rem' }} />
              <span>{cvData.personalInfo.address}</span>
            </div>
          )}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.875rem', color: '#4b5563', marginTop: '0.5rem' }}>
          {cvData.personalInfo.linkedin && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Linkedin style={{ width: '1rem', height: '1rem' }} />
              <span>{cvData.personalInfo.linkedin}</span>
            </div>
          )}
          {cvData.personalInfo.website && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Globe style={{ width: '1rem', height: '1rem' }} />
              <span>{cvData.personalInfo.website}</span>
            </div>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {cvData.summary && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ color: '#000000', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Professional Summary
          </h2>
          <p style={{ color: '#374151', lineHeight: '1.625' }}>{cvData.summary}</p>
        </div>
      )}

      {/* Experience */}
      {cvData.experience.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ color: '#000000', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Work Experience
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {cvData.experience.map((exp) => (
              <div key={exp.id} style={{ paddingLeft: '1rem', borderLeft: '4px solid #9ca3af' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                  <h3 style={{ color: '#111827', fontSize: '1.125rem', fontWeight: 'bold' }}>{exp.position}</h3>
                  <span style={{ color: '#4b5563', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
                    {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                  </span>
                </div>
                <p style={{ color: '#374151', fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>{exp.company}</p>
                <p style={{ color: '#4b5563', lineHeight: '1.625', whiteSpace: 'pre-line' }}>
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
          <h2 style={{ color: '#000000', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Education
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {cvData.education.map((edu) => (
              <div key={edu.id} style={{ paddingLeft: '1rem', borderLeft: '4px solid #9ca3af' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                  <h3 style={{ color: '#111827', fontSize: '1.125rem', fontWeight: 'bold' }}>
                    {edu.degree} in {edu.field}
                  </h3>
                  <span style={{ color: '#4b5563', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </span>
                </div>
                <p style={{ color: '#374151', fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>{edu.institution}</p>
                {edu.description && (
                  <p style={{ color: '#4b5563', lineHeight: '1.625' }}>{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {cvData.skills.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ color: '#000000', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Skills
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {cvData.skills.map((skill) => (
              <span
                key={skill.id}
                style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid #d1d5db',
                  color: '#374151',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
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
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ color: '#000000', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Languages
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {cvData.languages.map((language) => (
              <span
                key={language.id}
                style={{
                  padding: '0.5rem 1rem',
                 
                  color: '#374151',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
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
