const steps = [
  {
    step: '01',
    title: 'Choose a Template',
    description: 'Pick from our collection of professional, ATS-friendly templates designed by experts.',
  },
  {
    step: '02',
    title: 'Fill Your Details',
    description: 'Use our intuitive editor to add your information. Get AI suggestions for better content.',
  },
  {
    step: '03',
    title: 'Download & Apply',
    description: 'Export your resume in multiple formats and start applying to your dream jobs.',
  },
]

export default function HowItWorksSection() {
  return (
    <section className="relative z-10 container mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
          How It Works
        </h2>
        <p className="text-xl text-slate-600">
          Three simple steps to your perfect resume
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
              {step.title}
            </h3>
            <p className="text-slate-600 leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
