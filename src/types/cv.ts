// CV Types and Interfaces

export type CVStep = 'personal' | 'summary' | 'experience' | 'projects' | 'education' | 'skills' | 'languages'

export interface PersonalInfo {
  fullName: string
  professionalTitle?: string
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

export interface Project {
  id: string
  name: string
  role?: string
  technologies?: string
  link?: string
  startDate?: string
  endDate?: string
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

export interface Certification {
  id: string
  name: string
  issuer?: string
  date?: string
}

export interface Award {
  id: string
  name: string
  description?: string
}

export interface CVData {
  id?: string
  userId?: string
  personalInfo: PersonalInfo
  summary: string
  experience: Experience[]
  projects: Project[]
  education: Education[]
  skills: Skill[]
  languages: Language[]
  certifications?: Certification[]
  awards?: Award[]
  createdAt?: Date | unknown // Allow Firestore FieldValue
  updatedAt?: Date | unknown // Allow Firestore FieldValue
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
  { id: 'projects', label: 'Projects', icon: 'FolderKanban' },
  { id: 'education', label: 'Education', icon: 'GraduationCap' },
  { id: 'skills', label: 'Skills', icon: 'Award' },
  { id: 'languages', label: 'Languages', icon: 'Globe' },
]

export const initialCVData: CVData = {
  personalInfo: {
    fullName: '',
    professionalTitle: '',
    email: '',
    phone: '',
    address: '',
    linkedin: '',
    website: '',
  },
  summary: '',
  experience: [],
  projects: [],
  education: [],
  skills: [],
  languages: [],
  certifications: [],
  awards: [],
}
