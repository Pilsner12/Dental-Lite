"use client"

import { useState } from "react"
import { useOfficeHours, DayOfWeek } from "@/lib/office-hours-context"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Plus, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

const DAY_LABELS: Record<string, string> = {
  monday: "Pondělí",
  tuesday: "Úterý",
  wednesday: "Středa",
  thursday: "Čtvrtek",
  friday: "Pátek",
  saturday: "Sobota",
  sunday: "Neděle"
}

const DAYS_ORDER = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]

export function OfficeHoursEditor() {
  const {
    officeHours,
    updateDaySchedule,
    addTimeBlock,
    removeTimeBlock,
    updateTimeBlock,
    validateTimeBlock
  } = useOfficeHours()

  const [errors, setErrors] = useState<Record<string, string[]>>({})

  const handleDayToggle = (day: string, checked: boolean) => {
    const daySchedule = officeHours.schedule[day as DayOfWeek]
    updateDaySchedule(day as DayOfWeek, {
      ...daySchedule,
      isOpen: checked
    })
  }

  const handleTimeChange = (
    day: string,
    blockId: string,
    field: 'startTime' | 'endTime',
    value: string
  ) => {
    const daySchedule = officeHours.schedule[day as DayOfWeek]
    const block = daySchedule.timeBlocks.find(b => b.id === blockId)

    if (!block) return

    const updatedBlock = { ...block, [field]: value }
    const validation = validateTimeBlock(
      { startTime: updatedBlock.startTime, endTime: updatedBlock.endTime },
      day as DayOfWeek,
      blockId
    )

    if (!validation.valid) {
      setErrors(prev => ({ ...prev, [`${day}-${blockId}`]: validation.errors }))
    } else {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[`${day}-${blockId}`]
        return newErrors
      })
    }

    updateTimeBlock(day as DayOfWeek, blockId, { [field]: value })
  }

  const handleAddBlock = (day: string) => {
    const daySchedule = officeHours.schedule[day as DayOfWeek]

    // Default new block: start after last block or 08:00
    let newStart = "08:00"
    let newEnd = "12:00"

    if (daySchedule.timeBlocks.length > 0) {
      const lastBlock = daySchedule.timeBlocks[daySchedule.timeBlocks.length - 1]
      newStart = lastBlock.endTime
      // Add 4 hours
      const [hours, minutes] = newStart.split(':').map(Number)
      const newHours = Math.min(hours + 4, 20)
      newEnd = `${String(newHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
    }

    addTimeBlock(day as DayOfWeek, { startTime: newStart, endTime: newEnd })
  }

  const handleRemoveBlock = (day: string, blockId: string) => {
    removeTimeBlock(day as DayOfWeek, blockId)
    // Clear errors for this block
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[`${day}-${blockId}`]
      return newErrors
    })
  }

  return (
    <div className="space-y-6">
      {/* Days Schedule */}
      <div className="space-y-4">
        {DAYS_ORDER.map(day => {
          const daySchedule = officeHours.schedule[day as DayOfWeek]

          return (
            <div key={day} className="border rounded-lg p-4 space-y-3">
              {/* Day Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={daySchedule.isOpen}
                    onCheckedChange={(checked) => handleDayToggle(day, checked)}
                  />
                  <span className="font-medium text-gray-900 w-24">
                    {DAY_LABELS[day]}
                  </span>
                </div>

                {!daySchedule.isOpen && (
                  <span className="text-red-600 font-medium">ZAVŘENO</span>
                )}
              </div>

              {/* Time Blocks */}
              {daySchedule.isOpen && (
                <div className="space-y-2 ml-11">
                  {daySchedule.timeBlocks.map((block, index) => {
                    const blockErrors = errors[`${day}-${block.id}`]

                    return (
                      <div key={block.id} className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-500 w-16">
                            Blok {index + 1}
                          </span>
                          <Input
                            type="time"
                            value={block.startTime}
                            onChange={(e) => handleTimeChange(day, block.id, 'startTime', e.target.value)}
                            className={cn(
                              "w-32",
                              blockErrors && "border-red-500"
                            )}
                          />
                          <span className="text-gray-500">-</span>
                          <Input
                            type="time"
                            value={block.endTime}
                            onChange={(e) => handleTimeChange(day, block.id, 'endTime', e.target.value)}
                            className={cn(
                              "w-32",
                              blockErrors && "border-red-500"
                            )}
                          />
                          {daySchedule.timeBlocks.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveBlock(day, block.id)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        {blockErrors && (
                          <div className="ml-20 text-sm text-red-600">
                            {blockErrors.map((error, i) => (
                              <div key={i}>• {error}</div>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddBlock(day)}
                    className="mt-2"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Přidat časový blok
                  </Button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Save Status */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="text-sm text-gray-500">
          Poslední změna: {new Date(officeHours.lastUpdated).toLocaleString('cs-CZ')}
        </div>
        {Object.keys(errors).length > 0 && (
          <div className="text-sm text-red-600">
            Opravte chyby před uložením
          </div>
        )}
      </div>
    </div>
  )
}
