"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar, Phone } from "lucide-react"
import { BookingModal } from "@/components/booking-modal"
import { BookingModalV3 } from "@/components/booking-modal-v3"

interface HeroSectionProps {
  showBookingButton?: boolean
  version?: string
}

export function HeroSection({ showBookingButton = true, version }: HeroSectionProps) {
  const [bookingOpen, setBookingOpen] = useState(false)

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <>
      <section id="home" className="pt-16 md:pt-20">
        <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Text Content */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 text-balance">
                Moderní zubní péče v srdci Plzně
              </h1>
              <p className="text-lg md:text-xl text-gray-600 text-pretty">
                Komplexní služby pro celou rodinu s důrazem na prevenci a bezbolestné ošetření
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {showBookingButton ? (
                  version === "v3" ? (
                    <>
                      <Button
                        size="lg"
                        className="bg-gradient-to-r from-[#2563eb] to-[#059669] hover:from-[#1d4ed8] hover:to-[#047857] text-white shadow-lg"
                        onClick={() => setBookingOpen(true)}
                      >
                        <Calendar className="mr-2 h-5 w-5" />
                        Objednat online
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        asChild
                        className="border-[#2563eb] text-[#2563eb] bg-transparent"
                      >
                        <a href="tel:+420776123456" className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Zavolat
                        </a>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        size="lg"
                        className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white"
                        onClick={() => setBookingOpen(true)}
                      >
                        <Calendar className="mr-2 h-5 w-5" />
                        Objednat se online
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        className="border-[#2563eb] text-[#2563eb] hover:bg-[#2563eb] hover:text-white bg-transparent"
                        onClick={() => scrollToSection("contact")}
                      >
                        Kontakt
                      </Button>
                    </>
                  )
                ) : (
                  <Button
                    size="lg"
                    className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white"
                    onClick={() => scrollToSection("contact")}
                  >
                    Objednat se
                  </Button>
                )}
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/modern-dental-clinic-office-interior-bright-and-cl.jpg"
                alt="Moderní zubní ordinace"
                className="w-full h-full object-cover"
              />
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
