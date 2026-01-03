import { redirect } from "next/navigation"

import { Onborda, OnbordaProvider } from "onborda"

import AppHeader from "@/components/app-header"
import AppSidebar from "@/components/app-sidebar"
import { TourCard } from "@/components/tour-card"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { layoutPreferences } from "@/config/app-config"
import { getSession } from "@/lib/auth/get-session"
import { vehicleAvailabilityTour } from "@/lib/onborda-step"
import { cn } from "@/lib/utils"
import { BreadcrumbProvider } from "@/providers/breadcrumb-provider"
import { NewRentalProvider } from "@/providers/new-rental-provider"

async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session) {
    redirect("/auth/sign-in")
  }

  const tours = [vehicleAvailabilityTour]

  return (
    <OnbordaProvider>
      <Onborda
        steps={tours}
        showOnborda={false}
        shadowOpacity="0.4"
        cardComponent={TourCard}
        cardTransition={{ duration: 0.3, type: "keyframes" }}
      >
        <SidebarProvider defaultOpen={layoutPreferences.defaultOpen}>
          <AppSidebar />
          <SidebarInset
            data-content-layout={layoutPreferences.contentLayout}
            className={cn(
              "flex flex-col",
              "data-[content-layout=centered]:mx-auto! data-[content-layout=centered]:max-w-screen-2xl",
              "max-[113rem]:peer-data-[variant=inset]:mr-2! min-[101rem]:peer-data-[variant=inset]:peer-data-[state=collapsed]:mr-auto!",
            )}
          >
            <BreadcrumbProvider>
              <AppHeader />
              <div className="flex-1 min-h-0">
                <NewRentalProvider>{children}</NewRentalProvider>
              </div>
            </BreadcrumbProvider>
          </SidebarInset>
        </SidebarProvider>
      </Onborda>
    </OnbordaProvider>
  )
}

export default DashboardLayout
