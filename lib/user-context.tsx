"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { Tier } from "./tier-context"

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: "admin" | "doctor" | "assistant"
  createdAt: Date
  lastLogin: Date
}

export interface AuditLogEntry {
  id: string
  timestamp: Date
  userId: string
  userName: string
  action: "create" | "update" | "delete" | "verify"
  entityType: "patient" | "appointment" | "user" | "settings"
  entityId: string
  entityName?: string
  changes?: {
    field: string
    oldValue: any
    newValue: any
  }[]
  description: string
}

interface UserContextType {
  currentUser: User | null
  users: User[]
  auditLog: AuditLogEntry[]
  setCurrentUser: (user: User | null) => void
  addUser: (user: Omit<User, "id" | "createdAt" | "lastLogin">) => void
  updateUser: (id: string, updates: Partial<User>) => void
  deleteUser: (id: string) => void
  canAddUser: (tier: Tier) => boolean
  getUserLimit: (tier: Tier) => number | null
  addAuditEntry: (entry: Omit<AuditLogEntry, "id" | "timestamp" | "userId" | "userName">) => void
  getAuditLogForEntity: (entityType: string, entityId: string) => AuditLogEntry[]
}

const UserContext = createContext<UserContextType | undefined>(undefined)

const MOCK_ADMIN_USER: User = {
  id: "user-1",
  email: "admin@dentalni-ordinace.cz",
  firstName: "Jan",
  lastName: "Novák",
  role: "admin",
  createdAt: new Date("2020-01-01"),
  lastLogin: new Date()
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([])

  // Load from localStorage
  useEffect(() => {
    const savedCurrentUser = localStorage.getItem("dental_current_user")
    const savedUsers = localStorage.getItem("dental_users")
    const savedAuditLog = localStorage.getItem("dental_audit_log")

    if (savedCurrentUser) {
      const parsed = JSON.parse(savedCurrentUser)
      setCurrentUser({
        ...parsed,
        createdAt: new Date(parsed.createdAt),
        lastLogin: new Date(parsed.lastLogin)
      })
    } else {
      // Auto-login mock admin user
      setCurrentUser(MOCK_ADMIN_USER)
      localStorage.setItem("dental_current_user", JSON.stringify(MOCK_ADMIN_USER))
    }

    if (savedUsers) {
      const parsed = JSON.parse(savedUsers)
      setUsers(parsed.map((u: any) => ({
        ...u,
        createdAt: new Date(u.createdAt),
        lastLogin: new Date(u.lastLogin)
      })))
    } else {
      // Initialize with mock admin
      setUsers([MOCK_ADMIN_USER])
      localStorage.setItem("dental_users", JSON.stringify([MOCK_ADMIN_USER]))
    }

    if (savedAuditLog) {
      const parsed = JSON.parse(savedAuditLog)
      setAuditLog(parsed.map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp)
      })))
    }
  }, [])

  // Save users to localStorage
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem("dental_users", JSON.stringify(users))
    }
  }, [users])

  // Save audit log to localStorage
  useEffect(() => {
    if (auditLog.length > 0) {
      localStorage.setItem("dental_audit_log", JSON.stringify(auditLog))
    }
  }, [auditLog])

  const getUserLimit = (tier: Tier): number | null => {
    switch (tier) {
      case "basic":
        return 0 // No admin access
      case "business":
        return 1 // 1 user only
      case "profi":
        return null // Unlimited
      default:
        return 0
    }
  }

  const canAddUser = (tier: Tier): boolean => {
    const limit = getUserLimit(tier)
    if (limit === null) return true // Unlimited
    if (limit === 0) return false // No access
    return users.length < limit
  }

  const addUser = (userData: Omit<User, "id" | "createdAt" | "lastLogin">) => {
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: new Date(),
      lastLogin: new Date()
    }
    setUsers(prev => [...prev, newUser])

    // Add audit log entry
    if (currentUser) {
      addAuditEntry({
        action: "create",
        entityType: "user",
        entityId: newUser.id,
        entityName: `${newUser.firstName} ${newUser.lastName}`,
        description: `Vytvořen nový uživatel ${newUser.firstName} ${newUser.lastName} (${newUser.email})`
      })
    }
  }

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u))

    // Add audit log entry
    if (currentUser) {
      const user = users.find(u => u.id === id)
      if (user) {
        const changes = Object.entries(updates).map(([field, newValue]) => ({
          field,
          oldValue: (user as any)[field],
          newValue
        }))

        addAuditEntry({
          action: "update",
          entityType: "user",
          entityId: id,
          entityName: `${user.firstName} ${user.lastName}`,
          changes,
          description: `Aktualizován uživatel ${user.firstName} ${user.lastName}`
        })
      }
    }
  }

  const deleteUser = (id: string) => {
    const user = users.find(u => u.id === id)
    setUsers(prev => prev.filter(u => u.id !== id))

    // Add audit log entry
    if (currentUser && user) {
      addAuditEntry({
        action: "delete",
        entityType: "user",
        entityId: id,
        entityName: `${user.firstName} ${user.lastName}`,
        description: `Smazán uživatel ${user.firstName} ${user.lastName} (${user.email})`
      })
    }
  }

  const addAuditEntry = (entry: Omit<AuditLogEntry, "id" | "timestamp" | "userId" | "userName">) => {
    if (!currentUser) return

    const newEntry: AuditLogEntry = {
      ...entry,
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      userId: currentUser.id,
      userName: `${currentUser.firstName} ${currentUser.lastName}`
    }

    setAuditLog(prev => [newEntry, ...prev].slice(0, 1000)) // Keep last 1000 entries
  }

  const getAuditLogForEntity = (entityType: string, entityId: string): AuditLogEntry[] => {
    return auditLog.filter(entry =>
      entry.entityType === entityType && entry.entityId === entityId
    )
  }

  return (
    <UserContext.Provider value={{
      currentUser,
      users,
      auditLog,
      setCurrentUser,
      addUser,
      updateUser,
      deleteUser,
      canAddUser,
      getUserLimit,
      addAuditEntry,
      getAuditLogForEntity
    }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUser must be used within UserProvider")
  }
  return context
}
