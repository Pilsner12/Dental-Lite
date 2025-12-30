"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppointments, type Appointment, type AppointmentStatus } from "@/lib/appointment-context"
import {
  Trash2,
  Calendar,
  Clock,
  User,
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Phone,
  History,
  Ban,
  ExternalLink,
} from "lucide-react"
import { MOCK_PATIENTS } from "@/lib/mock-patients"

interface AppointmentDetailModalProps {
  open: boolean
  onClose: () => void
  appointment: Appointment | null
}

const SERVICES = [
  "Preventivka",
  "Kontrola",
  "Plomba",
  "Korunka",
  "Implantát",
  "Extrakce",
  "Bělení zubů",
  "Dentální hygiena",
  "Ortodoncie",
  "Ošetření kořenových kanálků",
  "Neordinuje se (blokace)",
]

const DURATIONS = [
  { value: 30, label: "30 minut" },
  { value: 45, label: "45 minut" },
  { value: 60, label: "1 hodina" },
  { value: 90, label: "1.5 hodiny" },
  { value: 120, label: "2 hodiny" },
]

const STATUS_CONFIG = {
  confirmed: { label: "Potvrzeno", color: "text-gray-900 bg-green-50 border-green-200", icon: CheckCircle2 },
  pending: { label: "Čeká na potvrzení", color: "text-gray-900 bg-yellow-50 border-yellow-200", icon: AlertCircle },
  completed: { label: "Dokončeno", color: "text-gray-900 bg-gray-50 border-gray-200", icon: CheckCircle2 },
  cancelled: { label: "Zrušeno", color: "text-gray-900 bg-gray-50 border-gray-200", icon: XCircle },
  "no-show": { label: "Nedostavil se", color: "text-gray-900 bg-gray-50 border-gray-200", icon: XCircle },
  blocked: { label: "Neordinuje se", color: "text-gray-900 bg-gray-50 border-gray-200", icon: Ban },
}

