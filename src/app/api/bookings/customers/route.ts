import { NextResponse } from "next/server"

import { z } from "zod"

import { db } from "@/db/db"
import { customersTable } from "@/db/schemas"
import { requireAuth } from "@/lib/auth/get-session"

const createCustomerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  driverLicenseNumber: z.string().min(5, "Driver license number is required"),
})

export async function POST(request: Request) {
  try {
    await requireAuth()

    const body = await request.json()
    const validatedData = createCustomerSchema.parse(body)

    const dbClient = db()

    // Insert customer
    const [customer] = await dbClient
      .insert(customersTable)
      .values({
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        driverLicenseNumber: validatedData.driverLicenseNumber,
      })
      .returning()

    return NextResponse.json(customer, { status: 201 })
  } catch (error) {
    console.error("[Create Customer POST Error]", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid customer data", details: error.issues },
        { status: 400 },
      )
    }

    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({ error: "Failed to create customer" }, { status: 500 })
  }
}
