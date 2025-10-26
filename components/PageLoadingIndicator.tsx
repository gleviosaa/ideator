'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export function PageLoadingIndicator() {
  const [loading, setLoading] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Show loading indicator when pathname changes
    setLoading(true)

    // Hide after a short delay to show the loading state
    const timer = setTimeout(() => {
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [pathname])

  if (!loading) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999]">
      <div className="h-1 bg-gray-200">
        <div className="h-full bg-black animate-loading-bar"></div>
      </div>
    </div>
  )
}
