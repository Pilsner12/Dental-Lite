"use client"

import { useTier, Tier } from "@/lib/tier-context"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect, useRef } from "react"
import { GripVertical } from "lucide-react"

export function TierSelector() {
  const { tier, setTier } = useTier()
  const [position, setPosition] = useState({ x: 0, y: 16 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const elementRef = useRef<HTMLDivElement>(null)

  const tiers: { value: Tier; label: string; icon: string }[] = [
    { value: "basic", label: "V1 Základní", icon: "📄" },
    { value: "business", label: "V2 Business", icon: "💼" },
    { value: "profi", label: "V3 Profi", icon: "🚀" },
  ]

  // Load position from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("demo-selector-position")
    if (saved) {
      setPosition(JSON.parse(saved))
    } else {
      // Default to top-right
      setPosition({ x: window.innerWidth - 500, y: 16 })
    }
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect()
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      })
      setIsDragging(true)
    }
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragOffset.x
        const newY = e.clientY - dragOffset.y

        // Keep within viewport
        const maxX = window.innerWidth - (elementRef.current?.offsetWidth || 0)
        const maxY = window.innerHeight - (elementRef.current?.offsetHeight || 0)

        const boundedX = Math.max(0, Math.min(newX, maxX))
        const boundedY = Math.max(0, Math.min(newY, maxY))

        setPosition({ x: boundedX, y: boundedY })
      }
    }

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false)
        localStorage.setItem("demo-selector-position", JSON.stringify(position))
      }
    }

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, dragOffset, position])

  return (
    <div
      ref={elementRef}
      className="fixed z-[99999] bg-white rounded-lg shadow-xl border-2 border-blue-200 backdrop-blur-sm bg-white/95"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'default'
      }}
    >
      <div className="flex items-center gap-2 p-3">
        <button
          type="button"
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded"
          onMouseDown={handleMouseDown}
          aria-label="Přetáhnout DEMO selektor"
          title="Přetáhnout DEMO selektor"
        >
          <GripVertical className="w-4 h-4 text-gray-400" />
        </button>
        <span className="text-xs font-bold text-blue-600 px-2 uppercase tracking-wide">DEMO</span>
        <div className="flex gap-1.5">
          {tiers.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setTier(t.value)}
              className={`
                px-3 py-2 rounded-md text-xs font-semibold transition-all whitespace-nowrap
                ${
                  tier === t.value
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/50 scale-105"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:scale-105"
                }
              `}
            >
              <span className="mr-1.5">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
