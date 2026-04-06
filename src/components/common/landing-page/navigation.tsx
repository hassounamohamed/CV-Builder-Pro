"use client"

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import ThemeToggle from '@/components/common/theme-toggle'
import LanguageSwitcher from '@/components/common/language-switcher'
import { useI18n } from '@/contexts/I18nContext'

export default function Navigation() {
  const { t } = useI18n()

  return (
    <nav className="relative z-10 container mx-auto px-4 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex items-center gap-2">
        <Image
          src="/icon.png"
          alt={t('common.appName')}
          width={100}
          height={120}
          className="rounded-lg"
        />
        <span className="text-lg md:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap">
          {t('common.appName')}
        </span>
      </div>
      <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 w-full md:w-auto">
        <LanguageSwitcher />
        <ThemeToggle />
        <Button variant="ghost" asChild>
          <Link href="/auth">{t('common.login')}</Link>
        </Button>
        <Button className="gradient-primary hover:gradient-primary-hover transition-elegant" asChild>
          <Link href="/auth">{t('landing.startFree')}</Link>
        </Button>
      </div>
    </nav>
  )
}
