"use client"

import { useState } from "react"

import { Input } from "@/components/ui/input"

interface Vehicle {
  id: string
  model: string
  brand: string
  number: string
  color: string
}

const vehicles: Vehicle[] = [
  {
    id: "1",
    model: "Aqua",
    brand: "Toyota",
    number: "ABC-1234",
    color: "#1E90FF",
  },
  {
    id: "2",
    model: "Civic",
    brand: "Honda",
    number: "XYZ-5678",
    color: "#FF4500",
  },
  {
    id: "3",
    model: "Model 3",
    brand: "Tesla",
    number: "GHD-3490",
    color: "#2ECC71",
  },
  {
    id: "4",
    model: "Swift",
    brand: "Suzuki",
    number: "JKS-9982",
    color: "#9B59B6",
  },
  {
    id: "5",
    model: "City",
    brand: "Honda",
    number: "QWE-5543",
    color: "#E67E22",
  },
  {
    id: "6",
    model: "Corolla",
    brand: "Toyota",
    number: "LKJ-7734",
    color: "#34495E",
  },
  {
    id: "7",
    model: "Vitz",
    brand: "Toyota",
    number: "TYU-8821",
    color: "#F1C40F",
  },
  {
    id: "8",
    model: "Prius",
    brand: "Toyota",
    number: "PRU-4411",
    color: "#1ABC9C",
  },
  {
    id: "9",
    model: "Celerio",
    brand: "Suzuki",
    number: "CEL-2278",
    color: "#E74C3C",
  },
  {
    id: "10",
    model: "Alto",
    brand: "Suzuki",
    number: "ALT-9023",
    color: "#8E44AD",
  },
]

export default function Vehicles() {
  const [query, setQuery] = useState("")

  const filtered = vehicles.filter(
    v =>
      v.model.toLowerCase().includes(query.toLowerCase()) ||
      v.brand.toLowerCase().includes(query.toLowerCase()) ||
      v.number.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <div className="p-4 space-y-4 mx-auto">
      <h1 className="text-xl font-semibold">Your vehicles</h1>
      <Input
        placeholder="Search vehicles..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="text-sm"
      />

      <div className="space-y-3">
        {filtered.map(v => (
          <div key={v.id} className="border rounded-lg hover:shadow-md transition-shadow">
            <div className="flex items-center p-3 gap-3">
              <div className="w-16 h-16 rounded-md" style={{ backgroundColor: v.color }} />
              <div className="">
                <p className="text-sm font-medium">{v.model}</p>
                <p className="text-xs text-gray-500">{v.brand}</p>
                <p className="text-xs font-semibold mt-1">{v.number}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
