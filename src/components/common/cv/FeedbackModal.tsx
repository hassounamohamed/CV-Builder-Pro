"use client"

import React, { useState } from 'react'
import { Star, X, Send, CheckCircle2, FileCheck2 } from 'lucide-react'
import { useFeedback } from '@/hooks/useFeedback'
import { toast } from 'sonner'
import { useI18n } from '@/contexts/I18nContext'

interface FeedbackModalProps {
  defaultName?: string
  onClose: () => void
}

const ratingLabels = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent']

const FeedbackModal: React.FC<FeedbackModalProps> = ({ defaultName = '', onClose }) => {
  const { t } = useI18n()
  const { submitFeedback } = useFeedback()

  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [name, setName] = useState(defaultName)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const activeRating = hoverRating || rating

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) {
      toast.error('Please select a star rating.')
      return
    }
    setIsSubmitting(true)
    const ok = await submitFeedback(name, rating, comment)
    setIsSubmitting(false)
    if (ok) {
      toast.success(t('feedback.success'))
      onClose()
    } else {
      toast.error('Failed to submit feedback. Please try again.')
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)' }}
    >
      {/* Modal card */}
      <div
        className="relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-scaleIn"
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          boxShadow: '0 25px 60px rgba(0,0,0,0.18), 0 8px 20px rgba(0,0,0,0.1)',
        }}
      >
        {/* Accent top bar */}
        <div
          className="h-1 w-full"
          style={{ background: 'linear-gradient(90deg, #4f46e5 0%, #7c3aed 60%, #6366f1 100%)' }}
        />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="px-8 pt-7 pb-8">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-7">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
              style={{ background: 'linear-gradient(135deg, #eef2ff 0%, #ede9fe 100%)' }}
            >
              <FileCheck2 className="w-6 h-6 text-indigo-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-1">
              {t('feedback.congrats')}
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              {t('feedback.subtitle')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Star Rating */}
            <div className="flex flex-col items-center gap-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                {t('feedback.rateExperience')}
              </p>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => {
                  const filled = star <= activeRating
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                      aria-label={`Rate ${star} stars`}
                    >
                      <Star
                        className="w-8 h-8 transition-all duration-100"
                        fill={filled ? '#f59e0b' : 'none'}
                        stroke={filled ? '#f59e0b' : '#cbd5e1'}
                        strokeWidth={1.5}
                      />
                    </button>
                  )
                })}
              </div>
              <div className="h-5 flex items-center">
                {activeRating > 0 && (
                  <span className="text-xs font-semibold text-indigo-600 tracking-wide animate-fadeIn">
                    {ratingLabels[activeRating]}
                  </span>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-100" />

            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider" htmlFor="feedback-name">
                Name
              </label>
              <input
                type="text"
                id="feedback-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('feedback.namePlaceholder')}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 focus:bg-white transition-all"
              />
            </div>

            {/* Comment */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider" htmlFor="feedback-comment">
                Feedback
              </label>
              <textarea
                id="feedback-comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={t('feedback.messagePlaceholder')}
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 focus:bg-white transition-all resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                id="feedback-skip-btn"
                className="flex-1 py-2.5 rounded-lg border border-slate-200 text-slate-500 text-sm font-medium hover:bg-slate-50 hover:border-slate-300 transition-all"
              >
                {t('feedback.skip')}
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                id="feedback-submit-btn"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-white text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t('feedback.submitting')}
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    {t('feedback.submit')}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default FeedbackModal
