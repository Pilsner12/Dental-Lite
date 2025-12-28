"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, Clock, AlertCircle, TrendingUp, Activity, Phone, Mail, ArrowRight, CheckCircle, XCircle, DollarSign, Zap, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MOCK_PATIENTS } from "@/lib/mock-patients"
import Link from "next/link"

export default function DashboardPage() {
  // Calculate real stats from MOCK_PATIENTS
  const today = new Date()
  const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
  const oneMonthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

  const weeklyVisits = MOCK_PATIENTS.filter(p =>
    p.visitHistory.lastVisit >= oneWeekAgo
  ).reduce((sum, p) => sum + p.visitHistory.totalVisits, 0)

  const monthlyRevenue = MOCK_PATIENTS.filter(p =>
    p.financial.lastPayment && p.financial.lastPayment >= oneMonthAgo
  ).reduce((sum, p) => sum + p.financial.totalSpent, 0)

  const unverifiedCount = MOCK_PATIENTS.filter(p => !p.contactVerifiedAt).length
  const noShowsThisWeek = MOCK_PATIENTS.filter(p =>
    p.visitHistory.noShows > 0
  ).slice(0, 5)

  // Today's appointments - simulated with upcoming patients
  const todayAppointments = [
    { id: "1", time: "08:30", patient: MOCK_PATIENTS[0], service: "Preventivka", status: "confirmed" },
    { id: "2", time: "09:30", patient: MOCK_PATIENTS[1], service: "Kontrola", status: "confirmed" },
    { id: "3", time: "11:00", patient: MOCK_PATIENTS[2], service: "Plomba", status: "pending" },
    { id: "4", time: "14:00", patient: MOCK_PATIENTS[6], service: "Hygiena", status: "confirmed" },
    { id: "5", time: "15:30", patient: MOCK_PATIENTS[8], service: "Bělení", status: "pending" },
  ]

  // Waitlist - patients without upcoming appointments
  const waitlistPatients = MOCK_PATIENTS
    .filter(p => p.visitHistory.upcomingAppointments === 0 && p.tags?.includes("Pravidelný"))
    .slice(0, 3)

  // Top procedures this month
  const topProcedures = [
    { name: "Preventivní prohlídka", count: 45, trend: "+12%" },
    { name: "Dentální hygiena", count: 32, trend: "+8%" },
    { name: "Plomby", count: 28, trend: "+15%" },
    { name: "Bělení zubů", count: 12, trend: "+20%" },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800 text-xs"><CheckCircle className="w-3 h-3 mr-1" />Potvrzeno</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 text-xs"><Clock className="w-3 h-3 mr-1" />Čeká</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800 text-xs">{status}</Badge>
    }
  }

  const urgentActions = 3 + unverifiedCount

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Centrální přehled ordinace</p>
      </div>

      {/* Top KPI Cards - 4 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/admin/calendar" className="block">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Dnes pacientů</CardTitle>
              <Users className="w-5 h-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{todayAppointments.length}</div>
              <p className="text-xs text-gray-500 mt-1">
                {todayAppointments.filter(a => a.status === "confirmed").length} potvrzeno • {todayAppointments.filter(a => a.status === "pending").length} čeká
              </p>
              <div className="flex items-center text-xs text-blue-600 mt-2">
                Zobrazit kalendář <ArrowRight className="w-3 h-3 ml-1" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/stats" className="block">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Týdenní návštěvy</CardTitle>
              <Activity className="w-5 h-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{weeklyVisits}</div>
              <p className="text-xs text-green-600 mt-1 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +15% oproti minulému týdnu
              </p>
              <div className="flex items-center text-xs text-green-600 mt-2">
                Zobrazit statistiky <ArrowRight className="w-3 h-3 ml-1" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/stats" className="block">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Měsíční tržby</CardTitle>
              <DollarSign className="w-5 h-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {Math.round(monthlyRevenue / 1000)}k Kč
              </div>
              <p className="text-xs text-purple-600 mt-1 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                Průměr {Math.round(monthlyRevenue / 30)} Kč/den
              </p>
              <div className="flex items-center text-xs text-purple-600 mt-2">
                Zobrazit finance <ArrowRight className="w-3 h-3 ml-1" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/patients" className="block">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-red-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Urgentní akce</CardTitle>
              <Zap className="w-5 h-5 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{urgentActions}</div>
              <p className="text-xs text-gray-500 mt-1">
                {unverifiedCount} neověřených • 3 čekající
              </p>
              <div className="flex items-center text-xs text-red-600 mt-2">
                Zobrazit úkoly <ArrowRight className="w-3 h-3 ml-1" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Three-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN - Today's Schedule */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Dnešní rozvrh</CardTitle>
                <Link href="/admin/calendar">
                  <Button variant="ghost" size="sm" className="text-xs">
                    Celý kalendář <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {todayAppointments.slice(0, 5).map((appointment) => (
                <div
                  key={appointment.id}
                  className="block p-3 border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all cursor-pointer"
                  onClick={() => window.location.href = `/admin/patients?id=${appointment.patient.id}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-blue-600 text-sm">{appointment.time}</span>
                        {getStatusBadge(appointment.status)}
                      </div>
                      <div className="font-medium text-gray-900 text-sm">
                        {appointment.patient.personalInfo.firstName} {appointment.patient.personalInfo.lastName}
                      </div>
                      <div className="text-xs text-gray-600">{appointment.service}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <a
                          href={`tel:${appointment.patient.personalInfo.phone}`}
                          className="text-xs text-gray-500 hover:text-blue-600 flex items-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Phone className="w-3 h-3 mr-1" />
                          {appointment.patient.personalInfo.phone}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {todayAppointments.length === 0 && (
                <div className="text-center py-8 text-gray-500 text-sm">
                  Žádné termíny na dnes
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* CENTER COLUMN - Stats & Graphs */}
        <div className="space-y-4">
          {/* Top Procedures */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Nejčastější zákroky (30 dní)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {topProcedures.map((procedure, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="font-medium text-sm text-gray-900">{procedure.name}</div>
                    <div className="text-xs text-gray-500">{procedure.count} zákroků</div>
                  </div>
                  <Badge className="bg-green-100 text-green-800 text-xs">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {procedure.trend}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Capacity Utilization */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Vytíženost ordinace</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Tento týden</span>
                    <span className="font-semibold text-green-600">85%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: "85%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Příští týden</span>
                    <span className="font-semibold text-yellow-600">62%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "62%" }}></div>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <div className="text-xs text-gray-500">
                    Volné sloty: <span className="font-semibold text-gray-900">12 termínů</span> příští týden
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN - Waitlist & Urgent */}
        <div className="space-y-4">
          {/* Waitlist */}
          <Link href="/admin/waitlist" className="block">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold">Čekatelé</CardTitle>
                  <Badge className="bg-orange-100 text-orange-800">
                    {waitlistPatients.length} čeká
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {waitlistPatients.map((patient) => {
                  const waitingDays = Math.floor(
                    (today.getTime() - patient.visitHistory.lastVisit.getTime()) / (1000 * 60 * 60 * 24)
                  )
                  return (
                    <div
                      key={patient.id}
                      className="p-3 border rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-all"
                    >
                      <div className="font-medium text-sm text-gray-900">
                        {patient.personalInfo.firstName} {patient.personalInfo.lastName}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        Poslední návštěva: {waitingDays} dní
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{patient.personalInfo.phone}</span>
                      </div>
                    </div>
                  )
                })}
                <div className="text-center pt-2">
                  <div className="text-xs text-orange-600 flex items-center justify-center">
                    Zobrazit všechny <ArrowRight className="w-3 h-3 ml-1" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Unverified Contacts */}
          <Link href="/admin/patients" className="block">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-red-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold">Neověřené kontakty</CardTitle>
                  <Badge className="bg-red-100 text-red-800">
                    {unverifiedCount}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600 mb-3">
                  {unverifiedCount} pacientů nemá ověřený kontakt
                </div>
                <div className="flex items-center text-xs text-red-600">
                  <UserCheck className="w-4 h-4 mr-1" />
                  Ověřit kontakty <ArrowRight className="w-3 h-3 ml-1" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* No-shows This Week */}
          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">No-shows (7 dní)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {noShowsThisWeek.slice(0, 3).map((patient) => (
                <Link
                  key={patient.id}
                  href={`/admin/patients?id=${patient.id}`}
                  className="block p-2 border rounded hover:bg-yellow-50 hover:border-yellow-300 transition-all"
                >
                  <div className="font-medium text-sm text-gray-900">
                    {patient.personalInfo.firstName} {patient.personalInfo.lastName}
                  </div>
                  <div className="text-xs text-gray-600">
                    {patient.visitHistory.noShows} nedostavení
                  </div>
                </Link>
              ))}
              {noShowsThisWeek.length === 0 && (
                <div className="text-center py-4 text-sm text-green-600">
                  <CheckCircle className="w-5 h-5 mx-auto mb-1" />
                  Žádné no-shows tento týden!
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Quick Links */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Rychlé odkazy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <Link href="/admin/calendar">
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Kalendář
              </Button>
            </Link>
            <Link href="/admin/patients">
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Users className="w-4 h-4 mr-2" />
                Pacienti
              </Button>
            </Link>
            <Link href="/admin/waitlist">
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Clock className="w-4 h-4 mr-2" />
                Čekatelé
              </Button>
            </Link>
            <Link href="/admin/stats">
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Activity className="w-4 h-4 mr-2" />
                Statistiky
              </Button>
            </Link>
            <Link href="/admin/settings">
              <Button variant="outline" className="w-full justify-start" size="sm">
                <AlertCircle className="w-4 h-4 mr-2" />
                Nastavení
              </Button>
            </Link>
            <Link href="/admin/users">
              <Button variant="outline" className="w-full justify-start" size="sm">
                <UserCheck className="w-4 h-4 mr-2" />
                Uživatelé
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
