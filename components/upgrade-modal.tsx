"use client"

import { Check } from "lucide-react"
import { useTier, Tier } from "@/lib/tier-context"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  requiredTier: Tier
  feature: string
}

const tierInfo: Record<Tier, {
  name: string
  icon: string
  setup: string
  monthly: string
  features: string[]
}> = {
  basic: {
    name: "Základní",
    icon: "📄",
    setup: "9 900 Kč",
    monthly: "290 Kč/měs",
    features: [
      "Moderní webová prezentace",
      "Kontaktní formulář",
      "Ordinační hodiny",
      "Mapa a kontakty",
    ],
  },
  business: {
    name: "Business",
    icon: "💼",
    setup: "29 900 Kč",
    monthly: "1 490 Kč/měs",
    features: [
      "Vše ze Základní",
      "Admin kalendář",
      "Evidence pacientů",
      "SMS připomínky",
      "Editace obsahu",
      "Základní statistiky",
    ],
  },
  profi: {
    name: "Profi",
    icon: "🚀",
    setup: "49 900 Kč",
    monthly: "2 490 Kč/měs",
    features: [
      "Vše z Business",
      "Online objednávání",
      "Automatizace",
      "Pokročilé statistiky",
      "Integrace a export",
      "Schvalování rezervací",
    ],
  },
}

const featureNames: Record<string, string> = {
  admin_access: "Admin přístup",
  online_booking: "Online objednávání",
  booking_approval: "Schvalování rezervací",
  advanced_stats: "Pokročilé statistiky",
  automation: "Automatizace",
  integrations: "Integrace",
  advanced_export: "Pokročilý export",
}

export function UpgradeModal({ isOpen, onClose, requiredTier, feature }: UpgradeModalProps) {
  const { setTier, tier: currentTier } = useTier()
  const info = tierInfo[requiredTier]
  const featureName = featureNames[feature] || feature

  const handleUpgrade = () => {
    setTier(requiredTier)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="text-4xl mb-2 text-center">{info.icon}</div>
          <DialogTitle className="text-center text-2xl">
            {featureName}
          </DialogTitle>
          <DialogDescription className="text-center">
            Tato funkce je dostupná v balíčku <strong>{info.name}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="font-semibold text-slate-900 mb-3">
              V balíčku {info.name} získáte:
            </h3>
            <ul className="space-y-2">
              {info.features.map((feat, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700">{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-sm text-slate-600">Jednorázový setup</div>
            <div className="text-2xl font-bold text-slate-900">{info.setup}</div>
            <div className="text-sm text-slate-600 mt-2">Měsíční poplatek</div>
            <div className="text-xl font-semibold text-blue-600">{info.monthly}</div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
          >
            Zpět
          </Button>
          <Button
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            onClick={handleUpgrade}
          >
            Přepnout na {info.name} demo
          </Button>
        </div>

        <p className="text-xs text-center text-slate-500">
          Demo režim - žádné platby se neúčtují
        </p>
      </DialogContent>
    </Dialog>
  )
}
