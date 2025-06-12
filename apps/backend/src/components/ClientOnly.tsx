'use client'

import { useEffect, useState } from 'react'

export const ClientOnly: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [isBrowser, setIsBrowser] = useState(false)

  useEffect(() => {
    setIsBrowser(true)
  }, [])

  return isBrowser ? children : null
}
