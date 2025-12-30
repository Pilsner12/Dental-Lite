"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export interface InventoryItem {
  id: string
  name: string
  category: "material" | "tool" | "medication" | "disposable"
  currentStock: number
  minStock: number
  unit: string
  pricePerUnit?: number
  supplier?: string
  lastRestocked?: Date
  expiryDate?: Date
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface InventoryHistoryEntry {
  id: number
  timestamp: Date
  action: "create" | "update" | "delete" | "restock"
  itemId: string
  itemName: string
  oldValues?: Partial<InventoryItem>
  newValues?: Partial<InventoryItem>
  userName?: string
  userRole?: string
  description: string
}

interface InventoryContextType {
  items: InventoryItem[]
  history: InventoryHistoryEntry[]
  addItem: (item: Omit<InventoryItem, "id" | "createdAt" | "updatedAt">) => void
  updateItem: (id: string, updates: Partial<InventoryItem>) => void
  deleteItem: (id: string) => void
  getLowStockItems: () => InventoryItem[]
  getItemsByCategory: (category: InventoryItem["category"]) => InventoryItem[]
  addToHistory: (
    action: InventoryHistoryEntry["action"],
    itemId: string,
    itemName: string,
    oldValues: Partial<InventoryItem> | undefined,
    newValues: Partial<InventoryItem> | undefined,
    description: string,
    userName?: string,
    userRole?: string
  ) => void
  undoAction: (historyId: number) => boolean
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined)

