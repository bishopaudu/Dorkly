import { useState, useCallback } from 'react'
import { DORK_OPERATORS, type DorkOperator } from '@dorkly/shared'

export interface QueryChip {
  id: string
  operator: DorkOperator
  value: string
}

export function useQueryBuilder() {
  const [chips, setChips] = useState<QueryChip[]>([])
  const [freeText, setFreeText] = useState('')

  const addChip = useCallback((operator: DorkOperator) => {
    const chip: QueryChip = {
      id: crypto.randomUUID(),
      operator,
      value: '',
    }
    setChips(prev => [...prev, chip])
  }, [])

  const updateChip = useCallback((id: string, value: string) => {
    setChips(prev => prev.map(c => c.id === id ? { ...c, value } : c))
  }, [])

  const removeChip = useCallback((id: string) => {
    setChips(prev => prev.filter(c => c.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setChips([])
    setFreeText('')
  }, [])

  const buildQuery = useCallback(() => {
    const parts: string[] = []
    if (freeText.trim()) parts.push(freeText.trim())
    for (const chip of chips) {
      if (!chip.value.trim()) continue
      const val = chip.value.includes(' ') && !chip.value.startsWith('"')
        ? `"${chip.value.trim()}"`
        : chip.value.trim()
      parts.push(`${chip.operator.operator}${val}`)
    }
    return parts.join(' ')
  }, [chips, freeText])

  const openInGoogle = useCallback(() => {
    const q = buildQuery()
    if (!q) return
    window.open(`https://www.google.com/search?q=${encodeURIComponent(q)}`, '_blank', 'noopener')
  }, [buildQuery])

  const openInDuckDuckGo = useCallback(() => {
    const q = buildQuery()
    if (!q) return
    window.open(`https://duckduckgo.com/?q=${encodeURIComponent(q)}`, '_blank', 'noopener')
  }, [buildQuery])

  const loadFromTemplate = useCallback((query: string) => {
    setChips([])
    setFreeText(query)
  }, [])

  return {
    chips,
    freeText,
    setFreeText,
    addChip,
    updateChip,
    removeChip,
    clearAll,
    buildQuery,
    openInGoogle,
    openInDuckDuckGo,
    loadFromTemplate,
    operators: DORK_OPERATORS,
  }
}
