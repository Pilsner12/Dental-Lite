"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"

// Types
export type DayOfWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday"

export interface TimeBlock {
  id: string
  startTime: string // Format: "HH:MM"
  endTime: string   // Format: "HH:MM"
}

export interface DaySchedule {
  isOpen: boolean
  timeBlocks: TimeBlock[]
}

export interface OfficeHoursData {
  schedule: Record<DayOfWeek, DaySchedule>
  lastUpdated: string
}

export interface ValidationResult {
  valid: boolean
  errors: string[]
}

export interface OfficeHoursContextType {
  officeHours: OfficeHoursData
  updateDaySchedule: (day: DayOfWeek, schedule: DaySchedule) => void
  addTimeBlock: (day: DayOfWeek, timeBlock: Omit<TimeBlock, 'id'>) => void
  removeTimeBlock: (day: DayOfWeek, blockId: string) => void
  updateTimeBlock: (day: DayOfWeek, blockId: string, updates: Partial<Omit<TimeBlock, 'id'>>) => void
  isTimeSlotAvailable: (day: DayOfWeek, time: string) => boolean
  getTimeSlotStatus: (day: DayOfWeek, time: string) => 'available' | 'closed' | 'outside-hours'
  validateTimeBlock: (timeBlock: Omit<TimeBlock, 'id'>, day: DayOfWeek, existingBlockId?: string) => ValidationResult
  resetToDefaults: () => void
}

// Utility functions
function isValidTimeFormat(time: string): boolean {
  return /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(time)
}

function isTimeInRange(time: string, start: string, end: string): boolean {
  return time >= start && time < end
}

function blocksOverlap(block1: Omit<TimeBlock, 'id'>, block2: TimeBlock): boolean {
  return block1.startTime < block2.endTime && block1.endTime > block2.startTime
}

