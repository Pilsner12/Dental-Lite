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

export default function V3Page() {
  return (
    <div className="min-h-screen">
      <VersionBadge version="PROFI" />
      <AnnouncementBanner />
      <Header version="v3" />
      <main>
        <HeroSection version="v3" />
        <AboutSection version="v3" />
        <ServicesSection version="v3" />
        <OnlineBookingSection />
        <OpeningHours />
        <ContactSection version="v3" />
      </main>
      <Footer />
    </div>
  )
}
