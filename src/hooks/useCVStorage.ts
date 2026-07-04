import { useCallback, useState } from 'react'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { db, isConfigured } from '@/lib/firebase'
import { CVData } from '@/types/cv'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

export const useCVStorage = () => {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const saveCV = useCallback(async (cvData: CVData): Promise<CVData | null> => {
    if (!user) {
      toast.error('Please sign in to save your CV.')
      return null
    }

    if (!isConfigured || !db) {
      toast.error('Database is not configured.')
      return null
    }

    setIsLoading(true)
    try {
      const cvRef = doc(db, 'cvs', user.id)
      const dataToSave = {
        ...cvData,
        userId: user.id,
        updatedAt: serverTimestamp(),
      }

      if (!cvData.id) {
        dataToSave.createdAt = serverTimestamp()
      }

      await setDoc(cvRef, dataToSave, { merge: true })

      toast.success('Your CV has been saved successfully.')

      return { ...cvData, id: user.id, userId: user.id }
    } catch (error) {
      console.error('Error saving CV:', error)
      toast.error('There was an error saving your CV.')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [user])

  const loadCV = useCallback(async (): Promise<CVData | null> => {
    if (!user) return null

    if (!isConfigured || !db) {
      console.warn('Database is not configured')
      return null
    }

    setIsLoading(true)
    try {
      const cvRef = doc(db, 'cvs', user.id)
      const cvSnap = await getDoc(cvRef)

      if (cvSnap.exists()) {
        const data = cvSnap.data() as CVData
        // Ensure new fields exist for backwards compatibility
        if (!data.languages) {
          data.languages = []
        }
        if (!data.projects) {
          data.projects = []
        }
        if (!data.certifications) {
          data.certifications = []
        }
        if (!data.awards) {
          data.awards = []
        }
        return data
      }
      return null
    } catch (error) {
      console.error('Error loading CV:', error)
      // Don't show error toast - it's normal to not have saved CV data
      return null
    } finally {
      setIsLoading(false)
    }
  }, [user])

  const createShareLink = useCallback(async (cvData: CVData): Promise<string | null> => {
    if (!user) {
      return null
    }

    if (!isConfigured || !db) {
      return null
    }

    try {
      const cvRef = doc(db, 'cvs', user.id)
      await setDoc(
        cvRef,
        {
          ...cvData,
          userId: user.id,
          isShared: true,
          sharedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      )

      if (typeof window === 'undefined') {
        return null
      }

      return `${window.location.origin}/cv-share/${user.id}`
    } catch (error) {
      console.error('Error creating share link:', error)
      return null
    }
  }, [user])

  return { saveCV, loadCV, createShareLink, isLoading }
}
