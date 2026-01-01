"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

import { useBreadcrumbs } from "@/providers/breadcrumb-provider"

type VehicleBreadcrumbsProps = {
  title: string
}

function VehicleBreadcrumbs({ title }: VehicleBreadcrumbsProps) {
  const pathname = usePathname()
  const { setBreadcrumbs, clearBreadcrumbs } = useBreadcrumbs()

  useEffect(() => {
    if (!pathname) {
      return
    }
    setBreadcrumbs([
      { href: "/", title: "Dashboard" },
      { href: "/vehicles", title: "Vehicles" },
      { href: pathname, title },
    ])
    return () => clearBreadcrumbs()
  }, [pathname, title, setBreadcrumbs, clearBreadcrumbs])

  return null
}

export default VehicleBreadcrumbs
