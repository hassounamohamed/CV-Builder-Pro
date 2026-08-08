"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Sparkles, ArrowRight, CheckCircle2, Play, X, LayoutTemplate, Type, FileText } from 'lucide-react'
import Link from 'next/link'
import { useI18n } from '@/contexts/I18nContext'
import { useState, useRef } from 'react'

export default function HeroSection() {
  const { t } = useI18n()
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const demoRef = useRef<HTMLDivElement>(null)

  const scrollToDemo = () => {
    demoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <section className="relative z-10 container mx-auto px-4 py-20 text-center">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg border border-indigo-100 mb-4 animate-bounce">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span className="text-sm font-medium text-indigo-900">{t('landing.badge')}</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold leading-tight">
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            {t('landing.heroTitleA')}
          </span>
          <br />
          <span className="text-slate-900">{t('landing.heroTitleB')}</span>
        </h1>

        <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          {t('landing.heroSubtitle')}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Button 
            size="lg" 
            className="gradient-primary hover:gradient-primary-hover text-white px-8 py-6 text-lg shadow-elegant hover:shadow-hover-elegant transition-elegant transform hover:scale-105"
            asChild
          >
            <Link href="/auth" className="flex items-center gap-2">
              {t('landing.startFree')}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            onClick={scrollToDemo}
            className="px-8 py-6 text-lg border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition-all hover:shadow-lg"
          >
            <Play className="w-5 h-5 mr-2" />
            {t('landing.watchDemo')}
          </Button>
        </div>

        <div className="flex items-center justify-center gap-8 pt-8 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <span>{t('landing.noCard')}</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <span>{t('landing.freeTemplates')}</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <span>{t('landing.exportPdf')}</span>
          </div>
        </div>
      </div>

      {/* 3D Floating Card Preview */}
      <div className="relative mt-20 perspective-1000" ref={demoRef}>
        <div className="relative max-w-5xl mx-auto transform-3d animate-float">
          {/* Glow Behind */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl blur-[80px] opacity-20 animate-pulse" />
          
          <Card className="relative glass-effect shadow-elegant hover:shadow-hover-elegant transition-elegant border border-white/40 overflow-hidden rounded-2xl group cursor-pointer" onClick={() => setIsVideoOpen(true)}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl" />
            
            {/* Play Button Overlay */}
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-900/10 group-hover:bg-slate-900/20 transition-all duration-300">
              <div className="w-20 h-20 bg-white/90 backdrop-blur shadow-xl rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Play className="w-8 h-8 text-indigo-600 ml-1" fill="currentColor" />
              </div>
            </div>

            <CardContent className="p-0">
              {/* App Mockup UI */}
              <div className="flex h-[450px] bg-white/50 backdrop-blur-sm">
                {/* Mock Sidebar */}
                <div className="w-1/3 border-r border-slate-200/60 p-6 flex flex-col gap-4 bg-slate-50/50">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="h-4 w-24 bg-slate-200 rounded-full mb-2" />
                  
                  {/* Mock Input Fields */}
                  <div className="space-y-3">
                    <div className="h-10 bg-white rounded-lg border border-slate-200 flex items-center px-3 gap-2 shadow-sm">
                      <Type className="w-4 h-4 text-slate-300" />
                      <div className="h-2 w-20 bg-slate-200 rounded-full" />
                    </div>
                    <div className="h-10 bg-white rounded-lg border border-slate-200 flex items-center px-3 gap-2 shadow-sm">
                      <FileText className="w-4 h-4 text-slate-300" />
                      <div className="h-2 w-32 bg-slate-200 rounded-full" />
                    </div>
                    <div className="h-24 bg-white rounded-lg border border-slate-200 p-3 shadow-sm">
                      <div className="h-2 w-full bg-slate-100 rounded-full mb-2" />
                      <div className="h-2 w-5/6 bg-slate-100 rounded-full mb-2" />
                      <div className="h-2 w-4/6 bg-slate-100 rounded-full" />
                    </div>
                  </div>
                  
                  <div className="mt-auto h-10 bg-indigo-600 rounded-lg shadow-md flex items-center justify-center opacity-90">
                    <div className="h-2 w-16 bg-white/80 rounded-full" />
                  </div>
                </div>

                {/* Mock Preview Area */}
                <div className="w-2/3 p-8 flex items-center justify-center bg-slate-100/50">
                  <div className="w-full h-full max-w-sm bg-white rounded-xl shadow-lg border border-slate-100 p-6 flex flex-col gap-5">
                    {/* CV Header */}
                    <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100" />
                      <div className="space-y-2">
                        <div className="h-4 w-32 bg-slate-800 rounded-full" />
                        <div className="h-2 w-24 bg-indigo-600 rounded-full" />
                      </div>
                    </div>
                    
                    {/* CV Content */}
                    <div className="space-y-4 flex-1">
                      <div>
                        <div className="h-3 w-20 bg-slate-300 rounded-full mb-3" />
                        <div className="space-y-2">
                          <div className="h-2 w-full bg-slate-100 rounded-full" />
                          <div className="h-2 w-11/12 bg-slate-100 rounded-full" />
                          <div className="h-2 w-4/5 bg-slate-100 rounded-full" />
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        <div className="h-3 w-24 bg-slate-300 rounded-full mb-3" />
                        <div className="space-y-3">
                          <div className="flex gap-3">
                            <div className="w-1 h-10 bg-indigo-100 rounded-full" />
                            <div className="space-y-2 flex-1">
                              <div className="h-2 w-32 bg-slate-200 rounded-full" />
                              <div className="h-2 w-full bg-slate-100 rounded-full" />
                              <div className="h-2 w-5/6 bg-slate-100 rounded-full" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Video Modal */}
      {isVideoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-5xl bg-black rounded-2xl shadow-2xl overflow-hidden aspect-video animate-scaleIn">
            <button
              onClick={() => setIsVideoOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <video
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
              controls
              autoPlay
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
    </section>
  )
}
