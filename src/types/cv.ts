// CV Types and Interfaces

export type CVStep = 'personal' | 'summary' | 'experience' | 'education' | 'skills' | 'languages'

export interface PersonalInfo {
  fullName: string
  email: string
  phone: string
  address: string
  linkedin?: string
  website?: string
  photo?: string
}

export interface Experience {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string
  current: boolean
  description: string
}

export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  startDate: string
  endDate: string
  current: boolean
  description?: string
}

export interface Skill {
  id: string
  name: string
}

export interface Language {
  id: string
  name: string
}

export interface CVData {
  id?: string
  userId?: string
  personalInfo: PersonalInfo
  summary: string
  experience: Experience[]
  education: Education[]
  skills: Skill[]
  languages: Language[]
  createdAt?: Date | any // Allow Firestore FieldValue
  updatedAt?: Date | any // Allow Firestore FieldValue
}

export interface StepConfig {
  id: CVStep
  label: string
  icon: string
}

export const cvSteps: StepConfig[] = [
  { id: 'personal', label: 'Personal Info', icon: 'User' },
  { id: 'summary', label: 'Summary', icon: 'FileText' },
  { id: 'experience', label: 'Experience', icon: 'Briefcase' },
  { id: 'education', label: 'Education', icon: 'GraduationCap' },
  { id: 'skills', label: 'Skills', icon: 'Award' },
  { id: 'languages', label: 'Languages', icon: 'Globe' },
]

export const initialCVData: CVData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    linkedin: '',
    website: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  languages: [],
}
