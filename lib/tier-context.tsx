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

const tierFeatures: Record<Tier, string[]> = {
  basic: [
    "public_web",
    "contact_form",
    "opening_hours",
    "team_info",
    "services_info",
  ],
  business: [
    "public_web",
    "contact_form",
    "opening_hours",
    "team_info",
    "services_info",
    "admin_access",
    "calendar",
    "patients",
    "users",
    "settings_basic",
    "basic_stats",
    "sms_reminders",
    "content_editing",
  ],
  profi: [
    "public_web",
    "contact_form",
    "opening_hours",
    "team_info",
    "services_info",
    "admin_access",
    "admin_dashboard",
    "calendar",
    "patients",
    "users",
    "settings_basic",
    "settings_advanced",
    "basic_stats",
    "sms_reminders",
    "content_editing",
    "online_booking",
    "booking_approval",
    "advanced_stats",
    "automation",
    "integrations",
    "advanced_export",
    "waitlist",
    "multiple_chairs",
  ],
}

const featureToTier: Record<string, Tier> = {
  // Basic features
  public_web: "basic",
  contact_form: "basic",
  opening_hours: "basic",
  team_info: "basic",
  services_info: "basic",
  
  // Business features
  admin_access: "business",
  calendar: "business",
  patients: "business",
  users: "business",
  settings_basic: "business",
  basic_stats: "business",
  sms_reminders: "business",
  content_editing: "business",
  
  // Profi features
  admin_dashboard: "profi",
  settings_advanced: "profi",
  online_booking: "profi",
  booking_approval: "profi",
  advanced_stats: "profi",
  automation: "profi",
  integrations: "profi",
  advanced_export: "profi",
  waitlist: "profi",
  multiple_chairs: "profi",
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
