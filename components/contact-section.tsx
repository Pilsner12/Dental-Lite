"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, Calendar } from "lucide-react"
import { BookingModal } from "@/components/booking-modal"
import { BookingModalV3 } from "@/components/booking-modal-v3"

interface ContactSectionProps {
  showBookingButton?: boolean
  version?: string
}

export function ContactSection({ showBookingButton = true, version }: ContactSectionProps) {
  const [bookingOpen, setBookingOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Děkujeme za vaši zprávu! Brzy se vám ozveme.")
    setFormData({ name: "", phone: "", email: "", message: "" })
  }

  return (
    <>
      <section id="contact" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Kontakt</h2>
            <p className="text-lg text-gray-600">
              {showBookingButton
                ? "Objednejte se na vyšetření nebo nám napište"
                : "Kontaktujte nás pro objednání nebo konzultaci"}
            </p>
            {showBookingButton && (
              <div className="mt-6">
                <Button
                  size="lg"
                  className={
                    version === "v3"
                      ? "bg-gradient-to-r from-[#2563eb] to-[#059669] hover:from-[#1d4ed8] hover:to-[#047857] text-white shadow-lg"
                      : "bg-[#2563eb] hover:bg-[#1d4ed8] text-white"
                  }
                  onClick={() => setBookingOpen(true)}
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Objednat se online
                </Button>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Contact Form */}
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900">Kontaktní formulář</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Jméno
                    </label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Telefon
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Zpráva
                    </label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      rows={4}
                      className="w-full"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white">
                    Odeslat zprávu
                  </Button>
                  <p className="text-sm text-gray-500 text-center mt-2">Ozveme se do 24 hodin</p>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-6">
              <Card className="shadow-xl">
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-[#2563eb]/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-6 w-6 text-[#2563eb]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Adresa</h3>
                        <p className="text-gray-600">
                          Hlavní 123
                          <br />
                          301 00 Plzeň
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-[#2563eb]/10 flex items-center justify-center flex-shrink-0">
                        <Phone className="h-6 w-6 text-[#2563eb]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Telefon</h3>
                        <a href="tel:+420776123456" className="text-[#2563eb] hover:underline">
                          +420 776 123 456
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-[#2563eb]/10 flex items-center justify-center flex-shrink-0">
                        <Mail className="h-6 w-6 text-[#2563eb]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                        <a href="mailto:info@ordinace-novakova.cz" className="text-[#2563eb] hover:underline">
                          info@ordinace-novakova.cz
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Map Placeholder */}
              <Card className="shadow-xl">
                <CardContent className="p-0">
                  <div className="h-64 bg-gray-200 rounded-lg overflow-hidden">
                    <img
                      src="/google-maps-location-marker-plzen-czech-republic.jpg"
                      alt="Mapa - Plzeň"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {showBookingButton &&
        (version === "v3" ? (
          <BookingModalV3 open={bookingOpen} onOpenChange={setBookingOpen} />
        ) : (
          <BookingModal open={bookingOpen} onOpenChange={setBookingOpen} />
        ))}
    </>
  )
}
