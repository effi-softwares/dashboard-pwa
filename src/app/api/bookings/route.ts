import { NextResponse } from "next/server"

import { and, desc, eq, ilike, or, sql } from "drizzle-orm"
import { z } from "zod"

import { db } from "@/db/db"
import { bookingsTable, bookingStatusTable, customersTable, vehicleTable } from "@/db/schemas"
import { bookingFormSchema } from "@/features/booking/schemas/booking-form.schema"
import { requireAuth } from "@/lib/auth/get-session"

const querySchema = z.object({
  page: z.string().optional(),
  pageSize: z.string().optional(),
  search: z.string().optional(),
  status: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  sortBy: z
    .enum(["bookingStartDate", "bookingEndDate", "totalAmount", "createdAt", "customerName"])
    .optional(),
  sortDir: z.enum(["asc", "desc"]).optional(),
})

export async function GET(request: Request) {
  try {
    const authUser = await requireAuth()

    const url = new URL(request.url)
    const parsed = querySchema.parse(Object.fromEntries(url.searchParams))

    const parsedPage = Number(parsed.page ?? "1")
    const page = Number.isFinite(parsedPage) && parsedPage > 0 ? Math.floor(parsedPage) : 1

    const parsedPageSize = Number(parsed.pageSize ?? "20")
    const rawPageSize =
      Number.isFinite(parsedPageSize) && parsedPageSize > 0 ? Math.floor(parsedPageSize) : 20
    const pageSize = Math.min(rawPageSize, 100)
    const offset = (page - 1) * pageSize

    const dbClient = db()

    const latestStatus = dbClient
      .select({
        bookingId: bookingStatusTable.bookingId,
        status: bookingStatusTable.status,
        statusUpdatedAt: bookingStatusTable.statusUpdatedAt,
        rowNumber:
          sql<number>`row_number() over (partition by ${bookingStatusTable.bookingId} order by ${bookingStatusTable.statusUpdatedAt} desc)`.as(
            "rowNumber",
          ),
      })
      .from(bookingStatusTable)
      .as("latest_status")

    const filters = []

    if (parsed.search) {
      const term = `%${parsed.search}%`
      filters.push(
        or(
          ilike(bookingsTable.customerName, term),
          ilike(bookingsTable.customerEmail, term),
          ilike(bookingsTable.customerPhone, term),
          ilike(vehicleTable.brand, term),
          ilike(vehicleTable.model, term),
          ilike(vehicleTable.licensePlate, term),
        ),
      )
    }

    if (parsed.status) {
      filters.push(eq(latestStatus.status, parsed.status))
    }

    if (parsed.startDate) {
      const startDate = new Date(parsed.startDate)
      filters.push(sql`${bookingsTable.bookingStartDate} >= ${startDate}`)
    }

    if (parsed.endDate) {
      const endDate = new Date(parsed.endDate)
      filters.push(sql`${bookingsTable.bookingEndDate} <= ${endDate}`)
    }

    const whereClause = filters.length ? and(...filters) : undefined

    const [totalRow] = await dbClient
      .select({ count: sql<number>`count(*)` })
      .from(bookingsTable)
      .where(whereClause)

    const total = totalRow?.count ?? 0
    const totalPages = Math.ceil(total / pageSize)

    const sortByColumn = parsed.sortBy ?? "createdAt"
    const sortOrder = parsed.sortDir === "asc" ? "asc" : "desc"

    const sortMap: Record<string, any> = {
      bookingStartDate: bookingsTable.bookingStartDate,
      bookingEndDate: bookingsTable.bookingEndDate,
      totalAmount: bookingsTable.totalAmount,
      createdAt: bookingsTable.createdAt,
      customerName: bookingsTable.customerName,
    }

    const orderByColumn = sortMap[sortByColumn] ?? bookingsTable.createdAt

    const joinCondition = and(
      eq(bookingsTable.id, latestStatus.bookingId),
      eq(latestStatus.rowNumber, 1),
    )

    const bookings = await dbClient
      .select({
        id: bookingsTable.id,
        vehicleId: bookingsTable.vehicleId,
        vehicleBrand: vehicleTable.brand,
        vehicleModel: vehicleTable.model,
        vehicleLicensePlate: vehicleTable.licensePlate,
        customerId: bookingsTable.customerId,
        customerName: bookingsTable.customerName,
        customerEmail: bookingsTable.customerEmail,
        bookingStartDate: bookingsTable.bookingStartDate,
        bookingEndDate: bookingsTable.bookingEndDate,
        status: latestStatus.status,
        statusUpdatedAt: latestStatus.statusUpdatedAt,
        totalAmount: bookingsTable.totalAmount,
      })
      .from(bookingsTable)
      .leftJoin(vehicleTable, eq(bookingsTable.vehicleId, vehicleTable.id))
      .leftJoin(latestStatus, joinCondition)
      .where(whereClause)
      .orderBy(sortOrder === "asc" ? sql`${orderByColumn} asc` : desc(orderByColumn))
      .limit(pageSize)
      .offset(offset)

    return NextResponse.json(
      {
        data: bookings,
        page,
        pageSize,
        total,
        totalPages,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[Bookings GET Error]", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: error.issues },
        { status: 400 },
      )
    }

    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const authUser = await requireAuth()

    const body = await request.json()
    const validatedData = bookingFormSchema.parse(body)

    const dbClient = db()

    const booking = await dbClient.transaction(async tx => {
      // Find an existing customer by email/phone/license
      const [existingCustomer] = await tx
        .select({ id: customersTable.id })
        .from(customersTable)
        .where(
          or(
            eq(customersTable.email, validatedData.customerEmail),
            eq(customersTable.phone, validatedData.customerPhone),
            eq(customersTable.driverLicenseNumber, validatedData.driverLicenseNumber),
          ),
        )
        .limit(1)

      let customerPersonId: string | null = existingCustomer?.id ?? null

      if (customerPersonId) {
        await tx
          .update(customersTable)
          .set({
            lastRentalDate: validatedData.bookingStartDate,
            totalRentals: sql`${customersTable.totalRentals} + 1`,
          })
          .where(eq(customersTable.id, customerPersonId))
      } else {
        const [newCustomer] = await tx
          .insert(customersTable)
          .values({
            name: validatedData.customerName,
            email: validatedData.customerEmail,
            phone: validatedData.customerPhone,
            driverLicenseNumber: validatedData.driverLicenseNumber,
            lastRentalDate: validatedData.bookingStartDate,
            totalRentals: 1,
          })
          .returning({ id: customersTable.id })

        customerPersonId = newCustomer.id
      }

      const [createdBooking] = await tx
        .insert(bookingsTable)
        .values({
          vehicleId: validatedData.vehicleId,
          customerId: authUser.id,
          customerPersonId,
          customerName: validatedData.customerName,
          customerEmail: validatedData.customerEmail,
          customerPhone: validatedData.customerPhone,
          driverLicenseNumber: validatedData.driverLicenseNumber,
          bookingStartDate: validatedData.bookingStartDate,
          bookingEndDate: validatedData.bookingEndDate,
          paymentMethod: validatedData.paymentMethod,
          securityDepositAmount: validatedData.securityDepositAmount,
          dailyRate: validatedData.dailyRate,
          totalDays: validatedData.totalDays,
          totalAmount: validatedData.totalAmount,
          notes: validatedData.notes,
        })
        .returning()

      await tx.insert(bookingStatusTable).values({
        bookingId: createdBooking.id,
        status: "Pending",
        changedBy: authUser.id,
        note: "Booking created",
      })

      return createdBooking
    })

    return NextResponse.json(
      {
        id: booking.id,
        message: "Booking created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[Bookings POST Error]", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid booking data", details: error.issues },
        { status: 400 },
      )
    }

    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }
}
