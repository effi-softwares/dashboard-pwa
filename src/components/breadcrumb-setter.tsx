"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

import { BreadcrumbItem, useBreadcrumbs } from "@/providers/breadcrumb-provider"

export type BreadcrumbSetterProps = {
  items: BreadcrumbItem[]
}

function BreadcrumbSetter({ items }: BreadcrumbSetterProps) {
  const pathname = usePathname()
  const { setBreadcrumbs, clearBreadcrumbs } = useBreadcrumbs()

  useEffect(() => {
    if (!pathname) {
      return
    }
    setBreadcrumbs(items)
    return () => clearBreadcrumbs()
  }, [pathname, items, setBreadcrumbs, clearBreadcrumbs])

  return null
}

export default BreadcrumbSetter
