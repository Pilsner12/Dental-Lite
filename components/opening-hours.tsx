"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock } from "lucide-react"
import { useOfficeHours, DayOfWeek } from "@/lib/office-hours-context"

const DAY_LABELS: Record<DayOfWeek, string> = {
  monday: "Pondělí",
  tuesday: "Úterý",
  wednesday: "Středa",
  thursday: "Čtvrtek",
  friday: "Pátek",
  saturday: "Sobota",
  sunday: "Neděle"
}

const DAYS_ORDER: DayOfWeek[] = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]

export function OpeningHours() {
  const { officeHours } = useOfficeHours()

  // Format time blocks for display
  const formatTimeBlocks = (day: DayOfWeek) => {
    const daySchedule = officeHours.schedule[day]

    if (!daySchedule.isOpen) {
      return "Zavřeno"
    }

    // Sort blocks by start time
    const sortedBlocks = [...daySchedule.timeBlocks].sort((a, b) =>
      a.startTime.localeCompare(b.startTime)
    )

    // Format each block
    return sortedBlocks
      .map(block => `${block.startTime} - ${block.endTime}`)
      .join(", ")
  }

  // Format breaks for display
  const formatBreaks = (day: DayOfWeek) => {
    const daySchedule = officeHours.schedule[day]

    if (!daySchedule.isOpen || !daySchedule.breaks || daySchedule.breaks.length === 0) {
      return null
    }

    return daySchedule.breaks
      .map(b => `${b.name}: ${b.startTime} - ${b.endTime}`)
      .join(", ")
  }

  return (
    <section className="py-16 md:py-24 bg-[#f8fafc]">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-full bg-[#2563eb]/10 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-[#2563eb]" />
              </div>
              <CardTitle className="text-3xl text-gray-900">Ordinační hodiny</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {DAYS_ORDER.map((day) => {
                  const daySchedule = officeHours.schedule[day]
                  const timeText = formatTimeBlocks(day)
                  const breaksText = formatBreaks(day)
                  const isClosed = !daySchedule.isOpen

                  return (
                    <div
                      key={day}
                      className={`py-3 px-4 rounded-lg ${
                        isClosed
                          ? "bg-gray-50"
                          : "bg-white border border-gray-200"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className={`font-medium ${isClosed ? "text-gray-500" : "text-gray-900"}`}>
                          {DAY_LABELS[day]}
                        </span>
                        <span
                          className={`font-semibold ${
                            isClosed ? "text-gray-500" : "text-[#059669]"
                          }`}
                        >
                          {timeText}
                        </span>
                      </div>
                      {breaksText && (
                        <div className="mt-1 text-xs text-gray-500 text-right">
                          {breaksText}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
