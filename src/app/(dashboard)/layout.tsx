import { redirect } from "next/navigation"

import AppHeader from "@/components/app-header"
import AppSidebar from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { layoutPreferences } from "@/config/app-config"
import { getSession } from "@/lib/auth/get-session"
import { cn } from "@/lib/utils"
import { NewRentalProvider } from "@/providers/new-rental-provider"

async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session) {
    redirect("/auth/sign-in")
  }

  return (
    <SidebarProvider defaultOpen={layoutPreferences.defaultOpen}>
      <AppSidebar />
      <SidebarInset
        data-content-layout={layoutPreferences.contentLayout}
        className={cn(
          "data-[content-layout=centered]:mx-auto! data-[content-layout=centered]:max-w-screen-2xl",
          "max-[113rem]:peer-data-[variant=inset]:mr-2! min-[101rem]:peer-data-[variant=inset]:peer-data-[state=collapsed]:mr-auto!",
        )}
      >
        <AppHeader />
        <div className="h-full">
          <NewRentalProvider>{children}</NewRentalProvider>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default DashboardLayout
