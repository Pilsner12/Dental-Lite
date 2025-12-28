"use client"

import { ReactNode, useState } from "react"
import { Lock } from "lucide-react"
import { useTier, Tier } from "@/lib/tier-context"
import { Badge } from "@/components/ui/badge"
import { UpgradeModal } from "@/components/upgrade-modal"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface LockedFeatureProps {
  feature: string
  children: ReactNode
  showBadge?: boolean
  showTooltip?: boolean
  className?: string
}

const tierNames: Record<Tier, string> = {
  basic: "ZÁKLADNÍ",
  business: "BUSINESS",
  profi: "PROFI",
}

export function LockedFeature({
  feature,
  children,
  showBadge = true,
  showTooltip = true,
  className = "",
}: LockedFeatureProps) {
  const { isFeatureLocked, getRequiredTier } = useTier()
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  
  const locked = isFeatureLocked(feature)
  const requiredTier = getRequiredTier(feature)

  if (!locked) {
    return <>{children}</>
  }

  const content = (
    <div
      className={`relative ${className}`}
      onClick={() => setShowUpgradeModal(true)}
    >
      {showBadge && requiredTier && (
        <Badge
          variant="secondary"
          className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full z-10 cursor-pointer hover:bg-amber-600 transition-colors"
        >
          <Lock className="w-3 h-3 inline mr-1" />
          {tierNames[requiredTier]}
        </Badge>
      )}
      <div className="opacity-50 cursor-not-allowed pointer-events-none">
        {children}
      </div>
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        requiredTier={requiredTier || "profi"}
        feature={feature}
      />
    </div>
  )

  if (!showTooltip || !requiredTier) {
    return content
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {content}
        </TooltipTrigger>
        <TooltipContent>
          <p>Dostupné v balíčku {tierNames[requiredTier]}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
