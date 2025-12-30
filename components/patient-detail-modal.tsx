"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Phone, Mail, User, Heart, Calendar, CreditCard, Tag, CheckCircle2, Send, AlertCircle, MessageSquare, Activity, Save, X, Edit, Plus, FileText, Download } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ContactPatientModal } from "./contact-patient-modal"
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
  const [showContactModal, setShowContactModal] = useState(false)

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

  const getInvoiceStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Zaplaceno</Badge>
      case "unpaid":
        return <Badge className="bg-yellow-100 text-yellow-800">Nezaplaceno</Badge>
      case "partial":
        return <Badge className="bg-orange-100 text-orange-800">Částečně</Badge>
      case "overdue":
        return <Badge className="bg-red-100 text-red-800">Po splatnosti</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
    }
  }

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800 text-xs">Zaplaceno</Badge>
      case "unpaid":
        return <Badge className="bg-red-100 text-red-800 text-xs">Nezaplaceno</Badge>
      case "partial":
        return <Badge className="bg-orange-100 text-orange-800 text-xs">Částečně</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800 text-xs">{status}</Badge>
    }
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

  if (!patient) return null

  const selectedPatient = isEditMode && editedPatient ? editedPatient : patient

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="!w-[85vw] !max-w-[85vw] h-[90vh] flex flex-col sm:!max-w-[85vw]">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <DialogTitle className="text-2xl">
                  {selectedPatient.personalInfo.firstName} {selectedPatient.personalInfo.lastName}
                </DialogTitle>
                <DialogDescription className="sr-only">
                  Detailní informace o pacientovi, zdravotní záznamy, návštěvy a faktury
                </DialogDescription>
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
                {/* Quick contact buttons */}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowContactModal(true)}
                  className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-300"
                >
                  <MessageSquare className="w-4 h-4 mr-1.5" />
                  Kontaktovat
                </Button>
                {isEditMode ? (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleSaveEdit}
                      className="bg-green-50 hover:bg-green-100 text-green-700 border-green-300"
                    >
                      <Save className="w-4 h-4 mr-1" />
                      Uložit
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
            <TabsList className="grid w-full grid-cols-4 shrink-0">
              <TabsTrigger value="personal">
                <User className="w-4 h-4 mr-1" />
                Osobní údaje
              </TabsTrigger>
              <TabsTrigger value="medical">
                <Heart className="w-4 h-4 mr-1" />
                Zdravotní info
              </TabsTrigger>
              <TabsTrigger value="visits">
                <Calendar className="w-4 h-4 mr-1" />
                Historie návštěv
              </TabsTrigger>
              <TabsTrigger value="invoices">
                <CreditCard className="w-4 h-4 mr-1" />
                Faktury
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
                  <div className="text-xs text-gray-500 mb-1">Datum narození</div>
                  <div className="font-semibold text-gray-900">{formatDate(selectedPatient.personalInfo.dateOfBirth)}</div>
                </div>
              </div>

              <div className="grid grid-cols-6 gap-x-6 gap-y-4 py-4 border-b">
                <div className="col-span-3">
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
                <div className="col-span-3">
                  <div className="text-xs text-gray-500 mb-1">Email</div>
                  {isEditMode && editedPatient ? (
                    <Input
                      type="email"
                      value={editedPatient.personalInfo.email}
                      onChange={(e) => updateEditedField('personalInfo.email', e.target.value)}
                      className="h-9"
                    />
                  ) : (
                    <a href={`mailto:${selectedPatient.personalInfo.email}`} className="font-semibold text-blue-600 hover:underline">
                      {selectedPatient.personalInfo.email}
                    </a>
                  )}
                </div>
              </div>

              {/* Verification */}
              <div className="py-4 border-b">
                <div className="text-xs font-medium text-gray-500 mb-3">OVĚŘENÍ KONTAKTU</div>
                <div className="grid grid-cols-6 gap-x-6">
                  <div className="col-span-2">
                    <div className="text-xs text-gray-500 mb-1">Status</div>
                    {getVerificationBadge(selectedPatient)}
                  </div>
                  {selectedPatient.contactVerifiedAt && (
                    <div className="col-span-4">
                      <div className="text-xs text-gray-500 mb-1">Naposledy ověřeno</div>
                      <div className="font-semibold text-gray-900">{formatDate(selectedPatient.contactVerifiedAt)}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Address */}
              {selectedPatient.personalInfo.address && (
                <div className="py-4">
                  <div className="text-xs font-medium text-gray-500 mb-3">ADRESA</div>
                  <div className="grid grid-cols-6 gap-x-6">
                    <div className="col-span-3">
                      <div className="text-xs text-gray-500 mb-1">Ulice</div>
                      <div className="font-semibold text-gray-900">{selectedPatient.personalInfo.address.street}</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-xs text-gray-500 mb-1">Město</div>
                      <div className="font-semibold text-gray-900">{selectedPatient.personalInfo.address.city}</div>
                    </div>
                    <div className="col-span-1">
                      <div className="text-xs text-gray-500 mb-1">PSČ</div>
                      <div className="font-semibold text-gray-900">{selectedPatient.personalInfo.address.zip}</div>
                    </div>
                  </div>
                </div>
              )}
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

              {/* Medications */}
              <div className="py-4 border-b">
                <div className="text-xs font-medium text-gray-500 mb-3 uppercase">Užívané léky</div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedPatient.medicalInfo.medications?.map((medication, i) => (
                    <Badge key={i} className="bg-blue-100 text-blue-800 text-xs">
                      {medication}
                    </Badge>
                  ))}
                  {(!selectedPatient.medicalInfo.medications || selectedPatient.medicalInfo.medications.length === 0) && (
                    <span className="text-sm text-gray-500">Žádné léky</span>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div className="py-4">
                <div className="text-xs font-medium text-gray-500 mb-3 uppercase">Poznámky lékaře</div>
                <p className="text-sm text-gray-700">{selectedPatient.medicalInfo.notes || '-'}</p>
              </div>
            </TabsContent>

            {/* Visits Tab */}
            <TabsContent value="visits" className="mt-0 overflow-y-auto flex-1 p-6">
              <div className="grid grid-cols-4 gap-3 mb-6">
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
                    <div className="text-sm text-gray-600">Nedorazil</div>
                    <div className="text-2xl font-bold text-red-600">{selectedPatient.visitHistory.noShows}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed visit history */}
              {selectedPatient.visitHistory.visits && selectedPatient.visitHistory.visits.length > 0 ? (
                <div className="space-y-4">
                  <div className="text-sm font-semibold text-gray-700 mb-3">Detailní historie návštěv:</div>
                  {selectedPatient.visitHistory.visits.map((visit) => (
                    <Card key={visit.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="font-semibold text-gray-900">{visit.service}</div>
                            <div className="text-sm text-gray-600">{formatDate(visit.date)} • {visit.duration} min • {visit.doctor}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getPaymentStatusBadge(visit.paymentStatus)}
                            <span className="text-sm font-semibold text-gray-900">{formatCurrency(visit.price)}</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-xs text-gray-500 font-medium mb-1">Diagnóza:</div>
                            <div className="text-gray-700">{visit.diagnosis}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 font-medium mb-1">Léčba:</div>
                            <div className="text-gray-700">{visit.treatment}</div>
                          </div>
                        </div>
                        {visit.procedures && visit.procedures.length > 0 && (
                          <div className="mt-3">
                            <div className="text-xs text-gray-500 font-medium mb-1">Provedené zákroky:</div>
                            <div className="flex flex-wrap gap-1">
                              {visit.procedures.map((proc, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {proc}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {visit.notes && (
                          <div className="mt-3 pt-3 border-t">
                            <div className="text-xs text-gray-500 font-medium mb-1">Poznámky:</div>
                            <div className="text-sm text-gray-700 italic">{visit.notes}</div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Žádné zaznamenané návštěvy
                </div>
              )}
            </TabsContent>

            {/* Invoices Tab */}
            <TabsContent value="invoices" className="mt-0 overflow-y-auto flex-1 p-6">
              <div className="grid grid-cols-3 gap-3 mb-6">
                <Card>
                  <CardContent className="p-3">
                    <div className="text-sm text-gray-600">Celkem utraceno</div>
                    <div className="text-2xl font-bold text-blue-600">{formatCurrency(selectedPatient.financial.totalSpent)}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3">
                    <div className="text-sm text-gray-600">Celkem faktur</div>
                    <div className="text-2xl font-bold text-gray-900">{selectedPatient.financial.invoices?.length || 0}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3">
                    <div className="text-sm text-gray-600">Poslední platba</div>
                    <div className="text-sm font-semibold text-gray-900">
                      {selectedPatient.financial.lastPayment ? formatDate(selectedPatient.financial.lastPayment) : '-'}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Invoices list */}
              {selectedPatient.financial.invoices && selectedPatient.financial.invoices.length > 0 ? (
                <div className="space-y-4">
                  <div className="text-sm font-semibold text-gray-700 mb-3">Seznam faktur:</div>
                  {selectedPatient.financial.invoices.map((invoice) => (
                    <Card key={invoice.id} className={`border-l-4 ${
                      invoice.status === 'paid' ? 'border-l-green-500' :
                      invoice.status === 'partial' ? 'border-l-orange-500' :
                      invoice.status === 'overdue' ? 'border-l-red-500' :
                      'border-l-yellow-500'
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="font-semibold text-gray-900">Faktura #{invoice.invoiceNumber}</div>
                            <div className="text-sm text-gray-600">
                              Vystaveno: {formatDate(invoice.date)} • Splatnost: {formatDate(invoice.dueDate)}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {getInvoiceStatusBadge(invoice.status)}
                            <Button size="sm" variant="outline">
                              <Download className="w-3 h-3 mr-1.5" />
                              PDF
                            </Button>
                          </div>
                        </div>
                        
                        {/* Invoice items */}
                        <div className="bg-gray-50 rounded-lg p-3 mb-3">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-gray-200">
                                <th className="text-left py-2 text-xs text-gray-600">Položka</th>
                                <th className="text-right py-2 text-xs text-gray-600">Počet</th>
                                <th className="text-right py-2 text-xs text-gray-600">Cena/ks</th>
                                <th className="text-right py-2 text-xs text-gray-600">Celkem</th>
                              </tr>
                            </thead>
                            <tbody>
                              {invoice.items.map((item, i) => (
                                <tr key={i} className="border-b border-gray-100 last:border-0">
                                  <td className="py-2 text-gray-700">{item.description}</td>
                                  <td className="text-right text-gray-700">{item.quantity}</td>
                                  <td className="text-right text-gray-700">{formatCurrency(item.unitPrice)}</td>
                                  <td className="text-right font-semibold text-gray-900">{formatCurrency(item.total)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Totals */}
                        <div className="flex justify-end">
                          <div className="w-64 space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Mezisoučet:</span>
                              <span className="font-semibold text-gray-900">{formatCurrency(invoice.subtotal)}</span>
                            </div>
                            {invoice.tax > 0 && (
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">DPH:</span>
                                <span className="font-semibold text-gray-900">{formatCurrency(invoice.tax)}</span>
                              </div>
                            )}
                            <div className="flex justify-between text-base border-t pt-1">
                              <span className="font-semibold text-gray-900">Celkem:</span>
                              <span className="font-bold text-blue-600">{formatCurrency(invoice.total)}</span>
                            </div>
                            {invoice.status === 'partial' && invoice.paidAmount && (
                              <>
                                <div className="flex justify-between text-sm text-green-700">
                                  <span>Zaplaceno:</span>
                                  <span className="font-semibold">{formatCurrency(invoice.paidAmount)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-red-700">
                                  <span>Zbývá:</span>
                                  <span className="font-semibold">{formatCurrency(invoice.total - invoice.paidAmount)}</span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Payment info */}
                        {invoice.paidDate && (
                          <div className="mt-3 pt-3 border-t text-xs text-gray-600">
                            Zaplaceno: {formatDate(invoice.paidDate)} • Způsob platby: {
                              invoice.paymentMethod === 'cash' ? 'Hotovost' :
                              invoice.paymentMethod === 'card' ? 'Karta' :
                              'Převod'
                            }
                          </div>
                        )}
                        {invoice.notes && (
                          <div className="mt-2 text-xs text-gray-600 italic">
                            Poznámka: {invoice.notes}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Žádné faktury
                </div>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Contact Patient Modal */}
      <ContactPatientModal
        open={showContactModal}
        onClose={() => setShowContactModal(false)}
        patient={patient}
      />
    </>
  )
}
