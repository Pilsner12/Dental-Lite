/**
 * useDragAndDrop Hook
 * 
 * Hook pro drag & drop funkcionalitu v kalendáři
 * Připravený pro budoucí použití, aktuálně DISABLED pro BASIC tier
 * 
 * Features:
 * - Přesun termínů drag & drop v kalendáři
 * - Validace konfliktů při přesunu
 * - Validace ordinačních hodin
 * - Tier gating (BUSINESS+)
 * 
 * @version 1.0.0 - LEAN Edition
 * @status PREPARED (not active)
 */

import { useState, useCallback } from 'react'
import type { Appointment } from '@/lib/appointment-context'

export interface DragDropState {
  isDragging: boolean
  draggedAppointment: Appointment | null
  targetSlot: { date: Date; time: string } | null
}

export interface UseDragDropOptions {
  enabled?: boolean // Feature flag
  onDrop?: (appointment: Appointment, newDate: Date, newTime: string) => void
  validateConflict?: (date: Date, time: string, duration: number, excludeId?: string) => boolean
  validateOfficeHours?: (date: Date, hour: number) => boolean
}

export function useDragAndDrop(options: UseDragDropOptions = {}) {
  const {
    enabled = false, // Defaultně vypnutý
    onDrop,
    validateConflict,
    validateOfficeHours,
  } = options

  const [state, setState] = useState<DragDropState>({
    isDragging: false,
    draggedAppointment: null,
    targetSlot: null,
  })

  const handleDragStart = useCallback((appointment: Appointment) => {
    if (!enabled) return

    setState({
      isDragging: true,
      draggedAppointment: appointment,
      targetSlot: null,
    })
  }, [enabled])

  const handleDragOver = useCallback((date: Date, time: string) => {
    if (!enabled || !state.isDragging) return

    setState(prev => ({
      ...prev,
      targetSlot: { date, time },
    }))
  }, [enabled, state.isDragging])

  const handleDrop = useCallback(() => {
    if (!enabled || !state.draggedAppointment || !state.targetSlot) {
      setState({
        isDragging: false,
        draggedAppointment: null,
        targetSlot: null,
      })
      return
    }

    const { draggedAppointment, targetSlot } = state
    const { date, time } = targetSlot

    // Validace ordinačních hodin
    if (validateOfficeHours) {
      const [hour] = time.split(':').map(Number)
      if (!validateOfficeHours(date, hour)) {
        console.warn('Cannot drop appointment outside office hours')
        setState({
          isDragging: false,
          draggedAppointment: null,
          targetSlot: null,
        })
        return
      }
    }

    // Validace konfliktů
    if (validateConflict) {
      const hasConflict = validateConflict(
        date,
        time,
        draggedAppointment.duration,
        draggedAppointment.id
      )
      if (hasConflict) {
        console.warn('Cannot drop appointment - conflict detected')
        setState({
          isDragging: false,
          draggedAppointment: null,
          targetSlot: null,
        })
        return
      }
    }

    // Zavolat callback
    if (onDrop) {
      onDrop(draggedAppointment, date, time)
    }

    // Reset state
    setState({
      isDragging: false,
      draggedAppointment: null,
      targetSlot: null,
    })
  }, [enabled, state, onDrop, validateConflict, validateOfficeHours])

  const handleDragCancel = useCallback(() => {
    setState({
      isDragging: false,
      draggedAppointment: null,
      targetSlot: null,
    })
  }, [])

  return {
    // State
    isDragging: state.isDragging,
    draggedAppointment: state.draggedAppointment,
    targetSlot: state.targetSlot,

    // Handlers
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragCancel,

    // Config
    isEnabled: enabled,
  }
}

/**
 * Příklad použití:
 * 
 * ```tsx
 * const { tier } = useTier()
 * const { updateAppointment, hasConflict } = useAppointments()
 * const { isTimeSlotAvailable } = useOfficeHours()
 * 
 * const dragDrop = useDragAndDrop({
 *   enabled: tier !== 'basic', // BUSINESS+ only
 *   onDrop: (apt, newDate, newTime) => {
 *     updateAppointment(apt.id, { date: newDate, time: newTime })
 *   },
 *   validateConflict: hasConflict,
 *   validateOfficeHours: isTimeSlotAvailable,
 * })
 * 
 * // V kalendáři:
 * <div
 *   draggable={dragDrop.isEnabled}
 *   onDragStart={() => dragDrop.handleDragStart(appointment)}
 * >
 *   {appointment.patientName}
 * </div>
 * ```
 */
