import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Zap, Shield, Layout, Download, Sparkles, FileText } from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Create your resume in under 5 minutes with our intuitive interface and smart suggestions.',
    gradient: 'from-yellow-400 to-orange-500',
  },
  {
    icon: Layout,
    title: 'Beautiful Templates',
    description: 'Choose from dozens of professionally designed templates that make you stand out.',
    gradient: 'from-blue-400 to-indigo-500',
  },
  {
    icon: Shield,
    title: 'ATS-Friendly',
    description: 'All our templates are optimized to pass Applicant Tracking Systems with ease.',
    gradient: 'from-green-400 to-emerald-500',
  },
  {
    icon: Download,
    title: 'Export Anywhere',
    description: 'Download your resume as PDF, Word, or share it with a unique link.',
    gradient: 'from-purple-400 to-pink-500',
  },
  {
    icon: Sparkles,
    title: 'AI-Powered',
    description: 'Get smart content suggestions and optimize your resume with AI assistance.',
    gradient: 'from-cyan-400 to-blue-500',
  },
  {
    icon: FileText,
    title: 'Real-Time Preview',
    description: 'See your changes instantly with our live preview feature.',
    gradient: 'from-rose-400 to-red-500',
  },
]

export default function FeaturesSection() {
  return (
    <section className="relative z-10 container mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
          Why Choose CV Builder Pro?
        </h2>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Everything you need to create a professional resume that gets you hired
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {features.map((feature, index) => (
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
                {feature.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-slate-600 text-base leading-relaxed">
                {feature.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
