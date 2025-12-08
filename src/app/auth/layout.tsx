import { ReactNode } from "react"
import { redirect } from "next/navigation"

import { Command } from "lucide-react"

import { Separator } from "@/components/ui/separator"
import { APP_CONFIG } from "@/config/app-config"
import { getSession } from "@/lib/auth/get-session"

export default async function AuthLayout({ children }: Readonly<{ children: ReactNode }>) {
  const session = await getSession()
  if (session) {
    redirect("/")
  }

  return (
    <main>
      <div className="grid h-dvh justify-center p-2 lg:grid-cols-2">
        <div className="bg-primary relative order-2 hidden h-full rounded-3xl lg:flex">
          <div className="text-primary-foreground absolute top-10 space-y-1 px-10">
            <Command className="size-10" />
            <h1 className="text-2xl font-medium">{APP_CONFIG.name}</h1>
            <p className="text-sm">Real-time fleet insights, seamless reservations.</p>
          </div>

          <div className="absolute bottom-10 flex w-full justify-between px-10">
            <div className="text-primary-foreground flex-1 space-y-1">
              <h2 className="font-medium">Manage your fleet with confidence</h2>
              <p className="text-sm">
                Track vehicle availability, maintenance schedules. Keep every car on the road and
                every booking running smoothly.
              </p>
            </div>
            <Separator orientation="vertical" className="mx-3 h-auto!" />
            <div className="text-primary-foreground flex-1 space-y-1">
              <h2 className="font-medium">Need assistance?</h2>
              <p className="text-sm">
                Browse our documentation or reach out to support anytime. We&apos;re here to help
                your rental service scale.
              </p>
            </div>
          </div>
        </div>
        <div className="relative order-1 flex h-full">{children}</div>
      </div>
    </main>
  )
}
