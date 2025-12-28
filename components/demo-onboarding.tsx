"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export function DemoOnboarding() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Show onboarding after a brief delay
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full p-8 relative animate-in fade-in zoom-in duration-300">
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="text-5xl mb-4">☎️</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Představte si...</h2>
          <p className="text-lg text-slate-700 mb-6 leading-relaxed">
            Právě volá pacient.
            <br />
            Sestra otevře diář, zapíše termín a má hotovo.
          </p>
          <Button onClick={() => setIsVisible(false)} className="w-full">
            Začít prohlížet demo
          </Button>
        </div>
      </div>
    </div>
  )
}
