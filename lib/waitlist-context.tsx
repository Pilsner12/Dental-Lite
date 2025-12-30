"use client"

import React, { createContext, useContext, useState, type ReactNode } from "react"

export type WaitlistPriority = "low" | "medium" | "high"
export type WaitlistStatus = "waiting" | "contacted" | "scheduled" | "cancelled"

export interface WaitlistEntry {
  id: string
  patientId: string
  patientName: string
  phone: string
  preferredTime?: string // např. "dopoledne", "odpoledne", "čtvrtek 14:00"
  preferredDays?: string[] // např. ["monday", "wednesday"]
  priority: WaitlistPriority
  status: WaitlistStatus
  note?: string
  addedDate: string // ISO string
  contactedDate?: string // ISO string
  scheduledDate?: string // ISO string
  scheduledAppointmentId?: string
}

interface WaitlistContextType {
  entries: WaitlistEntry[]
  addEntry: (entry: Omit<WaitlistEntry, "id" | "addedDate" | "status">) => void
  updateEntry: (id: string, updates: Partial<WaitlistEntry>) => void
  removeEntry: (id: string) => void
  getEntriesByStatus: (status: WaitlistStatus) => WaitlistEntry[]
  getEntriesByPriority: (priority: WaitlistPriority) => WaitlistEntry[]
  markAsContacted: (id: string) => void
  markAsScheduled: (id: string, appointmentId: string) => void
  getWaitingEntries: () => WaitlistEntry[]
}

const WaitlistContext = createContext<WaitlistContextType | undefined>(undefined)

export function WaitlistProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<WaitlistEntry[]>([
    {
      id: "w1",
      patientId: "p1",
      patientName: "Jan Novák",
      phone: "+420 777 888 999",
      preferredTime: "dopoledne",
      preferredDays: ["monday", "wednesday"],
      priority: "high",
      status: "waiting",
      note: "Preferuje krátký termín, max 30 min",
      addedDate: new Date(2025, 0, 15).toISOString(),
    },
    {
      id: "w2",
      patientId: "p2",
      patientName: "Marie Svobodová",
      phone: "+420 605 123 456",
      preferredTime: "odpoledne",
      preferredDays: ["tuesday", "thursday"],
      priority: "medium",
      status: "waiting",
      note: "Kontrola, termín do 2 týdnů",
      addedDate: new Date(2025, 0, 20).toISOString(),
    },
    {
      id: "w3",
      patientId: "p3",
      patientName: "Petr Dvořák",
      phone: "+420 731 456 789",
      preferredDays: ["friday"],
      priority: "low",
      status: "contacted",
      note: "Čeká na potvrzení",
      addedDate: new Date(2025, 0, 10).toISOString(),
      contactedDate: new Date(2025, 0, 25).toISOString(),
    },
  ])

  const addEntry = (entry: Omit<WaitlistEntry, "id" | "addedDate" | "status">) => {
    const newEntry: WaitlistEntry = {
      ...entry,
      id: `w${Date.now()}`,
      addedDate: new Date().toISOString(),
      status: "waiting",
    }
    setEntries((prev) => [...prev, newEntry])
  }

  const updateEntry = (id: string, updates: Partial<WaitlistEntry>) => {
    setEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, ...updates } : entry))
    )
  }

  const removeEntry = (id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id))
  }

  const getEntriesByStatus = (status: WaitlistStatus) => {
    return entries.filter((entry) => entry.status === status)
  }

  const getEntriesByPriority = (priority: WaitlistPriority) => {
    return entries.filter((entry) => entry.priority === priority)
  }

  const markAsContacted = (id: string) => {
    updateEntry(id, {
      status: "contacted",
      contactedDate: new Date().toISOString(),
    })
  }

  const markAsScheduled = (id: string, appointmentId: string) => {
    updateEntry(id, {
      status: "scheduled",
      scheduledDate: new Date().toISOString(),
      scheduledAppointmentId: appointmentId,
    })
  }

  const getWaitingEntries = () => {
    return entries
      .filter((entry) => entry.status === "waiting")
      .sort((a, b) => {
        // Seřadit podle priority: high > medium > low
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
        if (priorityDiff !== 0) return priorityDiff
        
        // Pokud stejná priorita, seřadit podle data přidání (starší první)
        return new Date(a.addedDate).getTime() - new Date(b.addedDate).getTime()
      })
  }

  return (
    <WaitlistContext.Provider
      value={{
        entries,
        addEntry,
        updateEntry,
        removeEntry,
        getEntriesByStatus,
        getEntriesByPriority,
        markAsContacted,
        markAsScheduled,
        getWaitingEntries,
      }}
    >
      {children}
    </WaitlistContext.Provider>
  )
}

export function useWaitlist() {
  const context = useContext(WaitlistContext)
  if (context === undefined) {
    throw new Error("useWaitlist must be used within a WaitlistProvider")
  }
  return context
}
