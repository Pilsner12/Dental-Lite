import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function LoginPage() {
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
          <Link href="/v2" className="block text-center">
            <Button variant="ghost" className="w-full text-blue-600 hover:text-blue-700">
              Zpět na web
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
