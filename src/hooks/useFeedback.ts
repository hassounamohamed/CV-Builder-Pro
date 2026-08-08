import { useCallback } from 'react'
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  query,
  orderBy,
  limit,
} from 'firebase/firestore'
import { db, isConfigured } from '@/lib/firebase'
import { useAuth } from '@/contexts/AuthContext'

export interface Feedback {
  id?: string
  userId?: string
  name: string
  rating: number
  comment: string
  createdAt?: Date | null
}

export const useFeedback = () => {
  const { user } = useAuth()

  const submitFeedback = useCallback(
    async (name: string, rating: number, comment: string): Promise<boolean> => {
      if (!isConfigured || !db) {
        console.warn('Database is not configured')
        return false
      }

      try {
        const feedbacksRef = collection(db, 'feedbacks')
        await addDoc(feedbacksRef, {
          userId: user?.id ?? null,
          name: name.trim() || 'Anonymous',
          rating,
          comment: comment.trim(),
          createdAt: serverTimestamp(),
        })
        return true
      } catch (error) {
        console.error('Error submitting feedback:', error)
        return false
      }
    },
    [user]
  )

  const loadFeedbacks = useCallback(async (): Promise<Feedback[]> => {
    if (!isConfigured || !db) {
      return []
    }

    try {
      const feedbacksRef = collection(db, 'feedbacks')
      const q = query(feedbacksRef, orderBy('createdAt', 'desc'), limit(20))
      const snapshot = await getDocs(q)

      return snapshot.docs.map((doc) => {
        const data = doc.data()
        return {
          id: doc.id,
          userId: data.userId,
          name: data.name,
          rating: data.rating,
          comment: data.comment,
          createdAt: data.createdAt?.toDate?.() ?? null,
        } as Feedback
      })
    } catch (error) {
      console.error('Error loading feedbacks:', error)
      return []
    }
  }, [])

  return { submitFeedback, loadFeedbacks }
}
