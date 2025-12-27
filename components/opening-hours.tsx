import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock } from "lucide-react"

const hours = [
  { day: "Pondělí", time: "8:00 - 16:00" },
  { day: "Úterý", time: "8:00 - 16:00" },
  { day: "Středa", time: "8:00 - 16:00" },
  { day: "Čtvrtek", time: "8:00 - 16:00" },
  { day: "Pátek", time: "8:00 - 16:00" },
  { day: "Oběd", time: "12:00 - 13:00", isBreak: true },
  { day: "Sobota", time: "Zavřeno", isClosed: true },
  { day: "Neděle", time: "Zavřeno", isClosed: true },
]

export function OpeningHours() {
  return (
    <section className="py-16 md:py-24 bg-[#f8fafc]">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-full bg-[#2563eb]/10 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-[#2563eb]" />
              </div>
              <CardTitle className="text-3xl text-gray-900">Ordinační hodiny</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {hours.map((item, index) => (
                  <div
                    key={index}
                    className={`flex justify-between items-center py-3 px-4 rounded-lg ${
                      item.isBreak
                        ? "bg-amber-50 border border-amber-200"
                        : item.isClosed
                          ? "bg-gray-50"
                          : "bg-white border border-gray-200"
                    }`}
                  >
                    <span className={`font-medium ${item.isClosed ? "text-gray-500" : "text-gray-900"}`}>
                      {item.day}
                    </span>
                    <span
                      className={`font-semibold ${
                        item.isBreak ? "text-amber-700" : item.isClosed ? "text-gray-500" : "text-[#059669]"
                      }`}
                    >
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
