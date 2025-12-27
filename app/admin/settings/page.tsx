"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit, Trash2, Eye, Plus } from "lucide-react"
import { Switch } from "@/components/ui/switch"

interface Service {
  id: string
  name: string
  price: number
}

interface Announcement {
  id: string
  text: string
}

interface TeamMember {
  id: string
  name: string
  role: string
  email: string
  phone: string
  workDays: string
  access?: string
}

interface EmailTemplate {
  id: string
  name: string
  subject: string
  body: string
  enabled: boolean
}

interface SmsTemplate {
  id: string
  name: string
  text: string
  enabled: boolean
}

export default function SettingsPage() {
  const [services, setServices] = useState<Service[]>([
    { id: "1", name: "Preventivní prohlídka", price: 800 },
    { id: "2", name: "Zubní výplň (plomba)", price: 1500 },
    { id: "3", name: "Odstranění zubního kamene", price: 1200 },
    { id: "4", name: "Bělení zubů", price: 3500 },
    { id: "5", name: "Kořenové ošetření", price: 2800 },
    { id: "6", name: "Extrakce zubu", price: 1000 },
  ])

  const [announcements, setAnnouncements] = useState<Announcement[]>([
    { id: "1", text: "Ordinace 24.12. zavřeno (Štědrý den)" },
    { id: "2", text: "Nový ceník od ledna 2025" },
  ])

  const [teamMembers] = useState<TeamMember[]>([
    {
      id: "1",
      name: "MUDr. Jana Nováková",
      role: "Zubař",
      email: "jana.novakova@ordinace.cz",
      phone: "+420 776 123 456",
      workDays: "Po-Pá",
    },
    {
      id: "2",
      name: "Bc. Petra Svobodová",
      role: "Sestra/Recepce",
      email: "petra.svobodova@ordinace.cz",
      phone: "+420 732 654 321",
      workDays: "Po-Pá",
      access: "Recepce",
    },
  ])

  const [emailTemplates] = useState<EmailTemplate[]>([
    {
      id: "1",
      name: "Potvrzení objednávky",
      subject: "Potvrzení vaší objednávky - Zubní ordinace",
      body: "Dobrý den {jmeno},\n\npotvrzujeme vaši objednávku na {datum} v {cas}.\n\nTěšíme se na vás!",
      enabled: true,
    },
    {
      id: "2",
      name: "Připomínka termínu",
      subject: "Připomínka termínu - zítra v {cas}",
      body: "Dobrý den {jmeno},\n\npřipomínáme váš termín zítra {datum} v {cas}.\n\nDěkujeme.",
      enabled: true,
    },
    {
      id: "3",
      name: "Poděkování po návštěvě",
      subject: "Děkujeme za návštěvu",
      body: "Dobrý den {jmeno},\n\nděkujeme za dnešní návštěvu. V případě dotazů nás neváhejte kontaktovat.",
      enabled: true,
    },
    {
      id: "4",
      name: "Připomínka preventivky (6 měsíců)",
      subject: "Čas na preventivní prohlídku",
      body: "Dobrý den {jmeno},\n\nod vaší poslední návštěvy uplynulo 6 měsíců. Doporučujeme objednat se na preventivní prohlídku.",
      enabled: false,
    },
  ])

  const [smsTemplates] = useState<SmsTemplate[]>([
    {
      id: "1",
      name: "Připomínka termínu",
      text: "Pripominame termin zitra {datum} v {cas}. Zubni ordinace MUDr. Novakova",
      enabled: true,
    },
    {
      id: "2",
      name: "Potvrzení rezervace",
      text: "Vas termin {datum} v {cas} byl potvrzen. Dekujeme, ordinace MUDr. Novakova",
      enabled: true,
    },
    {
      id: "3",
      name: "Zrušení termínu",
      text: "Vas termin {datum} v {cas} byl zrusen. Pro novy termin volejte 377 123 456.",
      enabled: true,
    },
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Nastavení</h1>
        <p className="text-gray-600 mt-1">Správa služeb a provozních údajů</p>
      </div>

      <Tabs defaultValue="pricing" className="space-y-4">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="pricing">Ceník</TabsTrigger>
          <TabsTrigger value="announcements">Aktuality</TabsTrigger>
          <TabsTrigger value="hours">Ordinační hodiny</TabsTrigger>
          <TabsTrigger value="team">Tým</TabsTrigger>
          <TabsTrigger value="email">Email šablony</TabsTrigger>
          <TabsTrigger value="sms">SMS šablony</TabsTrigger>
        </TabsList>

        {/* Pricing Tab */}
        <TabsContent value="pricing">
          <Card>
            <CardHeader>
              <CardTitle>Ceník služeb</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Služba</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Cena</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Akce</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((service) => (
                      <tr key={service.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">{service.name}</td>
                        <td className="py-3 px-4 font-medium">{service.price} Kč</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Přidat službu
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Announcements Tab */}
        <TabsContent value="announcements">
          <Card>
            <CardHeader>
              <CardTitle>Aktuality pro pacienty</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {announcements.map((announcement) => (
                  <div key={announcement.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">{announcement.text}</div>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Přidat aktualitu
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Opening Hours Tab */}
        <TabsContent value="hours">
          <Card>
            <CardHeader>
              <CardTitle>Ordinační hodiny</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {["Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota", "Neděle"].map((day) => {
                  const isClosed = day === "Sobota" || day === "Neděle"
                  return (
                    <div key={day} className="flex items-center gap-4">
                      <div className="w-28 font-medium text-gray-700">{day}</div>
                      {isClosed ? (
                        <div className="text-red-600 font-medium">❌ Zavřeno</div>
                      ) : (
                        <>
                          <Input type="time" defaultValue="08:00" className="w-32" />
                          <span className="text-gray-500">-</span>
                          <Input type="time" defaultValue="16:00" className="w-32" />
                          <div className="flex items-center gap-2">
                            <Switch defaultChecked />
                            <span className="text-sm text-gray-600">✅ Zapnuto</span>
                          </div>
                        </>
                      )}
                    </div>
                  )
                })}
                <div className="pt-4 border-t">
                  <div className="flex items-center gap-4">
                    <div className="w-28 font-medium text-gray-700">Polední pauza</div>
                    <Input type="time" defaultValue="12:00" className="w-32" />
                    <span className="text-gray-500">-</span>
                    <Input type="time" defaultValue="13:00" className="w-32" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team">
          <Card>
            <CardHeader>
              <CardTitle>Tým ordinace</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {teamMembers.map((member) => (
                  <Card key={member.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{member.name}</CardTitle>
                      <p className="text-sm text-gray-600">{member.role}</p>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="text-sm">
                        <span className="text-gray-600">Email:</span> {member.email}
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Telefon:</span> {member.phone}
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Pracovní dny:</span> {member.workDays}
                      </div>
                      {member.access && (
                        <div className="text-sm">
                          <span className="text-gray-600">Přístup:</span> {member.access}
                        </div>
                      )}
                      <Button variant="outline" size="sm" className="w-full mt-2 bg-transparent">
                        Upravit
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Přidat člena týmu
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Templates Tab */}
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email šablony</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {emailTemplates.map((template) => (
                  <div key={template.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-gray-900">{template.name}</div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Upravit
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Náhled
                        </Button>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">Předmět: {template.subject}</div>
                    <div className="text-sm text-gray-500 line-clamp-2">{template.body}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SMS Templates Tab */}
        <TabsContent value="sms">
          <Card>
            <CardHeader>
              <CardTitle>SMS šablony</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {smsTemplates.map((template) => (
                  <div key={template.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-gray-900">{template.name}</div>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Upravit
                      </Button>
                    </div>
                    <div className="text-sm text-gray-600">{template.text}</div>
                    <div className="text-xs text-gray-500 mt-1">Délka: {template.text.length} znaků</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
