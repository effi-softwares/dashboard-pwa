import { NextResponse } from "next/server"

import { and, desc, eq, ilike, or, sql } from "drizzle-orm"
import { z } from "zod"

import { db } from "@/db/db"
import {
  fuelTypeEnum,
  transmissionEnum,
  vehicleStatusTable,
  vehicleTable,
} from "@/db/schemas/vehicle-schema"
import { requireAuth } from "@/lib/auth/get-session"
import { VehicleStatusEnum } from "@/zod/vehicle-form"

const querySchema = z.object({
  page: z.string().optional(),
  pageSize: z.string().optional(),
  search: z.string().optional(),
  status: VehicleStatusEnum.optional(),
  vehicleType: z.string().optional(),
  fuelType: z.enum(fuelTypeEnum.enumValues).optional(),
  transmission: z.enum(transmissionEnum.enumValues).optional(),
  sortBy: z
    .enum(["licensePlate", "brand", "model", "year", "statusUpdatedAt", "createdAt"])
    .optional(),
  sortDir: z.enum(["asc", "desc"]).optional(),
})

export async function GET(request: Request) {
  try {
    await requireAuth()

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
        vehicleId: vehicleStatusTable.vehicleId,
        status: vehicleStatusTable.status,
        statusUpdatedAt: vehicleStatusTable.statusUpdatedAt,
        note: vehicleStatusTable.note,
        rowNumber:
          sql<number>`row_number() over (partition by ${vehicleStatusTable.vehicleId} order by ${vehicleStatusTable.statusUpdatedAt} desc)`.as(
            "rowNumber",
          ),
      })
      .from(vehicleStatusTable)
      .as("latest_status")

    const joinCondition = and(
      eq(vehicleTable.id, latestStatus.vehicleId),
      eq(latestStatus.rowNumber, 1),
    )

    const filters = [] as any[]

    if (parsed.search) {
      const term = `%${parsed.search}%`
      filters.push(
        or(
          ilike(vehicleTable.brand, term),
          ilike(vehicleTable.model, term),
          ilike(vehicleTable.licensePlate, term),
          ilike(vehicleTable.vin, term),
        ),
      )
    }

    if (parsed.vehicleType) {
      filters.push(ilike(vehicleTable.vehicleType, `%${parsed.vehicleType}%`))
    }
    if (parsed.fuelType) {
      filters.push(eq(vehicleTable.fuelType, parsed.fuelType))
    }
    if (parsed.transmission) {
      filters.push(eq(vehicleTable.transmission, parsed.transmission))
    }
    if (parsed.status) {
      filters.push(eq((latestStatus as any).status, parsed.status))
    }

    const whereClause = filters.length ? and(...filters) : undefined

    const [totalRow] = await dbClient
      .select({ count: sql<number>`count(*)` })
      .from(vehicleTable)
      .leftJoin(latestStatus, joinCondition)
      .where(whereClause)

    const total = Number(totalRow?.count ?? 0)
    const totalPages = Math.max(Math.ceil(total / pageSize), 1)

    const direction = parsed.sortDir === "asc" ? "asc" : "desc"

    const orderBy = (() => {
      switch (parsed.sortBy) {
        case "licensePlate":
          return direction === "asc" ? vehicleTable.licensePlate : desc(vehicleTable.licensePlate)
        case "brand":
          return direction === "asc" ? vehicleTable.brand : desc(vehicleTable.brand)
        case "model":
          return direction === "asc" ? vehicleTable.model : desc(vehicleTable.model)
        case "year":
          return direction === "asc" ? vehicleTable.year : desc(vehicleTable.year)
        case "statusUpdatedAt":
          return direction === "asc"
            ? (latestStatus as any).statusUpdatedAt
            : desc((latestStatus as any).statusUpdatedAt)
        default:
          return direction === "asc" ? vehicleTable.createdAt : desc(vehicleTable.createdAt)
      }
    })()

    const rows = await dbClient
      .select({
        id: vehicleTable.id,
        brand: vehicleTable.brand,
        model: vehicleTable.model,
        vehicleType: vehicleTable.vehicleType,
        year: vehicleTable.year,
        licensePlate: vehicleTable.licensePlate,
        vin: vehicleTable.vin,
        transmission: vehicleTable.transmission,
        fuelType: vehicleTable.fuelType,
        createdAt: vehicleTable.createdAt,
        updatedAt: vehicleTable.updatedAt,
        status: latestStatus.status,
        statusUpdatedAt: latestStatus.statusUpdatedAt,
        statusNote: latestStatus.note,
      })
      .from(vehicleTable)
      .leftJoin(latestStatus, joinCondition)
      .where(whereClause)
      .orderBy(orderBy)
      .limit(pageSize)
      .offset(offset)

    const data = rows.map(row => ({
      ...row,
      status: row.status ?? "Available",
      statusUpdatedAt: row.statusUpdatedAt ?? row.updatedAt?.toISOString() ?? null,
      statusNote: row.statusNote ?? null,
      createdAt: row.createdAt?.toISOString() ?? null,
      updatedAt: row.updatedAt?.toISOString() ?? null,
    }))

    return NextResponse.json({
      data,
      page,
      pageSize,
      total,
      totalPages,
    })
  } catch (error) {
    console.error("Error fetching vehicles", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid query", details: error.issues }, { status: 400 })
    }
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.json({ error: "Failed to fetch vehicles" }, { status: 500 })
  }
}
