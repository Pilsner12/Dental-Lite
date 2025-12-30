"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAppointments, type AppointmentStatus } from "@/lib/appointment-context"
import { MOCK_PATIENTS, type Patient } from "@/lib/mock-patients"
import { X, Search, User, UserPlus, Zap } from "lucide-react"

interface AddAppointmentModalProps {
  open: boolean
  onClose: () => void
  prefilledDate?: Date
  prefilledTime?: string
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

export function AddAppointmentModal({ open, onClose, prefilledDate, prefilledTime }: AddAppointmentModalProps) {
  const { addAppointment, hasConflict } = useAppointments()

  // State for existing patient tab
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)

  // State for new patient tab
  const [newPatientData, setNewPatientData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    dateOfBirth: "",
  })

  // State for quick booking tab
  const [quickBookingData, setQuickBookingData] = useState({
    name: "",
    phone: "",
  })

  // Common appointment data
  const [appointmentData, setAppointmentData] = useState({
    date: prefilledDate || new Date(),
    time: prefilledTime || "09:00",
    duration: 30,
    service: "Kontrola",
    status: "pending" as AppointmentStatus,
    isUrgent: false,
    notes: "",
  })

  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState<"existing" | "new" | "quick">("existing")

  useEffect(() => {
    if (prefilledDate) {
      setAppointmentData((prev) => ({ ...prev, date: prefilledDate }))
    }
    if (prefilledTime) {
      setAppointmentData((prev) => ({ ...prev, time: prefilledTime }))
    }
  }, [prefilledDate, prefilledTime])

  const filteredPatients = MOCK_PATIENTS.filter((patient) => {
    const searchLower = searchQuery.toLowerCase()
    const fullName = `${patient.personalInfo.firstName} ${patient.personalInfo.lastName}`.toLowerCase()
    return fullName.includes(searchLower) || patient.personalInfo.phone.includes(searchQuery)
  }).slice(0, 5)

  const handleSubmit = () => {
    setError("")

    // Validate patient selection based on active tab
    let patientId = ""
    let patientName = ""

    if (activeTab === "existing") {
      if (!selectedPatient) {
        setError("Vyberte pacienta ze seznamu")
        return
      }
      patientId = selectedPatient.id
      patientName = `${selectedPatient.personalInfo.firstName} ${selectedPatient.personalInfo.lastName}`
    } else if (activeTab === "new") {
      if (!newPatientData.firstName || !newPatientData.lastName || !newPatientData.phone) {
        setError("Vyplňte jméno, příjmení a telefon")
        return
      }
      // Create temporary ID for new patient (in real app, would create patient first)
      patientId = `new-${Date.now()}`
      patientName = `${newPatientData.firstName} ${newPatientData.lastName}`
    } else if (activeTab === "quick") {
      if (!quickBookingData.name || !quickBookingData.phone) {
        setError("Vyplňte jméno a telefon")
        return
      }
      patientId = `quick-${Date.now()}`
      patientName = quickBookingData.name
    }

    // Check for conflicts (informative only, doesn't prevent creation)
    const hasTimeConflict = hasConflict(appointmentData.date, appointmentData.time, appointmentData.duration)

    // Add appointment
    addAppointment({
      patientId,
      patientName,
      date: appointmentData.date,
      time: appointmentData.time,
      duration: appointmentData.duration,
      service: appointmentData.service,
      status: appointmentData.status,
      isUrgent: appointmentData.isUrgent,
      notes: appointmentData.notes,
    })

    // Reset and close
    resetForm()
    onClose()
  }

  const resetForm = () => {
    setSelectedPatient(null)
    setSearchQuery("")
    setNewPatientData({
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      dateOfBirth: "",
    })
    setQuickBookingData({
      name: "",
      phone: "",
    })
    setAppointmentData({
      date: new Date(),
      time: "09:00",
      duration: 30,
      service: "Kontrola",
      status: "pending",
      isUrgent: false,
      notes: "",
    })
    setError("")
  }

  const formatDate = (date: Date) => {
    // Ensure we're working with a proper Date object
    const dateObj = date instanceof Date ? date : new Date(date)
    return dateObj.toLocaleDateString("cs-CZ", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Přidat nový termín</DialogTitle>
          <div className="text-sm text-gray-600 mt-2">
            {formatDate(appointmentData.date)} v {appointmentData.time}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {hasConflict(appointmentData.date, appointmentData.time, appointmentData.duration) && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
              ℹ️ V tomto čase již existuje jiný termín. Termíny se mohou překrývat.
            </div>
          )}
          
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="existing" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Existující</span>
              </TabsTrigger>
              <TabsTrigger value="new" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                <span>Nový pacient</span>
              </TabsTrigger>
              <TabsTrigger value="quick" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                <span>Rychlá rezervace</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="existing" className="space-y-4">
              <div>
                <Label htmlFor="search">Hledat pacienta</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Jméno nebo telefon..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              {searchQuery && (
                <div className="border rounded-lg divide-y max-h-60 overflow-y-auto">
                  {filteredPatients.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">Žádný pacient nenalezen</div>
                  ) : (
                    filteredPatients.map((patient) => (
                      <button
                        key={patient.id}
                        onClick={() => {
                          setSelectedPatient(patient)
                          setSearchQuery("")
                        }}
                        className="w-full p-3 text-left hover:bg-gray-50 transition-colors"
                      >
                        <div className="font-medium">
                          {patient.personalInfo.firstName} {patient.personalInfo.lastName}
                        </div>
                        <div className="text-sm text-gray-600">
                          {patient.personalInfo.phone} • {patient.personalInfo.email}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Věk: {patient.personalInfo.age} let</div>
                      </button>
                    ))
                  )}
                </div>
              )}

              {selectedPatient && (
                <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium">
                        {selectedPatient.personalInfo.firstName} {selectedPatient.personalInfo.lastName}
                      </div>
                      <div className="text-sm text-gray-600">
                        {selectedPatient.personalInfo.phone} • {selectedPatient.personalInfo.email}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Věk: {selectedPatient.personalInfo.age} let</div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedPatient(null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="new" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Jméno *</Label>
                  <Input
                    id="firstName"
                    value={newPatientData.firstName}
                    onChange={(e) => setNewPatientData((prev) => ({ ...prev, firstName: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Příjmení *</Label>
                  <Input
                    id="lastName"
                    value={newPatientData.lastName}
                    onChange={(e) => setNewPatientData((prev) => ({ ...prev, lastName: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Telefon *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={newPatientData.phone}
                    onChange={(e) => setNewPatientData((prev) => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newPatientData.email}
                    onChange={(e) => setNewPatientData((prev) => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="dateOfBirth">Datum narození</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={newPatientData.dateOfBirth}
                  onChange={(e) => setNewPatientData((prev) => ({ ...prev, dateOfBirth: e.target.value }))}
                />
              </div>
            </TabsContent>

            <TabsContent value="quick" className="space-y-4">
              <div>
                <Label htmlFor="quickName">Jméno a příjmení *</Label>
                <Input
                  id="quickName"
                  placeholder="Jan Novák"
                  value={quickBookingData.name}
                  onChange={(e) => setQuickBookingData((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="quickPhone">Telefon *</Label>
                <Input
                  id="quickPhone"
                  type="tel"
                  placeholder="+420 123 456 789"
                  value={quickBookingData.phone}
                  onChange={(e) => setQuickBookingData((prev) => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div className="text-sm text-gray-600 bg-yellow-50 p-3 rounded border border-yellow-200">
                ⚡ Rychlá rezervace vytvoří termín s minimem údajů. Údaje o pacientovi můžete doplnit později.
              </div>
            </TabsContent>
          </Tabs>

          {/* Common appointment fields */}
          <div className="border-t pt-6 space-y-4">
            <h3 className="font-medium">Detaily termínu</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Datum</Label>
                <Input
                  id="date"
                  type="date"
                  value={appointmentData.date.toISOString().split("T")[0]}
                  onChange={(e) =>
                    setAppointmentData((prev) => ({
                      ...prev,
                      date: new Date(e.target.value),
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="time">Čas</Label>
                <Input
                  id="time"
                  type="time"
                  value={appointmentData.time}
                  onChange={(e) => setAppointmentData((prev) => ({ ...prev, time: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="service">Typ ošetření</Label>
                <Select
                  value={appointmentData.service}
                  onValueChange={(value) => setAppointmentData((prev) => ({ ...prev, service: value }))}
                >
                  <SelectTrigger id="service">
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
                <Label htmlFor="duration">Délka</Label>
                <Select
                  value={appointmentData.duration.toString()}
                  onValueChange={(value) =>
                    setAppointmentData((prev) => ({ ...prev, duration: Number.parseInt(value) }))
                  }
                >
                  <SelectTrigger id="duration">
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
              <Label htmlFor="status">Status</Label>
              <Select
                value={appointmentData.status}
                onValueChange={(value) =>
                  setAppointmentData((prev) => ({ ...prev, status: value as AppointmentStatus }))
                }
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Čeká na potvrzení</SelectItem>
                  <SelectItem value="confirmed">Potvrzeno</SelectItem>
                  <SelectItem value="completed">Dokončeno</SelectItem>
                  <SelectItem value="cancelled">Zrušeno</SelectItem>
                  <SelectItem value="blocked">Neordinuje se (blokace)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="notes">Poznámky</Label>
              <Textarea
                id="notes"
                placeholder="Volitelné poznámky k termínu..."
                value={appointmentData.notes}
                onChange={(e) => setAppointmentData((prev) => ({ ...prev, notes: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded p-3">
              <Checkbox
                id="isUrgent"
                checked={appointmentData.isUrgent}
                onCheckedChange={(checked) =>
                  setAppointmentData((prev) => ({ ...prev, isUrgent: checked as boolean }))
                }
              />
              <Label htmlFor="isUrgent" className="text-sm text-red-800 font-medium cursor-pointer">
                🚨 Označit jako urgentní termín (vyšší priorita)
              </Label>
            </div>
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">{error}</div>}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Zrušit
            </Button>
            <Button onClick={handleSubmit}>Přidat termín</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
