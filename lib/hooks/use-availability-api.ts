/**
 * API Availability Endpoint (Mock)
 * 
 * Jednoduchý mock endpoint pro API dostupnost termínů
 * Feature pro BUSINESS+ tier
 * 
 * Umožňuje externím systémům dotazovat se na volné termíny
 * Pro skutečné použití by to bylo Next.js API route
 * 
 * @tier BUSINESS+
 * @version 1.0.0 - LEAN Edition
 */

import { useAppointments } from '@/lib/appointment-context'
import { useOfficeHours } from '@/lib/office-hours-context'

export interface AvailabilitySlot {
  date: string // ISO string
  time: string // HH:MM
  available: boolean
  duration: number // minutes
}

export interface AvailabilityResponse {
  success: boolean
  data: AvailabilitySlot[]
  count: number
  date_from: string
  date_to: string
}

/**
 * Hook pro získání dostupných termínů
 * Simuluje API endpoint pro BUSINESS tier
 */
export function useAvailabilityAPI() {
  const { appointments, hasConflict } = useAppointments()
  const { isTimeSlotAvailable } = useOfficeHours()

  /**
   * Získá dostupné termíny pro zadané období
   * @param dateFrom Datum od (ISO string)
   * @param dateTo Datum do (ISO string)
   * @param duration Požadovaná délka termínu v minutách
   * @returns Seznam dostupných slotů
   */
  const getAvailability = (
    dateFrom: string,
    dateTo: string,
    duration: number = 30
  ): AvailabilityResponse => {
    const startDate = new Date(dateFrom)
    const endDate = new Date(dateTo)
    const slots: AvailabilitySlot[] = []

    // Pracovní hodiny (7-19)
    const workingHours = Array.from({ length: 13 }, (_, i) => i + 7)
    
    // Projdi každý den v rozsahu
    let currentDate = new Date(startDate)
    while (currentDate <= endDate) {
      // Pouze pracovní dny (Po-Pá)
      const dayOfWeek = currentDate.getDay()
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        // Projdi každou hodinu
        workingHours.forEach(hour => {
          // Každý půlhodinový slot
          for (let minute = 0; minute < 60; minute += 30) {
            const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
            const slotDate = new Date(currentDate)
            slotDate.setHours(hour, minute, 0, 0)

            // Ověř ordinační hodiny
            const dayNames = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as const
            const dayName = dayNames[dayOfWeek - 1]
            const isOfficeOpen = isTimeSlotAvailable(dayName, time)

            // Ověř konflikty
            const hasConflictInSlot = hasConflict(currentDate, time, duration)

            slots.push({
              date: currentDate.toISOString().split('T')[0],
              time,
              available: isOfficeOpen && !hasConflictInSlot,
              duration,
            })
          }
        })
      }

      // Další den
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return {
      success: true,
      data: slots,
      count: slots.filter(s => s.available).length,
      date_from: dateFrom,
      date_to: dateTo,
    }
  }

  /**
   * Získá pouze volné termíny (bez obsazených)
   */
  const getAvailableSlotsOnly = (
    dateFrom: string,
    dateTo: string,
    duration: number = 30
  ): AvailabilitySlot[] => {
    const response = getAvailability(dateFrom, dateTo, duration)
    return response.data.filter(slot => slot.available)
  }

  return {
    getAvailability,
    getAvailableSlotsOnly,
  }
}

/**
 * Příklad použití pro skutečné API route:
 * 
 * ```typescript
 * // app/api/availability/route.ts
 * import { NextResponse } from 'next/server'
 * 
 * export async function GET(request: Request) {
 *   const { searchParams } = new URL(request.url)
 *   const dateFrom = searchParams.get('from')
 *   const dateTo = searchParams.get('to')
 *   const duration = parseInt(searchParams.get('duration') || '30')
 * 
 *   // Ověření tier (BUSINESS+)
 *   const userTier = await getUserTier() // z session/auth
 *   if (userTier === 'basic') {
 *     return NextResponse.json({ error: 'Feature requires BUSINESS tier' }, { status: 403 })
 *   }
 * 
 *   const availability = getAvailability(dateFrom, dateTo, duration)
 *   return NextResponse.json(availability)
 * }
 * ```
 * 
 * Volání:
 * GET /api/availability?from=2025-12-29&to=2025-12-31&duration=30
 */
