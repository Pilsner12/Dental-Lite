"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppointments, Appointment, AppointmentStatus } from "@/lib/appointment-context"
import { Trash2, Calendar, Clock, User, FileText, CheckCircle2, XCircle, AlertCircle } from "lucide-react"

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
  "Ošetření kořenových kanálků"
]

const DURATIONS = [
  { value: 30, label: "30 minut" },
  { value: 45, label: "45 minut" },
  { value: 60, label: "1 hodina" },
  { value: 90, label: "1.5 hodiny" },
  { value: 120, label: "2 hodiny" }
]

const STATUS_CONFIG = {
  confirmed: { label: "Potvrzeno", color: "text-green-700 bg-green-50 border-green-200", icon: CheckCircle2 },
  pending: { label: "Čeká na potvrzení", color: "text-yellow-700 bg-yellow-50 border-yellow-200", icon: AlertCircle },
  completed: { label: "Dokončeno", color: "text-blue-700 bg-blue-50 border-blue-200", icon: CheckCircle2 },
  cancelled: { label: "Zrušeno", color: "text-red-700 bg-red-50 border-red-200", icon: XCircle },
  "no-show": { label: "Nedostavil se", color: "text-gray-700 bg-gray-50 border-gray-200", icon: XCircle }
}

export function AppointmentDetailModal({ open, onClose, appointment }: AppointmentDetailModalProps) {
  const { updateAppointment, deleteAppointment, hasConflict } = useAppointments()
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState("")
  
  const [editData, setEditData] = useState({
    date: appointment?.date || new Date(),
    time: appointment?.time || "09:00",
    duration: appointment?.duration || 30,
    service: appointment?.service || "Kontrola",
    status: appointment?.status || "pending" as AppointmentStatus,
    notes: appointment?.notes || ""
  })

  if (!appointment) return null

  const statusConfig = STATUS_CONFIG[appointment.status] || STATUS_CONFIG.pending
  const StatusIcon = statusConfig.icon

  const handleSave = () => {
    setError("")

    // Check for conflicts (excluding current appointment)
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
      notes: editData.notes
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

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('cs-CZ', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const formatTime = (time: string, duration: number) => {
    const [hours, minutes] = time.split(':').map(Number)
    const endMinutes = hours * 60 + minutes + duration
    const endHours = Math.floor(endMinutes / 60)
    const endMins = endMinutes % 60
    return `${time} - ${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detail termínu</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Badge */}
          <div className={`flex items-center gap-2 px-4 py-3 rounded-lg border ${statusConfig.color}`}>
            <StatusIcon className="h-5 w-5" />
            <span className="font-medium">{statusConfig.label}</span>
          </div>

          {!isEditing ? (
            // View Mode
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <User className="h-5 w-5 text-gray-600 mt-0.5" />
                <div>
                  <div className="text-sm text-gray-600">Pacient</div>
                  <div className="font-medium text-lg">{appointment.patientName}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-gray-600 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-600">Datum</div>
                    <div className="font-medium">{formatDate(appointment.date)}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <Clock className="h-5 w-5 text-gray-600 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-600">Čas</div>
                    <div className="font-medium">
                      {formatTime(appointment.time, appointment.duration)}
                    </div>
                    <div className="text-xs text-gray-500">({appointment.duration} minut)</div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Typ ošetření</div>
                <div className="font-medium">{appointment.service}</div>
              </div>

              {appointment.notes && (
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <FileText className="h-5 w-5 text-gray-600 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm text-gray-600 mb-1">Poznámky</div>
                    <div className="text-gray-800 whitespace-pre-wrap">{appointment.notes}</div>
                  </div>
                </div>
              )}

              <div className="text-xs text-gray-500 pt-4 border-t">
                Vytvořeno: {new Date(appointment.createdAt).toLocaleString('cs-CZ')}
                {appointment.updatedAt !== appointment.createdAt && (
                  <> • Upraveno: {new Date(appointment.updatedAt).toLocaleString('cs-CZ')}</>
                )}
              </div>
            </div>
          ) : (
            // Edit Mode
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-date">Datum</Label>
                  <Input
                    id="edit-date"
                    type="date"
                    value={editData.date instanceof Date ? editData.date.toISOString().split('T')[0] : editData.date}
                    onChange={(e) => setEditData(prev => ({ ...prev, date: new Date(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-time">Čas</Label>
                  <Input
                    id="edit-time"
                    type="time"
                    value={editData.time}
                    onChange={(e) => setEditData(prev => ({ ...prev, time: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-service">Typ ošetření</Label>
                  <Select
                    value={editData.service}
                    onValueChange={(value) => setEditData(prev => ({ ...prev, service: value }))}
                  >
                    <SelectTrigger id="edit-service">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICES.map(service => (
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
                    onValueChange={(value) => setEditData(prev => ({ ...prev, duration: parseInt(value) }))}
                  >
                    <SelectTrigger id="edit-duration">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DURATIONS.map(dur => (
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
                  onValueChange={(value) => setEditData(prev => ({ ...prev, status: value as AppointmentStatus }))}
                >
                  <SelectTrigger id="edit-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Čeká na potvrzení</SelectItem>
                    <SelectItem value="confirmed">Potvrzeno</SelectItem>
                    <SelectItem value="completed">Dokončeno</SelectItem>
                    <SelectItem value="cancelled">Zrušeno</SelectItem>
                    <SelectItem value="no-show">Nedostavil se</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="edit-notes">Poznámky</Label>
                <Textarea
                  id="edit-notes"
                  placeholder="Volitelné poznámky k termínu..."
                  value={editData.notes}
                  onChange={(e) => setEditData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
                  {error}
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleDelete}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Smazat termín
            </Button>

            <div className="flex gap-3">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => {
                    setIsEditing(false)
                    setError("")
                    setEditData({
                      date: appointment.date,
                      time: appointment.time,
                      duration: appointment.duration,
                      service: appointment.service,
                      status: appointment.status,
                      notes: appointment.notes || ""
                    })
                  }}>
                    Zrušit
                  </Button>
                  <Button onClick={handleSave}>
                    Uložit změny
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={onClose}>
                    Zavřít
                  </Button>
                  <Button onClick={() => setIsEditing(true)}>
                    Upravit termín
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
