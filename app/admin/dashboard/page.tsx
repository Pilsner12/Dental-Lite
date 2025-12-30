"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Calendar,
  Clock,
  AlertCircle,
  Phone,
  CheckCircle,
  Package,
  Users,
  Timer,
  FileText,
  Save,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { useAppointments } from "@/lib/appointment-context"
import { useInventory } from "@/lib/inventory-context"
import { useUser } from "@/lib/user-context"
import { useOfficeHours } from "@/lib/office-hours-context"
import { useWaitlist } from "@/lib/waitlist-context"
import { MOCK_PATIENTS } from "@/lib/mock-patients"
import { useState, useEffect } from "react"
import React from "react"
import { AppointmentDetailModal } from "@/components/appointment-detail-modal"
import { AddAppointmentModal } from "@/components/add-appointment-modal"
import type { Appointment } from "@/lib/appointment-context"

export default function DashboardPage() {
  const { getAppointmentsByDate, updateAppointment } = useAppointments()
  const { getLowStockItems } = useInventory()
  const { dailyNote, setDailyNote } = useUser()
  const { officeHours } = useOfficeHours()
  const { getWaitingEntries, markAsContacted } = useWaitlist()
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [prefilledTime, setPrefilledTime] = useState<string | undefined>(undefined)
  const [noteText, setNoteText] = useState(dailyNote)
  const [timeToNext, setTimeToNext] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState(new Date())

  const today = new Date()
  const isWeekend = today.getDay() === 0 || today.getDay() === 6
  
  // Získání obědových pauz z ordinančních hodin
  const getLunchBreaks = () => {
    const dayIndex = selectedDate.getDay()
    if (dayIndex === 0 || dayIndex === 6) return []
    
    const dayNames: Array<"monday" | "tuesday" | "wednesday" | "thursday" | "friday"> = [
      "monday", "tuesday", "wednesday", "thursday", "friday"
    ]
    const dayName = dayNames[dayIndex - 1]
    const daySchedule = officeHours.schedule[dayName]
    
    if (!daySchedule?.isOpen || !daySchedule.breaks) return []
    
    return daySchedule.breaks
  }
  
  const lunchBreaks = getLunchBreaks()
  
  // Logika pro víkend - najít nejbližší pracovní den
  const getNextWorkingDay = (): Date => {
    let nextDay = new Date(today)
    while (nextDay.getDay() === 0 || nextDay.getDay() === 6) {
      nextDay.setDate(nextDay.getDate() + 1)
    }
    return nextDay
  }

  const displayDate = isWeekend ? getNextWorkingDay() : today
  const todayAppointments = getAppointmentsByDate(selectedDate)
  
  // Seřadit podle času
  const sortedAppointments = [...todayAppointments].sort((a, b) => {
    return a.time.localeCompare(b.time)
  })
  
  // Vytvoření společného timeline s termíny a pauzami
  const createTimeline = () => {
    const items: Array<{ type: 'appointment' | 'break', time: string, data: any, minutes: number }> = []
    
    // Přidat termíny
    sortedAppointments.forEach(apt => {
      const [hours, minutes] = apt.time.split(':').map(Number)
      items.push({
        type: 'appointment',
        time: apt.time,
        data: apt,
        minutes: hours * 60 + minutes
      })
    })
    
    // Přidat pauzy
    lunchBreaks.forEach(brk => {
      const [hours, minutes] = brk.startTime.split(':').map(Number)
      items.push({
        type: 'break',
        time: brk.startTime,
        data: brk,
        minutes: hours * 60 + minutes
      })
    })
    
    // Seřadit podle času
    return items.sort((a, b) => a.minutes - b.minutes)
  }
  
  const timeline = sortedAppointments.length > 0 ? createTimeline() : []

  // Čekající na schválení
  const pendingAppointments = sortedAppointments.filter(apt => apt.status === 'pending')

  // Potvrzené termíny
  const confirmedAppointments = sortedAppointments.filter(apt => apt.status === 'confirmed')
  
  // Najít nejbližší volné termíny ve všech nadcházejících dnech
  const findNextFreeSlots = () => {
    const freeSlots: Array<{ date: Date, start: string, end: string, duration: number }> = []
    const now = new Date()
    const maxDays = 30 // Hledat max 30 dní dopředu
    
    for (let dayOffset = 0; dayOffset < maxDays; dayOffset++) {
      const checkDate = new Date(now)
      checkDate.setDate(checkDate.getDate() + dayOffset)
      checkDate.setHours(0, 0, 0, 0)
      
      // Přeskočit víkendy
      if (checkDate.getDay() === 0 || checkDate.getDay() === 6) continue
      
      // Získat termíny pro tento den
      const dayAppointments = getAppointmentsByDate(checkDate).sort((a, b) => a.time.localeCompare(b.time))
      
      // Získat pauzy pro tento den
      const dayIndex = checkDate.getDay()
      const dayNames: Array<"monday" | "tuesday" | "wednesday" | "thursday" | "friday"> = [
        "monday", "tuesday", "wednesday", "thursday", "friday"
      ]
      const dayName = dayNames[dayIndex - 1]
      const daySchedule = officeHours.schedule[dayName]
      const dayBreaks = daySchedule?.isOpen && daySchedule.breaks ? daySchedule.breaks : []
      
      // Vytvořit timeline pro tento den
      const dayTimeline: Array<{ type: 'appointment' | 'break', minutes: number, data: any }> = []
      
      dayAppointments.forEach(apt => {
        const [hours, minutes] = apt.time.split(':').map(Number)
        dayTimeline.push({
          type: 'appointment',
          minutes: hours * 60 + minutes,
          data: apt
        })
      })
      
      dayBreaks.forEach(brk => {
        const [hours, minutes] = brk.startTime.split(':').map(Number)
        dayTimeline.push({
          type: 'break',
          minutes: hours * 60 + minutes,
          data: brk
        })
      })
      
      dayTimeline.sort((a, b) => a.minutes - b.minutes)
      
      // Najít volné sloty v tomto dni
      dayTimeline.forEach((item, index) => {
        if (item.type === 'appointment') {
          const apt = item.data
          const [hours, minutes] = apt.time.split(':').map(Number)
          const endMinutes = hours * 60 + minutes + apt.duration
          
          const nextItem = dayTimeline[index + 1]
          if (nextItem) {
            const gapMinutes = nextItem.minutes - endMinutes
            if (gapMinutes >= 30) {
              const endHours = Math.floor(endMinutes / 60)
              const endMins = endMinutes % 60
              const startTime = `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`
              const endTime = nextItem.type === 'appointment' ? nextItem.data.time : nextItem.data.startTime
              
              // Zkontrolovat zda je slot v budoucnosti
              const slotDateTime = new Date(checkDate)
              slotDateTime.setHours(endHours, endMins, 0, 0)
              
              if (slotDateTime > now) {
                freeSlots.push({
                  date: checkDate,
                  start: startTime,
                  end: endTime,
                  duration: gapMinutes
                })
              }
            }
          }
        }
      })
      
      // Pokud už máme alespoň 2 sloty, můžeme skončit
      if (freeSlots.length >= 2) break
    }
    
    return freeSlots.slice(0, 2)
  }
  
  const nextFreeSlots = findNextFreeSlots()

  // Mini sklad - top 5 položek pod minimem
  const lowStockItems = getLowStockItems().slice(0, 5)
  
  // Čekatelé - zobrazit jen waiting
  const waitingEntries = getWaitingEntries().slice(0, 3)

  // Statistiky
  const totalToday = sortedAppointments.length
  const pendingCount = pendingAppointments.length
  const confirmedCount = confirmedAppointments.length

  // Timer do příštího termínu
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date()
      const upcoming = sortedAppointments
        .filter(apt => {
          const [hours, minutes] = apt.time.split(':').map(Number)
          const aptTime = new Date(apt.date)
          aptTime.setHours(hours, minutes, 0, 0)
          return aptTime > now
        })
        .sort((a, b) => a.time.localeCompare(b.time))

      if (upcoming.length > 0) {
        const next = upcoming[0]
        const [hours, minutes] = next.time.split(':').map(Number)
        const aptTime = new Date(next.date)
        aptTime.setHours(hours, minutes, 0, 0)
        
        const diff = aptTime.getTime() - now.getTime()
        const hoursLeft = Math.floor(diff / (1000 * 60 * 60))
        const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        
        if (hoursLeft > 0) {
          setTimeToNext(`Za ${hoursLeft}h ${minutesLeft}min`)
        } else if (minutesLeft > 0) {
          setTimeToNext(`Za ${minutesLeft} minut`)
        } else if (minutesLeft === 0) {
          setTimeToNext("Nyní!")
        } else {
          setTimeToNext("")
        }
      } else {
        setTimeToNext("Žádné další termíny")
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 60000) // Každou minutu
    return () => clearInterval(interval)
  }, [sortedAppointments])

  // Uložení poznámky
  const handleSaveNote = () => {
    setDailyNote(noteText)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge className="bg-green-100 text-green-800 text-xs">
            <CheckCircle className="w-3 h-3 mr-1" />
            Potvrzeno
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 text-xs">
            <Clock className="w-3 h-3 mr-1" />
            Čeká
          </Badge>
        )
      case "completed":
        return (
          <Badge className="bg-blue-100 text-blue-800 text-xs">
            <CheckCircle className="w-3 h-3 mr-1" />
            Dokončeno
          </Badge>
        )
      default:
        return <Badge className="bg-gray-100 text-gray-800 text-xs">{status}</Badge>
    }
  }

  const handleConfirm = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    updateAppointment(id, { status: "confirmed" })
  }

  const handleViewDetails = (apt: Appointment) => {
    setSelectedAppointment(apt)
    setShowDetailModal(true)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-900">
          {isWeekend ? "Přehled nejbližšího pracovního dne" : "Dnešní přehled"}
        </h1>
        <p className="text-gray-600 mt-1">
          {displayDate.toLocaleDateString('cs-CZ', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
        {isWeekend && (
          <p className="text-sm text-orange-600 mt-1">
            Žádné termíny pro nejbližší pracovní den - zobrazuji {displayDate.toLocaleDateString('cs-CZ', { weekday: 'long' })}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-gray-100 shadow-sm bg-white">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newDate = new Date(selectedDate)
                        newDate.setDate(newDate.getDate() - 1)
                        setSelectedDate(newDate)
                      }}
                      className="h-7 w-7 p-0 border-gray-200 hover:bg-gray-50"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedDate(new Date())}
                      className="h-7 px-2 text-xs border-gray-200 hover:bg-gray-50"
                    >
                      Dnes
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newDate = new Date(selectedDate)
                        newDate.setDate(newDate.getDate() + 1)
                        setSelectedDate(newDate)
                      }}
                      className="h-7 w-7 p-0 border-gray-200 hover:bg-gray-50"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-sm font-medium text-gray-700">
                    {selectedDate.toLocaleDateString('cs-CZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-gray-400" />
                    <span className="text-gray-600 font-medium">{totalToday}</span>
                  </div>
                  <div className="h-3 w-px bg-gray-200"></div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                    <span className="text-gray-600 font-medium">{confirmedCount}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-yellow-500" />
                    <span className="text-gray-600 font-medium">{pendingCount}</span>
                  </div>
                  <div className="h-3 w-px bg-gray-200"></div>
                  <div className="flex items-center gap-1.5">
                    <Timer className="h-3.5 w-3.5 text-gray-400" />
                    <span className="text-gray-600 font-medium text-[11px]">{timeToNext}</span>
                  </div>
                </div>
              </div>
              {nextFreeSlots.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div className="p-2 bg-green-50 border border-green-200 rounded">
                    <div className="text-[11px] text-green-600 font-medium uppercase tracking-wide mb-0.5">
                      Nejbližší volný termín
                    </div>
                    <div className="text-[11px] font-medium text-gray-900">
                      {nextFreeSlots[0].date.toLocaleDateString('cs-CZ', { weekday: 'long', day: 'numeric', month: 'numeric', year: 'numeric' })}
                    </div>
                    <div className="text-[11px] text-gray-700">
                      {nextFreeSlots[0].start}-{nextFreeSlots[0].end} ({nextFreeSlots[0].duration} min)
                    </div>
                  </div>
                  {nextFreeSlots[1] && (
                    <div className="p-2 bg-gray-50 border border-gray-200 rounded">
                      <div className="text-[11px] text-gray-500 font-medium uppercase tracking-wide mb-0.5">
                        Další volný termín
                      </div>
                      <div className="text-[11px] font-medium text-gray-900">
                        {nextFreeSlots[1].date.toLocaleDateString('cs-CZ', { weekday: 'long', day: 'numeric', month: 'numeric', year: 'numeric' })}
                      </div>
                      <div className="text-[11px] text-gray-700">
                        {nextFreeSlots[1].start}-{nextFreeSlots[1].end} ({nextFreeSlots[1].duration} min)
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardHeader>
            <CardContent className="pt-0">
              {timeline.length === 0 && lunchBreaks.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-sm text-gray-400">
                    {isWeekend ? "Žádné plánované termíny" : "Žádné termíny"}
                  </p>
                </div>
              ) : timeline.length === 0 && lunchBreaks.length > 0 ? (
                <div>
                  <div className="relative">
                    <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gray-200"></div>
                    <div className="space-y-1">
                      {lunchBreaks.map((brk) => (
                        <div key={brk.id} className="relative">
                          <div className="absolute left-0 w-4 h-4 rounded-full border-2 border-dashed border-orange-200 bg-white">
                            <div className="absolute inset-0.5 rounded-full bg-orange-50"></div>
                          </div>
                          <div className="ml-8 px-4 py-2.5 text-xs bg-orange-50 rounded-lg border border-orange-200">
                            <div className="flex items-center gap-2 text-orange-700">
                              <span>🍽️</span>
                              <span className="font-medium">{brk.name}</span>
                              <span className="text-orange-500">{brk.startTime} - {brk.endTime}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gray-200"></div>
                  <div className="space-y-1">
                    {timeline.map((item, index) => {
                      if (item.type === 'break') {
                        const brk = item.data
                        return (
                          <div key={`break-${brk.id}`} className="relative">
                            <div className="absolute left-0 w-4 h-4 rounded-full border-2 border-dashed border-orange-200 bg-white">
                              <div className="absolute inset-0.5 rounded-full bg-orange-50"></div>
                            </div>
                            <div className="ml-8 px-4 py-2.5 text-xs bg-orange-50 rounded-lg border border-orange-200">
                              <div className="flex items-center gap-2 text-orange-700">
                                <span>🍽️</span>
                                <span className="font-medium">{brk.name}</span>
                                <span className="text-orange-500">{brk.startTime} - {brk.endTime}</span>
                              </div>
                            </div>
                          </div>
                        )
                      }
                      
                      // Pro appointment
                      const apt = item.data
                      const [hours, minutes] = apt.time.split(':').map(Number)
                      const now = new Date()
                      const aptTime = new Date(apt.date)
                      aptTime.setHours(hours, minutes, 0, 0)
                      const isPast = aptTime < now && selectedDate.toDateString() === new Date().toDateString()
                      const isNow = Math.abs(aptTime.getTime() - now.getTime()) < 15 * 60 * 1000 && selectedDate.toDateString() === new Date().toDateString()
                      
                      // Výpočet konce tohoto termínu
                      const endMinutes = hours * 60 + minutes + apt.duration
                      const endHours = Math.floor(endMinutes / 60)
                      const endMins = endMinutes % 60
                      
                      // Zjištění začátku další položky v timeline (může být termín nebo pauza)
                      const nextItem = timeline[index + 1]
                      let showFreeSlot = false
                      let freeSlotDuration = 0
                      let freeSlotStart = ""
                      let freeSlotEnd = ""
                      
                      if (nextItem) {
                        const nextStartMinutes = nextItem.minutes
                        const gapMinutes = nextStartMinutes - endMinutes
                        
                        // Zobraz volný slot pokud je mezera >= 30 minut
                        if (gapMinutes >= 30) {
                          showFreeSlot = true
                          freeSlotDuration = gapMinutes
                          freeSlotStart = `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`
                          
                          if (nextItem.type === 'appointment') {
                            freeSlotEnd = nextItem.data.time
                          } else {
                            freeSlotEnd = nextItem.data.startTime
                          }
                        }
                      }
                      
                      const patient = MOCK_PATIENTS.find(p => p.id === apt.patientId)
                      
                      return (
                        <React.Fragment key={apt.id}>
                          <div className="relative group">
                            <div 
                              className={`absolute left-0 w-4 h-4 rounded-full border-2 bg-white transition-all ${
                                isNow ? 'border-gray-900 shadow-sm' :
                                isPast ? 'border-gray-200' :
                                'border-gray-300'
                              }`}
                            >
                              {isNow && (
                                <div className="absolute inset-0.5 rounded-full bg-gray-900"></div>
                              )}
                            </div>
                            
                            <div
                              onClick={() => handleViewDetails(apt)}
                              className={`ml-8 px-4 py-3 transition-all cursor-pointer border bg-white rounded-lg ${
                                isNow ? 'border-gray-900' :
                                isPast ? 'opacity-60 border-gray-200 bg-gray-50' :
                                'border-gray-100 hover:border-gray-300 hover:shadow-sm'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-3 mb-2">
                                    <span className={`text-sm font-medium tabular-nums ${
                                      isNow ? 'text-gray-900' :
                                      isPast ? 'text-gray-400' :
                                      'text-gray-700'
                                    }`}>
                                      {apt.time}
                                    </span>
                                    <div className={`w-1.5 h-1.5 rounded-full ${
                                      apt.status === 'confirmed' ? 'bg-green-500' :
                                      apt.status === 'pending' ? 'bg-yellow-500' :
                                      apt.status === 'completed' ? 'bg-gray-400' :
                                      'bg-gray-400'
                                    }`} />
                                    <span className="text-xs text-gray-400">
                                      {apt.duration}m
                                    </span>
                                    {isNow && (
                                      <span className="text-xs font-medium text-gray-900">
                                        Nyní
                                      </span>
                                    )}
                                    {isPast && (
                                      <span className="text-xs text-gray-400">
                                        Proבěhlo
                                      </span>
                                    )}
                                  </div>
                                  
                                  <div className="font-medium text-sm text-gray-900 mb-1">
                                    {apt.patientName}
                                    {patient?.personalInfo.dateOfBirth && (
                                      <span className="text-gray-400 font-normal ml-1.5">
                                        {new Date(patient.personalInfo.dateOfBirth).getFullYear()}
                                      </span>
                                    )}
                                  </div>
                                  
                                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                                    <span>{apt.service}</span>
                                    {patient?.personalInfo.phone && (
                                      <>
                                        <span className="text-gray-300">•</span>
                                        <a
                                          href={`tel:${patient.personalInfo.phone}`}
                                          onClick={(e) => e.stopPropagation()}
                                          className="hover:text-gray-900 flex items-center gap-1"
                                        >
                                          <Phone className="h-3 w-3" />
                                          {patient.personalInfo.phone}
                                        </a>
                                      </>
                                    )}
                                    {patient?.personalInfo.email && (
                                      <>
                                        <span className="text-gray-300">•</span>
                                        <span className="text-gray-400 truncate max-w-[150px]">{patient.personalInfo.email}</span>
                                      </>
                                    )}
                                  </div>
                                  
                                  {patient?.medicalInfo?.allergies && patient.medicalInfo.allergies.length > 0 && (
                                    <div className="flex items-center gap-1 text-xs text-orange-600 mb-1">
                                      <AlertCircle className="h-3 w-3" />
                                      <span>Alergie: {patient.medicalInfo.allergies.join(', ')}</span>
                                    </div>
                                  )}
                                  
                                  {apt.notes && (
                                    <div className="mt-2 text-xs text-gray-400 italic line-clamp-2 bg-gray-50 px-2 py-1 rounded">
                                      {apt.notes}
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {isNow && (
                                <div className="mt-2 h-px bg-gray-200 overflow-hidden">
                                  <div className="h-full bg-gray-900 transition-all w-[45%]"></div>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {showFreeSlot && (
                            <div className="relative">
                              <div className="absolute left-0 w-4 h-4 rounded-full border-2 border-dashed border-green-200 bg-white">
                                <div className="absolute inset-0.5 rounded-full bg-green-50"></div>
                              </div>
                              <div 
                                onClick={() => {
                                  setPrefilledTime(freeSlotStart)
                                  setShowAddModal(true)
                                }}
                                className="ml-8 px-4 py-2.5 text-xs bg-green-50 rounded-lg border border-green-200 hover:border-green-300 hover:bg-green-100 cursor-pointer transition-all"
                              >
                                <div className="flex items-center gap-2 text-green-700">
                                  <Clock className="h-3.5 w-3.5" />
                                  <span className="font-medium">Volný čas</span>
                                  <span className="text-green-600">{freeSlotStart} - {freeSlotEnd}</span>
                                  <span className="text-green-500">({freeSlotDuration} min)</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </React.Fragment>
                      )
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {pendingAppointments.length > 0 && (
            <Card className="border border-gray-100 shadow-sm bg-white">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Čekají na potvrzení
                  </CardTitle>
                  <span className="text-xs text-gray-400">{pendingAppointments.length}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {pendingAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    onClick={() => handleViewDetails(apt)}
                    className="p-4 border border-gray-100 bg-white rounded-lg hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-3 mb-1">
                          <span className="text-sm font-medium tabular-nums text-gray-700">
                            {new Date(apt.date).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'short' })} {apt.time}
                          </span>
                        </div>
                        <div className="font-medium text-sm text-gray-900 mb-0.5 truncate">{apt.patientName}</div>
                        <div className="text-xs text-gray-500 truncate">{apt.service}</div>
                      </div>
                      <Button
                        size="sm"
                        onClick={(e) => handleConfirm(apt.id, e)}
                        className="bg-gray-900 hover:bg-gray-800 text-white rounded-lg px-4 h-8 text-xs"
                      >
                        Potvrdit
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Pravý sloupec - Čekatelé, Sklad a poznámky */}
        <div className="space-y-6">
          {/* Čekatelé widget */}
          {waitingEntries.length > 0 && (
            <Card className="border border-gray-100 shadow-sm bg-white">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Čekatelé
                  </CardTitle>
                  <span className="text-xs text-gray-400">{waitingEntries.length}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {waitingEntries.map((entry) => {
                  const priorityColor = entry.priority === "high" ? "bg-red-100 text-red-800" :
                                       entry.priority === "medium" ? "bg-yellow-100 text-yellow-800" :
                                       "bg-gray-100 text-gray-600"
                  
                  const daysWaiting = Math.floor(
                    (new Date().getTime() - new Date(entry.addedDate).getTime()) / (1000 * 60 * 60 * 24)
                  )
                  
                  return (
                    <div
                      key={entry.id}
                      className="p-3 border border-gray-100 bg-white rounded-lg hover:border-gray-300 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-gray-900 truncate">{entry.patientName}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <Phone className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{entry.phone}</span>
                          </div>
                        </div>
                        <Badge className={`${priorityColor} text-[10px] px-1.5 py-0.5`}>
                          {entry.priority === "high" ? "Vysoká" : entry.priority === "medium" ? "Střední" : "Nízká"}
                        </Badge>
                      </div>
                      
                      {entry.note && (
                        <div className="text-xs text-gray-500 mb-2 line-clamp-2">{entry.note}</div>
                      )}
                      
                      {entry.preferredTime && (
                        <div className="text-xs text-gray-400 mb-2">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {entry.preferredTime}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                        <span className="text-xs text-gray-400">{daysWaiting} dní v čekárně</span>
                        <Button
                          size="sm"
                          onClick={() => markAsContacted(entry.id)}
                          className="bg-gray-900 hover:bg-gray-800 text-white rounded-lg px-3 h-7 text-xs"
                        >
                          Kontaktovat
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          )}
          
          {/* Mini sklad */}
          <Card className="border border-gray-100 shadow-sm bg-white">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Materiál pod minimem
                </CardTitle>
                <span className="text-xs text-gray-400">{lowStockItems.length}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {lowStockItems.length === 0 && (
                <div className="text-center py-8 text-sm text-gray-400">
                  Vše v pořádku
                </div>
              )}
              {lowStockItems.map((item) => {
                const percentLeft = (item.currentStock / item.minStock) * 100
                const isVeryLow = percentLeft < 50
                
                return (
                  <div
                    key={item.id}
                    className="p-3 border border-gray-100 bg-white rounded-lg hover:border-gray-300 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-sm text-gray-900">{item.name}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          <span className="text-gray-900 font-medium">
                            {item.currentStock} {item.unit}
                          </span>
                          {' / '}
                          <span className="text-gray-400">min. {item.minStock} {item.unit}</span>
                        </div>
                        {item.notes && (
                          <div className="text-xs text-gray-400 mt-1">{item.notes}</div>
                        )}
                      </div>
                      {isVeryLow && (
                        <div className="w-2 h-2 rounded-full bg-gray-900 ml-2 mt-1"></div>
                      )}
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Poznámka pro sestru/doktora */}
          <Card className="border border-gray-100 shadow-sm bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Poznámka pro tým
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Zadejte poznámku..."
                className="min-h-[120px] mb-3 border-gray-100 focus:border-gray-300 rounded-lg"
              />
              <Button
                onClick={handleSaveNote}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-lg h-9 text-sm"
              >
                Uložit
              </Button>
              {dailyNote && dailyNote !== noteText && (
                <p className="text-xs text-gray-400 mt-2">Neuložené změny</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Detail modal */}
      <AppointmentDetailModal
        open={showDetailModal}
        onClose={() => {
          setShowDetailModal(false)
          setSelectedAppointment(null)
        }}
        appointment={selectedAppointment}
      />

      {/* Add appointment modal */}
      <AddAppointmentModal
        open={showAddModal}
        onClose={() => {
          setShowAddModal(false)
          setPrefilledTime(undefined)
        }}
        prefilledDate={selectedDate}
        prefilledTime={prefilledTime}
      />
    </div>
  )
}
