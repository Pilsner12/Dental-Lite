"use client"

import { useState, useMemo } from "react"
import { useAppointments } from "@/lib/appointment-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, Filter, Search, RotateCcw, Clock, ArrowRight, ChevronLeft, ChevronRight, Users } from "lucide-react"
import { showToast } from "@/components/ui/toast"

type ViewMode = "day" | "week" | "all"
type FilterType = "all" | "create" | "update" | "delete" | "drag" | "resize"

export default function HistoriePage() {
  const { history, undoChange } = useAppointments()
  
  const [viewMode, setViewMode] = useState<ViewMode>("week")
  const [filterType, setFilterType] = useState<FilterType>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")

  // Filter and group history
  const filteredHistory = useMemo(() => {
    let filtered = history

    // Filter by type
    if (filterType !== "all") {
      filtered = filtered.filter((entry) => entry.action === filterType)
    }

    // Filter by search (patient name)
    if (searchQuery) {
      filtered = filtered.filter((entry) =>
        entry.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by date range
    if (dateFrom) {
      const fromDate = new Date(dateFrom)
      fromDate.setHours(0, 0, 0, 0)
      filtered = filtered.filter((entry) => new Date(entry.timestamp) >= fromDate)
    }
    if (dateTo) {
      const toDate = new Date(dateTo)
      toDate.setHours(23, 59, 59, 999)
      filtered = filtered.filter((entry) => new Date(entry.timestamp) <= toDate)
    }

    return filtered
  }, [history, filterType, searchQuery, dateFrom, dateTo])

  // Group by date
  const groupedByDate = useMemo(() => {
    const groups = new Map<string, typeof filteredHistory>()
    
    filteredHistory.forEach((entry) => {
      const date = new Date(entry.timestamp).toLocaleDateString("cs-CZ", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      })
      
      if (!groups.has(date)) {
        groups.set(date, [])
      }
      groups.get(date)!.push(entry)
    })

    return Array.from(groups.entries()).sort((a, b) => {
      const dateA = new Date(a[1][0].timestamp)
      const dateB = new Date(b[1][0].timestamp)
      return dateB.getTime() - dateA.getTime()
    })
  }, [filteredHistory])

  // Quick date filters
  const setToday = () => {
    const today = new Date()
    setSelectedDate(today)
    const todayStr = today.toISOString().split("T")[0]
    setDateFrom(todayStr)
    setDateTo(todayStr)
  }

  const setPreviousDay = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() - 1)
    setSelectedDate(newDate)
    const dateStr = newDate.toISOString().split("T")[0]
    setDateFrom(dateStr)
    setDateTo(dateStr)
  }

  const setNextDay = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + 1)
    setSelectedDate(newDate)
    const dateStr = newDate.toISOString().split("T")[0]
    setDateFrom(dateStr)
    setDateTo(dateStr)
  }

  const setThisWeek = () => {
    const today = new Date()
    setSelectedDate(today)
    const monday = new Date(today)
    monday.setDate(today.getDate() - today.getDay() + 1)
    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6)
    
    setDateFrom(monday.toISOString().split("T")[0])
    setDateTo(sunday.toISOString().split("T")[0])
  }

  const setThisMonth = () => {
    const today = new Date()
    setSelectedDate(today)
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    
    setDateFrom(firstDay.toISOString().split("T")[0])
    setDateTo(lastDay.toISOString().split("T")[0])
  }

  const clearFilters = () => {
    setFilterType("all")
    setSearchQuery("")
    setSelectedDate(new Date())
    setDateFrom("")
    setDateTo("")
  }

  const handleUndo = (historyId: string, description: string) => {
    undoChange(historyId)
    showToast(`Obnoveno: ${description}`)
  }

  const actionConfig = {
    create: { label: "Vytvořeno", color: "text-green-700 bg-green-50" },
    update: { label: "Upraveno", color: "text-blue-700 bg-blue-50" },
    delete: { label: "Smazáno", color: "text-red-700 bg-red-50" },
    drag: { label: "Přesunuto", color: "text-purple-700 bg-purple-50" },
    resize: { label: "Změna délky", color: "text-orange-700 bg-orange-50" },
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-gray-900">Historie změn</h1>
          <div className="text-sm text-gray-500">
            Celkem: {filteredHistory.length} {filteredHistory.length === 1 ? "změna" : filteredHistory.length < 5 ? "změny" : "změn"}
          </div>
        </div>

        {/* Filters */}
        <div className="space-y-3">
          {/* Quick date filters with day navigation */}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            
            {/* Day navigation */}
            <div className="flex items-center gap-1 border border-gray-200 rounded-md bg-white">
              <Button 
                onClick={setPreviousDay} 
                variant="ghost" 
                size="sm" 
                className="h-7 px-2"
                title="Předchozí den"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="px-2 text-xs font-medium text-gray-700 min-w-[100px] text-center">
                {selectedDate.toLocaleDateString("cs-CZ", { 
                  day: "numeric", 
                  month: "numeric",
                  year: "numeric" 
                })}
              </div>
              <Button 
                onClick={setNextDay} 
                variant="ghost" 
                size="sm" 
                className="h-7 px-2"
                title="Následující den"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <Button onClick={setToday} variant="outline" size="sm" className="text-xs">
              Dnes
            </Button>
            <Button onClick={setThisWeek} variant="outline" size="sm" className="text-xs">
              Tento týden
            </Button>
            <Button onClick={setThisMonth} variant="outline" size="sm" className="text-xs">
              Tento měsíc
            </Button>
            {(dateFrom || dateTo || filterType !== "all" || searchQuery) && (
              <Button onClick={clearFilters} variant="ghost" size="sm" className="text-xs text-gray-500">
                Zrušit filtry
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Type filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as FilterType)}
                className="flex-1 text-sm border border-gray-200 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-gray-900"
                aria-label="Filtr typu změny"
              >
                <option value="all">Všechny typy</option>
                <option value="create">Vytvořeno</option>
                <option value="drag">Přesunuto</option>
                <option value="resize">Změna délky</option>
                <option value="update">Upraveno</option>
                <option value="delete">Smazáno</option>
              </select>
            </div>

            {/* Search */}
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Hledat pacienta..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-sm h-8"
              />
            </div>

            {/* Date from */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Od:</span>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="text-sm h-8"
              />
            </div>

            {/* Date to */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Do:</span>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="text-sm h-8"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {filteredHistory.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">
              <Clock className="h-12 w-12 mx-auto" />
            </div>
            <p className="text-gray-500">Žádné změny nenalezeny</p>
            {(filterType !== "all" || searchQuery || dateFrom || dateTo) && (
              <Button onClick={clearFilters} variant="link" size="sm" className="mt-2">
                Zrušit filtry
              </Button>
            )}
          </div>
        ) : (
          <div className="max-w-5xl mx-auto space-y-4">
            {groupedByDate.map(([date, entries]) => (
              <div key={date}>
                {/* Date header */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <h2 className="font-semibold text-gray-900">{date}</h2>
                  </div>
                  <span className="text-sm text-gray-500">
                    {entries.length} {entries.length === 1 ? "změna" : entries.length < 5 ? "změny" : "změn"}
                  </span>
                </div>

                {/* Entries */}
                <div className="space-y-3">
                  {entries.map((entry) => {
                    const config = actionConfig[entry.action]
                    const actionTimestamp = new Date(entry.timestamp).toLocaleString("cs-CZ", {
                      day: "numeric",
                      month: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })

                    return (
                      <div
                        key={entry.id}
                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            {/* Card header: Timestamp | Action type | User */}
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <span className="flex items-center gap-1 text-sm font-semibold text-gray-700">
                                  <Clock className="h-4 w-4" />
                                  {actionTimestamp}
                                </span>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${config.color}`}>
                                  {config.label}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 text-xs">
                                {entry.userName && (
                                  <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded">
                                    <Users className="h-3 w-3" />
                                    {entry.userName}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Complete event details in single bubble */}
                            {entry.oldData && entry.newData && (
                              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                <div className="grid grid-cols-4 gap-4">
                                  {/* Patient */}
                                  <div>
                                    <div className="text-xs font-medium text-gray-500 uppercase mb-2">Pacient</div>
                                    <div className="font-bold text-gray-900">{entry.oldData.patientName}</div>
                                  </div>

                                  {/* Date */}
                                  <div>
                                    <div className="text-xs font-medium text-gray-500 uppercase mb-2">Datum</div>
                                    {new Date(entry.oldData.date || "").toDateString() !== new Date(entry.newData.date || entry.oldData.date || "").toDateString() ? (
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm text-red-600 line-through">{new Date(entry.oldData.date || "").toLocaleDateString("cs-CZ")}</span>
                                        <ArrowRight className="h-3 w-3 text-gray-400" />
                                        <span className="text-sm text-green-600 font-semibold">{new Date(entry.newData.date || "").toLocaleDateString("cs-CZ")}</span>
                                      </div>
                                    ) : (
                                      <div className="text-gray-900">{new Date(entry.oldData.date || "").toLocaleDateString("cs-CZ")}</div>
                                    )}
                                  </div>

                                  {/* Time */}
                                  <div>
                                    <div className="text-xs font-medium text-gray-500 uppercase mb-2">Čas</div>
                                    {entry.oldData.time !== entry.newData.time ? (
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm text-red-600 line-through">{entry.oldData.time}</span>
                                        <ArrowRight className="h-3 w-3 text-gray-400" />
                                        <span className="text-sm text-green-600 font-semibold">{entry.newData.time}</span>
                                      </div>
                                    ) : (
                                      <div className="text-gray-900">{entry.oldData.time}</div>
                                    )}
                                  </div>

                                  {/* Duration */}
                                  <div>
                                    <div className="text-xs font-medium text-gray-500 uppercase mb-2">Délka</div>
                                    {entry.oldData.duration !== entry.newData.duration ? (
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm text-red-600 line-through">{entry.oldData.duration} min</span>
                                        <ArrowRight className="h-3 w-3 text-gray-400" />
                                        <span className="text-sm text-green-600 font-semibold">{entry.newData.duration} min</span>
                                      </div>
                                    ) : (
                                      <div className="text-gray-900">{entry.oldData.duration} min</div>
                                    )}
                                  </div>
                                </div>

                                {/* Service */}
                                <div className="mt-3 pt-3 border-t border-gray-200">
                                  <div className="text-xs font-medium text-gray-500 uppercase mb-2">Služba</div>
                                  <div className="text-gray-900">{entry.oldData.service || '-'}</div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Undo button */}
                          {entry.oldData && (
                            <Button
                              onClick={() => handleUndo(entry.id, entry.description)}
                              variant="outline"
                              size="sm"
                              className="shrink-0"
                            >
                              <RotateCcw className="h-3.5 w-3.5 mr-1" />
                              Obnovit
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
