"use client"

import { useState } from "react"
import { X, Info } from "lucide-react"

export function AnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="bg-blue-50 border-b border-blue-200 py-3 px-4">
      <div className="container mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <p className="text-sm md:text-base text-blue-900">
            Ordinace 24.12. zavřeno (Štědrý den) | Těšíme se na vás 27.12.
          </p>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
          aria-label="Zavřít oznámení"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
