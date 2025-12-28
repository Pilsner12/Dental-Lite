"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select } from "@/components/ui/select"
import { Clock, Users, Phone, Mail, Calendar, Edit, Trash2 } from "lucide-react"

interface WaitlistEntry {
  id: string
  patient: {
    name: string
    phone: string
    email: string
    age: number
  }
  preferences: {
    services: string[]
    timeSlots: string[]
    days: string[]
    maxWaitDays: number
  }
  priority: "low" | "normal" | "high" | "urgent"
  addedAt: Date
  lastNotified?: Date
  notes?: string
  status: "waiting" | "notified" | "booked" | "expired"
}

export default function WaitlistPage() {
  const [entries] = useState<WaitlistEntry[]>([
    {
      id: "1",
      patient: {
        name: "Eva Malá",
        phone: "+420 731 234 567",
        email: "eva.mala@email.cz",
        age: 34,
      },
      preferences: {
        services: ["Preventivka", "Hygiena"],
        timeSlots: ["morning"],
        days: ["monday", "wednesday", "friday"],
        maxWaitDays: 14,
      },
      priority: "urgent",
      addedAt: new Date("2025-01-20"),
      notes: "Preferuje dr. Nováková, má fóbii z jehel",
      status: "waiting",
    },
    {
      id: "2",
      patient: {
        name: "Martin Černý",
        phone: "+420 732 345 678",
        email: "martin.cerny@email.cz",
        age: 45,
      },
      preferences: {
        services: ["Hygiena"],
        timeSlots: ["afternoon", "evening"],
        days: ["tuesday", "thursday"],
        maxWaitDays: 7,
      },
      priority: "high",
      addedAt: new Date("2025-01-22"),
      status: "waiting",
    },
    {
      id: "3",
      patient: {
        name: "Lucie Procházková",
        phone: "+420 733 456 789",
        email: "lucie.p@email.cz",
        age: 28,
      },
      preferences: {
        services: ["Bělení"],
        timeSlots: ["morning", "afternoon"],
        days: ["monday", "tuesday", "wednesday", "thursday", "friday"],
        maxWaitDays: 30,
      },
      priority: "normal",
      addedAt: new Date("2025-01-18"),
      lastNotified: new Date("2025-01-25"),
      status: "notified",
    },
    {
      id: "4",
      patient: {
        name: "Petr Svoboda",
        phone: "+420 734 567 890",
        email: "petr.svoboda@email.cz",
        age: 52,
      },
      preferences: {
        services: ["Plomba", "Preventivka"],
        timeSlots: ["morning"],
        days: ["monday", "friday"],
        maxWaitDays: 10,
      },
      priority: "normal",
      addedAt: new Date("2025-01-23"),
      status: "waiting",
    },
  ])

  const getPriorityBadge = (priority: WaitlistEntry["priority"]) => {
    const styles = {
      urgent: "bg-red-600 text-white",
      high: "bg-orange-500 text-white",
      normal: "bg-blue-500 text-white",
      low: "bg-gray-400 text-white",
    }

    const labels = {
      urgent: "URGENTNÍ",
      high: "Vysoká",
      normal: "Normální",
      low: "Nízká",
    }

    return <Badge className={styles[priority]}>{labels[priority]}</Badge>
  }

  const getTimeSlotLabel = (slot: string) => {
    const labels: Record<string, string> = {
      morning: "Ráno",
      afternoon: "Odpoledne",
      evening: "Večer",
    }
    return labels[slot] || slot
  }

  const getDayLabel = (day: string) => {
    const labels: Record<string, string> = {
      monday: "Po",
      tuesday: "Út",
      wednesday: "St",
      thursday: "Čt",
      friday: "Pá",
      saturday: "So",
      sunday: "Ne",
    }
    return labels[day] || day
  }

  const formatRelativeTime = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Dnes"
    if (diffDays === 1) return "Včera"
    if (diffDays < 7) return `Před ${diffDays} dny`
    if (diffDays < 30) return `Před ${Math.floor(diffDays / 7)} týdny`
    return `Před ${Math.floor(diffDays / 30)} měsíci`
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Seznam čekatelů</h1>
          <p className="text-gray-600 mt-1">Pacienti čekající na volný termín</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Notifikovat všechny</Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Users className="w-4 h-4 mr-2" />
            Přidat čekatele
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Celkem čekatelů</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{entries.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Urgentní</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {entries.filter((e) => e.priority === "urgent").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Vysoká priorita</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {entries.filter((e) => e.priority === "high").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Notifikováno</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {entries.filter((e) => e.status === "notified").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <Input placeholder="Hledat jméno..." className="flex-1" />
        <select className="border rounded-lg px-3 py-2">
          <option>Všechny služby</option>
          <option>Preventivka</option>
          <option>Plomba</option>
          <option>Hygiena</option>
        </select>
        <select className="border rounded-lg px-3 py-2">
          <option>Všechny priority</option>
          <option>Urgentní</option>
          <option>Vysoká</option>
          <option>Normální</option>
        </select>
        <select className="border rounded-lg px-3 py-2">
          <option>Od nejstarších</option>
          <option>Podle priority</option>
        </select>
      </div>

      {/* Waitlist Table */}
      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-sm">Pacient</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">Služby</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">Priorita</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">Čeká</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">Akce</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium">{entry.patient.name}</div>
                      <div className="text-sm text-gray-500 mt-1">{entry.patient.phone}</div>
                      {entry.notes && (
                        <div className="text-xs text-gray-600 mt-1">{entry.notes}</div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {entry.preferences.services.map((s) => (
                          <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4">{getPriorityBadge(entry.priority)}</td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-gray-600">{formatRelativeTime(entry.addedAt)}</div>
                      {entry.lastNotified && (
                        <div className="text-xs text-green-600 mt-1">
                          ✓ Notifikován {formatRelativeTime(entry.lastNotified)}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" title="Odeslat SMS">
                          📱
                        </Button>
                        <Button size="sm" variant="outline" title="Objednat termín">
                          <Calendar className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" title="Upravit">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-red-600" title="Odstranit">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
