import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="relative z-10 container mx-auto px-4 py-20 text-center">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg border border-indigo-100 mb-4 animate-bounce">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span className="text-sm font-medium text-indigo-900">AI-Powered Resume Builder</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold leading-tight">
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Create Professional
          </span>
          <br />
          <span className="text-slate-900">Resumes in Minutes</span>
        </h1>

        <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Build stunning, ATS-friendly resumes with our intuitive drag-and-drop builder. 
          Stand out from the crowd and land your dream job.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Button 
            size="lg" 
            className="gradient-primary hover:gradient-primary-hover text-white px-8 py-6 text-lg shadow-elegant hover:shadow-hover-elegant transition-elegant transform hover:scale-105"
            asChild
          >
            <Link href="/auth" className="flex items-center gap-2">
              Start Building Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="px-8 py-6 text-lg border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50"
          >
            Watch Demo
          </Button>
        </div>

        <div className="flex items-center justify-center gap-8 pt-8 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <span>No Credit Card Required</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <span>Free Templates</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <span>Export to PDF</span>
          </div>
        </div>
      </div>

      {/* 3D Floating Card Preview */}
      <div className="relative mt-20 perspective-1000">
        <div className="relative max-w-4xl mx-auto transform-3d animate-float">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur-3xl opacity-30 animate-pulse"></div>
          <Card className="relative glass-effect shadow-elegant hover:shadow-hover-elegant transition-elegant border-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
            <CardContent className="p-8">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-32 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg animate-shimmer"></div>
                <div className="col-span-2 space-y-2">
                  <div className="h-6 bg-gradient-to-r from-indigo-200 to-purple-200 rounded animate-shimmer"></div>
                  <div className="h-4 bg-gradient-to-r from-indigo-100 to-purple-100 rounded w-2/3 animate-shimmer"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
