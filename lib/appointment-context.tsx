"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export type AppointmentStatus = "confirmed" | "pending" | "completed" | "cancelled" | "no-show"

export interface Appointment {
  id: string
  patientId: string
  patientName: string
  date: Date
  time: string // "HH:MM"
  duration: number // minutes (30, 60, 90)
  service: string
  status: AppointmentStatus
  notes?: string
  createdAt: Date
  updatedAt: Date
}

interface AppointmentContextType {
  appointments: Appointment[]
  addAppointment: (appointment: Omit<Appointment, "id" | "createdAt" | "updatedAt">) => void
  updateAppointment: (id: string, updates: Partial<Appointment>) => void
  deleteAppointment: (id: string) => void
  getAppointmentsByDate: (date: Date) => Appointment[]
  getAppointmentsByDateRange: (startDate: Date, endDate: Date) => Appointment[]
  getAppointmentsByPatient: (patientId: string) => Appointment[]
  hasConflict: (date: Date, time: string, duration: number, excludeId?: string) => boolean
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined)

// Mock appointments for demo
const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: "apt-1",
    patientId: "1",
    patientName: "Jana Svobodová",
    date: new Date(2025, 0, 2), // 2. ledna 2025
    time: "08:30",
    duration: 30,
    service: "Preventivka",
    status: "confirmed",
    notes: "Pravidelná kontrola",
    createdAt: new Date(2024, 11, 20),
    updatedAt: new Date(2024, 11, 20)
  },
  {
    id: "apt-2",
    patientId: "2",
    patientName: "Petr Novák",
    date: new Date(2025, 0, 2),
    time: "09:30",
    duration: 60,
    service: "Plomba",
    status: "confirmed",
    notes: "Výměna staré plomby",
    createdAt: new Date(2024, 11, 21),
    updatedAt: new Date(2024, 11, 21)
  },
  {
    id: "apt-3",
    patientId: "3",
    patientName: "Eva Dvořáková",
    date: new Date(2025, 0, 2),
    time: "11:00",
    duration: 30,
    service: "Kontrola",
    status: "pending",
    createdAt: new Date(2024, 11, 22),
    updatedAt: new Date(2024, 11, 22)
  },
  {
    id: "apt-4",
    patientId: "7",
    patientName: "Barbora Horáková",
    date: new Date(2025, 0, 2),
    time: "14:00",
    duration: 45,
    service: "Dentální hygiena",
    status: "confirmed",
    createdAt: new Date(2024, 11, 23),
    updatedAt: new Date(2024, 11, 23)
  },
  {
    id: "apt-5",
    patientId: "9",
    patientName: "Tereza Němcová",
    date: new Date(2025, 0, 2),
    time: "15:30",
    duration: 60,
    service: "Bělení zubů",
    status: "pending",
    notes: "První sezení bělení",
    createdAt: new Date(2024, 11, 24),
    updatedAt: new Date(2024, 11, 24)
  },
  // Termíny pro další dny
  {
    id: "apt-6",
    patientId: "4",
    patientName: "Martin Procházka",
    date: new Date(2025, 0, 3),
    time: "09:00",
    duration: 30,
    service: "Preventivka",
    status: "confirmed",
    createdAt: new Date(2024, 11, 25),
    updatedAt: new Date(2024, 11, 25)
  },
  {
    id: "apt-7",
    patientId: "6",
    patientName: "Tomáš Veselý",
    date: new Date(2025, 0, 3),
    time: "10:30",
    duration: 60,
    service: "Korunka",
    status: "confirmed",
    notes: "Nasazení korunky",
    createdAt: new Date(2024, 11, 26),
    updatedAt: new Date(2024, 11, 26)
  },
  {
    id: "apt-8",
    patientId: "8",
    patientName: "Jakub Kučera",
    date: new Date(2025, 0, 6),
    time: "08:00",
    duration: 90,
    service: "Extrakce",
    status: "confirmed",
    notes: "Extrakce zubu moudrosti",
    createdAt: new Date(2024, 11, 27),
    updatedAt: new Date(2024, 11, 27)
  },
  {
    id: "apt-9",
    patientId: "10",
    patientName: "David Šmíd",
    date: new Date(2025, 0, 6),
    time: "11:00",
    duration: 30,
    service: "Kontrola",
    status: "pending",
    notes: "Kontrola po zákroku",
    createdAt: new Date(2024, 11, 28),
    updatedAt: new Date(2024, 11, 28)
  }
]

