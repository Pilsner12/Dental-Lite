"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Phone, MessageSquare, Send } from "lucide-react"
import { useState } from "react"
import type { Patient } from "@/lib/mock-patients"

interface ContactPatientModalProps {
  open: boolean
  onClose: () => void
  patient: Patient | null
}

type ContactMethod = "phone" | "sms" | "whatsapp"
type MessageTemplate = "update_contact" | "preventive_checkup" | "available_slot" | "reminder" | "custom"

const MESSAGE_TEMPLATES: Record<MessageTemplate, (name: string) => string> = {
  update_contact: (name) => `Dobrý den ${name},\n\nchtěli bychom Vás požádat o aktualizaci kontaktních údajů v naší databázi. Můžete nám prosím potvrdit Vaše současné telefonní číslo a email?\n\nDěkujeme,\nZubní ordinace MUDr. Nováková`,
  
  preventive_checkup: (name) => `Dobrý den ${name},\n\nrádi bychom Vás pozvali na preventivní kontrolu. Od Vaší poslední návštěvy uplynulo více než 6 měsíců.\n\nMáme volné termíny:\n- Pondělí 8:00-10:00\n- Středa 14:00-16:00\n\nZavolejte nám prosím pro domluvení termínu.\n\nZubní ordinace MUDr. Nováková\nTel: +420 123 456 789`,
  
  available_slot: (name) => `Dobrý den ${name},\n\nuvolnil se nám dnes termín v 14:00. Máte zájem?\n\nPotvrzení prosím co nejdříve na tento tel. číslo.\n\nZubní ordinace MUDr. Nováková`,
  
  reminder: (name) => `Dobrý den ${name},\n\npřipomínáme Vám návštěvu zubní ordinace zítra v 10:00.\n\nPokud nemůžete přijít, prosím oznamte nám to co nejdříve.\n\nZubní ordinace MUDr. Nováková`,
  
  custom: () => ""
}

export function ContactPatientModal({ open, onClose, patient }: ContactPatientModalProps) {
  const [contactMethod, setContactMethod] = useState<ContactMethod>("phone")
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate>("preventive_checkup")
  const [messageText, setMessageText] = useState("")

  const handleTemplateSelect = (template: MessageTemplate) => {
    setSelectedTemplate(template)
    if (patient) {
      setMessageText(MESSAGE_TEMPLATES[template](patient.personalInfo.firstName))
    }
  }

  const handleSend = () => {
    if (!patient) return

    if (contactMethod === "phone") {
      // Open phone dialer
      window.location.href = `tel:${patient.personalInfo.phone}`
    } else if (contactMethod === "sms") {
      // Open SMS
      window.location.href = `sms:${patient.personalInfo.phone}${messageText ? `?body=${encodeURIComponent(messageText)}` : ''}`
    } else if (contactMethod === "whatsapp") {
      // Open WhatsApp
      const phoneNumber = patient.personalInfo.phone.replace(/\s/g, '').replace('+', '')
      window.open(`https://wa.me/${phoneNumber}${messageText ? `?text=${encodeURIComponent(messageText)}` : ''}`, '_blank')
    }

    onClose()
  }

  if (!patient) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Kontaktovat pacienta: {patient.personalInfo.firstName} {patient.personalInfo.lastName}</DialogTitle>
          <DialogDescription>
            Vyberte způsob kontaktu a šablonu zprávy pro komunikaci s pacientem
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Contact Method Selection */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Způsob kontaktu:</label>
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant={contactMethod === "phone" ? "default" : "outline"}
                onClick={() => setContactMethod("phone")}
                className="w-full"
              >
                <Phone className="h-4 w-4 mr-2" />
                Telefon
              </Button>
              <Button
                variant={contactMethod === "sms" ? "default" : "outline"}
                onClick={() => setContactMethod("sms")}
                className="w-full"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                SMS
              </Button>
              <Button
                variant={contactMethod === "whatsapp" ? "default" : "outline"}
                onClick={() => setContactMethod("whatsapp")}
                className="w-full"
              >
                <Send className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>
            </div>
          </div>

          {/* Contact Info */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-sm">
              <span className="font-medium text-gray-700">Telefon: </span>
              <span className="text-gray-900">{patient.personalInfo.phone}</span>
            </div>
            {patient.personalInfo.email && (
              <div className="text-sm mt-1">
                <span className="font-medium text-gray-700">Email: </span>
                <span className="text-gray-900">{patient.personalInfo.email}</span>
              </div>
            )}
            <div className="text-sm mt-1">
              <span className="font-medium text-gray-700">Preferovaný kanál: </span>
              <span className="text-gray-900 capitalize">{patient.preferences.communicationChannel}</span>
            </div>
          </div>

          {/* Message Templates (only for SMS/WhatsApp) */}
          {(contactMethod === "sms" || contactMethod === "whatsapp") && (
            <>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Šablona zprávy:</label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={selectedTemplate === "preventive_checkup" ? "default" : "outline"}
                    onClick={() => handleTemplateSelect("preventive_checkup")}
                    size="sm"
                    className="text-xs"
                  >
                    Preventivní prohlídka
                  </Button>
                  <Button
                    variant={selectedTemplate === "available_slot" ? "default" : "outline"}
                    onClick={() => handleTemplateSelect("available_slot")}
                    size="sm"
                    className="text-xs"
                  >
                    Volný termín dnes
                  </Button>
                  <Button
                    variant={selectedTemplate === "update_contact" ? "default" : "outline"}
                    onClick={() => handleTemplateSelect("update_contact")}
                    size="sm"
                    className="text-xs"
                  >
                    Update kontaktu
                  </Button>
                  <Button
                    variant={selectedTemplate === "reminder" ? "default" : "outline"}
                    onClick={() => handleTemplateSelect("reminder")}
                    size="sm"
                    className="text-xs"
                  >
                    Připomínka termínu
                  </Button>
                  <Button
                    variant={selectedTemplate === "custom" ? "default" : "outline"}
                    onClick={() => handleTemplateSelect("custom")}
                    size="sm"
                    className="text-xs col-span-2"
                  >
                    Vlastní zpráva
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Náhled zprávy:</label>
                <Textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Zadejte vlastní zprávu..."
                  className="min-h-[150px]"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Počet znaků: {messageText.length} {contactMethod === "sms" && messageText.length > 160 && "(více SMS)"}
                </p>
              </div>
            </>
          )}

          {/* Phone specific message */}
          {contactMethod === "phone" && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                Kliknutím na "Zavolat" se otevře telefonní aplikace s předvoleným číslem: <strong>{patient.personalInfo.phone}</strong>
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Zrušit
            </Button>
            <Button onClick={handleSend} className="flex-1">
              {contactMethod === "phone" ? (
                <>
                  <Phone className="h-4 w-4 mr-2" />
                  Zavolat
                </>
              ) : contactMethod === "sms" ? (
                <>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Odeslat SMS
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Otevřít WhatsApp
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