// Mock inventory items
const MOCK_INVENTORY: InventoryItem[] = [
  // MEDIKACE
  {
    id: "inv-1",
    name: "Anestézie Ubistesin Forte",
    category: "medication",
    currentStock: 8,
    minStock: 15,
    unit: "ampulky",
    pricePerUnit: 48,
    supplier: "3M ESPE",
    lastRestocked: new Date("2024-12-15"),
    expiryDate: new Date("2025-08-30"),
    notes: "Objednat 20 ampulek",
    createdAt: new Date("2023-01-10"),
    updatedAt: new Date("2024-12-20")
  },
  {
    id: "inv-2",
    name: "Anestézie Septanest",
    category: "medication",
    currentStock: 12,
    minStock: 10,
    unit: "ampulky",
    pricePerUnit: 42,
    supplier: "Septodont",
    lastRestocked: new Date("2024-12-20"),
    expiryDate: new Date("2025-09-15"),
    createdAt: new Date("2023-01-10"),
    updatedAt: new Date("2024-12-20")
  },
  {
    id: "inv-3",
    name: "Desinfekce Gigasept FF",
    category: "medication",
    currentStock: 3,
    minStock: 5,
    unit: "litry",
    pricePerUnit: 890,
    supplier: "Schülke",
    lastRestocked: new Date("2024-11-25"),
    expiryDate: new Date("2026-11-25"),
    notes: "Dezinfekce nástrojů",
    createdAt: new Date("2023-01-10"),
    updatedAt: new Date("2024-11-25")
  },
  {
    id: "inv-4",
    name: "Chlorhexidin 0.2%",
    category: "medication",
    currentStock: 6,
    minStock: 8,
    unit: "lahve",
    pricePerUnit: 120,
    supplier: "GlaxoSmithKline",
    lastRestocked: new Date("2024-12-10"),
    expiryDate: new Date("2026-06-30"),
    notes: "Ústní voda po zákrocích",
    createdAt: new Date("2023-01-10"),
    updatedAt: new Date("2024-12-10")
  },
  
  // VÝPLŇOVÉ MATERIÁLY
  {
    id: "inv-5",
    name: "Kompozit Filtek Supreme Ultra A2",
    category: "material",
    currentStock: 3,
    minStock: 5,
    unit: "stříkačky",
    pricePerUnit: 950,
    supplier: "3M ESPE",
    lastRestocked: new Date("2024-11-20"),
    expiryDate: new Date("2026-11-20"),
    notes: "Nejpoužívanější odstín",
    createdAt: new Date("2023-01-10"),
    updatedAt: new Date("2024-11-20")
  },
  {
    id: "inv-6",
    name: "Kompozit Filtek Supreme Ultra A3",
    category: "material",
    currentStock: 2,
    minStock: 4,
    unit: "stříkačky",
    pricePerUnit: 950,
    supplier: "3M ESPE",
    lastRestocked: new Date("2024-11-20"),
    expiryDate: new Date("2026-11-20"),
    createdAt: new Date("2023-01-10"),
    updatedAt: new Date("2024-11-20")
  },
  {
    id: "inv-7",
    name: "Skloionomerní cement Fuji IX",
    category: "material",
    currentStock: 1,
    minStock: 3,
    unit: "balení",
    pricePerUnit: 1450,
    supplier: "GC Corporation",
    lastRestocked: new Date("2024-10-15"),
    expiryDate: new Date("2025-10-15"),
    notes: "Urgentně objednat",
    createdAt: new Date("2023-01-10"),
    updatedAt: new Date("2024-10-15")
  },
  {
    id: "inv-8",
    name: "Dočasná výplň Coltosol",
    category: "material",
    currentStock: 2,
    minStock: 3,
    unit: "balení",
    pricePerUnit: 680,
    supplier: "Coltène",
    lastRestocked: new Date("2024-11-30"),
    expiryDate: new Date("2026-05-30"),
    createdAt: new Date("2023-01-10"),
    updatedAt: new Date("2024-11-30")
  },
  
  // LEPIDLA A CEMENTY
  {
    id: "inv-9",
    name: "Adhezivní systém Single Bond Universal",
    category: "material",
    currentStock: 2,
    minStock: 4,
    unit: "lahvičky",
    pricePerUnit: 1850,
    supplier: "3M ESPE",
    lastRestocked: new Date("2024-12-05"),
    expiryDate: new Date("2026-06-05"),
    notes: "Běžná spotřeba",
    createdAt: new Date("2023-01-10"),
    updatedAt: new Date("2024-12-05")
  },
  {
    id: "inv-10",
    name: "Luting cement RelyX",
    category: "material",
    currentStock: 1,
    minStock: 2,
    unit: "balení",
    pricePerUnit: 2200,
    supplier: "3M ESPE",
    lastRestocked: new Date("2024-10-20"),
    expiryDate: new Date("2025-10-20"),
    notes: "Pro fixaci korunek",
    createdAt: new Date("2023-01-10"),
    updatedAt: new Date("2024-10-20")
  },
  
  // JEDNORÁZOVÝ MATERIÁL
  {
    id: "inv-11",
    name: "Rukavice nitrilové S",
    category: "disposable",
    currentStock: 80,
    minStock: 100,
    unit: "ks",
    pricePerUnit: 2.8,
    supplier: "Sempermed",
    lastRestocked: new Date("2024-12-10"),
    notes: "Asistentka",
    createdAt: new Date("2023-01-10"),
    updatedAt: new Date("2024-12-10")
  },
  {
    id: "inv-12",
    name: "Rukavice nitrilové M",
    category: "disposable",
    currentStock: 150,
    minStock: 200,
    unit: "ks",
    pricePerUnit: 2.8,
    supplier: "Sempermed",
    lastRestocked: new Date("2024-12-10"),
    notes: "Zubař",
    createdAt: new Date("2023-01-10"),
    updatedAt: new Date("2024-12-10")
  },
  {
    id: "inv-13",
    name: "Jehly injekční 27G",
    category: "disposable",
    currentStock: 45,
    minStock: 100,
    unit: "ks",
    pricePerUnit: 1.8,
    supplier: "B. Braun",
    lastRestocked: new Date("2024-12-01"),
    createdAt: new Date("2023-01-10"),
    updatedAt: new Date("2024-12-01")
  },
  {
    id: "inv-14",
    name: "Hadičky odsávání slin",
    category: "disposable",
    currentStock: 35,
    minStock: 50,
    unit: "ks",
    pricePerUnit: 18,
    supplier: "Dürr Dental",
    lastRestocked: new Date("2024-12-05"),
    createdAt: new Date("2023-01-10"),
    updatedAt: new Date("2024-12-05")
  },
  {
    id: "inv-15",
    name: "Bryndáčky pacientů",
    category: "disposable",
    currentStock: 120,
    minStock: 200,
    unit: "ks",
    pricePerUnit: 0.8,
    supplier: "Medicom",
    lastRestocked: new Date("2024-12-15"),
    createdAt: new Date("2023-01-10"),
    updatedAt: new Date("2024-12-15")
  },
  {
    id: "inv-16",
    name: "Kelímky plastové",
    category: "disposable",
    currentStock: 180,
    minStock: 150,
    unit: "ks",
    pricePerUnit: 0.5,
    supplier: "Medicom",
    lastRestocked: new Date("2024-12-18"),
    createdAt: new Date("2023-01-10"),
    updatedAt: new Date("2024-12-18")
  },
  {
    id: "inv-17",
    name: "Bavlněné válečky",
    category: "disposable",
    currentStock: 8,
    minStock: 10,
    unit: "balení (500ks)",
    pricePerUnit: 120,
    supplier: "Roeko",
    lastRestocked: new Date("2024-11-28"),
    createdAt: new Date("2023-01-10"),
    updatedAt: new Date("2024-11-28")
  },
  {
    id: "inv-18",
    name: "Matryce kovové",
    category: "disposable",
    currentStock: 15,
    minStock: 20,
    unit: "ks",
    pricePerUnit: 12,
    supplier: "Hawe Neos",
    lastRestocked: new Date("2024-12-08"),
    createdAt: new Date("2023-01-10"),
    updatedAt: new Date("2024-12-08")
  },
  
  // NÁSTROJE A VYBAVENÍ
  {
    id: "inv-19",
    name: "Zrcátka stomatologická č.5",
    category: "tool",
    currentStock: 12,
    minStock: 15,
    unit: "ks",
    pricePerUnit: 28,
    supplier: "ASA Dental",
    lastRestocked: new Date("2024-11-15"),
    createdAt: new Date("2023-01-10"),
    updatedAt: new Date("2024-11-15")
  },
  {
    id: "inv-20",
    name: "Pinzety anatomické",
    category: "tool",
    currentStock: 8,
    minStock: 10,
    unit: "ks",
    pricePerUnit: 95,
    supplier: "ASA Dental",
    lastRestocked: new Date("2024-11-15"),
    createdAt: new Date("2023-01-10"),
    updatedAt: new Date("2024-11-15")
  },
  {
    id: "inv-21",
    name: "Sonda stomatologická",
    category: "tool",
    currentStock: 10,
    minStock: 12,
    unit: "ks",
    pricePerUnit: 65,
    supplier: "ASA Dental",
    lastRestocked: new Date("2024-11-15"),
    createdAt: new Date("2023-01-10"),
    updatedAt: new Date("2024-11-15")
  },
  {
    id: "inv-22",
    name: "Diamantové vrtáky",
    category: "tool",
    currentStock: 280,
    minStock: 150,
    unit: "ks",
    pricePerUnit: 12,
    supplier: "Komet",
    lastRestocked: new Date("2024-12-20"),
    notes: "Dostatečná zásoba",
    createdAt: new Date("2023-01-10"),
    updatedAt: new Date("2024-12-20")
  },
  {
    id: "inv-23",
    name: "Tvrdokovové frézy",
    category: "tool",
    currentStock: 95,
    minStock: 80,
    unit: "ks",
    pricePerUnit: 18,
    supplier: "Komet",
    lastRestocked: new Date("2024-12-20"),
    createdAt: new Date("2023-01-10"),
    updatedAt: new Date("2024-12-20")
  },
  {
    id: "inv-24",
    name: "Výplňové nástroje (sada)",
    category: "tool",
    currentStock: 4,
    minStock: 3,
    unit: "sady",
    pricePerUnit: 580,
    supplier: "ASA Dental",
    lastRestocked: new Date("2024-10-10"),
    createdAt: new Date("2023-01-10"),
    updatedAt: new Date("2024-10-10")
  },
  {
    id: "inv-25",
    name: "Excavatrory",
    category: "tool",
    currentStock: 8,
    minStock: 6,
    unit: "ks",
    pricePerUnit: 145,
    supplier: "ASA Dental",
    lastRestocked: new Date("2024-11-20"),
    createdAt: new Date("2023-01-10"),
    updatedAt: new Date("2024-11-20")
  },
  
  // RENTGEN A RTG
  {
    id: "inv-26",
    name: "RTG filmy intraorlání",
    category: "material",
    currentStock: 3,
    minStock: 5,
    unit: "balení (100ks)",
    pricePerUnit: 1250,
    supplier: "Carestream",
    lastRestocked: new Date("2024-11-05"),
    expiryDate: new Date("2026-11-05"),
    notes: "Objednat 5 balení",
    createdAt: new Date("2023-01-10"),
    updatedAt: new Date("2024-11-05")
  },
  {
    id: "inv-27",
    name: "Fixážní roztok RTG",
    category: "material",
    currentStock: 2,
    minStock: 3,
    unit: "litry",
    pricePerUnit: 480,
    supplier: "Carestream",
    lastRestocked: new Date("2024-11-10"),
    expiryDate: new Date("2025-11-10"),
    createdAt: new Date("2023-01-10"),
    updatedAt: new Date("2024-11-10")
  },
  {
    id: "inv-28",
    name: "Vývojka RTG",
    category: "material",
    currentStock: 2,
    minStock: 3,
    unit: "litry",
    pricePerUnit: 520,
    supplier: "Carestream",
    lastRestocked: new Date("2024-11-10"),
    expiryDate: new Date("2025-11-10"),
    createdAt: new Date("2023-01-10"),
    updatedAt: new Date("2024-11-10")
  },
  
  // DALŠÍ MATERIÁL
  {
    id: "inv-29",
    name: "Artikulační papír",
    category: "disposable",
    currentStock: 4,
    minStock: 5,
    unit: "balení",
    pricePerUnit: 85,
    supplier: "Bausch",
    lastRestocked: new Date("2024-12-12"),
    createdAt: new Date("2023-01-10"),
    updatedAt: new Date("2024-12-12")
  },
  {
    id: "inv-30",
    name: "Lešticí pasta",
    category: "material",
    currentStock: 3,
    minStock: 4,
    unit: "tuby",
    pricePerUnit: 280,
    supplier: "Ivoclar Vivadent",
    lastRestocked: new Date("2024-11-25"),
    expiryDate: new Date("2026-05-25"),
    createdAt: new Date("2023-01-10"),
    updatedAt: new Date("2024-11-25")
  }
]

