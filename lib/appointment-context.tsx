"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { addDays, setHours, setMinutes, startOfWeek } from "date-fns"
import { MOCK_PATIENTS } from "./mock-patients"

export type AppointmentStatus = "confirmed" | "pending" | "completed" | "cancelled" | "no-show" | "blocked"

export interface Appointment {
  id: string
  patientId: string
  patientName: string
  date: Date
  time: string // "HH:MM"
  duration: number // minutes (30, 60, 90)
  service: string
  status: AppointmentStatus
  isUrgent?: boolean // LEAN feature - označení urgentního termínu
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface HistoryEntry {
  id: string
  timestamp: Date
  action: "create" | "update" | "delete" | "drag" | "resize"
  appointmentId: string
  oldData?: Partial<Appointment>
  newData?: Partial<Appointment>
  description: string
  userName?: string // Kdo provedl změnu
  userRole?: string // Role uživatele
}

interface AppointmentContextType {
  appointments: Appointment[]
  history: HistoryEntry[]
  addAppointment: (appointment: Omit<Appointment, "id" | "createdAt" | "updatedAt">) => void
  updateAppointment: (id: string, updates: Partial<Appointment>, action?: "drag" | "resize" | "update") => void
  deleteAppointment: (id: string) => void
  getAppointmentsByDate: (date: Date) => Appointment[]
  getAppointmentsByDateRange: (startDate: Date, endDate: Date) => Appointment[]
  getAppointmentsByPatient: (patientId: string) => Appointment[]
  hasConflict: (date: Date, time: string, duration: number, excludeId?: string) => boolean
  undoChange: (historyId: string) => void
  clearHistory: () => void
  addToHistory: (action: HistoryEntry["action"], appointmentId: string, oldData?: Partial<Appointment>, newData?: Partial<Appointment>, description?: string, userName?: string, userRole?: string) => void
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined)

// Counter for unique IDs - initialized from timestamp to avoid collisions
let idCounter = Date.now() % 10000

// Mock appointments for demo
function generateMockAppointments(): Appointment[] {
  const appointments: Appointment[] = []
  const today = new Date()
  const thisMonday = startOfWeek(today, { weekStartsOn: 1 })

  const SERVICES = [
    { name: "Preventivka", duration: 30 },
    { name: "Kontrola", duration: 30 },
    { name: "Plomba", duration: 60 },
    { name: "Korunka", duration: 90 },
    { name: "Implantát", duration: 120 },
    { name: "Extrakce", duration: 90 },
    { name: "Bělení zubů", duration: 60 },
    { name: "Dentální hygiena", duration: 45 },
    { name: "Ortodoncie", duration: 60 },
    { name: "Ošetření kořenových kanálků", duration: 90 },
  ]

  const statuses: AppointmentStatus[] = ["confirmed", "pending", "completed", "no-show", "blocked"]
  const statusWeights = [0.5, 0.3, 0.15, 0.05, 0.05]

  const weightedRandom = <T,>(items: T[], weights: number[]): T => {
    const random = Math.random()
    let cumulative = 0

    for (let i = 0; i < items.length; i++) {
      cumulative += weights[i]
      if (random < cumulative) {
        return items[i]
      }
    }

    return items[items.length - 1]
  }

  // Generate appointments for 2 weeks (Mon-Fri only)
  for (let week = 0; week < 2; week++) {
    for (let day = 0; day < 5; day++) {
      // Only Mon-Fri
      const currentDay = addDays(thisMonday, week * 7 + day)

      // Random number of appointments per day (4-8)
      const appointmentsPerDay = Math.floor(Math.random() * 5) + 4

      const usedTimes = new Set<string>()

      for (let i = 0; i < appointmentsPerDay; i++) {
        // Random time between 8:00-16:00 (skip lunch 12-13)
        let hour = Math.floor(Math.random() * 8) + 8 // 8-16
        if (hour === 12) hour = 13 // skip lunch

        const minute = Math.random() > 0.5 ? 0 : 30 // only full or half hours
        const timeStr = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`

        // Skip if time already used
        if (usedTimes.has(timeStr)) continue
        usedTimes.add(timeStr)

        const appointmentDate = setMinutes(setHours(currentDay, hour), minute)

        // Random patient
        const patient = MOCK_PATIENTS[Math.floor(Math.random() * MOCK_PATIENTS.length)]

        // Random service
        const service = SERVICES[Math.floor(Math.random() * SERVICES.length)]

        // Random status
        const status = weightedRandom(statuses, statusWeights)

        appointments.push({
          id: `apt-${week}-${day}-${i}-${Date.now()}-${Math.random()}`,
          patientId: patient.id,
          patientName: `${patient.personalInfo.firstName} ${patient.personalInfo.lastName}`,
          date: appointmentDate,
          time: timeStr,
          duration: service.duration,
          service: service.name,
          status,
          isUrgent: Math.random() > 0.85, // 15% chance of urgent appointment
          notes: Math.random() > 0.7 ? "Pacient žádá ranní termín" : undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      }
    }
  }

  return appointments.sort((a, b) => {
    const dateCompare = a.date.getTime() - b.date.getTime()
    if (dateCompare !== 0) return dateCompare
    return a.time.localeCompare(b.time)
  })
}

const MOCK_APPOINTMENTS: Appointment[] = generateMockAppointments()

export function AppointmentProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [history, setHistory] = useState<HistoryEntry[]>([])

  // Load from localStorage
  useEffect(() => {
    const savedAppointments = localStorage.getItem("dental_appointments")

    if (savedAppointments) {
      const parsed = JSON.parse(savedAppointments)
      setAppointments(
        parsed.map((apt: any) => ({
          ...apt,
          date: new Date(apt.date),
          createdAt: new Date(apt.createdAt),
          updatedAt: new Date(apt.updatedAt),
        })),
      )
    } else {
      // Initialize with mock data
      setAppointments(MOCK_APPOINTMENTS)
      localStorage.setItem("dental_appointments", JSON.stringify(MOCK_APPOINTMENTS))
    }
    
    const savedHistory = localStorage.getItem("dental_history")
    if (savedHistory) {
      const parsedHistory = JSON.parse(savedHistory).map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp),
      }))
      
      // Remove duplicates - keep only first occurrence of each ID
      const seen = new Set<string>()
      const uniqueHistory = parsedHistory.filter((entry: HistoryEntry) => {
        if (seen.has(entry.id)) {
          return false
        }
        seen.add(entry.id)
        return true
      })
      
      setHistory(uniqueHistory)
      
      // Save cleaned history back to localStorage
      if (uniqueHistory.length !== parsedHistory.length) {
        localStorage.setItem("dental_history", JSON.stringify(uniqueHistory))
      }
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    if (appointments.length > 0) {
      localStorage.setItem("dental_appointments", JSON.stringify(appointments))
    }
  }, [appointments])
  
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem("dental_history", JSON.stringify(history))
    }
  }, [history])

  const addToHistory = (action: HistoryEntry["action"], appointmentId: string, oldData?: Partial<Appointment>, newData?: Partial<Appointment>, description?: string, userName?: string, userRole?: string) => {
    const entry: HistoryEntry = {
      id: `history-${Date.now()}-${++idCounter}`,
      timestamp: new Date(),
      action,
      appointmentId,
      oldData,
      newData,
      description: description || `${action} - ${appointmentId}`,
      userName: userName || "Administrátor", // Default user until we have auth
      userRole: userRole || "admin",
    }
    setHistory((prev) => [entry, ...prev].slice(0, 100)) // Keep last 100 entries
  }

  const addAppointment = (appointmentData: Omit<Appointment, "id" | "createdAt" | "updatedAt">) => {
    const newAppointment: Appointment = {
      ...appointmentData,
      id: `apt-${Date.now()}-${++idCounter}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setAppointments((prev) => [...prev, newAppointment])
    addToHistory("create", newAppointment.id, undefined, newAppointment, `Vytvořen termín: ${newAppointment.patientName}`)
  }

  const updateAppointment = (id: string, updates: Partial<Appointment>, action?: "drag" | "resize" | "update") => {
    setAppointments((prev) => {
      const oldApt = prev.find((apt) => apt.id === id)
      if (!oldApt) return prev
      
      const updatedApt = { ...oldApt, ...updates, updatedAt: new Date() }
      
      // Only add to history if action is provided
      if (action) {
        // Create description based on action
        let description = ""
        if (action === "drag") {
          const oldTime = oldApt.time
          const newTime = updates.time || oldApt.time
          const oldDate = new Date(oldApt.date).toLocaleDateString("cs-CZ", { day: "numeric", month: "numeric" })
          const newDate = updates.date ? new Date(updates.date).toLocaleDateString("cs-CZ", { day: "numeric", month: "numeric" }) : oldDate
          
          if (oldDate !== newDate) {
            description = `Změněno datum: ${oldApt.patientName} z ${oldDate} na ${newDate}`
          } else {
            description = `Přesunut termín: ${oldApt.patientName} na ${newTime}`
          }
        } else if (action === "resize") {
          const newDuration = updates.duration !== undefined ? updates.duration : oldApt.duration
          description = `Změněna délka: ${oldApt.patientName} z ${oldApt.duration} min na ${newDuration} min`
        } else {
          description = `Upraven termín: ${oldApt.patientName}`
        }
        
        addToHistory(action, id, oldApt, updatedApt, description)
      }
      
      return prev.map((apt) => (apt.id === id ? updatedApt : apt))
    })
  }

  const deleteAppointment = (id: string) => {
    const apt = appointments.find((a) => a.id === id)
    if (apt) {
      addToHistory("delete", id, apt, undefined, `Smazán termín: ${apt.patientName}`)
    }
    setAppointments((prev) => prev.filter((apt) => apt.id !== id))
  }
  
  const undoChange = (historyId: string) => {
    const entry = history.find((h) => h.id === historyId)
    if (!entry || !entry.oldData) return
    
    // Restore old data WITHOUT creating new history entry
    if (entry.action === "delete" && entry.oldData) {
      // Recreate deleted appointment
      setAppointments((prev) => [...prev, entry.oldData as Appointment])
    } else {
      // Restore updated appointment
      setAppointments((prev) =>
        prev.map((apt) => (apt.id === entry.appointmentId ? { ...apt, ...entry.oldData } : apt))
      )
    }
    
    // Don't add to history - just mark the entry as undone or remove it
    setHistory((prev) => prev.filter((h) => h.id !== historyId))
  }
  
  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem("dental_history")
  }

  const getAppointmentsByDate = (date: Date): Appointment[] => {
    return appointments
      .filter((apt) => {
        const aptDate = new Date(apt.date)
        return (
          aptDate.getFullYear() === date.getFullYear() &&
          aptDate.getMonth() === date.getMonth() &&
          aptDate.getDate() === date.getDate()
        )
      })
      .sort((a, b) => a.time.localeCompare(b.time))
  }

  const getAppointmentsByDateRange = (startDate: Date, endDate: Date): Appointment[] => {
    return appointments
      .filter((apt) => {
        const aptDate = new Date(apt.date)
        return aptDate >= startDate && aptDate <= endDate
      })
      .sort((a, b) => {
        const dateCompare = new Date(a.date).getTime() - new Date(b.date).getTime()
        if (dateCompare !== 0) return dateCompare
        return a.time.localeCompare(b.time)
      })
  }

  const getAppointmentsByPatient = (patientId: string): Appointment[] => {
    return appointments
      .filter((apt) => apt.patientId === patientId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  const hasConflict = (date: Date, time: string, duration: number, excludeId?: string): boolean => {
    const dayAppointments = getAppointmentsByDate(date).filter((apt) => apt.id !== excludeId)

    const parseTime = (timeStr: string) => {
      const [hours, minutes] = timeStr.split(":").map(Number)
      return hours * 60 + minutes
    }

    const newStart = parseTime(time)
    const newEnd = newStart + duration

    return dayAppointments.some((apt) => {
      const existingStart = parseTime(apt.time)
      const existingEnd = existingStart + apt.duration

      // Check if times overlap - two intervals overlap if one starts before the other ends
      return newStart < existingEnd && newEnd > existingStart
    })
  }

  return (
    <AppointmentContext.Provider
      value={{
        appointments,
        history,
        addAppointment,
        updateAppointment,
        deleteAppointment,
        getAppointmentsByDate,
        getAppointmentsByDateRange,
        getAppointmentsByPatient,
        hasConflict,
        undoChange,
        clearHistory,
        addToHistory,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  )
}

export function useAppointments() {
  const context = useContext(AppointmentContext)
  if (!context) {
    throw new Error("useAppointments must be used within AppointmentProvider")
  }
  return context
}
