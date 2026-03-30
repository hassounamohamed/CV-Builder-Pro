"use client"

import { useI18n } from '@/contexts/I18nContext'

const steps = [
  {
    step: '01',
    titleKey: 'landing.steps.chooseTitle',
    descriptionKey: 'landing.steps.chooseDesc',
  },
  {
    step: '02',
    titleKey: 'landing.steps.fillTitle',
    descriptionKey: 'landing.steps.fillDesc',
  },
  {
    step: '03',
    titleKey: 'landing.steps.downloadTitle',
    descriptionKey: 'landing.steps.downloadDesc',
  },
]

export default function HowItWorksSection() {
  const { t } = useI18n()

  return (
    <section className="relative z-10 container mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
          {t('landing.howTitle')}
        </h2>
        <p className="text-xl text-slate-600">
          {t('landing.howSubtitle')}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {steps.map((step, index) => (
          <div key={index} className="relative text-center">
            <div className="relative inline-flex items-center justify-center mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full blur-xl opacity-30 animate-pulse"></div>
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-2xl">
                {step.step}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              {t(step.titleKey)}
            </h3>
            <p className="text-slate-600 leading-relaxed">
              {t(step.descriptionKey)}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
