"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"

export type Tier = "basic" | "business" | "profi"

interface TierContextType {
  tier: Tier
  setTier: (tier: Tier) => void
  features: string[]
  hasFeature: (feature: string) => boolean
  isFeatureLocked: (feature: string) => boolean
  getRequiredTier: (feature: string) => Tier | null
}

/**
 * LEAN TIER DISTRIBUTION
 * 
 * BASIC (malá ordinace - lékař + sestra):
 * - Veřejný web, kontakt, info
 * - Admin přístup
 * - Kalendář/diář s termíny
 * - Správa pacientů (zjednodušená)
 * - Ordinační hodiny
 * - Nastavení základní
 * - Dashboard (dnešní přehled)
 * - Urgentní termíny
 * - Patient quick view tooltip
 * 
 * BUSINESS (rozšíření):
 * - Vše z BASIC +
 * - API dostupnost termínů (pro online rezervace)
 * - Čekatelna (waiting list)
 * - SMS připomínky
 * - Export dat
 * 
 * PROFI (profesionální):
 * - Vše z BUSINESS +
 * - Multi-user (více lékařů)
 * - Notifikace a automatizace
 * - Pokročilé statistiky
 * - Integrace třetích stran
 * - Více křesel/pokojů
 */

const tierFeatures: Record<Tier, string[]> = {
  basic: [
    // Veřejný web
    "public_web",
    "contact_form",
    "opening_hours",
    "team_info",
    "services_info",
    
    // Admin - základní
    "admin_access",
    "admin_dashboard",
    "calendar",
    "patients",
    "inventory",
    "settings_basic",
    "urgent_appointments",
    "patient_quick_view",
  ],
  business: [
    // Vše z BASIC
    "public_web",
    "contact_form",
    "opening_hours",
    "team_info",
    "services_info",
    "admin_access",
    "admin_dashboard",
    "calendar",
    "patients",
    "inventory",
    "settings_basic",
    "urgent_appointments",
    "patient_quick_view",
    
    // BUSINESS rozšíření
    "api_availability", // API pro online rezervace
    "waitlist",
    "sms_reminders",
    "basic_export",
    "basic_stats",
  ],
  profi: [
    // Vše z BUSINESS
    "public_web",
    "contact_form",
    "opening_hours",
    "team_info",
    "services_info",
    "admin_access",
    "admin_dashboard",
    "calendar",
    "patients",
    "settings_basic",
    "urgent_appointments",
    "patient_quick_view",
    "inventory",
    "api_availability",
    "waitlist",
    "sms_reminders",
    "basic_export",
    "basic_stats",
    
    // PROFI rozšíření
    "multi_user",
    "users_management",
    "notifications",
    "automation",
    "advanced_stats",
    "integrations",
    "advanced_export",
    "multiple_chairs",
    "settings_advanced",
  ],
}

const featureToTier: Record<string, Tier> = {
  // BASIC tier - vše pro malou ordinaci
  public_web: "basic",
  contact_form: "basic",
  opening_hours: "basic",
  team_info: "basic",
  services_info: "basic",
  admin_access: "basic",
  admin_dashboard: "basic",
  calendar: "basic",
  patients: "basic",
  inventory: "basic",
  settings_basic: "basic",
  urgent_appointments: "basic",
  patient_quick_view: "basic",
  
  // BUSINESS tier - rozšíření pro větší provoz
  api_availability: "business",
  waitlist: "business",
  sms_reminders: "business",
  basic_export: "business",
  basic_stats: "business",
  
  // PROFI tier - profesionální funkce
  multi_user: "profi",
  users_management: "profi",
  notifications: "profi",
  automation: "profi",
  advanced_stats: "profi",
  integrations: "profi",
  advanced_export: "profi",
  multiple_chairs: "profi",
  settings_advanced: "profi",
}

const TierContext = createContext<TierContextType | undefined>(undefined)

export function TierProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [tier, setTierState] = useState<Tier>("basic")
  const [mounted, setMounted] = useState(false)

  // Initialize tier from URL or localStorage
  useEffect(() => {
    setMounted(true)
    const urlTier = searchParams.get("tier") as Tier | null
    const storedTier = localStorage.getItem("demo_tier") as Tier | null

    if (urlTier && ["basic", "business", "profi"].includes(urlTier)) {
      setTierState(urlTier)
      localStorage.setItem("demo_tier", urlTier)
    } else if (storedTier && ["basic", "business", "profi"].includes(storedTier)) {
      setTierState(storedTier)
      // Update URL to match stored tier
      const params = new URLSearchParams(searchParams.toString())
      params.set("tier", storedTier)
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    } else {
      // Default to basic
      setTierState("basic")
      localStorage.setItem("demo_tier", "basic")
      const params = new URLSearchParams(searchParams.toString())
      params.set("tier", "basic")
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    }
  }, [])

  const setTier = (newTier: Tier) => {
    setTierState(newTier)
    localStorage.setItem("demo_tier", newTier)
    
    // Update URL
    const params = new URLSearchParams(searchParams.toString())
    params.set("tier", newTier)
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const hasFeature = (feature: string): boolean => {
    return tierFeatures[tier]?.includes(feature) ?? false
  }

  const isFeatureLocked = (feature: string): boolean => {
    return !hasFeature(feature)
  }

  const getRequiredTier = (feature: string): Tier | null => {
    return featureToTier[feature] ?? null
  }

  const value: TierContextType = {
    tier,
    setTier,
    features: tierFeatures[tier] || [],
    hasFeature,
    isFeatureLocked,
    getRequiredTier,
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return null
  }

  return <TierContext.Provider value={value}>{children}</TierContext.Provider>
}

export function useTier() {
  const context = useContext(TierContext)
  if (context === undefined) {
    throw new Error("useTier must be used within a TierProvider")
  }
  return context
}
