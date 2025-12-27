import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { ServicesSection } from "@/components/services-section"
import { OpeningHours } from "@/components/opening-hours"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { VersionBadge } from "@/components/version-badge"

export default function V1Page() {
  return (
    <div className="min-h-screen">
      <VersionBadge version="ZÁKLADNÍ" />
      <Header />
      <main>
        <HeroSection showBookingButton={false} />
        <AboutSection />
        <ServicesSection />
        <OpeningHours />
        <ContactSection showBookingButton={false} />
      </main>
      <Footer />
    </div>
  )
}
