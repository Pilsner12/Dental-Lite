"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useInventory } from "@/lib/inventory-context"
import { Clock, Users, ArrowRight, Undo2, Package, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function InventoryHistoryPage() {
  const { history, undoAction } = useInventory()
  const router = useRouter()
  const [filter, setFilter] = useState<"all" | "create" | "update" | "delete">("all")

  const filteredHistory = history.filter((entry) => {
    if (filter === "all") return true
    return entry.action === filter
  })

  const handleUndo = async (historyId: number) => {
    const success = undoAction(historyId)
    if (success) {
      alert("Změna byla úspěšně vrácena zpět.")
    } else {
      alert("Nepodařilo se vrátit akci zpět.")
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("cs-CZ", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    })
  }

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("cs-CZ", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    })
  }

  const getActionLabel = (action: string) => {
    switch (action) {
      case "create": return "Přidání"
      case "update": return "Úprava"
      case "delete": return "Smazání"
      case "restock": return "Doskladnění"
      default: return action
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case "create": return "bg-green-100 text-green-800"
      case "update": return "bg-blue-100 text-blue-800"
      case "delete": return "bg-red-100 text-red-800"
      case "restock": return "bg-purple-100 text-purple-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const renderChanges = (entry: typeof history[0]) => {
    const { oldValues, newValues, action } = entry

    if (action === "create" && newValues) {
      return (
        <div className="grid grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Název:</span>
            <div className="font-medium text-green-700">{newValues.name}</div>
          </div>
          <div>
            <span className="text-gray-500">Kategorie:</span>
            <div className="font-medium text-green-700">{newValues.category}</div>
          </div>
          <div>
            <span className="text-gray-500">Aktuální stav:</span>
            <div className="font-medium text-green-700">{newValues.currentStock} {newValues.unit}</div>
          </div>
          <div>
            <span className="text-gray-500">Min. stav:</span>
            <div className="font-medium text-green-700">{newValues.minStock} {newValues.unit}</div>
          </div>
        </div>
      )
    }

    if (action === "delete" && oldValues) {
      return (
        <div className="grid grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Název:</span>
            <div className="font-medium text-red-700 line-through">{oldValues.name}</div>
          </div>
          <div>
            <span className="text-gray-500">Kategorie:</span>
            <div className="font-medium text-red-700 line-through">{oldValues.category}</div>
          </div>
          <div>
            <span className="text-gray-500">Aktuální stav:</span>
            <div className="font-medium text-red-700 line-through">{oldValues.currentStock} {oldValues.unit}</div>
          </div>
          <div>
            <span className="text-gray-500">Min. stav:</span>
            <div className="font-medium text-red-700 line-through">{oldValues.minStock} {oldValues.unit}</div>
          </div>
        </div>
      )
    }

    if (action === "update" && oldValues && newValues) {
      const fields = [
        { key: "name", label: "Název" },
        { key: "category", label: "Kategorie" },
        { key: "currentStock", label: "Aktuální stav" },
        { key: "minStock", label: "Min. stav" },
        { key: "pricePerUnit", label: "Cena" },
        { key: "supplier", label: "Dodavatel" }
      ]

      return (
        <div className="grid grid-cols-4 gap-4 text-sm">
          {fields.map((field) => {
            const oldVal = (oldValues as any)[field.key]
            const newVal = (newValues as any)[field.key]
            
            if (oldVal === newVal || (oldVal === undefined && newVal === undefined)) {
              return null
            }

            return (
              <div key={field.key}>
                <span className="text-gray-500">{field.label}:</span>
                <div className="flex items-center gap-2">
                  <span className="text-red-700 line-through">{oldVal || "-"}</span>
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                  <span className="text-green-700 font-medium">{newVal || "-"}</span>
                </div>
              </div>
            )
          })}
        </div>
      )
    }

    return null
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="border-b pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Historie skladu</h1>
          <p className="text-gray-600 mt-1">
            Přehled všech změn v inventáři
          </p>
        </div>
        <Button
          onClick={() => router.push("/admin/sklad")}
          variant="outline"
        >
          Zpět na sklad
        </Button>
      </div>

      {/* Filtry */}
      <div className="flex items-center gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
          className={filter === "all" ? "bg-gray-900 hover:bg-gray-800" : ""}
        >
          Vše ({history.length})
        </Button>
        <Button
          variant={filter === "create" ? "default" : "outline"}
          onClick={() => setFilter("create")}
          className={filter === "create" ? "bg-gray-900 hover:bg-gray-800" : ""}
        >
          Přidání ({history.filter((h) => h.action === "create").length})
        </Button>
        <Button
          variant={filter === "update" ? "default" : "outline"}
          onClick={() => setFilter("update")}
          className={filter === "update" ? "bg-gray-900 hover:bg-gray-800" : ""}
        >
          Úpravy ({history.filter((h) => h.action === "update").length})
        </Button>
        <Button
          variant={filter === "delete" ? "default" : "outline"}
          onClick={() => setFilter("delete")}
          className={filter === "delete" ? "bg-gray-900 hover:bg-gray-800" : ""}
        >
          Smazání ({history.filter((h) => h.action === "delete").length})
        </Button>
      </div>

      {/* Historie */}
      <div className="space-y-3">
        {filteredHistory.length === 0 ? (
          <Card className="border border-gray-100">
            <CardContent className="p-12 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Žádná historie změn</p>
            </CardContent>
          </Card>
        ) : (
          filteredHistory.map((entry) => (
            <Card
              key={entry.id}
              className="border border-gray-200 hover:shadow-md transition-shadow"
            >
              <CardContent className="p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="font-medium text-gray-900">
                      {formatDate(entry.timestamp)} {formatTime(entry.timestamp)}
                    </span>
                    <Badge className={getActionColor(entry.action)}>
                      {getActionLabel(entry.action)}
                    </Badge>
                    <Users className="h-4 w-4 text-gray-500 ml-2" />
                    <Badge variant="outline" className="text-xs">
                      {entry.userName || "Administrátor"}
                    </Badge>
                  </div>
                  {entry.action !== "delete" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUndo(entry.id)}
                      className="gap-2"
                    >
                      <Undo2 className="h-3.5 w-3.5" />
                      Vrátit zpět
                    </Button>
                  )}
                </div>

                {/* Popis */}
                <div className="mb-3 text-sm text-gray-600">
                  <Package className="h-3.5 w-3.5 inline mr-1" />
                  {entry.description}
                </div>

                {/* Změny */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  {renderChanges(entry)}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
