/**
 * Customer feature types
 */

export type CustomerSuggestion = {
  id: string
  name: string
  email: string
  phone: string
  driverLicenseNumber: string
  lastRentalDate: string | null
  totalRentals: number
}
