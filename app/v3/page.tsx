import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { ServicesSection } from "@/components/services-section"
import { OnlineBookingSection } from "@/components/online-booking-section"
import { OpeningHours } from "@/components/opening-hours"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { VersionBadge } from "@/components/version-badge"
import { AnnouncementBanner } from "@/components/announcement-banner"
import { DemoOnboarding } from "@/components/demo-onboarding"
import { AvailabilityWidget } from "@/components/availability-widget"

export default function V3Page() {
  return (
    <div className="min-h-screen">
      <DemoOnboarding />
      <VersionBadge version="PROFI" />
      <AnnouncementBanner />
      <Header version="v3" />
      <main>
        <HeroSection version="v3" />
        <AboutSection version="v3" />
        <ServicesSection version="v3" />
        <OnlineBookingSection />
        <section className="py-16 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4 max-w-6xl">
            <AvailabilityWidget />
          </div>
        </section>
        <OpeningHours />
        <ContactSection version="v3" />
      </main>
      <Footer />
    </div>
  )
}
