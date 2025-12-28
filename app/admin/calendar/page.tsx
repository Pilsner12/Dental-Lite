"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Plus, CalendarIcon, Eye } from "lucide-react"
import { useAppointments, type Appointment } from "@/lib/appointment-context"
import { useOfficeHours } from "@/lib/office-hours-context"
import { AddAppointmentModal } from "@/components/add-appointment-modal"
import { AppointmentDetailModal } from "@/components/appointment-detail-modal"

const DAYS = ["Po", "Út", "St", "Čt", "Pá"]
const HOURS = Array.from({ length: 13 }, (_, i) => i + 7) // 7:00 - 19:00

const STATUS_COLORS = {
  confirmed: "bg-green-100 border-green-400 text-green-900",
  pending: "bg-amber-100 border-amber-400 text-amber-900",
  completed: "bg-blue-100 border-blue-400 text-blue-900",
  cancelled: "bg-gray-100 border-gray-400 text-gray-700",
  "no-show": "bg-red-100 border-red-400 text-red-900",
  blocked: "bg-purple-100 border-purple-400 text-purple-900",
}

const STATUS_LABELS = {
  confirmed: "Potvrzeno",
  pending: "Čeká",
  completed: "Dokončeno",
  cancelled: "Zrušeno",
  "no-show": "Nedostavil se",
  blocked: "Neordinuje se",
}

