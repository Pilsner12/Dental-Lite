"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"

type AppointmentStatus = "confirmed" | "scheduled" | "completed"

interface Appointment {
  id: string
  time: string
  patient: string
  service: string
  status: AppointmentStatus
  phone: string
  notes: string
}

const appointments: Record<string, Appointment[]> = {
  "Pondělí 23.12": [
    {
      id: "1",
      time: "09:00",
      patient: "Jana Svobodová",
      service: "Preventivka",
      status: "completed",
      phone: "731 234 567",
      notes: "Pravidelná kontrola",
    },
    {
      id: "2",
      time: "10:30",
      patient: "Petr Novák",
      service: "Plomba",
      status: "confirmed",
      phone: "602 345 678",
      notes: "Pravá horní trojka",
    },
    {
      id: "3",
      time: "14:00",
      patient: "Eva Dvořáková",
      service: "Kámen",
      status: "scheduled",
      phone: "775 456 789",
      notes: "",
    },
  ],
  "Úterý 24.12": [
    {
      id: "4",
      time: "09:00",
      patient: "Martin Černý",
      service: "Kontrola",
      status: "scheduled",
      phone: "608 567 890",
      notes: "Štědrý den - zkrácená ordinace",
    },
    {
      id: "5",
      time: "10:00",
      patient: "Lucie Procházková",
      service: "Bělení",
      status: "scheduled",
      phone: "732 678 901",
      notes: "",
    },
  ],
  "Středa 25.12": [],
  "Čtvrtek 26.12": [],
  "Pátek 27.12": [
    {
      id: "6",
      time: "08:30",
      patient: "Tomáš Veselý",
      service: "Preventivka",
      status: "confirmed",
      phone: "775 012 345",
      notes: "",
    },
    {
      id: "7",
      time: "09:30",
      patient: "Barbora Horáková",
      service: "Plomba",
      status: "scheduled",
      phone: "603 123 456",
      notes: "",
    },
    {
      id: "8",
      time: "11:00",
      patient: "Jakub Kučera",
      service: "Extrakce",
      status: "scheduled",
      phone: "731 234 567",
      notes: "Konzultace před výkonem",
    },
    {
      id: "9",
      time: "14:00",
      patient: "Tereza Němcová",
      service: "Hygiena",
      status: "scheduled",
      phone: "602 345 678",
      notes: "",
    },
    {
      id: "10",
      time: "15:00",
      patient: "David Šmíd",
      service: "Kontrola",
      status: "scheduled",
      phone: "775 456 789",
      notes: "",
    },
  ],
}

const timeSlots = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
]

const statusColors = {
  confirmed: "bg-blue-100 text-blue-700 border-blue-300",
  scheduled: "bg-yellow-100 text-yellow-700 border-yellow-300",
  completed: "bg-green-100 text-green-700 border-green-300",
}

const statusLabels = {
  confirmed: "Potvrzeno",
  scheduled: "Objednáno",
  completed: "Dorazil",
}

const statusIcons = {
  confirmed: "⏱️",
  scheduled: "📅",
  completed: "✅",
}

export default function CalendarPage() {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)

  const days = Object.keys(appointments)
  const closedDays = ["Středa 25.12", "Čtvrtek 26.12"]
  const currentDay = "Pátek 27.12"

  const getAppointmentForSlot = (day: string, time: string) => {
    return appointments[day]?.find((apt) => apt.time === time)
  }

  const isLunchBreak = (time: string) => {
    return time === "12:00" || time === "12:30"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kalendář objednávek</h1>
          <p className="text-gray-600 mt-1">Týden 23. - 27. prosince 2024</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Předchozí týden
          </Button>
          <Button variant="outline" size="sm">
            Tento týden
          </Button>
          <Button variant="outline" size="sm">
            Další týden
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 ml-4">
            <Plus className="w-4 h-4 mr-2" />
            Přidat termín
          </Button>
        </div>
      </div>

      <div className="flex gap-3">
        <Badge className={statusColors.completed}>✅ Dorazil</Badge>
        <Badge className={statusColors.confirmed}>⏱️ Potvrzeno</Badge>
        <Badge className={statusColors.scheduled}>📅 Objednáno</Badge>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <div className="min-w-[1000px]">
              {/* Header Row */}
              <div className="grid grid-cols-6 gap-2 mb-2">
                <div className="font-semibold text-sm text-gray-600 p-2">Čas</div>
                {days.map((day) => (
                  <div
                    key={day}
                    className={`font-semibold text-sm p-2 rounded-t-lg ${
                      day === currentDay ? "bg-blue-100 text-blue-900" : "text-gray-900"
                    }`}
                  >
                    {day}
                    {day === currentDay && <span className="ml-2 text-xs">(dnes)</span>}
                    {closedDays.includes(day) && <div className="text-xs font-normal text-red-600">ZAVŘENO</div>}
                  </div>
                ))}
              </div>

              {/* Time Slots */}
              {timeSlots.map((time) => {
                const isLunch = isLunchBreak(time)
                return (
                  <div key={time} className="grid grid-cols-6 gap-2 border-t border-gray-200">
                    <div className="text-sm text-gray-600 p-2 font-medium">{time}</div>
                    {days.map((day) => {
                      const isClosed = closedDays.includes(day)
                      const appointment = getAppointmentForSlot(day, time)

                      if (isClosed) {
                        return (
                          <div key={`${day}-${time}`} className="p-1">
                            <div className="h-16 bg-gray-100 rounded-md"></div>
                          </div>
                        )
                      }

                      if (isLunch) {
                        return (
                          <div key={`${day}-${time}`} className="p-1">
                            <div className="h-16 bg-gray-50 rounded-md flex items-center justify-center text-xs text-gray-500">
                              Polední pauza
                            </div>
                          </div>
                        )
                      }

                      return (
                        <div key={`${day}-${time}`} className="p-1">
                          {appointment ? (
                            <button
                              onClick={() => setSelectedAppointment(appointment)}
                              className={`w-full text-left p-2 rounded-md border text-xs hover:shadow-md transition-shadow ${
                                statusColors[appointment.status]
                              }`}
                            >
                              <div className="font-semibold truncate flex items-center gap-1">
                                <span>{statusIcons[appointment.status]}</span>
                                {appointment.patient}
                              </div>
                              <div className="truncate text-gray-700">{appointment.service}</div>
                            </button>
                          ) : (
                            <div className="h-16 hover:bg-gray-50 rounded-md transition-colors cursor-pointer"></div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedAppointment} onOpenChange={() => setSelectedAppointment(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detail objednávky</DialogTitle>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-600">Pacient</div>
                <div className="font-semibold text-lg">{selectedAppointment.patient}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Služba</div>
                <div className="font-medium">{selectedAppointment.service}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Čas</div>
                <div className="font-medium">{selectedAppointment.time}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Telefon</div>
                <div className="font-medium">{selectedAppointment.phone}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Stav</div>
                <Badge className={statusColors[selectedAppointment.status]}>
                  {statusIcons[selectedAppointment.status]} {statusLabels[selectedAppointment.status]}
                </Badge>
              </div>
              {selectedAppointment.notes && (
                <div>
                  <div className="text-sm text-gray-600">Poznámky</div>
                  <div className="font-medium">{selectedAppointment.notes}</div>
                </div>
              )}
              <div className="flex gap-2 pt-4">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700">Uložit</Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  Zrušit
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
