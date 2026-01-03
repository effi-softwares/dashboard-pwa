import { Battery, Droplet, Gauge, Hand, Leaf, Settings, Zap } from "lucide-react"

import { SegmentedToggleItem } from "@/components/segmented-toggle"

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

export const VEHICLE_COLORS = [
  { name: "BLACK", label: "Black", hex: "#000000", textColor: "#FFFFFF" },
  { name: "WHITE", label: "White", hex: "#FFFFFF", textColor: "#000000" },
  { name: "SILVER", label: "Silver", hex: "#C0C0C0", textColor: "#000000" },
  { name: "GREY", label: "Grey", hex: "#808080", textColor: "#FFFFFF" },
  { name: "BLUE", label: "Blue", hex: "#1F5FBF", textColor: "#FFFFFF" },
  { name: "RED", label: "Red", hex: "#C62828", textColor: "#FFFFFF" },
  { name: "GREEN", label: "Green", hex: "#2E7D32", textColor: "#FFFFFF" },
  { name: "BROWN", label: "Brown", hex: "#6D4C41", textColor: "#FFFFFF" },
  { name: "YELLOW", label: "Yellow", hex: "#F9A825", textColor: "#000000" },
  { name: "ORANGE", label: "Orange", hex: "#EF6C00", textColor: "#000000" },
  { name: "BEIGE", label: "Beige", hex: "#D7CCC8", textColor: "#000000" },
  { name: "GOLD", label: "Gold / Champagne", hex: "#C9B037", textColor: "#000000" },
]

export const VEHICLE_STATUSES = {
  AVAILABLE: "Available",
  RENTED: "Rented",
  MAINTENANCE: "Maintenance",
  RETIRED: "Retired",
  UNKNOWN: "Unknown",
} as const

export const IMAGE_ROLES = {
  FRONT: "front",
  BACK: "back",
  INTERIOR: "interior",
} as const

export const transmissionItems: SegmentedToggleItem[] = [
  {
    label: "Automatic",
    icon: Gauge,
    value: "Automatic",
    ariaLabel: "Select automatic transmission",
  },
  {
    label: "Manual",
    icon: Hand,
    value: "Manual",
    ariaLabel: "Select manual transmission",
  },
  {
    label: "Semi-Automatic",
    icon: Settings,
    value: "Semi-Automatic",
    ariaLabel: "Select semi-automatic transmission",
  },
]

export const fuelTypeItems: SegmentedToggleItem[] = [
  {
    label: "Petrol",
    icon: Droplet,
    value: "Petrol",
    ariaLabel: "Select petrol fuel type",
  },
  {
    label: "Diesel",
    icon: Droplet,
    value: "Diesel",
    ariaLabel: "Select diesel fuel type",
  },
  {
    label: "Electric",
    icon: Zap,
    value: "Electric",
    ariaLabel: "Select electric fuel type",
  },
  {
    label: "Hybrid",
    icon: Leaf,
    value: "Hybrid",
    ariaLabel: "Select hybrid fuel type",
  },
  {
    label: "Hydrogen",
    icon: Battery,
    value: "Hydrogen",
    ariaLabel: "Select hydrogen fuel type",
  },
]
