import { useState } from 'react'
import { collection, doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { CVData } from '@/types/cv'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

export const useCVStorage = () => {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const saveCV = async (cvData: CVData): Promise<CVData | null> => {
    if (!user) {
      toast.error('Please sign in to save your CV.')
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
  }

  const loadCV = async (): Promise<CVData | null> => {
    if (!user) return null

    setIsLoading(true)
    try {
      const cvRef = doc(db, 'cvs', user.id)
      const cvSnap = await getDoc(cvRef)

      if (cvSnap.exists()) {
        const data = cvSnap.data() as CVData
        // Ensure languages field exists for backwards compatibility
        if (!data.languages) {
          data.languages = []
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
  }

  return { saveCV, loadCV, isLoading }
}
