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
