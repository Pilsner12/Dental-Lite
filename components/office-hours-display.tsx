"use client"

import { useOfficeHours } from "@/lib/office-hours-context"

const DAY_LABELS_SHORT: Record<string, string> = {
  monday: "Po",
  tuesday: "Út", 
  wednesday: "St",
  thursday: "Čt",
  friday: "Pá",
  saturday: "So",
  sunday: "Ne"
}

// Format time from "HH:MM" to "H" or "H.MM" (remove leading zeros and colons for whole hours)
const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':')
  const h = parseInt(hours, 10)
  const m = parseInt(minutes, 10)
  return m === 0 ? `${h}` : `${h}.${minutes}`
}

export function OfficeHoursDisplay() {
  const { officeHours } = useOfficeHours()

  const formatTimeBlocks = (day: string) => {
    const daySchedule = officeHours.schedule[day as keyof typeof officeHours.schedule]
    if (!daySchedule || !daySchedule.isOpen) return "ZAVŘENO"
    
    return daySchedule.timeBlocks
      .map(block => `${formatTime(block.startTime)}-${formatTime(block.endTime)}`)
      .join(" ")
  }

  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]

  return (
    <div className="text-sm text-gray-700">
      {days.map((day, index) => {
        const schedule = formatTimeBlocks(day)
        const isOpen = officeHours.schedule[day as keyof typeof officeHours.schedule]?.isOpen
        
        return (
          <span key={day}>
            <span className="font-medium">{DAY_LABELS_SHORT[day]}</span>{" "}
            <span className={isOpen ? "" : "text-red-600"}>{schedule}</span>
            {index < days.length - 1 && ", "}
          </span>
        )
      })}
    </div>
  )
}
