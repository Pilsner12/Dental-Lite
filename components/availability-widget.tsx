"use client"

import { useState, useMemo } from "react"
import { addDays, format, startOfWeek, isSameDay } from "date-fns"
import { cs } from "date-fns/locale"
import { Calendar, Clock, Check, X, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Appointment {
  date: Date
  time: string
  status: string
}

export function AvailabilityWidget() {
  const [selectedDate, setSelectedDate] = useState(() => {
    // Start with Monday of current week
    const today = new Date()
    const weekStart = startOfWeek(today, { weekStartsOn: 1 })
    return weekStart
  })

  const weekStart = useMemo(() => startOfWeek(selectedDate, { weekStartsOn: 1 }), [selectedDate])

  // Load appointments from localStorage
  const appointments = useMemo(() => {
    if (typeof window === "undefined") return []
    const stored = localStorage.getItem("dental_appointments")
    if (!stored) return []

    try {
      const parsed = JSON.parse(stored)
      return parsed.map((apt: any) => ({
        ...apt,
        date: new Date(apt.date),
      }))
    } catch {
      return []
    }
  }, [])

  // Get available slots for a given date
  const getAvailableSlots = (date: Date): string[] => {
    const workingHours = {
      start: 8,
      end: 16,
      lunchStart: 12,
      lunchEnd: 13,
    }

    const slots: string[] = []

    // Skip weekends
    const dayOfWeek = date.getDay()
    if (dayOfWeek === 0 || dayOfWeek === 6) return slots

    for (let hour = workingHours.start; hour < workingHours.end; hour++) {
      // Skip lunch
      if (hour >= workingHours.lunchStart && hour < workingHours.lunchEnd) {
        continue
      }

      // Generate half-hour slots
      for (const minute of [0, 30]) {
        const timeSlot = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`

        // Check if slot is booked
        const isBooked = appointments.some(
          (apt: Appointment) => isSameDay(apt.date, date) && apt.time === timeSlot && apt.status !== "cancelled",
        )

        if (!isBooked) {
          slots.push(timeSlot)
        }
      }
    }

    return slots
  }

  const weekDates = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => addDays(weekStart, i))
  }, [weekStart])

  const availableSlots = useMemo(() => getAvailableSlots(selectedDate), [selectedDate, appointments])

  const goToPreviousWeek = () => {
    setSelectedDate((prev) => addDays(prev, -7))
  }

  const goToNextWeek = () => {
    setSelectedDate((prev) => addDays(prev, 7))
  }

  const handleBooking = (date: Date, time: string) => {
    // In real app, would open booking modal or navigate to booking page
    alert(`Rezervace na ${format(date, "d.M.yyyy")} v ${time}`)
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="h-6 w-6 text-blue-600" />
        <h3 className="text-2xl font-bold text-gray-900">Dostupnost termínů</h3>
      </div>

      {/* Week navigation */}
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
          ←
        </Button>
        <span className="font-medium text-gray-700">
          {format(weekDates[0], "d.M.")} - {format(weekDates[4], "d.M. yyyy")}
        </span>
        <Button variant="outline" size="sm" onClick={goToNextWeek}>
          →
        </Button>
      </div>

      {/* Day selector */}
      <div className="grid grid-cols-5 gap-2 mb-6">
        {weekDates.map((day) => {
          const isSelected = isSameDay(day, selectedDate)
          const slots = getAvailableSlots(day)

          return (
            <button
              key={day.toISOString()}
              onClick={() => setSelectedDate(day)}
              className={`p-3 rounded-lg border-2 transition ${
                isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
              }`}
            >
              <div className="text-sm font-medium text-gray-600">{format(day, "EEEE", { locale: cs })}</div>
              <div className="text-lg font-bold text-gray-900 mt-1">{format(day, "d.M.")}</div>
              <div className="mt-2">
                {slots.length > 0 ? (
                  <div className="flex items-center justify-center gap-1 text-xs text-green-700 bg-green-50 rounded px-2 py-1">
                    <Check className="h-3 w-3" />
                    <span className="font-medium">{slots.length} volno</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-1 text-xs text-red-700 bg-red-50 rounded px-2 py-1">
                    <X className="h-3 w-3" />
                    <span className="font-medium">Obsazeno</span>
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Available slots for selected day */}
      <div className="border-t pt-4">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="h-5 w-5 text-blue-600" />
          <h4 className="font-semibold text-gray-900">
            Volné termíny {format(selectedDate, "d.M.yyyy", { locale: cs })}:
          </h4>
        </div>

        {availableSlots.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <X className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-700 font-medium">Tento den nejsou žádné volné termíny</p>
            <p className="text-sm text-gray-500 mt-1">Zkuste jiný den nebo nás kontaktujte</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {availableSlots.map((slot) => (
              <button
                key={slot}
                className="p-3 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-center font-medium"
                onClick={() => handleBooking(selectedDate, slot)}
              >
                <Clock className="h-4 w-4 mx-auto mb-1 text-blue-600" />
                <div className="text-sm">{slot}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Contact section */}
      <div className="mt-6 pt-4 border-t">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button size="lg" className="gap-2">
            <Calendar className="h-5 w-5" />
            Objednat se online
          </Button>
          <div className="flex items-center gap-2 text-gray-600">
            <span>Nebo zavolejte:</span>
            <a
              href="tel:+420776123456"
              className="flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700"
            >
              <Phone className="h-4 w-4" />
              +420 776 123 456
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
