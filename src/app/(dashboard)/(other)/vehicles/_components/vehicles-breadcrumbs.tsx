"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

import { useBreadcrumbs } from "@/providers/breadcrumb-provider"

function VehiclesBreadcrumbs() {
  const pathname = usePathname()
  const { setBreadcrumbs, clearBreadcrumbs } = useBreadcrumbs()

  useEffect(() => {
    if (!pathname) {
      return
    }
    setBreadcrumbs([
      { href: "/", title: "Dashboard" },
      { href: "/vehicles", title: "Vehicles" },
    ])
    return () => clearBreadcrumbs()
  }, [pathname, setBreadcrumbs, clearBreadcrumbs])

  return null
}

export default VehiclesBreadcrumbs
