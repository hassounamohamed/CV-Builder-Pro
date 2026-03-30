"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useI18n } from '@/contexts/I18nContext'

export default function CTASection() {
  const { t } = useI18n()

  return (
    <section className="relative z-10 container mx-auto px-4 py-20">
      <Card className="relative overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
        <div className="absolute inset-0 bg-grid-white/10"></div>
        <CardContent className="relative p-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('landing.ctaTitle')}
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            {t('landing.ctaSubtitle')}
          </p>
          <Button 
            size="lg" 
            className="bg-white text-indigo-600 hover:bg-indigo-50 px-8 py-6 text-lg shadow-elegant hover:shadow-hover-elegant transform hover:scale-105 transition-elegant"
            asChild
          >
            <Link href="/auth" className="flex items-center gap-2">
              {t('landing.ctaButton')}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </section>
  )
}
