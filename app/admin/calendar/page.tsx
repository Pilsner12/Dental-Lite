"use client"

import type React from "react"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Plus, CalendarIcon, Eye, AlertCircle, X } from "lucide-react"
import { useAppointments, type Appointment, type HistoryEntry } from "@/lib/appointment-context"
import { useOfficeHours } from "@/lib/office-hours-context"
import { AddAppointmentModal } from "@/components/add-appointment-modal"
import { AppointmentDetailModal } from "@/components/appointment-detail-modal"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { MOCK_PATIENTS } from "@/lib/mock-patients"
import { showToast } from "@/components/ui/toast"
import Link from "next/link"

const DAYS = ["Po", "Út", "St", "Čt", "Pá"]
const HOURS = Array.from({ length: 13 }, (_, i) => i + 7) // 7:00 - 19:00

const STATUS_COLORS = {
  confirmed: "bg-white border-gray-900",
  pending: "bg-white border-gray-300",
  completed: "bg-gray-50 border-gray-200",
  cancelled: "bg-gray-50 border-gray-200",
  "no-show": "bg-white border-gray-400",
  blocked: "bg-gray-100 border-gray-300",
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
  const { getAppointmentsByDateRange, updateAppointment, undoChange, history, addToHistory } = useAppointments()
  const { isTimeSlotAvailable: checkSlotAvailable } = useOfficeHours()

  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedSlot, setSelectedSlot] = useState<{ date: Date; time: string } | null>(null)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [viewMode, setViewMode] = useState<"week" | "day">("week")
  const [draggedAppointment, setDraggedAppointment] = useState<Appointment | null>(null)
  const [originalPosition, setOriginalPosition] = useState<{ date: Date; time: string } | null>(null)
  const [dragOverSlot, setDragOverSlot] = useState<{ date: Date; hour: number; minute: number } | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [resizingAppointment, setResizingAppointment] = useState<{ id: string; initialDuration: number } | null>(null)
  const [dragOffset, setDragOffset] = useState<number>(0)

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [])

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

      // Vrátí true pokud termín začíná v této hodině
      return aptStartMinutes >= slotStartMinutes && aptStartMinutes < slotEndMinutes
    })
  }

  const handleSlotClick = (date: Date, hour: number, minute: number = 0) => {
    if (!isSlotAvailable(date, hour)) return

    const clickedTime = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`
    
    // Check if there's an appointment at this exact time
    const appointmentAtTime = appointments.find((apt) => {
      const aptDate = new Date(apt.date)
      if (
        aptDate.getFullYear() !== date.getFullYear() ||
        aptDate.getMonth() !== date.getMonth() ||
        aptDate.getDate() !== date.getDate()
      ) {
        return false
      }
      return apt.time === clickedTime
    })

    if (appointmentAtTime) {
      setSelectedAppointment(appointmentAtTime)
      setShowDetailModal(true)
    } else {
      setSelectedSlot({
        date,
        time: clickedTime,
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
    
    // Výška termínu v pixelech - každá hodina je 80px
    const heightInPx = (apt.duration / 60) * 80
    
    return {
      top: `${top}%`,
      height: `${heightInPx}px`,
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

  // Check if appointment has collision with other appointments
  const hasCollision = (apt: Appointment, allSlotAppointments: Appointment[]) => {
    const [aptHour, aptMinute] = apt.time.split(":").map(Number)
    const aptStartMinutes = aptHour * 60 + aptMinute
    const aptEndMinutes = aptStartMinutes + apt.duration

    return allSlotAppointments.some(other => {
      if (other.id === apt.id) return false
      
      const [otherHour, otherMinute] = other.time.split(":").map(Number)
      const otherStartMinutes = otherHour * 60 + otherMinute
      const otherEndMinutes = otherStartMinutes + other.duration

      // Check for overlap
      return (aptStartMinutes < otherEndMinutes && aptEndMinutes > otherStartMinutes)
    })
  }

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, apt: Appointment) => {
    setDraggedAppointment(apt)
    // Store original position for potential rollback
    setOriginalPosition({ date: apt.date, time: apt.time })
    e.dataTransfer.effectAllowed = "move"
    
    // Ulož offset kurzoru od horního okraje události
    const target = e.currentTarget as HTMLElement
    const parent = target.parentElement as HTMLElement
    const rect = parent.getBoundingClientRect()
    const offsetY = e.clientY - rect.top
    setDragOffset(offsetY)
    
    // Vytvoření viditelné kopie události pro drag image
    const clone = parent.cloneNode(true) as HTMLElement
    clone.style.position = "absolute"
    clone.style.top = "-9999px"
    clone.style.left = "-9999px"
    clone.style.width = parent.offsetWidth + "px"
    clone.style.opacity = "1"
    clone.style.transform = "none"
    
    document.body.appendChild(clone)
    
    // Nastavení klonu jako drag image s offsetem
    e.dataTransfer.setDragImage(clone, parent.offsetWidth / 2, offsetY)
    
    // Odstranění klonu po začátku tažení
    requestAnimationFrame(() => {
      document.body.removeChild(clone)
    })
  }

  const handleDragOver = (e: React.DragEvent, date: Date, hour: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    
    // Calculate minute based on mouse position minus drag offset - 15 minute precision
    const target = e.currentTarget as HTMLElement
    const rect = target.getBoundingClientRect()
    const relativeY = e.clientY - rect.top - dragOffset
    const slotHeight = rect.height
    const percentage = relativeY / slotHeight
    const minute = Math.floor(percentage * 4) * 15 // 0, 15, 30, 45
    
    setDragOverSlot({ date, hour, minute })
  }

  const handleDragLeave = () => {
    setDragOverSlot(null)
  }

  const handleDrop = (e: React.DragEvent, date: Date, hour: number) => {
    e.preventDefault()
    setDragOverSlot(null)

    if (!draggedAppointment || !originalPosition) return

    // Calculate minute based on mouse position minus drag offset - 15 minute precision
    const target = e.currentTarget as HTMLElement
    const rect = target.getBoundingClientRect()
    const relativeY = e.clientY - rect.top - dragOffset
    const slotHeight = rect.height
    const percentage = Math.max(0, Math.min(1, relativeY / slotHeight)) // Clamp between 0 and 1
    const minute = Math.floor(percentage * 4) * 15 // 0, 15, 30, 45

    // Ensure minute is valid (0, 15, 30, or 45)
    const validMinute = Math.max(0, Math.min(45, minute))
    
    // Calculate new time with 15-minute precision
    const newTime = `${String(hour).padStart(2, "0")}:${String(validMinute).padStart(2, "0")}`
    
    // Validate that hour is within working hours (7-19)
    if (hour < 7 || hour >= 19) {
      // Invalid drop - restore original position WITHOUT creating history
      updateAppointment(draggedAppointment.id, {
        date: originalPosition.date,
        time: originalPosition.time,
      })
      showToast("Termín nemůže být mimo pracovní dobu. Byl vrácen na původní místo.")
      setDraggedAppointment(null)
      setOriginalPosition(null)
      return
    }
    
    // Update appointment with new date and time
    updateAppointment(draggedAppointment.id, {
      date: date,
      time: newTime,
    }, "drag")
    
    // Show success toast with undo option
    const latestHistory = history[0] // Most recent entry
    if (latestHistory) {
      showToast(latestHistory.description, latestHistory.id, (historyId) => {
        undoChange(historyId)
        showToast("Změna byla vrácena zpět")
      })
    }

    setDraggedAppointment(null)
    setOriginalPosition(null)
  }

  const handleDragEnd = () => {
    // If drag ended without valid drop, restore original position
    if (draggedAppointment && originalPosition) {
      // Silent restore without history - just reset to original
      const apt = draggedAppointment
      const orig = originalPosition
      
      setDraggedAppointment(null)
      setOriginalPosition(null)
      setDragOverSlot(null)
      
      // Only restore if position actually changed
      if (apt.date !== orig.date || apt.time !== orig.time) {
        updateAppointment(apt.id, {
          date: orig.date,
          time: orig.time,
        })
        showToast("Termín byl vrácen na původní místo")
      }
    } else {
      setDraggedAppointment(null)
      setOriginalPosition(null)
      setDragOverSlot(null)
    }
  }

  // Resize handlers
  const handleResizeStart = (e: React.MouseEvent, apt: Appointment) => {
    e.stopPropagation()
    const initialDuration = apt.duration
    const initialApt = { ...apt } // Store complete initial state
    setResizingAppointment({ id: apt.id, initialDuration: initialDuration })
    
    let finalDuration = initialDuration
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const aptElement = document.getElementById(`apt-${apt.id}`)
      if (!aptElement) return
      
      const rect = aptElement.getBoundingClientRect()
      const relativeY = moveEvent.clientY - rect.top
      // 15 minute increments, minimum 15 minutes
      const newDuration = Math.max(15, Math.round(relativeY / (80 / 60) / 15) * 15)
      
      if (newDuration !== finalDuration) {
        finalDuration = newDuration
        // Update without history during dragging
        updateAppointment(apt.id, { duration: newDuration })
      }
    }
    
    const handleMouseUp = () => {
      // Add single history entry only if duration actually changed
      if (finalDuration !== initialDuration) {
        // Manually add history with correct initial/final values
        const description = `Změněna délka: ${apt.patientName} z ${initialDuration} min na ${finalDuration} min`
        addToHistory(
          "resize",
          apt.id,
          { ...initialApt, duration: initialDuration },
          { ...initialApt, duration: finalDuration },
          description,
          "Administrátor",
          "admin"
        )
        
        // Show toast
        setTimeout(() => {
          const latestHistory = history[0]
          if (latestHistory) {
            showToast(latestHistory.description, latestHistory.id, (historyId) => {
              undoChange(historyId)
              showToast("Změna byla vrácena zpět")
            })
          }
        }, 50)
      }
      
      setResizingAppointment(null)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
    
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  // Calculate current time position
  const getCurrentTimePosition = () => {
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    
    // Check if current time is within office hours
    if (currentHour < 7 || currentHour >= 20) return null
    
    const hourIndex = currentHour - 7 // 7 is the first hour
    const minutePercentage = currentMinute / 60
    const topPosition = (hourIndex + minutePercentage) * 80 // 80px per hour
    
    return topPosition
  }

  const currentTimePosition = getCurrentTimePosition()
  const todayIndex = visibleDates.findIndex(date => {
    const today = new Date()
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear()
  })

  return (
    <TooltipProvider>
      <div className="h-full flex flex-col bg-gray-50">
        <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-medium text-gray-900">Diář</h1>
          <div className="flex gap-2">
            <Button 
              onClick={() => {
                localStorage.removeItem('dental_appointments')
                window.location.reload()
              }} 
              variant="outline" 
              size="sm"
              className="text-gray-500 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            >
              Reset
            </Button>
            <Button onClick={() => setShowAddModal(true)} size="sm" className="gap-2 bg-gray-900 hover:bg-gray-800 text-white">
              <Plus className="h-4 w-4" />
              Přidat
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" onClick={goToPrevious} className="w-8 h-8 p-0 border-gray-200 hover:bg-gray-50">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={goToToday} className="border-gray-200 hover:bg-gray-50 text-xs">
                Dnes
              </Button>
              <Button variant="outline" size="sm" onClick={goToNext} className="w-8 h-8 p-0 border-gray-200 hover:bg-gray-50">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-1 border-l border-gray-200 pl-4">
              <Button
                variant={viewMode === "week" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("week")}
                className={viewMode === "week" ? "bg-gray-900 hover:bg-gray-800 text-white text-xs" : "border-gray-200 hover:bg-gray-50 text-xs"}
              >
                <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                Týden
              </Button>
              <Button 
                variant={viewMode === "day" ? "default" : "outline"} 
                size="sm" 
                onClick={() => setViewMode("day")}
                className={viewMode === "day" ? "bg-gray-900 hover:bg-gray-800 text-white text-xs" : "border-gray-200 hover:bg-gray-50 text-xs"}
              >
                <Eye className="h-3.5 w-3.5 mr-1" />
                Den
              </Button>
            </div>
            <div className="text-sm font-medium text-gray-900">{formatDateRange()}</div>
          </div>
        </div>

        <div className="flex items-center gap-6 mt-4 text-xs flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-100 border border-green-200"></div>
            <span className="text-gray-600">Potvrzeno</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-yellow-100 border border-yellow-200"></div>
            <span className="text-gray-600">Čeká</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-gray-100 border border-gray-200"></div>
            <span className="text-gray-600">Dokončeno</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-white">
        <div className="min-w-[800px] relative">
          <div
            className={`grid border-b border-gray-100 sticky top-0 z-10 bg-white ${viewMode === "day" ? "[grid-template-columns:60px_1fr]" : "[grid-template-columns:60px_repeat(5,1fr)]"}`}
          >
            <div className="p-3 border-r border-gray-100 w-[60px]"></div>
            {visibleDates.map((date, i) => {
              const dayIndex = viewMode === "day" ? (date.getDay() === 0 ? 6 : date.getDay() - 1) : i
              return (
                <div
                  key={i}
                  className={`p-3 text-center border-r border-gray-100 ${
                    isToday(date) ? "bg-gray-50" : ""
                  }`}
                >
                  <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">{DAYS[dayIndex]}</div>
                  <div className={`text-2xl font-light mt-1 ${
                    isToday(date) ? "w-10 h-10 mx-auto bg-gray-900 text-white rounded-full flex items-center justify-center" : "text-gray-900"
                  }`}>
                    {date.getDate()}
                  </div>
                </div>
              )
            })}
          </div>

          {HOURS.map((hour) => (
            <div
              key={hour}
              className={`grid border-b border-gray-50 relative min-h-[80px] ${viewMode === "day" ? "[grid-template-columns:60px_1fr]" : "[grid-template-columns:60px_repeat(5,1fr)]"}`}
            >
              <div className="p-2 border-r border-gray-100 text-xs text-gray-400 flex items-start justify-end pt-0 -mt-2.5 font-light w-[60px]">
                {String(hour).padStart(2, "0")}:00
              </div>
              {visibleDates.map((date, dayIndex) => {
                const available = isSlotAvailable(date, hour)
                const slotAppointments = getSlotAppointments(date, hour)
                
                // Get all appointments for this day to check collisions
                const dayAppointments = appointments.filter((apt) => {
                  const aptDate = new Date(apt.date)
                  return (
                    aptDate.getFullYear() === date.getFullYear() &&
                    aptDate.getMonth() === date.getMonth() &&
                    aptDate.getDate() === date.getDate()
                  )
                })

                const isDragOver = dragOverSlot?.date.getTime() === date.getTime() && dragOverSlot?.hour === hour
                
                // Red line for current time (only in today's column)
                const showRedLine = isToday(date) && currentTimePosition !== null
                const isCurrentHour = showRedLine && Math.floor(currentTimePosition / 80) === (hour - 7)
                const redLineOffset = isCurrentHour ? (currentTimePosition % 80) : null

                return (
                  <div
                    key={dayIndex}
                    onDragOver={(e) => handleDragOver(e, date, hour)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, date, hour)}
                    className={`border-r border-gray-100 relative ${
                      isToday(date) 
                        ? "bg-blue-50/30"
                        : available
                        ? "bg-white"
                        : "bg-gray-50 cursor-not-allowed"
                    }`}
                  >
                    {/* 15-minute clickable slots */}
                    {available && [0, 15, 30, 45].map((minute) => (
                      <div
                        key={minute}
                        onClick={() => handleSlotClick(date, hour, minute)}
                        className={`absolute left-0 right-0 cursor-pointer hover:bg-gray-50 transition-colors z-10 h-[25%] ${minute === 0 ? 'top-0' : minute === 15 ? 'top-[25%]' : minute === 30 ? 'top-[50%]' : 'top-[75%]'}`}
                      />
                    ))}
                    
                    {/* Visual separators */}
                    <div className="absolute left-0 right-0 top-1/4 border-t border-gray-50 pointer-events-none" />
                    <div className="absolute left-0 right-0 top-1/2 border-t border-gray-100 border-dashed pointer-events-none" />
                    <div className="absolute left-0 right-0 top-3/4 border-t border-gray-50 pointer-events-none" />
                    
                    {/* Červená čára aktuálního času */}
                    {redLineOffset !== null && (
                      <div className="absolute left-0 right-0 z-50 pointer-events-none" data-offset={redLineOffset}>
                        <div className="relative">
                          <div className="absolute left-0 w-1.5 h-1.5 bg-red-500 rounded-full -mt-0.5"></div>
                          <div className="h-px bg-red-500 ml-1.5 opacity-70"></div>
                        </div>
                      </div>
                    )}
                    
                    {isDragOver && (
                      <div className={`absolute left-0 right-0 h-px bg-gray-400 z-40 pointer-events-none opacity-60 ${
                        dragOverSlot.minute === 0 ? 'top-0' : 
                        dragOverSlot.minute === 15 ? 'top-[25%]' :
                        dragOverSlot.minute === 30 ? 'top-[50%]' : 'top-[75%]'
                      }`} />
                    )}
                    {slotAppointments.map((apt) => {
                      const [aptHour] = apt.time.split(":").map(Number)
                      if (aptHour !== hour) return null

                      const style = calculateAppointmentStyle(apt, hour)
                      const statusColor = apt.status === "confirmed" ? "bg-green-50 border-green-200" :
                          apt.status === "pending" ? "bg-yellow-50 border-yellow-200" :
                          apt.status === "completed" ? "bg-gray-50 border-gray-200" :
                          "bg-gray-50 border-gray-200"

                      return (
                        <Tooltip key={apt.id} delayDuration={300}>
                          <TooltipTrigger asChild>
                            <div
                              id={`apt-${apt.id}`}
                              className={`absolute left-1 right-1 rounded-md border ${statusColor} overflow-visible z-20 hover:shadow-md hover:z-30 ${
                                draggedAppointment?.id === apt.id ? "opacity-70" : ""
                              } ${apt.duration <= 30 ? 'p-1 pb-2' : 'p-2 pb-3'}`}
                              style={style}
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedAppointment(apt)
                                setShowDetailModal(true)
                              }}
                            >
                              {/* Drag handle - uprostřed horní hrany, vždy viditelný */}
                              <div
                                draggable={!resizingAppointment}
                                onDragStart={(e) => {
                                  if (resizingAppointment) {
                                    e.preventDefault()
                                    return
                                  }
                                  handleDragStart(e, apt)
                                }}
                                onDragEnd={handleDragEnd}
                                onClick={(e) => e.stopPropagation()}
                                className="absolute top-0 left-1/2 -translate-x-1/2 h-3 w-8 cursor-grab active:cursor-grabbing group z-30 flex items-center justify-center"
                              >
                                <div className="flex gap-0.5">
                                  <div className="w-0.5 h-0.5 rounded-full bg-gray-400"></div>
                                  <div className="w-0.5 h-0.5 rounded-full bg-gray-400"></div>
                                  <div className="w-0.5 h-0.5 rounded-full bg-gray-400"></div>
                                </div>
                              </div>
                              
                              {/* Optimalizované zobrazení pro krátké i dlouhé termíny */}
                              {apt.duration <= 15 ? (
                                // Kompaktní zobrazení pro 15min termíny - jméno a délka v závorce
                                <div className="flex items-center justify-start h-full pl-2 pr-1">
                                  <div className="flex items-center gap-1.5">
                                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                                      apt.status === 'confirmed' ? 'bg-green-500' :
                                      apt.status === 'pending' ? 'bg-yellow-500' :
                                      apt.status === 'completed' ? 'bg-gray-400' :
                                      'bg-gray-400'
                                    }`} />
                                    <div className="font-medium text-[10px] leading-tight truncate text-gray-900">
                                      {apt.patientName} ({apt.duration}min)
                                    </div>
                                  </div>
                                </div>
                              ) : apt.duration > 15 && apt.duration <= 30 ? (
                                // Kompaktní zobrazení pro 30min termíny - jméno, služba a délka
                                <div className="flex flex-col justify-center h-full pl-2 pr-1">
                                  <div className="flex items-center gap-1.5">
                                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                                      apt.status === 'confirmed' ? 'bg-green-500' :
                                      apt.status === 'pending' ? 'bg-yellow-500' :
                                      apt.status === 'completed' ? 'bg-gray-400' :
                                      'bg-gray-400'
                                    }`} />
                                    <div className="font-medium text-[10px] leading-tight truncate text-gray-900">
                                      {apt.patientName}
                                    </div>
                                  </div>
                                  <div className="text-[10px] text-gray-500 truncate pl-2.5 leading-tight mt-0.5">{apt.service} • {apt.duration}min</div>
                                </div>
                              ) : (
                                // Plné zobrazení pro delší termíny - 3 řádky, zarovnané nahoru
                                <div className="flex flex-col justify-start h-full pl-2 pr-1 gap-0.5 pt-1">
                                  <div className="flex items-center gap-1.5">
                                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                                      apt.status === 'confirmed' ? 'bg-green-500' :
                                      apt.status === 'pending' ? 'bg-yellow-500' :
                                      apt.status === 'completed' ? 'bg-gray-400' :
                                      'bg-gray-400'
                                    }`} />
                                    <div className="font-medium text-[10px] leading-tight truncate text-gray-900">
                                      {apt.patientName}
                                    </div>
                                  </div>
                                  <div className="text-[10px] text-gray-500 truncate pl-2.5 leading-tight">{apt.service}</div>
                                  <div className="text-[10px] text-gray-400 truncate pl-2.5 leading-tight">
                                    {apt.time} - {(() => {
                                      const [hours, minutes] = apt.time.split(':').map(Number)
                                      const totalMinutes = hours * 60 + minutes + apt.duration
                                      const endHours = Math.floor(totalMinutes / 60)
                                      const endMinutes = totalMinutes % 60
                                      return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`
                                    })()} ({(() => {
                                      const h = Math.floor(apt.duration / 60)
                                      const m = apt.duration % 60
                                      if (h === 0) return `${m}min`
                                      if (m === 0) return `${h}h`
                                      return `${h}h${m}min`
                                    })()})
                                  </div>
                                </div>
                              )}
                              
                              {/* Resize handle - celá spodní hrana */}
                              <div
                                onMouseDown={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  handleResizeStart(e, apt)
                                }}
                                onClick={(e) => e.stopPropagation()}
                                className="absolute bottom-0 left-0 right-0 h-3 cursor-ns-resize group z-30 flex items-center justify-end pr-1"
                              >
                                <div className="w-4 h-px bg-gray-500 opacity-40 group-hover:opacity-100 transition-opacity"></div>
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="right" className="max-w-xs">
                            <div className="space-y-1">
                              <div className="font-semibold">{apt.patientName}</div>
                              <div className="text-xs text-gray-300">{apt.service}</div>
                              <div className="text-xs text-gray-400">
                                {new Date(apt.date).toLocaleDateString("cs-CZ")} • {apt.time} ({apt.duration} min)
                              </div>
                              <div className="text-xs text-gray-400">
                                Status: {STATUS_LABELS[apt.status]}
                              </div>
                              {apt.notes && (
                                <div className="text-xs text-gray-300 pt-1 border-t border-gray-700">
                                  {apt.notes}
                                </div>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
        </div>
      </div>

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
    </TooltipProvider>
  )
}
