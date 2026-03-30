"use client"

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { CVData, CVStep, initialCVData } from '@/types/cv'

interface CVContextType {
  cvData: CVData
  currentStep: CVStep
  setCurrentStep: (step: CVStep) => void
  setCVData: (data: CVData) => void
  updateCVData: (data: Partial<CVData>) => void
}

const CVContext = createContext<CVContextType | undefined>(undefined)

export const CVProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cvData, setCVDataState] = useState<CVData>(initialCVData)
  const [currentStep, setCurrentStep] = useState<CVStep>('personal')

  const setCVData = useCallback((data: CVData) => {
    setCVDataState(data)
  }, [])

  const updateCVData = useCallback((data: Partial<CVData>) => {
    setCVDataState((prev) => ({ ...prev, ...data }))
  }, [])

  const value = useMemo(
    () => ({
      cvData,
      currentStep,
      setCurrentStep,
      setCVData,
      updateCVData,
    }),
    [cvData, currentStep, setCVData, updateCVData]
  )

  return (
    <CVContext.Provider value={value}>
      {children}
    </CVContext.Provider>
  )
}

export const useCV = () => {
  const context = useContext(CVContext)
  if (context === undefined) {
    throw new Error('useCV must be used within a CVProvider')
  }
  return context
}
