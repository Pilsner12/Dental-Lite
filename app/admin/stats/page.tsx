import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, TrendingDown, Activity, Calendar, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function StatsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Statistiky</h1>
          <p className="text-gray-600 mt-1">Přehled výkonnosti ordinace</p>
        </div>
        <Button variant="outline" className="bg-transparent">
          <Download className="w-4 h-4 mr-2" />
          Exportovat data (CSV)
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pacienti tento měsíc</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">186</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Nedorazy</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">14</div>
            <p className="text-xs text-gray-500 mt-1">7.5%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Nejčastější výkon</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">Preventivka</div>
            <p className="text-xs text-gray-500 mt-1">89 výkonů</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Nejvytíženější den</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">Úterý</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly Visits Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Návštěvnost tento měsíc</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-end justify-between h-48 gap-2">
                {[
                  8, 12, 10, 15, 9, 14, 11, 13, 7, 12, 16, 14, 10, 13, 15, 12, 9, 11, 14, 13, 8, 10, 12, 15, 11, 0, 0,
                  14, 13, 16, 12,
                ].map((value, index) => {
                  const height = (value / 16) * 100
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center justify-end">
                      <div
                        className={`w-full rounded-t ${value === 0 ? "bg-gray-200" : "bg-blue-600"} transition-all hover:bg-blue-700`}
                        style={{ height: `${height}%` }}
                        title={`Den ${index + 1}: ${value} pacientů`}
                      />
                    </div>
                  )
                })}
              </div>
              <div className="text-xs text-gray-500 text-center">Dny v měsíci (1-31)</div>
            </div>
          </CardContent>
        </Card>

        {/* Service Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Nejčastější výkony</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Preventivka", count: 89, color: "bg-blue-600" },
                { name: "Plomba", count: 42, color: "bg-green-600" },
                { name: "Hygiena", count: 31, color: "bg-yellow-600" },
                { name: "Bělení", count: 18, color: "bg-purple-600" },
                { name: "Kořen", count: 12, color: "bg-pink-600" },
                { name: "Extrakce", count: 8, color: "bg-red-600" },
              ].map((service, index) => {
                const total = 200
                const percentage = Math.round((service.count / total) * 100)
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${service.color}`} />
                        <span className="font-medium">{service.name}</span>
                      </div>
                      <span className="text-gray-600">{service.count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className={`${service.color} h-2 rounded-full`} style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* No-show Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Nedorazy (trend)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="h-48 flex items-end justify-between gap-4">
                {[
                  { month: "Čer", percentage: 8.2 },
                  { month: "Čvc", percentage: 7.8 },
                  { month: "Srp", percentage: 9.1 },
                  { month: "Zář", percentage: 8.5 },
                  { month: "Říj", percentage: 7.2 },
                  { month: "Lis", percentage: 7.5 },
                ].map((data, index) => {
                  const height = (data.percentage / 10) * 100
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                      <div className="text-xs font-medium text-gray-900">{data.percentage}%</div>
                      <div
                        className="w-full bg-red-600 rounded-t transition-all hover:bg-red-700"
                        style={{ height: `${height}%` }}
                      />
                      <div className="text-xs text-gray-600">{data.month}</div>
                    </div>
                  )
                })}
              </div>
              <div className="text-xs text-gray-500 text-center">Posledních 6 měsíců</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
