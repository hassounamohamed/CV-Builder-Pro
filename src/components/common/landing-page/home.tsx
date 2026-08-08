"use client"

import AnimatedBackground from './animated-background'
import Navigation from './navigation'
import HeroSection from './hero-section'
import FeaturesSection from './features-section'
import HowItWorksSection from './how-it-works-section'
import ReviewsSection from './reviews-section'
import CTASection from './cta-section'
import Footer from './footer'

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden gradient-bg-main">
      <AnimatedBackground />
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <ReviewsSection />
      <CTASection />
      <Footer />
    </div>
  )
}