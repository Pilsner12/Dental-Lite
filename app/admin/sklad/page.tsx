"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, AlertCircle, ShoppingCart, Plus, Edit, Trash2, History } from "lucide-react"
import { useInventory, InventoryItem } from "@/lib/inventory-context"
import { useState } from "react"
import { InventoryDialog } from "@/components/admin/inventory-dialog"
import { useRouter } from "next/navigation"

export default function SkladPage() {
  const { items, addItem, updateItem, deleteItem } = useInventory()
  const [filter, setFilter] = useState<"all" | "low" | "critical">("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create")
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const router = useRouter()

  const getStockStatus = (item: typeof items[0]) => {
    const percentLeft = (item.currentStock / item.minStock) * 100
    if (percentLeft < 50) return "critical"
    if (percentLeft < 100) return "low"
    return "ok"
  }

  const filteredItems = items.filter((item) => {
    if (filter === "all") return true
    const status = getStockStatus(item)
    if (filter === "low") return status === "low" || status === "critical"
    if (filter === "critical") return status === "critical"
    return true
  })

  const handleCreate = () => {
    setDialogMode("create")
    setSelectedItem(null)
    setDialogOpen(true)
  }

  const handleEdit = (item: InventoryItem) => {
    setDialogMode("edit")
    setSelectedItem(item)
    setDialogOpen(true)
  }

  const handleDelete = (item: InventoryItem) => {
    if (confirm(`Opravdu chcete smazat položku "${item.name}"?`)) {
      deleteItem(item.id)
    }
  }

  const handleSave = (data: Omit<InventoryItem, "id" | "createdAt" | "updatedAt">) => {
    if (dialogMode === "create") {
      addItem(data)
    } else if (dialogMode === "edit" && selectedItem) {
      updateItem(selectedItem.id, data)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="border-b pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sklad</h1>
          <p className="text-gray-600 mt-1">
            Přehled materiálu a upozornění na nízké stavy
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Sklad slouží jako upozorňovací nástroj - sleduje pouze minimální stavy, ne účetnictví.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => router.push("/admin/sklad/historie")}
            variant="outline"
            className="gap-2"
          >
            <History className="h-4 w-4" />
            Historie
          </Button>
          <Button
            onClick={handleCreate}
            className="bg-gray-900 hover:bg-gray-800 gap-2"
          >
            <Plus className="h-4 w-4" />
            Přidat položku
          </Button>
        </div>
      </div>

      {/* Filtry */}
      <div className="flex items-center gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
          className={filter === "all" ? "bg-gray-900 hover:bg-gray-800" : ""}
        >
          Vše ({items.length})
        </Button>
        <Button
          variant={filter === "low" ? "default" : "outline"}
          onClick={() => setFilter("low")}
          className={filter === "low" ? "bg-gray-900 hover:bg-gray-800" : ""}
        >
          Nízký stav ({items.filter((i) => getStockStatus(i) === "low" || getStockStatus(i) === "critical").length})
        </Button>
        <Button
          variant={filter === "critical" ? "default" : "outline"}
          onClick={() => setFilter("critical")}
          className={filter === "critical" ? "bg-gray-900 hover:bg-gray-800" : ""}
        >
          Kritický ({items.filter((i) => getStockStatus(i) === "critical").length})
        </Button>
      </div>

      {/* Tabulka */}
      <Card className="border border-gray-100 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Materiál</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Stav
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Název
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Kategorie
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Aktuální stav
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Minimum
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Poznámka
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Akce
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-400">
                      Žádné položky
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => {
                    const status = getStockStatus(item)
                    const categoryLabel = {
                      material: "Materiál",
                      tool: "Nástroj",
                      medication: "Léky",
                      disposable: "Spotřební",
                    }[item.category]

                    return (
                      <tr
                        key={item.id}
                        className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                          status === "critical" ? "bg-red-50/30" : status === "low" ? "bg-yellow-50/30" : ""
                        }`}
                      >
                        <td className="py-3 px-4">
                          {status === "critical" ? (
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-red-500"></div>
                              <span className="text-xs font-medium text-red-700">Kritický</span>
                            </div>
                          ) : status === "low" ? (
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                              <span className="text-xs font-medium text-yellow-700">Nízký</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-green-500"></div>
                              <span className="text-xs font-medium text-green-700">OK</span>
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-900">{item.name}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-600">{categoryLabel}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`text-sm font-medium ${
                              status === "critical" ? "text-red-700" : status === "low" ? "text-yellow-700" : "text-gray-900"
                            }`}
                          >
                            {item.currentStock} {item.unit}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-500">
                            {item.minStock} {item.unit}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-xs text-gray-500">{item.notes || "-"}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(item)}
                              className="h-8"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(item)}
                              className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog */}
      <InventoryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        item={selectedItem}
        onSave={handleSave}
        mode={dialogMode}
      />
    </div>
  )
}
