import { useState, useCallback, useEffect } from 'react'

export interface LocalDork {
  id: string
  title: string
  query: string
  description: string
  category: string
  tags: string[]
  createdAt: string
}

const STORAGE_KEY = 'dorkly_saved_dorks'

function readStorage(): LocalDork[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeStorage(dorks: LocalDork[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dorks))
  } catch {
    console.error('localStorage write failed')
  }
}

export function useSavedDorks() {
  const [dorks, setDorks] = useState<LocalDork[]>([])

  useEffect(() => {
    setDorks(readStorage())
  }, [])

  const save = useCallback((payload: Omit<LocalDork, 'id' | 'createdAt'>) => {
    const entry: LocalDork = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      ...payload,
    }
    setDorks(prev => {
      const next = [entry, ...prev]
      writeStorage(next)
      return next
    })
    return entry
  }, [])

  const remove = useCallback((id: string) => {
    setDorks(prev => {
      const next = prev.filter(d => d.id !== id)
      writeStorage(next)
      return next
    })
  }, [])

  const clear = useCallback(() => {
    setDorks([])
    writeStorage([])
  }, [])

  const isSaved = useCallback((query: string) => {
    return readStorage().some(d => d.query === query)
  }, [])

  return { dorks, save, remove, clear, isSaved }
}
