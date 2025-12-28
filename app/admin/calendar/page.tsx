"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { useAppointments, Appointment } from "@/lib/appointment-context"
import { useOfficeHours } from "@/lib/office-hours-context"
import { AddAppointmentModal } from "@/components/add-appointment-modal"
import { AppointmentDetailModal } from "@/components/appointment-detail-modal"
import { OfficeHoursDisplay } from "@/components/office-hours-display"

const DAYS = ["Po", "Út", "St", "Čt", "Pá", "So", "Ne"]
const HOURS = Array.from({ length: 13 }, (_, i) => i + 7) // 7:00 - 19:00

const STATUS_COLORS = {
  confirmed: "bg-green-100 border-green-300 text-green-800",
  pending: "bg-yellow-100 border-yellow-300 text-yellow-800",
  completed: "bg-blue-100 border-blue-300 text-blue-800",
  cancelled: "bg-gray-100 border-gray-300 text-gray-600",
  "no-show": "bg-red-100 border-red-300 text-red-800"
}

export default function CalendarPage() {
  const { getAppointmentsByDateRange } = useAppointments()
  const { officeHours, isTimeSlotAvailable: checkSlotAvailable } = useOfficeHours()
  
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedSlot, setSelectedSlot] = useState<{ date: Date; time: string } | null>(null)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)

  // Get start of week (Monday)
  const weekStart = useMemo(() => {
    const date = new Date(currentDate)
    const day = date.getDay()
    const diff = day === 0 ? -6 : 1 - day
    date.setDate(date.getDate() + diff)
    date.setHours(0, 0, 0, 0)
    return date
  }, [currentDate])

  // Get week dates
  const weekDates = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(weekStart)
      date.setDate(weekStart.getDate() + i)
      return date
    })
  }, [weekStart])

  // Get appointments for the week
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6)
  const appointments = getAppointmentsByDateRange(weekStart, weekEnd)

  // Navigate weeks
  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() - 7)
    setCurrentDate(newDate)
  }

  const goToNextWeek = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + 7)
    setCurrentDate(newDate)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  // Format week range
  const formatWeekRange = () => {
    const start = weekDates[0]
    const end = weekDates[6]
    return `${start.getDate()}. ${start.toLocaleDateString('cs-CZ', { month: 'long' })} - ${end.getDate()}. ${end.toLocaleDateString('cs-CZ', { month: 'long', year: 'numeric' })}`
  }

  // Check if time slot is in working hours
  const isSlotAvailable = (date: Date, hour: number) => {
    const dayOfWeek = date.getDay() === 0 ? 6 : date.getDay() - 1 // Convert to Mon=0, Sun=6
    const dayNames: Array<"monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday"> = 
      ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
    const time = `${String(hour).padStart(2, '0')}:00`
    return checkSlotAvailable(dayNames[dayOfWeek], time)
  }

  // Get appointments for specific slot
  const getSlotAppointments = (date: Date, hour: number): Appointment[] => {
    return appointments.filter(apt => {
      const aptDate = new Date(apt.date)
      if (
        aptDate.getFullYear() !== date.getFullYear() ||
        aptDate.getMonth() !== date.getMonth() ||
        aptDate.getDate() !== date.getDate()
      ) {
        return false
      }

      const [aptHour, aptMinute] = apt.time.split(':').map(Number)
      const aptStartMinutes = aptHour * 60 + aptMinute
      const aptEndMinutes = aptStartMinutes + apt.duration
      const slotStartMinutes = hour * 60
      const slotEndMinutes = (hour + 1) * 60

      return (
        (aptStartMinutes >= slotStartMinutes && aptStartMinutes < slotEndMinutes) ||
        (aptEndMinutes > slotStartMinutes && aptEndMinutes <= slotEndMinutes) ||
        (aptStartMinutes <= slotStartMinutes && aptEndMinutes >= slotEndMinutes)
      )
    })
  }

  // Handle slot click
  const handleSlotClick = (date: Date, hour: number) => {
    if (!isSlotAvailable(date, hour)) return
    
    const slotAppointments = getSlotAppointments(date, hour)
    if (slotAppointments.length > 0) {
      setSelectedAppointment(slotAppointments[0])
      setShowDetailModal(true)
    } else {
      setSelectedSlot({
        date,
        time: `${String(hour).padStart(2, '0')}:00`
      })
      setShowAddModal(true)
    }
  }

  // Calculate appointment position and height
  const calculateAppointmentStyle = (apt: Appointment, hour: number) => {
    const [aptHour, aptMinute] = apt.time.split(':').map(Number)
    const aptStartMinutes = aptHour * 60 + aptMinute
    const slotStartMinutes = hour * 60
    
    const offsetMinutes = aptStartMinutes - slotStartMinutes
    const top = (offsetMinutes / 60) * 100
    const height = (apt.duration / 60) * 100

    return {
      top: `${top}%`,
      height: `${Math.min(height, 100 - top)}%`
    }
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Kalendář objednávek</h1>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Přidat termín
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={goToToday}>
                Tento týden
              </Button>
              <Button variant="outline" size="sm" onClick={goToNextWeek}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="font-medium">{formatWeekRange()}</div>
          </div>

          <OfficeHoursDisplay />
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-100 border border-green-300"></div>
            <span>Potvrzeno</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-yellow-100 border border-yellow-300"></div>
            <span>Čeká</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-blue-100 border border-blue-300"></div>
            <span>Dokončeno</span>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 overflow-auto">
        <div className="min-w-[800px]">
          {/* Day headers */}
          <div className="grid grid-cols-8 border-b bg-gray-50 sticky top-0 z-10">
            <div className="p-2 border-r bg-white"></div>
            {weekDates.map((date, i) => (
              <div
                key={i}
                className={`p-3 text-center border-r ${
                  isToday(date) ? 'bg-blue-50 font-bold' : ''
                }`}
              >
                <div className="text-sm text-gray-600">{DAYS[i]}</div>
                <div className={`text-lg ${isToday(date) ? 'text-blue-600' : ''}`}>
                  {date.getDate()}.{date.getMonth() + 1}.
                </div>
              </div>
            ))}
          </div>

          {/* Time slots */}
          {HOURS.map(hour => (
            <div key={hour} className="grid grid-cols-8 border-b" style={{ minHeight: '80px' }}>
              <div className="p-2 border-r text-sm text-gray-600 bg-gray-50 flex items-start justify-end">
                {String(hour).padStart(2, '0')}:00
              </div>
              {weekDates.map((date, dayIndex) => {
                const available = isSlotAvailable(date, hour)
                const slotAppointments = getSlotAppointments(date, hour)

                return (
                  <div
                    key={dayIndex}
                    onClick={() => handleSlotClick(date, hour)}
                    className={`border-r relative ${
                      available
                        ? 'bg-white hover:bg-blue-50 cursor-pointer'
                        : 'bg-gray-100 cursor-not-allowed'
                    }`}
                  >
                    {slotAppointments.map(apt => {
                      const [aptHour] = apt.time.split(':').map(Number)
                      if (aptHour !== hour) return null

                      const style = calculateAppointmentStyle(apt, hour)
                      const statusColor = STATUS_COLORS[apt.status] || STATUS_COLORS.pending

                      return (
                        <div
                          key={apt.id}
                          className={`absolute left-1 right-1 p-2 rounded border ${statusColor} text-xs overflow-hidden z-20`}
                          style={style}
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedAppointment(apt)
                            setShowDetailModal(true)
                          }}
                        >
                          <div className="font-medium truncate">{apt.patientName}</div>
                          <div className="truncate">{apt.service}</div>
                          <div className="text-[10px] opacity-75">{apt.time}</div>
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <AddAppointmentModal
        open={showAddModal}
        onClose={() => {
          setShowAddModal(false)
          setSelectedSlot(null)
        }}
        prefilledDate={selectedSlot?.date}
        prefilledTime={selectedSlot?.time}
      />

      <AppointmentDetailModal
        open={showDetailModal}
        onClose={() => {
          setShowDetailModal(false)
          setSelectedAppointment(null)
        }}
        appointment={selectedAppointment}
      />
    </div>
  )
}
