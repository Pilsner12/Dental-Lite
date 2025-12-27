"use client"

import Link from "next/link"
import { Settings2 } from "lucide-react"

interface VersionBadgeProps {
  version: "ZÁKLADNÍ" | "BUSINESS" | "PROFI"
}

export function VersionBadge({ version }: VersionBadgeProps) {
  return (
    <div className="bg-slate-900 text-white py-2 px-4 sticky top-0 z-50 shadow-md">
      <div className="container mx-auto flex items-center justify-center gap-3 text-sm">
        <Settings2 className="w-4 h-4" />
        <span className="font-medium">DEMO MODE - Verze: {version}</span>
        <span className="text-slate-400">|</span>
        <Link href="/" className="text-blue-400 hover:text-blue-300 underline">
          Změnit verzi
        </Link>
      </div>
    </div>
  )
}
