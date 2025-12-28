import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { TierProvider } from "@/lib/tier-context"
import { OfficeHoursProvider } from "@/lib/office-hours-context"
import { UserProvider } from "@/lib/user-context"
import { AppointmentProvider } from "@/lib/appointment-context"
import { TierSelector } from "@/components/tier-selector"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MUDr. Jana Nováková - Zubní ordinace Plzeň",
  description:
    "Moderní zubní péče v srdci Plzně. Komplexní služby pro celou rodinu s důrazem na prevenci a bezbolestné ošetření. Více než 15 let praxe.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="cs">
      <body className={`font-sans antialiased`}>
        <Suspense fallback={null}>
          <TierProvider>
            <UserProvider>
              <OfficeHoursProvider>
                <AppointmentProvider>
                  <TierSelector />
                  {children}
                </AppointmentProvider>
              </OfficeHoursProvider>
            </UserProvider>
          </TierProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
