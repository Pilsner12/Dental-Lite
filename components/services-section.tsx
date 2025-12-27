"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Sparkles, Activity, Scissors, Stethoscope, Calendar } from "lucide-react"
import { BookingModalV3 } from "@/components/booking-modal-v3"

const services = [
  {
    icon: Shield,
    title: "Preventivní prohlídka",
    description: "Pravidelná kontrola stavu chrupu a prevence zubních onemocnění",
    price: "800 Kč",
  },
  {
    icon: Stethoscope,
    title: "Zubní výplň (plomba)",
    description: "Ošetření zubního kazu moderními композитními materiály",
    price: "1 500 Kč",
  },
  {
    icon: Sparkles,
    title: "Odstranění zubního kamene",
    description: "Profesionální čištění zubů ultrazvukem",
    price: "1 200 Kč",
  },
  {
    icon: Sparkles,
    title: "Bělení zubů",
    description: "Profesionální bělení pro zářivý úsměv",
    price: "3 500 Kč",
  },
  {
    icon: Activity,
    title: "Kořenové ošetření",
    description: "Endodontické ošetření s využitím moderních technologií",
    price: "2 800 Kč",
  },
  {
    icon: Scissors,
    title: "Extrakce zubu",
    description: "Bezbolestné odstranění zubu s lokální anestezií",
    price: "1 000 Kč",
  },
]

interface ServicesSectionProps {
  version?: string
}

export function ServicesSection({ version }: ServicesSectionProps) {
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [selectedService, setSelectedService] = useState("")

  const handleServiceBook = (serviceName: string) => {
    setSelectedService(serviceName)
    setIsBookingOpen(true)
  }

  return (
    <>
      <section id="services" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Naše služby</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Poskytujeme komplexní zubní péči s využitím nejmodernějších postupů a materiálů
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow border-gray-200">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-[#2563eb]/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-[#2563eb]" />
                    </div>
                    <CardTitle className="text-xl text-gray-900">{service.title}</CardTitle>
                    <CardDescription className="text-gray-600">{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-[#059669]">{service.price}</div>
                      {version === "v3" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleServiceBook(service.title)}
                          className="border-[#2563eb] text-[#2563eb] hover:bg-[#2563eb] hover:text-white"
                        >
                          <Calendar className="w-4 h-4 mr-1" />
                          Objednat
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {version === "v3" && (
        <BookingModalV3 open={isBookingOpen} onOpenChange={setIsBookingOpen} preSelectedService={selectedService} />
      )}
    </>
  )
}
