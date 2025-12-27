import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, TrendingDown, Activity, Calendar, Clock, CheckCircle, Edit, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const todayAppointments = [
    { time: "08:30", patient: "Tomáš Veselý", service: "Preventivka", status: "confirmed" },
    { time: "09:30", patient: "Barbora Horáková", service: "Plomba", status: "scheduled" },
    { time: "11:00", patient: "Jakub Kučera", service: "Extrakce", status: "scheduled" },
    { time: "14:00", patient: "Tereza Němcová", service: "Hygiena", status: "scheduled" },
    { time: "15:00", patient: "David Šmíd", service: "Kontrola", status: "scheduled" },
  ]

  const recentActivity = [
    { time: "08:00", text: "Automatické SMS připomínky odeslány (8 pacientů)" },
    { time: "09:15", text: 'Jana Svobodová označena "Dorazila"' },
    { time: "10:30", text: "Petr Novák - termín upraven" },
    { time: "11:45", text: "Nová SMS připomínka: Eva Dvořáková" },
    { time: "14:20", text: "Ceník aktualizován (Bělení: 3500→3800 Kč)" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dobrý den, MUDr. Nováková</h1>
        <p className="text-gray-600 mt-1">Přehled dnešního dne</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pacienti tento měsíc</CardTitle>
            <Users className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">186</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Nedorazy</CardTitle>
            <TrendingDown className="w-4 h-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">14</div>
            <p className="text-xs text-gray-500 mt-1">7.5%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Nejčastější výkon</CardTitle>
            <Activity className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">Preventivka</div>
            <p className="text-xs text-gray-500 mt-1">89 výkonů</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Nejvytíženější den</CardTitle>
            <Calendar className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">Úterý</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Poslední aktivita
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex gap-3 text-sm">
                  <div className="text-gray-500 font-medium min-w-[50px]">{activity.time}</div>
                  <div className="text-gray-700">{activity.text}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Today's Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Dnešní objednávky
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todayAppointments.map((apt, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">{apt.time}</span>
                      <span className="text-gray-700">{apt.patient}</span>
                    </div>
                    <div className="text-sm text-gray-600">{apt.service}</div>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Edit className="w-4 h-4 text-blue-600" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Phone className="w-4 h-4 text-gray-600" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
