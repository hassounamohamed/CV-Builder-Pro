"use client"

import React from 'react'
import { CVStep, cvSteps } from '@/types/cv'
import { User, FileText, Briefcase, GraduationCap, Award, Check, Globe, FolderKanban } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useI18n } from '@/contexts/I18nContext'

interface StepIndicatorProps {
  currentStep: CVStep
  onStepClick: (step: CVStep) => void
  completedSteps: CVStep[]
}

const iconMap = {
  User,
  FileText,
  Briefcase,
  FolderKanban,
  GraduationCap,
  Award,
  Globe,
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  onStepClick,
  completedSteps,
}) => {
  const { t } = useI18n()

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap]
    return IconComponent || FileText
  }

  return (
    <div className="py-6">
      <div className="flex items-center justify-between">
        {cvSteps.map((step, index) => {
          const Icon = getIcon(step.icon)
          const isActive = currentStep === step.id
          const isCompleted = completedSteps.includes(step.id)
          const isLast = index === cvSteps.length - 1

          return (
            <React.Fragment key={step.id}>
              <button
                onClick={() => onStepClick(step.id)}
                className={cn(
                  'flex flex-col items-center gap-2 transition-all group',
                  isActive ? 'scale-110' : 'scale-100 hover:scale-105'
                )}
              >
                <div
                  className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center transition-all',
                    isActive
                      ? 'gradient-primary text-white shadow-lg'
                      : isCompleted
                      ? 'bg-green-500 text-white'
                      : 'bg-muted text-muted-foreground group-hover:bg-muted/80'
                  )}
                >
                  {isCompleted ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                </div>
                <span
                  className={cn(
                    'text-xs font-medium transition-colors hidden sm:block',
                    isActive
                      ? 'text-primary'
                      : isCompleted
                      ? 'text-green-600'
                      : 'text-muted-foreground'
                  )}
                >
                  {t(`cv.steps.${step.id}`)}
                </span>
              </button>

              {!isLast && (
                <div className="flex-1 h-0.5 bg-border mx-2 hidden sm:block">
                  <div
                    className={cn(
                      'h-full transition-all',
                      completedSteps.includes(cvSteps[index + 1].id)
                        ? 'bg-green-500 w-full'
                        : 'bg-transparent w-0'
                    )}
                  />
                </div>
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}

export default StepIndicator