function isValidOfficeHoursData(data: any): data is OfficeHoursData {
  return data &&
         data.schedule &&
         data.lunchBreak &&
         typeof data.lastUpdated === 'string'
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Default data
const defaultOfficeHours: OfficeHoursData = {
  schedule: {
    monday: {
      isOpen: true,
      timeBlocks: [{ id: generateId(), startTime: "08:00", endTime: "16:00" }]
    },
    tuesday: {
      isOpen: true,
      timeBlocks: [{ id: generateId(), startTime: "08:00", endTime: "16:00" }]
    },
    wednesday: {
      isOpen: true,
      timeBlocks: [{ id: generateId(), startTime: "08:00", endTime: "16:00" }]
    },
    thursday: {
      isOpen: true,
      timeBlocks: [{ id: generateId(), startTime: "08:00", endTime: "16:00" }]
    },
    friday: {
      isOpen: true,
      timeBlocks: [{ id: generateId(), startTime: "08:00", endTime: "16:00" }]
    },
    saturday: {
      isOpen: false,
      timeBlocks: []
    },
    sunday: {
      isOpen: false,
      timeBlocks: []
    }
  },
  lastUpdated: new Date().toISOString()
}

const STORAGE_KEY = "dental_office_hours"

// Context
const OfficeHoursContext = createContext<OfficeHoursContextType | undefined>(undefined)

export function OfficeHoursProvider({ children }: { children: ReactNode }) {
  const [officeHours, setOfficeHours] = useState<OfficeHoursData>(defaultOfficeHours)
  const [mounted, setMounted] = useState(false)

  // Initialize from localStorage
  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem(STORAGE_KEY)

    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (isValidOfficeHoursData(parsed)) {
          setOfficeHours(parsed)
        }
      } catch (error) {
        console.error("Failed to parse office hours from localStorage:", error)
      }
    }
  }, [])

  // Update day schedule
  const updateDaySchedule = (day: DayOfWeek, schedule: DaySchedule) => {
    setOfficeHours(prev => {
      const updated = {
        ...prev,
        schedule: { ...prev.schedule, [day]: schedule },
        lastUpdated: new Date().toISOString()
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }

  // Add time block
  const addTimeBlock = (day: DayOfWeek, timeBlock: Omit<TimeBlock, 'id'>) => {
    const newBlock: TimeBlock = {
      ...timeBlock,
      id: generateId()
    }

    setOfficeHours(prev => {
      const daySchedule = prev.schedule[day]
      const updated = {
        ...prev,
        schedule: {
          ...prev.schedule,
          [day]: {
            ...daySchedule,
            timeBlocks: [...daySchedule.timeBlocks, newBlock]
          }
        },
        lastUpdated: new Date().toISOString()
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }

  // Remove time block
  const removeTimeBlock = (day: DayOfWeek, blockId: string) => {
    setOfficeHours(prev => {
      const daySchedule = prev.schedule[day]
      const updated = {
        ...prev,
        schedule: {
          ...prev.schedule,
          [day]: {
            ...daySchedule,
            timeBlocks: daySchedule.timeBlocks.filter(block => block.id !== blockId)
          }
        },
        lastUpdated: new Date().toISOString()
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }

  // Update time block
  const updateTimeBlock = (day: DayOfWeek, blockId: string, updates: Partial<Omit<TimeBlock, 'id'>>) => {
    setOfficeHours(prev => {
      const daySchedule = prev.schedule[day]
      const updated = {
        ...prev,
        schedule: {
          ...prev.schedule,
          [day]: {
            ...daySchedule,
            timeBlocks: daySchedule.timeBlocks.map(block =>
              block.id === blockId ? { ...block, ...updates } : block
            )
          }
        },
        lastUpdated: new Date().toISOString()
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }

  // Validate time block
  const validateTimeBlock = (
    timeBlock: Omit<TimeBlock, 'id'>,
    day: DayOfWeek,
    existingBlockId?: string
  ): ValidationResult => {
    const errors: string[] = []

    // Validate time format
    if (!isValidTimeFormat(timeBlock.startTime)) {
      errors.push("Neplatný formát počátečního času (použijte HH:MM)")
    }
    if (!isValidTimeFormat(timeBlock.endTime)) {
      errors.push("Neplatný formát koncového času (použijte HH:MM)")
    }

    // Validate end > start
    if (timeBlock.endTime <= timeBlock.startTime) {
      errors.push("Koncový čas musí být po počátečním času")
    }

    // Check for overlaps
    const daySchedule = officeHours.schedule[day]
    const overlaps = daySchedule.timeBlocks.some(block => {
      if (existingBlockId && block.id === existingBlockId) return false
      return blocksOverlap(timeBlock, block)
    })

    if (overlaps) {
      errors.push("Časový blok se překrývá s jiným blokem")
    }

    // Check minimum duration (30 minutes)
    const [startHour, startMin] = timeBlock.startTime.split(':').map(Number)
    const [endHour, endMin] = timeBlock.endTime.split(':').map(Number)
    const durationMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin)

    if (durationMinutes < 30 && durationMinutes > 0) {
      errors.push("Minimální délka bloku je 30 minut")
    }

    return { valid: errors.length === 0, errors }
  }

  // Check if time slot is available
  const isTimeSlotAvailable = (day: DayOfWeek, time: string): boolean => {
    return getTimeSlotStatus(day, time) === 'available'
  }

  // Get time slot status for calendar
  const getTimeSlotStatus = (day: DayOfWeek, time: string):
    'available' | 'closed' | 'outside-hours' => {

    const daySchedule = officeHours.schedule[day]

    if (!daySchedule.isOpen) return 'closed'

    // Check if within any time block
    const inAnyBlock = daySchedule.timeBlocks.some(block =>
      isTimeInRange(time, block.startTime, block.endTime)
    )

    return inAnyBlock ? 'available' : 'outside-hours'
  }

  // Reset to defaults
  const resetToDefaults = () => {
    setOfficeHours(defaultOfficeHours)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultOfficeHours))
  }

  const value: OfficeHoursContextType = {
    officeHours,
    updateDaySchedule,
    addTimeBlock,
    removeTimeBlock,
    updateTimeBlock,
    isTimeSlotAvailable,
    getTimeSlotStatus,
    validateTimeBlock,
    resetToDefaults
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return null
  }

  return (
    <OfficeHoursContext.Provider value={value}>
      {children}
    </OfficeHoursContext.Provider>
  )
}

export function useOfficeHours() {
  const context = useContext(OfficeHoursContext)
  if (context === undefined) {
    throw new Error("useOfficeHours must be used within OfficeHoursProvider")
  }
  return context
}
