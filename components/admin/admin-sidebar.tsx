"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calendar, Users, Settings, BarChart3, Menu, X, Lock, LayoutDashboard, Clock, UserCog } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useTier } from "@/lib/tier-context"

const navigation = [
  { name: "Přehled", href: "/admin/dashboard", icon: LayoutDashboard, feature: "admin_dashboard" },
  { name: "Diář", href: "/admin/calendar", icon: Calendar, feature: "calendar" },
  { name: "Pacienti", href: "/admin/patients", icon: Users, feature: "patients" },
  { name: "Čekatelé", href: "/admin/waitlist", icon: Clock, feature: "waitlist" },
  { name: "Uživatelé", href: "/admin/users", icon: UserCog, feature: "users" },
  { name: "Nastavení", href: "/admin/settings", icon: Settings, feature: "settings_basic" },
  { name: "Statistiky", href: "/admin/stats", icon: BarChart3, feature: "advanced_stats" },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { hasFeature, isFeatureLocked, tier } = useTier()

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-blue-600">Admin Dashboard</h1>
        <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r border-gray-200
          transition-transform duration-300
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-200">
            <Link href="/admin/calendar">
              <h1 className="text-2xl font-bold text-blue-600">Zubní ordinace</h1>
              <p className="text-sm text-gray-600 mt-1">Digitální diář</p>
            </Link>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              const locked = isFeatureLocked(item.feature)

              return (
                <Link
                  key={item.name}
                  href={locked ? "#" : item.href}
                  onClick={(e) => {
                    if (locked) {
                      e.preventDefault()
                    } else {
                      setIsMobileMenuOpen(false)
                    }
                  }}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative
                    ${locked ? "opacity-50 cursor-not-allowed" : ""}
                    ${isActive && !locked ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700 hover:bg-gray-100"}
                  `}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                  {locked && (
                    <Badge className="ml-auto bg-amber-500 text-white text-xs px-2 py-0.5">
                      <Lock className="w-3 h-3 inline mr-1" />
                      PROFI
                    </Badge>
                  )}
                </Link>
              )
            })}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <Link href={tier === "profi" ? "/v3" : tier === "business" ? "/v2" : "/v1"}>
              <Button variant="outline" className="w-full bg-transparent">
                Zpět na web
              </Button>
            </Link>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Spacer for mobile header */}
      <div className="h-16 lg:hidden" />
    </>
  )
}
