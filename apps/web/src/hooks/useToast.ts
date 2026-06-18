import { useState, useCallback } from 'react'
import type { ToastType } from '@/components/ui/Toast'

interface ToastState { id: string; message: string; type: ToastType }

export function useToast() {
  const [toasts, setToasts] = useState<ToastState[]>([])

  const toast = useCallback((message: string, type: ToastType = 'success') => {
    const id = crypto.randomUUID()
    setToasts(prev => [...prev, { id, message, type }])
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return { toasts, toast, dismiss }
}
