import { useEffect, useState } from 'react'

/**
 * Hook pour retarder la mise à jour d'une valeur.
 * Très utile pour les barres de recherche liées à une API (Odoo).
 */
export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // On définit un timer pour mettre à jour la valeur après le délai (ex: 500ms)
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay || 500)

    // Si la valeur change avant la fin du timer, on annule le précédent
    // C'est ce qui évite les appels API excessifs
    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}