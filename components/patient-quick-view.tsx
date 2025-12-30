"use client"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Phone, AlertCircle, Calendar } from "lucide-react"
import { type Patient } from "@/lib/mock-patients"
import { useAppointments } from "@/lib/appointment-context"

interface PatientQuickViewProps {
  patient: Patient | null
  children: React.ReactNode
}

export function PatientQuickView({ patient, children }: PatientQuickViewProps) {
  const { getAppointmentsByPatient } = useAppointments()

  if (!patient) {
    return <>{children}</>
  }

  const appointments = getAppointmentsByPatient(patient.id)
  const pastAppointments = appointments
    .filter(apt => new Date(apt.date) < new Date() && apt.status === 'completed')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  
  const lastVisit = pastAppointments[0]
  const allergies = patient.medicalInfo.allergies?.join(", ") || "Žádné"

  const formatDate = (date: Date) => {
    const d = new Date(date)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return "Dnes"
    if (diffDays === 1) return "Včera"
    if (diffDays < 7) return `Před ${diffDays} dny`
    if (diffDays < 30) return `Před ${Math.floor(diffDays / 7)} týdny`
    return d.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'short' })
  }

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent side="right" className="w-80 p-4" sideOffset={5}>
          <div className="space-y-3">
            {/* Hlavička */}
            <div className="border-b pb-2">
              <h4 className="font-semibold text-base">
                {patient.personalInfo.firstName} {patient.personalInfo.lastName}
              </h4>
              <p className="text-xs text-gray-500">
                {patient.personalInfo.age} let • {patient.personalInfo.gender === 'male' ? 'Muž' : 'Žena'}
              </p>
            </div>

            {/* Telefon */}
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-blue-600" />
              <a 
                href={`tel:${patient.personalInfo.phone}`}
                className="text-blue-600 hover:underline font-medium"
                onClick={(e) => e.stopPropagation()}
              >
                {patient.personalInfo.phone}
              </a>
            </div>

            {/* Alergie - zvýrazněné */}
            {patient.medicalInfo.allergies && patient.medicalInfo.allergies.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded p-2">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <div className="font-semibold text-red-900">Alergie:</div>
                    <div className="text-red-800">{allergies}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Poslední návštěva */}
            {lastVisit && (
              <div className="flex items-start gap-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-500 mt-0.5" />
                <div>
                  <div className="text-gray-700">
                    <span className="font-medium">Poslední návštěva:</span>{' '}
                    {formatDate(lastVisit.date)}
                  </div>
                  <div className="text-xs text-gray-500">{lastVisit.service}</div>
                </div>
              </div>
            )}

            {/* Doktorova poznámka */}
            {patient.medicalInfo.notes && (
              <div className="bg-blue-50 border border-blue-200 rounded p-2">
                <div className="text-xs font-semibold text-blue-900 mb-1">Doktorova poznámka:</div>
                <div className="text-sm text-blue-800 line-clamp-3">
                  {patient.medicalInfo.notes}
                </div>
              </div>
            )}

            {/* Počet návštěv */}
            <div className="text-xs text-gray-500 pt-2 border-t">
              Celkem návštěv: {pastAppointments.length}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
