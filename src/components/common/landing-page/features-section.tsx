"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Zap, Shield, Layout, Download, Sparkles, FileText } from 'lucide-react'
import { useI18n } from '@/contexts/I18nContext'

const featureIcons = [
  {
    icon: Zap,
    titleKey: 'landing.features.lightningTitle',
    descriptionKey: 'landing.features.lightningDesc',
    gradient: 'from-yellow-400 to-orange-500',
  },
  {
    icon: Layout,
    titleKey: 'landing.features.templatesTitle',
    descriptionKey: 'landing.features.templatesDesc',
    gradient: 'from-blue-400 to-indigo-500',
  },
  {
    icon: Shield,
    titleKey: 'landing.features.atsTitle',
    descriptionKey: 'landing.features.atsDesc',
    gradient: 'from-green-400 to-emerald-500',
  },
  {
    icon: Download,
    titleKey: 'landing.features.exportTitle',
    descriptionKey: 'landing.features.exportDesc',
    gradient: 'from-purple-400 to-pink-500',
  },
  {
    icon: Sparkles,
    titleKey: 'landing.features.aiTitle',
    descriptionKey: 'landing.features.aiDesc',
    gradient: 'from-cyan-400 to-blue-500',
  },
  {
    icon: FileText,
    titleKey: 'landing.features.previewTitle',
    descriptionKey: 'landing.features.previewDesc',
    gradient: 'from-rose-400 to-red-500',
  },
]

export default function FeaturesSection() {
  const { t } = useI18n()

  return (
    <section className="relative z-10 container mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
          {t('landing.whyTitle')}
        </h2>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          {t('landing.whySubtitle')}
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {featureIcons.map((feature, index) => (
          <Card
            key={index}
            className="group relative overflow-hidden border-0 shadow-elegant hover:shadow-hover-elegant transition-elegant transform hover:-translate-y-2 glass-effect"
          >
            <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500 from-indigo-500 to-purple-500"></div>
            <CardHeader>
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-slate-900">
                {t(feature.titleKey)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-slate-600 text-base leading-relaxed">
                {t(feature.descriptionKey)}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
