"use client"

import { Fragment } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

import { ChevronLeft } from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { useBreadcrumbs } from "@/providers/breadcrumb-provider"

function HeaderBreadcrumb() {
  const router = useRouter()
  const pathname = usePathname()
  const { breadcrumbs } = useBreadcrumbs()

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back()
      return
    }
    router.push("/")
  }
  return (
    <>
      {pathname !== "/" && (
        <Button
          variant="ghost"
          size="icon-lg"
          onClick={handleBack}
          aria-label="Go back"
          className="text-muted-foreground"
        >
          <ChevronLeft className="size-4" />
        </Button>
      )}
      {breadcrumbs.length > 0 && (
        <Breadcrumb className="flex min-w-0">
          <BreadcrumbList className="min-w-0">
            {breadcrumbs.map((breadcrumb, index) => {
              const isLast = index === breadcrumbs.length - 1
              return (
                <Fragment key={breadcrumb.href}>
                  <BreadcrumbItem className="min-w-0">
                    {isLast ? (
                      <BreadcrumbPage className="truncate">{breadcrumb.title}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild className="truncate">
                        <Link href={breadcrumb.href}>{breadcrumb.title}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLast && <BreadcrumbSeparator />}
                </Fragment>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>
      )}
    </>
  )
}

export default HeaderBreadcrumb
