"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { InventoryItem } from "@/lib/inventory-context"

interface InventoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item?: InventoryItem | null
  onSave: (data: Omit<InventoryItem, "id" | "createdAt" | "updatedAt">) => void
  mode: "create" | "edit"
}

export function InventoryDialog({ open, onOpenChange, item, onSave, mode }: InventoryDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    category: "material" as InventoryItem["category"],
    currentStock: 0,
    minStock: 0,
    unit: "",
    pricePerUnit: 0,
    supplier: "",
    expiryDate: "",
    notes: ""
  })

  useEffect(() => {
    if (item && mode === "edit") {
      setFormData({
        name: item.name,
        category: item.category,
        currentStock: item.currentStock,
        minStock: item.minStock,
        unit: item.unit,
        pricePerUnit: item.pricePerUnit || 0,
        supplier: item.supplier || "",
        expiryDate: item.expiryDate ? new Date(item.expiryDate).toISOString().split('T')[0] : "",
        notes: item.notes || ""
      })
    } else {
      setFormData({
        name: "",
        category: "material",
        currentStock: 0,
        minStock: 0,
        unit: "",
        pricePerUnit: 0,
        supplier: "",
        expiryDate: "",
        notes: ""
      })
    }
  }, [item, mode, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const data: Omit<InventoryItem, "id" | "createdAt" | "updatedAt"> = {
      name: formData.name,
      category: formData.category,
      currentStock: Number(formData.currentStock),
      minStock: Number(formData.minStock),
      unit: formData.unit,
      pricePerUnit: formData.pricePerUnit ? Number(formData.pricePerUnit) : undefined,
      supplier: formData.supplier || undefined,
      expiryDate: formData.expiryDate ? new Date(formData.expiryDate) : undefined,
      notes: formData.notes || undefined,
      lastRestocked: new Date()
    }

    onSave(data)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Přidat novou položku" : "Upravit položku"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Název */}
            <div className="col-span-2">
              <Label htmlFor="name">Název *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="Např. Kompozit Filtek Supreme"
              />
            </div>

            {/* Kategorie */}
            <div>
              <Label htmlFor="category">Kategorie *</Label>
              <select
                id="category"
                title="Kategorie položky"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as InventoryItem["category"] })}
                className="w-full h-10 rounded-md border border-gray-300 px-3 text-sm"
                required
              >
                <option value="material">Materiál</option>
                <option value="medication">Léky</option>
                <option value="tool">Nástroj</option>
                <option value="disposable">Spotřební</option>
              </select>
            </div>

            {/* Jednotka */}
            <div>
              <Label htmlFor="unit">Jednotka *</Label>
              <Input
                id="unit"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                required
                placeholder="ks, balení, litry..."
              />
            </div>

            {/* Aktuální stav */}
            <div>
              <Label htmlFor="currentStock">Aktuální stav *</Label>
              <Input
                id="currentStock"
                type="number"
                min="0"
                value={formData.currentStock}
                onChange={(e) => setFormData({ ...formData, currentStock: Number(e.target.value) })}
                required
              />
            </div>

            {/* Minimální stav */}
            <div>
              <Label htmlFor="minStock">Minimální stav *</Label>
              <Input
                id="minStock"
                type="number"
                min="0"
                value={formData.minStock}
                onChange={(e) => setFormData({ ...formData, minStock: Number(e.target.value) })}
                required
              />
            </div>

            {/* Cena */}
            <div>
              <Label htmlFor="pricePerUnit">Cena za jednotku (Kč)</Label>
              <Input
                id="pricePerUnit"
                type="number"
                min="0"
                step="0.01"
                value={formData.pricePerUnit}
                onChange={(e) => setFormData({ ...formData, pricePerUnit: Number(e.target.value) })}
                placeholder="0.00"
              />
            </div>

            {/* Dodavatel */}
            <div>
              <Label htmlFor="supplier">Dodavatel</Label>
              <Input
                id="supplier"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                placeholder="Např. 3M ESPE"
              />
            </div>

            {/* Expirace */}
            <div>
              <Label htmlFor="expiryDate">Datum expirace</Label>
              <Input
                id="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              />
            </div>

            {/* Poznámka */}
            <div className="col-span-2">
              <Label htmlFor="notes">Poznámka</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Volitelná poznámka..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Zrušit
            </Button>
            <Button type="submit" className="bg-gray-900 hover:bg-gray-800">
              {mode === "create" ? "Přidat" : "Uložit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