let historyIdCounter = Date.now() % 10000

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [history, setHistory] = useState<InventoryHistoryEntry[]>([])

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("dental_inventory")
    if (saved) {
      const parsed = JSON.parse(saved)
      setItems(parsed.map((item: any) => ({
        ...item,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
        lastRestocked: item.lastRestocked ? new Date(item.lastRestocked) : undefined,
        expiryDate: item.expiryDate ? new Date(item.expiryDate) : undefined
      })))
    } else {
      setItems(MOCK_INVENTORY)
      localStorage.setItem("dental_inventory", JSON.stringify(MOCK_INVENTORY))
    }

    const savedHistory = localStorage.getItem("dental_inventory_history")
    if (savedHistory) {
      const parsed = JSON.parse(savedHistory)
      setHistory(parsed.map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp)
      })))
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem("dental_inventory", JSON.stringify(items))
    }
  }, [items])

  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem("dental_inventory_history", JSON.stringify(history))
    }
  }, [history])

  const addToHistory = (
    action: InventoryHistoryEntry["action"],
    itemId: string,
    itemName: string,
    oldValues: Partial<InventoryItem> | undefined,
    newValues: Partial<InventoryItem> | undefined,
    description: string,
    userName: string = "Administrátor",
    userRole: string = "admin"
  ) => {
    const newEntry: InventoryHistoryEntry = {
      id: historyIdCounter++,
      timestamp: new Date(),
      action,
      itemId,
      itemName,
      oldValues,
      newValues,
      userName,
      userRole,
      description
    }
    setHistory(prev => [newEntry, ...prev])
  }

  const addItem = (itemData: Omit<InventoryItem, "id" | "createdAt" | "updatedAt">) => {
    const newItem: InventoryItem = {
      ...itemData,
      id: `inv-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    setItems(prev => [...prev, newItem])
    
    addToHistory(
      "create",
      newItem.id,
      newItem.name,
      undefined,
      newItem,
      `Přidána nová položka: ${newItem.name}`
    )
  }

  const updateItem = (id: string, updates: Partial<InventoryItem>) => {
    const oldItem = items.find(item => item.id === id)
    if (!oldItem) return

    const updatedItem = { ...oldItem, ...updates, updatedAt: new Date() }
    setItems(prev => prev.map(item => 
      item.id === id ? updatedItem : item
    ))

    addToHistory(
      "update",
      id,
      oldItem.name,
      oldItem,
      updatedItem,
      `Upravena položka: ${oldItem.name}`
    )
  }

  const deleteItem = (id: string) => {
    const item = items.find(i => i.id === id)
    if (!item) return

    setItems(prev => prev.filter(i => i.id !== id))
    
    addToHistory(
      "delete",
      id,
      item.name,
      item,
      undefined,
      `Smazána položka: ${item.name}`
    )
  }

  const undoAction = (historyId: number): boolean => {
    const entry = history.find(h => h.id === historyId)
    if (!entry) return false

    try {
      if (entry.action === "create" && entry.newValues) {
        // Undo create = delete
        setItems(prev => prev.filter(item => item.id !== entry.itemId))
      } else if (entry.action === "delete" && entry.oldValues) {
        // Undo delete = restore
        const restoredItem = entry.oldValues as InventoryItem
        setItems(prev => [...prev, restoredItem])
      } else if (entry.action === "update" && entry.oldValues) {
        // Undo update = revert to old values
        const oldItem = entry.oldValues as Partial<InventoryItem>
        setItems(prev => prev.map(item =>
          item.id === entry.itemId
            ? { ...item, ...oldItem, updatedAt: new Date() }
            : item
        ))
      }
      return true
    } catch (error) {
      console.error("Undo failed:", error)
      return false
    }
  }

  const getLowStockItems = () => {
    return items.filter(item => item.currentStock < item.minStock)
      .sort((a, b) => {
        const aDiff = (a.currentStock / a.minStock) * 100
        const bDiff = (b.currentStock / b.minStock) * 100
        return aDiff - bDiff
      })
  }

  const getItemsByCategory = (category: InventoryItem["category"]) => {
    return items.filter(item => item.category === category)
  }

  return (
    <InventoryContext.Provider value={{
      items,
      history,
      addItem,
      updateItem,
      deleteItem,
      getLowStockItems,
      getItemsByCategory,
      addToHistory,
      undoAction
    }}>
      {children}
    </InventoryContext.Provider>
  )
}

export function useInventory() {
  const context = useContext(InventoryContext)
  if (!context) {
    throw new Error("useInventory must be used within InventoryProvider")
  }
  return context
}
