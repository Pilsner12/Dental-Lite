"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Phone, Clock, Calendar, Plus, User } from "lucide-react"
import { useWaitlist } from "@/lib/waitlist-context"
import { useState } from "react"

export default function WaitlistPage() {
  const { entries, markAsContacted } = useWaitlist()
  const [filter, setFilter] = useState<"all" | "waiting" | "contacted">("all")

  const filteredEntries = entries.filter((entry) => {
    if (filter === "all") return entry.status !== "scheduled" && entry.status !== "cancelled"
    if (filter === "waiting") return entry.status === "waiting"
    if (filter === "contacted") return entry.status === "contacted"
    return true
  })

  const getPriorityColor = (priority: string) => {
    if (priority === "high") return "bg-red-100 text-red-800"
    if (priority === "medium") return "bg-yellow-100 text-yellow-800"
    return "bg-gray-100 text-gray-600"
  }

  const getPriorityLabel = (priority: string) => {
    if (priority === "high") return "Vysoká"
    if (priority === "medium") return "Střední"
    return "Nízká"
  }

  const getDaysWaiting = (addedDate: string) => {
    return Math.floor((new Date().getTime() - new Date(addedDate).getTime()) / (1000 * 60 * 60 * 24))
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Čekatelé</h1>
        <p className="text-gray-600 mt-1">
          Pacienti čekající na volný termín
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Sestra má plnou kontrolu - žádné automatické SMS nebo emaily. Při uvolnění termínu zobrazíme 3 nejvhodnější kandidáty.
        </p>
      </div>

      {/* Akce a filtry */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            className={filter === "all" ? "bg-gray-900 hover:bg-gray-800" : ""}
          >
            Aktivní ({entries.filter((e) => e.status !== "scheduled" && e.status !== "cancelled").length})
          </Button>
          <Button
            variant={filter === "waiting" ? "default" : "outline"}
            onClick={() => setFilter("waiting")}
            className={filter === "waiting" ? "bg-gray-900 hover:bg-gray-800" : ""}
          >
            Čeká ({entries.filter((e) => e.status === "waiting").length})
          </Button>
          <Button
            variant={filter === "contacted" ? "default" : "outline"}
            onClick={() => setFilter("contacted")}
            className={filter === "contacted" ? "bg-gray-900 hover:bg-gray-800" : ""}
          >
            Kontaktováno ({entries.filter((e) => e.status === "contacted").length})
          </Button>
        </div>
        <Button className="bg-gray-900 hover:bg-gray-800">
          <Plus className="h-4 w-4 mr-2" />
          Přidat čekatele
        </Button>
      </div>

      {/* Seznam čekatelů */}
      <div className="grid grid-cols-1 gap-4">
        {filteredEntries.length === 0 ? (
          <Card className="border border-gray-100">
            <CardContent className="pt-6">
              <div className="text-center py-12 text-gray-400">
                Žádní čekatelé
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredEntries.map((entry) => {
            const daysWaiting = getDaysWaiting(entry.addedDate)

            return (
              <Card
                key={entry.id}
                className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-gray-900">{entry.patientName}</h3>
                            <Badge className={`${getPriorityColor(entry.priority)} text-xs px-2 py-0.5`}>
                              {getPriorityLabel(entry.priority)}
                            </Badge>
                            {entry.status === "contacted" && (
                              <Badge className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5">
                                Kontaktováno
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                            <Phone className="h-3.5 w-3.5" />
                            {entry.phone}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        {entry.preferredTime && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span>Preferuje: {entry.preferredTime}</span>
                          </div>
                        )}
                        {entry.preferredDays && entry.preferredDays.length > 0 && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span>
                              Dny:{" "}
                              {entry.preferredDays
                                .map((day) => {
                                  const dayMap: Record<string, string> = {
                                    monday: "Po",
                                    tuesday: "Út",
                                    wednesday: "St",
                                    thursday: "Čt",
                                    friday: "Pá",
                                  }
                                  return dayMap[day] || day
                                })
                                .join(", ")}
                            </span>
                          </div>
                        )}
                        {entry.note && (
                          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                            {entry.note}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="text-xs text-gray-400">
                          V čekárně {daysWaiting} {daysWaiting === 1 ? "den" : daysWaiting < 5 ? "dny" : "dní"}
                        </div>
                        <div className="flex items-center gap-2">
                          {entry.status === "waiting" ? (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => markAsContacted(entry.id)}
                                className="h-8"
                              >
                                Kontaktovat
                              </Button>
                              <Button
                                size="sm"
                                className="bg-gray-900 hover:bg-gray-800 h-8"
                              >
                                Přiřadit termín
                              </Button>
                            </>
                          ) : entry.status === "contacted" ? (
                            <Button
                              size="sm"
                              className="bg-gray-900 hover:bg-gray-800 h-8"
                            >
                              Přiřadit termín
                            </Button>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
