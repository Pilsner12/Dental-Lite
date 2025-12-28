"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CheckCircle2, AlertCircle } from "lucide-react"

interface PatientData {
  firstName: string
  lastName: string
  phone: string
  email: string
  address?: {
    street: string
    city: string
    zip: string
  }
}

export default function VerifyContactPage() {
  const params = useParams()
  const token = params.token as string

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [patientData, setPatientData] = useState<PatientData>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: {
      street: "",
      city: "",
      zip: ""
    }
  })

  useEffect(() => {
    // TODO: Fetch patient data based on token
    // For now, using mock data
    setTimeout(() => {
      // Simulate fetching patient data
      setPatientData({
        firstName: "Jana",
        lastName: "Svobodová",
        phone: "+420 731 234 567",
        email: "jana.svobodova@email.cz",
        address: {
          street: "Hlavní 45",
          city: "Plzeň",
          zip: "301 00"
        }
      })
      setLoading(false)
    }, 500)
  }, [token])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // TODO: Send updated data to server
    setTimeout(() => {
      setSuccess(true)
      setLoading(false)
    }, 1000)
  }

  const handleChange = (field: string, value: string) => {
    if (field.startsWith("address.")) {
      const addressField = field.split(".")[1]
      setPatientData(prev => ({
        ...prev,
        address: {
          ...prev.address!,
          [addressField]: value
        }
      }))
    } else {
      setPatientData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  if (loading && !patientData.firstName) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <CardContent className="p-8 text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Chyba</h2>
            <p className="text-gray-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <CardContent className="p-8 text-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Úspěšně ověřeno!</h2>
            <p className="text-gray-600 mb-6">
              Vaše kontaktní údaje byly úspěšně aktualizovány a ověřeny.
            </p>
            <p className="text-sm text-gray-500">
              Děkujeme za aktualizaci vašich údajů. Můžete toto okno zavřít.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Ověření kontaktních údajů</CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              Prosím zkontrolujte a případně aktualizujte své kontaktní údaje. Po uložení budou vaše údaje označeny jako ověřené.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jméno
                  </label>
                  <Input
                    required
                    value={patientData.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                    placeholder="Zadejte jméno"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Příjmení
                  </label>
                  <Input
                    required
                    value={patientData.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                    placeholder="Zadejte příjmení"
                  />
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon
                  </label>
                  <Input
                    required
                    type="tel"
                    value={patientData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="+420 xxx xxx xxx"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <Input
                    required
                    type="email"
                    value={patientData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="vas@email.cz"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Adresa</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ulice a číslo popisné
                  </label>
                  <Input
                    value={patientData.address?.street || ""}
                    onChange={(e) => handleChange("address.street", e.target.value)}
                    placeholder="Např. Hlavní 123"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Město
                    </label>
                    <Input
                      value={patientData.address?.city || ""}
                      onChange={(e) => handleChange("address.city", e.target.value)}
                      placeholder="Město"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PSČ
                    </label>
                    <Input
                      value={patientData.address?.zip || ""}
                      onChange={(e) => handleChange("address.zip", e.target.value)}
                      placeholder="000 00"
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? "Ukládám..." : "Uložit a ověřit údaje"}
                </Button>
              </div>

              <p className="text-xs text-gray-500 text-center">
                Pokud jsou vaše údaje správné, nemusíte nic měnit - stačí kliknout na "Uložit a ověřit údaje".
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
