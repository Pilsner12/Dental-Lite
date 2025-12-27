"use client"

import { Button } from "@/components/ui/button"
import { Globe, Clock, CheckCircle } from "lucide-react"
import { useState } from "react"
import { BookingModalV3 } from "./booking-modal-v3"

export function OnlineBookingSection() {
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  return (
    <>
      <section className="py-20 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#2563eb] rounded-full mb-6">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Online objednávání 24/7</h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Objednejte se kdykoliv z pohodlí domova. Systém vám okamžitě potvrdí dostupnost termínu.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <Clock className="w-8 h-8 text-[#2563eb] mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Kdykoli</h3>
                <p className="text-sm text-gray-600">Objednání dostupné 24 hodin denně, 7 dní v týdnu</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <CheckCircle className="w-8 h-8 text-[#059669] mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Jednoduše</h3>
                <p className="text-sm text-gray-600">Vyberte službu, datum a vyplňte kontakt</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <Globe className="w-8 h-8 text-[#2563eb] mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Okamžitě</h3>
                <p className="text-sm text-gray-600">Potvrzení dostanete do 24 hodin</p>
              </div>
            </div>

            <Button
              size="lg"
              onClick={() => setIsBookingOpen(true)}
              className="bg-gradient-to-r from-[#2563eb] to-[#059669] hover:from-[#1d4ed8] hover:to-[#047857] text-white text-lg px-8 py-6 h-auto shadow-lg hover:shadow-xl transition-all animate-pulse"
            >
              <Globe className="w-5 h-5 mr-2" />
              Vyzkoušet objednávání
            </Button>
          </div>
        </div>
      </section>

      <BookingModalV3 open={isBookingOpen} onOpenChange={setIsBookingOpen} />
    </>
  )
}
