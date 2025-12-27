"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { X, ChevronLeft, ChevronRight, Check, CalendarIcon, Clock, User, CreditCard } from "lucide-react"
import { format, addDays, startOfDay, setHours, setMinutes } from "date-fns"
import { cs } from "date-fns/locale"

interface BookingModalV3Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  preSelectedService?: string
}

const services = [
  { name: "Preventivní prohlídka", price: 800, duration: 30 },
  { name: "Zubní výplň", price: 1500, duration: 45 },
  { name: "Hygiena", price: 1200, duration: 45 },
  { name: "Bělení", price: 3500, duration: 60 },
  { name: "Kořenové ošetření", price: 2800, duration: 60 },
  { name: "Extrakce", price: 1000, duration: 30 },
]

const timeSlots = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
]

// Mock booked slots with patient names
const bookedSlots = {
  "2024-12-27T09:00": "Barbora H.",
  "2024-12-27T11:00": "Jakub K.",
  "2024-12-27T15:00": "David Š.",
}

export function BookingModalV3({ open, onOpenChange, preSelectedService }: BookingModalV3Props) {
  const [step, setStep] = useState(1)
  const [selectedService, setSelectedService] = useState(preSelectedService || "")
  const [date, setDate] = useState<Date>()
  const [time, setTime] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    birthDate: "",
    note: "",
    gdprConsent: false,
  })
  const [showSuccess, setShowSuccess] = useState(false)

  const resetModal = () => {
    setStep(1)
    setSelectedService(preSelectedService || "")
    setDate(undefined)
    setTime("")
    setFormData({ name: "", phone: "", email: "", birthDate: "", note: "", gdprConsent: false })
    setShowSuccess(false)
  }

  const handleClose = () => {
    resetModal()
    onOpenChange(false)
  }

  const handleNext = () => setStep(step + 1)
  const handleBack = () => setStep(step - 1)

  const handleConfirm = () => {
    setShowSuccess(true)
    setTimeout(() => {
      handleClose()
    }, 3000)
  }

  const isTimeSlotBooked = (selectedDate: Date, slot: string) => {
    const [hours, minutes] = slot.split(":").map(Number)
    const slotDate = setMinutes(setHours(startOfDay(selectedDate), hours), minutes)
    const slotKey = format(slotDate, "yyyy-MM-dd'T'HH:mm")
    return slotKey in bookedSlots
  }

  const getBookedPatient = (selectedDate: Date, slot: string) => {
    const [hours, minutes] = slot.split(":").map(Number)
    const slotDate = setMinutes(setHours(startOfDay(selectedDate), hours), minutes)
    const slotKey = format(slotDate, "yyyy-MM-dd'T'HH:mm")
    return bookedSlots[slotKey as keyof typeof bookedSlots]
  }

  const selectedServiceData = services.find((s) => s.name === selectedService)

  if (showSuccess) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Rezervace odeslána!</h3>
            <p className="text-gray-600 mb-6">
              Děkujeme! Vaše žádost o termín byla přijata. Ozveme se vám do 24 hodin.
            </p>
            <Button onClick={handleClose} className="bg-[#2563eb] hover:bg-[#1d4ed8]">
              Zavřít
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-gray-900">Online objednání</DialogTitle>
              <p className="text-sm text-gray-600 mt-1">Krok {step} z 4</p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleClose} className="absolute right-4 top-4">
              <X className="h-5 w-5" />
            </Button>
          </div>
          {/* Progress indicators */}
          <div className="flex gap-2 mt-4">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full transition-colors ${s <= step ? "bg-[#2563eb]" : "bg-gray-200"}`}
              />
            ))}
          </div>
        </DialogHeader>

        <div className="px-6 py-6">
          {/* STEP 1: Select Service */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Vyberte typ návštěvy</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {services.map((service) => (
                  <button
                    key={service.name}
                    onClick={() => setSelectedService(service.name)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      selectedService === service.name
                        ? "border-[#2563eb] bg-blue-50 shadow-md"
                        : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-900">{service.name}</h4>
                      {selectedService === service.name && <Check className="w-5 h-5 text-[#2563eb]" />}
                    </div>
                    <p className="text-sm text-gray-600">{service.duration} min</p>
                    <p className="text-lg font-bold text-[#2563eb] mt-2">{service.price} Kč</p>
                  </button>
                ))}
              </div>
              <div className="flex justify-end pt-6">
                <Button onClick={handleNext} disabled={!selectedService} className="bg-[#2563eb] hover:bg-[#1d4ed8]">
                  Pokračovat
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: Select Date & Time */}
          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Vyberte datum a čas</h3>
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Calendar */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    Vyberte datum
                  </h4>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => {
                      const today = startOfDay(new Date())
                      const maxDate = addDays(today, 14)
                      const day = date.getDay()
                      return date < today || date > maxDate || day === 0 || day === 6
                    }}
                    locale={cs}
                    className="rounded-lg border shadow-sm"
                  />
                </div>

                {/* Time Slots */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {date ? `Dostupné časy - ${format(date, "EEEE d.M.", { locale: cs })}` : "Nejprve vyberte datum"}
                  </h4>
                  {date ? (
                    <div className="grid grid-cols-3 gap-2 max-h-[400px] overflow-y-auto">
                      {timeSlots.map((slot) => {
                        const isBooked = isTimeSlotBooked(date, slot)
                        const patient = isBooked ? getBookedPatient(date, slot) : null
                        return (
                          <Button
                            key={slot}
                            variant={time === slot ? "default" : "outline"}
                            onClick={() => !isBooked && setTime(slot)}
                            disabled={isBooked}
                            className={`h-auto py-2 px-2 flex flex-col items-center gap-1 ${
                              time === slot
                                ? "bg-[#2563eb] hover:bg-[#1d4ed8]"
                                : isBooked
                                  ? "opacity-50 cursor-not-allowed bg-gray-100 text-gray-500"
                                  : "hover:bg-gray-50"
                            }`}
                          >
                            <span className="font-semibold">{slot}</span>
                            {isBooked && <span className="text-xs">({patient})</span>}
                          </Button>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="h-[400px] flex items-center justify-center bg-gray-50 rounded-lg">
                      <p className="text-gray-500">Vyberte datum pro zobrazení volných časů</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between pt-6 border-t">
                <Button variant="outline" onClick={handleBack}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Zpět
                </Button>
                <Button onClick={handleNext} disabled={!date || !time} className="bg-[#2563eb] hover:bg-[#1d4ed8]">
                  Pokračovat
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: Patient Details */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Vyplňte kontaktní údaje</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jméno a příjmení <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Jana Nováková"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+420 731 234 567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jana@email.cz"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Datum narození</label>
                  <Input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Poznámka (volitelné)</label>
                  <Textarea
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    placeholder="Máte nějaké dotazy nebo speciální požadavky?"
                    rows={3}
                  />
                </div>
                <div className="flex items-start gap-2 pt-2">
                  <Checkbox
                    id="gdpr"
                    checked={formData.gdprConsent}
                    onCheckedChange={(checked) => setFormData({ ...formData, gdprConsent: checked as boolean })}
                  />
                  <label htmlFor="gdpr" className="text-sm text-gray-700 leading-tight">
                    Souhlasím se zpracováním osobních údajů <span className="text-red-500">*</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-between pt-6 border-t">
                <Button variant="outline" onClick={handleBack}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Zpět
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={!formData.name || !formData.phone || !formData.email || !formData.gdprConsent}
                  className="bg-[#2563eb] hover:bg-[#1d4ed8]"
                >
                  Pokračovat
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: Confirmation */}
          {step === 4 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Potvrzení objednávky</h3>

              <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-6 border-2 border-blue-200">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CalendarIcon className="w-5 h-5 text-[#2563eb] mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Datum</p>
                      <p className="font-semibold text-gray-900">
                        {date && format(date, "EEEE d. MMMM yyyy", { locale: cs })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-[#2563eb] mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Čas</p>
                      <p className="font-semibold text-gray-900">
                        {time} -{" "}
                        {selectedServiceData &&
                          `${time.split(":")[0]}:${(Number.parseInt(time.split(":")[1]) + selectedServiceData.duration).toString().padStart(2, "0")}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-[#2563eb] mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Služba</p>
                      <p className="font-semibold text-gray-900">{selectedService}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CreditCard className="w-5 h-5 text-[#2563eb] mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Cena</p>
                      <p className="font-semibold text-gray-900">{selectedServiceData?.price} Kč</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-blue-200 my-4 pt-4">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-[#059669] mt-1" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Pacient</p>
                      <p className="font-semibold text-gray-900">{formData.name}</p>
                      <p className="text-sm text-gray-700 mt-1">{formData.phone}</p>
                      <p className="text-sm text-gray-700">{formData.email}</p>
                    </div>
                  </div>
                </div>

                {formData.note && (
                  <div className="bg-white/50 rounded-lg p-3 mt-4">
                    <p className="text-sm text-gray-600">Poznámka</p>
                    <p className="text-sm text-gray-900 mt-1">{formData.note}</p>
                  </div>
                )}
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
                <div className="text-yellow-600 text-xl">ℹ️</div>
                <p className="text-sm text-yellow-900">
                  Vaše rezervace čeká na potvrzení. Ozveme se vám do 24 hodin na uvedený telefon nebo email.
                </p>
              </div>

              <div className="flex justify-between pt-6 border-t">
                <Button variant="outline" onClick={handleBack}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Zpět
                </Button>
                <Button onClick={handleConfirm} className="bg-[#059669] hover:bg-[#047857] text-white px-8">
                  Potvrdit rezervaci
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
