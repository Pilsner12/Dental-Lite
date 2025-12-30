import type React from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { ToastContainer } from "@/components/ui/toast"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64">{children}</main>
      <ToastContainer />
    </div>
  )
}
