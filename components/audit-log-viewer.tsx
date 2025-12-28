"use client"

import { useUser, AuditLogEntry } from "@/lib/user-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, User, Edit, Plus, Trash2, CheckCircle } from "lucide-react"

interface AuditLogViewerProps {
  entityType: string
  entityId: string
  title?: string
}

export function AuditLogViewer({ entityType, entityId, title = "Historie změn" }: AuditLogViewerProps) {
  const { getAuditLogForEntity } = useUser()
  const entries = getAuditLogForEntity(entityType, entityId)

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("cs-CZ", {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(date)
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case "create":
        return <Plus className="w-4 h-4 text-green-600" />
      case "update":
        return <Edit className="w-4 h-4 text-blue-600" />
      case "delete":
        return <Trash2 className="w-4 h-4 text-red-600" />
      case "verify":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      default:
        return <Edit className="w-4 h-4 text-gray-600" />
    }
  }

  const getActionBadge = (action: string) => {
    const colors = {
      create: "bg-green-100 text-green-800",
      update: "bg-blue-100 text-blue-800",
      delete: "bg-red-100 text-red-800",
      verify: "bg-green-100 text-green-800"
    }
    const labels = {
      create: "Vytvořeno",
      update: "Upraveno",
      delete: "Smazáno",
      verify: "Ověřeno"
    }
    return (
      <Badge className={colors[action as keyof typeof colors] || "bg-gray-100 text-gray-800"}>
        {labels[action as keyof typeof labels] || action}
      </Badge>
    )
  }

  const formatFieldName = (field: string): string => {
    const fieldNames: Record<string, string> = {
      firstName: "Jméno",
      lastName: "Příjmení",
      phone: "Telefon",
      email: "Email",
      dateOfBirth: "Datum narození",
      gender: "Pohlaví",
      "address.street": "Ulice",
      "address.city": "Město",
      "address.zip": "PSČ",
      bloodType: "Krevní skupina",
      allergies: "Alergie",
      conditions: "Zdravotní podmínky",
      medications: "Medikace",
      notes: "Poznámky",
      status: "Status",
      tags: "Tagy"
    }
    return fieldNames[field] || field
  }

  if (entries.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-center py-8 text-gray-500 text-sm">
            Zatím žádná historie změn
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="border-l-2 border-gray-200 pl-4 py-2 hover:border-blue-400 transition-colors"
            >
              <div className="flex items-start justify-between mb-1">
                <div className="flex items-center gap-2">
                  {getActionIcon(entry.action)}
                  {getActionBadge(entry.action)}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  {formatDate(entry.timestamp)}
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-1">
                <User className="w-3.5 h-3.5" />
                <span className="font-medium">{entry.userName}</span>
              </div>

              <div className="text-sm text-gray-700 mb-1">
                {entry.description}
              </div>

              {entry.changes && entry.changes.length > 0 && (
                <div className="mt-2 space-y-1">
                  {entry.changes.map((change, idx) => (
                    <div key={idx} className="text-xs bg-gray-50 p-2 rounded">
                      <span className="font-medium text-gray-700">
                        {formatFieldName(change.field)}:
                      </span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-red-600 line-through">
                          {typeof change.oldValue === "object"
                            ? JSON.stringify(change.oldValue)
                            : String(change.oldValue || "-")}
                        </span>
                        <span>→</span>
                        <span className="text-green-600 font-medium">
                          {typeof change.newValue === "object"
                            ? JSON.stringify(change.newValue)
                            : String(change.newValue || "-")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
