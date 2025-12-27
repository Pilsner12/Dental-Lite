"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Eye, Edit, Plus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Patient {
  id: string
  name: string
  age: number
  phone: string
  email: string
  lastVisit: string
  visitHistory?: { date: string; service: string; notes: string }[]
  notes?: string
}

const patientsData: Patient[] = [
  {
    id: "1",
    name: "Jana Svobodová, 35",
    age: 35,
    phone: "731 234 567",
    email: "jana@email.cz",
    lastVisit: "23.12.2024",
    visitHistory: [
      { date: "23.12.2024", service: "Preventivka", notes: "Vše v pořádku" },
      { date: "15.06.2024", service: "Hygiena", notes: "Odstranění zubního kamene" },
      { date: "10.01.2024", service: "Kontrola", notes: "Pravidelná kontrola" },
    ],
    notes: "Pravidelná pacientka, bez problémů",
  },
  {
    id: "2",
    name: "Petr Novák, 42",
    age: 42,
    phone: "602 345 678",
    email: "petr@email.cz",
    lastVisit: "20.12.2024",
    visitHistory: [
      { date: "20.12.2024", service: "Plomba", notes: "Výplň horního zubu" },
      { date: "05.11.2024", service: "Preventivka", notes: "" },
    ],
    notes: "Občas zubní kámen",
  },
  {
    id: "3",
    name: "Eva Dvořáková, 28",
    age: 28,
    phone: "775 456 789",
    email: "eva@email.cz",
    lastVisit: "18.12.2024",
    visitHistory: [
      { date: "18.12.2024", service: "Kámen", notes: "Odstranění kamene" },
      { date: "22.08.2024", service: "Bělení", notes: "První fáze bělení" },
    ],
  },
  {
    id: "4",
    name: "Martin Černý, 51",
    age: 51,
    phone: "608 567 890",
    email: "martin@email.cz",
    lastVisit: "15.12.2024",
    visitHistory: [{ date: "15.12.2024", service: "Kontrola", notes: "Pravidelná kontrola" }],
  },
  {
    id: "5",
    name: "Lucie Procházková, 39",
    age: 39,
    phone: "732 678 901",
    email: "lucie@email.cz",
    lastVisit: "12.12.2024",
    visitHistory: [{ date: "12.12.2024", service: "Bělení", notes: "Druhá fáze" }],
  },
  {
    id: "6",
    name: "Tomáš Veselý, 33",
    age: 33,
    phone: "775 012 345",
    email: "tomas@email.cz",
    lastVisit: "10.12.2024",
    visitHistory: [{ date: "10.12.2024", service: "Preventivka", notes: "" }],
  },
  {
    id: "7",
    name: "Barbora Horáková, 29",
    age: 29,
    phone: "603 123 456",
    email: "barbora@email.cz",
    lastVisit: "08.12.2024",
    visitHistory: [{ date: "08.12.2024", service: "Plomba", notes: "Dolní levá šestka" }],
  },
  {
    id: "8",
    name: "Jakub Kučera, 45",
    age: 45,
    phone: "731 234 567",
    email: "jakub@email.cz",
    lastVisit: "05.12.2024",
    visitHistory: [{ date: "05.12.2024", service: "Extrakce", notes: "Konzultace" }],
  },
  {
    id: "9",
    name: "Tereza Němcová, 37",
    age: 37,
    phone: "602 345 678",
    email: "tereza@email.cz",
    lastVisit: "03.12.2024",
    visitHistory: [{ date: "03.12.2024", service: "Hygiena", notes: "Čištění" }],
  },
  {
    id: "10",
    name: "David Šmíd, 52",
    age: 52,
    phone: "775 456 789",
    email: "david@email.cz",
    lastVisit: "01.12.2024",
    visitHistory: [{ date: "01.12.2024", service: "Kontrola", notes: "Pravidelná kontrola" }],
  },
]

export default function PatientsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)

  const filteredPatients = patientsData.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.phone.includes(searchQuery) ||
      patient.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pacienti</h1>
          <p className="text-gray-600 mt-1">Správa databáze pacientů</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Přidat pacienta
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle>Seznam pacientů ({filteredPatients.length})</CardTitle>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Hledat pacienta..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Jméno</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Telefon</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Poslední návštěva</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Akce</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{patient.name}</td>
                    <td className="py-3 px-4 text-gray-600">{patient.phone}</td>
                    <td className="py-3 px-4 text-gray-600">{patient.email}</td>
                    <td className="py-3 px-4 text-gray-600">{patient.lastVisit}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedPatient(patient)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Detail
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-600 hover:text-gray-700 hover:bg-gray-100"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Upravit
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Patient Detail Modal */}
      <Dialog open={!!selectedPatient} onOpenChange={() => setSelectedPatient(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail pacienta</DialogTitle>
          </DialogHeader>
          {selectedPatient && (
            <div className="space-y-6">
              {/* Patient Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Jméno a věk</div>
                  <div className="font-semibold text-lg">{selectedPatient.name}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Telefon</div>
                  <div className="font-medium">{selectedPatient.phone}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Email</div>
                  <div className="font-medium">{selectedPatient.email}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Poslední návštěva</div>
                  <div className="font-medium">{selectedPatient.lastVisit}</div>
                </div>
              </div>

              {/* Visit History */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Historie návštěv</h3>
                <div className="space-y-2">
                  {selectedPatient.visitHistory && selectedPatient.visitHistory.length > 0 ? (
                    selectedPatient.visitHistory.slice(0, 5).map((visit, index) => (
                      <div key={index} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{visit.service}</div>
                          {visit.notes && <div className="text-sm text-gray-600">{visit.notes}</div>}
                        </div>
                        <div className="text-sm text-gray-500">{visit.date}</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500 p-3 bg-gray-50 rounded-lg">Žádná historie návštěv</div>
                  )}
                </div>
              </div>

              {/* Notes */}
              {selectedPatient.notes && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Poznámky</h3>
                  <div className="p-3 bg-blue-50 rounded-lg text-sm text-gray-700">{selectedPatient.notes}</div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700">Objednat termín</Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  Upravit údaje
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
