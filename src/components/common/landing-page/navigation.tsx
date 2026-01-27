import { Button } from '@/components/ui/button'
import { FileText } from 'lucide-react'
import Link from 'next/link'

export default function Navigation() {
  return (
    <nav className="relative z-10 container mx-auto px-4 py-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
          <FileText className="w-6 h-6" />
        </div>
        <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          CV Builder Pro
        </span>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" asChild>
          <Link href="/auth">Login</Link>
        </Button>
        <Button className="gradient-primary hover:gradient-primary-hover transition-elegant" asChild>
          <Link href="/auth">Get Started</Link>
        </Button>
      </div>
    </nav>
  )
}