export function AppointmentDetailModal({ open, onClose, appointment }: AppointmentDetailModalProps) {
  const router = useRouter()
  const { updateAppointment, deleteAppointment, hasConflict, getAppointmentsByPatient } = useAppointments()
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState("")
  const [showHistory, setShowHistory] = useState(false)

  const [editData, setEditData] = useState({
    date: appointment?.date || new Date(),
    time: appointment?.time || "09:00",
    duration: appointment?.duration || 30,
    service: appointment?.service || "Kontrola",
    status: appointment?.status || ("pending" as AppointmentStatus),
    notes: appointment?.notes || "",
  })

  if (!appointment) return null

  const patient = MOCK_PATIENTS.find((p) => p.id === appointment.patientId)
  const patientHistory = getAppointmentsByPatient(appointment.patientId).filter((a) => a.status === "completed")

  const statusConfig = STATUS_CONFIG[appointment.status] || STATUS_CONFIG.pending
  const StatusIcon = statusConfig.icon

  const handleSave = () => {
    setError("")

    if (hasConflict(editData.date, editData.time, editData.duration, appointment.id)) {
      setError("V tomto čase již existuje jiný termín")
      return
    }

    updateAppointment(appointment.id, {
      date: editData.date,
      time: editData.time,
      duration: editData.duration,
      service: editData.service,
      status: editData.status,
      notes: editData.notes,
    })

    setIsEditing(false)
    onClose()
  }

  const handleDelete = () => {
    if (confirm(`Opravdu chcete smazat termín pro ${appointment.patientName}?`)) {
      deleteAppointment(appointment.id)
      onClose()
    }
  }

  const handleQuickConfirm = () => {
    updateAppointment(appointment.id, { status: "confirmed" })
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("cs-CZ", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (time: string, duration: number) => {
    const [hours, minutes] = time.split(":").map(Number)
    const endMinutes = hours * 60 + minutes + duration
    const endHours = Math.floor(endMinutes / 60)
    const endMins = endMinutes % 60
    return `${time} - ${String(endHours).padStart(2, "0")}:${String(endMins).padStart(2, "0")}`
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium text-gray-900">Detail termínu</DialogTitle>
          <DialogDescription className="text-gray-500">
            Zobrazení a úprava detailů termínu pacienta
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Badge */}
          <div className={`flex items-center gap-2 px-4 py-3 rounded-md border ${statusConfig.color}`}>
            <StatusIcon className="h-4 w-4" />
            <span className="font-medium text-sm">{statusConfig.label}</span>
            {appointment.status === "pending" && !isEditing && (
              <Button size="sm" onClick={handleQuickConfirm} className="ml-auto bg-gray-900 hover:bg-gray-800 text-white">
                <CheckCircle2 className="h-4 w-4 mr-1" />
                Potvrdit termín
              </Button>
            )}
          </div>

          {!isEditing ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-white border border-gray-100 rounded-md">
                <User className="h-4 w-4 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <div className="text-xs text-gray-500">Pacient</div>
                  <div className="font-medium text-lg text-gray-900">{appointment.patientName}</div>
                  {patient && (
                    <div className="flex flex-col gap-2 mt-2">
                      <a
                        href={`tel:${patient.personalInfo.phone}`}
                        className="flex items-center gap-2 text-gray-900 hover:text-gray-700 text-sm font-medium"
                      >
                        <Phone className="h-3.5 w-3.5" />
                        {patient.personalInfo.phone}
                      </a>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          router.push(`/admin/patients?id=${appointment.patientId}`)
                          onClose()
                        }}
                        className="w-fit gap-2 border-gray-200 hover:bg-gray-50"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Přejít do karty pacienta
                      </Button>
                    </div>
                  )}
                </div>
                {patientHistory.length > 0 && (
                  <Button variant="outline" size="sm" onClick={() => setShowHistory(!showHistory)} className="ml-auto border-gray-200 hover:bg-gray-50">
                    <History className="h-3.5 w-3.5 mr-1" />
                    Historie ({patientHistory.length})
                  </Button>
                )}
              </div>

              {showHistory && patientHistory.length > 0 && (
                <div className="border border-gray-100 rounded-md p-4 bg-gray-50">
                  <h4 className="font-medium text-sm mb-3 flex items-center gap-2 text-gray-900">
                    <History className="h-4 w-4" />
                    Minulé návštěvy (z diáře)
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {patientHistory.slice(0, 10).map((apt) => (
                      <div key={apt.id} className="text-xs p-2 bg-white rounded border border-gray-100">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900">{new Date(apt.date).toLocaleDateString("cs-CZ")}</span>
                          <span className="text-gray-500">{apt.service}</span>
                        </div>
                        {apt.notes && <div className="text-gray-500 mt-1 italic">{apt.notes}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 bg-white border border-gray-100 rounded-md">
                  <Calendar className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-xs text-gray-500">Datum</div>
                    <div className="font-medium text-gray-900">{formatDate(appointment.date)}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-white border border-gray-100 rounded-md">
                  <Clock className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-xs text-gray-500">Čas</div>
                    <div className="font-medium text-gray-900">{formatTime(appointment.time, appointment.duration)}</div>
                    <div className="text-xs text-gray-400">({appointment.duration} minut)</div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white border border-gray-100 rounded-md">
                <div className="text-xs text-gray-500 mb-1">Typ ošetření</div>
                <div className="font-medium text-gray-900">{appointment.service}</div>
              </div>

              {appointment.notes && (
                <div className="flex items-start gap-3 p-4 bg-white border border-gray-100 rounded-md">
                  <FileText className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-1">Poznámky</div>
                    <div className="text-gray-900 whitespace-pre-wrap">{appointment.notes}</div>
                  </div>
                </div>
              )}

              <div className="text-xs text-gray-500 pt-4 border-t">
                Vytvořeno: {new Date(appointment.createdAt).toLocaleString("cs-CZ")}
                {appointment.updatedAt !== appointment.createdAt && (
                  <> • Upraveno: {new Date(appointment.updatedAt).toLocaleString("cs-CZ")}</>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-date">Datum</Label>
                  <Input
                    id="edit-date"
                    type="date"
                    value={editData.date instanceof Date ? editData.date.toISOString().split("T")[0] : editData.date}
                    onChange={(e) => setEditData((prev) => ({ ...prev, date: new Date(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-time">Čas</Label>
                  <Input
                    id="edit-time"
                    type="time"
                    value={editData.time}
                    onChange={(e) => setEditData((prev) => ({ ...prev, time: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-service">Typ ošetření</Label>
                  <Select
                    value={editData.service}
                    onValueChange={(value) => setEditData((prev) => ({ ...prev, service: value }))}
                  >
                    <SelectTrigger id="edit-service">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICES.map((service) => (
                        <SelectItem key={service} value={service}>
                          {service}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-duration">Délka</Label>
                  <Select
                    value={editData.duration.toString()}
                    onValueChange={(value) => setEditData((prev) => ({ ...prev, duration: Number.parseInt(value) }))}
                  >
                    <SelectTrigger id="edit-duration">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DURATIONS.map((dur) => (
                        <SelectItem key={dur.value} value={dur.value.toString()}>
                          {dur.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={editData.status}
                  onValueChange={(value) => setEditData((prev) => ({ ...prev, status: value as AppointmentStatus }))}
                >
                  <SelectTrigger id="edit-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Čeká na potvrzení</SelectItem>
                    <SelectItem value="confirmed">Potvrzeno</SelectItem>
                    <SelectItem value="completed">Dokončeno</SelectItem>
                    <SelectItem value="cancelled">Zrušeno</SelectItem>
                    {(() => {
                      const appointmentDateTime = new Date(appointment.date)
                      const [hours, minutes] = appointment.time.split(':').map(Number)
                      appointmentDateTime.setHours(hours, minutes, 0, 0)
                      const isPast = appointmentDateTime < new Date()
                      return isPast ? <SelectItem value="no-show">Nedostavil se</SelectItem> : null
                    })()}
                    <SelectItem value="blocked">Neordinuje se (blokace)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="edit-notes">Poznámky</Label>
                <Textarea
                  id="edit-notes"
                  placeholder="Volitelné poznámky k termínu..."
                  value={editData.notes}
                  onChange={(e) => setEditData((prev) => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                />
              </div>

              {error && <div className="bg-red-50 border border-red-200 text-gray-900 px-4 py-3 rounded-md text-sm">{error}</div>}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <Button
              variant="outline"
              onClick={handleDelete}
              className="text-gray-900 hover:bg-red-50 border-gray-200"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Smazat termín
            </Button>

            <div className="flex gap-3">
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false)
                      setError("")
                      setEditData({
                        date: appointment.date,
                        time: appointment.time,
                        duration: appointment.duration,
                        service: appointment.service,
                        status: appointment.status,
                        notes: appointment.notes || "",
                      })
                    }}
                    className="border-gray-200 hover:bg-gray-50"
                  >
                    Zrušit
                  </Button>
                  <Button onClick={handleSave} className="bg-gray-900 hover:bg-gray-800">Uložit změny</Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={onClose} className="border-gray-200 hover:bg-gray-50">
                    Zavřít
                  </Button>
                  <Button onClick={() => setIsEditing(true)} className="bg-gray-900 hover:bg-gray-800">Upravit termín</Button>
                </>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
