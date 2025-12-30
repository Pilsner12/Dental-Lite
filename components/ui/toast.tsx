"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"

let toastCounter = 0

export interface Toast {
  id: string
  message: string
  historyId?: string
  onUndo?: (historyId: string) => void
}

interface ToastProps extends Toast {
  onDismiss: (id: string) => void
}

function ToastItem({ id, message, historyId, onUndo, onDismiss }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(id)
    }, 5000)

    return () => clearTimeout(timer)
  }, [id, onDismiss])

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-[320px] max-w-md animate-in slide-in-from-right">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-gray-700 flex-1">{message}</p>
        <button
          onClick={() => onDismiss(id)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Zavřít"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      {historyId && onUndo && (
        <button
          onClick={() => {
            onUndo(historyId)
            onDismiss(id)
          }}
          className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          Vrátit zpět
        </button>
      )}
    </div>
  )
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    // Listen for custom toast events
    const handleToast = (event: CustomEvent<Toast>) => {
      setToasts((prev) => [...prev, event.detail])
    }

    window.addEventListener("show-toast" as any, handleToast)
    return () => window.removeEventListener("show-toast" as any, handleToast)
  }, [])

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem {...toast} onDismiss={dismissToast} />
        </div>
      ))}
    </div>
  )
}

// Helper function to show toast
export function showToast(message: string, historyId?: string, onUndo?: (historyId: string) => void) {
  const toast: Toast = {
    id: `toast-${Date.now()}-${++toastCounter}`,
    message,
    historyId,
    onUndo,
  }

  window.dispatchEvent(new CustomEvent("show-toast", { detail: toast }))
}
