"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { usePathname } from "next/navigation"

export type BreadcrumbItem = {
  href: string
  title: string
}

type BreadcrumbContextValue = {
  breadcrumbs: BreadcrumbItem[]
  setBreadcrumbs: (items: BreadcrumbItem[]) => void
  clearBreadcrumbs: () => void
}

const BreadcrumbContext = createContext<BreadcrumbContextValue | null>(null)

function useBreadcrumbs() {
  const context = useContext(BreadcrumbContext)
  if (!context) {
    throw new Error("useBreadcrumbs must be used within a BreadcrumbProvider")
  }
  return context
}

function BreadcrumbProvider({ children }: { children: React.ReactNode }) {
  const [customBreadcrumbs, setCustomBreadcrumbs] = useState<BreadcrumbItem[] | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    setCustomBreadcrumbs(null)
  }, [pathname])

  const setBreadcrumbs = useCallback((items: BreadcrumbItem[]) => {
    setCustomBreadcrumbs(items)
  }, [])

  const clearBreadcrumbs = useCallback(() => {
    setCustomBreadcrumbs(null)
  }, [])

  const breadcrumbs = useMemo(() => {
    return customBreadcrumbs ?? []
  }, [customBreadcrumbs])

  const value = useMemo(
    () => ({
      breadcrumbs,
      setBreadcrumbs,
      clearBreadcrumbs,
    }),
    [breadcrumbs, setBreadcrumbs, clearBreadcrumbs],
  )

  return <BreadcrumbContext.Provider value={value}>{children}</BreadcrumbContext.Provider>
}

export { BreadcrumbProvider, useBreadcrumbs }
