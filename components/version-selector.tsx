"use client"
import { Check, X, Info } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

export function VersionSelector() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="max-w-7xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Vítejte v DEMO aplikaci – Zubní ordinace
          </h1>
          <p className="text-2xl text-slate-700 mb-2 font-medium">Papírový diář, jen klidnější.</p>
          <p className="text-lg text-slate-600">Digitální řešení pro malé zubní ordinace</p>
        </div>

        {/* Version Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* V1 - Basic */}
          <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-slate-200 hover:border-blue-400 transition-all">
            <div className="text-4xl mb-4">🌐</div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Základní</h2>
            <p className="text-slate-600 mb-2">Online vizitka ordinace</p>
            <p className="text-sm text-slate-500 mb-6 italic">Vhodné pro ordinace, které chtějí být vidět online.</p>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <span className="text-sm">Profesionální webová prezentace</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <span className="text-sm">Jasné informace pro pacienty</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <span className="text-sm">Ordinační hodiny a ceník</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <span className="text-sm">Kontaktní formulář</span>
              </li>
            </ul>

            <Link href="/v1">
              <Button className="w-full">Podívat se, jak to funguje</Button>
            </Link>
          </div>

          {/* V2 - Business */}
          <div className="bg-white rounded-lg shadow-xl p-8 border-2 border-blue-500 hover:border-blue-600 transition-all relative">
            <Badge className="absolute top-4 right-4 bg-blue-600">DOPORUČENO</Badge>
            <div className="text-4xl mb-4">📅</div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Business</h2>
            <p className="text-slate-600 mb-2">Digitální diář pro sestru</p>
            <p className="text-sm text-slate-500 mb-6 italic">Nejčastější volba pro malé ordinace.</p>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <span className="text-sm">Vše ze Základní</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <span className="text-sm">Přehledný diář pro sestru</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <span className="text-sm">Jednoduchý přehled pacientů</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <span className="text-sm">Úprava ordinačních hodin a ceníku</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <span className="text-sm">SMS připomenutí termínů</span>
              </li>
            </ul>

            <Link href="/v2">
              <Button className="w-full shadow-lg shadow-blue-500/50">Ukázat diář v praxi</Button>
            </Link>
          </div>

          {/* V3 - Pro */}
          <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-slate-200 hover:border-blue-400 transition-all">
            <div className="text-4xl mb-4">🚀</div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Profi</h2>
            <p className="text-slate-600 mb-2">Vše + online objednávání</p>
            <p className="text-sm text-slate-500 mb-6 italic">Pro ordinace, které chtějí jít o krok dál.</p>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <span className="text-sm">Vše z Business</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <span className="text-sm">Objednání pacientů s vaším schválením</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <span className="text-sm">Připomenutí preventivních prohlídek</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <span className="text-sm">Základní přehled vytíženosti</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <span className="text-sm">Možnost exportu dat</span>
              </li>
            </ul>

            <Link href="/v3">
              <Button className="w-full">Vyzkoušet pohledem sestry</Button>
            </Link>
          </div>
        </div>

        {/* Comparison Link */}
        <div className="text-center">
          <ComparisonModal />
        </div>
      </div>
    </div>
  )
}

function ComparisonModal() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" className="text-blue-600 hover:text-blue-700" disabled>
        <Info className="w-4 h-4 mr-2" />
        Srovnat verze
      </Button>
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="text-blue-600 hover:text-blue-700">
          <Info className="w-4 h-4 mr-2" />
          Srovnat verze
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Srovnání verzí</DialogTitle>
        </DialogHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-semibold">Funkce</th>
                <th className="text-center p-3 font-semibold">V1</th>
                <th className="text-center p-3 font-semibold">V2</th>
                <th className="text-center p-3 font-semibold">V3</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Webová prezentace", v1: true, v2: true, v3: true },
                { name: "Kontaktní formulář", v1: true, v2: true, v3: true },
                { name: "Admin přístup", v1: false, v2: true, v3: true },
                { name: "Kalendář termínů", v1: false, v2: true, v3: true },
                { name: "Evidence pacientů", v1: false, v2: true, v3: true },
                { name: "SMS připomenutí termínů", v1: false, v2: true, v3: true },
                { name: "Úprava ceníku/hodin", v1: false, v2: true, v3: true },
                { name: "Online objednávání", v1: false, v2: false, v3: true },
                { name: "Schvalování rezervací", v1: false, v2: false, v3: true },
                { name: "Marketing automatizace", v1: false, v2: false, v3: true },
                { name: "Pokročilé statistiky", v1: false, v2: false, v3: true },
                { name: "Více křesel", v1: false, v2: false, v3: true },
                { name: "Integrace (platby, účetní)", v1: false, v2: false, v3: true },
                { name: "Export dat", v1: false, v2: false, v3: true },
              ].map((feature, idx) => (
                <tr key={idx} className="border-b hover:bg-slate-50">
                  <td className="p-3">{feature.name}</td>
                  <td className="p-3 text-center">
                    {feature.v1 ? (
                      <Check className="w-5 h-5 text-green-600 inline" />
                    ) : (
                      <X className="w-5 h-5 text-slate-300 inline" />
                    )}
                  </td>
                  <td className="p-3 text-center">
                    {feature.v2 ? (
                      <Check className="w-5 h-5 text-green-600 inline" />
                    ) : (
                      <X className="w-5 h-5 text-slate-300 inline" />
                    )}
                  </td>
                  <td className="p-3 text-center">
                    {feature.v3 ? (
                      <Check className="w-5 h-5 text-green-600 inline" />
                    ) : (
                      <X className="w-5 h-5 text-slate-300 inline" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  )
}
