"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Eye, Edit, Plus, Phone, Mail, User, Heart, Calendar, CreditCard, Tag, CheckCircle2, Send, AlertCircle, MessageSquare, Activity, Save, X, Trash2, Check } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MOCK_PATIENTS, type Patient } from "@/lib/mock-patients"

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [editedPatient, setEditedPatient] = useState<Patient | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [tagFilter, setTagFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("cs-CZ", {
      style: "currency",
      currency: "CZK",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("cs-CZ", {
      day: "numeric",
      month: "long",
      year: "numeric"
    })
  }

  const formatRelativeTime = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Dnes"
    if (diffDays === 1) return "Včera"
    if (diffDays < 7) return `Před ${diffDays} dny`
    if (diffDays < 30) return `Před ${Math.floor(diffDays / 7)} týdny`
    if (diffDays < 365) return `Před ${Math.floor(diffDays / 30)} měsíci`
    return `Před ${Math.floor(diffDays / 365)} lety`
  }

  const getTagColor = (tag: string) => {
    const colors: Record<string, string> = {
      VIP: "bg-purple-100 text-purple-800",
      "Pravidelný": "bg-green-100 text-green-800",
      "Nový": "bg-blue-100 text-blue-800",
      "Rizikový": "bg-red-100 text-red-800",
    }
    return colors[tag] || "bg-gray-100 text-gray-800"
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
      archived: "bg-red-100 text-red-800",
    }
    const labels: Record<string, string> = {
      active: "Aktivní",
      inactive: "Neaktivní",
      archived: "Archivován",
    }
    return <Badge className={styles[status]}>{labels[status]}</Badge>
  }

  const getVerificationStatus = (patient: Patient): "recent" | "warning" | "expired" | "never" => {
    if (!patient.contactVerifiedAt) return "never"

    const now = new Date()
    const verified = new Date(patient.contactVerifiedAt)
    const diffMonths = (now.getTime() - verified.getTime()) / (1000 * 60 * 60 * 24 * 30)

    if (diffMonths < 6) return "recent"
    if (diffMonths < 12) return "warning"
    return "expired"
  }

  const getVerificationBadge = (patient: Patient) => {
    const status = getVerificationStatus(patient)

    const styles: Record<string, string> = {
      recent: "bg-green-100 text-green-800",
      warning: "bg-yellow-100 text-yellow-800",
      expired: "bg-red-100 text-red-800",
      never: "bg-gray-100 text-gray-800"
    }

    const labels: Record<string, string> = {
      recent: "Ověřeno",
      warning: "K ověření",
      expired: "Neplatné",
      never: "Neověřeno"
    }

    return <Badge className={`${styles[status]} text-xs`}>{labels[status]}</Badge>
  }

  const handleVerifyContact = (patient: Patient) => {
    console.log("Manually verifying contact for patient:", patient.id)
    alert(`Kontakt pro ${patient.personalInfo.firstName} ${patient.personalInfo.lastName} byl ověřen`)
  }

  const handleSendVerificationLink = (patient: Patient) => {
    const token = `verify-${patient.id}-${Date.now()}`
    const link = `${window.location.origin}/verify/${token}`
    console.log("Generated verification link:", link)
    alert(`Odkaz pro ověření byl odeslán na ${patient.personalInfo.email}`)
  }

  // Edit mode functions
  const handleStartEdit = () => {
    if (selectedPatient) {
      setEditedPatient(JSON.parse(JSON.stringify(selectedPatient)))
      setIsEditMode(true)
    }
  }

  const handleCancelEdit = () => {
    setEditedPatient(null)
    setIsEditMode(false)
  }

  const handleSaveEdit = () => {
    if (editedPatient) {
      setPatients(prev => prev.map(p => p.id === editedPatient.id ? editedPatient : p))
      setSelectedPatient(editedPatient)
      setEditedPatient(null)
      setIsEditMode(false)
      alert("Změny byly uloženy")
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

  const addTag = (tag: string) => {
    if (!editedPatient || !tag.trim()) return
    if (!editedPatient.tags) {
      editedPatient.tags = []
    }
    if (!editedPatient.tags.includes(tag.trim())) {
      addArrayItem('tags', tag.trim())
    }
  }

  const removeTag = (index: number) => {
    removeArrayItem('tags', index)
  }

  // Filtering and sorting
  const filteredPatients = patients
    .filter((p) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const fullName = `${p.personalInfo.firstName} ${p.personalInfo.lastName}`.toLowerCase()
        const phone = p.personalInfo.phone.toLowerCase()
        const email = p.personalInfo.email.toLowerCase()
        if (!fullName.includes(query) && !phone.includes(query) && !email.includes(query)) {
          return false
        }
      }

      if (statusFilter !== "all" && p.status !== statusFilter) return false

      if (tagFilter !== "all") {
        if (!p.tags || !p.tags.includes(tagFilter)) return false
      }

      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return `${a.personalInfo.firstName} ${a.personalInfo.lastName}`.localeCompare(
            `${b.personalInfo.firstName} ${b.personalInfo.lastName}`
          )
        case "age":
          return a.personalInfo.age - b.personalInfo.age
        case "lastVisit":
          return b.visitHistory.lastVisit.getTime() - a.visitHistory.lastVisit.getTime()
        case "totalVisits":
          return b.visitHistory.totalVisits - a.visitHistory.totalVisits
        default:
          return 0
      }
    })

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pacienti</h1>
          <p className="text-gray-600 mt-1">Správa databáze pacientů ({patients.length} celkem)</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Přidat pacienta
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Hledat jméno, telefon, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          className="border rounded-lg px-3 py-2"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filtrovat podle statusu"
        >
          <option value="all">Všechny statusy</option>
          <option value="active">Aktivní</option>
          <option value="inactive">Neaktivní</option>
          <option value="archived">Archivovaní</option>
        </select>
        <select
          className="border rounded-lg px-3 py-2"
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
          aria-label="Filtrovat podle tagů"
        >
          <option value="all">Všechny tagy</option>
          <option value="VIP">VIP</option>
          <option value="Pravidelný">Pravidelný</option>
          <option value="Nový">Nový</option>
          <option value="Rizikový">Rizikový</option>
        </select>
        <select
          className="border rounded-lg px-3 py-2"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          aria-label="Seřadit pacienty"
        >
          <option value="name">Podle jména</option>
          <option value="age">Podle věku</option>
          <option value="lastVisit">Podle návštěvy</option>
        </select>
      </div>

      {/* Patients Table */}
      <Card>
        <CardHeader>
          <CardTitle>Seznam pacientů ({filteredPatients.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-sm">Pacient</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">Věk</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">Telefon</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">Poslední návštěva</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">Akce</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div>
                          <div className="font-medium">
                            {patient.personalInfo.firstName} {patient.personalInfo.lastName}
                          </div>
                          <div className="text-xs text-gray-500">{patient.personalInfo.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{patient.personalInfo.age}</td>
                    <td className="py-3 px-4">
                      <a href={`tel:${patient.personalInfo.phone}`} className="text-blue-600 hover:underline text-sm">
                        {patient.personalInfo.phone}
                      </a>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {formatRelativeTime(patient.visitHistory.lastVisit)}
                    </td>
                    <td className="py-3 px-4">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedPatient(patient)
                          setIsDetailOpen(true)
                        }}
                        title="Zobrazit detail"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Detail
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Patient Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="!w-[80vw] !max-w-[80vw] h-[95vh] flex flex-col sm:!max-w-[80vw]">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-2xl">
                  {selectedPatient?.personalInfo.firstName} {selectedPatient?.personalInfo.lastName}
                </DialogTitle>
                <p className="text-sm text-gray-500 mt-1">
                  ID: {selectedPatient?.id} • Věk: {selectedPatient ? Math.floor((new Date().getTime() - new Date(selectedPatient.personalInfo.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 365.25)) : 0} let
                </p>
                <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Poslední návštěva: {selectedPatient ? formatDate(selectedPatient.visitHistory.lastVisit) : ''}</span>
                  <span className="text-gray-400">•</span>
                  <span>{selectedPatient ? formatRelativeTime(selectedPatient.visitHistory.lastVisit) : ''}</span>
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

          {selectedPatient && (
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
                {/* Main Info Grid */}
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
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Věk</div>
                    <div className="font-semibold text-gray-900">
                      {Math.floor((new Date().getTime() - new Date(selectedPatient.personalInfo.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 365.25))} let
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Pohlaví</div>
                    {isEditMode && editedPatient ? (
                      <select
                        value={editedPatient.personalInfo.gender}
                        onChange={(e) => updateEditedField('personalInfo.gender', e.target.value)}
                        className="w-full h-9 px-2 text-sm border border-gray-300 rounded-md"
                        aria-label="Pohlaví"
                      >
                        <option value="male">Muž</option>
                        <option value="female">Žena</option>
                      </select>
                    ) : (
                      <div className="font-semibold text-gray-900">{selectedPatient.personalInfo.gender === "male" ? "Muž" : "Žena"}</div>
                    )}
                  </div>

                  <div className="col-span-2">
                    <div className="text-xs text-gray-500 mb-1">Datum narození</div>
                    {isEditMode && editedPatient ? (
                      <Input
                        type="date"
                        value={new Date(editedPatient.personalInfo.dateOfBirth).toISOString().split('T')[0]}
                        onChange={(e) => updateEditedField('personalInfo.dateOfBirth', new Date(e.target.value))}
                        className="h-9"
                      />
                    ) : (
                      <div className="font-semibold text-gray-900">{formatDate(selectedPatient.personalInfo.dateOfBirth)}</div>
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
                  <div className="col-span-2">
                    <div className="text-xs text-gray-500 mb-1">Email</div>
                    {isEditMode && editedPatient ? (
                      <Input
                        type="email"
                        value={editedPatient.personalInfo.email}
                        onChange={(e) => updateEditedField('personalInfo.email', e.target.value)}
                        className="h-9"
                      />
                    ) : (
                      <a href={`mailto:${selectedPatient.personalInfo.email}`} className="font-semibold text-blue-600 hover:underline break-all">
                        {selectedPatient.personalInfo.email}
                      </a>
                    )}
                  </div>
                </div>

                {/* Address Section */}
                {(selectedPatient.personalInfo.address || (isEditMode && editedPatient?.personalInfo.address)) && (
                  <div className="grid grid-cols-6 gap-x-6 gap-y-4 py-4 border-b">
                    <div className="col-span-3">
                      <div className="text-xs text-gray-500 mb-1">Ulice a číslo</div>
                      {isEditMode && editedPatient ? (
                        <Input
                          placeholder="Ulice a číslo"
                          value={editedPatient.personalInfo.address?.street || ''}
                          onChange={(e) => updateEditedField('personalInfo.address.street', e.target.value)}
                          className="h-9"
                        />
                      ) : (
                        <div className="font-semibold text-gray-900">{selectedPatient.personalInfo.address?.street}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">PSČ</div>
                      {isEditMode && editedPatient ? (
                        <Input
                          placeholder="PSČ"
                          value={editedPatient.personalInfo.address?.zip || ''}
                          onChange={(e) => updateEditedField('personalInfo.address.zip', e.target.value)}
                          className="h-9"
                        />
                      ) : (
                        <div className="font-semibold text-gray-900">{selectedPatient.personalInfo.address?.zip}</div>
                      )}
                    </div>
                    <div className="col-span-2">
                      <div className="text-xs text-gray-500 mb-1">Město</div>
                      {isEditMode && editedPatient ? (
                        <Input
                          placeholder="Město"
                          value={editedPatient.personalInfo.address?.city || ''}
                          onChange={(e) => updateEditedField('personalInfo.address.city', e.target.value)}
                          className="h-9"
                        />
                      ) : (
                        <div className="font-semibold text-gray-900">{selectedPatient.personalInfo.address?.city}</div>
                      )}
                    </div>
                  </div>
                )}

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

                {/* Verification Section */}
                <div className="py-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-xs font-medium text-gray-500">OVĚŘENÍ KONTAKTU</div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleVerifyContact(selectedPatient)}
                        className="text-green-600 hover:text-green-700 h-7 text-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        Ověřit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSendVerificationLink(selectedPatient)}
                        className="text-blue-600 hover:text-blue-700 h-7 text-xs"
                      >
                        <Send className="w-3.5 h-3.5 mr-1" />
                        Odeslat odkaz
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-6 gap-x-6">
                    <div className="col-span-3">
                      <div className="text-xs text-gray-500 mb-1">Status</div>
                      {getVerificationBadge(selectedPatient)}
                    </div>
                    {selectedPatient.contactVerifiedAt && (
                      <div className="col-span-3">
                        <div className="text-xs text-gray-500 mb-1">Naposledy ověřeno</div>
                        <div className="font-semibold text-gray-900">{formatDate(selectedPatient.contactVerifiedAt)}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{formatRelativeTime(selectedPatient.contactVerifiedAt)}</div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Medical Info Tab */}
              <TabsContent value="medical" className="mt-0 overflow-y-auto flex-1 p-6">
                {/* Blood Type */}
                <div className="grid grid-cols-6 gap-x-6 pb-4 border-b">
                  <div className="col-span-2">
                    <div className="text-xs text-gray-500 mb-1">Krevní skupina</div>
                    {isEditMode && editedPatient ? (
                      <Input
                        placeholder="A+, A-, B+, B-, AB+, AB-, 0+, 0-"
                        value={editedPatient.medicalInfo.bloodType || ''}
                        onChange={(e) => updateEditedField('medicalInfo.bloodType', e.target.value)}
                        className="h-9"
                      />
                    ) : (
                      <div className="font-semibold text-gray-900 text-lg">{selectedPatient.medicalInfo.bloodType || '-'}</div>
                    )}
                  </div>
                </div>

                {/* Allergies */}
                <div className="py-4 border-b">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <div className="text-xs font-medium text-red-700 uppercase">Alergie</div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {(isEditMode && editedPatient ? editedPatient.medicalInfo.allergies : selectedPatient.medicalInfo.allergies)?.map((allergy, i) => (
                      <Badge key={i} className="bg-red-100 text-red-800 flex items-center gap-1 text-xs">
                        {allergy}
                        {isEditMode && (
                          <button
                            type="button"
                            onClick={() => removeArrayItem('medicalInfo.allergies', i)}
                            className="ml-1 hover:text-red-900"
                            aria-label={`Odstranit alergii ${allergy}`}
                            title={`Odstranit ${allergy}`}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </Badge>
                    ))}
                  </div>
                  {isEditMode && (
                    <div className="flex gap-2 mt-2">
                      <Input
                        placeholder="Nová alergie"
                        id="new-allergy"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            const input = e.target as HTMLInputElement
                            if (input.value.trim()) {
                              addArrayItem('medicalInfo.allergies', input.value.trim())
                              input.value = ''
                            }
                          }
                        }}
                        className="flex-1 h-9"
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => {
                          const input = document.getElementById('new-allergy') as HTMLInputElement
                          if (input?.value.trim()) {
                            addArrayItem('medicalInfo.allergies', input.value.trim())
                            input.value = ''
                          }
                        }}
                        className="h-9"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Conditions */}
                <div className="py-4 border-b">
                  <div className="text-xs font-medium text-gray-500 mb-3 uppercase">Zdravotní podmínky</div>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {(isEditMode && editedPatient ? editedPatient.medicalInfo.conditions : selectedPatient.medicalInfo.conditions)?.map((condition, i) => (
                      <Badge key={i} className="bg-orange-100 text-orange-800 flex items-center gap-1 text-xs">
                        {condition}
                        {isEditMode && (
                          <button
                            type="button"
                            onClick={() => removeArrayItem('medicalInfo.conditions', i)}
                            className="ml-1 hover:text-orange-900"
                            aria-label={`Odstranit podmínku ${condition}`}
                            title={`Odstranit ${condition}`}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </Badge>
                    ))}
                  </div>
                  {isEditMode && (
                    <div className="flex gap-2 mt-2">
                      <Input
                        placeholder="Nová zdravotní podmínka"
                        id="new-condition"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            const input = e.target as HTMLInputElement
                            if (input.value.trim()) {
                              addArrayItem('medicalInfo.conditions', input.value.trim())
                              input.value = ''
                            }
                          }
                        }}
                        className="flex-1 h-9"
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => {
                          const input = document.getElementById('new-condition') as HTMLInputElement
                          if (input?.value.trim()) {
                            addArrayItem('medicalInfo.conditions', input.value.trim())
                            input.value = ''
                          }
                        }}
                        className="h-9"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Medications */}
                <div className="py-4 border-b">
                  <div className="text-xs font-medium text-gray-500 mb-3 uppercase">Medikace</div>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {(isEditMode && editedPatient ? editedPatient.medicalInfo.medications : selectedPatient.medicalInfo.medications)?.map((medication, i) => (
                      <Badge key={i} className="bg-blue-100 text-blue-800 flex items-center gap-1 text-xs">
                        {medication}
                        {isEditMode && (
                          <button
                            type="button"
                            onClick={() => removeArrayItem('medicalInfo.medications', i)}
                            className="ml-1 hover:text-blue-900"
                            aria-label={`Odstranit medikaci ${medication}`}
                            title={`Odstranit ${medication}`}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </Badge>
                    ))}
                  </div>
                  {isEditMode && (
                    <div className="flex gap-2 mt-2">
                      <Input
                        placeholder="Nová medikace"
                        id="new-medication"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            const input = e.target as HTMLInputElement
                            if (input.value.trim()) {
                              addArrayItem('medicalInfo.medications', input.value.trim())
                              input.value = ''
                            }
                          }
                        }}
                        className="flex-1 h-9"
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => {
                          const input = document.getElementById('new-medication') as HTMLInputElement
                          if (input?.value.trim()) {
                            addArrayItem('medicalInfo.medications', input.value.trim())
                            input.value = ''
                          }
                        }}
                        className="h-9"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div className="py-4">
                  <div className="text-xs font-medium text-gray-500 mb-3 uppercase">Poznámky</div>
                  {isEditMode && editedPatient ? (
                    <textarea
                      value={editedPatient.medicalInfo.notes || ''}
                      onChange={(e) => updateEditedField('medicalInfo.notes', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md min-h-[100px]"
                      placeholder="Zdravotní poznámky..."
                    />
                  ) : (
                    <p className="text-sm text-gray-700">{selectedPatient.medicalInfo.notes || '-'}</p>
                  )}
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

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Historie návštěv</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 pt-0">
                    <div className="grid grid-cols-4 gap-3">
                      <div className="col-span-2">
                        <div className="text-sm text-gray-600">První návštěva</div>
                        <div className="font-medium">{formatDate(selectedPatient.visitHistory.firstVisit)}</div>
                        <div className="text-xs text-gray-500">{formatRelativeTime(selectedPatient.visitHistory.firstVisit)}</div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-sm text-gray-600">Poslední návštěva</div>
                        <div className="font-medium">{formatDate(selectedPatient.visitHistory.lastVisit)}</div>
                        <div className="text-xs text-gray-500">{formatRelativeTime(selectedPatient.visitHistory.lastVisit)}</div>
                      </div>
                    </div>

                    {/* Visit Frequency */}
                    <div className="pt-2 border-t mt-2">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-blue-600" />
                        <div className="text-sm text-gray-600">Pravidelnost</div>
                      </div>
                      <div className="mt-1.5 p-2.5 bg-blue-50 rounded-lg">
                        <div className="text-sm font-medium text-blue-900">
                          Průměrně každé {Math.round(
                            (selectedPatient.visitHistory.lastVisit.getTime() - selectedPatient.visitHistory.firstVisit.getTime()) /
                            (1000 * 60 * 60 * 24 * 30) / selectedPatient.visitHistory.totalVisits
                          )} měsíců
                        </div>
                        <div className="text-xs text-blue-700 mt-1">
                          {selectedPatient.visitHistory.totalVisits} návštěv za {Math.round(
                            (selectedPatient.visitHistory.lastVisit.getTime() - selectedPatient.visitHistory.firstVisit.getTime()) /
                            (1000 * 60 * 60 * 24 * 30)
                          )} měsíců
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
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

                    <div className="grid grid-cols-4 gap-3">
                      {selectedPatient.financial.lastPayment && (
                        <div className="col-span-2">
                          <div className="text-sm text-gray-600">Poslední platba</div>
                          <div className="font-medium">{formatDate(selectedPatient.financial.lastPayment)}</div>
                        </div>
                      )}
                      <div>
                        <div className="text-sm text-gray-600">Způsob platby</div>
                        <div className="font-medium">
                          {selectedPatient.financial.paymentMethod === "cash" && "Hotovost"}
                          {selectedPatient.financial.paymentMethod === "card" && "Karta"}
                          {selectedPatient.financial.paymentMethod === "transfer" && "Převod"}
                        </div>
                      </div>
                      {selectedPatient.financial.insurance && (
                        <div>
                          <div className="text-sm text-gray-600">Pojišťovna</div>
                          <div className="font-medium">{selectedPatient.financial.insurance}</div>
                        </div>
                      )}
                      <div>
                        <div className="text-sm text-gray-600">Průměrná platba</div>
                        <div className="font-medium text-green-600">
                          {formatCurrency(Math.round(selectedPatient.financial.totalSpent / selectedPatient.visitHistory.totalVisits))}
                        </div>
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
                    <div className="flex flex-wrap gap-2 mb-2">
                      {(isEditMode && editedPatient ? editedPatient.tags : selectedPatient.tags)?.map((tag, i) => (
                        <Badge key={i} className={`${getTagColor(tag)} flex items-center gap-1`}>
                          {tag}
                          {isEditMode && (
                            <button
                              type="button"
                              onClick={() => removeTag(i)}
                              className="ml-1 hover:opacity-70"
                              aria-label={`Odstranit tag ${tag}`}
                              title={`Odstranit ${tag}`}
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </Badge>
                      ))}
                    </div>
                    {isEditMode && (
                      <div className="flex gap-2 mt-3">
                        <Input
                          placeholder="Nový tag"
                          id="new-tag"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              const input = e.target as HTMLInputElement
                              if (input.value.trim()) {
                                addTag(input.value.trim())
                                input.value = ''
                              }
                            }
                          }}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => {
                            const input = document.getElementById('new-tag') as HTMLInputElement
                            if (input?.value.trim()) {
                              addTag(input.value.trim())
                              input.value = ''
                            }
                          }}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                    {!isEditMode && (!selectedPatient.tags || selectedPatient.tags.length === 0) && (
                      <p className="text-sm text-gray-500">Žádné tagy</p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Preference</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 pt-0">
                    <div className="grid grid-cols-4 gap-3">
                      <div className="col-span-2">
                        <div className="text-sm text-gray-600 mb-1">Preferovaný lékař</div>
                        {isEditMode && editedPatient ? (
                          <Input
                            value={editedPatient.preferences.preferredDoctor || ''}
                            onChange={(e) => updateEditedField('preferences.preferredDoctor', e.target.value)}
                            placeholder="Jméno lékaře"
                          />
                        ) : (
                          <div className="font-medium">{selectedPatient.preferences.preferredDoctor || '-'}</div>
                        )}
                      </div>
                      <div className="col-span-2">
                        <div className="text-sm text-gray-600 mb-1">Preferované dny</div>
                        {isEditMode && editedPatient ? (
                          <Input
                            value={editedPatient.preferences.preferredDays?.join(', ') || ''}
                            onChange={(e) => updateEditedField('preferences.preferredDays', e.target.value.split(',').map(d => d.trim()).filter(d => d))}
                            placeholder="Po, St, Pá"
                          />
                        ) : (
                          <div className="font-medium">{selectedPatient.preferences.preferredDays?.join(", ") || '-'}</div>
                        )}
                      </div>
                      <div className="col-span-2">
                        <div className="text-sm text-gray-600 mb-1">Komunikační kanál</div>
                        {isEditMode && editedPatient ? (
                          <select
                            value={editedPatient.preferences.communicationChannel}
                            onChange={(e) => updateEditedField('preferences.communicationChannel', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            aria-label="Komunikační kanál"
                          >
                            <option value="phone">Telefon</option>
                            <option value="email">Email</option>
                            <option value="sms">SMS</option>
                            <option value="whatsapp">WhatsApp</option>
                          </select>
                        ) : (
                          <div className="font-medium">
                            {selectedPatient.preferences.communicationChannel === "phone" && "Telefon"}
                            {selectedPatient.preferences.communicationChannel === "email" && "Email"}
                            {selectedPatient.preferences.communicationChannel === "sms" && "SMS"}
                            {selectedPatient.preferences.communicationChannel === "whatsapp" && "WhatsApp"}
                          </div>
                        )}
                      </div>
                      <div className="col-span-2">
                        <div className="text-sm text-gray-600 mb-1">Marketingový souhlas</div>
                        {isEditMode && editedPatient ? (
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={editedPatient.preferences.marketingConsent}
                              onChange={(e) => updateEditedField('preferences.marketingConsent', e.target.checked)}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm">Souhlas s marketingovou komunikací</span>
                          </label>
                        ) : (
                          <div className="font-medium">
                            {selectedPatient.preferences.marketingConsent ? "Ano" : "Ne"}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Systémové informace</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 pt-0">
                    <div className="grid grid-cols-4 gap-3">
                      <div>
                        <div className="text-sm text-gray-600">Vytvořeno</div>
                        <div className="font-medium">{formatDate(selectedPatient.createdAt)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Naposledy upraveno</div>
                        <div className="font-medium">{formatDate(selectedPatient.updatedAt)}</div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-sm text-gray-600 mb-1">Status</div>
                        {isEditMode && editedPatient ? (
                          <select
                            value={editedPatient.status}
                            onChange={(e) => updateEditedField('status', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            aria-label="Status pacienta"
                          >
                            <option value="active">Aktivní</option>
                            <option value="inactive">Neaktivní</option>
                            <option value="archived">Archivován</option>
                          </select>
                        ) : (
                          getStatusBadge(selectedPatient.status)
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Patient Edit Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Upravit pacienta</DialogTitle>
          </DialogHeader>
          {selectedPatient && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Jméno</label>
                  <Input defaultValue={selectedPatient.personalInfo.firstName} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Příjmení</label>
                  <Input defaultValue={selectedPatient.personalInfo.lastName} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Věk</label>
                  <Input type="number" defaultValue={selectedPatient.personalInfo.age} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                  <Input type="tel" defaultValue={selectedPatient.personalInfo.phone} />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <Input type="email" defaultValue={selectedPatient.personalInfo.email} />
                </div>
                {selectedPatient.personalInfo.address && (
                  <>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ulice</label>
                      <Input defaultValue={selectedPatient.personalInfo.address.street} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Město</label>
                      <Input defaultValue={selectedPatient.personalInfo.address.city} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">PSČ</label>
                      <Input defaultValue={selectedPatient.personalInfo.address.zip} />
                    </div>
                  </>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Zdravotní poznámky</label>
                <Input defaultValue={selectedPatient.medicalInfo.notes || ""} />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t">
                <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                  Zrušit
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Uložit změny
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
