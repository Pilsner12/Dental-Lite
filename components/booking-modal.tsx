"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { format, addDays, startOfDay, setHours, setMinutes } from "date-fns"
import { cs } from "date-fns/locale"

interface BookingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const services = ["Preventivní prohlídka", "Plomba", "Zubní kámen", "Bělení zubů", "Kořenové ošetření", "Extrakce zubu"]

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
  "16:00",
  "16:30",
]

// Mock booked slots for demo
const bookedSlots = new Set(["2025-01-15T09:00", "2025-01-15T10:30", "2025-01-16T14:00"])

export function BookingModal({ open, onOpenChange }: BookingModalProps) {
  const [step, setStep] = useState(1)
  const [service, setService] = useState("")
  const [date, setDate] = useState<Date>()
  const [time, setTime] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    note: "",
  })

  const resetModal = () => {
    setStep(1)
    setService("")
    setDate(undefined)
    setTime("")
    setFormData({ name: "", phone: "", email: "", note: "" })
  }

  const handleClose = () => {
    resetModal()
    onOpenChange(false)
  }

  const handleNext = () => {
    setStep(step + 1)
  }

  const handleBack = () => {
    setStep(step - 1)
  }

  const handleConfirm = () => {
    alert("Rezervace byla úspěšně odeslána! Ozveme se vám do 24 hodin.")
    handleClose()
  }

  const isTimeSlotBooked = (selectedDate: Date, slot: string) => {
    const [hours, minutes] = slot.split(":").map(Number)
    const slotDate = setMinutes(setHours(startOfDay(selectedDate), hours), minutes)
    const slotKey = format(slotDate, "yyyy-MM-dd'T'HH:mm")
    return bookedSlots.has(slotKey)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-gray-900">Online objednání</DialogTitle>
              <p className="text-sm text-gray-600 mt-1">Krok {step} z 4</p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleClose} className="absolute right-4 top-4">
              <X className="h-5 w-5" />
            </Button>
          </div>
          {/* Progress Bar */}
          <div className="flex gap-2 mt-4">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className={`h-1 flex-1 rounded-full ${s <= step ? "bg-[#2563eb]" : "bg-gray-200"}`} />
            ))}
          </div>
        </DialogHeader>

        <div className="px-6 py-6">
          {/* Step 1: Select Service */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Vyberte službu</h3>
                <Select value={service} onValueChange={setService}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Zvolte typ ošetření" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end pt-4">
                <Button onClick={handleNext} disabled={!service} className="bg-[#2563eb] hover:bg-[#1d4ed8]">
                  Další
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Select Date & Time */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Vyberte datum</h3>
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => {
                      const today = startOfDay(new Date())
                      const maxDate = addDays(today, 14)
                      return date < today || date > maxDate
                    }}
                    locale={cs}
                    className="rounded-md border"
                  />
                </div>
              </div>

              {date && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Vyberte čas</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {timeSlots.map((slot) => {
                      const isBooked = isTimeSlotBooked(date, slot)
                      return (
                        <Button
                          key={slot}
                          variant={time === slot ? "default" : "outline"}
                          onClick={() => !isBooked && setTime(slot)}
                          disabled={isBooked}
                          className={
                            time === slot
                              ? "bg-[#2563eb] hover:bg-[#1d4ed8]"
                              : isBooked
                                ? "opacity-50 cursor-not-allowed bg-gray-100"
                                : "hover:bg-gray-50"
                          }
                        >
                          {slot}
                        </Button>
                      )
                    })}
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={handleBack}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Zpět
                </Button>
                <Button onClick={handleNext} disabled={!date || !time} className="bg-[#2563eb] hover:bg-[#1d4ed8]">
                  Další
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Patient Details */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Vaše údaje</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jméno a příjmení *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Jan Novák"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefon *</label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+420 776 123 456"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="jan.novak@email.cz"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Poznámka (volitelné)</label>
                <Textarea
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  placeholder="Další informace k vaší návštěvě..."
                  rows={3}
                />
              </div>
              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={handleBack}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Zpět
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={!formData.name || !formData.phone || !formData.email}
                  className="bg-[#2563eb] hover:bg-[#1d4ed8]"
                >
                  Další
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Souhrn objednávky</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Služba</p>
                  <p className="font-semibold text-gray-900">{service}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Datum a čas</p>
                  <p className="font-semibold text-gray-900">
                    {date && format(date, "d. MMMM yyyy", { locale: cs })} v {time}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Jméno</p>
                  <p className="font-semibold text-gray-900">{formData.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Telefon</p>
                  <p className="font-semibold text-gray-900">{formData.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold text-gray-900">{formData.email}</p>
                </div>
                {formData.note && (
                  <div>
                    <p className="text-sm text-gray-600">Poznámka</p>
                    <p className="font-semibold text-gray-900">{formData.note}</p>
                  </div>
                )}
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>Upozornění:</strong> Rezervace čeká na potvrzení. Ozveme se vám do 24 hodin.
                </p>
              </div>
              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={handleBack}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Zpět
                </Button>
                <Button onClick={handleConfirm} className="bg-[#059669] hover:bg-[#047857] text-white">
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
