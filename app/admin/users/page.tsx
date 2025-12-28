"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useUser, User } from "@/lib/user-context"
import { useTier } from "@/lib/tier-context"
import { Plus, Trash2, Edit, UserCircle, Shield, Clock } from "lucide-react"
import { LockedFeature } from "@/components/locked-feature"

export default function UsersPage() {
  const { currentUser, users, addUser, updateUser, deleteUser, canAddUser, getUserLimit } = useUser()
  const { tier } = useTier()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [newUser, setNewUser] = useState({
    email: "",
    firstName: "",
    lastName: "",
    role: "assistant" as const
  })

  const userLimit = getUserLimit(tier)
  const hasAccess = tier !== "basic"

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("cs-CZ", {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(date)
  }

  const getRoleBadge = (role: string) => {
    const colors = {
      admin: "bg-purple-100 text-purple-800",
      doctor: "bg-blue-100 text-blue-800",
      assistant: "bg-gray-100 text-gray-800"
    }
    const labels = {
      admin: "Administrátor",
      doctor: "Lékař",
      assistant: "Asistent"
    }
    return (
      <Badge className={colors[role as keyof typeof colors]}>
        {labels[role as keyof typeof labels]}
      </Badge>
    )
  }

  const handleAddUser = () => {
    if (!newUser.email || !newUser.firstName || !newUser.lastName) {
      alert("Vyplňte všechna pole")
      return
    }

    addUser(newUser)
    setNewUser({ email: "", firstName: "", lastName: "", role: "assistant" })
    setIsAddDialogOpen(false)
  }

  const handleDeleteUser = (userId: string) => {
    if (userId === currentUser?.id) {
      alert("Nemůžete smazat sami sebe")
      return
    }

    if (confirm("Opravdu chcete smazat tohoto uživatele?")) {
      deleteUser(userId)
    }
  }

  if (!hasAccess) {
    return (
      <div className="p-8">
        <LockedFeature
          featureName="Správa uživatelů"
          requiredTier="business"
          description="Pro přístup ke správě uživatelů potřebujete minimálně Business verzi."
        />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Správa uživatelů</h1>
            <p className="text-gray-600 mt-1">
              {userLimit === null
                ? "Neomezený počet uživatelů"
                : `Limit: ${users.length}/${userLimit} uživatelů`}
            </p>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button
                disabled={!canAddUser(tier)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Přidat uživatele
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nový uživatel</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Jméno
                    </label>
                    <Input
                      value={newUser.firstName}
                      onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                      placeholder="Jan"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Příjmení
                    </label>
                    <Input
                      value={newUser.lastName}
                      onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                      placeholder="Novák"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="jan.novak@email.cz"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Role
                  </label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    aria-label="Role uživatele"
                  >
                    <option value="admin">Administrátor</option>
                    <option value="doctor">Lékař</option>
                    <option value="assistant">Asistent</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={handleAddUser}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    Přidat
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                    className="flex-1"
                  >
                    Zrušit
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Current User Card */}
        {currentUser && (
          <Card className="mb-6 border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <UserCircle className="w-10 h-10 text-blue-600" />
                <div>
                  <div className="font-semibold text-gray-900">
                    {currentUser.firstName} {currentUser.lastName}
                  </div>
                  <div className="text-sm text-gray-600">{currentUser.email}</div>
                </div>
                <Badge className="ml-auto bg-blue-600 text-white">
                  <Shield className="w-3 h-3 mr-1" />
                  Přihlášen
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle>Uživatelé systému</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-4">
                    <UserCircle className="w-10 h-10 text-gray-400" />
                    <div>
                      <div className="font-semibold text-gray-900">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                      <div className="flex items-center gap-2 mt-1">
                        {getRoleBadge(user.role)}
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Poslední přihlášení: {formatDate(user.lastLogin)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {user.id !== currentUser?.id && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              {users.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  Žádní uživatelé
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tier Info */}
        {tier === "business" && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <div className="font-medium text-yellow-900">
                  Business verze - Omezení na 1 uživatele
                </div>
                <div className="text-sm text-yellow-700 mt-1">
                  Pro neomezený počet uživatelů přejděte na Profi verzi.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
