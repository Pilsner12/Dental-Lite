"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit, Trash2, Eye, Plus, Lock, Mail, MessageSquare, Users, Zap, Puzzle, Grid } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { useTier } from "@/lib/tier-context"
import { OfficeHoursEditor } from "@/components/office-hours-editor"

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
  const { hasFeature, isFeatureLocked } = useTier()
  
  const settingsTabs = [
    { id: "pricing", label: "Ceník služeb", feature: "settings_basic", locked: false },
    { id: "announcements", label: "Aktuality", feature: "settings_basic", locked: false },
    { id: "hours", label: "Ordinační hodiny", feature: "settings_basic", locked: false },
    { id: "email", label: "Email šablony", feature: "settings_advanced", locked: isFeatureLocked("settings_advanced") },
    { id: "sms", label: "SMS šablony", feature: "settings_advanced", locked: isFeatureLocked("settings_advanced") },
    { id: "team", label: "Tým", feature: "settings_advanced", locked: isFeatureLocked("settings_advanced") },
    { id: "automation", label: "Automatizace", feature: "automation", locked: isFeatureLocked("automation") },
    { id: "integrations", label: "Integrace", feature: "integrations", locked: isFeatureLocked("integrations") },
    { id: "chairs", label: "Více křesel", feature: "multiple_chairs", locked: isFeatureLocked("multiple_chairs") },
  ]
  
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
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Nastavení</h1>
        <p className="text-gray-600 mt-1">Správa služeb a provozních údajů</p>
      </div>

      <Tabs defaultValue="pricing" className="space-y-4">
        <TabsList className="flex-wrap h-auto">
          {settingsTabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              disabled={tab.locked}
              className={tab.locked ? "relative opacity-50 cursor-not-allowed" : ""}
            >
              {tab.locked && (
                <Badge className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  <Lock className="w-2.5 h-2.5 inline mr-0.5" />
                  PROFI
                </Badge>
              )}
              {tab.label}
            </TabsTrigger>
          ))}
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
                  <div key={announcement.id} className="flex items-center justify-between p-4 border rounded-lg">
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
              <p className="text-sm text-gray-600 mt-1">
                Nastavte pracovní dobu pro jednotlivé dny v týdnu
              </p>
            </CardHeader>
            <CardContent>
              <OfficeHoursEditor />
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

        {/* Automation Tab - PROFI ONLY */}
        <TabsContent value="automation">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Automatizace
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Automatické připomínky a kampaně pro pacienty
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Preventive Reminder */}
                <div className="bg-white border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <Switch defaultChecked />
                      <div>
                        <h4 className="font-medium">Připomínka preventivní prohlídky</h4>
                        <p className="text-sm text-gray-500">
                          Odeslat po 6 měsících od poslední návštěvy
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="bg-gray-50 rounded p-3 mb-3 text-sm">
                    📅 Odeslat po <strong>6 měsících</strong> od poslední návštěvy
                    <br />
                    📱 Kanál: Email, SMS
                  </div>
                  <div className="grid grid-cols-4 gap-3 text-sm">
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <div className="font-semibold text-blue-600">142</div>
                      <div className="text-gray-600">Odesláno</div>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded">
                      <div className="font-semibold text-green-600">98</div>
                      <div className="text-gray-600">Otevřeno</div>
                    </div>
                    <div className="text-center p-2 bg-purple-50 rounded">
                      <div className="font-semibold text-purple-600">45</div>
                      <div className="text-gray-600">Kliknuto</div>
                    </div>
                    <div className="text-center p-2 bg-orange-50 rounded">
                      <div className="font-semibold text-orange-600">23</div>
                      <div className="text-gray-600">Objednáno</div>
                    </div>
                  </div>
                </div>

                {/* Birthday */}
                <div className="bg-white border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <Switch defaultChecked />
                      <div>
                        <h4 className="font-medium">Narozeninové přání + sleva</h4>
                        <p className="text-sm text-gray-500">
                          Pošle narozeninové přání 7 dní před narozeninami
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="bg-gray-50 rounded p-3 mb-3 text-sm">
                    🎂 Odeslat <strong>7 dní</strong> před narozeninami
                    <br />
                    🎁 Sleva: <strong>10%</strong> na hygienu
                  </div>
                </div>

                {/* Review Request */}
                <div className="bg-white border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <Switch defaultChecked />
                      <div>
                        <h4 className="font-medium">Žádost o hodnocení</h4>
                        <p className="text-sm text-gray-500">
                          Požádá o hodnocení 2 dny po návštěvě
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="bg-gray-50 rounded p-3 mb-3 text-sm">
                    ⭐ Odeslat <strong>2 dny</strong> po návštěvě
                  </div>
                </div>

                <Button className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Přidat automatizační pravidlo
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Tab - PROFI ONLY */}
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Puzzle className="w-5 h-5" />
                Integrace
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Propojení s externími službami
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center">
                      📧
                    </div>
                    <div>
                      <h4 className="font-medium">Google Calendar</h4>
                      <p className="text-sm text-gray-500">Synchronizace termínů</p>
                    </div>
                  </div>
                  <Button variant="outline">Připojit</Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded flex items-center justify-center">
                      💬
                    </div>
                    <div>
                      <h4 className="font-medium">WhatsApp Business</h4>
                      <p className="text-sm text-gray-500">Automatické zprávy</p>
                    </div>
                  </div>
                  <Button variant="outline">Připojit</Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded flex items-center justify-center">
                      📊
                    </div>
                    <div>
                      <h4 className="font-medium">Google Analytics</h4>
                      <p className="text-sm text-gray-500">Sledování návštěvnosti</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Připojeno</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Multiple Chairs Tab - PROFI ONLY */}
        <TabsContent value="chairs">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Grid className="w-5 h-5" />
                Více křesel
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Správa více pracovišť / zubních křesel
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-medium">Křeslo 1 - Hlavní ordinace</h4>
                      <p className="text-sm text-gray-500">MUDr. Jana Nováková</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Aktivní</Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    Po-Pá: 8:00-16:00
                  </div>
                </div>

                <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                  <Button className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Přidat další křeslo
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">
                    Rozšiřte kapacitu ordinace o další pracovní místa
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
