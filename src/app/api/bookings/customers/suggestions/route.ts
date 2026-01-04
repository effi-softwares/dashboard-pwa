import { NextResponse } from "next/server"

import { ilike, or } from "drizzle-orm"
import { z } from "zod"

import { db } from "@/db/db"
import { customersTable } from "@/db/schemas"
import { requireAuth } from "@/lib/auth/get-session"

const querySchema = z.object({
  search: z.string().min(2, "Search term must be at least 2 characters"),
  limit: z.string().optional(),
})

export async function GET(request: Request) {
  try {
    await requireAuth()

    const url = new URL(request.url)
    const parsed = querySchema.parse({
      search: url.searchParams.get("search"),
      limit: url.searchParams.get("limit"),
    })

    const parsedLimit = Number(parsed.limit ?? "5")
    const limit = Number.isFinite(parsedLimit) && parsedLimit > 0 ? Math.floor(parsedLimit) : 5
    const maxLimit = Math.min(limit, 20)

    const dbClient = db()
    const searchTerm = `%${parsed.search}%`

    const customers = await dbClient
      .select({
        id: customersTable.id,
        name: customersTable.name,
        email: customersTable.email,
        phone: customersTable.phone,
        driverLicenseNumber: customersTable.driverLicenseNumber,
        lastRentalDate: customersTable.lastRentalDate,
        totalRentals: customersTable.totalRentals,
      })
      .from(customersTable)
      .where(
        or(
          ilike(customersTable.name, searchTerm),
          ilike(customersTable.email, searchTerm),
          ilike(customersTable.phone, searchTerm),
          ilike(customersTable.driverLicenseNumber, searchTerm),
        ),
      )
      .limit(maxLimit)

    return NextResponse.json(
      {
        data: customers,
        total: customers.length,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[Customer Suggestions GET Error]", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid search parameters", details: error.issues },
        { status: 400 },
      )
    }

    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({ error: "Failed to fetch customer suggestions" }, { status: 500 })
  }
}
