import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { ServicesSection } from "@/components/services-section"
import { OpeningHours } from "@/components/opening-hours"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { VersionBadge } from "@/components/version-badge"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"
import { AnnouncementBanner } from "@/components/announcement-banner"
import { DemoOnboarding } from "@/components/demo-onboarding"

export default function V2Page() {
  return (
    <div className="min-h-screen">
      <DemoOnboarding />
      <AnnouncementBanner />
      <VersionBadge version="BUSINESS" />
      <Header>
        <Link href="/admin/login">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Admin
          </Button>
        </Link>
      </Header>
      <main>
        <HeroSection showBookingButton={false} />
        <AboutSection showSmsBadge={true} />
        <ServicesSection />
        <OpeningHours />
        <ContactSection showBookingButton={false} />
      </main>
      <Footer />
    </div>
  )
}
