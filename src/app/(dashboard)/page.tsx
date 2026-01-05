import { AlertsSection } from "./_components/alerts-section"
import { AvailableVehiclesCarousel } from "./_components/available-vehicles-carousel"
import { DashboardActions } from "./_components/dashboard-actions"
import { DashboardStats } from "./_components/dashboard-stats"
import { FleetHealth } from "./_components/fleet-health"
import { FleetMapPreview } from "./_components/fleet-map-preview"
import { MetricsMatrix } from "./_components/metrics-matrix"
import { QuickRentalForm } from "./_components/quick-rental-form"
import { RecentActivity } from "./_components/recent-activity"
import { ReturningVehicles } from "./_components/returning-vehicles"
import { RevenueChart } from "./_components/revenue-chart"

export default async function Home() {
  return (
    <div className="p-2 space-y-2 mx-auto bg-background min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-xs text-muted-foreground">Manage your fleet efficiently</p>
        </div>
        <DashboardActions />
      </div>

      <DashboardStats />

      <MetricsMatrix />

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-2 auto-rows-[minmax(100px,auto)]">
        {/* Recent Activity - Tall Left */}
        <div className="col-span-12 lg:col-span-4 lg:row-span-2">
          <RecentActivity />
        </div>

        {/* Quick Rental Form - Top Right */}
        <div className="col-span-6 lg:col-span-2">
          <QuickRentalForm />
        </div>

        {/* Fleet Health - Top Right */}
        <div className="col-span-6 lg:col-span-2">
          <FleetHealth />
        </div>

        {/* Revenue Chart - Wide Top Right */}
        <div className="col-span-12 lg:col-span-4 lg:row-span-1">
          <RevenueChart />
        </div>

        {/* Available Vehicles - Medium Right */}
        <div className="col-span-12 lg:col-span-4 lg:row-span-2">
          <AvailableVehiclesCarousel />
        </div>

        {/* Alerts - Small Square */}
        <div className="col-span-6 lg:col-span-2">
          <AlertsSection />
        </div>

        {/* Map - Small Square */}
        <div className="col-span-6 lg:col-span-2">
          <FleetMapPreview />
        </div>

        {/* Returning Vehicles - Wide Bottom */}
        <div className="col-span-12 lg:col-span-8">
          <ReturningVehicles />
        </div>
      </div>
    </div>
  )
}
