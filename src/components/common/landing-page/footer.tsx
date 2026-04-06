"use client"

import Image from 'next/image'
import { useI18n } from '@/contexts/I18nContext'

export default function Footer() {
  const { t } = useI18n()

  return (
    <footer className="relative z-10 border-t border-slate-200 glass-effect">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Image
              src="/icon.png"
              alt={t('common.appName')}
              width={100}
              height={120}
              className="rounded-lg"
            />
            <span className="text-lg font-bold text-slate-900">{t('common.appName')}</span>
          </div>
          <p className="text-slate-600 text-sm">
            © 2026 {t('common.appName')}. {t('landing.rights')}
          </p>
        </div>
      </div>
    </footer>
  )
}
