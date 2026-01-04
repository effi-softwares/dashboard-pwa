"use client"

import { usePathname } from "next/navigation"

import BreadcrumbSetter from "@/components/breadcrumb-setter"

type VehicleBreadcrumbsProps = {
  title: string
}

function VehicleBreadcrumbs({ title }: VehicleBreadcrumbsProps) {
  const pathname = usePathname()

  return (
    <BreadcrumbSetter
      items={[
        { href: "/", title: "Dashboard" },
        { href: "/vehicles", title: "Vehicles" },
        { href: pathname, title },
      ]}
    />
  )
}

export default VehicleBreadcrumbs