export default function CalendarPage() {
  const { getAppointmentsByDateRange, updateAppointment } = useAppointments()
  const { isTimeSlotAvailable: checkSlotAvailable } = useOfficeHours()

  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedSlot, setSelectedSlot] = useState<{ date: Date; time: string } | null>(null)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [viewMode, setViewMode] = useState<"week" | "day">("week")

  const weekStart = useMemo(() => {
    const date = new Date(currentDate)
    const day = date.getDay()
    const diff = day === 0 ? -6 : 1 - day
    date.setDate(date.getDate() + diff)
    date.setHours(0, 0, 0, 0)
    return date
  }, [currentDate])

  const weekDates = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => {
      const date = new Date(weekStart)
      date.setDate(weekStart.getDate() + i)
      return date
    })
  }, [weekStart])

  const visibleDates = useMemo(() => {
    if (viewMode === "day") {
      return [currentDate]
    }
    return weekDates
  }, [viewMode, currentDate, weekDates])

  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 4)
  const appointments = getAppointmentsByDateRange(weekStart, weekEnd)

  const goToPrevious = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() - (viewMode === "week" ? 7 : 1))
    setCurrentDate(newDate)
  }

  const goToNext = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + (viewMode === "week" ? 7 : 1))
    setCurrentDate(newDate)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const formatDateRange = () => {
    if (viewMode === "day") {
      return currentDate.toLocaleDateString("cs-CZ", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    }
    const start = weekDates[0]
    const end = weekDates[4]
    return `${start.getDate()}. ${start.toLocaleDateString("cs-CZ", { month: "long" })} - ${end.getDate()}. ${end.toLocaleDateString("cs-CZ", { month: "long", year: "numeric" })}`
  }

  const isSlotAvailable = (date: Date, hour: number) => {
    const dayOfWeek = date.getDay()
    if (dayOfWeek === 0 || dayOfWeek === 6) return false

    const dayIndex = dayOfWeek - 1
    const dayNames: Array<"monday" | "tuesday" | "wednesday" | "thursday" | "friday"> = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
    ]
    const time = `${String(hour).padStart(2, "0")}:00`
    return checkSlotAvailable(dayNames[dayIndex], time)
  }

  const getSlotAppointments = (date: Date, hour: number): Appointment[] => {
    return appointments.filter((apt) => {
      const aptDate = new Date(apt.date)
      if (
        aptDate.getFullYear() !== date.getFullYear() ||
        aptDate.getMonth() !== date.getMonth() ||
        aptDate.getDate() !== date.getDate()
      ) {
        return false
      }

      const [aptHour, aptMinute] = apt.time.split(":").map(Number)
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

  const handleSlotClick = (date: Date, hour: number) => {
    if (!isSlotAvailable(date, hour)) return

    const slotAppointments = getSlotAppointments(date, hour)
    if (slotAppointments.length > 0) {
      setSelectedAppointment(slotAppointments[0])
      setShowDetailModal(true)
    } else {
      setSelectedSlot({
        date,
        time: `${String(hour).padStart(2, "0")}:00`,
      })
      setShowAddModal(true)
    }
  }

  const calculateAppointmentStyle = (apt: Appointment, hour: number) => {
    const [aptHour, aptMinute] = apt.time.split(":").map(Number)
    const aptStartMinutes = aptHour * 60 + aptMinute
    const slotStartMinutes = hour * 60

    const offsetMinutes = aptStartMinutes - slotStartMinutes
    const top = (offsetMinutes / 60) * 100
    const height = (apt.duration / 60) * 100

    return {
      top: `${top}%`,
      height: `${Math.min(height, 100 - top)}%`,
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

  const isWeekend = (date: Date) => {
    const day = date.getDay()
    return day === 0 || day === 6
  }

  const handleConfirmAppointment = (aptId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    updateAppointment(aptId, { status: "confirmed" })
  }

  const handleCompleteAppointment = (aptId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    updateAppointment(aptId, { status: "completed" })
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Diář</h1>
          <Button onClick={() => setShowAddModal(true)} size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            Přidat termín
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={goToPrevious}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={goToToday}>
                Dnes
              </Button>
              <Button variant="outline" size="sm" onClick={goToNext}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2 border-l pl-4">
              <Button
                variant={viewMode === "week" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("week")}
              >
                <CalendarIcon className="h-4 w-4 mr-1" />
                Týden
              </Button>
              <Button variant={viewMode === "day" ? "default" : "outline"} size="sm" onClick={() => setViewMode("day")}>
                <Eye className="h-4 w-4 mr-1" />
                Jen dnes
              </Button>
            </div>
            <div className="font-medium text-gray-700">{formatDateRange()}</div>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-4 text-sm flex-wrap">
          {Object.entries(STATUS_LABELS).map(([status, label]) => (
            <div key={status} className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-sm border-2 ${STATUS_COLORS[status as keyof typeof STATUS_COLORS].split(" ").slice(0, 2).join(" ")}`}
              ></div>
              <span className="text-gray-700">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 overflow-auto">
        <div className="min-w-[800px]">
          {/* Day headers */}
          <div
            className={`grid ${viewMode === "day" ? "grid-cols-2" : "grid-cols-6"} border-b bg-gray-50 sticky top-0 z-10`}
          >
            <div className="p-2 border-r bg-white"></div>
            {visibleDates.map((date, i) => {
              const dayIndex = viewMode === "day" ? (date.getDay() === 0 ? 6 : date.getDay() - 1) : i
              return (
                <div
                  key={i}
                  className={`p-3 text-center border-r ${
                    isToday(date) ? "bg-blue-50 border-2 border-blue-400 font-bold" : ""
                  }`}
                >
                  <div className="text-sm text-gray-600">{DAYS[dayIndex]}</div>
                  <div className={`text-lg ${isToday(date) ? "text-blue-600" : ""}`}>
                    {date.getDate()}.{date.getMonth() + 1}.
                  </div>
                </div>
              )
            })}
          </div>

          {/* Time slots */}
          {HOURS.map((hour) => (
            <div
              key={hour}
              className={`grid ${viewMode === "day" ? "grid-cols-2" : "grid-cols-6"} border-b`}
              style={{ minHeight: "80px" }}
            >
              <div className="p-2 border-r text-sm text-gray-600 bg-gray-50 flex items-start justify-end font-medium">
                {String(hour).padStart(2, "0")}:00
              </div>
              {visibleDates.map((date, dayIndex) => {
                const available = isSlotAvailable(date, hour)
                const slotAppointments = getSlotAppointments(date, hour)

                return (
                  <div
                    key={dayIndex}
                    onClick={() => handleSlotClick(date, hour)}
                    className={`border-r relative ${
                      available
                        ? "bg-white hover:bg-blue-50 cursor-pointer transition-colors"
                        : "bg-gray-100 cursor-not-allowed"
                    } ${isToday(date) ? "border-l-4 border-l-blue-500" : ""}`}
                  >
                    {slotAppointments.map((apt) => {
                      const [aptHour] = apt.time.split(":").map(Number)
                      if (aptHour !== hour) return null

                      const style = calculateAppointmentStyle(apt, hour)
                      const statusColor = STATUS_COLORS[apt.status] || STATUS_COLORS.pending

                      return (
                        <div
                          key={apt.id}
                          className={`absolute left-1 right-1 p-2 rounded border-l-[3px] ${statusColor} overflow-hidden z-20 cursor-pointer shadow-sm hover:shadow-md transition-all`}
                          style={style}
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedAppointment(apt)
                            setShowDetailModal(true)
                          }}
                        >
                          <div className="flex flex-col gap-0.5">
                            <div className="font-semibold text-sm leading-tight truncate">{apt.patientName}</div>
                            <div className="text-xs font-medium opacity-90 truncate">{apt.service}</div>
                            <div className="text-[10px] opacity-70 mt-0.5">
                              {apt.time} • {apt.duration} min
                            </div>
                          </div>

                          {apt.status === "pending" && (
                            <div className="mt-1.5 pt-1.5 border-t border-current/20">
                              <button
                                className="text-[10px] bg-green-600 text-white px-2 py-0.5 rounded hover:bg-green-700 transition font-medium"
                                onClick={(e) => handleConfirmAppointment(apt.id, e)}
                              >
                                Potvrdit
                              </button>
                            </div>
                          )}

                          {apt.status === "confirmed" && (
                            <div className="mt-1.5 pt-1.5 border-t border-current/20">
                              <button
                                className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded hover:bg-blue-700 transition font-medium"
                                onClick={(e) => handleCompleteAppointment(apt.id, e)}
                              >
                                Dokončit
                              </button>
                            </div>
                          )}
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
