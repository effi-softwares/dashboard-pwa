import Link from "next/link"

import { Button } from "@/components/ui/button"
import { getSession } from "@/lib/auth/get-session"

import TestDrawer from "./test-drawer"

export default async function Home() {
  const session = await getSession()
  const isAdmin = session?.user.role === "admin"

  return (
    <div className="my-6 px-4 max-w-md mx-auto">
      <div className="text-center space-y-6">
        <h1 className="text-3xl font-bold">Welcome {session?.user.name}!</h1>
        <div className="flex gap-4 justify-center flex-wrap">
          <TestDrawer />
          <Button asChild size="lg">
            <Link href="/profile">Profile</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/organizations">Organizations</Link>
          </Button>
          {isAdmin && (
            <Button variant="outline" asChild size="lg">
              <Link href="/test">Admin Dashboard</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