export function AppointmentProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>([])

  // Load from localStorage
  useEffect(() => {
    const savedAppointments = localStorage.getItem("dental_appointments")

    if (savedAppointments) {
      const parsed = JSON.parse(savedAppointments)
      setAppointments(parsed.map((apt: any) => ({
        ...apt,
        date: new Date(apt.date),
        createdAt: new Date(apt.createdAt),
        updatedAt: new Date(apt.updatedAt)
      })))
    } else {
      // Initialize with mock data
      setAppointments(MOCK_APPOINTMENTS)
      localStorage.setItem("dental_appointments", JSON.stringify(MOCK_APPOINTMENTS))
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    if (appointments.length > 0) {
      localStorage.setItem("dental_appointments", JSON.stringify(appointments))
    }
  }, [appointments])

  const addAppointment = (appointmentData: Omit<Appointment, "id" | "createdAt" | "updatedAt">) => {
    const newAppointment: Appointment = {
      ...appointmentData,
      id: `apt-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    setAppointments(prev => [...prev, newAppointment])
  }

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    setAppointments(prev => prev.map(apt =>
      apt.id === id
        ? { ...apt, ...updates, updatedAt: new Date() }
        : apt
    ))
  }

  const deleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(apt => apt.id !== id))
  }

  const getAppointmentsByDate = (date: Date): Appointment[] => {
    return appointments.filter(apt => {
      const aptDate = new Date(apt.date)
      return (
        aptDate.getFullYear() === date.getFullYear() &&
        aptDate.getMonth() === date.getMonth() &&
        aptDate.getDate() === date.getDate()
      )
    }).sort((a, b) => a.time.localeCompare(b.time))
  }

  const getAppointmentsByDateRange = (startDate: Date, endDate: Date): Appointment[] => {
    return appointments.filter(apt => {
      const aptDate = new Date(apt.date)
      return aptDate >= startDate && aptDate <= endDate
    }).sort((a, b) => {
      const dateCompare = new Date(a.date).getTime() - new Date(b.date).getTime()
      if (dateCompare !== 0) return dateCompare
      return a.time.localeCompare(b.time)
    })
  }

  const getAppointmentsByPatient = (patientId: string): Appointment[] => {
    return appointments.filter(apt => apt.patientId === patientId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  const hasConflict = (date: Date, time: string, duration: number, excludeId?: string): boolean => {
    const dayAppointments = getAppointmentsByDate(date).filter(apt => apt.id !== excludeId)
    
    const parseTime = (timeStr: string) => {
      const [hours, minutes] = timeStr.split(':').map(Number)
      return hours * 60 + minutes
    }

    const newStart = parseTime(time)
    const newEnd = newStart + duration

    return dayAppointments.some(apt => {
      const existingStart = parseTime(apt.time)
      const existingEnd = existingStart + apt.duration

      // Check if times overlap
      return (
        (newStart >= existingStart && newStart < existingEnd) ||
        (newEnd > existingStart && newEnd <= existingEnd) ||
        (newStart <= existingStart && newEnd >= existingEnd)
      )
    })
  }

  return (
    <AppointmentContext.Provider value={{
      appointments,
      addAppointment,
      updateAppointment,
      deleteAppointment,
      getAppointmentsByDate,
      getAppointmentsByDateRange,
      getAppointmentsByPatient,
      hasConflict
    }}>
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
