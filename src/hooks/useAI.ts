import { useState } from 'react'
import { toast } from 'sonner'

interface UseAIParams {
  type: 'improve-summary' | 'improve-experience' | 'check-grammar'
  content: string
}

export function useAI() {
  const [isLoading, setIsLoading] = useState(false)

  const improve = async ({ type, content }: UseAIParams) => {
    if (!content.trim()) {
      toast.error('Please enter some text first')
      return null
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/ai-improve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, content }),
      })

      if (!response.ok) {
        throw new Error('Failed to improve content')
      }

      const data = await response.json()
      return data.result
    } catch (error) {
      console.error('AI improvement error:', error)
      toast.error('Failed to improve content. Please try again.')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return { improve, isLoading }
}
