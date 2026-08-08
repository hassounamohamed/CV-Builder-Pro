"use client"

import React, { useEffect, useState } from 'react'
import { Star, Quote, MessageSquareDashed } from 'lucide-react'
import { useFeedback, Feedback } from '@/hooks/useFeedback'
import { useI18n } from '@/contexts/I18nContext'

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const px = size === 'md' ? 'w-5 h-5' : 'w-4 h-4'
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={px}
          fill={s <= rating ? '#f59e0b' : 'none'}
          stroke={s <= rating ? '#f59e0b' : '#cbd5e1'}
          strokeWidth={1.5}
        />
      ))}
    </div>
  )
}

function ReviewCard({ feedback, index }: { feedback: Feedback; index: number }) {
  const initials = feedback.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const avatarColors = [
    'from-indigo-500 to-purple-600',
    'from-pink-500 to-rose-600',
    'from-emerald-500 to-teal-600',
    'from-amber-500 to-orange-600',
    'from-cyan-500 to-blue-600',
  ]
  const colorClass = avatarColors[index % avatarColors.length]

  const dateStr = feedback.createdAt
    ? new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' }).format(feedback.createdAt)
    : ''

  return (
    <div
      className="relative flex flex-col gap-4 p-6 rounded-2xl bg-white border border-slate-100 shadow-elegant hover:shadow-hover-elegant transition-elegant hover:-translate-y-1"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Quote icon */}
      <Quote className="absolute top-4 right-4 w-8 h-8 text-indigo-100" fill="currentColor" />

      {/* Stars */}
      <StarRating rating={feedback.rating} />

      {/* Comment */}
      <p className="text-slate-600 text-sm leading-relaxed flex-1 line-clamp-4">
        {feedback.comment || '—'}
      </p>

      {/* Author row */}
      <div className="flex items-center gap-3 pt-2 border-t border-slate-50">
        {/* Avatar */}
        <div
          className={`w-9 h-9 rounded-full bg-gradient-to-br ${colorClass} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
        >
          {initials || '?'}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">{feedback.name}</p>
          {dateStr && <p className="text-xs text-slate-400">{dateStr}</p>}
        </div>
      </div>
    </div>
  )
}

export default function ReviewsSection() {
  const { t } = useI18n()
  const { loadFeedbacks } = useFeedback()
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const fetch = async () => {
      const data = await loadFeedbacks()
      if (mounted) {
        setFeedbacks(data)
        setIsLoading(false)
      }
    }
    fetch()
    return () => { mounted = false }
  }, [loadFeedbacks])

  // Average rating
  const avgRating =
    feedbacks.length > 0
      ? Math.round((feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length) * 10) / 10
      : 0

  return (
    <section className="relative z-10 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm shadow border border-amber-100 mb-4">
            <Star className="w-4 h-4 text-amber-500" fill="#f59e0b" />
            <span className="text-sm font-medium text-amber-800">
              {feedbacks.length > 0 ? `${avgRating} / 5 · ${feedbacks.length} reviews` : 'User Reviews'}
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            {t('feedback.reviewsTitle')}
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            {t('feedback.reviewsSubtitle')}
          </p>
        </div>

        {/* Content */}
        {isLoading ? (
          /* Skeleton */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 rounded-2xl bg-white border border-slate-100 animate-pulse" />
            ))}
          </div>
        ) : feedbacks.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
              <MessageSquareDashed className="w-8 h-8 text-indigo-300" />
            </div>
            <p className="text-slate-400 text-lg font-medium">{t('feedback.beFirst')}</p>
          </div>
        ) : (
          /* Review cards */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
            {feedbacks.map((fb, i) => (
              <ReviewCard key={fb.id ?? i} feedback={fb} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
