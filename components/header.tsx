"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Phone, Globe } from "lucide-react"
import { BookingModalV3 } from "@/components/booking-modal-v3"

interface HeaderProps {
  children?: React.ReactNode
  version?: string
}

export function Header({ children, version }: HeaderProps = {}) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setIsMobileMenuOpen(false)
    }
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white shadow-md" : "bg-white/95 backdrop-blur-sm"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <span className="text-2xl md:text-3xl" aria-hidden="true">
                🦷
              </span>
              <div className="flex flex-col">
                <span className="font-bold text-[#2563eb] text-sm md:text-base leading-tight">MUDr. Jana Nováková</span>
                <span className="text-xs text-gray-600 hidden sm:block">Zubní ordinace</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <button
                onClick={() => scrollToSection("home")}
                className="text-gray-700 hover:text-[#2563eb] transition-colors"
              >
                Domů
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="text-gray-700 hover:text-[#2563eb] transition-colors"
              >
                O nás
              </button>
              <button
                onClick={() => scrollToSection("services")}
                className="text-gray-700 hover:text-[#2563eb] transition-colors"
              >
                Služby
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-gray-700 hover:text-[#2563eb] transition-colors"
              >
                Kontakt
              </button>
            </nav>

            <div className="hidden md:flex items-center gap-3">
              {version === "v3" ? (
                <>
                  <Button
                    onClick={() => setIsBookingOpen(true)}
                    className="bg-gradient-to-r from-[#2563eb] to-[#059669] hover:from-[#1d4ed8] hover:to-[#047857] text-white shadow-lg hover:shadow-xl transition-all"
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    Objednat online
                  </Button>
                  {children}
                </>
              ) : (
                <>
                  <Button asChild className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white">
                    <a href="tel:+420776123456" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Zavolat: +420 776 123 456
                    </a>
                  </Button>
                  {children}
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-700"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <nav className="md:hidden py-4 border-t">
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => scrollToSection("home")}
                  className="text-left text-gray-700 hover:text-[#2563eb] transition-colors py-2"
                >
                  Domů
                </button>
                <button
                  onClick={() => scrollToSection("about")}
                  className="text-left text-gray-700 hover:text-[#2563eb] transition-colors py-2"
                >
                  O nás
                </button>
                <button
                  onClick={() => scrollToSection("services")}
                  className="text-left text-gray-700 hover:text-[#2563eb] transition-colors py-2"
                >
                  Služby
                </button>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="text-left text-gray-700 hover:text-[#2563eb] transition-colors py-2"
                >
                  Kontakt
                </button>
                {version === "v3" ? (
                  <Button
                    onClick={() => {
                      setIsBookingOpen(true)
                      setIsMobileMenuOpen(false)
                    }}
                    className="bg-gradient-to-r from-[#2563eb] to-[#059669] hover:from-[#1d4ed8] hover:to-[#047857] text-white w-full"
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    Objednat online
                  </Button>
                ) : (
                  <Button asChild className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white w-full">
                    <a href="tel:+420776123456" className="flex items-center justify-center gap-2">
                      <Phone className="h-4 w-4" />
                      Zavolat: +420 776 123 456
                    </a>
                  </Button>
                )}
                {children && <div className="pt-2">{children}</div>}
              </div>
            </nav>
          )}
        </div>
      </header>

      {version === "v3" && <BookingModalV3 open={isBookingOpen} onOpenChange={setIsBookingOpen} />}
    </>
  )
}
