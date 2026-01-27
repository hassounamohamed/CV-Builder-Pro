import { FileText } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-slate-200 glass-effect">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold text-slate-900">CV Builder Pro</span>
          </div>
          <p className="text-slate-600 text-sm">
            © 2026 CV Builder Pro. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
