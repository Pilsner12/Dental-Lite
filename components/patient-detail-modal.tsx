"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Phone, Mail, User, Heart, Calendar, CreditCard, Tag, CheckCircle2, Send, AlertCircle, MessageSquare, Activity, Save, X, Edit, Plus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Patient } from "@/lib/mock-patients"

interface PatientDetailModalProps {
  patient: Patient | null
  isOpen: boolean
  onClose: () => void
  onUpdate?: (patient: Patient) => void
}

export function PatientDetailModal({ patient, isOpen, onClose, onUpdate }: PatientDetailModalProps) {
  const [isEditMode, setIsEditMode] = useState(false)
  const [editedPatient, setEditedPatient] = useState<Patient | null>(null)

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("cs-CZ", { dateStyle: "medium" }).format(date)
  }

  const formatRelativeTime = (date: Date) => {
    const days = Math.floor((new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    if (days === 0) return "Dnes"
    if (days === 1) return "Včera"
    if (days < 7) return `Před ${days} dny`
    if (days < 30) return `Před ${Math.floor(days / 7)} týdny`
    return `Před ${Math.floor(days / 30)} měsíci`
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("cs-CZ", {
      style: "currency",
      currency: "CZK",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getVerificationBadge = (patient: Patient) => {
    if (patient.contactVerifiedAt) {
      return (
        <Badge className="bg-green-100 text-green-800">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Ověřeno
        </Badge>
      )
    }
    return (
      <Badge className="bg-red-100 text-red-800">
        <AlertCircle className="w-3 h-3 mr-1" />
        Neověřeno
      </Badge>
    )
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
      archived: "bg-red-100 text-red-800"
    }
    const labels = {
      active: "Aktivní",
      inactive: "Neaktivní",
      archived: "Archivován"
    }
    return (
      <Badge className={colors[status as keyof typeof colors]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    )
  }

  const getTagColor = (tag: string) => {
    const colors: Record<string, string> = {
      VIP: "bg-purple-100 text-purple-800",
      Pravidelný: "bg-blue-100 text-blue-800",
      Nový: "bg-green-100 text-green-800",
      Rizikový: "bg-red-100 text-red-800"
    }
    return colors[tag] || "bg-gray-100 text-gray-800"
  }

  const handleStartEdit = () => {
    if (patient) {
      setEditedPatient(JSON.parse(JSON.stringify(patient)))
      setIsEditMode(true)
    }
  }

  const handleCancelEdit = () => {
    setEditedPatient(null)
    setIsEditMode(false)
  }

  const handleSaveEdit = () => {
    if (editedPatient && onUpdate) {
      onUpdate(editedPatient)
      setEditedPatient(null)
      setIsEditMode(false)
    }
  }

  const updateEditedField = (path: string, value: any) => {
    if (!editedPatient) return

    const pathParts = path.split('.')
    const newPatient = JSON.parse(JSON.stringify(editedPatient))

    let current: any = newPatient
    for (let i = 0; i < pathParts.length - 1; i++) {
      current = current[pathParts[i]]
    }
    current[pathParts[pathParts.length - 1]] = value

    setEditedPatient(newPatient)
  }

  const addArrayItem = (path: string, item: any) => {
    if (!editedPatient) return

    const pathParts = path.split('.')
    const newPatient = JSON.parse(JSON.stringify(editedPatient))

    let current: any = newPatient
    for (let i = 0; i < pathParts.length - 1; i++) {
      current = current[pathParts[i]]
    }
    const array = current[pathParts[pathParts.length - 1]]
    if (Array.isArray(array)) {
      array.push(item)
    }

    setEditedPatient(newPatient)
  }

  const removeArrayItem = (path: string, index: number) => {
    if (!editedPatient) return

    const pathParts = path.split('.')
    const newPatient = JSON.parse(JSON.stringify(editedPatient))

    let current: any = newPatient
    for (let i = 0; i < pathParts.length - 1; i++) {
      current = current[pathParts[i]]
    }
    const array = current[pathParts[pathParts.length - 1]]
    if (Array.isArray(array)) {
      array.splice(index, 1)
    }

    setEditedPatient(newPatient)
  }

  if (!patient) return null

  const selectedPatient = isEditMode && editedPatient ? editedPatient : patient

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!w-[80vw] !max-w-[80vw] h-[95vh] flex flex-col sm:!max-w-[80vw]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl">
                {selectedPatient.personalInfo.firstName} {selectedPatient.personalInfo.lastName}
              </DialogTitle>
              <p className="text-sm text-gray-500 mt-1">
                ID: {selectedPatient.id} • Věk: {Math.floor((new Date().getTime() - new Date(selectedPatient.personalInfo.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 365.25))} let
              </p>
              <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Poslední návštěva: {formatDate(selectedPatient.visitHistory.lastVisit)}</span>
                <span className="text-gray-400">•</span>
                <span>{formatRelativeTime(selectedPatient.visitHistory.lastVisit)}</span>
              </p>
            </div>
            <div className="flex gap-2">
              {isEditMode ? (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleSaveEdit}
                    className="bg-green-50 hover:bg-green-100 text-green-700 border-green-300"
                  >
                    <Save className="w-4 h-4 mr-1" />
                    Uložit změny
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancelEdit}
                    className="text-gray-600"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Zrušit
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleStartEdit}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Upravit
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="personal" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-5 shrink-0">
            <TabsTrigger value="personal">
              <User className="w-4 h-4 mr-1" />
              Osobní
            </TabsTrigger>
            <TabsTrigger value="medical">
              <Heart className="w-4 h-4 mr-1" />
              Zdravotní
            </TabsTrigger>
            <TabsTrigger value="visits">
              <Calendar className="w-4 h-4 mr-1" />
              Návštěvy
            </TabsTrigger>
            <TabsTrigger value="financial">
              <CreditCard className="w-4 h-4 mr-1" />
              Finance
            </TabsTrigger>
            <TabsTrigger value="other">
              <Tag className="w-4 h-4 mr-1" />
              Ostatní
            </TabsTrigger>
          </TabsList>

          {/* Personal Info Tab */}
          <TabsContent value="personal" className="mt-0 overflow-y-auto flex-1 p-6">
            <div className="grid grid-cols-6 gap-x-6 gap-y-4 pb-4 border-b">
              <div className="col-span-2">
                <div className="text-xs text-gray-500 mb-1">Jméno</div>
                {isEditMode && editedPatient ? (
                  <Input
                    value={editedPatient.personalInfo.firstName}
                    onChange={(e) => updateEditedField('personalInfo.firstName', e.target.value)}
                    className="h-9"
                  />
                ) : (
                  <div className="font-semibold text-gray-900">{selectedPatient.personalInfo.firstName}</div>
                )}
              </div>
              <div className="col-span-2">
                <div className="text-xs text-gray-500 mb-1">Příjmení</div>
                {isEditMode && editedPatient ? (
                  <Input
                    value={editedPatient.personalInfo.lastName}
                    onChange={(e) => updateEditedField('personalInfo.lastName', e.target.value)}
                    className="h-9"
                  />
                ) : (
                  <div className="font-semibold text-gray-900">{selectedPatient.personalInfo.lastName}</div>
                )}
              </div>
              <div className="col-span-2">
                <div className="text-xs text-gray-500 mb-1">Telefon</div>
                {isEditMode && editedPatient ? (
                  <Input
                    type="tel"
                    value={editedPatient.personalInfo.phone}
                    onChange={(e) => updateEditedField('personalInfo.phone', e.target.value)}
                    className="h-9"
                  />
                ) : (
                  <a href={`tel:${selectedPatient.personalInfo.phone}`} className="font-semibold text-blue-600 hover:underline">
                    {selectedPatient.personalInfo.phone}
                  </a>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="py-4 border-b">
              <div className="text-xs font-medium text-gray-500 mb-3">RYCHLÉ AKCE</div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.location.href = `tel:${selectedPatient.personalInfo.phone}`}
                >
                  <Phone className="w-4 h-4 mr-1.5" />
                  Zavolat
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.location.href = `mailto:${selectedPatient.personalInfo.email}`}
                >
                  <Mail className="w-4 h-4 mr-1.5" />
                  Email
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => alert(`Odeslání SMS na ${selectedPatient.personalInfo.phone}`)}
                >
                  <MessageSquare className="w-4 h-4 mr-1.5" />
                  SMS
                </Button>
              </div>
            </div>

            {/* Verification */}
            <div className="py-4">
              <div className="text-xs font-medium text-gray-500 mb-3">OVĚŘENÍ KONTAKTU</div>
              <div className="grid grid-cols-6 gap-x-6">
                <div className="col-span-3">
                  <div className="text-xs text-gray-500 mb-1">Status</div>
                  {getVerificationBadge(selectedPatient)}
                </div>
                {selectedPatient.contactVerifiedAt && (
                  <div className="col-span-3">
                    <div className="text-xs text-gray-500 mb-1">Naposledy ověřeno</div>
                    <div className="font-semibold text-gray-900">{formatDate(selectedPatient.contactVerifiedAt)}</div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Medical Info Tab */}
          <TabsContent value="medical" className="mt-0 overflow-y-auto flex-1 p-6">
            <div className="grid grid-cols-6 gap-x-6 pb-4 border-b">
              <div className="col-span-2">
                <div className="text-xs text-gray-500 mb-1">Krevní skupina</div>
                <div className="font-semibold text-gray-900 text-lg">{selectedPatient.medicalInfo.bloodType || '-'}</div>
              </div>
            </div>

            {/* Allergies */}
            <div className="py-4 border-b">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <div className="text-xs font-medium text-red-700 uppercase">Alergie</div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedPatient.medicalInfo.allergies?.map((allergy, i) => (
                  <Badge key={i} className="bg-red-100 text-red-800 text-xs">
                    {allergy}
                  </Badge>
                ))}
                {(!selectedPatient.medicalInfo.allergies || selectedPatient.medicalInfo.allergies.length === 0) && (
                  <span className="text-sm text-gray-500">Žádné alergie</span>
                )}
              </div>
            </div>

            {/* Conditions */}
            <div className="py-4 border-b">
              <div className="text-xs font-medium text-gray-500 mb-3 uppercase">Zdravotní podmínky</div>
              <div className="flex flex-wrap gap-1.5">
                {selectedPatient.medicalInfo.conditions?.map((condition, i) => (
                  <Badge key={i} className="bg-orange-100 text-orange-800 text-xs">
                    {condition}
                  </Badge>
                ))}
                {(!selectedPatient.medicalInfo.conditions || selectedPatient.medicalInfo.conditions.length === 0) && (
                  <span className="text-sm text-gray-500">Žádné podmínky</span>
                )}
              </div>
            </div>

            {/* Notes */}
            <div className="py-4">
              <div className="text-xs font-medium text-gray-500 mb-3 uppercase">Poznámky</div>
              <p className="text-sm text-gray-700">{selectedPatient.medicalInfo.notes || '-'}</p>
            </div>
          </TabsContent>

          {/* Visits Tab */}
          <TabsContent value="visits" className="space-y-3 mt-3 overflow-y-auto flex-1">
            <div className="grid grid-cols-4 gap-3">
              <Card>
                <CardContent className="p-3">
                  <div className="text-sm text-gray-600">Celkem návštěv</div>
                  <div className="text-2xl font-bold text-blue-600">{selectedPatient.visitHistory.totalVisits}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3">
                  <div className="text-sm text-gray-600">Nadcházející</div>
                  <div className="text-2xl font-bold text-green-600">{selectedPatient.visitHistory.upcomingAppointments}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3">
                  <div className="text-sm text-gray-600">Zrušení</div>
                  <div className="text-2xl font-bold text-orange-600">{selectedPatient.visitHistory.cancellations}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3">
                  <div className="text-sm text-gray-600">Nedorazy</div>
                  <div className="text-2xl font-bold text-red-600">{selectedPatient.visitHistory.noShows}</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Financial Tab */}
          <TabsContent value="financial" className="space-y-3 mt-3 overflow-y-auto flex-1">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Finanční přehled</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <div>
                  <div className="text-sm text-gray-600">Celkem zaplaceno</div>
                  <div className="text-3xl font-bold text-green-600">
                    {formatCurrency(selectedPatient.financial.totalSpent)}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other Tab */}
          <TabsContent value="other" className="space-y-3 mt-3 overflow-y-auto flex-1">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Tagy a kategorie</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-2">
                  {selectedPatient.tags?.map((tag, i) => (
                    <Badge key={i} className={getTagColor(tag)}>
                      {tag}
                    </Badge>
                  ))}
                  {(!selectedPatient.tags || selectedPatient.tags.length === 0) && (
                    <p className="text-sm text-gray-500">Žádné tagy</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
