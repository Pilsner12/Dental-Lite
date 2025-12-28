"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check, Lock } from "lucide-react"
import Link from "next/link"
import { useTier } from "@/lib/tier-context"

export default function LoginPage() {
  const { tier, hasFeature, setTier } = useTier()
  const hasAdminAccess = hasFeature("admin_access")

  // V1 (Basic) - No admin access
  if (!hasAdminAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="text-5xl mb-3">🔒</div>
            <CardTitle className="text-2xl font-bold text-slate-900">Admin přístup</CardTitle>
            <CardDescription>Admin panel je dostupný od balíčku BUSINESS</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 mb-3">Co získáte v BUSINESS:</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <span className="text-sm">Správa termínů v kalendáři</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <span className="text-sm">Evidence pacientů</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <span className="text-sm">SMS připomínky</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <span className="text-sm">Editace obsahu webu</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-sm text-slate-600">Setup 29 900 Kč</div>
              <div className="text-xl font-semibold text-blue-600">1 490 Kč/měs</div>
            </div>

            <Button
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={() => setTier("business")}
            >
              Přepnout na BUSINESS demo
            </Button>

            <Link href="/" className="block text-center">
              <Button variant="ghost" className="w-full text-blue-600 hover:text-blue-700">
                Zpět na výběr balíčků
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // V2 (Business) and V3 (Profi) - Admin access granted
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-blue-600">Admin přístup</CardTitle>
          <CardDescription>Přihlaste se do administrace</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="admin@ordinace.cz" disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Heslo</Label>
            <Input id="password" type="password" placeholder="••••••••" disabled />
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-700">
            DEMO režim - žádné přihlášení nutné
          </div>
          <Link href="/admin/dashboard" className="block">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-6">Vstoupit do demo</Button>
          </Link>
          <Link href={tier === "profi" ? "/v3" : "/v2"} className="block text-center">
            <Button variant="ghost" className="w-full text-blue-600 hover:text-blue-700">
              Zpět na web
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
